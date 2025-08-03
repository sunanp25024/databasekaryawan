// PWA Service Worker Registration and Management

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installButton: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Register service worker
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { 
          scope: '/',
          updateViaCache: 'none'
        })
          .then((registration) => {
            console.log('SW registered successfully: ', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.showUpdateAvailable();
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.hideInstallButton();
      this.deferredPrompt = null;
      this.showInstallSuccess();
    });

    // Create install button
    this.createInstallButton();
  }

  private createInstallButton() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      return; // Already installed
    }

    this.installButton = document.createElement('button');
    this.installButton.id = 'pwa-install-btn';
    this.installButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7,10 12,15 17,10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Install App
    `;
    this.installButton.className = `
      fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white 
      px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 
      transition-all duration-200 hover:scale-105 font-medium
      hidden
    `;
    this.installButton.addEventListener('click', () => this.installPWA());
    
    document.body.appendChild(this.installButton);
  }

  private showInstallButton() {
    if (this.installButton) {
      this.installButton.classList.remove('hidden');
      
      // Show with animation
      setTimeout(() => {
        this.installButton!.style.transform = 'translateY(0)';
        this.installButton!.style.opacity = '1';
      }, 100);
    }
  }

  private hideInstallButton() {
    if (this.installButton) {
      this.installButton.classList.add('hidden');
    }
  }

  private async installPWA() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    this.deferredPrompt = null;
    this.hideInstallButton();
  }

  private showUpdateAvailable() {
    const updateBanner = document.createElement('div');
    updateBanner.innerHTML = `
      <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4">
        <span>Update tersedia untuk aplikasi</span>
        <button id="update-btn" class="bg-white text-blue-600 px-3 py-1 rounded font-medium hover:bg-gray-100">
          Update
        </button>
        <button id="dismiss-update" class="text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(updateBanner);
    
    const updateBtn = updateBanner.querySelector('#update-btn');
    const dismissBtn = updateBanner.querySelector('#dismiss-update');
    
    updateBtn?.addEventListener('click', () => {
      window.location.reload();
    });
    
    dismissBtn?.addEventListener('click', () => {
      updateBanner.remove();
    });
  }

  private showInstallSuccess() {
    const successToast = document.createElement('div');
    successToast.innerHTML = `
      <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
        ✅ Aplikasi berhasil diinstall!
      </div>
    `;
    
    document.body.appendChild(successToast);
    
    setTimeout(() => {
      successToast.remove();
    }, 3000);
  }

  // Check if app is running as PWA
  static isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  }

  // Get app info
  static getAppInfo() {
    return {
      isPWA: PWAManager.isPWA(),
      isOnline: navigator.onLine,
      hasServiceWorker: 'serviceWorker' in navigator,
      isInstallable: !!document.getElementById('pwa-install-btn')
    };
  }
}

// Initialize PWA Manager
const pwaManager = new PWAManager();

export { PWAManager };