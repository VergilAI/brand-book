// Service Worker for Vergil Investors Portal
// Provides offline support and performance optimization

const CACHE_NAME = 'vergil-investors-v1';
const API_CACHE_NAME = 'vergil-api-v1';
const IMAGE_CACHE_NAME = 'vergil-images-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/investors',
  '/investors/login',
  '/manifest.json',
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/investors/dashboard',
  '/api/investors/revenues',
  '/api/investors/expenses',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstStrategy(request, API_CACHE_NAME, 5 * 60 * 1000) // 5 min cache
    );
    return;
  }

  // Image requests - Cache first, network fallback
  if (request.destination === 'image') {
    event.respondWith(
      cacheFirstStrategy(request, IMAGE_CACHE_NAME)
    );
    return;
  }

  // Static assets - Cache first, network fallback
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      cacheFirstStrategy(request, CACHE_NAME)
    );
    return;
  }

  // Default - Network first
  event.respondWith(
    networkFirstStrategy(request, CACHE_NAME, 60 * 60 * 1000) // 1 hour cache
  );
});

// Network first strategy with timeout
async function networkFirstStrategy(request, cacheName, maxAge) {
  try {
    const networkResponse = await fetchWithTimeout(request, 5000);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      
      // Clone the response before caching
      const responseToCache = networkResponse.clone();
      
      // Add timestamp to cached response
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-at', new Date().toISOString());
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });
      
      cache.put(request, cachedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      const cachedAt = cachedResponse.headers.get('sw-cached-at');
      const cacheAge = cachedAt ? Date.now() - new Date(cachedAt).getTime() : Infinity;
      
      // Return cached response if within maxAge
      if (cacheAge < maxAge) {
        return cachedResponse;
      }
    }
    
    // Return offline page if available
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html');
      if (offlineResponse) return offlineResponse;
    }
    
    throw error;
  }
}

// Cache first strategy
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return placeholder for images
    if (request.destination === 'image') {
      return new Response(
        '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#1a1a1a"/><text x="50%" y="50%" text-anchor="middle" fill="#666" font-family="system-ui">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Fetch with timeout
function fetchWithTimeout(request, timeout) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-financial-data') {
    event.waitUntil(syncFinancialData());
  }
});

async function syncFinancialData() {
  try {
    // Get any queued data from IndexedDB
    const db = await openDB();
    const tx = db.transaction('sync-queue', 'readonly');
    const store = tx.objectStore('sync-queue');
    const requests = await store.getAll();
    
    for (const request of requests) {
      await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      
      // Remove from queue after successful sync
      const deleteTx = db.transaction('sync-queue', 'readwrite');
      await deleteTx.objectStore('sync-queue').delete(request.id);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Simple IndexedDB wrapper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('vergil-investors', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('sync-queue')) {
        db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}