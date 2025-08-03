import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, WifiOff, Download } from 'lucide-react';

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           (window.navigator as any).standalone === true;
      setIsPWA(isStandalone);
    };

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    checkPWA();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isPWA && isOnline) return null; // Only show if PWA or offline

  return (
    <div className="fixed top-4 left-4 z-40 bg-white rounded-lg shadow-lg border p-3 flex items-center space-x-2 text-sm">
      {isPWA && (
        <>
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600 font-medium">PWA Mode</span>
        </>
      )}
      
      {!isOnline && (
        <>
          <WifiOff className="w-4 h-4 text-red-600" />
          <span className="text-red-600 font-medium">Offline</span>
        </>
      )}
      
      {isOnline && (
        <>
          <Wifi className="w-4 h-4 text-green-600" />
          <span className="text-green-600 font-medium">Online</span>
        </>
      )}
    </div>
  );
}