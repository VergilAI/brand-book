import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, Eye, Star, Shield } from "lucide-react"

export default function BrandOverview() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="iris-pattern absolute inset-0 -z-10 opacity-30" />
        <div className="relative">
          <h1 className="text-display-lg font-bold mb-6">
            <span className="gradient-text">Vergil Brand Book</span>
          </h1>
          <p className="text-body-lg text-stone-gray mb-8 max-w-2xl">
            The comprehensive guide to Vergil's brand identity, visual language, and design principles. 
            Building the infrastructure for living, breathing AI systems that democratize intelligence itself.
          </p>
          <div className="flex gap-4">
            <Link href="/brand/foundation">
              <Button size="lg" className="gap-2">
                Explore Foundation <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/visual/colors">
              <Button size="lg" variant="outline" className="gap-2">
                Visual Identity
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Brand Essence */}
      <Card className="mb-12 brand-card">
        <CardHeader className="text-center">
          <CardTitle className="text-h1 gradient-text mb-4">
            "Intelligence, Orchestrated"
          </CardTitle>
          <CardDescription className="text-body-lg">
            Vergil breathes life into AI systems, transforming static automation into living intelligence 
            that remembers, learns, and evolves.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Core Values Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card className="brand-card breathing">
          <CardHeader>
            <Heart className="h-8 w-8 text-neural-pink mb-2" />
            <CardTitle>Accessible Complexity</CardTitle>
            <CardDescription>
              Powerful tools that feel simple. We make the most sophisticated AI infrastructure 
              approachable for every developer.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="brand-card breathing" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <Eye className="h-8 w-8 text-cosmic-purple mb-2" />
            <CardTitle>Living Intelligence</CardTitle>
            <CardDescription>
              Systems that grow and evolve. Unlike static automation, Vergil creates truly 
              intelligent systems that learn from every interaction.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="brand-card breathing" style={{ animationDelay: '1s' }}>
          <CardHeader>
            <Shield className="h-8 w-8 text-phosphor-cyan mb-2" />
            <CardTitle>Ethical Innovation</CardTitle>
            <CardDescription>
              Responsible AI development. We pioneer the future while maintaining the highest 
              standards of ethical AI practices.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="brand-card breathing" style={{ animationDelay: '1.5s' }}>
          <CardHeader>
            <Star className="h-8 w-8 text-electric-violet mb-2" />
            <CardTitle>Collaborative Growth</CardTitle>
            <CardDescription>
              Building together with our community. Innovation happens when brilliant minds 
              work together toward a common vision.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/brand/foundation">
          <Card className="brand-card h-full transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="text-cosmic-purple">Brand Foundation</CardTitle>
              <CardDescription>
                Mission, vision, and core brand personality traits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-cosmic-purple font-medium">
                Explore foundation →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/visual/philosophy">
          <Card className="brand-card h-full transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="text-electric-violet">Visual Identity</CardTitle>
              <CardDescription>
                Colors, typography, logo guidelines, and design principles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-electric-violet font-medium">
                View visual system →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/elements/iris">
          <Card className="brand-card h-full transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="text-synaptic-blue">Design Elements</CardTitle>
              <CardDescription>
                Iris patterns, neural networks, and interactive components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-synaptic-blue font-medium">
                Explore elements →
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}