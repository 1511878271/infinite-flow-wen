import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  build: {
    outDir: "dist/embed",
    emptyOutDir: false,
    lib: {
      entry: {
        "ai-plugin-react": path.resolve(__dirname, "src/embed/react.tsx"),
        "ai-plugin-wc": path.resolve(__dirname, "src/embed/web-component.tsx"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [],
    },
  },
});

