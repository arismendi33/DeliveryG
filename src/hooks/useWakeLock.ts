import { useState, useEffect, useCallback } from 'react';

// Screen Wake Lock API Hook
export function useWakeLock(initialEnabled = true) {
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<any>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return false;
    try {
      const sentinel = await (navigator as any).wakeLock.request('screen');
      setWakeLockSentinel(sentinel);
      setIsLocked(true);

      sentinel.addEventListener('release', () => {
        setIsLocked(false);
        setWakeLockSentinel(null);
      });
      return true;
    } catch {
      setIsLocked(false);
      return false;
    }
  }, []);

  const releaseLock = useCallback(() => {
    if (wakeLockSentinel) {
      wakeLockSentinel.release().catch(() => {});
      setWakeLockSentinel(null);
      setIsLocked(false);
    }
  }, [wakeLockSentinel]);

  const toggleLock = useCallback(() => {
    if (isLocked) {
      releaseLock();
    } else {
      requestLock();
    }
  }, [isLocked, releaseLock, requestLock]);

  // Request when enabled
  useEffect(() => {
    if (initialEnabled && isSupported) {
      requestLock();
    }

    // Re-acquire on visibility change if page comes back to foreground
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && initialEnabled) {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseLock();
    };
  }, [initialEnabled, isSupported, requestLock, releaseLock]);

  return { isLocked, isSupported, toggleLock, requestLock, releaseLock };
}
