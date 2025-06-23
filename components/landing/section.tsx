import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "gradient" | "dark"
  size?: "default" | "lg" | "xl"
  animate?: boolean
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", size = "default", animate = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-background",
      muted: "bg-muted/30",
      gradient: "bg-gradient-to-b from-background via-muted/20 to-background",
      dark: "bg-deep-space text-pure-light"
    }

    const sizes = {
      default: "py-16 md:py-24",
      lg: "py-20 md:py-32", 
      xl: "py-24 md:py-40"
    }

    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          variants[variant],
          sizes[size],
          animate && "animate-fade-in",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {children}
        </div>
      </section>
    )
  }
)

Section.displayName = "Section"