import { z } from "zod";
import type {
  CompanionBeastHistoryItem,
  CompanionBeastProfile,
  CompanionSceneBgResponse,
  I2_3DCreateResponse,
  I2_3DTaskResponse,
  T2IResponse,
} from "../types";

const t2iResponseSchema = z.object({ images: z.array(z.string()) });
const i23dCreateSchema = z.object({ taskId: z.string(), status: z.string() });
const i23dTaskSchema = z.object({
  taskId: z.string(),
  status: z.string(),
  modelUrl: z.string().optional(),
  error: z.string().optional(),
});
const companionBeastProfileSchema: z.ZodType<CompanionBeastProfile> = z.object({
  version: z.literal(1),
  personaId: z.string(),
  mbti: z.string().optional(),
  camp: z.enum(["NF", "NT", "SJ", "SP"]),
  speciesBase: z.string(),
  speciesNameCn: z.string(),
  rarityTier: z.enum(["bronze", "silver", "gold", "epic"]),
  dangerLevel: z.enum(["safe", "oddity", "high_risk", "containment_breach", "unnamable"]),
  combatStyle: z.enum(["attack", "defense", "control", "support", "chaos"]),
  materials: z.array(z.string()),
  traits: z.array(z.string()),
  appearanceSummary: z.string(),
  personalitySummary: z.string(),
  awakeningStory: z.string(),
  imagePrompt: z.string().optional(),
  recyclable: z.boolean(),
  tradeable: z.boolean(),
  serial: z.string().nullable().optional(),
});
const companionBeastHistoryItemSchema: z.ZodType<CompanionBeastHistoryItem> = z.object({
  id: z.string(),
  createdAt: z.number(),
  speciesNameCn: z.string(),
  rarityTier: z.enum(["bronze", "silver", "gold", "epic"]),
  dangerLevel: z.enum(["safe", "oddity", "high_risk", "containment_breach", "unnamable"]),
  combatStyle: z.enum(["attack", "defense", "control", "support", "chaos"]),
  imageUrl: z.string().optional(),
  sceneBgUrl: z.string().optional(),
  recyclable: z.boolean(),
  serial: z.string().nullable().optional(),
  profile: companionBeastProfileSchema,
});
const visualHistoryItemSchema = z.object({
  id: z.string(),
  kind: z.enum(["t2i", "i23d", "companion"]).optional(),
  createdAt: z.number(),
  prompt: z.string().optional(),
  size: z.string().optional(),
  n: z.number().optional(),
  images: z.array(z.string()).optional(),
  cosUrlByImageUrl: z.record(z.string()).optional(),
  selectedImageUrl: z.string().optional(),
  taskId: z.string().optional(),
  taskStatus: z.string().optional(),
  modelUrl: z.string().optional(),
  companionImageUrl: z.string().optional(),
  companionSceneBgUrl: z.string().optional(),
  companionSummary: z.string().optional(),
  companionProfile: companionBeastProfileSchema.optional(),
});
const visualHistoryResponseSchema = z.object({ items: z.array(visualHistoryItemSchema) });
const cosUploadSchema = z.object({ url: z.string(), key: z.string() });
const i23dUrlCreateSchema = z.object({ taskId: z.string(), status: z.string() });
const companionBeastResponseSchema = z.object({
  profile: companionBeastProfileSchema.nullable().optional(),
  imageUrl: z.string().optional(),
});
const companionBeastHistoryResponseSchema = z.object({
  items: z.array(companionBeastHistoryItemSchema),
});
const companionBeastAwakenResponseSchema = z.object({
  profile: companionBeastProfileSchema,
  imageUrl: z.string().optional(),
  historyItem: companionBeastHistoryItemSchema,
});
const companionSceneBgResponseSchema: z.ZodType<CompanionSceneBgResponse> = z.object({
  imageUrl: z.string().optional(),
  historyItemId: z.string(),
});

export type ApiClientOptions = {
  apiBaseUrl: string;
  token?: string;
  authToken?: string;
};

export function createApiClient(opts: ApiClientOptions) {
  const base = opts.apiBaseUrl.replace(/\/$/, "");
  const headers: Record<string, string> = {};
  if (opts.token) headers["x-plugin-token"] = opts.token;
  if (opts.authToken) headers["authorization"] = `Bearer ${opts.authToken}`;

  return {
    async t2i(input: { prompt: string; size?: string; n?: number }): Promise<T2IResponse> {
      const res = await fetch(`${base}/api/doubao/t2i`, {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify(input),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      const parsed = t2iResponseSchema.parse(json);
      return { images: parsed.images };
    },

    async create3d(image: Blob): Promise<I2_3DCreateResponse> {
      const form = new FormData();
      form.append("image", image, "input.png");
      const res = await fetch(`${base}/api/hunyuan3d/i2t`, {
        method: "POST",
        headers,
        body: form,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      const parsed = i23dCreateSchema.parse(json);
      return { taskId: parsed.taskId, status: normalizeStatus(parsed.status) };
    },

    async create3dFromUrl(imageUrl: string, _prompt?: string): Promise<I2_3DCreateResponse> {
      const res = await fetch(`${base}/api/hunyuan3d/i2t-url`, {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify({ imageUrl }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      const parsed = i23dUrlCreateSchema.parse(json);
      return { taskId: parsed.taskId, status: normalizeStatus(parsed.status) };
    },

    async get3d(taskId: string): Promise<I2_3DTaskResponse> {
      const res = await fetch(`${base}/api/hunyuan3d/tasks/${encodeURIComponent(taskId)}`, {
        method: "GET",
        headers,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      const parsed = i23dTaskSchema.parse(json);
      return {
        taskId: parsed.taskId,
        status: normalizeStatus(parsed.status),
        modelUrl: parsed.modelUrl,
        error: parsed.error,
      };
    },

    async uploadToCosFromUrl(imageUrl: string): Promise<z.infer<typeof cosUploadSchema>> {
      const res = await fetch(`${base}/api/cos/upload-from-url`, {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify({ imageUrl }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      return cosUploadSchema.parse(json);
    },

    async getPersonaVisualHistory(personaId: string) {
      const res = await fetch(`${base}/api/personas/${encodeURIComponent(personaId)}/visual-history`, {
        method: "GET",
        headers,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      return visualHistoryResponseSchema.parse(json);
    },

    async savePersonaVisualHistory(personaId: string, items: z.infer<typeof visualHistoryItemSchema>[]) {
      const res = await fetch(`${base}/api/personas/${encodeURIComponent(personaId)}/visual-history`, {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify({ items }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      return visualHistoryResponseSchema.parse(json);
    },

    async getPersonaCompanionBeast(personaId: string) {
      const res = await fetch(`${base}/api/personas/${encodeURIComponent(personaId)}/companion-beast`, {
        method: "GET",
        headers,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      return companionBeastResponseSchema.parse(json);
    },

    async getPersonaCompanionBeastHistory(personaId: string) {
      const res = await fetch(`${base}/api/personas/${encodeURIComponent(personaId)}/companion-beast/history`, {
        method: "GET",
        headers,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      return companionBeastHistoryResponseSchema.parse(json);
    },

    async awakenCompanionBeast(personaId: string) {
      const res = await fetch(`${base}/api/personas/${encodeURIComponent(personaId)}/companion-beast/awaken`, {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify({}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      return companionBeastAwakenResponseSchema.parse(json);
    },

    async generateCompanionSceneBg(personaId: string, historyItemId?: string) {
    const res = await fetch(`${base}/api/personas/${encodeURIComponent(personaId)}/companion-beast/scene-bg`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify({ historyItemId }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
    return companionSceneBgResponseSchema.parse(json);
  },

  async quickAwakenFromText(text: string) {
    const res = await fetch(`${base}/api/creator/companion/quick-awaken`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify({ text }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
    return json as { profile: any; imageUrl?: string };
  },
  };
}

function normalizeStatus(v: string) {
  return v === "queued" || v === "running" || v === "succeeded" || v === "failed"
    ? v
    : ("running" as const);
}
