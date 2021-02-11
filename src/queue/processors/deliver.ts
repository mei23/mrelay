import * as Bull from 'bull';
//import request from '../../remote/activitypub/request';
//import Logger from '../../services/logger';
import { DeliverJobData } from '../type';

//const logger = new Logger('deliver');

//let latest: string = null;

export default async (job: Bull.Job<DeliverJobData>): Promise<string> => {
	return '...';
	/*
	const { protocol, host } = new URL(job.data.to);

	if (protocol !== 'https:') return 'skip (invalid protocol)';

	try {
		if (latest !== (latest = JSON.stringify(job.data.content, null, 2))) {
			logger.debug(`delivering ${latest}`);
		}

		await request(job.data.user, job.data.to, job.data.content);

		return 'Success';
	} catch (res) {
		// Update stats
		if (res != null && res.hasOwnProperty('statusCode')) {
			// 4xx
			if (res.statusCode >= 400 && res.statusCode < 500) {
				// Mastodonから返ってくる401がどうもpermanent errorじゃなさそう
				if (res.statusCode === 401) {
					throw `${res.statusCode} ${res.statusMessage}`;
				}

				// sharedInboxで410を返されたら閉鎖済みとマークする
				if (res.statusCode === 410 && job.data.inboxInfo?.origin === 'sharedInbox') {
					logger.info(`${host}: MarkedAsClosed (sharedInbox:410)`);
					registerOrFetchInstanceDoc(host).then(i => {
						Instance.update({ _id: i._id }, {
							$set: {
								isMarkedAsClosed: true
							}
						});
					});
				}

				// HTTPステータスコード4xxはクライアントエラーであり、それはつまり
				// 何回再送しても成功することはないということなのでエラーにはしないでおく
				return `${res.statusCode} ${res.statusMessage}`;
			}

			// 5xx etc.
			throw `${res.statusCode} ${res.statusMessage}`;
		} else {
			// DNS error, socket error, timeout ...
			throw res;
		}
	}
	*/
};
