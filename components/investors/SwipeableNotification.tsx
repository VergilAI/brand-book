"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface SwipeableNotificationProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export function SwipeableNotification({
  type = 'info',
  message,
  onDismiss,
  autoHide = true,
  duration = 5000
}: SwipeableNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [swipeX, setSwipeX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const handleDismiss = () => {
    setIsAnimating(true);
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAnimating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - (e.currentTarget as HTMLElement).offsetLeft;
    if (Math.abs(deltaX) > 10) {
      setSwipeX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    setIsAnimating(true);
    if (Math.abs(swipeX) > 100) {
      handleDismiss();
    } else {
      setSwipeX(0);
    }
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const colors = {
    success: "bg-consciousness-cyan/20 border-consciousness-cyan/30 text-consciousness-cyan",
    error: "bg-neural-pink/20 border-neural-pink/30 text-neural-pink",
    info: "bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple"
  };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed top-4 right-4 left-4 lg:left-auto lg:w-96 z-50",
        "border rounded-lg backdrop-blur-sm p-4 shadow-lg",
        colors[type],
        isAnimating && "transition-all duration-300",
        !isVisible && "opacity-0 scale-95"
      )}
      style={{
        transform: `translateX(${swipeX}px)`
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <p className="flex-1 text-sm font-medium">
          {message}
        </p>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Swipe indicator */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-current opacity-20 lg:hidden">
        <div 
          className="h-full bg-current transition-all duration-300"
          style={{
            width: `${((duration - (Date.now() % duration)) / duration) * 100}%`
          }}
        />
      </div>
    </div>
  );
}