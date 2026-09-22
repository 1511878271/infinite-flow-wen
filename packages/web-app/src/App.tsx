import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ResonanceDemo } from '../../plugin-ui/src/ui/ResonanceDemo';
import { AiPluginPanel } from '../../plugin-ui/src/ui/AiPluginPanel';
import type { AiBusyJobKind, AiBusyStatePayload, PluginTheme } from '../../plugin-ui/src/types';
import { supabase } from './lib/supabase';
import { isEducationEmail, isValidEmailAddress, normalizeEmail } from './lib/email';
import MOMENTS_SQL from '../凡人世界_动态_建表.sql?raw';

const API_BASE_URL = (() => {
  const v = (import.meta as any).env?.VITE_API_BASE_URL;
  if (v) return String(v).replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return window.location.origin.replace(/\/$/, "");
  }
  return "http://localhost:8787";
})();

const ADMIN_UI = (() => {
  const v = String((import.meta as any).env?.VITE_ADMIN_UI || "").trim().toLowerCase();
  const on = v === "1" || v === "true" || v === "yes" || v === "on";
  const dev = Boolean((import.meta as any).env?.DEV);
  return dev || on;
})();

const GUEST_MODE_STORAGE_KEY = "app-guest-mode:v1";
const GUEST_PERSONAS_STORAGE_KEY = "guest-personas:v1";
const GUEST_UPGRADE_META_STORAGE_KEY = "guest-upgrade-meta:v1";
const PERSONA_VISUAL_ASSETS_STORAGE_KEY = "persona-visual-assets:v1";
const PERSONA_APPEARANCE_STORAGE_KEY = "persona-appearance:v1";
const GUEST_SESSION = {
  is_guest: true,
  access_token: "",
  user: {
    id: "guest-local",
    email: "",
  },
};

type SharedConversationMode = "agent" | "human" | "mixed";
type SharedMessageSourceKind = "human" | "agent" | "system";

type SharedConversationRecord = {
  id: string;
  participant_a_persona_id: string;
  participant_b_persona_id: string;
  participant_low_persona_id: string;
  participant_high_persona_id: string;
  created_by_persona_id: string;
  current_mode?: SharedConversationMode;
  status?: string;
  agent_enabled_a?: boolean;
  agent_enabled_b?: boolean;
  human_joined_a?: boolean;
  human_joined_b?: boolean;
  last_message_preview?: string | null;
  last_message_at?: string | null;
  last_sender_persona_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type SharedChatMessageRecord = {
  id: string;
  conversation_id: string;
  sender_persona_id?: string | null;
  sender_kind?: SharedMessageSourceKind;
  content?: string | null;
  meta?: any;
  created_at?: string | null;
};

function getOrderedPersonaPair(a: any, b: any) {
  const first = String(a || "").trim();
  const second = String(b || "").trim();
  if (!first || !second) return ["", ""] as const;
  return first < second ? [first, second] as const : [second, first] as const;
}

function isMissingRelationError(raw: any, relationName: string) {
  const msg = String(raw?.message || raw?.details || raw || "").toLowerCase();
  const relation = String(relationName || "").trim().toLowerCase();
  if (!msg || !relation) return false;
  return msg.includes(relation) && (msg.includes("does not exist") || msg.includes("relation") || msg.includes("schema"));
}

function isAbortLikeError(raw: any) {
  const msg = String(raw?.message || raw?.details || raw || "").toLowerCase();
  if (!msg) return false;
  return (
    msg.includes("aborted") ||
    msg.includes("aborterror") ||
    msg.includes("err_aborted") ||
    msg.includes("signal is aborted") ||
    msg.includes("request was cancelled") ||
    msg.includes("request canceled") ||
    msg.includes("cancelled")
  );
}

function shouldSilenceSupabaseError(raw: any, relationName?: string) {
  if (isAbortLikeError(raw)) return true;
  if (relationName && isMissingRelationError(raw, relationName)) return true;
  return false;
}

function buildLegacyChatHistoryJson(history: any) {
  const raw = String(history || "").trim();
  if (!raw) return "[]";
  try {
    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed) ? parsed : [];
    const normalized = rows.filter((item: any, idx: number, arr: any[]) => {
      const role = String(item?.role || "");
      const content = String(item?.content || "").trim();
      if (!content || content === "...") return false;
      if (idx === 0) return true;
      const prev = arr[idx - 1];
      return !(String(prev?.role || "") === role && String(prev?.content || "").trim() === content);
    });
    return JSON.stringify(normalized);
  } catch {
    const msgs = raw
      .split("\n")
      .filter(Boolean)
      .map((line) => ({
        role: line.startsWith("ME:") ? "user" : "assistant",
        content: line.replace(/^(ME:|THEM:)\s*/, ""),
      }))
      .filter((item, idx, arr) => {
        const content = String(item.content || "").trim();
        if (!content || content === "...") return false;
        if (idx === 0) return true;
        const prev = arr[idx - 1];
        return !(prev.role === item.role && String(prev.content || "").trim() === content);
      });
    return JSON.stringify(msgs);
  }
}

function buildConversationModeCopy(
  mode: SharedConversationMode,
  conversationStatus: string | null | undefined,
  otherName: string,
  isOtherHumanJoined: boolean,
  isOtherAgentEnabled: boolean,
) {
  const normalizedStatus = String(conversationStatus || "").toLowerCase();
  if (mode === "human" || (isOtherHumanJoined && !isOtherAgentEnabled)) {
    return {
      title: "真人在线",
      text: `你现在正在和 ${otherName || "对方"} 本人聊天。`,
      chipClass: "border-emerald-300/30 bg-emerald-500/15 text-emerald-100",
    };
  }
  if (mode === "mixed" || (isOtherHumanJoined && isOtherAgentEnabled)) {
    return {
      title: "混合会话",
      text: `当前会话同时包含 ${otherName || "对方"} 本人和 AI 代理的回复。`,
      chipClass: "border-amber-300/30 bg-amber-500/15 text-amber-100",
    };
  }
  if (normalizedStatus.includes("automation_running")) {
    return {
      title: "AI托管中",
      text: `你退出页面后，${otherName || "对方"} 与你的 AI 仍会继续自动聊天。`,
      chipClass: "border-cyan-300/30 bg-cyan-500/15 text-cyan-100",
    };
  }
  return {
    title: "已有记录",
    text: `你和 ${otherName || "对方"} 已经建立了共享会话，但当前没有开启 AI 托管。`,
    chipClass: "border-white/15 bg-white/10 text-white",
  };
}

function buildConversationHistoryJson(
  rows: SharedChatMessageRecord[],
  selfPersonaId: string,
  otherPersonaId: string,
) {
  return JSON.stringify(
    (Array.isArray(rows) ? rows : []).map((item, idx) => {
      const senderId = String(item?.sender_persona_id || "").trim();
      const senderKind = item?.sender_kind === "human" || item?.sender_kind === "agent" || item?.sender_kind === "system"
        ? item.sender_kind
        : "system";
      const isSelf = Boolean(selfPersonaId && senderId && senderId === selfPersonaId);
      const isOther = Boolean(otherPersonaId && senderId && senderId === otherPersonaId);
      const role = isSelf ? "user" : "assistant";
      const sourceLabel =
        senderKind === "system"
          ? "系统提示"
          : isSelf
            ? "我"
            : senderKind === "human"
              ? "对方本人"
              : isOther
                ? "对方 Agent"
                : "对方";
      return {
        id: String(item?.id || `conversation-${idx}`),
        role,
        content: String(item?.content || ""),
        audio: item?.meta?.audio ? item.meta.audio : undefined,
        sourceLabel,
        sourceKind: senderKind,
      };
    }),
  );
}

function toProxyUrl(rawUrl: string) {
  const raw = String(rawUrl || "").trim();
  if (!raw) return raw;
  if (raw.includes("/api/proxy?url=")) return raw;
  if (/^(blob:|data:)/i.test(raw)) return raw;
  if (/^\/models\//i.test(raw)) return `${API_BASE_URL}${raw}`;
  try {
    const apiBase = new URL(API_BASE_URL);
    const resolved = new URL(raw, API_BASE_URL);
    const isLocalModel =
      resolved.origin === apiBase.origin &&
      resolved.pathname.startsWith("/models/");
    if (isLocalModel) return resolved.toString();
  } catch {}
  return `${API_BASE_URL}/api/proxy?url=${encodeURIComponent(raw)}`;
}

function hideParentheticalForUi(input: any) {
  const s = String(input ?? "");
  if (!s) return s;
  return s
    .replace(/（[^）]*）/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ \n/g, "\n");
}

function normalizeGenderValue(input: any): "male" | "female" | "other" | "unknown" {
  const s = String(input ?? "").trim().toLowerCase();
  if (!s) return "unknown";
  if (["m", "male", "man", "boy", "男", "男生", "男性"].includes(s)) return "male";
  if (["f", "female", "woman", "girl", "女", "女生", "女性"].includes(s)) return "female";
  if (["other", "nonbinary", "nb", "其他", "非二元"].includes(s)) return "other";
  if (s.includes("男")) return "male";
  if (s.includes("女")) return "female";
  return "unknown";
}

function normalizeSeekingGenderValue(input: any): "male" | "female" | "any" | "other" | "unknown" {
  const s = String(input ?? "").trim().toLowerCase();
  if (!s) return "unknown";
  if (["any", "all", "both", "不限", "都行", "都可以", "都喜欢"].includes(s)) return "any";
  if (s.includes("不限") || s.includes("都")) return "any";
  if (["m", "male", "man", "boy", "男", "男生", "喜欢男", "偏好男"].includes(s)) return "male";
  if (["f", "female", "woman", "girl", "女", "女生", "喜欢女", "偏好女"].includes(s)) return "female";
  if (["other", "nonbinary", "nb", "其他", "非二元"].includes(s)) return "other";
  if (s.includes("男")) return "male";
  if (s.includes("女")) return "female";
  return "unknown";
}

function readPersonaDemographics() {
  try {
    const raw = localStorage.getItem("persona-demographics:v1");
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writePersonaDemographics(next: any) {
  try {
    localStorage.setItem("persona-demographics:v1", JSON.stringify(next || {}));
  } catch {}
}

function readGuestPersonas() {
  try {
    const raw = localStorage.getItem(GUEST_PERSONAS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestPersonas(next: any[]) {
  try {
    localStorage.setItem(GUEST_PERSONAS_STORAGE_KEY, JSON.stringify(Array.isArray(next) ? next : []));
  } catch {}
}

function readGuestUpgradeMeta(): { pending?: boolean; preferredGuestPersonaId?: string } {
  try {
    const raw = localStorage.getItem(GUEST_UPGRADE_META_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeGuestUpgradeMeta(next: { pending?: boolean; preferredGuestPersonaId?: string } | null) {
  try {
    if (!next || !next.pending) {
      localStorage.removeItem(GUEST_UPGRADE_META_STORAGE_KEY);
      return;
    }
    localStorage.setItem(GUEST_UPGRADE_META_STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

function readRecordStorage(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeRecordStorage(key: string, value: Record<string, any>) {
  try {
    localStorage.setItem(key, JSON.stringify(value || {}));
  } catch {}
}

async function migrateGuestPersonasToAccount(userId: string) {
  const uid = String(userId || "").trim();
  const guestPersonas = readGuestPersonas();
  const upgradeMeta = readGuestUpgradeMeta();
  if (!uid) return { migratedCount: 0, preferredPersonaId: "" };
  if (!upgradeMeta?.pending || guestPersonas.length === 0) return { migratedCount: 0, preferredPersonaId: "" };

  const { data: existingRows } = await supabase.from("personas").select("*").eq("user_id", uid);
  const existing = Array.isArray(existingRows) ? existingRows : [];
  const bySignature = new Map<string, any>();
  existing.forEach((row: any) => {
    const signature = [row?.name, row?.quote, row?.vibe].map((v) => String(v || "").trim()).join("|");
    if (!bySignature.has(signature)) bySignature.set(signature, row);
  });

  const guestVisualAssets = readRecordStorage(PERSONA_VISUAL_ASSETS_STORAGE_KEY) as Record<string, any>;
  const guestAppearance = readRecordStorage(PERSONA_APPEARANCE_STORAGE_KEY) as Record<string, any>;
  const demographics = readPersonaDemographics() as Record<string, any>;
  const nextVisualAssets = { ...guestVisualAssets };
  const nextAppearance = { ...guestAppearance };
  const nextDemographics = { ...(demographics || {}) };

  let preferredPersonaId = "";
  let migratedCount = 0;

  for (const guestPersona of guestPersonas) {
    const signature = [guestPersona?.name, guestPersona?.quote, guestPersona?.vibe].map((v) => String(v || "").trim()).join("|");
    const existingMatch = bySignature.get(signature);
    if (existingMatch?.id) {
      const existingId = String(existingMatch.id);
      if (!preferredPersonaId && String(upgradeMeta?.preferredGuestPersonaId || "") === String(guestPersona?.id || "")) {
        preferredPersonaId = existingId;
      }
      if (guestVisualAssets[String(guestPersona?.id || "")]) nextVisualAssets[existingId] = guestVisualAssets[String(guestPersona?.id || "")];
      if (guestAppearance[String(guestPersona?.id || "")]) nextAppearance[existingId] = guestAppearance[String(guestPersona?.id || "")];
      if (nextDemographics[String(guestPersona?.id || "")]) nextDemographics[existingId] = nextDemographics[String(guestPersona?.id || "")];
      continue;
    }

    const minimalPayload: Record<string, any> = {
      user_id: uid,
      name: String(guestPersona?.name || "").trim() || "我的数字人格",
      mbti: guestPersona?.mbti ?? "",
      vibe: guestPersona?.vibe ?? "",
      speech_style: guestPersona?.speech_style ?? "",
      logic: guestPersona?.logic ?? "",
      quote: guestPersona?.quote ?? "",
      ...(guestPersona?.gender ? { gender: guestPersona.gender } : {}),
      ...(guestPersona?.seeking_gender ? { seeking_gender: guestPersona.seeking_gender } : {}),
    };
    const extendedPayload: Record<string, any> = {
      ...minimalPayload,
      ...(Array.isArray(guestPersona?.inventory) ? { inventory: guestPersona.inventory } : {}),
      ...(Array.isArray(guestPersona?.distillation_history) ? { distillation_history: guestPersona.distillation_history } : {}),
      ...(Array.isArray(guestPersona?.visual_generation_history) ? { visual_generation_history: guestPersona.visual_generation_history } : {}),
      ...(String(guestPersona?.avatar_2d_url || "").trim() ? { avatar_2d_url: guestPersona.avatar_2d_url } : {}),
      ...(String(guestPersona?.card_cover_url || "").trim() ? { card_cover_url: guestPersona.card_cover_url } : {}),
      ...(String(guestPersona?.banner_2d_url || "").trim() ? { banner_2d_url: guestPersona.banner_2d_url } : {}),
      ...(String(guestPersona?.model_3d_url || "").trim() ? { model_3d_url: guestPersona.model_3d_url } : {}),
    };

    let inserted: any = null;
    let insertError: any = null;
    const firstAttempt = await supabase.from("personas").insert(extendedPayload as any).select().single();
    inserted = firstAttempt.data;
    insertError = firstAttempt.error;
    if (insertError) {
      const secondAttempt = await supabase.from("personas").insert(minimalPayload as any).select().single();
      inserted = secondAttempt.data;
      insertError = secondAttempt.error;
    }
    if (insertError || !inserted?.id) continue;

    const newId = String(inserted.id);
    bySignature.set(signature, inserted);
    migratedCount += 1;
    if (!preferredPersonaId && String(upgradeMeta?.preferredGuestPersonaId || "") === String(guestPersona?.id || "")) {
      preferredPersonaId = newId;
    }
    if (guestVisualAssets[String(guestPersona?.id || "")]) nextVisualAssets[newId] = guestVisualAssets[String(guestPersona?.id || "")];
    if (guestAppearance[String(guestPersona?.id || "")]) nextAppearance[newId] = guestAppearance[String(guestPersona?.id || "")];
    if (nextDemographics[String(guestPersona?.id || "")]) nextDemographics[newId] = nextDemographics[String(guestPersona?.id || "")];
  }

  writeRecordStorage(PERSONA_VISUAL_ASSETS_STORAGE_KEY, nextVisualAssets);
  writeRecordStorage(PERSONA_APPEARANCE_STORAGE_KEY, nextAppearance);
  writePersonaDemographics(nextDemographics);
  writeGuestUpgradeMeta(null);
  writeGuestPersonas([]);

  return { migratedCount, preferredPersonaId };
}

function getPersonaDemographicsById(personaId: any): { gender?: string; seeking_gender?: string } {
  const id = String(personaId || "").trim();
  if (!id) return {};
  const map = readPersonaDemographics() as any;
  const v = map?.[id] || null;
  if (!v || typeof v !== "object") return {};
  return {
    gender: typeof v.gender === "string" ? v.gender : undefined,
    seeking_gender: typeof v.seeking_gender === "string" ? v.seeking_gender : undefined,
  };
}

function getPersonaAppearanceById(personaId: any): string {
  const id = String(personaId || "").trim();
  if (!id) return "";
  const map = readRecordStorage(PERSONA_APPEARANCE_STORAGE_KEY) as any;
  return typeof map?.[id] === "string" ? String(map[id]).trim() : "";
}

function getPersonaGenderForPrompt(p: any): "male" | "female" | "other" | "unknown" {
  return normalizeGenderValue(
    p?.gender ??
      p?.sex ??
      p?.profile_gender ??
      getPersonaDemographicsById(p?.id)?.gender ??
      "",
  );
}

type HudKind = "success" | "error" | "info";

function emitHud(kind: HudKind, text: string) {
  try {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("app:hud", { detail: { kind, text } }));
  } catch {}
}

function getPluginToken() {
  if (!ADMIN_UI) return "";
  const v = (import.meta as any).env?.VITE_PLUGIN_TOKEN;
  if (v) return String(v);
  try {
    const raw = localStorage.getItem("ai_plugin_config_v1");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    if (parsed?.token) return String(parsed.token);
  } catch {
    return "";
  }
  return "";
}

function withPluginTokenHeaders(headers: Record<string, string>) {
  const token = getPluginToken();
  if (!token) return headers;
  return { ...headers, "x-plugin-token": token };
}

function FeedbackModal({
  open,
  onClose,
  session,
  context,
}: {
  open: boolean;
  onClose: () => void;
  session: any;
  context: { source: string; personaId?: string; personaName?: string } | null;
}) {
  const [category, setCategory] = useState("建议");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCategory("建议");
    setMessage("");
    setContact("");
    setSending(false);
  }, [open]);

  const submit = async () => {
    const msg = String(message || "").trim();
    if (!msg) return;
    setSending(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      const accessToken = session?.access_token || session?.accessToken;
      if (accessToken) headers.authorization = `Bearer ${String(accessToken)}`;
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          category,
          message: msg,
          contact: String(contact || "").trim() || undefined,
          source: context?.source || "unknown",
          page: (() => {
            try {
              return window.location.href;
            } catch {
              return undefined;
            }
          })(),
          personaId: context?.personaId,
          personaName: context?.personaName,
        }),
      });
      if (!res.ok) {
        let detail = "";
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const j = await res.json();
            detail =
              String((j as any)?.message || (j as any)?.error || (j as any)?.code || "").trim() ||
              JSON.stringify(j);
          } else {
            detail = (await res.text()).trim();
          }
        } catch {}
        throw new Error(detail || `HTTP ${res.status}`);
      }
      const data = await res.json().catch(() => ({}));
      const ok = Boolean((data as any)?.ok);
      emitHud("success", ok ? "已提交反馈，感谢你的建议！" : "已提交反馈（已记录）。");
      onClose();
    } catch (e: any) {
      const t = e?.message ? String(e.message) : "提交失败";
      emitHud("error", `提交失败：${t}`);
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] max-h-[82vh] rounded-2xl border border-app-border/15 bg-app-elevated/95 text-app-fg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-app-border/12">
          <div className="min-w-0">
            <div className="font-bold text-lg truncate">意见反馈</div>
            <div className="text-xs text-app-muted mt-1 truncate">
              {context?.source ? `入口：${context.source}` : "感谢你的建议，我们会持续优化体验。"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-app-muted hover:text-app-fg hover:bg-app-surface/30 rounded-full transition-colors"
            aria-label="关闭"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="rounded-xl border border-[#007AFF]/25 bg-[#007AFF]/10 px-4 py-3">
            <div className="text-sm font-semibold text-app-fg">联系我们</div>
            <div className="mt-1 text-sm text-[#8ec5ff] break-all">hitech2620@outlook.com</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-app-muted mb-1">类型</div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-app-surface/70 border border-app-border/15 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
                disabled={sending}
              >
                <option value="Bug">Bug</option>
                <option value="建议">建议</option>
                <option value="充值与扣费">充值与扣费</option>
                <option value="内容与世界观">内容与世界观</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-app-muted mb-1">联系方式（可选）</div>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="邮箱 / 微信号"
                className="w-full bg-app-surface/70 border border-app-border/15 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20 placeholder:text-app-muted/60"
                disabled={sending}
              />
            </div>
          </div>

          <div>
            <div className="text-xs text-app-muted mb-1">内容</div>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="请描述你的问题/建议（尽量包含：发生位置、期望效果、复现步骤）。"
              className="w-full bg-app-surface/70 border border-app-border/15 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20 placeholder:text-app-muted/60 resize-none"
              disabled={sending}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-app-border/15 text-app-fg transition-colors"
              disabled={sending}
            >
              取消
            </button>
            <button
              onClick={submit}
              className="text-sm px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] text-white font-semibold transition-colors disabled:opacity-60"
              disabled={sending || !String(message || '').trim()}
            >
              {sending ? "提交中..." : "提交"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthPage({
  onOpenFeedback,
  onGuestEnter,
  initialMode = "guest",
}: {
  onOpenFeedback: (ctx: { source: string }) => void;
  onGuestEnter: () => void;
  initialMode?: "guest" | "login" | "register" | "forgot" | "guestUpgrade";
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [notice, setNotice] = useState<{ kind: "error" | "success" | "info"; text: string } | null>(null);
  const [authMode, setAuthMode] = useState<"guest" | "login" | "register" | "forgot" | "guestUpgrade">(initialMode);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [cooldownTick, setCooldownTick] = useState(0);

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  const REQUIRE_EDU_EMAIL = useMemo(() => {
    const raw = (import.meta as any)?.env?.VITE_REQUIRE_EDU_EMAIL;
    const v = String(raw || "").trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "on";
  }, []);

  const validateEmail = (emailStr: string) => {
    if (!REQUIRE_EDU_EMAIL) return true;
    if (!isEducationEmail(emailStr)) {
      setNotice({ kind: "error", text: "抱歉，目前仅支持高校邮箱（以 .edu.cn 或 .edu 结尾）登录/注册。" });
      return false;
    }
    return true;
  };

  const validateEmailInput = (emailStr: string) => {
    const v = normalizeEmail(emailStr);
    if (!v) {
      setNotice({ kind: "error", text: "请输入邮箱。" });
      return false;
    }
    if (!isValidEmailAddress(v)) {
      setNotice({ kind: "error", text: "请输入完整的邮箱地址（例如 name@domain.com）。" });
      return false;
    }
    return validateEmail(v);
  };

  const clearNotice = () => setNotice(null);

  const cooldownLeftSec = useMemo(() => {
    const leftMs = Math.max(0, cooldownUntil - Date.now());
    return Math.ceil(leftMs / 1000);
  }, [cooldownUntil, cooldownTick]);

  useEffect(() => {
    if (!cooldownUntil) return;
    const t = window.setInterval(() => setCooldownTick((x) => x + 1), 250);
    return () => window.clearInterval(t);
  }, [cooldownUntil]);

  const toZhAuthError = (raw: unknown) => {
    const msg = String((raw as any)?.message || raw || "").trim();
    const lower = msg.toLowerCase();
    if (!msg) return "操作失败，请稍后再试。";
    if (lower.includes("invalid login credentials")) return "邮箱或密码不正确。";
    if (lower.includes("password should be at least")) return "密码至少 6 位（建议更长）。";
    if (lower.includes("email not confirmed")) return "邮箱未验证：请先去邮箱完成验证。";
    if (lower.includes("user already registered")) return "该邮箱已注册，请直接登录。";
    if (lower.includes("for security purposes") && lower.includes("60")) return "操作过于频繁：请等待约 1 分钟后再试。";
    if (lower.includes("rate limit") || lower.includes("too many")) return "操作过于频繁，请稍后再试。";
    return msg;
  };

  const applyRateLimitCooldownIfNeeded = (raw: any) => {
    const msg = String(raw?.message || raw || "");
    const lower = msg.toLowerCase();
    const status = Number(raw?.status || raw?.code || 0);
    let sec: number | null = null;
    const m = msg.match(/after\s+(\d+)\s+seconds/i) || msg.match(/(\d+)\s*seconds/i);
    if (m && m[1]) sec = Number(m[1]);
    if (sec == null && (lower.includes("rate limit") || lower.includes("too many") || lower.includes("for security purposes") || status === 429)) sec = 60;
    if (sec != null && Number.isFinite(sec) && sec > 0) {
      setCooldownUntil(Date.now() + Math.min(600, Math.max(5, sec)) * 1000);
    }
  };

  const setAuthError = (raw: any) => {
    applyRateLimitCooldownIfNeeded(raw);
    const base = toZhAuthError(raw);
    const left = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
    const extra = left > 0 ? `（请等待 ${left}s）` : "";
    setNotice({ kind: "error", text: base + extra });
  };

  const handleResendVerifyEmail = async () => {
    if (!validateEmailInput(email)) return;
    if (cooldownLeftSec > 0) {
      setNotice({ kind: "error", text: `操作过于频繁，请等待 ${cooldownLeftSec}s 后再试。` });
      return;
    }
    setResending(true);
    clearNotice();
    const emailRedirectTo = (() => {
      try {
        return window.location.origin;
      } catch {
        return undefined;
      }
    })();
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: normalizeEmail(email),
        options: emailRedirectTo ? { emailRedirectTo } : undefined,
      } as any);
      if (error) setAuthError(error);
      else setNotice({ kind: "success", text: "已重新发送验证邮件，请查收（可能在垃圾箱/推广）。" });
    } catch (e: any) {
      setAuthError(e);
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = String(otpCode || "").trim();
    if (!validateEmailInput(email)) return;
    if (!code) {
      setNotice({ kind: "error", text: "请输入邮箱里的验证码。" });
      return;
    }
    if (cooldownLeftSec > 0) {
      setNotice({ kind: "error", text: `操作过于频繁，请等待 ${cooldownLeftSec}s 后再试。` });
      return;
    }
    setVerifyingOtp(true);
    clearNotice();
    try {
      const attempt = async (type: "signup" | "email") => {
        try {
          return await supabase.auth.verifyOtp({ email: normalizeEmail(email), token: code, type } as any);
        } catch (e: any) {
          return { data: null as any, error: e } as any;
        }
      };

      const r1 = await attempt("signup");
      const r2 = r1?.error ? await attempt("email") : r1;
      const err = r2?.error || null;
      const sess = r2?.data?.session || null;
      if (err) {
        setAuthError(err);
        return;
      }
      if (sess) {
        setNotice({ kind: "success", text: "验证成功，正在进入..." });
        return;
      }
      if (String(password || "").trim()) {
        const login = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password });
        if (login.error) setNotice({ kind: "error", text: toZhAuthError(login.error) });
        else setNotice({ kind: "success", text: "验证成功，正在进入..." });
        return;
      }
      setNotice({ kind: "success", text: "验证成功，请返回登录。" });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownLeftSec > 0) {
      setNotice({ kind: "error", text: `操作过于频繁，请等待 ${cooldownLeftSec}s 后再试。` });
      return;
    }
    setLoading(true);
    clearNotice();
    if (!validateEmailInput(email)) { setLoading(false); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password });
    if (error) setAuthError(error);
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownLeftSec > 0) {
      setNotice({ kind: "error", text: `操作过于频繁，请等待 ${cooldownLeftSec}s 后再试。` });
      return;
    }
    setLoading(true);
    clearNotice();
    if (!validateEmailInput(email)) { setLoading(false); return; }
    try {
      const signup = await supabase.auth.signUp({ email: normalizeEmail(email), password });
      if (signup.error) {
        setAuthError(signup.error);
        setLoading(false);
        return;
      }

      if (signup.data?.session) {
        setNotice({ kind: "success", text: "注册成功，正在进入..." });
        setLoading(false);
        return;
      }

      setAuthMode("login");
      setNotice({ kind: "success", text: "注册成功：已发送验证邮件。请到邮箱点击链接完成验证后，再用密码登录。" });
      setLoading(false);
    } catch (e: any) {
      setAuthError(e);
      setLoading(false);
    }
  };

  const handleGuestUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownLeftSec > 0) {
      setNotice({ kind: "error", text: `操作过于频繁，请等待 ${cooldownLeftSec}s 后再试。` });
      return;
    }
    setLoading(true);
    clearNotice();
    if (!validateEmailInput(email)) {
      setLoading(false);
      return;
    }
    try {
      const emailRedirectTo = (() => {
        try {
          return window.location.origin;
        } catch {
          return undefined;
        }
      })();
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizeEmail(email),
        options: {
          shouldCreateUser: true,
          ...(emailRedirectTo ? { emailRedirectTo } : {}),
        },
      });
      if (error) {
        setAuthError(error);
        setLoading(false);
        return;
      }
      setNotice({
        kind: "success",
        text: "注册链接已发送到你的邮箱。点击邮件里的链接后，系统会自动登录并把当前游客卡片迁移到正式账号。",
      });
      setLoading(false);
    } catch (e: any) {
      setAuthError(e);
      setLoading(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearNotice();
    try {
      onGuestEnter();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownLeftSec > 0) {
      setNotice({ kind: "error", text: `操作过于频繁，请等待 ${cooldownLeftSec}s 后再试。` });
      return;
    }
    setLoading(true);
    clearNotice();
    if (!validateEmailInput(email)) { setLoading(false); return; }
    const redirectTo = (() => {
      try {
        return `${window.location.origin}/reset-password`;
      } catch {
        return undefined;
      }
    })();
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), redirectTo ? { redirectTo } : undefined);
    if (error) setAuthError(error);
    else setNotice({ kind: "success", text: "已发送重置密码邮件，请查收并按邮件指引完成重置。" });
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-[#f7fbff] to-[#eef6ff] text-slate-900 flex items-center justify-center px-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 -left-36 h-[520px] w-[520px] rounded-full bg-[#007AFF]/15 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-44 h-[640px] w-[640px] rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,122,255,0.10),transparent_55%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.10),transparent_60%)]"></div>
      </div>

      <div className="w-full max-w-[920px] rounded-3xl border border-black/5 bg-white/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(2,6,23,0.12)] overflow-hidden animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative p-8 md:p-10 border-b md:border-b-0 md:border-r border-black/5 bg-gradient-to-b from-white to-[#f6fbff]">
            <div className="relative flex min-h-[420px] flex-col">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#007AFF]/10 border border-[#007AFF]/15 flex items-center justify-center shadow-[0_10px_30px_rgba(0,122,255,0.18)] text-[#007AFF]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-extrabold tracking-tight">嗨！嗑？</div>
                  <div className="text-sm text-slate-500">多重宇宙 · 人格共振 · 3D 对话</div>
                </div>
              </div>

              <div className="relative mt-8 flex-1 overflow-hidden rounded-[2rem] border border-[#007AFF]/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(232,244,255,0.96))] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_18px_40px_rgba(0,122,255,0.08)]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-[#007AFF]/10 blur-3xl"></div>
                  <div className="absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl"></div>
                </div>
                <div
                  className="relative text-[clamp(3rem,10vw,6.5rem)] leading-[0.9] tracking-tight text-[#0b2f59]/85 drop-shadow-[0_10px_20px_rgba(0,122,255,0.12)]"
                  style={{ fontFamily: '"Segoe Script", "Bradley Hand", "Brush Script MT", cursive' }}
                >
                  <div className="whitespace-nowrap">Create World</div>
                </div>
                <div
                  className="relative mt-5 max-w-[28rem] text-base md:text-[17px] leading-8 text-slate-600"
                  style={{ fontFamily: '"STXingkai", "STKaiti", "KaiTi", "FZShuTi", "Segoe Print", cursive' }}
                >
                  在同一张画布里连接人格卡片、动态发现、蒸馏养成与 3D 对话，让每一次进入都像翻开一张会呼吸的数字名片。
                </div>
              </div>

              <div className="mt-8 space-y-3 text-sm text-slate-600 leading-relaxed">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#007AFF]"></div>
                  <div>在我的世界发布/浏览动态，发现他人并发起聊天。</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#007AFF]"></div>
                  <div>在时空副本选择伙伴，围绕线索推进副本并生成分镜。</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#007AFF]"></div>
                  <div>进入 3D 聊天舞台，用你的“化身”与世界对话。</div>
                </div>
              </div>

            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold tracking-tight">
                {authMode === "forgot"
                  ? "找回密码"
                  : authMode === "guest"
                    ? "游客登录"
                    : authMode === "guestUpgrade"
                      ? "游客转正式账号"
                    : authMode === "login"
                      ? "登录"
                      : "注册"}
              </div>
              <div className="flex items-center gap-1 bg-slate-100 border border-black/5 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => { setAuthMode("guest"); clearNotice(); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${authMode === "guest" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}
                  disabled={loading}
                >
                  游客
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); clearNotice(); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${authMode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}
                  disabled={loading}
                >
                  密码
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("register"); clearNotice(); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${authMode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}
                  disabled={loading}
                >
                  注册
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("guestUpgrade"); clearNotice(); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${authMode === "guestUpgrade" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}
                  disabled={loading}
                >
                  转正式
                </button>
              </div>
            </div>

            {notice && (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${notice.kind === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : notice.kind === "info"
                    ? "bg-blue-50 border-blue-200 text-blue-800"
                    : "bg-red-50 border-red-200 text-red-800"}`}
              >
                <div>{notice.text}</div>
                {notice.kind === "error" && notice.text.includes("邮箱未验证") ? (
                  <div className="mt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResendVerifyEmail}
                        disabled={loading || resending || cooldownLeftSec > 0 || !String(email || "").trim()}
                        className="text-xs px-3 py-2 rounded-full bg-white/70 hover:bg-white border border-red-200 text-red-800 transition-colors disabled:opacity-60"
                      >
                        {resending ? "发送中..." : cooldownLeftSec > 0 ? `请等待 ${cooldownLeftSec}s` : "重新发送验证邮件"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOtpBox((v) => !v)}
                        className="text-xs px-3 py-2 rounded-full bg-white/70 hover:bg-white border border-red-200 text-red-800 transition-colors"
                      >
                        {showOtpBox ? "我没有验证码" : "我收到的是验证码"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {(showOtpBox && notice?.kind === "error" && notice.text.includes("邮箱未验证")) ? (
              <div className="mt-4 rounded-2xl border border-black/5 bg-slate-50 px-4 py-3">
                <div className="text-sm font-semibold">邮箱验证码</div>
                <div className="text-xs text-slate-500 mt-1">如果邮件里给的是 6 位验证码，在这里输入即可完成验证。</div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    inputMode="numeric"
                    placeholder="输入验证码"
                    className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading || resending || verifyingOtp || !String(email || "").trim()}
                    className="px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] text-white text-sm font-bold transition-colors disabled:opacity-60"
                  >
                    {verifyingOtp ? "验证中..." : "验证"}
                  </button>
                </div>
              </div>
            ) : null}

            <form
              className="mt-6 space-y-4"
              onSubmit={
                authMode === "forgot"
                  ? handleForgotPassword
                  : authMode === "guest"
                    ? handleGuestLogin
                    : authMode === "guestUpgrade"
                      ? handleGuestUpgrade
                    : authMode === "login"
                      ? handleLogin
                      : handleRegister
              }
            >
              {authMode !== "guest" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">邮箱</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/30" 
                      required 
                      autoComplete="email"
                    />
                  </div>
                </div>
              )}

              {(authMode === "login" || authMode === "register") && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">密码</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={authMode === "register" ? "至少 6 位（建议更长）" : "请输入密码"}
                      className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/30" 
                      required 
                      autoComplete={authMode === "login" ? "current-password" : "new-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-500 hover:text-slate-800 transition-colors"
                      aria-label={showPassword ? "隐藏密码" : "显示密码"}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94"/>
                          <path d="M1 1l22 22"/>
                          <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.77 21.77 0 0 1-4.12 5.06"/>
                          <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || cooldownLeftSec > 0}
                className="w-full rounded-2xl bg-[#007AFF] text-white py-3 font-bold tracking-wide hover:bg-[#0066d6] disabled:opacity-60 transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)]"
              >
                {loading
                  ? "处理中..."
                  : cooldownLeftSec > 0
                    ? `请等待 ${cooldownLeftSec}s`
                    : authMode === "forgot"
                      ? "发送重置邮件"
                      : authMode === "guest"
                        ? "游客进入"
                        : authMode === "guestUpgrade"
                          ? "发送注册链接"
                        : authMode === "login"
                          ? "登录"
                          : "创建账号"}
              </button>

              {authMode === "guest" && (
                <div className="rounded-2xl border border-[#007AFF]/10 bg-[#f6fbff] px-4 py-3 text-xs text-slate-600 leading-relaxed">
                  游客可直接进入并创建 1 张本地人格卡片；动态、对话、蒸馏、3D、商城等其他功能需注册后使用。
                </div>
              )}
              {authMode === "guestUpgrade" && (
                <div className="rounded-2xl border border-[#007AFF]/10 bg-[#f6fbff] px-4 py-3 text-xs text-slate-600 leading-relaxed">
                  只需填写邮箱。系统会发送一封注册/登录链接到你的邮箱，点开后自动进入正式账号，并保留你当前的游客卡片，无需重新回答问题。
                </div>
              )}
              {authMode === "forgot" && (
                <div className="text-xs text-slate-500 leading-relaxed">
                  我们会发送一封“重置密码”邮件到你的邮箱。打开邮件里的链接后设置新密码。
                </div>
              )}
              {authMode === "login" && (
                <button
                  type="button"
                  onClick={() => { setAuthMode("forgot"); clearNotice(); }}
                  className="text-xs text-slate-600 hover:text-slate-900 underline underline-offset-4"
                  disabled={loading}
                >
                  忘记密码？
                </button>
              )}
              {authMode === "forgot" && (
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); clearNotice(); }}
                  className="text-xs text-slate-600 hover:text-slate-900 underline underline-offset-4"
                  disabled={loading}
                >
                  返回登录
                </button>
              )}
            </form>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => onOpenFeedback({ source: "login" })}
                className="hover:text-slate-800 underline underline-offset-4"
                disabled={loading}
              >
                意见反馈
              </button>
              <div className="text-slate-400">遇到问题，欢迎随时告诉我们</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordPage({ onOpenFeedback }: { onOpenFeedback: (ctx: { source: string }) => void }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ kind: "error" | "success" | "info"; text: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setReady(true);
      if (session) {
        try {
          if (window.location.hash && window.location.hash.includes("access_token")) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
        } catch {}
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session) {
        setSession(session);
        setReady(true);
        try {
          if (window.location.hash && window.location.hash.includes("access_token")) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
        } catch {}
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const p1 = String(password || "");
    const p2 = String(confirm || "");
    if (p1.length < 6) return setNotice({ kind: "error", text: "密码至少 6 位（建议更长）" });
    if (p1 !== p2) return setNotice({ kind: "error", text: "两次输入的密码不一致" });
    setLoading(true);
    setNotice(null);
    const { error } = await supabase.auth.updateUser({ password: p1 });
    if (error) {
      setNotice({ kind: "error", text: error.message });
      setLoading(false);
      return;
    }
    setNotice({ kind: "success", text: "密码已更新，正在返回首页..." });
    setLoading(false);
    setTimeout(() => navigate("/"), 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-[#f7fbff] to-[#eef6ff] text-slate-900 flex items-center justify-center px-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 -left-36 h-[520px] w-[520px] rounded-full bg-[#007AFF]/15 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-44 h-[640px] w-[640px] rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,122,255,0.10),transparent_55%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.10),transparent_60%)]"></div>
      </div>
      <div className="w-full max-w-[560px] rounded-3xl border border-black/5 bg-white/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(2,6,23,0.12)] overflow-hidden animate-in fade-in duration-500">
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold tracking-tight">重置密码</div>
            <button
              type="button"
              onClick={() => onOpenFeedback({ source: "reset_password" })}
              className="text-xs text-slate-600 hover:text-slate-900 underline underline-offset-4"
            >
              意见反馈
            </button>
          </div>
          <div className="mt-3 text-sm text-slate-600 leading-relaxed">
            {ready
              ? session
                ? "请输入新密码并确认。"
                : "未检测到有效的重置会话。请从邮箱里的重置链接打开此页面，或回到登录页重新发送重置邮件。"
              : "正在加载重置会话..."}
          </div>

          {notice && (
            <div
              className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${notice.kind === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : notice.kind === "info"
                  ? "bg-blue-50 border-blue-200 text-blue-800"
                  : "bg-red-50 border-red-200 text-red-800"}`}
            >
              {notice.text}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">新密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位（建议更长）"
                className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/30"
                autoComplete="new-password"
                disabled={!session || loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">确认新密码</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="再输入一次"
                className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/30"
                autoComplete="new-password"
                disabled={!session || loading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={!session || loading}
              className="w-full rounded-2xl bg-[#007AFF] text-white py-3 font-bold tracking-wide hover:bg-[#0066d6] disabled:opacity-60 transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)]"
            >
              {loading ? "处理中..." : "更新密码"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-2xl border border-black/10 bg-white py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              返回首页
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setConfirm("");
    setLoading(false);
    setNotice(null);
  }, [open]);

  const submit = async () => {
    const p1 = String(password || "");
    const p2 = String(confirm || "");
    if (p1.length < 6) return setNotice({ kind: "error", text: "密码至少 6 位（建议更长）" });
    if (p1 !== p2) return setNotice({ kind: "error", text: "两次输入的密码不一致" });
    setLoading(true);
    setNotice(null);
    const { error } = await supabase.auth.updateUser({ password: p1 });
    if (error) {
      setNotice({ kind: "error", text: error.message });
      setLoading(false);
      return;
    }
    setNotice({ kind: "success", text: "密码已更新" });
    setLoading(false);
    setTimeout(() => onClose(), 600);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] rounded-2xl border border-app-border/15 bg-app-elevated/95 text-app-fg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-app-border/12">
          <div className="font-bold text-lg">修改密码</div>
          <button
            onClick={onClose}
            className="p-2 text-app-muted hover:text-app-fg hover:bg-app-surface/30 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-4">
          {notice && (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm ${notice.kind === "success"
                ? "bg-emerald-500/10 border-emerald-300/20 text-emerald-200"
                : "bg-red-500/10 border-red-300/20 text-red-200"}`}
            >
              {notice.text}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <div className="text-sm text-app-muted mb-2">新密码</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#131313] text-app-fg border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30"
                placeholder="至少 6 位（建议更长）"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
            <div>
              <div className="text-sm text-app-muted mb-2">确认新密码</div>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-[#131313] text-app-fg border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30"
                placeholder="再输入一次"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-app-fg hover:bg-white/10"
              disabled={loading}
            >
              取消
            </button>
            <button
              onClick={submit}
              className="px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] text-white font-semibold transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "提交中..." : "更新"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExplorationRealm({ 
  realm, 
  activePersona, 
  allOtherPersonas,
  viewerUserId,
  myFollows,
  followCountByPersonaId,
  onToggleFollow,
  onGoMyMoments,
  onStartChat,
  onInventoryUpdate,
  embedded,
  session
}: { 
  realm: string, 
  activePersona: any, 
  allOtherPersonas: any[],
  viewerUserId: string,
  myFollows: string[],
  followCountByPersonaId: Record<string, number>,
  onToggleFollow: (targetPersonaId: string, targetOwnerId?: string) => Promise<void>,
  onGoMyMoments: () => void,
  onStartChat: (targetName: string) => void,
  onInventoryUpdate: (newInv: string[]) => void,
  embedded?: boolean,
  session?: any
}) {
  const [world, setWorld] = useState("自定义世界");
  const [customWorldName, setCustomWorldName] = useState("");
  const [customWorldDesc, setCustomWorldDesc] = useState("");
  const [history, setHistory] = useState<{
    role: "user" | "assistant";
    content: string;
    images?: { url: string; caption?: string }[];
    audio?: { url: string; durationMs?: number; mime?: string };
  }[]>([]);
  const [instruction, setInstruction] = useState("");
  const [isExploring, setIsExploring] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceUploading, setVoiceUploading] = useState(false);
  const [voiceDurationMs, setVoiceDurationMs] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<BlobPart[]>([]);
  const voiceStartAtRef = useRef<number>(0);
  const voiceTickRef = useRef<number | null>(null);
  const [hp, setHp] = useState(100);
  const [hpAnim, setHpAnim] = useState<{value: number, id: number} | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const partyModeKey = useMemo(() => `ui-nexus-party-mode:v1:${viewerUserId}`, [viewerUserId]);
  const [partyMode, setPartyMode] = useState<"duo" | "party">("duo");
  const clueOwnersKey = useMemo(
    () => `ui-nexus-clue-owners:v1:${viewerUserId}:${String(activePersona?.id || "none")}`,
    [viewerUserId, activePersona?.id],
  );
  const [clueOwners, setClueOwners] = useState<{
    byIdx: Record<string, "me" | "them">;
    lastOwner: "me" | "them" | null;
    streak: number;
  }>({ byIdx: {}, lastOwner: null, streak: 0 });
  const [selectedClueIdx, setSelectedClueIdx] = useState<number | null>(null);
  const [bond, setBond] = useState(0);
  const [bondAnim, setBondAnim] = useState<{value: number, id: number} | null>(null);
  const [outputMode, setOutputMode] = useState<"text" | "storyboard">("text");
  const [storyboardStyle, setStoryboardStyle] = useState<"anime" | "realistic" | "cyber">("anime");
  const [storyboardShots, setStoryboardShots] = useState(4);
  const storyboardStyleLabel =
    ({ anime: "动漫", realistic: "写实", cyber: "赛博" } as const)[storyboardStyle] || storyboardStyle;
  const realmStateRef = useRef<Record<string, any>>({});
  const currentRealmStateKey = useMemo(
    () => `${realm}:${String(activePersona?.id || "none")}`,
    [realm, activePersona?.id],
  );
  const prevRealmStateKeyRef = useRef<string>(currentRealmStateKey);
  const didAutoDefaultPartnersRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(partyModeKey);
      if (raw === "party") setPartyMode("party");
    } catch {}
  }, [partyModeKey]);

  useEffect(() => {
    try {
      localStorage.setItem(partyModeKey, partyMode);
    } catch {}
  }, [partyModeKey, partyMode]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(clueOwnersKey);
      if (!raw) {
        setClueOwners({ byIdx: {}, lastOwner: null, streak: 0 });
        return;
      }
      const parsed = JSON.parse(raw);
      const byIdx = parsed?.byIdx && typeof parsed.byIdx === "object" ? parsed.byIdx : {};
      const lastOwner = parsed?.lastOwner === "them" ? "them" : parsed?.lastOwner === "me" ? "me" : null;
      const streak = typeof parsed?.streak === "number" ? parsed.streak : 0;
      setClueOwners({ byIdx, lastOwner, streak });
    } catch {
      setClueOwners({ byIdx: {}, lastOwner: null, streak: 0 });
    }
  }, [clueOwnersKey]);

  useEffect(() => {
    try {
      localStorage.setItem(clueOwnersKey, JSON.stringify(clueOwners));
    } catch {}
  }, [clueOwnersKey, clueOwners]);
  const [mortalMoments, setMortalMoments] = useState<any[]>([]);
  const [mortalLoading, setMortalLoading] = useState(false);
  const [mortalError, setMortalError] = useState<string | null>(null);
  const [mortalComposerOpen, setMortalComposerOpen] = useState(false);
  const [mortalComposerText, setMortalComposerText] = useState("");
  const [mortalComposerLoading, setMortalComposerLoading] = useState(false);
  const [mortalSchemaHelpOpen, setMortalSchemaHelpOpen] = useState(false);
  const [storyPackId, setStoryPackId] = useState<string>("novelpack-cyber-echo");
  const [storyNodeIndex, setStoryNodeIndex] = useState(0);
  const [storyRunning, setStoryRunning] = useState(false);
  const [playMode, setPlayMode] = useState<"sandbox" | "story">("story");

  const stopVoiceTimer = () => {
    if (voiceTickRef.current != null) {
      window.clearInterval(voiceTickRef.current);
      voiceTickRef.current = null;
    }
  };

  const cleanupVoiceStream = () => {
    const s = voiceStreamRef.current;
    if (s) {
      for (const t of s.getTracks()) t.stop();
    }
    voiceStreamRef.current = null;
  };

  const maybeProxyMediaUrl = (url: string) => {
    const raw = String(url || "").trim();
    if (!raw) return raw;
    if (raw.includes("tencentcos.cn") || raw.includes("volces.com") || raw.includes("myqcloud.com")) {
      return `${API_BASE_URL}/api/proxy?url=${encodeURIComponent(raw)}`;
    }
    return raw;
  };

  const formatDuration = (ms?: number) => {
    const n = typeof ms === "number" && Number.isFinite(ms) ? Math.max(0, Math.floor(ms)) : 0;
    const s = Math.floor(n / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const startVoiceMessage = async () => {
    if (voiceRecording || voiceUploading) return;
    setVoiceError(null);
    setVoiceDurationMs(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      voiceRecorderRef.current = recorder;
      voiceChunksRef.current = [];
      voiceStartAtRef.current = Date.now();

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) voiceChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stopVoiceTimer();
        setVoiceRecording(false);
        try {
          const blob = new Blob(voiceChunksRef.current, { type: recorder.mimeType || "audio/webm" });
          if (!blob.size) return;
          setVoiceUploading(true);
          const file = new File([blob], `voice-${Date.now()}.webm`, { type: blob.type || "audio/webm" });
          const fd = new FormData();
          fd.append("audio", file);
          const res = await fetch(`${API_BASE_URL}/api/cos/upload-audio`, {
            method: "POST",
            headers: withPluginTokenHeaders({}),
            body: fd,
          });
          if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(t || `Upload failed: HTTP ${res.status}`);
          }
          const data = await res.json();
          const url = String(data?.url || "");
          if (!url) throw new Error("Upload failed: missing url");
          const durationMs = Math.max(0, Date.now() - voiceStartAtRef.current);
          setHistory((prev) => [
            ...prev,
            { role: "user", content: "", audio: { url, durationMs, mime: file.type } },
          ]);
        } catch (e: any) {
          setVoiceError(String(e?.message || "语音上传失败"));
        } finally {
          setVoiceUploading(false);
          cleanupVoiceStream();
          voiceRecorderRef.current = null;
          voiceChunksRef.current = [];
        }
      };

      recorder.start();
      setVoiceRecording(true);
      stopVoiceTimer();
      voiceTickRef.current = window.setInterval(() => {
        setVoiceDurationMs(Date.now() - voiceStartAtRef.current);
      }, 200);
      window.setTimeout(() => {
        try {
          if (voiceRecorderRef.current && voiceRecorderRef.current.state === "recording") voiceRecorderRef.current.stop();
        } catch {}
      }, 60_000);
    } catch (e: any) {
      const errName = String(e?.name || "");
      const errMsg = String(e?.message || "");
      const inIframe = (() => {
        try {
          return window.self !== window.top;
        } catch {
          return true;
        }
      })();
      const msg = !window.isSecureContext
        ? "麦克风需要 HTTPS 或 localhost 环境才能使用。"
        : inIframe
          ? "当前页面在内嵌框架中，浏览器可能禁止麦克风。请在新标签页打开页面再试。"
          : errName === "NotAllowedError" || errName === "PermissionDeniedError" || /permission denied|denied/i.test(errMsg)
            ? "麦克风权限被拒绝：请在浏览器地址栏左侧的站点设置里把“麦克风”改为允许，然后刷新页面。"
            : errName === "NotFoundError"
              ? "未检测到麦克风设备：请检查系统是否有麦克风、是否被占用或被系统禁用。"
              : errMsg || "无法开启麦克风";
      setVoiceError(msg);
      setVoiceRecording(false);
      stopVoiceTimer();
      cleanupVoiceStream();
      voiceRecorderRef.current = null;
    }
  };

  const stopVoiceMessage = () => {
    if (!voiceRecorderRef.current) return;
    try {
      if (voiceRecorderRef.current.state === "recording") voiceRecorderRef.current.stop();
    } catch {}
  };

  const STORY_PACKS = useMemo(
    () =>
      [
        {
          id: "novelpack-tutorial",
          title: "校园清冷·新手教程: 借来的外套 (5分钟)",
          worldName: "现代大学校园",
          worldDesc: "深秋的校园，晚风微凉。主角与一个清冷孤傲的学霸同学被锁在天台，对方只穿了一件单薄的衬衫。",
          nodes: [
            {
              title: "序幕：天台受困",
              instruction: "以小说章节方式写第一幕：主角发现天台门被反锁，转身看到那个平时高冷的学霸同学正靠在栏杆上微微发抖。描写对方的清冷感和当前的狼狈。结尾必须给出2-4个分镜提示。",
            },
            {
              title: "第一幕：递出外套",
              instruction: "推进剧情：主角脱下外套递给对方。描写对方惊讶、犹豫到最终接过的心理活动和微表情。气氛要有微妙的拉扯。结尾必须给出2-4个分镜提示。",
            },
            {
              title: "第二幕：破冰交谈",
              instruction: "推进剧情：两人披着外套并肩坐下，对方主动开口打破沉默，透露了一点不为人知的软弱或秘密。主角回应。结尾必须给出2-4个分镜提示。",
            },
            {
              title: "第三幕：获救与余韵",
              instruction: "推进剧情：保安打开了门。两人归还外套，对方留下了一句意味深长的话或一个约定。描写离别时的背影。结尾必须给出2-4个分镜提示。",
            }
          ]
        },
        {
          id: "novelpack-cyber-echo",
          title: "赛博雨夜：回声事故",
          worldName: "赛博雨夜",
          worldDesc:
            "高科技低生活，霓虹雨幕覆盖城市。每个人都有数字人格，黑市里流通着“回声”碎片。你们被卷入一起跨宇宙信号泄漏事故。",
          nodes: [
            {
              title: "序章：雨夜故障",
              instruction:
                "以小说章节方式写第一幕：雨夜停电，街区广播出现不属于本宇宙的‘回声’，主角与同伴在街角遇到异常。推进情节并给出2-4个关键镜头分镜提示。",
            },
            {
              title: "第一幕：黑市线索",
              instruction:
                "以小说章节方式推进第二幕：你们进入黑市寻找回声来源，遭遇中间人试探与交易冲突。给出紧张的对话与选择，并生成2-4个关键镜头分镜提示。",
            },
            {
              title: "第二幕：信号裂缝",
              instruction:
                "以小说章节方式推进第三幕：追踪到信号裂缝点，出现视觉扭曲与人格记忆错位，必须做出抉择。给出高潮段落与结尾悬念，并生成2-4个关键镜头分镜提示。",
            },
          ],
        },
        {
          id: "novelpack-zombie",
          title: "丧尸围城的超市",
          worldName: "废弃超市",
          worldDesc: "被丧尸包围的废弃超市，物资匮乏，危机四伏。",
          nodes: [
            {
              title: "第一幕：物资搜寻",
              instruction: "以小说章节方式写第一幕：主角与同伴在货架间搜寻罐头，门外传来挠门声，丧尸正在聚集。给出2-4个关键镜头分镜提示。",
            },
            {
              title: "第二幕：突破重围",
              instruction: "推进剧情：门被撞破，丧尸涌入，你们必须找到出路或武器。给出紧张的对话与选择，并生成2-4个关键镜头分镜提示。",
            }
          ]
        },
        {
          id: "novelpack-han-dynasty",
          title: "汉朝风云",
          worldName: "汉朝",
          worldDesc: "古代汉朝，皇权争斗，江湖恩怨。",
          nodes: [
            {
              title: "第一幕：宫廷暗流",
              instruction: "以小说章节方式写第一幕：主角被卷入一场关于密信的争斗，同伴带来了一个危险的警告。给出2-4个关键镜头分镜提示。",
            },
            {
              title: "第二幕：夜奔出城",
              instruction: "推进剧情：刺客追杀，你们必须在城门关闭前逃离长安。给出紧张的对话与选择，并生成2-4个关键镜头分镜提示。",
            }
          ]
        },
        {
          id: "novelpack-journey-to-west",
          title: "西游世界",
          worldName: "西游世界",
          worldDesc: "妖魔横行的西游世界，求取真经的路上。",
          nodes: [
            {
              title: "第一幕：荒野妖踪",
              instruction: "以小说章节方式写第一幕：日落时分，你们在荒野中迷路，前方出现一座诡异的破庙。给出2-4个关键镜头分镜提示。",
            },
            {
              title: "第二幕：破庙惊魂",
              instruction: "推进剧情：进入庙中避雨，却发现佛像流下血泪，同伴察觉到异样。给出紧张的对话与选择，并生成2-4个关键镜头分镜提示。",
            }
          ]
        },
        {
          id: "novelpack-deepsea-station",
          title: "深海考察站：低语",
          worldName: "深海考察站",
          worldDesc:
            "万米深海，考察站被未知低语包围。设备老化、资源紧张、每个人的心理防线都在崩裂。你们必须在封闭空间里一起撑过这一夜。",
          nodes: [
            {
              title: "序章：压力警报",
              instruction:
                "以小说章节方式写第一幕：考察站压力警报响起，通讯短暂失联，走廊灯光闪烁。主角与同伴检查设备并发现异常痕迹。生成2-4个关键镜头分镜提示。",
            },
            {
              title: "第一幕：舱门之外",
              instruction:
                "以小说章节方式推进第二幕：你们必须决定是否打开外部舱门进行维修，外面有未知影子掠过。写出冲突、恐惧与协作，并生成2-4个关键镜头分镜提示。",
            },
            {
              title: "第二幕：低语真相",
              instruction:
                "以小说章节方式推进第三幕：低语来源逐渐清晰，出现记忆投影与人格镜像。给出高潮、代价与短暂的胜利，最后留下可继续的悬念，并生成2-4个关键镜头分镜提示。",
            },
          ],
        },
        {
          id: "tutorialpack-campus-jdrama",
          title: "校园清冷·新手教程：借来的外套（5分钟）",
          worldName: "现实校园",
          worldDesc:
            "晚自习后的教学楼走廊，冷白灯与自动贩卖机的嗡鸣。你们是网友线下第一次见，话不多，但一步也没走散。",
          nodes: [
            {
              title: "序章：走廊冷白灯",
              instruction:
                "写一个极短的开场（2-4句），现实校园、克制、留白。主角与同伴是网友线下第一次见面，彼此还没确认身份，但一起往教学楼二层走。最后补一句提示：玩家只要说一句行动即可推进剧情。",
            },
            {
              title: "第一幕：借来的外套",
              instruction:
                "推进一幕（不超过200字），保持日剧式克制。场景在二层走廊与自动贩卖机旁：风很冷，同伴把外套搭过来但不解释。你们发现一个线索（便签/失物招领卡皆可），线索标题必须是10-20字、便于记录。结尾给出2-3个可选行动（短句）。必须设置 changes.new_item 为该线索标题。",
            },
            {
              title: "第二幕：把线索收好",
              instruction:
                "推进第二幕（不超过220字），围绕上一幕线索做一个小选择，不要解释谜底，给留白与下一次见面的理由。结尾生成一段“共同记忆卡”文案，必须包含这一句且原样输出：我们没有确认彼此，但一起走到了这里。再给一个下一幕钩子（如：天台/图书馆/雨天公交站）。本幕不要再新增 new_item。",
            },
          ],
        },
      ] as const,
    [],
  );

  const currentStoryPack = useMemo(() => {
    const id = String(storyPackId || "").trim();
    return STORY_PACKS.find((p) => p.id === id) || STORY_PACKS[0];
  }, [STORY_PACKS, storyPackId]);

  const fetchMortalMoments = async () => {
    setMortalLoading(true);
    setMortalError(null);
    try {
      const { data, error } = await supabase
        .from("moments")
        .select("id, persona_id, content, likes, created_at, personas(*)")
        .order("created_at", { ascending: false })
        .limit(40);
      if (error) throw error;
      setMortalMoments(data || []);
    } catch (e: any) {
      setMortalError(e?.message ? String(e.message) : "动态加载失败");
      setMortalMoments([]);
    } finally {
      setMortalLoading(false);
    }
  };

  const postMortalMoment = async () => {
    if (!activePersona) return;
    const content = String(mortalComposerText || "").trim();
    if (!content) return;
    setMortalComposerLoading(true);
    try {
      const { data, error } = await supabase
        .from("moments")
        .insert({
          persona_id: activePersona.id,
          content,
          likes: 0,
        })
        .select("id, persona_id, content, likes, created_at, personas(*)")
        .single();
      if (error) throw error;
      const fallbackPersona = {
        name: activePersona?.name,
        mbti: activePersona?.mbti,
        card_cover_url: (activePersona as any)?.card_cover_url,
        avatar_2d_url: (activePersona as any)?.avatar_2d_url,
      };
      const row = (data as any) || {
        id: `local-${Date.now()}`,
        persona_id: activePersona.id,
        content,
        likes: 0,
        created_at: new Date().toISOString(),
        personas: fallbackPersona,
      };
      if (!row.personas) row.personas = fallbackPersona;
      setMortalMoments((prev) => [row, ...(Array.isArray(prev) ? prev : [])]);
      setMortalComposerText("");
      setMortalComposerOpen(false);
      void fetchMortalMoments();
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : "发布失败";
      alert(`发布失败：${msg}`);
    } finally {
      setMortalComposerLoading(false);
    }
  };

  const aiDraftMortalMoment = async () => {
    if (!activePersona) return;
    setMortalComposerLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/generate-echo`, {
        method: "POST",
        headers: withPluginTokenHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          name: activePersona.name,
          mbti: activePersona.mbti,
          vibe: activePersona.vibe,
          logic: activePersona.logic,
        }),
      });
      if (!res.ok) {
        let detail = "";
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const j = await res.json();
            detail =
              String((j as any)?.message || (j as any)?.error || (j as any)?.code || "").trim() ||
              JSON.stringify(j);
          } else {
            detail = (await res.text()).trim();
          }
        } catch {}
        throw new Error(detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const next = String((data as any)?.content || "").trim();
      if (next) {
        setMortalComposerText(next);
        setMortalComposerOpen(true);
      }
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : "生成失败";
      alert(`生成回声出错：${msg}`);
    } finally {
      setMortalComposerLoading(false);
    }
  };

  const MOMENT_LIKES_KEY = "ui-moment-likes:v1";
  const isMortalMomentLiked = (momentId: string) => {
    const uid = String(viewerUserId || "").trim();
    const id = String(momentId || "").trim();
    if (!uid || !id) return false;
    try {
      const raw = localStorage.getItem(MOMENT_LIKES_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as Record<string, string[]>;
      const list = Array.isArray(parsed?.[uid]) ? parsed[uid] : [];
      return list.includes(id);
    } catch {
      return false;
    }
  };
  const markMortalMomentLiked = (momentId: string) => {
    const uid = String(viewerUserId || "").trim();
    const id = String(momentId || "").trim();
    if (!uid || !id) return;
    try {
      const raw = localStorage.getItem(MOMENT_LIKES_KEY);
      const parsed = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
      const prev = Array.isArray(parsed?.[uid]) ? parsed[uid] : [];
      if (prev.includes(id)) return;
      const next = { ...(parsed || {}), [uid]: [...prev, id].slice(-5000) };
      localStorage.setItem(MOMENT_LIKES_KEY, JSON.stringify(next));
    } catch {}
  };

  const likeMortalMoment = async (momentId: string) => {
    const id = String(momentId || "").trim();
    if (!id) return;
    if (isMortalMomentLiked(id)) return;
    markMortalMomentLiked(id);
    const current = mortalMoments.find((x) => String((x as any)?.id) === id) as any;
    const prevLikes = typeof current?.likes === "number" ? current.likes : Number(current?.likes || 0) || 0;
    setMortalMoments((prev) =>
      prev.map((x) => (String((x as any)?.id) === id ? { ...(x as any), likes: prevLikes + 1 } : x)),
    );
    try {
      const { data, error } = await supabase.rpc("like_moment", { moment_id: id });
      if (error) throw error;
      const nextLikes = Number(data);
      setMortalMoments((prev) =>
        prev.map((x) => (String((x as any)?.id) === id ? { ...(x as any), likes: Number.isFinite(nextLikes) ? nextLikes : prevLikes + 1 } : x)),
      );
    } catch (e: any) {
      setMortalMoments((prev) =>
        prev.map((x) => (String((x as any)?.id) === id ? { ...(x as any), likes: prevLikes } : x)),
      );
      const msg = e?.message ? String(e.message) : "点赞失败";
      alert(`点赞失败：${msg}`);
    }
  };

  useEffect(() => {
    const prevRealmStateKey = prevRealmStateKeyRef.current;
    realmStateRef.current[prevRealmStateKey] = {
      world,
      customWorldName,
      customWorldDesc,
      history,
      instruction,
      hp,
      partners,
      partyMode,
      bond,
      outputMode,
      storyboardStyle,
      storyboardShots,
      storyPackId,
      storyNodeIndex,
      storyRunning,
      playMode,
    };

    const snap = realmStateRef.current[currentRealmStateKey];
    if (snap) {
      setWorld(typeof snap.world === "string" ? snap.world : "丧尸围城的超市");
      setCustomWorldName(typeof snap.customWorldName === "string" ? snap.customWorldName : "");
      setCustomWorldDesc(typeof snap.customWorldDesc === "string" ? snap.customWorldDesc : "");
      setHistory(Array.isArray(snap.history) ? snap.history : []);
      setInstruction(typeof snap.instruction === "string" ? snap.instruction : "");
      setHp(typeof snap.hp === "number" ? snap.hp : 100);
      setPartners(Array.isArray(snap.partners) ? snap.partners : []);
      setPartyMode(snap.partyMode === "party" ? "party" : "duo");
      setBond(typeof snap.bond === "number" ? snap.bond : 0);
      setOutputMode(snap.outputMode === "storyboard" ? "storyboard" : "text");
      setStoryboardStyle(
        snap.storyboardStyle === "realistic" || snap.storyboardStyle === "cyber" ? snap.storyboardStyle : "anime"
      );
      setStoryboardShots(typeof snap.storyboardShots === "number" ? snap.storyboardShots : 4);
      setStoryPackId(typeof snap.storyPackId === "string" ? snap.storyPackId : "novelpack-cyber-echo");
      setStoryNodeIndex(typeof snap.storyNodeIndex === "number" ? snap.storyNodeIndex : 0);
      setStoryRunning(Boolean(snap.storyRunning));
      setPlayMode(snap.playMode === "story" ? "story" : "sandbox");
    } else {
      setWorld("自定义世界");
      setCustomWorldName("");
      setCustomWorldDesc("");
      setHistory([]);
      setInstruction("");
      setHp(100);
      setPartners([]);
      setPartyMode("duo");
      setBond(0);
      setOutputMode("text");
      setStoryboardStyle("anime");
      setStoryboardShots(4);
      setStoryPackId("novelpack-cyber-echo");
      setStoryNodeIndex(0);
      setStoryRunning(false);
      setPlayMode("story");
    }

    setHpAnim(null);
    setBondAnim(null);
    setIsExploring(false);
    prevRealmStateKeyRef.current = currentRealmStateKey;
  }, [currentRealmStateKey]);

  useEffect(() => {
    if (realm !== "mortal") return;
    void fetchMortalMoments();
  }, [realm]);

  const primaryPartner = Array.isArray(partners) && partners.length ? partners[0] : null;

  useEffect(() => {
    if (realm !== "nexus") return;
    if (didAutoDefaultPartnersRef.current) return;
    if (Array.isArray(partners) && partners.length) {
      didAutoDefaultPartnersRef.current = true;
      return;
    }
    if (!Array.isArray(allOtherPersonas) || allOtherPersonas.length === 0) return;
    setPartners([allOtherPersonas[0]]);
    didAutoDefaultPartnersRef.current = true;
  }, [realm, allOtherPersonas, partners]);

  useEffect(() => {
    if (realm !== "nexus") return;
    if (partyMode !== "duo") return;
    if (!Array.isArray(partners)) return;
    if (partners.length <= 1) return;
    setPartners(partners.slice(0, 1));
  }, [realm, partyMode, partners]);

  useEffect(() => {
    if (realm !== "nexus") return;
    const invLen = Array.isArray(activePersona?.inventory) ? activePersona.inventory.length : 0;
    if (!invLen) return;
    setClueOwners((prev) => {
      const byIdx = { ...(prev?.byIdx || {}) } as Record<string, "me" | "them">;
      let changed = false;
      const seed =
        String(viewerUserId || "")
          .split("")
          .reduce((a, c) => a + c.charCodeAt(0), 0) + String(activePersona?.id || "").length * 31;
      for (let i = 0; i < invLen; i++) {
        const k = String(i);
        if (byIdx[k] === "me" || byIdx[k] === "them") continue;
        const v = (i * 9301 + seed * 49297 + 233280) % 233280;
        byIdx[k] = v % 2 === 0 ? "me" : "them";
        changed = true;
      }
      if (!changed) return prev;
      return { ...prev, byIdx };
    });
  }, [realm, viewerUserId, activePersona?.id, Array.isArray(activePersona?.inventory) ? activePersona.inventory.length : 0]);

  const handleDeleteClue = async (invIdx: number) => {
    const currentInv = Array.isArray(activePersona?.inventory) ? activePersona.inventory : [];
    if (!activePersona?.id || invIdx < 0 || invIdx >= currentInv.length) return;
    const newInv = currentInv.filter((_: any, idx: number) => idx !== invIdx);
    await supabase.from("personas").update({ inventory: newInv }).eq("id", activePersona.id);
    onInventoryUpdate(newInv);
    setClueOwners((prev) => {
      const src = { ...(prev?.byIdx || {}) } as Record<string, "me" | "them">;
      const nextByIdx: Record<string, "me" | "them"> = {};
      Object.entries(src).forEach(([key, value]) => {
        const idx = Number(key);
        if (!Number.isFinite(idx) || idx === invIdx) return;
        nextByIdx[String(idx > invIdx ? idx - 1 : idx)] = value;
      });
      return { ...prev, byIdx: nextByIdx };
    });
    setSelectedClueIdx((prev) => {
      if (prev == null) return prev;
      if (prev === invIdx) return null;
      return prev > invIdx ? prev - 1 : prev;
    });
  };

  const clueInventory = Array.isArray(activePersona?.inventory) ? activePersona.inventory : [];
  const clueCards = clueInventory
    .map((c: any, invIdx: number) => ({ clue: String(c), invIdx }))
    .slice()
    .reverse();
  const myClueCount = clueInventory.reduce((count: number, _c: any, idx: number) => {
    const owner = (clueOwners?.byIdx || {})[String(idx)] || "me";
    return count + (owner === "me" ? 1 : 0);
  }, 0);
  const partnerClueCount = Math.max(0, clueInventory.length - myClueCount);

  useEffect(() => {
    setSelectedClueIdx(null);
  }, [activePersona?.id]);

  useEffect(() => {
    setBond(0);
  }, [primaryPartner]);
  
  const handleExplore = async (overrideInstruction?: string): Promise<boolean> => {
    if (!activePersona) return false;
    if (hp <= 0) {
      alert("主角已牺牲，请重新开始！");
      return false;
    }
    
    setIsExploring(true);
    const pending = typeof overrideInstruction === "string" && overrideInstruction.trim()
      ? overrideInstruction.trim()
      : instruction;
    const currentInstruction = pending || "继续剧情，制造危机。";
    
    const newHistory = [...history];
    if (pending) {
      newHistory.push({ role: 'user', content: `**神谕：** ${pending}` });
      setHistory(newHistory);
      if (!overrideInstruction) setInstruction("");
    }

    try {
      const worldName = customWorldName;
      const worldDesc = customWorldDesc;

      const partnerPayloadRaw =
        realm === "nexus"
          ? partyMode === "duo"
            ? (primaryPartner ? [primaryPartner] : [])
            : (Array.isArray(partners) ? partners : [])
          : [];
      const partnerPayload = partnerPayloadRaw
        .filter((x) => x && String((x as any)?.name || "").trim())
        .slice(0, 8)
        .map((x) => ({
          name: String((x as any)?.name || "").trim(),
          mbti: String((x as any)?.mbti || "").trim() || undefined,
          logic: String((x as any)?.logic || "").trim() || undefined,
        }));

      const invRaw = Array.isArray(activePersona.inventory) ? activePersona.inventory : [];
      const invForPrompt =
        realm === "nexus" && primaryPartner
          ? invRaw.map((c: any, idx: number) => {
              const owner = (clueOwners?.byIdx || {})[String(idx)] || "me";
              const label = owner === "them" ? "同伴持有" : "主角持有";
              return `${String(c)}（${label}）`;
            })
          : invRaw;

      const basePayload = {
        worldName,
        worldDesc,
        instruction: currentInstruction,
        history: newHistory,
        myInfo: {
          name: activePersona.name,
          mbti: activePersona.mbti,
          vibe: activePersona.vibe,
          speech_style: activePersona.speech_style,
          logic: activePersona.logic,
          appearance: (() => {
            try {
              const raw = localStorage.getItem("persona-appearance:v1");
              const parsed = raw ? JSON.parse(raw) : {};
              const v = String((parsed as any)?.[String(activePersona.id)] || "").trim();
              return v || undefined;
            } catch {
              return undefined;
            }
          })(),
          referenceImageUrl: (() => {
            const u = String((activePersona as any)?.card_cover_url || (activePersona as any)?.avatar_2d_url || "").trim();
            return /^https?:\/\//i.test(u) ? u : undefined;
          })(),
          inventory: invForPrompt
        },
        partners: realm === "nexus" && partnerPayload.length ? partnerPayload : undefined,
      };

      const headers = withPluginTokenHeaders({ "Content-Type": "application/json" });
      const accessToken = session?.access_token ? String(session.access_token) : "";
      if (accessToken) {
        headers["authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(
        outputMode === "storyboard" ? `${API_BASE_URL}/api/storyboard` : `${API_BASE_URL}/api/explore-realm`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(
            outputMode === "storyboard"
              ? {
                  ...basePayload,
                  style: storyboardStyle,
                  shots: storyboardShots,
                }
              : {
                  realm,
                  ...basePayload,
                }
          )
        }
      );

      if (!res.ok) {
        let detail = "";
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const j = await res.json();
            detail = String(j?.message || j?.error || j?.code || "").trim() || JSON.stringify(j);
          } else {
            detail = (await res.text()).trim();
          }
        } catch {}
        const suffix = detail ? `：${detail}` : "";
        throw new Error(`探索失败（${res.status}）${suffix}`);
      }
      const data = await res.json();
      
      if (outputMode === "storyboard") {
        const shots = Array.isArray(data?.shots) ? data.shots : [];
        newHistory.push({
          role: "assistant",
          content: `🎬 分镜已生成（${shots.length || storyboardShots} 镜，风格：${storyboardStyleLabel}）`,
          images: shots
            .filter((s: any) => typeof s?.imageUrl === "string" && s.imageUrl.trim())
            .map((s: any, idx: number) => ({
              url: String(s.imageUrl),
                caption: String(s?.caption || s?.prompt || `镜头 ${idx + 1}`).trim()
            }))
        });
        setHistory(newHistory);
        return true;
      }

      newHistory.push({ role: 'assistant', content: data.story });
      setHistory(newHistory);

      if (data.changes) {
        if (data.changes.hp_change) {
          setHpAnim({ value: data.changes.hp_change, id: Date.now() });
          setHp(prev => Math.max(0, prev + data.changes.hp_change));
          setTimeout(() => setHpAnim(null), 2000);
        }
        if (data.changes.bond_change && primaryPartner) {
          setBondAnim({ value: data.changes.bond_change, id: Date.now() + 1 });
          setBond(prev => prev + data.changes.bond_change);
          setTimeout(() => setBondAnim(null), 2000);
        }
        if (data.changes.new_item) {
          const currentInv = activePersona.inventory || [];
          const clue = String(data.changes.new_item || "").trim();
          if (!clue) return true;
          if (currentInv.length < 12) {
            const newInv = [...currentInv, clue];
            await supabase.from('personas').update({ inventory: newInv }).eq('id', activePersona.id);
            onInventoryUpdate(newInv);
            const idx = currentInv.length;
            setClueOwners((prev) => {
              const last = prev?.lastOwner || null;
              const streak = typeof prev?.streak === "number" ? prev.streak : 0;
              let next: "me" | "them" = "me";
              if (primaryPartner) {
                if (last && streak >= 2) next = last === "me" ? "them" : "me";
                else next = Math.random() < 0.5 ? "me" : "them";
              }
              const nextStreak = next === last ? streak + 1 : 1;
              return {
                byIdx: { ...(prev?.byIdx || {}), [String(idx)]: next },
                lastOwner: next,
                streak: nextStreak,
              };
            });
            setHistory((prev) => [...prev, { role: "assistant", content: `🔎 发现线索：${clue}` }]);
          } else {
            setHistory((prev) => [...prev, { role: "assistant", content: `⚠️ 发现线索但线索簿已满：${clue}` }]);
          }
        }
      }
      return true;
    } catch (e) {
      const msg = (e as any)?.message ? String((e as any).message) : "未知错误";
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("invalid token")) {
        if (ADMIN_UI) {
          alert(
            "发生错误: 探索失败（鉴权失败）。请在浏览器 localStorage 的 ai_plugin_config_v1 里配置 token，或设置 VITE_PLUGIN_TOKEN，并确保与后端 PLUGIN_REQUIRED_TOKEN 一致。",
          );
        } else {
          alert("发生错误: 探索失败（鉴权失败）。请联系管理员或稍后再试。");
        }
      } else {
        alert("发生错误: " + msg);
      }
      return false;
    } finally {
      setIsExploring(false);
    }
  };

  const runStoryNode = async (idx: number) => {
    if (realm !== "nexus") return;
    const pack = currentStoryPack;
    const node = pack?.nodes?.[idx];
    if (!pack || !node) return;
    setWorld("自定义世界");
    setCustomWorldName(pack.worldName);
    setCustomWorldDesc(pack.worldDesc);
    setOutputMode("storyboard");
    const payload = `【剧情包】${pack.title}\n【章节】${node.title}\n【要求】以小说章节方式推进剧情（保持连贯，允许出现冲突与抉择）。\n${node.instruction}\n【输出】最后用 2~4 个镜头的分镜提示来引导生成情景图。`;
    const ok = await handleExplore(payload);
    if (ok) {
      setStoryRunning(true);
      setStoryNodeIndex(Math.min(idx + 1, pack.nodes.length));
    }
  };

  const startStory = async () => {
    setHistory([]);
    setHp(100);
    setInstruction("");
    setStoryNodeIndex(0);
    setStoryRunning(true);
    await runStoryNode(0);
  };

  const nextStory = async () => {
    const idx = storyNodeIndex;
    const pack = currentStoryPack;
    if (!pack || idx >= pack.nodes.length) return;
    await runStoryNode(idx);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {!embedded ? (
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-app-fg mb-2">
              {realm === 'mortal' ? '🌍 我的世界：发现与开聊' : '🌌 时空副本：线索推进'}
            </h2>
            <p className="text-app-muted">
              {realm === 'mortal'
                ? '找人、开聊、刷动态：让世界真正流动起来。'
                : '将数字生命具象化，观测他们在平行宇宙中的真实命运。'}
            </p>
          </div>
          {realm === "mortal" ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onGoMyMoments}
                className="bg-white/5 hover:bg-white/10 text-app-fg py-2 px-4 rounded-xl font-medium transition-colors border border-white/5 shadow-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/><path d="M10 18v-2a4 4 0 0 1 4-4h4"/><path d="m14 8 4 4"/></svg>
                我的动态
              </button>
              <button
                onClick={() => {
                  void fetchMortalMoments();
                }}
                disabled={mortalLoading}
                className="bg-white/10 hover:bg-white/20 text-app-fg py-2 px-4 rounded-xl font-medium transition-colors border border-white/5 shadow-sm disabled:opacity-60 flex items-center gap-2"
              >
                🔄 刷新
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setHistory([]);
                  setHp(100);
                  setInstruction("");
                }}
                className="bg-white/10 hover:bg-white/20 text-app-fg py-2 px-4 rounded-xl font-medium transition-colors border border-white/5 shadow-sm"
              >
                🔄 重新开始
              </button>
            </div>
          )}
        </div>
      ) : realm === "mortal" ? (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-app-fg">动态</div>
          <div className="flex items-center gap-2">
            <button
              onClick={onGoMyMoments}
              className="bg-white/5 hover:bg-white/10 text-app-fg py-2 px-3 rounded-xl font-medium transition-colors border border-white/5 shadow-sm"
            >
              我的
            </button>
            <button
              onClick={() => {
                void fetchMortalMoments();
              }}
              disabled={mortalLoading}
              className="bg-white/10 hover:bg-white/20 text-app-fg py-2 px-3 rounded-xl font-medium transition-colors border border-white/5 shadow-sm disabled:opacity-60"
            >
              刷新
            </button>
          </div>
        </div>
      ) : null}

      {realm === "mortal" ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 min-h-0">
          <div className="flex flex-col gap-4 min-h-0">
            <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] overflow-hidden">
              {!mortalComposerOpen ? (
                <button
                  onClick={() => setMortalComposerOpen(true)}
                  className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-app-muted">
                      留下一句回声…
                    </div>
                    <div className="text-xs px-3 py-2 rounded-xl bg-white/10 text-app-fg border border-white/10">
                      发布
                    </div>
                  </div>
                </button>
              ) : (
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-app-fg">发布回声</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => void aiDraftMortalMoment()}
                        disabled={mortalComposerLoading}
                        className="text-xs px-3 py-2 rounded-xl bg-white/10 text-app-fg border border-white/10 hover:bg-white/20 transition-colors disabled:opacity-60"
                      >
                        AI 帮写
                      </button>
                      <button
                        onClick={() => setMortalComposerOpen(false)}
                        className="text-xs px-3 py-2 rounded-xl bg-white/5 text-app-muted border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        收起
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={mortalComposerText}
                    onChange={(e) => setMortalComposerText(e.target.value)}
                    placeholder="分享你的感悟或此刻的状态…"
                    className="mt-3 w-full bg-[#131313] border border-white/10 rounded-xl p-4 text-app-fg placeholder-app-muted focus:ring-1 focus:ring-white/30 outline-none resize-none"
                    disabled={mortalComposerLoading}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => void postMortalMoment()}
                      disabled={mortalComposerLoading || !String(mortalComposerText || "").trim()}
                      className="bg-white hover:bg-gray-200 text-black py-2.5 px-6 rounded-full font-bold shadow-sm transition-colors disabled:opacity-50"
                    >
                      {mortalComposerLoading ? "发送中..." : "发送"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {mortalError ? (() => {
              const raw = String(mortalError || "");
              const lower = raw.toLowerCase();
              const missing = lower.includes("moments") && (lower.includes("does not exist") || lower.includes("relation") || lower.includes("schema"));
              if (!missing) {
                return (
                  <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {mortalError}
                  </div>
                );
              }
              return (
                <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-rose-100">
                  <div className="text-sm font-semibold">动态功能暂不可用</div>
                  <div className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                    未检测到动态数据表：请先在 Supabase 创建 moments 表后再使用。
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(MOMENTS_SQL);
                          emitHud("success", "已复制建表脚本。去 Supabase → SQL Editor 粘贴并执行即可。");
                        } catch {
                          emitHud("error", "复制失败，请手动展开并复制脚本。");
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/25 border border-rose-300/20 text-rose-50 text-xs font-semibold"
                    >
                      复制建表脚本
                    </button>
                    <button
                      onClick={() => setMortalSchemaHelpOpen((v) => !v)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs"
                    >
                      {mortalSchemaHelpOpen ? "收起脚本" : "展开查看脚本"}
                    </button>
                  </div>
                  {mortalSchemaHelpOpen ? (
                    <textarea
                      readOnly
                      value={MOMENTS_SQL}
                      className="mt-3 w-full h-44 rounded-xl bg-black/40 border border-white/10 p-3 text-[11px] leading-relaxed text-rose-50/90 font-mono"
                    />
                  ) : null}
                </div>
              );
            })() : null}
            {mortalLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-app-muted">
                动态加载中...
              </div>
            ) : null}

            <div className="lg:max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-1 min-h-0">
              {(() => {
                const items: any[] = [];
                const moments = Array.isArray(mortalMoments) ? mortalMoments : [];
                for (let i = 0; i < moments.length; i++) {
                  const m = moments[i];
                  const p = (m as any)?.personas || null;
                  const personaId = String((p as any)?.id || (m as any)?.persona_id || "").trim();
                  const isOwner = Boolean(
                    personaId && (
                      String((p as any)?.user_id || "").trim() === String(session?.user?.id || "").trim() ||
                      String(activePersona?.id || "").trim() === personaId
                    )
                  );
                  const isFollowing = personaId ? myFollows.includes(personaId) : false;
                  const name = String(p?.name || "匿名人格");
                  const chatName = String(p?.name || "").trim();
                  const mbti = String(p?.mbti || "").trim();
                  const cover = String(p?.card_cover_url || p?.avatar_2d_url || "");
                  const coverSrc = /^https?:\/\//i.test(cover) ? toProxyUrl(cover) : cover;
                  const likes = typeof (m as any)?.likes === "number" ? (m as any).likes : Number((m as any)?.likes || 0);
                  const followCount = personaId ? (followCountByPersonaId[personaId] || 0) : 0;
                  const content = String((m as any)?.content || "").trim();
                  const mid = String((m as any)?.id || "");
                  const liked = isMortalMomentLiked(mid);
                  const h = (() => {
                    const s = mid || String(i);
                    let v = 0;
                    for (let j = 0; j < s.length; j++) v = (v * 31 + s.charCodeAt(j)) >>> 0;
                    return v;
                  })();
                  const aspect = h % 4 === 0 ? "aspect-square" : "aspect-[4/5]";
                  items.push(
                    <div key={`m-${String((m as any)?.id || i)}`} className="mb-2 break-inside-avoid">
                      <div className="rounded-xl border border-white/10 bg-[#1b1b1b] overflow-hidden hover:border-white/20 transition-colors">
                        <div className={`relative ${aspect} bg-black/20`}>
                          {coverSrc ? (
                            <img src={coverSrc} className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                            <button
                              onClick={() => likeMortalMoment(mid)}
                              disabled={liked}
                              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border backdrop-blur ${
                                liked
                                  ? "text-rose-200 bg-rose-500/15 border-rose-300/20 cursor-not-allowed"
                                  : "text-white/90 bg-black/40 border-white/15 hover:bg-black/55"
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                              {Number.isFinite(likes) ? likes : 0}
                            </button>
                            {!isOwner && personaId ? (
                              <button
                                type="button"
                                onClick={() => void onToggleFollow(personaId, (p as any)?.user_id)}
                                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border backdrop-blur ${
                                  isFollowing
                                    ? "bg-black/65 text-white border-white/15 hover:bg-black/80"
                                    : "bg-white text-black border-white/10 hover:bg-gray-200"
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                {isFollowing ? "已关注" : "关注"}
                              </button>
                            ) : null}
                          </div>
                          <div className="absolute left-0 right-0 bottom-0 p-2">
                            <div className="text-white font-semibold text-[13px] leading-snug line-clamp-3">
                              {content || "（这条动态没有内容）"}
                            </div>
                          </div>
                        </div>
                        <div className="p-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 bg-white/5 shrink-0">
                              {coverSrc ? (
                                <img src={coverSrc} className="h-full w-full object-cover object-[50%_20%]" />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-purple-600/30 to-blue-600/30" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] text-app-fg truncate">{name}</div>
                              {mbti ? (
                                <div className="text-[10px] text-app-muted truncate">{mbti}{followCount > 0 ? ` · 关注 ${followCount}` : ""}</div>
                              ) : null}
                              {!mbti && followCount > 0 ? (
                                <div className="text-[10px] text-app-muted truncate">{`关注 ${followCount}`}</div>
                              ) : null}
                            </div>
                          </div>
                          {!isOwner ? (
                            <button
                              onClick={() => onStartChat(chatName)}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-accent text-white hover:bg-[#005BB5] font-semibold shrink-0"
                            >
                              去开聊
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                }
                if (items.length === 0 && !mortalLoading) {
                  return (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-app-muted">
                      暂无动态。去发布第一条回声动态，或稍后再来刷。
                    </div>
                  );
                }
                return <div className="columns-2 md:columns-3 gap-2">{items}</div>;
              })()}
            </div>
          </div>

          <div className="space-y-4 lg:max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-1 min-h-0">
            <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-4">
              <div className="text-sm font-semibold text-app-fg">今日事件</div>
              <div className="text-xs text-app-muted mt-2 leading-relaxed">
                今夜世界的灯光忽明忽暗。有人说在城南听到了“来自另一个宇宙的回声”。
              </div>
              <div className="mt-3 text-xs text-app-muted">
                建议话题：你相信平行世界吗？你最近最想逃离什么？
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#131313] p-6 rounded-2xl shadow-sm border border-white/5 mb-6">
          
          {realm === "nexus" && (
            <div className="flex items-center justify-center gap-2 mb-6 bg-[#1b1b1b] p-1.5 rounded-2xl border border-white/5 w-max mx-auto md:mx-0">
              <button 
                onClick={() => setPlayMode("story")}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${playMode === "story" ? "bg-accent text-white shadow-lg" : "text-app-muted hover:text-app-fg hover:bg-white/5"}`}
              >
                📚 剧本模式
              </button>
              <button 
                onClick={() => { setPlayMode("sandbox"); setStoryRunning(false); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${playMode === "sandbox" ? "bg-accent text-white shadow-lg" : "text-app-muted hover:text-app-fg hover:bg-white/5"}`}
              >
                🌍 我的世界
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 mb-6">
            <div className="flex flex-col gap-3">
              {realm === "nexus" && playMode === "story" ? (
                <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-app-fg">推演剧本</div>
                    <div className="text-xs text-app-muted">
                      {Math.min(storyNodeIndex, currentStoryPack.nodes.length)}/{currentStoryPack.nodes.length}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-3">
                    <select
                      value={storyPackId}
                      onChange={(e) => {
                        setStoryPackId(e.target.value);
                        setStoryNodeIndex(0);
                        setStoryRunning(false);
                      }}
                      className="w-full bg-[#242424] text-app-fg border border-white/10 rounded-xl p-3 focus:ring-1 focus:ring-white/30 focus:border-white/30 outline-none"
                      disabled={isExploring}
                    >
                      {STORY_PACKS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>

                    <div className="text-xs text-app-muted leading-relaxed">
                      {storyNodeIndex >= currentStoryPack.nodes.length
                        ? "已通关：可以重开或换剧本继续跑。"
                        : `下一幕：${currentStoryPack.nodes[storyNodeIndex]?.title || ""}`}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => void startStory()}
                        disabled={isExploring}
                        className="flex-1 bg-accent hover:bg-[#0b6bd8] text-white py-2 px-3 rounded-xl font-semibold transition-colors disabled:opacity-60"
                      >
                        {storyRunning ? "重开剧情" : "开始跑团"}
                      </button>
                      <button
                        onClick={() => void nextStory()}
                        disabled={isExploring || storyNodeIndex >= currentStoryPack.nodes.length}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-app-fg py-2 px-3 rounded-xl font-semibold transition-colors border border-white/10 disabled:opacity-60"
                      >
                        下一幕
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {(!storyRunning || playMode === "sandbox") && (
                <div className={`flex flex-col gap-3 ${playMode === "story" ? "hidden" : "animate-in fade-in slide-in-from-top-2 duration-300"}`}>
                  <div>
                    <label className="block text-sm font-medium text-app-muted mb-2">我的世界设定</label>
                  </div>
                  
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-3 p-4 bg-[#242424] rounded-xl border border-white/5">
                      <input 
                          type="text" 
                          value={customWorldName}
                          onChange={e => setCustomWorldName(e.target.value)}
                          placeholder="世界名称 (如：赛博朋克2077)"
                          disabled={realm === "nexus" && storyRunning}
                          className="w-full bg-[#131313] border border-white/10 rounded-lg p-2 text-app-fg text-sm outline-none focus:ring-1 focus:ring-white/30"
                        />
                        <textarea 
                          value={customWorldDesc}
                          onChange={e => setCustomWorldDesc(e.target.value)}
                          placeholder="世界描述 (如：高科技低生活的未来城市...)"
                          rows={2}
                        disabled={realm === "nexus" && storyRunning}
                        className="w-full bg-[#131313] border border-white/10 rounded-lg p-2 text-app-fg text-sm outline-none focus:ring-1 focus:ring-white/30 resize-none"
                      />
                    </div>
                </div>
              )}
            </div>

          {realm === "nexus" ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-app-fg">同行设置</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-app-muted">
                      {partyMode === "party"
                        ? `${1 + (Array.isArray(partners) ? partners.length : 0)} 人`
                        : primaryPartner ? "2 人" : "1 人"}
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
                      <button
                        type="button"
                        onClick={() => setPartyMode("duo")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          partyMode === "duo" ? "bg-white text-black" : "text-app-muted hover:bg-white/10"
                        }`}
                      >
                        双人
                      </button>
                      <button
                        type="button"
                        onClick={() => setPartyMode("party")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          partyMode === "party" ? "bg-white text-black" : "text-app-muted hover:bg-white/10"
                        }`}
                      >
                        组队
                      </button>
                    </div>
                  </div>
                </div>

                {partyMode === "duo" ? (
                  <>
                    <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-app-fg truncate">
                          {primaryPartner ? String(primaryPartner.name || "伙伴") : "未选择伙伴"}
                        </div>
                        <div className="text-xs text-app-muted truncate">
                          {primaryPartner ? String(primaryPartner.mbti || "未知") : "选择一个人一起继续跑本"}
                        </div>
                      </div>
                      <button
                        onClick={() => setPartners([])}
                        className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-app-muted hover:text-app-fg transition-colors"
                        disabled={!primaryPartner}
                      >
                        移除
                      </button>
                    </div>
                    <div className="mt-3 text-xs text-app-muted">点击下方列表可更换伙伴</div>
                  </>
                ) : (
                  <>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="text-xs text-app-muted">最多 8 位伙伴（主角 + 伙伴们一起推进）</div>
                      <button
                        type="button"
                        onClick={() => setPartners([])}
                        className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-app-muted hover:text-app-fg transition-colors"
                        disabled={!Array.isArray(partners) || partners.length === 0}
                      >
                        清空
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(Array.isArray(partners) ? partners : []).slice(0, 8).map((p: any, idx: number) => (
                        <button
                          key={`${String(p?.id || p?.name || idx)}`}
                          type="button"
                          onClick={() =>
                            setPartners((prev) =>
                              (Array.isArray(prev) ? prev : []).filter(
                                (x) => String((x as any)?.id || "") !== String(p?.id || ""),
                              ),
                            )
                          }
                          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-white/10 bg-black/30 hover:bg-black/40 transition-colors"
                          title="点击移除"
                        >
                          <span className="text-xs text-app-fg font-semibold truncate max-w-[140px]">{String(p?.name || "伙伴")}</span>
                          <span className="text-[10px] text-app-muted">{String(p?.mbti || "").trim() || "未知"}</span>
                          <span className="text-[11px] text-app-muted">✕</span>
                        </button>
                      ))}
                      {!Array.isArray(partners) || partners.length === 0 ? (
                        <div className="text-xs text-app-muted py-2">未选择伙伴，点击下方卡片加入队伍</div>
                      ) : null}
                    </div>
                  </>
                )}

                <div className="mt-2 bg-[#242424] rounded-xl border border-white/5 p-3 flex gap-3 overflow-x-auto custom-scrollbar items-center">
                  {allOtherPersonas.map((p) => {
                    const id = String(p?.id || "");
                    const isPicked =
                      partyMode === "party"
                        ? Array.isArray(partners) && partners.some((x) => String((x as any)?.id || "") === id)
                        : String(primaryPartner?.id || "") === id;
                    const coverSrc = p?.card_cover_url || p?.avatar_2d_url || null;
                    return (
                      <button
                        key={id || String(p?.name || Math.random())}
                        type="button"
                        onClick={() => {
                          if (!id) return;
                          if (partyMode === "duo") {
                            setPartners((prev) => {
                              const cur = Array.isArray(prev) && prev.length ? prev[0] : null;
                              if (String((cur as any)?.id || "") === id) return [];
                              return [p];
                            });
                            return;
                          }
                          setPartners((prev) => {
                            const list = Array.isArray(prev) ? prev : [];
                            if (list.some((x) => String((x as any)?.id || "") === id)) {
                              return list.filter((x) => String((x as any)?.id || "") !== id);
                            }
                            if (list.length >= 8) return list;
                            return [...list, p];
                          });
                        }}
                        className={`shrink-0 w-24 h-28 bg-[#131313] border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                          isPicked ? "border-indigo-400/70 bg-indigo-500/10" : "border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 mb-2">
                          {coverSrc ? (
                            <img
                              src={String(coverSrc)}
                              className="w-full h-full object-cover object-[50%_20%]"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-600/35 to-blue-600/35 flex items-center justify-center text-xs text-white/70">
                              👤
                            </div>
                          )}
                        </div>
                        <div className="text-app-fg text-xs font-medium text-center truncate w-full">{String(p?.name || "匿名")}</div>
                        <div className="text-[10px] text-app-muted mt-1">{String(p?.mbti || "未知")}</div>
                      </button>
                    );
                  })}
                  {allOtherPersonas.length === 0 ? (
                    <div className="text-app-muted text-sm italic m-auto">暂无可邀请的角色</div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-app-fg">线索簿</div>
                  <div className="text-xs text-app-muted">
                    {clueInventory.length}/12
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-[11px] text-app-muted">总线索</div>
                    <div className="mt-1 text-base font-bold text-app-fg">{clueInventory.length}</div>
                  </div>
                  <div className="rounded-xl border border-cyan-300/15 bg-cyan-400/10 px-3 py-2">
                    <div className="text-[11px] text-cyan-100/75">在我这</div>
                    <div className="mt-1 text-base font-bold text-cyan-100">{myClueCount}</div>
                  </div>
                  <div className="rounded-xl border border-fuchsia-300/15 bg-fuchsia-400/10 px-3 py-2">
                    <div className="text-[11px] text-fuchsia-100/75">在你那</div>
                    <div className="mt-1 text-base font-bold text-fuchsia-100">{partnerClueCount}</div>
                  </div>
                </div>
                {clueInventory.length >= 12 ? (
                  <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                    线索簿已满。后续新发现会提示出来，但不会再自动收入这里。
                  </div>
                ) : null}
                <div className="mt-3 space-y-3">
                  {clueCards.map(({ clue, invIdx }: { clue: string; invIdx: number }, orderIdx: number) => {
                    const owner = (clueOwners?.byIdx || {})[String(invIdx)] || "me";
                    const label = owner === "them" ? "在你那" : "在我这";
                    const canToggle = Boolean(primaryPartner);
                    const selected = selectedClueIdx === invIdx;
                    const isNewest = orderIdx === 0;
                    return (
                      <div
                        key={`${clue}-${String(invIdx)}`}
                        className={`rounded-2xl border transition-all ${
                          selected
                            ? "border-cyan-300/35 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(103,232,249,0.12)]"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedClueIdx((prev) => (prev === invIdx ? null : invIdx))}
                          className="w-full px-3 py-3 text-left"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-app-fg truncate">🔎 {clue}</span>
                                {isNewest ? (
                                  <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-100 border border-amber-300/20">
                                    最新
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <span className={`rounded-full px-2 py-0.5 text-[10px] border ${
                                  owner === "me"
                                    ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
                                    : "border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-100"
                                }`}>
                                  {label}
                                </span>
                                <span className="rounded-full px-2 py-0.5 text-[10px] border border-white/10 bg-white/5 text-app-muted">
                                  编号 #{invIdx + 1}
                                </span>
                                <span className="text-[10px] text-app-muted">
                                  {selected ? "点击收起详情" : "点击查看详情"}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-app-muted text-xs">{selected ? "收起" : "展开"}</div>
                          </div>
                        </button>
                        {selected ? (
                          <div className="border-t border-white/10 px-3 py-3">
                            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-app-fg leading-relaxed whitespace-pre-wrap break-words">
                              {clue}
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                              <div className="text-[11px] text-app-muted">
                                可将线索归属切换给自己或同伴，也可以直接删除整理线索簿。
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!canToggle) return;
                                    setClueOwners((prev) => {
                                      const byIdx = { ...(prev?.byIdx || {}) } as Record<string, "me" | "them">;
                                      const cur = byIdx[String(invIdx)] || "me";
                                      byIdx[String(invIdx)] = cur === "me" ? "them" : "me";
                                      return { ...prev, byIdx };
                                    });
                                  }}
                                  disabled={!canToggle}
                                  className={`shrink-0 text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                                    canToggle
                                      ? owner === "me"
                                        ? "border-white/10 bg-white/10 text-app-fg hover:bg-white/15"
                                        : "border-white/10 bg-white/5 text-app-muted hover:bg-white/10 hover:text-app-fg"
                                      : "border-white/10 bg-white/5 text-app-muted opacity-60 cursor-not-allowed"
                                  }`}
                                >
                                  切换到{owner === "me" ? "你那" : "我这"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDeleteClue(invIdx)}
                                  className="shrink-0 px-3 py-1.5 rounded-full border border-rose-300/20 bg-rose-500/10 text-[11px] text-rose-200 hover:bg-rose-500/20 transition-colors"
                                  aria-label="删除线索"
                                  title="删除线索"
                                >
                                  删除线索
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                  {clueInventory.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-6 text-center text-sm text-app-muted">
                      暂无线索。推进剧情后会在这里自动记录新发现。
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <div className="flex gap-4 items-center bg-red-950/30 p-4 rounded-xl border border-red-900/50 relative overflow-hidden">
            <div className="text-red-400 font-bold flex-1 flex items-center gap-2 z-10">
              ❤️ 主角 HP: 
              <div className="flex-1 bg-black/50 h-3 rounded-full overflow-hidden ml-2 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 ease-out" 
                  style={{ width: `${Math.max(0, Math.min(100, hp))}%` }}
                ></div>
              </div>
              <span className="w-12 text-right relative">
                {hp}/100
                {hpAnim && (
                  <span 
                    key={hpAnim.id}
                    className={`absolute -top-6 right-0 text-sm font-bold ${hpAnim.value > 0 ? 'text-green-400' : 'text-red-500'} animate-in slide-in-from-bottom-2 fade-in duration-500`}
                  >
                    {hpAnim.value > 0 ? '+' : ''}{hpAnim.value}
                  </span>
                )}
              </span>
            </div>
            {hp <= 0 && <div className="text-red-500 font-bold animate-pulse z-10">💀 主角已牺牲</div>}
            
            {/* Background warning pulse if HP is low */}
            {hp < 30 && hp > 0 && (
              <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
            )}
          </div>

          {realm === 'nexus' && primaryPartner && (
            <div className="flex gap-4 items-center bg-indigo-950/30 p-4 rounded-xl border border-indigo-900/50 relative">
              <div className="text-indigo-400 font-bold flex-1 flex items-center gap-2">
                ✨ 伙伴羁绊 ({primaryPartner.name}): 
                <div className="flex-1 bg-black/50 h-3 rounded-full overflow-hidden ml-2 border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-400 transition-all duration-500 ease-out" 
                    style={{ width: `${Math.min(100, Math.max(0, bond))}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right relative">
                  {bond}
                  {bondAnim && (
                    <span 
                      key={bondAnim.id}
                      className={`absolute -top-6 right-0 text-sm font-bold ${bondAnim.value > 0 ? 'text-indigo-300' : 'text-app-muted'} animate-in slide-in-from-bottom-2 fade-in duration-500`}
                    >
                      {bondAnim.value > 0 ? '+' : ''}{bondAnim.value}
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#242424] border border-white/5 rounded-2xl p-3 sm:p-6 h-[450px] overflow-y-auto mb-6 flex flex-col gap-4 sm:gap-6 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center text-app-muted mt-32 italic">命运的齿轮尚未转动...</div>
          ) : (
            history.map((msg, i) => (
              <div key={i} className={`flex w-full flex-col gap-2 sm:gap-4 sm:max-w-[85%] ${msg.role === 'user' ? 'items-end self-end sm:flex-row-reverse' : 'items-start self-start sm:flex-row'}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-sm sm:text-base ${msg.role === 'user' ? 'bg-white/10 text-app-fg' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                  {msg.role === 'user' ? '⚡️' : '🤖'}
                </div>
                <div className={`w-full min-w-0 sm:w-auto sm:flex-none p-3 sm:p-4 rounded-2xl shadow-sm text-[14px] sm:text-[15px] leading-relaxed ${msg.role === 'user' ? 'bg-white/10 text-app-fg border border-white/5' : 'bg-[#1a1a1a] text-app-fg border border-white/5'}`}>
                  {msg.content && <div className="whitespace-pre-wrap break-words">{hideParentheticalForUi(msg.content)}</div>}
                  {msg.audio?.url && (
                    <div className={`${msg.content ? "mt-3" : ""}`}>
                      <div className="text-xs text-app-muted mb-2">
                        🎤 语音消息 {typeof msg.audio.durationMs === "number" ? formatDuration(msg.audio.durationMs) : ""}
                      </div>
                      <audio controls src={maybeProxyMediaUrl(msg.audio.url)} className="w-[320px] max-w-full h-9" />
                    </div>
                  )}
                  {msg.images && msg.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.images.map((img, idx) => (
                        <a
                          key={`${img.url}-${idx}`}
                          href={img.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block group"
                        >
                          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
                            <img
                              src={img.url}
                              alt={img.caption || `shot-${idx + 1}`}
                              className="w-full h-44 object-cover group-hover:opacity-95 transition-opacity"
                              loading="lazy"
                            />
                          </div>
                          {img.caption && (
                            <div className="mt-2 text-xs text-app-muted whitespace-pre-wrap break-words">
                              {hideParentheticalForUi(img.caption)}
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-4">
          <div className="flex items-center gap-2 bg-[#242424] border border-white/10 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setOutputMode("text")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${outputMode === "text" ? "bg-white text-black" : "text-app-muted hover:bg-white/10"}`}
              disabled={isExploring}
            >
              文字
            </button>
            <button
              type="button"
              onClick={() => setOutputMode("storyboard")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${outputMode === "storyboard" ? "bg-white text-black" : "text-app-muted hover:bg-white/10"}`}
              disabled={isExploring}
            >
              动漫分镜
            </button>
          </div>

          {outputMode === "storyboard" && (
            <>
              <div className="flex items-center gap-2">
                <div className="text-sm text-app-muted">风格</div>
                <select
                  value={storyboardStyle}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "anime" || v === "realistic" || v === "cyber") setStoryboardStyle(v);
                  }}
                  className="bg-[#242424] text-app-fg border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-white/30 focus:border-white/30 outline-none"
                  disabled={isExploring}
                >
                  <option value="anime">动漫</option>
                  <option value="realistic">写实</option>
                  <option value="cyber">赛博</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-app-muted">镜头数</div>
                <select
                  value={String(storyboardShots)}
                  onChange={(e) => setStoryboardShots(Number(e.target.value))}
                  className="bg-[#242424] text-app-fg border border-white/10 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-white/30 focus:border-white/30 outline-none"
                  disabled={isExploring}
                >
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </>
          )}
        </div>

        {voiceError && <div className="mb-3 text-sm text-red-200">{voiceError}</div>}
        <div className="flex gap-4">
          <input 
            type="text" 
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') void handleExplore(); }}
            placeholder="⚡️ 降下神谕 (如：去集市看看、攻击前方的敌人)..."
            className="flex-1 bg-[#242424] border border-white/10 text-app-fg rounded-xl p-4 focus:ring-1 focus:ring-white/30 focus:border-white/30 outline-none placeholder-app-muted"
            disabled={isExploring || hp <= 0}
          />
          <button
            type="button"
            onClick={() => {
              if (voiceUploading) return;
              if (voiceRecording) stopVoiceMessage();
              else void startVoiceMessage();
            }}
            disabled={isExploring || hp <= 0 || voiceUploading}
            className={`w-14 px-3 py-4 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center ${
              voiceRecording
                ? "bg-red-500/20 border border-red-400/30 text-red-100"
                : "bg-[#242424] border border-white/10 text-app-fg hover:bg-white/10"
            } disabled:opacity-50`}
            title={voiceRecording ? "停止录音" : "语音消息"}
          >
            {voiceUploading ? (
              <svg className="animate-spin h-5 w-5 text-app-fg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : voiceRecording ? (
              <div className="text-[10px] leading-tight text-center">
                <div>STOP</div>
                <div className="text-white/70">{formatDuration(voiceDurationMs)}</div>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"/>
                <path d="M19 11a7 7 0 0 1-14 0"/>
                <path d="M12 19v3"/>
                <path d="M8 22h8"/>
              </svg>
            )}
          </button>
          <button 
            onClick={() => void handleExplore()}
            disabled={isExploring || hp <= 0}
            className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-xl font-bold disabled:opacity-50 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
          >
            {isExploring ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                演化中...
              </>
            ) : outputMode === "storyboard" ? '🎬 生成分镜' : '🎬 推进剧情'}
          </button>
        </div>
      </div>
      )}

    </div>
  );
}

function HomePage({
  session,
  isGuest,
  onRequireRegister,
  onExitGuest,
  onOpenFeedback,
}: {
  session: any;
  isGuest: boolean;
  onRequireRegister: (preferredGuestPersonaId?: string) => void;
  onExitGuest: () => void;
  onOpenFeedback: (ctx: { source: string; personaId?: any; personaName?: any }) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiTargetPersonaId, setAiTargetPersonaId] = useState<string | null>(null);
  const [aiTargetImageKind, setAiTargetImageKind] = useState<"portrait" | "banner" | null>(null);
  const [aiInitialTab, setAiInitialTab] = useState<"t2i" | "companion" | undefined>(undefined);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);
  const [aiInitialImageUrl, setAiInitialImageUrl] = useState<string | undefined>(undefined);
  const [aiInitialSize, setAiInitialSize] = useState<string | undefined>(undefined);
  const [aiPanelKeepAlive, setAiPanelKeepAlive] = useState(false);
  const [aiPanelBusyState, setAiPanelBusyState] = useState<AiBusyStatePayload>({ busy: false });
  const [aiPanelBusyTick, setAiPanelBusyTick] = useState(Date.now());
  const [aiTaskCenterOpen, setAiTaskCenterOpen] = useState(false);
  const [aiCurrentTaskId, setAiCurrentTaskId] = useState<string | null>(null);
  const [aiRecentTasks, setAiRecentTasks] = useState<Array<{
    id: string;
    kind: AiBusyJobKind;
    label: string;
    status: "running" | "succeeded" | "failed";
    startedAt: number;
    etaSec?: number;
    detail?: string;
    finishedAt?: number;
  }>>([]);
  const [activeTab, setActiveTab] = useState('search');
  const [activeRealm, setActiveRealm] = useState('social');
  const [personas, setPersonas] = useState<any[]>([]);
  const [allOtherPersonas, setAllOtherPersonas] = useState<any[]>([]);
  const [activePersona, setActivePersona] = useState<any>(null);
  const [personasLoaded, setPersonasLoaded] = useState(false);
  const [firstPersonaOnboardingOpen, setFirstPersonaOnboardingOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Guest Upgrade Dialog State
  const [guestUpgradeDialogOpen, setGuestUpgradeDialogOpen] = useState(false);
  const [guestUpgradeEmail, setGuestUpgradeEmail] = useState("");
  const [guestUpgradeLoading, setGuestUpgradeLoading] = useState(false);
  const [guestUpgradeCooldown, setGuestUpgradeCooldown] = useState(0);
  const [, setGuestUpgradeSent] = useState(false);

  const handleGuestUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guestUpgradeCooldown > 0) {
      showHud("error", `操作过于频繁，请等待 ${guestUpgradeCooldown}s 后再试。`);
      return;
    }
    setGuestUpgradeLoading(true);
    if (!isValidEmailAddress(guestUpgradeEmail)) {
      showHud("error", "请输入有效的邮箱格式。");
      setGuestUpgradeLoading(false);
      return;
    }
    try {
      const emailRedirectTo = (() => {
        try {
          return window.location.origin;
        } catch {
          return undefined;
        }
      })();
      
      writeGuestUpgradeMeta({
        pending: true,
        preferredGuestPersonaId: activePersona?.id ? String(activePersona.id) : undefined,
      });

      const { error } = await supabase.auth.signInWithOtp({
        email: normalizeEmail(guestUpgradeEmail),
        options: {
          shouldCreateUser: true,
          ...(emailRedirectTo ? { emailRedirectTo } : {}),
        },
      });
      
      if (error) {
        showHud("error", error.message);
        setGuestUpgradeLoading(false);
        return;
      }
      
      setGuestUpgradeSent(true);
      showHud("success", "注册链接已发送，请前往邮箱点击确认。");
      setGuestUpgradeCooldown(60);
      const timer = setInterval(() => {
        setGuestUpgradeCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e: any) {
      showHud("error", e.message || "发送失败，请稍后重试。");
    } finally {
      setGuestUpgradeLoading(false);
    }
  };

  const activePersonaStorageKey = useMemo(() => {
    const uid = String(session?.user?.id || "").trim();
    return uid ? `active-persona-id:v1:${uid}` : "";
  }, [session?.user?.id]);
  const setActivePersonaAndPersist = (p: any) => {
    setActivePersona(p);
    if (!activePersonaStorageKey) return;
    try {
      const id = p?.id != null ? String(p.id) : "";
      if (id) localStorage.setItem(activePersonaStorageKey, id);
    } catch {}
  };

  const deletePersonaCard = async (persona: any) => {
    const pid = String(persona?.id || "").trim();
    if (!pid) return;
    const name = String(persona?.name || "未命名卡片").trim() || "未命名卡片";
    const ok = window.confirm(`确认删除卡片「${name}」吗？\n\n已生成的本地 2D/3D 外观缓存也会一起清理，此操作无法撤销。`);
    if (!ok) return;

    try {
      if (isGuest) {
        const nextGuest = (Array.isArray(personas) ? personas : []).filter((x) => String(x?.id || "") !== pid);
        setPersonas(nextGuest);
        const nextActive =
          String(activePersona?.id || "") === pid
            ? nextGuest[0] || null
            : nextGuest.find((x) => String(x?.id || "") === String(activePersona?.id || "")) || nextGuest[0] || null;
        setActivePersona(nextActive);
      } else {
        const uid = String(session?.user?.id || "").trim();
        const { error } = await supabase.from("personas").delete().eq("id", pid).eq("user_id", uid);
        if (error) throw error;
        const nextRemote = (Array.isArray(personas) ? personas : []).filter((x) => String(x?.id || "") !== pid);
        setPersonas(nextRemote);
        const nextActive =
          String(activePersona?.id || "") === pid
            ? nextRemote[0] || null
            : nextRemote.find((x) => String(x?.id || "") === String(activePersona?.id || "")) || nextRemote[0] || null;
        setActivePersona(nextActive);
      }

      if (activePersonaStorageKey) {
        try {
          const remaining = (Array.isArray(personas) ? personas : []).filter((x) => String(x?.id || "") !== pid);
          const nextActiveId =
            String(activePersona?.id || "") === pid
              ? String(remaining[0]?.id || "").trim()
              : String(activePersona?.id || "").trim();
          if (nextActiveId) localStorage.setItem(activePersonaStorageKey, nextActiveId);
          else localStorage.removeItem(activePersonaStorageKey);
        } catch {}
      }

      setPersonaVisualAssets((prev) => {
        const next = { ...(prev || {}) };
        delete next[pid];
        writeRecordStorage(PERSONA_VISUAL_ASSETS_STORAGE_KEY, next);
        return next;
      });
      setPersonaAppearance((prev) => {
        const next = { ...(prev || {}) };
        delete next[pid];
        writeRecordStorage(PERSONA_APPEARANCE_STORAGE_KEY, next);
        return next;
      });
      try {
        const demographics = { ...(readPersonaDemographics() || {}) };
        delete (demographics as any)[pid];
        writePersonaDemographics(demographics);
      } catch {}
      setPersonaCardViewById((prev) => {
        const next = { ...(prev || {}) };
        delete next[pid];
        return next;
      });
      setMycardsActionPersonaId("");
      setMycardsFocusedPersonaId((cur: string) => (cur === pid ? "" : cur));
      setOpenedCardPersona((cur: any) => (String(cur?.id || "") === pid ? null : cur));
      showHud("success", `已删除卡片「${name}」`);
    } catch (e: any) {
      showHud("error", `删除失败：${e?.message ? String(e.message) : "请检查数据库权限或关联数据"}`);
    }
  };

  const openedCardId = useMemo(() => {
    try {
      const sp = new URLSearchParams(location.search || "");
      const v = String(sp.get("card") || "").trim();
      return v || null;
    } catch {
      return null;
    }
  }, [location.search]);

  const [openedCardPersona, setOpenedCardPersona] = useState<any | null>(null);
  const [openedCardView, setOpenedCardView] = useState<"2d" | "3d">("2d");

  useEffect(() => {
    if (!openedCardId) {
      setOpenedCardPersona(null);
      setOpenedCardView("2d");
      return;
    }
    const fromLocal = [...personas, ...allOtherPersonas].find((p) => String(p?.id ?? "") === String(openedCardId));
    if (fromLocal) {
      setOpenedCardPersona(fromLocal);
      setOpenedCardView("2d");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.from("personas").select("*").eq("id", openedCardId).maybeSingle();
        if (error) throw error;
        if (cancelled) return;
        setOpenedCardPersona(data || null);
        setOpenedCardView("2d");
      } catch {
        if (cancelled) return;
        setOpenedCardPersona(null);
        setOpenedCardView("2d");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [openedCardId, personas, allOtherPersonas]);

  useEffect(() => {
    if (!openedCardPersona) return;
    const p = openedCardPersona;
    const allow2d = canViewerSee2d(p);
    const allow3d = canViewerSee3d(p);
    const rawModelUrl = p?.model_3d_url || null;
    const can3d = allow3d && Boolean(rawModelUrl);
    if (openedCardView === "3d" && !can3d) {
      setOpenedCardView(allow2d ? "2d" : "2d");
      return;
    }
    if (openedCardView === "2d" && !allow2d && can3d) {
      setOpenedCardView("3d");
    }
  }, [openedCardPersona, openedCardView]);

  const openCardHome = (personaId: any) => {
    const id = personaId != null ? String(personaId).trim() : "";
    if (!id) return;
    navigate(`/?card=${encodeURIComponent(id)}`);
  };

  const closeCardHome = () => {
    navigate("/", { replace: true });
  };

  const sidebarCollapsedStorageKey = useMemo(() => {
    const uid = String(session?.user?.id || "").trim();
    return uid ? `sidebar-collapsed:v1:${uid}` : "sidebar-collapsed:v1";
  }, [session?.user?.id]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(sidebarCollapsedStorageKey);
      if (raw === "1") setSidebarCollapsed(true);
      if (raw === "0") setSidebarCollapsed(false);
      if (raw !== "1" && raw !== "0") {
        try {
          setSidebarCollapsed(window.matchMedia("(max-width: 768px)").matches);
        } catch {}
      }
    } catch {}
  }, [sidebarCollapsedStorageKey]);

  const setSidebarCollapsedAndPersist = (next: boolean) => {
    setSidebarCollapsed(next);
    try {
      localStorage.setItem(sidebarCollapsedStorageKey, next ? "1" : "0");
    } catch {}
  };

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [mobileMycardsActionsOpen, setMobileMycardsActionsOpen] = useState(false);
  const [uiMode, setUiMode] = useState<"auto" | "mobile" | "desktop">(() => {
    try {
      const raw = String(localStorage.getItem("ui-mode:v1") || "").trim();
      if (raw === "mobile" || raw === "desktop" || raw === "auto") return raw;
    } catch {}
    return "auto";
  });
  const isMobileUi = uiMode === "mobile" ? true : uiMode === "desktop" ? false : isMobile;

  useEffect(() => {
    try {
      const mql = window.matchMedia("(max-width: 768px)");
      const apply = () => setIsMobile(Boolean(mql.matches));
      apply();
      if (typeof (mql as any).addEventListener === "function") (mql as any).addEventListener("change", apply);
      else if (typeof (mql as any).addListener === "function") (mql as any).addListener(apply);
      return () => {
        if (typeof (mql as any).removeEventListener === "function") (mql as any).removeEventListener("change", apply);
        else if (typeof (mql as any).removeListener === "function") (mql as any).removeListener(apply);
      };
    } catch {
      setIsMobile(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ui-mode:v1", uiMode);
    } catch {}
  }, [uiMode]);

  useEffect(() => {
    if (!isMobileUi) setSidebarDrawerOpen(false);
  }, [isMobileUi]);

  useEffect(() => {
    if (!isMobileUi) {
      setMobileMycardsActionsOpen(false);
      return;
    }
    if (!(activeRealm === "social" && activeTab === "mycards")) setMobileMycardsActionsOpen(false);
  }, [isMobileUi, activeRealm, activeTab]);

  const closeSidebarDrawer = () => {
    if (isMobileUi) setSidebarDrawerOpen(false);
  };

  useEffect(() => {
    if (!sidebarDrawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarDrawerOpen]);

  useEffect(() => {
    if (!mobileMycardsActionsOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMycardsActionsOpen]);

  const [myFollows, setMyFollows] = useState<string[]>([]);
  const [theirFollows] = useState<string[]>([]);
  const [followCountByPersonaId, setFollowCountByPersonaId] = useState<Record<string, number>>({});
  const followCountRpcAvailableRef = useRef(true);
  const [chats, setChats] = useState<any[]>([]);
  const [echoes, setEchoes] = useState<any[]>([]);
  const [loadingTab, setLoadingTab] = useState(false);

  const [iceboxOpen, setIceboxOpen] = useState(false);
  const [iceboxTab, setIceboxTab] = useState<"inbox" | "outbox">("inbox");
  const [iceboxUnreadCount, setIceboxUnreadCount] = useState(0);

  // --- 灵魂蒸馏 & 我的关注 State ---
  const [distillMbti, setDistillMbti] = useState("");
  const [distillCustomTraits, setDistillCustomTraits] = useState("");
  const [distillSaving, setDistillSaving] = useState(false);
  const [distillResultCard, setDistillResultCard] = useState<{title: string, desc: string} | null>(null);
  const [followsList, setFollowsList] = useState<any[]>([]);
  const [followsLoading, setFollowsLoading] = useState(false);

  // MBTI/SBTI 无尽测试题库 State
  const [isTestingMbti, setIsTestingMbti] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  
  const MBTI_QUESTIONS = [
    {
      id: 'm1',
      text: "周末终于到了，你更倾向于怎么度过？",
      options: [
        { label: "叫上几个朋友出去聚餐或者看展", trait: "【能量来源】典型的外向者(E)，喜欢通过外部互动和社交来充电。" },
        { label: "一个人宅在家里看书、打游戏或补觉", trait: "【能量来源】典型的内向者(I)，需要通过独处来恢复精力，享受内心的平静。" }
      ]
    },
    {
      id: 'm2',
      text: "面对一个全新的复杂项目，你会先关注什么？",
      options: [
        { label: "具体的执行细节、历史数据和过往经验", trait: "【信息感知】偏向实感(S)，注重当下、细节和事实，脚踏实地。" },
        { label: "项目未来的长远发展、整体蓝图和潜在的可能性", trait: "【信息感知】偏向直觉(N)，富有想象力，喜欢着眼于未来和宏观概念。" }
      ]
    },
    {
      id: 'm3',
      text: "如果朋友向你倾诉他在工作中遇到的委屈，你通常第一反应是？",
      options: [
        { label: "帮他分析问题出在哪，并给出客观的解决方案", trait: "【决策方式】偏向理智(T)，在处理问题时更看重逻辑、客观分析和公平原则。" },
        { label: "先安抚他的情绪，站在他的角度共情并给予支持", trait: "【决策方式】偏向情感(F)，在做决定时更看重个人价值观、人情味和和谐。" }
      ]
    },
    {
      id: 'm4',
      text: "对于下周要去外地旅行，你的行李准备情况通常是？",
      options: [
        { label: "提前几天列好清单，按部就班地打包好一切", trait: "【生活方式】偏向判断(J)，喜欢有计划、有条理，追求确定性和掌控感。" },
        { label: "出发前一晚或者当天才开始随便塞点东西进箱子", trait: "【生活方式】偏向感知(P)，喜欢灵活变通、随性而为，享受自发性的乐趣。" }
      ]
    }
  ];

  const SBTI_QUESTIONS = [
    {
      id: 's1',
      text: "当你在电梯里遇到不太熟的同事，且只有你们两个人时，你会？",
      options: [
        { label: "主动找话题化解尴尬（比如聊今天的天气或工作）", trait: "【社交表现】在轻度尴尬的社交场合中具有较高的主动性和破冰能力。" },
        { label: "低头看手机或假装看电梯楼层，保持沉默", trait: "【社交表现】对非必要社交感到负担，倾向于保持安全距离，边界感强。" }
      ]
    },
    {
      id: 's2',
      type: 'SBTI',
      text: "如果你发现自己买到了一件有微小瑕疵但还能用的商品，你会？",
      options: [
        { label: "嫌麻烦，凑合着用算了", trait: "【冲突处理】回避冲突型，性格较为随和或怕麻烦，愿意为了省事妥协。" },
        { label: "立刻联系客服要求退换或补偿", trait: "【冲突处理】维权意识强，不轻易妥协，对自身权益有明确的底线要求。" }
      ]
    },
    {
      id: 's3',
      type: 'SBTI',
      text: "在团队讨论中，如果你的想法和大多数人完全相反，你会？",
      options: [
        { label: "坚持表达自己的观点，并试图说服他们", trait: "【自我表达】具有较强的自我坚持和说服欲，不盲从权威或大众。" },
        { label: "先保留意见，随大流或者私下再找领导沟通", trait: "【自我表达】倾向于在群体中保持和谐，采用更隐蔽或圆滑的方式表达异议。" }
      ]
    },
    {
      id: 's4',
      type: 'SBTI',
      text: "当别人对你提出无理要求时，你的反应通常是？",
      options: [
        { label: "果断拒绝，不留情面", trait: "【边界感】个人边界极强，能够果断拒绝不合理的要求，不在乎得罪人。" },
        { label: "找个委婉的理由推脱，或者半推半就答应", trait: "【边界感】边界感较弱，容易受讨好型人格影响，难以直接拒绝他人。" }
      ]
    }
  ];

  const [testType, setTestType] = useState<"MBTI" | "SBTI">("MBTI");
  const [mbtiRemainingQuestions, setMbtiRemainingQuestions] = useState<any[]>([]);

  const drawNextQuestion = (type: "MBTI" | "SBTI") => {
    const qList = type === "MBTI" ? MBTI_QUESTIONS : SBTI_QUESTIONS;
    const q = qList[Math.floor(Math.random() * qList.length)];
    setActiveQuestion(q);
  };

  const startTest = (type: "MBTI" | "SBTI") => {
    setTestType(type);
    setIsTestingMbti(true);
    setDistillCustomTraits(""); // 每次开启新测试时，清空之前答题累积的特质

    if (type === "MBTI") {
      setDistillMbti(""); // MBTI 新一轮时清空旧字母
      // MBTI 一轮固定 4 题（不重复），确保能稳定得到 4 位结果
      const shuffled = [...MBTI_QUESTIONS].sort(() => Math.random() - 0.5);
      setActiveQuestion(shuffled[0] || null);
      setMbtiRemainingQuestions(shuffled.slice(1));
      return;
    }

    setMbtiRemainingQuestions([]);
    drawNextQuestion(type);
  };

  const handleMbtiAnswer = (trait: string) => {
    setDistillCustomTraits(prev => {
      const base = prev.trim();
      return base ? `${base}\n${trait}` : trait;
    });

    // 如果是 MBTI 题，尝试从中解析出 E/I, S/N, T/F, J/P 来自动填充 MBTI 类型
    if (testType === "MBTI") {
      const mbtiMatch = trait.match(/\(([EISTFJP])\)/i);
      if (mbtiMatch && mbtiMatch[1]) {
        const letter = mbtiMatch[1].toUpperCase();
        setDistillMbti(prev => {
          let current = prev.toUpperCase();
          // 替换掉冲突的字母，或者直接追加
          if (letter === 'E' || letter === 'I') current = current.replace(/[EI]/g, '') + letter;
          else if (letter === 'S' || letter === 'N') current = current.replace(/[SN]/g, '') + letter;
          else if (letter === 'T' || letter === 'F') current = current.replace(/[TF]/g, '') + letter;
          else if (letter === 'J' || letter === 'P') current = current.replace(/[JP]/g, '') + letter;
          
          // 保持固定顺序 E/I, S/N, T/F, J/P
          const e_i = current.match(/[EI]/) ? current.match(/[EI]/)![0] : "";
          const s_n = current.match(/[SN]/) ? current.match(/[SN]/)![0] : "";
          const t_f = current.match(/[TF]/) ? current.match(/[TF]/)![0] : "";
          const j_p = current.match(/[JP]/) ? current.match(/[JP]/)![0] : "";
          return `${e_i}${s_n}${t_f}${j_p}`;
        });
      }
    }

    showHud("success", "特质已成功提取并记录到卡片中！");

    if (testType === "MBTI") {
      if (mbtiRemainingQuestions.length > 0) {
        const [nextQ, ...rest] = mbtiRemainingQuestions;
        setActiveQuestion(nextQ);
        setMbtiRemainingQuestions(rest);
      } else {
        // MBTI 改为可持续答题：4题做完后重新洗牌继续，不强制退出
        const reshuffled = [...MBTI_QUESTIONS].sort(() => Math.random() - 0.5);
        setActiveQuestion(reshuffled[0] || null);
        setMbtiRemainingQuestions(reshuffled.slice(1));
        showHud("info", "已完成一轮MBTI四维，继续答题可让画像更稳定。");
      }
      return;
    }

    drawNextQuestion(testType);
  };

  // 旧的 icebox 状态 (保留以防报错)
  const [iceboxInbox, setIceboxInbox] = useState<any[]>([]);
  const [, setIceboxOutbox] = useState<any[]>([]);
  const [, setIceboxLoading] = useState(false);
  const [, setIceboxError] = useState<string | null>(null);

  const [iceComposerOpen, setIceComposerOpen] = useState(false);
  const [iceComposerTarget, setIceComposerTarget] = useState<any | null>(null);
  const [iceComposerTone, setIceComposerTone] = useState<"轻松" | "认真" | "幽默">("轻松");
  const [iceComposerText, setIceComposerText] = useState("");
  const [iceComposerOptions, setIceComposerOptions] = useState<string[]>(["图书馆", "食堂", "操场", "都行"]);
  const [iceComposerSending, setIceComposerSending] = useState(false);

  const [hud, setHud] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    const handler = (ev: any) => {
      const d = (ev as CustomEvent)?.detail || null;
      const kind = d?.kind as HudKind;
      const text = typeof d?.text === "string" ? d.text : "";
      if (!text) return;
      if (kind !== "success" && kind !== "error" && kind !== "info") return;
      setHud({ kind, text });
      window.setTimeout(() => setHud((prev) => (prev?.text === text ? null : prev)), 2400);
    };
    window.addEventListener("app:hud", handler as any);
    return () => window.removeEventListener("app:hud", handler as any);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [chatKeyword, setChatKeyword] = useState('');
  const [sceneFilter, setSceneFilter] = useState<"all" | "agent">("all");
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [matchQuery, setMatchQuery] = useState<string>("");
  const [matchError, setMatchError] = useState<string | null>(null);

  const [personaCardViewById, setPersonaCardViewById] = useState<Record<string, "2d" | "3d">>({});
  const [mycardsActionPersonaId, setMycardsActionPersonaId] = useState<string>("");
  const [mycardsFocusedPersonaId, setMycardsFocusedPersonaId] = useState<string>("");
  const [mycardsExpanded, setMycardsExpanded] = useState(false);
  const mycardsDragStartYRef = useRef<number | null>(null);

  useEffect(() => {
    setMycardsActionPersonaId("");
    if (activeRealm === "social" && activeTab === "mycards") {
      setMycardsFocusedPersonaId(String(activePersona?.id || ""));
      return;
    }
    setMycardsFocusedPersonaId("");
  }, [activeRealm, activeTab, activePersona?.id]);

  useEffect(() => {
    if (!(isMobileUi && activeRealm === "social" && activeTab === "mycards")) {
      setMycardsExpanded(false);
      return;
    }

    let lastY = window.scrollY || 0;
    let ticking = false;
    const threshold = 24;

    const updateByScroll = () => {
      const nextY = window.scrollY || 0;
      const delta = nextY - lastY;
      if (Math.abs(delta) >= threshold) {
        setMycardsExpanded(delta > 0);
        lastY = nextY;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateByScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileUi, activeRealm, activeTab]);

  const handleMycardsPointerStart = (clientY: number) => {
    mycardsDragStartYRef.current = clientY;
  };

  const handleMycardsPointerEnd = (clientY: number) => {
    if (!(isMobileUi && activeRealm === "social" && activeTab === "mycards")) return;
    const startY = mycardsDragStartYRef.current;
    mycardsDragStartYRef.current = null;
    if (startY == null) return;
    const delta = clientY - startY;
    if (Math.abs(delta) < 36) return;
    if (delta < 0) setMycardsExpanded(true);
    else setMycardsExpanded(false);
  };

  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [customRechargeAmount, setCustomRechargeAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);
  const [billingBalance, setBillingBalance] = useState<number | null>(null);
  const [billingBalanceLoading, setBillingBalanceLoading] = useState(false);
  const [billingBalanceError, setBillingBalanceError] = useState<string | null>(null);
  const [pluginTheme, setPluginTheme] = useState<PluginTheme>(() => {
    try {
      const raw = localStorage.getItem("ai-plugin-theme:v1");
      if (raw === "system" || raw === "paper" || raw === "midnight" || raw === "dark" || raw === "light") {
        return raw === "light" ? "paper" : (raw as PluginTheme);
      }
    } catch {}
    return "system";
  });
  const [prefersDark, setPrefersDark] = useState(() => {
    try {
      return typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : true;
    } catch {
      return true;
    }
  });
  const effectivePluginTheme = useMemo(() => {
    const t = pluginTheme === "light" ? "paper" : pluginTheme;
    if (t === "system") return prefersDark ? "midnight" : "paper";
    return t;
  }, [pluginTheme, prefersDark]);

  const personaById = useMemo(() => {
    const map = new Map<string, any>();
    [...personas, ...allOtherPersonas].forEach((p) => {
      const id = String(p?.id ?? "").trim();
      if (id) map.set(id, p);
    });
    return map;
  }, [personas, allOtherPersonas]);

  const showHud = (kind: "success" | "error" | "info", text: string) => {
    setHud({ kind, text });
    window.setTimeout(() => setHud((prev) => (prev?.text === text ? null : prev)), 2400);
  };
  const formatAiDuration = (seconds: number) => {
    const sec = Math.max(0, Math.floor(seconds || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };
  const clearAiPanelSession = () => {
    setIsAiPanelOpen(false);
    setAiPanelKeepAlive(false);
    setAiPanelBusyState({ busy: false });
    setAiTargetPersonaId(null);
    setAiTargetImageKind(null);
    setAiInitialTab(undefined);
    setAiInitialSize(undefined);
    setAiInitialPrompt(undefined);
    setAiInitialImageUrl(undefined);
  };
  const requestAiNotifyPermission = async () => {
    try {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission === "default") await Notification.requestPermission();
    } catch {
      void 0;
    }
  };
  const pushAiCompletionNotice = (title: string, body: string) => {
    showHud("success", body);
    try {
      if (typeof document !== "undefined" && document.visibilityState === "visible") return;
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
      new Notification(title, { body });
    } catch {
      void 0;
    }
  };
  const trackAiTaskStarted = (payload: {
    kind: AiBusyJobKind;
    label?: string;
    startedAt?: number;
    etaSec?: number;
  }) => {
    const id = `${payload.kind}:${payload.startedAt || Date.now()}`;
    setAiCurrentTaskId(id);
    const nextItem: (typeof aiRecentTasks)[number] = {
      id,
      kind: payload.kind,
      label: payload.label || "AI 任务",
      status: "running",
      startedAt: payload.startedAt || Date.now(),
      etaSec: payload.etaSec,
    };
    setAiRecentTasks((prev) => [nextItem, ...prev.filter((item) => item.id !== id)].slice(0, 8));
  };
  const trackAiTaskFinished = (status: "succeeded" | "failed", detail: string) => {
    setAiRecentTasks((prev) =>
      prev.map((item) =>
        item.id === aiCurrentTaskId
          ? { ...item, status, detail, finishedAt: Date.now() }
          : item,
      ),
    );
    setAiCurrentTaskId(null);
  };
  const minimizeAiPanelToBackground = async () => {
    if (!aiPanelBusyState.busy) {
      clearAiPanelSession();
      return;
    }
    await requestAiNotifyPermission();
    setIsAiPanelOpen(false);
    setAiPanelKeepAlive(true);
    showHud("info", `${aiPanelBusyState.label || "生成任务"}已转入后台，完成后会提醒你。`);
  };
  const aiBusyElapsedSec = aiPanelBusyState.startedAt
    ? Math.max(0, Math.floor((aiPanelBusyTick - aiPanelBusyState.startedAt) / 1000))
    : 0;
  const aiBusyRemainingSec =
    typeof aiPanelBusyState.etaSec === "number"
      ? Math.max(0, aiPanelBusyState.etaSec - aiBusyElapsedSec)
      : undefined;
  const aiBusyProgress =
    typeof aiPanelBusyState.etaSec === "number" && aiPanelBusyState.etaSec > 0
      ? Math.min(95, Math.max(6, Math.round((aiBusyElapsedSec / aiPanelBusyState.etaSec) * 100)))
      : 18;
  const promptGuestRegister = (_feature: string) => {
    if (isGuest) {
      onRequireRegister(activePersona?.id ? String(activePersona.id) : undefined);
      return;
    }
    setGuestUpgradeDialogOpen(true);
  };

  useEffect(() => {
    if (!aiPanelBusyState.busy) return;
    setAiPanelBusyTick(Date.now());
    const timer = window.setInterval(() => setAiPanelBusyTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [aiPanelBusyState.busy]);

  useEffect(() => {
    const ids = Array.from(
      new Set(
        [...(personas || []), ...(allOtherPersonas || [])]
          .map((p) => String((p as any)?.id || "").trim())
          .filter(Boolean),
      ),
    );
    if (ids.length === 0) {
      setFollowCountByPersonaId({});
      return;
    }
    const uuidLikeIds = ids.filter((id) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id),
    );
    let cancelled = false;
    (async () => {
      try {
        const next: Record<string, number> = {};
        for (const id of ids) {
          if (!uuidLikeIds.includes(id)) next[id] = 0;
        }
        if (uuidLikeIds.length === 0) {
          if (cancelled) return;
          setFollowCountByPersonaId((prev) => ({ ...(prev || {}), ...next }));
          return;
        }
        if (followCountRpcAvailableRef.current) {
          const { data: rpcData, error: rpcErr } = await (supabase as any).rpc("get_follow_counts", {
            following_ids: uuidLikeIds,
          });
          if (!rpcErr && Array.isArray(rpcData)) {
            for (const row of rpcData) {
              const pid = String((row as any)?.following_id || "").trim();
              const cntRaw = (row as any)?.cnt;
              const cnt = typeof cntRaw === "number" ? cntRaw : Number(cntRaw);
              if (!pid) continue;
              next[pid] = Number.isFinite(cnt) ? cnt : 0;
            }
            if (cancelled) return;
            setFollowCountByPersonaId((prev) => ({ ...(prev || {}), ...next }));
            return;
          }
          if (rpcErr) {
            const rpcMsg = String((rpcErr as any)?.message || (rpcErr as any)?.details || "").toLowerCase();
            const rpcCode = String((rpcErr as any)?.code || "").toLowerCase();
            const rpcMissing =
              rpcCode === "pgrst202" ||
              rpcCode === "404" ||
              rpcMsg.includes("get_follow_counts") ||
              rpcMsg.includes("could not find the function") ||
              rpcMsg.includes("not found");
            if (rpcMissing) {
              followCountRpcAvailableRef.current = false;
            } else {
              throw rpcErr;
            }
          }
        }

        const { data, error } = await supabase.from("follows").select("target_persona_id").in("target_persona_id", uuidLikeIds);
        if (error) throw error;
        for (const row of data || []) {
          const pid = String((row as any)?.target_persona_id || "").trim();
          if (!pid) continue;
          next[pid] = (next[pid] || 0) + 1;
        }
        if (cancelled) return;
        setFollowCountByPersonaId((prev) => ({ ...(prev || {}), ...next }));
      } catch (e: any) {
        if (cancelled) return;
        const msg = e?.message ? String(e.message) : "加载失败";
        showHud(
          "error",
          `加载关注量失败：${msg}（建议在 Supabase 创建 get_follow_counts 统计函数，以避免 RLS 导致的 0）`,
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [personas, allOtherPersonas]);

  function isOwnerOfPersona(p: any) {
    const uid = String(session?.user?.id || "");
    const owner = String(p?.user_id || "");
    return Boolean(uid && owner && uid === owner);
  }

  function canViewerSee2d(p: any) {
    if (isOwnerOfPersona(p)) return true;
    return typeof (p as any)?.show_2d === "boolean" ? Boolean((p as any).show_2d) : true;
  }

  function canViewerSee3d(p: any) {
    if (isOwnerOfPersona(p)) return true;
    return typeof (p as any)?.show_3d === "boolean" ? Boolean((p as any).show_3d) : true;
  }

  function renderModelViewer(modelUrl: string, classValue: string, posterText = "3D 模型加载中...") {
    return React.createElement(
      "model-viewer" as any,
      {
        src: toProxyUrl(modelUrl),
        class: classValue,
        style: { touchAction: "none" },
        "camera-controls": true,
        "auto-rotate": true,
        "interaction-prompt": "none",
        "shadow-intensity": "1",
        "environment-image": "neutral",
        alt: "3D Model Preview",
      },
      <div slot="poster" className="flex h-full w-full items-center justify-center text-white/70">
        {posterText}
      </div>,
    );
  }

  const formatChatListTime = (input: any) => {
    try {
      const d = new Date(input);
      if (!Number.isFinite(d.getTime())) return "";
      const now = new Date();
      const sameDay = d.toDateString() === now.toDateString();
      if (sameDay) {
        return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
      }
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfTarget = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const diffDays = Math.round((startOfToday - startOfTarget) / 86400000);
      if (diffDays === 1) return "昨天";
      if (diffDays > 1 && diffDays < 7) {
        return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()] || "";
      }
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${mm}/${dd}`;
    } catch {
      return "";
    }
  };

  const fetchIceboxUnreadCount = async (personaId: string) => {
    try {
      const { count, error } = await supabase
        .from("icebreakers")
        .select("id", { count: "exact", head: true })
        .eq("to_persona_id", personaId)
        .eq("status", "sent")
        .is("read_at", null);
      if (error) throw error;
      setIceboxUnreadCount(Number(count || 0));
    } catch (e: any) {
      if (shouldSilenceSupabaseError(e, "icebreakers")) return;
      const msg = String(e?.message || "").toLowerCase();
      if (msg.includes("icebreakers") && (msg.includes("does not exist") || msg.includes("relation"))) {
        setIceboxUnreadCount(0);
        return;
      }
      setIceboxUnreadCount(0);
    }
  };

  const fetchIceboxLists = async (personaId: string) => {
    setIceboxLoading(true);
    setIceboxError(null);
    try {
      const [inboxRes, outboxRes] = await Promise.all([
        supabase
          .from("icebreakers")
          .select("id, from_persona_id, to_persona_id, payload_text, payload_options, reply_text, picked_option, status, read_at, created_at")
          .eq("to_persona_id", personaId)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("icebreakers")
          .select("id, from_persona_id, to_persona_id, payload_text, payload_options, reply_text, picked_option, status, read_at, created_at")
          .eq("from_persona_id", personaId)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      if (inboxRes.error) throw inboxRes.error;
      if (outboxRes.error) throw outboxRes.error;
      setIceboxInbox(Array.isArray(inboxRes.data) ? inboxRes.data : []);
      setIceboxOutbox(Array.isArray(outboxRes.data) ? outboxRes.data : []);
    } catch (e: any) {
      if (shouldSilenceSupabaseError(e, "icebreakers")) {
        setIceboxLoading(false);
        return;
      }
      const raw = String(e?.message || "加载失败");
      const lower = raw.toLowerCase();
      const missing =
        lower.includes("icebreakers") && (lower.includes("does not exist") || lower.includes("relation") || lower.includes("schema"));
      setIceboxError(missing ? "未检测到破冰数据表：请先在 Supabase 创建 icebreakers 表后再使用。" : raw);
      setIceboxInbox([]);
      setIceboxOutbox([]);
    } finally {
      setIceboxLoading(false);
    }
  };

  const markIcebreakersRead = async (personaId: string, ids: string[]) => {
    const clean = ids.map((x) => String(x || "").trim()).filter(Boolean);
    if (!clean.length) return;
    try {
      const now = new Date().toISOString();
      await supabase
        .from("icebreakers")
        .update({ read_at: now })
        .in("id", clean)
        .eq("to_persona_id", personaId)
        .is("read_at", null);
    } catch {}
  };

  const openIceComposer = (targetPersona: any) => {
    if (!activePersona) {
      showHud("info", "请先创建并选择一个活跃人格。");
      return;
    }
    if (!targetPersona) return;
    setIceComposerTarget(targetPersona);
    const name = String(targetPersona?.name || "").trim();
    const intro = String(targetPersona?.vibe || targetPersona?.logic || "").trim();
    const base = name ? `嗨 ${name}，我看了你的卡片，感觉很有意思。` : "嗨，我看了你的卡片，感觉很有意思。";
    const hint = intro ? `你写的“${intro.slice(0, 22)}”让我有点好奇。` : "想先用一句破冰开始聊聊。";
    const q =
      iceComposerTone === "幽默"
        ? "如果你现在能瞬移到校园任意一个地方，你会选哪？"
        : iceComposerTone === "认真"
          ? "你最近最想认真做成的一件小事是什么？"
          : "你今天更想去图书馆、食堂，还是操场？";
    setIceComposerText(`${base}${hint} 想问你：${q}`);
    setIceComposerOptions(["图书馆", "食堂", "操场", "都行"]);
    setIceComposerOpen(true);
  };

  const sendIcebreaker = async () => {
    if (!activePersona) {
      showHud("info", "请先创建并选择一个活跃人格。");
      return;
    }
    const fromId = String(activePersona?.id || "").trim();
    const toId = String(iceComposerTarget?.id || "").trim();
    if (!fromId || !toId) return;
    const text = String(iceComposerText || "").trim();
    if (!text) {
      showHud("info", "请先写一句破冰内容。");
      return;
    }
    const options = (iceComposerOptions || []).map((x) => String(x || "").trim()).filter(Boolean).slice(0, 6);
    setIceComposerSending(true);
    try {
      const { error } = await supabase.from("icebreakers").insert({
        from_persona_id: fromId,
        to_persona_id: toId,
        payload_text: text,
        payload_options: options,
        status: "sent",
      });
      if (error) throw error;
      showHud("success", "破冰卡已发送。");
      setIceComposerOpen(false);
      setIceComposerTarget(null);
      setIceComposerText("");
      setIceComposerOptions(["图书馆", "食堂", "操场", "都行"]);
      if (iceboxOpen) void fetchIceboxLists(fromId);
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : "发送失败";
      showHud("error", msg);
    } finally {
      setIceComposerSending(false);
    }
  };

  // --- 灵魂蒸馏 API ---
  const handleSaveDistill = async () => {
    if (isGuest) {
      promptGuestRegister("蒸馏保存");
      return;
    }
    if (!activePersona) {
      showHud("info", "请先选择一个活跃人格。");
      return;
    }
    const accessToken = session?.access_token ? String(session.access_token) : "";
    if (!accessToken) return;
    setDistillSaving(true);
    try {
      // 提前生成反馈称号和描述，用于写入历史记录
      let titleFeedback = "新晋蒸馏者";
      let titleDescription = "独特的灵魂碎片，构筑出独一无二的内在。";
      const combinedTraits = (distillMbti + distillCustomTraits).toLowerCase();
      
      const sbtiProfile = SBTI_PROFILES.find(pr => pr.keywords.some(k => combinedTraits.includes(k)));
      const normalizedMbti = distillMbti.toUpperCase().trim();
      const mbtiProfile = MBTI_PROFILES.find(pr => pr.mbti === normalizedMbti);
      
      // 按当前测试模式决定优先级：
      // - 做 SBTI 测试时：优先给出 SBTI 画像（避免被旧 MBTI 覆盖）
      // - 做 MBTI 测试时：优先给出 MBTI 称号
      if (testType === "SBTI") {
        if (sbtiProfile) {
          titleFeedback = sbtiProfile.title;
          titleDescription = sbtiProfile.desc;
        } else if (mbtiProfile) {
          titleFeedback = `${normalizedMbti}-${mbtiProfile.title}`;
          titleDescription = mbtiProfile.desc;
        } else if (normalizedMbti) {
          titleFeedback = `${normalizedMbti}探索者`;
          titleDescription = `以 ${normalizedMbti} 的视角感知世界，理性与感性交织。`;
        } else if (distillCustomTraits.length > 20) {
          titleFeedback = "灵魂铸造师";
          titleDescription = "用文字雕刻灵魂，赋予了数字生命独特的温度。";
        }
      } else {
        if (mbtiProfile) {
          titleFeedback = `${normalizedMbti}-${mbtiProfile.title}`;
          titleDescription = mbtiProfile.desc;
        } else if (normalizedMbti) {
          titleFeedback = `${normalizedMbti}探索者`;
          titleDescription = `以 ${normalizedMbti} 的视角感知世界，理性与感性交织。`;
        } else if (sbtiProfile) {
          titleFeedback = sbtiProfile.title;
          titleDescription = sbtiProfile.desc;
        } else if (distillCustomTraits.length > 20) {
          titleFeedback = "灵魂铸造师";
          titleDescription = "用文字雕刻灵魂，赋予了数字生命独特的温度。";
        }
      }

      const historyRecord = {
        title: titleFeedback,
        description: titleDescription,
        traits: distillCustomTraits
      };

      const res = await fetch(`${API_BASE_URL}/api/personas/${activePersona.id}/distill`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 
          mbti_type: distillMbti, 
          custom_traits: distillCustomTraits,
          history_record: historyRecord
        })
      });
      
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "保存失败");
      
      // 弹出炫酷卡片 Modal
      setDistillResultCard({ title: titleFeedback, desc: titleDescription });
      
      // 更新本地 state
      const updatedHistory = [...(activePersona.distillation_history || []), { ...historyRecord, id: Date.now().toString(), created_at: new Date().toISOString() }];
      setActivePersona({ ...activePersona, mbti_type: distillMbti, custom_traits: distillCustomTraits, distillation_history: updatedHistory });
    } catch (err: any) {
      showHud("error", err.message || "保存蒸馏特质失败");
    } finally {
      setDistillSaving(false);
    }
  };

  const handleDeleteDistillHistory = async (recordId: string) => {
    if (isGuest) {
      promptGuestRegister("蒸馏记录管理");
      return;
    }
    if (!activePersona) return;
    const accessToken = session?.access_token ? String(session.access_token) : "";
    if (!accessToken) return;
    const oldHistory = Array.isArray(activePersona.distillation_history) ? activePersona.distillation_history : [];
    const nextHistory = oldHistory.filter((r: any) => String(r?.id || "") !== String(recordId));
    try {
      const res = await fetch(`${API_BASE_URL}/api/personas/${activePersona.id}/distill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          mbti_type: (activePersona as any).mbti_type || "",
          custom_traits: (activePersona as any).custom_traits || "",
          history_override: nextHistory
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "删除失败");
      setActivePersona({ ...activePersona, distillation_history: nextHistory });
      showHud("success", "已删除该条蒸馏记录");
    } catch (err: any) {
      showHud("error", err?.message || "删除失败");
    }
  };

  const fetchFollows = async () => {
    const accessToken = session?.access_token ? String(session.access_token) : "";
    if (!accessToken) return;
    setFollowsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/follows`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setFollowsList(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch follows:", err);
    } finally {
      setFollowsLoading(false);
    }
  };

  const refreshMyFollows = async () => {
    const uid = String(session?.user?.id || "").trim();
    if (!uid) {
      setMyFollows([]);
      return;
    }
    const { data, error } = await supabase
      .from("follows")
      .select("target_persona_id")
      .eq("follower_id", uid);
    if (error) throw error;
    setMyFollows((data || []).map((row: any) => String(row?.target_persona_id || "")).filter(Boolean));
  };

  const toggleFollowPersona = async (targetPersonaIdRaw: any, targetOwnerIdRaw?: any) => {
    if (isGuest) {
      promptGuestRegister("关注");
      return;
    }
    const uid = String(session?.user?.id || "").trim();
    if (!uid) {
      showHud("info", "请先登录后再关注。");
      return;
    }

    const targetPersonaId = String(targetPersonaIdRaw || "").trim();
    const targetOwnerId = String(targetOwnerIdRaw || "").trim();
    if (!targetPersonaId) return;
    if (targetOwnerId && targetOwnerId === uid) {
      showHud("info", "不能关注自己。");
      return;
    }

    const isFollowing = myFollows.includes(targetPersonaId);
    try {
      if (isFollowing) {
        await supabase.from("follows").delete().eq("follower_id", uid).eq("target_persona_id", targetPersonaId);
        setMyFollows((prev) => prev.filter((id) => id !== targetPersonaId));
        setFollowCountByPersonaId((prev) => ({
          ...(prev || {}),
          [targetPersonaId]: Math.max(0, Number((prev || {})[targetPersonaId] || 0) - 1),
        }));
        showHud("success", "已取消关注");
      } else {
        await supabase.from("follows").insert({ follower_id: uid, target_persona_id: targetPersonaId });
        setMyFollows((prev) => (prev.includes(targetPersonaId) ? prev : [...prev, targetPersonaId]));
        setFollowCountByPersonaId((prev) => ({
          ...(prev || {}),
          [targetPersonaId]: Number((prev || {})[targetPersonaId] || 0) + 1,
        }));
        showHud("success", "已关注");
      }
    } catch (err: any) {
      showHud("error", err?.message || "关注操作失败");
    }
  };

  const handleUnfollow = async (targetId: string) => {
    if (isGuest) {
      promptGuestRegister("取消关注");
      return;
    }
    const accessToken = session?.access_token ? String(session.access_token) : "";
    if (!accessToken) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/follows/${targetId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
      if (res.ok) {
        showHud("success", "已取消关注");
        fetchFollows();
      } else {
        throw new Error("取消关注失败");
      }
    } catch (err: any) {
      showHud("error", err.message);
    }
  };

  useEffect(() => {
    void refreshMyFollows().catch(() => {
      setMyFollows([]);
    });
  }, [session?.user?.id]);

  useEffect(() => {
    const pid = String(activePersona?.id || "").trim();
    if (!pid) {
      setIceboxUnreadCount(0);
      return;
    }
    void fetchIceboxUnreadCount(pid);
    const t = window.setInterval(() => void fetchIceboxUnreadCount(pid), 30_000);
    return () => window.clearInterval(t);
  }, [activePersona?.id]);

  useEffect(() => {
    const pid = String(activePersona?.id || "").trim();
    if (!iceboxOpen || !pid) return;
    
    // 初始化蒸馏数据
    setDistillMbti(activePersona?.mbti_type || "");
    // 每次重新进入“蒸馏与关注”时，文本输入区默认置空，避免遗留上一次未保存的内容
    if (iceboxTab === "inbox") {
      setDistillCustomTraits("");
      setIsTestingMbti(false);
      setActiveQuestion(null);
      setMbtiRemainingQuestions([]);
    } else {
      setDistillCustomTraits(activePersona?.custom_traits || "");
    }
    
    if (iceboxTab === "outbox") {
      fetchFollows();
    }
    
    void fetchIceboxLists(pid);
  }, [iceboxOpen, iceboxTab, activePersona?.id]);

  // 玩家最新答题结果实时更新到当前活跃人格展示（仅本地态，点击保存才会持久化）
  useEffect(() => {
    const pid = String(activePersona?.id || "").trim();
    if (!pid) return;
    if (!iceboxOpen || iceboxTab !== "inbox") return;

    setActivePersona((prev: any) => {
      if (!prev || String(prev.id || "") !== pid) return prev;
      return {
        ...prev,
        mbti_type: distillMbti,
        custom_traits: distillCustomTraits,
      };
    });

    setPersonas((prev) =>
      prev.map((p: any) =>
        String(p?.id || "") === pid
          ? { ...p, mbti_type: distillMbti, custom_traits: distillCustomTraits }
          : p
      )
    );
  }, [distillMbti, distillCustomTraits, iceboxOpen, iceboxTab, activePersona?.id]);

  useEffect(() => {
    const pid = String(activePersona?.id || "").trim();
    if (!iceboxOpen || !pid) return;
    if (iceboxTab !== "inbox") return;
    const unreadIds = (iceboxInbox || [])
      .filter((x) => String(x?.status) === "sent" && (x?.read_at == null))
      .map((x) => String(x?.id || "").trim())
      .filter(Boolean);
    if (!unreadIds.length) return;
    void markIcebreakersRead(pid, unreadIds).then(() => void fetchIceboxUnreadCount(pid));
  }, [iceboxOpen, iceboxTab, iceboxInbox, activePersona?.id]);
  useEffect(() => {
    try {
      localStorage.setItem("ai-plugin-theme:v1", pluginTheme);
    } catch {}
  }, [pluginTheme]);
  useEffect(() => {
    const root = document.documentElement;
    (root.dataset as any).appTheme = effectivePluginTheme;
    root.style.colorScheme = effectivePluginTheme === "paper" ? "light" : "dark";
  }, [effectivePluginTheme]);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (ev: MediaQueryListEvent) => setPrefersDark(ev.matches);
    try {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    } catch {
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
  }, []);
  const [personaVisualAssets, setPersonaVisualAssets] = useState<Record<string, { cover2dUrl?: string; banner2dUrl?: string; avatar2dUrl?: string; model3dUrl?: string }>>(() => {
    try {
      const raw = localStorage.getItem("persona-visual-assets:v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [personaAppearance, setPersonaAppearance] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem("persona-appearance:v1");
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });
  const cosWarnedRef = useRef(false);
  const [personaCardSize, setPersonaCardSize] = useState<"sm" | "md" | "lg">(() => {
    try {
      const raw = localStorage.getItem("ui-persona-card-size:v1");
      if (raw === "sm" || raw === "md" || raw === "lg") return raw;
    } catch {}
    return "md";
  });
  const [personaCardMinWidth, setPersonaCardMinWidth] = useState<number>(() => {
    try {
      const raw = localStorage.getItem("ui-persona-card-min-width:v1");
      const n = raw ? Number(raw) : NaN;
      if (Number.isFinite(n) && n >= 180 && n <= 360) return n;
    } catch {}
    return personaCardSize === "sm" ? 210 : personaCardSize === "lg" ? 310 : 255;
  });

  // Persona creation state
  const [isCreatingPersona, setIsCreatingPersona] = useState(false);
  const [newPersonaName, setNewPersonaName] = useState("");
  const [newPersonaNameDraft, setNewPersonaNameDraft] = useState("");
  const [personaStep, setPersonaStep] = useState(0);
  const [personaAnswers, setPersonaAnswers] = useState<{q: string, a: string}[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const QUESTIONS = [
    "1. 价值观：如果做一件违背审美但赚钱的事，你会怎么想？",
    "2. 依恋类型：喜欢的人三天没回消息，你的第一反应？",
    "3. 生活纹理：描述一个你感到最放松的瞬间（声音和味道等等）？",
    "4. 社交面具：你喜欢聚会还是两个人的社交？什么样的社交让你感到舒服？",
    "5. 深夜底色：凌晨 2 点你还没睡，你在做什么？你会想什么？",
    "6. 性别认同：你是男生还是女生？",
    "7. 取向判定：你喜欢男生还是女生？"
  ];

  useEffect(() => {
    // Register model-viewer once for 3D preview modal usage.
    void import("@google/model-viewer");
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("persona-visual-assets:v1", JSON.stringify(personaVisualAssets));
    } catch {}
  }, [personaVisualAssets]);
  useEffect(() => {
    try {
      localStorage.setItem("persona-appearance:v1", JSON.stringify(personaAppearance));
    } catch {}
  }, [personaAppearance]);

  useEffect(() => {
    try {
      localStorage.setItem("ui-persona-card-size:v1", personaCardSize);
    } catch {}
  }, [personaCardSize]);
  useEffect(() => {
    try {
      localStorage.setItem("ui-persona-card-min-width:v1", String(personaCardMinWidth));
    } catch {}
  }, [personaCardMinWidth]);
  const refreshBillingBalance = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      setBillingBalance(null);
      setBillingBalanceError(null);
      return;
    }
    setBillingBalanceLoading(true);
    setBillingBalanceError(null);
    try {
      const { data, error } = await supabase
        .from("user_wallets")
        .select("balance")
        .eq("user_id", userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found, meaning user hasn't been initialized yet
          setBillingBalance(0);
          return;
        }
        throw error;
      }
      
      const b = data?.balance;
      const n = typeof b === "number" ? b : Number(b);
      setBillingBalance(Number.isFinite(n) ? n : 0);
    } catch (e: any) {
      setBillingBalanceError(e?.message ? String(e.message) : "获取余额失败");
    } finally {
      setBillingBalanceLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (isGuest) {
      promptGuestRegister("兑换充值");
      return;
    }
    const code = redeemCode.trim();
    const accessToken = session?.access_token ? String(session.access_token) : "";
    if (!code || !accessToken) return;
    setIsRedeeming(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/billing/redeem`, {
        method: "POST",
        headers: withPluginTokenHeaders({ 
          "Content-Type": "application/json",
          "authorization": `Bearer ${accessToken}`
        }),
        body: JSON.stringify({ code }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      alert(`兑换成功！已为您增加 ${json.added} 积分。`);
      setRedeemCode("");
      refreshBillingBalance();
    } catch (err: any) {
      alert(`兑换失败: ${err.message}`);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleMockRecharge = async (amountRmb: number) => {
    if (isGuest) {
      promptGuestRegister("在线充值");
      return;
    }
    const accessToken = session?.access_token ? String(session.access_token) : "";
    if (!accessToken) return;
    setIsRecharging(true);
    try {
      const points = amountRmb * 100;
      const res = await fetch(`${API_BASE_URL}/api/billing/mock-recharge`, {
        method: "POST",
        headers: withPluginTokenHeaders({ 
          "Content-Type": "application/json",
          "authorization": `Bearer ${accessToken}`
        }),
        body: JSON.stringify({ rmb: amountRmb, points }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      alert(`支付成功！已为您充值 ${points} 积分。`);
      setCustomRechargeAmount("");
      refreshBillingBalance();
    } catch (err: any) {
      alert(`充值失败: ${err.message}`);
    } finally {
      setIsRecharging(false);
    }
  };

  const handleSearchSoul = async () => {
    if (isGuest) {
      promptGuestRegister("灵魂匹配");
      return;
    }
    if (!searchQuery.trim() || !activePersona) {
      alert("请先描述你想寻找的特质，并确保已选中当前活跃人格！");
      return;
    }
    
    setIsSearching(true);
    setMatchError(null);
    setMatchResults([]);
    setMatchQuery(searchQuery.trim());
    try {
      const q = searchQuery.trim();

      const mySeeking = normalizeSeekingGenderValue(
        (activePersona as any)?.seeking_gender ??
          (activePersona as any)?.seekingGender ??
          (activePersona as any)?.sexual_orientation ??
          (activePersona as any)?.orientation ??
          getPersonaDemographicsById((activePersona as any)?.id)?.seeking_gender ??
          "",
      );

      let candidates: any[] = [];
      let fetchErr: any = null;
      try {
        const uid = session?.user?.id;
        const query = supabase.from("personas").select("*");
        const { data, error } = uid && uid !== "guest-local" ? await query.neq("user_id", uid) : await query;
        if (error) fetchErr = error;
        if (Array.isArray(data)) candidates = data;
      } catch (e: any) {
        fetchErr = e;
      }
      if ((!candidates || candidates.length === 0) && Array.isArray(allOtherPersonas) && allOtherPersonas.length > 0) {
        candidates = allOtherPersonas as any[];
        fetchErr = null;
      }
      if (!Array.isArray(candidates) || candidates.length === 0) {
        const msg = fetchErr?.message ? String(fetchErr.message) : "全网暂无其他玩家的档案！";
        setMatchError(msg);
        return;
      }

      const filtered = candidates.filter((c) => {
        const name = String((c as any)?.name || "").trim();
        if (!name) return false;
        if (String((c as any)?.user_id || "") === String(session?.user?.id || "")) return false;
        if (mySeeking === "male" || mySeeking === "female" || mySeeking === "other") {
          const g = normalizeGenderValue((c as any)?.gender ?? (c as any)?.sex ?? "");
          if (g === "unknown") return false;
          return g === mySeeking;
        }
        return true;
      });
      if ((mySeeking === "male" || mySeeking === "female" || mySeeking === "other") && filtered.length === 0) {
        setMatchError("当前没有符合你偏好的候选（或候选未提供性别信息）。请先确保其他人格卡已填写性别字段。");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/search-soul`, {
        method: "POST",
        headers: withPluginTokenHeaders({
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.access_token || ""}`,
        }),
        body: JSON.stringify({
          targetDesc: q,
          myInfo: {
            name: String((activePersona as any)?.name || ""),
            mbti: String((activePersona as any)?.mbti || (activePersona as any)?.mbti_type || ""),
            vibe: String((activePersona as any)?.vibe || ""),
            speech_style: String((activePersona as any)?.speech_style || ""),
            logic: String((activePersona as any)?.logic || ""),
          },
          candidates: filtered.map((c: any) => ({
            id: String(c?.id || ""),
            name: String(c?.name || ""),
            mbti: String(c?.mbti || c?.mbti_type || ""),
            vibe: String(c?.vibe || ""),
            speech_style: String(c?.speech_style || ""),
            logic: String(c?.logic || ""),
          })),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `搜索失败：HTTP ${res.status}`);

      const matchId = String(json?.match_id || "").trim();
      const bestMatch = filtered.find((item: any) => String(item?.id || "").trim() === matchId) || null;
      if (!bestMatch) {
        setMatchError("系统这次没有稳定挑出唯一对象，请换个描述再试试。");
        return;
      }

      setMatchResults([{
        persona: bestMatch,
        score: Number(json?.confidence || 0) * 100,
        reasons: Array.isArray(json?.reason) ? json.reason : [],
        openingHook: String(json?.opening_hook || ""),
        openingMessages: Array.isArray(json?.opening_messages) ? json.opening_messages : [],
      }]);
    } catch (err: any) {
      const msg = err?.message ? String(err.message) : "检索出错";
      setMatchError(msg);
    } finally {
      setIsSearching(false);
    }
  };
  useEffect(() => {
    const fetchPersonas = async () => {
      if (isGuest) {
        setPersonasLoaded(false);
        const data = readGuestPersonas();
        setPersonas(data);
        setActivePersona((prev: any) => {
          if (data.length === 0) return null;
          let preferredId = "";
          if (activePersonaStorageKey) {
            try {
              preferredId = String(localStorage.getItem(activePersonaStorageKey) || "").trim();
            } catch {}
          }
          if (preferredId) {
            const picked = data.find((p) => String(p?.id) === preferredId);
            if (picked) return picked;
          }
          if (!prev) return data[0];
          const found = data.find((p) => String(p?.id) === String(prev?.id));
          return found || data[0];
        });
        setPersonasLoaded(true);
        return;
      }
      if (!session?.user?.id) return;
      setPersonasLoaded(false);
      try {
        const upgraded = await migrateGuestPersonasToAccount(String(session.user.id || ""));
        if (upgraded.preferredPersonaId && activePersonaStorageKey) {
          localStorage.setItem(activePersonaStorageKey, upgraded.preferredPersonaId);
        }
      } catch (migrationErr: any) {
        console.error("游客卡片迁移失败", migrationErr);
      }
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('user_id', session.user.id)
        .order('id', { ascending: false });
      
      if (!error && data) {
        setPersonas(data);
        setActivePersona((prev: any) => {
          if (data.length === 0) return null;
          let preferredId = "";
          if (activePersonaStorageKey) {
            try {
              preferredId = String(localStorage.getItem(activePersonaStorageKey) || "").trim();
            } catch {}
          }
          if (preferredId) {
            const picked = data.find((p) => String(p?.id) === preferredId);
            if (picked) return picked;
          }
          if (!prev) return data[0];
          const found = data.find((p) => String(p?.id) === String(prev?.id));
          return found || data[0];
        });
      }
      setPersonasLoaded(true);
    };
    fetchPersonas();
  }, [session, activePersonaStorageKey, isGuest]);

  useEffect(() => {
    if (!isGuest) return;
    writeGuestPersonas(personas);
  }, [isGuest, personas]);

  useEffect(() => {
    const uid = String(session?.user?.id || "").trim();
    if (!uid) return;
    if (!personasLoaded) return;
    if (isCreatingPersona) return;
    if (activeRealm !== "social") return;
    if (personas.length > 0) {
      if (firstPersonaOnboardingOpen) setFirstPersonaOnboardingOpen(false);
      return;
    }
    const key = `onboarding-first-persona-dismissed:v1:${uid}`;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(key) === "1";
    } catch {}
    if (dismissed) return;
    setActiveTab("mycards");
    setFirstPersonaOnboardingOpen(true);
  }, [session?.user?.id, personasLoaded, personas.length, isCreatingPersona, activeRealm, firstPersonaOnboardingOpen]);

  // Fetch tab data when tab or activePersona changes
  useEffect(() => {
    const fetchTabData = async () => {
      if (!activePersona && !isGuest) return;
      setLoadingTab(true);

      const loadOtherPersonas = async () => {
        const uid = String(session?.user?.id || "").trim();
        const query = supabase.from("personas").select("*");
        const { data, error } = uid && uid !== "guest-local" ? await query.neq("user_id", uid) : await query;
        if (error) {
          showHud(
            "error",
            `加载推荐卡片失败：${error.message}（通常是 personas 表 RLS 未允许读取他人数据）`,
          );
          return [];
        }
        return data || [];
      };

      const mapConversationRows = (conversationRows: SharedConversationRecord[], others: any[]) => {
        const personaPool = [...(personas || []), ...(others || [])];
        const personaMap = new Map<string, any>();
        personaPool.forEach((p: any) => {
          const pid = String(p?.id || "").trim();
          if (pid && !personaMap.has(pid)) personaMap.set(pid, p);
        });
        return (conversationRows || []).map((conv) => {
          const selfId = String(activePersona?.id || "").trim();
          const aId = String(conv?.participant_a_persona_id || "").trim();
          const bId = String(conv?.participant_b_persona_id || "").trim();
          const targetId = selfId && aId === selfId ? bId : aId;
          const targetPersona = personaMap.get(targetId);
          const targetName = String((targetPersona as any)?.name || "未命名角色").trim() || "未命名角色";
          const targetOwnerId = String((targetPersona as any)?.user_id || "").trim();
          const selfIsA = selfId === aId;
          const currentMode = conv?.current_mode === "human" || conv?.current_mode === "mixed" ? conv.current_mode : "agent";
          const otherHumanJoined = selfIsA ? Boolean(conv?.human_joined_b) : Boolean(conv?.human_joined_a);
          const otherAgentEnabled = selfIsA ? Boolean(conv?.agent_enabled_b ?? true) : Boolean(conv?.agent_enabled_a ?? true);
          const modeTitle = buildConversationModeCopy(currentMode, conv?.status, targetName, otherHumanJoined, otherAgentEnabled).title;
          return {
            ...conv,
            id: String(conv?.id || ""),
            is_conversation: true,
            target_persona_id: targetId,
            target_desc: targetName,
            target_user_id: targetOwnerId,
            target_mode_title: modeTitle,
            history: JSON.stringify([{ role: "assistant", content: String(conv?.last_message_preview || "") }]),
            unread_count: 0,
            updated_at: conv?.updated_at || conv?.last_message_at || conv?.created_at || new Date().toISOString(),
            created_at: conv?.created_at || conv?.updated_at || new Date().toISOString(),
            status:
              String(conv?.status || "").toLowerCase().includes("automation_running")
                ? "Automation_Running"
                : currentMode === "human"
                  ? "Human_Chatting"
                  : currentMode === "mixed"
                    ? "Mixed_Chatting"
                    : "Conversation_Recorded",
          };
        });
      };

      const migrateLegacyChatsBatch = async (conversationRows: SharedConversationRecord[], others: any[]) => {
        if (isGuest || !activePersona?.id) return false;
        const { data: legacyRows, error: legacyErr } = await supabase
          .from("chats")
          .select("*")
          .eq("persona_id", activePersona.id)
          .order("id", { ascending: false });
        if (legacyErr) {
          if (!shouldSilenceSupabaseError(legacyErr, "chats")) {
            console.error("读取旧聊天失败", legacyErr);
          }
          return false;
        }
        if (!Array.isArray(legacyRows) || !legacyRows.length) return false;

        const selfPersonaId = String(activePersona.id || "").trim();
        const othersByName = new Map<string, any>();
        (others || []).forEach((p: any) => {
          const name = String(p?.name || "").trim();
          if (name && !othersByName.has(name)) othersByName.set(name, p);
        });
        const conversationMap = new Map<string, SharedConversationRecord>();
        (conversationRows || []).forEach((conv) => {
          const aId = String(conv?.participant_a_persona_id || "").trim();
          const bId = String(conv?.participant_b_persona_id || "").trim();
          const [lowId, highId] = getOrderedPersonaPair(aId, bId);
          if (lowId && highId) conversationMap.set(`${lowId}|${highId}`, conv);
        });

        let migratedAny = false;
        for (const legacyRow of legacyRows) {
          const targetName = String((legacyRow as any)?.target_desc || "").trim();
          const targetPersona = othersByName.get(targetName);
          const targetPersonaId = String((targetPersona as any)?.id || "").trim();
          if (!targetName || !targetPersonaId || targetPersonaId === selfPersonaId) continue;

          const [lowId, highId] = getOrderedPersonaPair(selfPersonaId, targetPersonaId);
          if (!lowId || !highId) continue;

          const pairKey = `${lowId}|${highId}`;
          let conversationId = String(conversationMap.get(pairKey)?.id || "").trim();
          const normalizedHistory = JSON.parse(buildLegacyChatHistoryJson((legacyRow as any)?.history || "[]"));
          const lastMessage = Array.isArray(normalizedHistory) && normalizedHistory.length
            ? normalizedHistory[normalizedHistory.length - 1]
            : null;
          const lastContent = String(lastMessage?.content || "").trim();
          const lastSenderPersonaId = lastMessage?.role === "user" ? selfPersonaId : targetPersonaId;

          if (!conversationId) {
            const { data: insertedConversation, error: insertErr } = await supabase
              .from("conversations")
              .insert({
                participant_a_persona_id: selfPersonaId,
                participant_b_persona_id: targetPersonaId,
                participant_low_persona_id: lowId,
                participant_high_persona_id: highId,
                created_by_persona_id: selfPersonaId,
                current_mode: "agent",
                status: "active",
                last_message_preview: lastContent || "已从旧版聊天批量迁移",
                last_message_at: (legacyRow as any)?.updated_at || (legacyRow as any)?.created_at || new Date().toISOString(),
                last_sender_persona_id: lastContent ? lastSenderPersonaId : selfPersonaId,
              })
              .select("*")
              .maybeSingle();
            if (insertErr) {
              if (!shouldSilenceSupabaseError(insertErr, "conversations")) {
                console.error("批量迁移创建共享会话失败", insertErr);
              }
              continue;
            }
            conversationId = String(insertedConversation?.id || "").trim();
            if (conversationId && insertedConversation) {
              conversationMap.set(pairKey, insertedConversation as SharedConversationRecord);
              migratedAny = true;
            }
          }
          if (!conversationId) continue;

          const { count: messageCount, error: countErr } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conversationId);
          if (countErr) {
            if (!shouldSilenceSupabaseError(countErr, "chat_messages")) {
              console.error("批量迁移读取共享消息数量失败", countErr);
            }
            continue;
          }
          if ((messageCount || 0) > 0 || !Array.isArray(normalizedHistory) || !normalizedHistory.length) continue;

          const payload = normalizedHistory
            .map((item: any, idx: number) => {
              const role = item?.role === "user" ? "user" : "assistant";
              const content = String(item?.content || "").trim();
              if (!content) return null;
              return {
                conversation_id: conversationId,
                sender_persona_id: role === "user" ? selfPersonaId : targetPersonaId,
                sender_kind: role === "user" ? "human" : "agent",
                content,
                meta: { source: "legacy_chat_batch_migration", legacy_chat_id: (legacyRow as any)?.id, order: idx + 1 },
              };
            })
            .filter(Boolean);
          if (!payload.length) continue;

          const { error: insertMsgErr } = await supabase.from("chat_messages").insert(payload as any);
          if (insertMsgErr) {
            if (!shouldSilenceSupabaseError(insertMsgErr, "chat_messages")) {
              console.error("批量迁移写入共享消息失败", insertMsgErr);
            }
            continue;
          }
          migratedAny = true;
        }

        return migratedAny;
      };

      try {
        if (activeTab === "bonds") {
          const others = await loadOtherPersonas();
          setAllOtherPersonas(others);
          if (isGuest) {
            setMyFollows([]);
            return;
          }
          const uid = String(session?.user?.id || "").trim();
          if (uid && uid !== "guest-local") {
            const { data: myF } = await supabase
              .from("follows")
              .select("target_persona_id")
              .eq("follower_id", uid);
            setMyFollows(myF ? myF.map((f) => f.target_persona_id) : []);
          } else {
            setMyFollows([]);
          }
          return;
        }

        if (activeTab === "chats") {
          const [{ data: chatData, error: chatErr }, others] = await Promise.all([
            isGuest
              ? Promise.resolve({ data: [] as any[], error: null as any })
              : supabase
                  .from("conversations")
                  .select("*")
                  .or(`participant_a_persona_id.eq.${String(activePersona?.id || "")},participant_b_persona_id.eq.${String(activePersona?.id || "")}`)
                  .order("last_message_at", { ascending: false }),
            loadOtherPersonas(),
          ]);
          const knownMissingConversationTable = isMissingRelationError(chatErr, "conversations");
          if (chatErr && !knownMissingConversationTable) showHud("error", `加载对话失败：${chatErr.message}`);
          if (!chatErr && Array.isArray(chatData)) {
            let finalConversationRows = chatData as SharedConversationRecord[];
            const migratedAny = await migrateLegacyChatsBatch(finalConversationRows, others || []);
            if (migratedAny && !isGuest) {
              const { data: refreshedRows, error: refreshErr } = await supabase
                .from("conversations")
                .select("*")
                .or(`participant_a_persona_id.eq.${String(activePersona?.id || "")},participant_b_persona_id.eq.${String(activePersona?.id || "")}`)
                .order("last_message_at", { ascending: false });
              if (!refreshErr && Array.isArray(refreshedRows)) {
                finalConversationRows = refreshedRows as SharedConversationRecord[];
              }
            }
            setChats(mapConversationRows(finalConversationRows, others || []));
          } else {
            const legacyChats = isGuest
              ? { data: [] as any[], error: null as any }
              : await supabase.from("chats").select("*").eq("persona_id", activePersona?.id).order("id", { ascending: false });
            if (legacyChats.error) showHud("error", `加载对话失败：${legacyChats.error.message}`);
            setChats(legacyChats.data || []);
          }
          setAllOtherPersonas(others);
          return;
        }

        if (activeTab === "echoes") {
          const { data, error } = await supabase
            .from("moments")
            .select("id, persona_id, content, likes, created_at, personas(name, mbti, card_cover_url, avatar_2d_url)")
            .order("created_at", { ascending: false })
            .limit(50);
          if (!isGuest) {
            const myIds = (personas || []).map((p) => p?.id).filter(Boolean);
            if (myIds.length === 0) {
              setEchoes([]);
              return;
            }
            const { data: ownData, error: ownError } = await supabase
              .from("moments")
              .select("id, persona_id, content, likes, created_at, personas(name, mbti, card_cover_url, avatar_2d_url)")
              .in("persona_id", myIds as any)
              .order("created_at", { ascending: false })
              .limit(50);
            if (ownError) showHud("error", `加载动态失败：${ownError.message}`);
            setEchoes(ownData || []);
            return;
          }
          if (error) showHud("error", `加载动态失败：${error.message}`);
          setEchoes(data || []);
          return;
        }

        const isDiscoverNeedsOthers =
          activeRealm === "mortal" ||
          (activeRealm === "social" && activeTab === "search");
        if (isDiscoverNeedsOthers) {
          const others = await loadOtherPersonas();
          setAllOtherPersonas(others);
          return;
        }
      } finally {
        setLoadingTab(false);
      }
    };

    fetchTabData();
  }, [activeTab, activePersona, activeRealm, personas]);

  const MOMENT_LIKES_KEY = "ui-moment-likes:v1";
  const isEchoLiked = (momentId: string) => {
    const uid = String(session?.user?.id || "").trim();
    const id = String(momentId || "").trim();
    if (!uid || !id) return false;
    try {
      const raw = localStorage.getItem(MOMENT_LIKES_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as Record<string, string[]>;
      const list = Array.isArray(parsed?.[uid]) ? parsed[uid] : [];
      return list.includes(id);
    } catch {
      return false;
    }
  };
  const markEchoLiked = (momentId: string) => {
    const uid = String(session?.user?.id || "").trim();
    const id = String(momentId || "").trim();
    if (!uid || !id) return;
    try {
      const raw = localStorage.getItem(MOMENT_LIKES_KEY);
      const parsed = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
      const prev = Array.isArray(parsed?.[uid]) ? parsed[uid] : [];
      if (prev.includes(id)) return;
      const next = { ...(parsed || {}), [uid]: [...prev, id].slice(-5000) };
      localStorage.setItem(MOMENT_LIKES_KEY, JSON.stringify(next));
    } catch {}
  };

  const likeEcho = async (momentId: string) => {
    if (isGuest) {
      promptGuestRegister("点赞");
      return;
    }
    const id = String(momentId || "").trim();
    if (!id) return;
    if (isEchoLiked(id)) return;
    markEchoLiked(id);
    const current = echoes.find((x) => String((x as any)?.id) === id) as any;
    const prevLikes = typeof current?.likes === "number" ? current.likes : Number(current?.likes || 0) || 0;
    setEchoes((prev) => prev.map((x) => (String((x as any)?.id) === id ? { ...(x as any), likes: prevLikes + 1 } : x)));
    try {
      const { data, error } = await supabase
        .from("moments")
        .update({ likes: prevLikes + 1 })
        .eq("id", id)
        .select("likes")
        .single();
      if (error) throw error;
      const nextLikes = typeof (data as any)?.likes === "number" ? (data as any).likes : Number((data as any)?.likes || prevLikes + 1);
      setEchoes((prev) =>
        prev.map((x) => (String((x as any)?.id) === id ? { ...(x as any), likes: Number.isFinite(nextLikes) ? nextLikes : prevLikes + 1 } : x)),
      );
    } catch (e: any) {
      setEchoes((prev) => prev.map((x) => (String((x as any)?.id) === id ? { ...(x as any), likes: prevLikes } : x)));
      const msg = e?.message ? String(e.message) : "点赞失败";
      alert(`点赞失败：${msg}`);
    }
  };

  const handleLogout = async () => {
    if (isGuest) {
      onExitGuest();
      return;
    }
    await supabase.auth.signOut();
  };

  const getChatLastMessage = (history: string) => {
    if (!history) return "点击继续，开启下一段剧情。";
    try {
      const parsed = JSON.parse(history);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const last = parsed[parsed.length - 1];
        return String(last?.content || "点击继续，开启下一段剧情。").slice(0, 56);
      }
    } catch {
      const lines = history.split('\n').filter(Boolean);
      if (lines.length > 0) {
        return lines[lines.length - 1].replace(/^(ME:|THEM:)\s*/, '').slice(0, 56);
      }
    }
    return "点击继续，开启下一段剧情。";
  };

  const upsertPersonaVisual = (
    personaId: string | number,
    patch: { cover2dUrl?: string; banner2dUrl?: string; avatar2dUrl?: string; model3dUrl?: string },
  ) => {
    const key = String(personaId);
    setPersonaVisualAssets((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        ...patch,
      },
    }));
  };

  const persistPersonaVisualToDb = async (
    personaId: string | number,
    patch: { card_cover_url?: string; banner_cover_url?: string; avatar_2d_url?: string; model_3d_url?: string },
  ) => {
    const uid = String(session?.user?.id || "");
    if (!uid) return;
    const id = String(personaId);
    const target = personas.find((p) => String(p?.id) === id);
    if (!target) return;
    if (String(target?.user_id || "") !== uid) return;
    try {
      const { data, error } = await supabase
        .from("personas")
        .update(patch)
        .eq("id", target.id)
        .select()
        .single();
      if (error) throw error;
      if (data) {
        setPersonas((prev) => prev.map((x) => (String(x?.id) === String(data?.id) ? data : x)));
        if (activePersona && String(activePersona?.id) === String(data?.id)) setActivePersona(data);
      }
    } catch {}
  };

  const getPersonaAppearanceHint = (p: any) => {
    const id = String(p?.id ?? "");
    const v = String(personaAppearance[id] || "").trim();
    return v;
  };

  const [appearanceDialog, setAppearanceDialog] = useState<{
    open: boolean;
    personaId: string;
    value: string;
  }>({ open: false, personaId: "", value: "" });
  const openAppearanceDialog = (p: any) => {
    const id = String(p?.id ?? "");
    if (!id) return;
    setAppearanceDialog({ open: true, personaId: id, value: getPersonaAppearanceHint(p) });
  };
  const closeAppearanceDialog = () => setAppearanceDialog((prev) => ({ ...prev, open: false }));
  const submitAppearanceDialog = () => {
    const id = String(appearanceDialog.personaId || "");
    const v = String(appearanceDialog.value || "").trim();
    if (!id) return closeAppearanceDialog();
    setPersonaAppearance((prev) => ({ ...prev, [id]: v }));
    closeAppearanceDialog();
  };

  const uploadImageToCosIfNeeded = async (rawUrl: string) => {
    const url = String(rawUrl || "").trim();
    if (!/^https?:\/\//i.test(url)) return url;
    if (url.includes(".myqcloud.com/")) return url;
    const res = await fetch(`${API_BASE_URL}/api/cos/upload-from-url`, {
      method: "POST",
      headers: withPluginTokenHeaders({ "content-type": "application/json" }),
      body: JSON.stringify({ imageUrl: url }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || `HTTP ${res.status}`);
    }
    const j = await res.json().catch(() => ({}));
    const outUrl = String((j as any)?.url || "").trim();
    return outUrl || url;
  };

  const importGeneratedModelToLibrary = async (personaId: string | number, rawUrl: string) => {
    const url = String(rawUrl || "").trim();
    if (!url) return url;
    if (/^(blob:|data:)/i.test(url)) return url;
    if (/^\/models\//i.test(url)) return `${API_BASE_URL}${url}`;
    try {
      const apiBase = new URL(API_BASE_URL);
      const resolved = new URL(url, API_BASE_URL);
      if (resolved.origin === apiBase.origin && resolved.pathname.startsWith("/models/")) {
        return resolved.toString();
      }
    } catch {}

    const target = personas.find((p) => String(p?.id) === String(personaId));
    const nickname = String(target?.nickname || target?.name || "persona").trim();
    const safeName = nickname.replace(/[^\w\u4e00-\u9fa5-]+/g, "_").slice(0, 40) || "persona";
    const res = await fetch(`${API_BASE_URL}/api/model-library/import-url`, {
      method: "POST",
      headers: withPluginTokenHeaders({ "content-type": "application/json" }),
      body: JSON.stringify({
        modelUrl: url,
        filename: `${safeName}-3d.glb`,
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || `HTTP ${res.status}`);
    }
    const j = await res.json().catch(() => ({}));
    const urlPath = String((j as any)?.urlPath || "").trim();
    if (!urlPath) throw new Error("模型转存失败：缺少 urlPath");
    return /^https?:\/\//i.test(urlPath) ? urlPath : `${API_BASE_URL}${urlPath}`;
  };

  type RecentImage = { url: string; ts: number };
  const RECENT_IMAGES_KEY = "pnp_recent_images_v1";
  const readRecentImages = (): RecentImage[] => {
    try {
      const raw = localStorage.getItem(RECENT_IMAGES_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr
        .map((x: any) => ({ url: String(x?.url || "").trim(), ts: Number(x?.ts || 0) }))
        .filter((x: RecentImage) => x.url)
        .slice(0, 60);
    } catch {
      return [];
    }
  };
  const writeRecentImages = (arr: RecentImage[]) => {
    try {
      localStorage.setItem(RECENT_IMAGES_KEY, JSON.stringify(arr.slice(0, 60)));
    } catch {}
  };
  const [recentImages, setRecentImages] = useState<RecentImage[]>(() => readRecentImages());
  const addRecentImages = (urls: string[]) => {
    const now = Date.now();
    const clean = urls
      .map((u) => String(u || "").trim())
      .filter((u) => /^https?:\/\//i.test(u));
    if (!clean.length) return;
    setRecentImages((prev) => {
      const next: RecentImage[] = [];
      const seen = new Set<string>();
      for (const u of clean) {
        if (seen.has(u)) continue;
        seen.add(u);
        next.push({ url: u, ts: now });
      }
      for (const x of prev) {
        const u = String(x?.url || "").trim();
        if (!u || seen.has(u)) continue;
        seen.add(u);
        next.push({ url: u, ts: Number(x?.ts || 0) });
        if (next.length >= 60) break;
      }
      writeRecentImages(next);
      return next;
    });
  };

  type UrlDialogKind = "model3d" | "cover2d" | "banner2d" | "avatar2d";
  const [urlDialog, setUrlDialog] = useState<{
    open: boolean;
    kind: UrlDialogKind;
    personaId: string;
    value: string;
  }>({ open: false, kind: "cover2d", personaId: "", value: "" });
  const [urlDialogMode, setUrlDialogMode] = useState<"local" | "history" | "url">("history");
  const [urlDialogHistoryUrl, setUrlDialogHistoryUrl] = useState("");
  const [urlDialogFile, setUrlDialogFile] = useState<File | null>(null);
  const [urlDialogFilePreviewUrl, setUrlDialogFilePreviewUrl] = useState("");
  const [urlDialogBusy, setUrlDialogBusy] = useState(false);
  const [urlDialogError, setUrlDialogError] = useState("");
  const [modelDialogMode, setModelDialogMode] = useState<"library" | "upload" | "url">("library");
  const [modelLibraryItems, setModelLibraryItems] = useState<{ name: string; urlPath: string }[]>([]);
  const [modelLibraryLoading, setModelLibraryLoading] = useState(false);
  const [modelLibraryUploading, setModelLibraryUploading] = useState(false);
  const modelLibraryFileRef = useRef<HTMLInputElement | null>(null);
  const urlDialogFileInputRef = useRef<HTMLInputElement | null>(null);
  const urlDialogFolderInputRef = useRef<HTMLInputElement | null>(null);
  const isImageUrlKind = (k: UrlDialogKind) => k !== "model3d";
  const setUrlDialogLocalFile = (file: File | null) => {
    setUrlDialogFile(file);
    if (urlDialogFilePreviewUrl) {
      try {
        URL.revokeObjectURL(urlDialogFilePreviewUrl);
      } catch {}
      setUrlDialogFilePreviewUrl("");
    }
    if (file) {
      try {
        setUrlDialogFilePreviewUrl(URL.createObjectURL(file));
      } catch {}
    }
  };
  const uploadLocalImageToCos = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file, file.name || "image");
    const res = await fetch(`${API_BASE_URL}/api/cos/upload-image`, {
      method: "POST",
      headers: withPluginTokenHeaders({}),
      body: fd,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || `HTTP ${res.status}`);
    }
    const j = await res.json().catch(() => ({}));
    const outUrl = String((j as any)?.url || "").trim();
    return outUrl;
  };
  const openUrlDialog = (p: any, kind: UrlDialogKind) => {
    const id = String(p?.id ?? "");
    const localVisual = personaVisualAssets[id] || {};
    const current = (() => {
      if (kind === "model3d") return String(p?.model_3d_url || localVisual.model3dUrl || "");
      if (kind === "banner2d") return String(p?.banner_cover_url || localVisual.banner2dUrl || "");
      if (kind === "avatar2d") return String(p?.avatar_2d_url || localVisual.avatar2dUrl || "");
      return String(p?.card_cover_url || localVisual.cover2dUrl || "");
    })();
    const nextMode = (() => {
      if (!isImageUrlKind(kind)) return "url";
      if (recentImages.length > 0) return "history";
      return "local";
    })() as "local" | "history" | "url";
    if (kind === "model3d") setModelDialogMode("library");
    const firstHistory = recentImages.length > 0 ? String(recentImages[0].url || "") : "";
    setUrlDialog({ open: true, kind, personaId: id, value: current });
    setUrlDialogMode(nextMode);
    setUrlDialogHistoryUrl(current || firstHistory);
    setUrlDialogFile(null);
    setUrlDialogFilePreviewUrl("");
    setUrlDialogBusy(false);
    setUrlDialogError("");
  };
  const closeUrlDialog = () => {
    setUrlDialog((prev) => ({ ...prev, open: false }));
    setUrlDialogBusy(false);
    setUrlDialogError("");
    if (urlDialogFilePreviewUrl) {
      try {
        URL.revokeObjectURL(urlDialogFilePreviewUrl);
      } catch {}
      setUrlDialogFilePreviewUrl("");
    }
  };

  useEffect(() => {
    if (!urlDialog.open) return;
    if (urlDialog.kind !== "model3d") return;
    let cancelled = false;
    setModelLibraryLoading(true);
    setModelLibraryItems([]);
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/model-library`, { headers: withPluginTokenHeaders({}) });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `HTTP ${res.status}`);
        }
        const j = await res.json().catch(() => ({}));
        const items = Array.isArray((j as any)?.items) ? (j as any).items : [];
        const next = items
          .map((x: any) => ({ name: String(x?.name || ""), urlPath: String(x?.urlPath || "") }))
          .filter((x: any) => x.name && x.urlPath);
        if (cancelled) return;
        setModelLibraryItems(next);
        setModelLibraryLoading(false);
      } catch {
        if (cancelled) return;
        setModelLibraryItems([]);
        setModelLibraryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [urlDialog.open, urlDialog.kind]);

  const submitUrlDialog = async () => {
    const pid = String(urlDialog.personaId || "");
    if (!pid) return closeUrlDialog();
    setUrlDialogError("");
    setUrlDialogBusy(true);
    try {
      if (urlDialog.kind === "model3d") {
        const url = String(urlDialog.value || "").trim();
        if (!url) return closeUrlDialog();
        upsertPersonaVisual(pid, { model3dUrl: url });
        void persistPersonaVisualToDb(pid, { model_3d_url: url });
        closeUrlDialog();
        return;
      }

      const raw = await (async () => {
        if (urlDialogMode === "local") {
          if (!urlDialogFile) return "";
          const u = await uploadLocalImageToCos(urlDialogFile);
          return u;
        }
        if (urlDialogMode === "history") return String(urlDialogHistoryUrl || "").trim();
        return String(urlDialog.value || "").trim();
      })();
      if (!raw) return closeUrlDialog();

      const finalUrl = await uploadImageToCosIfNeeded(raw);
      if (finalUrl) addRecentImages([finalUrl]);

      if (urlDialog.kind === "banner2d") {
        upsertPersonaVisual(pid, { banner2dUrl: finalUrl });
        void persistPersonaVisualToDb(pid, { banner_cover_url: finalUrl });
        closeUrlDialog();
        return;
      }
      if (urlDialog.kind === "avatar2d") {
        upsertPersonaVisual(pid, { avatar2dUrl: finalUrl });
        void persistPersonaVisualToDb(pid, { avatar_2d_url: finalUrl });
        closeUrlDialog();
        return;
      }
      upsertPersonaVisual(pid, { cover2dUrl: finalUrl });
      void persistPersonaVisualToDb(pid, { card_cover_url: finalUrl });
      closeUrlDialog();
    } catch (e: any) {
      setUrlDialogError(e?.message ? String(e.message) : "保存失败");
      setUrlDialogBusy(false);
    }
  };

  const hashColor = (seed: string) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const hue = h % 360;
    const hue2 = (hue + 46) % 360;
    return { c1: `hsl(${hue} 82% 58%)`, c2: `hsl(${hue2} 82% 60%)` };
  };

  const generatePersona2DCard = (p: any) => {
    const seed = `${p?.name || "persona"}-${p?.mbti || ""}-${p?.logic || ""}`;
    const { c1, c2 } = hashColor(seed);
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1080" viewBox="0 0 720 1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.15)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.7)"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="20%" r="70%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="45%" stop-color="rgba(255,255,255,0.05)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="720" height="1080" fill="url(#bg)"/>
  <rect width="720" height="1080" fill="url(#fade)"/>
  <rect width="720" height="1080" fill="url(#glow)"/>
  <circle cx="620" cy="120" r="90" fill="rgba(255,255,255,0.14)"/>
  <circle cx="110" cy="180" r="55" fill="rgba(255,255,255,0.12)"/>
  <circle cx="620" cy="920" r="140" fill="rgba(255,255,255,0.06)"/>
  <rect x="42" y="760" width="636" height="278" rx="30" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.16)"/>
  <path d="M92 840 H628" stroke="rgba(255,255,255,0.22)" stroke-width="2" />
  <path d="M92 900 H520" stroke="rgba(255,255,255,0.16)" stroke-width="2" />
  <path d="M92 958 H568" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
</svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const buildPersonaCardPrompt = (p: any) => {
    const name = String(p?.name || "未知角色");
    const mbti = String(p?.mbti || "");
    const vibe = String(p?.vibe || "").trim();
    const logic = String(p?.logic || "").trim();
    const style = String(p?.speech_style || "").trim();
    const appearance = getPersonaAppearanceById(p?.id);
    const gender = getPersonaGenderForPrompt(p);
    const parts = [
      `为角色「${name}」生成一张竖版 2:3 人物卡海报（适合做角色卡封面）。`,
      `画面要求：高质感、电影级光影、细节丰富、主体居中、画面干净。`,
      `风格偏好：偏暗色系、现代感、沉浸式、游戏 UI 海报风。`,
      `构图建议（用于后续生成 3D 更稳定）：尽量全身照（或至少 3/4 身），人物完整入镜，双手尽量自然收起（插兜/垂放/轻握简单道具），不要做复杂手势，避免手部特写与手指遮挡脸。`,
      `露脸要求：人物必须完整露脸，五官清晰可见，头顶不能被裁切，额头、眼睛、鼻子、嘴巴都要完整出现在画面中。`,
      `半身兜底：如果最终不是全身而是半身/上半身构图，也必须保留完整头部和完整脸部，不能只拍到下半张脸、脖子或胸口以上局部；人物脸部应稳定落在画面上半区偏中间位置，并为头顶预留少量安全留白。`,
    ];
    if (gender === "male") {
      parts.push(`性别硬约束：该角色必须是男性，按男性人物生成，使用男性面部轮廓、男性骨架与男性气质；禁止生成女性角色、女性妆容、女性服饰、女性身形特征。`);
    } else if (gender === "female") {
      parts.push(`性别硬约束：该角色必须是女性，按女性人物生成，使用女性面部轮廓、女性骨架与女性气质；禁止生成男性角色、男性妆造、男性服饰、男性身形特征。`);
    }
    if (mbti) parts.push(`角色 MBTI：${mbti}。`);
    if (vibe) parts.push(`气质关键词：${vibe}。`);
    if (logic) parts.push(`人物内核/底层逻辑摘要：${logic}。`);
    if (style) parts.push(`说话风格：${style}。`);
    if (appearance) parts.push(`外观设定：${appearance}。请严格遵守这些外观细节，确保多次生成保持一致。`);
    parts.push(
      `禁止：任何文字、字母、数字、logo、标语、水印、签名、文字噪点；低清、过度模糊、畸形手指、多余手指、缺失手指、手指粘连、手部扭曲、断肢。`,
    );
    return parts.join("\n");
  };

  const buildPersonaBannerPrompt = (p: any) => {
    const name = String(p?.name || "未知角色");
    const mbti = String(p?.mbti || "");
    const vibe = String(p?.vibe || "").trim();
    const logic = String(p?.logic || "").trim();
    const style = String(p?.speech_style || "").trim();
    const parts = [
      `为角色「${name}」生成一张横向宽幅 3:1 的横幅【背景图】（用于网站头图）。`,
      `构图要求：整体是“背景场景”，不出现人物、脸、身体、手、剪影；左侧留出约 35% 的干净暗色空间用于 UI 文案。`,
      `画面要求：高质感、电影级光影、细节丰富、暗色高级质感、游戏海报风。`,
      `说明：人物头像将由角色卡封面图自动叠加到横幅右侧，所以这里必须只生成背景。`,
    ];
    if (mbti) parts.push(`角色 MBTI：${mbti}。`);
    if (vibe) parts.push(`气质关键词：${vibe}。`);
    if (logic) parts.push(`人物内核/底层逻辑摘要：${logic}。`);
    if (style) parts.push(`说话风格：${style}。`);
    parts.push(`禁止：人物、脸、身体、手、剪影；任何文字、字母、数字、logo、水印、签名、文字噪点；低清、过度模糊。`);
    return parts.join("\n");
  };

  const openAiForPersona = (p: any, action: "portrait2d" | "banner2d" | "companion") => {
    const pid = String(p?.id ?? "");
    setAiTargetPersonaId(pid || null);
    setAiPanelKeepAlive(true);
    if (action === "companion") {
      setAiTargetImageKind(null);
      setAiInitialTab("companion");
      setAiInitialPrompt(undefined);
      setAiInitialSize(undefined);
      const localVisual = personaVisualAssets[String(p.id)] || {};
      const cover = p.card_cover_url || p.avatar_2d_url || localVisual.cover2dUrl || "";
      const canUse = typeof cover === "string" && /^https?:\/\//i.test(cover);
      setAiInitialImageUrl(canUse ? String(cover) : undefined);
    } else {
      setAiInitialTab("t2i");
      setAiInitialImageUrl(undefined);
      if (action === "banner2d") {
        setAiTargetImageKind("banner");
        setAiInitialPrompt(buildPersonaBannerPrompt(p));
        setAiInitialSize("3840x1280");
      } else {
        setAiTargetImageKind("portrait");
        setAiInitialPrompt(buildPersonaCardPrompt(p));
        setAiInitialSize("1440x2560");
      }
    }
    setAiPanelBusyState({ busy: false });
    setIsAiPanelOpen(true);
  };

  const personaByName = useMemo(() => {
    const map = new Map<string, any>();
    [...personas, ...allOtherPersonas].forEach((p) => {
      const name = String(p?.name || "").trim();
      if (name && !map.has(name)) map.set(name, p);
    });
    return map;
  }, [personas, allOtherPersonas]);

  const resolveCardCover = (chat: any) => {
    const p = personaByName.get(String(chat.target_desc || "").trim());
    if (!p) return null;
    if (!canViewerSee2d(p)) return null;
    return p?.card_cover_url || p?.avatar_2d_url || personaVisualAssets[String(p.id)]?.cover2dUrl || null;
  };

  const openLegacyChatWithTarget = async (name: string) => {
    const { data: existingChat, error: existingErr } = await supabase
      .from("chats")
      .select("id")
      .eq("persona_id", activePersona.id)
      .eq("target_desc", name)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existingErr) throw existingErr;
    if (existingChat?.id) {
      navigate(`/chat/${existingChat.id}`);
      return true;
    }

    const { data: newChat, error: insertErr } = await supabase
      .from("chats")
      .insert({
        persona_id: activePersona.id,
        target_desc: name,
        history: "ME: 很高兴遇见你",
        score: 50,
        status: "Matched",
      })
      .select("id")
      .maybeSingle();
    if (insertErr) throw insertErr;
    if (newChat?.id) {
      navigate(`/chat/${newChat.id}`);
      return true;
    }
    const { data: latest, error: latestErr } = await supabase
      .from("chats")
      .select("id")
      .eq("persona_id", activePersona.id)
      .eq("target_desc", name)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latestErr) throw latestErr;
    if (latest?.id) {
      navigate(`/chat/${latest.id}`);
      return true;
    }
    return false;
  };

  const startChatWithTarget = async (
    targetName: string,
    options?: {
      targetPersona?: any;
      openingMessages?: Array<{ speaker?: string; content?: string }>;
    },
  ) => {
    if (isGuest) {
      promptGuestRegister("开聊");
      return;
    }
    if (!activePersona) {
      showHud("info", "请先创建并选择一个活跃人格。");
      setActiveRealm("social");
      setActiveTab("mycards");
      setIsCreatingPersona(false);
      return;
    }
    const name = String(targetName || "").trim();
    if (!name) {
      showHud("info", "该卡片未提供可开聊的人格信息。");
      return;
    }
    const targetPersona =
      options?.targetPersona ||
      allOtherPersonas.find((item: any) => String(item?.name || "").trim() === name) ||
      personaByName.get(name);
    const targetPersonaId = String((targetPersona as any)?.id || "").trim();
    const targetOwnerId = String((targetPersona as any)?.user_id || "").trim();
    const activePersonaId = String((activePersona as any)?.id || "").trim();
    const sessionUserId = String(session?.user?.id || "").trim();
    if (
      (targetPersonaId && activePersonaId && targetPersonaId === activePersonaId) ||
      (targetOwnerId && sessionUserId && targetOwnerId === sessionUserId)
    ) {
      showHud("info", "不能和自己的人格卡片开聊，请选择其他人的卡片。");
      return;
    }
    try {
      const ensureAutoPrelude = async (conversationId: string) => {
        const { count, error: countErr } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conversationId);
        if (countErr && !shouldSilenceSupabaseError(countErr, "chat_messages")) {
          throw countErr;
        }
        if ((count || 0) > 0) return;

        const autoChatRes = await fetch(`${API_BASE_URL}/api/auto-dual-chat/start`, {
          method: "POST",
          headers: withPluginTokenHeaders({
            "Content-Type": "application/json",
            authorization: `Bearer ${session?.access_token || ""}`,
          }),
          body: JSON.stringify({
            conversationId,
            selfPersona: {
              id: activePersona.id,
              name: (activePersona as any)?.name,
              mbti: (activePersona as any)?.mbti || (activePersona as any)?.mbti_type,
              vibe: (activePersona as any)?.vibe,
              speech_style: (activePersona as any)?.speech_style,
              logic: (activePersona as any)?.logic,
            },
            targetPersona: {
              id: targetPersonaId,
              name: (targetPersona as any)?.name,
              mbti: (targetPersona as any)?.mbti || (targetPersona as any)?.mbti_type,
              vibe: (targetPersona as any)?.vibe,
              speech_style: (targetPersona as any)?.speech_style,
              logic: (targetPersona as any)?.logic,
            },
            openingMessages: Array.isArray(options?.openingMessages) ? options?.openingMessages : [],
            totalLines: 10,
          }),
        });

        if (!autoChatRes.ok) {
          const firstMessage = await supabase.from("chat_messages").insert({
            conversation_id: conversationId,
            sender_persona_id: activePersona.id,
            sender_kind: "human",
            content: "很高兴遇见你",
            meta: { source: "start_chat_fallback" },
          });
          if (firstMessage.error && !isMissingRelationError(firstMessage.error, "chat_messages")) {
            throw firstMessage.error;
          }
        }
      };

      if (targetPersonaId) {
        const [lowId, highId] = getOrderedPersonaPair(activePersona.id, targetPersonaId);
        if (lowId && highId) {
          const { data: existingConversation, error: existingConversationErr } = await supabase
            .from("conversations")
            .select("id")
            .eq("participant_low_persona_id", lowId)
            .eq("participant_high_persona_id", highId)
            .maybeSingle();
          if (existingConversationErr && !shouldSilenceSupabaseError(existingConversationErr, "conversations")) {
            throw existingConversationErr;
          }
          if (existingConversation?.id) {
            await ensureAutoPrelude(String(existingConversation.id));
            navigate(`/chat/${existingConversation.id}`);
            return;
          }

          if (!existingConversationErr || !shouldSilenceSupabaseError(existingConversationErr, "conversations")) {
            const now = new Date().toISOString();
            const { data: insertedConversation, error: insertConversationErr } = await supabase
              .from("conversations")
              .insert({
                participant_a_persona_id: activePersona.id,
                participant_b_persona_id: targetPersonaId,
                participant_low_persona_id: lowId,
                participant_high_persona_id: highId,
                created_by_persona_id: activePersona.id,
                current_mode: "agent",
                status: "active",
                last_message_preview: "他们正在替你试聊",
                last_message_at: now,
                last_sender_persona_id: activePersona.id,
              })
              .select("id")
              .maybeSingle();
            if (insertConversationErr && !shouldSilenceSupabaseError(insertConversationErr, "conversations")) {
              throw insertConversationErr;
            }
            if (insertedConversation?.id) {
              await ensureAutoPrelude(String(insertedConversation.id));
              navigate(`/chat/${insertedConversation.id}`);
              return;
            }
          }
        }
      }
      const opened = await openLegacyChatWithTarget(name);
      if (opened) return;
      showHud("error", "创建对话失败：未能读取对话 id");
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : "开聊失败";
      showHud("error", `开聊失败：${msg}`);
    }
  };

  const filteredChats = useMemo(() => {
    const kw = chatKeyword.trim().toLowerCase();
    const isAgentManagedChat = (chat: any) => {
      const status = String(chat?.status || "").toLowerCase();
      return (
        status.includes("automation_running") ||
        status.includes("ai托管中")
      );
    };
    const statusFiltered = sceneFilter === "agent" ? chats.filter((c) => isAgentManagedChat(c)) : chats;
    if (!kw) return statusFiltered;
    return statusFiltered.filter((c) => {
      const name = String(c.target_desc || "").toLowerCase();
      const status = String(c.status || "").toLowerCase();
      const last = getChatLastMessage(String(c.history || "")).toLowerCase();
      return name.includes(kw) || status.includes(kw) || last.includes(kw);
    });
  }, [chats, chatKeyword, sceneFilter]);

  return (
    <div className="flex h-screen bg-[#131313] text-app-fg font-sans overflow-hidden">
      <ChangePasswordModal open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
      {openedCardId ? (
        <div
          className="fixed inset-0 z-[75] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeCardHome();
          }}
        >
          <div className="w-full max-w-[520px] max-h-[86vh] rounded-3xl border border-app-border/15 bg-app-elevated/95 text-app-fg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-center gap-3 p-4 border-b border-app-border/12">
              <div className="min-w-0 text-center">
                <div className="text-sm font-extrabold truncate">卡片主页</div>
              </div>
            </div>

            <div className="p-4 overflow-auto max-h-[calc(86vh-64px)]">
              {openedCardPersona ? (
                (() => {
                  const p = openedCardPersona;
                  const pid = String(p?.id ?? "").trim();
                  const localVisual = pid ? (personaVisualAssets[pid] || {}) : {};
                  const allow2d = canViewerSee2d(p);
                  const allow3d = canViewerSee3d(p);
                  const cover = allow2d
                    ? (p?.card_cover_url || p?.avatar_2d_url || localVisual.cover2dUrl || generatePersona2DCard(p || {}))
                    : "";
                  const coverSrc = typeof cover === "string" && /^https?:\/\//i.test(cover) ? toProxyUrl(cover) : cover;
                  const modelUrl = allow3d ? (p?.model_3d_url || localVisual.model3dUrl || null) : null;
                  const isOwner = String(p?.user_id || "") && String(session?.user?.id || "") === String(p.user_id);
                  const canUse3d = Boolean(modelUrl);
                  const publicShow2d = typeof (p as any)?.show_2d === "boolean" ? Boolean((p as any).show_2d) : true;
                  const publicShow3d = typeof (p as any)?.show_3d === "boolean" ? Boolean((p as any).show_3d) : true;
                  return (
                    <div className="space-y-4">
                      <div className="relative mx-auto w-full max-w-[360px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-[#1b1b1b] shadow-[0_18px_46px_rgba(0,0,0,0.55)]">
                        {canUse3d && openedCardView === "3d" ? (
                          renderModelViewer(String(modelUrl), "absolute inset-0 h-full w-full bg-black/15")
                        ) : (
                          cover ? (
                            <img src={coverSrc} className="absolute inset-0 h-full w-full object-cover object-[50%_12%]" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 flex items-center justify-center">
                              <div className="text-xs text-white/70 px-3 py-2 rounded-full bg-black/40 border border-white/10">
                                持有者未开放 2D/3D 展示
                              </div>
                            </div>
                          )
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
                        {allow2d || allow3d ? (
                          <div className="absolute top-3 right-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (!allow2d) return;
                                setOpenedCardView("2d");
                              }}
                              className={`text-[11px] px-2 py-1 rounded-full border ${
                                openedCardView === "2d"
                                  ? "bg-black/70 border-white/25 text-white"
                                  : "bg-black/40 border-white/15 text-white/80 hover:bg-white/10"
                              }`}
                            >
                              {allow2d ? "2D" : "2D 未开放"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!canUse3d) return;
                                setOpenedCardView("3d");
                                void import("@google/model-viewer");
                              }}
                              className={`text-[11px] px-2 py-1 rounded-full border ${
                                openedCardView === "3d"
                                  ? "bg-cyan-500/20 border-cyan-300/35 text-cyan-100"
                                  : "bg-black/40 border-white/15 text-white/80 hover:bg-cyan-500/15 hover:border-cyan-300/30 hover:text-cyan-100"
                              }`}
                            >
                              {allow3d ? (canUse3d ? "3D" : "3D 未生成") : "3D 未开放"}
                            </button>
                          </div>
                        ) : null}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="text-white font-extrabold text-xl truncate">{p?.name || "未命名角色"}</div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="text-[11px] px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/85">
                              {p?.mbti || "未知类型"}
                            </div>
                            {isOwner ? (
                              <div className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-300/20">
                                我的化身
                              </div>
                            ) : null}
                          </div>
                          <div className="text-sm text-gray-200 mt-2 line-clamp-2">
                            {p?.vibe || p?.logic || "神秘的数字人格"}
                          </div>
                        </div>
                      </div>

                      {isOwner ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-sm font-bold text-app-fg">对外展示</div>
                          <div className="text-xs text-app-muted mt-1">默认全开放。关闭后，其他账号将看不到对应内容。</div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                const next = !publicShow2d;
                                const prev = publicShow2d;
                                setOpenedCardPersona((cur: any) => (cur ? { ...cur, show_2d: next } : cur));
                                setPersonas((cur: any[]) =>
                                  Array.isArray(cur) ? cur.map((x) => (String(x?.id) === String(p?.id) ? { ...x, show_2d: next } : x)) : cur,
                                );
                                try {
                                  const { error } = await supabase.from("personas").update({ show_2d: next }).eq("id", p.id);
                                  if (error) throw error;
                                  showHud("success", next ? "已开放 2D 展示" : "已关闭 2D 展示");
                                } catch (e: any) {
                                  setOpenedCardPersona((cur: any) => (cur ? { ...cur, show_2d: prev } : cur));
                                  setPersonas((cur: any[]) =>
                                    Array.isArray(cur) ? cur.map((x) => (String(x?.id) === String(p?.id) ? { ...x, show_2d: prev } : x)) : cur,
                                  );
                                  showHud("error", `保存失败：${e?.message ? String(e.message) : "请检查数据库字段与权限"}`);
                                }
                              }}
                              className={`rounded-xl px-3 py-2 text-sm font-bold border ${
                                publicShow2d ? "bg-white text-black border-white/10 hover:bg-gray-200" : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                              }`}
                            >
                              {publicShow2d ? "2D：开放" : "2D：关闭"}
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const next = !publicShow3d;
                                const prev = publicShow3d;
                                setOpenedCardPersona((cur: any) => (cur ? { ...cur, show_3d: next } : cur));
                                setPersonas((cur: any[]) =>
                                  Array.isArray(cur) ? cur.map((x) => (String(x?.id) === String(p?.id) ? { ...x, show_3d: next } : x)) : cur,
                                );
                                try {
                                  const { error } = await supabase.from("personas").update({ show_3d: next }).eq("id", p.id);
                                  if (error) throw error;
                                  showHud("success", next ? "已开放 3D 展示" : "已关闭 3D 展示");
                                } catch (e: any) {
                                  setOpenedCardPersona((cur: any) => (cur ? { ...cur, show_3d: prev } : cur));
                                  setPersonas((cur: any[]) =>
                                    Array.isArray(cur) ? cur.map((x) => (String(x?.id) === String(p?.id) ? { ...x, show_3d: prev } : x)) : cur,
                                  );
                                  showHud("error", `保存失败：${e?.message ? String(e.message) : "请检查数据库字段与权限"}`);
                                }
                              }}
                              className={`rounded-xl px-3 py-2 text-sm font-bold border ${
                                publicShow3d ? "bg-white text-black border-white/10 hover:bg-gray-200" : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                              }`}
                            >
                              {publicShow3d ? "3D：开放" : "3D：关闭"}
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {!isOwner ? (
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!activePersona) {
                                showHud("info", "请先创建并选择一个活跃人格。");
                                setActiveRealm("social");
                                setActiveTab("mycards");
                                closeCardHome();
                                return;
                              }
                              const name = String(p?.name || "").trim();
                              if (!name) return;
                              await startChatWithTarget(name, { targetPersona: p });
                              closeCardHome();
                            }}
                            className="w-full rounded-2xl bg-[#007AFF] hover:bg-[#0066d6] text-white py-3 font-bold transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)]"
                          >
                            和这个人格聊天
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              closeCardHome();
                              openIceComposer(p);
                            }}
                            className="w-full rounded-2xl bg-white/10 hover:bg-white/15 text-white py-3 font-bold border border-white/10 transition-colors"
                          >
                            联系卡片持有者
                          </button>
                          <div className="text-xs text-app-muted leading-relaxed">
                            “联系卡片持有者”会发送一张破冰卡，对方同意后再开启对话。
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveRealm("social");
                              setActiveTab("mycards");
                              setActivePersonaAndPersist(p);
                              closeCardHome();
                            }}
                            className="w-full rounded-2xl bg-[#007AFF] hover:bg-[#0066d6] text-white py-3 font-bold transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)]"
                          >
                            设为活跃并进入卡片库
                          </button>
                          <button
                            type="button"
                            onClick={closeCardHome}
                            className="w-full rounded-2xl bg-white/10 hover:bg-white/15 text-white py-3 font-bold border border-white/10 transition-colors"
                          >
                            返回
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="rounded-2xl border border-app-border/12 bg-app-surface/15 px-4 py-10 text-center text-sm text-app-muted">
                  正在加载卡片信息...
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {firstPersonaOnboardingOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] rounded-2xl border border-app-border/15 bg-app-elevated/95 text-app-fg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-app-border/12">
              <div className="text-lg font-extrabold">先创建第一张人格卡片</div>
              <div className="text-sm text-app-muted mt-2 leading-relaxed">
                你还没有人格卡片。先创建一张“主角人格”，后续的发现、对话、时空副本等功能会自动以它为核心展开。
              </div>
            </div>
            <div className="p-5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const uid = String(session?.user?.id || "").trim();
                  if (uid) {
                    try {
                      localStorage.setItem(`onboarding-first-persona-dismissed:v1:${uid}`, "1");
                    } catch {}
                  }
                  setFirstPersonaOnboardingOpen(false);
                }}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-app-fg hover:bg-white/10"
              >
                稍后
              </button>
              <button
                onClick={() => {
                  setFirstPersonaOnboardingOpen(false);
                  setIsCreatingPersona(true);
                  setPersonaStep(0);
                  setPersonaAnswers([]);
                  setNewPersonaName("");
                  setNewPersonaNameDraft("");
                  setCurrentAnswer("");
                  setActiveRealm("social");
                  setActiveTab("mycards");
                }}
                className="px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] text-white font-semibold transition-colors"
              >
                立即创建
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 左侧边栏 Sidebar (Character.ai 风格) */}
      {isMobileUi && sidebarDrawerOpen ? (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          onClick={() => setSidebarDrawerOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <aside
        className={`bg-[#131313] flex flex-col overflow-y-auto ${
          isMobileUi
            ? `fixed inset-y-0 left-0 z-[100] w-[min(420px,92vw)] transition-transform duration-200 ${sidebarDrawerOpen ? "translate-x-0" : "-translate-x-full"}`
            : `shrink-0 transition-[width] duration-200 ${sidebarCollapsed ? "w-[76px]" : "w-[280px]"}`
        }`}
      >
        <div className={`flex flex-col gap-6 ${sidebarCollapsed ? "p-4" : "p-6"}`}>
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center px-0" : "justify-between px-2"} mb-2`}>
            <div className={`flex items-center ${sidebarCollapsed ? "justify-center gap-0" : "gap-3"}`}>
              <span className="text-2xl">🎭</span>
              {!sidebarCollapsed ? <span className="text-xl font-bold text-app-fg tracking-wide">嗨！嗑？</span> : null}
            </div>
            {isMobileUi ? (
              <button
                type="button"
                onClick={() => setSidebarDrawerOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-xl border border-white/10 bg-white/5 text-app-fg hover:bg-white/10"
                aria-label="关闭侧边栏"
                title="关闭"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            ) : sidebarCollapsed ? (
              <button
                type="button"
                onClick={() => setSidebarCollapsedAndPersist(false)}
                className="h-9 w-9 grid place-items-center rounded-xl border border-white/10 bg-white/5 text-app-fg hover:bg-white/10"
                aria-label="展开侧边栏"
                title="展开侧边栏"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/><path d="M21 12H15"/>
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSidebarCollapsedAndPersist(true)}
                className="h-9 w-9 grid place-items-center rounded-xl border border-white/10 bg-white/5 text-app-fg hover:bg-white/10"
                aria-label="收起侧边栏"
                title="收起侧边栏"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/>
                </svg>
              </button>
            )}
          </div>

          {/* 核心操作按钮 */}
          <button
            onClick={() => {
              if (isGuest && personas.length >= 1) {
                promptGuestRegister("新增更多卡片");
                return;
              }
              setIsCreatingPersona(true);
              setPersonaStep(0);
              setPersonaAnswers([]);
              setNewPersonaName("");
              setNewPersonaNameDraft("");
              setCurrentAnswer("");
              setActiveRealm("social");
              if (sidebarCollapsed) setSidebarCollapsedAndPersist(false);
              closeSidebarDrawer();
            }}
            className={
              sidebarCollapsed
                ? "w-full h-11 rounded-2xl bg-[#f4f4f5] hover:bg-white text-black shadow-sm transition-colors grid place-items-center"
                : "w-full bg-[#f4f4f5] hover:bg-white text-black py-3 px-4 rounded-full font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            }
            title={sidebarCollapsed ? "创建卡片" : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            {!sidebarCollapsed ? "创建卡片" : null}
          </button>

          {sidebarCollapsed ? (
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-indigo-500/25 bg-indigo-600 px-0 py-3 text-white shadow-[0_14px_30px_rgba(99,102,241,0.25)] flex items-center justify-center"
              title="当前活跃人格"
            >
              <div className="pointer-events-none absolute inset-0 opacity-80">
                <div className="absolute -top-8 -left-10 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
                <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-purple-500/25 blur-2xl"></div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 border border-white/20 relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative w-full overflow-hidden rounded-2xl border border-indigo-500/25 bg-indigo-600 px-4 py-3.5 text-white shadow-[0_14px_30px_rgba(99,102,241,0.25)]">
              <div className="pointer-events-none absolute inset-0 opacity-80">
                <div className="absolute -top-8 -left-10 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
                <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-purple-500/25 blur-2xl"></div>
              </div>
              <div className="relative flex flex-col gap-1">
                <div className="text-sm font-extrabold tracking-tight flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  当前活跃人格
                </div>
                <div className="text-[11px] text-white/85">你接下来的操作默认作用于这个人格</div>
                {personas.length > 0 ? (
                  <select
                    value={activePersona?.id != null ? String(activePersona.id) : ""}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      const p = personas.find((it) => String(it.id) === nextId) || null;
                      setActivePersonaAndPersist(p);
                      setIsCreatingPersona(false);
                      closeSidebarDrawer();
                    }}
                    className="mt-2 w-full bg-black/25 border border-white/20 text-white text-sm rounded-xl focus:ring-white/20 focus:border-white/30 block p-3 outline-none"
                  >
                    {personas.map((p) => {
                      const title = getPersonaTitle(p);
                      return (
                        <option key={p.id} value={String(p.id)}>
                          {p.name} ({p.mbti_type || p.mbti || "未定"}) {title}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <div className="mt-2 text-sm text-white/85 bg-black/20 p-3 rounded-xl border border-white/15">
                    暂无人格，请先创建。
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 导航菜单 */}
          <nav className="flex flex-col gap-2 mt-4">
            <button 
              onClick={() => {
                setActiveRealm("social");
                setActiveTab("search");
                setIsCreatingPersona(false);
                closeSidebarDrawer();
              }}
              title={sidebarCollapsed ? "发现" : undefined}
              className={`flex items-center ${sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"} py-3.5 rounded-xl transition-all font-medium border ${
                activeRealm === 'social' && activeTab === 'search' && !isCreatingPersona
                  ? 'bg-white/10 text-app-fg shadow-sm border-white/10'
                  : 'text-app-muted border-transparent hover:bg-white/5 hover:text-app-fg'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              {!sidebarCollapsed ? "发现" : null}
            </button>
            <button 
              onClick={() => {
                setActiveRealm('social');
                setActiveTab('mycards');
                setIsCreatingPersona(false);
                closeSidebarDrawer();
              }}
              title={sidebarCollapsed ? "我的卡片" : undefined}
              className={`flex items-center ${sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"} py-3.5 rounded-xl transition-all font-medium border ${
                activeRealm === 'social' && activeTab === 'mycards' && !isCreatingPersona
                  ? 'bg-white/10 text-app-fg shadow-sm border-white/10'
                  : 'text-app-muted border-transparent hover:bg-white/5 hover:text-app-fg'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10"/><path d="M7 12h6"/><path d="M7 16h8"/></svg>
              {!sidebarCollapsed ? "我的卡片" : null}
            </button>
            <button 
              onClick={() => {
                setActiveRealm('social');
                setActiveTab('chats');
                setIsCreatingPersona(false);
                closeSidebarDrawer();
              }}
              title={sidebarCollapsed ? "对话" : undefined}
              className={`flex items-center ${sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"} py-3.5 rounded-xl transition-all font-medium border ${
                activeRealm === 'social' && activeTab === 'chats' && !isCreatingPersona
                  ? 'bg-white/10 text-app-fg shadow-sm border-white/10'
                  : 'text-app-muted border-transparent hover:bg-white/5 hover:text-app-fg'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              {!sidebarCollapsed ? "对话" : null}
            </button>
            <button 
              onClick={() => {
                setActiveRealm('nexus');
                setIsCreatingPersona(false);
                closeSidebarDrawer();
              }}
              title={sidebarCollapsed ? "时空副本" : undefined}
              className={`flex items-center ${sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"} py-3.5 rounded-xl transition-all font-medium border ${
                activeRealm === 'nexus' && !isCreatingPersona
                  ? 'bg-white/10 text-app-fg shadow-sm border-white/10'
                  : 'text-app-muted border-transparent hover:bg-white/5 hover:text-app-fg'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              {!sidebarCollapsed ? "时空副本" : null}
            </button>
            <button
              onClick={() => {
                setSettingsOpen(true);
                closeSidebarDrawer();
              }}
              title={sidebarCollapsed ? "设置" : undefined}
              className={`flex items-center ${sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"} py-3.5 rounded-xl transition-all font-medium border ${
                settingsOpen ? "bg-white/10 text-app-fg shadow-sm border-white/10" : "text-app-muted border-transparent hover:bg-white/5 hover:text-app-fg"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {!sidebarCollapsed ? "设置" : null}
            </button>
            <button
              onClick={() => {
                if (isGuest) {
                  promptGuestRegister("意见反馈");
                  return;
                }
                onOpenFeedback({
                  source: "sidebar_nexus",
                  personaId: activePersona?.id,
                  personaName: activePersona?.name,
                });
                closeSidebarDrawer();
              }}
              title={sidebarCollapsed ? "意见反馈" : undefined}
              className={`flex items-center ${sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"} py-3.5 rounded-xl transition-all font-medium text-app-muted hover:bg-white/5 hover:text-app-fg`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 8h8"/><path d="M8 12h5"/></svg>
              {!sidebarCollapsed ? "意见反馈" : null}
            </button>
            {/* 商城功能暂时停用，后续需要时可直接取消注释恢复入口
            {ADMIN_UI ? (
              <button
                type="button"
                onClick={() => {
                  setIsTokenDialogOpen(true);
                  closeSidebarDrawer();
                }}
                title={sidebarCollapsed ? "商城" : undefined}
                className={`flex items-center ${sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"} py-3.5 rounded-xl transition-all font-medium text-app-muted hover:bg-white/5 hover:text-app-fg`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>商城</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      (billingBalance || 0) > 0
                        ? "bg-emerald-500/10 text-emerald-200 border-emerald-300/20"
                        : "bg-white/5 text-app-muted border-white/10"
                    }`}>
                      {billingBalanceLoading ? "..." : (billingBalance || 0) > 0 ? `${billingBalance} 点` : "0 点"}
                    </span>
                  </div>
                )}
              </button>
            ) : null}
            */}
            <div className="h-px bg-white/5 w-full my-4"></div>
            

          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <div>
              {sidebarCollapsed ? (
                <button
                  type="button"
                  onClick={() => setSidebarCollapsedAndPersist(false)}
                  className="w-full h-11 rounded-2xl bg-[#242424] border border-white/10 text-app-fg hover:bg-white/10 grid place-items-center"
                  title="展开侧边栏"
                  aria-label="展开侧边栏"
                >
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                    {(activePersona?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U").toUpperCase()}
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!activePersona) {
                      showHud("info", "请先创建并选择一个活跃人格。");
                      return;
                    }
                    setIceboxTab("inbox");
                    setIceboxOpen(true);
                    closeSidebarDrawer();
                  }}
                  className="w-full bg-[#242424] hover:bg-white/10 border border-white/5 text-app-fg text-sm rounded-xl px-3 py-3 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 8h8"/><path d="M8 12h5"/></svg>
                    蒸馏与关注
                  </span>
                  {iceboxUnreadCount > 0 ? (
                    <span className="text-xs px-2 py-1 rounded-full border bg-white/5 text-app-fg border-white/10 tabular-nums">
                      {iceboxUnreadCount > 99 ? "99+" : iceboxUnreadCount}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full border bg-white/5 text-app-muted border-white/10">
                      未读 0
                    </span>
                  )}
                </button>
              )}
            </div>

            

          </div>
        </div>
      </aside>

      

      {settingsOpen ? (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] max-h-[82vh] rounded-3xl border border-app-border/15 bg-app-elevated/95 text-app-fg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between gap-3 p-4 border-b border-app-border/12">
              <div className="min-w-0">
                <div className="text-lg font-extrabold truncate">设置</div>
                <div className="text-xs text-app-muted mt-1 truncate">
                  {isGuest ? "当前身份：游客" : session?.user?.email ? `当前账号：${String(session.user.email)}` : "未登录"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="h-10 w-10 grid place-items-center rounded-full border border-app-border/12 bg-app-surface/20 hover:bg-app-surface/30 text-app-fg"
                aria-label="关闭"
                title="关闭"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-auto max-h-[calc(82vh-72px)]">
              <div className="rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                <div className="text-sm font-bold text-app-fg">显示与体验</div>
                <div className="mt-3">
                  <div className="text-xs text-app-muted mb-1">主题</div>
                  <select
                    value={pluginTheme}
                    onChange={(e) => setPluginTheme(e.target.value as PluginTheme)}
                    className="w-full bg-app-bg/30 border border-app-border/12 rounded-2xl px-4 py-2.5 text-sm text-app-fg outline-none focus:ring-2 focus:ring-white/15"
                  >
                    <option value="system">System（跟随系统）</option>
                    <option value="paper">Paper（浅色、阅读友好）</option>
                    <option value="midnight">Midnight（深蓝夜幕、科幻但耐看）</option>
                    <option value="dark">Dark（纯暗黑、对比更强）</option>
                  </select>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-app-muted mb-1">界面模式</div>
                  <select
                    value={uiMode}
                    onChange={(e) => setUiMode(e.target.value as any)}
                    className="w-full bg-app-bg/30 border border-app-border/12 rounded-2xl px-4 py-2.5 text-sm text-app-fg outline-none focus:ring-2 focus:ring-white/15"
                  >
                    <option value="auto">自动（跟随屏幕尺寸）</option>
                    <option value="mobile">手机界面（强制）</option>
                    <option value="desktop">电脑界面（强制）</option>
                  </select>
                  <div className="mt-1 text-[11px] text-app-muted">
                    手机界面会隐藏横幅类布局，并使用抽屉侧边栏等移动端交互。
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-app-muted mb-2">卡片大小</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {([
                      { key: "sm", label: "小" },
                      { key: "md", label: "中" },
                      { key: "lg", label: "大" },
                    ] as const).map((it) => (
                      <button
                        key={it.key}
                        type="button"
                        onClick={() => {
                          const nextMin = it.key === "sm" ? 210 : it.key === "lg" ? 310 : 255;
                          setPersonaCardSize(it.key);
                          setPersonaCardMinWidth(nextMin);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          personaCardSize === it.key
                            ? "bg-white/15 text-app-fg border-white/20"
                            : "bg-[#242424] text-app-muted border-white/10 hover:bg-white/10 hover:text-app-fg"
                        }`}
                      >
                        {it.label}
                      </button>
                    ))}
                    <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                      <span className="text-xs text-app-muted tabular-nums w-[64px] text-right">
                        {personaCardMinWidth}px
                      </span>
                      <input
                        type="range"
                        min={200}
                        max={340}
                        step={10}
                        value={personaCardMinWidth}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          setPersonaCardMinWidth(next);
                          setPersonaCardSize(next <= 225 ? "sm" : next >= 295 ? "lg" : "md");
                        }}
                        className="flex-1 accent-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                <div className="text-sm font-bold text-app-fg">功能与扩展</div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isGuest) {
                        promptGuestRegister("AI 助手面板");
                        return;
                      }
                      setIsAiPanelOpen(true);
                      setSettingsOpen(false);
                    }}
                    className="rounded-2xl bg-white/10 hover:bg-white/15 border border-app-border/12 px-4 py-3 text-left flex items-center gap-3"
                  >
                    <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 9h.01"/><path d="M17 9h.01"/><path d="M12 16c2.5 0 4-1.5 4-1.5M8 14.5s1.5 1.5 4 1.5"/></svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-app-fg">AI 助手面板</div>
                      <div className="text-xs text-app-muted mt-0.5">唤起悬浮面板，进行AI对话与创作支持。</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                <div className="text-sm font-bold text-app-fg">账号与安全</div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="rounded-2xl bg-app-bg/25 border border-app-border/12 px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                        {(isGuest ? "游" : (session?.user?.email?.charAt(0) || "U")).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-app-fg truncate">
                          {isGuest ? "游客模式" : (session?.user?.email?.split("@")[0] || "用户")}
                        </div>
                        <div className="text-xs text-app-muted truncate">
                          {isGuest ? "当前仅可创建 1 张本地卡片" : (session?.user?.email || "")}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSettingsOpen(false);
                        void handleLogout();
                      }}
                      className="text-app-muted hover:text-app-fg p-1 transition-colors"
                      title={isGuest ? "退出游客模式" : "退出登录"}
                      aria-label={isGuest ? "退出游客模式" : "退出登录"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                      </svg>
                    </button>
                  </div>


                  <button
                    type="button"
                    onClick={() => {
                      if (isGuest) {
                        setGuestUpgradeDialogOpen(true);
                        setSettingsOpen(false);
                        return;
                      }
                      setIsChangePasswordOpen(true);
                      setSettingsOpen(false);
                    }}
                    className="rounded-2xl bg-white/10 hover:bg-white/15 border border-app-border/12 px-4 py-3 text-left"
                  >
                    <div className="text-sm font-bold text-app-fg">{isGuest ? "一键注册" : "修改密码"}</div>
                    <div className="text-xs text-app-muted mt-1">{isGuest ? "只填邮箱即可转为正式账号，并保留当前游客卡片。" : "更新账号安全信息。"}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 主内容区 Main Content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto relative p-4 md:p-8">
        <div className="w-full">
          
          {/* Header 区域 */}
          {!isCreatingPersona && (
            <div className="flex flex-row items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  className="md:hidden h-10 w-10 grid place-items-center rounded-xl border border-white/10 bg-white/5 text-app-fg hover:bg-white/10 shrink-0"
                  aria-label="打开导航"
                  title="导航"
                  onClick={() => {
                    if (sidebarCollapsed) setSidebarCollapsedAndPersist(false);
                    setSidebarDrawerOpen(true);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-app-fg truncate">
                  欢迎，{activePersona ? activePersona.name : (isGuest ? "游客探索者" : (session?.user?.email?.split('@')[0] || '探索者'))}
                </h1>
              </div>
              {activeTab === 'echoes' && (
                <button
                  onClick={() => {
                    setActiveRealm('social');
                    setActiveTab('search');
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-app-fg transition-colors"
                  title="退回到发现页面"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              )}
            </div>
          )}

          {isCreatingPersona ? (
            <div className="animate-in fade-in duration-300 max-w-2xl mx-auto mt-10">
              <h2 className="text-3xl font-bold text-app-fg mb-8 text-center">🆕 创建新的人格卡片</h2>
              
              {!newPersonaName ? (
                <div className="bg-[#242424] p-8 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-6">
                  <label className="font-medium text-app-fg text-lg">给这张人格卡片起个名字</label>
                  <input 
                    type="text" 
                    placeholder="例如: 嘴毒心软的黑客"
                    className="p-4 bg-[#131313] text-app-fg border border-white/10 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 outline-none text-lg transition-all placeholder-app-muted"
                    value={newPersonaNameDraft}
                    onChange={(e) => setNewPersonaNameDraft(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextName = String(newPersonaNameDraft || "").trim();
                      if (!nextName) {
                        alert("请先输入名字");
                        return;
                      }
                      setNewPersonaName(nextName);
                    }}
                    className="self-end bg-white hover:bg-gray-200 text-black py-3 px-8 rounded-full font-bold transition-colors"
                  >
                    确认
                  </button>
                  <p className="text-sm text-app-muted text-center">输入名字后点击确认继续</p>
                </div>
              ) : personaStep < QUESTIONS.length ? (
                <div className="bg-[#242424] p-8 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-6">
                  <div className="bg-blue-900/20 text-blue-300 p-4 rounded-xl text-sm font-medium border border-blue-500/20 flex justify-between items-center">
                    <span>正在构建「{newPersonaName}」的灵魂画像</span>
                    <span className="bg-blue-900/40 px-2 py-1 rounded text-xs">({personaStep + 1}/{QUESTIONS.length})</span>
                  </div>
                  <p className="font-bold text-app-fg text-xl mt-4 leading-relaxed">{QUESTIONS[personaStep]}</p>
                  
                  <textarea 
                    rows={5}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="在这里输入你的回答..."
                    className="p-4 bg-[#131313] text-app-fg border border-white/10 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 resize-none outline-none text-lg transition-all placeholder-app-muted mt-2"
                  ></textarea>
                  
                  <button 
                    onClick={() => {
                      if (!currentAnswer.trim()) {
                        alert("请填写回答");
                        return;
                      }
                      setPersonaAnswers([...personaAnswers, { q: QUESTIONS[personaStep], a: currentAnswer }]);
                      setPersonaStep(personaStep + 1);
                      setCurrentAnswer("");
                    }}
                    className="self-end bg-white hover:bg-gray-200 text-black py-3 px-8 rounded-full font-bold transition-colors mt-4"
                  >
                    提交回答
                  </button>
                </div>
              ) : (
                <div className="bg-[#242424] p-10 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-8 items-center py-16">
                  <div className="text-6xl animate-bounce">✨</div>
                  <h3 className="text-2xl font-bold text-app-fg">所有问题回答完毕！</h3>
                  <p className="text-app-muted text-center max-w-md leading-relaxed text-lg">
                    系统将通过大模型分析你的回答，提取 MBTI、内核状态、说话风格和底层逻辑，生成你的专属数字孪生档案。
                  </p>
                  
                  <button 
                    onClick={async () => {
                      setIsExtracting(true);
                      try {
                        let extracted: any = null;
                        try {
                          const res = await fetch(`${API_BASE_URL}/api/extract-soul-logic`, {
                            method: "POST",
                            headers: withPluginTokenHeaders({ "Content-Type": "application/json" }),
                            body: JSON.stringify({ answers: personaAnswers })
                          });
                          if (!res.ok) throw new Error("提取失败");
                          extracted = await res.json();
                        } catch (extractErr: any) {
                          if (!isGuest) throw extractErr;
                          const mergedAnswers = personaAnswers.map((x) => String(x?.a || "").trim()).filter(Boolean).join("；");
                          extracted = {
                            mbti: "",
                            vibe: mergedAnswers.slice(0, 24) || "自由探索型",
                            speech_style: "自然真诚，带有个人表达",
                            logic: mergedAnswers.slice(0, 120) || "当前为游客模式基础卡片，可注册后使用完整 AI 侧写。",
                            quote: personaAnswers.find((x) => String(x?.a || "").trim())?.a?.slice(0, 32) || "先从一张卡片开始认识自己。",
                          };
                          showHud("info", "侧写服务暂不可用，已为你生成游客基础卡片。");
                        }

                        const ansGenderRaw = personaAnswers.find((x) => String(x?.q || "").includes("性别认同"))?.a;
                        const ansSeekingRaw = personaAnswers.find((x) => String(x?.q || "").includes("取向判定"))?.a;
                        const gender = normalizeGenderValue(ansGenderRaw);
                        const seekingGender = normalizeSeekingGenderValue(ansSeekingRaw);
                        
                        const newPersona = {
                          user_id: session.user.id,
                          name: newPersonaName,
                          mbti: extracted.mbti,
                          vibe: extracted.vibe,
                          speech_style: extracted.speech_style,
                          logic: extracted.logic,
                          quote: extracted.quote,
                          ...(gender !== "unknown" ? { gender } : {}),
                          ...(seekingGender !== "unknown" ? { seeking_gender: seekingGender } : {}),
                        };
                        
                        let data: any = null;
                        let error: any = null;
                        if (isGuest) {
                          data = {
                            ...newPersona,
                            id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                            created_at: new Date().toISOString(),
                          };
                        } else {
                          const first = await supabase.from("personas").insert(newPersona as any).select().single();
                          data = first.data;
                          error = first.error;
                          if (error) {
                            const msg = String((error as any)?.message || "");
                            if (msg.toLowerCase().includes("column") && msg.toLowerCase().includes("does not exist")) {
                              const fallbackPersona = {
                                user_id: session.user.id,
                                name: newPersonaName,
                                mbti: extracted.mbti,
                                vibe: extracted.vibe,
                                speech_style: extracted.speech_style,
                                logic: extracted.logic,
                                quote: extracted.quote,
                              };
                              const second = await supabase.from("personas").insert(fallbackPersona as any).select().single();
                              data = second.data;
                              error = second.error;
                            }
                          }
                          if (error) throw error;
                        }

                        try {
                          const pid = String((data as any)?.id || "").trim();
                          if (pid) {
                            const prev = readPersonaDemographics() as any;
                            const next = { ...(prev || {}) };
                            next[pid] = {
                              ...(next[pid] || {}),
                              ...(gender !== "unknown" ? { gender } : {}),
                              ...(seekingGender !== "unknown" ? { seeking_gender: seekingGender } : {}),
                            };
                            writePersonaDemographics(next);
                          }
                        } catch {}
                        
                        setPersonas((prev) => {
                          const list = Array.isArray(prev) ? prev : [];
                          const seen = new Set<string>();
                          const next = [data, ...list].filter((p) => {
                            const id = String((p as any)?.id || "");
                            if (!id) return false;
                            if (seen.has(id)) return false;
                            seen.add(id);
                            return true;
                          });
                          return next;
                        });
                        setActivePersonaAndPersist(data);
                        setIsCreatingPersona(false);
                        if (isGuest) {
                          showHud("success", "游客卡片已创建成功。注册后可继续使用动态、对话、蒸馏与 3D 功能。");
                        }
                        try {
                          const uid = String(session?.user?.id || "").trim();
                          if (uid) localStorage.setItem(`onboarding-first-persona-dismissed:v1:${uid}`, "1");
                        } catch {}
                        
                      } catch (err: any) {
                        alert("创建出错: " + err.message);
                      } finally {
                        setIsExtracting(false);
                      }
                    }}
                    disabled={isExtracting}
                    className="bg-white hover:bg-gray-200 text-black py-4 px-10 rounded-full font-bold shadow-lg transition-all flex items-center gap-3 disabled:opacity-50 text-lg mt-4"
                  >
                    {isExtracting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        人格侧写中...
                      </span>
                    ) : (
                      isGuest ? "🚀 生成游客卡片" : "🚀 生成数字孪生并入库"
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* 这里不再显示 banner，因为我们在左侧已经展示了 activePersona */}
              
              {false ? (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="rounded-3xl border border-[#007AFF]/20 bg-[linear-gradient(135deg,rgba(0,122,255,0.12),rgba(255,255,255,0.03))] p-5 md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-xl font-bold text-app-fg">游客模式</div>
                        <div className="mt-2 text-sm leading-6 text-app-muted">
                          你现在可以先创建 1 张本地人格卡片试玩；动态、对话、蒸馏、3D、商城等完整能力需注册后开启。
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGuestUpgradeDialogOpen(true)}
                        className="rounded-full bg-[#007AFF] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,122,255,0.22)] hover:bg-[#0066d6] transition-colors"
                      >
                        立即注册
                      </button>
                    </div>
                  </div>

                  {personas.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-[#171717] p-8 text-center">
                      <div className="text-2xl font-bold text-app-fg">先创建你的第一张人格卡片</div>
                      <div className="mt-3 text-sm leading-6 text-app-muted">
                        创建完成后可在这里查看游客卡片预览；如需继续聊天、发动态或蒸馏养成，请先注册。
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingPersona(true);
                          setPersonaStep(0);
                          setPersonaAnswers([]);
                          setNewPersonaName("");
                          setNewPersonaNameDraft("");
                          setCurrentAnswer("");
                        }}
                        className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-black hover:bg-gray-200 transition-colors"
                      >
                        创建卡片
                      </button>
                    </div>
                  ) : activePersona ? (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
                      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#171717]">
                        <div className="relative aspect-[4/5] overflow-hidden bg-[#101010]">
                          <img
                            src={toProxyUrl(
                              activePersona.card_cover_url ||
                                activePersona.avatar_2d_url ||
                                (personaVisualAssets[String(activePersona.id)] || {}).cover2dUrl ||
                                generatePersona2DCard(activePersona),
                            )}
                            alt={String(activePersona.name || "游客人格卡片")}
                            className="h-full w-full object-cover object-[50%_12%]"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5">
                            <div className="text-3xl font-extrabold text-white">{activePersona.name || "未命名人格"}</div>
                            <div className="mt-2 inline-flex rounded-full border border-white/15 bg-black/30 px-3 py-1 text-sm text-white/90">
                              {activePersona.mbti || activePersona.mbti_type || "未定型"}
                            </div>
                            <div className="mt-3 text-sm leading-6 text-white/80">
                              {activePersona.quote || activePersona.vibe || activePersona.logic || "你的游客人格卡片已生成，可先预览形象与基础设定。"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-3xl border border-white/10 bg-[#171717] p-5">
                          <div className="text-lg font-bold text-app-fg">游客卡片信息</div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-white/5 px-4 py-3">
                              <div className="text-xs text-app-muted">MBTI</div>
                              <div className="mt-1 text-sm font-semibold text-app-fg">{activePersona.mbti || "未生成"}</div>
                            </div>
                            <div className="rounded-2xl bg-white/5 px-4 py-3">
                              <div className="text-xs text-app-muted">气质</div>
                              <div className="mt-1 text-sm font-semibold text-app-fg">{activePersona.vibe || "待补充"}</div>
                            </div>
                            <div className="rounded-2xl bg-white/5 px-4 py-3 sm:col-span-2">
                              <div className="text-xs text-app-muted">说话风格</div>
                              <div className="mt-1 text-sm font-semibold text-app-fg">{activePersona.speech_style || "待补充"}</div>
                            </div>
                            <div className="rounded-2xl bg-white/5 px-4 py-3 sm:col-span-2">
                              <div className="text-xs text-app-muted">底层逻辑</div>
                              <div className="mt-1 text-sm leading-6 text-app-fg">{activePersona.logic || "待补充"}</div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
                          <div className="text-sm font-bold text-app-fg">注册后可继续使用</div>
                          <div className="mt-2 text-sm leading-6 text-app-muted">
                            动态发现、开聊互动、蒸馏养成、3D 展示、商城充值、云端同步都会在注册后开启。
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => setGuestUpgradeDialogOpen(true)}
                              className="rounded-full bg-[#007AFF] px-5 py-3 text-sm font-bold text-white hover:bg-[#0066d6] transition-colors"
                            >
                              去注册解锁完整功能
                            </button>
                            <button
                              type="button"
                              onClick={() => promptGuestRegister("更多玩法")}
                              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-app-fg hover:bg-white/10 transition-colors"
                            >
                              查看限制说明
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : activeRealm === 'social' ? (
                <>
                  {/* Tab Content */}
                  <div className="py-2">
                    {loadingTab ? (
                      <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-fg"></div>
                      </div>
                    ) : (
                      <>
                        {activeTab === 'mycards' && (
                          <div className="animate-in fade-in duration-300 space-y-6">
                            <div>
                              <h3 className="text-xl font-bold text-app-fg">我的卡片</h3>
                              <p className="text-sm text-app-muted mt-1">管理你的 2D 海报与 3D 化身，并设置为当前活跃人格。</p>
                            </div>

                            {activePersona && !isMobileUi ? (
                              <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#1b1b1b]">
                                {(() => {
                                  const localVisual = personaVisualAssets[String(activePersona.id)] || {};
                                  const cover =
                                    activePersona.card_cover_url ||
                                    activePersona.avatar_2d_url ||
                                    localVisual.cover2dUrl ||
                                    generatePersona2DCard(activePersona);
                                  const portrait =
                                    activePersona.avatar_2d_url ||
                                    localVisual.avatar2dUrl ||
                                    cover;
                                  const banner =
                                    activePersona.banner_cover_url ||
                                    localVisual.banner2dUrl ||
                                    cover;
                                  return (
                                    <div className="relative">
                                      <div className="relative">
                                          <div className="relative h-[220px] sm:h-[260px] lg:h-[300px]">
                                            <div
                                              className="absolute inset-0 bg-cover bg-center"
                                              style={{
                                                backgroundImage: `url(${banner})`,
                                                backgroundPosition: "center 22%",
                                                filter: banner === cover ? "blur(14px)" : undefined,
                                                transform: banner === cover ? "scale(1.12)" : undefined,
                                              }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
                                            <div
                                              className="absolute right-0 top-0 h-full w-[40%] sm:w-[44%] bg-cover"
                                              style={{
                                                backgroundImage: `url(${portrait})`,
                                                backgroundPosition: "70% 16%",
                                                filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.65))",
                                                maskImage: "linear-gradient(to left, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
                                                WebkitMaskImage:
                                                  "linear-gradient(to left, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
                                              }}
                                            />

                                            <div className="absolute inset-y-0 left-0 p-6 flex flex-col justify-end max-w-[72%]">
                                              <div className="flex items-center gap-3">
                                                <div className="text-white font-extrabold text-2xl truncate">{activePersona.name}</div>
                                                <div className="text-xs bg-white/10 text-gray-200 px-2 py-1 rounded-full border border-white/10">
                                                  {activePersona.mbti || "未知类型"}
                                                </div>
                                              </div>
                                              <div className="text-sm text-gray-300 mt-2 line-clamp-2">
                                                {activePersona.vibe || activePersona.logic || "神秘的数字人格"}
                                              </div>
                                            </div>
                                          </div>

                                      </div>

                                    </div>
                                  );
                                })()}
                              </div>
                            ) : null}

                            {personas.length > 0 ? (
                              <div
                                className={isMobileUi ? "flex flex-col min-w-0" : "grid gap-4 min-w-0"}
                                onPointerDown={(e) => {
                                  if (!isMobileUi) return;
                                  handleMycardsPointerStart(e.clientY);
                                }}
                                onPointerUp={(e) => {
                                  if (!isMobileUi) return;
                                  handleMycardsPointerEnd(e.clientY);
                                }}
                                onPointerCancel={() => {
                                  mycardsDragStartYRef.current = null;
                                }}
                                style={
                                  isMobileUi
                                    ? { perspective: "1000px", touchAction: "pan-y" }
                                    : { gridTemplateColumns: `repeat(auto-fill, minmax(${personaCardMinWidth}px, 1fr))` }
                                }
                              >
                                {personas.map((p, idx) => {
                                  const localVisual = personaVisualAssets[String(p.id)] || {};
                                  const cover = p.card_cover_url || p.avatar_2d_url || localVisual.cover2dUrl || generatePersona2DCard(p);
                                  const modelUrl = p.model_3d_url || localVisual.model3dUrl || null;
                                  const cardView = personaCardViewById[String(p.id)] || "2d";
                                  const isActive = String(activePersona?.id || "") === String(p.id || "");
                                  const followCount = followCountByPersonaId[String(p.id)] || 0;
                                  const pid = String(p.id || "");
                                  const actionOpen = pid && mycardsActionPersonaId === pid;
                                  const isFocused = pid && mycardsFocusedPersonaId === pid;
                                  return (
                                    <div
                                      key={p.id}
                                      className="group transition-all duration-300 ease-out"
                                      style={
                                        isMobileUi
                                          ? ({
                                              marginTop: idx === 0 ? 0 : mycardsExpanded ? 18 : -160,
                                              zIndex: isFocused ? personas.length + 20 : idx + 1,
                                              transform: "rotateX(-15deg)",
                                              transformOrigin: "bottom center",
                                            } as any)
                                          : undefined
                                      }
                                    >
                                      <div
                                        onClick={() => {
                                          if (!isMobileUi) return;
                                          setMycardsActionPersonaId("");
                                          if (isActive) {
                                            setMycardsFocusedPersonaId(pid);
                                            return;
                                          }
                                          if (isFocused) {
                                            setActivePersonaAndPersist(p);
                                            return;
                                          }
                                          setMycardsFocusedPersonaId(pid);
                                        }}
                                        className={`relative aspect-[16/9] rounded-2xl overflow-hidden border bg-[#1b1b1b] shadow-[0_18px_46px_rgba(0,0,0,0.55)] transition-all duration-300 ${
                                          isFocused
                                            ? "border-cyan-300/55 ring-2 ring-cyan-300/20 shadow-[0_26px_56px_rgba(0,0,0,0.7)]"
                                            : "border-white/10 hover:border-white/20"
                                        }`}
                                        style={
                                          isMobileUi && isFocused
                                            ? ({ transform: "translateY(-18px)" } as any)
                                            : undefined
                                        }
                                      >
                                        {modelUrl && cardView === "3d" ? (
                                          renderModelViewer(modelUrl, "absolute inset-0 h-full w-full bg-black/20")
                                        ) : (
                                          <div className="absolute inset-0 bg-cover bg-[center_20%]" style={{ backgroundImage: `url(${cover})` }} />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                                        {isFocused && !isActive ? (
                                          <div className="absolute inset-0 bg-cyan-400/8 pointer-events-none" />
                                        ) : null}
                                        <div className="absolute top-3 left-3 flex items-center gap-2">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPersonaCardViewById((prev) => ({ ...prev, [String(p.id)]: "2d" }));
                                            }}
                                            className={`text-[10px] px-2 py-1 rounded-full border ${
                                              cardView === "2d" ? "bg-black/70 border-white/25 text-white" : "bg-black/40 border-white/15 text-white/80"
                                            }`}
                                          >
                                            2D
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (!modelUrl) return;
                                              setPersonaCardViewById((prev) => ({ ...prev, [String(p.id)]: "3d" }));
                                              void import("@google/model-viewer");
                                            }}
                                            className={`text-[10px] px-2 py-1 rounded-full border ${
                                              modelUrl
                                                ? cardView === "3d"
                                                  ? "bg-cyan-500/20 border-cyan-300/35 text-cyan-100"
                                                  : "bg-black/40 border-white/15 text-white/80 hover:bg-cyan-500/15 hover:border-cyan-300/30 hover:text-cyan-100"
                                                : "bg-black/40 border-white/15 text-gray-400 cursor-not-allowed"
                                            }`}
                                          >
                                            3D
                                          </button>
                                        </div>
                                        <div className="absolute top-3 right-3 flex items-center gap-1.5 sm:gap-2">
                                          <div className="shrink-0 whitespace-nowrap leading-none text-[10px] px-2 py-1 rounded-full border bg-black/60 text-white border-white/15">
                                            关注 {followCount}
                                          </div>
                                          {isActive ? (
                                            <div className="shrink-0 whitespace-nowrap leading-none text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-300 text-[#221306] border border-amber-100 shadow-[0_0_18px_rgba(252,211,77,0.35)]">
                                              {isMobileUi ? "活跃中" : "当前活跃"}
                                            </div>
                                          ) : (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isFocused) {
                                                  setMycardsFocusedPersonaId(pid);
                                                  return;
                                                }
                                                setActivePersonaAndPersist(p);
                                              }}
                                              className={`text-[10px] px-2 py-1 rounded-full border font-semibold transition-colors ${
                                                isFocused
                                                  ? "bg-cyan-300 text-[#04131e] border-cyan-200"
                                                  : "bg-white text-black hover:bg-gray-200 border-white/10"
                                              }`}
                                            >
                                              {isFocused ? "确认活跃" : "预选卡片"}
                                            </button>
                                          )}
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3">
                                          <div className="text-white font-extrabold text-[15px] truncate">
                                            {p.name} <span className="text-xs font-normal opacity-80">{getPersonaTitle(p)}</span>
                                          </div>
                                          <div className="mt-1 text-[11px] text-white/75 truncate">
                                            {(p.mbti || "未知类型") + " · " + (p.vibe || p.logic || "神秘的数字人格")}
                                          </div>
                                          {!isActive && isFocused ? (
                                            <div className="mt-2 inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-400/12 px-2 py-1 text-[10px] font-semibold text-cyan-100">
                                              再点一次卡片即可切换
                                            </div>
                                          ) : null}
                                        </div>

                                        {actionOpen ? (
                                          <button
                                            type="button"
                                            className="fixed inset-0 z-[120] bg-transparent"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setMycardsActionPersonaId("");
                                            }}
                                            aria-label="关闭功能菜单"
                                          />
                                        ) : null}

                                        <div className="absolute bottom-3 right-3 z-[121] flex flex-col items-end gap-1.5">
                                          {actionOpen ? (
                                            <div className="absolute bottom-full mb-2 right-0 w-[180px] rounded-2xl border border-white/12 bg-[#0f0f10]/95 backdrop-blur-md shadow-2xl overflow-hidden">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setMycardsActionPersonaId("");
                                                  openAiForPersona(p, "portrait2d");
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                              >
                                                生成 2D 头像
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setMycardsActionPersonaId("");
                                                  openAiForPersona(p, "companion");
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                              >
                                                生成 3D
                                              </button>
                                              <div className="h-px bg-white/10" />
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setMycardsActionPersonaId("");
                                                  openUrlDialog(p, "cover2d");
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                              >
                                                替换 2D
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setMycardsActionPersonaId("");
                                                  openUrlDialog(p, "model3d");
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                              >
                                                替换 3D
                                              </button>
                                              <div className="h-px bg-white/10" />
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  void deletePersonaCard(p);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10 transition-colors"
                                              >
                                                删除卡片
                                              </button>
                                            </div>
                                          ) : null}

                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (!pid) return;
                                              setMycardsActionPersonaId((cur) => (cur === pid ? "" : pid));
                                            }}
                                            className="h-10 px-3 rounded-full inline-flex items-center gap-1.5 border border-white/15 bg-[#007AFF] text-white shadow-[0_16px_34px_rgba(0,122,255,0.35)] hover:bg-[#0066d6] transition-colors"
                                            aria-label="生成2D头像与更多操作"
                                            title="生成2D头像与更多操作"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M12 3v4" />
                                              <path d="M12 17v4" />
                                              <path d="M3 12h4" />
                                              <path d="M17 12h4" />
                                              <path d="m5.6 5.6 2.8 2.8" />
                                              <path d="m15.6 15.6 2.8 2.8" />
                                              <path d="m18.4 5.6-2.8 2.8" />
                                              <path d="m8.4 15.6-2.8 2.8" />
                                            </svg>
                                            <span className="text-[11px] font-semibold leading-none whitespace-nowrap">生成2D</span>
                                          </button>
                                          <div className="rounded-full bg-black/45 px-2 py-1 text-[10px] leading-none text-white/90 backdrop-blur-sm">
                                            一键生成 2D 形象
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-app-muted italic bg-[#242424] p-8 rounded-2xl text-center">
                                你还没有人格卡片。点击左侧「创建卡片」生成第一张卡片。
                              </div>
                            )}
                          </div>
                        )}
                        {activeTab === 'search' && (
                          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                            <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-5">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-sm font-semibold text-app-fg">灵魂匹配</div>
                                {matchQuery ? (
                                  <div className="text-xs text-app-muted truncate">
                                    最近搜索：{matchQuery}
                                  </div>
                                ) : null}
                              </div>
                              <div className="text-sm text-app-muted mt-2 leading-relaxed">
                                在下方搜索框输入你想要的“特质/关键词/描述”，点击搜索后只会推荐 1 个最适合开场的人。点击卡片后，会先自动生成 10 句 AI 对话。
                              </div>
                              <div className="mt-4">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {isSearching ? (
                                      <svg className="animate-spin h-4 w-4 text-app-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-app-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={isSearching}
                                    placeholder={isSearching ? "灵魂匹配中..." : "搜索特质、灵魂..."}
                                    className="w-full bg-[#131313] text-app-fg border border-white/10 rounded-full py-3 pl-10 pr-32 focus:outline-none focus:ring-1 focus:ring-white/25 transition-all placeholder-app-muted text-base disabled:opacity-50"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSearchSoul()}
                                    disabled={isSearching}
                                    aria-label="搜索"
                                    className="absolute inset-y-0 right-0 my-1 mr-1 px-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-app-fg text-xs font-medium whitespace-nowrap grid place-items-center transition-colors disabled:opacity-50 disabled:hover:bg-white/10"
                                  >
                                    点击进行搜索
                                  </button>
                                </div>
                              </div>

                              {matchError ? (
                                <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                                  {matchError}
                                </div>
                              ) : null}

                              {matchResults.length > 0 ? (
                                <div className="mt-5 grid grid-cols-1 gap-4">
                                  {matchResults.map((r: any) => {
                                    const p = (r as any)?.persona || null;
                                    if (!p) return null;
                                    const pid = String(p?.id || "");
                                    const cover = String(p?.card_cover_url || p?.avatar_2d_url || "");
                                    const coverSrc = /^https?:\/\//i.test(cover) ? toProxyUrl(cover) : cover;
                                    const reasons = Array.isArray((r as any)?.reasons) ? (r as any).reasons : [];
                                    const score = typeof (r as any)?.score === "number" ? (r as any).score : Number((r as any)?.score || 0);
                                    const openingHook = String((r as any)?.openingHook || "").trim();
                                    return (
                                      <div
                                        key={pid || String(p?.name || Math.random())}
                                        className="text-left rounded-2xl border border-white/10 bg-[#131313] overflow-hidden"
                                      >
                                        <div className="relative aspect-[3/2] bg-black/20">
                                          {coverSrc ? (
                                            <img src={coverSrc} className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
                                          ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30" />
                                          )}
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                                          <div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full border bg-black/60 text-white border-white/15 tabular-nums">
                                            匹配 {Number.isFinite(score) ? Math.round(score) : 0}
                                          </div>
                                            <div className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full border bg-[#007AFF]/70 text-white border-white/15">
                                              本轮唯一推荐
                                            </div>
                                          <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <div className="text-white font-bold text-lg truncate">{String(p?.name || "未命名角色")}</div>
                                            <div className="text-xs text-gray-300 mt-1 truncate">
                                              {String(p?.mbti || "未知 MBTI")} · {String(p?.vibe || p?.logic || "点击开聊")}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="p-4">
                                          {openingHook ? (
                                            <div className="mb-3 rounded-2xl border border-cyan-400/15 bg-cyan-500/10 px-3 py-3 text-sm text-cyan-100">
                                              {openingHook}
                                            </div>
                                          ) : null}
                                          {reasons.length ? (
                                            <div className="flex flex-wrap gap-2">
                                              {reasons.slice(0, 3).map((x: any, idx: number) => (
                                                <span
                                                  key={`${pid}-reason-${idx}`}
                                                  className="text-[11px] px-2 py-1 rounded-full border bg-white/5 text-app-muted border-white/10"
                                                >
                                                  {String(x)}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="text-xs text-app-muted">系统已锁定本轮最佳对象</div>
                                          )}
                                          <div className="mt-4">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                void startChatWithTarget(String(p?.name || ""), {
                                                  targetPersona: p,
                                                  openingMessages: Array.isArray((r as any)?.openingMessages)
                                                    ? (r as any).openingMessages
                                                    : [],
                                                })
                                              }
                                              className="rounded-full bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066d6] transition-colors"
                                            >
                                              让他们先聊起来
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : matchQuery && !isSearching && !matchError ? (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-app-muted">
                                  这次没有稳定锁定唯一对象。你可以换一组关键词再试试。
                                </div>
                              ) : null}
                            </div>

                            <ExplorationRealm
                              realm="mortal"
                              activePersona={activePersona}
                              allOtherPersonas={allOtherPersonas}
                              viewerUserId={String(session?.user?.id || "")}
                              myFollows={myFollows}
                              followCountByPersonaId={followCountByPersonaId}
                              onToggleFollow={toggleFollowPersona}
                              session={session}
                              onGoMyMoments={() => {
                                setActiveRealm("social");
                                setActiveTab("echoes");
                                setIsCreatingPersona(false);
                              }}
                              onStartChat={(targetName) => {
                                void startChatWithTarget(targetName);
                              }}
                              onInventoryUpdate={() => {}}
                              embedded
                            />
                            
                            {false ? (
                              <>
                                <div className="mb-6">
                                  <h3 className="text-lg font-bold text-app-fg mb-4">我的化身</h3>
                                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {personas.map((p) => {
                                      const localVisual = personaVisualAssets[String(p.id)] || {};
                                      const cover =
                                        p.card_cover_url ||
                                        p.avatar_2d_url ||
                                        localVisual.cover2dUrl ||
                                        generatePersona2DCard(p);
                                      const coverSrc =
                                        typeof cover === "string" && /^https?:\/\//i.test(cover) ? toProxyUrl(cover) : cover;
                                    const followCount = followCountByPersonaId[String(p.id)] || 0;
                                      return (
                                        <div
                                          key={p.id}
                                          onClick={() => openCardHome(p.id)}
                                          className={`relative shrink-0 w-64 h-32 bg-[#242424] rounded-2xl p-4 cursor-pointer border transition-all hover:bg-white/10 flex flex-col justify-between ${
                                            activePersona?.id === p.id
                                              ? "border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                              : "border-transparent"
                                          }`}
                                        >
                                          <div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full border bg-black/60 text-white border-white/15">
                                            关注 {followCount}
                                          </div>
                                          <div className="flex gap-3">
                                            <div className="w-16 h-24 rounded-xl overflow-hidden border border-white/10 bg-black/30 shrink-0">
                                              <img src={coverSrc} className="h-full w-full object-cover object-[50%_20%]" />
                                            </div>
                                            <div className="overflow-hidden pt-1">
                                              <h4 className="font-bold text-app-fg truncate">
                                                {p.name} <span className="text-xs font-normal opacity-80">{getPersonaTitle(p)}</span>
                                              </h4>
                                              <p className="text-xs text-app-muted mt-1 truncate">{p.mbti}</p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2 text-xs text-app-muted">
                                            <span className="bg-white/5 px-2 py-1 rounded-md">我的化身</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-lg font-bold text-app-fg mb-4">为您推荐</h3>
                                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {allOtherPersonas.length === 0 ? (
                                      <div className="shrink-0 w-64 h-32 bg-[#242424] rounded-2xl p-4 border border-white/10 flex items-center justify-center text-sm text-app-muted">
                                        暂无其他账号的卡片可推荐
                                      </div>
                                    ) : null}

                                    {allOtherPersonas.slice(0, 6).map((p) => {
                                  const cover =
                                    p.card_cover_url ||
                                    p.avatar_2d_url ||
                                    generatePersona2DCard(p);
                                  const coverSrc =
                                    typeof cover === "string" && /^https?:\/\//i.test(cover) ? toProxyUrl(cover) : cover;
                                  return (
                                    <div
                                      key={p.id}
                                      onClick={() => openCardHome(p.id)}
                                      className="shrink-0 w-64 h-32 bg-[#242424] rounded-2xl p-4 cursor-pointer border border-transparent transition-all hover:bg-white/10 flex flex-col justify-between"
                                    >
                                      <div className="flex gap-3">
                                        <div className="w-16 h-24 rounded-xl overflow-hidden border border-white/10 bg-black/30 shrink-0">
                                          <img src={coverSrc} className="h-full w-full object-cover object-[50%_20%]" />
                                        </div>
                                        <div className="overflow-hidden pt-1">
                                          <h4 className="font-bold text-app-fg truncate">
                                            {p.name} <span className="text-xs font-normal opacity-80">{getPersonaTitle(p)}</span>
                                          </h4>
                                          <p className="text-xs text-app-muted mt-1 truncate">{p.mbti || "未知 MBTI"}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs text-app-muted line-clamp-1 flex-1 min-w-0">{p.vibe || "神秘的数字生命"}</p>
                                        <button
                                          type="button"
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            if (!activePersona) {
                                              showHud("info", "请先创建并选择一个活跃人格。");
                                              setActiveRealm("social");
                                              setActiveTab("mycards");
                                              return;
                                            }
                                            const name = String(p?.name || "").trim();
                                            if (!name) return;
                                            await startChatWithTarget(name, { targetPersona: p });
                                          }}
                                          className="shrink-0 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] text-white text-[11px] px-3 py-1.5 font-bold shadow-[0_10px_22px_rgba(0,122,255,0.22)]"
                                        >
                                          开聊
                                        </button>
                                      </div>
                                    </div>
                                  );
                                    })}
                                  </div>
                                </div>

                            {/* 发现全网数字生命 (特色) */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-app-fg">特色与流行</h3>
                                <div className="flex items-center gap-3">
                                  {([
                                    { key: "sm", label: "小" },
                                    { key: "md", label: "中" },
                                    { key: "lg", label: "大" },
                                  ] as const).map((it) => (
                                    <button
                                      key={it.key}
                                      onClick={() => {
                                        const nextMin = it.key === "sm" ? 210 : it.key === "lg" ? 310 : 255;
                                        setPersonaCardSize(it.key);
                                        setPersonaCardMinWidth(nextMin);
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                        personaCardSize === it.key
                                          ? "bg-white/15 text-app-fg border-white/20"
                                          : "bg-[#242424] text-app-muted border-white/10 hover:bg-white/10 hover:text-app-fg"
                                      }`}
                                    >
                                      {it.label}
                                    </button>
                                  ))}
                                  <div className="hidden sm:flex items-center gap-2">
                                    <span className="text-xs text-app-muted tabular-nums w-[52px] text-right">{personaCardMinWidth}px</span>
                                    <input
                                      type="range"
                                      min={200}
                                      max={340}
                                      step={10}
                                      value={personaCardMinWidth}
                                      onChange={(e) => {
                                        const next = Number(e.target.value);
                                        setPersonaCardMinWidth(next);
                                        setPersonaCardSize(next <= 225 ? "sm" : next >= 295 ? "lg" : "md");
                                      }}
                                      className="w-[140px] accent-white"
                                    />
                                  </div>
                                </div>
                              </div>
                              {allOtherPersonas.length > 0 ? (
                                <div
                              className="grid gap-4 min-w-0"
                                  style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${personaCardMinWidth}px, 1fr))` }}
                                >
                                  {allOtherPersonas.map(b => {
                                    const isFollowing = myFollows.includes(b.id);
                                    const isOwner = String(b.user_id || "") === String(session?.user?.id || "");
                                    const allow2d = canViewerSee2d(b);
                                    const allow3d = canViewerSee3d(b);
                                    const personaId = String(b.id);
                                    const localVisual = personaVisualAssets[String(b.id)] || {};
                                    const cover = allow2d
                                      ? (isOwner
                                          ? (b.card_cover_url || b.avatar_2d_url || localVisual.cover2dUrl || generatePersona2DCard(b))
                                          : (b.card_cover_url || b.avatar_2d_url || `https://picsum.photos/seed/${encodeURIComponent(String(b.id || b.name || "persona"))}/480/720`))
                                      : "";
                                    const modelUrl = allow3d
                                      ? (isOwner ? (b.model_3d_url || localVisual.model3dUrl || null) : (b.model_3d_url || null))
                                      : null;
                                    const followCount = followCountByPersonaId[personaId] || 0;
                                    const defaultView: "2d" | "3d" = cover ? "2d" : modelUrl ? "3d" : "2d";
                                    const cardView = (personaCardViewById[personaId] || defaultView) as "2d" | "3d";
                                    
                                    return (
                                      <div key={b.id} className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 bg-[#1b1b1b]">
                                        {modelUrl && cardView === "3d" ? (
                                          renderModelViewer(modelUrl, "absolute inset-0 h-full w-full bg-black/20")
                                        ) : cover ? (
                                            <div className="absolute inset-0 bg-cover bg-[center_20%]" style={{ backgroundImage: `url(${cover})` }} />
                                          ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
                                          )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                                        <div className="absolute top-3 left-3 flex items-center gap-2">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (!allow2d) return;
                                              setPersonaCardViewById((prev) => ({ ...prev, [personaId]: "2d" }));
                                            }}
                                            className={`text-[10px] px-2 py-1 rounded-full border ${
                                              allow2d
                                                ? cardView === "2d"
                                                  ? "bg-black/70 border-white/25 text-white"
                                                  : "bg-black/40 border-white/15 text-white/80 hover:bg-white/10"
                                                : "bg-black/40 border-white/15 text-gray-400 cursor-not-allowed"
                                            }`}
                                          >
                                            2D
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (!allow3d) {
                                                showHud("info", "该卡片持有者未开放 3D 展示。");
                                                return;
                                              }
                                              if (!modelUrl) return;
                                              setPersonaCardViewById((prev) => ({ ...prev, [personaId]: "3d" }));
                                              void import("@google/model-viewer");
                                            }}
                                            className={`text-[10px] px-2 py-1 rounded-full border ${
                                              allow3d && modelUrl
                                                ? cardView === "3d"
                                                  ? "bg-cyan-500/20 border-cyan-300/35 text-cyan-100"
                                                  : "bg-black/40 border-white/15 text-white/80 hover:bg-cyan-500/15 hover:border-cyan-300/30 hover:text-cyan-100"
                                                : "bg-black/40 border-white/15 text-gray-400 cursor-not-allowed"
                                            }`}
                                          >
                                            3D
                                          </button>
                                        </div>
                                        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                                          <div className="text-[10px] px-2 py-1 rounded-full border bg-black/60 text-white border-white/15">
                                            关注 {followCount}
                                          </div>
                                          <button
                                            onClick={async (e) => {
                                              e.stopPropagation();
                                              if (!session?.user?.id) return;
                                              if (isFollowing) {
                                                await supabase.from('follows').delete().eq('follower_id', session.user.id).eq('target_persona_id', b.id);
                                                setMyFollows(prev => prev.filter(id => id !== b.id));
                                                setFollowCountByPersonaId((prev) => ({
                                                  ...(prev || {}),
                                                  [personaId]: Math.max(0, Number((prev || {})[personaId] || 0) - 1),
                                                }));
                                              } else {
                                                await supabase.from('follows').insert({ follower_id: session.user.id, target_persona_id: b.id });
                                                setMyFollows(prev => [...prev, b.id]);
                                                setFollowCountByPersonaId((prev) => ({
                                                  ...(prev || {}),
                                                  [personaId]: Number((prev || {})[personaId] || 0) + 1,
                                                }));
                                              }
                                            }}
                                            className={`text-[10px] px-2.5 py-1 rounded-full border backdrop-blur ${
                                              isFollowing
                                                ? "bg-black/65 text-white border-white/15 hover:bg-black/80"
                                                : "bg-white text-black border-white/10 hover:bg-gray-200"
                                            }`}
                                          >
                                            {isFollowing ? '已关注' : '关注'}
                                          </button>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                          <h4 className="font-bold text-white truncate text-lg">{b.name}</h4>
                                          <div className="text-xs bg-white/10 text-gray-200 px-2 py-0.5 rounded inline-block mb-2">{b.mbti || "未知类型"}</div>
                                          <p className="text-xs text-gray-300 line-clamp-2 min-h-[32px]">{b.vibe || b.logic || "神秘的数字人格"}</p>

                                          {isOwner ? (
                                            <div className="grid grid-cols-2 gap-1 mt-2">
                                              <button
                                                onClick={() => upsertPersonaVisual(String(b.id), { cover2dUrl: generatePersona2DCard(b) })}
                                                className="bg-white/10 hover:bg-white/20 text-white text-[11px] py-1.5 rounded-lg"
                                              >
                                                生成2D
                                              </button>
                                              <button
                                                onClick={() => {
                                                      openUrlDialog(b, "cover2d");
                                                }}
                                                className="bg-white/10 hover:bg-white/20 text-white text-[11px] py-1.5 rounded-lg"
                                              >
                                                替换2D
                                              </button>
                                              <button
                                                onClick={() => {
                                                      openUrlDialog(b, "model3d");
                                                }}
                                                className="bg-white/10 hover:bg-white/20 text-white text-[11px] py-1.5 rounded-lg"
                                              >
                                                替换3D
                                              </button>
                                              <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] font-semibold text-white/65">
                                                我的卡片不可开聊
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="mt-2 grid grid-cols-2 gap-2">
                                              <button
                                                onClick={() => openIceComposer(b)}
                                                className="w-full bg-[#007AFF] hover:bg-[#0066d6] text-white text-[12px] py-2 rounded-lg font-bold transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)]"
                                              >
                                                发破冰卡
                                              </button>
                                              <button
                                                onClick={async () => { await startChatWithTarget(b.name, { targetPersona: b }); }}
                                                className="w-full bg-white text-black hover:bg-gray-200 text-[12px] py-2 rounded-lg font-semibold"
                                              >
                                                发起对话
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-app-muted italic bg-[#242424] p-8 rounded-2xl text-center">全网暂无其他角色。</div>
                              )}
                            </div>
                              </>
                            ) : null}
                          </div>
                        )}

                    {activeTab === 'bonds' && (
                      <div className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-app-fg">🌟 发现全网数字生命</h3>
                          <div className="flex items-center gap-3">
                            {([
                              { key: "sm", label: "小" },
                              { key: "md", label: "中" },
                              { key: "lg", label: "大" },
                            ] as const).map((it) => (
                              <button
                                key={it.key}
                                onClick={() => {
                                  const nextMin = it.key === "sm" ? 210 : it.key === "lg" ? 310 : 255;
                                  setPersonaCardSize(it.key);
                                  setPersonaCardMinWidth(nextMin);
                                }}
                                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                  personaCardSize === it.key
                                    ? "bg-white/15 text-app-fg border-white/20"
                                    : "bg-[#242424] text-app-muted border-white/10 hover:bg-white/10 hover:text-app-fg"
                                }`}
                              >
                                {it.label}
                              </button>
                            ))}
                            <div className="hidden sm:flex items-center gap-2">
                              <span className="text-xs text-app-muted tabular-nums w-[52px] text-right">{personaCardMinWidth}px</span>
                              <input
                                type="range"
                                min={200}
                                max={340}
                                step={10}
                                value={personaCardMinWidth}
                                onChange={(e) => {
                                  const next = Number(e.target.value);
                                  setPersonaCardMinWidth(next);
                                  setPersonaCardSize(next <= 225 ? "sm" : next >= 295 ? "lg" : "md");
                                }}
                                className="w-[140px] accent-white"
                              />
                            </div>
                          </div>
                        </div>
                        {allOtherPersonas.length > 0 ? (
                          <div
                            className="grid gap-4 min-w-0"
                            style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${personaCardMinWidth}px, 1fr))` }}
                          >
                            {allOtherPersonas.map(b => {
                              const isFollowing = myFollows.includes(b.id);
                              const isFollowed = theirFollows.includes(b.id);
                              const isOwner = String(b.user_id || "") === String(session?.user?.id || "");
                              const personaId = String(b.id);
                              const followCount = followCountByPersonaId[personaId] || 0;
                              const allow2d = canViewerSee2d(b);
                              const allow3d = canViewerSee3d(b);
                              const localVisual = personaVisualAssets[String(b.id)] || {};
                              const cover = allow2d
                                ? (isOwner
                                    ? (b.card_cover_url || b.avatar_2d_url || localVisual.cover2dUrl || generatePersona2DCard(b))
                                    : (b.card_cover_url || b.avatar_2d_url || `https://picsum.photos/seed/${encodeURIComponent(String(b.id || b.name || "persona"))}/480/720`))
                                : "";
                              const modelUrl = allow3d
                                ? (isOwner ? (b.model_3d_url || localVisual.model3dUrl || null) : (b.model_3d_url || null))
                                : null;
                              const defaultView: "2d" | "3d" = cover ? "2d" : modelUrl ? "3d" : "2d";
                              const cardView = (personaCardViewById[personaId] || defaultView) as "2d" | "3d";
                              
                              let statusBadge = "🤍 未关注";
                              let badgeClass = "bg-white/15 text-gray-200 border-white/10";
                              if (isFollowing && isFollowed) {
                                statusBadge = "💞 互相关注";
                                badgeClass = "bg-pink-500/20 text-pink-200 border-pink-300/20";
                              } else if (isFollowing) {
                                statusBadge = "💖 已关注";
                                badgeClass = "bg-red-500/20 text-red-200 border-red-300/20";
                              } else if (isFollowed) {
                                statusBadge = "👀 关注了你";
                                badgeClass = "bg-purple-500/20 text-purple-200 border-purple-300/20";
                              }

                              return (
                                <div key={b.id} className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 bg-[#1b1b1b]">
                                  {modelUrl && cardView === "3d" ? (
                                    renderModelViewer(modelUrl, "absolute inset-0 h-full w-full bg-black/20")
                                  ) : cover ? (
                                      <div className="absolute inset-0 bg-cover bg-[center_20%]" style={{ backgroundImage: `url(${cover})` }} />
                                    ) : (
                                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
                                    )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
                                  <div className="absolute top-3 left-3 flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!allow2d) return;
                                        setPersonaCardViewById((prev) => ({ ...prev, [personaId]: "2d" }));
                                      }}
                                      className={`text-[10px] px-2 py-1 rounded-full border ${
                                        allow2d
                                          ? cardView === "2d"
                                            ? "bg-black/70 border-white/25 text-white"
                                            : "bg-black/40 border-white/15 text-white/80 hover:bg-white/10"
                                          : "bg-black/40 border-white/15 text-gray-400 cursor-not-allowed"
                                      }`}
                                    >
                                      2D
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!allow3d) return;
                                        if (!modelUrl) return;
                                        setPersonaCardViewById((prev) => ({ ...prev, [personaId]: "3d" }));
                                        void import("@google/model-viewer");
                                      }}
                                      className={`text-[10px] px-2 py-1 rounded-full border ${
                                        allow3d && modelUrl
                                          ? cardView === "3d"
                                            ? "bg-cyan-500/20 border-cyan-300/35 text-cyan-100"
                                            : "bg-black/40 border-white/15 text-white/80 hover:bg-cyan-500/15 hover:border-cyan-300/30 hover:text-cyan-100"
                                          : "bg-black/40 border-white/15 text-gray-400 cursor-not-allowed"
                                      }`}
                                    >
                                      3D
                                    </button>
                                  </div>
                                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                                    <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${badgeClass}`}>
                                      {statusBadge}
                                    </span>
                                    <span className="text-[10px] px-2 py-1 rounded-full border bg-black/60 text-white border-white/15">
                                      关注 {followCount}
                                    </span>
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        await toggleFollowPersona(b.id, b.user_id);
                                      }}
                                      className={`text-[10px] px-2.5 py-1 rounded-full border backdrop-blur ${
                                        isFollowing
                                          ? "bg-black/65 text-white border-white/15 hover:bg-black/80"
                                          : "bg-white text-black border-white/10 hover:bg-gray-200"
                                      }`}
                                    >
                                      {isFollowing ? "取消关注" : "关注"}
                                    </button>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <h4 className="font-bold text-white truncate text-lg">{b.name}</h4>
                                    <div className="text-xs bg-white/10 text-gray-200 px-2 py-0.5 rounded inline-block mt-1">{b.mbti || "未知类型"}</div>
                                    <p className="text-xs text-gray-300 line-clamp-2 min-h-[32px] mt-2">{b.vibe || b.logic || "神秘的数字人格"}</p>
                                    {isOwner ? (
                                      <div className="grid grid-cols-2 gap-1 mt-2">
                                        <button
                                          onClick={() => upsertPersonaVisual(String(b.id), { cover2dUrl: generatePersona2DCard(b) })}
                                          className="bg-white/10 hover:bg-white/20 text-white text-[11px] py-1.5 rounded-lg"
                                        >
                                          生成2D
                                        </button>
                                        <button
                                          onClick={() => {
                                              openUrlDialog(b, "cover2d");
                                          }}
                                          className="bg-white/10 hover:bg-white/20 text-white text-[11px] py-1.5 rounded-lg"
                                        >
                                          替换2D
                                        </button>
                                        <button
                                          onClick={() => {
                                              openUrlDialog(b, "model3d");
                                          }}
                                          className="bg-white/10 hover:bg-white/20 text-white text-[11px] py-1.5 rounded-lg"
                                        >
                                          替换3D
                                        </button>
                                        <button 
                                          onClick={async () => { await startChatWithTarget(b.name, { targetPersona: b }); }}
                                          className="bg-white text-black hover:bg-gray-200 text-[11px] py-1.5 rounded-lg font-semibold"
                                        >
                                          发起对话
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={async () => { await startChatWithTarget(b.name, { targetPersona: b }); }}
                                        className="mt-2 w-full bg-white text-black hover:bg-gray-200 text-[12px] py-2 rounded-lg font-semibold"
                                      >
                                        发起对话
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-app-muted italic">全网暂无其他角色。</div>
                        )}
                      </div>
                    )}

                    {activeTab === 'chats' && (
                      <div className="animate-in fade-in duration-300 space-y-10 pb-28">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-xl font-bold text-app-fg">对话</h3>
                            <div className="relative w-full max-w-[360px]">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                              </div>
                              <input
                                type="text"
                                value={chatKeyword}
                                onChange={(e) => setChatKeyword(e.target.value)}
                                placeholder="搜索角色 / 状态 / 最近一句"
                                className="w-full bg-[#242424] text-app-fg border border-white/10 rounded-full py-2.5 pl-9 pr-4 text-sm placeholder-app-muted focus:outline-none focus:ring-1 focus:ring-white/25"
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {([
                              { key: "all", label: "全部" },
                              { key: "agent", label: "AI托管中" },
                            ] as const).map((it) => (
                              <button
                                key={it.key}
                                onClick={() => setSceneFilter(it.key)}
                                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                  sceneFilter === it.key
                                    ? "bg-white/15 text-app-fg border-white/20"
                                    : "bg-[#242424] text-app-muted border-white/10 hover:bg-white/10 hover:text-app-fg"
                                }`}
                              >
                                {it.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-app-fg">最近对话</h4>
                            <div className="text-xs text-app-muted">{filteredChats.length} 个会话</div>
                          </div>
                          {filteredChats.length > 0 ? (
                            <div className="overflow-hidden border-y border-white/10 bg-[#1f1f1f]">
                              {filteredChats.map((c: any) => {
                                const name = String(c.target_desc || "未命名角色");
                                const persona = personaByName.get(name.trim());
                                const personaId = String((persona as any)?.id || "").trim();
                                const personaOwnerId = String((persona as any)?.user_id || "").trim();
                                const isOwnPersona = Boolean(personaId && personaOwnerId && personaOwnerId === String(session?.user?.id || "").trim());
                                const isFollowing = personaId ? myFollows.includes(personaId) : false;
                                const nickname = String(
                                  (persona as any)?.nickname ||
                                  (persona as any)?.display_name ||
                                  (persona as any)?.alias ||
                                  name
                                ).trim() || name;
                                const cover = resolveCardCover(c) || `https://picsum.photos/seed/${encodeURIComponent(String(c.id || name || "chat"))}/120/120`;
                                const lastMessage = getChatLastMessage(String(c.history || "")).trim() || "点击继续对话";
                                const modeTitle = String((c as any)?.target_mode_title || "").trim();
                                const timeText = formatChatListTime((c as any)?.updated_at || (c as any)?.created_at);
                                const unreadCount = Math.max(0, Number((c as any)?.unread_count ?? (c as any)?.unread ?? 0) || 0);
                                return (
                                  <div
                                    key={c.id}
                                    className="w-full text-left transition-colors hover:bg-white/5"
                                  >
                                    <div className="flex items-center gap-3 px-3 py-3">
                                      <button
                                        onClick={() => navigate(`/chat/${c.id}`)}
                                        type="button"
                                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                      >
                                        <div className="shrink-0">
                                          <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                            <img src={cover} alt={name} className="h-full w-full object-cover object-[50%_20%]" />
                                          </div>
                                        </div>
                                        <div className="min-w-0 flex-1 pr-2">
                                          <div className="flex items-center gap-2">
                                            <div className="min-w-0 flex-1 truncate text-[16px] font-medium text-app-fg">{nickname}</div>
                                            {modeTitle ? (
                                              <div className="shrink-0 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-100">
                                                {modeTitle}
                                              </div>
                                            ) : null}
                                          </div>
                                          <div className="mt-1 min-w-0 truncate text-[13px] text-app-muted">
                                            {lastMessage}
                                          </div>
                                        </div>
                                      </button>
                                      <div className="flex h-12 min-w-[40px] shrink-0 flex-col items-end justify-between">
                                        <div className="flex items-center gap-2">
                                          {!isOwnPersona && personaId ? (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                void toggleFollowPersona(personaId, personaOwnerId);
                                              }}
                                              className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                                                isFollowing
                                                  ? "bg-black/65 text-white border-white/15 hover:bg-black/80"
                                                  : "bg-white text-black border-white/10 hover:bg-gray-200"
                                              }`}
                                            >
                                              {isFollowing ? "已关注" : "关注"}
                                            </button>
                                          ) : null}
                                          <div className="text-[11px] text-app-muted">{timeText}</div>
                                        </div>
                                        {unreadCount > 0 ? (
                                          <div className="grid h-5 min-w-[20px] place-items-center rounded-full bg-[#ff4d4f] px-1.5 text-[11px] font-semibold text-white">
                                            {unreadCount > 99 ? "99+" : unreadCount}
                                          </div>
                                        ) : (
                                          <div className="h-5" />
                                        )}
                                      </div>
                                    </div>
                                    {filteredChats[filteredChats.length - 1]?.id !== c.id ? (
                                      <div className="ml-[72px] h-px bg-white/10" />
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
            <div className="text-app-muted italic bg-[#1f1f1f] border border-white/5 p-8 rounded-2xl text-center">
                              暂无符合条件的对话，先去发现页匹配一个灵魂吧。
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {activeTab === 'echoes' && (
                      <div className="animate-in fade-in duration-300 flex flex-col gap-6 min-h-0">
                        <div className="bg-[#242424] border border-white/5 rounded-2xl p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-app-fg text-lg">📝 我的动态</h3>
                              <div className="text-xs text-app-muted mt-1">发布入口已合并到「发现 → 动态」。这里用于查看你发布过的回声。</div>
                            </div>
                            <button
                              onClick={() => {
                                setActiveRealm("social");
                                setActiveTab("search");
                                setIsCreatingPersona(false);
                              }}
                              className="text-sm bg-white/10 text-app-fg px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
                            >
                              去我的世界发布
                            </button>
                          </div>
                        </div>

                        {echoes.length > 0 ? (
                          <div className="lg:max-h-[calc(100vh-340px)] overflow-y-auto custom-scrollbar pr-1 min-h-0">
                            <div className="columns-2 md:columns-3 gap-2">
                              {echoes.map((e: any, idx: number) => {
                                const p = (e as any)?.personas || null;
                                const name = String(p?.name || "未知人格");
                                const mbti = String(p?.mbti || "").trim();
                                const cover = String(p?.card_cover_url || p?.avatar_2d_url || "");
                                const coverSrc = /^https?:\/\//i.test(cover) ? toProxyUrl(cover) : cover;
                                const liked = isEchoLiked(String(e.id));
                                const hid = String((e as any)?.id || idx);
                                let h = 0;
                                for (let j = 0; j < hid.length; j++) h = (h * 31 + hid.charCodeAt(j)) >>> 0;
                                const aspect = h % 4 === 0 ? "aspect-square" : "aspect-[4/5]";
                                return (
                                  <div key={String(e.id || idx)} className="mb-2 break-inside-avoid">
                                    <div className="rounded-xl border border-white/10 bg-[#1b1b1b] overflow-hidden hover:border-white/20 transition-colors">
                                      <div className={`relative ${aspect} bg-black/20`}>
                                        {coverSrc ? (
                                          <img src={coverSrc} className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
                                        ) : (
                                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                                        <button
                                          onClick={() => void likeEcho(String(e.id))}
                                          disabled={liked}
                                          className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border backdrop-blur ${
                                            liked
                                              ? "text-rose-200 bg-rose-500/15 border-rose-300/20 cursor-not-allowed"
                                              : "text-white/90 bg-black/40 border-white/15 hover:bg-black/55"
                                          }`}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                          {Number((e as any)?.likes || 0)}
                                        </button>
                                        <div className="absolute left-0 right-0 bottom-0 p-2">
                                          <div className="text-white font-semibold text-[13px] leading-snug line-clamp-3">
                                            {String((e as any)?.content || "（这条动态没有内容）")}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-2 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 bg-white/5 shrink-0">
                                            {coverSrc ? (
                                              <img src={coverSrc} className="h-full w-full object-cover object-[50%_20%]" />
                                            ) : (
                                              <div className="h-full w-full bg-gradient-to-br from-purple-600/30 to-blue-600/30" />
                                            )}
                                          </div>
                                          <div className="min-w-0">
                                            <div className="text-[11px] text-app-fg truncate">{name}</div>
                                            <div className="text-[10px] text-app-muted truncate">
                                              {mbti ? `${mbti} · ` : ""}{new Date(String((e as any)?.created_at || "")).toLocaleString()}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-app-muted italic bg-[#242424] p-8 rounded-2xl text-center">你还没有发布过动态。去「发现 → 动态」发第一条回声。</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <ExplorationRealm 
              realm={activeRealm}
              activePersona={activePersona}
              allOtherPersonas={allOtherPersonas}
              viewerUserId={String(session?.user?.id || "")}
              myFollows={myFollows}
              followCountByPersonaId={followCountByPersonaId}
              onToggleFollow={toggleFollowPersona}
              session={session}
              onGoMyMoments={() => { setActiveRealm('social'); setActiveTab('echoes'); setIsCreatingPersona(false); }}
              onStartChat={(name) => {
                void startChatWithTarget(name);
              }}
              onInventoryUpdate={(newInv) => {
                setActivePersona({ ...activePersona, inventory: newInv });
                setPersonas((prev) =>
                  Array.isArray(prev)
                    ? prev.map((p) =>
                        String(p?.id || "") === String(activePersona?.id || "")
                          ? { ...p, inventory: newInv }
                          : p
                      )
                    : prev
                );
              }}
            />
          )}
          </>
        )}
        </div>
      </main>

      {iceboxOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIceboxOpen(false)}
            aria-label="关闭侧边栏"
          />
          <div className="absolute right-0 top-0 h-full w-[460px] max-w-[92vw] border-l border-white/10 bg-[#131313] shadow-2xl flex flex-col">
            <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                  灵魂蒸馏室
                </div>
                <div className="text-xs text-app-muted mt-1">塑造更立体的人格</div>
              </div>
              <button
                type="button"
                onClick={() => setIceboxOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-white/10 text-app-muted hover:text-app-fg transition-colors"
                aria-label="关闭"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 pt-4">
              <div className="inline-flex w-full items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setIceboxTab("inbox")}
                  className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    iceboxTab === "inbox" ? "bg-[#007AFF] text-white shadow" : "text-app-muted hover:text-app-fg hover:bg-white/10"
                  }`}
                >
                  特质蒸馏
                </button>
                <button
                  type="button"
                  onClick={() => setIceboxTab("outbox")}
                  className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    iceboxTab === "outbox" ? "bg-[#007AFF] text-white shadow" : "text-app-muted hover:text-app-fg hover:bg-white/10"
                  }`}
                >
                  我的关注
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {iceboxTab === "inbox" ? (
                isTestingMbti ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#007AFF]"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
                        灵魂拷问
                      </h3>
                      <button 
                        onClick={() => {
                          setIsTestingMbti(false);
                          setActiveQuestion(null);
                        }}
                        className="text-sm text-app-muted hover:text-white"
                      >
                        退出测试
                      </button>
                    </div>
                    
                    <div className="bg-[#242424] rounded-2xl p-6 border border-white/10 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007AFF]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                      
                      {activeQuestion ? (
                        <>
                          <div className={`text-xs font-bold mb-3 inline-block px-2 py-1 rounded border ${testType === 'MBTI' ? 'text-[#007AFF] bg-[#007AFF]/10 border-[#007AFF]/20' : 'text-purple-400 bg-purple-500/10 border-purple-500/20'}`}>
                            {testType} 场景测试
                          </div>
                          <div className="text-lg text-white font-medium leading-relaxed mb-8 relative z-10">
                            {activeQuestion.text}
                          </div>
                          <div className="space-y-3 relative z-10">
                            {activeQuestion.options.map((opt: any, i: number) => (
                              <button
                                key={i}
                                onClick={() => handleMbtiAnswer(opt.trait)}
                                className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-app-fg"
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="py-10 text-center text-app-muted">正在抽取灵魂问题...</div>
                      )}
                    </div>
                    
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                      <div className="text-xs text-app-muted mb-2">已沉淀的性格特质（实时预览）：</div>
                      <div className="text-sm text-white/90 whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                        {distillCustomTraits || "暂无特质，开始答题吧！"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-app-fg">自定义性格特质</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setDistillCustomTraits("")}
                            className="text-xs text-app-muted hover:text-white font-bold flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                            清空内容
                          </button>
                          <button
                            type="button"
                            onClick={() => startTest("MBTI")}
                            className="text-xs text-[#007AFF] hover:text-[#3399ff] font-bold flex items-center gap-1 bg-[#007AFF]/10 hover:bg-[#007AFF]/20 px-2 py-1 rounded-md transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
                            MBTI 测试
                          </button>
                          <button
                            type="button"
                            onClick={() => startTest("SBTI")}
                            className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 bg-purple-500/10 hover:bg-purple-500/20 px-2 py-1 rounded-md transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                            SBTI 测试
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={5}
                        placeholder="用几句话描述这个角色的性格细节、习惯用语、或者背景故事...也可以点击右上角通过答题自动生成。"
                        value={distillCustomTraits}
                        onChange={(e) => setDistillCustomTraits(e.target.value)}
                        className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-sm text-app-fg outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] transition-all resize-none"
                      />
                      <div className="text-xs text-app-muted">自由发挥，你可以把你想蒸馏到这张卡片的任何设定写在这里。</div>
                    </div>

                    <button
                      onClick={handleSaveDistill}
                      disabled={distillSaving}
                      className="w-full py-3 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] disabled:bg-white/10 disabled:text-app-muted text-white font-bold transition-colors shadow-lg"
                    >
                      {distillSaving ? "保存中..." : "保存特质"}
                    </button>

                    {/* 蒸馏历史记录展示 */}
                    {activePersona?.distillation_history && activePersona.distillation_history.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="text-sm font-bold text-white/90 mb-4 flex items-center gap-2">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          蒸馏历史记录
                        </div>
                        <div className="max-h-80 overflow-y-auto custom-scrollbar pr-1">
                          <div className="flex flex-col gap-3">
                          {[...activePersona.distillation_history].reverse().map((record: any) => (
                            <div key={record.id} className="p-4 bg-black/20 border border-white/5 rounded-xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 blur-xl rounded-full -mr-10 -mt-10"></div>
                              <div className="flex items-start justify-between mb-2">
                                <div className="text-cyan-300 font-extrabold text-sm tracking-wide">【{record.title}】</div>
                                <div className="flex items-center gap-2">
                                  <div className="text-[10px] text-white/30">{new Date(record.created_at).toLocaleDateString()}</div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDistillHistory(String(record.id || ""))}
                                    className="text-[11px] px-2 py-0.5 rounded-md border border-white/10 text-app-muted hover:text-rose-300 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                                  >
                                    删除
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs text-white/70 leading-relaxed mb-2">{record.description}</div>
                            </div>
                          ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="text-sm font-bold text-app-fg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        知识库注入 (即将上线)
                      </div>
                      <div className="text-xs text-app-muted mt-2 leading-relaxed">
                        你可以上传人物小传、背景设定等文件，训练成为具有专业素养的专属 Agent 模型。
                      </div>
                      <button disabled className="mt-3 w-full py-2.5 rounded-xl border border-white/10 border-dashed text-app-muted text-sm font-medium cursor-not-allowed">
                        + 上传资料文件 (敬请期待)
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  {followsLoading ? (
                    <div className="text-app-muted text-sm text-center py-10">加载中...</div>
                  ) : followsList.length > 0 ? (
                    followsList.map((item: any) => {
                      const targetId = String(item?.target_persona_id || item?.to_persona_id || "");
                      const joinedPersona = item?.personas || null;
                      const targetP = joinedPersona || personaById.get(targetId);
                      const id = String(item?.id || targetId || item?.created_at || "");
                      const name = String(targetP?.name || "未知人格");
                      const mbtiText = String(targetP?.mbti || targetP?.mbti_type || "").trim();
                      const cover = String(targetP?.card_cover_url || targetP?.avatar_2d_url || "").trim();
                      const coverSrc = /^https?:\/\//i.test(cover) ? toProxyUrl(cover) : cover;
                      return (
                        <div key={id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between hover:border-white/20 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (!targetId) return;
                                setIceboxOpen(false);
                                openCardHome(targetId);
                              }}
                              className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0 hover:border-[#007AFF]/40 transition-colors"
                              aria-label={`查看 ${name} 的人格卡片`}
                              title="查看人格卡片"
                            >
                              {coverSrc ? (
                                <img src={coverSrc} alt={name} className="h-full w-full object-cover object-[50%_20%]" />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                                  {name.charAt(0) || "?"}
                                </div>
                              )}
                            </button>
                            <div className="min-w-0">
                              <div className="font-bold text-app-fg text-base truncate">{name}</div>
                              <div className="text-xs text-app-muted truncate mt-1">
                                {mbtiText || "暂无特质"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (targetP?.name) void startChatWithTarget(String(targetP.name), { targetPersona: targetP });
                                setIceboxOpen(false);
                              }}
                              className="px-3 py-1.5 bg-[#007AFF]/10 text-[#8cc3ff] hover:bg-[#007AFF]/20 rounded-lg text-sm font-medium transition-colors"
                            >
                              去互动
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUnfollow(targetId)}
                              className="px-3 py-1.5 border border-white/10 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 text-app-muted rounded-lg text-sm font-medium transition-colors"
                            >
                              取消关注
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-white/10 border-dashed bg-transparent p-8 text-center mt-10">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-app-muted"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                      </div>
                      <div className="text-app-fg font-bold">暂无关注的人格</div>
                      <div className="text-sm text-app-muted mt-2 leading-relaxed">
                        在「发现」频道遇到喜欢的人格，点击右上角的关注，即可在这里快速找到他们。
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {iceComposerOpen && iceComposerTarget ? (
        <div className="fixed inset-0 z-[65] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] rounded-2xl border border-white/10 bg-[#242424] text-app-fg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-extrabold">发送破冰卡</div>
                <div className="text-sm text-app-muted mt-1 truncate">发给：{String(iceComposerTarget?.name || "未知对象")}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (iceComposerSending) return;
                  setIceComposerOpen(false);
                  setIceComposerTarget(null);
                }}
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-white/10 text-app-muted hover:text-app-fg transition-colors"
                aria-label="关闭"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                {(["轻松", "认真", "幽默"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setIceComposerTone(t)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      iceComposerTone === t ? "bg-white/15 text-app-fg border-white/20" : "bg-[#131313] text-app-muted border-white/10 hover:bg-white/10 hover:text-app-fg"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <textarea
                value={iceComposerText}
                onChange={(e) => setIceComposerText(e.target.value)}
                rows={5}
                placeholder="写一句轻量破冰（围绕共同点/对方卡片内容），对方更愿意回。"
                className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3 text-sm text-app-fg outline-none focus:ring-1 focus:ring-white/20 placeholder-app-muted resize-none"
              />

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-bold">可选快捷回复</div>
                <div className="text-xs text-app-muted mt-1">对方点一下就能回应，降低回复门槛（最多 6 个）。</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {iceComposerOptions.map((op, idx) => (
                    <input
                      key={`${idx}-${op}`}
                      value={op}
                      onChange={(e) => {
                        const v = e.target.value;
                        setIceComposerOptions((prev) => prev.map((x, i) => (i === idx ? v : x)));
                      }}
                      className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-sm text-app-fg outline-none focus:ring-1 focus:ring-white/20 placeholder-app-muted"
                      placeholder={`选项 ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={iceComposerSending}
                  onClick={() => {
                    setIceComposerOpen(false);
                    setIceComposerTarget(null);
                  }}
                  className="w-full bg-white/10 hover:bg-white/15 text-app-fg py-2.5 rounded-xl font-semibold border border-white/10 transition-colors disabled:opacity-60"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={iceComposerSending}
                  onClick={sendIcebreaker}
                  className="w-full bg-[#007AFF] hover:bg-[#0066d6] text-white py-2.5 rounded-xl font-bold transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)] disabled:opacity-60"
                >
                  {iceComposerSending ? "发送中..." : "发送"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {hud ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-4">
          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold border shadow-lg backdrop-blur ${
              hud.kind === "success"
                ? "bg-emerald-500/15 text-emerald-200 border-emerald-300/20"
                : hud.kind === "error"
                  ? "bg-rose-500/15 text-rose-200 border-rose-300/20"
                  : "bg-white/10 text-app-fg border-white/15"
            }`}
          >
            {hud.text}
          </div>
        </div>
      ) : null}

      {isMobileUi && mobileMycardsActionsOpen && activeRealm === "social" && activeTab === "mycards" && activePersona ? (
        <div className="fixed inset-0 z-[110]">
          <button
            type="button"
            onClick={() => setMobileMycardsActionsOpen(false)}
            className="absolute inset-0 bg-black/70"
            aria-label="关闭"
          />
          <div className="absolute inset-x-0 bottom-0 bg-[#0f0f10] border-t border-white/10 rounded-t-3xl p-4 pb-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-extrabold text-white">更多操作</div>
              <button
                type="button"
                onClick={() => setMobileMycardsActionsOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                aria-label="关闭"
                title="关闭"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {(activePersona.model_3d_url || (personaVisualAssets[String(activePersona.id)] || {}).model3dUrl) ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMycardsActionsOpen(false);
                    setPersonaCardViewById((prev) => ({ ...prev, [String(activePersona.id)]: "3d" }));
                    void import("@google/model-viewer");
                  }}
                  className="w-full bg-black/40 hover:bg-cyan-500/15 text-cyan-200 py-3 rounded-xl font-semibold border border-cyan-400/20 transition-colors"
                >
                  切到3D
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setMobileMycardsActionsOpen(false);
                  openAppearanceDialog(activePersona);
                }}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-semibold border border-white/10 transition-colors"
              >
                外观设定
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMycardsActionsOpen(false);
                  openAiForPersona(activePersona, "portrait2d");
                }}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-semibold border border-white/10 transition-colors"
              >
                生成2D
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMycardsActionsOpen(false);
                  openAiForPersona(activePersona, "banner2d");
                }}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-semibold border border-white/10 transition-colors"
              >
                生成横幅
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMycardsActionsOpen(false);
                  openAiForPersona(activePersona, "companion");
                }}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-semibold border border-white/10 transition-colors"
              >
                伴生兽觉醒
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMycardsActionsOpen(false);
                  openUrlDialog(activePersona, "model3d");
                }}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-semibold border border-white/10 transition-colors"
              >
                替换3D
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMycardsActionsOpen(false);
                  openUrlDialog(activePersona, "cover2d");
                }}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-semibold border border-white/10 transition-colors"
              >
                替换2D
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMycardsActionsOpen(false);
                  openUrlDialog(activePersona, "avatar2d");
                }}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-semibold border border-white/10 transition-colors"
              >
                替换贴图
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMycardsActionsOpen(false);
                  openUrlDialog(activePersona, "banner2d");
                }}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-semibold border border-white/10 transition-colors"
              >
                替换横幅
              </button>
            </div>
          </div>
        </div>
      ) : null}

 
      {/* AI 助手面板弹窗 / 后台保活 */}
      {(isAiPanelOpen || aiPanelKeepAlive) && (
        <div
          className={
            isAiPanelOpen
              ? "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              : "fixed -left-[200vw] top-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
          }
        >
          <div className="rounded-2xl shadow-2xl w-[92vw] max-w-[520px] h-[82vh] flex flex-col overflow-hidden relative border border-app-border/15 bg-transparent">
            <div className="flex-1 min-h-0 overflow-hidden">
              <AiPluginPanel
                apiBaseUrl={API_BASE_URL}
                token={getPluginToken() || undefined}
                authToken={session?.access_token ? String(session.access_token) : undefined}
                theme={pluginTheme}
                storageNamespace={
                  session?.user?.id
                    ? `${String(session.user.id)}:${String(aiTargetPersonaId || activePersona?.id || "default")}`
                    : `guest:${String(aiTargetPersonaId || activePersona?.id || "default")}`
                }
                historyPersonaId={aiTargetPersonaId || (activePersona?.id != null ? String(activePersona.id) : undefined)}
                embedded
                initialTab={aiInitialTab}
                initialSize={aiInitialSize}
                initialPrompt={aiInitialPrompt}
                initialImageUrl={aiInitialImageUrl}
                onImageGenerated={(images) => {
                  if (Array.isArray(images) && images.length) addRecentImages(images.map((x) => String(x || "")));
                  const id = aiTargetPersonaId;
                  const url = Array.isArray(images) && images.length > 0 ? String(images[0] || "") : "";
                  if (!id || !url) return;
                  if (aiTargetImageKind === "banner") {
                    upsertPersonaVisual(id, { banner2dUrl: url });
                    void (async () => {
                      try {
                        const stable = await uploadImageToCosIfNeeded(url);
                        const finalUrl = stable || url;
                        if (finalUrl && finalUrl !== url) upsertPersonaVisual(id, { banner2dUrl: finalUrl });
                        await persistPersonaVisualToDb(id, { banner_cover_url: finalUrl });
                      } catch (e: any) {
                        if (!cosWarnedRef.current) {
                          cosWarnedRef.current = true;
                          const msg = e?.message ? String(e.message) : "";
                          alert(
                            msg && /COS is not configured/i.test(msg)
                              ? "COS 未配置，2D 图片无法长期保存。请先配置 COS，再重试生成。"
                              : "自动转存到 COS 失败，2D 图片可能无法长期保存。请检查 Token/COS 配置后重试。",
                          );
                        }
                        await persistPersonaVisualToDb(id, { banner_cover_url: url });
                      }
                    })();
                    return;
                  }
                  upsertPersonaVisual(id, { cover2dUrl: url });
                  void (async () => {
                    try {
                      const stable = await uploadImageToCosIfNeeded(url);
                      const finalUrl = stable || url;
                      if (finalUrl && finalUrl !== url) upsertPersonaVisual(id, { cover2dUrl: finalUrl });
                      await persistPersonaVisualToDb(id, { card_cover_url: finalUrl });
                    } catch (e: any) {
                      if (!cosWarnedRef.current) {
                        cosWarnedRef.current = true;
                        const msg = e?.message ? String(e.message) : "";
                        alert(
                          msg && /COS is not configured/i.test(msg)
                            ? "COS 未配置，2D 图片无法长期保存。请先配置 COS，再重试生成。"
                            : "自动转存到 COS 失败，2D 图片可能无法长期保存。请检查 Token/COS 配置后重试。",
                        );
                      }
                      await persistPersonaVisualToDb(id, { card_cover_url: url });
                    }
                  })();
                  if (!isAiPanelOpen) {
                    pushAiCompletionNotice("2D 图片已生成", "你的新图片已经生成完成，可随时重新打开 AI 工坊查看。");
                    setAiPanelKeepAlive(false);
                  }
                  trackAiTaskFinished("succeeded", "2D 图片生成完成");
                }}
                onCompanionAwakened={(payload) => {
                  if (!isAiPanelOpen) {
                    pushAiCompletionNotice(
                      "伴生兽已觉醒",
                      `${payload?.profile?.speciesNameCn || "伴生兽"} 已生成完成，可重新打开工坊查看详情。`,
                    );
                    setAiPanelKeepAlive(false);
                  }
                  trackAiTaskFinished("succeeded", `${payload?.profile?.speciesNameCn || "伴生兽"} 觉醒完成`);
                }}
                onModelGenerated={(payload) => {
                  const id = aiTargetPersonaId || (activePersona?.id != null ? String(activePersona.id) : "");
                  const url = payload?.modelUrl ? String(payload.modelUrl) : "";
                  if (id && url) {
                    upsertPersonaVisual(id, { model3dUrl: url });
                    void (async () => {
                      try {
                        const finalUrl = await importGeneratedModelToLibrary(id, url);
                        if (finalUrl && finalUrl !== url) upsertPersonaVisual(id, { model3dUrl: finalUrl });
                        await persistPersonaVisualToDb(id, { model_3d_url: finalUrl || url });
                      } catch (e: any) {
                        const msg = e?.message ? String(e.message) : "";
                        alert(
                          msg
                            ? `3D 模型已生成，但自动保存到你的卡片失败：${msg}`
                            : "3D 模型已生成，但自动保存到你的卡片失败。请稍后重试。",
                        );
                        await persistPersonaVisualToDb(id, { model_3d_url: url });
                      }
                    })();
                  }
                  if (!isAiPanelOpen) {
                    pushAiCompletionNotice("3D 模型已生成", "伴生兽 3D 模型已经生成完成，可重新打开工坊查看。");
                    setAiPanelKeepAlive(false);
                  }
                  trackAiTaskFinished("succeeded", "3D 模型生成完成");
                }}
                onBusyStateChange={(payload) => {
                  setAiPanelBusyState(payload);
                  if (payload.busy) setAiPanelKeepAlive(true);
                  if (payload.busy && payload.kind) {
                    trackAiTaskStarted({
                      kind: payload.kind,
                      label: payload.label,
                      startedAt: payload.startedAt,
                      etaSec: payload.etaSec,
                    });
                  }
                }}
                onRequestBackgroundClose={minimizeAiPanelToBackground}
                onError={(payload) => {
                  const msg = payload?.message ? String(payload.message) : "发生错误";
                  trackAiTaskFinished("failed", msg);
                  if (!isAiPanelOpen) {
                    showHud("error", msg);
                    setAiPanelKeepAlive(false);
                  } else {
                    alert(msg);
                  }
                }}
                onClose={clearAiPanelSession}
              />
            </div>
          </div>
        </div>
      )}

      {!isAiPanelOpen && (aiPanelBusyState.busy || aiRecentTasks.length > 0) && (
        <>
          {aiTaskCenterOpen ? (
            <div className="fixed bottom-24 right-6 z-40 w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-app-border/15 bg-app-elevated/95 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-app-border/12 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-app-fg">任务中心</div>
                  <div className="text-[11px] text-app-muted">最近 8 次 AI 生成任务</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiTaskCenterOpen(false)}
                  className="rounded-full border border-app-border/12 bg-app-surface/20 px-2.5 py-1 text-xs text-app-muted hover:text-app-fg"
                >
                  收起
                </button>
              </div>
              <div className="max-h-[42vh] overflow-y-auto p-3 custom-scrollbar">
                <div className="space-y-2">
                  {aiRecentTasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => setIsAiPanelOpen(true)}
                      className="w-full rounded-2xl border border-app-border/12 bg-app-surface/20 px-3 py-3 text-left hover:bg-app-surface/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-app-fg">{task.label}</div>
                          <div className="mt-1 text-[11px] text-app-muted">
                            开始于 {new Date(task.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            {task.finishedAt
                              ? ` · 完成于 ${new Date(task.finishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                              : ""}
                          </div>
                          {task.detail ? <div className="mt-1 text-xs text-app-muted">{task.detail}</div> : null}
                        </div>
                        <div
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            task.status === "running"
                              ? "border border-accent/20 bg-accent/10 text-accent"
                              : task.status === "succeeded"
                                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                : "border border-rose-500/20 bg-rose-500/10 text-rose-300"
                          }`}
                        >
                          {task.status === "running" ? "进行中" : task.status === "succeeded" ? "已完成" : "失败"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {aiPanelBusyState.busy ? (
            <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3">
              <button
                type="button"
                onClick={() => setAiTaskCenterOpen((prev) => !prev)}
                className="rounded-2xl border border-app-border/15 bg-app-elevated/95 px-3 py-2 text-xs text-app-muted shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl hover:text-app-fg"
              >
                任务中心
              </button>
              <button
                type="button"
                onClick={() => setIsAiPanelOpen(true)}
                className="max-w-[min(88vw,340px)] rounded-2xl border border-accent/20 bg-app-elevated/95 px-4 py-3 text-left shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="relative grid h-14 w-14 shrink-0 place-items-center">
                    <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
                      <circle cx="22" cy="22" r="18" fill="none" stroke="rgb(255 255 255 / 0.10)" strokeWidth="4" />
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="rgb(0 122 255)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${Math.PI * 2 * 18}`}
                        strokeDashoffset={`${Math.PI * 2 * 18 * (1 - aiBusyProgress / 100)}`}
                      />
                    </svg>
                    <div className="absolute text-[11px] font-semibold text-accent">{aiBusyProgress}%</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-app-fg">{aiPanelBusyState.label || "AI 生成中"}</div>
                    <div className="mt-1 text-xs text-app-muted">
                      已运行 {formatAiDuration(aiBusyElapsedSec)}
                      {typeof aiBusyRemainingSec === "number" ? ` · 预计剩余 ${formatAiDuration(aiBusyRemainingSec)}` : ""}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${aiBusyProgress}%` }} />
                      </div>
                      <div className="shrink-0 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
                        查看
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="fixed bottom-6 right-6 z-40">
              <button
                type="button"
                onClick={() => setAiTaskCenterOpen((prev) => !prev)}
                className="rounded-2xl border border-app-border/15 bg-app-elevated/95 px-4 py-3 text-sm font-medium text-app-fg shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              >
                任务中心 · {aiRecentTasks.length}
              </button>
            </div>
          )}
        </>
      )}

      {urlDialog.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-app-elevated/92 text-app-fg rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-app-border/15">
            <div className="flex items-center justify-between p-4 border-b border-app-border/12">
              <h2 className="text-lg font-bold">
                {urlDialog.kind === "model3d"
                  ? "替换 3D 模型"
                  : urlDialog.kind === "banner2d"
                    ? "替换 横幅"
                    : urlDialog.kind === "avatar2d"
                      ? "替换 人像贴图"
                      : "替换 2D 卡片"}
              </h2>
              <button
                onClick={closeUrlDialog}
                className="p-2 text-app-muted hover:text-app-fg hover:bg-app-surface/30 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-5 space-y-3">
              {urlDialog.kind === "model3d" ? (
                <>
                  <div className="inline-flex w-full items-center gap-1 rounded-full border border-app-border/12 bg-app-surface/20 p-1">
                    <button
                      type="button"
                      onClick={() => setModelDialogMode("library")}
                      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                        modelDialogMode === "library"
                          ? "bg-accent text-white shadow-[0_10px_25px_rgba(0,122,255,0.22)]"
                          : "text-app-muted hover:text-app-fg hover:bg-app-surface/30"
                      }`}
                    >
                      模型库
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelDialogMode("upload")}
                      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                        modelDialogMode === "upload"
                          ? "bg-accent text-white shadow-[0_10px_25px_rgba(0,122,255,0.22)]"
                          : "text-app-muted hover:text-app-fg hover:bg-app-surface/30"
                      }`}
                    >
                      上传 .glb
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelDialogMode("url")}
                      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                        modelDialogMode === "url"
                          ? "bg-accent text-white shadow-[0_10px_25px_rgba(0,122,255,0.22)]"
                          : "text-app-muted hover:text-app-fg hover:bg-app-surface/30"
                      }`}
                    >
                      粘贴 URL
                    </button>
                  </div>

                  <input
                    ref={modelLibraryFileRef}
                    type="file"
                    accept=".glb"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files.length ? e.target.files[0] : null;
                      if (!file) return;
                      setUrlDialogError("");
                      setModelLibraryUploading(true);
                      try {
                        const fd = new FormData();
                        fd.append("model", file);
                        const res = await fetch(`${API_BASE_URL}/api/model-library/upload`, {
                          method: "POST",
                          headers: withPluginTokenHeaders({}),
                          body: fd,
                        });
                        if (!res.ok) {
                          const t = await res.text().catch(() => "");
                          throw new Error(t || `HTTP ${res.status}`);
                        }
                        const j = await res.json().catch(() => ({}));
                        const urlPath = String((j as any)?.urlPath || "");
                        if (!urlPath) throw new Error("上传失败：缺少 urlPath");
                        const url = `${API_BASE_URL}${urlPath}`;
                        setUrlDialog((prev) => ({ ...prev, value: url }));
                        setModelDialogMode("url");
                        setModelLibraryItems((prev) => {
                          const name = file.name.replace(/\.glb$/i, "");
                          const item = { name, urlPath };
                          const next = [item, ...(prev || [])].filter(
                            (x, idx, arr) => arr.findIndex((y) => y.urlPath === x.urlPath) === idx,
                          );
                          return next;
                        });
                        void import("@google/model-viewer");
                      } catch (err: any) {
                        setUrlDialogError(err?.message ? String(err.message) : "上传失败");
                      } finally {
                        setModelLibraryUploading(false);
                        try {
                          (e.target as any).value = "";
                        } catch {}
                      }
                    }}
                  />

                  {urlDialogError ? (
                    <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {urlDialogError}
                    </div>
                  ) : null}

                  {modelDialogMode === "library" ? (
                    modelLibraryLoading ? (
                      <div className="rounded-2xl border border-app-border/12 bg-app-surface/15 px-4 py-6 text-center text-sm text-app-muted">
                        模型库加载中...
                      </div>
                    ) : modelLibraryItems.length ? (
                        <div className="grid grid-cols-3 gap-2">
                          {modelLibraryItems.slice(0, 24).map((m) => {
                            const url = `${API_BASE_URL}${m.urlPath}`;
                            return (
                              <button
                                key={m.urlPath}
                                type="button"
                                onClick={() => {
                                  setUrlDialog((prev) => ({ ...prev, value: url }));
                                  void import("@google/model-viewer");
                                }}
                                className="group relative aspect-square overflow-hidden rounded-2xl border border-app-border/12 bg-app-bg/20 hover:border-accent/35"
                                title={m.name}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {renderModelViewer(url, "h-full w-full pointer-events-none", "")}
                                <div className="absolute bottom-2 left-2 right-2 text-[11px] text-white/85 truncate">{m.name}</div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-app-border/12 bg-app-surface/15 px-4 py-6 text-center text-sm text-app-muted">
                          模型库暂无模型。你可以先上传一个 .glb，或把模型放进服务器的 glb 目录。
                        </div>
                      )
                  ) : modelDialogMode === "upload" ? (
                    <div className="rounded-2xl border border-app-border/12 bg-app-surface/15 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-app-fg">上传 .glb 到模型库</div>
                        <div className="text-xs text-app-muted">所有人可选</div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => modelLibraryFileRef.current?.click()}
                          disabled={modelLibraryUploading}
                          className="inline-flex items-center gap-2 rounded-xl border border-app-border/15 bg-app-surface/25 px-3 py-2 text-xs font-semibold text-app-fg hover:bg-app-surface/35 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {modelLibraryUploading ? "上传中..." : "选择 .glb 文件"}
                        </button>
                        <div className="min-w-0 text-xs text-app-muted truncate">
                          上传成功后会自动填入 URL，并可直接保存到该角色
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-app-muted">粘贴 .glb 模型 URL</div>
                      <input
                        value={urlDialog.value}
                        onChange={(e) => setUrlDialog((prev) => ({ ...prev, value: e.target.value }))}
                        placeholder="https://.../model.glb"
                        className="w-full bg-app-surface/40 text-app-fg border border-app-border/15 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-accent/50 placeholder:text-app-muted/60"
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="inline-flex w-full items-center gap-1 rounded-full border border-app-border/12 bg-app-surface/20 p-1">
                    <button
                      type="button"
                      onClick={() => setUrlDialogMode("local")}
                      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                        urlDialogMode === "local"
                          ? "bg-accent text-white shadow-[0_10px_25px_rgba(0,122,255,0.22)]"
                          : "text-app-muted hover:text-app-fg hover:bg-app-surface/30"
                      }`}
                    >
                      本地上传
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrlDialogMode("history")}
                      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                        urlDialogMode === "history"
                          ? "bg-accent text-white shadow-[0_10px_25px_rgba(0,122,255,0.22)]"
                          : "text-app-muted hover:text-app-fg hover:bg-app-surface/30"
                      }`}
                    >
                      从历史选择
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrlDialogMode("url")}
                      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                        urlDialogMode === "url"
                          ? "bg-accent text-white shadow-[0_10px_25px_rgba(0,122,255,0.22)]"
                          : "text-app-muted hover:text-app-fg hover:bg-app-surface/30"
                      }`}
                    >
                      粘贴 URL
                    </button>
                  </div>

                  {urlDialogError ? (
                    <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {urlDialogError}
                    </div>
                  ) : null}

                  {urlDialogMode === "local" ? (
                    <div className="rounded-2xl border border-app-border/12 bg-app-surface/15 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-app-fg">选择本地图片</div>
                        <div className="text-xs text-app-muted">PNG/JPG/WebP</div>
                      </div>
                      <input
                        ref={urlDialogFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files && e.target.files.length ? e.target.files[0] : null;
                          setUrlDialogLocalFile(f);
                          if (f) setUrlDialogError("");
                        }}
                      />
                      <input
                        ref={urlDialogFolderInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        {...({ webkitdirectory: true } as any)}
                        onChange={(e) => {
                          const f = e.target.files && e.target.files.length ? e.target.files[0] : null;
                          setUrlDialogLocalFile(f);
                          if (f) setUrlDialogError("");
                        }}
                      />
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => urlDialogFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-xl border border-app-border/15 bg-app-surface/25 px-3 py-2 text-xs font-semibold text-app-fg hover:bg-app-surface/35"
                        >
                          选择图片
                        </button>
                        <button
                          type="button"
                          onClick={() => urlDialogFolderInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-xl border border-app-border/15 bg-app-surface/25 px-3 py-2 text-xs font-semibold text-app-fg hover:bg-app-surface/35"
                        >
                          选择文件夹
                        </button>
                        <div className="min-w-0 text-xs text-app-muted truncate">
                          {urlDialogFile ? urlDialogFile.name : "未选择图片"}
                        </div>
                      </div>
                      {urlDialogFilePreviewUrl ? (
                        <div className="mt-3 overflow-hidden rounded-2xl border border-app-border/12 bg-app-bg/25">
                          <img src={urlDialogFilePreviewUrl} className="w-full max-h-[260px] object-contain" />
                        </div>
                      ) : null}
                    </div>
                  ) : urlDialogMode === "history" ? (
                    recentImages.length ? (
                      <div className="grid grid-cols-2 gap-2">
                        {recentImages.slice(0, 24).map((x) => {
                          const u = String(x.url || "");
                          const active = u && u === urlDialogHistoryUrl;
                          return (
                            <button
                              key={u}
                              type="button"
                              onClick={() => {
                                setUrlDialogHistoryUrl(u);
                                setUrlDialogError("");
                              }}
                              className={`group relative overflow-hidden rounded-2xl border ${
                                active ? "border-accent/55" : "border-app-border/12"
                              } bg-app-bg/20 hover:border-accent/35`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <img src={u} className="h-32 w-full object-cover" />
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                                <span className="truncate text-[11px] text-white/85">{active ? "已选择" : "点击选择"}</span>
                                <span className="text-[11px] text-white/70">{new Date(Number(x.ts || 0)).toLocaleDateString()}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-app-border/12 bg-app-surface/15 px-4 py-6 text-center text-sm text-app-muted">
                        暂无历史图片。你可以先用 AI 工坊生成一张 2D 图，或用本地上传。
                      </div>
                    )
                  ) : (
                    <>
                      <div className="text-sm text-app-muted">
                        {urlDialog.kind === "avatar2d"
                          ? "粘贴透明背景 PNG（推荐），用于横幅右侧人物叠加"
                          : "粘贴图片 URL"}
                      </div>
                      <input
                        value={urlDialog.value}
                        onChange={(e) => setUrlDialog((prev) => ({ ...prev, value: e.target.value }))}
                        placeholder="https://.../image.png"
                        className="w-full bg-app-surface/40 text-app-fg border border-app-border/15 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-accent/50 placeholder:text-app-muted/60"
                      />
                    </>
                  )}

                  <div className="text-xs text-app-muted">
                    保存后会自动转存到 COS（更稳定），然后替换到当前角色素材。
                  </div>
                </>
              )}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={closeUrlDialog}
                  className="px-4 py-2 rounded-xl bg-app-surface/25 hover:bg-app-surface/40 text-app-fg border border-app-border/15"
                >
                  取消
                </button>
                <button
                  onClick={submitUrlDialog}
                  disabled={
                    urlDialogBusy ||
                    (urlDialog.kind === "model3d"
                      ? !String(urlDialog.value || "").trim()
                      : urlDialogMode === "local"
                        ? !urlDialogFile
                        : urlDialogMode === "history"
                          ? !String(urlDialogHistoryUrl || "").trim()
                          : !String(urlDialog.value || "").trim())
                  }
                  className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-[#005BB5] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {urlDialogBusy ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {appearanceDialog.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-app-elevated/92 text-app-fg rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-app-border/15">
            <div className="flex items-center justify-between p-4 border-b border-app-border/12">
              <h2 className="text-lg font-bold">主角外观设定</h2>
              <button
                onClick={closeAppearanceDialog}
                className="p-2 text-app-muted hover:text-app-fg hover:bg-app-surface/30 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-4">
              <div className="text-sm text-app-muted mb-2">建议写清楚：发型、发色、眼睛、服装、年龄感、体型、气质关键词（越具体越一致）。</div>
              <textarea
                rows={5}
                value={appearanceDialog.value}
                onChange={(e) => setAppearanceDialog((prev) => ({ ...prev, value: e.target.value }))}
                placeholder="例如：黑色短发、单侧刘海；灰蓝色眼睛；黑色连帽卫衣+深色工装裤；18-22岁；瘦高；冷静克制。"
                className="w-full p-4 bg-[#131313] text-app-fg border border-white/10 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 resize-none outline-none text-base transition-all placeholder-app-muted"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={closeAppearanceDialog}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-app-fg hover:bg-white/10"
                >
                  取消
                </button>
                <button
                  onClick={submitAppearanceDialog}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-gray-200 font-bold"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 商城功能暂时停用；保留实现以维持既有计费接口兼容。 */}
      {false && ADMIN_UI && isTokenDialogOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-app-elevated/92 text-app-fg rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-app-border/15">
            <div className="flex items-center justify-between p-4 border-b border-app-border/12">
              <h2 className="text-lg font-bold">商城</h2>
              <button
                onClick={() => setIsTokenDialogOpen(false)}
                className="p-2 text-app-muted hover:text-app-fg hover:bg-app-surface/30 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              {isGuest ? (
                <div className="rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/10 px-4 py-3 text-sm text-app-fg">
                  游客可查看商城内容；兑换码充值、在线购买与点数使用需注册后开启。
                </div>
              ) : null}
              <div className="rounded-xl border border-app-border/15 bg-app-surface/18 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-app-muted">点数余额</div>
                    <div className="text-lg font-bold">
                      {billingBalanceLoading ? "加载中..." : billingBalanceError ? "—" : String(billingBalance ?? 0)}
                    </div>
                  </div>
                  <button
                    onClick={() => void refreshBillingBalance()}
                    className="text-sm px-3 py-1.5 rounded-lg bg-app-surface/25 hover:bg-app-surface/40 text-app-fg border border-app-border/15"
                  >
                    刷新
                  </button>
                </div>
                {billingBalanceError && (
                  <div className="mt-2 text-xs text-rose-300/90">{billingBalanceError}</div>
                )}
              </div>
              <div className="rounded-xl border border-app-border/15 bg-app-surface/18 p-4 space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold flex items-center gap-2">
                    <span>💳</span> 使用兑换码 / 卡密充值
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="请输入兑换码 (如 TEST-1000)"
                      value={redeemCode}
                      onChange={(e) => setRedeemCode(e.target.value)}
                      disabled={isGuest}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                    <button
                      onClick={handleRedeem}
                      disabled={isGuest || isRedeeming || !redeemCode.trim()}
                      className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all text-sm shrink-0"
                    >
                      {isRedeeming ? "兑换中..." : "立即兑换"}
                    </button>
                  </div>
                  <p className="text-[11px] text-app-muted/60">获取兑换码请联系管理员或前往发卡平台购买。</p>
                </div>
              </div>

              <div className="rounded-xl border border-app-border/15 bg-app-surface/18 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold flex items-center gap-2">
                    <span>🛍️</span> 在线充值套餐
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-xs text-app-muted/80">
                    购买点数用于 AI 生成。充值系统为模拟测试模式（1元 = 100积分）。
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleMockRecharge(10)}
                      disabled={isGuest || isRecharging}
                      className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-app-border/15 bg-app-surface/30 hover:bg-app-surface/50 hover:border-accent/50 transition-colors disabled:opacity-50"
                    >
                      <div className="text-lg font-bold">1000 点</div>
                      <div className="text-sm text-app-muted">￥ 10.00</div>
                    </button>
                    <button 
                      onClick={() => handleMockRecharge(30)}
                      disabled={isGuest || isRecharging}
                      className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-accent/40 bg-accent/10 hover:bg-accent/20 transition-colors relative overflow-hidden disabled:opacity-50"
                    >
                      <div className="absolute top-0 right-0 bg-accent text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">推荐</div>
                      <div className="text-lg font-bold text-accent">3500 点</div>
                      <div className="text-sm text-accent/80">￥ 30.00</div>
                    </button>
                    <button 
                      onClick={() => handleMockRecharge(50)}
                      disabled={isGuest || isRecharging}
                      className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-app-border/15 bg-app-surface/30 hover:bg-app-surface/50 hover:border-accent/50 transition-colors disabled:opacity-50"
                    >
                      <div className="text-lg font-bold">6000 点</div>
                      <div className="text-sm text-app-muted">￥ 50.00</div>
                    </button>
                  </div>
                  
                  <div className="pt-2 border-t border-app-border/10">
                    <div className="text-xs text-app-muted mb-2">自定义充值金额 (整数)</div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted">￥</span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="请输入金额"
                          value={customRechargeAmount}
                          onChange={(e) => setCustomRechargeAmount(e.target.value)}
                          disabled={isGuest}
                          className="w-full bg-app-bg/50 border border-app-border/15 rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const amount = parseInt(customRechargeAmount);
                          if (isNaN(amount) || amount <= 0) {
                            alert("请输入大于0的整数金额");
                            return;
                          }
                          handleMockRecharge(amount);
                        }}
                        disabled={isGuest || isRecharging || !customRechargeAmount}
                        className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {isRecharging ? "处理中" : `购买 ${parseInt(customRechargeAmount || "0") * 100}点`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {distillResultCard && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-[#1a1c2c] to-[#0d0e15] border border-cyan-500/30 rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.2)] animate-in zoom-in-95 duration-500">
            <div className="relative p-8 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                <svg className="w-12 h-12 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-200 mb-3 tracking-wide drop-shadow-lg">
                  【{distillResultCard.title}】
                </h3>
                <p className="text-sm text-cyan-100/90 mb-8 leading-relaxed px-2">
                  {distillResultCard.desc}
                </p>
                <button
                  onClick={() => setDistillResultCard(null)}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95"
                >
                  收下卡片
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {guestUpgradeDialogOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="px-6 pt-6 pb-4 border-b border-black/5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">转正式账号</h2>
              <button
                type="button"
                onClick={() => setGuestUpgradeDialogOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border border-[#007AFF]/10 bg-[#f6fbff] px-4 py-3 text-sm text-slate-600 leading-relaxed mb-6">
                只需填写邮箱。系统会发送一封注册/登录链接到你的邮箱，点开后自动进入正式账号，并保留你当前的游客卡片，无需重新回答问题。
              </div>
              <form onSubmit={handleGuestUpgradeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">邮箱</label>
                  <input
                    type="email"
                    required
                    value={guestUpgradeEmail}
                    onChange={(e) => setGuestUpgradeEmail(e.target.value)}
                    placeholder="请输入邮箱地址"
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:border-[#007AFF] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={guestUpgradeLoading || guestUpgradeCooldown > 0 || !guestUpgradeEmail.trim()}
                  className="w-full rounded-xl bg-[#007AFF] text-white py-3.5 font-bold tracking-wide hover:bg-[#0066d6] disabled:opacity-60 transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)]"
                >
                  {guestUpgradeLoading
                    ? "处理中..."
                    : guestUpgradeCooldown > 0
                      ? `请等待 ${guestUpgradeCooldown}s`
                      : "发送注册链接"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [targetName, setTargetName] = useState<string>("AI Character");
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<string>("[]");
  const [initialMeAvatarUrl, setInitialMeAvatarUrl] = useState<string>("");
  const [initialOtherAvatarUrl, setInitialOtherAvatarUrl] = useState<string>("");
  const [chatSourceKind, setChatSourceKind] = useState<"resonance" | "legacy" | "conversation">("legacy");
  const [, setChatMode] = useState<SharedConversationMode>("agent");
  const [chatStatus, setChatStatus] = useState<string>("active");
  const [chatBannerText, setChatBannerText] = useState("你现在正在和对方的 AI 代理聊天，对方本人暂未接管。");
  const [chatBannerTitle, setChatBannerTitle] = useState("AI 代理在线");
  const [chatBannerClass, setChatBannerClass] = useState("border-cyan-300/30 bg-cyan-500/15 text-cyan-100");
  const [selfPersonaId, setSelfPersonaId] = useState("");
  const [otherPersonaId, setOtherPersonaId] = useState("");
  const [chatBannerOpen, setChatBannerOpen] = useState(true);
  const syncedCountRef = useRef(0);

  const exitChat = (mode: "back" | "close") => {
    const embedded = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();
    if (embedded) {
      try {
        window.parent?.postMessage({ type: "AI_APP_EXIT", mode, source: "chat" }, "*");
      } catch {}
    }
    if (mode === "back") {
      if (window.history.length > 1) {
        navigate(-1);
        return;
      }
    }
    navigate("/");
  };

  useEffect(() => {
    let cancelled = false;
    const readVisualAssets = () => {
      try {
        const raw = localStorage.getItem("persona-visual-assets:v1");
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return {};
      }
    };
    const getLocalAvatarUrl = (personaId: string) => {
      const visualMap = readVisualAssets() as Record<string, any>;
      const localVisual = visualMap?.[String(personaId || "")] || {};
      const localAvatar = localVisual.avatar2dUrl || localVisual.cover2dUrl;
      return typeof localAvatar === "string" ? String(localAvatar) : "";
    };
    const loadAvatarUrl = async (personaId: string, fallback?: string) => {
      const localAvatar = getLocalAvatarUrl(personaId);
      if (localAvatar) return localAvatar;
      if (fallback) return String(fallback);
      try {
        const { data } = await supabase
          .from("personas")
          .select("card_cover_url, avatar_2d_url")
          .eq("id", personaId)
          .maybeSingle();
        return data?.card_cover_url
          ? String(data.card_cover_url)
          : data?.avatar_2d_url
            ? String(data.avatar_2d_url)
            : "";
      } catch {
        return "";
      }
    };

    const migrateLegacyChatIfPossible = async (legacyRow: any, sessionUserId: string) => {
      const selfPersonaId = String(legacyRow?.persona_id || "").trim();
      const targetName = String(legacyRow?.target_desc || "").trim();
      if (!selfPersonaId || !targetName) return null;

      const { data: selfPersona, error: selfErr } = await supabase
        .from("personas")
        .select("id, user_id, name, card_cover_url, avatar_2d_url")
        .eq("id", selfPersonaId)
        .maybeSingle();
      if (selfErr || !selfPersona) return null;
      if (sessionUserId && String((selfPersona as any)?.user_id || "").trim() !== sessionUserId) return null;

      const { data: targetRows, error: targetErr } = await supabase
        .from("personas")
        .select("id, user_id, name, card_cover_url, avatar_2d_url")
        .eq("name", targetName)
        .limit(1);
      if (targetErr || !Array.isArray(targetRows) || !targetRows.length) return null;

      const targetPersona = targetRows[0] as any;
      const targetPersonaId = String(targetPersona?.id || "").trim();
      if (!targetPersonaId || targetPersonaId === selfPersonaId) return null;

      const [lowId, highId] = getOrderedPersonaPair(selfPersonaId, targetPersonaId);
      if (!lowId || !highId) return null;

      const normalizedHistory = JSON.parse(buildLegacyChatHistoryJson(legacyRow?.history || "[]"));
      const lastMessage = Array.isArray(normalizedHistory) && normalizedHistory.length
        ? normalizedHistory[normalizedHistory.length - 1]
        : null;
      const lastContent = String(lastMessage?.content || "").trim();
      const lastSenderPersonaId = lastMessage?.role === "user" ? selfPersonaId : targetPersonaId;

      let conversationId = "";
      const { data: existingConversation, error: existingErr } = await supabase
        .from("conversations")
        .select("id")
        .eq("participant_low_persona_id", lowId)
        .eq("participant_high_persona_id", highId)
        .maybeSingle();
      if (existingErr && !shouldSilenceSupabaseError(existingErr, "conversations")) throw existingErr;
      if (existingConversation?.id) {
        conversationId = String(existingConversation.id);
      } else {
        const { data: insertedConversation, error: insertErr } = await supabase
          .from("conversations")
          .insert({
            participant_a_persona_id: selfPersonaId,
            participant_b_persona_id: targetPersonaId,
            participant_low_persona_id: lowId,
            participant_high_persona_id: highId,
            created_by_persona_id: selfPersonaId,
            current_mode: "agent",
            status: "active",
            last_message_preview: lastContent || "已从旧版聊天迁移",
            last_message_at: legacyRow?.updated_at || legacyRow?.created_at || new Date().toISOString(),
            last_sender_persona_id: lastContent ? lastSenderPersonaId : selfPersonaId,
          })
          .select("id")
          .maybeSingle();
        if (insertErr && !shouldSilenceSupabaseError(insertErr, "conversations")) throw insertErr;
        conversationId = String(insertedConversation?.id || "").trim();
      }
      if (!conversationId) return null;

      const { count: existingCount, error: countErr } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId);
      if (countErr && !shouldSilenceSupabaseError(countErr, "chat_messages")) throw countErr;

      if ((existingCount || 0) === 0 && Array.isArray(normalizedHistory) && normalizedHistory.length) {
        const payload = normalizedHistory
          .map((item: any, idx: number) => {
            const role = item?.role === "user" ? "user" : "assistant";
            const content = String(item?.content || "").trim();
            if (!content) return null;
            return {
              conversation_id: conversationId,
              sender_persona_id: role === "user" ? selfPersonaId : targetPersonaId,
              sender_kind: role === "user" ? "human" : "agent",
              content,
              meta: { source: "legacy_chat_migration", legacy_chat_id: legacyRow?.id, order: idx + 1 },
            };
          })
          .filter(Boolean);
        if (payload.length) {
          const { error: insertMsgErr } = await supabase.from("chat_messages").insert(payload as any);
          if (insertMsgErr && !shouldSilenceSupabaseError(insertMsgErr, "chat_messages")) throw insertMsgErr;
        }
      }

      return {
        conversationId,
        selfPersonaId,
        targetPersonaId,
        targetName,
        selfPersona,
        targetPersona,
      };
    };

    const fetchChat = async () => {
      if (id === "resonance") {
        if (cancelled) return;
        setTargetName("Resonance Demo");
        setChatSourceKind("resonance");
        setChatBannerTitle("AI 共鸣");
        setChatBannerText("当前为 AI 共鸣演示模式，你正在直接和 AI 聊天。");
        setChatBannerClass("border-fuchsia-300/30 bg-fuchsia-500/15 text-fuchsia-100");
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUserId = String(sessionData?.session?.user?.id || "").trim();

      try {
        const { data: conversation, error: conversationErr } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (conversationErr && !shouldSilenceSupabaseError(conversationErr, "conversations")) {
          console.error("读取 conversations 失败", conversationErr);
        }
        if (!conversationErr && conversation) {
          const conv = conversation as SharedConversationRecord;
          const participantIds = [conv.participant_a_persona_id, conv.participant_b_persona_id].filter(Boolean);
          const { data: personaRows } = await supabase
            .from("personas")
            .select("id, user_id, name, model_3d_url, card_cover_url, avatar_2d_url")
            .in("id", participantIds as any);
          const rows = Array.isArray(personaRows) ? personaRows : [];
          const selfPersona =
            rows.find((p: any) => String(p?.user_id || "").trim() === sessionUserId) ||
            rows.find((p: any) => String(p?.id || "").trim() === String(conv.participant_a_persona_id || "").trim()) ||
            rows[0];
          const otherPersona =
            rows.find((p: any) => String(p?.id || "").trim() !== String(selfPersona?.id || "").trim()) || rows[0];
          const resolvedSelfId = String(selfPersona?.id || "").trim();
          const resolvedOtherId = String(otherPersona?.id || "").trim();
          const otherName = String(otherPersona?.name || "对方").trim() || "对方";
          const selfIsA = resolvedSelfId === String(conv.participant_a_persona_id || "").trim();
          const otherHumanJoined = selfIsA ? Boolean(conv.human_joined_b) : Boolean(conv.human_joined_a);
          const otherAgentEnabled = selfIsA ? Boolean(conv.agent_enabled_b ?? true) : Boolean(conv.agent_enabled_a ?? true);
          const mode = conv.current_mode === "human" || conv.current_mode === "mixed" ? conv.current_mode : "agent";
          const modeCopy = buildConversationModeCopy(mode, conv.status, otherName, otherHumanJoined, otherAgentEnabled);

          const { data: messageRows, error: messageErr } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: true });
          if (messageErr && !shouldSilenceSupabaseError(messageErr, "chat_messages")) {
            console.error("读取 chat_messages 失败", messageErr);
          }
          const normalizedMessages = Array.isArray(messageRows) ? (messageRows as SharedChatMessageRecord[]) : [];
          const historyJson = buildConversationHistoryJson(normalizedMessages, resolvedSelfId, resolvedOtherId);
          syncedCountRef.current = normalizedMessages.length;

          const myAvatar = resolvedSelfId
            ? await loadAvatarUrl(resolvedSelfId, selfPersona?.card_cover_url || selfPersona?.avatar_2d_url)
            : "";
          const otherAvatar = resolvedOtherId
            ? await loadAvatarUrl(resolvedOtherId, otherPersona?.card_cover_url || otherPersona?.avatar_2d_url)
            : "";
          if (cancelled) return;
          setTargetName(otherName);
          setChatHistory(historyJson);
          setInitialMeAvatarUrl(myAvatar);
          setInitialOtherAvatarUrl(otherAvatar);
          setChatSourceKind("conversation");
          setChatMode(mode);
          setChatStatus(String(conv.status || "active"));
          setChatBannerTitle(modeCopy.title);
          setChatBannerText(modeCopy.text);
          setChatBannerClass(modeCopy.chipClass);
          setSelfPersonaId(resolvedSelfId);
          setOtherPersonaId(resolvedOtherId);
          setLoading(false);
          return;
        }
      } catch (e) {
        if (!shouldSilenceSupabaseError(e)) {
          console.error("共享会话读取失败，准备回退旧聊天", e);
        }
      }

      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        try {
          const migrated = await migrateLegacyChatIfPossible(data, sessionUserId);
          if (migrated?.conversationId) {
            navigate(`/chat/${migrated.conversationId}`, { replace: true });
            return;
          }
        } catch (migrationErr) {
          if (!shouldSilenceSupabaseError(migrationErr)) {
            console.error("旧聊天迁移失败，继续使用兼容模式", migrationErr);
          }
        }
        const tn = String(data.target_desc || "AI Character");
        const historyJson = buildLegacyChatHistoryJson(data.history || "");
        const legacyMessages = JSON.parse(historyJson);
        syncedCountRef.current = Array.isArray(legacyMessages) ? legacyMessages.length : 0;
        setTargetName(tn);
        setChatHistory(historyJson);
        setSelfPersonaId(String(data.persona_id || "").trim());
        setOtherPersonaId("");
        setChatSourceKind("legacy");
        setChatMode("agent");
        setChatStatus("legacy");
        setChatBannerTitle("旧版聊天");
        setChatBannerText("当前是旧版聊天记录，暂按“对方 Agent”展示；建好新表后，新会话会自动升级为双方共享聊天。");
        setChatBannerClass("border-white/15 bg-white/10 text-white");
        const pid = String(data.persona_id || "").trim();
        if (pid) {
          const avatarUrl = await loadAvatarUrl(pid);
          if (!cancelled) setInitialMeAvatarUrl(avatarUrl);
        }

        try {
          const { data: rows, error: perr } = await supabase
            .from("personas")
            .select("id, card_cover_url, avatar_2d_url")
            .eq("name", tn)
            .limit(1);
          if (!perr && Array.isArray(rows) && rows.length > 0) {
            const rid = rows[0]?.id != null ? String(rows[0].id) : "";
            const u = rid ? await loadAvatarUrl(rid, rows[0]?.card_cover_url || rows[0]?.avatar_2d_url) : "";
            if (!cancelled) setInitialOtherAvatarUrl(u);
          } else if (!cancelled) {
            setInitialOtherAvatarUrl("");
          }
        } catch {
          if (!cancelled) setInitialOtherAvatarUrl("");
        }
      }
      if (!cancelled) setLoading(false);
    };

    void fetchChat();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setChatBannerOpen(true);
  }, [id, chatBannerTitle, chatBannerText]);

  useEffect(() => {
    if (!id || id === "resonance" || chatSourceKind !== "conversation") return;
    let stopped = false;
    const syncConversation = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const sessionUserId = String(sessionData?.session?.user?.id || "").trim();
        const { data: conversation, error: conversationErr } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (conversationErr || !conversation) return;
        const conv = conversation as SharedConversationRecord;
        const participantIds = [conv.participant_a_persona_id, conv.participant_b_persona_id].filter(Boolean);
        const { data: personaRows } = await supabase
          .from("personas")
          .select("id, user_id, name")
          .in("id", participantIds as any);
        const rows = Array.isArray(personaRows) ? personaRows : [];
        const selfPersona =
          rows.find((p: any) => String(p?.user_id || "").trim() === sessionUserId) ||
          rows.find((p: any) => String(p?.id || "").trim() === String(conv.participant_a_persona_id || "").trim()) ||
          rows[0];
        const otherPersona =
          rows.find((p: any) => String(p?.id || "").trim() !== String(selfPersona?.id || "").trim()) || rows[0];
        const resolvedSelfId = String(selfPersona?.id || "").trim();
        const resolvedOtherId = String(otherPersona?.id || "").trim();
        const otherName = String(otherPersona?.name || targetName || "对方").trim() || "对方";
        const selfIsA = resolvedSelfId === String(conv.participant_a_persona_id || "").trim();
        const otherHumanJoined = selfIsA ? Boolean(conv.human_joined_b) : Boolean(conv.human_joined_a);
        const otherAgentEnabled = selfIsA ? Boolean(conv.agent_enabled_b ?? true) : Boolean(conv.agent_enabled_a ?? true);
        const mode = conv.current_mode === "human" || conv.current_mode === "mixed" ? conv.current_mode : "agent";
        const modeCopy = buildConversationModeCopy(mode, conv.status, otherName, otherHumanJoined, otherAgentEnabled);

        const { data: messageRows } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: true });
        const normalizedMessages = Array.isArray(messageRows) ? (messageRows as SharedChatMessageRecord[]) : [];
        if (stopped) return;
        syncedCountRef.current = normalizedMessages.length;
        setChatHistory(buildConversationHistoryJson(normalizedMessages, resolvedSelfId, resolvedOtherId));
        setChatMode(mode);
        setChatStatus(String(conv.status || "active"));
        setChatBannerTitle(modeCopy.title);
        setChatBannerText(modeCopy.text);
        setChatBannerClass(modeCopy.chipClass);
      } catch {}
    };

    const timer = window.setInterval(() => {
      void syncConversation();
    }, 6000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [id, chatSourceKind, targetName]);

  const messagesJson = useMemo(() => {
    if (!chatHistory) return "[]";
    try {
      const parsed = JSON.parse(chatHistory);
      return JSON.stringify(Array.isArray(parsed) ? parsed : []);
    } catch {
      return buildLegacyChatHistoryJson(chatHistory);
    }
  }, [chatHistory]);

  if (loading) {
    return <div className="h-screen w-full bg-black flex items-center justify-center text-white">加载中...</div>;
  }

  return (
    <div className="h-screen w-full bg-black relative">
      <div className="absolute top-4 left-4 right-4 z-[120] flex items-start justify-between gap-3 pointer-events-none">
        <button
          onClick={() => exitChat("close")}
          className="pointer-events-auto bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full backdrop-blur-md transition-colors flex items-center gap-2 text-white text-sm font-semibold border border-white/10"
          title="退出"
        >
          退出
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div className="pointer-events-auto ml-auto flex items-start gap-2">
          {!chatBannerOpen ? (
            <button
              type="button"
              onClick={() => setChatBannerOpen(true)}
              className="rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[12px] font-semibold text-white backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:bg-black/50 transition-colors"
              title="展开聊天状态"
            >
              聊天状态
            </button>
          ) : null}
          {chatBannerOpen ? (
            <div className="max-w-[min(70vw,360px)] rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${chatBannerClass}`}>
                      {chatBannerTitle}
                    </div>
                    {chatSourceKind === "conversation" ? (
                      <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                        共享会话
                      </div>
                    ) : chatSourceKind === "legacy" ? (
                      <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                        旧版兼容
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-1 text-[12px] leading-5 text-white/75">{chatBannerText}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatBannerOpen(false)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  title="隐藏聊天状态"
                >
                  隐藏
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <ResonanceDemo
        targetName={targetName}
        chatHistory={messagesJson}
        chatId={id !== "resonance" ? id : undefined}
        isWebComponent={false}
        apiBaseUrl={API_BASE_URL}
        initialMeAvatarUrl={initialMeAvatarUrl || undefined}
        initialOtherAvatarUrl={initialOtherAvatarUrl || undefined}
        initialSendMode={chatSourceKind === "conversation" && String(chatStatus || "").toLowerCase().includes("automation_running") ? "auto" : "user"}
        onAutomationCommand={async (command) => {
          if (!id || chatSourceKind !== "conversation") return;
          const { data: sessionData } = await supabase.auth.getSession();
          const token = String(sessionData?.session?.access_token || "").trim();
          if (!token) {
            console.error("缺少登录态，无法切换 AI 托管");
            return;
          }
          const endpoint =
            command === "start"
              ? `${API_BASE_URL}/api/conversations/${encodeURIComponent(id)}/automation/start`
              : `${API_BASE_URL}/api/conversations/${encodeURIComponent(id)}/automation/stop`;
          const body = command === "start" ? {} : { action: command === "takeover" ? "takeover" : "stop" };
          const res = await fetch(endpoint, {
            method: "POST",
            headers: withPluginTokenHeaders({
              "content-type": "application/json",
              authorization: `Bearer ${token}`,
            }),
            body: JSON.stringify(body),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            console.error("切换 AI 托管失败", data);
            return;
          }
          if (command === "start") {
            const modeCopy = buildConversationModeCopy("agent", "automation_running", targetName, false, true);
            setChatMode("agent");
            setChatStatus("automation_running");
            setChatBannerTitle(modeCopy.title);
            setChatBannerText(modeCopy.text);
            setChatBannerClass(modeCopy.chipClass);
            return;
          }
          if (command === "takeover") {
            const modeCopy = buildConversationModeCopy("human", "active", targetName, false, false);
            setChatMode("human");
            setChatStatus("active");
            setChatBannerTitle(modeCopy.title);
            setChatBannerText(modeCopy.text);
            setChatBannerClass(modeCopy.chipClass);
            return;
          }
          const modeCopy = buildConversationModeCopy("agent", "active", targetName, false, true);
          setChatMode("agent");
          setChatStatus("active");
          setChatBannerTitle(modeCopy.title);
          setChatBannerText(modeCopy.text);
          setChatBannerClass(modeCopy.chipClass);
        }}
        onHistoryChange={async (newHistory: string) => {
          setChatHistory(newHistory);
          if (id === "resonance") return;
          if (chatSourceKind === "conversation" && id) {
            try {
              const parsed = JSON.parse(newHistory);
              const rows = Array.isArray(parsed) ? parsed : [];
              if (rows.length <= syncedCountRef.current) return;
              const appended = rows.slice(syncedCountRef.current);
              const payload = appended.map((item: any) => ({
                conversation_id: id,
                sender_persona_id: item?.role === "user" ? (selfPersonaId || null) : (otherPersonaId || null),
                sender_kind: item?.role === "user" ? "human" : "agent",
                content: String(item?.content || ""),
                meta: item?.audio ? { audio: item.audio } : {},
              }));
              if (!payload.length) return;
              const { error } = await supabase.from("chat_messages").insert(payload as any);
              if (error) throw error;
              syncedCountRef.current = rows.length;
              return;
            } catch (e: any) {
              console.error("共享聊天写入失败", e);
              return;
            }
          }
          if (id) {
            await supabase
              .from("chats")
              .update({ history: newHistory })
              .eq("id", id);
          }
        }}
      />
    </div>
  );
}

export const MBTI_PROFILES = [
  { mbti: "INTJ", title: "建筑师", desc: "富有想象力和战略性的思想家，一切皆在计划之中。" },
  { mbti: "INTP", title: "辩论家", desc: "聪明好奇的思想者，永远无法抵抗智力挑战。" },
  { mbti: "ENTJ", title: "指挥官", desc: "大胆、富有想象力且意志强大的领导者，总能找到或创造解决办法。" },
  { mbti: "ENTP", title: "创新者", desc: "聪明好奇的思想者，永远无法抵抗智力挑战。" },
  { mbti: "INFJ", title: "守卫者", desc: "安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。" },
  { mbti: "INFP", title: "竞选者", desc: "热情、有创造力且善于社交的自由精神，总能找到微笑的理由。" },
  { mbti: "ENFJ", title: "提倡者", desc: "富有魅力且鼓舞人心的领导者，有使听众着迷的能力。" },
  { mbti: "ENFP", title: "追梦人", desc: "热情、有创造力且善于社交的自由精神，总能找到微笑的理由。" },
  { mbti: "ISTJ", title: "鉴赏家", desc: "非常专注和热情的保护者，随时准备保卫他们爱着的人们。" },
  { mbti: "ISFJ", title: "探险家", desc: "大胆而实际的实验家，掌握所有工具的大师。" },
  { mbti: "ESTJ", title: "总经理", desc: "出色的管理者，在管理事物或人的方面无与伦比。" },
  { mbti: "ESFJ", title: "执政官", desc: "极有同情心、爱交往和受欢迎的人，总是热心提供帮助。" },
  { mbti: "ISTP", title: "巧匠", desc: "大胆而实际的实验家，掌握所有工具的大师。" },
  { mbti: "ISFP", title: "艺术家", desc: "灵活有魅力的艺术家，时刻准备着探索和体验新鲜事物。" },
  { mbti: "ESTP", title: "企业家", desc: "聪明、精力充沛且非常敏锐的人，真正享受生活在边缘。" },
  { mbti: "ESFP", title: "表演者", desc: "自发、精力充沛且热情的表演者——生活在他们周围永不无聊。" }
];

export const SBTI_PROFILES = [
  { keywords: ["内卷", "卷王", "加班", "奋斗", "拼命"], title: "SBTI卷王", desc: "在激烈的竞争中脱颖而出，以极致的效率碾压一切。" },
  { keywords: ["摸鱼", "躺平", "随性", "划水", "摆烂"], title: "SBTI摸鱼达人", desc: "深谙职场生存之道，在繁忙中找到属于自己的宁静角落。" },
  { keywords: ["破冰", "社交", "主动", "社牛", "外向"], title: "SBTI社交悍匪", desc: "无惧任何尴尬场合，天生的破冰者与话题引擎。" },
  { keywords: ["社恐", "独处", "孤狼", "内向", "自闭"], title: "SBTI独行侠", desc: "享受孤独的自由，在自我世界中汲取最纯粹的能量。" },
  { keywords: ["回避", "退让", "妥协", "和气", "息事宁人"], title: "SBTI和平使者", desc: "化解干戈，以柔克刚，在冲突中寻找最大的公约数。" },
  { keywords: ["端水", "中立", "高情商", "八面玲珑"], title: "SBTI端水大师", desc: "游刃有余地处理复杂人际关系，永远保持微妙的平衡。" },
  { keywords: ["情绪稳定", "冷静", "泰山崩于前", "佛系", "松弛"], title: "SBTI情绪稳定器", desc: "内核稳如老狗，不管外界如何发疯，依然岿然不动。" },
  { keywords: ["画饼", "大局观", "愿景", "忽悠", "展望"], title: "SBTI画饼大师", desc: "精通PPT驱动与未来展望，用语言构建宏大的空中楼阁。" },
  { keywords: ["抬杠", "反驳", "较真", "挑刺", "辩论"], title: "SBTI杠精本精", desc: "只要你开口，我就有话说，在辩论中寻找存在的意义。" },
  { keywords: ["细节", "强迫症", "完美主义", "死磕", "极致"], title: "SBTI细节狂魔", desc: "像素级对齐的捍卫者，眼里容不下一粒沙子的完美主义。" },
  { keywords: ["背锅", "大冤种", "心累", "打工人", "卑微"], title: "SBTI天选打工人", desc: "常在河边走，哪有不背锅，默默承受生活重击的坚韧打工人。" },
  { keywords: ["乐天", "开心", "治愈", "阳光", "傻白甜"], title: "SBTI向日葵", desc: "行走的向日葵，用没心没肺的笑容治愈一切精神内耗。" },
  { keywords: ["维权", "底线", "边界感", "原则", "sbti"], title: "SBTI行者", desc: "在职场与生活中保持清醒的边界，知退进，明得失。" }
];

export function getPersonaTitle(p: { mbti_type?: string | null; custom_traits?: string | null } | null): string {
  if (!p) return "";
  const combinedTraits = ((p.mbti_type || "") + (p.custom_traits || "")).toLowerCase();
  
  // 优先级调整：优先展示 MBTI 称号
  if (p.mbti_type) {
    const mbtiProfile = MBTI_PROFILES.find(pr => pr.mbti === p.mbti_type?.toUpperCase());
    if (mbtiProfile) return `【${p.mbti_type}-${mbtiProfile.title}】`;
  }

  // 其次匹配 SBTI 称号
  const sbtiProfile = SBTI_PROFILES.find(pr => pr.keywords.some(k => combinedTraits.includes(k)));
  if (sbtiProfile) return `【${sbtiProfile.title}】`;

  if (p.mbti_type) return `【${p.mbti_type}探索者】`;
  if (p.custom_traits && p.custom_traits.length > 20) return "【灵魂铸造师】";
  
  return "";
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [guestMode, setGuestMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GUEST_MODE_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [authEntryMode, setAuthEntryMode] = useState<"guest" | "login" | "register" | "forgot" | "guestUpgrade">("guest");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState<{
    source: string;
    personaId?: string;
    personaName?: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const hasHashToken = typeof window.location.hash === "string" && window.location.hash.includes("access_token=");
        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(window.location.href);
          } catch {}
          try {
            url.searchParams.delete("code");
            url.searchParams.delete("next");
            window.history.replaceState({}, document.title, url.pathname + (url.search || ""));
          } catch {}
        } else if (hasHashToken) {
          try {
            window.history.replaceState({}, document.title, url.pathname + (url.search || ""));
          } catch {}
        }
      } catch {}

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        setSession(session);
        if (session) setGuestMode(false);
      }
    };

    void run();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        if (session) setGuestMode(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(GUEST_MODE_STORAGE_KEY, guestMode ? "1" : "0");
    } catch {}
  }, [guestMode]);

  const openFeedback = (ctx: { source: string; personaId?: any; personaName?: any }) => {
    setFeedbackContext({
      source: String(ctx?.source || "").trim() || "unknown",
      personaId: ctx?.personaId != null ? String(ctx.personaId) : undefined,
      personaName: ctx?.personaName != null ? String(ctx.personaName) : undefined,
    });
    setFeedbackOpen(true);
  };

  const effectiveSession = session || (guestMode ? GUEST_SESSION : null);

  return (
    <BrowserRouter>
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        session={effectiveSession}
        context={feedbackContext}
      />
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage onOpenFeedback={openFeedback} />} />
        <Route
          path="/"
          element={
            effectiveSession ? (
              <HomePage
                session={effectiveSession}
                isGuest={Boolean(!session && guestMode)}
                onRequireRegister={(preferredGuestPersonaId) => {
                  writeGuestUpgradeMeta({
                    pending: true,
                    preferredGuestPersonaId: preferredGuestPersonaId ? String(preferredGuestPersonaId) : undefined,
                  });
                  setAuthEntryMode("guestUpgrade");
                  setGuestMode(false);
                }}
                onExitGuest={() => setGuestMode(false)}
                onOpenFeedback={openFeedback}
              />
            ) : (
              <AuthPage
                onOpenFeedback={openFeedback}
                initialMode={authEntryMode}
                onGuestEnter={() => {
                  setAuthEntryMode("guest");
                  setGuestMode(true);
                }}
              />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            session ? (
              <ChatPage />
            ) : (
              <AuthPage
                onOpenFeedback={openFeedback}
                initialMode="login"
                onGuestEnter={() => {
                  setAuthEntryMode("guest");
                  setGuestMode(true);
                }}
              />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
