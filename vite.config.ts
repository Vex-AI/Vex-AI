import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import A from "vite-plugin-pages";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), A({
      dirs: "./app",
      extensions: ["tsx"],
    }),], root: './'
});
