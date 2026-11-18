const CACHE_NAME = "frontend-offline-document-v1";
const DOCUMENT = new URL("./index.html", self.location.href).href;
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.add(DOCUMENT)));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith("frontend-offline-document-") && key !== CACHE_NAME)
      .map(key => caches.delete(key))
  )));
});
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.href !== DOCUMENT) return;
  event.respondWith(fetch(event.request).catch(async () => {
    const cached = await caches.match(DOCUMENT);
    return cached ?? Response.error();
  }));
});
