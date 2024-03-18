import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cookie.vera',
  appName: 'Vex',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android:{
     buildOptions:{
         signingType: "apksigner"
     }
  }
};

export default config;
