import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles - spacious and clean
          "flex w-full",
          // Responsive height: 48px mobile, 36px desktop
          "h-12 sm:h-9",
          // Responsive padding: more padding on mobile for touch targets
          "px-4 sm:px-3",
          // Proper text padding to prevent text touching edges
          "py-2",
          "text-base", // 16px font to prevent mobile zoom
          "font-normal",
          
          // Background - subtle emphasis
          "bg-bg-emphasisInput",
          
          // Border - subtle by default
          "border border-border-default",
          "rounded-md",
          
          // Typography with semantic tokens
          "text-text-primary",
          "placeholder:text-text-tertiary",
          
          // Transitions
          "transition-all duration-normal ease-out",
          
          // Focus state - clear and accessible
          "focus:outline-none",
          "focus:ring-2 focus:ring-border-focus focus:ring-offset-2",
          "focus:border-border-focus",
          
          // Hover state
          "hover:border-border-emphasis",
          "hover:bg-bg-secondary",
          
          // Disabled state
          "disabled:cursor-not-allowed",
          "disabled:bg-bg-disabled",
          "disabled:text-text-disabled",
          "disabled:border-border-disabled",
          "disabled:hover:bg-bg-disabled",
          "disabled:hover:border-border-disabled",
          
          // Error state
          error && [
            "border-border-error",
            "text-text-error",
            "placeholder:text-text-error/60",
            "focus:ring-border-error",
            "focus:border-border-error",
            "hover:border-border-error",
          ],
          
          // Success state
          success && [
            "border-border-success",
            "text-text-success",
            "placeholder:text-text-success/60",
            "focus:ring-border-success",
            "focus:border-border-success",
            "hover:border-border-success",
          ],
          
          // File input specific styles
          "file:border-0",
          "file:bg-transparent",
          "file:text-base",
          "file:font-medium",
          "file:text-text-primary",
          "file:mr-spacing-sm",
          
          // Selection styles
          "selection:bg-bg-brand selection:text-text-inverse",
          
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }