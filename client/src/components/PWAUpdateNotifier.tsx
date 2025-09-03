import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface PWAUpdateNotifierProps {}

export function PWAUpdateNotifier({}: PWAUpdateNotifierProps) {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [newServiceWorker, setNewServiceWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      // Listen for controller change - when new SW takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('PWA: New service worker activated, reloading page');
        window.location.reload();
      });

      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('PWA: Service Worker registered successfully v6.1.0');
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log('PWA: New service worker found');
              setNewServiceWorker(newWorker);
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('PWA: New content available, showing update prompt');
                  setShowUpdatePrompt(true);
                }
              });
            }
          });

          // Check for existing waiting service worker
          if (registration.waiting) {
            console.log('PWA: Service worker waiting');
            setNewServiceWorker(registration.waiting);
            setShowUpdatePrompt(true);
          }
        })
        .catch(error => {
          console.log('PWA: Service Worker registration failed:', error);
        });
    }
  }, []);

  const handleUpdate = () => {
    if (newServiceWorker) {
      console.log('PWA: Activating new service worker');
      newServiceWorker.postMessage({ action: 'skipWaiting' });
      setShowUpdatePrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Update Tersedia
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Versi baru SWAPRO sudah tersedia. Refresh untuk mendapatkan fitur terbaru.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Update Sekarang
              </button>
              <button
                onClick={handleDismiss}
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-all duration-200"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}