"use client";

import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MobileChartWrapperProps {
  children: ReactNode;
  minWidth?: number;
  className?: string;
  showHint?: boolean;
  hintText?: string;
}

export function MobileChartWrapper({
  children,
  minWidth = 600,
  className,
  showHint = true,
  hintText = "Scroll to see more • Tap for details"
}: MobileChartWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setHasOverflow(width < minWidth);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [minWidth]);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("relative", className)}>
      {/* Scrollable container */}
      <div className="overflow-x-auto -mx-3 pb-2">
        <div 
          className="px-3"
          style={{ minWidth: hasOverflow ? `${minWidth}px` : 'auto' }}
        >
          {children}
        </div>
      </div>
      
      {/* Scroll indicators */}
      {hasOverflow && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </>
      )}
      
      {/* Mobile hint */}
      {showHint && hasOverflow && (
        <p className="text-[10px] text-gray-500 text-center mt-2 animate-pulse">
          {hintText}
        </p>
      )}
    </div>
  );
}