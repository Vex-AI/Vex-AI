import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import A from "vite-plugin-pages";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    A({
      dirs: "./app",
      extensions: ["tsx"],
    }),
  ],
  root: "./",
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@google/generative-ai")) return "vendor-ai";
            if (id.includes("framer-motion")) return "vendor-framer";
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) return "vendor-react";
            if (id.includes("@capacitor")) return "vendor-capacitor";
            if (id.includes("lucide-react")) return "vendor-lucide";
            return "vendor";
          }
        },
      },
    },
  },
});
