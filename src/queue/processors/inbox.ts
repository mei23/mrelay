import * as Bull from 'bull';
import * as httpSignature from 'http-signature';
import Logger from '../../services/logger';
import { InboxJobData } from '../type';
import { inspect } from 'util';
import { RemoteActor } from '../../models/entities/remote-actor';
import DbResolver from '../../activitypub/db-resolver';
import { extractIdNullable } from '../../activitypub/types';
import { toSingle } from '../../activitypub/quick';
import { resolveActor } from '../../activitypub/actor';
import { toPuny } from '../../misc/convert-host';

const logger = new Logger('inbox');

// ユーザーのinboxにアクティビティが届いた時の処理
export async function processInbox(job: Bull.Job<InboxJobData>): Promise<string> {
	const signature = job.data.signature;
	const activity = job.data.activity;

	//#region Log
	logger.debug(inspect(job.data));
	//#endregion

	// 取得は別にキャッシュして大丈夫

	const dbResolver = new DbResolver();

	//#region resolve http-signature signer
	let user: RemoteActor | null;

	// keyIdを元にDBから取得
	user = await dbResolver.getRemoteActor(signature.keyId);

	// || activity.actorを元にDBから取得 || activity.actorを元にリモートから取得
	if (user == null) {
		const actorUri = extractIdNullable(toSingle(activity.actor));
		if (actorUri == null) throw 'x';
	
		try {
			user = await resolveActor(actorUri);
		} catch (e) {
			// 対象が4xxならスキップ
			if (e.statusCode >= 400 && e.statusCode < 500) {
				return `skip: Ignored actor ${activity.actor} - ${e.statusCode}`;
			}
			throw `Error in actor ${activity.actor} - ${e.statusCode || e}`;
		}
	}

	// http-signature signer がわからなければ終了
	if (user == null) {
		throw new Error('failed to resolve http-signature signer');
	}
	//#endregion

	// http-signature signerのpublicKeyを元にhttp-signatureを検証
	const httpSignatureValidated = httpSignature.verifySignature(signature, user.publicKey);

	// また、http-signatureのsignerは、activity.actorと一致する必要がある
	if (!httpSignatureValidated || user.uri !== activity.actor) {
		return `skip: http-signature verification failed and no LD-Signature'}. keyId=${signature.keyId}`;
	}

	// activity.idがあればホストが署名者のホストであることを確認する
	if (typeof activity.id === 'string') {
		const signerHost = toPuny(user.uri);
		const activityIdHost = toPuny(activity.id);
		if (signerHost !== activityIdHost) {
			return `skip: signerHost(${signerHost}) !== activity.id host(${activityIdHost}`;
		}
	}

	// アクティビティを処理
	//return (await perform(user, activity)) || 'ok';

	return 'prs inbox';
}
