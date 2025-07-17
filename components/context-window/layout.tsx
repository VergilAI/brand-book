'use client'

import { cn } from '@/lib/utils'
import { useContextWindow } from './context'

interface ContextWindowLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ContextWindowLayout({ children, className }: ContextWindowLayoutProps) {
  const { isOpen } = useContextWindow()

  return (
    <div className={cn('flex h-screen w-screen overflow-hidden bg-secondary', className)}>
      {/* Main Section - Responsive width */}
      <main className="flex-1 min-w-0 overflow-auto transition-all duration-300 ease-out">
        {children}
      </main>

      {/* Context Window Section - Fixed width when open, 0 when closed */}
      <aside
        className={cn(
          'h-full bg-primary transition-[width] duration-300 ease-out overflow-hidden border-l border-border-default',
          isOpen ? 'w-[600px]' : 'w-0'
        )}
      >
        {/* Context window content will be portaled here */}
        <div id="context-window-portal" className="h-full bg-primary" />
      </aside>
    </div>
  )
}