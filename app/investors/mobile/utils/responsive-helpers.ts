import { useEffect, useState, useRef, RefObject } from 'react';

// Breakpoint constants matching Tailwind v4
export const BREAKPOINTS = {
  'mobile-sm': 320,
  'mobile-md': 375,
  'mobile-lg': 425,
  'tablet': 768,
  'desktop': 1024,
  'desktop-lg': 1440,
} as const;

// Device detection utilities
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// Custom hooks for responsive behavior
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export const useBreakpoint = () => {
  const isMobileSm = useMediaQuery(`(min-width: ${BREAKPOINTS['mobile-sm']}px)`);
  const isMobileMd = useMediaQuery(`(min-width: ${BREAKPOINTS['mobile-md']}px)`);
  const isMobileLg = useMediaQuery(`(min-width: ${BREAKPOINTS['mobile-lg']}px)`);
  const isTablet = useMediaQuery(`(min-width: ${BREAKPOINTS['tablet']}px)`);
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS['desktop']}px)`);
  const isDesktopLg = useMediaQuery(`(min-width: ${BREAKPOINTS['desktop-lg']}px)`);

  return {
    isMobile: !isTablet,
    isMobileSm,
    isMobileMd,
    isMobileLg,
    isTablet: isTablet && !isDesktop,
    isDesktop: isDesktop && !isDesktopLg,
    isDesktopLg,
    currentBreakpoint: isDesktopLg ? 'desktop-lg' :
                      isDesktop ? 'desktop' :
                      isTablet ? 'tablet' :
                      isMobileLg ? 'mobile-lg' :
                      isMobileMd ? 'mobile-md' : 'mobile-sm'
  };
};

// Viewport dimensions hook
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    aspectRatio: 1,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        aspectRatio: window.innerWidth / window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

// Touch gesture hooks
interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const useSwipe = (handlers: SwipeHandlers) => {
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });
  const threshold = handlers.threshold || 50;

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = () => {
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY && absX > threshold) {
      if (deltaX > 0 && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      } else if (deltaX < 0 && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      }
    } else if (absY > absX && absY > threshold) {
      if (deltaY > 0 && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      } else if (deltaY < 0 && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      }
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

// Responsive container dimensions
export const useContainerDimensions = (ref: RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, [ref]);

  return dimensions;
};

// Orientation detection
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return orientation;
};

// Safe area insets for notched devices
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const computeSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
      });
    };

    computeSafeArea();
    window.addEventListener('resize', computeSafeArea);
    return () => window.removeEventListener('resize', computeSafeArea);
  }, []);

  return safeArea;
};

// Viewport height fix for mobile browsers
export const useViewportHeight = () => {
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);
};

// Touch-friendly click handler with proper touch support
export const useTouchableClick = (
  onClick: () => void,
  options?: { preventDoubleTap?: boolean }
) => {
  const lastTap = useRef(0);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (options?.preventDoubleTap) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        e.preventDefault();
        return;
      }
      lastTap.current = now;
    }
    onClick();
  };

  return {
    onClick: handleClick,
    onTouchEnd: handleClick,
  };
};

// Responsive chart dimensions calculator
export const calculateChartDimensions = (
  containerWidth: number,
  isMobile: boolean
) => {
  const margin = isMobile 
    ? { top: 20, right: 20, bottom: 30, left: 40 }
    : { top: 20, right: 30, bottom: 40, left: 60 };

  const width = containerWidth - margin.left - margin.right;
  const height = isMobile 
    ? containerWidth * 0.6 - margin.top - margin.bottom
    : containerWidth * 0.4 - margin.top - margin.bottom;

  return { width, height, margin };
};

// Debounced resize handler
export const useDebounceResize = (callback: () => void, delay: number = 300) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [callback, delay]);
};

// Mobile-friendly number formatter
export const formatNumberMobile = (value: number, isMobile: boolean): string => {
  if (isMobile && value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (isMobile && value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

// Touch event prevention for better scrolling
export const preventTouchMove = (element: HTMLElement) => {
  const preventDefault = (e: TouchEvent) => e.preventDefault();
  element.addEventListener('touchmove', preventDefault, { passive: false });
  return () => element.removeEventListener('touchmove', preventDefault);
};