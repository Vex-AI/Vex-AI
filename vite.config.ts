import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      util: path.resolve(__dirname, "src/classes/utils"),
    },
  },
  optimizeDeps: {
    exclude: ["webworker-threads"],
  },
});
