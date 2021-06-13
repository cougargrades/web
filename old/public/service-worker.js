
// Self-destroying ServiceWorker
// https://github.com/NekR/self-destroying-sw

/*
 * This gets manually renamed to `service-worker.js` and put into the build/ 
 * directory (not included in git) before a deployment so that future 
 * service-worker.js updates will pull from it.
 */

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      return self.clients.matchAll();
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    });
});
