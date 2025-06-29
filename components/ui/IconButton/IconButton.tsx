import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-background border border-border hover:bg-accent hover:text-accent-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        solid:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        active: true,
        className: "bg-accent text-accent-foreground border-accent",
      },
      {
        variant: "ghost",
        active: true,
        className: "bg-accent text-accent-foreground",
      },
      {
        variant: "solid",
        active: true,
        className: "bg-primary text-primary-foreground",
      },
      {
        variant: "outline",
        active: true,
        className: "bg-primary text-primary-foreground border-primary",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      active: false,
    },
  }
)

const subscriptVariants = cva(
  "absolute text-[0.625rem] font-medium opacity-50 select-none pointer-events-none",
  {
    variants: {
      position: {
        left: "left-1 bottom-0",
        right: "right-1 bottom-0",
      },
      size: {
        sm: "text-[0.5rem]",
        md: "text-[0.625rem]",
        lg: "text-[0.75rem]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode
  leftSubscript?: string
  rightSubscript?: string
  active?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    active = false,
    icon, 
    leftSubscript, 
    rightSubscript,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size, active, className }))}
        {...props}
      >
        <span className="[&>svg]:size-4 [&>svg]:shrink-0">{icon}</span>
        {leftSubscript && (
          <span 
            className={cn(subscriptVariants({ position: "left", size }))}
            aria-label={`Keyboard shortcut: ${leftSubscript}`}
          >
            {leftSubscript}
          </span>
        )}
        {rightSubscript && (
          <span 
            className={cn(subscriptVariants({ position: "right", size }))}
            aria-label={`Numeric shortcut: ${rightSubscript}`}
          >
            {rightSubscript}
          </span>
        )}
      </button>
    )
  }
)

IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }