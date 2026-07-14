import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mindbridge.app',
  appName: 'MindBridge',
  webDir: 'out',
  server: {
    // Pointing to your live Vercel deployment!
    url: 'https://mind-bridge-liart.vercel.app',
    cleartext: false
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    }
  }
};

export default config;
