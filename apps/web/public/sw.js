/* Evolve PWA service worker.
 *
 * Production behavior:
 *  - Precache the app shell (index + manifest + icons) on install.
 *  - Navigation requests: network-first, fall back to cached index.html.
 *  - Static same-origin assets: stale-while-revalidate.
 *  - Never cache /api/* or /ws.
 *
 * Development safety: if this SW is ever served from a local/dev origin
 * (localhost or a private IP), it immediately unregisters itself and clears
 * every cache — so it never serves stale modules while iterating.
 */
const CACHE_NAME = "evolve-v3";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.jpg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-192.png",
  "/icon-maskable-512.png",
];

function isDevOrigin() {
  const host = self.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /\.local$/.test(host)
  );
}

self.addEventListener("install", (event) => {
  if (isDevOrigin()) {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.registration.unregister())
        .then(() => self.skipWaiting()),
    );
    return;
  }
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  if (isDevOrigin()) {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim()),
    );
    return;
  }
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (isDevOrigin()) return; // dev — never intercept

  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API + websocket — always network.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/ws")) return;

  // Navigation (page loads) — network-first with app-shell fallback.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/index.html")));
    return;
  }

  // Static assets — stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
