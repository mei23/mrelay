import * as Fastify from 'fastify'
import { renderActor } from '../activitypub/renderer/actor';
import config from '../config';
import { LocalActors } from '../models';

const server = Fastify.fastify({
	logger: true,
	trustProxy: [
		'127.0.0.1', '::1'
	],
});

server.get('/users/:id', async (request, reply) => {
	const actor = await LocalActors.findOne({
		id: (request.params as any).id
	});

	if (actor == null) {
		reply.code(404).send('Not Found');
		return;
	}

	reply
		.code(200)
		.type('application/activity+json')
		.header('Cache-Control', 'public, max-age=180')
		.send(await renderActor(actor));
});

export default () => new Promise<void>((resolve, reject) => {
	server.listen(config.port, '0.0.0.0', (err, address) => {
		if (err) {
			reject(err);
		}
		resolve();
	});
});