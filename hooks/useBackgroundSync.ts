import { useEffect, useState, useCallback } from 'react';

interface UseBackgroundSyncOptions {
  tag: string;
  onSync?: () => void;
  interval?: number; // in milliseconds
}

export function useBackgroundSync({ 
  tag, 
  onSync,
  interval = 5 * 60 * 1000 // 5 minutes default
}: UseBackgroundSyncOptions) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<Error | null>(null);

  // Check if background sync is supported
  useEffect(() => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      setIsSupported(true);
    }
  }, []);

  // Register background sync
  const registerSync = useCallback(async () => {
    if (!isSupported) return;

    try {
      setIsSyncing(true);
      setSyncError(null);

      const registration = await navigator.serviceWorker.ready;
      
      if ('sync' in registration) {
        await registration.sync.register(tag);
        
        // Call onSync callback if provided
        if (onSync) {
          onSync();
        }
        
        setLastSync(new Date());
      }
    } catch (error) {
      setSyncError(error as Error);
      console.error('Background sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSupported, tag, onSync]);

  // Register periodic sync
  const registerPeriodicSync = useCallback(async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      if ('periodicSync' in registration) {
        const status = await navigator.permissions.query({
          // @ts-ignore - periodicSync is not in the TypeScript types yet
          name: 'periodic-background-sync',
        });

        if (status.state === 'granted') {
          // @ts-ignore
          await registration.periodicSync.register(tag, {
            minInterval: interval,
          });
        }
      }
    } catch (error) {
      console.error('Periodic sync registration failed:', error);
    }
  }, [isSupported, tag, interval]);

  // Set up sync on mount
  useEffect(() => {
    if (isSupported) {
      registerPeriodicSync();
    }
  }, [isSupported, registerPeriodicSync]);

  // Listen for sync complete messages
  useEffect(() => {
    if (!isSupported) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SYNC_COMPLETE') {
        setLastSync(new Date(event.data.timestamp));
        setIsSyncing(false);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [isSupported]);

  return {
    isSupported,
    isSyncing,
    lastSync,
    syncError,
    triggerSync: registerSync,
  };
}