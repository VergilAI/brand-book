"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const switchVariants = cva(
  "group relative inline-flex shrink-0 cursor-pointer items-center rounded-lg outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
)

const thumbVariants = cva(
  "pointer-events-none block rounded-full transition-all",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[1px]",
        md: "h-5 w-5 data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[1px]",
        lg: "h-6 w-6 data-[state=checked]:translate-x-[30px] data-[state=unchecked]:translate-x-[1px]"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
)

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        switchVariants({ size }),
        // Off state
        "[--switch-bg:var(--bg-emphasis)]",
        "[--switch-border:var(--border-subtle)]",
        "[--switch-thumb-bg:var(--bg-primary)]",
        "[--switch-thumb-shadow:var(--shadow-sm)]",
        // On state
        "data-[state=checked]:[--switch-bg:var(--bg-brand)]",
        "data-[state=checked]:[--switch-border:var(--border-brand)]",
        // Focus state
        "focus-visible:[--switch-shadow:var(--shadow-focus)]",
        // Disabled state
        "data-[disabled]:opacity-50",
        "data-[disabled]:cursor-not-allowed",
        // Hover state
        "hover:scale-[1.02]",
        "data-[disabled]:hover:scale-100",
        // Apply styles
        "bg-[var(--switch-bg)]",
        "border-[length:var(--border-width-thin)]",
        "border-solid",
        "border-[color:var(--switch-border)]",
        "shadow-[var(--switch-shadow,none)]",
        "[transition:all_var(--duration-normal)_cubic-bezier(0.4,0.0,0.2,1)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          thumbVariants({ size }),
          "bg-[var(--switch-thumb-bg)]",
          "shadow-[var(--switch-thumb-shadow)]",
          "[transition:transform_var(--duration-normal)_cubic-bezier(0.68,-0.55,0.265,1.55)]",
          // Hover effect on thumb
          "group-hover:scale-105",
          "group-data-[disabled]:group-hover:scale-100"
        )}
      />
    </SwitchPrimitive.Root>
  )
})

Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }