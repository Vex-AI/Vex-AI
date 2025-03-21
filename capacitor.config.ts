import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.new",
    appName: "Vex",
    webDir: "dist",
    android: {
        buildOptions: {
            signingType: "apksigner",
            extraArgs: [`-PVEX_GEMINI_KEY=${process.env.VITE_GEMINI_API_KEY}`]
        }
    }
};

export default config;
