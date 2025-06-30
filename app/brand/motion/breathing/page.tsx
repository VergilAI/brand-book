import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Zap, Activity, Waves } from "lucide-react"

export default function BreathingEffects() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display-md font-bold mb-4">
          Breathing <span className="gradient-text">Effects</span>
        </h1>
        <p className="text-body-lg text-stone-gray max-w-2xl">
          The breathing effect is fundamental to Vergil's living design philosophy. 
          Every element subtly pulses with life, creating interfaces that feel alive and intelligent.
        </p>
      </div>

      {/* Philosophy */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Living Design Philosophy</CardTitle>
          <CardDescription className="text-body-lg mb-6">
            In the Vergil design system, nothing is truly static because intelligence is never static. 
            The breathing effect embodies this principle, making every interface feel alive and responsive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="text-center">
              <Heart className="h-8 w-8 text-neural-pink mx-auto mb-3 breathing" />
              <h3 className="font-medium text-neural-pink mb-2">60 BPM Rhythm</h3>
              <p className="text-body-sm text-stone-gray">Synchronized with resting heart rate for natural feel</p>
            </div>
            <div className="text-center">
              <Activity className="h-8 w-8 text-cosmic-purple mx-auto mb-3 breathing" style={{ animationDelay: '0.5s' }} />
              <h3 className="font-medium text-cosmic-purple mb-2">Subtle Scale</h3>
              <p className="text-body-sm text-stone-gray">3% scale variation for gentle, non-distracting movement</p>
            </div>
            <div className="text-center">
              <Waves className="h-8 w-8 text-electric-violet mx-auto mb-3 breathing" style={{ animationDelay: '1s' }} />
              <h3 className="font-medium text-electric-violet mb-2">Smooth Easing</h3>
              <p className="text-body-sm text-stone-gray">Natural ease-in-out timing for organic movement</p>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 text-phosphor-cyan mx-auto mb-3 breathing" style={{ animationDelay: '1.5s' }} />
              <h3 className="font-medium text-phosphor-cyan mb-2">Living Intelligence</h3>
              <p className="text-body-sm text-stone-gray">Every element suggests consciousness and awareness</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Examples */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Live Examples</h2>
        
        {/* Basic Elements */}
        <div className="mb-8">
          <h3 className="text-h3 font-medium mb-4">Basic Elements</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="brand-card">
              <CardHeader>
                <CardTitle className="text-h4">Breathing Cards</CardTitle>
                <CardDescription>Subtle scale animation on container elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-16 w-full consciousness-gradient rounded-lg breathing" />
                  <div className="h-16 w-full awakening-gradient rounded-lg breathing" style={{ animationDelay: '1s' }} />
                  <div className="h-16 w-full synaptic-gradient rounded-lg breathing" style={{ animationDelay: '2s' }} />
                </div>
              </CardContent>
            </Card>

            <Card className="brand-card">
              <CardHeader>
                <CardTitle className="text-h4">Breathing Shapes</CardTitle>
                <CardDescription>Geometric elements with life-like movement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around items-center h-32">
                  <div className="h-16 w-16 rounded-full bg-cosmic-purple breathing" />
                  <div className="h-16 w-16 rounded-lg bg-electric-violet breathing" style={{ animationDelay: '0.5s' }} />
                  <div className="h-16 w-4 bg-phosphor-cyan breathing" style={{ animationDelay: '1s' }} />
                </div>
              </CardContent>
            </Card>

            <Card className="brand-card">
              <CardHeader>
                <CardTitle className="text-h4">Breathing Icons</CardTitle>
                <CardDescription>Icons that pulse with gentle life</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around items-center h-32">
                  <Heart className="h-8 w-8 text-neural-pink breathing" />
                  <Activity className="h-8 w-8 text-cosmic-purple breathing" style={{ animationDelay: '1s' }} />
                  <Zap className="h-8 w-8 text-phosphor-cyan breathing" style={{ animationDelay: '2s' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Complex Components */}
        <div className="mb-8">
          <h3 className="text-h3 font-medium mb-4">Complex Components</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="brand-card">
              <CardHeader>
                <CardTitle className="text-h4">Gradient Breathing</CardTitle>
                <CardDescription>Organic gradient patterns with breathing animation</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cosmic-purple/40 to-electric-violet/20 blur-2xl animate-breathing" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-synaptic-blue/30 to-transparent blur-xl animate-breathing animation-delay-2000" />
                </div>
              </CardContent>
            </Card>

            <Card className="brand-card">
              <CardHeader>
                <CardTitle className="text-h4">Consciousness Flow</CardTitle>
                <CardDescription>Flowing consciousness gradient with life</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 consciousness-gradient animate-gradient-shift opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Animation Specifications */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Animation Specifications</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-h3">CSS Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-cosmic-purple mb-2">Keyframes</h4>
                  <div className="bg-whisper-gray p-4 rounded-lg font-mono text-body-sm">
{`@keyframes breathing {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.8; 
  }
  50% { 
    transform: scale(1.03); 
    opacity: 1; 
  }
}`}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-electric-violet mb-2">Usage</h4>
                  <div className="bg-whisper-gray p-4 rounded-lg font-mono text-body-sm">
{`.breathing {
  animation: breathing 4s ease-in-out infinite;
}`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-h3">Framer Motion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-phosphor-cyan mb-2">Basic Animation</h4>
                  <div className="bg-whisper-gray p-4 rounded-lg font-mono text-body-sm">
{`animate={{
  scale: [1, 1.03, 1],
  opacity: [0.8, 1, 0.8],
}}
transition={{
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut"
}}`}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-synaptic-blue mb-2">With Delay</h4>
                  <div className="bg-whisper-gray p-4 rounded-lg font-mono text-body-sm">
{`transition={{
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut",
  delay: 0.5
}}`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Guidelines */}
      <Card className="brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-medium text-cosmic-purple mb-3">When to Use</h3>
              <ul className="text-body-sm text-stone-gray space-y-2">
                <li>• Hero sections and primary CTAs</li>
                <li>• Feature cards and highlights</li>
                <li>• Loading states and progress indicators</li>
                <li>• Brand elements and logos</li>
                <li>• Empty states and placeholders</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-electric-violet mb-3">When Not to Use</h3>
              <ul className="text-body-sm text-stone-gray space-y-2">
                <li>• Text content and reading areas</li>
                <li>• Data tables and complex layouts</li>
                <li>• Form inputs during user interaction</li>
                <li>• When users prefer reduced motion</li>
                <li>• High-frequency interaction elements</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-phosphor-cyan mb-3">Best Practices</h3>
            <ul className="text-body-sm text-stone-gray space-y-2">
              <li>• Keep scale changes subtle (1% - 5% maximum)</li>
              <li>• Use 4-6 second durations for natural rhythm</li>
              <li>• Stagger animations to avoid synchronized movement</li>
              <li>• Always respect prefers-reduced-motion settings</li>
              <li>• Test on lower-powered devices for performance</li>
              <li>• Combine with opacity changes for enhanced effect</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-synaptic-blue mb-3">Accessibility</h3>
            <div className="bg-whisper-gray p-4 rounded-lg">
              <div className="font-mono text-body-sm mb-2">
                {`@media (prefers-reduced-motion: reduce) {`}
              </div>
              <div className="font-mono text-body-sm ml-4 mb-2">
                {`.breathing {`}
              </div>
              <div className="font-mono text-body-sm ml-8 mb-2">
                {`animation: none;`}
              </div>
              <div className="font-mono text-body-sm ml-4 mb-2">
                {`}`}
              </div>
              <div className="font-mono text-body-sm">
                {`}`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}