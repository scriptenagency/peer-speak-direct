import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4ee9b69c4ccc4c3c86d65ceee82a1aa7',
  appName: 'peer-speak-direct',
  webDir: 'dist',
  server: {
    url: 'https://4ee9b69c-4ccc-4c3c-86d6-5ceee82a1aa7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;