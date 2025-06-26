import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VergilLogo } from "@/components/vergil/vergil-logo"
import { IrisPattern } from "@/components/vergil/iris-pattern"
import { BookOpen, Rocket, GraduationCap, Brain, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <IrisPattern variant="cosmic" size="xl" />
      </div>
      
      <div className="relative z-10 max-w-6xl w-full text-center space-y-12">
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
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our ecosystem of living intelligence. From brand guidelines to AI-powered learning platforms.
            </p>
          </div>
        </div>

        {/* Four Module Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Book Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 animate-breathing">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">Brand Book</CardTitle>
              <CardDescription className="text-sm">
                Design system & guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                <li>• Color system</li>
                <li>• Components</li>
                <li>• Typography</li>
                <li>• Motion design</li>
              </ul>
              <Button asChild size="sm" className="w-full group-hover:bg-primary/90">
                <Link href="/brand">
                  <BookOpen className="h-3 w-3 mr-2" />
                  Explore
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Vergil Main Landing Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 animate-breathing">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-cosmic-purple/10 rounded-lg group-hover:bg-cosmic-purple/20 transition-colors">
                  <Brain className="h-8 w-8 text-cosmic-purple" />
                </div>
              </div>
              <CardTitle className="text-xl">Vergil Platform</CardTitle>
              <CardDescription className="text-sm">
                AI infrastructure landing
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                <li>• Living AI</li>
                <li>• Neural orchestration</li>
                <li>• Enterprise ready</li>
                <li>• Global scale</li>
              </ul>
              <Button asChild size="sm" variant="outline" className="w-full group-hover:bg-accent">
                <Link href="/vergil-main">
                  <Brain className="h-3 w-3 mr-2" />
                  View Landing
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Vergil Learn Landing Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 animate-breathing">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-electric-violet/10 rounded-lg group-hover:bg-electric-violet/20 transition-colors">
                  <GraduationCap className="h-8 w-8 text-electric-violet" />
                </div>
              </div>
              <CardTitle className="text-xl">Vergil Learn</CardTitle>
              <CardDescription className="text-sm">
                Educational platform landing
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                <li>• Adaptive learning</li>
                <li>• User journeys</li>
                <li>• Interactive demos</li>
                <li>• Education focus</li>
              </ul>
              <Button asChild size="sm" variant="outline" className="w-full group-hover:bg-accent">
                <Link href="/vergil-learn">
                  <GraduationCap className="h-3 w-3 mr-2" />
                  View Landing
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* LMS Demo Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 animate-breathing">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-synaptic-blue/10 rounded-lg group-hover:bg-synaptic-blue/20 transition-colors">
                  <Rocket className="h-8 w-8 text-synaptic-blue" />
                </div>
              </div>
              <CardTitle className="text-xl">LMS Demo</CardTitle>
              <CardDescription className="text-sm">
                Learning management system
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                <li>• Course management</li>
                <li>• Student dashboard</li>
                <li>• Admin interface</li>
                <li>• Analytics</li>
              </ul>
              <Button asChild size="sm" variant="outline" className="w-full group-hover:bg-accent">
                <Link href="/lms">
                  <Rocket className="h-3 w-3 mr-2" />
                  Explore Demo
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-4 justify-center pt-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/visual/colors">Color System</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/components">Components</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/contact">Contact</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="https://github.com/VergilAI/brand-book" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-sm text-muted-foreground">
          <p>© 2024 Vergil AI. Building living intelligence.</p>
        </div>
      </div>
    </div>
  )
}