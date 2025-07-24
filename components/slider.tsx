"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track 
      className={cn(
        "relative w-full grow overflow-hidden",
        "h-2", // 8px height
        "rounded-md", // var(--radius-md) = 8px - pill shape without distortion
        "bg-bg-emphasis", // #F0F0F2 - subtle gray background
        "data-[disabled]:opacity-50", // var(--opacity-disabled)
      )}
    >
      <SliderPrimitive.Range 
        className={cn(
          "absolute h-full",
          "bg-bg-brand", // #7B00FF - brand purple
          "data-[disabled]:bg-bg-disabled", // #F0F0F2
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className={cn(
        "block rounded-full",
        "h-5 w-5", // 20px - proportional to track
        "bg-white", // white inside matching background
        "border-2 border-[#A64DFF]", // same purple as track bg-bg-brand
        "shadow-md", // 0 4px 6px rgba(0, 0, 0, 0.07)
        
        // Remove tap highlight on mobile
        "[-webkit-tap-highlight-color:transparent]",
        "[tap-highlight-color:transparent]",
        
        // States - only transform, no shadow transitions
        "transition-transform duration-fast", // var(--duration-fast) = 100ms
        "hover:scale-110", // Hover: scale up only, no shadow change
        
        // Remove all focus and active effects
        "focus:outline-none",
        "focus-visible:outline-none",
        "active:outline-none",
        "[&:focus]:outline-none",
        "[&:active]:outline-none",
        "[&:focus-visible]:outline-none",
        
        // Disabled
        "disabled:pointer-events-none",
        "disabled:opacity-50", // var(--opacity-disabled)
        "disabled:border-border-disabled", // #D4D4D8 - disabled border
        
        // Cursor
        "cursor-pointer",
        "disabled:cursor-not-allowed",
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }