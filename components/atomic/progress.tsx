"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative w-full overflow-hidden transition-all duration-normal",
  {
    variants: {
      variant: {
        default: "bg-bg-secondary",
        success: "bg-bg-success/20",
        warning: "bg-bg-warning/20",
        error: "bg-bg-error/20",
      },
      size: {
        sm: "h-2 rounded-md",
        md: "h-3 rounded-lg",
        lg: "h-4 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-normal ease-out",
  {
    variants: {
      variant: {
        default: "bg-bg-brand",
        success: "bg-bg-success",
        warning: "bg-bg-warning",
        error: "bg-bg-error",
      },
      size: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  /**
   * The progress value (0-100)
   */
  value?: number
  /**
   * The maximum value (default: 100)
   */
  max?: number
  /**
   * Optional label to display above the progress bar
   */
  label?: string
  /**
   * Whether to show the percentage value
   */
  showPercentage?: boolean
  /**
   * Custom class name for the indicator
   */
  indicatorClassName?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant,
      size,
      label,
      showPercentage,
      indicatorClassName,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

    return (
      <div className="w-full space-y-spacing-xs">
        {(label || showPercentage) && (
          <div className="flex items-center justify-between">
            {label && (
              <span className="text-sm font-medium text-secondary">
                {label}
              </span>
            )}
            {showPercentage && (
              <span
                className={cn(
                  "text-sm font-semibold transition-colors duration-normal",
                  variant === "success" && "text-success",
                  variant === "warning" && "text-warning",
                  variant === "error" && "text-error",
                  (!variant || variant === "default") && "text-primary"
                )}
              >
                {percentage}%
              </span>
            )}
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(progressVariants({ variant, size }), className)}
          aria-label={label || "Progress"}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuetext={`${percentage}%`}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              progressIndicatorVariants({ variant, size }),
              indicatorClassName
            )}
            style={{
              transform: `translateX(-${100 - percentage}%)`,
            }}
          />
        </ProgressPrimitive.Root>
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress, progressVariants }