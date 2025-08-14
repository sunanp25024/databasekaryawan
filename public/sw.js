const CACHE_NAME = 'swapro-pwa-v6.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app-icon-72.png',
  '/app-icon-96.png',
  '/app-icon-128.png',
  '/app-icon-144.png',
  '/app-icon-152.png',
  '/app-icon-192.png',
  '/app-icon-384.png',
  '/app-icon-512.png',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png'
];

// Install service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing new version v6.0.0');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Service Worker: Cache failed', err);
      })
  );
  // Don't auto skip waiting - let user decide
});

// Activate service worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating v6.0.0');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network First strategy for API calls, Cache First for static assets
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // API requests - Network First
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response
          const responseClone = response.clone();
          
          // Cache the response if it's successful
          if (response.status === 200) {
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
          }
          
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Static assets - Network First for main app files, Cache First for images
  const isMainAppFile = event.request.url.includes('index.html') || 
                       event.request.url.endsWith('/') ||
                       event.request.url.includes('.js') ||
                       event.request.url.includes('.css');
  
  if (isMainAppFile) {
    // Network First for main app files to ensure latest version
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone and cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
  } else {
    // Cache First for images and other static assets
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version if available
          if (response) {
            return response;
          }
          
          // Otherwise, fetch from network
          return fetch(event.request)
            .then(response => {
              // Check if valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              // Add to cache
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            });
        })
    );
  }
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync when connection is restored
      console.log('Background sync triggered')
    );
  }
});

// Push notifications (optional for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Notifikasi baru dari SWAPRO',
    icon: '/app-icon-192.png',
    badge: '/app-icon-96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Buka SWAPRO',
        icon: '/app-icon-96.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/app-icon-96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SWAPRO', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    console.log('Service Worker: Received skipWaiting message');
    self.skipWaiting();
  }
});