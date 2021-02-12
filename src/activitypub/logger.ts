import Logger from '../services/logger';

const logger = new Logger('core', 'cyan');
export const apLogger = logger.createSubLogger('ap', 'magenta');
