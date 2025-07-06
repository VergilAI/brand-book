"use client"

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ZoomIndicatorProps {
  zoom: number
  className?: string
}

export function ZoomIndicator({ zoom, className }: ZoomIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    // Show indicator when zoom changes
    setIsVisible(true)
    
    // Clear existing timer
    if (hideTimer) {
      clearTimeout(hideTimer)
    }
    
    // Set new timer to hide after 1.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1500)
    
    setHideTimer(timer)
    
    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer)
      }
    }
  }, [zoom])
  
  const zoomPercentage = Math.round(zoom * 100)
  
  return (
    <div
      className={cn(
        "absolute bottom-20 right-8 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
        className
      )}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        className="text-white"
      >
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="2"/>
        <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        {zoomPercentage > 100 ? (
          <>
            <line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="3" x2="6" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </>
        ) : zoomPercentage < 100 ? (
          <line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        ) : null}
      </svg>
      <span className="font-mono text-sm font-medium">{zoomPercentage}%</span>
    </div>
  )
}