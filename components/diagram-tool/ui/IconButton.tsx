"use client"

import React from 'react'
import { Button } from '@/components/button'
import { cn } from '@/lib/utils'

interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  active?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  disabled?: boolean
}

export function IconButton({
  icon,
  onClick,
  active = false,
  className,
  size = 'md',
  variant = 'ghost',
  disabled = false
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-0",
        size === 'sm' && "h-8 w-8",
        size === 'md' && "h-10 w-10",
        size === 'lg' && "h-12 w-12",
        active && "bg-brand/10 text-brand hover:bg-brand/20",
        className
      )}
    >
      {icon}
    </Button>
  )
}

interface IconButtonWithTooltipProps extends IconButtonProps {
  tooltip: string
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
}

export function IconButtonWithTooltip({
  tooltip,
  tooltipSide = 'top',
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <div className="relative group">
      <IconButton {...props} />
      <div className={cn(
        "absolute z-50 px-2 py-1 text-xs font-medium text-inverse bg-primary rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap",
        tooltipSide === 'top' && "bottom-full left-1/2 -translate-x-1/2 mb-2",
        tooltipSide === 'bottom' && "top-full left-1/2 -translate-x-1/2 mt-2",
        tooltipSide === 'left' && "right-full top-1/2 -translate-y-1/2 mr-2",
        tooltipSide === 'right' && "left-full top-1/2 -translate-y-1/2 ml-2"
      )}>
        {tooltip}
      </div>
    </div>
  )
}