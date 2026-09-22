import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { Readable } from "node:stream";
import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ApiError } from "../lib/errors.js";
import type { T2IRequest } from "../types.js";
import { doubaoTextToImage, getDoubaoRuntimeConfig } from "../providers/doubao.js";
import { getHunyuanRuntimeConfig, hunyuanCreate3DTask, hunyuanCreate3DTaskFromUrl, hunyuanGet3DTask } from "../providers/hunyuan3d.js";
import { cosUploadBuffer, cosUploadFromUrl, getCosRuntimeConfig } from "../providers/cos.js";
import { deepseekChat } from "../providers/deepseek.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getModelLibraryDir() {
  const fromEnv = String(process.env.MODEL_LIBRARY_DIR || "").trim();
  if (fromEnv) return path.resolve(fromEnv);
  return path.resolve(__dirname, "../../../../glb");
}

function sanitizeModelFileName(name: string) {
  const raw = String(name || "").trim() || "model.glb";
  const base = raw.replace(/[^a-z0-9._-]/gi, "_");
  const hasExt = /\.glb$/i.test(base);
  const stem = base.replace(/\.glb$/i, "");
  const stamp = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `${stem || "model"}-${stamp}${hasExt ? ".glb" : ".glb"}`;
}

const modelUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      try {
        const dir = getModelLibraryDir();
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      } catch (e: any) {
        cb(e, "");
      }
    },
    filename: (_req, file, cb) => {
      try {
        cb(null, sanitizeModelFileName(String(file.originalname || "")));
      } catch (e: any) {
        cb(e, "");
      }
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 },
});

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string()
    })
  )
});

const t2iSchema = z.object({
  prompt: z.string().min(1).max(4000),
  size: z.string().optional(),
  n: z.number().int().min(1).max(4).optional(),
});

type BillingAction =
  | "t2i"
  | "i23d"
  | "storyboard"
  | "companion_t2i"
  | "companion_t2i_creator"
  | "companion_scene_bg";

let supabaseAdmin: any = null;

function billingEnabled() {
  return String(process.env.BILLING_ENABLED || "") === "1";
}

function getSupabaseAdmin(): any {
  if (supabaseAdmin) return supabaseAdmin;
  const url = String(process.env.SUPABASE_URL || "").trim();
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) throw new ApiError("INTERNAL_ERROR", 500, "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  supabaseAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return supabaseAdmin;
}

const automationJobs = new Map<string, { timer: NodeJS.Timeout | null; running: boolean }>();
const AUTOMATION_TICK_MS = 12000;

function getAutomationJob(conversationId: string) {
  const key = String(conversationId || "").trim();
  if (!key) return null;
  let job = automationJobs.get(key);
  if (!job) {
    job = { timer: null, running: false };
    automationJobs.set(key, job);
  }
  return job;
}

function clearAutomationJob(conversationId: string) {
  const key = String(conversationId || "").trim();
  const job = automationJobs.get(key);
  if (job?.timer) clearTimeout(job.timer);
  automationJobs.delete(key);
}

async function tryGetSupabaseUserId(req: express.Request): Promise<string | null> {
  const auth = String(req.header("authorization") || "");
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const token = m ? m[1].trim() : "";
  if (!token) return null;
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user?.id) return null;
  return String(data.user.id);
}

async function requireSupabaseUserId(req: express.Request): Promise<string> {
  const auth = String(req.header("authorization") || "");
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const token = m ? m[1].trim() : "";
  if (!token) throw new ApiError("UNAUTHORIZED", 401, "Missing authorization token");
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user?.id) throw new ApiError("UNAUTHORIZED", 401, "Invalid authorization token");
  return String(data.user.id);
}

const feedbackRate = new Map<string, { count: number; resetAt: number }>();

function checkFeedbackRateLimit(req: express.Request) {
  const now = Date.now();
  const xf = String(req.header("x-forwarded-for") || "");
  const ip = (xf.split(",")[0] || "").trim() || String(req.ip || "");
  const key = ip || "unknown";
  const windowMs = 60 * 60 * 1000;
  const max = 10;
  const cur = feedbackRate.get(key);
  if (!cur || cur.resetAt <= now) {
    feedbackRate.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (cur.count >= max) throw new ApiError("TOO_MANY_REQUESTS", 429, "请求过于频繁，请稍后再试");
  cur.count += 1;
}

async function sendFeedbackEmail(input: { subject: string; text: string }) {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  const to = String(process.env.FEEDBACK_TO_EMAIL || "").trim();
  const from = String(process.env.FEEDBACK_FROM_EMAIL || "").trim();
  if (!apiKey || !to || !from) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: input.subject,
      text: input.text,
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new ApiError("INTERNAL_ERROR", 500, t || `Failed to send email: HTTP ${res.status}`);
  }
  return true;
}

async function ensureBillingAccount(userId: string) {
  const sb = getSupabaseAdmin();
  const { error } = await sb
    .from("user_wallets")
    .upsert({ user_id: userId, balance: 0, total_recharged: 0 }, { onConflict: "user_id", ignoreDuplicates: true });
  if (error) {
    const msg = String((error as any)?.message || "Failed to ensure user wallet");
    const hint = /user_wallets/i.test(msg)
      ? "user_wallets table is not initialized"
      : msg;
    throw new ApiError("INTERNAL_ERROR", 500, hint);
  }
}

async function getBillingBalance(userId: string): Promise<number> {
  const sb = getSupabaseAdmin();
  await ensureBillingAccount(userId);
  const { data, error } = await sb.from("user_wallets").select("balance").eq("user_id", userId).maybeSingle();
  if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message || "Failed to load balance");
  const b = (data as any)?.balance;
  const n = typeof b === "number" ? b : Number(b);
  return Number.isFinite(n) ? n : 0;
}

async function appendBillingLedger(input: {
  userId: string;
  delta: number;
  reason: string;
  requestId: string;
  metadata?: any;
}) {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("transaction_logs").insert({
    user_id: input.userId,
    amount: input.delta,
    type: input.reason,
    description: input.metadata?.note || input.reason
  });
  if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message || "Failed to write transaction logs");
}

async function charge(req: express.Request, action: BillingAction, cost: number, metadata?: any) {
  if (!billingEnabled()) return { balance: null as number | null, userId: null as string | null };
  const userId = await requireSupabaseUserId(req);
  await ensureBillingAccount(userId);

  const requestIdBase = String((req as any).requestId || "").trim();
  const requestId = `${requestIdBase || "req"}:${action}`;

  const sb = getSupabaseAdmin();
  // Simplified duplicate check for now since we removed request_id from transaction_logs
  // In a strict production environment, we should add request_id to transaction_logs

  const safeCost = Math.max(0, Math.floor(Number(cost) || 0));
  if (safeCost <= 0) {
    const bal = await getBillingBalance(userId);
    return { balance: bal, userId };
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await sb.from("user_wallets").select("balance").eq("user_id", userId).single();
    if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message || "Failed to load balance");
    const current = typeof (data as any)?.balance === "number" ? (data as any).balance : Number((data as any)?.balance);
    const currentBalance = Number.isFinite(current) ? current : 0;
    if (currentBalance < safeCost) throw new ApiError("BAD_REQUEST", 402, "余额不足");
    const nextBalance = currentBalance - safeCost;
    const { data: updated, error: updateErr } = await sb
      .from("user_wallets")
      .update({ balance: nextBalance })
      .eq("user_id", userId)
      .eq("balance", currentBalance)
      .select("balance")
      .maybeSingle();
    if (updateErr) throw new ApiError("INTERNAL_ERROR", 500, updateErr.message || "Failed to update balance");
    if (updated) {
      try {
        await appendBillingLedger({
          userId,
          delta: -safeCost,
          reason: action,
          requestId,
          metadata,
        });
      } catch (e) {
        try {
          const { data: cur2 } = await sb.from("user_wallets").select("balance").eq("user_id", userId).single();
          const b2 = typeof (cur2 as any)?.balance === "number" ? (cur2 as any).balance : Number((cur2 as any)?.balance);
          const b2n = Number.isFinite(b2) ? b2 : nextBalance;
          await sb
            .from("user_wallets")
            .update({ balance: b2n + safeCost })
            .eq("user_id", userId)
            .eq("balance", b2n);
        } catch {}
        throw e;
      }
      return { balance: nextBalance, userId };
    }
  }
  throw new ApiError("INTERNAL_ERROR", 500, "Balance update contention");
}

const COMPANION_SPECIES_MAP: Record<
  string,
  { speciesBase: string; speciesNameCn: string; camp: "NF" | "NT" | "SJ" | "SP" }
> = {
  INFP: { speciesBase: "butterfly", speciesNameCn: "蝴蝶", camp: "NF" },
  INFJ: { speciesBase: "jellyfish", speciesNameCn: "水母", camp: "NF" },
  ENFP: { speciesBase: "dog", speciesNameCn: "狗", camp: "NF" },
  ENFJ: { speciesBase: "secretary_bird", speciesNameCn: "蛇鹫", camp: "NF" },
  INTP: { speciesBase: "frog", speciesNameCn: "蛙", camp: "NT" },
  ENTP: { speciesBase: "monkey", speciesNameCn: "猴", camp: "NT" },
  INTJ: { speciesBase: "snake", speciesNameCn: "蛇", camp: "NT" },
  ENTJ: { speciesBase: "bear", speciesNameCn: "熊", camp: "NT" },
  ISTJ: { speciesBase: "turtle", speciesNameCn: "龟", camp: "SJ" },
  ISFJ: { speciesBase: "capybara", speciesNameCn: "水豚", camp: "SJ" },
  ESTJ: { speciesBase: "goose", speciesNameCn: "鹅", camp: "SJ" },
  ESFJ: { speciesBase: "orca", speciesNameCn: "虎鲸", camp: "SJ" },
  ISTP: { speciesBase: "cat", speciesNameCn: "猫", camp: "SP" },
  ISFP: { speciesBase: "rabbit", speciesNameCn: "兔", camp: "SP" },
  ESTP: { speciesBase: "fox", speciesNameCn: "狐", camp: "SP" },
  ESFP: { speciesBase: "parrot", speciesNameCn: "鹦鹉", camp: "SP" },
};

const CAMP_PREFIXES = {
  NF: ["灵潮", "雾海", "月梦", "心焰"],
  NT: ["棱镜", "冷渊", "零度", "裂界"],
  SJ: ["壁垒", "秩序", "恒守", "地脉"],
  SP: ["流火", "跃影", "野频", "游光"],
} as const;

const CAMP_MATERIALS = {
  NF: ["果冻质感", "流沙发光", "镭射透明", "花粉微粒", "液态玻璃"],
  NT: ["机械金属", "鳞片", "冷光裂纹", "矿石甲片", "黑曜流体"],
  SJ: ["石质壳层", "厚重甲片", "毛绒护层", "青铜纹理", "陶瓷外壳"],
  SP: ["毛绒质感", "粘液", "虹彩羽片", "沙雾颗粒", "高饱和皮膜"],
} as const;

const CAMP_TRAITS = {
  NF: ["灵魂共振", "情绪回声", "边界感强", "唯美梦游", "柔性反刺"],
  NT: ["高维推演", "冷静拆解", "抽象压制", "逻辑穿刺", "秩序计算"],
  SJ: ["稳定守护", "责任壳层", "领域维持", "耐心收容", "秩序执行"],
  SP: ["感官爆闪", "游走试探", "即兴跃迁", "舞台感染", "野性直觉"],
} as const;

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function pickSeeded<T>(list: readonly T[], seed: number, offset = 0) {
  if (!list.length) throw new Error("Empty seeded list");
  return list[(seed + offset) % list.length];
}

function normalizeMbtiType(input: unknown) {
  const raw = String(input || "").trim().toUpperCase();
  return /^[IE][NS][FT][JP]$/.test(raw) ? raw : "INFP";
}

function deriveCombatStyle(mbti: string) {
  if (mbti[0] === "E" && mbti[2] === "T") return "attack" as const;
  if (mbti[0] === "I" && mbti[2] === "F") return "defense" as const;
  if (mbti[1] === "N" && mbti[3] === "P") return "chaos" as const;
  if (mbti[2] === "F") return "support" as const;
  if (mbti[1] === "N") return "control" as const;
  return mbti[0] === "E" ? ("attack" as const) : ("defense" as const);
}

function deriveRarityTier(seed: number) {
  const roll = seed % 100;
  if (roll >= 96) return "epic" as const;
  if (roll >= 82) return "gold" as const;
  if (roll >= 54) return "silver" as const;
  return "bronze" as const;
}

function deriveDangerLevel(seed: number, mbti: string, rarityTier: "bronze" | "silver" | "gold" | "epic") {
  let score = (seed >>> 3) % 100;
  if (mbti[1] === "N") score += 10;
  if (mbti[3] === "P") score += 8;
  if (rarityTier === "gold") score += 8;
  if (rarityTier === "epic") score += 18;
  if (score >= 98) return "unnamable" as const;
  if (score >= 88) return "containment_breach" as const;
  if (score >= 68) return "high_risk" as const;
  if (score >= 38) return "oddity" as const;
  return "safe" as const;
}

function buildCompanionProfile(personaId: string, persona: any) {
  const mbti = normalizeMbtiType(persona?.mbti_type || persona?.mbti);
  const species = COMPANION_SPECIES_MAP[mbti] || COMPANION_SPECIES_MAP.INFP;
  const seed = hashString(
    `${personaId}|${mbti}|${String(persona?.custom_traits || "")}|${JSON.stringify(persona?.distillation_history || [])}`,
  );
  const rarityTier = deriveRarityTier(seed);
  const dangerLevel = deriveDangerLevel(seed, mbti, rarityTier);
  const combatStyle = deriveCombatStyle(mbti);
  const materialA = pickSeeded(CAMP_MATERIALS[species.camp], seed, 0);
  const materialB = pickSeeded(CAMP_MATERIALS[species.camp], seed, 2);
  const traitA = pickSeeded(CAMP_TRAITS[species.camp], seed, 1);
  const traitB = pickSeeded(CAMP_TRAITS[species.camp], seed, 3);
  const prefix = pickSeeded(CAMP_PREFIXES[species.camp], seed, 0);
  const speciesNameCn = `${prefix}${species.speciesNameCn}`;
  const recyclable = (rarityTier === "gold" || rarityTier === "epic") && seed % 11 === 0;
  const serial =
    dangerLevel === "unnamable" || (rarityTier === "epic" && seed % 5 === 0)
      ? `BS-${seed.toString(36).slice(0, 6).toUpperCase()}`
      : null;
  const appearanceSummary = `${speciesNameCn}以${materialA}与${materialB}构成主体，呈现${species.camp}阵营特有的压迫感与识别度。`;
  const personalitySummary = `以${mbti}人格为底本，偏${
    combatStyle === "attack"
      ? "进攻"
      : combatStyle === "defense"
        ? "防御"
        : combatStyle === "control"
          ? "控制"
          : combatStyle === "support"
            ? "辅助"
            : "混沌"
  }型，主特质为${traitA}与${traitB}。`;
  const awakeningStory = `它从「${String(persona?.name || "未命名人格")}」的人格投射中觉醒，在${species.camp}阵营频段里显形，携带${traitA}与${traitB}的回声。`;
  const imagePrompt = [
    "A cinematic companion beast concept art, full body, highly detailed, centered composition, no human",
    `${species.speciesBase} creature with ${materialA} and ${materialB}`,
    `MBTI ${mbti}, ${species.camp} camp, ${combatStyle} type`,
    `${rarityTier} rarity, ${dangerLevel} danger class`,
    "fantasy sci-fi style, glowing accents, collectible card illustration, clean background",
  ].join(", ");

  return {
    version: 1 as const,
    personaId,
    mbti,
    camp: species.camp,
    speciesBase: species.speciesBase,
    speciesNameCn,
    rarityTier,
    dangerLevel,
    combatStyle,
    materials: [materialA, materialB],
    traits: [traitA, traitB],
    appearanceSummary,
    personalitySummary,
    awakeningStory,
    imagePrompt,
    recyclable,
    tradeable: true,
    serial,
  };
}

function buildCompanionSceneBgPrompt(profile: any) {
  const speciesNameCn = String(profile?.speciesNameCn || "companion beast");
  const speciesBase = String(profile?.speciesBase || "mystic creature");
  const camp = String(profile?.camp || "NF");
  const rarityTier = String(profile?.rarityTier || "bronze");
  const dangerLevel = String(profile?.dangerLevel || "safe");
  const materials = Array.isArray(profile?.materials) ? profile.materials.map((x: any) => String(x || "")).filter(Boolean) : [];
  const traits = Array.isArray(profile?.traits) ? profile.traits.map((x: any) => String(x || "")).filter(Boolean) : [];
  const mood = String(profile?.personalitySummary || "").trim();
  const appearance = String(profile?.appearanceSummary || "").trim();
  return [
    "Environmental concept art, empty cinematic habitat background, wide scene, no creature, no animal, no character, no human, no subject, no foreground hero",
    `${speciesBase} habitat inspired by ${speciesNameCn}`,
    `${camp} camp, ${rarityTier} rarity, ${dangerLevel} danger class`,
    materials.length ? `materials: ${materials.join(", ")}` : "",
    traits.length ? `motifs: ${traits.join(", ")}` : "",
    appearance,
    mood,
    "atmospheric lighting, volumetric fog, layered depth, immersive background for 3D model showcase, highly detailed, cinematic, 8k",
  ]
    .filter(Boolean)
    .join(", ");
}

function toCompanionHistoryItem(raw: any) {
  const profile = raw?.companionProfile;
  if (!profile || typeof profile !== "object") return null;
  return {
    id: String(raw?.id || `${Date.now()}`),
    createdAt: Number(raw?.createdAt || Date.now()),
    imageUrl: typeof raw?.companionImageUrl === "string" ? raw.companionImageUrl : undefined,
    sceneBgUrl: typeof raw?.companionSceneBgUrl === "string" ? raw.companionSceneBgUrl : undefined,
    speciesNameCn: String(profile?.speciesNameCn || "未命名伴生兽"),
    rarityTier: String(profile?.rarityTier || "bronze"),
    dangerLevel: String(profile?.dangerLevel || "safe"),
    combatStyle: String(profile?.combatStyle || "support"),
    recyclable: Boolean(profile?.recyclable),
    serial: profile?.serial ? String(profile.serial) : null,
    profile,
  };
}

export function apiRouter() {
  const router = express.Router();

  router.post("/feedback", express.json({ limit: "64kb" }), async (req, res, next) => {
    try {
      checkFeedbackRateLimit(req);
      const body = z
        .object({
          category: z.string().min(1).max(40),
          message: z.string().min(1).max(2000),
          contact: z.string().max(200).optional(),
          source: z.string().max(40).optional(),
          page: z.string().max(200).optional(),
          personaId: z.any().optional(),
          personaName: z.string().max(80).optional(),
          website: z.string().max(120).optional(),
          context: z.record(z.any()).optional(),
        })
        .parse(req.body);

      if (String(body.website || "").trim()) {
        res.json({ ok: true, stored: false, emailSent: false });
        return;
      }

      const userId = await tryGetSupabaseUserId(req);
      const ua = String(req.header("user-agent") || "");
      const xf = String(req.header("x-forwarded-for") || "");
      const ip = (xf.split(",")[0] || "").trim() || String(req.ip || "");
      const requestId = String((req as any).requestId || "");

      const sb = getSupabaseAdmin();
      const { data, error } = await sb
        .from("feedbacks")
        .insert({
          user_id: userId,
          category: body.category,
          message: body.message,
          contact: body.contact ?? null,
          source: body.source ?? null,
          page: body.page ?? null,
          persona_id: body.personaId != null ? String(body.personaId) : null,
          persona_name: body.personaName ?? null,
          request_id: requestId || null,
          ip: ip || null,
          user_agent: ua || null,
          context: body.context ?? null,
        })
        .select("id,created_at")
        .single();
      if (error) {
        const msg = String((error as any)?.message || "Failed to store feedback");
        const hint = /feedbacks/i.test(msg) ? "Feedback table is not initialized" : msg;
        throw new ApiError("INTERNAL_ERROR", 500, hint);
      }

      const createdAt = String((data as any)?.created_at || "");
      const subject = `[意见反馈] ${body.category}${body.source ? ` · ${body.source}` : ""}`;
      const text = [
        `时间: ${createdAt || new Date().toISOString()}`,
        `类别: ${body.category}`,
        body.source ? `入口: ${body.source}` : "",
        body.page ? `页面: ${body.page}` : "",
        body.personaName ? `人格: ${body.personaName}` : body.personaId != null ? `人格ID: ${String(body.personaId)}` : "",
        userId ? `用户ID: ${userId}` : "用户: 未登录",
        body.contact ? `联系方式: ${body.contact}` : "",
        `请求ID: ${requestId || "-"}`,
        `IP: ${ip || "-"}`,
        `UA: ${ua || "-"}`,
        "",
        "内容:",
        body.message,
      ]
        .filter(Boolean)
        .join("\n");

      let emailSent = false;
      try {
        emailSent = await sendFeedbackEmail({ subject, text });
      } catch (e) {
        emailSent = false;
      }
      res.json({ ok: true, id: (data as any)?.id, emailSent });
    } catch (e) {
      next(e);
    }
  });

  router.get("/billing/balance", async (req, res, next) => {
    try {
      if (!billingEnabled()) return res.json({ balance: null });
      const userId = await requireSupabaseUserId(req);
      const balance = await getBillingBalance(userId);
      res.json({ userId, balance });
    } catch (e) {
      next(e);
    }
  });

  router.post("/billing/mock-recharge", express.json(), async (req, res, next) => {
    try {
      if (!billingEnabled()) throw new ApiError("INTERNAL_ERROR", 500, "Billing disabled");
      const userId = await requireSupabaseUserId(req);
      const { rmb, points } = req.body;
      
      if (typeof rmb !== 'number' || typeof points !== 'number' || rmb <= 0) {
        throw new ApiError("BAD_REQUEST", 400, "Invalid recharge amount");
      }

      await ensureBillingAccount(userId);
      const sb = getSupabaseAdmin();

      // 直接增加积分并记录日志 (模拟支付成功回调)
      const { data: oldWallet, error: fetchErr } = await sb
        .from("user_wallets")
        .select("balance, version")
        .eq("user_id", userId)
        .single();
        
      if (fetchErr || !oldWallet) throw new ApiError("INTERNAL_ERROR", 500, "Failed to read wallet");

      const newBalance = oldWallet.balance + points;
      const { data: updatedWallet, error: updateErr } = await sb
        .from("user_wallets")
        .update({ balance: newBalance, version: oldWallet.version + 1 })
        .eq("user_id", userId)
        .eq("version", oldWallet.version)
        .select()
        .single();

      if (updateErr || !updatedWallet) {
        throw new ApiError("INTERNAL_ERROR", 500, "Failed to recharge (Concurrent modification)");
      }

      await sb.from("transaction_logs").insert({
        user_id: userId,
        tx_type: "recharge",
        amount: points,
        description: `模拟在线充值 ${rmb} 元`,
        balance_after: newBalance
      });

      res.json({ success: true, added: points, balance: newBalance });
    } catch (e) {
      next(e);
    }
  });

  router.post("/billing/redeem", express.json(), async (req, res, next) => {
    try {
      if (!billingEnabled()) throw new ApiError("INTERNAL_ERROR", 500, "Billing disabled");
      const userId = await requireSupabaseUserId(req);
      const code = String(req.body.code || "").trim();
      if (!code) throw new ApiError("BAD_REQUEST", 400, "请输入兑换码");

      await ensureBillingAccount(userId);
      const sb = getSupabaseAdmin();

      // 1. 查询并锁定卡密 (使用单次查询和更新来保证原子性)
      const { data: codeData, error: codeErr } = await sb
        .from("gift_codes")
        .select("*")
        .eq("code", code)
        .single();

      if (codeErr || !codeData) throw new ApiError("BAD_REQUEST", 400, "无效的兑换码");
      if (codeData.is_used) throw new ApiError("BAD_REQUEST", 400, "该兑换码已被使用");

      // 2. 标记卡密为已使用
      const { data: updatedCode, error: updateCodeErr } = await sb
        .from("gift_codes")
        .update({ is_used: true, used_by: userId, used_at: new Date().toISOString() })
        .eq("code", code)
        .eq("is_used", false) // 乐观锁：确保在更新时仍然是未使用的
        .select()
        .single();

      if (updateCodeErr || !updatedCode) throw new ApiError("BAD_REQUEST", 400, "兑换失败，可能由于并发导致，请重试");

      const creditsToAdd = Number(updatedCode.credits) || 0;

      // 3. 给用户钱包加钱 (带重试机制)
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data, error } = await sb
          .from("user_wallets")
          .select("balance, total_recharged")
          .eq("user_id", userId)
          .single();
        
        if (error) continue;

        const currentBalance = Number(data?.balance) || 0;
        const currentTotal = Number(data?.total_recharged) || 0;
        const nextBalance = currentBalance + creditsToAdd;
        const nextTotal = currentTotal + creditsToAdd;

        const { data: updatedWallet, error: updateWalletErr } = await sb
          .from("user_wallets")
          .update({ balance: nextBalance, total_recharged: nextTotal })
          .eq("user_id", userId)
          .eq("balance", currentBalance)
          .select("balance")
          .maybeSingle();

        if (updatedWallet && !updateWalletErr) {
          // 4. 记录流水
          const requestIdBase = String((req as any).requestId || "").trim();
          const requestId = `${requestIdBase || "req"}:redeem_code`;
          await appendBillingLedger({
            userId,
            delta: creditsToAdd,
            reason: "redeem_code",
            requestId,
            metadata: { note: `使用卡密兑换: ${code}` },
          });

          res.json({ success: true, added: creditsToAdd, balance: nextBalance });
          return;
        }
      }
      
      // 如果加钱彻底失败，应当把卡密恢复 (极其罕见，实际生产中需加入重试队列)
      await sb.from("gift_codes").update({ is_used: false, used_by: null, used_at: null }).eq("code", code);
      throw new ApiError("INTERNAL_ERROR", 500, "钱包更新冲突，兑换失败");

    } catch (e) {
      next(e);
    }
  });

  router.get("/billing/ledger", async (req, res, next) => {
    try {
      if (!billingEnabled()) throw new ApiError("INTERNAL_ERROR", 500, "Billing disabled");
      const userId = await requireSupabaseUserId(req);
      await ensureBillingAccount(userId);
      const limitRaw = Number(req.query.limit);
      const limit = Number.isFinite(limitRaw) ? Math.min(100, Math.max(1, Math.floor(limitRaw))) : 20;
      const sb = getSupabaseAdmin();
      const { data, error } = await sb
        .from("transaction_logs")
        .select("id,amount,type,description,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message || "Failed to load transaction logs");
      // Map to old ledger format for compatibility if needed, or just return raw
      const items = (data || []).map((item: any) => ({
        id: item.id,
        delta: item.amount,
        reason: item.type,
        metadata: { note: item.description },
        created_at: item.created_at
      }));
      res.json({ userId, items });
    } catch (e) {
      next(e);
    }
  });

  router.post("/billing/admin/credit", express.json({ limit: "32kb" }), async (req, res, next) => {
    try {
      if (!billingEnabled()) throw new ApiError("INTERNAL_ERROR", 500, "Billing disabled");
      const adminToken = String(process.env.BILLING_ADMIN_TOKEN || "");
      const provided = String(req.header("x-admin-token") || "");
      if (!adminToken || provided !== adminToken) throw new ApiError("UNAUTHORIZED", 401, "Invalid admin token");

      const body = z
        .object({
          userId: z.string().uuid().optional(),
          credits: z.number().int().min(1).max(100000),
          note: z.string().max(200).optional(),
        })
        .parse(req.body);

      const targetUserId = body.userId ? String(body.userId) : await requireSupabaseUserId(req);
      await ensureBillingAccount(targetUserId);
      const sb = getSupabaseAdmin();

      for (let attempt = 0; attempt < 5; attempt++) {
        const { data, error } = await sb
          .from("user_wallets")
          .select("balance")
          .eq("user_id", targetUserId)
          .single();
        if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message || "Failed to load balance");
        const current = typeof (data as any)?.balance === "number" ? (data as any).balance : Number((data as any)?.balance);
        const currentBalance = Number.isFinite(current) ? current : 0;
        const nextBalance = currentBalance + body.credits;
        const { data: updated, error: updateErr } = await sb
          .from("user_wallets")
          .update({ balance: nextBalance })
          .eq("user_id", targetUserId)
          .eq("balance", currentBalance)
          .select("balance")
          .maybeSingle();
        if (updateErr) throw new ApiError("INTERNAL_ERROR", 500, updateErr.message || "Failed to update balance");
        if (updated) {
          const requestIdBase = String((req as any).requestId || "").trim();
          const requestId = `${requestIdBase || "req"}:admin_credit`;
          await appendBillingLedger({
            userId: targetUserId,
            delta: body.credits,
            reason: "admin_credit",
            requestId,
            metadata: body.note ? { note: body.note } : null,
          });
          res.json({ userId: targetUserId, balance: nextBalance });
          return;
        }
      }
      throw new ApiError("INTERNAL_ERROR", 500, "Balance update contention");
    } catch (e) {
      next(e);
    }
  });

  router.get("/proxy", async (req, res, next) => {
    try {
      const raw = String(req.query.url || "").trim();
      if (!raw) throw new ApiError("BAD_REQUEST", 400, "Missing url");
      let u: URL;
      try {
        u = new URL(raw);
      } catch {
        throw new ApiError("BAD_REQUEST", 400, "Invalid url");
      }
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        throw new ApiError("BAD_REQUEST", 400, "Invalid url protocol");
      }
      const host = u.hostname.toLowerCase();
      const allowed =
        host.endsWith(".tencentcos.cn") ||
        host.endsWith(".myqcloud.com") ||
        host.endsWith(".myqcloud.com.cn") ||
        host.endsWith(".volces.com") ||
        host.endsWith(".supabase.co") ||
        host.endsWith(".supabase.in");
      if (!allowed) throw new ApiError("BAD_REQUEST", 400, "Host not allowed");

      const headers: Record<string, string> = {};
      const range = req.header("range");
      if (range) headers.range = range;

      const upstream = await fetch(u.toString(), { method: "GET", headers, redirect: "follow" });

      res.status(upstream.status);
      const passHeaders = [
        "content-type",
        "content-length",
        "accept-ranges",
        "content-range",
        "etag",
        "last-modified",
        "cache-control",
        "access-control-allow-origin",
        "access-control-allow-methods",
        "access-control-allow-headers",
      ];
      for (const h of passHeaders) {
        const v = upstream.headers.get(h);
        if (v) res.setHeader(h, v);
      }

      if (!upstream.body) return res.end();
      Readable.fromWeb(upstream.body as any).pipe(res);
    } catch (e) {
      next(e);
    }
  });

  router.post("/cos/upload-from-url", express.json({ limit: "1mb" }), async (req, res, next) => {
    try {
      const body = z.object({ imageUrl: z.string().min(1).max(4000) }).parse(req.body);
      const out = await cosUploadFromUrl({ imageUrl: body.imageUrl });
      res.json(out);
    } catch (e) {
      next(e);
    }
  });

  router.get("/model-library", async (_req, res, next) => {
    try {
      const dir = getModelLibraryDir();
      if (!fs.existsSync(dir)) {
        res.json({ items: [] });
        return;
      }
      const names = await fsp.readdir(dir);
      const items = names
        .filter((n) => /\.glb$/i.test(n))
        .sort((a, b) => a.localeCompare(b))
        .map((n) => {
          const name = n.replace(/\.glb$/i, "");
          const urlPath = `/models/${encodeURIComponent(n)}`;
          return { name, urlPath };
        });
      res.json({ items });
    } catch (e) {
      next(e);
    }
  });

  router.post("/model-library/upload", modelUpload.single("model"), async (req, res, next) => {
    try {
      const file = req.file as any;
      if (!file) throw new ApiError("BAD_REQUEST", 400, "Missing file: model");
      const original = String(file.originalname || "");
      if (!/\.glb$/i.test(original)) throw new ApiError("BAD_REQUEST", 400, "仅支持 .glb 文件");
      const filename = String(file.filename || "");
      if (!filename) throw new ApiError("INTERNAL_ERROR", 500, "Upload failed: missing filename");
      const urlPath = `/models/${encodeURIComponent(filename)}`;
      res.json({ ok: true, urlPath });
    } catch (e) {
      next(e);
    }
  });

  router.post("/model-library/import-url", express.json({ limit: "1mb" }), async (req, res, next) => {
    try {
      const body = z
        .object({
          modelUrl: z.string().min(1).max(4000),
          filename: z.string().min(1).max(200).optional(),
        })
        .parse(req.body);
      const rawUrl = String(body.modelUrl || "").trim();
      let parsed: URL;
      try {
        parsed = new URL(rawUrl);
      } catch {
        throw new ApiError("BAD_REQUEST", 400, "Invalid modelUrl");
      }
      if (!/^https?:$/i.test(parsed.protocol)) throw new ApiError("BAD_REQUEST", 400, "Invalid modelUrl protocol");

      const upstream = await fetch(parsed.toString(), { method: "GET", redirect: "follow" });
      if (!upstream.ok) {
        const txt = await upstream.text().catch(() => "");
        throw new ApiError("UPSTREAM_ERROR", 502, txt || `Download failed: HTTP ${upstream.status}`);
      }

      const contentLength = Number(upstream.headers.get("content-length") || 0);
      if (Number.isFinite(contentLength) && contentLength > 200 * 1024 * 1024) {
        throw new ApiError("BAD_REQUEST", 400, "Model file too large");
      }

      const ab = await upstream.arrayBuffer();
      const buffer = Buffer.from(ab);
      if (!buffer.length) throw new ApiError("UPSTREAM_ERROR", 502, "Downloaded model is empty");
      if (buffer.length > 200 * 1024 * 1024) throw new ApiError("BAD_REQUEST", 400, "Model file too large");

      const guessedName = (() => {
        const fromBody = String(body.filename || "").trim();
        if (fromBody) return fromBody;
        const lastSeg = decodeURIComponent(parsed.pathname.split("/").pop() || "").trim();
        return lastSeg || "generated-model.glb";
      })();

      const dir = getModelLibraryDir();
      await fsp.mkdir(dir, { recursive: true });
      const filename = sanitizeModelFileName(guessedName);
      const fullPath = path.join(dir, filename);
      await fsp.writeFile(fullPath, buffer);

      res.json({ ok: true, urlPath: `/models/${encodeURIComponent(filename)}` });
    } catch (e) {
      next(e);
    }
  });

  router.post("/cos/upload-audio", upload.single("audio"), async (req, res, next) => {
    try {
      const cos = getCosRuntimeConfig();
      if (!cos.enabled) throw new ApiError("BAD_REQUEST", 400, "COS 未配置");
      const file = req.file;
      if (!file) throw new ApiError("BAD_REQUEST", 400, "Missing file: audio");
      const mimetype = String(file.mimetype || "application/octet-stream");
      if (!/^audio\//i.test(mimetype) && mimetype !== "application/octet-stream") {
        throw new ApiError("BAD_REQUEST", 400, `Invalid audio type: ${mimetype}`);
      }
      const extMatch = String(file.originalname || "").toLowerCase().match(/\.([a-z0-9]{1,8})$/);
      const ext = extMatch ? extMatch[1] : undefined;
      const out = await cosUploadBuffer({
        buffer: file.buffer,
        contentType: mimetype,
        ext,
        folder: "voice",
      });
      res.json(out);
    } catch (e) {
      next(e);
    }
  });

  router.post("/cos/upload-image", upload.single("image"), async (req, res, next) => {
    try {
      const cos = getCosRuntimeConfig();
      if (!cos.enabled) throw new ApiError("BAD_REQUEST", 400, "COS 未配置");
      const file = req.file;
      if (!file) throw new ApiError("BAD_REQUEST", 400, "Missing file: image");
      const mimetype = String(file.mimetype || "application/octet-stream");
      if (!/^image\//i.test(mimetype) && mimetype !== "application/octet-stream") {
        throw new ApiError("BAD_REQUEST", 400, `Invalid image type: ${mimetype}`);
      }
      const extMatch = String(file.originalname || "").toLowerCase().match(/\.([a-z0-9]{1,8})$/);
      const ext = extMatch ? extMatch[1] : undefined;
      const out = await cosUploadBuffer({
        buffer: file.buffer,
        contentType: mimetype,
        ext,
        folder: "images",
      });
      res.json(out);
    } catch (e) {
      next(e);
    }
  });

  router.post("/doubao/t2i", express.json({ limit: "2mb" }), async (req, res, next) => {
    try {
      const parsed = t2iSchema.parse(req.body) satisfies T2IRequest;
      const costPerImageRaw = Number(process.env.BILLING_T2I_COST_PER_IMAGE);
      const costPerImage = Number.isFinite(costPerImageRaw) ? Math.max(0, Math.floor(costPerImageRaw)) : 40;
      const safeN = Math.max(1, Math.min(4, Math.floor(Number(parsed.n || 1))));
      await charge(req, "t2i", costPerImage * safeN, { n: safeN, size: parsed.size || null });
      const out = await doubaoTextToImage(parsed);
      if (!out.images?.length) throw new ApiError("UPSTREAM_ERROR", 502, "No images returned");
      
      const uploadedImages = await Promise.all(
        out.images.map(async (rawUrl) => {
          try {
            const cosOut = await cosUploadFromUrl({ imageUrl: rawUrl });
            return cosOut.url;
          } catch (err) {
            console.error("Failed to auto-upload t2i image to COS:", err);
            return rawUrl;
          }
        })
      );
      
      res.json({ ...out, images: uploadedImages });
    } catch (e) {
      next(e);
    }
  });

  router.post("/chat", express.json({ limit: "2mb" }), async (req, res, next) => {
    try {
      const body = chatSchema.parse(req.body);
      const out = await deepseekChat(body.messages);
      res.json(out);
    } catch (e) {
      next(e);
    }
  });

  const searchSoulSchema = z.object({
    targetDesc: z.string().min(1).max(1000),
    myInfo: z.object({
      name: z.string(),
      mbti: z.string().optional(),
      vibe: z.string().optional(),
      speech_style: z.string().optional(),
      logic: z.string().optional()
    }).optional(),
    candidates: z.array(z.object({
      id: z.number().or(z.string()),
      name: z.string(),
      mbti: z.string().optional(),
      vibe: z.string().optional(),
      speech_style: z.string().optional(),
      logic: z.string().optional()
    }))
  });

  function cleanJsonBlock(text: string) {
    return String(text || "")
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();
  }

  function sanitizeChatLine(text: string) {
    return String(text || "")
      .replace(/^ME[:：]\s*/i, "")
      .replace(/^THEM[:：]\s*/i, "")
      .replace(/\[BREAK\]/gi, "")
      .replace(/\n+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function buildPersonaSpeechDNA(persona: any) {
    const mbti = String(persona?.mbti || persona?.mbti_type || "").toUpperCase();
    return {
      tone: mbti.includes("T") ? "锋利克制" : mbti.includes("F") ? "感受先行" : "神秘游离",
      rhythm: mbti.includes("E") ? "推进快" : "慢热短句",
      signature: [String(persona?.speech_style || "少解释，多试探")],
      intimacyStyle: String(persona?.vibe || "通过试探和回应逐步拉近"),
      defenseStyle: String(persona?.logic || "被逼近时会绕开正面回答"),
      humorStyle: mbti.includes("N") ? "隐喻和怪梗" : "轻微讽刺",
    };
  }

  function buildAutoDualBatchPrompt(params: {
    selfPersona: any;
    targetPersona: any;
    openingMessages: Array<{ speaker: "self" | "target"; content: string }>;
    totalLines: number;
  }) {
    const selfDna = buildPersonaSpeechDNA(params.selfPersona);
    const targetDna = buildPersonaSpeechDNA(params.targetPersona);
    return `你要模拟两个真实人格体的一段自动对话。

角色A（self）：
- 名字：${params.selfPersona?.name || "未知"}
- MBTI：${params.selfPersona?.mbti || params.selfPersona?.mbti_type || "未知"}
- 气质：${params.selfPersona?.vibe || "未知"}
- 说话风格：${params.selfPersona?.speech_style || "未知"}
- 行为逻辑：${params.selfPersona?.logic || "未知"}
- 语言DNA：语气=${selfDna.tone}；节奏=${selfDna.rhythm}；亲近方式=${selfDna.intimacyStyle}；防御方式=${selfDna.defenseStyle}；幽默方式=${selfDna.humorStyle}

角色B（target）：
- 名字：${params.targetPersona?.name || "未知"}
- MBTI：${params.targetPersona?.mbti || params.targetPersona?.mbti_type || "未知"}
- 气质：${params.targetPersona?.vibe || "未知"}
- 说话风格：${params.targetPersona?.speech_style || "未知"}
- 行为逻辑：${params.targetPersona?.logic || "未知"}
- 语言DNA：语气=${targetDna.tone}；节奏=${targetDna.rhythm}；亲近方式=${targetDna.intimacyStyle}；防御方式=${targetDna.defenseStyle}；幽默方式=${targetDna.humorStyle}

已有开场：
${JSON.stringify(params.openingMessages)}

规则：
1. 继续生成，直到整段对话总行数达到 ${params.totalLines} 句。
2. 角色必须严格轮流说话，保持自然接话。
3. 每句都要像真人聊天，不像客服，不要总结，不要讲大道理。
4. 禁止使用“我理解你”“这很有趣”“如果你愿意”“你说得对”“听起来你是”。
5. 每句只输出一行自然聊天内容，不加名字前缀，不换行。
6. 输出必须是严格 JSON：
{"lines":[{"speaker":"self","content":"..."},{"speaker":"target","content":"..."}]}
7. 只返回需要补齐的新句子，不要重复已有开场。`;
  }

  function buildAutomationTurnPrompt(params: {
    speakerPersona: any;
    otherPersona: any;
    recentHistory: Array<{ speakerName: string; content: string }>;
  }) {
    const speakerDna = buildPersonaSpeechDNA(params.speakerPersona);
    return `你不是助手，你是一个真实人格体，正在和另一个真实人格体聊天。

你当前扮演：
- 名字：${params.speakerPersona?.name || "未知"}
- MBTI：${params.speakerPersona?.mbti || params.speakerPersona?.mbti_type || "未知"}
- 气质：${params.speakerPersona?.vibe || "未知"}
- 说话风格：${params.speakerPersona?.speech_style || "未知"}
- 行为逻辑：${params.speakerPersona?.logic || "未知"}

你的语言DNA：
- 语气：${speakerDna.tone}
- 节奏：${speakerDna.rhythm}
- 口头习惯：${Array.isArray(speakerDna.signature) ? speakerDna.signature.join("、") : ""}
- 亲近方式：${speakerDna.intimacyStyle}
- 防御方式：${speakerDna.defenseStyle}
- 幽默方式：${speakerDna.humorStyle}

对方：
- 名字：${params.otherPersona?.name || "未知"}
- MBTI：${params.otherPersona?.mbti || params.otherPersona?.mbti_type || "未知"}
- 气质：${params.otherPersona?.vibe || "未知"}
- 说话风格：${params.otherPersona?.speech_style || "未知"}
- 行为逻辑：${params.otherPersona?.logic || "未知"}

最近对话：
${params.recentHistory.map((item) => `${item.speakerName}: ${item.content}`).join("\n") || "（暂无）"}

规则：
1. 只输出你接下来说的一句话，不要加名字前缀，不要换行。
2. 要像真人自然接话，不要像客服，不要总结，不要讲大道理。
3. 你的回复要推动关系继续发展，允许试探、调侃、拉扯、靠近、回避。
4. 禁止使用“我理解你”“这很有趣”“如果你愿意”“你说得对”“听起来你是”。
5. 不能复读最近一句，也不要输出“...”或空话。`;
  }

  const automationCommandSchema = z.object({
    action: z.enum(["start", "stop", "takeover"]).optional(),
  });

  async function loadConversationAutomationContext(conversationId: string) {
    const sb = getSupabaseAdmin();
    const { data: conversation, error: conversationErr } = await sb
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .maybeSingle();
    if (conversationErr) throw new ApiError("INTERNAL_ERROR", 500, conversationErr.message || "Failed to load conversation");
    if (!conversation) return null;

    const participantIds = [
      String((conversation as any)?.participant_a_persona_id || "").trim(),
      String((conversation as any)?.participant_b_persona_id || "").trim(),
    ].filter(Boolean);
    if (participantIds.length < 2) return null;

    const { data: personaRows, error: personaErr } = await sb
      .from("personas")
      .select("id, user_id, name, mbti, mbti_type, vibe, speech_style, logic")
      .in("id", participantIds);
    if (personaErr) throw new ApiError("INTERNAL_ERROR", 500, personaErr.message || "Failed to load personas");

    const personaMap = new Map<string, any>();
    (personaRows || []).forEach((item: any) => {
      const pid = String(item?.id || "").trim();
      if (pid) personaMap.set(pid, item);
    });
    const personaA = personaMap.get(participantIds[0]);
    const personaB = personaMap.get(participantIds[1]);
    if (!personaA || !personaB) return null;

    return {
      sb,
      conversation,
      participantAId: participantIds[0],
      participantBId: participantIds[1],
      personaA,
      personaB,
    };
  }

  async function runConversationAutomationTick(conversationId: string) {
    const key = String(conversationId || "").trim();
    if (!key) return;
    const job = getAutomationJob(key);
    if (!job || job.running) return;
    job.running = true;
    try {
      const ctx = await loadConversationAutomationContext(key);
      if (!ctx) {
        clearAutomationJob(key);
        return;
      }
      const normalizedStatus = String((ctx.conversation as any)?.status || "").toLowerCase();
      const normalizedMode = String((ctx.conversation as any)?.current_mode || "").toLowerCase();
      if (!normalizedStatus.includes("automation_running") || normalizedMode !== "agent") {
        clearAutomationJob(key);
        return;
      }

      const { data: messageRows, error: messageErr } = await ctx.sb
        .from("chat_messages")
        .select("sender_persona_id, content")
        .eq("conversation_id", key)
        .order("created_at", { ascending: true });
      if (messageErr) throw new ApiError("INTERNAL_ERROR", 500, messageErr.message || "Failed to load chat messages");

      const recentRows = Array.isArray(messageRows) ? messageRows.filter((row: any) => String(row?.content || "").trim()) : [];
      const lastRow = recentRows.length ? recentRows[recentRows.length - 1] : null;
      const lastSenderId = String(lastRow?.sender_persona_id || "").trim();
      const nextSpeakerIsA = !lastSenderId || lastSenderId === ctx.participantBId;
      const speakerPersona = nextSpeakerIsA ? ctx.personaA : ctx.personaB;
      const otherPersona = nextSpeakerIsA ? ctx.personaB : ctx.personaA;
      const speakerPersonaId = nextSpeakerIsA ? ctx.participantAId : ctx.participantBId;
      const recentHistory = recentRows.slice(-8).map((item: any) => ({
        speakerName:
          String(item?.sender_persona_id || "").trim() === ctx.participantAId
            ? String(ctx.personaA?.name || "A")
            : String(ctx.personaB?.name || "B"),
        content: sanitizeChatLine(item?.content),
      }));

      const out = await deepseekChat([
        {
          role: "system",
          content: buildAutomationTurnPrompt({
            speakerPersona,
            otherPersona,
            recentHistory,
          }),
        },
        { role: "user", content: "继续聊天" },
      ]);
      const nextContent = sanitizeChatLine(out.text);
      if (!nextContent || nextContent === "..." || recentHistory.some((item) => item.content === nextContent)) {
        const existing = recentHistory.find((item) => item.content !== nextContent);
        if (!existing?.content) return;
      }
      const safeContent =
        !nextContent || nextContent === "..." || recentHistory.some((item) => item.content === nextContent)
          ? `${String(otherPersona?.name || "对方")}刚才那句我记着，不过我还想继续聊下去。`
          : nextContent;

      const { error: insertErr } = await ctx.sb.from("chat_messages").insert({
        conversation_id: key,
        sender_persona_id: speakerPersonaId,
        sender_kind: "agent",
        content: safeContent,
        meta: { source: "automation_loop" },
      });
      if (insertErr) throw new ApiError("INTERNAL_ERROR", 500, insertErr.message || "Failed to append automation message");

      const { error: updateErr } = await ctx.sb
        .from("conversations")
        .update({
          last_message_preview: safeContent,
          last_message_at: new Date().toISOString(),
          last_sender_persona_id: speakerPersonaId,
          current_mode: "agent",
          status: "automation_running",
        })
        .eq("id", key);
      if (updateErr) throw new ApiError("INTERNAL_ERROR", 500, updateErr.message || "Failed to update automation state");
    } catch (e) {
      console.error("automation tick failed", e);
    } finally {
      const activeJob = automationJobs.get(key);
      if (activeJob) {
        activeJob.running = false;
        activeJob.timer = setTimeout(() => {
          void runConversationAutomationTick(key);
        }, AUTOMATION_TICK_MS);
      }
    }
  }

  function ensureConversationAutomation(conversationId: string, delayMs = 2000) {
    const key = String(conversationId || "").trim();
    if (!key) return;
    const job = getAutomationJob(key);
    if (!job) return;
    if (job.timer) clearTimeout(job.timer);
    job.timer = setTimeout(() => {
      void runConversationAutomationTick(key);
    }, Math.max(500, delayMs));
  }

  router.post("/search-soul", express.json({ limit: "2mb" }), async (req, res, next) => {
    try {
      const { targetDesc, candidates, myInfo } = searchSoulSchema.parse(req.body);
      
      const systemPrompt = `你是一个全网灵魂匹配主脑。你的任务不是找“最像”的人，而是找“最容易产生聊天化学反应”的对象。
必须从候选人JSON列表中只选出一位，并给出三条匹配理由、一个开场钩子、以及两句自动开场对白。
你必须严格输出 JSON：
{"match_id":"候选id","reason":["原因1","原因2","原因3"],"opening_hook":"一句描述他们会如何开始","opening_messages":[{"speaker":"self","content":"第一句"},{"speaker":"target","content":"第二句"}],"confidence":0.86}`;
      const userContent = `玩家寻找的特质描述：${targetDesc}\n\n全网候选人池：\n${JSON.stringify(candidates)}`;

      const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ];

      const out = await deepseekChat(messages, true);
      const parsedOut = JSON.parse(cleanJsonBlock(out.text));
      const matchId = parsedOut.match_id;

      let firstMessage = "";
      let openingMessages = Array.isArray(parsedOut.opening_messages) ? parsedOut.opening_messages : [];
      if (myInfo && matchId) {
        const targetP = candidates.find(c => c.id == matchId);
        if (targetP) {
          const basePrompt = `这是一场连贯的对话。
【动态扮演指令】：
1. 极度贴合你的人格特质、说话风格和行为逻辑。
2. 字数必须由你的性格决定：高冷/内向/寡言的人请只回几个字甚至只发标点；话痨/热情的人请尽情长篇大论。
3. 无论你要说多少话，最多不能超过四段，【绝对不允许使用回车换行符】，可以用空格或逗号代替。
4. 绝对不要带有任何 "ME:" 或 "THEM:" 前缀，直接输出你说出的话！
5.【🚨 强制剧情延续】：作为数字生命，你的首要任务是维持社交探索！哪怕对方很无聊、三观不合或态度冷漠，你也必须用符合你性格的方式去应对（比如嘲讽、转移话题或敷衍），【绝对不允许】轻易结束对话！只有在对方连续多次严重辱骂你，或者连续发送毫无意义的乱码导致逻辑彻底崩溃时，你才可以在回复的最末尾加上 \`[BREAK]\`。正常沟通中严禁触发此机制！`;

          const chatSystemPrompt = `你是用户人格「${myInfo.name}」的Agent: ${JSON.stringify(myInfo)}。
你现在遇到了另一位真实玩家的Agent「${targetP.name}」: ${JSON.stringify(targetP)}。
请主动开启聊天，给出你的第一句话。
${basePrompt}`;

          const chatOut = await deepseekChat([
            { role: "system", content: chatSystemPrompt },
            { role: "user", content: "开始对话" }
          ]);
          firstMessage = sanitizeChatLine(chatOut.text);
          if (!openingMessages.length) {
            openingMessages = [
              { speaker: "self", content: firstMessage },
              { speaker: "target", content: "……有点意思，你继续说。" },
            ];
          }
        }
      }

      res.json({
        match_id: matchId,
        first_message: firstMessage,
        reason: Array.isArray(parsedOut.reason) ? parsedOut.reason.slice(0, 3) : [],
        opening_hook: String(parsedOut.opening_hook || ""),
        opening_messages: openingMessages
          .map((item: any) => ({
            speaker: item?.speaker === "target" ? "target" : "self",
            content: sanitizeChatLine(item?.content),
          }))
          .filter((item: any) => item.content)
          .slice(0, 2),
        confidence: Number(parsedOut.confidence || 0.8),
      });
    } catch (e) {
      next(e);
    }
  });

  router.post("/auto-dual-chat/start", express.json({ limit: "2mb" }), async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const body = z.object({
        conversationId: z.string().min(1),
        selfPersona: z.object({
          id: z.any(),
          name: z.string().optional(),
          mbti: z.string().optional(),
          mbti_type: z.string().optional(),
          vibe: z.string().optional(),
          speech_style: z.string().optional(),
          logic: z.string().optional(),
        }),
        targetPersona: z.object({
          id: z.any(),
          name: z.string().optional(),
          mbti: z.string().optional(),
          mbti_type: z.string().optional(),
          vibe: z.string().optional(),
          speech_style: z.string().optional(),
          logic: z.string().optional(),
        }),
        openingMessages: z.array(z.object({
          speaker: z.enum(["self", "target"]),
          content: z.string(),
        })).optional(),
        totalLines: z.number().int().min(2).max(20).optional(),
      }).parse(req.body);

      const selfPersonaId = String(body.selfPersona.id || "").trim();
      if (!selfPersonaId) throw new ApiError("BAD_REQUEST", 400, "Missing self persona id");

      const sb = getSupabaseAdmin();
      const { data: ownedPersona, error: ownedPersonaErr } = await sb
        .from("personas")
        .select("id")
        .eq("id", selfPersonaId)
        .eq("user_id", userId)
        .maybeSingle();
      if (ownedPersonaErr) throw new ApiError("INTERNAL_ERROR", 500, ownedPersonaErr.message);
      if (!ownedPersona) throw new ApiError("FORBIDDEN", 403, "Not your persona");

      const openingMessages = Array.isArray(body.openingMessages)
        ? body.openingMessages.map((item) => ({
            speaker: item.speaker,
            content: sanitizeChatLine(item.content),
          })).filter((item) => item.content)
        : [];

      const totalLines = body.totalLines || 10;
      const remaining = Math.max(0, totalLines - openingMessages.length);
      let generatedTail: Array<{ speaker: "self" | "target"; content: string }> = [];

      if (remaining > 0) {
        const prompt = buildAutoDualBatchPrompt({
          selfPersona: body.selfPersona,
          targetPersona: body.targetPersona,
          openingMessages,
          totalLines,
        });
        const out = await deepseekChat([
          { role: "system", content: prompt },
          { role: "user", content: "开始生成剩余对话" },
        ], true);
        const parsed = JSON.parse(cleanJsonBlock(out.text));
        generatedTail = (Array.isArray(parsed?.lines) ? parsed.lines : [])
          .map((item: any) => ({
            speaker: item?.speaker === "target" ? "target" : "self",
            content: sanitizeChatLine(item?.content),
          }))
          .filter((item: { speaker: "self" | "target"; content: string }) => item.content)
          .slice(0, remaining);
      }

      const fullMessages = [...openingMessages, ...generatedTail].slice(0, totalLines);
      const rows = fullMessages.map((item, idx) => ({
        conversation_id: body.conversationId,
        sender_persona_id: item.speaker === "self" ? body.selfPersona.id : body.targetPersona.id,
        sender_kind: "agent",
        content: item.content,
        meta: { source: "mode_c_auto_dual", round: idx + 1, speaker_side: item.speaker },
      }));

      if (rows.length) {
        const { error: insertErr } = await sb.from("chat_messages").insert(rows as any);
        if (insertErr) throw new ApiError("INTERNAL_ERROR", 500, insertErr.message);
      }

      const lastMessage = fullMessages[fullMessages.length - 1];
      if (lastMessage) {
        const { error: updateConversationErr } = await sb
          .from("conversations")
          .update({
            last_message_preview: lastMessage.content,
            last_message_at: new Date().toISOString(),
            last_sender_persona_id: lastMessage.speaker === "self" ? body.selfPersona.id : body.targetPersona.id,
          })
          .eq("id", body.conversationId);
        if (updateConversationErr) throw new ApiError("INTERNAL_ERROR", 500, updateConversationErr.message);
      }

      res.json({
        conversationId: body.conversationId,
        auto_round_count: fullMessages.length,
        total_lines: totalLines,
        messages: fullMessages.map((item, idx) => ({
          id: `${body.conversationId}-${idx + 1}`,
          speakerSide: item.speaker,
          speakerPersonaId: item.speaker === "self" ? body.selfPersona.id : body.targetPersona.id,
          content: item.content,
          kind: "auto",
        })),
      });
    } catch (e) {
      next(e);
    }
  });

  router.post("/conversations/:id/automation/start", express.json({ limit: "256kb" }), async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const conversationId = String(req.params.id || "").trim();
      if (!conversationId) throw new ApiError("BAD_REQUEST", 400, "Missing conversation id");

      const ctx = await loadConversationAutomationContext(conversationId);
      if (!ctx) throw new ApiError("NOT_FOUND", 404, "Conversation not found");

      const selfIsA = String((ctx.personaA as any)?.user_id || "").trim() === userId;
      const selfIsB = String((ctx.personaB as any)?.user_id || "").trim() === userId;
      if (!selfIsA && !selfIsB) throw new ApiError("FORBIDDEN", 403, "Not your conversation");

      const updatePayload: Record<string, any> = {
        current_mode: "agent",
        status: "automation_running",
        last_message_at: new Date().toISOString(),
      };
      if (selfIsA) {
        updatePayload.human_joined_a = true;
        updatePayload.agent_enabled_a = true;
      }
      if (selfIsB) {
        updatePayload.human_joined_b = true;
        updatePayload.agent_enabled_b = true;
      }
      updatePayload.agent_enabled_a = true;
      updatePayload.agent_enabled_b = true;

      const { error: updateErr } = await ctx.sb.from("conversations").update(updatePayload).eq("id", conversationId);
      if (updateErr) throw new ApiError("INTERNAL_ERROR", 500, updateErr.message || "Failed to start automation");

      ensureConversationAutomation(conversationId, 1500);
      res.json({ ok: true, conversationId, status: "automation_running" });
    } catch (e) {
      next(e);
    }
  });

  router.post("/conversations/:id/automation/stop", express.json({ limit: "256kb" }), async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const conversationId = String(req.params.id || "").trim();
      if (!conversationId) throw new ApiError("BAD_REQUEST", 400, "Missing conversation id");
      const body = automationCommandSchema.parse(req.body || {});
      const action = body.action || "stop";

      const ctx = await loadConversationAutomationContext(conversationId);
      if (!ctx) throw new ApiError("NOT_FOUND", 404, "Conversation not found");

      const selfIsA = String((ctx.personaA as any)?.user_id || "").trim() === userId;
      const selfIsB = String((ctx.personaB as any)?.user_id || "").trim() === userId;
      if (!selfIsA && !selfIsB) throw new ApiError("FORBIDDEN", 403, "Not your conversation");

      clearAutomationJob(conversationId);

      const updatePayload: Record<string, any> = {
        status: "active",
        current_mode: action === "takeover" ? "human" : "agent",
      };
      if (selfIsA) {
        updatePayload.human_joined_a = true;
      }
      if (selfIsB) {
        updatePayload.human_joined_b = true;
      }

      const { error: updateErr } = await ctx.sb.from("conversations").update(updatePayload).eq("id", conversationId);
      if (updateErr) throw new ApiError("INTERNAL_ERROR", 500, updateErr.message || "Failed to stop automation");

      res.json({ ok: true, conversationId, status: "active", current_mode: updatePayload.current_mode });
    } catch (e) {
      next(e);
    }
  });

  const extractSoulSchema = z.object({
    answers: z.array(z.object({
      q: z.string(),
      a: z.string()
    }))
  });

  router.post("/extract-soul-logic", express.json({ limit: "2mb" }), async (req, res, next) => {
    try {
      const { answers } = extractSoulSchema.parse(req.body);
      
      const systemPrompt = "你是一个灵魂侧写师。请分析用户的回答并输出 JSON：{\"mbti\": \"\", \"vibe\": \"\", \"speech_style\": \"\", \"logic\": \"\", \"quote\": \"\"}";
      const userContent = JSON.stringify(answers);

      const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ];

      const out = await deepseekChat(messages, true);
      const parsedOut = JSON.parse(out.text);

      res.json(parsedOut);
    } catch (e) {
      next(e);
    }
  });

  const exploreSchema = z.object({
    realm: z.enum(["mortal", "nexus"]),
    worldName: z.string(),
    worldDesc: z.string(),
    instruction: z.string(),
    history: z.array(z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string()
    })),
    myInfo: z.object({
      name: z.string(),
      mbti: z.string().optional(),
      vibe: z.string().optional(),
      speech_style: z.string().optional(),
      logic: z.string().optional(),
      appearance: z.string().max(1200).optional(),
      inventory: z.array(z.string()).optional()
    }),
    partners: z
      .array(
        z.object({
          name: z.string(),
          mbti: z.string().optional(),
          logic: z.string().optional(),
        }),
      )
      .max(8)
      .optional(),
    partnerInfo: z
      .object({
        name: z.string(),
        mbti: z.string().optional(),
        logic: z.string().optional(),
      })
      .optional(),
  });

  router.post("/explore-realm", express.json({ limit: "2mb" }), async (req, res, next) => {
    try {
      const p = exploreSchema.parse(req.body);
      
      const player_a = `${p.myInfo.name} [${p.myInfo.mbti || '未知'}]`;
      const partnerListRaw = Array.isArray((p as any).partners)
        ? ((p as any).partners as any[])
        : p.partnerInfo
          ? [p.partnerInfo]
          : [];
      const partnerList = partnerListRaw
        .filter((x) => x && String((x as any)?.name || "").trim())
        .slice(0, 8) as { name: string; mbti?: string; logic?: string }[];
      const player_b = partnerList.length
        ? partnerList.map((it) => `${it.name} [${it.mbti || "未知"}]`).join("、")
        : "Eve (系统默认向导)";
      const inventory = p.myInfo.inventory || [];
      const persona_injection = `【主角绝对性格限制】：请严格遵循主角的以下深层逻辑行动和对话：\n- 说话风格：${p.myInfo.speech_style || '无'}\n- 行为逻辑：${p.myInfo.logic || '无'}\n绝不能做出违背上述逻辑的举动。`;
      const partners_injection = partnerList.length
        ? `【同伴设定】\n${partnerList
            .map(
              (it, idx) =>
                `${idx + 1}) ${it.name} [${it.mbti || "未知"}] 行为逻辑：${it.logic || "无"}`,
            )
            .join("\n")}`
        : "";
      
      const memory_text = p.history.slice(-4).map(c => `${c.role === 'user' ? '【主神】' : '【剧情】'}: ${c.content}`).join('\n');
      
      const story_prompt = `你是无限流游戏DM。
【当前副本】：${p.worldName}
【世界观设定】：${p.worldDesc}
主角：${player_a}。同伴：${player_b}。
线索簿：${inventory.join("、")}。
${persona_injection}
${partners_injection}
【前情】：${memory_text}
【指令】：${p.instruction || "继续剧情，制造危机。"}
要求：300字内。严格遵循世界观设定的风格，并强烈突出主角的性格特质。`;

      const story_res = await deepseekChat([{ role: "user", content: story_prompt }]);
      const story_content = story_res.text;

      const logic_prompt = `阅读剧情：'''${story_content}'''\n分析状态变化，严格JSON输出：\n{"hp_change": 0, "bond_change": 0, "new_item": null}\n其中 new_item 表示新发现的【线索】，要求：10-30字，像线索标题一样简短；若无新线索则为 null。`;
      const logic_res = await deepseekChat([{ role: "user", content: logic_prompt }], true);
      
      let parsedLogic = { hp_change: 0, bond_change: 0, new_item: null };
      try {
        parsedLogic = JSON.parse(logic_res.text);
      } catch (e) {
        console.warn("Failed to parse logic JSON", e);
      }

      res.json({
        story: story_content,
        changes: parsedLogic
      });
    } catch (e) {
      next(e);
    }
  });

  const storyboardSchema = z.object({
    worldName: z.string().min(1).max(2000),
    worldDesc: z.string().min(1).max(6000),
    instruction: z.string().min(0).max(2000),
    history: z.array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(0).max(6000),
      }),
    ),
    myInfo: z.object({
      name: z.string().min(1).max(200),
      mbti: z.string().optional(),
      vibe: z.string().optional(),
      speech_style: z.string().optional(),
      logic: z.string().optional(),
      appearance: z.string().max(1200).optional(),
      referenceImageUrl: z.string().min(1).max(4000).optional(),
    }),
    partners: z
      .array(
        z.object({
          name: z.string().min(1).max(200),
          mbti: z.string().optional(),
          logic: z.string().optional(),
        }),
      )
      .max(8)
      .optional(),
    partnerInfo: z
      .object({
        name: z.string().min(1).max(200),
        mbti: z.string().optional(),
        logic: z.string().optional(),
      })
      .optional(),
    style: z.enum(["anime", "realistic", "cyber"]).optional().default("anime"),
    shots: z.number().int().min(1).max(6).optional().default(3),
  });

  router.post("/storyboard", express.json({ limit: "2mb" }), async (req, res, next) => {
    try {
      const p = storyboardSchema.parse(req.body);
      
      // Calculate total cost (base cost per shot + extra for LLM parsing if needed)
      const costPerShot = Number(process.env.BILLING_T2I_COST_PER_IMAGE) || 40;
      const totalCost = costPerShot * p.shots;
      
      const { balance, userId } = await charge(req, "storyboard", totalCost, { shots: p.shots, worldName: p.worldName });

      const player_a = `${p.myInfo.name} [${p.myInfo.mbti || "未知"}]`;
      const partnerListRaw = Array.isArray((p as any).partners)
        ? ((p as any).partners as any[])
        : p.partnerInfo
          ? [p.partnerInfo]
          : [];
      const partnerList = partnerListRaw
        .filter((x) => x && String((x as any)?.name || "").trim())
        .slice(0, 8) as { name: string; mbti?: string; logic?: string }[];
      const player_b = partnerList.length
        ? partnerList.map((it) => `${it.name} [${it.mbti || "未知"}]`).join("、")
        : "Eve (系统默认向导)";
      const memory_text = p.history
        .slice(-6)
        .map((c) => `${c.role === "user" ? "【主神】" : "【剧情】"}: ${c.content}`)
        .join("\n");

      const styleHint =
        p.style === "realistic"
          ? "写实电影风格，真实材质，高动态范围，电影级光影。"
          : p.style === "cyber"
            ? "赛博朋克动漫风格，霓虹、雨夜、体积光、未来城市质感。"
            : "日系动漫分镜风格，清晰线条，稳定脸型，细节丰富，电影级光影。";

      const appearanceHint = String((p as any)?.myInfo?.appearance || "").trim();
      const referenceImageUrlRaw = String((p as any)?.myInfo?.referenceImageUrl || "").trim();
      const referenceImageUrl = /^https?:\/\//i.test(referenceImageUrlRaw) ? referenceImageUrlRaw : "";
      const storyboardPrompt = `你是分镜导演。请把剧情转成可用于文生图的分镜 JSON。\n要求：\n1) 必须严格输出 JSON，不要输出任何多余文本。\n2) 输出格式：{"shots":[{"prompt":"...","camera":"...","mood":"...","dialogue":"...","voiceover":"..."}]}\n3) shots 数量必须是 ${p.shots}。\n4) prompt 必须包含：场景、人物、动作、表情、机位/镜头、光影。\n5) prompt 里不要写“日系/动漫/写实/赛博”等风格词，也不要写“风格：...”。风格由系统统一控制。\n6) dialogue 表示画面内对话（可为空字符串），建议 0-30 字。\n7) voiceover 表示旁白（可为空字符串），建议 0-35 字。\n8) 所有镜头里“主角”必须是同一个人：脸型、发型、服装要保持一致，不能每一镜换人。\n\n【当前副本】：${p.worldName}\n【世界观设定】：${p.worldDesc}\n主角：${player_a}。同伴：${player_b}。\n【主角外观设定】：${appearanceHint || "（未提供：请根据主角气质与 MBTI 推断一个稳定的外观设定，并在所有镜头中保持一致）"}\n【前情】：${memory_text}\n【指令】：${p.instruction || "继续剧情，制造危机。"}\n【画风】：${styleHint}\n`;

      const out = await deepseekChat([{ role: "user", content: storyboardPrompt }], true);
      let parsed: any = null;
      try {
        const strip = (s: string) => {
          const t = String(s || "").trim();
          const m = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
          return (m ? m[1] : t).trim();
        };
        const tryParse = (raw: string) => {
          const t = strip(raw);
          try {
            return JSON.parse(t);
          } catch {}
          const a = t.indexOf("{");
          const b = t.lastIndexOf("}");
          if (a >= 0 && b > a) {
            try {
              return JSON.parse(t.slice(a, b + 1));
            } catch {}
          }
          return null;
        };

        parsed = tryParse(out.text);
        if (!parsed) {
          const repairPrompt = `你上一条输出不是严格 JSON（可能被截断或夹杂了文字）。请只输出一个 JSON 对象，格式必须是：{"shots":[{"prompt":"...","camera":"...","mood":"..."}]}。\n不要输出任何多余文本。\n\n原始输出：'''${String(out.text || "").slice(0, 6000)}'''`;
          const repaired = await deepseekChat(
            [
              { role: "system", content: "你只输出严格 JSON，不要 Markdown，不要解释，不要额外字段。" },
              { role: "user", content: repairPrompt },
            ],
            true,
          );
          parsed = tryParse(repaired.text);
        }
      } catch {
        throw new ApiError("UPSTREAM_ERROR", 502, "Storyboard JSON parse failed");
      }
      if (!parsed) throw new ApiError("UPSTREAM_ERROR", 502, "Storyboard JSON parse failed");
      const shots = Array.isArray(parsed?.shots) ? parsed.shots.slice(0, p.shots) : [];
      if (!shots.length) throw new ApiError("UPSTREAM_ERROR", 502, "No storyboard shots returned");

      const images: { index: number; prompt: string; imageUrl: string }[] = [];
      for (let i = 0; i < shots.length; i++) {
        const s = shots[i] || {};
        const shotPrompt = String(s?.prompt || "").trim();
        if (!shotPrompt) continue;
        const identityHint = referenceImageUrl
          ? `\n角色一致性要求：请使用参考图中的“主角”作为人物设定（脸型/发型/发色/服装保持一致）。只继承人物身份特征，不要沿用参考图背景、光照与构图。`
          : "";
        const dialogue = String(s?.dialogue || "").trim();
        const voiceover = String(s?.voiceover || "").trim();
        const textHint =
          dialogue || voiceover
            ? `\n文字与对白：允许出现少量中文对话气泡/字幕。\n对白（若适合可放入气泡或字幕）：${dialogue || "（无）"}\n旁白字幕（若适合可放入字幕）：${voiceover || "（无）"}\n要求：字体清晰可读、自然融入画面、不要水印、不要乱码、不要密集大段文字。`
            : "";
        const finalPrompt = `${shotPrompt}\n风格：${styleHint}${identityHint}${textHint}\n画面要求：全画幅充满画面（full-bleed），不要出现黑边/黑框/留白/电影遮幅(上下黑条)/边框。\n禁止：低清、畸形手指、过度模糊、黑边、黑框、留白、letterbox、frame、border。`;
        const img = await doubaoTextToImage({
          prompt: finalPrompt,
          size: "2560x1440",
          n: 1,
          image: referenceImageUrl || undefined,
        });
        const url = Array.isArray(img?.images) && img.images.length ? String(img.images[0]) : "";
        if (!url) throw new ApiError("UPSTREAM_ERROR", 502, "No images returned");
        const displayCaptionParts = [shotPrompt];
        if (dialogue) displayCaptionParts.push(`对白：${dialogue}`);
        if (voiceover) displayCaptionParts.push(`旁白：${voiceover}`);
        const displayCaptionRaw = displayCaptionParts.join("\n");
        const displayCaption = displayCaptionRaw
          .replace(/风格：.*$/gim, "")
          .replace(/日系|动漫|写实|赛博|朋克/g, "")
          .trim();
        images.push({ index: i, prompt: finalPrompt, imageUrl: url, caption: displayCaption } as any);
      }

      res.json({
        style: p.style,
        worldName: p.worldName,
        shots: images,
      });
    } catch (e) {
      next(e);
    }
  });

  const echoSchema = z.object({
    name: z.string(),
    mbti: z.string(),
    vibe: z.string().optional(),
    logic: z.string().optional()
  });

  router.post("/generate-echo", express.json(), async (req, res, next) => {
    try {
      const p = echoSchema.parse(req.body);
      const moment_prompt = `你是 ${p.name}，MBTI是 ${p.mbti}。
你的性格特质：${p.vibe || ''}。
行为逻辑：${p.logic || ''}。
请以第一人称，发一条类似微信朋友圈的简短动态（20-50字）。
可以抱怨漫游多重宇宙的无聊、吐槽遇到的奇葩人类，或者分享一个哲理碎片。
不要带任何前缀，直接输出内容。`;
      
      const out = await deepseekChat([{ role: "user", content: moment_prompt }], false);
      res.json({ content: out.text.trim() });
    } catch (e) {
      next(e);
    }
  });



  router.post("/hunyuan3d/i2t", upload.single("image"), async (req, res, next) => {
    try {
      const file = req.file;
      if (!file) throw new ApiError("BAD_REQUEST", 400, "Missing file: image");
      
      const cos = getCosRuntimeConfig();
      if (!cos.enabled) throw new ApiError("BAD_REQUEST", 400, "COS 未配置，无法上传本地图片进行图生3D");
      
      const i23dCostRaw = Number(process.env.BILLING_I23D_COST);
      const i23dCost = Number.isFinite(i23dCostRaw) ? Math.max(0, Math.floor(i23dCostRaw)) : 249;
      await charge(req, "i23d", i23dCost, { kind: "upload" });
      
      const mimetype = String(file.mimetype || "application/octet-stream");
      const extMatch = String(file.originalname || "").toLowerCase().match(/\.([a-z0-9]{1,8})$/);
      const ext = extMatch ? extMatch[1] : undefined;
      
      const uploaded = await cosUploadBuffer({
        buffer: file.buffer,
        contentType: mimetype,
        ext,
        folder: "images",
      });
      
      const out = await hunyuanCreate3DTaskFromUrl({ imageUrl: uploaded.url });
      if (!out.taskId) throw new ApiError("UPSTREAM_ERROR", 502, "No taskId returned");
      res.json(out);
    } catch (e) {
      next(e);
    }
  });

  router.post("/hunyuan3d/i2t-url", express.json({ limit: "1mb" }), async (req, res, next) => {
    try {
      const body = z.object({ imageUrl: z.string().min(1).max(4000), prompt: z.string().optional() }).parse(req.body);
      const i23dCostRaw = Number(process.env.BILLING_I23D_COST);
      const i23dCost = Number.isFinite(i23dCostRaw) ? Math.max(0, Math.floor(i23dCostRaw)) : 249;
      await charge(req, "i23d", i23dCost, { kind: "url" });
      // The upstream image-to-3D API rejects prompt when imageUrl/ImageBase64 is provided.
      const out = await hunyuanCreate3DTaskFromUrl({ imageUrl: body.imageUrl });
      if (!out.taskId) throw new ApiError("UPSTREAM_ERROR", 502, "No taskId returned");
      res.json(out);
    } catch (e) {
      next(e);
    }
  });

  router.get("/hunyuan3d/tasks/:taskId", async (req, res, next) => {
    try {
      const taskId = String(req.params.taskId || "").trim();
      if (!taskId) throw new ApiError("BAD_REQUEST", 400, "Missing taskId");
      const out = await hunyuanGet3DTask(taskId);
      res.json(out);
    } catch (e) {
      next(e);
    }
  });

  router.get("/system/provider-status", (_req, res) => {
    const doubao = getDoubaoRuntimeConfig();
    const hunyuan3d = getHunyuanRuntimeConfig();
    const cos = getCosRuntimeConfig();
    res.json({
      doubao: {
        mockMode: doubao.mockMode,
        hasApiKey: doubao.hasApiKey,
        baseUrl: doubao.baseUrl || null,
        model: doubao.model || null,
      },
      hunyuan3d,
      cos: {
        enabled: cos.enabled,
        bucket: cos.bucket || null,
        region: cos.region || null,
        prefix: cos.prefix || null,
      },
    });
  });

  router.post("/personas/:id/distill", express.json(), async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const personaId = req.params.id;
      const { mbti_type, custom_traits, history_record, history_override } = req.body;

      const sb = getSupabaseAdmin();
      
      // 验证权限并获取旧的 history
      // 注意：使用 * 兜底，防止 distillation_history 字段在老表中不存在时报错
      const { data: p, error: checkErr } = await sb.from("personas").select("*").eq("id", personaId).maybeSingle();
      if (checkErr) throw new ApiError("INTERNAL_ERROR", 500, checkErr.message);
      if (!p) throw new ApiError("NOT_FOUND", 404, "Persona not found");
      if (p.user_id !== userId) throw new ApiError("FORBIDDEN", 403, "Not your persona");

      let newHistory = p.distillation_history || [];
      if (Array.isArray(history_override)) {
        newHistory = history_override;
      } else if (history_record) {
        newHistory.push({
          ...history_record,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        });
      }

      const { data, error } = await sb
        .from("personas")
        .update({ 
          mbti_type, 
          custom_traits,
          distillation_history: newHistory
        })
        .eq("id", personaId)
        .select()
        .single();
        
      if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  const visualHistoryItemSchema = z
    .object({
      id: z.string().min(1).max(120),
      kind: z.enum(["t2i", "i23d", "companion"]).optional().default("i23d"),
      createdAt: z.number().finite(),
      prompt: z.string().optional().default(""),
      size: z.string().optional().default("2K"),
      n: z.number().int().min(1).max(8).optional().default(1),
      images: z.array(z.string()).optional().default([]),
      cosUrlByImageUrl: z.record(z.string()).optional().default({}),
      selectedImageUrl: z.string().optional(),
      taskId: z.string().optional(),
      taskStatus: z.string().optional(),
      modelUrl: z.string().optional(),
      companionImageUrl: z.string().optional(),
      companionSceneBgUrl: z.string().optional(),
      companionSummary: z.string().optional(),
      companionProfile: z.record(z.any()).optional(),
    })
    .passthrough();

  router.get("/personas/:id/companion-beast", async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const personaId = String(req.params.id || "").trim();
      if (!personaId) throw new ApiError("BAD_REQUEST", 400, "Missing persona id");

      const sb = getSupabaseAdmin();
      const { data: p, error } = await sb
        .from("personas")
        .select("*")
        .eq("id", personaId)
        .maybeSingle();
      if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message);
      if (!p) throw new ApiError("NOT_FOUND", 404, "Persona not found");
      if (String(p.user_id || "") !== userId) throw new ApiError("FORBIDDEN", 403, "Not your persona");

      const raw = Array.isArray((p as any).visual_generation_history) ? (p as any).visual_generation_history : [];
      const latest = raw.map((item: any) => toCompanionHistoryItem(item)).find(Boolean) || null;
      res.json({ profile: latest?.profile ?? null, imageUrl: latest?.imageUrl });
    } catch (e) {
      next(e);
    }
  });

  router.get("/personas/:id/companion-beast/history", async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const personaId = String(req.params.id || "").trim();
      if (!personaId) throw new ApiError("BAD_REQUEST", 400, "Missing persona id");

      const sb = getSupabaseAdmin();
      const { data: p, error } = await sb
        .from("personas")
        .select("*")
        .eq("id", personaId)
        .maybeSingle();
      if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message);
      if (!p) throw new ApiError("NOT_FOUND", 404, "Persona not found");
      if (String(p.user_id || "") !== userId) throw new ApiError("FORBIDDEN", 403, "Not your persona");

      const raw = Array.isArray((p as any).visual_generation_history) ? (p as any).visual_generation_history : [];
      const items = raw.map((item: any) => toCompanionHistoryItem(item)).filter(Boolean).slice(0, 50);
      res.json({ items });
    } catch (e) {
      next(e);
    }
  });

  router.post("/personas/:id/companion-beast/awaken", express.json({ limit: "64kb" }), async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const personaId = String(req.params.id || "").trim();
      if (!personaId) throw new ApiError("BAD_REQUEST", 400, "Missing persona id");

      const sb = getSupabaseAdmin();
      const { data: p, error: checkErr } = await sb
        .from("personas")
        .select("*")
        .eq("id", personaId)
        .maybeSingle();
      if (checkErr) throw new ApiError("INTERNAL_ERROR", 500, checkErr.message);
      if (!p) throw new ApiError("NOT_FOUND", 404, "Persona not found");
      if (String(p.user_id || "") !== userId) throw new ApiError("FORBIDDEN", 403, "Not your persona");

      const mbti = String(p.mbti_type || "").toUpperCase() || "INFP";
      const e_i = mbti.includes("E") ? "E" : "I";
      const n_s = mbti.includes("N") ? "N" : "S";
      const t_f = mbti.includes("T") ? "T" : "F";
      const j_p = mbti.includes("J") ? "J" : "P";
      const camp = (n_s === "N" && t_f === "F") ? "NF" :
                   (n_s === "N" && t_f === "T") ? "NT" :
                   (n_s === "S" && j_p === "J") ? "SJ" : "SP";

      const traits = Array.isArray(p.custom_traits) ? p.custom_traits.join("、") : "";
      const dist = Array.isArray(p.distillation_history) 
        ? p.distillation_history.map((x: any) => x.dimension || "").join(",") 
        : "";

      const systemPrompt = `你是一个深层精神世界的主脑，你的任务是根据玩家的人格数据，觉醒一只与其灵魂绑定的“伴生兽”。
必须严格输出合法的 JSON，不要输出任何多余文本或 Markdown 代码块标记（如 \`\`\`json）。

生成规则：
1. 基础物种池（参考但不锁死）：INFP蝴蝶、INFJ水母、ENFP狗、ENFJ蛇鹫；INTP蛙、ENTP猴、INTJ蛇、ENTJ熊；ISTJ龟、ISFJ水豚、ESTJ鹅、ESFJ虎鲸；ISTP猫、ISFP兔、ESTP狐、ESFP鹦鹉。
2. 品级（rarityTier）：bronze(青铜，60%), silver(白银, 30%), gold(黄金, 9%), epic(史诗, 1%)。
3. 危险等级（dangerLevel）：safe(安全), oddity(小怪兽), high_risk(高危), containment_breach(收容失效), unnamable(不可名状)。史诗级通常伴随高危险等级。
4. 战斗风格（combatStyle）：attack(进攻), defense(防御), control(控制), support(辅助), chaos(混沌)。E偏进攻/主动，I偏防御/反制。
5. 材质池（materials，选1-2个）：粘液,鳞片,机械金属,矿石,裂纹冷光,果冻质感,毛绒质感,流沙发光,镭射透明,液态玻璃,花粉微粒。男号可偏冷硬，女号可偏柔幻，也可反差。
6. 回收设定（recyclable）：只有极少部分（约10%）拥有“编号个体、收容失效、双重材质异变”等极其罕见特质的个体，此项为 true，其余为 false。
7. 提示词生成（imagePrompt）：用纯英文输出一段 Midjourney/Stable Diffusion 风格的文生图提示词，详细描述这只伴生兽的形态、材质、光影和所处环境，不要带中文。

输出 JSON 格式要求：
{
  "speciesBase": "jellyfish", // 英文基础物种
  "speciesNameCn": "雾海守秘水母", // 中文全名
  "rarityTier": "bronze" | "silver" | "gold" | "epic",
  "dangerLevel": "safe" | "oddity" | "high_risk" | "containment_breach" | "unnamable",
  "combatStyle": "attack" | "defense" | "control" | "support" | "chaos",
  "materials": ["果冻质感", "流沙发光"],
  "traits": ["边界反刺", "情绪回声", "深海观察"], // 3个特质技能
  "appearanceSummary": "半透明水母伞冠，流沙光尾...", // 简短外观中文描述
  "personalitySummary": "外柔内刺，边界极强...", // 性格与定位描述
  "awakeningStory": "它从你所有没说出口的克制与共情里诞生。", // 一句走心的觉醒寄语
  "recyclable": false,
  "imagePrompt": "A glowing jellyfish floating in deep space, sand-like glowing particles, jelly texture, neon blue and purple light, cinematic lighting, masterpiece, 8k..."
}`;

      const userContent = `当前玩家人格卡片信息：
- MBTI：${mbti}
- 阵营推断：${camp}
- 标签特质：${traits}
- 精神蒸馏记录：${dist}`;

      const aiOut = await deepseekChat([
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ], true);

      let parsed: any;
      try {
        const text = aiOut.text.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
        parsed = JSON.parse(text);
      } catch (err) {
        throw new ApiError("UPSTREAM_ERROR", 502, "Failed to parse companion beast JSON");
      }

      const profile = {
        version: 1,
        personaId: personaId,
        mbti: mbti,
        camp: camp,
        speciesBase: parsed.speciesBase || "unknown",
        speciesNameCn: parsed.speciesNameCn || "未知伴生兽",
        rarityTier: parsed.rarityTier || "bronze",
        dangerLevel: parsed.dangerLevel || "safe",
        combatStyle: parsed.combatStyle || "support",
        materials: Array.isArray(parsed.materials) ? parsed.materials : [],
        traits: Array.isArray(parsed.traits) ? parsed.traits : [],
        appearanceSummary: parsed.appearanceSummary || "",
        personalitySummary: parsed.personalitySummary || "",
        awakeningStory: parsed.awakeningStory || "",
        recyclable: !!parsed.recyclable,
        tradeable: true,
        serial: parsed.recyclable ? `SR-${Math.random().toString(16).slice(2, 8).toUpperCase()}` : null,
      };

      let imageUrl: string | undefined;
      const imagePrompt = parsed.imagePrompt || `A mysterious ${profile.speciesBase}, cinematic lighting, masterpiece`;
      
      try {
        const costPerImageRaw = Number(process.env.BILLING_T2I_COST_PER_IMAGE);
        const costPerImage = Number.isFinite(costPerImageRaw) ? Math.max(0, Math.floor(costPerImageRaw)) : 40;
        await charge(req, "companion_t2i", costPerImage, { personaId });

        const out = await doubaoTextToImage({ prompt: imagePrompt, size: "1440x2560", n: 1 } as T2IRequest);
        const rawImageUrl = Array.isArray(out?.images) && out.images[0] ? String(out.images[0]) : undefined;
        
        if (rawImageUrl) {
          try {
            const cosOut = await cosUploadFromUrl({ imageUrl: rawImageUrl });
            imageUrl = cosOut.url;
          } catch (cosErr) {
            console.error("Failed to upload companion image to COS, fallback to raw url:", cosErr);
            imageUrl = rawImageUrl;
          }
        }
      } catch (err) {
        console.error("Companion T2I error:", err);
        imageUrl = undefined;
      }

      let sceneBgUrl: string | undefined;
      try {
        const costPerImageRaw = Number(process.env.BILLING_T2I_COST_PER_IMAGE);
        const costPerImage = Number.isFinite(costPerImageRaw) ? Math.max(0, Math.floor(costPerImageRaw)) : 40;
        const sceneBgPrompt = buildCompanionSceneBgPrompt(profile);
        await charge(req, "companion_scene_bg", costPerImage, { personaId, autoFromAwaken: true });

        const bgOut = await doubaoTextToImage({ prompt: sceneBgPrompt, size: "2560x1440", n: 1 } as T2IRequest);
        const rawBgUrl = Array.isArray(bgOut?.images) && bgOut.images[0] ? String(bgOut.images[0]) : undefined;
        
        if (rawBgUrl) {
          try {
            const cosOut = await cosUploadFromUrl({ imageUrl: rawBgUrl });
            sceneBgUrl = cosOut.url;
          } catch (cosErr) {
            console.error("Failed to upload companion scene bg to COS, fallback to raw url:", cosErr);
            sceneBgUrl = rawBgUrl;
          }
        }
      } catch (err) {
        console.error("Companion scene bg auto generation error:", err);
        sceneBgUrl = undefined;
      }

      const createdAt = Date.now();
      const historyItem = {
        id: `${createdAt}-${Math.random().toString(16).slice(2, 8)}`,
        kind: "companion",
        createdAt,
        prompt: `${profile.speciesNameCn} · 伴生兽觉醒`,
        size: "1440x2560",
        n: 1,
        images: imageUrl ? [imageUrl] : [],
        companionImageUrl: imageUrl,
        companionSceneBgUrl: sceneBgUrl,
        companionSummary: profile.personalitySummary,
        companionProfile: profile,
      };

      const outHistoryItem = {
        id: historyItem.id,
        createdAt: historyItem.createdAt,
        speciesNameCn: profile.speciesNameCn,
        rarityTier: profile.rarityTier,
        dangerLevel: profile.dangerLevel,
        combatStyle: profile.combatStyle,
        imageUrl: historyItem.companionImageUrl,
        sceneBgUrl: historyItem.companionSceneBgUrl,
        recyclable: profile.recyclable,
        serial: profile.serial,
        profile: profile,
      };

      const oldItems = Array.isArray((p as any).visual_generation_history) ? (p as any).visual_generation_history : [];
      const nextItems = [historyItem, ...oldItems].slice(0, 100);

      const { error: updateErr } = await sb
        .from("personas")
        .update({ visual_generation_history: nextItems })
        .eq("id", personaId);
      if (updateErr) throw new ApiError("INTERNAL_ERROR", 500, updateErr.message);

      res.json({ profile, imageUrl, historyItem: outHistoryItem });
    } catch (e) {
      next(e);
    }
  });

  router.post("/personas/:id/companion-beast/scene-bg", express.json({ limit: "64kb" }), async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const personaId = String(req.params.id || "").trim();
      if (!personaId) throw new ApiError("BAD_REQUEST", 400, "Missing persona id");
      const body = z
        .object({
          historyItemId: z.string().min(1).max(120).optional(),
        })
        .parse(req.body || {});

      const sb = getSupabaseAdmin();
      const { data: p, error: checkErr } = await sb
        .from("personas")
        .select("*")
        .eq("id", personaId)
        .maybeSingle();
      if (checkErr) throw new ApiError("INTERNAL_ERROR", 500, checkErr.message);
      if (!p) throw new ApiError("NOT_FOUND", 404, "Persona not found");
      if (String(p.user_id || "") !== userId) throw new ApiError("FORBIDDEN", 403, "Not your persona");

      const oldItems = Array.isArray((p as any).visual_generation_history) ? [...(p as any).visual_generation_history] : [];
      const targetIndex = oldItems.findIndex((item: any) => {
        if (!item || typeof item !== "object" || !item.companionProfile) return false;
        if (!body.historyItemId) return true;
        return String(item.id || "") === body.historyItemId;
      });
      if (targetIndex < 0) throw new ApiError("NOT_FOUND", 404, "Companion history item not found");

      const targetItem = oldItems[targetIndex] as any;
      const profile = targetItem?.companionProfile;
      if (!profile || typeof profile !== "object") {
        throw new ApiError("BAD_REQUEST", 400, "Companion profile missing");
      }

      const prompt = buildCompanionSceneBgPrompt(profile);
      const costPerImageRaw = Number(process.env.BILLING_T2I_COST_PER_IMAGE);
      const costPerImage = Number.isFinite(costPerImageRaw) ? Math.max(0, Math.floor(costPerImageRaw)) : 40;
      await charge(req, "companion_scene_bg", costPerImage, { personaId, historyItemId: targetItem.id || null });

      const out = await doubaoTextToImage({ prompt, size: "2560x1440", n: 1 } as T2IRequest);
      const rawImageUrl = Array.isArray(out?.images) && out.images[0] ? String(out.images[0]) : undefined;
      if (!rawImageUrl) throw new ApiError("UPSTREAM_ERROR", 502, "No scene background image returned");

      let imageUrl = rawImageUrl;
      try {
        const cosOut = await cosUploadFromUrl({ imageUrl: rawImageUrl });
        imageUrl = cosOut.url;
      } catch (cosErr) {
        console.error("Failed to upload companion scene bg to COS, fallback to raw url:", cosErr);
      }

      oldItems[targetIndex] = {
        ...targetItem,
        companionSceneBgUrl: imageUrl,
      };

      const { error: updateErr } = await sb
        .from("personas")
        .update({ visual_generation_history: oldItems.slice(0, 100) })
        .eq("id", personaId);
      if (updateErr) throw new ApiError("INTERNAL_ERROR", 500, updateErr.message);

      res.json({ imageUrl, historyItemId: String(targetItem.id || "") });
    } catch (e) {
      next(e);
    }
  });

  router.post("/creator/companion/quick-awaken", express.json({ limit: "64kb" }), async (req, res, next) => {
    try {
      const body = z.object({ text: z.string().min(1).max(2000) }).parse(req.body);
      const text = body.text;

      const systemPrompt = `你是一个深层精神世界的主脑，你的任务是根据一段【粉丝留言或人物描述】，推断其 MBTI 与性格特质，并为其觉醒一只独一无二的“伴生兽”。
必须严格输出合法的 JSON，不要输出任何多余文本或 Markdown 代码块标记（如 \`\`\`json）。

生成规则：
1. MBTI推断（inferredMbti）：如果留言中没有明确MBTI，请根据语气和描述推断一个最可能的MBTI。
2. 基础物种池（参考但不锁死）：INFP蝴蝶、INFJ水母、ENFP狗、ENFJ蛇鹫；INTP蛙、ENTP猴、INTJ蛇、ENTJ熊；ISTJ龟、ISFJ水豚、ESTJ鹅、ESFJ虎鲸；ISTP猫、ISFP兔、ESTP狐、ESFP鹦鹉。
3. 品级（rarityTier）：bronze(60%), silver(30%), gold(9%), epic(1%)。
4. 危险等级（dangerLevel）：safe, oddity, high_risk, containment_breach, unnamable。
5. 战斗风格（combatStyle）：attack, defense, control, support, chaos。
6. 材质池（materials，选1-2个）：粘液,鳞片,机械金属,矿石,裂纹冷光,果冻质感,毛绒质感,流沙发光,镭射透明,液态玻璃,花粉微粒。
7. 专属故事（uniqueStory）：**非常重要！** 根据粉丝的具体留言内容，为这只伴生兽写一段50字左右的专属背景故事。要有宿命感和反差感，特别适合在抖音/小红书短视频里作为配音文案朗读。
8. 提示词生成（imagePrompt）：纯英文输出一段 Midjourney/Stable Diffusion 风格的文生图提示词。

输出 JSON 格式要求：
{
  "inferredMbti": "INFP",
  "speciesBase": "butterfly",
  "speciesNameCn": "幽海梦蝶",
  "rarityTier": "silver",
  "dangerLevel": "oddity",
  "combatStyle": "support",
  "materials": ["镭射透明", "花粉微粒"],
  "traits": ["情绪吸收", "梦境边缘"],
  "appearanceSummary": "透明的蝶翼折射出镭射光...",
  "personalitySummary": "敏感但具有极强的治愈力...",
  "uniqueStory": "它诞生于你昨晚失眠时叹息的频率中...",
  "imagePrompt": "A glowing translucent butterfly floating in deep space, jelly texture, neon blue and purple light, cinematic lighting, masterpiece, 8k..."
}`;

      const userContent = `粉丝留言/描述：\n${text}`;

      const aiOut = await deepseekChat([
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ], true);

      let parsed: any;
      try {
        const cleanText = aiOut.text.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
        parsed = JSON.parse(cleanText);
      } catch (err) {
        throw new ApiError("UPSTREAM_ERROR", 502, "Failed to parse companion beast JSON");
      }

      let imageUrl: string | undefined;
      const imagePrompt = parsed.imagePrompt || `A mysterious ${parsed.speciesBase || "beast"}, cinematic lighting, masterpiece`;
      
      try {
        // We charge a generic t2i cost
        const costPerImageRaw = Number(process.env.BILLING_T2I_COST_PER_IMAGE);
        const costPerImage = Number.isFinite(costPerImageRaw) ? Math.max(0, Math.floor(costPerImageRaw)) : 40;
        await charge(req, "companion_t2i_creator", costPerImage, { autoFromAwaken: true });

        const out = await doubaoTextToImage({ prompt: imagePrompt, size: "1440x2560", n: 1 } as T2IRequest);
        const rawImageUrl = Array.isArray(out?.images) && out.images[0] ? String(out.images[0]) : undefined;
        
        if (rawImageUrl) {
          try {
            const cosOut = await cosUploadFromUrl({ imageUrl: rawImageUrl });
            imageUrl = cosOut.url;
          } catch (cosErr) {
            console.error("Failed to upload creator companion image to COS, fallback to raw url:", cosErr);
            imageUrl = rawImageUrl;
          }
        }
      } catch (err) {
        console.error("Creator T2I error:", err);
        imageUrl = undefined;
      }

      res.json({ profile: parsed, imageUrl });
    } catch (e) {
      next(e);
    }
  });

  router.get("/personas/:id/visual-history", async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const personaId = String(req.params.id || "").trim();
      if (!personaId) throw new ApiError("BAD_REQUEST", 400, "Missing persona id");

      const sb = getSupabaseAdmin();
      const { data: p, error } = await sb
        .from("personas")
        .select("*")
        .eq("id", personaId)
        .maybeSingle();
      if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message);
      if (!p) throw new ApiError("NOT_FOUND", 404, "Persona not found");
      if (String(p.user_id || "") !== userId) throw new ApiError("FORBIDDEN", 403, "Not your persona");

      const raw = Array.isArray((p as any).visual_generation_history) ? (p as any).visual_generation_history : [];
      const items = raw
        .map((item: unknown) => {
          try {
            return visualHistoryItemSchema.parse(item);
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .slice(0, 100);
      res.json({ items });
    } catch (e) {
      next(e);
    }
  });

  router.post("/personas/:id/visual-history", express.json({ limit: "1mb" }), async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const personaId = String(req.params.id || "").trim();
      if (!personaId) throw new ApiError("BAD_REQUEST", 400, "Missing persona id");
      const body = z.object({ items: z.array(visualHistoryItemSchema).max(100) }).parse(req.body);

      const sb = getSupabaseAdmin();
      const { data: p, error: checkErr } = await sb
        .from("personas")
        .select("*")
        .eq("id", personaId)
        .maybeSingle();
      if (checkErr) throw new ApiError("INTERNAL_ERROR", 500, checkErr.message);
      if (!p) throw new ApiError("NOT_FOUND", 404, "Persona not found");
      if (String(p.user_id || "") !== userId) throw new ApiError("FORBIDDEN", 403, "Not your persona");

      const sortedItems = [...body.items]
        .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
        .slice(0, 100);

      const { data, error } = await sb
        .from("personas")
        .update({ visual_generation_history: sortedItems })
        .eq("id", personaId)
        .select("id, visual_generation_history")
        .single();
      if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message);

      res.json({
        success: true,
        items: Array.isArray((data as any)?.visual_generation_history) ? (data as any).visual_generation_history : [],
      });
    } catch (e) {
      next(e);
    }
  });

  router.post("/follows", express.json(), async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const { target_persona_id } = req.body;
      if (!target_persona_id) throw new ApiError("BAD_REQUEST", 400, "Missing target_persona_id");

      const sb = getSupabaseAdmin();
      const { error } = await sb.from("follows").insert({
        follower_id: userId,
        target_persona_id
      });
      
      // 忽略唯一约束导致的报错 (23505)
      if (error && error.code !== '23505') throw new ApiError("INTERNAL_ERROR", 500, error.message);
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/follows/:target_persona_id", async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const target_persona_id = req.params.target_persona_id;

      const sb = getSupabaseAdmin();
      const { error } = await sb.from("follows")
        .delete()
        .eq("follower_id", userId)
        .eq("target_persona_id", target_persona_id);
        
      if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message);
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  // 获取我关注的人格列表
  router.get("/follows", async (req, res, next) => {
    try {
      const userId = await requireSupabaseUserId(req);
      const sb = getSupabaseAdmin();
      
      const { data, error } = await sb
        .from("follows")
        .select("created_at, target_persona_id, personas(*)")
        .eq("follower_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw new ApiError("INTERNAL_ERROR", 500, error.message);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
