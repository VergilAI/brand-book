"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { cn } from "@/lib/utils"

function Collapsible({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn(
        // Layout
        "relative",
        // Transitions for children
        "[&_[data-slot='collapsible-content']]:transition-all",
        "[&_[data-slot='collapsible-content']]:duration-normal",
        "[&_[data-slot='collapsible-content']]:timing-out",
        className
      )}
      {...props}
    />
  )
}

function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      className={cn(
        // Base styles
        "inline-flex items-center justify-center",
        // Typography
        "text-sm font-medium",
        // Colors
        "text-primary",
        // Interactions
        "cursor-pointer select-none",
        // Transitions
        "transition-all duration-fast timing-out",
        // Focus
        "focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-brand focus-visible:ring-offset-2",
        // Hover
        "hover:text-emphasis",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-disabled",
        className
      )}
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        // Layout
        "overflow-hidden",
        // Animations
        "data-[state=closed]:animate-collapse-up",
        "data-[state=open]:animate-collapse-down",
        // Transitions
        "transition-all duration-normal timing-out",
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
