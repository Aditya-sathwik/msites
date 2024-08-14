const CACHE_NAME = 'login-DMRC-v1';
const API_URL = 'http://35.200.153.72:3000/metro/v2/templates/getOfflineTemplate';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '../public/pages/home.html',
        '../public/css/style.css',
        '../public/script/main.js',
        '../public/script/loader.js',
        '../public/css/login.css',
        '../public/script/login.js',
        '../public/css/bookqr.css',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes(API_URL) && event.request.method === 'POST') {
    event.respondWith(
      fetchAndCache(event.request)
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

async function fetchAndCache(request) {
  const cache = await caches.open(CACHE_NAME);
  const cacheKey = new Request(request.url, { method: 'GET' });
  
  try {
    const response = await fetch(request.clone());
    const jsonResponse = await response.clone().json();
    
    cache.put(cacheKey, new Response(JSON.stringify(jsonResponse), {
      headers: { 'Content-Type': 'application/json' }
    }));
    
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(cacheKey);
    return cachedResponse || new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.action === 'cacheToken') {
    caches.open(CACHE_NAME).then(cache => {
      const response = new Response(JSON.stringify({ token: event.data.token }), {
        headers: { 'Content-Type': 'application/json' }
      });
      cache.put('/token', response);
    });
  }
});
