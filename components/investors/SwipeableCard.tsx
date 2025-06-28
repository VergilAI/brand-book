"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  className?: string;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}: SwipeableCardProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartTime.current = Date.now();
      setIsAnimating(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - touchStartX.current;
      setSwipeX(deltaX);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaTime = Date.now() - touchStartTime.current;
      
      setIsAnimating(true);
      
      // Quick swipe or swipe past threshold
      if ((Math.abs(deltaX) > 50 && deltaTime < 300) || Math.abs(deltaX) > 100) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      
      setSwipeX(0);
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('touchstart', handleTouchStart, { passive: true });
      card.addEventListener('touchmove', handleTouchMove, { passive: true });
      card.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (card) {
        card.removeEventListener('touchstart', handleTouchStart);
        card.removeEventListener('touchmove', handleTouchMove);
        card.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [onSwipeLeft, onSwipeRight]);

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        {leftAction && (
          <div 
            className="transition-opacity"
            style={{ opacity: Math.max(0, swipeX / 100) }}
          >
            {leftAction}
          </div>
        )}
        {rightAction && (
          <div 
            className="ml-auto transition-opacity"
            style={{ opacity: Math.max(0, -swipeX / 100) }}
          >
            {rightAction}
          </div>
        )}
      </div>

      {/* Main Card */}
      <div
        ref={cardRef}
        className={cn(
          "relative bg-dark-800 rounded-lg",
          isAnimating && "transition-transform duration-200",
          className
        )}
        style={{
          transform: `translateX(${swipeX}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
}