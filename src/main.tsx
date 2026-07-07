import { createRoot } from "react-dom/client";
import { ConvexReactClient, ConvexProviderWithAuth } from "convex/react";
import App from "./App.tsx";
import "./index.css";

import { LoadingProvider } from "./components/cutzo/LoadingContext";
import useFirebaseAuth from "./lib/useFirebaseAuth";

// Permanent fallback ensures ConvexReactClient never crashes on startup
// even if .env.local is missing or npx convex dev hasn't been run yet.
const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://cutzo-fallback.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById("root")!).render(
  <ConvexProviderWithAuth client={convex} useAuth={useFirebaseAuth}>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </ConvexProviderWithAuth>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Ignore registration failures in local development environments.
    });
  });
}
