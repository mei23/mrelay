import config from '../../config';
import { createPublicKey } from 'crypto';
import { LocalActor } from '../../models/entities/local-actor';

export function renderKey(user: LocalActor){
	return {
		id: `${config.url}/users/${user.id}#main-key`,
		type: 'Key',
		owner: `${config.url}/users/${user.id}`,
		publicKeyPem: createPublicKey(user.publicKey).export({
			type: 'spki',
			format: 'pem'
		})
	};
}
