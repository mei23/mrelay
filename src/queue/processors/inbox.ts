import * as Bull from 'bull';
import * as httpSignature from 'http-signature';
//import { IRemoteUser } from '../../models/user';
//import perform from '../../remote/activitypub/perform';
//import { resolvePerson } from '../../remote/activitypub/models/person';
import Logger from '../../services/logger';
//import { getApId } from '../../remote/activitypub/type';
import { InboxJobData } from '../type';
//import DbResolver from '../../remote/activitypub/db-resolver';
import { inspect } from 'util';
//import { extractApHost } from '../../misc/convert-host';
import config from '../../config';

const logger = new Logger('inbox');

// ユーザーのinboxにアクティビティが届いた時の処理
export default async (job: Bull.Job<InboxJobData>): Promise<string> => {
	const signature = job.data.signature;
	const activity = job.data.activity;

	//#region Log
	logger.debug(inspect(job.data));
	//#endregion

	return 'Unimplemented';
	/*
	const dbResolver = new DbResolver();

	//#region resolve http-signature signer
	let user: IRemoteUser | null;

	// keyIdを元にDBから取得
	user = await dbResolver.getRemoteUserFromKeyId(signature.keyId);

	// || activity.actorを元にDBから取得 || activity.actorを元にリモートから取得
	if (user == null) {
		try {
			user = await resolvePerson(getApId(activity.actor)) as IRemoteUser;
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
	const httpSignatureValidated = httpSignature.verifySignature(signature, user.publicKey.publicKeyPem);

	// また、http-signatureのsignerは、activity.actorと一致する必要がある
	if (!httpSignatureValidated || user.uri !== activity.actor) {
		return `skip: http-signature verification failed and ${config.ignoreApForwarded ? 'ignoreApForwarded' : 'no LD-Signature'}. keyId=${signature.keyId}`;
	}

	// activity.idがあればホストが署名者のホストであることを確認する
	if (typeof activity.id === 'string') {
		const signerHost = extractApHost(user.uri);
		const activityIdHost = extractApHost(activity.id);
		if (signerHost !== activityIdHost) {
			return `skip: signerHost(${signerHost}) !== activity.id host(${activityIdHost}`;
		}
	}

	// アクティビティを処理
	return (await perform(user, activity)) || 'ok';
	*/
};
