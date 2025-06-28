// Service Worker for Investors Portal
const CACHE_NAME = 'vergil-investors-v1';
const DYNAMIC_CACHE = 'vergil-investors-dynamic-v1';
const OFFLINE_URL = '/investors/offline';

// Assets to cache on install
const STATIC_ASSETS = [
  '/investors',
  '/investors/offline',
  '/investors/manifest.json',
  '/investors/logo-192.png',
  '/investors/logo-512.png',
  '/lib/utils.js',
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/investors/metrics',
  '/api/investors/reports',
  '/api/investors/activity',
  '/api/investors/market-data',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('vergil-investors-') && 
                   cacheName !== CACHE_NAME &&
                   cacheName !== DYNAMIC_CACHE;
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip non-investor routes
  if (!url.pathname.startsWith('/investors') && !url.pathname.startsWith('/api/investors')) {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/investors')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response
          const responseToCache = response.clone();
          
          // Cache successful responses
          if (response.status === 200) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          
          return response;
        })
        .catch(() => {
          // Return cached API response if offline
          return caches.match(request);
        })
    );
    return;
  }

  // Handle page requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Try cache first
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          
          // Return a basic offline response for other requests
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
      })
  );
});

// Background sync for data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-investor-data') {
    event.waitUntil(syncInvestorData());
  }
});

async function syncInvestorData() {
  try {
    // Fetch fresh data from all endpoints
    const promises = API_ENDPOINTS.map(endpoint => 
      fetch(endpoint).then(response => {
        if (response.ok) {
          const cache = caches.open(DYNAMIC_CACHE);
          return cache.then(c => c.put(endpoint, response));
        }
      })
    );
    
    await Promise.all(promises);
    
    // Notify clients of successful sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now(),
      });
    });
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Periodic background sync (every 5 minutes when online)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-investor-data') {
    event.waitUntil(syncInvestorData());
  }
});