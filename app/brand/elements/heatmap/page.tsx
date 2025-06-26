import { RadialHeatmap } from "@/components/vergil/radial-heatmap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComponentPreview } from "@/components/docs/component-preview"
import { CodeBlock } from "@/components/docs/code-block"

export default function RadialHeatmapPage() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display-md font-bold mb-4">
          Radial <span className="gradient-text">Heatmap</span>
        </h1>
        <p className="text-body-lg text-stone-gray max-w-3xl">
          A dynamic, multi-layered radial heatmap visualization for displaying organizational competencies, 
          skill matrices, or performance metrics with living, organic animations.
        </p>
      </div>

      {/* Live Preview */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Live Example</CardTitle>
          <CardDescription className="text-body-lg">
            Interactive radial heatmap with real-time animated layers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <RadialHeatmap />
          </div>
        </CardContent>
      </Card>

      {/* Custom Configuration */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Custom Skills Example</CardTitle>
          <CardDescription className="text-body-lg">
            Configured with custom skills and Vergil brand colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <RadialHeatmap
              skills={[
                "Neural Architecture",
                "Quantum Computing",
                "Data Science",
                "System Design",
                "Cloud Native",
                "Security"
              ]}
              title="Technical Excellence Matrix"
              description="Core engineering competencies across our AI platform teams."
              colors={[
                { 
                  base: "rgba(99, 102, 241, 0.4)", 
                  glow: "rgba(99, 102, 241, 0.8)", 
                  highlight: "rgba(129, 140, 248, 0.6)" 
                },
                { 
                  base: "rgba(167, 139, 250, 0.4)", 
                  glow: "rgba(167, 139, 250, 0.8)", 
                  highlight: "rgba(196, 181, 253, 0.6)" 
                },
                { 
                  base: "rgba(16, 185, 129, 0.4)", 
                  glow: "rgba(16, 185, 129, 0.8)", 
                  highlight: "rgba(52, 211, 153, 0.6)" 
                },
                { 
                  base: "rgba(59, 130, 246, 0.4)", 
                  glow: "rgba(59, 130, 246, 0.8)", 
                  highlight: "rgba(96, 165, 250, 0.6)" 
                },
                { 
                  base: "rgba(244, 114, 182, 0.4)", 
                  glow: "rgba(244, 114, 182, 0.8)", 
                  highlight: "rgba(251, 182, 206, 0.6)" 
                }
              ]}
              numLayers={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-h4 font-semibold mb-3">Basic Implementation</h3>
            <CodeBlock language="tsx">
{`import { RadialHeatmap } from '@/components/vergil/radial-heatmap'

// Default configuration
<RadialHeatmap />

// Custom skills and colors
<RadialHeatmap
  skills={[
    "Frontend",
    "Backend", 
    "DevOps",
    "Security",
    "Data",
    "Mobile"
  ]}
  title="Engineering Skills"
  description="Team competency visualization"
  numLayers={5}
  showControls={true}
  autoStart={true}
/>`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-h4 font-semibold mb-3">Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Prop</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Default</th>
                    <th className="text-left py-2 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-b">
                    <td className="py-2 px-4">skills</td>
                    <td className="py-2 px-4">string[]</td>
                    <td className="py-2 px-4">Banking skills</td>
                    <td className="py-2 px-4 font-sans">6 skill labels for hexagon vertices</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">title</td>
                    <td className="py-2 px-4">string</td>
                    <td className="py-2 px-4">"Skill Intelligence Matrix"</td>
                    <td className="py-2 px-4 font-sans">Title displayed in info panel</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">description</td>
                    <td className="py-2 px-4">string</td>
                    <td className="py-2 px-4">Default description</td>
                    <td className="py-2 px-4 font-sans">Description text for info panel</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">colors</td>
                    <td className="py-2 px-4">ColorConfig[]</td>
                    <td className="py-2 px-4">7 color sets</td>
                    <td className="py-2 px-4 font-sans">Color configuration for layers</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">numLayers</td>
                    <td className="py-2 px-4">number</td>
                    <td className="py-2 px-4">7</td>
                    <td className="py-2 px-4 font-sans">Number of animated blob layers</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">showControls</td>
                    <td className="py-2 px-4">boolean</td>
                    <td className="py-2 px-4">true</td>
                    <td className="py-2 px-4 font-sans">Show pause/resume/reset controls</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">autoStart</td>
                    <td className="py-2 px-4">boolean</td>
                    <td className="py-2 px-4">true</td>
                    <td className="py-2 px-4 font-sans">Start animation automatically</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">className</td>
                    <td className="py-2 px-4">string</td>
                    <td className="py-2 px-4">undefined</td>
                    <td className="py-2 px-4 font-sans">Additional CSS classes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design Philosophy */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Design Philosophy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body-lg text-stone-gray">
            The Radial Heatmap embodies Vergil&apos;s living intelligence philosophy through:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-cosmic-purple mr-3">•</span>
              <div>
                <strong>Organic Movement</strong> - Each layer uses Perlin-like noise functions to create 
                natural, flowing animations that feel alive and breathing.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-electric-violet mr-3">•</span>
              <div>
                <strong>Multi-Dimensional Data</strong> - Represents complex relationships between 
                different skills or metrics in an intuitive radial format.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-phosphor-cyan mr-3">•</span>
              <div>
                <strong>Depth Through Layers</strong> - Multiple translucent layers create a sense of 
                depth and complexity, showing how competencies overlap and interact.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-synaptic-blue mr-3">•</span>
              <div>
                <strong>Living Visualization</strong> - Continuous animation represents the dynamic, 
                ever-evolving nature of skills and intelligence.
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card className="brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Use Cases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-h4 font-semibold mb-3">Team Skill Assessment</h3>
            <p className="text-body text-stone-gray mb-3">
              Visualize team competencies across different technical and soft skills, identifying 
              strengths and areas for development.
            </p>
          </div>

          <div>
            <h3 className="text-h4 font-semibold mb-3">AI Model Performance</h3>
            <p className="text-body text-stone-gray mb-3">
              Display multi-dimensional performance metrics for AI models, showing how different 
              capabilities evolve over training iterations.
            </p>
          </div>

          <div>
            <h3 className="text-h4 font-semibold mb-3">Product Feature Adoption</h3>
            <p className="text-body text-stone-gray mb-3">
              Track user engagement across different product features, with each layer representing 
              different user segments or time periods.
            </p>
          </div>

          <div>
            <h3 className="text-h4 font-semibold mb-3">System Health Monitoring</h3>
            <p className="text-body text-stone-gray mb-3">
              Monitor multiple system health indicators simultaneously, with organic movements 
              indicating the dynamic nature of system performance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}