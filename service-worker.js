self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pizza-calc-v3').then((cache) => { // Bump to v3
      return cache.addAll(['manifest.json']); // Only cache manifest
    })
  );
  self.skipWaiting(); // Force new version
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== 'pizza-calc-v3')
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Take control immediately
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Always fetch pizza_calc.html fresh from network
  if (url.pathname.endsWith('pizza_calc.html')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request);
      })
    );
  } else {
    // Cache-first for other assets (e.g., manifest.json)
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          return caches.open('pizza-calc-v3').then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});
