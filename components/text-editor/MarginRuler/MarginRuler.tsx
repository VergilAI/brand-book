'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MarginRulerProps {
  onMarginsChange?: (left: number, right: number) => void;
  maxWidth?: number;
}

// Convert pixels to points (1pt = 1.333px)
const pxToPt = (px: number) => px / 1.333;
const ptToPx = (pt: number) => pt * 1.333;

// Snap to nearest 0.5pt
const snapToHalfPoint = (px: number) => {
  const pt = pxToPt(px);
  const snappedPt = Math.round(pt * 2) / 2; // Round to nearest 0.5
  return ptToPx(snappedPt);
};

export function MarginRuler({ onMarginsChange, maxWidth = 595 }: MarginRulerProps) {
  const [leftMargin, setLeftMargin] = useState(ptToPx(60)); // Smaller margin for screen
  const [rightMargin, setRightMargin] = useState(ptToPx(60));
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [dragPreview, setDragPreview] = useState<{ left?: number; right?: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;
    
    if (isDraggingLeft) {
      const rawMargin = Math.max(ptToPx(36), Math.min(x, containerWidth / 2 - ptToPx(72)));
      const snappedMargin = snapToHalfPoint(rawMargin);
      setDragPreview({ left: snappedMargin });
      // Only update if the snapped position has changed
      if (snappedMargin !== leftMargin) {
        setLeftMargin(snappedMargin);
        onMarginsChange?.(snappedMargin, rightMargin);
      }
    } else if (isDraggingRight) {
      const rawMargin = Math.max(ptToPx(36), Math.min(containerWidth - x, containerWidth / 2 - ptToPx(72)));
      const snappedMargin = snapToHalfPoint(rawMargin);
      setDragPreview({ right: snappedMargin });
      // Only update if the snapped position has changed
      if (snappedMargin !== rightMargin) {
        setRightMargin(snappedMargin);
        onMarginsChange?.(leftMargin, snappedMargin);
      }
    }
  }, [isDraggingLeft, isDraggingRight, leftMargin, rightMargin, onMarginsChange]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
    setDragPreview(null);
  }, []);

  useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="relative h-10 bg-whisper-gray dark:bg-gray-800 border-b border-mist-gray/20 dark:border-gray-700 select-none overflow-hidden"
      style={{ width: `${maxWidth}px` }}
    >
      {/* Ruler markings - every 0.1 inch for fine detail */}
      <div className="absolute inset-0 flex items-end">
        {Array.from({ length: Math.floor(maxWidth / ptToPx(7.2)) }).map((_, i) => {
          const position = i * ptToPx(7.2); // 0.1 inch
          const isInch = i % 10 === 0;
          const isHalfInch = i % 5 === 0 && !isInch;
          const isTenth = !isInch && !isHalfInch;
          
          return (
            <div key={i}>
              <div
                className={cn(
                  "absolute bg-stone-gray dark:bg-gray-400",
                  isInch ? "h-4 w-px" : isHalfInch ? "h-3 w-px" : "h-1 w-px opacity-50"
                )}
                style={{ left: `${position}px`, bottom: 0 }}
              />
              {isInch && (
                <span 
                  className="absolute text-[10px] text-stone-gray dark:text-gray-400 font-medium"
                  style={{ 
                    left: `${position}px`, 
                    bottom: '20px',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {i / 10}"
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Snap indicators - show 0.5pt positions */}
      {(isDraggingLeft || isDraggingRight) && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: Math.floor(maxWidth / ptToPx(0.5)) }).map((_, i) => {
            const position = snapToHalfPoint(i * ptToPx(0.5));
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-cosmic-purple/10"
                style={{ left: `${position}px` }}
              />
            );
          })}
        </div>
      )}

      {/* Left margin handle */}
      <div
        className={cn(
          "absolute top-0 h-full cursor-ew-resize group",
          "transition-transform duration-75",
          isDraggingLeft && "z-50"
        )}
        style={{ 
          left: `${leftMargin}px`,
          transform: 'translateX(-50%)'
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDraggingLeft(true);
        }}
      >
        {/* Handle grip area */}
        <div className="absolute inset-y-0 -left-2 -right-2 group-hover:bg-cosmic-purple/10" />
        
        {/* Visible handle */}
        <div className={cn(
          "absolute top-0 bottom-0 w-1 bg-cosmic-purple",
          "group-hover:bg-electric-violet group-hover:w-2 transition-all",
          isDraggingLeft && "bg-electric-violet w-2"
        )} />
        
        {/* Triangle indicator */}
        <div className={cn(
          "absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0",
          "border-t-[6px] border-t-transparent",
          "border-b-[6px] border-b-transparent",
          "border-r-[8px] transition-colors",
          isDraggingLeft ? "border-r-electric-violet" : "border-r-cosmic-purple group-hover:border-r-electric-violet"
        )} />
        
        {/* Margin value tooltip */}
        {isDraggingLeft && (
          <div className="absolute -top-8 left-0 bg-deep-space dark:bg-gray-700 text-pure-light text-xs px-2 py-1 rounded whitespace-nowrap z-50 font-mono">
            {(pxToPt(leftMargin) / 72).toFixed(2)}"
          </div>
        )}
      </div>

      {/* Right margin handle */}
      <div
        className={cn(
          "absolute top-0 h-full cursor-ew-resize group",
          "transition-transform duration-75",
          isDraggingRight && "z-50"
        )}
        style={{ 
          right: `${rightMargin}px`,
          transform: 'translateX(50%)'
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDraggingRight(true);
        }}
      >
        {/* Handle grip area */}
        <div className="absolute inset-y-0 -left-2 -right-2 group-hover:bg-cosmic-purple/10" />
        
        {/* Visible handle */}
        <div className={cn(
          "absolute top-0 bottom-0 w-1 bg-cosmic-purple",
          "group-hover:bg-electric-violet group-hover:w-2 transition-all",
          isDraggingRight && "bg-electric-violet w-2"
        )} />
        
        {/* Triangle indicator */}
        <div className={cn(
          "absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0",
          "border-t-[6px] border-t-transparent",
          "border-b-[6px] border-b-transparent",
          "border-l-[8px] transition-colors",
          isDraggingRight ? "border-l-electric-violet" : "border-l-cosmic-purple group-hover:border-l-electric-violet"
        )} />
        
        {/* Margin value tooltip */}
        {isDraggingRight && (
          <div className="absolute -top-8 right-0 bg-deep-space dark:bg-gray-700 text-pure-light text-xs px-2 py-1 rounded whitespace-nowrap z-50 font-mono">
            {(pxToPt(rightMargin) / 72).toFixed(2)}"
          </div>
        )}
      </div>

    </div>
  );
}