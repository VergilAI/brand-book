'use client'

import { cn } from '@/lib/utils'
import { useContextWindow } from './context'

interface ContextWindowLayoutProps {
  children: React.ReactNode
  className?: string
  compactSize?: 'small' | 'medium' | 'large'
  expandedSize?: 'default' | 'large' | 'xlarge'
}

export function ContextWindowLayout({ 
  children, 
  className, 
  compactSize = 'medium',
  expandedSize = 'large' 
}: ContextWindowLayoutProps) {
  const { state } = useContextWindow()
  
  const compactSizeClasses = {
    small: 'w-[280px] md:w-[320px]',
    medium: 'w-[320px] md:w-[380px]',
    large: 'w-[380px] md:w-[420px]'
  }
  
  const expandedSizeClasses = {
    default: 'w-[480px] md:w-[540px] lg:w-[600px]',
    large: 'w-[540px] md:w-[640px] lg:w-[720px]',
    xlarge: 'w-[640px] md:w-[800px] lg:w-[960px]'
  }
  
  const getWidth = () => {
    switch (state) {
      case 'closed':
        return 'w-0'
      case 'compact':
        return compactSizeClasses[compactSize]
      case 'expanded':
        return expandedSizeClasses[expandedSize]
      default:
        return 'w-0'
    }
  }

  return (
    <div className={cn('flex h-screen w-screen overflow-hidden bg-secondary', className)}>
      {/* Main Section - Responsive width */}
      <main className="flex-1 min-w-0 overflow-auto transition-all duration-300 ease-out">
        {children}
      </main>

      {/* Context Window Section - Responsive width based on state */}
      <aside
        className={cn(
          'h-full bg-primary transition-[width] duration-300 ease-out overflow-hidden border-l border-border-default',
          getWidth()
        )}
      >
        {/* Context window content will be portaled here */}
        <div id="context-window-portal" className="h-full bg-primary" />
      </aside>
    </div>
  )
}