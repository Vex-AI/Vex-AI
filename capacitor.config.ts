import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cookieukw.vex',
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
