import { LocalActor } from '../../models/entities/local-actor';
import { createPublicKey } from 'crypto';
import { IActor } from '../type';

export async function renderActor(user: LocalActor, id: string): Promise<IActor> {
	const publicKey = {
		id: `${id}#main-key`,
		owner: `${id}`,
		publicKeyPem: createPublicKey(user.publicKey).export({
			type: 'spki',
			format: 'pem'
		}) as string
	}

	const actor = {
		type: 'Group' as const,
		id,
		preferredUsername: user.username,
		inbox: `${id}/inbox`,
		outbox: `${id}/outbox`,
		followers: `${id}/followers`,
		following: `${id}/following`,
		publicKey
	};

	return actor;
}
