// src/hooks/useStorageQuota.ts
import { useState, useEffect } from 'react';

interface StorageQuota {
  usage: number;
  quota: number;
  percentage: number;
}

/**
 * Hook to estimate local storage usage (in browsers that support it).
 * Returns current usage, quota, and percentage used.
 */
export function useStorageQuota() {
  const [storageInfo, setStorageInfo] = useState<StorageQuota | null>(null);

  useEffect(() => {
    const checkStorage = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          setStorageInfo({
            usage: estimate.usage || 0,
            quota: estimate.quota || 0,
            percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
          });
        } catch (error) {
          console.warn('Storage quota check failed:', error);
        }
      }
    };

    checkStorage();
    const interval = setInterval(checkStorage, 60000); // Re-check every minute

    return () => clearInterval(interval);
  }, []);

  return storageInfo;
}
