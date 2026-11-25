import { useState, useEffect, useCallback } from 'react';

export interface BatteryStatus {
  level: number; // 0 to 100
  isCharging: boolean;
  isSupported: boolean;
  isSimulated: boolean;
  simulatedValue: number | 'auto';
  isBelow10Percent: boolean;
  isLocked: boolean; // True si y sólo si el nivel de batería es < 10%
  setSimulatedLevel: (level: number | 'auto') => void;
  resetToRealBattery: () => void;
  triggerEmergencyUnlock: () => void;
}

const STORAGE_KEY = 'gd_simulated_battery_level';
const EVENT_NAME = 'gd_battery_update';

export function useBatteryStatus(): BatteryStatus {
  // Read simulated override from localStorage if any
  const getInitialSimulated = (): number | 'auto' => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null || stored === 'auto') return 'auto';
      const num = Number(stored);
      if (!isNaN(num) && num >= 0 && num <= 100) return num;
    } catch {
      // Fallback
    }
    return 'auto';
  };

  const [simulatedValue, setSimulatedValue] = useState<number | 'auto'>(getInitialSimulated);
  const [realLevel, setRealLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // Monitor real battery API when available
  useEffect(() => {
    let batteryInstance: any = null;
    let isMounted = true;

    const nav = navigator as any;
    if (typeof nav !== 'undefined' && typeof nav.getBattery === 'function') {
      nav.getBattery()
        .then((battery: any) => {
          if (!isMounted) return;
          batteryInstance = battery;
          setIsSupported(true);
          setRealLevel(Math.round(battery.level * 100));
          setIsCharging(Boolean(battery.charging));

          const updateBattery = () => {
            if (!isMounted) return;
            setRealLevel(Math.round(battery.level * 100));
            setIsCharging(Boolean(battery.charging));
          };

          battery.addEventListener('levelchange', updateBattery);
          battery.addEventListener('chargingchange', updateBattery);
        })
        .catch(() => {
          if (isMounted) setIsSupported(false);
        });
    } else {
      setIsSupported(false);
    }

    return () => {
      isMounted = false;
      if (batteryInstance) {
        try {
          batteryInstance.removeEventListener?.('levelchange', () => {});
          batteryInstance.removeEventListener?.('chargingchange', () => {});
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  // Listen to cross-component or multi-tab simulation changes
  useEffect(() => {
    const handleSync = () => {
      setSimulatedValue(getInitialSimulated());
    };

    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const setSimulatedLevel = useCallback((level: number | 'auto') => {
    try {
      if (level === 'auto') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        const clamped = Math.max(0, Math.min(100, Math.round(level)));
        localStorage.setItem(STORAGE_KEY, String(clamped));
      }
      setSimulatedValue(level);
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch (e) {
      console.warn('Could not save battery simulation:', e);
    }
  }, []);

  const resetToRealBattery = useCallback(() => {
    setSimulatedLevel('auto');
  }, [setSimulatedLevel]);

  const triggerEmergencyUnlock = useCallback(() => {
    // Escape hatch: restore to 100% simulated battery to immediately unlock
    setSimulatedLevel(100);
  }, [setSimulatedLevel]);

  // Determine active level: simulation takes precedence if active, else real level
  const activeLevel = simulatedValue !== 'auto' ? Number(simulatedValue) : realLevel;
  
  // "si y sólo si la batería está en menos de 10%"
  const isBelow10Percent = activeLevel < 10;
  const isLocked = isBelow10Percent;

  return {
    level: activeLevel,
    isCharging,
    isSupported,
    isSimulated: simulatedValue !== 'auto',
    simulatedValue,
    isBelow10Percent,
    isLocked,
    setSimulatedLevel,
    resetToRealBattery,
    triggerEmergencyUnlock
  };
}
