import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Section } from "./section"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface CTASectionProps {
  title: string
  description?: string
  primaryCTA: {
    text: string
    href: string
    variant?: "default" | "secondary" | "outline"
  }
  secondaryCTA?: {
    text: string
    href: string
    variant?: "default" | "secondary" | "outline" | "ghost"
  }
  variant?: "default" | "gradient" | "dark"
  align?: "center" | "left"
  size?: "default" | "lg"
}

export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = "gradient",
  align = "center",
  size = "default"
}: CTASectionProps) {
  const alignmentClasses = {
    center: "text-center items-center",
    left: "text-left items-start"
  }

  const sizeClasses = {
    default: "max-w-3xl",
    lg: "max-w-4xl"
  }

  return (
    <Section variant={variant} size="lg">
      <div className={cn(
        "mx-auto flex flex-col gap-8",
        alignmentClasses[align],
        sizeClasses[size]
      )}>
        <div className="space-y-4">
          <h2 className={cn(
            "font-bold",
            size === "lg" ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl",
            variant === "gradient" && "gradient-text"
          )}>
            {title}
          </h2>
          {description && (
            <p className={cn(
              "text-lg md:text-xl",
              variant === "dark" ? "text-gray-300" : "text-muted-foreground",
              align === "center" ? "mx-auto max-w-2xl" : ""
            )}>
              {description}
            </p>
          )}
        </div>

        <div className={cn(
          "flex flex-col sm:flex-row gap-4",
          align === "center" ? "justify-center" : "justify-start"
        )}>
          <Button
            asChild
            size="lg"
            variant={primaryCTA.variant || "default"}
            className="group"
          >
            <Link href={primaryCTA.href}>
              {primaryCTA.text}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          {secondaryCTA && (
            <Button
              asChild
              size="lg"
              variant={secondaryCTA.variant || "outline"}
            >
              <Link href={secondaryCTA.href}>
                {secondaryCTA.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Section>
  )
}