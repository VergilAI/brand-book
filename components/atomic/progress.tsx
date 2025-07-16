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
        default: "bg-gray-200",
        success: "bg-green-100",
        warning: "bg-yellow-100",
        error: "bg-red-100",
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
        default: "bg-purple-600",
        success: "bg-green-600",
        warning: "bg-yellow-600",
        error: "bg-red-600",
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
   * Whether to show the percentage inside the progress bar
   */
  showInlinePercentage?: boolean
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
      showInlinePercentage,
      indicatorClassName,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

    return (
      <div className="w-full">
        {(label || (showPercentage && !showInlinePercentage)) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <span className="text-sm font-medium text-secondary">
                {label}
              </span>
            )}
            {showPercentage && !showInlinePercentage && (
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
          className={cn(progressVariants({ variant, size }), className, "relative")}
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
          {showInlinePercentage && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-white text-sm font-bold drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>
                {percentage}%
              </span>
            </div>
          )}
        </ProgressPrimitive.Root>
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress, progressVariants }