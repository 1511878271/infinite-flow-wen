import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  AiBusyJobKind,
  AiBusyStatePayload,
  CompanionBeastProfile,
  PluginEventMessage,
  PluginInitMessage,
  PluginTheme,
} from "../types";
import { createApiClient } from "../lib/api";
import { isInitMessage, postPluginEvent } from "../lib/postMessage";

type Tab = "t2i" | "companion" | "creator";

type PersistedPanelState = {
  v: 1;
  tab?: Tab;
  prompt?: string;
  size?: string;
  n?: number;
  images?: string[];
  cosUrlByImageUrl?: Record<string, string>;
  selectedImageUrl?: string;
  taskId?: string;
  taskStatus?: string;
  modelUrl?: string;
  activeHistoryId?: string;
  busyJobKind?: AiBusyJobKind;
  busyJobStartedAt?: number;
  busyJobEtaSec?: number;
  modelBgMode?: ModelBgMode;
};

const PANEL_PERSIST_KEY = "ai-plugin-panel-state:v1";
const HISTORY_PERSIST_KEY = "ai-plugin-history:v1";
const THEME_PERSIST_KEY = "ai-plugin-theme:v1";

type HistoryEntry = {
  id: string;
  kind: "t2i" | "i23d" | "companion" | "creator";
  createdAt: number;
  prompt: string;
  size: string;
  n: number;
  images: string[];
  cosUrlByImageUrl: Record<string, string>;
  selectedImageUrl?: string;
  taskId?: string;
  taskStatus?: string;
  modelUrl?: string;
  companionImageUrl?: string;
  companionSceneBgUrl?: string;
  companionSummary?: string;
  companionProfile?: CompanionBeastProfile;
  creatorProfile?: CreatorProfile;
};

type PersistedHistory = {
  v: 1;
  items: HistoryEntry[];
};

type ModelBgMode = "portrait" | "scene";

type NoticeState = {
  kind: "success" | "info";
  title: string;
  description: string;
};

type CreatorProfile = {
  inferredMbti?: string;
  speciesNameCn?: string;
  rarityTier?: CompanionBeastProfile["rarityTier"];
  dangerLevel?: CompanionBeastProfile["dangerLevel"];
  materials?: string[];
  traits?: string[];
  uniqueStory?: string;
  imagePrompt?: string;
  [key: string]: any;
};

type CreatorResult = {
  profile: CreatorProfile;
  imageUrl?: string;
  taskId?: string;
  taskStatus?: string;
  modelUrl?: string;
};

export type AiPluginPanelProps = {
  apiBaseUrl?: string;
  token?: string;
  authToken?: string;
  theme?: PluginTheme;
  storageNamespace?: string;
  embedded?: boolean;
  onClose?: () => void;
  initialTab?: Tab;
  initialSize?: string;
  initialPrompt?: string;
  initialImageUrl?: string;
  historyPersonaId?: string;
  onImageGenerated?: (images: string[]) => void;
  onModelGenerated?: (payload: { taskId: string; modelUrl: string }) => void;
  onCompanionAwakened?: (payload: { profile: CompanionBeastProfile; imageUrl?: string }) => void;
  onError?: (payload: { message: string; code?: string }) => void;
  onBusyStateChange?: (payload: AiBusyStatePayload) => void;
  onRequestBackgroundClose?: () => void;
};

export function AiPluginPanel(props: AiPluginPanelProps) {
  const storageNs = useMemo(() => String(props.storageNamespace || "").trim() || "guest", [props.storageNamespace]);
  const persisted = useMemo(() => loadPersistedPanelState(storageNs), [storageNs]);
  const initialHistory = useMemo(() => loadHistoryEntries(storageNs), [storageNs]);
  const latestCompanionEntry = useMemo(
    () => initialHistory.find((x) => x.kind === "companion" && x.companionProfile),
    [initialHistory],
  );

  const getSizeRatio = (raw: string) => {
    const m = String(raw || "").trim().match(/^(\d+)\s*x\s*(\d+)$/i);
    if (!m) return null;
    const w = Number(m[1]);
    const h = Number(m[2]);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
    return w / h;
  };

  const toFriendlyError = (raw: unknown) => {
    const msg = String((raw as any)?.message ?? raw ?? "").trim();
    if (!msg) return "发生错误";
    if (/resourceinsufficient/i.test(msg)) return "资源不足：当前模型服务额度不足，请稍后重试。";
    if (/authfailure|unauthorized|forbidden/i.test(msg)) return "鉴权失败：请检查密钥/权限配置是否正确。";
    if (/requestlimitexceeded|too many|rate limit/i.test(msg)) return "请求过于频繁：请稍后再试。";
    if (/timeout|timed out/i.test(msg)) return "请求超时：请稍后重试或换一张更清晰的图片。";
    return msg;
  };

  const [tab, setTab] = useState<Tab>(() => (persisted?.tab === "companion" ? "companion" : "t2i"));
  const [prompt, setPrompt] = useState(() => props.initialPrompt ?? persisted?.prompt ?? "");
  const [size, setSize] = useState(() => normalizeT2ISize(props.initialSize ?? persisted?.size ?? "2K"));
  const [n, setN] = useState(() => persisted?.n ?? 1);
  const [images, setImages] = useState<string[]>(() => persisted?.images ?? []);
  const [cosUrlByImageUrl, setCosUrlByImageUrl] = useState<Record<string, string>>(
    () => persisted?.cosUrlByImageUrl ?? {},
  );
  const [cosUploading, setCosUploading] = useState<Record<string, boolean>>({});
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    () => {
      const url = props.initialImageUrl ?? persisted?.selectedImageUrl;
      if (url && url.startsWith("blob:")) return undefined;
      return url;
    }
  );

  const [t2iLoading, setT2iLoading] = useState(false);
  const [companionLoading, setCompanionLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [taskId, setTaskId] = useState<string | undefined>(() => persisted?.taskId);
  const [taskStatus, setTaskStatus] = useState<string | undefined>(() => persisted?.taskStatus);
  const [modelUrl, setModelUrl] = useState<string | undefined>(() => persisted?.modelUrl);
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>(() => persisted?.activeHistoryId);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryEntry[]>(() => initialHistory);
  const [runtimeCfgVer, setRuntimeCfgVer] = useState(0);
  const [companionProfile, setCompanionProfile] = useState<CompanionBeastProfile | undefined>(
    () => latestCompanionEntry?.companionProfile,
  );
  const [companionImageUrl, setCompanionImageUrl] = useState<string | undefined>(
    () => latestCompanionEntry?.companionImageUrl || latestCompanionEntry?.images?.[0],
  );
  const [companionSceneBgUrl, setCompanionSceneBgUrl] = useState<string | undefined>(
    () => latestCompanionEntry?.companionSceneBgUrl,
  );
  const [companion3dLoading, setCompanion3dLoading] = useState(false);
  const [companionSceneBgLoading, setCompanionSceneBgLoading] = useState(false);
  const [busyJobKind, setBusyJobKind] = useState<AiBusyJobKind | undefined>(() => persisted?.busyJobKind);
  const [busyJobStartedAt, setBusyJobStartedAt] = useState<number | undefined>(() => persisted?.busyJobStartedAt);
  const [busyJobEtaSec, setBusyJobEtaSec] = useState<number | undefined>(() => persisted?.busyJobEtaSec);
  const [modelBgMode, setModelBgMode] = useState<ModelBgMode>(
    () => persisted?.modelBgMode ?? (latestCompanionEntry?.companionSceneBgUrl ? "scene" : "portrait"),
  );
  
  const [creatorText, setCreatorText] = useState("");
  const [creatorLoading, setCreatorLoading] = useState(false);
  const [creator3dLoading, setCreator3dLoading] = useState(false);
  const [creatorResult, setCreatorResult] = useState<CreatorResult | undefined>(undefined);

  const [jobNow, setJobNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<NoticeState | undefined>();

  const initRef = useRef<{ apiBaseUrl?: string; token?: string; theme?: PluginTheme }>({});
  const persistTimerRef = useRef<number | undefined>(undefined);
  const remoteHistoryTimerRef = useRef<number | undefined>(undefined);
  const remoteHistoryLoadedRef = useRef(false);
  const activePollTaskRef = useRef<string | undefined>(undefined);
  const noticeTimerRef = useRef<number | undefined>(undefined);
  const lastBusyPayloadKeyRef = useRef<string | undefined>(undefined);

  const prefersDark = usePrefersDark();
  const [theme, setTheme] = useState<PluginTheme>(() => {
    const persistedTheme = loadPersistedTheme(storageNs);
    if (persistedTheme) return persistedTheme === "light" ? "paper" : persistedTheme;
    if (props.theme) {
      const t = normalizeTheme(props.theme);
      return t === "light" ? "paper" : t || "system";
    }
    return "system";
  });

  const effectiveTheme = (theme === "system"
    ? prefersDark
      ? "midnight"
      : "paper"
    : theme === "light"
      ? "paper"
      : theme) as Exclude<PluginTheme, "system" | "light">;

  const colorScheme = effectiveTheme === "paper" ? "light" : "dark";

  const apiBaseUrl = props.apiBaseUrl || initRef.current.apiBaseUrl || guessApiBaseUrl();
  const token = props.token || initRef.current.token;
  const authToken = props.authToken;

  const api = useMemo(
    () => createApiClient({ apiBaseUrl, token, authToken }),
    [apiBaseUrl, token, authToken, runtimeCfgVer],
  );

  const busyJobLabel = useMemo(() => {
    if (busyJobKind === "t2i") return "2D 图片生成中";
    if (busyJobKind === "companion2d") return "伴生兽觉醒中";
    if (busyJobKind === "companion3d") return "3D 模型生成中";
    if (busyJobKind === "companionSceneBg") return "3D 场景背景图生成中";
    if (busyJobKind === "creatorQuickAwaken") return "本期伴生兽显化中";
    if (busyJobKind === "creator3d") return "本期 3D 形象显化中";
    return "";
  }, [busyJobKind]);

  const elapsedSec = busyJobStartedAt ? Math.max(0, Math.floor((jobNow - busyJobStartedAt) / 1000)) : 0;
  const remainingSec =
    busyJobStartedAt && busyJobEtaSec ? Math.max(0, busyJobEtaSec - Math.floor((jobNow - busyJobStartedAt) / 1000)) : undefined;

  useEffect(() => {
    if (props.initialTab === "t2i" || props.initialTab === "companion") setTab(props.initialTab);
  }, [props.initialTab]);

  useEffect(() => {
    if (!busyJobKind) return;
    setJobNow(Date.now());
    const timer = window.setInterval(() => setJobNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [busyJobKind]);

  useEffect(() => {
    const nextPayload = {
      busy: Boolean(busyJobKind),
      kind: busyJobKind,
      label: busyJobLabel || undefined,
      startedAt: busyJobStartedAt,
      etaSec: busyJobEtaSec,
    };
    const nextKey = JSON.stringify(nextPayload);
    if (lastBusyPayloadKeyRef.current === nextKey) return;
    lastBusyPayloadKeyRef.current = nextKey;
    props.onBusyStateChange?.(nextPayload);
  }, [busyJobEtaSec, busyJobKind, busyJobLabel, busyJobStartedAt, props.onBusyStateChange]);

  useEffect(() => {
    if (typeof props.initialSize === "string" && props.initialSize.trim()) setSize(props.initialSize.trim());
  }, [props.initialSize]);

  useEffect(() => {
    if (props.initialPrompt) setPrompt(props.initialPrompt);
  }, [props.initialPrompt]);

  useEffect(() => {
    if (props.initialImageUrl) setSelectedImageUrl(props.initialImageUrl);
  }, [props.initialImageUrl]);

  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (!isInitMessage(ev.data)) return;
      const msg = ev.data as PluginInitMessage;
      initRef.current.apiBaseUrl = msg.payload.apiBaseUrl || initRef.current.apiBaseUrl;
      initRef.current.token = msg.payload.token || initRef.current.token;
      initRef.current.theme = msg.payload.theme || initRef.current.theme;
      if (typeof msg.payload.initialPrompt === "string") setPrompt(msg.payload.initialPrompt);
      if (typeof msg.payload.initialImageUrl === "string") setSelectedImageUrl(msg.payload.initialImageUrl);
      if (typeof msg.payload.theme === "string") {
        const next = normalizeTheme(msg.payload.theme);
        if (next) setTheme(next === "light" ? "paper" : next);
      }
      setRuntimeCfgVer((x) => x + 1);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!props.theme) return;
    const next = normalizeTheme(props.theme);
    if (next) setTheme(next === "light" ? "paper" : next);
  }, [props.theme]);

  useEffect(() => {
    savePersistedTheme(storageNs, theme);
  }, [storageNs, theme]);

  function setHistoryAndPersist(next: HistoryEntry[]) {
    const normalized = normalizeHistoryItems(next);
    setHistoryItems(normalized);
    saveHistoryEntries(storageNs, normalized);
  }

  function createAndActivateHistory(kind: "t2i" | "i23d" | "companion" | "creator", patch?: Partial<HistoryEntry>) {
    const created = createHistoryEntrySnapshot({
      kind,
      prompt,
      size,
      n,
      images,
      cosUrlByImageUrl,
      selectedImageUrl,
      taskId,
      taskStatus,
      modelUrl,
      ...patch,
    });
    const next = [created, ...historyItems].slice(0, 30);
    setHistoryAndPersist(next);
    setActiveHistoryId(created.id);
    return created.id;
  }

  function ensureActiveHistoryId(kind: "t2i" | "i23d" | "companion" | "creator" = "t2i") {
    if (activeHistoryId) return activeHistoryId;
    return createAndActivateHistory(kind);
  }

  function updateHistoryEntry(id: string | undefined, updater: (prev: HistoryEntry) => HistoryEntry) {
    if (!id) return;
    const next = historyItems.map((x) => (x.id === id ? normalizeHistoryEntry(updater(x)) : x));
    setHistoryAndPersist(next);
  }

  useEffect(() => {
    remoteHistoryLoadedRef.current = false;
    const personaId = String(props.historyPersonaId || "").trim();
    if (!personaId || !authToken) return;
    let cancelled = false;
    void (async () => {
      try {
        const remote = await api.getPersonaVisualHistory(personaId);
        if (cancelled) return;
        const local = loadHistoryEntries(storageNs);
        const merged = mergeHistoryItems(remote.items as HistoryEntry[], local);
        setHistoryItems(merged);
        saveHistoryEntries(storageNs, merged);
        const latestCompanion = merged.find((item) => item.kind === "companion" && item.companionProfile);
        if (latestCompanion?.companionProfile) {
          setCompanionProfile(latestCompanion.companionProfile);
          setCompanionImageUrl(latestCompanion.companionImageUrl || latestCompanion.images?.[0]);
          setCompanionSceneBgUrl(latestCompanion.companionSceneBgUrl);
          setModelBgMode(latestCompanion.companionSceneBgUrl ? "scene" : "portrait");
        }
      } catch {
        if (cancelled) return;
      } finally {
        if (!cancelled) remoteHistoryLoadedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, authToken, props.historyPersonaId, storageNs]);

  useEffect(() => {
    const personaId = String(props.historyPersonaId || "").trim();
    if (!personaId || !authToken || !remoteHistoryLoadedRef.current) return;
    if (remoteHistoryTimerRef.current) window.clearTimeout(remoteHistoryTimerRef.current);
    remoteHistoryTimerRef.current = window.setTimeout(() => {
      const remoteSafeItems = historyItems.filter(
        (item): item is HistoryEntry & { kind: "t2i" | "i23d" | "companion" } => item.kind !== "creator",
      );
      void api.savePersonaVisualHistory(
        personaId,
        remoteSafeItems,
      );
    }, 300);
    return () => {
      if (remoteHistoryTimerRef.current) window.clearTimeout(remoteHistoryTimerRef.current);
    };
  }, [api, authToken, historyItems, props.historyPersonaId]);

  useEffect(() => {
    if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current);
    persistTimerRef.current = window.setTimeout(() => {
      savePersistedPanelState(storageNs, {
        v: 1,
        tab,
        prompt,
        size,
        n,
        images,
        cosUrlByImageUrl,
        selectedImageUrl,
        taskId,
        taskStatus,
        modelUrl,
        activeHistoryId,
        busyJobKind,
        busyJobStartedAt,
        busyJobEtaSec,
        modelBgMode,
      });
    }, 200);

    return () => {
      if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current);
    };
  }, [
    tab,
    prompt,
    size,
    n,
    images,
    cosUrlByImageUrl,
    selectedImageUrl,
    taskId,
    taskStatus,
    modelUrl,
    activeHistoryId,
    busyJobKind,
    busyJobStartedAt,
    busyJobEtaSec,
    modelBgMode,
    storageNs,
  ]);

  useEffect(() => {
    if (!taskId || !activeHistoryId) return;
    if (taskStatus !== "queued" && taskStatus !== "running") return;
    if (activePollTaskRef.current === taskId) return;
    if (!busyJobKind) startBusyJob("companion3d", 150);
    const cancel = pollTask(taskId, activeHistoryId);
    return cancel;
  }, [activeHistoryId, busyJobKind, taskId, taskStatus]);

  async function runT2I() {
    setError(undefined);
    const nextSize = normalizeT2ISize(size);
    if (nextSize !== size) {
      setSize(nextSize);
      setError("当前尺寸不满足文生图最小像素要求，已自动切换为可用尺寸。");
      props.onError?.({ message: "当前尺寸不满足文生图最小像素要求，已自动切换为可用尺寸。" });
      postToHost(
        { type: "AI_PLUGIN_ERROR", payload: { message: "当前尺寸不满足文生图最小像素要求，已自动切换为可用尺寸。" } },
        props,
      );
      return;
    }
    startBusyJob("t2i", 25);
    setT2iLoading(true);
    setImages([]);
    try {
      const out = await api.t2i({ prompt, size, n });
      setImages(out.images);
      const entry = createHistoryEntrySnapshot({
        kind: "t2i",
        prompt,
        size,
        n,
        images: out.images,
        cosUrlByImageUrl: {},
      });
      setHistoryItems((prev) => {
        const next = [entry, ...prev].slice(0, 30);
        saveHistoryEntries(storageNs, next);
        return next;
      });
      setActiveHistoryId(entry.id);
      props.onImageGenerated?.(out.images);
      postToHost({ type: "AI_PLUGIN_IMAGE_GENERATED", payload: { images: out.images } }, props);
      finishBusyJob({
        kind: "success",
        title: "2D 图片已生成",
        description: `本次已产出 ${out.images.length} 张图片，可直接去历史记录里查看。`,
      });
    } catch (e) {
      const msg = toFriendlyError(e instanceof Error ? e.message : e);
      clearBusyJob();
      setError(msg);
      props.onError?.({ message: msg });
      postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
    } finally {
      setT2iLoading(false);
    }
  }

  async function uploadCos(url: string) {
    setError(undefined);
    setCosUploading((m) => ({ ...m, [url]: true }));
    try {
      const out = await api.uploadToCosFromUrl(url);
      setCosUrlByImageUrl((m) => ({ ...m, [url]: out.url }));
      const id = ensureActiveHistoryId("t2i");
      updateHistoryEntry(id, (prev) => ({
        ...prev,
        cosUrlByImageUrl: { ...prev.cosUrlByImageUrl, [url]: out.url },
      }));
    } catch (e) {
      const msg = toFriendlyError(e instanceof Error ? e.message : e);
      setError(msg);
      props.onError?.({ message: msg });
      postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
    } finally {
      setCosUploading((m) => ({ ...m, [url]: false }));
    }
  }

  async function runCompanionAwakening() {
    const personaId = String(props.historyPersonaId || "").trim();
    if (!personaId) {
      const msg = "请先选择一张人格卡片，再进行伴生兽觉醒。";
      setError(msg);
      props.onError?.({ message: msg });
      postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
      return;
    }
    if (!authToken) {
      const msg = "伴生兽觉醒需要登录后使用。";
      setError(msg);
      props.onError?.({ message: msg });
      postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
      return;
    }

    setError(undefined);
    startBusyJob("companion2d", 55);
    setCompanionLoading(true);
    try {
      const out = await api.awakenCompanionBeast(personaId);
      const imageUrl = out.imageUrl || out.historyItem.imageUrl;
      const entry = normalizeHistoryEntry({
        id: out.historyItem.id,
        kind: "companion",
        createdAt: out.historyItem.createdAt,
        prompt: `${out.profile.speciesNameCn} 伴生兽觉醒`,
        size: "1440x2560",
        n: 1,
        images: imageUrl ? [imageUrl] : [],
        cosUrlByImageUrl: {},
        companionImageUrl: imageUrl,
        companionSceneBgUrl: out.historyItem.sceneBgUrl,
        companionSummary: out.profile.personalitySummary,
        companionProfile: out.profile,
      });
      setCompanionProfile(out.profile);
      setCompanionImageUrl(imageUrl);
      setCompanionSceneBgUrl(out.historyItem.sceneBgUrl);
      setModelBgMode(out.historyItem.sceneBgUrl ? "scene" : "portrait");
      setTaskId(undefined);
      setTaskStatus(undefined);
      setModelUrl(undefined);
      const next = [entry, ...historyItems.filter((item) => item.id !== entry.id)].slice(0, 30);
      setHistoryAndPersist(next);
      setActiveHistoryId(entry.id);
      props.onCompanionAwakened?.({ profile: out.profile, imageUrl });
      postToHost({ type: "AI_PLUGIN_COMPANION_AWAKENED", payload: { profile: out.profile, imageUrl } }, props);
      finishBusyJob({
        kind: "success",
        title: "伴生兽已觉醒",
        description: out.historyItem.sceneBgUrl
          ? `${out.profile.speciesNameCn} 已完成生成，展示页已自动带上专属场景背景。`
          : `${out.profile.speciesNameCn} 已完成生成，你现在可以继续注入 3D 能量。`,
      });
    } catch (e) {
      const msg = toFriendlyError(e instanceof Error ? e.message : e);
      clearBusyJob();
      setError(msg);
      props.onError?.({ message: msg });
      postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
    } finally {
      setCompanionLoading(false);
    }
  }

  async function runCompanionSceneBg() {
    const personaId = String(props.historyPersonaId || "").trim();
    if (!personaId) {
      setError("请先选择一张人格卡片，再生成 3D 场景背景图。");
      return;
    }
    if (!authToken) {
      setError("需要登录后才能生成 3D 场景背景图。");
      return;
    }

    const historyId =
      activeHistoryId ||
      historyItems.find((item) => item.kind === "companion" && item.companionProfile)?.id;
    if (!historyId) {
      setError("请先完成一次伴生兽觉醒，再生成专属场景背景图。");
      return;
    }
    setError(undefined);
    startBusyJob("companionSceneBg", 30);
    setCompanionSceneBgLoading(true);
    try {
      const out = await api.generateCompanionSceneBg(personaId, historyId);
      setCompanionSceneBgUrl(out.imageUrl);
      if (out.imageUrl) setModelBgMode("scene");
      updateHistoryEntry(out.historyItemId || historyId, (prev) => ({
        ...prev,
        companionSceneBgUrl: out.imageUrl,
      }));
      finishBusyJob({
        kind: "success",
        title: "3D 场景背景已生成",
        description: "已为伴生兽补齐无主体场景背景图，3D 展示位会优先使用专属场景。",
      });
    } catch (e) {
      const msg = toFriendlyError(e instanceof Error ? e.message : e);
      clearBusyJob();
      setError(msg);
      props.onError?.({ message: msg });
      postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
    } finally {
      setCompanionSceneBgLoading(false);
    }
  }

  async function runCompanion3d() {
    if (!companionImageUrl) {
      setError("伴生兽尚未生成 2D 视觉图，无法注入高维能量。");
      return;
    }
    if (!authToken) {
      setError("需要登录后才能生成 3D 模型。");
      return;
    }

    setError(undefined);
    void ensureNotificationPermission();
    startBusyJob("companion3d", 150);
    setCompanion3dLoading(true);
    setTaskStatus("queued");
    setModelUrl(undefined);
    try {
      const out = await api.create3dFromUrl(companionImageUrl, companionProfile?.imagePrompt);
      setTaskId(out.taskId);
      setTaskStatus(out.status);

      const id = ensureActiveHistoryId("companion");
      updateHistoryEntry(id, (prev) => ({
        ...prev,
        taskId: out.taskId,
        taskStatus: out.status,
      }));

      pollTask(out.taskId, id);
    } catch (e) {
      const msg = toFriendlyError(e instanceof Error ? e.message : e);
      clearBusyJob();
      setError(msg);
      setTaskStatus(undefined);
      setTaskId(undefined);
      props.onError?.({ message: msg });
      postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
    } finally {
      setCompanion3dLoading(false);
    }
  }

  async function runCreatorQuickAwaken() {
    if (!creatorText.trim()) {
      setError("请先输入粉丝留言或描述");
      return;
    }
    setError(undefined);
    setCreatorResult(undefined);
    setCreatorLoading(true);
    startBusyJob("creatorQuickAwaken", 45);
    try {
      const res = await api.quickAwakenFromText(creatorText);
      const nextResult = { ...res, taskId: undefined, taskStatus: undefined, modelUrl: undefined };
      setCreatorResult(nextResult);
      const entry = createHistoryEntrySnapshot({
        kind: "creator",
        prompt: creatorText,
        size: "1440x2560",
        n: 1,
        images: res.imageUrl ? [res.imageUrl] : [],
        selectedImageUrl: res.imageUrl,
        creatorProfile: res.profile,
      });
      setHistoryAndPersist([entry, ...historyItems.filter((item) => item.id !== entry.id)].slice(0, 30));
      setActiveHistoryId(entry.id);
      finishBusyJob({
        kind: "success",
        title: "本期伴生兽已显化",
        description: "专属来历与视觉图已经就绪。",
      });
    } catch (e) {
      const msg = toFriendlyError(e instanceof Error ? e.message : e);
      clearBusyJob();
      setError(msg);
    } finally {
      setCreatorLoading(false);
    }
  }

  async function runCreator3d() {
    if (!creatorResult?.imageUrl) {
      setError("请先完成一次显化，再生成对应的 3D 形象。");
      return;
    }
    setError(undefined);
    void ensureNotificationPermission();
    startBusyJob("creator3d", 150);
    setCreator3dLoading(true);
    setCreatorResult((prev) => (prev ? { ...prev, taskStatus: "queued", modelUrl: undefined } : prev));
    const creatorHistoryId = ensureActiveHistoryId("creator");
    updateHistoryEntry(creatorHistoryId, (prev) => ({
      ...prev,
      kind: "creator",
      prompt: creatorText || prev.prompt,
      size: prev.size || "1440x2560",
      n: prev.n || 1,
      images: creatorResult.imageUrl ? [creatorResult.imageUrl] : prev.images,
      selectedImageUrl: creatorResult.imageUrl || prev.selectedImageUrl,
      creatorProfile: creatorResult.profile,
      modelUrl: undefined,
      taskStatus: "queued",
    }));
    try {
      const out = await api.create3dFromUrl(creatorResult.imageUrl, creatorResult.profile?.imagePrompt);
      setCreatorResult((prev) =>
        prev
          ? {
              ...prev,
              taskId: out.taskId,
              taskStatus: out.status,
            }
          : prev,
      );
      updateHistoryEntry(creatorHistoryId, (prev) => ({
        ...prev,
        taskId: out.taskId,
        taskStatus: out.status,
        creatorProfile: creatorResult.profile,
      }));
      pollCreatorTask(out.taskId, creatorHistoryId);
    } catch (e) {
      const msg = toFriendlyError(e instanceof Error ? e.message : e);
      clearBusyJob();
      setError(msg);
      setCreatorResult((prev) =>
        prev
          ? {
              ...prev,
              taskId: undefined,
              taskStatus: undefined,
            }
          : prev,
      );
      updateHistoryEntry(creatorHistoryId, (prev) => ({
        ...prev,
        taskId: undefined,
        taskStatus: undefined,
      }));
      props.onError?.({ message: msg });
      postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
    } finally {
      setCreator3dLoading(false);
    }
  }

  function pollCreatorTask(tid: string, hId: string) {
    let cancelled = false;
    let fails = 0;
    const check = async () => {
      if (cancelled) return;
      try {
        const out = await api.get3d(tid);
        if (cancelled) return;
        setCreatorResult((prev) =>
          prev
            ? {
                ...prev,
                taskId: tid,
                taskStatus: out.status,
                modelUrl: out.modelUrl,
              }
            : prev,
        );
        updateHistoryEntry(hId, (prev) => ({
          ...prev,
          taskId: tid,
          taskStatus: out.status,
          modelUrl: out.modelUrl,
        }));
        if (out.status === "succeeded") {
          finishBusyJob({
            kind: "success",
            title: "本期 3D 形象已显化",
            description: "你现在可以直接旋转查看这只伴生兽的立体形象。",
          });
          return;
        }
        if (out.status === "failed") {
          const msg = out.error || "3D 形象生成失败";
          clearBusyJob();
          setError(msg);
          props.onError?.({ message: msg });
          postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
          return;
        }
        fails = 0;
      } catch (err) {
        fails++;
        if (fails >= 3) {
          const msg = toFriendlyError(err instanceof Error ? err.message : err);
          clearBusyJob();
          setError(msg);
          setCreatorResult((prev) => (prev ? { ...prev, taskStatus: "failed" } : prev));
          updateHistoryEntry(hId, (prev) => ({ ...prev, taskStatus: "failed" }));
          props.onError?.({ message: msg });
          postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
          return;
        }
      }
      setTimeout(check, 5000);
    };
    setTimeout(check, 3000);
    return () => {
      cancelled = true;
    };
  }

  function pollTask(tid: string, hId: string) {
    activePollTaskRef.current = tid;
    let cancelled = false;
    let fails = 0;
    const check = async () => {
      if (cancelled) return;
      try {
        const out = await api.get3d(tid);
        if (cancelled) return;
        setTaskStatus(out.status);
        updateHistoryEntry(hId, (prev) => ({
          ...prev,
          taskStatus: out.status,
          modelUrl: out.modelUrl,
        }));
        if (out.status === "succeeded") {
          setModelUrl(out.modelUrl);
          finishBusyJob({
            kind: "success",
            title: "3D 模型已生成",
            description: "伴生兽已完成高维注入，你可以立即返回工坊查看和旋转模型。",
          });
          props.onModelGenerated?.({ taskId: tid, modelUrl: out.modelUrl || "" });
          postToHost(
            { type: "AI_PLUGIN_MODEL_GENERATED", payload: { taskId: tid, modelUrl: out.modelUrl || "" } },
            props,
          );
          return;
        }
        if (out.status === "failed") {
          const msg = out.error || "3D 模型生成失败";
          clearBusyJob();
          setError(msg);
          props.onError?.({ message: msg });
          postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
          return;
        }
        fails = 0;
      } catch (err) {
        fails++;
        if (fails >= 3) {
          const msg = toFriendlyError(err instanceof Error ? err.message : err);
          clearBusyJob();
          setError(msg);
          setTaskStatus("failed");
          updateHistoryEntry(hId, (prev) => ({ ...prev, taskStatus: "failed" }));
          props.onError?.({ message: msg });
          postToHost({ type: "AI_PLUGIN_ERROR", payload: { message: msg } }, props);
          return;
        }
      }
      setTimeout(check, 5000);
    };
    setTimeout(check, 3000);
    return () => {
      cancelled = true;
      if (activePollTaskRef.current === tid) activePollTaskRef.current = undefined;
    };
  }

  function startBusyJob(kind: AiBusyJobKind, etaSec: number) {
    setBusyJobKind(kind);
    setBusyJobStartedAt(Date.now());
    setBusyJobEtaSec(etaSec);
  }

  function clearBusyJob() {
    setBusyJobKind(undefined);
    setBusyJobStartedAt(undefined);
    setBusyJobEtaSec(undefined);
  }

  function finishBusyJob(nextNotice: NoticeState) {
    clearBusyJob();
    showNotice(nextNotice);
    maybeNotify(nextNotice.title, nextNotice.description);
  }

  function showNotice(next: NoticeState) {
    setNotice(next);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice((prev) => (prev?.title === next.title ? undefined : prev));
    }, 4200);
  }

  async function ensureNotificationPermission() {
    try {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    } catch {
      void 0;
    }
  }

  function maybeNotify(title: string, body: string) {
    try {
      if (typeof document !== "undefined" && document.visibilityState === "visible") return;
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
      new Notification(title, { body });
    } catch {
      void 0;
    }
  }

  const hasSceneBg = Boolean(companionSceneBgUrl);
  const activeModelBgUrl =
    modelBgMode === "scene" && companionSceneBgUrl ? companionSceneBgUrl : companionImageUrl;
  const activeModelBgProxyUrl = activeModelBgUrl
    ? activeModelBgUrl.startsWith("http")
      ? toProxyUrl(apiBaseUrl, activeModelBgUrl)
      : activeModelBgUrl
    : undefined;

  return (
    <div
      className="ai-plugin-root relative w-full max-w-[520px] mx-auto h-full min-h-0 flex flex-col text-app-fg"
      data-app-theme={effectiveTheme}
      style={{ colorScheme }}
    >
      <div className="relative h-full min-h-0 flex flex-col rounded-3xl border border-app-border/15 bg-app-elevated/90 shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -left-28 h-[420px] w-[420px] rounded-full bg-accent/12 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,122,255,0.14),transparent_55%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.10),transparent_60%)]"></div>
        </div>

        <div className="relative sticky top-0 z-10 border-b border-app-border/12 bg-app-elevated/65 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent/10 border border-accent/15 shadow-[0_10px_30px_rgba(0,122,255,0.18)] text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.912 5.813a2 2 0 0 0 1.265 1.265L21 12l-5.823 1.912a2 2 0 0 0-1.265 1.265L12 21l-1.912-5.823a2 2 0 0 0-1.265-1.265L3 12l5.813-1.912a2 2 0 0 0 1.265-1.265L12 3Z" />
                  <path d="M5 3v4" />
                  <path d="M19 17v4" />
                  <path d="M3 5h4" />
                  <path d="M17 19h4" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold tracking-tight">AI 工坊</div>
                <div className="truncate text-[11px] text-app-muted">文生图 / 伴生兽觉醒</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as PluginTheme)}
                className="h-8 rounded-full border border-app-border/15 bg-app-surface/30 px-2.5 text-xs text-app-fg outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50"
                aria-label="主题"
              >
                <option value="system">System</option>
                <option value="paper">Paper</option>
                <option value="midnight">Midnight</option>
                <option value="dark">Dark</option>
              </select>

              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-app-border/12 bg-app-surface/20 px-3 text-xs text-app-muted hover:bg-app-surface/30 hover:text-app-fg"
              >
                <span>历史</span>
              </button>

              <a
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-app-border/12 bg-app-surface/20 px-3 text-xs text-app-muted hover:bg-app-surface/30 hover:text-app-fg"
                href="/settings"
                target="_blank"
                rel="noreferrer"
              >
                设置
              </a>

              {!props.embedded ? (
                <a
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 text-xs font-semibold text-accent hover:bg-accent/15"
                  href="/resonance-demo"
                  target="_blank"
                  rel="noreferrer"
                >
                  聊天
                </a>
              ) : (
                <button
                  type="button"
                  onClick={busyJobKind && props.onRequestBackgroundClose ? props.onRequestBackgroundClose : props.onClose}
                  className="ml-1 grid h-8 w-8 place-items-center rounded-full border border-app-border/12 bg-app-surface/20 text-app-muted hover:bg-app-surface/30 hover:text-app-fg"
                  aria-label={busyJobKind && props.onRequestBackgroundClose ? "转入后台" : "关闭"}
                >
                  {busyJobKind && props.onRequestBackgroundClose ? "—" : "✕"}
                </button>
              )}
            </div>
          </div>

          <div className="px-4 pb-3">
            <div className="inline-flex w-full items-center gap-1 rounded-full border border-app-border/12 bg-app-surface/20 p-1 overflow-x-auto custom-scrollbar">
              <TabButton active={tab === "t2i"} onClick={() => setTab("t2i")} className="whitespace-nowrap">
                文生图
              </TabButton>
              <TabButton active={tab === "companion"} onClick={() => setTab("companion")} className="whitespace-nowrap">
                伴生兽觉醒
              </TabButton>
              <TabButton active={tab === "creator"} onClick={() => setTab("creator")} className="whitespace-nowrap">
                留言显化
              </TabButton>
            </div>
          </div>
        </div>

        <div className="relative p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-app-bg/25">
          {busyJobKind ? (
            <div className="mb-4 rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-app-fg">{busyJobLabel}</div>
                  <div className="mt-1 text-xs text-app-muted">
                    已运行 {formatDuration(elapsedSec)}
                    {typeof remainingSec === "number" ? `，预计剩余 ${formatDuration(remainingSec)}` : ""}
                    {busyJobKind === "companion3d" ? "，你可以先收起弹窗，后台会继续生成" : ""}
                  </div>
                </div>
                {busyJobKind === "companion3d" && props.onRequestBackgroundClose ? (
                  <button
                    type="button"
                    onClick={props.onRequestBackgroundClose}
                    className="shrink-0 rounded-full border border-accent/20 bg-app-bg/25 px-3 py-1.5 text-xs font-medium text-accent hover:bg-app-bg/35"
                  >
                    收起到后台
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {notice ? (
            <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              <div className="font-semibold">{notice.title}</div>
              <div className="mt-1 text-xs text-emerald-100/90">{notice.description}</div>
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {tab === "t2i" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                <div className="flex items-end justify-between gap-3">
                  <label className="block text-sm font-semibold">提示词</label>
                  <div className="text-xs text-app-muted">{prompt.trim().length}/2000</div>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
                  rows={6}
                  className="mt-3 w-full resize-none rounded-2xl border border-app-border/12 bg-app-bg/30 px-4 py-3 text-sm text-app-fg outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 placeholder:text-app-muted/60"
                  placeholder="输入你想生成的卡通人物 / 人格卡片描述"
                />
                <div className="mt-3 text-xs text-app-muted">
                  这里继续用于生成人格卡封面、横幅等 2D 视觉资源。
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                  <div className="mb-2 text-xs text-app-muted">尺寸</div>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full rounded-2xl border border-app-border/12 bg-app-bg/30 px-4 py-2.5 text-sm text-app-fg outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30"
                    disabled={t2iLoading}
                  >
                    <option value="2K">2K</option>
                    <option value="1920x1920">1920x1920</option>
                    <option value="2560x1440">2560x1440</option>
                    <option value="1440x2560">1440x2560</option>
                    <option value="3840x1280">3840x1280</option>
                  </select>
                </div>
                <div className="rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                  <div className="mb-2 text-xs text-app-muted">张数</div>
                  <input
                    value={n}
                    onChange={(e) => setN(Math.max(1, Math.min(4, Number(e.target.value) || 1)))}
                    type="number"
                    min={1}
                    max={4}
                    className="w-full rounded-2xl border border-app-border/12 bg-app-bg/30 px-4 py-2.5 text-sm text-app-fg outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30"
                  />
                </div>
              </div>

              <button
                disabled={t2iLoading || !prompt.trim()}
                onClick={runT2I}
                className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-[#0066d6] disabled:opacity-60 transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)]"
              >
                {t2iLoading ? "生成中..." : "生成图片"}
              </button>

              {images.length ? (
                <div className={`grid gap-2 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {(() => {
                    const r = getSizeRatio(size);
                    const isWide = typeof r === "number" ? r >= 2 : false;
                    const previewHeightClass = images.length === 1 ? (isWide ? "h-48 sm:h-56" : "h-[52vh] sm:h-[58vh]") : undefined;
                    return images.map((url) => (
                      <ImageCard
                        key={url}
                        url={url.startsWith("http") ? toProxyUrl(apiBaseUrl, url) : url}
                        rawUrl={url}
                        cosUrl={cosUrlByImageUrl[url]}
                        uploading={Boolean(cosUploading[url])}
                        onUpload={() => uploadCos(url)}
                        onUse={() => {
                          const next = cosUrlByImageUrl[url] || url;
                          setSelectedImageUrl(next);
                          const id = ensureActiveHistoryId();
                          updateHistoryEntry(id, (prev) => ({ ...prev, selectedImageUrl: next }));
                        }}
                        selected={selectedImageUrl === url || selectedImageUrl === cosUrlByImageUrl[url]}
                        previewHeightClass={previewHeightClass}
                      />
                    ));
                  })()}
                </div>
              ) : (
                <div className="rounded-2xl border border-app-border/12 bg-app-surface/15 px-4 py-6 text-center text-sm text-app-muted">
                  生成的图片会出现在这里
                </div>
              )}
            </div>
          ) : tab === "companion" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">伴生兽觉醒</div>
                    <div className="mt-1 text-xs leading-5 text-app-muted">
                      每张人格卡片可觉醒一只伴生兽。当前先依据 MBTI、蒸馏结果与特质生成基础兽设与主视觉。
                    </div>
                  </div>
                  <div className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">
                    一期骨架
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <InfoChip label="来源" value="人格卡片" />
                  <InfoChip label="映射" value="MBTI 主物种" />
                  <InfoChip label="结果" value="品级 + 危险级" />
                </div>
              </div>

              <div className="rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                <div className="text-xs text-app-muted">当前规则</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["E 偏进攻", "I 偏防御", "NF 偏灵魂感", "NT 偏高维感", "SJ 偏守护", "SP 偏灵动"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-app-border/12 bg-app-bg/20 px-3 py-1.5 text-xs text-app-fg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button
                disabled={companionLoading}
                onClick={runCompanionAwakening}
                className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-[#0066d6] disabled:opacity-60 transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)]"
              >
                {companionLoading ? "觉醒中..." : "开始觉醒伴生兽"}
              </button>

              {companionProfile ? (
                <div className="overflow-hidden rounded-3xl border border-app-border/12 bg-app-surface/20 flex flex-col">
                  {/* 如果生成了 3D，让 3D 模型占据顶部主展示位 */}
                  {modelUrl && (
                    <div className="relative w-full h-[320px] sm:h-[380px] border-b border-app-border/12 bg-black/40 shadow-inner flex items-center justify-center overflow-hidden">
                      {activeModelBgProxyUrl ? (
                        <>
                          <div
                            className={`absolute inset-0 bg-center bg-cover ${modelBgMode === "scene" ? "scale-100 opacity-70" : "scale-110 opacity-45 blur-xl"}`}
                            style={{
                              backgroundImage: `url(${activeModelBgProxyUrl})`,
                            }}
                          />
                          <div
                            className={`absolute inset-0 ${
                              modelBgMode === "scene"
                                ? "bg-[linear-gradient(180deg,rgba(6,10,20,0.18),rgba(6,10,20,0.64))]"
                                : "bg-[radial-gradient(circle_at_center,rgba(10,15,30,0.08),rgba(6,10,20,0.62)_72%)]"
                            }`}
                          />
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
                        </>
                      ) : null}
                      <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
                        {hasSceneBg ? (
                          <button
                            type="button"
                            onClick={() => setModelBgMode("scene")}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-medium backdrop-blur-md border transition-colors ${
                              modelBgMode === "scene"
                                ? "border-white/25 bg-white/18 text-white"
                                : "border-white/10 bg-black/35 text-white/70 hover:text-white"
                            }`}
                          >
                            专属场景
                          </button>
                        ) : null}
                        {companionImageUrl ? (
                          <button
                            type="button"
                            onClick={() => setModelBgMode("portrait")}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-medium backdrop-blur-md border transition-colors ${
                              modelBgMode === "portrait"
                                ? "border-white/25 bg-white/18 text-white"
                                : "border-white/10 bg-black/35 text-white/70 hover:text-white"
                            }`}
                          >
                            原图氛围
                          </button>
                        ) : null}
                      </div>
                      <model-viewer
                        src={toProxyUrl(apiBaseUrl, modelUrl)}
                        auto-rotate
                        camera-controls
                        shadow-intensity="1"
                        environment-image="neutral"
                        exposure="1.2"
                        className="relative z-10 h-full w-full outline-none block"
                        style={{ backgroundColor: "transparent" }}
                      />
                      <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="rounded-full bg-black/60 px-4 py-1.5 text-xs text-white/90 backdrop-blur-md border border-white/10">
                          拖拽旋转 • 滚轮缩放
                        </div>
                      </div>
                      <div className="absolute right-4 top-4">
                        <a
                          href={modelUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-black/80 hover:text-white backdrop-blur-md transition-colors flex items-center gap-1 border border-white/10 shadow-lg"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          下载 .glb
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-0 sm:grid-cols-[180px_1fr]">
                    {/* 左侧 2D 图片（如果已有 3D，可以把 2D 图片作为对比记录，或通过 CSS 弱化） */}
                    <div className="border-b border-app-border/12 bg-app-bg/30 sm:border-b-0 sm:border-r">
                      <div className="aspect-[9/16] max-h-[400px] w-full overflow-hidden bg-black/20 flex items-center justify-center relative group">
                        {companionImageUrl ? (
                          <>
                            <img
                              src={companionImageUrl.startsWith("http") ? toProxyUrl(apiBaseUrl, companionImageUrl) : companionImageUrl}
                              className="h-full w-full object-contain sm:object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {modelUrl && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span className="text-white/80 text-xs border border-white/20 px-3 py-1 rounded-full bg-black/40">2D 原始概念图</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-app-muted">
                            本次已生成兽设，主视觉稍后可继续补图。
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-extrabold tracking-tight">{companionProfile.speciesNameCn}</div>
                            <div className="mt-1 text-xs text-app-muted">
                              {(companionProfile.mbti || "未定型") + " / " + companionProfile.camp + " 阵营 / " + combatStyleLabel(companionProfile.combatStyle)}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <StatusPill>{rarityLabel(companionProfile.rarityTier)}</StatusPill>
                            <StatusPill tone="warn">{dangerLabel(companionProfile.dangerLevel)}</StatusPill>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          {companionProfile.materials.map((item) => (
                            <div key={item} className="rounded-2xl border border-app-border/12 bg-app-bg/20 px-3 py-2">
                              材质：{item}
                            </div>
                          ))}
                          {companionProfile.traits.map((item) => (
                            <div key={item} className="rounded-2xl border border-app-border/12 bg-app-bg/20 px-3 py-2">
                              特质：{item}
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 space-y-3 text-sm leading-6 text-app-fg/95">
                          <div>
                            <div className="text-xs text-app-muted">外观摘要</div>
                            <div className="mt-1">{companionProfile.appearanceSummary}</div>
                          </div>
                          <div>
                            <div className="text-xs text-app-muted">人格投射</div>
                            <div className="mt-1">{companionProfile.personalitySummary}</div>
                          </div>
                          <div>
                            <div className="text-xs text-app-muted">觉醒故事</div>
                            <div className="mt-1">{companionProfile.awakeningStory}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full border border-app-border/12 bg-app-bg/20 px-3 py-1.5">
                            {companionProfile.tradeable ? "可随人格卡交易" : "暂不可交易"}
                          </span>
                          <span className="rounded-full border border-app-border/12 bg-app-bg/20 px-3 py-1.5">
                            {companionProfile.recyclable ? "命中平台回收条件" : "未命中回收条件"}
                          </span>
                          {companionProfile.serial ? (
                            <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-accent">
                              编号 {companionProfile.serial}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* 底部按钮区域 */}
                      {companionImageUrl && (
                        <div className="mt-5 border-t border-app-border/12 pt-4">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {!modelUrl && !["running", "queued"].includes(taskStatus || "") ? (
                              <button
                                disabled={companion3dLoading}
                                onClick={runCompanion3d}
                                className="w-full rounded-xl border border-accent/20 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/15 disabled:opacity-50"
                              >
                                {companion3dLoading ? "3D 充能中..." : "注入高维能量 (生成 3D 模型)"}
                              </button>
                            ) : (
                              <div className="rounded-xl border border-app-border/12 bg-app-bg/15 px-4 py-2.5 text-center text-xs text-app-muted">
                                {["running", "queued"].includes(taskStatus || "") ? "3D 模型生成中..." : "3D 模型已就绪"}
                              </div>
                            )}
                            <button
                              disabled={companionSceneBgLoading}
                              onClick={runCompanionSceneBg}
                              className="w-full rounded-xl border border-app-border/12 bg-app-bg/20 px-4 py-2.5 text-sm font-semibold text-app-fg transition-colors hover:bg-app-bg/30 disabled:opacity-50"
                            >
                              {companionSceneBgLoading
                                ? "场景绘制中..."
                                : hasSceneBg
                                  ? "重绘专属场景背景图"
                                  : "补生成 3D 场景背景图"}
                            </button>
                          </div>
                          {hasSceneBg ? (
                            <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-app-border/12 bg-app-bg/15 px-3 py-2 text-xs text-app-muted">
                              <span>专属场景图默认会在觉醒时自动生成；当前 3D 视窗已优先使用该背景。</span>
                              {companionSceneBgUrl ? (
                                <a
                                  href={companionSceneBgUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="shrink-0 text-accent hover:opacity-90"
                                >
                                  查看原图
                                </a>
                              ) : null}
                            </div>
                          ) : (
                            <div className="mt-3 rounded-2xl border border-app-border/12 bg-app-bg/15 px-3 py-2 text-xs text-app-muted">
                              若本次觉醒时场景图未成功返回，可点击上方按钮补生成一次。
                            </div>
                          )}
                          
                          {(!modelUrl && ["running", "queued"].includes(taskStatus || "")) ? (
                            <div className="mt-3 text-center text-xs text-app-muted">
                              高维能量注入中，请耐心等待 (可能需要1-3分钟)...
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-app-border/12 bg-app-surface/15 px-4 py-8 text-center text-sm text-app-muted">
                  还没有觉醒记录，点击上方按钮即可为当前人格卡片生成第一只伴生兽。
                </div>
              )}
            </div>
          ) : tab === "creator" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">本期伴生兽觉醒</div>
                    <div className="mt-1 text-xs leading-5 text-app-muted">
                      读取本次留言里的性格线索与情绪气味，为你显化一只对应的伴生兽，并写下它独有的来历。
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-app-border/12 bg-app-surface/20 p-4">
                <label className="block text-sm font-semibold mb-3">输入本期留言</label>
                <textarea
                  value={creatorText}
                  onChange={(e) => setCreatorText(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-app-border/12 bg-app-bg/30 px-4 py-3 text-sm text-app-fg outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 placeholder:text-app-muted/60"
                  placeholder="例如：我是 INFP，平时话不多，但熟了以后很疯，情绪一上来谁都拉不住。"
                  disabled={creatorLoading}
                />
              </div>

              <button
                disabled={creatorLoading || !creatorText.trim()}
                onClick={runCreatorQuickAwaken}
                className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-[#0066d6] disabled:opacity-60 transition-colors shadow-[0_12px_30px_rgba(0,122,255,0.22)]"
              >
                {creatorLoading ? "伴生兽显化中..." : "开始觉醒"}
              </button>

              {creatorResult && creatorResult.profile && (
                <div className="mt-6 rounded-3xl border border-app-border/12 bg-app-surface/20 overflow-hidden relative">
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-accent font-semibold tracking-wider uppercase mb-1">
                          MBTI: {creatorResult.profile.inferredMbti}
                        </div>
                        <h2 className="text-2xl font-black text-app-fg tracking-tight">{creatorResult.profile.speciesNameCn}</h2>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <StatusPill tone="warn">{dangerLabel(creatorResult.profile.dangerLevel)}</StatusPill>
                        <StatusPill>{rarityLabel(creatorResult.profile.rarityTier)}</StatusPill>
                      </div>
                    </div>

                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                      {creatorResult.imageUrl ? (
                        <img 
                          src={creatorResult.imageUrl.startsWith("http") ? toProxyUrl(apiBaseUrl, creatorResult.imageUrl) : creatorResult.imageUrl} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/40">视觉投射中...</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex flex-wrap gap-1.5">
                          {creatorResult.profile.materials?.map((m: string) => (
                            <span key={m} className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-md text-[10px] text-white/90 border border-white/10">{m}</span>
                          ))}
                          {creatorResult.profile.traits?.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-accent/30 backdrop-blur-md rounded-md text-[10px] text-accent-100 border border-accent/20">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {creatorResult.modelUrl ? (
                      <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-app-border/12 bg-black/40">
                        <model-viewer
                          src={toProxyUrl(apiBaseUrl, creatorResult.modelUrl)}
                          auto-rotate
                          camera-controls
                          shadow-intensity="1"
                          environment-image="neutral"
                          exposure="1.2"
                          className="relative z-10 h-full w-full outline-none block"
                          style={{ backgroundColor: "transparent" }}
                        />
                        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] text-white/85 backdrop-blur-md">
                          3D 形象
                        </div>
                        <a
                          href={creatorResult.modelUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] text-white/85 backdrop-blur-md hover:bg-black/45"
                        >
                          查看模型
                        </a>
                      </div>
                    ) : null}

                    <div className="rounded-2xl bg-app-bg/20 border border-app-border/12 p-4 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-app-muted/10 text-6xl font-serif font-black">"</div>
                      <div className="text-xs text-app-muted mb-2 uppercase tracking-wider font-semibold">专属背景故事</div>
                      <div className="text-[13px] leading-relaxed text-app-fg/90 italic">
                        {creatorResult.profile.uniqueStory}
                      </div>
                    </div>

                    {creatorResult.imageUrl ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {!creatorResult.modelUrl && !["running", "queued"].includes(creatorResult.taskStatus || "") ? (
                          <button
                            disabled={creator3dLoading}
                            onClick={runCreator3d}
                            className="w-full rounded-xl border border-accent/20 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/15 disabled:opacity-50"
                          >
                            {creator3dLoading ? "3D 形象显化中..." : "生成对应 3D 形象"}
                          </button>
                        ) : (
                          <div className="rounded-xl border border-app-border/12 bg-app-bg/15 px-4 py-2.5 text-center text-xs text-app-muted">
                            {["running", "queued"].includes(creatorResult.taskStatus || "") ? "3D 形象生成中..." : "3D 形象已就绪"}
                          </div>
                        )}
                        <div className="rounded-xl border border-app-border/12 bg-app-bg/15 px-4 py-2.5 text-center text-xs text-app-muted">
                          {["running", "queued"].includes(creatorResult.taskStatus || "")
                            ? "预计需要 1-3 分钟，请稍候查看立体形象。"
                            : creatorResult.modelUrl
                              ? "这只伴生兽已经具备可旋转查看的立体形象。"
                              : "先显化 2D，再继续补齐立体形象。"}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {historyOpen ? (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              onClick={() => setHistoryOpen(false)}
            />
            <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-app-border/15 bg-app-elevated/95 shadow-2xl backdrop-blur-xl">
              <div className="relative border-b border-app-border/12 px-4 py-3">
                <div className="pointer-events-none absolute inset-0 opacity-80">
                  <div className="absolute -top-20 -left-20 h-[280px] w-[280px] rounded-full bg-accent/12 blur-3xl"></div>
                  <div className="absolute -bottom-24 -right-24 h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-3xl"></div>
                </div>
                <div className="relative flex items-center justify-between gap-3">
                  <div className="text-sm font-extrabold tracking-tight">历史记录</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-app-border/12 bg-app-surface/20 px-3 py-1.5 text-xs text-app-fg hover:bg-app-surface/30"
                      onClick={() => {
                        setHistoryAndPersist([]);
                        setActiveHistoryId(undefined);
                      }}
                    >
                      清空
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-app-border/12 bg-app-surface/20 px-3 py-1.5 text-xs text-app-fg hover:bg-app-surface/30"
                      onClick={() => setHistoryOpen(false)}
                    >
                      关闭
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-[72vh] overflow-auto p-3 custom-scrollbar">
                {historyItems.length ? (
                  <div className="space-y-2">
                    {historyItems.map((h) => {
                      const thumb = h.companionImageUrl || h.selectedImageUrl || h.images[0];
                      const isActive = h.id === activeHistoryId;
                      return (
                        <div
                          key={h.id}
                          className={`flex gap-3 rounded-3xl border px-3 py-2 transition-colors ${
                            isActive ? "border-accent/50 bg-accent/10" : "border-app-border/12 bg-app-surface/15 hover:bg-app-surface/20"
                          }`}
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-app-border/12 bg-app-bg/30">
                            {thumb ? (
                              <img
                                src={thumb.startsWith("http") ? toProxyUrl(apiBaseUrl, thumb) : thumb}
                                className="h-full w-full object-contain"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs text-app-muted">{formatTime(h.createdAt)}</div>
                              <div className="text-[11px] text-app-muted/90">
                                {h.kind === "creator"
                                  ? `留言显化 / ${rarityLabel(h.creatorProfile?.rarityTier)} / ${dangerLabel(h.creatorProfile?.dangerLevel)}`
                                  : h.kind === "companion"
                                  ? `伴生兽 / ${rarityLabel(h.companionProfile?.rarityTier)} / ${dangerLabel(h.companionProfile?.dangerLevel)}`
                                  : h.kind === "i23d"
                                    ? "旧版图生3D记录"
                                    : `文生图 / ${h.images.length}张`}
                              </div>
                            </div>
                            <div className="mt-1 truncate text-sm text-app-fg">{h.prompt || "-"}</div>
                          </div>
                          <div className="flex shrink-0 flex-col gap-2">
                            <button
                              type="button"
                              className="rounded-2xl bg-accent px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0066d6] shadow-[0_10px_24px_rgba(0,122,255,0.18)]"
                              onClick={() => {
                                setError(undefined);
                                setT2iLoading(false);
                                setCompanionLoading(false);
                                setCreatorLoading(false);
                                setCreator3dLoading(false);
                                setPrompt(h.prompt);
                                setSize(h.size);
                                setN(h.n);
                                setImages(h.images);
                                setCosUrlByImageUrl(h.cosUrlByImageUrl || {});
                                setCosUploading({});
                                setSelectedImageUrl(h.selectedImageUrl);
                                setTaskId(h.kind === "creator" ? undefined : h.taskId);
                                setTaskStatus(h.kind === "creator" ? undefined : h.taskStatus);
                                setModelUrl(h.kind === "creator" ? undefined : h.modelUrl);
                                setCompanionProfile(h.companionProfile);
                                setCompanionImageUrl(h.companionImageUrl || h.images[0]);
                                setCompanionSceneBgUrl(h.companionSceneBgUrl);
                                setModelBgMode(h.companionSceneBgUrl ? "scene" : "portrait");
                                setCreatorText(h.kind === "creator" ? h.prompt : "");
                                setCreatorResult(
                                  h.kind === "creator" && h.creatorProfile
                                    ? {
                                        profile: h.creatorProfile,
                                        imageUrl: h.selectedImageUrl || h.images[0],
                                        taskId: h.taskId,
                                        taskStatus: h.taskStatus,
                                        modelUrl: h.modelUrl,
                                      }
                                    : undefined,
                                );
                                setActiveHistoryId(h.id);
                                setTab(h.kind === "creator" ? "creator" : h.kind === "companion" ? "companion" : "t2i");
                                setHistoryOpen(false);
                              }}
                            >
                              恢复
                            </button>
                            <button
                              type="button"
                              className="rounded-2xl border border-app-border/12 bg-app-bg/25 px-2.5 py-1.5 text-xs text-app-fg hover:bg-app-bg/35"
                              onClick={() => {
                                const next = historyItems.filter((x) => x.id !== h.id);
                                setHistoryAndPersist(next);
                                if (activeHistoryId === h.id) setActiveHistoryId(undefined);
                              }}
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-app-muted">暂无历史记录</div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TabButton(props: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={props.onClick}
      className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
        props.active
          ? "bg-app-elevated/85 text-app-fg shadow-sm border border-app-border/12"
          : "bg-transparent text-app-muted hover:bg-app-surface/25 border border-transparent"
      } ${props.className || ""}`}
    >
      {props.children}
    </button>
  );
}

function InfoChip(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-app-border/12 bg-app-bg/20 px-3 py-2">
      <div className="text-[11px] text-app-muted">{props.label}</div>
      <div className="mt-1 text-xs font-semibold text-app-fg">{props.value}</div>
    </div>
  );
}

function StatusPill(props: { children: React.ReactNode; tone?: "default" | "warn" }) {
  const toneClass =
    props.tone === "warn"
      ? "border-amber-400/25 bg-amber-500/10 text-amber-100"
      : "border-accent/20 bg-accent/10 text-accent";
  return <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${toneClass}`}>{props.children}</div>;
}

function ImageCard(props: {
  url: string;
  rawUrl?: string;
  cosUrl?: string;
  uploading: boolean;
  onUpload: () => void;
  onUse: () => void;
  selected: boolean;
  previewHeightClass?: string;
}) {
  return (
    <div
      className={`group rounded-3xl border overflow-hidden transition-colors ${
        props.selected ? "border-accent/60 shadow-[0_10px_30px_rgba(0,122,255,0.20)]" : "border-app-border/12 hover:border-app-border/22"
      }`}
    >
      <div className="relative">
        <div className={`relative w-full ${props.previewHeightClass || "h-36"} bg-black/20`}>
          <img src={props.url} className="absolute inset-0 h-full w-full object-contain" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {props.selected ? (
          <div className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[11px] text-white backdrop-blur">
            已选
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-2 p-2.5 bg-app-elevated/35">
        <button
          onClick={props.onUse}
          className="rounded-2xl bg-app-bg/25 px-2.5 py-1.5 text-xs text-app-fg hover:bg-app-bg/35 border border-app-border/10"
        >
          选为参考
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={props.onUpload}
            disabled={props.uploading}
            className="rounded-2xl border border-app-border/12 bg-app-bg/25 px-2.5 py-1.5 text-xs text-app-fg hover:bg-app-bg/35 disabled:opacity-60"
          >
            {props.uploading ? "上传中..." : props.cosUrl ? "已上传" : "上传COS"}
          </button>
          <a className="text-xs text-app-muted hover:text-app-fg" href={props.rawUrl || props.url} target="_blank" rel="noreferrer">
            原图
          </a>
          {props.cosUrl ? (
            <a className="text-xs text-accent hover:opacity-90" href={props.cosUrl} target="_blank" rel="noreferrer">
              COS
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function guessApiBaseUrl() {
  const p = new URLSearchParams(location.search);
  const fromQuery = p.get("apiBaseUrl");
  if (fromQuery) return fromQuery;
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL;
  if (fromEnv) return String(fromEnv);
  return "http://localhost:8787";
}

function toProxyUrl(apiBaseUrl: string, rawUrl: string) {
  const base = apiBaseUrl.replace(/\/$/, "");
  return `${base}/api/proxy?url=${encodeURIComponent(rawUrl)}`;
}

function postToHost(msg: PluginEventMessage, props: AiPluginPanelProps) {
  if (props.onImageGenerated || props.onModelGenerated || props.onCompanionAwakened || props.onError) return;
  if (window.parent && window.parent !== window) {
    postPluginEvent(window.parent, msg);
  }
}

function storageKey(ns: string, baseKey: string) {
  const clean = String(ns || "").trim().replace(/[^a-z0-9_\-:.]/gi, "_");
  return `u:${clean}:${baseKey}`;
}

function loadPersistedPanelState(storageNs: string): PersistedPanelState | undefined {
  try {
    const raw = localStorage.getItem(storageKey(storageNs, PANEL_PERSIST_KEY));
    if (!raw) return;
    const parsed = JSON.parse(raw) as PersistedPanelState;
    if (!parsed || typeof parsed !== "object") return;
    if (parsed.v !== 1) return;
    const nextSize = normalizeT2ISize(parsed.size);
    return nextSize === parsed.size ? parsed : { ...parsed, size: nextSize };
  } catch {
    return;
  }
}

function savePersistedPanelState(storageNs: string, state: PersistedPanelState) {
  try {
    localStorage.setItem(storageKey(storageNs, PANEL_PERSIST_KEY), JSON.stringify(state));
  } catch {
    void 0;
  }
}

function loadHistoryEntries(storageNs: string): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(storageNs, HISTORY_PERSIST_KEY));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PersistedHistory;
    if (!parsed || typeof parsed !== "object") return [];
    if (parsed.v !== 1) return [];
    if (!Array.isArray(parsed.items)) return [];
    return normalizeHistoryItems(
      parsed.items
        .filter((x) => x && typeof x === "object" && typeof x.id === "string")
        .map((h) => {
          if (h.selectedImageUrl?.startsWith("blob:")) {
            return { ...h, selectedImageUrl: undefined };
          }
          return h;
        }),
    ).slice(0, 30);
  } catch {
    return [];
  }
}

function saveHistoryEntries(storageNs: string, items: HistoryEntry[]) {
  try {
    const payload: PersistedHistory = { v: 1, items };
    localStorage.setItem(storageKey(storageNs, HISTORY_PERSIST_KEY), JSON.stringify(payload));
  } catch {
    void 0;
  }
}

function normalizeTheme(input: unknown): PluginTheme | undefined {
  if (input === "system" || input === "paper" || input === "midnight" || input === "dark" || input === "light") {
    return input;
  }
  return undefined;
}

function normalizeT2ISize(input: unknown): string {
  const fallback = "2K";
  if (typeof input !== "string") return fallback;
  const s = input.trim();
  if (!s) return fallback;
  if (/^(2K|4K)$/i.test(s)) return s.toUpperCase();
  const m = s.match(/^(\d+)\s*x\s*(\d+)$/i);
  if (!m) return fallback;
  const w = Number(m[1]);
  const h = Number(m[2]);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return fallback;
  const pixels = w * h;
  return pixels >= 3686400 ? `${w}x${h}` : fallback;
}

function formatDuration(totalSec: number) {
  const sec = Math.max(0, Math.floor(totalSec || 0));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function loadPersistedTheme(storageNs: string): PluginTheme | undefined {
  try {
    const raw = localStorage.getItem(storageKey(storageNs, THEME_PERSIST_KEY));
    if (!raw) return undefined;
    return normalizeTheme(raw);
  } catch {
    return undefined;
  }
}

function savePersistedTheme(storageNs: string, theme: PluginTheme) {
  try {
    localStorage.setItem(storageKey(storageNs, THEME_PERSIST_KEY), theme);
  } catch {
    void 0;
  }
}

function usePrefersDark() {
  const [prefersDark, setPrefersDark] = useState(() => {
    try {
      return typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : true;
    } catch {
      return true;
    }
  });

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

  return prefersDark;
}

function createHistoryEntrySnapshot(input: {
  kind?: "t2i" | "i23d" | "companion" | "creator";
  prompt?: string;
  size?: string;
  n?: number;
  images?: string[];
  cosUrlByImageUrl?: Record<string, string>;
  selectedImageUrl?: string;
  taskId?: string;
  taskStatus?: string;
  modelUrl?: string;
  companionImageUrl?: string;
  companionSceneBgUrl?: string;
  companionSummary?: string;
  companionProfile?: CompanionBeastProfile;
  creatorProfile?: CreatorProfile;
}): HistoryEntry {
  return {
    id: genId(),
    kind: input.kind ?? (input.creatorProfile ? "creator" : input.taskId || input.modelUrl ? "i23d" : input.companionProfile ? "companion" : "t2i"),
    createdAt: Date.now(),
    prompt: input.prompt ?? "",
    size: input.size ?? "2K",
    n: input.n ?? 1,
    images: input.images ?? [],
    cosUrlByImageUrl: input.cosUrlByImageUrl ?? {},
    selectedImageUrl: input.selectedImageUrl,
    taskId: input.taskId,
    taskStatus: input.taskStatus,
    modelUrl: input.modelUrl,
    companionImageUrl: input.companionImageUrl,
    companionSceneBgUrl: input.companionSceneBgUrl,
    companionSummary: input.companionSummary,
    companionProfile: input.companionProfile,
    creatorProfile: input.creatorProfile,
  };
}

function normalizeHistoryEntry(input: Partial<HistoryEntry> & { id: string }): HistoryEntry {
  const kind =
    input.kind === "creator" || input.creatorProfile
      ? "creator"
      : input.kind === "companion"
      ? "companion"
      : input.kind === "i23d" || input.taskId || input.modelUrl
        ? "i23d"
        : "t2i";
  return {
    id: String(input.id || genId()),
    kind,
    createdAt: Number(input.createdAt || Date.now()),
    prompt: String(input.prompt || ""),
    size: String(input.size || "2K"),
    n: Number(input.n || 1),
    images: Array.isArray(input.images) ? input.images.map((x) => String(x || "")).filter(Boolean) : [],
    cosUrlByImageUrl:
      input.cosUrlByImageUrl && typeof input.cosUrlByImageUrl === "object"
        ? Object.fromEntries(Object.entries(input.cosUrlByImageUrl).map(([k, v]) => [String(k), String(v || "")]))
        : {},
    selectedImageUrl: input.selectedImageUrl ? String(input.selectedImageUrl) : undefined,
    taskId: input.taskId ? String(input.taskId) : undefined,
    taskStatus: input.taskStatus ? String(input.taskStatus) : undefined,
    modelUrl: input.modelUrl ? String(input.modelUrl) : undefined,
    companionImageUrl: input.companionImageUrl ? String(input.companionImageUrl) : undefined,
    companionSceneBgUrl: input.companionSceneBgUrl ? String(input.companionSceneBgUrl) : undefined,
    companionSummary: input.companionSummary ? String(input.companionSummary) : undefined,
    companionProfile: input.companionProfile,
    creatorProfile: input.creatorProfile,
  };
}

function normalizeHistoryItems(items: Array<Partial<HistoryEntry> & { id: string }>): HistoryEntry[] {
  const seen = new Set<string>();
  const out: HistoryEntry[] = [];
  for (const raw of items || []) {
    const item = normalizeHistoryEntry(raw);
    if (!item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  out.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  return out.slice(0, 30);
}

function mergeHistoryItems(...groups: Array<HistoryEntry[] | undefined>) {
  const all: HistoryEntry[] = [];
  for (const group of groups) {
    if (Array.isArray(group)) all.push(...group);
  }
  return normalizeHistoryItems(all);
}

function genId() {
  try {
    const c = globalThis.crypto as Crypto | undefined;
    if (c?.randomUUID) return c.randomUUID();
  } catch {
    void 0;
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

function rarityLabel(v: CompanionBeastProfile["rarityTier"] | undefined) {
  if (v === "epic") return "史诗";
  if (v === "gold") return "黄金";
  if (v === "silver") return "白银";
  return "青铜";
}

function dangerLabel(v: CompanionBeastProfile["dangerLevel"] | undefined) {
  if (v === "unnamable") return "不可名状";
  if (v === "containment_breach") return "收容失效";
  if (v === "high_risk") return "高危";
  if (v === "oddity") return "小怪兽";
  return "安全";
}

function combatStyleLabel(v: CompanionBeastProfile["combatStyle"] | undefined) {
  if (v === "attack") return "进攻型";
  if (v === "defense") return "防御型";
  if (v === "control") return "控制型";
  if (v === "chaos") return "混沌型";
  return "辅助型";
}
