/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../plugin-ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "rgb(var(--app-bg) / <alpha-value>)",
          surface: "rgb(var(--app-surface) / <alpha-value>)",
          elevated: "rgb(var(--app-elevated) / <alpha-value>)",
          border: "rgb(var(--app-border) / <alpha-value>)",
          fg: "rgb(var(--app-fg) / <alpha-value>)",
          muted: "rgb(var(--app-muted) / <alpha-value>)",
        },
        accent: "#007AFF",
      },
    },
  },
  plugins: [],
}
