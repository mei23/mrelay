import * as Queue from 'bull';
import * as httpSignature from 'http-signature';
import config from '../config';
import processDeliver from './processors/deliver';
import { processInbox } from './processors/inbox';
import { queueLogger } from './logger';
import { getJobInfo } from './get-job-info';
import { DeliverJobData, InboxJobData } from './type';
import { SignedActivity } from '../activitypub/types';

function initializeQueue<T>(name: string, limitPerSec = -1) {
	return new Queue<T>(name, config.redis != null ? {
		redis: {
			port: config.redis.port,
			host: config.redis.host,
			password: config.redis.pass,
			db: config.redis.db || 0,
		},
		prefix: config.redis.prefix ? `${config.redis.prefix}:queue` : 'queue',
		limiter: limitPerSec > 0 ? {
			max: limitPerSec,
			duration: 1000
		} : undefined
	} : undefined);
}

export const deliverQueue = initializeQueue<DeliverJobData>('deliver', config.deliverJobPerSec || 2048);
export const inboxQueue = initializeQueue<InboxJobData>('inbox', config.inboxJobPerSec || 32);

const deliverLogger = queueLogger.createSubLogger('deliver');
const inboxLogger = queueLogger.createSubLogger('inbox');

let deliverDeltaCounts = 0;
let inboxDeltaCounts = 0;

deliverQueue
	.on('waiting', (jobId) => {
		deliverDeltaCounts++;
		deliverLogger.debug(`waiting id=${jobId}`);
	})
	.on('active', (job) => deliverLogger.info(`active ${getJobInfo(job, true)} to=${job.data.to}`))
	.on('completed', (job, result) => deliverLogger.info(`completed(${result}) ${getJobInfo(job, true)} to=${job.data.to}`))
	.on('failed', (job, err) => deliverLogger.warn(`failed(${err}) ${getJobInfo(job)} to=${job.data.to}`))
	.on('error', (error) => deliverLogger.error(`error ${error}`))
	.on('stalled', (job) => deliverLogger.warn(`stalled ${getJobInfo(job)} to=${job.data.to}`));

inboxQueue
	.on('waiting', (jobId) => {
		inboxDeltaCounts++;
		inboxLogger.debug(`waiting id=${jobId}`);
	})
	.on('active', (job) => inboxLogger.info(`active ${getJobInfo(job, true)} activity=${job.data.activity ? job.data.activity.id : 'none'}`))
	.on('completed', (job, result) => inboxLogger.info(`completed(${result}) ${getJobInfo(job, true)} activity=${job.data.activity ? job.data.activity.id : 'none'}`))
	.on('failed', (job, err) => inboxLogger.warn(`failed(${err}) ${getJobInfo(job)} activity=${job.data.activity ? job.data.activity.id : 'none'}`))
	.on('error', (error) => inboxLogger.error(`error ${error}`))
	.on('stalled', (job) => inboxLogger.warn(`stalled ${getJobInfo(job)} activity=${job.data.activity ? job.data.activity.id : 'none'}`));

/**
 * Queue deliver job
 * @param content Activity
 * @param to URL to deliver
 */
export function deliver(content: SignedActivity, to: string) {
	const attempts = config.deliverJobMaxAttempts || 12;

	if (content == null) return null;

	const data = {
		content,
		to,
	};

	return deliverQueue.add(data, {
		attempts,
		backoff: {
			type: 'exponential',
			delay: 60 * 1000
		},
		removeOnComplete: true,
		removeOnFail: true
	});
}

/**
 * Queue inbox job
 * @param activity Activity
 * @param signature Signature
 */
export function createInboxJob(activity: any, signature: httpSignature.IParsedSignature) {
	const data = {
		activity,
		signature,
	};

	return inboxQueue.add(data, {
		attempts: config.inboxJobMaxAttempts || 8,
		backoff: {
			type: 'exponential',
			delay: 60 * 1000
		},
		removeOnComplete: true,
		removeOnFail: true
	});
}

export default function() {
	deliverQueue.process(config.deliverJobConcurrency || 1024, processDeliver);
	inboxQueue.process(config.inboxJobConcurrency || 1024, processInbox);
}

export function destroy(domain?: string) {
	if (domain == null || domain === 'deliver') {
		deliverQueue.once('cleaned', (jobs, status) => {
			deliverLogger.succ(`Cleaned ${jobs.length} ${status} jobs`);
		});
		deliverQueue.clean(0, 'delayed');
	}

	if (domain == null || domain === 'inbox') {
		inboxQueue.once('cleaned', (jobs, status) => {
			inboxLogger.succ(`Cleaned ${jobs.length} ${status} jobs`);
		});
		inboxQueue.clean(0, 'delayed');
	}
}
