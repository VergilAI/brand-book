import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface ProblemCardProps {
  icon: LucideIcon
  title: string
  subtitle: string
  points: string[]
  result: string
  variant?: "default" | "destructive"
  animate?: boolean
  delay?: number
}

export function ProblemCard({
  icon: Icon,
  title,
  subtitle,
  points,
  result,
  variant = "default",
  animate = true,
  delay = 0
}: ProblemCardProps) {
  return (
    <Card 
      className={cn(
        "h-full",
        variant === "destructive" && "border-destructive/20",
        animate && "breathing hover:shadow-xl transition-all duration-300"
      )}
      style={animate ? { animationDelay: `${delay}s` } : undefined}
    >
      <CardHeader>
        <div className="mb-4">
          <div className={cn(
            "inline-flex p-3 rounded-lg",
            variant === "destructive" ? "bg-destructive/10" : "bg-muted"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              variant === "destructive" ? "text-destructive" : "text-muted-foreground"
            )} />
          </div>
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base font-medium">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {points.map((point, index) => (
            <li key={index} className="flex items-start text-sm text-muted-foreground">
              <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>
        <div className="pt-4 border-t">
          <p className="text-sm font-medium text-muted-foreground">
            <span className="text-destructive">Result:</span> {result}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}