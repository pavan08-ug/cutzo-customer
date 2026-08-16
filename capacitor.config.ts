import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cutzo.app',
  appName: 'Cutzo',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
      googleClientId: "453077300494-2phuskoidvbi1fai650lu5b1vmo401pt.apps.googleusercontent.com"
    },
    StatusBar: {
      style: "LIGHT",           // white icons on dark header
      backgroundColor: "#00000000", // fully transparent
      overlaysWebView: true,    // web content goes under status bar (edge-to-edge)
    },
    SplashScreen: {
      launchShowDuration: 1500, // keep native splash until React is ready
      backgroundColor: "#5B21B6", // matches React splash screen
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;

