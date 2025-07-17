'use client'

import React, { useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ProgressNode } from './progress-node'
import { User } from 'lucide-react'

interface KnowledgePoint {
  id: string
  title: string
  progress: number
}

interface TreeKnowledgeGraphProps {
  userName: string
  knowledgePoints: KnowledgePoint[]
  className?: string
}

export function TreeKnowledgeGraph({ userName, knowledgePoints, className }: TreeKnowledgeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  
  // Layout configuration
  const userNodeSize = 80
  const knowledgeNodeSize = 48
  const verticalSpacing = 120
  const minHorizontalSpacing = 60
  const svgPadding = 40
  
  // Calculate positions for all nodes
  const { positions, svgDimensions } = useMemo(() => {
    const positions: Record<string, { x: number, y: number }> = {}
    
    // Position user node at the top center
    const totalWidth = Math.max(
      (knowledgePoints.length * (knowledgeNodeSize + minHorizontalSpacing)) - minHorizontalSpacing,
      200
    )
    
    const userX = totalWidth / 2
    const userY = svgPadding + userNodeSize / 2
    positions['user'] = { x: userX, y: userY }
    
    // Position knowledge points in rows below
    const itemsPerRow = 6
    const rows = Math.ceil(knowledgePoints.length / itemsPerRow)
    
    knowledgePoints.forEach((kp, index) => {
      const row = Math.floor(index / itemsPerRow)
      const col = index % itemsPerRow
      const itemsInThisRow = Math.min(itemsPerRow, knowledgePoints.length - row * itemsPerRow)
      
      // Center each row
      const rowWidth = (itemsInThisRow * (knowledgeNodeSize + minHorizontalSpacing)) - minHorizontalSpacing
      const rowStartX = (totalWidth - rowWidth) / 2
      
      const x = rowStartX + col * (knowledgeNodeSize + minHorizontalSpacing) + knowledgeNodeSize / 2
      const y = userY + userNodeSize / 2 + verticalSpacing + row * (knowledgeNodeSize + verticalSpacing) + knowledgeNodeSize / 2
      
      positions[kp.id] = { x, y }
    })
    
    // Calculate SVG dimensions
    const maxY = Math.max(...Object.values(positions).map(p => p.y))
    const svgDimensions = {
      width: totalWidth + svgPadding * 2,
      height: maxY + knowledgeNodeSize / 2 + svgPadding
    }
    
    return { positions, svgDimensions }
  }, [knowledgePoints, userNodeSize, knowledgeNodeSize, verticalSpacing, minHorizontalSpacing])
  
  // Create curved path between two points
  const createPath = (from: { x: number, y: number }, to: { x: number, y: number }) => {
    const startX = from.x
    const startY = from.y + userNodeSize / 2
    const endX = to.x
    const endY = to.y - knowledgeNodeSize / 2
    
    const midY = (startY + endY) / 2
    const offset = 20
    
    return `M ${startX} ${startY} C ${startX} ${midY + offset}, ${endX} ${midY + offset}, ${endX} ${endY}`
  }
  
  return (
    <div className={cn("w-full h-full overflow-auto bg-white rounded-lg", className)}>
      <svg
        ref={svgRef}
        width={svgDimensions.width}
        height={svgDimensions.height}
        className="min-w-full"
      >
        {/* Render connections */}
        <g className="connections">
          {knowledgePoints.map((kp) => {
            const fromPos = positions['user']
            const toPos = positions[kp.id]
            
            if (!fromPos || !toPos) return null
            
            return (
              <path
                key={`connection-${kp.id}`}
                d={createPath(fromPos, toPos)}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
            )
          })}
        </g>
        
        {/* Render user node */}
        <g transform={`translate(${positions['user'].x - userNodeSize / 2}, ${positions['user'].y - userNodeSize / 2})`}>
          <foreignObject width={userNodeSize} height={userNodeSize}>
            <div 
              className={cn(
                "w-full h-full rounded-full bg-primary border-4 border-primary flex items-center justify-center cursor-pointer transition-all",
                "hover:scale-105 hover:shadow-lg",
                selectedNode === 'user' && "ring-4 ring-primary/20"
              )}
              onClick={() => setSelectedNode('user')}
            >
              <div className="flex flex-col items-center gap-1">
                <User className="w-6 h-6 text-white" />
                <span className="text-xs font-medium text-white truncate max-w-[60px]">
                  {userName}
                </span>
              </div>
            </div>
          </foreignObject>
        </g>
        
        {/* Render knowledge point nodes */}
        {knowledgePoints.map((kp) => {
          const pos = positions[kp.id]
          if (!pos) return null
          
          return (
            <g 
              key={kp.id}
              transform={`translate(${pos.x - knowledgeNodeSize / 2}, ${pos.y - knowledgeNodeSize / 2})`}
            >
              <foreignObject width={knowledgeNodeSize} height={knowledgeNodeSize}>
                <ProgressNode
                  title={kp.title}
                  progress={kp.progress}
                  size={knowledgeNodeSize}
                  onClick={() => setSelectedNode(kp.id)}
                  className={selectedNode === kp.id ? "ring-2 ring-primary" : ""}
                />
              </foreignObject>
            </g>
          )
        })}
      </svg>
    </div>
  )
}