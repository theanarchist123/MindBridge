import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mindbridge.app',
  appName: 'MindBridge',
  webDir: 'out',
  server: {
    // Hardcoded for local mobile testing on the same network
    // Change this to the production URL when deploying (e.g., https://mindbridge.app)
    url: 'http://192.168.0.105:3001',
    cleartext: true
  }
};

export default config;
