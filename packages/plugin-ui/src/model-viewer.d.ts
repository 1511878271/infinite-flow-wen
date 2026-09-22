import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "camera-controls"?: boolean;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "interaction-prompt"?: string;
          "shadow-intensity"?: string;
          "environment-image"?: string;
          exposure?: string;
          "auto-rotate"?: boolean;
          ar?: boolean;
          "ar-modes"?: string;
          alt?: string;
          class?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
