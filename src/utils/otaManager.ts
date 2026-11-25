// Over-The-Air (OTA) Instant Synchronization Manager for Go Delivery APK & PWA

export interface OtaStatus {
  isChecking: boolean;
  hasUpdate: boolean;
  lastChecked: Date | null;
  registration: ServiceWorkerRegistration | null;
  version: string;
}

export const APP_VERSION = 'v2.7.0-ota';

let currentRegistration: ServiceWorkerRegistration | null = null;
const listeners = new Set<(status: OtaStatus) => void>();

let otaState: OtaStatus = {
  isChecking: false,
  hasUpdate: false,
  lastChecked: null,
  registration: null,
  version: APP_VERSION
};

function notify() {
  listeners.forEach((listener) => listener({ ...otaState }));
}

export function subscribeOtaStatus(callback: (status: OtaStatus) => void) {
  listeners.add(callback);
  callback({ ...otaState });
  return () => {
    listeners.delete(callback);
  };
}

export function initOtaServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Reload when a new service worker takes control (seamless Over-The-Air reload)
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      console.log('[OTA Sync] Nueva versión activada. Recargando APK...');
      window.location.reload();
    }
  });

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      currentRegistration = reg;
      otaState.registration = reg;
      otaState.lastChecked = new Date();
      notify();

      // Listen for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version installed in background
            otaState.hasUpdate = true;
            notify();
            // Automatically activate the new worker
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });

      // Periodic background check every 45 seconds while app is running
      setInterval(() => {
        checkForOtaUpdates();
      }, 45000);

      // Check on window focus / app resume
      window.addEventListener('focus', () => {
        checkForOtaUpdates();
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkForOtaUpdates();
        }
      });
    } catch (err) {
      console.warn('[OTA Sync] No se pudo inicializar Service Worker en este contexto:', err);
    }
  });
}

export async function checkForOtaUpdates(): Promise<boolean> {
  if (!currentRegistration) {
    if ('serviceWorker' in navigator) {
      try {
        currentRegistration = await navigator.serviceWorker.getRegistration();
        otaState.registration = currentRegistration;
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (!currentRegistration) {
    return false;
  }

  otaState.isChecking = true;
  notify();

  try {
    await currentRegistration.update();
    otaState.lastChecked = new Date();
    otaState.isChecking = false;
    notify();
    return true;
  } catch (err) {
    console.warn('[OTA Sync] Error al verificar actualizaciones:', err);
    otaState.isChecking = false;
    notify();
    return false;
  }
}
