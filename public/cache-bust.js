// Cache busting script - Force PWA to clear all caches
console.log('Cache Buster v6.0.0 - Clearing all caches');

if ('serviceWorker' in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      console.log('Cache Buster: Unregistering service worker');
      registration.unregister();
    });
  });
}

// Clear all caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      console.log('Cache Buster: Deleting cache', cacheName);
      caches.delete(cacheName);
    });
  });
}

// Clear local storage, session storage
localStorage.clear();
sessionStorage.clear();

console.log('Cache Buster: All caches cleared');