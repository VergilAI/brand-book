"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /**
   * The preferred side of the trigger to render the tooltip
   * @default "top"
   */
  side?: "top" | "right" | "bottom" | "left"
  /**
   * The preferred alignment of the tooltip relative to the trigger
   * @default "center"
   */
  align?: "start" | "center" | "end"
  /**
   * Distance in pixels from the trigger
   * @default 4
   */
  sideOffset?: number
  /**
   * Whether to hide the arrow
   * @default false
   */
  hideArrow?: boolean
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, hideArrow = false, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Base styles with semantic tokens
      "z-50 overflow-hidden",
      // Background and text using semantic tokens
      "bg-inverse text-inverse",
      // Typography - clear and readable
      "text-sm font-normal leading-relaxed",
      // Proper padding for tooltip content
      "px-3 py-2",
      // Border radius
      "rounded-md",
      // Shadow for elevation
      "shadow-popover",
      // Smooth animations - instant appearance
      "animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      // Position-based slide animations
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    {props.children}
    {!hideArrow && (
      <TooltipPrimitive.Arrow
        className="fill-inverse animate-in fade-in-0"
        width={8}
        height={4}
      />
    )}
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

// Type exports for better developer experience
export type { TooltipContentProps }