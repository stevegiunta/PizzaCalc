self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pizza-calc-v2').then((cache) => { // Changed to v2
      return cache.addAll(['pizza_calc.html', 'manifest.json']);
    })
  );
  self.skipWaiting(); // Force new version
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== 'pizza-calc-v2')
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Take control immediately
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
