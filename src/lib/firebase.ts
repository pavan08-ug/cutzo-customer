import { initializeApp } from "firebase/app";
import { getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import { Capacitor } from "@capacitor/core";

const rawAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cutzo-72b9e.firebaseapp.com";

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD84lwl1ILIkQ6STResXsWOXNqmSAtC1A0").trim(),
  authDomain: rawAuthDomain.replace(/[\s\t\r\n]+/g, "").trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || "cutzo-72b9e").trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cutzo-72b9e.firebasestorage.app").trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "453077300494").trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || "1:453077300494:android:bca31db2dfea0514d7535f").trim(),
};

const app = initializeApp(firebaseConfig);

// On native platforms, we use the native Firebase plugin primarily.
// For the Web SDK parts (like Convex integration), we use indexedDB persistence 
// to avoid the iframe manager (which causes SyntaxErrors in some WebView environments).
export const auth = Capacitor.isNativePlatform() 
  ? initializeAuth(app, { persistence: indexedDBLocalPersistence })
  : getAuth(app);
