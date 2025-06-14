import React from 'react'
import { cn } from '@/lib/utils'

interface ComponentPreviewProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export function ComponentPreview({ children, className, title }: ComponentPreviewProps) {
  return (
    <div className="group relative my-4 flex flex-col space-y-2">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}
      <div className={cn(
        "preview relative rounded-md border bg-background/50 p-8 backdrop-blur-sm",
        "flex min-h-[200px] items-center justify-center",
        className
      )}>
        <div className="flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}