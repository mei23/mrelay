Error.stackTraceLimit = Infinity;

require('events').EventEmitter.defaultMaxListeners = 128;

import boot from './boot';

export default function() {
	return boot();
}
