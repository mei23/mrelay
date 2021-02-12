//import * as promiseLimit from 'promise-limit';

import Resolver from './resolver';
import { apLogger } from './logger';
import { RemoteActor } from '../models/entities/remote-actor';
import { RemoteActors } from '../models';
import { extractId, extractIdNullable, IActor, IObject, IOrderedCollection, isActor, Link } from './types';
import { genId } from '../misc/gen-id';
import { toPuny } from '../misc/convert-host';

const logger = apLogger;

interface IAcceptableActor extends IActor {
	id: string;
	preferredUsername: string;
	inbox: IOrderedCollection | Link;
	publicKey: {
		publicKeyPem: string;
	};
}

function toAcceptableActor(x: IObject, uri: string): IAcceptableActor {
	if (!isActor(x)) {
		throw new Error(`invalid actor type '${x.type}'`);
	}

	if (typeof x.id !== 'string') {
		throw new Error('invalid actor: id is not a string');
	}

	if (typeof x.preferredUsername !== 'string') {
		throw new Error('invalid actor: preferredUsername is not a string');
	}

	if (!x.inbox) {
		throw new Error('invalid actor: no inbox');
	}

	if (typeof x.publicKey?.publicKeyPem !== 'string') {
		throw new Error('invalid actor: publicKey.publicKeyPem is not a string');
	}

	const expectHost = toPuny(new URL(uri).hostname.toLowerCase());

	const idHost = toPuny(new URL(x.id).hostname.toLowerCase());
	if (idHost !== expectHost) {
		throw new Error('invalid actor: id has different host');
	}

	return x as IAcceptableActor;
}

/**
 * Actorをフェッチします。
 *
 * 対象のActorが登録されていればそれを返します。
 */
export async function fetchActor(uri: string): Promise<RemoteActor | null> {
	if (typeof uri !== 'string') throw new Error('uri is not string');

	//#region このサーバーに既に登録されていたらそれを返す
	const exist = await RemoteActors.findOne({ uri });

	if (exist) {
		return exist;
	}
	//#endregion

	return null;
}

/**
 * Actorを作成します。
 */
export async function createActor(uri: string, resolver?: Resolver): Promise<RemoteActor> {
	if (typeof uri !== 'string') throw new Error('uri is not string');

	if (resolver == null) resolver = new Resolver();

	const object = await resolver.resolve(uri);

	const actor = toAcceptableActor(object, uri);

	logger.info(`Creating the Actor: ${actor.id}`);

	const host = toPuny(new URL(extractId(object.id)).hostname);

	// Create user
	const now = new Date();

	const user: RemoteActor = await RemoteActors.insert({
		id: genId(),
		createdAt: now,
		updatedAt: now,
		lastFetchedAt: now,
		username: actor.preferredUsername,
		usernameLower: actor.preferredUsername.toLowerCase(),
		host,
		inbox: extractId(actor.inbox),
		sharedInbox: extractIdNullable(actor.endpoints?.sharedInbox),
		uri: actor.id,
		publicKey: actor.publicKey.publicKeyPem
	}).then(x => RemoteActors.findOneOrFail(x.identifiers[0]));

	return user;
}

/**
 * Actorの情報を更新します。
 * Misskeyに対象のActorが登録されていなければ無視します。
 * @param uri URI of Actor
 * @param resolver Resolver
 * @param hint Hint of Actor object (この値が正当なActorの場合、Remote resolveをせずに更新に利用します)
 */
export async function updateActor(uri: string, resolver?: Resolver | null): Promise<void> {
	if (typeof uri !== 'string') throw new Error('uri is not string');

	//#region このサーバーに既に登録されているか
	const exist = await RemoteActors.findOne({ uri });

	if (exist == null) {
		return;
	}
	//#endregion

	if (resolver == null) resolver = new Resolver();

	const object = await resolver.resolve(uri);

	const actor = toAcceptableActor(object, uri);

	logger.info(`Updating the Actor: ${actor.id}`);

	const updates = {
		lastFetchedAt: new Date(),
		inbox: extractId(actor.inbox),
		sharedInbox: extractIdNullable(actor.endpoints?.sharedInbox),
		publicKey: actor.publicKey.publicKeyPem
	} as Partial<RemoteActor>;

	await RemoteActors.update(exist.id, updates);
}

/**
 * Actorを解決します。
 *
 * Misskeyに対象のActorが登録されていればそれを返し、そうでなければ
 * リモートサーバーからフェッチしてMisskeyに登録しそれを返します。
 */
export async function resolveActor(uri: string, resolver?: Resolver): Promise<RemoteActor> {
	if (typeof uri !== 'string') throw new Error('uri is not string');

	//#region このサーバーに既に登録されていたらそれを返す
	const exist = await fetchActor(uri);

	if (exist) {
		return exist;
	}
	//#endregion

	// リモートサーバーからフェッチしてきて登録
	return await createActor(uri, resolver);
}

