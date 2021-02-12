import { getJson } from '../misc/fetch';
import { IObject } from './types';

export default class Resolver {
	private history: Set<string>;

	constructor() {
		this.history = new Set();
	}

	public getHistory(): string[] {
		return Array.from(this.history);
	}

	public async resolve(value: string | IObject): Promise<IObject> {
		if (value == null) {
			throw new Error('resolvee is null or undefined');
		}

		if (typeof value !== 'string') {
			return value;
		}

		if (this.history.has(value)) {
			throw new Error('cannot resolve already resolved one');
		}

		this.history.add(value);

		const object = await getJson(value, 'application/activity+json, application/ld+json');

		if (object === null || (
			Array.isArray(object['@context']) ?
				!object['@context'].includes('https://www.w3.org/ns/activitystreams') :
				object['@context'] !== 'https://www.w3.org/ns/activitystreams'
		)) {
			throw {
				name: `InvalidResponse`,
				statusCode: 482,
				message: `Invalid @context`
			};
		}

		return object;
	}
}
