import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Frown, Flame, Heart, Sparkles, Upload, X, Mic, Square, Settings, Minimize2, BellOff, Bell, Send } from "lucide-react";

type Emotion = "neutral" | "happy" | "angry" | "sad" | "mock";

type VoiceAsset = {
  url: string;
  durationMs?: number;
  mime?: string;
};

type Message = {
  id: string;
  sender: "me" | "other";
  kind: "text" | "audio";
  text?: string;
  audio?: VoiceAsset;
  emotion: Emotion;
  sourceLabel?: string;
  sourceKind?: "human" | "agent" | "system";
};

// 预设两张无背景的全身立绘
// 本地测试用的默认化身
const LOCAL_GLB_ME = "/glb/537750f783bfeaf24d4e77f9330794f2.glb";
const LOCAL_GLB_OTHER = "/glb/80.glb";

const getAvatarFallbackUrl = (role: "me" | "other") => `${role === "me" ? LOCAL_GLB_ME : LOCAL_GLB_OTHER}#glb`;

const normalizeAvatarUrl = (rawUrl: string, role: "me" | "other") => {
  const raw = String(rawUrl || "").trim();
  if (!raw) return getAvatarFallbackUrl(role);
  const isGlb = raw.toLowerCase().includes(".glb") || raw.endsWith("#glb");
  return isGlb ? (raw.endsWith("#glb") ? raw : `${raw}#glb`) : raw;
};

const PinchZoomWrapper = ({ children, disabled }: { children: React.ReactNode, disabled?: boolean }) => {
  const [scale, setScale] = useState(1);
  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
      initialScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled) return;
    if (e.touches.length === 2 && initialDistanceRef.current !== null) {
      e.stopPropagation(); // 阻止事件冒泡，避免触发其他拖拽
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const newScale = Math.min(Math.max(0.5, initialScaleRef.current * (distance / initialDistanceRef.current)), 3);
      setScale(newScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled) return;
    if (e.touches.length < 2) {
      initialDistanceRef.current = null;
    }
  };

  return (
    <div 
      className={`w-full h-full flex items-center justify-center ${disabled ? '' : 'touch-none'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `scale(${disabled ? 1 : scale})`, transition: 'transform 0.1s ease-out' }}
    >
      {children}
    </div>
  );
};

const AvatarViewer = React.memo(({ url, role, apiBaseUrl }: { url: string, role: "me" | "other", apiBaseUrl: string }) => {
  const viewerRef = useRef<any>(null);
  const [resolvedUrl, setResolvedUrl] = useState(() => normalizeAvatarUrl(url, role));

  useEffect(() => {
    const next = normalizeAvatarUrl(url, role);
    setResolvedUrl((prev) => (prev === next ? prev : next));
  }, [url, role]);

  const isGlb = resolvedUrl.toLowerCase().includes('.glb') || resolvedUrl.endsWith('#glb');
  
  // 对于历史生成的 modelUrl，我们之前做过 proxy，需要处理下
  let finalSrc = resolvedUrl.replace('#glb', '');
  if (resolvedUrl.includes('tencentcos.cn') || resolvedUrl.includes('volces.com') || resolvedUrl.includes('myqcloud.com')) {
    finalSrc = `${apiBaseUrl}/api/proxy?url=${encodeURIComponent(finalSrc)}`;
  }

  useEffect(() => {
    if (!isGlb || !viewerRef.current) return;
    const fallbackUrl = getAvatarFallbackUrl(role);
    const handleError = () => {
      if (resolvedUrl !== fallbackUrl) {
        setResolvedUrl(fallbackUrl);
      }
    };
    const el = viewerRef.current;
    el.addEventListener("error", handleError);
    return () => {
      el.removeEventListener("error", handleError);
    };
  }, [isGlb, resolvedUrl, role]);

  if (isGlb) {
    return (
      <div className={`relative h-full w-full flex items-center justify-center`}>
        <model-viewer
          ref={viewerRef}
          src={finalSrc}
          class="h-full w-full pointer-events-none"
          camera-controls
          min-camera-orbit="auto auto 5%"
          max-camera-orbit="auto auto 500%"
          interaction-prompt="none"
          shadow-intensity="1"
          environment-image="neutral"
          alt="3D Model"
        >
          <div slot="poster" className="flex h-full w-full items-center justify-center text-white/50">
            加载模型中...
          </div>
        </model-viewer>
      </div>
    );
  }

  return (
    <div className={`h-full w-full flex items-center justify-center`}>
      <img 
        src={finalSrc} 
        alt={role} 
        className="max-h-[80%] max-w-[80%] object-contain drop-shadow-2xl pointer-events-none" 
        onError={() => {
          const fallbackUrl = getAvatarFallbackUrl(role);
          if (resolvedUrl !== fallbackUrl) {
            setResolvedUrl(fallbackUrl);
          }
        }}
      />
    </div>
  );
});

const isModelLikeAvatar = (rawUrl: string) => {
  const raw = String(rawUrl || "").trim().toLowerCase();
  return !raw || raw.includes(".glb") || raw.endsWith("#glb");
};

const getAvatarInitial = (label: string) => {
  const clean = String(label || "").trim();
  return clean ? clean.slice(0, 1).toUpperCase() : "AI";
};

const ChatBubbleAvatar = ({
  url,
  label,
  side,
}: {
  url: string;
  label: string;
  side: "me" | "other";
}) => {
  const [imgSrc, setImgSrc] = useState(() => (isModelLikeAvatar(url) ? "" : String(url || "").trim()));

  useEffect(() => {
    setImgSrc(isModelLikeAvatar(url) ? "" : String(url || "").trim());
  }, [url]);

  const fallbackClass =
    side === "me"
      ? "from-indigo-500 to-fuchsia-500 text-white"
      : "from-emerald-400 to-cyan-500 text-[#08131f]";

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={label}
        className="h-10 w-10 shrink-0 rounded-full border border-white/15 object-cover shadow-[0_6px_18px_rgba(0,0,0,0.28)]"
        onError={() => setImgSrc("")}
      />
    );
  }

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br ${fallbackClass} text-sm font-bold shadow-[0_6px_18px_rgba(0,0,0,0.28)]`}
      aria-label={label}
      title={label}
    >
      {getAvatarInitial(label)}
    </div>
  );
};

export function ResonanceDemo(props: { 
  targetName?: string; 
  isWebComponent?: boolean; 
  apiBaseUrl?: string; 
  chatHistory?: string; 
  chatId?: string;
  initialMeAvatarUrl?: string;
  initialOtherAvatarUrl?: string;
  onSend?: (payload: any) => void;
  onHistoryChange?: (newHistory: string) => void;
  initialSendMode?: "user" | "ai" | "auto";
  onAutomationCommand?: (command: "start" | "stop" | "takeover") => void;
  onExit?: (mode: "back" | "close") => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral");
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceUploading, setVoiceUploading] = useState(false);
  const [voiceDurationMs, setVoiceDurationMs] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<BlobPart[]>([]);
  const voiceStartAtRef = useRef<number>(0);
  const voiceTickRef = useRef<number | null>(null);
  const [sendMode, setSendMode] = useState<"user" | "ai" | "auto">(props.initialSendMode || "user"); // 发送模式状态: user(手动), ai(接管), auto(挂机)
  const otherStageRef = useRef<HTMLDivElement | null>(null);
  const meStageRef = useRef<HTMLDivElement | null>(null);
  const fullStageRef = useRef<HTMLDivElement | null>(null);
  const [chatWidth, setChatWidth] = useState<number>(() => {
    try {
      const raw = localStorage.getItem("ui-resonance-chat-width:v1");
      const n = raw ? Number(raw) : NaN;
      if (Number.isFinite(n)) return n;
    } catch {}
    return 450;
  });

  useEffect(() => {
    setSendMode(props.initialSendMode || "user");
  }, [props.initialSendMode]);
  const [chatResizing, setChatResizing] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });
  const resizeRef = useRef<{ active: boolean; startX: number; startW: number; side: "left" | "right"; pid: number | null }>({
    active: false,
    startX: 0,
    startW: 450,
    side: "right",
    pid: null,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const autoBusyRef = useRef(false);

  const [meMinimized, setMeMinimized] = useState(true);
  const [otherMinimized, setOtherMinimized] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showEmotions, setShowEmotions] = useState(false);

  const base = props.apiBaseUrl || (function () {
    const p = new URLSearchParams(location.search);
    const fromQuery = p.get("apiBaseUrl");
    if (fromQuery) return fromQuery;
    const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL;
    if (fromEnv) return String(fromEnv);
    return "http://localhost:8787";
  })();
  const apiBaseUrl = base.replace(/\/$/, "");

  const getPluginToken = () => {
    const fromEnv = (import.meta as any).env?.VITE_PLUGIN_TOKEN;
    if (fromEnv) return String(fromEnv);
    try {
      const raw = localStorage.getItem("ai_plugin_config_v1");
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return typeof parsed?.token === "string" ? String(parsed.token) : "";
    } catch {
      return "";
    }
  };

  const withPluginTokenHeaders = (headers: Record<string, string>) => {
    const token = getPluginToken();
    if (!token) return headers;
    return { ...headers, "x-plugin-token": token };
  };

  const maybeProxyMediaUrl = (url: string) => {
    const raw = String(url || "").trim();
    if (!raw) return raw;
    if (raw.includes("tencentcos.cn") || raw.includes("volces.com") || raw.includes("myqcloud.com")) {
      return `${apiBaseUrl}/api/proxy?url=${encodeURIComponent(raw)}`;
    }
    return raw;
  };

  useEffect(() => {
    const syncViewportMode = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    syncViewportMode();
    window.addEventListener("resize", syncViewportMode);
    return () => {
      window.removeEventListener("resize", syncViewportMode);
    };
  }, []);

  const formatDuration = (ms?: number) => {
    const n = typeof ms === "number" && Number.isFinite(ms) ? Math.max(0, Math.floor(ms)) : 0;
    const s = Math.floor(n / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

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

  const startVoiceRecording = async () => {
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
          const res = await fetch(`${apiBaseUrl}/api/cos/upload-audio`, {
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
          const msg: Message = {
            id: Date.now().toString(),
            sender: "me",
            kind: "audio",
            text: "",
            audio: { url, durationMs, mime: file.type },
            emotion: "neutral",
          };
          setMessages((prev) => [...prev, msg]);
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
          ? "当前页面在内嵌框架中，浏览器可能禁止麦克风。请在新标签页打开对话页再试。"
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

  const stopVoiceRecording = () => {
    if (!voiceRecorderRef.current) return;
    try {
      if (voiceRecorderRef.current.state === "recording") voiceRecorderRef.current.stop();
    } catch {}
  };

  const autoContinue = async () => {
    if (autoBusyRef.current) return;
    autoBusyRef.current = true;
    try {
      const lastSender = messages.length > 0 ? messages[messages.length - 1].sender : "me";
      const nextSender: "me" | "other" = lastSender === "other" ? "me" : "other";
      const speakerHint = nextSender === "me" ? "你作为右侧角色（我方）" : "你作为左侧角色（对方）";
      const textOnly = messages
        .filter((m) => m.kind === "text" && String(m.text || "").trim())
        .map((m) => ({ role: m.sender === "me" ? "user" : "assistant", content: String(m.text || "") }));
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `你正在进行一段连贯的双人对话。${speakerHint}继续对话。输出应简短自然，最多两段，不要使用回车换行符。` },
            ...textOnly,
            { role: "user", content: "继续对话，作为对方说一句。" }
          ]
        })
      });

      if (!response.ok) return;
      const data = await response.json();
      if (!data?.text) return;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        kind: "text",
        text: data.text,
        sender: nextSender,
        emotion: data.text.length > 20 ? 'happy' : 'neutral',
      };
      setMessages(prev => [...prev, aiMsg]);
      setCurrentEmotion(aiMsg.emotion);
    } catch (error) {
      console.error("Auto chat API error:", error);
    } finally {
      autoBusyRef.current = false;
    }
  };

  // 挂机模式下的前端轮询：每隔一段时间向后端发送一次 ping
  useEffect(() => {
    let timer: any;
    if (sendMode === "auto") {
      if (props.onAutomationCommand) return;
      let isMounted = true;
      const ping = () => {
        if (!isMounted) return;
        if (props.onSend) {
          props.onSend({ text: "ping", role: "system_auto_ping" });
        } else {
          void autoContinue();
        }
        // AI 回复大概需要几秒钟，我们设定下一次 ping 在 8~12 秒之后，显得自然且不会堆积请求
        const nextDelay = 8000 + Math.random() * 4000;
        timer = setTimeout(ping, nextDelay);
      };
      
      // 启动第一次 ping (稍等2秒后开始)
      timer = setTimeout(ping, 2000);
      
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
  }, [sendMode, props.onSend, apiBaseUrl, messages]);

  useEffect(() => {
    // 确保导入并注册 <model-viewer> 组件
    void import("@google/model-viewer");
  }, []);

  useEffect(() => {
    const clamp = (n: number) => Math.max(320, Math.min(720, n));
    setChatWidth((w) => clamp(w));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ui-resonance-chat-width:v1", String(Math.round(chatWidth)));
    } catch {}
  }, [chatWidth]);

  const beginResize = (side: "left" | "right", e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = e.currentTarget;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
    resizeRef.current = {
      active: true,
      startX: e.clientX,
      startW: chatWidth,
      side,
      pid: e.pointerId,
    };
    setChatResizing(true);
    try {
      document.body.style.userSelect = "none";
    } catch {}
  };

  const moveResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeRef.current.active) return;
    const sign = resizeRef.current.side === "right" ? 1 : -1;
    const next = resizeRef.current.startW + sign * (e.clientX - resizeRef.current.startX);
    const clamped = Math.max(320, Math.min(720, next));
    setChatWidth(clamped);
  };

  const endResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeRef.current.active) return;
    const el = e.currentTarget;
    try {
      if (resizeRef.current.pid != null) el.releasePointerCapture(resizeRef.current.pid);
    } catch {}
    resizeRef.current.active = false;
    resizeRef.current.pid = null;
    setChatResizing(false);
    try {
      document.body.style.userSelect = "";
    } catch {}
  };

  useEffect(() => {
    if (props.chatHistory) {
      try {
        const parsed = JSON.parse(props.chatHistory);
        if (Array.isArray(parsed)) {
          // 如果解析出的历史记录长度与当前消息列表不同，说明有新的消息同步过来了，强制更新
          const newMessages: Message[] = parsed.map((item: any, i: number) => {
            const audioUrl = typeof item?.audio?.url === "string" ? String(item.audio.url) : "";
            const kind: "text" | "audio" = audioUrl ? "audio" : "text";
            return {
              id: `history-${i}`,
              sender: item.role === "user" ? "me" : "other",
              kind,
              text: typeof item?.content === "string" ? String(item.content) : "",
              audio: audioUrl
                ? {
                    url: audioUrl,
                    durationMs: typeof item?.audio?.durationMs === "number" ? item.audio.durationMs : undefined,
                    mime: typeof item?.audio?.mime === "string" ? String(item.audio.mime) : undefined,
                  }
                : undefined,
              emotion: "neutral",
              sourceLabel: typeof item?.sourceLabel === "string" ? String(item.sourceLabel) : undefined,
              sourceKind:
                item?.sourceKind === "human" || item?.sourceKind === "agent" || item?.sourceKind === "system"
                  ? item.sourceKind
                  : undefined,
            };
          });
          
          setMessages(prevMessages => {
            // 比较内容是否有差异，如果有差异才更新，避免死循环
            const sig = (m: Message) =>
              [m.sender, m.kind, String(m.text || ""), String(m.audio?.url || "")].join(":");
            const currentText = prevMessages.map(sig).join("|");
            const newText = newMessages.map(sig).join("|");
            if (currentText !== newText) {
              return newMessages;
            }
            return prevMessages;
          });
        }
      } catch (e) {
        console.error("Failed to parse chatHistory", e);
      }
    }
  }, [props.chatHistory]);
  
  // 自定义头像状态（带有本地存储持久化）
  const [meImage, setMeImage] = useState(() => {
    try { 
      const stored = localStorage.getItem("resonance-me-image");
      if (stored && !stored.startsWith("blob:")) return stored;
    } catch (e) {}
    return "";
  });

  // 背景视频状态
  const [bgVideo, setBgVideo] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("resonance-bg-video");
      if (stored && !stored.startsWith("blob:")) return stored;
    } catch (e) {}
    return "/video/bg.mp4"; // 默认刚才复制过去的视频
  });
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { if (bgVideo) localStorage.setItem("resonance-bg-video", bgVideo); } catch (e) {}
  }, [bgVideo]);
  
  const meFileInputRef = useRef<HTMLInputElement>(null);

  // 头像选择弹窗状态
  const [showAvatarSelector, setShowAvatarSelector] = useState<"me" | null>(null);
  
  // 背景选择弹窗状态
  const [showBgSelector, setShowBgSelector] = useState(false);
  const bgLibrary = [
    { name: "默认动态星空", type: "video", url: "/video/bg.mp4", thumb: "/video/bg.mp4" },
    { name: "纯净黑", type: "color", url: "black", thumb: "black" },
    { name: "纯净白", type: "color", url: "white", thumb: "white" },
    { name: "深空蓝", type: "color", url: "#0f172a", thumb: "#0f172a" },
    { name: "赛博紫", type: "color", url: "#2e1065", thumb: "#2e1065" },
    { name: "暗夜绿", type: "color", url: "#064e3b", thumb: "#064e3b" },
  ];
  const [historyImages, setHistoryImages] = useState<string[]>([]);
  const [historyModels, setHistoryModels] = useState<string[]>([]);
  const [libraryModels, setLibraryModels] = useState<{ name: string; urlPath: string }[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [libraryUploading, setLibraryUploading] = useState(false);
  const libraryUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.onHistoryChange && props.isWebComponent === false) {
      // Only send if it's not the initial empty state and we have messages
      if (messages.length > 0) {
        const textHistory = JSON.stringify(
          messages.map((m) => ({
            role: m.sender === "me" ? "user" : "assistant",
            content: String(m.text || ""),
            audio: m.audio ? { url: m.audio.url, durationMs: m.audio.durationMs, mime: m.audio.mime } : undefined,
          })),
        );
        props.onHistoryChange(textHistory);
      }
    }
  }, [messages, props.onHistoryChange, props.isWebComponent]);

  useEffect(() => {
    const imgs = new Set<string>();
    const models = new Set<string>();
    try {
      const rawHistory = localStorage.getItem("ai-plugin-history:v1");
      if (rawHistory) {
        JSON.parse(rawHistory).items?.forEach((item: any) => {
          if (item.images) item.images.forEach((img: string) => imgs.add(img));
          if (item.modelUrl) models.add(item.modelUrl);
        });
      }
    } catch (e) {}
    try {
      const rawPanel = localStorage.getItem("ai-plugin-panel-state:v1");
      if (rawPanel) {
        const parsed = JSON.parse(rawPanel);
        if (parsed.images) parsed.images.forEach((img: string) => imgs.add(img));
        if (parsed.modelUrl) models.add(parsed.modelUrl);
      }
    } catch (e) {}
    setHistoryImages(Array.from(imgs));
    setHistoryModels(Array.from(models));
  }, []);

  useEffect(() => {
    if (!showAvatarSelector) return;
    let cancelled = false;
    setLibraryError(null);
    setLibraryLoading(true);
    void import("@google/model-viewer");
    (async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/model-library`, {
          method: "GET",
          headers: withPluginTokenHeaders({}),
        });
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
        setLibraryModels(next);
        setLibraryLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setLibraryModels([]);
        setLibraryLoading(false);
        setLibraryError(e?.message ? String(e.message) : "加载失败");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showAvatarSelector, apiBaseUrl]);

  useEffect(() => {
    try { localStorage.setItem("resonance-me-image", meImage); } catch (e) {}
  }, [meImage]);

  const [otherImage, setOtherImage] = useState(() => {
    try {
      const stored = localStorage.getItem("resonance-other-image");
      if (stored && !stored.startsWith("blob:")) return stored;
    } catch (e) {}
    return "";
  });

  useEffect(() => {
    try {
      localStorage.setItem("resonance-other-image", otherImage);
    } catch (e) {}
  }, [otherImage]);

  useEffect(() => {
    const raw = String(props.initialMeAvatarUrl || "").trim();
    if (!raw) {
      const fallback = "";
      if (meImage !== fallback) setMeImage(fallback);
      return;
    }
    const isGlb = raw.toLowerCase().includes(".glb") || raw.endsWith("#glb");
    const finalUrl = isGlb ? (raw.endsWith("#glb") ? raw : `${raw}#glb`) : raw;
    if (finalUrl !== meImage) setMeImage(finalUrl);
  }, [props.initialMeAvatarUrl, meImage]);

  useEffect(() => {
    const raw = String(props.initialOtherAvatarUrl || "").trim();
    if (!raw) {
      const fallback = "";
      if (otherImage !== fallback) setOtherImage(fallback);
      return;
    }
    const isGlb = raw.toLowerCase().includes(".glb") || raw.endsWith("#glb");
    const finalUrl = isGlb ? (raw.endsWith("#glb") ? raw : `${raw}#glb`) : raw;
    if (finalUrl !== otherImage) setOtherImage(finalUrl);
  }, [props.initialOtherAvatarUrl, otherImage]);

  const handleMeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const isGlb = file.name.toLowerCase().endsWith(".glb");
    const url = URL.createObjectURL(file);
    
    // 如果是 glb 文件，我们在 URL 后面加个特殊标识后缀（不影响 blob 访问，只是我们自己识别用）
    // blob URL 本身没有后缀，为了统一通过 URL 字符串判断，用 query 附带
    const finalUrl = isGlb ? `${url}#glb` : url;

    setMeImage(finalUrl);
    e.target.value = "";
    setShowAvatarSelector(null);
  };
  
  // 整个舞台的背景氛围色
  const stageColors: Record<Emotion, string> = {
    neutral: "from-slate-900 to-slate-950",
    happy: "from-pink-900/40 to-slate-950",
    angry: "from-red-900/60 to-slate-950",
    sad: "from-blue-900/50 to-slate-950",
    mock: "from-purple-900/50 to-slate-950"
  };

  // 角色立绘的动画状态
  const getAvatarAnimation = (role: "me" | "other", latestMsg?: Message) => {
    // 你可以通过调整这里的 x 和 y 来改变模型在舞台中的移动范围和初始位置
    // x 控制左右平移（正数向右，负数向左）
    // y 控制上下平移（正数向下，负数向上）
    const baseX = role === "me" ? -10 : 10; // 例如：让双方模型都往中间靠拢一点
    const baseY = -300; // 控制模型距离顶部的基础高度

    if (!latestMsg) return { scale: 0.5, x: baseX, filter: "brightness(1)", y: baseY };
    
    const isSender = latestMsg.sender === role;
    const emotion = latestMsg.emotion;

    if (emotion === "angry") {
      return isSender 
        ? { scale: 1.2, y: [baseY, baseY - 10, baseY + 10, baseY - 10, baseY], filter: "brightness(1.2) drop-shadow(0 0 10px red)" } // 发火者放大颤抖
        : { scale: 0.9, x: baseX + (role === "me" ? -20 : 20), y: baseY, filter: "brightness(0.5)" }; // 被吼的后退变暗
    }
    if (emotion === "happy") {
      return { scale: 1.1, x: baseX + (role === "me" ? 30 : -30), y: baseY, filter: "brightness(1.1) drop-shadow(0 0 10px pink)" };
    }
    if (emotion === "sad") {
      return isSender 
        ? { scale: 0.95, y: baseY + 10, filter: "brightness(0.7) drop-shadow(0 0 10px blue)" } 
        : { scale: 1, x: baseX, y: baseY, filter: "brightness(0.9)" };
    }
    if (emotion === "mock") {
      return isSender 
        ? { scale: 1.05, rotate: role === "me" ? 5 : -5, x: baseX, y: baseY, filter: "brightness(1.1) drop-shadow(0 0 10px purple)" }
        : { scale: 0.95, x: baseX, y: baseY, filter: "brightness(0.8)" };
    }
    return { scale: 0.5, x: baseX, filter: "brightness(1)", y: baseY };
  };

  const handleSend = async () => {
    if (!inputText.trim() && currentEmotion === "neutral") return;
    
    // 如果有传递 onSend，说明这是在 Streamlit 环境里真正的接管模式
    if (props.onSend) {
      // 乐观更新 UI
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: sendMode === "user" ? "me" : "other",
        kind: "text",
        text: inputText,
        emotion: currentEmotion
      };
      
      if (sendMode === "user") {
        // 先发送，避免被 React 更新打断
        props.onSend({ text: inputText, role: "user" });
        
        const typingMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "other",
          kind: "text",
          text: "...",
          emotion: "neutral"
        };
        setMessages(prev => [...prev, newMsg, typingMsg]);
      } else {
        props.onSend({ text: inputText, role: "assistant" });
        setMessages(prev => [...prev, newMsg]);
      }
      
      setInputText("");
      return;
    }
    
    // 以下为纯前端演示逻辑
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: sendMode === "ai" ? "other" : "me",
      kind: "text",
      text: inputText,
      emotion: currentEmotion
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText("");

    // If running independently in React App, handle chat locally
    if (props.isWebComponent === false) {
      if (sendMode === "ai") {
        return;
      }
      try {
        const textOnly = [...messages, newMsg]
          .filter((m) => m.kind === "text" && String(m.text || "").trim())
          .map((m) => ({ role: m.sender === "me" ? "user" : "assistant", content: String(m.text || "") }));
        const response = await fetch(`${apiBaseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You are a helpful AI assistant in a 3D chat environment. Keep your answers concise and conversational." },
              ...textOnly
            ]
          })
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          kind: "text",
          text: data.text,
          sender: "other",
          emotion: data.text.length > 20 ? 'happy' : 'neutral',
        };
        setMessages(prev => [...prev, aiMsg]);
        setCurrentEmotion(aiMsg.emotion);
        
      } catch (error) {
        console.error("Chat API error:", error);
      }
      return;
    }
    
    // 模拟对方丰富回复语料库
    const replyPool: Record<Emotion, { text: string; emotion: Emotion }[]> = {
      angry: [
        { text: "对不起嘛，别生气了...", emotion: "sad" },
        { text: "消消气，给你买好吃的~", emotion: "happy" },
        { text: "哼，你凶我！", emotion: "angry" }
      ],
      happy: [
        { text: "我也想你！", emotion: "happy" },
        { text: "看你开心我也开心~", emotion: "happy" },
        { text: "贴贴！", emotion: "happy" }
      ],
      sad: [
        { text: "抱抱，我在呢...", emotion: "sad" },
        { text: "摸摸头，一切都会好起来的", emotion: "neutral" },
        { text: "别难过啦，给你讲个笑话？", emotion: "happy" }
      ],
      mock: [
        { text: "略略略，就不听！", emotion: "mock" },
        { text: "你厉害行了吧！", emotion: "angry" },
        { text: "哼，不理你了！", emotion: "angry" }
      ],
      neutral: [
        { text: "嗯嗯，在听呢。", emotion: "neutral" },
        { text: "原来是这样呀。", emotion: "neutral" },
        { text: "然后呢？", emotion: "neutral" }
      ]
    };

    setTimeout(() => {
      const replies = replyPool[currentEmotion] || replyPool.neutral;
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "other",
        kind: "text",
        text: randomReply.text,
        emotion: randomReply.emotion
      }]);
    }, 2000);
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgVideo(url);
    e.target.value = "";
  };

  const latestMessage = messages[messages.length - 1];
  const stageBg = latestMessage ? stageColors[latestMessage.emotion] : stageColors.neutral;

  const isColorBg = bgVideo && (bgVideo.startsWith("#") || ["black", "white"].includes(bgVideo));
  // 根据背景颜色决定文字的默认颜色，如果是浅色背景（如纯净白），则使用深色文字
  const isLightBg = bgVideo === "white";
  const defaultTextColor = isLightBg ? "text-slate-800" : "text-white";

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const otherName = props.targetName || "对方";
  const meName = "我";
  const parseStage = (text: string) => {
    const t = String(text || "").trim();
    const m = t.match(/^((（[^）]{1,24}）)|(\([^)]{1,24}\)))\s*(.*)$/);
    if (!m) return { stage: "", content: t };
    const stage = String(m[1] || "").trim();
    const content = String(m[4] || "").trim();
    return { stage, content };
  };

  return (
    <div 
      className={`relative flex h-screen w-full flex-col overflow-hidden ${defaultTextColor} transition-colors duration-1000 ${isColorBg ? '' : `bg-gradient-to-b ${stageBg}`}`}
      style={isColorBg ? { backgroundColor: bgVideo } : {}}
    >
      
      {/* 背景层 */}
      {bgVideo && !isColorBg && (
        <video 
          src={bgVideo} 
          autoPlay loop muted playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen pointer-events-none"
        />
      )}

      {/* 顶部中央：对方昵称 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className={`backdrop-blur-md px-6 py-2 rounded-full border shadow-lg flex items-center gap-2 ${isLightBg ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-white/10'}`}>
          <span className="w-2 h-2 rounded-full bg-[#34f5c5] shadow-[0_0_8px_#34f5c5] animate-pulse"></span>
          <span className={`font-medium tracking-wider text-sm ${isLightBg ? 'text-slate-800' : 'text-white'}`}>{otherName}</span>
        </div>
      </div>

      {/* 顶部控制栏 */}
      <div className="absolute right-4 top-4 z-50 flex flex-col items-end gap-2 pointer-events-auto">
        {/* 设置菜单 (悬浮展开) */}
        <div className="group relative flex flex-col items-end">
          <button className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur border transition-colors ${isLightBg ? 'bg-slate-200/50 hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-white/10 hover:bg-white/20 text-white border-white/10'}`}>
            <Settings className="h-4 w-4" />
          </button>
          
          <div className="absolute right-full top-0 mr-2 flex flex-col gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
            <button
              onClick={() => setShowBgSelector(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur border transition-colors whitespace-nowrap ${isLightBg ? 'bg-slate-200/80 hover:bg-white text-slate-700 border-slate-300' : 'bg-white/10 hover:bg-white/20 text-white border-white/10'}`}
            >
              <Upload className="h-4 w-4" />
              更换背景库
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur border transition-colors whitespace-nowrap ${
                isMuted 
                  ? "bg-indigo-500/20 text-indigo-500 border-indigo-500/50 hover:bg-indigo-500/30" 
                  : isLightBg ? 'bg-slate-200/80 hover:bg-white text-slate-700 border-slate-300' : "bg-white/10 text-white border-white/10 hover:bg-white/20"
              }`}
            >
              {isMuted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              {isMuted ? "已开启免打扰" : "消息免打扰"}
            </button>
          </div>
        </div>
      </div>

      {/* 隐藏的背景视频上传框 */}
      <input type="file" accept="video/mp4,video/webm" className="hidden" ref={bgFileInputRef} onChange={handleBgUpload} />

      {/* 头像选择弹窗 */}
      <AnimatePresence>
        {showAvatarSelector && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl bg-slate-900 p-6 border border-slate-700 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">更换我的化身</h3>
                <button onClick={() => setShowAvatarSelector(null)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <input
                ref={libraryUploadRef}
                type="file"
                accept=".glb"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files.length ? e.target.files[0] : null;
                  if (!file) return;
                  setLibraryUploading(true);
                  setLibraryError(null);
                  try {
                    const fd = new FormData();
                    fd.append("model", file);
                    const res = await fetch(`${apiBaseUrl}/api/model-library/upload`, {
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
                    setLibraryModels((prev) => {
                      const name = file.name.replace(/\.glb$/i, "");
                      const item = { name, urlPath };
                      const next = [item, ...(prev || [])].filter((x, idx, arr) => arr.findIndex((y) => y.urlPath === x.urlPath) === idx);
                      return next;
                    });
                    setMeImage(`${apiBaseUrl}${urlPath}#glb`);
                    setShowAvatarSelector(null);
                  } catch (err: any) {
                    setLibraryError(err?.message ? String(err.message) : "上传失败");
                  } finally {
                    setLibraryUploading(false);
                    try {
                      (e.target as any).value = "";
                    } catch {}
                  }
                }}
              />

              <div className="mb-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-400">从模型库中选择（所有人可用）：</p>
                  <button
                    type="button"
                    onClick={() => libraryUploadRef.current?.click()}
                    disabled={libraryUploading}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur hover:bg-white/20 border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {libraryUploading ? "上传中..." : "上传模型"}
                  </button>
                </div>
                {libraryError ? (
                  <div className="mt-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    {libraryError}
                  </div>
                ) : null}
                {libraryLoading ? (
                  <div className="mt-2 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-4 text-center text-sm text-slate-400">
                    模型库加载中...
                  </div>
                ) : libraryModels.length > 0 ? (
                    <div className="mt-2 grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {libraryModels.map((m) => {
                        const url = `${apiBaseUrl}${m.urlPath}`;
                        const proxyUrl = url;
                        return (
                          <div
                            key={m.urlPath}
                            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-transparent hover:border-indigo-500 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all bg-slate-800"
                            onClick={() => {
                              setMeImage(`${url}#glb`);
                              setShowAvatarSelector(null);
                            }}
                            title={m.name}
                          >
                            <model-viewer
                              src={proxyUrl}
                              class="h-full w-full pointer-events-none"
                              interaction-prompt="none"
                              disable-zoom
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-2 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-4 text-center text-sm text-slate-400">
                      模型库暂无模型。你可以先上传一个 .glb。
                    </div>
                  )}
              </div>
              
              {historyModels.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-sm text-slate-400">从最近生成的 3D 模型中选择：</p>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {historyModels.map((url, i) => {
                      let proxyUrl = url;
                      if (url.includes('tencentcos.cn') || url.includes('volces.com') || url.includes('myqcloud.com')) {
                        proxyUrl = `${apiBaseUrl}/api/proxy?url=${encodeURIComponent(url)}`;
                      }
                      return (
                        <div 
                          key={i} 
                          className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-transparent hover:border-indigo-500 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all bg-slate-800"
                          onClick={() => {
                            const finalUrl = `${url}#glb`;
                            setMeImage(finalUrl);
                            setShowAvatarSelector(null);
                          }}
                        >
                          <model-viewer
                            src={proxyUrl}
                            class="h-full w-full pointer-events-none"
                            interaction-prompt="none"
                            disable-zoom
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {historyImages.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-sm text-slate-400">从最近生成的图片中选择：</p>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {historyImages.map((url, i) => {
                      let proxyUrl = url;
                      if (url.includes('tencentcos.cn') || url.includes('volces.com') || url.includes('myqcloud.com')) {
                        proxyUrl = `${apiBaseUrl}/api/proxy?url=${encodeURIComponent(url)}`;
                      }
                      return (
                        <img 
                          key={i} 
                          src={proxyUrl} 
                          alt="history"
                          className="aspect-square w-full rounded-lg object-cover cursor-pointer border border-transparent hover:border-indigo-500 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all"
                          onClick={() => {
                            setMeImage(url);
                            setShowAvatarSelector(null);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => {
                  meFileInputRef.current?.click();
                  setShowAvatarSelector(null);
                }}
                className="w-full rounded-lg bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="h-4 w-4" />
                上传本地图片或模型 (.glb)
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* 背景库选择弹窗 */}
        {showBgSelector && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl bg-slate-900 p-6 border border-slate-700 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">更换背景库</h3>
                <button onClick={() => setShowBgSelector(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {bgLibrary.map((bg, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setBgVideo(bg.url);
                      setShowBgSelector(false);
                    }}
                    className={`relative cursor-pointer aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${bgVideo === bg.url ? 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'border-white/10 hover:border-white/30'}`}
                  >
                    {bg.type === 'video' ? (
                      <video src={bg.thumb} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: bg.thumb }}></div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm py-1 px-2 text-[10px] text-white text-center">
                      {bg.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    bgFileInputRef.current?.click();
                    setShowBgSelector(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                >
                  <Upload className="h-5 w-5" />
                  上传本地视频作为背景
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 隐藏的文件输入框 */}
      <input 
        type="file" 
        accept="image/*,.glb" 
        className="hidden" 
        ref={meFileInputRef} 
        onChange={handleMeImageUpload} 
      />

      {/* 中心聊天区：回归传统头像聊天 */}
      <div ref={fullStageRef} className="relative flex flex-1 w-full h-full pb-32 overflow-hidden justify-center">
        {false ? (
          <>
            <div 
              ref={otherStageRef} 
              className={
                otherMinimized 
                  ? "absolute top-[80px] left-4 z-50 w-16 h-16 rounded-full border-2 border-white/20 bg-slate-800 overflow-hidden cursor-pointer pointer-events-auto transition-all hover:scale-105 hover:border-indigo-500 shadow-lg"
                  : "absolute md:relative inset-0 md:flex-1 h-full z-30 pointer-events-none flex justify-start md:justify-center"
              }
              onClick={() => {
                if (otherMinimized) setOtherMinimized(false);
              }}
            >
              {!otherMinimized && (
                <button 
                  className={`absolute top-[80px] left-4 z-50 p-2.5 backdrop-blur-md rounded-full pointer-events-auto transition-all hover:scale-105 border ${isLightBg ? 'bg-white/80 hover:bg-white text-slate-700 border-slate-300 shadow-md' : 'bg-black/40 text-white hover:bg-black/60 border-white/10'}`}
                  onClick={(e) => { e.stopPropagation(); setOtherMinimized(true); }}
                  title="缩小到角落"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              )}
              <div className={otherMinimized ? "w-full h-full pointer-events-none scale-150 origin-top" : "flex items-center justify-center px-1 py-6 md:px-6 pointer-events-none h-full w-1/2 md:w-full"}>
                <motion.div
                  className={otherMinimized ? "w-full h-full flex items-center justify-center" : "group relative flex h-full w-full max-h-[72vh] max-w-[320px] flex-col items-center justify-center md:max-h-[78vh] md:max-w-[420px] pointer-events-auto"}
                  animate={otherMinimized ? { scale: 1, x: 0, y: 0, filter: "brightness(1)" } : getAvatarAnimation("other", latestMessage)}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <PinchZoomWrapper disabled={otherMinimized}>
                    <AvatarViewer url={otherImage} role="other" apiBaseUrl={apiBaseUrl} />
                  </PinchZoomWrapper>
                </motion.div>
              </div>
            </div>
            <div 
              ref={meStageRef} 
              className={
                meMinimized
                  ? "absolute top-[80px] right-4 z-50 w-16 h-16 rounded-full border-2 border-white/20 bg-slate-800 overflow-hidden cursor-pointer pointer-events-auto transition-all hover:scale-105 hover:border-pink-500 shadow-lg"
                  : "absolute md:relative inset-0 md:flex-1 h-full z-30 pointer-events-none flex justify-end md:justify-center"
              }
              onClick={() => {
                if (meMinimized) setMeMinimized(false);
              }}
            >
              {!meMinimized && (
                <button 
                  className={`absolute top-[80px] right-4 z-50 p-2.5 backdrop-blur-md rounded-full pointer-events-auto transition-all hover:scale-105 border ${isLightBg ? 'bg-white/80 hover:bg-white text-slate-700 border-slate-300 shadow-md' : 'bg-black/40 text-white hover:bg-black/60 border-white/10'}`}
                  onClick={(e) => { e.stopPropagation(); setMeMinimized(true); }}
                  title="缩小到角落"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              )}
              <div className={meMinimized ? "w-full h-full pointer-events-none scale-150 origin-top" : "flex items-center justify-center px-1 py-6 md:px-6 pointer-events-none h-full w-1/2 md:w-full ml-auto md:ml-0"}>
                <motion.div
                  drag={!meMinimized}
                  dragConstraints={fullStageRef}
                  dragElastic={0.06}
                  dragMomentum={false}
                  whileDrag={meMinimized ? {} : { scale: 1.03, cursor: "grabbing" }}
                  className={meMinimized ? "w-full h-full flex items-center justify-center" : "group relative flex h-full w-full max-h-[72vh] max-w-[320px] cursor-grab touch-none flex-col items-center justify-center md:max-h-[78vh] md:max-w-[420px] pointer-events-auto"}
                  animate={meMinimized ? { scale: 1, x: 0, y: 0, filter: "brightness(1)" } : getAvatarAnimation("me", latestMessage)}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <PinchZoomWrapper disabled={meMinimized}>
                    <AvatarViewer url={meImage} role="me" apiBaseUrl={apiBaseUrl} />
                  </PinchZoomWrapper>
                </motion.div>
              </div>
            </div>
          </>
        ) : null}

        <div
          className="w-full h-full flex flex-col z-20 py-8 relative mx-auto px-2 sm:px-4"
          style={{
            maxWidth: isMobileViewport ? "100%" : "min(100%, 860px)",
            width: isMobileViewport ? "100%" : `${Math.min(Math.round(chatWidth), 860)}px`,
          }}
        >
          <div
            className={`hidden md:block absolute inset-y-10 -left-1 w-2 cursor-col-resize ${chatResizing ? "opacity-100" : "opacity-40 hover:opacity-100"} transition-opacity`}
            onPointerDown={(e) => beginResize("left", e)}
            onPointerMove={moveResize}
            onPointerUp={endResize}
            onPointerCancel={endResize}
          >
          </div>
          <div
            className={`hidden md:block absolute inset-y-10 -right-1 w-2 cursor-col-resize ${chatResizing ? "opacity-100" : "opacity-40 hover:opacity-100"} transition-opacity`}
            onPointerDown={(e) => beginResize("right", e)}
            onPointerMove={moveResize}
            onPointerUp={endResize}
            onPointerCancel={endResize}
          >
          </div>
          <div className="flex-1 w-full flex flex-col overflow-hidden rounded-3xl bg-transparent shadow-none">
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar flex flex-col">
              <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => {
                    const isMe = msg.sender === "me";
                    const baseText = msg.kind === "text" ? String(msg.text || "") : "";
                    const { stage, content } = parseStage(baseText);
                    const isStageOnly = msg.kind === "text" && !!stage && !content;
                    const name = isMe ? meName : otherName;
                    const displayLabel = msg.sourceLabel || name;
                    const sourceBadge =
                      msg.sourceKind === "agent"
                        ? "AI 代理"
                        : msg.sourceKind === "human"
                          ? (isMe ? "本人" : "真人")
                          : msg.sourceKind === "system"
                            ? "系统"
                            : "";
                    const accent = "#34f5c5";
                    const prevSender = idx > 0 ? messages[idx - 1]?.sender : null;
                    const showLabel = prevSender !== msg.sender && !isStageOnly;

                    const bubbleContent =
                      msg.kind === "audio" && msg.audio?.url ? (
                        <div className="flex flex-col gap-2">
                          <div className="text-[12px] text-white/80 flex items-center gap-2">
                            <span>🎤 语音消息</span>
                            {typeof msg.audio.durationMs === "number" && (
                              <span className="text-white/50">{formatDuration(msg.audio.durationMs)}</span>
                            )}
                          </div>
                          <audio
                            controls
                            src={maybeProxyMediaUrl(msg.audio.url)}
                            className="w-[260px] max-w-full h-9"
                          />
                        </div>
                      ) : (
                        content
                      );

                    if (isStageOnly) {
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 180, damping: 22 }}
                          className="flex justify-center w-full"
                        >
                          <div className={`px-3 py-1.5 rounded-full border border-white/10 text-[12px] italic tracking-wide ${isLightBg ? 'bg-slate-200/60 text-slate-600' : 'bg-black/25 text-white/55'}`}>
                            {stage}
                          </div>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className={`flex ${isMe ? "justify-end" : "justify-start"} w-full`}
                      >
                        <div className={`flex max-w-[92%] items-end gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                          <ChatBubbleAvatar
                            url={isMe ? meImage : otherImage}
                            label={displayLabel}
                            side={isMe ? "me" : "other"}
                          />
                          <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            {showLabel && (
                              <div className={`flex items-center gap-2 text-[11px] mb-1 ${isMe ? "justify-end" : "justify-start"} ${isLightBg ? 'text-slate-500' : 'text-white/50'}`}>
                                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                                <span className="font-semibold tracking-wide">{displayLabel}</span>
                                {sourceBadge ? (
                                  <span className={`rounded-full px-1.5 py-[1px] text-[10px] border ${isLightBg ? 'border-slate-300 bg-slate-100 text-slate-600' : 'border-white/10 bg-white/10 text-white/70'}`}>
                                    {sourceBadge}
                                  </span>
                                ) : null}
                                {stage && <span className={`italic truncate max-w-[260px] ${isLightBg ? 'text-slate-400' : 'text-white/35'}`}>{stage}</span>}
                              </div>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed tracking-wide backdrop-blur-sm border ${
                                isMe
                                  ? "bg-gradient-to-br from-indigo-500/90 to-purple-600/90 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(99,102,241,0.3)] border-white/10"
                                  : isLightBg 
                                    ? "bg-white text-slate-800 rounded-tl-sm shadow-lg border-slate-200"
                                    : "bg-white/10 text-slate-50 rounded-tl-sm shadow-lg border-white/5"
                              }`}
                              style={{
                                borderLeftWidth: isMe ? undefined : 3,
                                borderLeftStyle: isMe ? undefined : "solid",
                                borderLeftColor: isMe ? undefined : accent,
                                borderRightWidth: isMe ? 3 : undefined,
                                borderRightStyle: isMe ? "solid" : undefined,
                                borderRightColor: isMe ? accent : undefined,
                                boxShadow: isMe
                                  ? "inset -2px 0 0 #34f5c5, 0 6px 22px rgba(0,0,0,0.35)"
                                  : "inset 2px 0 0 #34f5c5, 0 6px 22px rgba(0,0,0,0.35)",
                              }}
                            >
                              {bubbleContent}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* 底部控制台 (统一整合) */}
      <div className={`absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center pb-8 pt-24 pointer-events-none ${isLightBg ? 'bg-gradient-to-t from-white/90 via-white/40 to-transparent' : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'}`}>
        
        {/* 控制面板主体 */}
        <div className={`flex flex-col w-full max-w-4xl pointer-events-auto backdrop-blur-xl border rounded-[2rem] p-2 shadow-2xl relative ${isLightBg ? 'bg-white/60 border-slate-200 shadow-slate-200/50' : 'bg-black/40 border-white/10'}`}>
          
          {/* 第一行：接管与托管 */}
          <div className="flex justify-end items-center px-4 pt-2 pb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSendMode("ai");
                  if (sendMode === "auto" && props.onAutomationCommand) props.onAutomationCommand("takeover");
                  else if (props.onSend && sendMode === "auto") props.onSend({ text: "停止挂机", role: "system_auto_stop" });
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  sendMode === "ai" 
                  ? "bg-pink-500/20 text-pink-500 border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]" 
                  : isLightBg ? "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent" : "text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                ❤️ 真人接管
              </button>
              <button
                onClick={() => {
                  setSendMode("auto");
                  if (props.onAutomationCommand) props.onAutomationCommand("start");
                  else if (props.onSend) props.onSend({ text: "开始挂机", role: "system_auto_start" });
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  sendMode === "auto" 
                  ? "bg-indigo-500/20 text-indigo-500 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                  : isLightBg ? "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent" : "text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                🤖 agent托管
              </button>
            </div>
          </div>

          {/* 情绪选择弹出面板 */}
          <AnimatePresence>
            {showEmotions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute bottom-[80px] right-20 border rounded-2xl p-2 shadow-2xl flex gap-1 z-50 ${isLightBg ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}
              >
                <EmotionButton icon={<Smile className="w-5 h-5"/>} label="开心" active={currentEmotion === "happy"} color="text-pink-500" onClick={() => {setCurrentEmotion("happy"); setShowEmotions(false);}} />
                <EmotionButton icon={<Flame className="w-5 h-5"/>} label="愤怒" active={currentEmotion === "angry"} color="text-red-500" onClick={() => {setCurrentEmotion("angry"); setShowEmotions(false);}} />
                <EmotionButton icon={<Frown className="w-5 h-5"/>} label="难过" active={currentEmotion === "sad"} color="text-blue-500" onClick={() => {setCurrentEmotion("sad"); setShowEmotions(false);}} />
                <EmotionButton icon={<Sparkles className="w-5 h-5"/>} label="嘲讽" active={currentEmotion === "mock"} color="text-purple-500" onClick={() => {setCurrentEmotion("mock"); setShowEmotions(false);}} />
                <EmotionButton icon={<Heart className="w-5 h-5"/>} label="平静" active={currentEmotion === "neutral"} color={isLightBg ? "text-slate-500" : "text-slate-300"} onClick={() => {setCurrentEmotion("neutral"); setShowEmotions(false);}} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 第二行：输入框及其他功能 */}
          {voiceError && (
            <div className="px-6 pt-1 text-xs text-red-400">
              {voiceError}
            </div>
          )}
          <div className={`flex items-center gap-3 rounded-full p-1.5 pl-6 mt-1 border transition-all shadow-inner ${isLightBg ? 'bg-white/50 border-slate-300 focus-within:border-slate-400 focus-within:bg-white' : 'bg-white/5 border-white/5 focus-within:border-white/20 focus-within:bg-white/10'}`}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                sendMode === "auto" 
                  ? "当前为挂机模式，AI 正在自由交谈..." 
                  : sendMode === "ai" 
                  ? "输入文字，你将作为右侧 AI 进行回复..." 
                  : "输入文字..."
              }
              disabled={sendMode === "auto"}
              className={`flex-1 bg-transparent outline-none disabled:opacity-50 text-[15px] ${isLightBg ? 'text-slate-800 placeholder-slate-400' : 'text-white placeholder-white/40'}`}
            />
            
            <button
              onClick={() => {
                if (voiceUploading) return;
                if (voiceRecording) stopVoiceRecording();
                else void startVoiceRecording();
              }}
              disabled={sendMode === "auto" || voiceUploading}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-transform hover:scale-105 active:scale-95 shadow-lg ${
                voiceRecording
                  ? "bg-red-500/25 border-red-400/40"
                  : isLightBg ? "bg-slate-100 border-slate-200 hover:bg-slate-200" : "bg-white/10 border-white/10 hover:bg-white/15"
              }`}
              title={voiceRecording ? "停止录音" : "语音消息"}
            >
              {voiceUploading ? (
                <svg className={`h-5 w-5 animate-spin ${isLightBg ? 'text-slate-600' : 'text-white/80'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : voiceRecording ? (
                <div className="flex flex-col items-center leading-none">
                  <Square className={`h-4 w-4 ${isLightBg ? 'text-slate-800' : 'text-white'}`} />
                  <div className={`mt-0.5 text-[9px] ${isLightBg ? 'text-slate-600' : 'text-white/80'}`}>{formatDuration(voiceDurationMs)}</div>
                </div>
              ) : (
                <Mic className={`h-5 w-5 ${isLightBg ? 'text-slate-600' : 'text-white/80'}`} />
              )}
            </button>

            {/* 表情/情绪收纳按钮 */}
            <button
              onClick={() => setShowEmotions(!showEmotions)}
              disabled={sendMode === "auto"}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-transform hover:scale-105 active:scale-95 shadow-lg ${
                showEmotions || currentEmotion !== "neutral"
                  ? "bg-pink-500/20 border-pink-500/40 text-pink-500"
                  : isLightBg ? "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600" : "bg-white/10 border-white/10 hover:bg-white/15 text-white/80"
              }`}
              title="选择情绪"
            >
              <Smile className="h-6 w-6" />
            </button>

            <button
              onClick={() => {
                if (sendMode === "auto") {
                  setSendMode("user");
                  if (props.onAutomationCommand) props.onAutomationCommand("stop");
                  else if (props.onSend) props.onSend({ text: "停止挂机", role: "system_auto_stop" });
                } else {
                  handleSend();
                }
              }}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                sendMode === "auto" ? "from-slate-600 to-slate-500" :
                currentEmotion === "angry" ? "from-red-500 to-orange-600" :
                currentEmotion === "happy" ? "from-pink-500 to-rose-500" :
                "from-indigo-500 to-purple-600"
              } transition-transform hover:scale-105 active:scale-95 shadow-lg`}
            >
              {sendMode === "auto" ? <span className="text-white text-[10px] font-bold">停止</span> : <Send className="h-5 w-5 text-white drop-shadow-md -ml-0.5" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function EmotionButton({ icon, label, active, color, onClick }: { icon: React.ReactNode, label: string, active: boolean, color: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
        active ? `bg-white/10 ${color} scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10` : "text-white/40 hover:bg-white/5 hover:text-white/80 border border-transparent"
      }`}
    >
      {icon}
      <span className="text-[13px] font-medium">{label}</span>
    </button>
  );
}
