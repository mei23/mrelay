import * as Fastify from 'fastify'
import config from '../config';

const server = Fastify.fastify({
	logger: true,
	trustProxy: [
		'127.0.0.1', '::1'
	],
});

export default () => new Promise<void>((resolve, reject) => {
	server.listen(config.port, '0.0.0.0', (err, address) => {
		if (err) {
			reject(err);
		}
		resolve();
	});
});