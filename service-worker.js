self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pizza-calc-v1').then((cache) => {
      return cache.addAll(['pizza_calc.html', 'manifest.json']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});