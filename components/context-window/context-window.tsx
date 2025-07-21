'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useContextWindow } from './context'

interface ContextWindowProps {
  className?: string
  children?: React.ReactNode
}

export function ContextWindow({ className, children }: ContextWindowProps) {
  const { isOpen, setIsOpen } = useContextWindow()
  const portalRef = useRef<Element | null>(null)

  useEffect(() => {
    // Find the portal container
    portalRef.current = document.getElementById('context-window-portal')
  }, [])

  if (!portalRef.current) return null

  return createPortal(
    <div className={cn('flex h-full w-full flex-col bg-white overflow-hidden', className)}>
      {children}
    </div>,
    portalRef.current
  )
}

// Unified toggle button component
export function ContextWindowTrigger({ className }: { className?: string }) {
  const { state, toggle } = useContextWindow()

  return (
    <button
      onClick={toggle}
      className={cn(
        'fixed right-0 top-1/2 -translate-y-1/2 z-40',
        'h-12 w-8 sm:h-10 sm:w-6',
        'bg-primary border border-border-default border-r-0',
        'rounded-l-md shadow-sm',
        'flex items-center justify-center',
        'hover:bg-emphasis hover:shadow-md',
        'transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
        className
      )}
      aria-label={`${state !== 'closed' ? 'Close' : 'Open'} context window (Cmd+K)`}
      title={`${state !== 'closed' ? 'Close' : 'Open'} context window (Cmd+K)`}
    >
      {state !== 'closed' ? (
        <ChevronRight className="h-4 w-4 text-secondary" />
      ) : (
        <ChevronLeft className="h-4 w-4 text-secondary" />
      )}
    </button>
  )
}