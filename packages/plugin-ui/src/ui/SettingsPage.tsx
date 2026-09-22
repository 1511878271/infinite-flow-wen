import React, { useEffect, useMemo, useState } from "react";
import type { PluginTheme } from "../types";
import { writeCfg } from "./App";

type LocalConfig = {
  apiBaseUrl?: string;
  token?: string;
  theme?: PluginTheme;
};

export function SettingsPage(props: { cfg: LocalConfig; onChange: (v: LocalConfig) => void }) {
  const [apiBaseUrl, setApiBaseUrl] = useState(props.cfg.apiBaseUrl || "http://localhost:8787");
  const [token, setToken] = useState(props.cfg.token || "");
  const [theme, setTheme] = useState<PluginTheme>(() => {
    const t = (props.cfg.theme as PluginTheme) || "system";
    if (t === "light") return "paper";
    return t;
  });
  const [health, setHealth] = useState<string>("-");

  const cfg = useMemo(
    () => ({ apiBaseUrl: apiBaseUrl.trim() || undefined, token: token.trim() || undefined, theme }),
    [apiBaseUrl, token, theme],
  );

  useEffect(() => {
    props.onChange(cfg);
    writeCfg(cfg);
  }, [cfg]);

  async function testHealth() {
    setHealth("检查中...");
    try {
      const res = await fetch(`${cfg.apiBaseUrl?.replace(/\/$/, "")}/health`, {
        headers: cfg.token ? { "x-plugin-token": cfg.token } : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      setHealth("ok");
    } catch (e) {
      setHealth(e instanceof Error ? e.message : "failed");
    }
  }

  return (
    <div className="ai-plugin-root w-full max-w-[520px] bg-slate-950 p-4 text-slate-100">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">设置与授权</div>
        <div className="flex items-center gap-2">
          <button
            className="text-xs text-slate-300 hover:text-white"
            onClick={() => {
              try {
                window.parent?.postMessage({ type: "AI_APP_EXIT", mode: "close", source: "settings" }, "*");
              } catch {}
              try {
                window.location.href = "/";
              } catch {}
            }}
          >
            退出
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
          <div className="mb-2 text-xs text-slate-300">API Base URL</div>
          <input
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="http://localhost:8787"
          />
        </div>

        <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
          <div className="mb-2 text-xs text-slate-300">Token（可选）</div>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="x-plugin-token"
          />
        </div>

        <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
          <div className="mb-2 text-xs text-slate-300">主题</div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as PluginTheme)}
            className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option value="system">System（跟随系统）</option>
            <option value="paper">Paper（浅色、阅读友好）</option>
            <option value="midnight">Midnight（深蓝夜幕、科幻但耐看）</option>
            <option value="dark">Dark（纯暗黑、对比更强）</option>
          </select>
        </div>

        <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
          <div className="mb-2 text-xs text-slate-300">连通性校验</div>
          <button
            onClick={testHealth}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
          >
            测试 /health
          </button>
          <div className="mt-2 text-xs text-slate-300">结果：{health}</div>
        </div>
      </div>
    </div>
  );
}
