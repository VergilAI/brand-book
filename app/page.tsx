import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VergilLogo } from "@/components/vergil/vergil-logo"
import { IrisPattern } from "@/components/vergil/iris-pattern"
import { BookOpen, Rocket, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <IrisPattern variant="cosmic" size="xl" />
      </div>
      
      <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-6 consciousness-gradient rounded-2xl">
              <VergilLogo variant="logo" size="xl" animated={true} />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Welcome to <span className="gradient-text">Vergil</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your experience: explore our design system documentation or view our marketing landing page.
            </p>
          </div>
        </div>

        {/* Two Paths */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Brand Book Path */}
          <Card className="group hover:shadow-xl transition-all duration-300 animate-breathing">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Brand Book</CardTitle>
              <CardDescription className="text-base">
                Design system documentation, components, and brand guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Design tokens & color system</li>
                <li>• Component library</li>
                <li>• Typography & motion</li>
                <li>• Brand guidelines</li>
              </ul>
              <Button asChild className="w-full group-hover:bg-primary/90">
                <Link href="/brand/foundation">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explore Design System
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Landing Page Path */}
          <Card className="group hover:shadow-xl transition-all duration-300 animate-breathing">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-cosmic-purple/10 rounded-lg">
                  <Rocket className="h-8 w-8 text-cosmic-purple" />
                </div>
              </div>
              <CardTitle className="text-2xl">Landing Page</CardTitle>
              <CardDescription className="text-base">
                Marketing experience showcasing our AI orchestration platform
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li>• Full-screen experience</li>
                <li>• Marketing content</li>
                <li>• Product showcase</li>
                <li>• Call-to-actions</li>
              </ul>
              <Button asChild variant="outline" className="w-full group-hover:bg-accent">
                <Link href="/landing">
                  <Rocket className="h-4 w-4 mr-2" />
                  View Landing Page
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/demo/hero">Component Demos</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/visual/colors">Color System</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/visual/logo">Logo Guidelines</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}