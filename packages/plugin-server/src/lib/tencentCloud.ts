import crypto from "node:crypto";

export type Tc3Options = {
  secretId: string;
  secretKey: string;
  token?: string;
  service: string;
  host: string;
  region: string;
  version: string;
  action: string;
  payload: unknown;
};

export async function tc3Request<T>(opts: Tc3Options): Promise<T> {
  const endpoint = `https://${opts.host}/`;
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const signedHeaders = "content-type;host";
  const contentType = "application/json; charset=utf-8";

  const payloadStr = JSON.stringify(opts.payload ?? {});
  const hashedPayload = sha256Hex(payloadStr);

  const canonicalRequest = [
    "POST",
    "/",
    "",
    `content-type:${contentType}\nhost:${opts.host}\n`,
    signedHeaders,
    hashedPayload,
  ].join("\n");

  const credentialScope = `${date}/${opts.service}/tc3_request`;
  const stringToSign = ["TC3-HMAC-SHA256", String(timestamp), credentialScope, sha256Hex(canonicalRequest)].join(
    "\n",
  );

  const signature = tc3Sign(opts.secretKey, date, opts.service, stringToSign);
  const authorization = `TC3-HMAC-SHA256 Credential=${opts.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const headers: Record<string, string> = {
    Authorization: authorization,
    "Content-Type": contentType,
    Host: opts.host,
    "X-TC-Action": opts.action,
    "X-TC-Timestamp": String(timestamp),
    "X-TC-Version": opts.version,
    "X-TC-Region": opts.region,
  };
  if (opts.token) headers["X-TC-Token"] = opts.token;

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: payloadStr,
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(typeof json?.message === "string" ? json.message : `HTTP ${res.status}`);
    (err as any).status = res.status;
    (err as any).body = json;
    throw err;
  }
  if (json?.Response?.Error) {
    const err = new Error(
      `${json.Response.Error.Code || "TencentCloudError"}: ${json.Response.Error.Message || ""}`.trim(),
    );
    (err as any).status = 502;
    (err as any).body = json;
    throw err;
  }
  return json as T;
}

function sha256Hex(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function hmacSha256(key: Buffer | string, msg: string) {
  return crypto.createHmac("sha256", key).update(msg).digest();
}

function tc3Sign(secretKey: string, date: string, service: string, stringToSign: string) {
  const secretDate = hmacSha256(`TC3${secretKey}`, date);
  const secretService = hmacSha256(secretDate, service);
  const secretSigning = hmacSha256(secretService, "tc3_request");
  return crypto.createHmac("sha256", secretSigning).update(stringToSign).digest("hex");
}

