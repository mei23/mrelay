import Xev from 'xev';

import Logger from '../services/logger';
import { program } from '../argv';
import { masterMain } from './master';
import { workerMain } from './worker';

// for typeorm
import 'reflect-metadata';

const logger = new Logger('core', 'cyan');
const ev = new Xev();

/**
 * Init process
 */
export default async function() {
	await masterMain();
	ev.mount();
	await workerMain();

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
