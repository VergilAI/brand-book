'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { KnowledgeNode } from './types'

interface GraphNodeProps {
  node: KnowledgeNode
  isSelected: boolean
  isHovered: boolean
  onSelect: (node: KnowledgeNode) => void
  onHover: (nodeId: string | null) => void
}

export function GraphNode({ node, isSelected, isHovered, onSelect, onHover }: GraphNodeProps) {
  const nodeRef = useRef<SVGGElement>(null)
  const baseSize = 20
  const size = isSelected ? baseSize * 1.2 : baseSize
  
  // Calculate colors based on status
  const getNodeColor = () => {
    switch (node.status) {
      case 'mastered':
        return '#22C55E' // Green
      case 'learning':
        return '#A64DFF' // Vergil Purple
      case 'available':
        return '#FFFFFF' // White
      case 'locked':
        return '#E5E5E7' // Gray
    }
  }

  const getStrokeColor = () => {
    if (node.status === 'locked') return '#D4D4D8'
    if (node.proficiency === 0) return '#D4D4D8'
    return node.status === 'mastered' ? '#22C55E' : '#A64DFF'
  }

  // Add breathing animation for learning nodes
  useEffect(() => {
    if (node.status === 'learning' && nodeRef.current) {
      nodeRef.current.classList.add('animate-breathing')
    }
  }, [node.status])

  return (
    <g
      ref={nodeRef}
      transform={`translate(${node.position.x}, ${node.position.y})`}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(node)}
      className="cursor-pointer"
    >
      {/* Shadow */}
      <circle
        r={size + 2}
        fill="rgba(0,0,0,0.1)"
        transform="translate(2, 2)"
        className="transition-all duration-200"
      />
      
      {/* Outer ring showing proficiency */}
      <circle
        r={size + 4}
        fill="none"
        stroke="#E5E5E7"
        strokeWidth={3}
        className="transition-all duration-200"
      />
      
      {/* Proficiency progress */}
      <circle
        r={size + 4}
        fill="none"
        stroke={getStrokeColor()}
        strokeWidth={3}
        strokeDasharray={`${2 * Math.PI * (size + 4)}`}
        strokeDashoffset={`${2 * Math.PI * (size + 4) * (1 - node.proficiency / 100)}`}
        strokeLinecap="round"
        transform="rotate(-90)"
        className="transition-all duration-500"
        style={{
          filter: node.status === 'learning' ? 'drop-shadow(0 0 8px rgba(166, 77, 255, 0.5))' : undefined
        }}
      />
      
      {/* Inner circle */}
      <circle
        r={size}
        fill={getNodeColor()}
        stroke={node.status === 'locked' ? '#D4D4D8' : '#FFFFFF'}
        strokeWidth={2}
        className={cn(
          "transition-all duration-200",
          isHovered && "filter drop-shadow(0 0 12px rgba(166, 77, 255, 0.6))"
        )}
      />
      
      {/* Node label */}
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        className={cn(
          "text-xs font-medium pointer-events-none select-none",
          node.status === 'locked' ? 'fill-gray-400' : 
          node.status === 'available' ? 'fill-gray-700' : 
          'fill-white'
        )}
      >
        {node.title.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
      </text>
      
      {/* Selection indicator */}
      {isSelected && (
        <circle
          r={size + 8}
          fill="none"
          stroke="#A64DFF"
          strokeWidth={2}
          strokeDasharray="4 4"
          className="animate-spin-slow"
        />
      )}
    </g>
  )
}