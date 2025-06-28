import { useRef, useEffect } from 'react';

interface UseSwipeScrollOptions {
  threshold?: number;
  selector?: string;
}

export function useSwipeScroll(options: UseSwipeScrollOptions = {}) {
  const { threshold = 10, selector = '[data-scrollable]' } = options;
  const containerRef = useRef<HTMLElement | null>(null);
  const isScrollingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollableElement = target.closest(selector);
      
      if (scrollableElement) {
        const touch = e.touches[0];
        startXRef.current = touch.clientX;
        startYRef.current = touch.clientY;
        isScrollingRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollableElement = target.closest(selector) as HTMLElement;
      
      if (scrollableElement) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - startXRef.current);
        const deltaY = Math.abs(touch.clientY - startYRef.current);
        
        // If horizontal movement is greater than vertical, it's a horizontal scroll
        if (deltaX > deltaY && deltaX > threshold) {
          isScrollingRef.current = true;
          
          // Check if the element can scroll horizontally
          const canScrollHorizontally = 
            scrollableElement.scrollWidth > scrollableElement.clientWidth;
          
          if (canScrollHorizontally) {
            // Allow horizontal scrolling, prevent vertical scrolling
            e.stopPropagation();
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [threshold, selector]);

  return {
    scrollableProps: {
      'data-scrollable': true,
      className: 'overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch'
    }
  };
}