'use client'

import { useEffect, useRef } from 'react'
import { GraphConnection, KnowledgeNode } from './types'
import { cn } from '@/lib/utils'

interface GraphConnectionProps {
  connection: GraphConnection
  fromNode: KnowledgeNode
  toNode: KnowledgeNode
  isActive: boolean
  isHighlighted: boolean
}

export function GraphConnectionLine({ 
  connection, 
  fromNode, 
  toNode, 
  isActive,
  isHighlighted 
}: GraphConnectionProps) {
  const pathRef = useRef<SVGPathElement>(null)
  
  // Calculate control points for curved path
  const dx = toNode.position.x - fromNode.position.x
  const dy = toNode.position.y - fromNode.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // Create a subtle curve
  const curvature = 0.2
  const cx = fromNode.position.x + dx / 2 + dy * curvature
  const cy = fromNode.position.y + dy / 2 - dx * curvature
  
  const pathData = `M ${fromNode.position.x} ${fromNode.position.y} Q ${cx} ${cy} ${toNode.position.x} ${toNode.position.y}`
  
  // Animate pulse along the path
  useEffect(() => {
    if (isActive && pathRef.current) {
      const length = pathRef.current.getTotalLength()
      pathRef.current.style.strokeDasharray = `${length}`
      pathRef.current.style.strokeDashoffset = `${length}`
      
      // Animate
      pathRef.current.animate([
        { strokeDashoffset: length },
        { strokeDashoffset: 0 }
      ], {
        duration: 2000,
        iterations: Infinity,
        easing: 'ease-in-out'
      })
    }
  }, [isActive])
  
  const isLocked = fromNode.status === 'locked' || toNode.status === 'locked'
  
  return (
    <g>
      {/* Main connection line */}
      <path
        d={pathData}
        fill="none"
        stroke={isLocked ? '#E5E5E7' : '#E6CCFF'}
        strokeWidth={isHighlighted ? 3 : 2}
        strokeDasharray={isLocked ? '5 5' : undefined}
        className={cn(
          "transition-all duration-300",
          isHighlighted && "filter drop-shadow(0 0 6px rgba(166, 77, 255, 0.4))"
        )}
      />
      
      {/* Animated pulse overlay */}
      {isActive && !isLocked && (
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="url(#purple-gradient)"
          strokeWidth={3}
          strokeLinecap="round"
          className="pointer-events-none"
        />
      )}
      
      {/* Arrow head */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill={isLocked ? '#E5E5E7' : '#A64DFF'}
          />
        </marker>
        
        {/* Gradient for pulse effect */}
        <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A64DFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#A64DFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#A64DFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </g>
  )
}