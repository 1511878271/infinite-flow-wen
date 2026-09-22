import { z } from "zod";
import COS from "cos-nodejs-sdk-v5";
import { randomUUID } from "crypto";
import net from "node:net";

const envSchema = z.object({
  COS_SECRET_ID: z.string().optional().default(""),
  COS_SECRET_KEY: z.string().optional().default(""),
  COS_SESSION_TOKEN: z.string().optional().default(""),
  COS_BUCKET: z.string().optional().default(""),
  COS_REGION: z.string().optional().default(""),
  COS_PREFIX: z.string().optional().default("ai-plugin"),
  COS_SIGNED_GET_EXPIRES: z
    .string()
    .optional()
    .default("3600")
    .transform((v) => Number(v) || 3600),
  COS_FORCE_SIGNED_GET: z
    .string()
    .optional()
    .default("0")
    .transform((v) => v === "1" || v.toLowerCase() === "true"),
});

export function getCosRuntimeConfig() {
  const env = envSchema.parse(process.env);
  return {
    enabled: Boolean(env.COS_SECRET_ID && env.COS_SECRET_KEY && env.COS_BUCKET && env.COS_REGION),
    bucket: env.COS_BUCKET || "",
    region: env.COS_REGION || "",
    prefix: env.COS_PREFIX || "",
  };
}

export async function cosUploadFromUrl(input: { imageUrl: string }): Promise<{ url: string; key: string }> {
  const env = envSchema.parse(process.env);
  if (!env.COS_SECRET_ID || !env.COS_SECRET_KEY || !env.COS_BUCKET || !env.COS_REGION) {
    throw new Error("COS is not configured");
  }

  const imageUrl = input.imageUrl.trim();
  const u = safeParseHttpUrl(imageUrl);
  if (!u) throw new Error("Invalid imageUrl");

  const res = await fetch(u.toString(), {
    method: "GET",
    redirect: "follow",
    headers: { accept: "image/*" },
  });

  if (!res.ok) throw new Error(`Upstream download failed: HTTP ${res.status}`);

  const ct = res.headers.get("content-type") || "application/octet-stream";
  const len = Number(res.headers.get("content-length") || "0");
  if (len && len > 10 * 1024 * 1024) throw new Error("Image too large");

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > 10 * 1024 * 1024) throw new Error("Image too large");

  const ext = guessExt(ct) || guessExtFromPath(u.pathname) || "png";
  const key = buildKey(env.COS_PREFIX, ext);

  const cos = new COS({
    SecretId: env.COS_SECRET_ID,
    SecretKey: env.COS_SECRET_KEY,
    SecurityToken: env.COS_SESSION_TOKEN || undefined,
  });

  await new Promise<void>((resolve, reject) => {
    cos.putObject(
      {
        Bucket: env.COS_BUCKET,
        Region: env.COS_REGION,
        Key: key,
        Body: buf,
        ContentType: ct,
        ...(env.COS_FORCE_SIGNED_GET ? {} : { ACL: "public-read" }),
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });

  const publicUrl = makePublicUrl(env.COS_BUCKET, env.COS_REGION, key);
  if (!env.COS_FORCE_SIGNED_GET) return { url: publicUrl, key };

  const signedUrl = await new Promise<string>((resolve, reject) => {
    cos.getObjectUrl(
      {
        Bucket: env.COS_BUCKET,
        Region: env.COS_REGION,
        Key: key,
        Sign: true,
        Expires: env.COS_SIGNED_GET_EXPIRES,
      },
      (err, data) => {
        if (err) reject(err);
        else resolve(String((data as any)?.Url || ""));
      },
    );
  });

  return { url: signedUrl || publicUrl, key };
}

export async function cosUploadBuffer(input: {
  buffer: Buffer;
  contentType?: string;
  ext?: string;
  folder?: string;
}): Promise<{ url: string; key: string }> {
  const env = envSchema.parse(process.env);
  if (!env.COS_SECRET_ID || !env.COS_SECRET_KEY || !env.COS_BUCKET || !env.COS_REGION) {
    throw new Error("COS is not configured");
  }

  const ct = String(input.contentType || "application/octet-stream");
  const ext = String(input.ext || guessExt(ct) || "bin").replace(/^\./, "").toLowerCase();
  const key = buildKey(env.COS_PREFIX, ext, input.folder);

  const cos = new COS({
    SecretId: env.COS_SECRET_ID,
    SecretKey: env.COS_SECRET_KEY,
    SecurityToken: env.COS_SESSION_TOKEN || undefined,
  });

  await new Promise<void>((resolve, reject) => {
    cos.putObject(
      {
        Bucket: env.COS_BUCKET,
        Region: env.COS_REGION,
        Key: key,
        Body: input.buffer,
        ContentType: ct,
        ...(env.COS_FORCE_SIGNED_GET ? {} : { ACL: "public-read" }),
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });

  const publicUrl = makePublicUrl(env.COS_BUCKET, env.COS_REGION, key);
  if (!env.COS_FORCE_SIGNED_GET) return { url: publicUrl, key };

  const signedUrl = await new Promise<string>((resolve, reject) => {
    cos.getObjectUrl(
      {
        Bucket: env.COS_BUCKET,
        Region: env.COS_REGION,
        Key: key,
        Sign: true,
        Expires: env.COS_SIGNED_GET_EXPIRES,
      },
      (err, data) => {
        if (err) reject(err);
        else resolve(String((data as any)?.Url || ""));
      },
    );
  });

  return { url: signedUrl || publicUrl, key };
}

function buildKey(prefix: string, ext: string, folder?: string) {
  const d = new Date();
  const y = String(d.getFullYear());
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const p = prefix.replace(/^\/+|\/+$/g, "");
  const f = String(folder || "").trim().replace(/^\/+|\/+$/g, "");
  const base = f ? `${p}/${f}` : p;
  return `${base}/${y}${m}${day}/${randomUUID()}.${ext}`;
}

function makePublicUrl(bucket: string, region: string, key: string) {
  return `https://${bucket}.cos.${region}.myqcloud.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
}

function safeParseHttpUrl(raw: string) {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  const host = u.hostname.toLowerCase();
  if (host === "localhost") return null;
  if (net.isIP(host)) {
    if (host === "127.0.0.1" || host === "::1") return null;
    if (isPrivateIpv4(host)) return null;
  }
  return u;
}

function isPrivateIpv4(ip: string) {
  const parts = ip.split(".").map((x) => Number(x));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function guessExt(ct: string) {
  const v = ct.toLowerCase();
  if (v.includes("image/png")) return "png";
  if (v.includes("image/jpeg")) return "jpg";
  if (v.includes("image/webp")) return "webp";
  if (v.includes("audio/webm")) return "webm";
  if (v.includes("audio/ogg")) return "ogg";
  if (v.includes("audio/mpeg")) return "mp3";
  if (v.includes("audio/wav") || v.includes("audio/x-wav")) return "wav";
  if (v.includes("audio/mp4")) return "m4a";
  return "";
}

function guessExtFromPath(pathname: string) {
  const m = pathname.toLowerCase().match(/\.([a-z0-9]{1,5})$/);
  if (!m) return "";
  const ext = m[1];
  if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp") return ext === "jpeg" ? "jpg" : ext;
  return "";
}
