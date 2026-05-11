import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.duneia.app',
  appName: 'DuneIA',
  webDir: 'out',
  server: {
    url: 'https://duneia-frontend.vercel.app',
    cleartext: false
  }
};

export default config;
