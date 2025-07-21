'use client'

import React, { useMemo } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Progress } from '@/components/atomic/progress'
import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'
import { Maximize2, TrendingUp, Target, Clock, Award } from 'lucide-react'

interface KnowledgePoint {
  id: string
  title: string
  progress: number
  dependencies?: string[]
  dependencyDetails?: Record<string, { type: 'hard' | 'soft', requiredElo: number }>
}

interface KnowledgeGraphPreviewProps {
  knowledgePoints: KnowledgePoint[]
  userName?: string
  courseTitle?: string
  onExpand?: () => void
  className?: string
}

// Mini graph component for preview
function MiniKnowledgeGraph({ knowledgePoints }: { knowledgePoints: KnowledgePoint[] }) {
  const { positions, connections } = useMemo(() => {
    const nodeSize = 8
    const padding = 20
    const width = 250 // Fixed width for preview
    const height = 250 // Fixed height for preview
    
    // Calculate positions (simplified layout)
    const positions: Record<string, { x: number, y: number }> = {}
    const connections: Array<{ from: string, to: string, type: 'hard' | 'soft' }> = []
    
    // Build dependency map
    const dependencyMap: Record<string, string[]> = {}
    const levels: Record<string, number> = {}
    
    // Calculate levels
    const calculateLevel = (nodeId: string): number => {
      if (levels[nodeId] !== undefined) return levels[nodeId]
      
      const kp = knowledgePoints.find(k => k.id === nodeId)
      if (!kp || !kp.dependencies || kp.dependencies.length === 0) {
        levels[nodeId] = 0
        return 0
      }
      
      const maxParentLevel = Math.max(...kp.dependencies
        .filter(depId => knowledgePoints.find(k => k.id === depId))
        .map(depId => calculateLevel(depId))
      )
      levels[nodeId] = maxParentLevel + 1
      return maxParentLevel + 1
    }
    
    knowledgePoints.forEach(kp => calculateLevel(kp.id))
    
    // Group by level
    const nodesByLevel: Record<number, string[]> = {}
    Object.entries(levels).forEach(([nodeId, level]) => {
      if (!nodesByLevel[level]) nodesByLevel[level] = []
      nodesByLevel[level].push(nodeId)
    })
    
    // Position nodes
    const maxLevel = Math.max(...Object.values(levels))
    const levelHeight = (height - padding * 2) / (maxLevel + 1)
    
    Object.entries(nodesByLevel).forEach(([levelStr, nodeIds]) => {
      const level = parseInt(levelStr)
      const nodeCount = nodeIds.length
      const levelWidth = width - padding * 2
      const spacing = levelWidth / (nodeCount + 1)
      
      nodeIds.forEach((nodeId, index) => {
        positions[nodeId] = {
          x: padding + spacing * (index + 1),
          y: padding + level * levelHeight + levelHeight / 2
        }
      })
    })
    
    // Create connections
    knowledgePoints.forEach(kp => {
      if (kp.dependencies) {
        kp.dependencies.forEach(depId => {
          if (positions[depId] && positions[kp.id]) {
            const depDetails = kp.dependencyDetails?.[depId]
            connections.push({
              from: depId,
              to: kp.id,
              type: depDetails?.type || 'soft'
            })
          }
        })
      }
    })
    
    return { positions, connections }
  }, [knowledgePoints])
  
  // Create simple curved path
  const createPath = (from: { x: number, y: number }, to: { x: number, y: number }) => {
    const controlOffset = Math.abs(to.y - from.y) * 0.3
    return `M ${from.x} ${from.y} C ${from.x} ${from.y + controlOffset}, ${to.x} ${to.y - controlOffset}, ${to.x} ${to.y}`
  }
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 250 250" className="absolute inset-0" preserveAspectRatio="xMidYMid meet">
      {/* Connections */}
      {connections.map((conn, idx) => {
        const from = positions[conn.from]
        const to = positions[conn.to]
        if (!from || !to) return null
        
        return (
          <path
            key={`${conn.from}-${conn.to}-${idx}`}
            d={createPath(from, to)}
            stroke={conn.type === 'hard' ? '#e5e5e7' : '#e5e5e7'}
            strokeWidth="1"
            strokeDasharray={conn.type === 'soft' ? "2,2" : undefined}
            fill="none"
            opacity="0.5"
          />
        )
      })}
      
      {/* Nodes */}
      {knowledgePoints.map(kp => {
        const pos = positions[kp.id]
        if (!pos) return null
        
        const nodeColor = kp.progress >= 80 ? '#22C55E' :
                         kp.progress >= 40 ? '#FFC700' :
                         kp.progress > 0 ? '#E51C23' :
                         '#e5e5e7'
        
        return (
          <g key={kp.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="4"
              fill={nodeColor}
              stroke={nodeColor}
              strokeWidth="1"
              opacity={kp.progress > 0 ? "1" : "0.6"}
            />
            {kp.progress >= 80 && (
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                fill="white"
                fontSize="6"
                fontWeight="bold"
              >
                ✓
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function KnowledgeGraphPreview({
  knowledgePoints,
  userName = "Learner",
  courseTitle = "Course Progress",
  onExpand,
  className
}: KnowledgeGraphPreviewProps) {
  return (
    <div className={cn("h-full", className)}>
      {/* Mini Graph Preview Card - Full Height */}
      <Card 
        className="h-full p-spacing-md cursor-pointer hover:shadow-md transition-shadow flex flex-col"
        onClick={onExpand}
      >
        <div className="flex items-start justify-between mb-spacing-sm">
          <div>
            <h3 className="text-sm font-semibold text-primary">Knowledge Map</h3>
            <p className="text-xs text-secondary mt-1">Click to view full graph</p>
          </div>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Mini visualization - Expanded to fill remaining space */}
        <div className="flex-1 bg-secondary rounded-md relative overflow-hidden">
          <MiniKnowledgeGraph knowledgePoints={knowledgePoints} />
        </div>
      </Card>
    </div>
  )
}