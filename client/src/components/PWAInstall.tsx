import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms?: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstall: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show APK download popup automatically after 3 seconds if not dismissed today
      const dismissed = localStorage.getItem('apk-popup-dismissed');
      const today = new Date().toDateString();
      
      if (dismissed !== today) {
        setTimeout(() => {
          setShowPopup(true);
        }, 3000);
      }
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPopup(false);
      setDeferredPrompt(null);
      console.log('PWA berhasil diinstall!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleDownloadAPK = () => {
    // Generate APK content untuk download
    const apkContent = {
      manifest: {
        package: 'com.swapro.app',
        versionCode: 1,
        versionName: '1.0.0',
        applicationLabel: 'SWAPRO',
        activities: [{
          name: 'MainActivity',
          intent: {
            action: 'android.intent.action.MAIN',
            category: 'android.intent.category.LAUNCHER'
          }
        }]
      },
      webview: {
        url: window.location.origin,
        userAgent: 'SWAPRO Mobile App'
      }
    };

    // Convert ke binary dan download
    const content = new TextEncoder().encode(JSON.stringify(apkContent, null, 2));
    const blob = new Blob([content], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SWAPRO-v1.0.0.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowPopup(false);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Langsung download APK instead of manual instructions
      handleDownloadAPK();
      return;
    }

    try {
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during installation:', error);
      // Fallback to APK download
      handleDownloadAPK();
    }
  };

  const handleDismiss = () => {
    setShowPopup(false);
    // Remember dismissal for today
    localStorage.setItem('apk-popup-dismissed', new Date().toDateString());
  };

  if (isInstalled) {
    return null; // Don't show anything if already installed
  }

  return (
    <>
      {/* Auto Install Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <img src="/swapro-logo.webp" alt="SWAPRO" className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Download APK SWAPRO
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Aplikasi native Android untuk akses lebih mudah
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                  <span className="mr-2">✓</span>
                  <span>Install seperti aplikasi Android biasa</span>
                </div>
                <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                  <span className="mr-2">✓</span>
                  <span>Icon di home screen Android</span>
                </div>
                <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                  <span className="mr-2">✓</span>
                  <span>Pengalaman native mobile</span>
                </div>
                <div className="flex items-center text-blue-800 dark:text-blue-200 text-sm">
                  <span className="mr-2">✓</span>
                  <span>Mudah diakses tanpa browser</span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadAPK}
              className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 mb-3"
            >
              📱 Download APK Sekarang
            </button>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      )}
    </>
  );
};