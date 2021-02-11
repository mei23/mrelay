import { genRsaKeyPair } from '../misc/gen-key-pair';
import { LocalActor } from '../models/entities/local-actor';
import { getConnection } from 'typeorm';
import { genId } from '../misc/gen-id';

let cached: LocalActor;

export async function getActor() {
	if (cached) return cached;
	cached = await getLocalActor('actor');
	return cached;
}

async function getLocalActor(username: string) {
	let actor!: LocalActor;

	await getConnection().transaction(async transactionalEntityManager => {
		const exist = await transactionalEntityManager.findOne(LocalActor, {
			usernameLower: username.toLowerCase()
		});

		if (exist) {
			actor = exist;
			return;
		}

		const keyPair = await genRsaKeyPair();

		actor = await transactionalEntityManager.insert(LocalActor, {
			id: genId(),
			username: username,
			usernameLower: username.toLowerCase(),
			publicKey: keyPair.publicKey,
			privateKey: keyPair.privateKey,
		}).then(x => transactionalEntityManager.findOneOrFail(LocalActor, x.identifiers[0]));
	});

	return actor;
}
