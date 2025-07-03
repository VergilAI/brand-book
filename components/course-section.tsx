'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Target, Clock } from 'lucide-react'
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

  return (
    <div className={cn("bg-white rounded-xl border border-mist-gray/30 overflow-hidden", className)}>
      {/* Section Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-mist-gray/5 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1"
          >
            {expanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline">Section {sectionNumber}</Badge>
              {sectionProgress === 100 && (
                <Badge className="bg-phosphor-cyan text-white">
                  Completed
                </Badge>
              )}
            </div>
            
            <h3 className="text-2xl font-display font-bold text-deep-space mb-2">
              {section.title}
            </h3>
            
            <p className="text-stone-gray mb-4">
              {section.description}
            </p>

            {/* Section Stats */}
            <div className="flex items-center gap-6 text-sm text-stone-gray mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{section.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{totalPoints} knowledge points</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{totalTime} min total</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-gray">
                  Section Progress
                </span>
                <span className="text-sm font-bold text-cosmic-purple">
                  {Math.round(sectionProgress)}%
                </span>
              </div>
              <Progress value={sectionProgress} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      {expanded && (
        <div className="border-t border-mist-gray/20 p-6 bg-mist-gray/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  )
}