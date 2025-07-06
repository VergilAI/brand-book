import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-medium transition-all duration-normal ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-disabled",
  {
    variants: {
      variant: {
        default:
          "bg-bg-secondary text-text-primary border border-border-default hover:bg-bg-emphasis",
        success:
          "bg-bg-successLight text-text-success border border-border-success",
        warning:
          "bg-bg-warningLight text-text-warning border border-border-warning",
        error:
          "bg-bg-errorLight text-text-error border border-border-error",
        info:
          "bg-bg-infoLight text-text-info border border-border-info",
        brand:
          "bg-bg-brandLight text-text-brand border border-border-brand",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant }),
          // Responsive padding: larger on mobile, smaller on desktop
          "px-3 py-1 text-sm",
          "sm:px-2.5 sm:py-0.5 sm:text-xs",
          // Proper border radius
          "rounded-md",
          // Ensure badges have enough visual weight
          "shadow-sm",
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }