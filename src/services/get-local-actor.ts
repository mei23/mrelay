import { genRsaKeyPair } from '../misc/gen-key-pair';
import { LocalActor } from '../models/entities/local-actor';
import { getConnection } from 'typeorm';
import { genId } from '../misc/gen-id';

export async function getLocalActor(username: string) {
	let account!: LocalActor;

	// Start transaction
	await getConnection().transaction(async transactionalEntityManager => {
		const exist = await transactionalEntityManager.findOne(LocalActor, {
			usernameLower: username.toLowerCase()
		});

		if (exist) {
			account = exist;
			return;
		}

		const keyPair = await genRsaKeyPair();

		account = await transactionalEntityManager.insert(LocalActor, {
			id: genId(),
			username: username,
			usernameLower: username.toLowerCase(),
			publicKey: keyPair.publicKey,
			privateKey: keyPair.privateKey,
		}).then(x => transactionalEntityManager.findOneOrFail(LocalActor, x.identifiers[0]));
	});

	return account;
}
