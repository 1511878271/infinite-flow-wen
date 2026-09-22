import { z } from "zod";
import type { T2IRequest, T2IResponse } from "../types.js";
import { fetchJson } from "../lib/http.js";

const envSchema = z.object({
  DOUBAO_BASE_URL: z.string().optional().default(""),
  DOUBAO_API_KEY: z.string().optional().default(""),
  DOUBAO_MODEL: z.string().optional().default(""),
});

export function getDoubaoRuntimeConfig() {
  const { DOUBAO_BASE_URL, DOUBAO_API_KEY, DOUBAO_MODEL } = envSchema.parse(process.env);
  return {
    baseUrl: DOUBAO_BASE_URL || "",
    model: DOUBAO_MODEL || "",
    hasApiKey: Boolean(DOUBAO_API_KEY),
    mockMode: !DOUBAO_BASE_URL,
  };
}

export async function doubaoTextToImage(req: T2IRequest): Promise<T2IResponse> {
  const { DOUBAO_BASE_URL, DOUBAO_API_KEY, DOUBAO_MODEL } = envSchema.parse(process.env);
  if (!DOUBAO_BASE_URL) return mockDoubao(req);

  const payload: any = {
    prompt: req.prompt,
    size: req.size,
    n: req.n ?? 1,
  };
  if (req.image) payload.image = req.image;

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (DOUBAO_API_KEY) headers["authorization"] = `Bearer ${DOUBAO_API_KEY}`;

  const base = DOUBAO_BASE_URL.replace(/\/$/, "");
  const isArkV3 = /\/api\/v3$/i.test(base) || /ark\./i.test(base);

  
  // 并发请求多张
  const promises = [];
  for (let i = 0; i < (payload.n || 1); i++) {
    promises.push(
      isArkV3
        ? fetchJson<any>(`${base}/images/generations`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              model: DOUBAO_MODEL || undefined,
              prompt: payload.prompt,
              size: normalizeArkSize(payload.size),
              image: payload.image,
            }),
          })
        : fetchJson<any>(`${base}/t2i`, { method: "POST", headers, body: JSON.stringify(payload) })
    );
  }

  const results = await Promise.all(promises);
  let allImages: string[] = [];
  for (const json of results) {
    allImages = allImages.concat(normalizeImageList(json));
  }
  
  return { images: allImages };
}

function normalizeImageList(json: any): string[] {
  // Ark API (Doubao) returns { data: [{ url: "..." }, { url: "..." }] }
  if (Array.isArray(json?.data)) {
    const urls = json.data
      .map((x: any) => x?.url ?? x?.image_url ?? x?.imageUrl ?? x?.b64_json)
      .filter((x: any) => typeof x === "string");
    if (urls.length) return urls;
  }
  // Other possible returns
  if (Array.isArray(json?.images) && json.images.every((x: any) => typeof x === "string")) {
    return json.images;
  }
  return [];
}

function mockDoubao(req: T2IRequest): T2IResponse {
  const n = Math.min(Math.max(req.n ?? 1, 1), 4);
  const text = encodeURIComponent(req.prompt.slice(0, 40));
  const size = req.size === "1024" ? "1024" : req.size === "768" ? "768" : "512";
  const images = Array.from({ length: n }).map(
    (_, i) => `https://placehold.co/${size}x${size}/4f46e5/ffffff?text=${text}-${i + 1}`,
  );
  return { images };
}

function normalizeArkSize(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (!s) return undefined;
  if (/^(1K|2K|4K)$/i.test(s)) return s.toUpperCase();
  if (/^\d+x\d+$/i.test(s)) return s;
  if (s === "512") return "512x512";
  if (s === "768") return "768x768";
  if (s === "1024") return "1024x1024";
  return undefined;
}
