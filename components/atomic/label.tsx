"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  [
    // Base styles
    "inline-flex items-center gap-spacing-xs",
    // Responsive typography: larger on mobile for readability, smaller on desktop
    "text-base sm:text-sm font-medium leading-normal",
    // Color - Default text color
    "text-primary",
    // Spacing from associated inputs
    "mb-spacing-xs",
    // Cursor
    "cursor-default select-none",
    // Transitions
    "transition-colors duration-fast ease-out",
    // Disabled states
    "peer-disabled:cursor-not-allowed",
    "peer-disabled:opacity-disabled",
    "peer-disabled:text-disabled",
  ],
  {
    variants: {
      variant: {
        default: "text-primary",
        error: "text-error",
        success: "text-success",
        warning: "text-warning",
        info: "text-info",
      },
      size: {
        sm: "text-sm sm:text-xs mb-spacing-xs",
        md: "text-base sm:text-sm mb-spacing-xs",
        lg: "text-lg sm:text-base mb-spacing-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /** 
   * Whether the field is required. 
   * When true, displays a red asterisk after the label text.
   */
  required?: boolean
  /** 
   * Optional error message to display below the label.
   * Automatically sets the variant to "error" when provided.
   */
  error?: string
  /** 
   * Optional help text to display below the label.
   */
  helpText?: string
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  variant, 
  size,
  required,
  error,
  helpText,
  children,
  ...props 
}, ref) => {
  // If error is provided, use error variant
  const finalVariant = error ? "error" : variant

  return (
    <div className="flex flex-col">
      <LabelPrimitive.Root
        ref={ref}
        data-slot="label"
        className={cn(labelVariants({ variant: finalVariant, size }), className)}
        {...props}
      >
        <span>{children}</span>
        {required && (
          <span 
            className="text-error ml-spacing-xs" 
            aria-label="required"
          >
            *
          </span>
        )}
      </LabelPrimitive.Root>
      
      {/* Error message */}
      {error && (
        <span 
          className="text-sm text-error mt-spacing-xs"
          role="alert"
        >
          {error}
        </span>
      )}
      
      {/* Help text */}
      {helpText && !error && (
        <span className="text-sm text-secondary mt-spacing-xs">
          {helpText}
        </span>
      )}
    </div>
  )
})

Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }