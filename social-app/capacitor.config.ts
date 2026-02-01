import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quwan.social',
  appName: '趣玩社区',
  webDir: 'build',
  server: {
    // Use https scheme for Android (required for modern security)
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#6C63FF',
      showSpinner: false
    }
  }
};

export default config;
