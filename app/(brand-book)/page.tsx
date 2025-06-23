import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NeuralNetwork } from "@/components/vergil/neural-network"
import { IrisPattern } from "@/components/vergil/iris-pattern"
import { VergilLogo } from "@/components/vergil/vergil-logo"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Eye, Palette, Type, Zap, Heart, Shield, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 pt-8">
        <div className="iris-pattern absolute inset-0 opacity-20" />
        <div className="relative">
          <div className="mx-auto max-w-[64rem]">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="mb-4 p-6 bg-gray-900 rounded-xl">
                <VergilLogo 
                  variant="logo" 
                  size="xl" 
                  animated={true}
                />
              </div>
              <h1 className="text-display-lg font-display font-bold">
                <span className="gradient-text">Brand Book</span>
              </h1>
              <p className="max-w-[42rem] text-body-lg text-stone-gray leading-relaxed">
                The comprehensive guide to Vergil's brand identity, visual language, and design principles. 
                Building the infrastructure for living, breathing AI systems that democratize intelligence itself.
              </p>
              <div className="flex gap-4">
                <Link href="/brand">
                  <Button size="lg" className="gap-2 btn-primary">
                    Explore Brand <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/visual/colors">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Visual Identity
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Essence */}
      <section className="pb-16">
        <div className="mx-auto max-w-[64rem]">
          <Card className="brand-card consciousness-gradient text-white text-center">
            <CardHeader className="pb-8">
              <CardTitle className="text-display-md font-display font-bold mb-4">
                "Intelligence, Orchestrated"
              </CardTitle>
              <CardDescription className="text-body-lg text-white/90 max-w-2xl mx-auto">
                Vergil breathes life into AI systems, transforming static automation into living intelligence 
                that remembers, learns, and evolves.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="pb-16">
        <div className="mx-auto max-w-[64rem]">
          <div className="text-center mb-12">
            <h2 className="text-h1 font-bold mb-4">Our Core Values</h2>
            <p className="text-body-lg text-stone-gray max-w-2xl mx-auto">
              The principles that guide everything we build at Vergil
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="brand-card breathing text-center">
              <CardHeader>
                <Heart className="h-8 w-8 text-neural-pink mx-auto mb-3" />
                <CardTitle className="text-neural-pink">Accessible Complexity</CardTitle>
                <CardDescription>
                  Powerful tools that feel simple and intuitive
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="brand-card breathing text-center" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <Eye className="h-8 w-8 text-cosmic-purple mx-auto mb-3" />
                <CardTitle className="text-cosmic-purple">Living Intelligence</CardTitle>
                <CardDescription>
                  Systems that grow, learn, and evolve over time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="brand-card breathing text-center" style={{ animationDelay: '1s' }}>
              <CardHeader>
                <Shield className="h-8 w-8 text-phosphor-cyan mx-auto mb-3" />
                <CardTitle className="text-phosphor-cyan">Ethical Innovation</CardTitle>
                <CardDescription>
                  Responsible AI development and deployment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="brand-card breathing text-center" style={{ animationDelay: '1.5s' }}>
              <CardHeader>
                <Star className="h-8 w-8 text-electric-violet mx-auto mb-3" />
                <CardTitle className="text-electric-violet">Collaborative Growth</CardTitle>
                <CardDescription>
                  Building together with our community
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Sections */}
      <section className="pb-16">
        <div className="mx-auto max-w-[64rem]">
          <div className="text-center mb-12">
            <h2 className="text-h1 font-bold mb-4">Explore the Brand</h2>
            <p className="text-body-lg text-stone-gray max-w-2xl mx-auto">
              Dive deep into the elements that make Vergil unique
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/brand/foundation">
              <Card className="brand-card h-full transition-all hover:scale-105">
                <CardHeader>
                  <Heart className="h-8 w-8 text-cosmic-purple mb-3" />
                  <CardTitle className="text-cosmic-purple">Brand Foundation</CardTitle>
                  <CardDescription>
                    Mission, vision, and core personality traits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-cosmic-purple font-medium">
                    Explore foundation →
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/visual/colors">
              <Card className="brand-card h-full transition-all hover:scale-105">
                <CardHeader>
                  <Palette className="h-8 w-8 text-electric-violet mb-3" />
                  <CardTitle className="text-electric-violet">Visual Identity</CardTitle>
                  <CardDescription>
                    Colors, typography, and visual design principles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-electric-violet font-medium">
                    View color system →
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/elements/iris">
              <Card className="brand-card h-full transition-all hover:scale-105">
                <CardHeader>
                  <Eye className="h-8 w-8 text-phosphor-cyan mb-3" />
                  <CardTitle className="text-phosphor-cyan">Design Elements</CardTitle>
                  <CardDescription>
                    Iris patterns, neural networks, and components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-phosphor-cyan font-medium">
                    Explore elements →
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/motion/breathing">
              <Card className="brand-card h-full transition-all hover:scale-105">
                <CardHeader>
                  <Zap className="h-8 w-8 text-synaptic-blue mb-3" />
                  <CardTitle className="text-synaptic-blue">Motion & Animation</CardTitle>
                  <CardDescription>
                    Breathing effects and living design principles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-synaptic-blue font-medium">
                    See animations →
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/visual/typography">
              <Card className="brand-card h-full transition-all hover:scale-105">
                <CardHeader>
                  <Type className="h-8 w-8 text-neural-pink mb-3" />
                  <CardTitle className="text-neural-pink">Typography</CardTitle>
                  <CardDescription>
                    Font families, scales, and hierarchy system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-neural-pink font-medium">
                    View typography →
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/visual/logo">
              <Card className="brand-card h-full transition-all hover:scale-105">
                <CardHeader>
                  <Star className="h-8 w-8 text-yellow-600 mb-3" />
                  <CardTitle className="text-yellow-600">Logo & Icons</CardTitle>
                  <CardDescription>
                    Logo variations, usage guidelines, and downloads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-yellow-600 font-medium">
                    View logos →
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/guidelines/usage">
              <Card className="brand-card h-full transition-all hover:scale-105">
                <CardHeader>
                  <Shield className="h-8 w-8 text-luminous-indigo mb-3" />
                  <CardTitle className="text-luminous-indigo">Guidelines</CardTitle>
                  <CardDescription>
                    Usage guidelines and brand protection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-luminous-indigo font-medium">
                    Read guidelines →
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Living System Demo */}
      <section className="pb-16">
        <div className="mx-auto max-w-[64rem]">
          <Card className="brand-card overflow-hidden neural-bg">
            <CardHeader className="text-center">
              <CardTitle className="text-h1 font-bold mb-4">A Living Design System</CardTitle>
              <CardDescription className="text-body-lg">
                Every element breathes, pulses, and responds. Experience design that feels alive with intelligence.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="h-64 mb-8">
                <NeuralNetwork />
              </div>
              <div className="flex justify-center gap-8">
                <div className="h-16 w-16 rounded-full bg-cosmic-purple breathing" />
                <div className="h-16 w-16 rounded-full bg-electric-violet breathing" style={{ animationDelay: '0.5s' }} />
                <div className="h-16 w-16 rounded-full bg-phosphor-cyan breathing" style={{ animationDelay: '1s' }} />
                <div className="h-16 w-16 rounded-full bg-synaptic-blue breathing" style={{ animationDelay: '1.5s' }} />
                <div className="h-16 w-16 rounded-full bg-neural-pink breathing" style={{ animationDelay: '2s' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}