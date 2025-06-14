import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const components = [
  {
    name: "Button",
    description: "Interactive button component with multiple variants and states",
    href: "/components/button",
    status: "Ready"
  },
  {
    name: "Card",
    description: "Flexible container for grouping related content",
    href: "/components/card", 
    status: "Ready"
  },
  {
    name: "Neural Network",
    description: "Animated visualization of neural network connections",
    href: "/components/neural-network",
    status: "Ready"
  }
]

export default function ComponentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Components</h1>
        <p className="text-lg text-muted-foreground mt-2">
          A collection of reusable components built with accessibility and 
          developer experience in mind.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {components.map((component) => (
          <Card key={component.name} variant="interactive" className="group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{component.name}</CardTitle>
                <span className="text-xs px-2 py-1 bg-vergil-purple-500/10 text-vergil-purple-500 rounded-full">
                  {component.status}
                </span>
              </div>
              <CardDescription className="text-sm">
                {component.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={component.href}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between group-hover:bg-accent"
                >
                  View Component
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-lg border border-dashed border-gray-300">
        <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
        <p className="text-muted-foreground mb-4">
          More components are in development. Check back soon for updates.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Input", "Select", "Modal", "Table", "Navigation", "Form"].map((name) => (
            <span 
              key={name}
              className="px-3 py-1 text-sm bg-muted rounded-md text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}