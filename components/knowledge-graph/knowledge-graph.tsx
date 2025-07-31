'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { KnowledgeNode, GraphConnection } from './types'
import { GraphNode } from './graph-node'
import { GraphConnectionLine } from './graph-connection'
import { NodeDetails } from './node-details'
import { calculateNodePositions } from './graph-layout'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[]
  connections: GraphConnection[]
  className?: string
  onNodeSelect?: (node: KnowledgeNode) => void
}

export function KnowledgeGraph({ 
  nodes: initialNodes, 
  connections, 
  className,
  onNodeSelect 
}: KnowledgeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })
  
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Update container dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setContainerDimensions({ width, height })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    // Also update when context window opens/closes
    const observer = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    
    return () => {
      window.removeEventListener('resize', updateDimensions)
      observer.disconnect()
    }
  }, [])
  
  // Calculate node positions
  const nodes = useMemo(() => {
    console.log('Container dimensions:', containerDimensions)
    console.log('Initial nodes:', initialNodes.length)
    
    if (containerDimensions.width === 0 || containerDimensions.height === 0) {
      console.log('Container not ready, returning initial nodes')
      return initialNodes
    }
    
    const calculatedNodes = calculateNodePositions(
      initialNodes, 
      connections, 
      containerDimensions.width * 0.7, 
      containerDimensions.height - 100
    )
    
    console.log('Calculated nodes with positions:', calculatedNodes)
    return calculatedNodes
  }, [initialNodes, connections, containerDimensions])

  // Handle selection
  const handleNodeSelect = (node: KnowledgeNode) => {
    setSelectedNode(node)
    onNodeSelect?.(node)
  }

  // Zoom controls
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Check if connection should be highlighted
  const isConnectionHighlighted = (conn: GraphConnection) => {
    return hoveredNode === conn.from || 
           hoveredNode === conn.to ||
           selectedNode?.id === conn.from ||
           selectedNode?.id === conn.to
  }

  return (
    <div className={cn("flex flex-col h-full gap-spacing-sm", className)}>
      {/* Graph Container */}
      <div 
        ref={containerRef}
        className="flex-1 relative bg-white rounded-lg overflow-hidden border border-border-default min-h-[300px]"
      >
          {/* Controls */}
          <div className="absolute top-spacing-sm right-spacing-sm z-10 flex gap-spacing-xs">
            <button
              onClick={() => handleZoom(0.1)}
              className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Reset view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Graph */}
          <svg
            ref={svgRef}
            className={cn(
              "w-full h-full",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ background: '#ffffff' }}
          >
            {/* Debug rect to ensure SVG is visible */}
            <rect x="0" y="0" width="100" height="100" fill="red" opacity="0.1" />
            
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Render connections */}
              {connections.map(conn => {
                const fromNode = nodes.find(n => n.id === conn.from)
                const toNode = nodes.find(n => n.id === conn.to)
                
                if (!fromNode || !toNode) return null
                
                return (
                  <GraphConnectionLine
                    key={conn.id}
                    connection={conn}
                    fromNode={fromNode}
                    toNode={toNode}
                    isActive={selectedNode?.id === conn.from}
                    isHighlighted={isConnectionHighlighted(conn)}
                  />
                )
              })}
              
              {/* Render nodes */}
              {nodes.map((node, index) => (
                <GraphNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  isHovered={hoveredNode === node.id}
                  onSelect={handleNodeSelect}
                  onHover={setHoveredNode}
                />
              ))}
            </g>
          </svg>

          {/* Tooltip */}
          {hoveredNode && !selectedNode && (
            <div className="absolute pointer-events-none bg-black/90 text-white px-3 py-2 rounded-lg text-sm">
              {nodes.find(n => n.id === hoveredNode)?.title}
            </div>
          )}
      </div>

      {/* Details Panel - Below Graph */}
      {selectedNode && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: '250px' }}>
          <div className="border-b border-gray-200 px-spacing-md py-spacing-sm">
            <h3 className="font-semibold text-primary">Knowledge Point Details</h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(250px - 48px)' }}>
            <NodeDetails 
              node={selectedNode} 
              allNodes={nodes}
              onPractice={(node) => console.log('Practice:', node)}
            />
          </div>
        </div>
      )}
    </div>
  )
}