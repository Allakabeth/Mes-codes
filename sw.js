// Mes codes : l'application fonctionne uniquement avec la copie gardée sur le téléphone.
// Aucune mise à jour automatique : une fois installée, elle ne va plus chercher
// sa page sur internet.
const CACHE = "mescodes-final";
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
  // Ouverture de l'application : toujours la copie du téléphone.
  if (e.request.mode === "navigate") {
    e.respondWith(caches.match("./index.html").then(r => r || fetch(e.request)));
    return;
  }
  // Fichiers de l'application : la copie du téléphone d'abord.
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))
  );
});
