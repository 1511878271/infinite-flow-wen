export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export type T2IRequest = { prompt: string; size?: string; n?: number };
export type T2IResponse = { images: string[] };

export type I2_3DCreateResponse = { taskId: string; status: JobStatus };
export type I2_3DTaskResponse = {
  taskId: string;
  status: JobStatus;
  modelUrl?: string;
  error?: string;
};

export type CompanionBeastProfile = {
  version: 1;
  personaId: string;
  mbti?: string;
  camp: "NF" | "NT" | "SJ" | "SP";
  speciesBase: string;
  speciesNameCn: string;
  rarityTier: "bronze" | "silver" | "gold" | "epic";
  dangerLevel: "safe" | "oddity" | "high_risk" | "containment_breach" | "unnamable";
  combatStyle: "attack" | "defense" | "control" | "support" | "chaos";
  materials: string[];
  traits: string[];
  appearanceSummary: string;
  personalitySummary: string;
  awakeningStory: string;
  imagePrompt?: string;
  recyclable: boolean;
  tradeable: boolean;
  serial?: string | null;
};

export type CompanionBeastHistoryItem = {
  id: string;
  createdAt: number;
  imageUrl?: string;
  sceneBgUrl?: string;
  speciesNameCn: string;
  rarityTier: CompanionBeastProfile["rarityTier"];
  dangerLevel: CompanionBeastProfile["dangerLevel"];
  combatStyle: CompanionBeastProfile["combatStyle"];
  recyclable: boolean;
  serial?: string | null;
  profile: CompanionBeastProfile;
};

export type CompanionSceneBgResponse = {
  imageUrl?: string;
  historyItemId: string;
};

export type PluginTheme = "system" | "paper" | "midnight" | "dark" | "light";

/**
 * Shared host/plugin contract for long-running generation jobs.
 * Keep this union backward compatible because embedded hosts persist these values.
 */
export type AiBusyJobKind =
  | "t2i"
  | "companion2d"
  | "companion3d"
  | "companionSceneBg"
  | "creatorQuickAwaken"
  | "creator3d";

export type AiBusyStatePayload = {
  busy: boolean;
  kind?: AiBusyJobKind;
  label?: string;
  startedAt?: number;
  etaSec?: number;
};

export type PluginInitMessage = {
  type: "AI_PLUGIN_INIT";
  payload: {
    apiBaseUrl?: string;
    theme?: PluginTheme;
    initialPrompt?: string;
    initialImageUrl?: string;
    token?: string;
  };
};

export type PluginEventMessage =
  | { type: "AI_PLUGIN_IMAGE_GENERATED"; payload: { images: string[] } }
  | { type: "AI_PLUGIN_MODEL_GENERATED"; payload: { taskId: string; modelUrl: string } }
  | { type: "AI_PLUGIN_COMPANION_AWAKENED"; payload: { profile: CompanionBeastProfile; imageUrl?: string } }
  | { type: "AI_PLUGIN_ERROR"; payload: { message: string; code?: string } };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "camera-controls"?: boolean;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string;
          "environment-image"?: string;
          "camera-target"?: string;
          "camera-orbit"?: string;
          exposure?: string;
          poster?: string;
          alt?: string;
          bounds?: string;
          class?: string;
        },
        HTMLElement
      >;
    }
  }
}
