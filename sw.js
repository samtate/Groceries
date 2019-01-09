self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('pomodoro').then(function(cache) {
     return cache.addAll([
        '/index.html',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
        '/styles/main.css',
        '/scripts/main.js'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
 console.log(event.request.url);

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});
