'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
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
  // Animation properties
  animationStage?: number
  animationOrder?: number
  animationDelay?: number
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
  animationStage?: number
  animationOrder?: number
  animationDelay?: number
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

export interface GraphConstellationFullscreenProps {
  data: GraphData
  currentStage?: number
  stageDuration?: number
  onStageComplete?: (stage: number) => void
  showNodeLabels?: boolean
  showRelationshipLabels?: boolean
}

export function GraphConstellationFullscreen({ 
  data, 
  currentStage = 0,
  stageDuration = 2000,
  onStageComplete,
  showNodeLabels = true,
  showRelationshipLabels = false
}: GraphConstellationFullscreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [relationships, setRelationships] = useState<GraphRelationship[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const currentStageRef = useRef<number>(currentStage)
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
  const floatingMotionRef = useRef<NodeJS.Timeout | null>(null)
  const motionTimeRef = useRef<number>(0)
  const isTransitioningRef = useRef<boolean>(false)
  const transitionStartTimeRef = useRef<number>(0)
  const draggedNodeRef = useRef<string | null>(null)

  // Update current stage ref when prop changes
  useEffect(() => {
    currentStageRef.current = currentStage
  }, [currentStage])

  // Initialize nodes with screen positioning
  useEffect(() => {
    if (!data.nodes || isInitialized) return

    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const centerX = screenWidth * 0.7  // Position in right side of screen
    const centerY = screenHeight * 0.4 // Position in upper portion

    // Create nodes with initial positions
    const initialNodes = data.nodes.map((node, index) => {
      const angle = (index / data.nodes.length) * 2 * Math.PI
      const radius = 80 + Math.random() * 40
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      return {
        ...node,
        x,
        y,
        fx: null,
        fy: null
      }
    })

    setNodes(initialNodes)
    setRelationships(data.relationships)
    setIsInitialized(true)
  }, [data, isInitialized])

  // Stage animation effect
  useEffect(() => {
    if (!isInitialized) return

    const animateStage = () => {
      const currentNodes = nodes.filter(node => 
        (node.animationStage ?? 0) <= currentStage
      )
      const currentRels = relationships.filter(rel => 
        (rel.animationStage ?? 0) <= currentStage
      )

      // Animate nodes in sequence
      currentNodes.forEach((node, index) => {
        const delay = (node.animationDelay ?? 0) + (node.animationOrder ?? index) * 100
        setTimeout(() => {
          const nodeElement = document.getElementById(`node-${node.id}`)
          if (nodeElement) {
            nodeElement.style.opacity = '1'
            nodeElement.style.transform = 'translate(-50%, -50%) scale(1)'
          }
        }, delay)
      })

      // Animate relationships after nodes
      setTimeout(() => {
        currentRels.forEach((rel, index) => {
          const delay = (rel.animationDelay ?? 0) + (rel.animationOrder ?? index) * 50
          setTimeout(() => {
            const relElement = document.getElementById(`rel-${rel.id}`)
            if (relElement) {
              relElement.style.opacity = '1'
            }
          }, delay)
        })
      }, 1000)
    }

    animateStage()
  }, [currentStage, nodes, relationships, isInitialized])

  // Floating motion system
  useEffect(() => {
    if (!isInitialized) return

    const startFloatingMotion = () => {
      if (floatingMotionRef.current) {
        clearInterval(floatingMotionRef.current)
      }

      // Initialize floating states for all nodes
      nodes.forEach(node => {
        if (!nodeFloatingStatesRef.current.has(node.id)) {
          nodeFloatingStatesRef.current.set(node.id, {
            baseX: node.x ?? 0,
            baseY: node.y ?? 0,
            offsetX: 0,
            offsetY: 0,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            amplitudeX: 15 + Math.random() * 10,
            amplitudeY: 12 + Math.random() * 8
          })
        }
      })

      floatingMotionRef.current = setInterval(() => {
        motionTimeRef.current += 0.02

        nodes.forEach(node => {
          const nodeStage = node.animationStage ?? 0
          if (nodeStage > currentStageRef.current) return
          if (draggedNodeRef.current === node.id) return

          const floatingState = nodeFloatingStatesRef.current.get(node.id)
          if (!floatingState) return

          const timeX = motionTimeRef.current + floatingState.phaseX
          const timeY = motionTimeRef.current + floatingState.phaseY

          const newOffsetX = Math.sin(timeX * 1.0) * floatingState.amplitudeX
          const newOffsetY = Math.sin(timeY * 0.8) * floatingState.amplitudeY

          const driftX = Math.sin(timeX * 0.15) * 1.0
          const driftY = Math.cos(timeY * 0.12) * 1.0

          const targetX = floatingState.baseX + newOffsetX + driftX
          const targetY = floatingState.baseY + newOffsetY + driftY

          let smoothing = 0.1
          if (isTransitioningRef.current) {
            const elapsed = motionTimeRef.current - transitionStartTimeRef.current
            const progress = Math.min(elapsed / 50, 1)
            smoothing = 0.02 + (0.08 * progress)
            if (progress >= 1) {
              isTransitioningRef.current = false
            }
          }

          node.x = (node.x ?? 0) + (targetX - (node.x ?? 0)) * smoothing
          node.y = (node.y ?? 0) + (targetY - (node.y ?? 0)) * smoothing

          // Update DOM element position
          const nodeElement = document.getElementById(`node-${node.id}`)
          if (nodeElement) {
            nodeElement.style.left = `${node.x}px`
            nodeElement.style.top = `${node.y}px`
          }
        })

        // Update relationship lines
        relationships.forEach(rel => {
          if ((rel.animationStage ?? 0) > currentStageRef.current) return
          
          const sourceNode = nodes.find(n => n.id === rel.source)
          const targetNode = nodes.find(n => n.id === rel.target)
          
          if (sourceNode && targetNode) {
            const lineElement = document.getElementById(`rel-${rel.id}`)
            if (lineElement) {
              const x1 = sourceNode.x ?? 0
              const y1 = sourceNode.y ?? 0
              const x2 = targetNode.x ?? 0
              const y2 = targetNode.y ?? 0
              
              // Calculate line position and rotation
              const angle = Math.atan2(y2 - y1, x2 - x1)
              const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
              
              // Position line at source node
              lineElement.style.left = `${x1}px`
              lineElement.style.top = `${y1}px`
              lineElement.style.width = `${length}px`
              lineElement.style.height = '2px'
              lineElement.style.transform = `rotate(${angle}rad)`
              lineElement.style.transformOrigin = '0 50%'
            }
          }
        })
      }, 20)
    }

    startFloatingMotion()

    return () => {
      if (floatingMotionRef.current) {
        clearInterval(floatingMotionRef.current)
      }
    }
  }, [nodes, relationships, isInitialized])

  // Drag handlers
  const handleMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.preventDefault()
    draggedNodeRef.current = nodeId
    
    const handleMouseMove = (e: MouseEvent) => {
      setNodes(prevNodes => {
        const updatedNodes = prevNodes.map(node => {
          if (node.id === nodeId) {
            return { ...node, x: e.clientX, y: e.clientY }
          }
          return node
        })
        
        // Update floating state base position
        const floatingState = nodeFloatingStatesRef.current.get(nodeId)
        if (floatingState) {
          floatingState.baseX = e.clientX
          floatingState.baseY = e.clientY
        }

        // Update DOM element position
        const nodeElement = document.getElementById(`node-${nodeId}`)
        if (nodeElement) {
          nodeElement.style.left = `${e.clientX}px`
          nodeElement.style.top = `${e.clientY}px`
        }

        return updatedNodes
      })
    }

    const handleMouseUp = () => {
      draggedNodeRef.current = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [nodes])

  // Get node color by type
  const getNodeColor = (type: string) => {
    const colors = {
      'Content': '#6366f1',      // Indigo
      'Concept': '#10b981',      // Emerald
      'Path': '#8b5cf6',         // Violet
      'Skill': '#f59e0b',        // Amber
      'Learner': '#ec4899'       // Pink
    }
    return colors[type as keyof typeof colors] || '#6b7280'
  }

  if (!isInitialized) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ 
        mixBlendMode: 'normal',
        width: '100vw',
        height: '100vh',
        left: 0,
        top: 0
      }}
    >
      {/* Render relationship lines */}
      {relationships.map(rel => {
        const sourceNode = nodes.find(n => n.id === rel.source)
        const targetNode = nodes.find(n => n.id === rel.target)
        
        if (!sourceNode || !targetNode) return null
        if ((rel.animationStage ?? 0) > currentStage) return null
        
        const x1 = sourceNode.x ?? 0
        const y1 = sourceNode.y ?? 0
        const x2 = targetNode.x ?? 0
        const y2 = targetNode.y ?? 0
        
        const angle = Math.atan2(y2 - y1, x2 - x1)
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        
        return (
          <div
            key={rel.id}
            id={`rel-${rel.id}`}
            className="absolute bg-gray-400 opacity-0 transition-opacity duration-300"
            style={{
              left: `${x1}px`,
              top: `${y1}px`,
              width: `${length}px`,
              height: '2px',
              transform: `rotate(${angle}rad)`,
              transformOrigin: '0 50%',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />
        )
      })}

      {/* Render nodes */}
      {nodes.filter(node => (node.animationStage ?? 0) <= currentStage).map(node => (
        <div
          key={node.id}
          id={`node-${node.id}`}
          className="absolute cursor-grab active:cursor-grabbing opacity-0 transition-all duration-500 pointer-events-auto"
          style={{
            left: `${node.x}px`,
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%) scale(0.8)',
            zIndex: 10
          }}
          onMouseDown={(e) => handleMouseDown(node.id, e)}
        >
          <div
            className="relative flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: getNodeColor(node.type)
            }}
          >
            {showNodeLabels && (
              <div 
                className="absolute top-full mt-2 text-xs font-medium text-gray-700 whitespace-nowrap bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm"
                style={{ transform: 'translateX(-50%)', left: '50%' }}
              >
                {node.label}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}