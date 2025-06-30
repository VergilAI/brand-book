"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "relative z-50 overflow-visible rounded-md bg-white px-3 py-1.5 text-sm text-gray-700 shadow-lg border border-gray-200",
        "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
        "data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
        "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:data-[state=delayed-open]:slide-in-from-top-1",
        "data-[side=left]:data-[state=delayed-open]:slide-in-from-right-1",
        "data-[side=right]:data-[state=delayed-open]:slide-in-from-left-1",
        "data-[side=top]:data-[state=delayed-open]:slide-in-from-bottom-1",
        "transition-all duration-200 ease-out",
        className
      )}
      {...props}
    >
      {props.children}
      {/* Custom arrow with border */}
      <svg 
        className="absolute -top-[6px] left-1/2 -translate-x-1/2"
        width="12" 
        height="6" 
        viewBox="0 0 12 6" 
        style={{ overflow: 'visible' }}
      >
        <path 
          d="M 0 6 L 6 0 L 12 6" 
          fill="white" 
          stroke="rgb(229 231 235)" 
          strokeWidth="1"
          strokeLinejoin="miter"
        />
      </svg>
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }