import config from '../../config';
import { LocalActor } from '../../models/entities/local-actor';
import { renderKey } from './key';

export async function renderActor(user: LocalActor) {
	const id = `${config.url}/users/${user.id}`;

	const person = {
		type: 'Group',
		id,
		preferredUsername: user.username,
		inbox: `${id}/inbox`,
		outbox: `${id}/outbox`,
		followers: `${id}/followers`,
		following: `${id}/following`,
		publicKey: renderKey(user),
	} as any;

	return person;
}
