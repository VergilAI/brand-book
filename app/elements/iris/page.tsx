import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IrisPattern } from "@/components/vergil/iris-pattern"
import { Button } from "@/components/ui/button"
import { Eye, Focus, Lightbulb, Target } from "lucide-react"

export default function IrisPatternPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display-md font-bold mb-4">
          Iris <span className="gradient-text">Pattern</span>
        </h1>
        <p className="text-body-lg text-stone-gray max-w-2xl">
          The iris pattern is our core visual motif, representing the window to consciousness, 
          the moment of focus, and the depth of intelligence that Vergil systems embody.
        </p>
      </div>

      {/* Pattern Philosophy */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Pattern Philosophy</CardTitle>
          <CardDescription className="text-body-lg mb-6">
            The iris represents multiple layers of meaning in our design system:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="text-center">
              <Eye className="h-8 w-8 text-cosmic-purple mx-auto mb-3" />
              <h3 className="font-medium text-cosmic-purple mb-2">Window to Intelligence</h3>
              <p className="text-body-sm text-stone-gray">The iris as the gateway to understanding and perception</p>
            </div>
            <div className="text-center">
              <Focus className="h-8 w-8 text-electric-violet mx-auto mb-3" />
              <h3 className="font-medium text-electric-violet mb-2">Focus & Clarity</h3>
              <p className="text-body-sm text-stone-gray">Precise attention and clear understanding of complex systems</p>
            </div>
            <div className="text-center">
              <Target className="h-8 w-8 text-phosphor-cyan mx-auto mb-3" />
              <h3 className="font-medium text-phosphor-cyan mb-2">Depth & Dimension</h3>
              <p className="text-body-sm text-stone-gray">Multiple layers of intelligence working in harmony</p>
            </div>
            <div className="text-center">
              <Lightbulb className="h-8 w-8 text-synaptic-blue mx-auto mb-3" />
              <h3 className="font-medium text-synaptic-blue mb-2">Moment of Awakening</h3>
              <p className="text-body-sm text-stone-gray">The instant when static systems come alive with intelligence</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <IrisPattern size="xl" variant="default" />
          </div>
        </CardContent>
      </Card>

      {/* Pattern Variants */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Pattern Variants</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="brand-card">
            <CardHeader className="text-center">
              <CardTitle className="text-h4">Default</CardTitle>
              <CardDescription>Balanced multi-color pattern</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <IrisPattern size="lg" variant="default" />
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardHeader className="text-center">
              <CardTitle className="text-h4">Cosmic</CardTitle>
              <CardDescription>Purple-focused variation</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <IrisPattern size="lg" variant="cosmic" />
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardHeader className="text-center">
              <CardTitle className="text-h4">Electric</CardTitle>
              <CardDescription>Violet-emphasized pattern</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <IrisPattern size="lg" variant="electric" />
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardHeader className="text-center">
              <CardTitle className="text-h4">Synaptic</CardTitle>
              <CardDescription>Multi-accent gradient</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <IrisPattern size="lg" variant="synaptic" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Size Variations */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Size Variations</h2>
        <Card className="brand-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-around flex-wrap gap-8">
              <div className="text-center">
                <IrisPattern size="sm" />
                <p className="text-body-sm text-stone-gray mt-2">Small (128px)</p>
              </div>
              <div className="text-center">
                <IrisPattern size="md" />
                <p className="text-body-sm text-stone-gray mt-2">Medium (192px)</p>
              </div>
              <div className="text-center">
                <IrisPattern size="lg" />
                <p className="text-body-sm text-stone-gray mt-2">Large (256px)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Usage Examples</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-h3">Background Element</CardTitle>
              <CardDescription>Subtle pattern for depth and atmosphere</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 bg-whisper-gray rounded-lg overflow-hidden">
                <IrisPattern 
                  size="xl" 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30" 
                />
                <div className="relative z-10 p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-h3 font-bold text-deep-space mb-2">Hero Section</h3>
                    <p className="text-body-md text-stone-gray">Content layered over iris pattern</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-h3">Feature Highlight</CardTitle>
              <CardDescription>Drawing attention to key features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 consciousness-gradient rounded-lg overflow-hidden">
                <IrisPattern 
                  size="lg" 
                  className="absolute top-4 right-4 opacity-60" 
                  variant="electric"
                />
                <div className="p-6 h-full flex items-center">
                  <div>
                    <h3 className="text-h3 font-bold text-white mb-2">AI Intelligence</h3>
                    <p className="text-body-md text-white/90">Living systems that learn and evolve</p>
                    <Button variant="outline" className="mt-4 bg-white/20 border-white/30 text-white hover:bg-white hover:text-cosmic-purple">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Implementation Guidelines */}
      <Card className="brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Implementation Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-cosmic-purple mb-2">When to Use</h3>
            <ul className="text-body-sm text-stone-gray space-y-1 ml-4">
              <li>• Background elements that need subtle depth</li>
              <li>• Hero sections and landing pages</li>
              <li>• Feature highlights and call-to-action areas</li>
              <li>• Loading states and empty states</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-electric-violet mb-2">Animation Guidelines</h3>
            <ul className="text-body-sm text-stone-gray space-y-1 ml-4">
              <li>• Default animation duration: 3-8 seconds per ring</li>
              <li>• Stagger animations by 0.5-1 second delays</li>
              <li>• Use subtle scale variations (0.8-1.2)</li>
              <li>• Respect prefers-reduced-motion settings</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-phosphor-cyan mb-2">Accessibility</h3>
            <ul className="text-body-sm text-stone-gray space-y-1 ml-4">
              <li>• Always provide appropriate ARIA labels</li>
              <li>• Ensure sufficient contrast for overlaid content</li>
              <li>• Test with screen readers and assistive technologies</li>
              <li>• Provide static fallbacks for animation-sensitive users</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-synaptic-blue mb-2">Code Usage</h3>
            <div className="text-body-sm text-stone-gray bg-whisper-gray p-4 rounded-lg font-mono">
              {`<IrisPattern 
  size="lg" 
  variant="cosmic" 
  animated={true}
  className="opacity-30"
/>`}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}