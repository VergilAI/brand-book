import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function LandingComponentsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Landing Page Components</h1>
          <p className="text-xl text-muted-foreground">
            Sophisticated landing page modules, section patterns, and interactive elements 
            designed to create compelling user experiences and drive conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Hero Patterns */}
          <Card className="border-l-4 border-l-cosmic-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Hero Pattern Library
                <Badge>Essential</Badge>
              </CardTitle>
              <CardDescription>
                Flexible hero section variants with consciousness-inspired layouts and animations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Variants Available</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <code>consciousness</code> - Full-width with gradient backgrounds</li>
                    <li>• <code>neural</code> - Network pattern overlays</li>
                    <li>• <code>cosmic</code> - Space-themed with floating elements</li>
                    <li>• <code>default</code> - Clean, minimal approach</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Layout Options</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <code>centered</code> - Central focus layout</li>
                    <li>• <code>split</code> - Content + visual split</li>
                    <li>• <code>minimal</code> - Typography-focused</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/components/landing/hero-patterns" className="text-cosmic-purple hover:underline">
                  View Hero Pattern Documentation →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Section System */}
          <Card className="border-l-4 border-l-electric-violet">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Section Component System
                <Badge variant="outline">Foundation</Badge>
              </CardTitle>
              <CardDescription>
                Flexible section wrapper with background variants, spacing, and layout options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Background Variants</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <code>default</code> - Transparent</li>
                    <li>• <code>muted</code> - Subtle background</li>
                    <li>• <code>gradient</code> - Brand gradient</li>
                    <li>• <code>dark</code> - Dark theme</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Spacing System</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <code>sm</code> - py-16 md:py-24</li>
                    <li>• <code>md</code> - py-20 md:py-32</li>
                    <li>• <code>lg</code> - py-24 md:py-40</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Responsive container</li>
                    <li>• Pattern overlays</li>
                    <li>• Accessibility support</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/components/landing/section-system" className="text-electric-violet hover:underline">
                  View Section System Documentation →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Components */}
          <Card className="border-l-4 border-l-phosphor-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Interactive Components
                <Badge variant="outline">Advanced</Badge>
              </CardTitle>
              <CardDescription>
                Dynamic elements that engage users and collect data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Available Components</h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm">ROI Calculator</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Interactive input sliders with real-time calculation display
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm">Carousel System</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-advancing testimonials with navigation controls
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm">FAQ Accordion</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Smooth expanding Q&A with controlled disclosure
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Interaction Patterns</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-phosphor-cyan rounded-full"></div>
                      Progressive disclosure
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-phosphor-cyan rounded-full"></div>
                      Real-time feedback
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-phosphor-cyan rounded-full"></div>
                      Smooth state transitions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-phosphor-cyan rounded-full"></div>
                      Touch-friendly controls
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/components/landing/interactive" className="text-phosphor-cyan hover:underline">
                  View Interactive Components Documentation →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Layouts */}
          <Card className="border-l-4 border-l-synaptic-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Advanced Layout Patterns
                <Badge variant="outline">Composition</Badge>
              </CardTitle>
              <CardDescription>
                Complex multi-section layouts and responsive design patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Layout Types</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Alternating content-visual sections</li>
                    <li>• Grid-based testimonial layouts</li>
                    <li>• Split comparison tables</li>
                    <li>• Multi-column pricing tiers</li>
                    <li>• Process flow visualizations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Responsive Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Mobile-first progressive enhancement</li>
                    <li>• Flexible grid systems</li>
                    <li>• Adaptive image handling</li>
                    <li>• Touch-optimized interactions</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/components/landing/layouts" className="text-synaptic-blue hover:underline">
                  View Layout Documentation →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-br from-cosmic-purple/5 to-electric-violet/5 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Landing Page Design Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-cosmic-purple">Living Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Every element breathes with subtle animations, creating an interface that feels 
                intelligent and alive while maintaining professionalism.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-electric-violet">Progressive Engagement</h3>
              <p className="text-sm text-muted-foreground">
                Components are designed to guide users through a journey, from awareness 
                to consideration to action, with appropriate friction and incentives.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-phosphor-cyan">Trust Through Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Social proof, compliance indicators, and authority signals are integrated 
                naturally to build credibility without overwhelming the experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}