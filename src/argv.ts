import * as program from 'commander';
import config from './config';

program
	.version(config.version)
	.option('--quiet', 'Suppress all logs')
	.option('--verbose', 'Enable all logs')
	.option('--color', `This option is a dummy for some external program's (e.g. forever) issue.`)
	.parse(process.argv);

if (process.env.MR_VERBOSE) program.verbose = true;
if (process.env.MR_QUIET) program.quiet = true;

export { program };
