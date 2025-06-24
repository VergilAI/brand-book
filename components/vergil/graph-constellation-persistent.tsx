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

export interface GraphConstellationPersistentProps {
  data: GraphData
  width?: number
  height?: number
  className?: string
  initialSettings?: Partial<DisplaySettings>
  currentStage?: number                     // Which stage to show (0-based)
  stageDuration?: number                    // Duration per stage (default 2000ms)
  onStageComplete?: (stage: number) => void // Callback when stage finishes
  enableBoundaries?: boolean                // Whether to constrain nodes to canvas bounds (default true)
  initialPosition?: { x: number, y: number } // Initial center position for nodes (default center)
  anchorElementId?: string                  // ID of element to anchor graph position to
  anchorOffset?: { x: number, y: number }  // Offset from anchor element (default: center of element)
}

export function GraphConstellationPersistent({ 
  data, 
  width = 800, 
  height = 600, 
  className,
  initialSettings = {},
  currentStage = 0,
  stageDuration = 2000,
  onStageComplete,
  enableBoundaries = true,
  initialPosition,
  anchorElementId,
  anchorOffset = { x: 0, y: 0 }
}: GraphConstellationPersistentProps) {
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
  const [isInitialized, setIsInitialized] = useState(false)
  const [calculatedPosition, setCalculatedPosition] = useState<{ x: number, y: number } | null>(null)
  const stageTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousStageRef = useRef<number>(currentStage)
  const currentStageRef = useRef<number>(currentStage)
  const floatingMotionRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveredRef = useRef<boolean>(false)
  const isScrollingRef = useRef<boolean>(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const workingNodesRef = useRef<GraphNode[]>([])
  const motionTimeRef = useRef<number>(0)
  const transitionStartTimeRef = useRef<number>(0)
  const isTransitioningRef = useRef<boolean>(false)
  const nodeFloatingStatesRef = useRef<Map<string, {
    baseX: number
    baseY: number
    offsetX: number
    offsetY: number
    phaseX: number
    phaseY: number
    amplitudeX: number
    amplitudeY: number
  }>>(new Map())

  // Get node color based on type
  const getNodeColor = (node: GraphNode) => {
    switch (node.type) {
      case 'Person':
        return '#10B981' // Green for person nodes
      case 'Concept':
        return '#A78BFA' // Brighter brand purple for A nodes (concepts)
      case 'Example':
        return '#0EA5E9' // Sky blue for B nodes (examples) - more distinct from purple
      default:
        return '#9CA3AF' // Gray for unknown types
    }
  }

  // Smooth floating motion like petals on water
  const applyFloatingMotion = useCallback(() => {
    if (!simulationRef.current || isHoveredRef.current || isScrollingRef.current || workingNodesRef.current.length === 0) {
      return
    }

    const simulation = simulationRef.current
    const nodes = workingNodesRef.current
    
    // Stop the force simulation for smooth floating
    simulation.alpha(0).stop()

    // Increment time for smooth sinusoidal motion
    motionTimeRef.current += 0.02 // Slow, gentle progression

    // Debug: Check which nodes are visible but missing floating states
    const visibleNodes = nodes.filter(node => (node.animationStage ?? 0) <= currentStageRef.current && node.x !== undefined && node.y !== undefined)
    const missingStates = visibleNodes.filter(node => !nodeFloatingStatesRef.current.has(node.id))
    if (missingStates.length > 0) {
      console.log(`[FLOATING] Found ${missingStates.length} nodes missing floating states:`, missingStates.map(n => n.id))
    }

    // Apply smooth floating motion to visible nodes
    nodes.forEach(node => {
      // Only apply motion to visible nodes
      const nodeStage = node.animationStage ?? 0
      const shouldFloat = nodeStage <= currentStageRef.current
      
      // Debug: Log currentStage value to see if it's correct
      if (motionTimeRef.current % 2 < 0.02) {
        console.log(`[FLOATING] Motion check - currentStage: ${currentStageRef.current}, node ${node.id} stage: ${nodeStage}, shouldFloat: ${shouldFloat}`)
      }
      
      if (shouldFloat && node.x !== undefined && node.y !== undefined) {
        
        // Initialize floating state for this node if not exists
        if (!nodeFloatingStatesRef.current.has(node.id)) {
          console.log(`[FLOATING] Initializing missing floating state for ${node.id}`)
          nodeFloatingStatesRef.current.set(node.id, {
            baseX: node.x,
            baseY: node.y,
            offsetX: 0,
            offsetY: 0,
            phaseX: Math.random() * Math.PI * 2, // Random phase offset
            phaseY: Math.random() * Math.PI * 2,
            amplitudeX: 6 + Math.random() * 8, // 6-14 pixel amplitude - more pronounced
            amplitudeY: 6 + Math.random() * 8
          })
        }

        const floatingState = nodeFloatingStatesRef.current.get(node.id)!
        
        // Calculate smooth sinusoidal movement
        const timeX = motionTimeRef.current + floatingState.phaseX
        const timeY = motionTimeRef.current + floatingState.phaseY
        
        // Different frequencies for X and Y create organic figure-8 like motion
        const newOffsetX = Math.sin(timeX * 1.0) * floatingState.amplitudeX // Increased frequency
        const newOffsetY = Math.sin(timeY * 0.8) * floatingState.amplitudeY // Increased frequency
        
        // Add gentle drift over time
        const driftX = Math.sin(timeX * 0.15) * 1.0 // Slightly more drift
        const driftY = Math.cos(timeY * 0.12) * 1.0
        
        // Calculate target position
        let targetX = floatingState.baseX + newOffsetX + driftX
        let targetY = floatingState.baseY + newOffsetY + driftY
        
        // Apply boundary checking only if enabled
        if (enableBoundaries) {
          // Larger boundary box - keep nodes well within canvas
          const margin = 30 // Reduced from 50 for larger movement area
          const maxX = width - margin
          const maxY = height - margin
          
          // Gentle boundary reflection - if hitting edges, adjust base position inward
          if (targetX < margin) {
            floatingState.baseX = Math.min(floatingState.baseX + 1, width / 2)
            targetX = floatingState.baseX + newOffsetX
          }
          if (targetX > maxX) {
            floatingState.baseX = Math.max(floatingState.baseX - 1, width / 2)
            targetX = floatingState.baseX + newOffsetX
          }
          if (targetY < margin) {
            floatingState.baseY = Math.min(floatingState.baseY + 1, height / 2)
            targetY = floatingState.baseY + newOffsetY
          }
          if (targetY > maxY) {
            floatingState.baseY = Math.max(floatingState.baseY - 1, height / 2)
            targetY = floatingState.baseY + newOffsetY
          }
        }

        // Apply smooth position with interpolation for even smoother motion
        let smoothing = 0.1
        
        // During transition from hover to floating, use extra smooth interpolation
        if (isTransitioningRef.current) {
          const transitionDuration = 1000 // 1 second transition
          const elapsed = motionTimeRef.current - transitionStartTimeRef.current
          const transitionProgress = Math.min(elapsed / (transitionDuration * 0.02), 1) // 0.02 is our time increment
          
          // Start with very smooth interpolation and gradually increase to normal
          smoothing = 0.02 + (0.08 * transitionProgress) // 0.02 -> 0.1 over transition
          
          // End transition when complete
          if (transitionProgress >= 1) {
            isTransitioningRef.current = false
          }
        }
        
        node.x = node.x + (targetX - node.x) * smoothing
        node.y = node.y + (targetY - node.y) * smoothing
        
        // Update node positions directly without fixing them
        // We'll let the floating motion control positions without D3 force interference
        
        // Debug: Log floating motion application every few frames
        if (motionTimeRef.current % 2 < 0.02) { // Log every ~100 frames
          console.log(`[FLOATING] Applying motion to ${node.id} (stage ${nodeStage}) - currentStage: ${currentStage}`)
        }
      }
    })

    // Manually trigger a position update without force calculations
    if (elementsRef.current.allNodeGroups) {
      elementsRef.current.allNodeGroups
        .filter((d: GraphNode) => (d.animationStage ?? 0) <= currentStageRef.current)
        .attr('transform', (d: GraphNode) => `translate(${d.x ?? 0},${d.y ?? 0}) scale(1)`)
    }

    // Update link positions
    if (elementsRef.current.allLinks) {
      elementsRef.current.allLinks
        .attr('x1', d => {
          const source = d.source as GraphNode
          return source.x ?? 0
        })
        .attr('y1', d => {
          const source = d.source as GraphNode
          return source.y ?? 0
        })
        .attr('x2', d => {
          const target = d.target as GraphNode
          return target.x ?? 0
        })
        .attr('y2', d => {
          const target = d.target as GraphNode
          return target.y ?? 0
        })
    }

    // Update link label positions
    if (elementsRef.current.allLinkLabels) {
      elementsRef.current.allLinkLabels
        .attr('x', d => {
          const source = d.source as GraphNode
          const target = d.target as GraphNode
          return ((source.x ?? 0) + (target.x ?? 0)) / 2
        })
        .attr('y', d => {
          const source = d.source as GraphNode
          const target = d.target as GraphNode
          return ((source.y ?? 0) + (target.y ?? 0)) / 2
        })
    }
  }, [width, height])
  
  // Update currentStage ref when currentStage changes
  useEffect(() => {
    currentStageRef.current = currentStage
  }, [currentStage])

  // Calculate position based on anchor element
  const calculateAnchorPosition = useCallback(() => {
    if (!anchorElementId) {
      return initialPosition || { x: width / 2, y: height / 2 }
    }

    const anchorElement = document.getElementById(anchorElementId)
    if (!anchorElement) {
      console.warn(`Anchor element with id "${anchorElementId}" not found`)
      return initialPosition || { x: width / 2, y: height / 2 }
    }

    const rect = anchorElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    return {
      x: centerX + anchorOffset.x,
      y: centerY + anchorOffset.y
    }
  }, [anchorElementId, anchorOffset, initialPosition, width, height])

  // Track anchor element position changes
  useEffect(() => {
    if (!anchorElementId) {
      setCalculatedPosition(initialPosition || { x: width / 2, y: height / 2 })
      return
    }

    const updatePosition = () => {
      const newPosition = calculateAnchorPosition()
      setCalculatedPosition(newPosition)
    }

    // Initial calculation
    updatePosition()

    // Listen for resize events only (not scroll to avoid parallax effect)
    const handlePositionChange = () => {
      // Only update position if not currently scrolling to avoid parallax effect
      if (!isScrollingRef.current) {
        updatePosition()
      }
    }

    window.addEventListener('resize', handlePositionChange)
    // Remove scroll listener to prevent parallax effect during scrolling
    
    // Use ResizeObserver for more precise element tracking
    const anchorElement = document.getElementById(anchorElementId)
    let resizeObserver: ResizeObserver | null = null
    
    if (anchorElement && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(handlePositionChange)
      resizeObserver.observe(anchorElement)
    }

    return () => {
      window.removeEventListener('resize', handlePositionChange)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [anchorElementId, calculateAnchorPosition, initialPosition, width, height, anchorOffset])

  // Update position when initialPosition changes (for smooth transitions)
  useEffect(() => {
    if (!anchorElementId && initialPosition) {
      setCalculatedPosition(initialPosition)
    }
  }, [initialPosition, anchorElementId])

  // Update simulation forces when anchor position changes
  useEffect(() => {
    if (!simulationRef.current || !calculatedPosition) return

    const simulation = simulationRef.current
    
    // Get current center position
    const currentCenter = simulation.force('center') as d3.ForceCenter<GraphNode>
    const currentX = currentCenter ? currentCenter.x() : width / 2
    const currentY = currentCenter ? currentCenter.y() : height / 2
    
    // Calculate delta
    const deltaX = calculatedPosition.x - currentX
    const deltaY = calculatedPosition.y - currentY
    
    // Move all nodes by the delta for instant position update
    simulation.nodes().forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        node.x += deltaX
        node.y += deltaY
        // Update floating states too
        const floatingState = nodeFloatingStatesRef.current.get(node.id)
        if (floatingState) {
          floatingState.baseX += deltaX
          floatingState.baseY += deltaY
        }
      }
    })
    
    // Update force centers
    simulation
      .force('center', d3.forceCenter(calculatedPosition.x, calculatedPosition.y))
      .force('x', d3.forceX(calculatedPosition.x).strength(0.15))
      .force('y', d3.forceY(calculatedPosition.y).strength(0.15))
      .alpha(0.2) // Low energy for smooth transition
      .restart()
      
    console.log('Updated graph center to:', calculatedPosition)
  }, [calculatedPosition, width, height])

  // Start/stop floating motion
  const startFloatingMotion = useCallback(() => {
    console.log('Starting floating motion...')
    if (floatingMotionRef.current) {
      clearInterval(floatingMotionRef.current)
    }
    
    // Start with smooth transition
    isTransitioningRef.current = true
    transitionStartTimeRef.current = motionTimeRef.current
    
    floatingMotionRef.current = setInterval(applyFloatingMotion, 50) // Every 50ms for very smooth motion
    console.log('Floating motion interval set:', floatingMotionRef.current)
  }, [applyFloatingMotion])

  const stopFloatingMotion = useCallback(() => {
    if (floatingMotionRef.current) {
      clearInterval(floatingMotionRef.current)
      floatingMotionRef.current = null
    }
  }, [])

  // Hover handlers for floating motion control
  const handleNodeMouseEnter = useCallback(() => {
    isHoveredRef.current = true
    stopFloatingMotion()
  }, [stopFloatingMotion])

  const handleNodeMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    // Resume motion after a short delay
    setTimeout(startFloatingMotion, 500)
  }, [startFloatingMotion])

  const initializeVisualization = useCallback(() => {
    if (!svgRef.current || data.nodes.length === 0 || isInitialized) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Simple defs - no complex gradients or filters for performance
    const defs = svg.append('defs')

    // Main container
    const g = svg.append('g').attr('class', 'graph-container')

    // Create working copies of all nodes with initial positioning near final center
    // Force anchor position calculation to get correct center immediately
    const anchorPosition = anchorElementId ? calculateAnchorPosition() : null
    const centerX = anchorPosition?.x ?? calculatedPosition?.x ?? initialPosition?.x ?? width * 0.75
    const centerY = anchorPosition?.y ?? calculatedPosition?.y ?? initialPosition?.y ?? height * 0.7
    
    // First, find which concept each example is connected to
    const exampleToConceptMap = new Map<string, string>()
    data.relationships.forEach(rel => {
      const sourceNode = data.nodes.find(n => n.id === rel.source)
      const targetNode = data.nodes.find(n => n.id === rel.target)
      
      if (sourceNode?.type === 'Concept' && targetNode?.type === 'Example') {
        exampleToConceptMap.set(targetNode.id, sourceNode.id)
      } else if (targetNode?.type === 'Concept' && sourceNode?.type === 'Example') {
        exampleToConceptMap.set(sourceNode.id, targetNode.id)
      }
    })

    const workingNodes = data.nodes.map((node, index) => {
      // Better distribution strategy - position nodes based on their relationships
      let x: number
      let y: number
      
      if (node.type === 'Concept') {
        // Place A nodes (Concepts) in a diamond pattern
        const conceptNodes = data.nodes.filter(n => n.type === 'Concept')
        const conceptIndex = conceptNodes.findIndex(n => n.id === node.id)
        // Rotate positions 90 degrees clockwise by swapping and negating
        const positions = [
          { x: 80, y: 0 },     // Right (was Top)
          { x: 0, y: 80 },     // Bottom (was Right)
          { x: -80, y: 0 },    // Left (was Bottom)
          { x: 0, y: -80 }     // Top (was Left)
        ]
        const pos = positions[conceptIndex % positions.length]
        x = centerX + pos.x
        y = centerY + pos.y
      } else if (node.type === 'Example') {
        // Place B nodes near their connected A node
        const connectedConceptId = exampleToConceptMap.get(node.id)
        if (connectedConceptId) {
          const conceptNode = data.nodes.find(n => n.id === connectedConceptId)
          if (conceptNode) {
            // Find all examples connected to this concept
            const connectedExamples = data.nodes.filter(n => 
              n.type === 'Example' && exampleToConceptMap.get(n.id) === connectedConceptId
            )
            const exampleIndex = connectedExamples.findIndex(n => n.id === node.id)
            const totalExamples = connectedExamples.length
            
            // Position examples in an arc around their concept
            const conceptNodes = data.nodes.filter(n => n.type === 'Concept')
            const conceptIndex = conceptNodes.findIndex(n => n.id === connectedConceptId)
            const baseAngle = (conceptIndex * Math.PI / 2) + Math.PI / 4 // 45-degree offset per concept
            const angleSpread = Math.PI / 3 // 60-degree arc
            const angleOffset = -angleSpread / 2 + (exampleIndex / Math.max(totalExamples - 1, 1)) * angleSpread
            const angle = baseAngle + angleOffset
            const radius = 140 + Math.random() * 20
            
            x = centerX + Math.cos(angle) * radius
            y = centerY + Math.sin(angle) * radius
          } else {
            // Fallback if concept not found
            const angle = (index / data.nodes.length) * 2 * Math.PI
            x = centerX + Math.cos(angle) * 180
            y = centerY + Math.sin(angle) * 180
          }
        } else {
          // Fallback if no connection found
          const angle = (index / data.nodes.length) * 2 * Math.PI
          x = centerX + Math.cos(angle) * 180
          y = centerY + Math.sin(angle) * 180
        }
      } else {
        // Person node - place to the left of concepts
        x = centerX - 200
        y = centerY
      }
      
      return {
        ...node,
        x: node.x ?? x,
        y: node.y ?? y
      }
    })

    // Store working nodes reference for Brownian motion
    workingNodesRef.current = workingNodes

    // Create working copies of relationships
    const workingRelationships = data.relationships.map(rel => ({
      ...rel,
      source: typeof rel.source === 'string' ? rel.source : rel.source.id,
      target: typeof rel.target === 'string' ? rel.target : rel.target.id
    }))

    // No zoom behavior - removed to prevent conflict with page scrolling

    // Create force simulation with ALL nodes and relationships
    const simulation = d3.forceSimulation<GraphNode>(workingNodes)
      .force('link', d3.forceLink<GraphNode, GraphRelationship>(workingRelationships)
        .id(d => d.id)
        .distance(150) // Increased distance for better spacing
        .strength(0.2) // Lower strength for more flexibility
      )
      .force('charge', d3.forceManyBody().strength(-400)) // Reduced repulsion to keep nodes closer together
      .force('center', d3.forceCenter(
        calculatedPosition?.x ?? initialPosition?.x ?? width * 0.75, 
        calculatedPosition?.y ?? initialPosition?.y ?? height * 0.7
      ))
      .force('collision', d3.forceCollide().radius(25)) // Smaller collision for smaller nodes
      .force('x', d3.forceX(calculatedPosition?.x ?? initialPosition?.x ?? width * 0.75).strength(0.1)) // Even stronger rightward pull
      .force('y', d3.forceY(calculatedPosition?.y ?? initialPosition?.y ?? height * 0.7).strength(0.1)) // Even stronger downward pull
      .alphaDecay(0.1) // Faster convergence to settle quickly
      .velocityDecay(0.8) // Higher velocity decay for less movement

    simulationRef.current = simulation
    
    // Stop the simulation immediately after a brief settling period to prevent swooshing
    setTimeout(() => {
      simulation.stop()
      // Fix all node positions to prevent further movement
      workingNodes.forEach(node => {
        node.fx = node.x
        node.fy = node.y
      })
    }, 500) // Brief settling period

    // Create links for ALL relationships (initially hidden)
    const linkG = g.append('g').attr('class', 'links')
    
    const allLinks = linkG.selectAll('line')
      .data(workingRelationships)
      .enter().append('line')
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', 2)
      .style('opacity', d => {
        // Initially only show relationships from previous stages (current stage = 0 initially)
        const sourceNode = data.nodes.find(n => n.id === (typeof d.source === 'string' ? d.source : d.source.id))
        const targetNode = data.nodes.find(n => n.id === (typeof d.target === 'string' ? d.target : d.target.id))
        const sourceStage = sourceNode?.animationStage ?? 0
        const targetStage = targetNode?.animationStage ?? 0
        const relStage = d.animationStage ?? 0
        
        return relStage < currentStage && sourceStage <= currentStage && targetStage <= currentStage ? 0.3 : 0
      })
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)

    // Create link labels for ALL relationships (initially hidden)
    const allLinkLabels = linkG.selectAll('text')
      .data(workingRelationships)
      .enter().append('text')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '10px')
      .attr('fill', '#6B7280')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .style('opacity', d => {
        if (!settings.showRelationshipLabels) return 0
        
        // Initially only show labels for relationships from previous stages
        const sourceNode = data.nodes.find(n => n.id === (typeof d.source === 'string' ? d.source : d.source.id))
        const targetNode = data.nodes.find(n => n.id === (typeof d.target === 'string' ? d.target : d.target.id))
        const sourceStage = sourceNode?.animationStage ?? 0
        const targetStage = targetNode?.animationStage ?? 0
        const relStage = d.animationStage ?? 0
        
        return relStage < currentStage && sourceStage <= currentStage && targetStage <= currentStage ? 0.7 : 0
      })
      .text(d => d.type)

    // Create nodes group for ALL nodes
    const nodeG = g.append('g').attr('class', 'nodes')

    const allNodeGroups = nodeG.selectAll('g')
      .data(workingNodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .style('opacity', 0) // Start all nodes invisible - they will animate in via stage transitions
      .attr('transform', d => {
        if ((d.animationStage ?? 0) <= currentStage) {
          return `translate(${d.x ?? calculatedPosition?.x ?? initialPosition?.x ?? width/2},${d.y ?? calculatedPosition?.y ?? initialPosition?.y ?? height/2}) scale(1)`
        }
        return `translate(${calculatedPosition?.x ?? initialPosition?.x ?? width/2},${calculatedPosition?.y ?? initialPosition?.y ?? height/2}) scale(0)`
      })
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          // Stop floating motion and reactivate force simulation for dragging
          isHoveredRef.current = true
          if (floatingMotionRef.current) {
            clearInterval(floatingMotionRef.current)
            floatingMotionRef.current = null
          }
          
          if (!event.active) simulation.alphaTarget(0.1).restart()
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
          
          // Immediately capture the final drag position BEFORE clearing fx/fy
          const finalX = d.fx
          const finalY = d.fy
          
          // Update the floating state with the exact drag end position
          const floatingState = nodeFloatingStatesRef.current.get(d.id)
          if (floatingState && finalX !== null && finalY !== null) {
            floatingState.baseX = finalX
            floatingState.baseY = finalY
            floatingState.offsetX = 0
            floatingState.offsetY = 0
          }
          
          // Update D3 node position to match drag position
          d.x = finalX
          d.y = finalY
          
          // Resume floating motion after drag ends
          isHoveredRef.current = false
          setTimeout(() => {
            if (!isHoveredRef.current) {
              console.log('Restarting floating motion after drag...')
              
              if (floatingMotionRef.current) {
                clearInterval(floatingMotionRef.current)
              }
              floatingMotionRef.current = setInterval(applyFloatingMotion, 50)
            }
          }, 1000) // Longer delay after drag
        })
      )

    // Add node circles
    allNodeGroups.append('circle')
      .attr('r', 16) // Smaller nodes
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', '#FAFAFA') // Off-white/gray background color
      .attr('stroke-width', 2) // Thinner stroke for smaller nodes
      .style('transition', 'all 0.2s ease')

    // Add node label cards (background rectangles)
    const labelGroups = allNodeGroups.append('g')
      .attr('class', 'label-group')
      .attr('transform', 'translate(0, 30)') // Closer to smaller nodes
      .style('pointer-events', 'none')
      .style('opacity', settings.showNodeLabels ? 0.2 : 0) // Very low opacity by default

    // Add background cards for labels
    const labelBgs = labelGroups.append('rect')
      .attr('rx', 6) // Nice corner roundness, not too pill-like
      .attr('ry', 6)
      .attr('fill', 'white')
      .attr('stroke', 'none')
      .style('filter', 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12))') // All-around shadow for better separation

    // Add text labels
    const labelTexts = labelGroups.append('text')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', '#374151')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .text(d => d.label.length > 14 ? d.label.slice(0, 14) + '...' : d.label)

    // Size background rectangles based on text width
    labelTexts.each(function(d) {
      const textElement = this as SVGTextElement
      const bbox = textElement.getBBox()
      const bg = d3.select(textElement.parentNode).select('rect')
      bg.attr('x', -bbox.width / 2 - 8)
        .attr('y', -bbox.height / 2 - 4)
        .attr('width', bbox.width + 16)
        .attr('height', bbox.height + 8)
    })

    // Click handler
    allNodeGroups.on('click', (event, d) => {
      event.stopPropagation()
      setSelectedNode(d)
    })

    // Store element references for later updates
    elementsRef.current = {
      allNodeGroups,
      allLinks,
      allLinkLabels
    }

    // Store the hover handlers setup function in elementsRef so it can be called later
    elementsRef.current.setupHoverHandlers = (currentStageValue: number) => {
      if (!allNodeGroups || !allLinks) return

      allNodeGroups
        .on('mouseover', function(event, d) {
          // Stop floating motion and reactivate force simulation
          isHoveredRef.current = true
          if (floatingMotionRef.current) {
            clearInterval(floatingMotionRef.current)
            floatingMotionRef.current = null
          }
          
          // Reactivate force simulation for interactive behavior
          if (simulationRef.current) {
            simulationRef.current.alpha(0.1).restart()
          }
          
          // Smaller hover size increase for smaller nodes
          d3.select(this).select('circle')
            .transition()
            .duration(150)
            .attr('r', 20) // Hover size for 16px nodes

          // Get all connected node IDs for active view
          const connectedNodeIds = new Set([d.id]) // Include the hovered node
          
          // Find all directly connected nodes - use the original data relationships
          data.relationships.forEach(rel => {
            const sourceId = typeof rel.source === 'string' ? rel.source : rel.source
            const targetId = typeof rel.target === 'string' ? rel.target : rel.target
            
            if (sourceId === d.id) {
              connectedNodeIds.add(targetId)
            } else if (targetId === d.id) {
              connectedNodeIds.add(sourceId)
            }
          })

          // Apply active view to nodes: connected nodes stay visible, others fade
          allNodeGroups
            .transition()
            .duration(300)
            .ease(d3.easeCubicInOut)
            .style('opacity', (node: GraphNode) => {
              const isVisible = (node.animationStage ?? 0) <= currentStageValue
              if (!isVisible) return 0 // Keep hidden nodes hidden
              
              const isConnected = connectedNodeIds.has(node.id)
              return isConnected ? 1 : 0.2 // Active nodes at full opacity, others faded
            })

          // Make labels of connected nodes fully visible
          allNodeGroups.selectAll('.label-group')
            .transition()
            .duration(300)
            .ease(d3.easeCubicInOut)
            .style('opacity', (node: GraphNode) => {
              if (!settings.showNodeLabels) return 0
              const isVisible = (node.animationStage ?? 0) <= currentStageValue
              if (!isVisible) return 0
              
              const isConnected = connectedNodeIds.has(node.id)
              return isConnected ? 1 : 0.2 // Connected labels fully visible, others very faded
            })

          // Apply active view to relationships: connected relationships highly visible, others very faded
          allLinks
            .each(function(l) {
              // Get the source and target IDs - handle both string and object cases
              let sourceId: string, targetId: string
              if (typeof l.source === 'string') {
                sourceId = l.source
                targetId = l.target as string
              } else {
                sourceId = (l.source as GraphNode).id
                targetId = (l.target as GraphNode).id
              }
              
              const isDirectlyConnected = sourceId === d.id || targetId === d.id
              
              // Check if relationship should be visible (both nodes must be visible)
              const sourceNode = data.nodes.find(n => n.id === sourceId)
              const targetNode = data.nodes.find(n => n.id === targetId)
              const sourceStage = sourceNode?.animationStage ?? 0
              const targetStage = targetNode?.animationStage ?? 0
              const relStage = l.animationStage ?? 0
              const isVisible = relStage <= currentStageValue && sourceStage <= currentStageValue && targetStage <= currentStageValue
              
              let opacity = 0
              
              if (isVisible) {
                // Only highlight relationships directly connected to the hovered node
                if (isDirectlyConnected) {
                  opacity = 1 // Only direct connections at full opacity
                } else {
                  opacity = 0.1 // ALL other relationships very faded
                }
              }
              
              // Apply transition for smooth fade effect
              d3.select(this)
                .transition()
                .duration(300)
                .ease(d3.easeCubicInOut)
                .style('opacity', opacity)
            })
        })
        .on('mouseout', function(event, d) {
          // Resume floating motion after delay and sync positions to prevent jumping
          isHoveredRef.current = false
          setTimeout(() => {
            if (!isHoveredRef.current) {
              console.log('Restarting floating motion after hover...')
              
              // Wait for any final simulation tick to complete, then reset floating state
              setTimeout(() => {
                // First ensure all visible nodes have their positions properly set
                console.log(`[HOVER EXIT] Current stage: ${currentStageValue}`)
                workingNodesRef.current.forEach(node => {
                  const nodeStage = node.animationStage ?? 0
                  const shouldBeVisible = nodeStage <= currentStageValue
                  console.log(`[HOVER EXIT] Node ${node.id} (stage ${nodeStage}): visible=${shouldBeVisible}`)
                  
                  if (shouldBeVisible && node.x !== undefined && node.y !== undefined) {
                    console.log(`[HOVER EXIT] Resetting node ${node.id} - was fixed: ${node.fx !== null && node.fy !== null}`)
                    
                    const floatingState = nodeFloatingStatesRef.current.get(node.id)
                    if (floatingState) {
                      // Reset the floating state completely to prevent jumping
                      floatingState.baseX = node.x
                      floatingState.baseY = node.y
                      floatingState.offsetX = 0
                      floatingState.offsetY = 0
                    } else {
                      // If no floating state exists, create one (can happen after hover)
                      console.log(`Creating missing floating state for node ${node.id}`)
                      nodeFloatingStatesRef.current.set(node.id, {
                        baseX: node.x,
                        baseY: node.y,
                        offsetX: 0,
                        offsetY: 0,
                        phaseX: Math.random() * Math.PI * 2,
                        phaseY: Math.random() * Math.PI * 2,
                        amplitudeX: 6 + Math.random() * 8,
                        amplitudeY: 6 + Math.random() * 8
                      })
                    }
                    
                    // CRITICAL: Clear any fixed positioning that might prevent floating
                    node.fx = null
                    node.fy = null
                    
                    // Let the floating motion take control
                    console.log(`[HOVER EXIT] Node ${node.id} freed for floating`)
                  }
                })
                
                console.log(`Floating states initialized for ${nodeFloatingStatesRef.current.size} nodes`)
              }, 50) // Small delay to ensure D3 positions are final
              
              if (floatingMotionRef.current) {
                clearInterval(floatingMotionRef.current)
              }
              
              // Start smooth transition back to floating motion
              isTransitioningRef.current = true
              transitionStartTimeRef.current = motionTimeRef.current
              
              floatingMotionRef.current = setInterval(applyFloatingMotion, 50)
            }
          }, 500)
          
          // Reset node size to smaller default
          d3.select(this).select('circle')
            .transition()
            .duration(150)
            .attr('r', 16) // Back to default smaller size

          // Reset all nodes to normal opacity based on stage visibility with smooth transition
          allNodeGroups
            .transition()
            .duration(400)
            .ease(d3.easeCubicInOut)
            .style('opacity', (node: GraphNode) => {
              return (node.animationStage ?? 0) <= currentStageValue ? 1 : 0
            })

          // Reset labels to low opacity
          allNodeGroups.selectAll('.label-group')
            .transition()
            .duration(400)
            .ease(d3.easeCubicInOut)
            .style('opacity', (node: GraphNode) => {
              if (!settings.showNodeLabels) return 0
              return (node.animationStage ?? 0) <= currentStageValue ? 0.2 : 0 // Back to very low opacity
            })

          // Reset all relationships to stage-based opacity with smooth transition
          allLinks
            .transition()
            .duration(400)
            .ease(d3.easeCubicInOut)
            .style('opacity', l => (l.animationStage ?? 0) <= currentStageValue ? 0.3 : 0)
        })
    }

    // Call the setup function
    if (elementsRef.current.setupHoverHandlers) {
      elementsRef.current.setupHoverHandlers(currentStage)
    }

    // Update positions on tick
    simulation.on('tick', () => {
      allLinks
        .attr('x1', d => {
          const source = d.source as GraphNode
          return source.x ?? 0
        })
        .attr('y1', d => {
          const source = d.source as GraphNode
          return source.y ?? 0
        })
        .attr('x2', d => {
          const target = d.target as GraphNode
          return target.x ?? 0
        })
        .attr('y2', d => {
          const target = d.target as GraphNode
          return target.y ?? 0
        })

      allLinkLabels
        .attr('x', d => {
          const source = d.source as GraphNode
          const target = d.target as GraphNode
          return ((source.x ?? 0) + (target.x ?? 0)) / 2
        })
        .attr('y', d => {
          const source = d.source as GraphNode
          const target = d.target as GraphNode
          return ((source.y ?? 0) + (target.y ?? 0)) / 2
        })

      allNodeGroups
        .filter(function() { 
          return d3.select(this).style('opacity') !== '0'
        })
        .attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0}) scale(1)`)
    })

    // Click background to deselect
    svg.on('click', () => {
      setSelectedNode(null)
    })

    // Let simulation settle initially with more iterations for better spreading
    simulation.alpha(1).restart()
    for (let i = 0; i < 300; i++) { // More iterations for better settling
      simulation.tick()
    }
    simulation.alpha(0.1).restart() // Lower alpha for gentler final adjustments

    setIsInitialized(true)

  }, [data, width, height, settings.showNodeLabels, isInitialized])

  // Store references to all elements for updates
  const elementsRef = useRef<{
    allNodeGroups?: d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown>
    allLinks?: d3.Selection<SVGLineElement, GraphRelationship, SVGGElement, unknown>  
    allLinkLabels?: d3.Selection<SVGTextElement, GraphRelationship, SVGGElement, unknown>
    setupHoverHandlers?: (currentStage: number) => void
  }>({})

  // Handle stage changes - this is where the magic happens
  const updateStageVisibility = useCallback(() => {
    if (!svgRef.current || !isInitialized || !elementsRef.current.allNodeGroups) return
    
    // No simulation settling - let nodes animate in from their natural positions

    const { allNodeGroups, allLinks, allLinkLabels } = elementsRef.current
    const isGoingBackwards = currentStage < previousStageRef.current
    
    // Update the previous stage reference
    previousStageRef.current = currentStage

    // Update hover handlers with current stage - use the stored setup function
    if (elementsRef.current.setupHoverHandlers) {
      elementsRef.current.setupHoverHandlers(currentStage)
    }

    // Update visibility of all elements based on current stage
    if (allNodeGroups) {
      if (isGoingBackwards) {
        // When going backwards, hide all nodes beyond current stage immediately
        allNodeGroups.style('opacity', (d: GraphNode) => (d.animationStage ?? 0) <= currentStage ? 1 : 0)
      } else {
        // When going forward, set up nodes for animation
        allNodeGroups
          .style('opacity', (d: GraphNode) => (d.animationStage ?? 0) < currentStage ? 1 : 0)
          .attr('transform', (d: GraphNode) => {
            const stage = d.animationStage ?? 0
            if (stage === currentStage) {
              // Current stage nodes start at scale 0 for animation
              return `translate(${d.x ?? 0},${d.y ?? 0}) scale(0)`
            } else if (stage < currentStage) {
              // Previous stage nodes stay at scale 1
              return `translate(${d.x ?? 0},${d.y ?? 0}) scale(1)`
            } else {
              // Future stage nodes stay hidden
              return `translate(${d.x ?? 0},${d.y ?? 0}) scale(0)`
            }
          })
      }
    }
    if (allLinks) {
      allLinks.style('opacity', (d: GraphRelationship) => {
        // Only show relationships from PREVIOUS stages (current stage relationships will animate in individually)
        const sourceNode = data.nodes.find(n => n.id === (typeof d.source === 'string' ? d.source : d.source.id))
        const targetNode = data.nodes.find(n => n.id === (typeof d.target === 'string' ? d.target : d.target.id))
        const sourceStage = sourceNode?.animationStage ?? 0
        const targetStage = targetNode?.animationStage ?? 0
        const relStage = d.animationStage ?? 0
        
        // Show if relationship is from previous stages AND both nodes are visible
        return relStage < currentStage && sourceStage <= currentStage && targetStage <= currentStage ? 0.3 : 0
      })
    }
    if (allLinkLabels) {
      allLinkLabels.style('opacity', (d: GraphRelationship) => {
        if (!settings.showRelationshipLabels) return 0
        
        // Only show labels for relationships from PREVIOUS stages (current stage will animate in individually)
        const sourceNode = data.nodes.find(n => n.id === (typeof d.source === 'string' ? d.source : d.source.id))
        const targetNode = data.nodes.find(n => n.id === (typeof d.target === 'string' ? d.target : d.target.id))
        const sourceStage = sourceNode?.animationStage ?? 0
        const targetStage = targetNode?.animationStage ?? 0
        const relStage = d.animationStage ?? 0
        
        return relStage < currentStage && sourceStage <= currentStage && targetStage <= currentStage ? 0.7 : 0
      })
    }

    // Only animate when going forward, not backwards
    if (isGoingBackwards) {
      // When going backwards, just show current stage nodes immediately without animation
      if (allNodeGroups) {
        allNodeGroups.style('opacity', (d: GraphNode) => (d.animationStage ?? 0) <= currentStage ? 1 : 0)
      }
      return // Skip animation logic when going backwards
    }

    // Get elements for current stage (new elements to animate in)
    const currentStageNodes = data.nodes.filter(n => (n.animationStage ?? 0) === currentStage)
    const currentStageRelationships = data.relationships.filter(r => (r.animationStage ?? 0) === currentStage)

    // Sort by animation order
    const sortedNodes = [...currentStageNodes].sort((a, b) => (a.animationOrder || 0) - (b.animationOrder || 0))
    const sortedRelationships = [...currentStageRelationships].sort((a, b) => (a.animationOrder || 0) - (b.animationOrder || 0))

    // Calculate animation timing with easing
    const totalElements = sortedNodes.length + sortedRelationships.length
    const baseDuration = stageDuration / Math.max(totalElements, 1)
    
    // Custom easing function for timing delays - smooth acceleration and deceleration
    const calculateDelay = (index: number, total: number) => {
      if (total <= 1) return 0 // No delay if only one element
      
      const progress = index / (total - 1)
      
      // Use a smooth ease-in-out curve (cubic bezier style)
      // This creates natural acceleration in the middle without jaggedness
      let eased: number
      
      if (progress < 0.5) {
        // First half: ease in (accelerating)
        eased = 2 * progress * progress
      } else {
        // Second half: ease out (decelerating)
        eased = 1 - Math.pow(-2 * progress + 2, 2) / 2
      }
      
      // Calculate actual delay in milliseconds
      // Use 30% of stage duration for a balanced animation speed
      const delay = eased * stageDuration * 0.3
      
      // Debug logging
      if (index === 0 || index === total - 1) {
        console.log(`[TIMING] Element ${index + 1}/${total}: delay=${delay.toFixed(0)}ms (stageDuration=${stageDuration}ms)`)
      }
      
      return delay
    }

    // Animate in nodes for current stage
    sortedNodes.forEach((node, i) => {
      // Combine calculated delay with scaled-down animationDelay for better pacing
      const calculatedDelay = calculateDelay(i, sortedNodes.length)
      const additionalDelay = (node.animationDelay || 0) * 0.3 // Scale down the hardcoded delays
      const delay = calculatedDelay + additionalDelay
      
      setTimeout(() => {
        const nodeGroup = allNodeGroups.filter((d: GraphNode) => d.id === node.id)
        
        // Start with scale 0 for a more dramatic entrance
        nodeGroup
          .style('opacity', 1)
          .attr('transform', function(d) {
            return `translate(${(d as GraphNode).x ?? 0},${(d as GraphNode).y ?? 0}) scale(0)`
          })
        
        // Then animate to full size
        nodeGroup
          .transition()
          .duration(200) // Even faster individual animations
          .attr('transform', function(d) {
            return `translate(${(d as GraphNode).x ?? 0},${(d as GraphNode).y ?? 0}) scale(1)`
          })
          .ease(d3.easeCubicOut) // Smooth deceleration without bounce
      }, delay)
    })

    // Animate in relationships - each appears right after both connected nodes are visible
    data.relationships.forEach((rel) => {
      const sourceNode = data.nodes.find(n => n.id === rel.source)
      const targetNode = data.nodes.find(n => n.id === rel.target)
      const sourceStage = sourceNode?.animationStage ?? 0
      const targetStage = targetNode?.animationStage ?? 0
      const relStage = rel.animationStage ?? 0
      
      // Only animate relationships where both nodes and the relationship are visible at current stage
      if (sourceStage <= currentStage && targetStage <= currentStage && relStage <= currentStage) {
        // Calculate when both nodes will be fully animated
        let sourceNodeDelay = 0
        let targetNodeDelay = 0
        
        // Get source node animation timing
        if (sourceStage === currentStage) {
          const sourceNodeIndex = sortedNodes.findIndex(n => n.id === sourceNode?.id)
          if (sourceNodeIndex >= 0) {
            sourceNodeDelay = calculateDelay(sourceNodeIndex, sortedNodes.length) + (sourceNode?.animationDelay || 0) + 300
          }
        }
        
        // Get target node animation timing  
        if (targetStage === currentStage) {
          const targetNodeIndex = sortedNodes.findIndex(n => n.id === targetNode?.id)
          if (targetNodeIndex >= 0) {
            targetNodeDelay = calculateDelay(targetNodeIndex, sortedNodes.length) + (targetNode?.animationDelay || 0) + 300
          }
        }
        
        // Relationship appears immediately after both nodes are visible (using the later of the two)
        const bothNodesReady = Math.max(sourceNodeDelay, targetNodeDelay)
        const relDelay = bothNodesReady + 100 // Small buffer after both nodes are ready
        
        setTimeout(() => {
          allLinks
            .filter((d: GraphRelationship) => d.id === rel.id)
            .transition()
            .duration(150) // Very quick fade in
            .ease(d3.easeCubicOut)
            .style('opacity', 0.3) // Lower opacity
            
          if (settings.showRelationshipLabels) {
            allLinkLabels
              .filter((d: GraphRelationship) => d.id === rel.id)
              .transition()
              .duration(200)
              .style('opacity', 0.7)
          }
        }, relDelay)
      }
    })

    // Handle stage completion
    if (sortedNodes.length > 0 || sortedRelationships.length > 0) {
      const stageCompletionTime = stageDuration + 500
      
      if (stageTimeoutRef.current) {
        clearTimeout(stageTimeoutRef.current)
      }
      
      stageTimeoutRef.current = setTimeout(() => {
        if (onStageComplete) {
          onStageComplete(currentStage)
        }
      }, stageCompletionTime)
    }

  }, [currentStage, stageDuration, onStageComplete, data, settings.showRelationshipLabels, isInitialized])

  // Initialize visualization once
  useEffect(() => {
    if (!isInitialized) {
      initializeVisualization()
    }
  }, [initializeVisualization])

  // Update stage visibility when currentStage changes
  useEffect(() => {
    if (isInitialized) {
      updateStageVisibility()
    }
  }, [updateStageVisibility])

  // Start floating motion after initialization
  useEffect(() => {
    if (isInitialized) {
      console.log('Component initialized, starting floating motion in 2 seconds...')
      const timer = setTimeout(() => {
        startFloatingMotion()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isInitialized, startFloatingMotion])

  // Update label visibility when settings change
  useEffect(() => {
    if (!svgRef.current || !isInitialized) return

    const svg = d3.select(svgRef.current)
    const allNodeLabels = svg.selectAll('.nodes text')
    const allLinkLabels = svg.selectAll('.links text')

    allNodeLabels.style('opacity', settings.showNodeLabels ? 1 : 0)
    allLinkLabels.style('opacity', d => {
      return settings.showRelationshipLabels && (d as GraphRelationship).animationStage! <= currentStage ? 0.7 : 0
    })
  }, [settings, currentStage, isInitialized])

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
    setIsInitialized(false)
    setTimeout(() => {
      initializeVisualization()
    }, 100)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle scroll detection to pause floating motion
  useEffect(() => {
    const handleScroll = () => {
      // Set scrolling flag
      isScrollingRef.current = true
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Resume floating motion after scroll stops
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 150) // Resume after 150ms of no scrolling
    }

    // Only add scroll listener when boundaries are disabled (fullscreen graph)
    if (!enableBoundaries) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('touchmove', handleScroll, { passive: true })
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [enableBoundaries])

  // Cleanup floating motion on unmount
  useEffect(() => {
    return () => {
      stopFloatingMotion()
      if (stageTimeoutRef.current) {
        clearTimeout(stageTimeoutRef.current)
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [stopFloatingMotion])

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative rounded-lg',
        enableBoundaries ? 'bg-white overflow-hidden' : 'bg-transparent overflow-visible',
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
          background: enableBoundaries ? 'white' : 'transparent',
          overflow: 'visible'
        }}
      />
      
      {settings.showControls && (
        <MinimalControls
          settings={settings}
          onSettingsChange={setSettings}
          onFullscreen={handleFullscreen}
          isFullscreen={isFullscreen}
          animated={true}
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