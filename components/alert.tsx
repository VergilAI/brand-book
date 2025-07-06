import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Info
} from "lucide-react"
import { CloseButton } from "@/components/atomic/close-button"

const alertVariants = cva(
  [
    "relative w-full rounded-[var(--radius-lg)] p-[var(--spacing-md)]",
    "border-[var(--border-width-thin)] backdrop-blur-sm",
    "transition-all duration-[var(--duration-normal)] ease-[var(--ease-natural)]",
    "animate-in fade-in-0 slide-in-from-top-1",
    "[&>svg]:absolute [&>svg]:left-[var(--spacing-md)] [&>svg]:top-[var(--spacing-md)]",
    "[&>svg]:h-5 [&>svg]:w-5 [&>svg]:flex-shrink-0",
    "[&>svg~*]:pl-[calc(var(--spacing-md)+var(--spacing-lg))]",
    "[&_svg]:transition-transform [&_svg]:duration-[var(--duration-normal)]",
    "hover:[&_svg]:scale-110",
    "shadow-[var(--shadow-card)]",
    "hover:shadow-[var(--shadow-card-hover)]",
    "overflow-hidden",
    "before:absolute before:inset-0 before:opacity-0",
    "before:transition-opacity before:duration-[var(--duration-slow)]",
    "hover:before:opacity-100",
  ],
  {
    variants: {
      variant: {
        info: [
          "bg-[var(--bg-infoLight)] text-[var(--text-info)]",
          "border-[var(--border-info)]",
          "[&>svg]:text-[var(--text-info)]",
          "before:bg-gradient-to-r before:from-transparent before:via-[var(--bg-infoLight)] before:to-transparent",
          "hover:border-[var(--color-blue-600)]",
        ],
        success: [
          "bg-[var(--bg-successLight)] text-[var(--text-success)]",
          "border-[var(--border-success)]",
          "[&>svg]:text-[var(--text-success)]",
          "before:bg-gradient-to-r before:from-transparent before:via-[var(--bg-successLight)] before:to-transparent",
          "hover:border-[var(--color-green-600)]",
        ],
        warning: [
          "bg-[var(--bg-warningLight)] text-[var(--color-yellow-700)]",
          "border-[var(--border-warning)]",
          "[&>svg]:text-[var(--color-yellow-700)]",
          "before:bg-gradient-to-r before:from-transparent before:via-[var(--bg-warningLight)] before:to-transparent",
          "hover:border-[var(--color-yellow-600)]",
        ],
        error: [
          "bg-[var(--bg-errorLight)] text-[var(--text-error)]",
          "border-[var(--border-error)]",
          "[&>svg]:text-[var(--text-error)]",
          "before:bg-gradient-to-r before:from-transparent before:via-[var(--bg-errorLight)] before:to-transparent",
          "hover:border-[var(--color-red-500)]",
        ],
      },
      dismissible: {
        true: "pr-[calc(var(--spacing-md)+var(--spacing-xl))]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "info",
      dismissible: false,
    },
  }
)

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
}

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onDismiss?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", dismissible, onDismiss, children, ...props }, ref) => {
    const Icon = iconMap[variant || "info"]
    
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, dismissible }), className)}
        {...props}
      >
        <Icon />
        {children}
        {dismissible && onDismiss && (
          <CloseButton
            onClick={onDismiss}
            className="absolute right-[var(--spacing-sm)] top-[var(--spacing-sm)]"
            aria-label="Dismiss alert"
          />
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-[var(--spacing-xs)] font-[var(--font-primary)]",
      "text-[var(--font-size-base)] font-[var(--font-weight-semibold)]",
      "leading-[var(--line-height-tight)] tracking-[var(--letter-spacing-tight)]",
      "relative z-10",
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-[var(--font-size-sm)] font-[var(--font-weight-normal)]",
      "leading-[var(--line-height-relaxed)]",
      "[&_p]:leading-[var(--line-height-relaxed)]",
      "opacity-90",
      "relative z-10",
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }