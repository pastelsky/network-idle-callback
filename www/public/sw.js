importScripts('https://unpkg.com/network-idle-callback@0.0.7/lib/request-monitor.js')

self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Installed');
  event.waitUntil(self.skipWaiting())
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activated');
  return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  //console.log('[ServiceWorker] Fetch', e.request.url);
  self.requestMonitor.listen(e)
  if (!e.clientId) {
    console.log('was page request')
  }

  const promise = fetch(e.request)
    .then((response) => {
      //console.log('done', e.clientId)
      self.requestMonitor.unlisten(e)
      return response
    })
    .catch((e) => {
      console.log('error')
      self.requestMonitor.unlisten(e)
    })

  e.respondWith(promise)
});