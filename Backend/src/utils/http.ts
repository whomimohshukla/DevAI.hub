

// fetches a buffer from a url
// throws an error if the fetch fails
// returns the buffer if the fetch succeeds
// uses node-fetch under the hood
export async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
