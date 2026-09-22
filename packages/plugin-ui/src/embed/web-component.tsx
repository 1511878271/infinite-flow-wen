import { createRoot } from "react-dom/client";
import React from "react";
import { AiPluginPanel, type AiPluginPanelProps } from "../ui/AiPluginPanel";
import { ResonanceDemo } from "../ui/ResonanceDemo";
import css from "../style.css?inline";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Plugin Render Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", backgroundColor: "black", width: "100%", height: "100%" }}>
          <h3>Plugin Crashed</h3>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

type AttrName = "api-base-url" | "theme" | "token" | "auth-token" | "initial-prompt" | "initial-image-url";

class AiPluginPanelElement extends HTMLElement {
  static get observedAttributes(): AttrName[] {
    return ["api-base-url", "theme", "token", "auth-token", "initial-prompt", "initial-image-url"];
  }

  #root?: ReturnType<typeof createRoot>;
  #shadow?: ShadowRoot;

  connectedCallback() {
    if (this.#root) return;
    this.#shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = css;
    this.#shadow.appendChild(style);
    const mount = document.createElement("div");
    mount.className = "ai-plugin-root";
    this.#shadow.appendChild(mount);
    this.#root = createRoot(mount);
    this.#render();
  }

  disconnectedCallback() {
    this.#root?.unmount();
    this.#root = undefined;
    this.#shadow = undefined;
  }

  attributeChangedCallback() {
    this.#render();
  }

  #readProps(): AiPluginPanelProps {
    return {
      apiBaseUrl: this.getAttribute("api-base-url") || undefined,
      theme: (this.getAttribute("theme") as any) || undefined,
      token: this.getAttribute("token") || undefined,
      authToken: this.getAttribute("auth-token") || undefined,
      initialPrompt: this.getAttribute("initial-prompt") || undefined,
      initialImageUrl: this.getAttribute("initial-image-url") || undefined,
      onImageGenerated: (images) => {
        this.dispatchEvent(new CustomEvent("imageGenerated", { detail: { images } }));
      },
      onModelGenerated: (payload) => {
        this.dispatchEvent(new CustomEvent("modelGenerated", { detail: payload }));
      },
      onError: (payload) => {
        this.dispatchEvent(new CustomEvent("pluginError", { detail: payload }));
      },
    };
  }

  #render() {
    if (!this.#root) return;
    this.#root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <AiPluginPanel {...this.#readProps()} />
        </ErrorBoundary>
      </React.StrictMode>,
    );
  }
}

class ResonanceDemoElement extends HTMLElement {
  static get observedAttributes() {
    return ["api-base-url", "chat-history"];
  }

  #root?: ReturnType<typeof createRoot>;
  #shadow?: ShadowRoot;

  connectedCallback() {
    if (this.#root) return;
    this.#shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = css;
    this.#shadow.appendChild(style);
    const mount = document.createElement("div");
    mount.className = "ai-plugin-root";
    this.#shadow.appendChild(mount);
    this.#root = createRoot(mount);
    this.#render();
  }

  disconnectedCallback() {
    this.#root?.unmount();
    this.#root = undefined;
    this.#shadow = undefined;
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    if (!this.#root) return;
    const apiBaseUrl = this.getAttribute("api-base-url") || undefined;
    const chatHistory = this.getAttribute("chat-history") || undefined;
    this.#root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <ResonanceDemo 
            apiBaseUrl={apiBaseUrl} 
            chatHistory={chatHistory} 
            onSend={(text) => {
              this.dispatchEvent(new CustomEvent("on-chat-send", { detail: text, bubbles: true }));
            }}
            onExit={(mode) => {
              this.dispatchEvent(new CustomEvent("on-chat-exit", { detail: { mode }, bubbles: true }));
            }}
          />
        </ErrorBoundary>
      </React.StrictMode>,
    );
  }
}

if (!customElements.get("ai-plugin-panel")) {
  customElements.define("ai-plugin-panel", AiPluginPanelElement);
}
if (!customElements.get("ai-resonance-demo")) {
  customElements.define("ai-resonance-demo", ResonanceDemoElement);
}
