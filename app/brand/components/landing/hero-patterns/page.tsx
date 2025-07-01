import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/docs/component-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { HeroSection } from "@/components/landing/hero-section";

export default function HeroPatternsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Hero Pattern Library</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Flexible, variant-based hero sections that establish immediate brand presence 
            and guide users toward key actions. Each pattern is designed to work across 
            different contexts while maintaining Vergil&apos;s living intelligence philosophy.
          </p>
        </div>

        {/* Consciousness Variant */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Consciousness Hero
            <Badge>Primary</Badge>
          </h2>
          
          <ComponentPreview>
            <div className="min-h-[400px] relative">
              <HeroSection 
                variant="consciousness"
                layout="centered"
                size="lg"
                title="Unlock Human Potential with AI"
                subtitle="Transform your organization&apos;s learning capabilities with personalized AI-driven education that adapts to every individual&apos;s unique growth journey."
                primaryCta={{ text: "Start Free Trial", href: "#" }}
                secondaryCta={{ text: "Watch Demo", href: "#" }}
                backgroundPattern={true}
              />
            </div>
          </ComponentPreview>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">When to Use</h3>
              <p className="text-muted-foreground text-sm">
                Perfect for main landing pages, product launches, and high-impact conversion pages. 
                The consciousness gradient creates an immersive, premium feel.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Full-width consciousness gradient background</li>
                <li>Floating iris pattern overlay</li>
                <li>Breathing animation on key elements</li>
                <li>Dual CTA button layout</li>
                <li>Responsive typography scaling</li>
              </ul>
            </div>

            <CodeBlock language="tsx">
{`<HeroSection 
  variant="consciousness"
  layout="centered"
  size="lg"
  title="Unlock Human Potential with AI"
  subtitle="Transform your organization&apos;s learning capabilities..."
  primaryCta={{ text: "Start Free Trial", href: "/signup" }}
  secondaryCta={{ text: "Watch Demo", href: "/demo" }}
  backgroundPattern={true}
/>`}
            </CodeBlock>
          </div>
        </section>

        {/* Neural Variant */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Neural Hero
            <Badge variant="outline">Technical</Badge>
          </h2>
          
          <ComponentPreview>
            <div className="min-h-[400px] relative">
              <HeroSection 
                variant="neural"
                layout="split"
                size="md"
                title="AI That Understands Learning"
                subtitle="Our neural network adapts to individual learning patterns, creating personalized pathways that maximize retention and engagement."
                primaryCta={{ text: "Explore Technology", href: "#" }}
                backgroundPattern={true}
              />
            </div>
          </ComponentPreview>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">When to Use</h3>
              <p className="text-muted-foreground text-sm">
                Ideal for technical audiences, feature pages, and developer-focused content. 
                The neural network pattern reinforces AI/ML messaging.
              </p>
            </div>

            <CodeBlock language="tsx">
{`<HeroSection 
  variant="neural"
  layout="split"
  size="md"
  title="AI That Understands Learning"
  subtitle="Our neural network adapts to individual learning patterns..."
  primaryCta={{ text: "Explore Technology", href: "/tech" }}
  backgroundPattern={true}
/>`}
            </CodeBlock>
          </div>
        </section>

        {/* Cosmic Variant */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Cosmic Hero
            <Badge variant="outline">Aspirational</Badge>
          </h2>
          
          <ComponentPreview>
            <div className="min-h-[400px] relative">
              <HeroSection 
                variant="cosmic"
                layout="centered"
                size="xl"
                title="The Future of Learning is Here"
                subtitle="Step into a new era of education where AI and human intelligence converge to create unprecedented learning experiences."
                primaryCta={{ text: "Join the Future", href: "#" }}
                secondaryCta={{ text: "Learn More", href: "#" }}
                backgroundPattern={true}
              />
            </div>
          </ComponentPreview>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">When to Use</h3>
              <p className="text-muted-foreground text-sm">
                Perfect for vision-driven messaging, company announcements, and inspirational content. 
                Creates a sense of possibility and innovation.
              </p>
            </div>

            <CodeBlock language="tsx">
{`<HeroSection 
  variant="cosmic"
  layout="centered"
  size="xl"
  title="The Future of Learning is Here"
  subtitle="Step into a new era of education..."
  primaryCta={{ text: "Join the Future", href: "/signup" }}
  secondaryCta={{ text: "Learn More", href: "/about" }}
  backgroundPattern={true}
/>`}
            </CodeBlock>
          </div>
        </section>

        {/* Default/Minimal Variant */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Default Hero
            <Badge variant="outline">Minimal</Badge>
          </h2>
          
          <ComponentPreview>
            <div className="min-h-[300px] relative">
              <HeroSection 
                variant="default"
                layout="minimal"
                size="md"
                title="Clean, Focused Messaging"
                subtitle="Sometimes the most powerful message is the simplest one. Clean typography and focused content drive action."
                primaryCta={{ text: "Get Started", href: "#" }}
                backgroundPattern={false}
              />
            </div>
          </ComponentPreview>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">When to Use</h3>
              <p className="text-muted-foreground text-sm">
                Best for documentation, help pages, and content-focused pages where the message 
                should take precedence over visual effects.
              </p>
            </div>

            <CodeBlock language="tsx">
{`<HeroSection 
  variant="default"
  layout="minimal"
  size="md"
  title="Clean, Focused Messaging"
  subtitle="Sometimes the most powerful message is the simplest one..."
  primaryCta={{ text: "Get Started", href: "/start" }}
  backgroundPattern={false}
/>`}
            </CodeBlock>
          </div>
        </section>

        {/* Component API */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">HeroSection API</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Component Props</CardTitle>
              <CardDescription>
                All available props and their usage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Prop</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Default</th>
                      <th className="text-left p-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-2 font-mono">variant</td>
                      <td className="p-2 text-muted-foreground">'consciousness' | 'neural' | 'cosmic' | 'default'</td>
                      <td className="p-2 text-muted-foreground">'default'</td>
                      <td className="p-2 text-muted-foreground">Visual style variant</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">layout</td>
                      <td className="p-2 text-muted-foreground">'centered' | 'split' | 'minimal'</td>
                      <td className="p-2 text-muted-foreground">'centered'</td>
                      <td className="p-2 text-muted-foreground">Content layout pattern</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">size</td>
                      <td className="p-2 text-muted-foreground">'sm' | 'md' | 'lg' | 'xl'</td>
                      <td className="p-2 text-muted-foreground">'md'</td>
                      <td className="p-2 text-muted-foreground">Overall section height</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">title</td>
                      <td className="p-2 text-muted-foreground">string</td>
                      <td className="p-2 text-muted-foreground">-</td>
                      <td className="p-2 text-muted-foreground">Main headline text</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">subtitle</td>
                      <td className="p-2 text-muted-foreground">string</td>
                      <td className="p-2 text-muted-foreground">-</td>
                      <td className="p-2 text-muted-foreground">Supporting description</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">primaryCta</td>
                      <td className="p-2 text-muted-foreground">{'{ text: string, href: string }'}</td>
                      <td className="p-2 text-muted-foreground">-</td>
                      <td className="p-2 text-muted-foreground">Primary CTA button</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">secondaryCta</td>
                      <td className="p-2 text-muted-foreground">{'{ text: string, href: string } | undefined'}</td>
                      <td className="p-2 text-muted-foreground">undefined</td>
                      <td className="p-2 text-muted-foreground">Optional secondary CTA</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">backgroundPattern</td>
                      <td className="p-2 text-muted-foreground">boolean</td>
                      <td className="p-2 text-muted-foreground">true</td>
                      <td className="p-2 text-muted-foreground">Show iris pattern overlay</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Usage Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Do</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Use consciousness variant for primary landing pages</li>
                  <li>• Include both primary and secondary CTAs when appropriate</li>
                  <li>• Keep titles under 60 characters for impact</li>
                  <li>• Test different variants with your specific content</li>
                  <li>• Ensure sufficient color contrast on all backgrounds</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Don&apos;t</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Use multiple hero sections on the same page</li>
                  <li>• Override the breathing animations unless necessary</li>
                  <li>• Place hero sections immediately after each other</li>
                  <li>• Use cosmic variant for technical documentation</li>
                  <li>• Ignore responsive considerations in content planning</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}