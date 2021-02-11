import Xev from 'xev';

import Logger from '../services/logger';
import { program } from '../argv';
import { masterMain } from './master';
import { workerMain } from './worker';

// for typeorm
import 'reflect-metadata';
import { getActor } from '../services/actor';

const logger = new Logger('core', 'cyan');
export const bootLogger = logger.createSubLogger('boot', 'magenta', false);
const ev = new Xev();

/**
 * Init process
 */
export default async function() {
	const config = await masterMain();
	ev.mount();
	await workerMain();

	bootLogger.succ(`Now listening on port ${config.port} on ${config.url}`, null, true);


	// X
	const a = await getActor();
	console.log(JSON.stringify(a));

	// for test
	if (process.send) {
		process.send('ok');
	}
}

//#region Events
// Display detail of unhandled promise rejection
if (!program.quiet) {
	process.on('unhandledRejection', console.dir);
}

// Display detail of uncaught exception
process.on('uncaughtException', err => {
	logger.error(err);
});

// Dying away...
process.on('exit', code => {
	logger.info(`The process is going to exit with code ${code}`);
});
//#endregion
