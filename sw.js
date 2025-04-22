const CACHE_NAME = 'horario-clases-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',      // Asegúrate de cambiar si usas archivos externos
  '/script.js',       // Incluye tu archivo JS si es externo
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Interceptar peticiones y servir desde cache si está offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() =>
        caches.match('/index.html') // Página fallback si está offline
      );
    })
  );
});
