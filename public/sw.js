const VERSION = "cutzo-v" + "__BUILD_DATE__";
const APP_SHELL = ["/", "/manifest.webmanifest", "/favicon.ico", "/apple-touch-icon.png", "/icons/icon-192.webp", "/icons/icon-512.webp"];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const { request } = event;
  const isNavigation = request.mode === "navigate";

  if (isNavigation) {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const clonedResponse = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, clonedResponse));
          return response;
        })
        .catch(() => caches.match("/"));
    })
  );
});
