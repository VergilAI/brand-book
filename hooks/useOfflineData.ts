import { useState, useEffect, useCallback } from 'react';

interface UseOfflineDataOptions {
  key: string;
  fetchFn: () => Promise<any>;
  cacheTime?: number; // in milliseconds
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export function useOfflineData<T>({ 
  key, 
  fetchFn, 
  cacheTime = 5 * 60 * 1000 // 5 minutes default
}: UseOfflineDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Load cached data from IndexedDB
  const loadCachedData = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['investor-data'], 'readonly');
      const store = transaction.objectStore('investor-data');
      const request = store.get(key);

      return new Promise<CachedData<T> | null>((resolve) => {
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        request.onerror = () => {
          resolve(null);
        };
      });
    } catch {
      return null;
    }
  }, [key]);

  // Save data to IndexedDB
  const saveCachedData = useCallback(async (newData: T) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['investor-data'], 'readwrite');
      const store = transaction.objectStore('investor-data');
      
      const cachedData: CachedData<T> = {
        data: newData,
        timestamp: Date.now(),
      };
      
      store.put(cachedData, key);
      setLastSync(new Date());
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }, [key]);

  // Fetch data with offline fallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (navigator.onLine) {
        // Try to fetch fresh data
        const freshData = await fetchFn();
        setData(freshData);
        await saveCachedData(freshData);
        setIsOnline(true);
      } else {
        throw new Error('Offline');
      }
    } catch (fetchError) {
      // Fall back to cached data
      const cached = await loadCachedData();
      
      if (cached) {
        const age = Date.now() - cached.timestamp;
        
        // Use cached data if it's recent enough
        if (age < cacheTime || !navigator.onLine) {
          setData(cached.data);
          setLastSync(new Date(cached.timestamp));
          setIsOnline(false);
        } else {
          setError(new Error('Cached data is too old'));
        }
      } else {
        setError(fetchError as Error);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, loadCachedData, saveCachedData, cacheTime]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      fetchData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isOnline,
    lastSync,
    refetch: fetchData,
  };
}

// Open IndexedDB
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('vergil-investors', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('investor-data')) {
        db.createObjectStore('investor-data');
      }
    };
  });
}