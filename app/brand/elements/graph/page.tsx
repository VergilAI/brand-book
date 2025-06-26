'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { GraphVisualization } from "@/components/vergil/graph-visualization"
import { Loader2, Download, RefreshCw } from "lucide-react"

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
  }>
  relationships: Array<{
    id: string
    source: string
    target: string
    type: string
    properties: Record<string, any>
  }>
  metadata: {
    version: string
    created: string
    description: string
    nodeTypes: string[]
    relationshipTypes: string[]
  }
}

export default function GraphVisualizationPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadGraphData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/data/graph/basic/graph.json')
      if (!response.ok) {
        throw new Error('Failed to load graph data')
      }
      const data = await response.json()
      setGraphData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGraphData()
  }, [])

  const handleReloadData = async () => {
    await loadGraphData()
  }

  const handleExportData = () => {
    if (graphData) {
      const dataStr = JSON.stringify(graphData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'graph-data.json'
      link.click()
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cosmic-purple" />
            <p className="text-muted-foreground">Loading graph data...</p>
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
              <CardTitle className="text-red-800">Error Loading Graph Data</CardTitle>
              <CardDescription className="text-red-600">
                {error || 'Failed to load graph visualization data'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Graph Visualization</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Interactive network visualization built with D3.js for displaying complex 
            relationships between nodes. Perfect for organizational charts, knowledge graphs, 
            and network analysis.
          </p>
        </div>

        {/* Live Visualization */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Interactive Demo</h2>
              <p className="text-muted-foreground">
                Click nodes to inspect properties, drag to reposition, use filters to control visibility
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
          
          <ComponentPreview className="p-0 overflow-hidden">
            <GraphVisualization 
              data={graphData}
              width={1000}
              height={700}
              className="w-full"
            />
          </ComponentPreview>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-cosmic-purple">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-cosmic-purple mb-1">
                  {graphData.nodes.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Nodes</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-electric-violet">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-electric-violet mb-1">
                  {graphData.relationships.length}
                </div>
                <div className="text-sm text-muted-foreground">Relationships</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-phosphor-cyan">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-phosphor-cyan mb-1">
                  {graphData.metadata.nodeTypes.length}
                </div>
                <div className="text-sm text-muted-foreground">Node Types</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Implementation Details</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Core Technology Stack
                  <Badge variant="outline">Technical</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cosmic-purple rounded-full mt-2"></div>
                    <div>
                      <strong>D3.js Force Simulation:</strong> Automatic node positioning with physics-based layout
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-electric-violet rounded-full mt-2"></div>
                    <div>
                      <strong>React Integration:</strong> Component-based architecture with hooks for state management
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-phosphor-cyan rounded-full mt-2"></div>
                    <div>
                      <strong>TypeScript:</strong> Full type safety for graph data structures and D3 integration
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-synaptic-blue rounded-full mt-2"></div>
                    <div>
                      <strong>Vergil Styling:</strong> Brand colors, animations, and design system integration
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Key Features
                  <Badge variant="outline">Interactive</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-neural-pink rounded-full mt-2"></div>
                    <div>
                      <strong>Force Simulation:</strong> Automatic layout with collision detection and centering
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cosmic-purple rounded-full mt-2"></div>
                    <div>
                      <strong>Interactive Controls:</strong> Drag to reposition, click to inspect, zoom and pan
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-electric-violet rounded-full mt-2"></div>
                    <div>
                      <strong>Dynamic Filtering:</strong> Toggle node and relationship types visibility
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-phosphor-cyan rounded-full mt-2"></div>
                    <div>
                      <strong>Property Inspector:</strong> Detailed node information panel with all attributes
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Structure */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Data Structure</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>JSON Schema</CardTitle>
              <CardDescription>
                The graph visualization expects data in this standardized format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">
{`interface GraphData {
  nodes: Array<{
    id: string                    // Unique identifier
    label: string                 // Display name
    type: string                  // Category for coloring
    properties: Record<string, any>  // Custom attributes
    position: {
      x: number | null           // Optional fixed X position
      y: number | null           // Optional fixed Y position  
      fixed: boolean             // Whether position is locked
    }
  }>
  relationships: Array<{
    id: string                    // Unique identifier
    source: string                // Source node ID
    target: string                // Target node ID
    type: string                  // Relationship category
    properties: Record<string, any>  // Custom attributes
  }>
  metadata: {
    version: string               // Data format version
    created: string               // ISO timestamp
    description: string           // Human-readable description
    nodeTypes: string[]           // Available node categories
    relationshipTypes: string[]   // Available relationship types
  }
}`}
              </CodeBlock>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Usage</CardTitle>
              <CardDescription>
                Basic implementation with sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="tsx">
{`import { GraphVisualization } from '@/components/vergil/graph-visualization'

// Load graph data
const [graphData, setGraphData] = useState<GraphData | null>(null)

useEffect(() => {
  fetch('/data/graph/basic/graph.json')
    .then(res => res.json())
    .then(data => setGraphData(data))
}, [])

// Render visualization
return graphData ? (
  <GraphVisualization 
    data={graphData}
    width={1000}
    height={600}
    className="border rounded-lg"
  />
) : (
  <div>Loading...</div>
)`}
              </CodeBlock>
            </CardContent>
          </Card>
        </section>

        {/* Force Simulation Configuration */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Force Simulation Setup</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Force Configuration</CardTitle>
                <CardDescription>
                  D3 force simulation parameters for optimal layout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="javascript">
{`const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links)
    .id(d => d.id)
    .distance(100)          // Link length
  )
  .force('charge', d3.forceManyBody()
    .strength(-300)         // Node repulsion
  )
  .force('center', d3.forceCenter(
    width / 2, height / 2   // Center the graph
  ))
  .force('collision', d3.forceCollide()
    .radius(30)             // Prevent overlap
  )`}
                </CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Node Interaction</CardTitle>
                <CardDescription>
                  Drag behavior and position fixing implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="javascript">
{`// Drag behavior
const drag = d3.drag()
  .on('start', (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  })
  .on('drag', (event, d) => {
    d.fx = event.x
    d.fy = event.y
  })
  .on('end', (event, d) => {
    if (!event.active) simulation.alphaTarget(0)
    // Keep node fixed after dragging
    d.position.fixed = true
  })

// Apply to nodes
node.call(drag)`}
                </CodeBlock>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Usage Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Use meaningful node labels (12 chars max for readability)</li>
                  <li>• Limit node types to 6 or fewer for clear color distinction</li>
                  <li>• Include essential properties for node inspection</li>
                  <li>• Provide clear relationship type names</li>
                  <li>• Test with various data sizes for performance</li>
                  <li>• Use descriptive metadata for user context</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Performance degrades with {'>'}500 nodes</li>
                  <li>• Avoid deeply nested or circular relationships</li>
                  <li>• Don't use special characters in node IDs</li>
                  <li>• Complex property values may not display well</li>
                  <li>• Mobile interactions are limited to basic touch</li>
                  <li>• Large graphs may need pagination or clustering</li>
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
              <CardTitle>GraphVisualization Props</CardTitle>
              <CardDescription>
                Complete prop interface and configuration options
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
                      <td className="p-2 text-muted-foreground">SVG canvas width in pixels</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">height</td>
                      <td className="p-2 text-muted-foreground">number</td>
                      <td className="p-2 text-muted-foreground">600</td>
                      <td className="p-2 text-muted-foreground">SVG canvas height in pixels</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">className</td>
                      <td className="p-2 text-muted-foreground">string</td>
                      <td className="p-2 text-muted-foreground">-</td>
                      <td className="p-2 text-muted-foreground">Additional CSS classes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}