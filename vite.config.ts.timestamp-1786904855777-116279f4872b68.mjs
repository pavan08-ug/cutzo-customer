// vite.config.ts
import { defineConfig } from "file:///C:/Users/Omen/Downloads/cutzo-customer-main%20(3)/cutzo-customer-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Omen/Downloads/cutzo-customer-main%20(3)/cutzo-customer-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import fs from "fs";
var __vite_injected_original_dirname = "C:\\Users\\Omen\\Downloads\\cutzo-customer-main (3)\\cutzo-customer-main";
var vite_config_default = defineConfig(({ mode }) => {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(__vite_injected_original_dirname, "package.json"), "utf-8"));
  const appVersion = packageJson.version || "1.0.0";
  return {
    base: "./",
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false
      }
    },
    define: {
      "__BUILD_DATE__": JSON.stringify(Date.now().toString()),
      "__APP_VERSION__": JSON.stringify(appVersion)
    },
    plugins: [
      react(),
      {
        name: "sw-version-replace",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/sw.js") {
              const swPath = path.resolve(__vite_injected_original_dirname, "public/sw.js");
              if (fs.existsSync(swPath)) {
                let content = fs.readFileSync(swPath, "utf-8");
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
          const swPath = path.resolve(__vite_injected_original_dirname, "dist/sw.js");
          if (fs.existsSync(swPath)) {
            let content = fs.readFileSync(swPath, "utf-8");
            const timestamp = Date.now().toString();
            content = content.replace("__BUILD_DATE__", timestamp);
            fs.writeFileSync(swPath, content);
            console.log(`[sw-version-replace] Injected build timestamp ${timestamp} into dist/sw.js`);
          }
        }
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      // Do NOT inline assets as base64 — keeps .woff2 font files as separate
      // cached files rather than bloating every JS chunk with encoded font data
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor": ["react", "react-dom", "react-router-dom"],
            "convex": ["convex"],
            "firebase": ["firebase/auth"],
            "animations": ["framer-motion", "embla-carousel-react"],
            "capacitor": ["@capacitor/core", "@capacitor/app"]
          }
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPbWVuXFxcXERvd25sb2Fkc1xcXFxjdXR6by1jdXN0b21lci1tYWluICgzKVxcXFxjdXR6by1jdXN0b21lci1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPbWVuXFxcXERvd25sb2Fkc1xcXFxjdXR6by1jdXN0b21lci1tYWluICgzKVxcXFxjdXR6by1jdXN0b21lci1tYWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9PbWVuL0Rvd25sb2Fkcy9jdXR6by1jdXN0b21lci1tYWluJTIwKDMpL2N1dHpvLWN1c3RvbWVyLW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJwYWNrYWdlLmpzb25cIiksIFwidXRmLThcIikpO1xuICBjb25zdCBhcHBWZXJzaW9uID0gcGFja2FnZUpzb24udmVyc2lvbiB8fCBcIjEuMC4wXCI7XG5cbiAgcmV0dXJuIHtcbiAgICBiYXNlOiBcIi4vXCIsXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiBcIjo6XCIsXG4gICAgICBwb3J0OiA4MDgwLFxuICAgICAgaG1yOiB7XG4gICAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgXCJfX0JVSUxEX0RBVEVfX1wiOiBKU09OLnN0cmluZ2lmeShEYXRlLm5vdygpLnRvU3RyaW5nKCkpLFxuICAgICAgXCJfX0FQUF9WRVJTSU9OX19cIjogSlNPTi5zdHJpbmdpZnkoYXBwVmVyc2lvbiksXG4gICAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAge1xuICAgICAgbmFtZTogXCJzdy12ZXJzaW9uLXJlcGxhY2VcIixcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgICBpZiAocmVxLnVybCA9PT0gXCIvc3cuanNcIikge1xuICAgICAgICAgICAgY29uc3Qgc3dQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJwdWJsaWMvc3cuanNcIik7XG4gICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhzd1BhdGgpKSB7XG4gICAgICAgICAgICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHN3UGF0aCwgXCJ1dGYtOFwiKTtcbiAgICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgcGxhY2Vob2xkZXIgd2l0aCBhIGZyZXNoIHRpbWVzdGFtcCBvbiBldmVyeSByZXF1ZXN0IGluIGRldlxuICAgICAgICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoXCJfX0JVSUxEX0RBVEVfX1wiLCB0aW1lc3RhbXApO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2phdmFzY3JpcHRcIik7XG4gICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDYWNoZS1Db250cm9sXCIsIFwibm8tY2FjaGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGVcIik7XG4gICAgICAgICAgICAgIHJlcy5lbmQoY29udGVudCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBjbG9zZUJ1bmRsZSgpIHtcbiAgICAgICAgLy8gSW5qZWN0IGEgdW5pcXVlIGJ1aWxkIHRpbWVzdGFtcCBpbnRvIHRoZSBzZXJ2aWNlIHdvcmtlciBhZnRlciBidWlsZFxuICAgICAgICBjb25zdCBzd1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImRpc3Qvc3cuanNcIik7XG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKHN3UGF0aCkpIHtcbiAgICAgICAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhzd1BhdGgsIFwidXRmLThcIik7XG4gICAgICAgICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKS50b1N0cmluZygpO1xuICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoXCJfX0JVSUxEX0RBVEVfX1wiLCB0aW1lc3RhbXApO1xuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoc3dQYXRoLCBjb250ZW50KTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgW3N3LXZlcnNpb24tcmVwbGFjZV0gSW5qZWN0ZWQgYnVpbGQgdGltZXN0YW1wICR7dGltZXN0YW1wfSBpbnRvIGRpc3Qvc3cuanNgKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gRG8gTk9UIGlubGluZSBhc3NldHMgYXMgYmFzZTY0IFx1MjAxNCBrZWVwcyAud29mZjIgZm9udCBmaWxlcyBhcyBzZXBhcmF0ZVxuICAgIC8vIGNhY2hlZCBmaWxlcyByYXRoZXIgdGhhbiBibG9hdGluZyBldmVyeSBKUyBjaHVuayB3aXRoIGVuY29kZWQgZm9udCBkYXRhXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICd2ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgJ2NvbnZleCc6IFsnY29udmV4J10sXG4gICAgICAgICAgJ2ZpcmViYXNlJzogWydmaXJlYmFzZS9hdXRoJ10sXG4gICAgICAgICAgJ2FuaW1hdGlvbnMnOiBbJ2ZyYW1lci1tb3Rpb24nLCAnZW1ibGEtY2Fyb3VzZWwtcmVhY3QnXSxcbiAgICAgICAgICAnY2FwYWNpdG9yJzogWydAY2FwYWNpdG9yL2NvcmUnLCAnQGNhcGFjaXRvci9hcHAnXSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlZLFNBQVMsb0JBQW9CO0FBQ3RhLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxRQUFRO0FBSGYsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxjQUFjLEtBQUssTUFBTSxHQUFHLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGNBQWMsR0FBRyxPQUFPLENBQUM7QUFDaEcsUUFBTSxhQUFhLFlBQVksV0FBVztBQUUxQyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixLQUFLO0FBQUEsUUFDSCxTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLGtCQUFrQixLQUFLLFVBQVUsS0FBSyxJQUFJLEVBQUUsU0FBUyxDQUFDO0FBQUEsTUFDdEQsbUJBQW1CLEtBQUssVUFBVSxVQUFVO0FBQUEsSUFDOUM7QUFBQSxJQUNGLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixnQkFBZ0IsUUFBUTtBQUN0QixpQkFBTyxZQUFZLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztBQUN6QyxnQkFBSSxJQUFJLFFBQVEsVUFBVTtBQUN4QixvQkFBTSxTQUFTLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQ3JELGtCQUFJLEdBQUcsV0FBVyxNQUFNLEdBQUc7QUFDekIsb0JBQUksVUFBVSxHQUFHLGFBQWEsUUFBUSxPQUFPO0FBRTdDLHNCQUFNLFlBQVksS0FBSyxJQUFJLEVBQUUsU0FBUztBQUN0QywwQkFBVSxRQUFRLFFBQVEsa0JBQWtCLFNBQVM7QUFFckQsb0JBQUksVUFBVSxnQkFBZ0Isd0JBQXdCO0FBQ3RELG9CQUFJLFVBQVUsaUJBQWlCLHFDQUFxQztBQUNwRSxvQkFBSSxJQUFJLE9BQU87QUFDZjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQ0EsaUJBQUs7QUFBQSxVQUNQLENBQUM7QUFBQSxRQUNIO0FBQUEsUUFDQSxjQUFjO0FBRVosZ0JBQU0sU0FBUyxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUNuRCxjQUFJLEdBQUcsV0FBVyxNQUFNLEdBQUc7QUFDekIsZ0JBQUksVUFBVSxHQUFHLGFBQWEsUUFBUSxPQUFPO0FBQzdDLGtCQUFNLFlBQVksS0FBSyxJQUFJLEVBQUUsU0FBUztBQUN0QyxzQkFBVSxRQUFRLFFBQVEsa0JBQWtCLFNBQVM7QUFDckQsZUFBRyxjQUFjLFFBQVEsT0FBTztBQUNoQyxvQkFBUSxJQUFJLGlEQUFpRCxTQUFTLGtCQUFrQjtBQUFBLFVBQzFGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUE7QUFBQTtBQUFBLE1BR0wsbUJBQW1CO0FBQUEsTUFDbkIsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sY0FBYztBQUFBLFlBQ1osVUFBVSxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxZQUNuRCxVQUFVLENBQUMsUUFBUTtBQUFBLFlBQ25CLFlBQVksQ0FBQyxlQUFlO0FBQUEsWUFDNUIsY0FBYyxDQUFDLGlCQUFpQixzQkFBc0I7QUFBQSxZQUN0RCxhQUFhLENBQUMsbUJBQW1CLGdCQUFnQjtBQUFBLFVBQ25EO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFFRjtBQUNBLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
