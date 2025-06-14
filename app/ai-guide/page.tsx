import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "@/components/docs/code-block"
import { Brain, Code, Search, Zap } from "lucide-react"

export default function AIGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Guide</h1>
        <p className="text-lg text-muted-foreground mt-2">
          How to use the Vergil Design System with AI assistants like Claude Code.
        </p>
      </div>

      {/* Overview */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI-Optimized Documentation
            </CardTitle>
            <CardDescription>
              Every component in the Vergil Design System is documented with AI assistants in mind.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Code className="h-5 w-5 text-vergil-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Semantic Markup</h4>
                  <p className="text-sm text-muted-foreground">
                    Components use semantic HTML with data attributes for easy identification.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Search className="h-5 w-5 text-vergil-violet-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Comprehensive JSDoc</h4>
                  <p className="text-sm text-muted-foreground">
                    Detailed documentation with examples, props, and usage patterns.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Component Usage */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Component Usage Patterns</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Component</CardTitle>
              <CardDescription>
                The Button component follows semantic naming conventions and includes comprehensive prop documentation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock>
{`/**
 * @component Button
 * @description Versatile button component with multiple variants and sizes
 * 
 * @example
 * // Basic usage
 * <Button>Click me</Button>
 * 
 * // With variant
 * <Button variant="secondary">Secondary Action</Button>
 * 
 * // With loading state
 * <Button loading>Processing...</Button>
 * 
 * @vergil-semantic button-interactive
 */`}
              </CodeBlock>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Neural Network Component</CardTitle>
              <CardDescription>
                Complex components include detailed usage examples and configuration options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock>
{`/**
 * @component NeuralNetwork
 * @description Animated neural network visualization with synaptic connections
 * 
 * @example
 * <NeuralNetwork 
 *   nodes={[
 *     { id: '1', x: 100, y: 100, layer: 0 },
 *     { id: '2', x: 200, y: 150, layer: 1 }
 *   ]}
 *   edges={[{ from: '1', to: '2' }]}
 * />
 * 
 * @vergil-semantic neural-network-visualization
 */`}
              </CodeBlock>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Best Practices for AI Assistants</h2>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-vergil-cyan-500" />
                Quick Implementation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">1. Import Components</h4>
                <p className="text-sm text-muted-foreground">
                  Always import from the documented paths using the exact import statements provided.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">2. Use Semantic Props</h4>
                <p className="text-sm text-muted-foreground">
                  Follow the documented prop patterns and utilize the variant system for consistency.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">3. Include Accessibility</h4>
                <p className="text-sm text-muted-foreground">
                  Components include built-in accessibility features - document any custom additions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-vergil-indigo-500" />
                Component Composition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">1. Follow Patterns</h4>
                <p className="text-sm text-muted-foreground">
                  Use the documented composition patterns for complex components like Cards.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">2. Leverage Variants</h4>
                <p className="text-sm text-muted-foreground">
                  Utilize the CVA variant system for consistent styling across your application.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">3. Maintain Semantics</h4>
                <p className="text-sm text-muted-foreground">
                  Preserve the semantic HTML structure and data attributes for maintainability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Implementation Tips */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Implementation Tips</h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-vergil-purple-500/10 border border-vergil-purple-500/20">
                <h4 className="font-medium mb-2">🎯 Start with Examples</h4>
                <p className="text-sm text-muted-foreground">
                  Every component includes working examples. Copy and modify these as starting points.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-vergil-violet-500/10 border border-vergil-violet-500/20">
                <h4 className="font-medium mb-2">🔍 Use Semantic Attributes</h4>
                <p className="text-sm text-muted-foreground">
                  Look for @vergil-semantic annotations to understand component purposes and relationships.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-vergil-indigo-500/10 border border-vergil-indigo-500/20">
                <h4 className="font-medium mb-2">🚀 Leverage Living Animations</h4>
                <p className="text-sm text-muted-foreground">
                  Add vergil-breathing, vergil-pulse, or vergil-gradient classes for the living system feel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}