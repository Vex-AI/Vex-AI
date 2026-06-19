import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: "com.cookieukw.vex",
  appName: "Vex",
  webDir: "dist",
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#0b0d14",
    },
    EdgeToEdge: {
      backgroundColor: "#0b0d14",
    },
    Keyboard: {
      resize: KeyboardResize.None,
      resizeOnFullScreen: true,
    },
  },
  android: {
    buildOptions: {
      signingType: "apksigner",
    },
  },
};

export default config;
