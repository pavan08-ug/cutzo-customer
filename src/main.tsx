import { createRoot } from "react-dom/client";
import { ConvexReactClient, ConvexProviderWithAuth } from "convex/react";
import App from "./App.tsx";

// ── Self-hosted fonts (bundled into APK — no network required) ─────────────
// Inter weights used across the app
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
// Montserrat weights used for headings
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";

import "./index.css";

import { LoadingProvider } from "./components/cutzo/LoadingContext";
import useFirebaseAuth from "./lib/useFirebaseAuth";
import { AppErrorBoundary } from "./components/cutzo/AppErrorBoundary";

const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://dynamic-owl-73.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <ConvexProviderWithAuth client={convex} useAuth={useFirebaseAuth}>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </ConvexProviderWithAuth>
  </AppErrorBoundary>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Ignore registration failures in local development environments.
    });
  });
}
