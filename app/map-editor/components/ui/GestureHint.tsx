"use client"

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface GestureHintProps {
  show: boolean
  message: string
  className?: string
}

export function GestureHint({ show, message, className }: GestureHintProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show])
  
  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/90 backdrop-blur-sm text-inverse px-spacing-sm py-spacing-xs rounded-lg shadow-elevated transition-all duration-normal pointer-events-none text-sm font-medium",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}
    >
      {message}
    </div>
  )
}