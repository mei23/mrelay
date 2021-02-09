export function attachContext<T>(object: T): T {
	if (object == null) return object;

	return Object.assign({
		'@context': [
			'https://www.w3.org/ns/activitystreams',
			'https://w3id.org/security/v1'
		]
	}, object);
}
