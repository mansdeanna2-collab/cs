import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quwan.social',
  appName: '趣玩社区',
  webDir: 'build',
  server: {
    // Use https scheme for Android (required for modern security)
    androidScheme: 'https',
    // Allow cleartext (HTTP) traffic for API calls
    // This is required when the API server uses HTTP instead of HTTPS
    cleartext: true,
    // Allow navigation to HTTP API servers (for mixed content)
    allowNavigation: ['http://*', 'https://*']
  },
  android: {
    // Allow mixed content (HTTPS page loading HTTP resources)
    // This is required for API calls to HTTP servers from an HTTPS WebView
    allowMixedContent: true
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
