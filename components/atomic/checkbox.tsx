"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    indeterminate?: boolean
  }
>(({ className, indeterminate, checked, ...props }, ref) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={indeterminate ? "indeterminate" : checked}
      className={cn(
        // Responsive base styles: larger on mobile for better touch targets
        "peer relative inline-flex shrink-0 cursor-pointer items-center justify-center",
        "h-7 w-7 sm:h-5 sm:w-5", // 28px mobile, 20px desktop
        "rounded-md border-2 border-border-default bg-bg-primary",
        
        // Responsive click target: larger on mobile
        "before:absolute before:content-['']",
        "before:-inset-3 sm:before:-inset-2.5", // 52px mobile, 44px desktop
        
        // Transitions using semantic motion tokens
        "transition-all duration-normal ease-out",
        
        // Hover state with semantic tokens
        "hover:border-border-brand hover:bg-bg-brandLight hover:shadow-sm",
        
        // Focus state with clear ring-2 ring-border-focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        
        // Checked state with semantic tokens
        "data-[state=checked]:border-border-brand data-[state=checked]:bg-bg-brand",
        "data-[state=checked]:text-text-inverse",
        
        // Indeterminate state
        "data-[state=indeterminate]:border-border-brand data-[state=indeterminate]:bg-bg-brand",
        "data-[state=indeterminate]:text-text-inverse",
        
        // Disabled state with semantic tokens
        "disabled:cursor-not-allowed disabled:opacity-disabled",
        "disabled:hover:border-border-default disabled:hover:bg-bg-primary",
        
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-current",
          // Animation for the check mark
          mounted && "animate-in fade-in-0 zoom-in-95 duration-fast"
        )}
      >
        {indeterminate ? (
          <Minus className="h-5 w-5 sm:h-4 sm:w-4 stroke-[3]" />
        ) : (
          <Check className="h-5 w-5 sm:h-4 sm:w-4 stroke-[3]" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Checkbox with label component
const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label: string
    description?: string
    indeterminate?: boolean
  }
>(({ label, description, className, indeterminate, ...props }, ref) => {
  const id = React.useId()
  
  return (
    <div className="flex items-start gap-spacing-sm">
      <Checkbox
        ref={ref}
        id={id}
        indeterminate={indeterminate}
        className={className}
        {...props}
      />
      <div className="grid gap-spacing-xs leading-none">
        <label
          htmlFor={id}
          className={cn(
            "text-base sm:text-sm font-medium text-text-primary cursor-pointer select-none",
            "peer-disabled:cursor-not-allowed peer-disabled:text-text-disabled"
          )}
        >
          {label}
        </label>
        {description && (
          <p
            className={cn(
              "text-sm sm:text-xs text-text-secondary",
              "peer-disabled:text-text-disabled"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
})
CheckboxWithLabel.displayName = "CheckboxWithLabel"

// Custom styled checkbox variations for different contexts
const CheckboxVariants = {
  default: "",
  brand: cn(
    "border-border-brand",
    "hover:shadow-brand-sm",
    "focus-visible:ring-border-brand",
    "data-[state=checked]:shadow-brand-sm",
    "data-[state=indeterminate]:shadow-brand-sm"
  ),
  success: cn(
    "border-border-success",
    "hover:border-border-successEmphasis hover:bg-bg-successLight",
    "focus-visible:ring-border-success",
    "data-[state=checked]:border-border-successEmphasis data-[state=checked]:bg-bg-success",
    "data-[state=indeterminate]:border-border-successEmphasis data-[state=indeterminate]:bg-bg-success"
  ),
  error: cn(
    "border-border-error",
    "hover:border-border-errorEmphasis hover:bg-bg-errorLight",
    "focus-visible:ring-border-error",
    "data-[state=checked]:border-border-errorEmphasis data-[state=checked]:bg-bg-error",
    "data-[state=indeterminate]:border-border-errorEmphasis data-[state=indeterminate]:bg-bg-error"
  ),
  large: "h-9 w-9 sm:h-8 sm:w-8 before:-inset-3.5 sm:before:-inset-3 [&>span>svg]:h-6 [&>span>svg]:w-6 sm:[&>span>svg]:h-5 sm:[&>span>svg]:w-5",
  small: "h-5 w-5 sm:h-4 sm:w-4 before:-inset-2.5 sm:before:-inset-2 [&>span>svg]:h-3.5 [&>span>svg]:w-3.5 sm:[&>span>svg]:h-3 sm:[&>span>svg]:w-3"
}

// Animated checkbox with smooth transitions and size variants
const AnimatedCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    variant?: keyof typeof CheckboxVariants
    size?: "small" | "default" | "large"
    indeterminate?: boolean
  }
>(({ className, variant = "default", size = "default", indeterminate, ...props }, ref) => {
  const sizeClass = size === "small" ? CheckboxVariants.small : size === "large" ? CheckboxVariants.large : ""
  const variantClass = CheckboxVariants[variant] || ""
  
  return (
    <Checkbox
      ref={ref}
      className={cn(sizeClass, variantClass, className)}
      indeterminate={indeterminate}
      {...props}
    />
  )
})
AnimatedCheckbox.displayName = "AnimatedCheckbox"

// TypeScript types for better developer experience
export type CheckboxProps = React.ComponentPropsWithoutRef<typeof Checkbox>
export type CheckboxWithLabelProps = React.ComponentPropsWithoutRef<typeof CheckboxWithLabel>
export type AnimatedCheckboxProps = React.ComponentPropsWithoutRef<typeof AnimatedCheckbox>

export { Checkbox, CheckboxWithLabel, AnimatedCheckbox, CheckboxVariants }