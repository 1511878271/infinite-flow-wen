export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);
  const text = await res.text();
  let json: unknown = undefined;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }
  if (!res.ok) {
    const err = new Error(
      typeof json === "string"
        ? json
        : JSON.stringify({ status: res.status, body: json }),
    );
    (err as any).status = res.status;
    (err as any).body = json;
    throw err;
  }
  return json as T;
}

export function getRequiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}
