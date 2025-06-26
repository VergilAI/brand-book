import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ComponentsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Component Library</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive documentation of Vergil's design system components, 
            from basic UI elements to complex landing page patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core UI Components */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Core UI Components
                <Badge variant="outline">Basic</Badge>
              </CardTitle>
              <CardDescription>
                Fundamental building blocks using shadcn/ui with Vergil brand integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/components/button" className="block text-cosmic-purple hover:underline">
                  Button System
                </Link>
                <Link href="/components/card" className="block text-cosmic-purple hover:underline">
                  Card Variants
                </Link>
                <Link href="/components/input" className="block text-cosmic-purple hover:underline">
                  Form Components
                </Link>
                <Link href="/components/navigation" className="block text-cosmic-purple hover:underline">
                  Navigation Elements
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Vergil Brand Components */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Vergil Brand Components
                <Badge variant="outline">Brand</Badge>
              </CardTitle>
              <CardDescription>
                Unique components that express Vergil's living intelligence philosophy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/elements/iris" className="block text-cosmic-purple hover:underline">
                  Iris Pattern
                </Link>
                <Link href="/components/neural-network" className="block text-cosmic-purple hover:underline">
                  Neural Network
                </Link>
                <Link href="/components/logo" className="block text-cosmic-purple hover:underline">
                  Logo Components
                </Link>
                <Link href="/components/breathing" className="block text-cosmic-purple hover:underline">
                  Breathing Elements
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Landing Page Components */}
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-cosmic-purple/5 to-electric-violet/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Landing Page Components
                <Badge>New</Badge>
              </CardTitle>
              <CardDescription>
                Sophisticated landing page modules and section patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/components/landing/hero-patterns" className="block text-cosmic-purple hover:underline">
                  Hero Pattern Library
                </Link>
                <Link href="/components/landing/section-system" className="block text-cosmic-purple hover:underline">
                  Section Component System
                </Link>
                <Link href="/components/landing/interactive" className="block text-cosmic-purple hover:underline">
                  Interactive Components
                </Link>
                <Link href="/components/landing/layouts" className="block text-cosmic-purple hover:underline">
                  Advanced Layouts
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Animation & Motion */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Animation Patterns
                <Badge variant="outline">Motion</Badge>
              </CardTitle>
              <CardDescription>
                Living design animations and interaction patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/motion/breathing" className="block text-cosmic-purple hover:underline">
                  Breathing Effects
                </Link>
                <Link href="/components/animations/sequential" className="block text-cosmic-purple hover:underline">
                  Sequential Animations
                </Link>
                <Link href="/components/animations/hover-effects" className="block text-cosmic-purple hover:underline">
                  Hover & Transform Effects
                </Link>
                <Link href="/components/animations/storytelling" className="block text-cosmic-purple hover:underline">
                  Visual Storytelling
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Data Visualization */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Data Visualization
                <Badge variant="outline">Charts</Badge>
              </CardTitle>
              <CardDescription>
                Interactive data displays and business intelligence patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/elements/heatmap" className="block text-cosmic-purple hover:underline">
                  Radial Heatmaps
                </Link>
                <Link href="/components/data/roi-calculator" className="block text-cosmic-purple hover:underline">
                  ROI Calculator
                </Link>
                <Link href="/components/data/metrics" className="block text-cosmic-purple hover:underline">
                  Metric Displays
                </Link>
                <Link href="/components/data/progress" className="block text-cosmic-purple hover:underline">
                  Progress Tracking
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Trust & Social Proof */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Trust & Social Proof
                <Badge variant="outline">Conversion</Badge>
              </CardTitle>
              <CardDescription>
                Patterns that build credibility and drive conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/components/trust/testimonials" className="block text-cosmic-purple hover:underline">
                  Testimonial Layouts
                </Link>
                <Link href="/components/trust/compliance" className="block text-cosmic-purple hover:underline">
                  Compliance Badges
                </Link>
                <Link href="/components/trust/social-proof" className="block text-cosmic-purple hover:underline">
                  Social Proof Displays
                </Link>
                <Link href="/components/trust/authority" className="block text-cosmic-purple hover:underline">
                  Authority Indicators
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Component Development Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-cosmic-purple">Design Principles</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Living intelligence philosophy</li>
                <li>• Accessibility-first approach</li>
                <li>• Brand consistency</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-cosmic-purple">Technical Standards</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• TypeScript with full type safety</li>
                <li>• shadcn/ui primitive foundation</li>
                <li>• Tailwind v4 with @theme tokens</li>
                <li>• Framer Motion for animations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}