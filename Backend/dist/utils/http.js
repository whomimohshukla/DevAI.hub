"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBuffer = fetchBuffer;
async function fetchBuffer(url) {
	const res = await fetch(url);
	if (!res.ok)
		throw new Error(
			`Failed to fetch ${url}: ${res.status} ${res.statusText}`
		);
	const arrayBuffer = await res.arrayBuffer();
	return Buffer.from(arrayBuffer);
}
