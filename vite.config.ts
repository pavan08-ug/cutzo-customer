import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));
  const appVersion = packageJson.version || "1.0.0";

  return {
    base: "./",
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    define: {
      "__BUILD_DATE__": JSON.stringify(Date.now().toString()),
      "__APP_VERSION__": JSON.stringify(appVersion),
    },
  plugins: [
    react(),
    {
      name: "sw-version-replace",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/sw.js") {
            const swPath = path.resolve(__dirname, "public/sw.js");
            if (fs.existsSync(swPath)) {
              let content = fs.readFileSync(swPath, "utf-8");
              // Replace the placeholder with a fresh timestamp on every request in dev
              const timestamp = Date.now().toString();
              content = content.replace("__BUILD_DATE__", timestamp);
              
              res.setHeader("Content-Type", "application/javascript");
              res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
              res.end(content);
              return;
            }
          }
          next();
        });
      },
      closeBundle() {
        // Inject a unique build timestamp into the service worker after build
        const swPath = path.resolve(__dirname, "dist/sw.js");
        if (fs.existsSync(swPath)) {
          let content = fs.readFileSync(swPath, "utf-8");
          const timestamp = Date.now().toString();
          content = content.replace("__BUILD_DATE__", timestamp);
          fs.writeFileSync(swPath, content);
          console.log(`[sw-version-replace] Injected build timestamp ${timestamp} into dist/sw.js`);
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Do NOT inline assets as base64 — keeps .woff2 font files as separate
    // cached files rather than bloating every JS chunk with encoded font data
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'convex': ['convex'],
          'firebase': ['firebase/auth'],
          'animations': ['framer-motion', 'embla-carousel-react'],
          'capacitor': ['@capacitor/core', '@capacitor/app'],
        }
      }
    }
  }

};
});
