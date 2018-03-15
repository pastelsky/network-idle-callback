importScripts('../index-serviceworker.js')

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Installed');
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activated');
});

self.addEventListener('fetch', function (e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  self.requestMonitor.add(e)

  const promise = fetch(e.request)
    .then((response) => {
      console.log('done', e.clientId)
      self.requestMonitor.remove(e)
      return response
    })
    .catch((e) => {
      console.log('error')
      self.requestMonitor.remove(e)
    })

  e.respondWith(promise)
});