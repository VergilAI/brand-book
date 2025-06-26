import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface FeatureCardProps {
  icon?: LucideIcon
  iconColor?: string
  title: string
  description: string
  href?: string
  variant?: "default" | "gradient" | "outlined"
  animate?: boolean
  delay?: number
}

export function FeatureCard({
  icon: Icon,
  iconColor = "text-cosmic-purple",
  title,
  description,
  href,
  variant = "default",
  animate = true,
  delay = 0
}: FeatureCardProps) {
  const cardContent = (
    <>
      <CardHeader>
        {Icon && (
          <div className="mb-4">
            <div className={cn(
              "inline-flex p-3 rounded-lg",
              variant === "gradient" ? "consciousness-gradient" : "bg-muted"
            )}>
              <Icon className={cn("h-6 w-6", variant === "gradient" ? "text-white" : iconColor)} />
            </div>
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
        {href && (
          <div className="mt-4 flex items-center text-sm font-medium text-primary">
            Learn more
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        )}
      </CardContent>
    </>
  )

  const cardClasses = cn(
    "h-full transition-all duration-300",
    variant === "outlined" && "border-2",
    animate && "breathing hover:shadow-xl hover:-translate-y-1",
    href && "cursor-pointer"
  )

  const animationStyle = animate ? { animationDelay: `${delay}s` } : undefined

  if (href) {
    return (
      <Link href={href} className="block h-full">
        <Card className={cardClasses} style={animationStyle}>
          {cardContent}
        </Card>
      </Link>
    )
  }

  return (
    <Card className={cardClasses} style={animationStyle}>
      {cardContent}
    </Card>
  )
}