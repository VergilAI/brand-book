"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import * as d3 from "d3";
import { isTouchDevice } from "@/lib/utils";

export interface BaseChartProps {
  width?: number;
  height?: number;
  mobileHeight?: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  mobileMargins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ChartDimensions {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export function useChartDimensions(
  containerRef: React.RefObject<HTMLDivElement>,
  props: BaseChartProps
): [ChartDimensions, boolean] {
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: 0,
    height: props.height || 400,
    innerWidth: 0,
    innerHeight: 0,
    margins: props.margins || { top: 20, right: 80, bottom: 60, left: 80 }
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const mobile = width < 640;
        setIsMobile(mobile);

        const margins = mobile && props.mobileMargins ? props.mobileMargins : props.margins || { top: 20, right: 80, bottom: 60, left: 80 };
        const height = mobile && props.mobileHeight ? props.mobileHeight : props.height || 400;
        const chartWidth = mobile ? Math.max(width, 600) : width;
        
        setDimensions({
          width: chartWidth,
          height,
          innerWidth: chartWidth - margins.left - margins.right,
          innerHeight: height - margins.top - margins.bottom,
          margins
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef, props]);

  return [dimensions, isMobile];
}

export interface TooltipState {
  x: number;
  y: number;
  content: string;
}

export function useMobileTooltip() {
  const [activeTooltip, setActiveTooltip] = useState<TooltipState | null>(null);
  
  const showTooltip = (tooltip: TooltipState, duration: number = 3000) => {
    setActiveTooltip(tooltip);
    setTimeout(() => setActiveTooltip(null), duration);
  };
  
  const hideTooltip = () => setActiveTooltip(null);
  
  return { activeTooltip, showTooltip, hideTooltip };
}

export interface ZoomState {
  scale: number;
  translateX: number;
}

export function useChartZoom(initialScale: number = 1) {
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: initialScale,
    translateX: 0
  });
  const touchStartRef = useRef<{ x: number; y: number; distance?: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent, onLongPress?: (x: number, y: number) => void) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      
      // Start long press timer
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          if (touchStartRef.current) {
            onLongPress(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, 500);
      }
    } else if (e.touches.length === 2) {
      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      
      // Calculate initial distance for pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      touchStartRef.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance
      };
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent, containerWidth: number) => {
    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (!touchStartRef.current) return;
    
    if (e.touches.length === 1 && zoomState.scale > 1) {
      // Pan when zoomed
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const maxTranslate = containerWidth * (zoomState.scale - 1);
      
      setZoomState(prev => ({
        ...prev,
        translateX: Math.max(-maxTranslate, Math.min(0, prev.translateX + deltaX))
      }));
      
      touchStartRef.current.x = touch.clientX;
    } else if (e.touches.length === 2) {
      // Pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (touchStartRef.current.distance) {
        const scale = distance / touchStartRef.current.distance;
        setZoomState(prev => ({
          ...prev,
          scale: Math.max(1, Math.min(3, prev.scale * scale))
        }));
        touchStartRef.current.distance = distance;
      }
    }
  };
  
  const handleTouchEnd = () => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    touchStartRef.current = null;
    
    // Reset zoom if close to 1
    if (Math.abs(zoomState.scale - 1) < 0.1) {
      setZoomState({ scale: 1, translateX: 0 });
    }
  };
  
  const resetZoom = () => {
    setZoomState({ scale: 1, translateX: 0 });
  };
  
  const getTransformString = () => {
    return `translate(${zoomState.translateX},0) scale(${zoomState.scale},1)`;
  };
  
  return {
    zoomState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetZoom,
    getTransformString
  };
}

interface MobileTooltipProps {
  tooltip: TooltipState | null;
  containerWidth: number;
  className?: string;
}

export function MobileTooltip({ tooltip, containerWidth, className = "" }: MobileTooltipProps) {
  if (!tooltip) return null;
  
  return (
    <div 
      className={`absolute bg-dark-900/95 border border-cosmic-purple/50 rounded-lg p-3 text-sm z-10 ${className}`}
      style={{
        left: `${Math.min(tooltip.x, containerWidth - 200)}px`,
        top: `${Math.max(tooltip.y - 80, 10)}px`,
        minWidth: '160px'
      }}
      dangerouslySetInnerHTML={{ __html: tooltip.content }}
    />
  );
}

export function createD3Tooltip(className: string, borderColor: string) {
  if (isTouchDevice()) return null;
  
  return d3.select("body").append("div")
    .attr("class", className)
    .style("position", "absolute")
    .style("padding", "12px")
    .style("background", "rgba(15, 23, 42, 0.95)")
    .style("border", `1px solid ${borderColor}`)
    .style("border-radius", "8px")
    .style("color", "#FFFFFF")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("transition", "opacity 0.2s");
}

export function formatAxisTick(value: number, isMobile: boolean): string {
  if (value === 0) return "0";
  
  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return `${(value / 1000000).toFixed(isMobile ? 0 : 1)}M`;
  } else if (absValue >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  
  return value.toFixed(0);
}

export function responsiveAxisFormat(
  axis: d3.Axis<any>,
  isMobile: boolean,
  type: 'x' | 'y' = 'x'
) {
  if (type === 'x' && isMobile) {
    axis.ticks(6);
  }
  
  return axis;
}

export interface ZoomControlsProps {
  zoomLevel: number;
  onReset: () => void;
  className?: string;
}

export function ZoomControls({ zoomLevel, onReset, className = "" }: ZoomControlsProps) {
  if (zoomLevel <= 1) return null;
  
  return (
    <div className={`text-center mt-2 ${className}`}>
      <button
        onClick={onReset}
        className="text-[10px] text-cosmic-purple underline"
      >
        Reset zoom ({Math.round(zoomLevel * 100)}%)
      </button>
    </div>
  );
}