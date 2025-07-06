import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: "p-1 [&_svg]:h-3 [&_svg]:w-3", // 4px padding, 12px icon
      md: "p-1 [&_svg]:h-4 [&_svg]:w-4", // 4px padding, 16px icon
      lg: "p-2 [&_svg]:h-5 [&_svg]:w-5", // 8px padding, 20px icon
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center",
          "rounded-sm", // var(--radius-sm) = 4px
          "text-text-secondary", // #6C6C6D
          "hover:text-text-primary", // #1D1D1F
          "transition-all duration-200", // var(--duration-normal)
          "focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2", // rgba(166, 77, 255, 0.5)
          "group",
          sizeClasses[size],
          className
        )}
        aria-label="Close"
        {...props}
      >
        <X className="transition-transform duration-200 group-hover:rotate-90" /> {/* var(--duration-normal) */}
      </button>
    )
  }
)
CloseButton.displayName = "CloseButton"

export { CloseButton }