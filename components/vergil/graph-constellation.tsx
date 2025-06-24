'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Maximize2, Minimize2, Play } from 'lucide-react'

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
  // Animation properties
  animationStage?: number  // Which stage this node appears in (0, 1, 2, etc.)
  animationOrder?: number  // Order within the stage
  animationDelay?: number  // Additional delay within stage
  // D3 properties
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
  // Animation properties
  animationStage?: number  // Which stage this relationship appears in
  animationOrder?: number  // Order within the stage
  animationDelay?: number  // Additional delay within stage
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

interface DisplaySettings {
  showNodeLabels: boolean
  showRelationshipLabels: boolean
  showControls: boolean
}

interface MinimalControlsProps {
  settings: DisplaySettings
  onSettingsChange: (settings: DisplaySettings) => void
  onFullscreen: () => void
  isFullscreen: boolean
  animated?: boolean
  onReplayAnimation?: () => void
}

function MinimalControls({ settings, onSettingsChange, onFullscreen, isFullscreen, animated, onReplayAnimation }: MinimalControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
      <Card className="bg-background/80 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardContent className="p-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Label htmlFor="node-labels" className="text-xs cursor-pointer">
                Nodes
              </Label>
              <Switch
                id="node-labels"
                checked={settings.showNodeLabels}
                onCheckedChange={(checked) => 
                  onSettingsChange({ ...settings, showNodeLabels: checked })
                }
                className="scale-75"
              />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Label htmlFor="rel-labels" className="text-xs cursor-pointer">
                Links
              </Label>
              <Switch
                id="rel-labels"
                checked={settings.showRelationshipLabels}
                onCheckedChange={(checked) => 
                  onSettingsChange({ ...settings, showRelationshipLabels: checked })
                }
                className="scale-75"
              />
            </div>
          </div>
          
          <div className="h-4 w-[1px] bg-border" />
          
          <div className="flex items-center gap-2">
            {animated && onReplayAnimation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReplayAnimation}
                className="p-1"
                title="Replay Animation"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullscreen}
              className="p-1"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface NodeDetailsProps {
  node: GraphNode | null
  onClose: () => void
}

function NodeDetails({ node, onClose }: NodeDetailsProps) {
  if (!node) return null

  return (
    <div className="absolute bottom-4 left-4 z-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card className="bg-background/80 backdrop-blur-xl border-white/10 shadow-2xl max-w-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cosmic-purple to-electric-violet animate-pulse" />
              <CardTitle className="text-lg">{node.label}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              ×
            </Button>
          </div>
          <Badge variant="outline" className="mt-2 w-fit">
            {node.type}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(node.properties).slice(0, 4).map(([key, value]) => (
              <div key={key}>
                <div className="text-muted-foreground text-xs">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="font-medium">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export interface GraphConstellationProps {
  data: GraphData
  width?: number
  height?: number
  className?: string
  initialSettings?: Partial<DisplaySettings>
  animated?: boolean
  animationDuration?: number
  onAnimationComplete?: () => void
  // Staged animation properties
  animationMode?: 'continuous' | 'staged'  // Animation mode
  currentStage?: number                     // Which stage to show (0-based)
  stageDuration?: number                    // Duration per stage (default 2000ms)
  onStageComplete?: (stage: number) => void // Callback when stage finishes
  autoAdvanceStages?: boolean              // Auto-progress through stages
}

export function GraphConstellation({ 
  data, 
  width = 800, 
  height = 600, 
  className,
  initialSettings = {},
  animated = false,
  animationDuration = 2000,
  onAnimationComplete,
  animationMode = 'continuous',
  currentStage = 0,
  stageDuration = 2000,
  onStageComplete,
  autoAdvanceStages = false
}: GraphConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [settings, setSettings] = useState<DisplaySettings>({
    showNodeLabels: true,
    showRelationshipLabels: false,
    showControls: true,
    ...initialSettings
  })
  const simulationRef = useRef<d3.Simulation<GraphNode, undefined> | null>(null)
  const [animationKey, setAnimationKey] = useState(0) // Force re-render for replay
  const [internalStage, setInternalStage] = useState(0) // Track current stage internally
  const stageTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Flat brand colors - no gradients
  const nodeColors = [
    '#6366F1', // cosmic-purple
    '#A78BFA', // electric-violet  
    '#818CF8', // luminous-indigo
    '#10B981', // phosphor-cyan
    '#3B82F6', // synaptic-blue
    '#F472B6', // neural-pink
  ]

  const initializeVisualization = useCallback(() => {
    if (!svgRef.current || data.nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Simple defs - no complex gradients or filters for performance
    const defs = svg.append('defs')

    // Main container
    const g = svg.append('g').attr('class', 'graph-container')
    
    // Filter and sort nodes and relationships based on animation mode
    let sortedNodes = [...data.nodes]
    let sortedRelationships = [...data.relationships]
    
    // In staged mode, filter by current stage
    if (animated && animationMode === 'staged') {
      const activeStage = animationMode === 'staged' ? (currentStage ?? internalStage) : Infinity
      
      // Filter to only include nodes/relationships up to current stage
      sortedNodes = sortedNodes.filter(node => (node.animationStage ?? 0) <= activeStage)
      sortedRelationships = sortedRelationships.filter(rel => (rel.animationStage ?? 0) <= activeStage)
      
      // Sort by stage first, then by order within stage
      sortedNodes.sort((a, b) => {
        const stageCompare = (a.animationStage ?? 0) - (b.animationStage ?? 0)
        if (stageCompare !== 0) return stageCompare
        return (a.animationOrder || 0) - (b.animationOrder || 0)
      })
      
      sortedRelationships.sort((a, b) => {
        const stageCompare = (a.animationStage ?? 0) - (b.animationStage ?? 0)
        if (stageCompare !== 0) return stageCompare
        return (a.animationOrder || 0) - (b.animationOrder || 0)
      })
    } else if (animated) {
      // Continuous mode - original behavior
      sortedNodes.sort((a, b) => (a.animationOrder || 0) - (b.animationOrder || 0))
      sortedRelationships.sort((a, b) => (a.animationOrder || 0) - (b.animationOrder || 0))
    }

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Removed background particles for performance

    // Create working copies of nodes for simulation
    const simulationNodes = animated ? [] : data.nodes.map(node => ({
      ...node,
      x: node.x ?? width / 2 + (Math.random() - 0.5) * 100,
      y: node.y ?? height / 2 + (Math.random() - 0.5) * 100
    }))
    
    // Optimized force simulation with faster convergence
    const simulation = d3.forceSimulation<GraphNode>(simulationNodes)
      .force('link', d3.forceLink<GraphNode, GraphRelationship>(animated ? [] : data.relationships)
        .id(d => d.id)
        .distance(120)
        .strength(0.7)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))
      .alphaDecay(0.05) // Faster convergence
      .velocityDecay(0.6) // Faster settling

    simulationRef.current = simulation

    // Create links - flat design
    const linkG = g.append('g').attr('class', 'links')
    
    const link = linkG.selectAll('line')
      .data(animated ? [] : data.relationships)
      .enter().append('line')
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', 2)
      .attr('opacity', animated ? 0 : 0.6)

    // Create link labels - simplified
    const linkLabel = linkG.selectAll('text')
      .data(animated ? [] : data.relationships)
      .enter().append('text')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '10px')
      .attr('fill', '#6B7280')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .style('opacity', animated ? 0 : (settings.showRelationshipLabels ? 0.7 : 0))
      .text(d => d.type)

    // Create nodes group
    const nodeG = g.append('g').attr('class', 'nodes')

    const nodeGroups = nodeG.selectAll('g')
      .data(animated ? [] : simulationNodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, any>()
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
          d.position.fixed = true
        })
      )

    // Add node circles - flat design with brand colors
    const nodes = nodeGroups.append('circle')
      .attr('r', 20)
      .attr('fill', (d, i) => nodeColors[i % nodeColors.length])
      .attr('stroke', 'white')
      .attr('stroke-width', 3)
      .style('transition', 'all 0.2s ease')

    // Removed pulse animation for performance

    // Add node labels - positioned below nodes
    const nodeLabels = nodeGroups.append('text')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', '#1d1d1d')
      .attr('text-anchor', 'middle')
      .attr('dy', '35')  // Position below the node (20px radius + 15px gap)
      .style('pointer-events', 'none')
      .style('opacity', settings.showNodeLabels ? 1 : 0)
      .text(d => d.label.length > 12 ? d.label.slice(0, 12) + '...' : d.label)

    // Click handler
    nodeGroups.on('click', (event, d) => {
      event.stopPropagation()
      setSelectedNode(d)
    })

    // Simplified hover effects for performance
    nodeGroups
      .on('mouseover', function(event, d) {
        // Enlarge node
        d3.select(this).select('circle')
          .transition()
          .duration(150)
          .attr('r', 26)

        // Highlight connected edges
        link.style('opacity', l => 
          (l.source as GraphNode).id === d.id || (l.target as GraphNode).id === d.id ? 1 : 0.3
        )
      })
      .on('mouseout', function(event, d) {
        // Reset node size
        d3.select(this).select('circle')
          .transition()
          .duration(150)
          .attr('r', 20)

        // Reset edge opacity
        link.style('opacity', 0.6)
      })

    // Update positions on tick
    simulation.on('tick', () => {
      // Update straight links
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!)

      // Update link labels
      linkLabel
        .attr('x', d => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
        .attr('y', d => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2)

      // Update node positions
      nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    // Click background to deselect
    svg.on('click', () => {
      setSelectedNode(null)
    })

    // Update visibility based on settings - no filters for performance
    linkLabel.style('opacity', settings.showRelationshipLabels ? 0.7 : 0)
    nodeLabels.style('opacity', settings.showNodeLabels ? 1 : 0)
    
    // Animate nodes and relationships if enabled
    if (animated && animationMode === 'continuous') {
      // Original continuous animation logic
      // Create working copies to avoid modifying original data
      const workingNodes = data.nodes.map(node => ({
        ...node,
        x: width / 2,
        y: height / 2
      }))
      
      // We need to add all data but hide it initially
      const allNodeGroups = nodeG.selectAll('g')
        .data(workingNodes)
        .enter().append('g')
        .attr('cursor', 'pointer')
        .style('opacity', 0)
        .attr('transform', `translate(${width/2},${height/2}) scale(0)`)
        .call(d3.drag<SVGGElement, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.1).restart() // Gentler restart
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.position.fixed = true
            // Keep node fixed after drag - don't clear fx/fy
          })
        )
        
      allNodeGroups.append('circle')
        .attr('r', 20)
        .attr('fill', (d, i) => nodeColors[i % nodeColors.length])
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .style('transition', 'all 0.2s ease')
        
      allNodeGroups.append('text')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', '#1d1d1d')
        .attr('text-anchor', 'middle')
        .attr('dy', '35')
        .style('pointer-events', 'none')
        .text(d => d.label.length > 12 ? d.label.slice(0, 12) + '...' : d.label)
        
      const allLinks = linkG.selectAll('line')
        .data(data.relationships)
        .enter().append('line')
        .attr('stroke', '#E5E7EB')
        .attr('stroke-width', 2)
        .style('opacity', 0)
        
      const allLinkLabels = linkG.selectAll('text')
        .data(data.relationships)
        .enter().append('text')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-size', '10px')
        .attr('fill', '#6B7280')
        .attr('text-anchor', 'middle')
        .attr('dy', -5)
        .style('opacity', 0)
        .text(d => d.type)
      
      // Add click and hover handlers for animated nodes
      allNodeGroups.on('click', (event, d) => {
        event.stopPropagation()
        setSelectedNode(d)
      })

      allNodeGroups
        .on('mouseover', function(event, d) {
          d3.select(this).select('circle')
            .transition()
            .duration(150)
            .attr('r', 26)

          allLinks.style('opacity', l => 
            (l.source as GraphNode).id === d.id || (l.target as GraphNode).id === d.id ? 1 : 0.3
          )
        })
        .on('mouseout', function(event, d) {
          d3.select(this).select('circle')
            .transition()
            .duration(150)
            .attr('r', 20)

          allLinks.style('opacity', 0.6)
        })
      
      // Calculate animation timings
      const maxOrder = Math.max(
        ...sortedNodes.map(n => n.animationOrder || 0),
        ...sortedRelationships.map(r => r.animationOrder || 0)
      )
      const stepDuration = animationDuration / (maxOrder + 1)
      
      // Start the simulation with empty data
      simulation.nodes([])
      simulation.force<d3.ForceLink<GraphNode, GraphRelationship>>('link')!.links([])
      
      // Animate nodes
      sortedNodes.forEach((node, i) => {
        const delay = (node.animationDelay || 0) + (node.animationOrder || i) * stepDuration
        
        setTimeout(() => {
          // Find the working copy of this node
          const workingNode = workingNodes.find(n => n.id === node.id)
          if (!workingNode) return
          
          // Add node to simulation
          const currentNodes = simulation.nodes()
          currentNodes.push(workingNode)
          simulation.nodes(currentNodes)
          simulation.alpha(0.3).restart()
          
          // Animate the visual element
          allNodeGroups
            .filter((d: GraphNode) => d.id === node.id)
            .transition()
            .duration(300)
            .style('opacity', 1)
            .attr('transform', `translate(${width/2},${height/2}) scale(1)`)
            .ease(d3.easeBackOut.overshoot(1.5))
        }, delay)
      })
      
      // Animate relationships
      sortedRelationships.forEach((rel, i) => {
        const delay = (rel.animationDelay || 0) + (rel.animationOrder || i) * stepDuration
        
        setTimeout(() => {
          // Add relationship to simulation
          const currentLinks = simulation.force<d3.ForceLink<GraphNode, GraphRelationship>>('link')!.links()
          currentLinks.push(rel)
          simulation.force<d3.ForceLink<GraphNode, GraphRelationship>>('link')!.links(currentLinks)
          simulation.alpha(0.3).restart()
          
          // Animate the visual element
          allLinks
            .filter((d: GraphRelationship) => d.id === rel.id)
            .transition()
            .duration(300)
            .style('opacity', 0.6)
            
          if (settings.showRelationshipLabels) {
            allLinkLabels
              .filter((d: GraphRelationship) => d.id === rel.id)
              .transition()
              .duration(200)
              .style('opacity', 0.7)
          }
        }, delay)
      })
      
      // Update tick handler for animated elements
      simulation.on('tick', () => {
        allLinks
          .attr('x1', d => (d.source as GraphNode).x!)
          .attr('y1', d => (d.source as GraphNode).y!)
          .attr('x2', d => (d.target as GraphNode).x!)
          .attr('y2', d => (d.target as GraphNode).y!)

        allLinkLabels
          .attr('x', d => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
          .attr('y', d => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2)

        allNodeGroups
          .filter(function() { 
            return d3.select(this).style('opacity') !== '0' // Only update visible nodes
          })
          .attr('transform', d => `translate(${d.x},${d.y}) scale(1)`)
      })
      
      // Call completion callback
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, animationDuration + 500)
      }
    } else if (animated && animationMode === 'staged') {
      // Staged animation logic
      // Create working copies of nodes to avoid modifying original data
      const workingNodes = data.nodes.map(node => ({
        ...node,
        x: node.x ?? width / 2 + (Math.random() - 0.5) * 50,
        y: node.y ?? height / 2 + (Math.random() - 0.5) * 50
      }))
      
      // Create a map for quick node lookup
      const nodeMap = new Map(workingNodes.map(n => [n.id, n]))
      
      // Create working copies of relationships with resolved node references
      const workingRelationships = data.relationships.map(rel => ({
        ...rel,
        source: typeof rel.source === 'string' ? rel.source : rel.source.id,
        target: typeof rel.target === 'string' ? rel.target : rel.target.id
      }))
      
      // Get nodes and relationships for current stage only
      const currentStageNodes = sortedNodes.filter(n => (n.animationStage ?? 0) === (currentStage ?? internalStage))
      const currentStageRelationships = workingRelationships.filter(r => (r.animationStage ?? 0) === (currentStage ?? internalStage))
      
      // We need all nodes in the simulation but only animate current stage
      const allNodeGroups = nodeG.selectAll('g')
        .data(workingNodes)
        .enter().append('g')
        .attr('cursor', 'pointer')
        .style('opacity', d => {
          // Show if from previous stage or being animated now
          return (d.animationStage ?? 0) < (currentStage ?? internalStage) ? 1 : 0
        })
        .attr('transform', d => {
          // Previous stages are already positioned, new ones start from center
          if ((d.animationStage ?? 0) < (currentStage ?? internalStage)) {
            // Use current position if available, otherwise center
            return `translate(${d.x ?? width/2},${d.y ?? height/2}) scale(1)`
          }
          return `translate(${width/2},${height/2}) scale(0)`
        })
        .call(d3.drag<SVGGElement, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.1).restart() // Gentler restart
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.position.fixed = true
            // Keep node fixed after drag - don't clear fx/fy
          })
        )
        
      allNodeGroups.append('circle')
        .attr('r', 20)
        .attr('fill', (d, i) => nodeColors[i % nodeColors.length])
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .style('transition', 'all 0.2s ease')
        
      allNodeGroups.append('text')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', '#1d1d1d')
        .attr('text-anchor', 'middle')
        .attr('dy', '35')
        .style('pointer-events', 'none')
        .text(d => d.label.length > 12 ? d.label.slice(0, 12) + '...' : d.label)
        
      // Create links with proper source/target references
      const allLinks = linkG.selectAll('line')
        .data(workingRelationships)
        .enter().append('line')
        .attr('stroke', '#E5E7EB')
        .attr('stroke-width', 2)
        .style('opacity', d => {
          // Show if from previous stage
          return (d.animationStage ?? 0) < (currentStage ?? internalStage) ? 0.6 : 0
        })
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 0)
        
      const allLinkLabels = linkG.selectAll('text')
        .data(workingRelationships)
        .enter().append('text')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-size', '10px')
        .attr('fill', '#6B7280')
        .attr('text-anchor', 'middle')
        .attr('dy', -5)
        .style('opacity', 0)
        .text(d => d.type)
      
      // Add click and hover handlers
      allNodeGroups.on('click', (event, d) => {
        event.stopPropagation()
        setSelectedNode(d)
      })

      allNodeGroups
        .on('mouseover', function(event, d) {
          d3.select(this).select('circle')
            .transition()
            .duration(150)
            .attr('r', 26)

          allLinks.style('opacity', l => {
            const isConnected = (l.source as any).id === d.id || (l.target as any).id === d.id
            const isPreviousStage = (l.animationStage ?? 0) <= (currentStage ?? internalStage)
            return isConnected && isPreviousStage ? 1 : isPreviousStage ? 0.3 : 0
          })
        })
        .on('mouseout', function(event, d) {
          d3.select(this).select('circle')
            .transition()
            .duration(150)
            .attr('r', 20)

          allLinks.style('opacity', l => (l.animationStage ?? 0) <= (currentStage ?? internalStage) ? 0.6 : 0)
        })
      
      // Start simulation with all nodes from previous stages
      const previousNodes = workingNodes.filter(n => (n.animationStage ?? 0) < (currentStage ?? internalStage))
      const previousLinks = workingRelationships.filter(r => (r.animationStage ?? 0) < (currentStage ?? internalStage))
      
      // Initialize simulation with nodes first
      simulation.nodes(previousNodes)
      
      // Then set up links - D3 will resolve string IDs to node references
      const forceLink = simulation.force<d3.ForceLink<GraphNode, GraphRelationship>>('link')!
      forceLink.links(previousLinks)
      
      // Force initial ticks to resolve references and calculate positions
      simulation.alpha(1).restart()
      for (let i = 0; i < 100; i++) {
        simulation.tick()
      }
      simulation.stop()
      
      // Update initial positions for visible elements
      allNodeGroups
        .filter((d: GraphNode) => (d.animationStage ?? 0) < (currentStage ?? internalStage))
        .attr('transform', d => `translate(${d.x ?? width/2},${d.y ?? height/2}) scale(1)`)
      
      allLinks
        .filter((d: GraphRelationship) => (d.animationStage ?? 0) < (currentStage ?? internalStage))
        .attr('x1', d => {
          const source = d.source as any
          return source.x ?? 0
        })
        .attr('y1', d => {
          const source = d.source as any
          return source.y ?? 0
        })
        .attr('x2', d => {
          const target = d.target as any
          return target.x ?? 0
        })
        .attr('y2', d => {
          const target = d.target as any
          return target.y ?? 0
        })
      
      // Restart simulation with lower alpha
      simulation.alpha(0.3).restart()
      
      // Calculate animation timings for current stage
      const stageStartTime = Date.now()
      const stepDuration = stageDuration / Math.max(currentStageNodes.length + currentStageRelationships.length, 1)
      
      // Animate nodes for current stage
      currentStageNodes.forEach((node, i) => {
        const delay = (node.animationDelay || 0) + (node.animationOrder || i) * stepDuration
        
        setTimeout(() => {
          // Find the working copy of this node
          const workingNode = workingNodes.find(n => n.id === node.id)
          if (!workingNode) return
          
          // Preserve existing node positions before adding new node
          const currentNodes = simulation.nodes()
          const existingPositions = new Map()
          
          currentNodes.forEach(existingNode => {
            existingPositions.set(existingNode.id, {
              x: existingNode.x,
              y: existingNode.y,
              fx: existingNode.fx,
              fy: existingNode.fy
            })
          })
          
          // Add node to simulation
          currentNodes.push(workingNode)
          simulation.nodes(currentNodes)
          
          // Restore positions for existing nodes
          currentNodes.forEach(simNode => {
            const savedPos = existingPositions.get(simNode.id)
            if (savedPos) {
              simNode.x = savedPos.x
              simNode.y = savedPos.y
              simNode.fx = savedPos.fx
              simNode.fy = savedPos.fy
            }
          })
          
          // Use gentler restart for new node
          simulation.alpha(0.1).restart()
          
          // Animate the visual element
          allNodeGroups
            .filter((d: GraphNode) => d.id === node.id)
            .transition()
            .duration(300)
            .style('opacity', 1)
            .attr('transform', `translate(${width/2},${height/2}) scale(1)`)
            .ease(d3.easeBackOut.overshoot(1.5))
        }, delay)
      })
      
      // Animate relationships for current stage
      currentStageRelationships.forEach((rel, i) => {
        const delay = (rel.animationDelay || 0) + (rel.animationOrder || i) * stepDuration
        
        setTimeout(() => {
          // Check if both source and target nodes exist in simulation
          const currentNodes = simulation.nodes()
          const sourceExists = currentNodes.some(n => n.id === (typeof rel.source === 'string' ? rel.source : (rel.source as GraphNode).id))
          const targetExists = currentNodes.some(n => n.id === (typeof rel.target === 'string' ? rel.target : (rel.target as GraphNode).id))
          
          if (sourceExists && targetExists) {
            // Find the working relationship
            const workingRel = workingRelationships.find(r => r.id === rel.id)
            if (!workingRel) return
            
            // Preserve existing node positions before adding new relationship
            const currentNodes = simulation.nodes()
            const existingPositions = new Map()
            
            currentNodes.forEach(existingNode => {
              existingPositions.set(existingNode.id, {
                x: existingNode.x,
                y: existingNode.y,
                fx: existingNode.fx,
                fy: existingNode.fy
              })
            })
            
            // Add relationship to simulation
            const currentLinks = simulation.force<d3.ForceLink<GraphNode, GraphRelationship>>('link')!.links()
            currentLinks.push(workingRel)
            simulation.force<d3.ForceLink<GraphNode, GraphRelationship>>('link')!.links(currentLinks)
            
            // Restore positions for existing nodes
            currentNodes.forEach(simNode => {
              const savedPos = existingPositions.get(simNode.id)
              if (savedPos) {
                simNode.x = savedPos.x
                simNode.y = savedPos.y
                simNode.fx = savedPos.fx
                simNode.fy = savedPos.fy
              }
            })
            
            // Use very gentle restart for relationships
            simulation.alpha(0.05).restart()
            
            // Animate the visual element
            allLinks
              .filter((d: GraphRelationship) => d.id === rel.id)
              .transition()
              .duration(300)
              .style('opacity', 0.6)
              
            if (settings.showRelationshipLabels) {
              allLinkLabels
                .filter((d: GraphRelationship) => d.id === rel.id)
                .transition()
                .duration(200)
                .style('opacity', 0.7)
            }
          } else {
            console.warn(`Skipping relationship ${rel.id}: source or target node not yet in simulation`)
          }
        }, delay)
      })
      
      // Update tick handler
      simulation.on('tick', () => {
        allLinks
          .attr('x1', d => {
            const source = d.source as any
            return source.x ?? 0
          })
          .attr('y1', d => {
            const source = d.source as any
            return source.y ?? 0
          })
          .attr('x2', d => {
            const target = d.target as any
            return target.x ?? 0
          })
          .attr('y2', d => {
            const target = d.target as any
            return target.y ?? 0
          })

        allLinkLabels
          .attr('x', d => {
            const source = d.source as any
            const target = d.target as any
            return ((source.x ?? 0) + (target.x ?? 0)) / 2
          })
          .attr('y', d => {
            const source = d.source as any
            const target = d.target as any
            return ((source.y ?? 0) + (target.y ?? 0)) / 2
          })

        allNodeGroups
          .filter(function() { 
            return d3.select(this).style('opacity') !== '0'
          })
          .attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0}) scale(1)`)
      })
      
      // Handle stage completion
      if (currentStageNodes.length > 0 || currentStageRelationships.length > 0) {
        const stageCompletionTime = stageDuration + 500
        
        if (stageTimeoutRef.current) {
          clearTimeout(stageTimeoutRef.current)
        }
        
        stageTimeoutRef.current = setTimeout(() => {
          if (onStageComplete) {
            onStageComplete(currentStage ?? internalStage)
          }
          
          // Auto-advance if enabled
          if (autoAdvanceStages) {
            const nodeStages = data.nodes.map(n => n.animationStage ?? 0).filter(stage => !isNaN(stage))
            const relStages = data.relationships.map(r => r.animationStage ?? 0).filter(stage => !isNaN(stage))
            const maxStage = Math.max(...nodeStages, ...relStages, 0)
            
            if ((currentStage ?? internalStage) < maxStage) {
              setInternalStage(prev => prev + 1)
            } else if (onAnimationComplete) {
              onAnimationComplete()
            }
          }
        }, stageCompletionTime)
      }
    }

  }, [data, width, height, settings, animated, animationDuration, onAnimationComplete, animationKey, animationMode, currentStage, stageDuration, onStageComplete, autoAdvanceStages, internalStage])

  const handleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  
  const handleReplayAnimation = () => {
    setAnimationKey(prev => prev + 1) // Trigger re-render with new key
  }

  useEffect(() => {
    initializeVisualization()
  }, [initializeVisualization, animationKey])

  // Sync internal stage with external currentStage prop
  useEffect(() => {
    if (animationMode === 'staged' && currentStage !== undefined) {
      setInternalStage(currentStage)
    }
  }, [currentStage, animationMode])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-lg bg-white',
        isFullscreen && 'fixed inset-0 z-50',
        className
      )}
    >
      <svg
        ref={svgRef}
        width={isFullscreen ? window.innerWidth : width}
        height={isFullscreen ? window.innerHeight : height}
        className="w-full h-full"
        style={{
          background: 'white'
        }}
      />
      
      {settings.showControls && (
        <MinimalControls
          settings={settings}
          onSettingsChange={setSettings}
          onFullscreen={handleFullscreen}
          isFullscreen={isFullscreen}
          animated={animated}
          onReplayAnimation={handleReplayAnimation}
        />
      )}
      
      <NodeDetails 
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  )
}