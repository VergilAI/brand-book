'use client'

import { HeroSection } from "@/components/landing/hero-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HeroDemoPage() {
  return (
    <div className="space-y-16">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold">Hero Section Component</h1>
        <p className="text-muted-foreground">
          Demonstrating the modular Hero component with different variants and layouts.
          Notice how all components automatically use our centralized Vergil brand tokens.
        </p>
        <Badge variant="secondary" className="gap-2">
          <span className="w-2 h-2 bg-cosmic-purple rounded-full animate-pulse"></span>
          Centralized Design System
        </Badge>
      </div>

      {/* Consciousness Variant - Centered */}
      <Card>
        <CardHeader>
          <CardTitle>Consciousness Variant - Centered Layout</CardTitle>
          <CardDescription>
            Uses consciousness gradient, iris patterns, breathing animations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <HeroSection
            variant="consciousness"
            layout="centered"
            size="lg"
            badge="AI Orchestration Platform"
            title="The Future of Intelligent Systems"
            subtitle="Orchestrate AI with consciousness and precision"
            description="Vergil empowers you to build, deploy, and manage AI systems that think, learn, and evolve. Experience the next generation of artificial intelligence with our consciousness-inspired platform."
            primaryCta="Get Started"
            secondaryCta="Watch Demo"
            onPrimaryClick={() => alert('Primary CTA clicked! This would navigate to signup.')}
            onSecondaryClick={() => alert('Secondary CTA clicked! This would open a demo video.')}
            animated={true}
          />
        </CardContent>
      </Card>

      {/* Neural Variant - Split Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Neural Variant - Split Layout</CardTitle>
          <CardDescription>
            Dark theme with neural network patterns, split layout
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <HeroSection
            variant="neural"
            layout="split"
            size="md"
            badge="Neural Networks"
            title="Think Beyond Traditional AI"
            subtitle="Neural pathways meet consciousness"
            description="Experience AI that doesn't just compute—it understands, adapts, and grows. Our neural architecture creates truly intelligent systems."
            primaryCta="Explore Neural AI"
            secondaryCta="Technical Docs"
            animated={true}
          />
        </CardContent>
      </Card>

      {/* Cosmic Variant - Minimal */}
      <Card>
        <CardHeader>
          <CardTitle>Cosmic Variant - Minimal Layout</CardTitle>
          <CardDescription>
            Cosmic gradients with minimal, clean presentation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <HeroSection
            variant="cosmic"
            layout="minimal"
            size="sm"
            title="Consciousness Meets Technology"
            description="Simple, elegant, powerful. The way AI should be."
            primaryCta="Learn More"
            animated={true}
          />
        </CardContent>
      </Card>

      {/* Default Variant - Custom Content */}
      <Card>
        <CardHeader>
          <CardTitle>Default Variant - Custom Content</CardTitle>
          <CardDescription>
            Clean default styling with custom child components
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <HeroSection
            variant="default"
            layout="centered"
            size="md"
            title="Customizable Hero Sections"
            subtitle="Add any content you need"
            backgroundPattern={false}
          >
            {/* Custom content example */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Badge variant="outline">React</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Framer Motion</Badge>
              <Badge variant="outline">shadcn/ui</Badge>
            </div>
          </HeroSection>
        </CardContent>
      </Card>

      {/* Centralized System Demo */}
      <Card className="border-cosmic-purple">
        <CardHeader>
          <CardTitle className="gradient-text">🎯 Centralized System Benefits</CardTitle>
          <CardDescription>
            This demonstrates the power of our component architecture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Global Updates</h4>
              <p className="text-sm text-muted-foreground">
                Change `cosmic-purple` in globals.css → All heroes update instantly
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Consistent Branding</h4>
              <p className="text-sm text-muted-foreground">
                Every component uses the same Vergil design tokens
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Animation Control</h4>
              <p className="text-sm text-muted-foreground">
                Update breathing animation → All animated elements follow
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Logo Management</h4>
              <p className="text-sm text-muted-foreground">
                Change VergilLogo component → Updates everywhere automatically
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}