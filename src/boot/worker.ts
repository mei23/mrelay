import { initDb } from '../db/postgre';

/**
 * Init worker process
 */
export async function workerMain() {
	await initDb();

	// start server
	await require('../server').default();

	// start job queue
	require('../queue').default();
}
