import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.new",
    appName: "Vex",
    webDir: "dist",
    android: {
        buildOptions: {
            signingType: "apksigner"
        }
    },
    plugins: {
        Environment: {
            VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY
        }
    }
};

export default config;
