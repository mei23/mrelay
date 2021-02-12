import * as http from 'http';
import * as https from 'https';
import * as cache from 'lookup-dns-cache';
import fetch, { HeadersInit } from 'node-fetch';
import config from '../config';
import { AbortController } from 'abort-controller';

export async function getJson(url: string, accept = 'application/json, */*', timeout = 10000, headers?: HeadersInit) {
	const controller = new AbortController();
	setTimeout(() => {
		controller.abort();
	}, timeout * 6);

	const res = await fetch(url, {
		headers: Object.assign({
			'User-Agent': config.userAgent,
			Accept: accept
		}, headers || {}),
		timeout,
		size: 10 * 1024 * 1024,
		agent: getAgentByUrl,
		signal: controller.signal,
	});

	if (!res.ok) {
		throw {
			name: `StatusError`,
			statusCode: res.status,
			message: `${res.status} ${res.statusText}`,
		};
	}

	try {
		return await res.json();
	} catch (e) {
		throw {
			name: `JsonParseError`,
			statusCode: 481,
			message: `JSON parse error ${e.message || e}`
		};
	}
}

const _http = new http.Agent({
	keepAlive: true,
	keepAliveMsecs: 30 * 1000,
});

const _https = new https.Agent({
	keepAlive: true,
	keepAliveMsecs: 30 * 1000,
	lookup: cache.lookup,
});

export function getAgentByUrl(url: URL): http.Agent | https.Agent {
	return url.protocol == 'http:' ? _http : _https;
}
