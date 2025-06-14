import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, Briefcase, Megaphone } from "lucide-react"

export default function VoiceTone() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display-md font-bold mb-4">
          Voice & <span className="gradient-text">Tone</span>
        </h1>
        <p className="text-body-lg text-stone-gray max-w-2xl">
          How Vergil speaks to the world. Our voice remains consistent while our tone adapts 
          to context, audience, and purpose.
        </p>
      </div>

      {/* Brand Voice Attributes */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Brand Voice Attributes</CardTitle>
          <CardDescription className="text-body-lg">
            Our voice is the consistent personality that shines through all our communications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-cosmic-purple mb-2">Wise but Approachable</h3>
              <p className="text-body-sm text-stone-gray mb-4">
                Expert knowledge delivered simply. We share deep understanding without intimidation.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-electric-violet mb-2">Inspiring yet Grounded</h3>
              <p className="text-body-sm text-stone-gray mb-4">
                Visionary without being unrealistic. We paint pictures of the future rooted in today's possibilities.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-phosphor-cyan mb-2">Technical yet Human</h3>
              <p className="text-body-sm text-stone-gray mb-4">
                Precision with warmth. Complex concepts explained with empathy and understanding.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-synaptic-blue mb-2">Confident but Humble</h3>
              <p className="text-body-sm text-stone-gray mb-4">
                Authority without arrogance. We know our expertise but acknowledge there's always more to learn.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tone Variations */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Tone Variations</h2>
        <div className="grid gap-6">
          <Card className="brand-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-cosmic-purple" />
                <CardTitle className="text-cosmic-purple">For Developers</CardTitle>
              </div>
              <CardDescription className="text-body-lg mb-4">
                More technical precision, code examples, and peer-to-peer expertise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-whisper-gray p-4 rounded-lg">
                <p className="text-body-sm font-medium mb-2">Example:</p>
                <p className="text-body-sm text-stone-gray italic">
                  "Vergil's state management system automatically persists conversation context 
                  across sessions, eliminating the need for manual state serialization. Check out 
                  our TypeScript examples to see how this works in practice."
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-8 w-8 text-electric-violet" />
                <CardTitle className="text-electric-violet">For Business Leaders</CardTitle>
              </div>
              <CardDescription className="text-body-lg mb-4">
                Focus on outcomes and ROI, strategic rather than tactical, transformation narratives.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-whisper-gray p-4 rounded-lg">
                <p className="text-body-sm font-medium mb-2">Example:</p>
                <p className="text-body-sm text-stone-gray italic">
                  "Organizations using Vergil report 40% faster time-to-market for AI initiatives. 
                  By providing the infrastructure layer, your teams can focus on building unique 
                  value instead of reinventing the wheel."
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Megaphone className="h-8 w-8 text-phosphor-cyan" />
                <CardTitle className="text-phosphor-cyan">For Marketing</CardTitle>
              </div>
              <CardDescription className="text-body-lg mb-4">
                Inspirational and visionary, metaphorical and evocative, future-focused.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-whisper-gray p-4 rounded-lg">
                <p className="text-body-sm font-medium mb-2">Example:</p>
                <p className="text-body-sm text-stone-gray italic">
                  "Imagine AI that doesn't just process—it remembers, learns, and grows. 
                  Vergil transforms your organization into a living intelligence that evolves 
                  with every interaction."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Writing Principles */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Writing Principles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="brand-card">
            <CardContent className="p-6">
              <h3 className="font-medium text-cosmic-purple mb-2">✓ Start with the user's need</h3>
              <p className="text-body-sm text-stone-gray">Not our technology. Always lead with what the user wants to accomplish.</p>
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardContent className="p-6">
              <h3 className="font-medium text-electric-violet mb-2">✓ Use active voice and present tense</h3>
              <p className="text-body-sm text-stone-gray">Make writing direct and immediate. "Vergil creates" not "is created by."</p>
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardContent className="p-6">
              <h3 className="font-medium text-phosphor-cyan mb-2">✓ Be specific rather than vague</h3>
              <p className="text-body-sm text-stone-gray">Concrete details beat abstract concepts. Numbers, examples, specifics.</p>
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardContent className="p-6">
              <h3 className="font-medium text-synaptic-blue mb-2">✓ Show, don't just tell</h3>
              <p className="text-body-sm text-stone-gray">Use examples, demos, and concrete use cases to illustrate points.</p>
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardContent className="p-6">
              <h3 className="font-medium text-neural-pink mb-2">✓ Keep it conversational but professional</h3>
              <p className="text-body-sm text-stone-gray">Warm and human while maintaining expertise and authority.</p>
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardContent className="p-6">
              <h3 className="font-medium text-luminous-indigo mb-2">✓ End with clear next steps</h3>
              <p className="text-body-sm text-stone-gray">Always guide users toward their next action or decision.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Messages */}
      <Card className="brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Key Messages</CardTitle>
          <CardDescription className="text-body-lg">
            Core phrases and concepts that should appear consistently across our communications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-cosmic-purple mb-3">Primary Messages</h3>
              <ul className="space-y-2 text-body-sm text-stone-gray">
                <li>• "Breathe life into AI"</li>
                <li>• "From automation to intelligence"</li>
                <li>• "Intelligence, orchestrated"</li>
                <li>• "Build living systems"</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-electric-violet mb-3">Supporting Messages</h3>
              <ul className="space-y-2 text-body-sm text-stone-gray">
                <li>• "The nervous system for your organization"</li>
                <li>• "AI that remembers, learns, and evolves"</li>
                <li>• "Transform static automation"</li>
                <li>• "Democratize intelligence itself"</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 consciousness-gradient rounded-lg text-white text-center">
            <blockquote>
              <p className="text-h3 font-bold mb-2">"Intelligence, Orchestrated"</p>
              <p className="text-body-md opacity-90">
                Our brand promise encapsulates everything we do—bringing order, 
                harmony, and purpose to the complexity of AI systems.
              </p>
            </blockquote>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}