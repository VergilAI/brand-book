'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { GraphConstellation } from "@/components/vergil/graph-constellation"
import { GraphConstellationPersistent } from "@/components/vergil/graph-constellation-persistent"
import { Loader2, Sparkles, Eye, Zap, Play, ChevronRight, Layers } from "lucide-react"
import Link from "next/link"

interface GraphData {
  nodes: Array<{
    id: string
    label: string
    type: string
    properties: Record<string, any>
    position: {
      x: number | null
      y: number | null
      fixed: boolean
    }
    animationOrder?: number
    animationDelay?: number
  }>
  relationships: Array<{
    id: string
    source: string
    target: string
    type: string
    properties: Record<string, any>
    animationOrder?: number
    animationDelay?: number
  }>
  metadata: {
    version: string
    created: string
    description: string
    nodeTypes: string[]
    relationshipTypes: string[]
  }
}

function AnimatedGraphDemo() {
  const [animatedData, setAnimatedData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [key, setKey] = useState(0)

  useEffect(() => {
    fetch('/data/graph/animated/graph-animated.json')
      .then(res => res.json())
      .then(data => {
        setAnimatedData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cosmic-purple" />
      </div>
    )
  }

  if (!animatedData) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load animation data
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 text-center">
        <Button 
          onClick={() => setKey(prev => prev + 1)}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          Play Animation
        </Button>
      </div>
      <GraphConstellation
        key={key}
        data={animatedData}
        width={1200}
        height={500}
        animated={true}
        animationDuration={5000}
        initialSettings={{
          showNodeLabels: true,
          showRelationshipLabels: false,
          showControls: false
        }}
      />
    </div>
  )
}

function StagedAnimationDemo() {
  const [stagedData, setStagedData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStage, setCurrentStage] = useState(0)
  const [metadata, setMetadata] = useState<any>(null)

  useEffect(() => {
    fetch('/data/graph/staged/graph-staged.json')
      .then(res => res.json())
      .then(data => {
        setStagedData(data)
        setMetadata(data.metadata)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cosmic-purple" />
      </div>
    )
  }

  if (!stagedData || !metadata) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load staged animation data
      </div>
    )
  }

  const maxStage = metadata.stages ? metadata.stages.length - 1 : 3

  return (
    <div>
      <div className="mb-6">
        {/* Stage Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {metadata.stages?.map((stage: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index <= currentStage
                    ? 'bg-cosmic-purple border-cosmic-purple text-white'
                    : 'bg-white border-mist-gray text-stone-gray'
                }`}
              >
                <span className="text-sm font-semibold">{index + 1}</span>
              </div>
              {index < metadata.stages.length - 1 && (
                <div
                  className={`h-0.5 w-12 transition-all duration-300 ${
                    index < currentStage ? 'bg-cosmic-purple' : 'bg-mist-gray'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Stage Info */}
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-deep-space">
            Stage {currentStage + 1}: {metadata.stages?.[currentStage]?.title}
          </h4>
          <p className="text-sm text-stone-gray">
            {metadata.stages?.[currentStage]?.description}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => setCurrentStage(0)}
            variant="outline"
            size="sm"
            disabled={currentStage === 0}
          >
            Reset
          </Button>
          <Button
            onClick={() => setCurrentStage(prev => Math.max(0, prev - 1))}
            variant="outline"
            size="sm"
            disabled={currentStage === 0}
          >
            Previous Stage
          </Button>
          <Button
            onClick={() => setCurrentStage(prev => Math.min(maxStage, prev + 1))}
            className="gap-2"
            disabled={currentStage === maxStage}
          >
            Next Stage
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <GraphConstellation
        data={stagedData}
        width={1200}
        height={500}
        animated={true}
        animationMode="staged"
        currentStage={currentStage}
        stageDuration={2000}
        onStageComplete={(stage) => {
          console.log(`Stage ${stage} complete`)
        }}
        initialSettings={{
          showNodeLabels: true,
          showRelationshipLabels: false,
          showControls: false
        }}
      />
    </div>
  )
}

function PersistentAnimationDemo() {
  const [stagedData, setStagedData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStage, setCurrentStage] = useState(0)
  const [metadata, setMetadata] = useState<any>(null)

  useEffect(() => {
    fetch('/data/graph/staged/graph-staged.json')
      .then(res => res.json())
      .then(data => {
        setStagedData(data)
        setMetadata(data.metadata)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cosmic-purple" />
      </div>
    )
  }

  if (!stagedData || !metadata) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load staged animation data
      </div>
    )
  }

  const maxStage = metadata.stages ? metadata.stages.length - 1 : 3

  return (
    <div>
      <div className="mb-6">
        {/* Stage Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {metadata.stages?.map((stage: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index <= currentStage
                    ? 'bg-phosphor-cyan border-phosphor-cyan text-white'
                    : 'bg-white border-mist-gray text-stone-gray'
                }`}
              >
                <span className="text-sm font-semibold">{index + 1}</span>
              </div>
              {index < metadata.stages.length - 1 && (
                <div
                  className={`h-0.5 w-12 transition-all duration-300 ${
                    index < currentStage ? 'bg-phosphor-cyan' : 'bg-mist-gray'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Stage Info */}
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-deep-space">
            Stage {currentStage + 1}: {metadata.stages?.[currentStage]?.title}
          </h4>
          <p className="text-sm text-stone-gray">
            {metadata.stages?.[currentStage]?.description}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => setCurrentStage(0)}
            variant="outline"
            size="sm"
            disabled={currentStage === 0}
          >
            Reset
          </Button>
          <Button
            onClick={() => setCurrentStage(prev => Math.max(0, prev - 1))}
            variant="outline"
            size="sm"
            disabled={currentStage === 0}
          >
            Previous Stage
          </Button>
          <Button
            onClick={() => setCurrentStage(prev => Math.min(maxStage, prev + 1))}
            className="gap-2 bg-phosphor-cyan hover:bg-phosphor-cyan/90"
            disabled={currentStage === maxStage}
          >
            Next Stage
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <GraphConstellationPersistent
        data={stagedData}
        width={1200}
        height={500}
        currentStage={currentStage}
        stageDuration={2000}
        onStageComplete={(stage) => {
          console.log(`Persistent stage ${stage} complete`)
        }}
        initialSettings={{
          showNodeLabels: true,
          showRelationshipLabels: false,
          showControls: false
        }}
      />
    </div>
  )
}

export default function GraphConstellationPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGraphData = async () => {
      try {
        setLoading(true)
        console.log('Starting to load graph data...')
        const response = await fetch('/data/graph/basic/graph.json')
        console.log('Fetch response:', response.status, response.ok)
        if (!response.ok) {
          throw new Error(`Failed to load graph data: ${response.status}`)
        }
        const data = await response.json()
        console.log('Graph data loaded:', data?.nodes?.length, 'nodes', data?.relationships?.length, 'relationships')
        setGraphData(data)
      } catch (err) {
        console.error('Error loading graph data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadGraphData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cosmic-purple" />
            <p className="text-muted-foreground">Loading constellation data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !graphData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Error Loading Data</CardTitle>
              <CardDescription className="text-red-600">
                {error || 'Failed to load graph data'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold gradient-text">Graph Constellation</h1>
            <Badge className="bg-gradient-to-r from-cosmic-purple to-electric-violet text-white border-0">
              Premium
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            A stunning, client-ready visualization that transforms complex data relationships 
            into an elegant constellation of interconnected nodes. Perfect for presentations, 
            dashboards, and showcasing organizational networks.
          </p>
        </div>

        {/* Hero Demo */}
        <section className="mb-16">
          <Card className="overflow-hidden border shadow-xl bg-white">
            <CardContent className="p-0">
              <GraphConstellation 
                data={graphData}
                width={1200}
                height={700}
                className="w-full"
                initialSettings={{
                  showNodeLabels: true,
                  showRelationshipLabels: false,
                  showControls: true
                }}
              />
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Try the interactive controls in the top-right corner. Click nodes to explore, drag to reposition.
            </p>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-cosmic-purple" />
                <span>Toggle Labels</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-electric-violet" />
                <span>Glow Effects</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-phosphor-cyan" />
                <span>Particle Animation</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Constellation vs Standard Graph</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-cosmic-purple">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Graph Constellation</span>
                  <Badge>Client-Facing</Badge>
                </CardTitle>
                <CardDescription>
                  Beautiful, modern visualization for presentations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cosmic-purple rounded-full mt-2"></div>
                    <div>
                      <strong>Aesthetic First:</strong> Gradient nodes, glowing edges, particle effects
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-electric-violet rounded-full mt-2"></div>
                    <div>
                      <strong>Clean Interface:</strong> Minimal controls, fullscreen mode, smooth animations
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-phosphor-cyan rounded-full mt-2"></div>
                    <div>
                      <strong>Presentation Ready:</strong> Toggle labels for cleaner visuals, dark/light themes
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-neural-pink rounded-full mt-2"></div>
                    <div>
                      <strong>Modern Design:</strong> Curved edges, breathing animations, subtle interactions
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-synaptic-blue">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Standard Graph</span>
                  <Badge variant="outline">Technical</Badge>
                </CardTitle>
                <CardDescription>
                  Functional visualization for analysis and development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-synaptic-blue rounded-full mt-2"></div>
                    <div>
                      <strong>Data First:</strong> Clear node properties, relationship details, filters
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cosmic-purple rounded-full mt-2"></div>
                    <div>
                      <strong>Full Controls:</strong> Type filtering, layout reset, data export
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-electric-violet rounded-full mt-2"></div>
                    <div>
                      <strong>Analysis Ready:</strong> Always show labels, detailed property panels
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-phosphor-cyan rounded-full mt-2"></div>
                    <div>
                      <strong>Developer Friendly:</strong> Simple colors, straight edges, clear hierarchy
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <Link href="/elements/graph">
              <Button variant="outline">
                View Standard Graph Documentation →
              </Button>
            </Link>
          </div>
        </section>

        {/* Visual Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Visual Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-cosmic-purple/10 to-transparent">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-cosmic-purple to-electric-violet rounded-lg mb-4 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Gradient Nodes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Each node features a radial gradient with subtle animations, creating 
                  depth and visual interest while maintaining brand consistency.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-electric-violet/10 to-transparent">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-electric-violet to-neural-pink rounded-lg mb-4 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Smart Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Toggle node and relationship labels independently. Perfect for screenshots 
                  where you want to show structure without clutter.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-phosphor-cyan/10 to-transparent">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-phosphor-cyan to-synaptic-blue rounded-lg mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Living Effects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ambient particles, glowing edges, and breathing nodes create a sense 
                  of living intelligence that aligns with Vergil's brand philosophy.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Animation Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Animated Graph Building</h2>
          <p className="text-muted-foreground mb-6">
            Create stunning presentations by animating how your graph builds itself. Perfect for 
            demonstrating system architecture, team formation, or data relationships.
          </p>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Continuous Animation Demo</CardTitle>
              <CardDescription>
                Watch how a project team forms around the AI Platform project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedGraphDemo />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Animation Configuration</CardTitle>
              <CardDescription>
                Add animation properties to your nodes and relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="json">
{`{
  "nodes": [
    {
      "id": "company_1",
      "label": "Tech Corp",
      "type": "Company",
      "animationOrder": 0,  // First to appear
      "properties": { ... }
    },
    {
      "id": "person_1", 
      "label": "John Smith",
      "type": "Person",
      "animationOrder": 1,  // Second to appear
      "animationDelay": 200, // Extra 200ms delay
      "properties": { ... }
    }
  ],
  "relationships": [
    {
      "id": "rel_1",
      "source": "person_1",
      "target": "company_1",
      "type": "WORKS_FOR",
      "animationOrder": 2,  // Appears after nodes
      "animationDelay": 300, // Extra delay for effect
      "properties": { ... }
    }
  ]
}`}
              </CodeBlock>
            </CardContent>
          </Card>
        </section>

        {/* Staged Animation Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Staged Animation System</h2>
          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-gradient-to-r from-phosphor-cyan to-synaptic-blue text-white border-0">
              New Feature
            </Badge>
            <Badge variant="outline">
              <Layers className="h-3 w-3 mr-1" />
              Multi-Stage
            </Badge>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Break your graph animation into multiple stages that can be triggered independently. 
            Perfect for step-by-step explanations, interactive presentations, or synchronized with 
            scrolling/carousel navigation.
          </p>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Interactive Staged Animation</CardTitle>
              <CardDescription>
                Control the animation flow manually through 4 distinct stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StagedAnimationDemo />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Persistent Graph Animation
                <Badge className="bg-gradient-to-r from-phosphor-cyan to-synaptic-blue text-white border-0">
                  Smooth
                </Badge>
              </CardTitle>
              <CardDescription>
                Same data with continuous simulation - positions preserved between stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersistentAnimationDemo />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Staged Animation Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-cosmic-purple rounded-full mt-1.5"></div>
                    <span>Perfect narrative control for presentations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-electric-violet rounded-full mt-1.5"></div>
                    <span>Sync with scroll, carousel, or user interactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-phosphor-cyan rounded-full mt-1.5"></div>
                    <span>Better performance by animating subsets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-neural-pink rounded-full mt-1.5"></div>
                    <span>Backward compatible with existing data</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stage Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock language="json">
{`{
  "nodes": [
    {
      "id": "company_1",
      "label": "Tech Corp",
      "animationStage": 0,  // Foundation stage
      "animationOrder": 0
    },
    {
      "id": "person_1",
      "label": "John Smith", 
      "animationStage": 1,  // Team stage
      "animationOrder": 0
    },
    {
      "id": "project_1",
      "label": "AI Platform",
      "animationStage": 2,  // Projects stage
      "animationOrder": 0
    }
  ]
}`}</CodeBlock>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Manual Stage Control</h4>
                <CodeBlock language="tsx">
{`const [currentStage, setCurrentStage] = useState(0)

<GraphConstellation
  data={stagedData}
  animated={true}
  animationMode="staged"
  currentStage={currentStage}
  stageDuration={2000}
  onStageComplete={(stage) => {
    console.log(\`Stage \${stage} complete\`)
  }}
/>

<Button onClick={() => setCurrentStage(prev => prev + 1)}>
  Next Stage
</Button>`}</CodeBlock>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Auto-Advance Stages</h4>
                <CodeBlock language="tsx">
{`<GraphConstellation
  data={stagedData}
  animated={true}
  animationMode="staged"
  autoAdvanceStages={true}
  stageDuration={3000}
  onAnimationComplete={() => {
    console.log('All stages complete!')
  }}
/>`}</CodeBlock>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Carousel Integration</h4>
                <CodeBlock language="tsx">
{`// Sync with carousel or scroll position
<GraphConstellation
  data={graphData}
  animationMode="staged"
  currentStage={carouselStep}
  stageDuration={1500}
/>`}</CodeBlock>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Implementation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Implementation</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Usage</CardTitle>
                <CardDescription>
                  Minimal setup for a beautiful graph visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="tsx">
{`import { GraphConstellation } from '@/components/vergil/graph-constellation'

// Basic implementation
<GraphConstellation 
  data={graphData}
  width={1200}
  height={700}
  className="rounded-lg shadow-2xl"
/>`}
                </CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Animated Graph</CardTitle>
                <CardDescription>
                  Enable animation for dramatic presentations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="tsx">
{`<GraphConstellation 
  data={animatedGraphData}
  width={1200}
  height={700}
  animated={true}
  animationDuration={4000} // 4 seconds total
  onAnimationComplete={() => {
    console.log('Animation finished!')
  }}
  initialSettings={{
    showNodeLabels: true,
    showControls: true
  }}
/>`}
                </CodeBlock>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Design Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Design Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">When to Use Constellation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Client presentations and demos</li>
                  <li>• Marketing materials and websites</li>
                  <li>• Executive dashboards</li>
                  <li>• Trade show displays</li>
                  <li>• Social media screenshots</li>
                  <li>• Annual reports and infographics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">When to Use Standard Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Technical documentation</li>
                  <li>• Data analysis workflows</li>
                  <li>• Developer tools</li>
                  <li>• System monitoring</li>
                  <li>• Debug interfaces</li>
                  <li>• Internal reporting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Component API */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Component API</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>GraphConstellation Props</CardTitle>
              <CardDescription>
                Complete configuration options for the premium visualization
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
                      <td className="p-2 font-mono">data</td>
                      <td className="p-2 text-muted-foreground">GraphData</td>
                      <td className="p-2 text-muted-foreground">required</td>
                      <td className="p-2 text-muted-foreground">Graph nodes and relationships</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">width</td>
                      <td className="p-2 text-muted-foreground">number</td>
                      <td className="p-2 text-muted-foreground">800</td>
                      <td className="p-2 text-muted-foreground">Canvas width in pixels</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">height</td>
                      <td className="p-2 text-muted-foreground">number</td>
                      <td className="p-2 text-muted-foreground">600</td>
                      <td className="p-2 text-muted-foreground">Canvas height in pixels</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">className</td>
                      <td className="p-2 text-muted-foreground">string</td>
                      <td className="p-2 text-muted-foreground">-</td>
                      <td className="p-2 text-muted-foreground">Additional CSS classes</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">initialSettings</td>
                      <td className="p-2 text-muted-foreground">DisplaySettings</td>
                      <td className="p-2 text-muted-foreground">{`{}`}</td>
                      <td className="p-2 text-muted-foreground">Initial display preferences</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">animated</td>
                      <td className="p-2 text-muted-foreground">boolean</td>
                      <td className="p-2 text-muted-foreground">false</td>
                      <td className="p-2 text-muted-foreground">Enable pop-in animation</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">animationDuration</td>
                      <td className="p-2 text-muted-foreground">number</td>
                      <td className="p-2 text-muted-foreground">2000</td>
                      <td className="p-2 text-muted-foreground">Total animation duration in ms</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">onAnimationComplete</td>
                      <td className="p-2 text-muted-foreground">{'() => void'}</td>
                      <td className="p-2 text-muted-foreground">-</td>
                      <td className="p-2 text-muted-foreground">Callback when animation finishes</td>
                    </tr>
                    <tr className="bg-phosphor-cyan/5">
                      <td className="p-2 font-mono">animationMode</td>
                      <td className="p-2 text-muted-foreground">'continuous' | 'staged'</td>
                      <td className="p-2 text-muted-foreground">'continuous'</td>
                      <td className="p-2 text-muted-foreground">Animation mode type</td>
                    </tr>
                    <tr className="bg-phosphor-cyan/5">
                      <td className="p-2 font-mono">currentStage</td>
                      <td className="p-2 text-muted-foreground">number</td>
                      <td className="p-2 text-muted-foreground">0</td>
                      <td className="p-2 text-muted-foreground">Current stage to display (staged mode)</td>
                    </tr>
                    <tr className="bg-phosphor-cyan/5">
                      <td className="p-2 font-mono">stageDuration</td>
                      <td className="p-2 text-muted-foreground">number</td>
                      <td className="p-2 text-muted-foreground">2000</td>
                      <td className="p-2 text-muted-foreground">Duration per stage in ms</td>
                    </tr>
                    <tr className="bg-phosphor-cyan/5">
                      <td className="p-2 font-mono">onStageComplete</td>
                      <td className="p-2 text-muted-foreground">{'(stage: number) => void'}</td>
                      <td className="p-2 text-muted-foreground">-</td>
                      <td className="p-2 text-muted-foreground">Callback when stage animation completes</td>
                    </tr>
                    <tr className="bg-phosphor-cyan/5">
                      <td className="p-2 font-mono">autoAdvanceStages</td>
                      <td className="p-2 text-muted-foreground">boolean</td>
                      <td className="p-2 text-muted-foreground">false</td>
                      <td className="p-2 text-muted-foreground">Auto-progress through stages</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Display Settings Interface</h4>
                <CodeBlock language="typescript">
{`interface DisplaySettings {
  showNodeLabels: boolean         // Show/hide node names
  showRelationshipLabels: boolean // Show/hide edge labels  
  showGlowEffects: boolean       // Toggle glow filters
  showParticles: boolean         // Toggle ambient particles
  showControls: boolean          // Show/hide UI controls
  darkMode: boolean              // Dark/light theme
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}