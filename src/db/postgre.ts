import { createConnection, Logger, getConnection } from 'typeorm';
import config from '../config';
import { dbLogger } from './logger';
import * as highlight from 'cli-highlight';

import { program } from '../argv';

const sqlLogger = dbLogger.createSubLogger('sql', 'white', false);

class MyCustomLogger implements Logger {
	private highlight(sql: string) {
		return highlight.highlight(sql, {
			language: 'sql', ignoreIllegals: true,
		});
	}

	public logQuery(query: string, parameters?: any[]) {
		if (program.verbose) {
			sqlLogger.info(this.highlight(query.substr(0, 128)));
		}
	}

	public logQueryError(error: string, query: string, parameters?: any[]) {
		sqlLogger.error(this.highlight(query));
	}

	public logQuerySlow(time: number, query: string, parameters?: any[]) {
		sqlLogger.warn(this.highlight(query));
	}

	public logSchemaBuild(message: string) {
		sqlLogger.info(message);
	}

	public log(message: string) {
		sqlLogger.info(message);
	}

	public logMigration(message: string) {
		sqlLogger.info(message);
	}
}

export const entities = [
];

export function initDb(justBorrow = false, sync = false, forceRecreate = false) {
	if (!forceRecreate) {
		try {
			const conn = getConnection();
			return Promise.resolve(conn);
		} catch (e) {}
	}

	const log = process.env.NODE_ENV != 'production';

	return createConnection({
		type: 'postgres',
		host: config.db.host,
		port: config.db.port,
		username: config.db.user,
		password: config.db.pass,
		database: config.db.db,
		extra: config.db.extra,
		synchronize: process.env.NODE_ENV === 'test' || sync,
		dropSchema: process.env.NODE_ENV === 'test' && !justBorrow,
		logging: log,
		logger: log ? new MyCustomLogger() : undefined,
		entities: entities
	});
}
