'use client'

import React, { useState } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { TreeKnowledgeGraph } from '@/components/knowledge-graph/tree-knowledge-graph'
import { NodeDetailsPopover } from '@/components/knowledge-graph/node-details-popover'
import { cn } from '@/lib/utils'
import { BookOpen, TrendingUp, Minimize2 } from 'lucide-react'
import { Badge } from '@/components/badge'

interface KnowledgePoint {
  id: string
  title: string
  progress: number
  dependencies?: string[]
  hardDependencies?: string[]
  dependencyDetails?: Record<string, { type: 'hard' | 'soft', requiredElo: number }>
}

interface LessonInfo {
  chapterId: string
  chapterTitle: string
  lessonId: string
  lessonTitle: string
}

interface KnowledgeTreeCardProps {
  title?: string
  subtitle?: string
  userName?: string
  knowledgePoints: KnowledgePoint[]
  className?: string
  showStats?: boolean
  availableLessons?: Record<string, LessonInfo[]>
  onLessonClick?: (lessonId: string) => void
  onCompact?: () => void
}

export function KnowledgeTreeCard({ 
  title = "Knowledge Map",
  subtitle,
  userName = "Learner",
  knowledgePoints,
  className,
  showStats = true,
  availableLessons = {},
  onLessonClick,
  onCompact
}: KnowledgeTreeCardProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  
  const selectedNode = knowledgePoints.find(kp => kp.id === selectedNodeId)
  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = knowledgePoints.length
    const completed = knowledgePoints.filter(kp => kp.progress >= 100).length
    const inProgress = knowledgePoints.filter(kp => kp.progress > 0 && kp.progress < 100).length
    const notStarted = knowledgePoints.filter(kp => kp.progress === 0).length
    const avgProgress = total > 0 
      ? Math.round(knowledgePoints.reduce((sum, kp) => sum + kp.progress, 0) / total)
      : 0

    return { total, completed, inProgress, notStarted, avgProgress }
  }, [knowledgePoints])

  return (
    <Card className={cn("p-spacing-md space-y-spacing-sm w-full", className)}>
      {/* Header */}
      <div className="flex justify-between items-start mb-spacing-sm">
        <div>
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          {subtitle && <p className="text-sm text-secondary mt-1">{subtitle}</p>}
        </div>
        {onCompact && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onCompact}
            className="ml-spacing-md"
          >
            <Minimize2 className="h-4 w-4 mr-1" />
            Compact View
          </Button>
        )}
      </div>

      {/* Tree Graph - Full Height */}
      <div className="bg-secondary rounded-lg p-spacing-xs overflow-hidden">
        <TreeKnowledgeGraph
          userName={userName}
          knowledgePoints={knowledgePoints}
          className="w-full"
          selectedNodeId={selectedNodeId}
          onNodeSelect={(nodeId) => {
            setSelectedNodeId(nodeId)
            setPopoverOpen(!!nodeId)
          }}
          availableLessons={availableLessons}
          onLessonClick={onLessonClick}
        />
      </div>
    </Card>
  )
}