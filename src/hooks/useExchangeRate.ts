import { useState, useEffect, useCallback } from 'react';
import {
  getCachedRateInfo,
  fetchLiveExchangeRate,
  convertUsdToVes,
  formatVesCurrency,
  ExchangeRateInfo
} from '../utils/exchangeRate';
import { soundEngine } from '../utils/soundEffects';

export function useExchangeRate() {
  const [rateInfo, setRateInfo] = useState<ExchangeRateInfo>(getCachedRateInfo);
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshRate = useCallback(async () => {
    setIsUpdating(true);
    try {
      const updated = await fetchLiveExchangeRate();
      setRateInfo(updated);
      soundEngine.vibrate(20);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch in background
    fetchLiveExchangeRate().then(setRateInfo).catch(console.error);

    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      fetchLiveExchangeRate().then(setRateInfo).catch(console.error);
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    rate: rateInfo.rate,
    lastUpdated: rateInfo.lastUpdated,
    source: rateInfo.source,
    isUpdating,
    refreshRate,
    toVes: (usd: number) => convertUsdToVes(usd, rateInfo.rate),
    formatVes: (usd: number) => formatVesCurrency(convertUsdToVes(usd, rateInfo.rate))
  };
}
