import React, { useMemo, useState } from "react";
import { AiPluginPanel } from "./AiPluginPanel";
import type { PluginTheme } from "../types";
import { SettingsPage } from "./SettingsPage";
import { ResonanceDemo } from "./ResonanceDemo";

type LocalConfig = {
  apiBaseUrl?: string;
  token?: string;
  theme?: PluginTheme;
};

const STORAGE_KEY = "ai_plugin_config_v1";

export function App() {
  const [cfg, setCfg] = useState<LocalConfig>(() => readCfg());
  const path = typeof location !== "undefined" ? location.pathname : "/";

  const apiBaseUrl = useMemo(() => cfg.apiBaseUrl || undefined, [cfg.apiBaseUrl]);

  if (path === "/settings") {
    return <SettingsPage cfg={cfg} onChange={setCfg} />;
  }

  if (path === "/resonance-demo") {
    return <ResonanceDemo />;
  }

  return (
    <AiPluginPanel
      apiBaseUrl={apiBaseUrl}
      token={cfg.token}
      theme={cfg.theme}
    />
  );
}

function readCfg(): LocalConfig {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function writeCfg(cfg: LocalConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}
