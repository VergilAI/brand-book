'use client'

import { Section, FeatureCard, ProblemCard, CTASection } from "@/components/landing"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles, AlertTriangle, Puzzle, Lock } from "lucide-react"
import Link from "next/link"
import { IrisPattern } from "@/components/vergil/iris-pattern"
import { useState } from "react"

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <IrisPattern variant="cosmic" size="xl" />
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-cosmic-purple/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-electric-violet/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-phosphor-cyan/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

        <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Main content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                Breathe Life Into Your <span className="gradient-text">AI Systems</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Build intelligent systems that remember, learn, and evolve. Transform static automation into living intelligence with Vergil&apos;s Anima Engine.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="group min-w-[160px]">
                <Link href="/signup">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="group min-w-[160px]"
                onClick={() => setShowDemo(true)}
              >
                <Play className="mr-2 h-4 w-4" />
                See It Live
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-12 space-y-4">
              <p className="text-sm text-muted-foreground">
                Trusted by 500+ developers building the future
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demo Modal (placeholder) */}
        {showDemo && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg p-8 max-w-2xl w-full">
              <h3 className="text-2xl font-bold mb-4">Interactive Demo</h3>
              <p className="text-muted-foreground mb-6">
                Interactive Anima Engine visualization would go here
              </p>
              <Button onClick={() => setShowDemo(false)}>Close Demo</Button>
            </div>
          </div>
        )}
      </section>

      {/* Problem Statement Section */}
      <Section size="xl" variant="muted">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              The Intelligence Gap
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every company needs AI, but current tools force an impossible choice:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <ProblemCard
              icon={AlertTriangle}
              title="Too Simple"
              subtitle="Automation Without Intelligence"
              points={[
                '"If this, then that" isn\'t enough anymore',
                "No memory between interactions",
                "Can't learn or adapt"
              ]}
              result="Robotic responses that frustrate users"
              variant="destructive"
              delay={0}
            />

            <ProblemCard
              icon={Puzzle}
              title="Too Complex"
              subtitle="Power Without Accessibility"
              points={[
                "Months to implement basic workflows",
                "Requires team of ML engineers",
                "Fragmented tools that don't talk"
              ]}
              result="AI projects that never ship"
              variant="destructive"
              delay={0.2}
            />

            <ProblemCard
              icon={Lock}
              title="Too Static"
              subtitle="Built Once, Stuck Forever"
              points={[
                "Systems that can't evolve",
                "No way to improve over time",
                "Siloed from your real data"
              ]}
              result="Yesterday's solution for tomorrow's problems"
              variant="destructive"
              delay={0.4}
            />
          </div>

          <div className="text-center mt-16">
            <p className="text-2xl font-medium text-muted-foreground">
              There&apos;s a better way to build AI systems.
            </p>
          </div>
        </div>
      </Section>

      {/* Solution Introduction */}
      <Section size="xl">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              The <span className="gradient-text">Anima Engine</span>
            </h2>
            <p className="text-xl text-muted-foreground italic">
              The first runtime designed for living systems
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            <FeatureCard
              icon={Sparkles}
              iconColor="text-cosmic-purple"
              title="Stateful by Design"
              description="Unlike stateless automation, Anima remembers every interaction, building context and relationships over time."
              variant="gradient"
              delay={0}
            />

            <FeatureCard
              icon={Sparkles}
              iconColor="text-electric-violet"
              title="Visual Orchestration"
              description="Design complex AI behaviors by drawing, not coding. See your systems think in real-time."
              variant="gradient"
              delay={0.2}
            />

            <FeatureCard
              icon={Sparkles}
              iconColor="text-phosphor-cyan"
              title="Semantic Understanding"
              description="Bridges human intent and machine action. Your systems understand meaning, not just commands."
              variant="gradient"
              delay={0.4}
            />

            <FeatureCard
              icon={Sparkles}
              iconColor="text-synaptic-blue"
              title="Evolutionary Architecture"
              description="Systems that improve themselves. Every interaction makes them smarter."
              variant="gradient"
              delay={0.6}
            />
          </div>

          {/* Interactive Demo Area Placeholder */}
          <div className="mt-16 p-8 bg-muted/30 rounded-2xl border border-border">
            <p className="text-center text-muted-foreground">
              [Live visualization of nodes connecting, pulsing, and exchanging information]
            </p>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <CTASection
        title="Ready to Build Living Intelligence?"
        description="Start building AI systems that think, remember, and evolve. Join hundreds of developers creating the future."
        primaryCTA={{
          text: "Start Building Free",
          href: "/signup"
        }}
        secondaryCTA={{
          text: "Book a Demo",
          href: "/contact"
        }}
        variant="gradient"
        size="lg"
      />
    </div>
  )
}