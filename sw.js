importScripts('https://unpkg.com/network-idle-callback@1.0.0/lib/request-monitor.js')

self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Installed');
  event.waitUntil(self.skipWaiting())
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activated');
  return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  self.requestMonitor.listen(e)

  const promise = fetch(e.request)
    .then((response) => {
      self.requestMonitor.unlisten(e)
      return response
    })
    .catch((e) => {
      self.requestMonitor.unlisten(e)
    })

  e.respondWith(promise)
});