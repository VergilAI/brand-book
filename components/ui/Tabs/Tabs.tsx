"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tabsListVariants = cva(
  "inline-flex items-center justify-center p-[var(--spacing-xs)]",
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--bg-emphasis)]",
          "rounded-[var(--radius-md)]",
          "gap-[var(--spacing-xs)]",
        ],
        pills: [
          "bg-transparent",
          "gap-[var(--spacing-sm)]",
        ],
        underline: [
          "bg-transparent",
          "border-b",
          "border-[var(--border-subtle)]",
          "p-0",
          "gap-[var(--spacing-md)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-[var(--font-primary)]",
    "text-[var(--font-size-sm)]",
    "font-[var(--font-weight-medium)]",
    "transition-all duration-[var(--duration-normal)]",
    "outline-none",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "gap-[var(--spacing-sm)]",
    "relative",
    "whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        default: [
          "px-[var(--spacing-md)] py-[var(--spacing-sm)]",
          "rounded-[var(--radius-sm)]",
          "text-[var(--text-secondary)]",
          "hover:text-[var(--text-primary)]",
          "data-[state=active]:bg-[var(--bg-primary)]",
          "data-[state=active]:text-[var(--text-primary)]",
          "data-[state=active]:shadow-[var(--shadow-card)]",
          "hover:bg-[var(--bg-primary)]/50",
        ],
        pills: [
          "px-[var(--spacing-lg)] py-[var(--spacing-sm)]",
          "rounded-[var(--radius-2xl)]",
          "text-[var(--text-secondary)]",
          "hover:text-[var(--text-primary)]",
          "hover:bg-[var(--bg-emphasis)]",
          "data-[state=active]:bg-[var(--bg-brand)]",
          "data-[state=active]:text-[var(--text-inverse)]",
          "data-[state=active]:shadow-[var(--shadow-brand-md)]",
        ],
        underline: [
          "px-[var(--spacing-sm)] pb-[var(--spacing-md)]",
          "text-[var(--text-secondary)]",
          "hover:text-[var(--text-primary)]",
          "data-[state=active]:text-[var(--text-brand)]",
          "after:content-['']",
          "after:absolute",
          "after:bottom-0",
          "after:left-0",
          "after:right-0",
          "after:h-[var(--border-width-medium)]",
          "after:bg-[var(--bg-brand)]",
          "after:scale-x-0",
          "after:transition-transform",
          "after:duration-[var(--duration-normal)]",
          "data-[state=active]:after:scale-x-100",
          "hover:after:scale-x-50",
          "hover:after:opacity-50",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Tabs = TabsPrimitive.Root

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  icon?: React.ReactNode
  badge?: React.ReactNode
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, icon, badge, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  >
    {icon && (
      <span className="inline-flex shrink-0 text-[var(--font-size-base)]">
        {icon}
      </span>
    )}
    <span>{children}</span>
    {badge && (
      <span
        className={cn(
          "inline-flex items-center justify-center",
          "min-w-[20px] h-[20px]",
          "px-[var(--spacing-xs)]",
          "text-[var(--font-size-xs)]",
          "font-[var(--font-weight-semibold)]",
          "rounded-[var(--radius-full)]",
          variant === "pills" && "data-[state=active]:bg-[var(--bg-primary)]/20",
          variant === "pills" && "data-[state=active]:text-[var(--text-inverse)]",
          variant !== "pills" && "bg-[var(--bg-brand)]",
          variant !== "pills" && "text-[var(--text-inverse)]",
          "transition-all duration-[var(--duration-normal)]"
        )}
      >
        {badge}
      </span>
    )}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-[var(--spacing-md)]",
      "outline-none",
      "data-[state=active]:animate-in",
      "data-[state=active]:fade-in-0",
      "data-[state=active]:slide-in-from-bottom-2",
      "data-[state=inactive]:animate-out",
      "data-[state=inactive]:fade-out-0",
      "data-[state=inactive]:slide-out-to-bottom-2",
      "transition-all duration-[var(--duration-normal)]",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// Add keyboard navigation styles
const tabsStyles = `
  [data-radix-collection-item][data-state=active] {
    position: relative;
  }
  
  [data-radix-collection-item]:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
  
  /* Smooth transitions between tabs */
  [role="tabpanel"] {
    will-change: opacity, transform;
  }
`

// Inject styles
if (typeof window !== "undefined") {
  const styleId = "vergil-tabs-styles"
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style")
    style.id = styleId
    style.innerHTML = tabsStyles
    document.head.appendChild(style)
  }
}

export { Tabs, TabsList, TabsTrigger, TabsContent }