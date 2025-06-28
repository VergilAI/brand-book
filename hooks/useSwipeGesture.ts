import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  preventScrollOnSwipe?: boolean;
}

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
  isScrolling: boolean;
}

export function useSwipeGesture(
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const {
    minSwipeDistance = 50,
    maxSwipeTime = 500,
    preventScrollOnSwipe = true
  } = options;

  const touchData = useRef<TouchData | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchData.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isScrolling: false
    };
    setIsSwiping(false);
    setSwipeDirection(null);
    setSwipeProgress(0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchData.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchData.current.startX;
    const deltaY = touch.clientY - touchData.current.startY;

    // Determine if user is scrolling vertically
    if (!touchData.current.isScrolling && Math.abs(deltaY) > Math.abs(deltaX)) {
      touchData.current.isScrolling = true;
    }

    // If scrolling, don't process as swipe
    if (touchData.current.isScrolling) {
      setIsSwiping(false);
      return;
    }

    // Calculate swipe progress
    const progress = Math.min(Math.abs(deltaX) / minSwipeDistance, 1);
    setSwipeProgress(progress);

    // Determine swipe direction
    if (Math.abs(deltaX) > 10) {
      setIsSwiping(true);
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
      
      if (preventScrollOnSwipe) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchData.current || touchData.current.isScrolling) {
      setIsSwiping(false);
      setSwipeDirection(null);
      setSwipeProgress(0);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchData.current.startX;
    const deltaY = touch.clientY - touchData.current.startY;
    const deltaTime = Date.now() - touchData.current.startTime;

    // Reset visual states
    setIsSwiping(false);
    setSwipeDirection(null);
    setSwipeProgress(0);

    // Check if it's a valid swipe
    if (deltaTime > maxSwipeTime) return;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Horizontal swipe
    if (absX > minSwipeDistance && absX > absY) {
      if (deltaX > 0 && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      } else if (deltaX < 0 && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      }
    }
    
    // Vertical swipe
    if (absY > minSwipeDistance && absY > absX) {
      if (deltaY > 0 && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      } else if (deltaY < 0 && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      }
    }

    touchData.current = null;
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, minSwipeDistance, maxSwipeTime, preventScrollOnSwipe]);

  return {
    isSwiping,
    swipeDirection,
    swipeProgress
  };
}