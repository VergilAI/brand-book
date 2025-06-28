// Bundle optimization utilities for mobile performance

// List of heavy dependencies to be dynamically imported
export const HEAVY_DEPENDENCIES = {
  'd3': () => import('d3'),
  'framer-motion': () => import('framer-motion'),
} as const;

// Utility to check if code is running on mobile
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for mobile user agents
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(userAgent);
  
  // Check for touch support
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check viewport width
  const isSmallViewport = window.innerWidth < 768;
  
  return isMobileUA || (hasTouch && isSmallViewport);
}

// Optimize animations for mobile
export function getOptimizedAnimationConfig() {
  const isMobile = isMobileDevice();
  
  return {
    // Reduce animation duration on mobile
    duration: isMobile ? 0.2 : 0.3,
    
    // Simplify easing on mobile
    ease: isMobile ? 'easeOut' : [0.4, 0, 0.2, 1],
    
    // Disable complex animations on mobile
    enableComplexAnimations: !isMobile,
    
    // Reduce motion blur on mobile
    motionBlur: isMobile ? 0 : 0.2,
    
    // Limit simultaneous animations
    maxConcurrentAnimations: isMobile ? 3 : 10,
  };
}

// Debounce utility optimized for mobile
export function optimizedDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean; maxWait?: number }
): T {
  let timeout: NodeJS.Timeout | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;
  const maxWait = options?.maxWait;
  const leading = options?.leading ?? false;
  const trailing = options?.trailing ?? true;

  function invokeFunc(time: number) {
    const args = lastCallTime ? arguments : [];
    lastInvokeTime = time;
    timeout = null;
    return func.apply(null, args);
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : undefined;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeout = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timeout = null;
    if (trailing && lastCallTime) {
      return invokeFunc(time);
    }
    lastCallTime = null;
    return undefined;
  }

  function cancel() {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    lastInvokeTime = 0;
    lastCallTime = null;
    timeout = null;
  }

  function flush() {
    return timeout === null ? undefined : trailingEdge(Date.now());
  }

  function debounced(...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastCallTime = time;

    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(time);
      }
      if (maxWait !== undefined) {
        timeout = setTimeout(timerExpired, wait);
        return invokeFunc(time);
      }
    }
    if (timeout === null) {
      timeout = setTimeout(timerExpired, wait);
    }
    return undefined;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced as T;
}

// Optimize images for mobile
export function getOptimizedImageSizes() {
  const isMobile = isMobileDevice();
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  return {
    thumbnail: isMobile ? 150 : 300,
    small: isMobile ? 300 : 600,
    medium: isMobile ? 600 : 1200,
    large: isMobile ? 900 : 1800,
    quality: isMobile ? 70 : 85,
    format: devicePixelRatio > 1.5 ? 'webp' : 'jpeg',
  };
}

// Service Worker registration for offline support
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Prefetch critical resources
export function prefetchCriticalResources() {
  if ('link' in document.createElement('link')) {
    const criticalResources = [
      '/api/investors/dashboard',
      '/api/investors/revenues',
      '/api/investors/expenses',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
}

// Network information API for adaptive loading
export function getNetworkQuality(): 'slow' | 'medium' | 'fast' {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    const effectiveType = connection.effectiveType;
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'slow';
    } else if (effectiveType === '3g') {
      return 'medium';
    }
  }
  
  return 'fast';
}

// Adaptive component loading based on network
export function shouldLoadHeavyComponents(): boolean {
  const networkQuality = getNetworkQuality();
  const isMobile = isMobileDevice();
  
  // Don't load heavy components on slow networks or mobile devices
  return networkQuality !== 'slow' && !isMobile;
}