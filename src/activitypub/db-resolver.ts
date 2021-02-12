import { IObject, extractId } from './types';
import { RemoteActor } from '../models/entities/remote-actor';
import { RemoteActors } from '../models';

export default class DbResolver {
	constructor() {
	}

	public async getRemoteActor(value: string | IObject): Promise<RemoteActor | null> {
		const uri = extractId(value);
		const actor = await RemoteActors.findOne({
			uri
		});

		return actor || null;
	}
}