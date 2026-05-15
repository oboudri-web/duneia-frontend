import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.duneia.app',
  appName: 'DuneIA',
  webDir: 'out',
  server: {
    url: 'https://duneia.fr',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
