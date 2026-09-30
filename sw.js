// Garde l'application sur le téléphone pour qu'elle marche sans internet
// (ou sur un Wi-Fi qui bloque le site).
const CACHE = "mescodes-v9";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Ouverture de l'application : la version en ligne si internet marche
  // (pour recevoir les mises à jour), sinon la copie gardée sur le téléphone.
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (r.ok) { const copie = r.clone(); caches.open(CACHE).then(c => c.put("./index.html", copie)); }
          return r;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))
  );
});
