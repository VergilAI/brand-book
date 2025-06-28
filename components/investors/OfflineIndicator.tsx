'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const handleSyncComplete = (event: MessageEvent) => {
      if (event.data.type === 'SYNC_COMPLETE') {
        setLastSync(new Date(event.data.timestamp));
        setIsSyncing(false);
      }
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    navigator.serviceWorker?.addEventListener('message', handleSyncComplete);

    // Check for service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration: any) => {
        if (registration.sync) {
          // Register for periodic sync
          registration.sync.register('sync-investor-data');
        }
      });
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      navigator.serviceWorker?.removeEventListener('message', handleSyncComplete);
    };
  }, []);

  const triggerSync = async () => {
    if (!navigator.onLine) return;

    setIsSyncing(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      if ((registration as any).sync) {
        await (registration as any).sync.register('sync-investor-data');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setIsSyncing(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            'fixed top-20 right-4 z-50 bg-dark-800 border border-cosmic-purple/20 rounded-lg p-4 shadow-lg',
            className
          )}
        >
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm font-medium">You're offline</p>
              <p className="text-xs text-gray-400">
                Showing cached data
                {lastSync && ` from ${lastSync.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {isOnline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'fixed bottom-4 right-4 z-40 flex items-center gap-2',
            className
          )}
        >
          <button
            onClick={triggerSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-dark-800/80 backdrop-blur border border-cosmic-purple/20 rounded-full px-3 py-1.5 text-xs hover:bg-dark-700/80 transition-colors"
          >
            {isSyncing ? (
              <RefreshCw className="w-3 h-3 animate-spin text-consciousness-cyan" />
            ) : (
              <Wifi className="w-3 h-3 text-green-500" />
            )}
            <span className="text-gray-400">
              {isSyncing ? 'Syncing...' : 'Online'}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}