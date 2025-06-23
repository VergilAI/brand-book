'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GraphNode {
  id: string
  label: string
  type: string
  properties: Record<string, any>
  position: {
    x: number | null
    y: number | null
    fixed: boolean
  }
  // D3 properties added during simulation
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
  vx?: number
  vy?: number
}

interface GraphRelationship {
  id: string
  source: string | GraphNode
  target: string | GraphNode
  type: string
  properties: Record<string, any>
}

interface GraphData {
  nodes: GraphNode[]
  relationships: GraphRelationship[]
  metadata: {
    version: string
    created: string
    description: string
    nodeTypes: string[]
    relationshipTypes: string[]
  }
}

interface NodeInfoPanelProps {
  node: GraphNode | null
  onClose: () => void
}

function NodeInfoPanel({ node, onClose }: NodeInfoPanelProps) {
  if (!node) return null

  return (
    <Card className="absolute top-4 right-4 w-80 z-10 shadow-lg border-cosmic-purple/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{node.label}</CardTitle>
            <Badge variant="outline" className="mt-1">
              {node.type}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-cosmic-purple">Properties</h4>
            <div className="space-y-1">
              {Object.entries(node.properties).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-medium">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2 text-cosmic-purple">Position</h4>
            <div className="text-xs text-muted-foreground">
              {node.position.fixed ? 'Fixed position' : 'Auto-positioned'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ColorLegendProps {
  nodeTypes: string[]
  colorScale: d3.ScaleOrdinal<string, string>
}

function ColorLegend({ nodeTypes, colorScale }: ColorLegendProps) {
  return (
    <Card className="absolute bottom-4 left-4 w-64 z-10 shadow-lg border-cosmic-purple/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Node Types</CardTitle>
        <CardDescription>Color mapping for node categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {nodeTypes.map((type) => (
            <div key={type} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: colorScale(type) }}
              />
              <span className="text-sm">{type}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface FilterControlsProps {
  nodeTypes: string[]
  relationshipTypes: string[]
  visibleNodeTypes: Set<string>
  visibleRelationshipTypes: Set<string>
  onNodeTypeToggle: (type: string) => void
  onRelationshipTypeToggle: (type: string) => void
  onResetLayout: () => void
}

function FilterControls({
  nodeTypes,
  relationshipTypes,
  visibleNodeTypes,
  visibleRelationshipTypes,
  onNodeTypeToggle,
  onRelationshipTypeToggle,
  onResetLayout
}: FilterControlsProps) {
  return (
    <Card className="absolute top-4 left-4 w-64 z-10 shadow-lg border-cosmic-purple/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Filters & Controls</CardTitle>
        <CardDescription>Toggle visibility and layout</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-cosmic-purple">Node Types</h4>
          <div className="space-y-1">
            {nodeTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleNodeTypes.has(type)}
                  onChange={() => onNodeTypeToggle(type)}
                  className="w-3 h-3 text-cosmic-purple"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2 text-electric-violet">Relationship Types</h4>
          <div className="space-y-1">
            {relationshipTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleRelationshipTypes.has(type)}
                  onChange={() => onRelationshipTypeToggle(type)}
                  className="w-3 h-3 text-electric-violet"
                />
                <span className="text-xs">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onResetLayout}
            className="w-full"
          >
            Reset Layout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export interface GraphVisualizationProps {
  data: GraphData
  width?: number
  height?: number
  className?: string
}

export function GraphVisualization({ 
  data, 
  width = 800, 
  height = 600, 
  className 
}: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [visibleNodeTypes, setVisibleNodeTypes] = useState<Set<string>>(
    new Set(data.metadata.nodeTypes)
  )
  const [visibleRelationshipTypes, setVisibleRelationshipTypes] = useState<Set<string>>(
    new Set(data.metadata.relationshipTypes)
  )
  const simulationRef = useRef<d3.Simulation<GraphNode, undefined> | null>(null)

  // Color scale for node types
  const colorScale = d3.scaleOrdinal<string>()
    .domain(data.metadata.nodeTypes)
    .range(['#6366F1', '#A78BFA', '#10B981', '#3B82F6', '#F472B6', '#FBBF24'])

  // Filter data based on visibility settings
  const filteredNodes = data.nodes.filter(node => visibleNodeTypes.has(node.type))
  const filteredLinks = data.relationships.filter(rel => 
    visibleRelationshipTypes.has(rel.type) &&
    filteredNodes.some(n => n.id === (typeof rel.source === 'string' ? rel.source : rel.source.id)) &&
    filteredNodes.some(n => n.id === (typeof rel.target === 'string' ? rel.target : rel.target.id))
  )

  const initializeVisualization = useCallback(() => {
    if (!svgRef.current || filteredNodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Create main group for zoom/pan
    const g = svg.append('g').attr('class', 'graph-container')

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create force simulation
    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force('link', d3.forceLink<GraphNode, GraphRelationship>(filteredLinks)
        .id(d => d.id)
        .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

    simulationRef.current = simulation

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(filteredLinks)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)

    // Create link labels
    const linkLabel = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(filteredLinks)
      .enter().append('text')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .text(d => d.type)

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(filteredNodes)
      .enter().append('circle')
      .attr('r', 20)
      .attr('fill', d => colorScale(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag<SVGCircleElement, GraphNode>()
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
      )

    // Add node labels
    const nodeLabel = g.append('g')
      .attr('class', 'node-labels')
      .selectAll('text')
      .data(filteredNodes)
      .enter().append('text')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#333')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('pointer-events', 'none')
      .text(d => d.label.length > 12 ? d.label.slice(0, 12) + '...' : d.label)

    // Add click handler for nodes
    node.on('click', (event, d) => {
      event.stopPropagation()
      setSelectedNode(d)
      // Stop simulation when node is clicked for inspection
      simulation.stop()
    })

    // Add hover effects
    node
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 25)
          .attr('stroke-width', 3)
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 20)
          .attr('stroke-width', 2)
      })

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!)

      linkLabel
        .attr('x', d => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
        .attr('y', d => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2)

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!)

      nodeLabel
        .attr('x', d => d.x!)
        .attr('y', d => d.y!)
    })

    // Click background to deselect
    svg.on('click', () => {
      setSelectedNode(null)
      simulation.restart()
    })

  }, [filteredNodes, filteredLinks, width, height, colorScale])

  const handleNodeTypeToggle = (type: string) => {
    const newVisible = new Set(visibleNodeTypes)
    if (newVisible.has(type)) {
      newVisible.delete(type)
    } else {
      newVisible.add(type)
    }
    setVisibleNodeTypes(newVisible)
  }

  const handleRelationshipTypeToggle = (type: string) => {
    const newVisible = new Set(visibleRelationshipTypes)
    if (newVisible.has(type)) {
      newVisible.delete(type)
    } else {
      newVisible.add(type)
    }
    setVisibleRelationshipTypes(newVisible)
  }

  const handleResetLayout = () => {
    if (simulationRef.current) {
      // Reset fixed positions
      filteredNodes.forEach(node => {
        node.fx = null
        node.fy = null
        node.position.fixed = false
      })
      simulationRef.current.alpha(1).restart()
    }
    setSelectedNode(null)
  }

  useEffect(() => {
    initializeVisualization()
  }, [initializeVisualization])

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-muted rounded-lg bg-background"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 70%)' }}
      />
      
      <FilterControls
        nodeTypes={data.metadata.nodeTypes}
        relationshipTypes={data.metadata.relationshipTypes}
        visibleNodeTypes={visibleNodeTypes}
        visibleRelationshipTypes={visibleRelationshipTypes}
        onNodeTypeToggle={handleNodeTypeToggle}
        onRelationshipTypeToggle={handleRelationshipTypeToggle}
        onResetLayout={handleResetLayout}
      />
      
      <ColorLegend 
        nodeTypes={data.metadata.nodeTypes}
        colorScale={colorScale}
      />
      
      <NodeInfoPanel 
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  )
}