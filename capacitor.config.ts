import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cookie.vex',
  appName: 'Vex',
  webDir: 'dist',
  version: "1.0.0",
  server: {
    androidScheme: 'https'
  }
};

export default config;
