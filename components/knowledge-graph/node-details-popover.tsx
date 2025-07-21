'use client'

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/atomic/progress'
import { ChevronRight, Lock, Unlock, BookOpen, Target, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DependencyDetail {
  id: string
  type: 'hard' | 'soft'
  requiredElo: number
}

interface KnowledgePoint {
  id: string
  title: string
  progress: number
  dependencies?: string[]
  hardDependencies?: string[]
  dependencyDetails?: Record<string, DependencyDetail>
}

interface LessonInfo {
  chapterId: string
  chapterTitle: string
  lessonId: string
  lessonTitle: string
}

interface NodeDetailsPopoverProps {
  node: KnowledgePoint
  allNodes: KnowledgePoint[]
  availableIn?: LessonInfo[]
  onLessonClick?: (lessonId: string) => void
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function NodeDetailsPopover({
  node,
  allNodes,
  availableIn = [],
  onLessonClick,
  children,
  open,
  onOpenChange,
  side = 'right'
}: NodeDetailsPopoverProps) {
  // Calculate prerequisites (incoming dependencies)
  const prerequisites = React.useMemo(() => {
    const prereqs: Array<{
      node: KnowledgePoint
      type: 'hard' | 'soft'
      requiredElo: number
      isMet: boolean
    }> = []
    
    if (node.dependencies) {
      node.dependencies.forEach(depId => {
        const depNode = allNodes.find(n => n.id === depId)
        if (depNode) {
          const detail = node.dependencyDetails?.[depId]
          const type = detail?.type || (node.hardDependencies?.includes(depId) ? 'hard' : 'soft')
          const requiredElo = detail?.requiredElo || 80
          const isMet = depNode.progress >= requiredElo
          
          prereqs.push({
            node: depNode,
            type,
            requiredElo,
            isMet
          })
        }
      })
    }
    
    return prereqs
  }, [node, allNodes])
  
  // Calculate unlocks (outgoing dependencies)
  const unlocks = React.useMemo(() => {
    const unlocksList: Array<{
      node: KnowledgePoint
      type: 'hard' | 'soft'
      requiredElo: number
    }> = []
    
    allNodes.forEach(otherNode => {
      if (otherNode.dependencies?.includes(node.id)) {
        const detail = otherNode.dependencyDetails?.[node.id]
        const type = detail?.type || (otherNode.hardDependencies?.includes(node.id) ? 'hard' : 'soft')
        const requiredElo = detail?.requiredElo || 80
        
        unlocksList.push({
          node: otherNode,
          type,
          requiredElo
        })
      }
    })
    
    return unlocksList
  }, [node, allNodes])
  
  // Determine if node is locked
  const isLocked = prerequisites.some(p => p.type === 'hard' && !p.isMet)
  
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-spacing-md space-y-spacing-md" 
        side={side} 
        align="center"
        sideOffset={20}
        alignOffset={0}
      >
        {/* Header */}
        <div className="space-y-spacing-xs">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-primary">{node.title}</h3>
            {isLocked && <Lock className="w-4 h-4 text-tertiary mt-1" />}
          </div>
          
          {/* Progress */}
          <div className="space-y-spacing-xs">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary">Progress</span>
              <span className="font-medium text-primary">{node.progress}%</span>
            </div>
            <Progress 
              value={node.progress} 
              className="h-2" 
              variant={
                node.progress >= 70 ? "success" : 
                node.progress >= 40 ? "warning" : 
                node.progress > 0 ? "error" :
                "default"
              }
            />
            <div className="flex items-center gap-spacing-xs">
              {node.progress === 0 && (
                <Badge variant="default" size="sm">Not Started</Badge>
              )}
              {node.progress > 0 && node.progress < 40 && (
                <Badge variant="error" size="sm">Beginning</Badge>
              )}
              {node.progress >= 40 && node.progress < 70 && (
                <Badge variant="warning" size="sm">In Progress</Badge>
              )}
              {node.progress >= 70 && node.progress < 100 && (
                <Badge variant="success" size="sm">Proficient</Badge>
              )}
              {node.progress === 100 && (
                <Badge variant="success" size="sm">Mastered</Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <div className="space-y-spacing-xs">
            <h4 className="text-sm font-medium text-primary flex items-center gap-spacing-xs">
              <Target className="w-4 h-4" />
              Prerequisites
            </h4>
            <div className="space-y-spacing-xs">
              {prerequisites.map(prereq => (
                <div 
                  key={prereq.node.id}
                  className={cn(
                    "flex items-center justify-between p-spacing-xs rounded-md border",
                    prereq.isMet ? "border-success bg-successLight" : "border-default bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-spacing-xs">
                    {prereq.isMet ? (
                      <Unlock className="w-3 h-3 text-success" />
                    ) : (
                      <Lock className="w-3 h-3 text-tertiary" />
                    )}
                    <span className="text-sm text-primary">{prereq.node.title}</span>
                  </div>
                  <div className="flex items-center gap-spacing-xs">
                    <Badge 
                      variant={prereq.type === 'hard' ? 'error' : 'default'} 
                      size="sm"
                    >
                      {prereq.type === 'hard' ? 'Required' : 'Recommended'}
                    </Badge>
                    <span className={cn(
                      "text-xs",
                      prereq.isMet ? "text-success" : "text-tertiary"
                    )}>
                      {prereq.node.progress}%/{prereq.requiredElo}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Unlocks */}
        {unlocks.length > 0 && (
          <div className="space-y-spacing-xs">
            <h4 className="text-sm font-medium text-primary flex items-center gap-spacing-xs">
              <Unlock className="w-4 h-4" />
              Unlocks
            </h4>
            <div className="space-y-spacing-xs">
              {unlocks.map(unlock => (
                <div 
                  key={unlock.node.id}
                  className="flex items-center justify-between p-spacing-xs rounded-md border border-default bg-secondary"
                >
                  <span className="text-sm text-primary">{unlock.node.title}</span>
                  <div className="flex items-center gap-spacing-xs">
                    <Badge 
                      variant={unlock.type === 'hard' ? 'error' : 'default'} 
                      size="sm"
                    >
                      {unlock.type === 'hard' ? 'Required' : 'Recommended'}
                    </Badge>
                    <span className="text-xs text-tertiary">
                      {unlock.requiredElo}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Available Lessons */}
        {availableIn.length > 0 && (
          <div className="space-y-spacing-xs">
            <h4 className="text-sm font-medium text-primary flex items-center gap-spacing-xs">
              <BookOpen className="w-4 h-4" />
              Available in Lessons
            </h4>
            <div className="space-y-spacing-xs">
              {availableIn.map((lesson, index) => (
                <div 
                  key={`${lesson.chapterId}-${lesson.lessonId}-${index}`}
                  className="p-spacing-xs rounded-md border border-default bg-secondary"
                >
                  <div className="text-xs text-secondary mb-1">{lesson.chapterTitle}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary">{lesson.lessonTitle}</span>
                    {onLessonClick && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onLessonClick(lesson.lessonId)}
                        className="h-6 px-2 text-xs"
                        disabled={isLocked}
                      >
                        Start
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Info message if locked */}
        {isLocked && (
          <div className="flex items-start gap-spacing-xs p-spacing-xs rounded-md bg-warningLight border border-warning">
            <Info className="w-4 h-4 text-warning mt-0.5" />
            <p className="text-xs text-secondary">
              Complete all required prerequisites to unlock this knowledge point.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}