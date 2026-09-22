import { z } from "zod";
import type { I2_3DCreateResponse, I2_3DTaskResponse } from "../types.js";
import { createMock3DTask, getMock3DTask } from "../lib/mockTasks.js";
import { tc3Request } from "../lib/tencentCloud.js";

const envSchema = z.object({
  HUNYUAN3D_PROVIDER: z.enum(["mock", "tencent", "bearer"]).optional().default("mock"),
  HUNYUAN3D_VARIANT: z.enum(["rapid", "standard", "pro"]).optional().default("rapid"),
  HUNYUAN3D_BASE_URL: z.string().optional().default(""),
  HUNYUAN3D_API_KEY: z.string().optional().default(""),
  TENCENT_SECRET_ID: z.string().optional().default(""),
  TENCENT_SECRET_KEY: z.string().optional().default(""),
  TENCENT_TOKEN: z.string().optional().default(""),
  TENCENT_REGION: z.string().optional().default("ap-guangzhou"),
  HUNYUAN3D_VERSION: z.string().optional().default("2025-05-13"),
});

export async function hunyuanCreate3DTask(input: {
  file: { buffer: Buffer; filename: string; mimetype: string };
}): Promise<I2_3DCreateResponse> {
  const env = resolveEnv();
  if (env.provider === "mock") return createMock3DTask();
  if (env.provider === "bearer") {
    throw new Error("Bearer provider is not implemented for file upload in this build");
  }
  throw new Error("Tencent provider requires imageUrl; use hunyuanCreate3DTaskFromUrl");
}

export async function hunyuanCreate3DTaskFromUrl(input: {
  imageUrl: string;
  prompt?: string;
}): Promise<I2_3DCreateResponse> {
  const env = resolveEnv();
  if (env.provider === "mock") return createMock3DTask();
  if (env.provider === "bearer") {
    const base = env.bearer.baseUrl.replace(/\/$/, "");
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (env.bearer.apiKey) headers["authorization"] = `Bearer ${env.bearer.apiKey}`;
    const res = await fetch(`${base}/i2t-url`, {
      method: "POST",
      headers,
      body: JSON.stringify({ imageUrl: input.imageUrl, prompt: input.prompt }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
    const taskId = String(json?.taskId || json?.task_id || json?.id || "");
    return { taskId, status: taskId ? "queued" : "failed" };
  }

  const action = env.tencent.variant === "pro"
    ? "SubmitHunyuanTo3DProJob"
    : env.tencent.variant === "standard"
      ? "SubmitHunyuanTo3DJob"
      : "SubmitHunyuanTo3DRapidJob";

  const payload: any = {
    ImageUrl: input.imageUrl,
  };
  if (input.prompt) payload.Prompt = input.prompt;
  if (env.tencent.variant !== "pro") payload.ResultFormat = "GLB";

  const json = await tc3Request<any>({
    secretId: env.tencent.secretId,
    secretKey: env.tencent.secretKey,
    token: env.tencent.token || undefined,
    service: "ai3d",
    host: "ai3d.tencentcloudapi.com",
    region: env.tencent.region,
    version: env.tencent.version,
    action,
    payload,
  });

  const jobId = String(json?.Response?.JobId || "");
  return { taskId: jobId, status: jobId ? "queued" : "failed" };
}

export async function hunyuanGet3DTask(taskId: string): Promise<I2_3DTaskResponse> {
  const env = resolveEnv();
  if (env.provider === "mock") return getMock3DTask(taskId);
  if (env.provider === "bearer") {
    const base = env.bearer.baseUrl.replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if (env.bearer.apiKey) headers["authorization"] = `Bearer ${env.bearer.apiKey}`;
    const res = await fetch(`${base}/tasks/${encodeURIComponent(taskId)}`, { method: "GET", headers });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
    return normalizeGenericTask(taskId, json);
  }

  const action = env.tencent.variant === "pro"
    ? "QueryHunyuanTo3DProJob"
    : env.tencent.variant === "standard"
      ? "QueryHunyuanTo3DJob"
      : "QueryHunyuanTo3DRapidJob";

  const json = await tc3Request<any>({
    secretId: env.tencent.secretId,
    secretKey: env.tencent.secretKey,
    token: env.tencent.token || undefined,
    service: "ai3d",
    host: "ai3d.tencentcloudapi.com",
    region: env.tencent.region,
    version: env.tencent.version,
    action,
    payload: { JobId: taskId },
  });

  const statusRaw = String(json?.Response?.Status || "");
  const normalizedStatus = normalizeTencentStatus(statusRaw);
  const files = Array.isArray(json?.Response?.ResultFile3Ds) ? json.Response.ResultFile3Ds : [];
  const best = pickModelUrl(files);
  const errorCode = String(json?.Response?.ErrorCode || "");
  const errorMessage = String(json?.Response?.ErrorMessage || "");

  return {
    taskId,
    status: normalizedStatus,
    modelUrl: best || undefined,
    error: normalizedStatus === "failed" ? (errorMessage || errorCode || "failed") : undefined,
  };
}

export function getHunyuanRuntimeConfig() {
  const env = resolveEnv();
  if (env.provider === "mock") return { provider: "mock" as const, enabled: true, variant: env.variant };
  if (env.provider === "bearer")
    return { provider: "bearer" as const, enabled: Boolean(env.bearer.baseUrl), variant: env.variant };
  return {
    provider: "tencent" as const,
    enabled: Boolean(env.tencent.secretId && env.tencent.secretKey && env.tencent.region),
    region: env.tencent.region,
    version: env.tencent.version,
    variant: env.variant,
  };
}

function resolveEnv() {
  const raw = envSchema.parse(process.env);
  const inferredProvider =
    raw.HUNYUAN3D_PROVIDER !== "mock"
      ? raw.HUNYUAN3D_PROVIDER
      : raw.TENCENT_SECRET_ID && raw.TENCENT_SECRET_KEY
        ? "tencent"
        : raw.HUNYUAN3D_BASE_URL
          ? "bearer"
          : "mock";
  return {
    provider: inferredProvider as "mock" | "tencent" | "bearer",
    variant: raw.HUNYUAN3D_VARIANT,
    bearer: { baseUrl: raw.HUNYUAN3D_BASE_URL, apiKey: raw.HUNYUAN3D_API_KEY },
    tencent: {
      secretId: raw.TENCENT_SECRET_ID,
      secretKey: raw.TENCENT_SECRET_KEY,
      token: raw.TENCENT_TOKEN,
      region: raw.TENCENT_REGION,
      version: raw.HUNYUAN3D_VERSION,
      variant: raw.HUNYUAN3D_VARIANT,
    },
  };
}

function normalizeGenericTask(taskId: string, json: any): I2_3DTaskResponse {
  const status = String(json?.status || json?.state || "running");
  const modelUrl = String(json?.modelUrl || json?.model_url || json?.result?.modelUrl || "");
  const error = String(json?.error || json?.message || "");
  const normalized =
    status === "queued" || status === "running" || status === "succeeded" || status === "failed"
      ? status
      : "running";
  return { taskId, status: normalized, modelUrl: modelUrl || undefined, error: error || undefined };
}

function normalizeTencentStatus(v: string): "queued" | "running" | "succeeded" | "failed" {
  const s = v.toUpperCase();
  if (!s) return "running";
  if (s.includes("PENDING") || s.includes("QUEUED") || s.includes("WAIT")) return "queued";
  if (s.includes("SUCC") || s.includes("DONE") || s.includes("FINISH")) return "succeeded";
  if (s.includes("FAIL") || s.includes("ERROR")) return "failed";
  return "running";
}

function pickModelUrl(files: any[]): string {
  const urls = files
    .map((f) => ({
      type: String(f?.Type || ""),
      url: String(f?.Url || ""),
    }))
    .filter((x) => x.url);
  const glb = urls.find((x) => x.type.toLowerCase().includes("glb") || x.url.toLowerCase().includes(".glb"));
  if (glb) return glb.url;
  return urls[0]?.url || "";
}
