self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('static-cache').then((cache) => {
        return cache.addAll([
          '/',
          '%PUBLIC_URL%/dist/icons/apple-touch-icon.png',
          '%PUBLIC_URL%/dist/icons/favicon-32x32.png',
          '%PUBLIC_URL%/dist/icons/favicon-16x16.png',
          // Add other assets you want to cache
        ]);
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