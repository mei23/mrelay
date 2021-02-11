import * as Fastify from 'fastify'
import { renderActor } from '../activitypub/renderer/actor';
import { attachContext } from '../activitypub/renderer';
import config from '../config';
import { renderOrderedCollection } from '../activitypub/renderer/ordered-collection';
import { getActor } from '../services/actor';

const server = Fastify.fastify({
	logger: true,
	trustProxy: [
		'127.0.0.0/8', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16',
		'::1'
	],
});

server.get('/actor', async (request, reply) => {
	const actor = await getActor();

	reply
		.code(200)
		.type('application/activity+json')
		.header('Cache-Control', 'public, max-age=180')
		.send(attachContext(await renderActor(actor, `${config.url}/actor`)));
});

const replyEmptyCollection = async (request: Fastify.FastifyRequest, reply: Fastify.FastifyReply) => {
	reply
		.code(200)
		.type('application/activity+json')
		.header('Cache-Control', 'public, max-age=180')
		.send(attachContext(await renderOrderedCollection(`${config.url}/actor/following`)));
}

server.get('/actor/followers', replyEmptyCollection);
server.get('/actor/following', replyEmptyCollection);
server.get('/actor/outbox', replyEmptyCollection);

export default (): Promise<void> => new Promise<void>((resolve, reject) => {
	server.listen(config.port, '0.0.0.0', (err, address) => {
		if (err) {
			reject(err);
		}
		resolve();
	});
});