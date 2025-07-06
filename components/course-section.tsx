'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Target, Clock, CheckCircle, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/card'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { LessonCard } from './lesson-card'
import type { Section } from '@/lib/lms/game-types'
import { cn } from '@/lib/utils'

interface CourseSectionProps {
  section: Section
  sectionNumber: number
  isExpanded?: boolean
  onToggle?: () => void
  onStartLesson?: (lessonId: string, gameTypeId: string) => void
  className?: string
}

export function CourseSection({ 
  section, 
  sectionNumber,
  isExpanded = true,
  onToggle,
  onStartLesson,
  className 
}: CourseSectionProps) {
  const [localExpanded, setLocalExpanded] = useState(isExpanded)
  const expanded = onToggle ? isExpanded : localExpanded
  
  // Calculate section progress
  const totalPoints = section.lessons.reduce(
    (acc, lesson) => acc + lesson.knowledgePoints.length, 0
  )
  const completedPoints = section.lessons.reduce(
    (acc, lesson) => acc + lesson.knowledgePoints.filter(kp => kp.proficiency >= 80).length, 0
  )
  const sectionProgress = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0

  const totalTime = section.lessons.reduce(
    (acc, lesson) => acc + lesson.estimatedTime, 0
  )

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setLocalExpanded(!localExpanded)
    }
  }

  const isCompleted = sectionProgress === 100
  const isInProgress = sectionProgress > 0 && sectionProgress < 100

  return (
    <Card 
      variant={isCompleted ? "outlined" : isInProgress ? "feature" : "default"} 
      className={cn("overflow-hidden transition-all duration-[var(--duration-normal)]", className)}
    >
      {/* Section Header */}
      <button
        className="w-full p-[var(--spacing-lg)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors duration-[var(--duration-normal)]"
        onClick={handleToggle}
      >
        <div className="flex items-start gap-[var(--spacing-md)]">
          <div className="mt-1">
            {expanded ? (
              <ChevronDown className="w-5 h-5 text-[var(--text-tertiary)]" />
            ) : (
              <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
              <Badge variant="default">Section {sectionNumber}</Badge>
              {isCompleted && (
                <Badge className="bg-[var(--text-success)] text-[var(--text-inverse)]">
                  <CheckCircle className="w-3 h-3 mr-[var(--spacing-xs)]" />
                  Completed
                </Badge>
              )}
              {isInProgress && (
                <Badge variant="info">
                  In Progress
                </Badge>
              )}
            </div>
            
            <h3 className="text-[var(--font-size-xl)] font-[var(--font-weight-bold)] text-[var(--text-primary)] mb-[var(--spacing-sm)] text-left">
              {section.title}
            </h3>
            
            <p className="text-[var(--text-secondary)] mb-[var(--spacing-md)] text-left">
              {section.description}
            </p>

            {/* Section Stats */}
            <div className="flex items-center gap-[var(--spacing-lg)] text-[var(--font-size-sm)] text-[var(--text-tertiary)] mb-[var(--spacing-md)]">
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <BookOpen className="w-4 h-4" />
                <span>{section.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Target className="w-4 h-4" />
                <span>{totalPoints} knowledge points</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Clock className="w-4 h-4" />
                <span>{totalTime} min total</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-[var(--spacing-sm)]">
                <span className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--text-secondary)]">
                  Section Progress
                </span>
                <span className="text-[var(--font-size-sm)] font-[var(--font-weight-bold)] text-[var(--text-brand)]">
                  {Math.round(sectionProgress)}%
                </span>
              </div>
              <Progress value={sectionProgress} className="h-2" />
            </div>
          </div>

          {/* Action Button for collapsed state */}
          {!expanded && sectionProgress < 100 && (
            <Button
              size="sm"
              variant={sectionProgress > 0 ? "secondary" : "primary"}
              onClick={(e) => {
                e.stopPropagation()
                handleToggle()
              }}
            >
              <Play className="w-4 h-4 mr-[var(--spacing-sm)]" />
              {sectionProgress > 0 ? 'Continue' : 'Start'}
            </Button>
          )}
        </div>
      </button>

      {/* Lessons */}
      {expanded && (
        <div className="border-t border-[var(--border-subtle)] p-[var(--spacing-lg)] bg-[var(--bg-secondary)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
            {section.lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                sectionNumber={sectionNumber}
                lessonNumber={index + 1}
                isLocked={index > 0 && section.lessons[index - 1].knowledgePoints.some(kp => kp.proficiency < 60)}
                onStartLesson={(gameTypeId) => onStartLesson?.(lesson.id, gameTypeId)}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}