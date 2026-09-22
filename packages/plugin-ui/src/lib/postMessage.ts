import type { PluginEventMessage, PluginInitMessage } from "../types";

export function isInitMessage(data: unknown): data is PluginInitMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as any).type === "AI_PLUGIN_INIT" &&
    typeof (data as any).payload === "object"
  );
}

export function postPluginEvent(target: Window, msg: PluginEventMessage) {
  target.postMessage(msg, "*");
}

