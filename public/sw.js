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

let timerId = 0;
self.addEventListener('message', (e) => {
  switch (e.data.command) {
    case 'start':
      // 백그라운드에서 돌아가는 타이머 생성
      timerId = setTimeout(() => {
        self.registration.showNotification('도마도 타이머 종료', {
          body: '타이머가 종료되었습니다.',
        });
      }, e.data.time * 1000);
      break;
    case 'stop':
      clearTimeout(timerId);
      break;
  }
});
