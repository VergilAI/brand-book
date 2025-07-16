import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    // Base styles - confident and spacious
    "inline-flex items-center justify-center whitespace-nowrap",
    "font-medium transition-all outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    
    // Typography tokens - larger, more confident
    "text-base font-medium",
    
    // Animation tokens
    "duration-normal ease-out",
    
    // Focus states using semantic tokens
    "focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-border-focus",
    
    // Icon handling
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Brand background with white text
          "bg-bg-brand text-text-inverse",
          // Hover state - subtle shadow elevation
          "hover:shadow-brand-md",
          // Shadow for depth
          "shadow-brand-sm",
          // Active state - subtle scale
          "active:scale-[0.98]",
        ].join(" "),
        
        secondary: [
          // Bright white background
          "bg-bg-primary text-text-primary",
          // Clean border
          "border border-border-default",
          // Hover state - emphasis background
          "hover:bg-bg-emphasis hover:border-border-emphasis",
          // Subtle shadow
          "shadow-sm hover:shadow-card-hover",
        ].join(" "),
        
        ghost: [
          // Text only - clean and minimal
          "text-text-primary",
          // Hover state - subtle background
          "hover:bg-bg-emphasis hover:text-text-emphasis",
          // No shadow for minimal look
          "shadow-none",
        ].join(" "),
        
        destructive: [
          // Error red background with white text
          "bg-red-500 text-white", // #E51C23, #FFFFFF
          // Hover state - darker red
          "hover:bg-red-600", // #DC2626
          // Active state - even darker red
          "active:bg-red-700", // #B91C1C
          // Shadow for depth
          "shadow-sm hover:shadow-card-hover",
          // Active state - subtle scale
          "active:scale-[0.98]",
        ].join(" "),
      },
      
      size: {
        sm: [
          // Responsive size: 40px mobile, 32px desktop
          "h-10 sm:h-8",
          // Responsive padding
          "px-4 sm:px-3 py-2 sm:py-1.5 gap-1.5",
          // Typography
          "text-sm",
          // Border radius
          "rounded-lg",
        ].join(" "),
        
        md: [
          // Responsive size: 48px mobile, 36px desktop
          "h-12 sm:h-9",
          // Responsive padding
          "px-6 sm:px-4 py-3 sm:py-2 gap-2",
          // Typography
          "text-base",
          // Border radius
          "rounded-lg",
        ].join(" "),
        
        lg: [
          // Responsive size: 56px mobile, 40px desktop
          "h-14 sm:h-10",
          // Responsive padding
          "px-8 sm:px-5 py-4 sm:py-2.5 gap-2",
          // Typography
          "text-lg sm:text-base font-semibold",
          // Border radius
          "rounded-lg",
        ].join(" "),
        
        icon: [
          // Responsive square dimensions: 48px mobile, 36px desktop
          "size-12 sm:size-9 p-0",
          // Border radius
          "rounded-lg",
        ].join(" "),
      },
    },
    
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }