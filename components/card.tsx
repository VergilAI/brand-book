import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * @component Card
 * @description Container component with various styles for content presentation
 * 
 * @example
 * // Basic usage
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     Content goes here
 *   </CardContent>
 * </Card>
 * 
 * // Interactive card
 * <Card variant="interactive">
 *   <CardContent>Hover me!</CardContent>
 * </Card>
 * 
 * @props
 * - children: ReactNode - Card content
 * - variant: 'default' | 'interactive' | 'neural' - Visual style
 * - className: string - Additional CSS classes
 * 
 * @accessibility
 * - Semantic HTML structure
 * - Focus visible indicators for interactive variant
 * 
 * @vergil-semantic card-container
 */

const cardVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: [
          "bg-bg-elevated",
          "border border-border-subtle",
          "rounded-[var(--radius-lg)]",
          "shadow-card",
          "transition-shadow duration-[var(--duration-normal)]",
        ].join(" "),
        
        interactive: [
          "bg-bg-elevated",
          "border border-border-subtle",
          "rounded-[var(--radius-lg)]",
          "shadow-card",
          "cursor-pointer",
          "transition-all duration-[var(--duration-normal)] ease-out",
          "hover:shadow-card-hover",
          "hover:scale-[1.01]",
          "hover:border-border-default",
          "active:scale-[0.99]",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[var(--border-focus)]",
          "focus-visible:ring-offset-2",
          "breathing",
        ].join(" "),
        
        neural: [
          "bg-gradient-to-br from-[var(--color-purple-50)] to-[var(--color-purple-100)]",
          "border border-border-emphasis",
          "rounded-[var(--radius-xl)]",
          "shadow-brand-sm",
          "backdrop-blur-sm",
          "transition-all duration-[var(--duration-slow)]",
          "hover:shadow-brand-md",
        ].join(" "),
        
        feature: [
          "bg-bg-elevated",
          "border border-border-subtle",
          "rounded-[var(--radius-lg)]",
          "shadow-card",
          "transition-all duration-[var(--duration-slow)] ease-out",
          "hover:shadow-dropdown",
          "hover:-translate-y-1",
          "hover:border-border-emphasis",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[var(--border-focus)]",
          "focus-visible:ring-offset-2",
        ].join(" "),
        
        metric: [
          "bg-bg-secondary",
          "border border-border-subtle",
          "rounded-[var(--radius-md)]",
          "shadow-sm",
          "transition-all duration-[var(--duration-normal)]",
          "hover:shadow-card",
          "hover:bg-bg-emphasis",
        ].join(" "),
        
        problem: [
          "bg-bg-elevated",
          "border border-border-default",
          "rounded-[var(--radius-lg)]",
          "shadow-card",
          "h-full",
          "transition-colors duration-[var(--duration-normal)]",
          "hover:border-border-emphasis",
        ].join(" "),
        
        gradient: [
          "bg-[var(--gradient-consciousness)]",
          "border-0",
          "rounded-[var(--radius-xl)]",
          "shadow-brand-md",
          "text-text-inverse",
          "transition-all duration-[var(--duration-slow)]",
          "hover:shadow-brand-lg",
          "hover:scale-[1.02]",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[var(--border-focus)]",
          "focus-visible:ring-offset-2",
        ].join(" "),
        
        outlined: [
          "bg-transparent",
          "border-2 border-border-brand",
          "rounded-[var(--radius-lg)]",
          "shadow-none",
          "transition-all duration-[var(--duration-normal)]",
          "hover:bg-bg-brandLight",
          "hover:shadow-brand-sm",
        ].join(" "),
      },
      size: {
        default: "",
        sm: "p-[var(--spacing-md)]",
        lg: "p-[var(--spacing-xl)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, ...props }, ref) => {
    const isInteractive = variant === "interactive" || variant === "feature" || variant === "gradient"
    
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, className }))}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? "button" : undefined}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-lg)]",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] leading-[var(--line-height-tight)] tracking-[var(--letter-spacing-tight)] text-text-primary",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-[var(--font-size-sm)] text-text-secondary leading-[var(--line-height-normal)]",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "px-[var(--spacing-lg)] pb-[var(--spacing-lg)]",
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-[var(--spacing-md)] px-[var(--spacing-lg)] pb-[var(--spacing-lg)]",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }