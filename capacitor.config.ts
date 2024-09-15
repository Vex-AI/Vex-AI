import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.new",
  appName: "Vex",
  webDir: "dist",
  android: {
    buildOptions: {
      signingType: "apksigner",
    },
  },
};

export default config;
