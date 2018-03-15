importScripts('https://unpkg.com/network-idle-callback@0.0.3/index-serviceworker.js')

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Installed');
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activated');
  self.addEventListener('activate', function (e) {
    event.waitUntil(self.skipWaiting())
  });
});

self.requestMonitor.minIdleTimeout = 100

self.addEventListener('fetch', function (e) {
  //console.log('[ServiceWorker] Fetch', e.request.url);
  self.requestMonitor.add(e)
  console.log(self.requestMonitor.requestSet)
  if(!e.clientId) {
    console.log('was page request')
  }

  const promise = fetch(e.request)
    .then((response) => {
      //console.log('done', e.clientId)
      self.requestMonitor.remove(e)
      return response
    })
    .catch((e) => {
      console.log('error')
      self.requestMonitor.remove(e)
    })

  e.respondWith(promise)
});