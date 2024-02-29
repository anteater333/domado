// install event
self.addEventListener('install', (e) => {
  self.skipWaiting();
  console.log('[Service Worker] installed');
});

// activate event
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
  console.log('[Service Worker] actived', e);
});

// fetch event
self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] fetched resource ' + e.request.url);
});
