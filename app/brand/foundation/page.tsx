import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Target, Compass, Users } from "lucide-react"

export default function BrandFoundation() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display-md font-bold mb-4">
          Brand <span className="gradient-text">Foundation</span>
        </h1>
        <p className="text-body-lg text-stone-gray max-w-2xl">
          The core principles, mission, and vision that guide everything we build at Vergil.
        </p>
      </div>

      {/* Mission */}
      <Card className="mb-8 brand-card">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-8 w-8 text-cosmic-purple" />
            <CardTitle className="text-h2">Mission</CardTitle>
          </div>
          <div className="consciousness-gradient p-6 rounded-lg">
            <p className="text-h3 font-medium text-white text-center">
              Build the infrastructure for living, breathing AI systems that democratize intelligence itself.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Vision */}
      <Card className="mb-8 brand-card">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Compass className="h-8 w-8 text-electric-violet" />
            <CardTitle className="text-h2">Vision</CardTitle>
          </div>
          <div className="awakening-gradient p-6 rounded-lg">
            <p className="text-h3 font-medium text-white text-center">
              A world where every organization has a nervous system - where AI doesn't just automate but truly understands and evolves.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Brand Essence */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-8 w-8 text-phosphor-cyan" />
            <CardTitle className="text-h2">Brand Essence</CardTitle>
          </div>
          <CardDescription className="text-body-lg mb-6">
            Our brand essence captures the transformational moment when static systems come alive.
          </CardDescription>
          <div className="light-ray-gradient p-8 rounded-lg border border-cosmic-purple/20">
            <blockquote className="text-center">
              <p className="text-display-md font-bold gradient-text mb-4">
                "Intelligence, Orchestrated"
              </p>
              <p className="text-body-lg text-stone-gray">
                Vergil breathes life into AI systems, transforming static automation into living intelligence 
                that remembers, learns, and evolves.
              </p>
            </blockquote>
          </div>
        </CardHeader>
      </Card>

      {/* Brand Personality */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Brand Personality</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="brand-card breathing">
            <CardHeader>
              <CardTitle className="text-cosmic-purple">Wise</CardTitle>
              <CardDescription>
                Like our namesake poet guiding through complexity. We possess deep knowledge 
                and share it with thoughtful guidance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="brand-card breathing" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-electric-violet">Approachable</CardTitle>
              <CardDescription>
                Making the complex feel simple. Advanced technology should be accessible 
                to everyone, not just experts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="brand-card breathing" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-luminous-indigo">Innovative</CardTitle>
              <CardDescription>
                Pioneering the future of AI infrastructure. We're not just building tools, 
                we're defining what's possible.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="brand-card breathing" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="text-phosphor-cyan">Trustworthy</CardTitle>
              <CardDescription>
                Reliable, ethical, and transparent. Trust is the foundation of any 
                intelligent system worth building.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="brand-card breathing" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="text-synaptic-blue">Alive</CardTitle>
              <CardDescription>
                Dynamic, evolving, breathing. Our systems and our brand embody the 
                living nature of true intelligence.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="brand-card breathing" style={{ animationDelay: '1s' }}>
            <CardHeader>
              <CardTitle className="text-neural-pink">Collaborative</CardTitle>
              <CardDescription>
                Building together with our community. The best intelligence emerges 
                from collective wisdom and shared purpose.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Core Values */}
      <div>
        <h2 className="text-h2 font-bold mb-6">Core Values</h2>
        <div className="space-y-6">
          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-cosmic-purple">Accessible Complexity</CardTitle>
              <CardDescription className="text-body-lg">
                Powerful tools that feel simple. We believe that the most sophisticated technology 
                should be the most intuitive to use. Complexity should live in the implementation, 
                not the interface.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-electric-violet">Living Intelligence</CardTitle>
              <CardDescription className="text-body-lg">
                Systems that grow and evolve. We don't build static automation—we create truly 
                intelligent systems that remember every interaction, learn from every experience, 
                and continuously improve.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-phosphor-cyan">Ethical Innovation</CardTitle>
              <CardDescription className="text-body-lg">
                Responsible AI development. Innovation without ethics is not innovation—it's 
                recklessness. We pioneer the future while maintaining the highest standards 
                of responsible AI development.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-synaptic-blue">Collaborative Growth</CardTitle>
              <CardDescription className="text-body-lg">
                Building together with our community. The most intelligent systems emerge from 
                collective wisdom. We grow stronger by growing together, sharing knowledge, 
                and building on each other's innovations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}