'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { Play, Clock, Target, Trophy, Lock, BookOpen, Video, FileQuestion, Sparkles } from 'lucide-react'
import { LessonModal } from './lesson-modal'
import type { Lesson } from '@/lib/lms/game-types'
import { cn } from '@/lib/utils'

interface LessonCardProps {
  lesson: Lesson
  isLocked?: boolean
  sectionNumber: number
  lessonNumber: number
  onStartLesson?: (lessonId: string) => void
  className?: string
}

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Video
    case 'quiz':
      return FileQuestion
    case 'interactive':
      return Sparkles
    default:
      return BookOpen
  }
}

const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
  switch (difficulty) {
    case 'beginner':
      return 'text-[var(--text-success)]'
    case 'intermediate':
      return 'text-[var(--text-info)]'
    case 'advanced':
      return 'text-[var(--text-error)]'
    default:
      return 'text-[var(--text-secondary)]'
  }
}

export function LessonCard({ 
  lesson, 
  isLocked = false,
  sectionNumber,
  lessonNumber,
  onStartLesson,
  className 
}: LessonCardProps) {
  const [showModal, setShowModal] = useState(false)
  
  const overallProficiency = lesson.knowledgePoints.reduce(
    (acc, kp) => acc + kp.proficiency, 0
  ) / lesson.knowledgePoints.length

  const handleLearnClick = () => {
    if (!isLocked) {
      setShowModal(true)
    }
  }

  const handleSelectGame = (gameTypeId: string) => {
    setShowModal(false)
    onStartLesson?.(gameTypeId)
  }

  const isMastered = overallProficiency >= 80
  const isInProgress = overallProficiency > 0 && overallProficiency < 80

  const LessonIcon = getLessonIcon(lesson.type || 'lesson')

  return (
    <>
      <Card 
        variant={isLocked ? "default" : isMastered ? "gradient" : isInProgress ? "feature" : "interactive"}
        className={cn(
          "relative transition-all duration-[var(--duration-slow)]",
          isLocked && "opacity-60 cursor-not-allowed",
          !isLocked && "group",
          className
        )}
      >
        {/* Progress Indicator */}
        <div className="absolute top-0 left-0 right-0 h-1">
          <Progress 
            value={overallProficiency} 
            variant="default"
            size="sm"
            className="h-1 rounded-none rounded-t-lg"
            indicatorClassName="bg-gradient-consciousness rounded-t-lg"
          />
        </div>

        <CardHeader className="pb-[var(--spacing-sm)]">
          <div className="flex items-start justify-between gap-[var(--spacing-md)]">
            <div className="flex-1 space-y-[var(--spacing-sm)]">
              {/* Lesson Number & Status */}
              <div className="flex items-center gap-[var(--spacing-xs)] flex-wrap">
                <Badge variant="secondary" className="text-[var(--font-size-xs)] font-[var(--font-weight-medium)]">
                  {sectionNumber}.{lessonNumber}
                </Badge>
                {lesson.difficulty && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-[var(--font-size-xs)] capitalize",
                      getDifficultyColor(lesson.difficulty)
                    )}
                  >
                    {lesson.difficulty}
                  </Badge>
                )}
                {isMastered && (
                  <Badge className="text-[var(--font-size-xs)] bg-[var(--bg-successLight)] text-[var(--text-success)] border-[var(--border-success)]">
                    <Trophy className="w-3 h-3 mr-[var(--spacing-xs)]" />
                    Mastered
                  </Badge>
                )}
              </div>
              
              {/* Title */}
              <CardTitle className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] text-[var(--text-primary)] line-clamp-2">
                {lesson.title}
              </CardTitle>
            </div>

            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center transition-all duration-[var(--duration-normal)]",
              isLocked 
                ? "bg-[var(--bg-disabled)] text-[var(--text-disabled)]" 
                : "bg-[var(--gradient-consciousness)] text-[var(--text-inverse)] shadow-brand-sm group-hover:shadow-brand-md"
            )}>
              {isLocked ? (
                <Lock className="w-5 h-5" />
              ) : (
                <LessonIcon className="w-5 h-5" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-[var(--spacing-md)]">
          {/* Description */}
          <p className="text-[var(--font-size-sm)] text-[var(--text-secondary)] line-clamp-2">
            {lesson.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-[var(--spacing-lg)] text-[var(--font-size-sm)]">
            <div className="flex items-center gap-[var(--spacing-xs)] text-[var(--text-tertiary)]">
              <Target className="w-4 h-4" />
              <span>{lesson.knowledgePoints.length} points</span>
            </div>
            <div className="flex items-center gap-[var(--spacing-xs)] text-[var(--text-tertiary)]">
              <Clock className="w-4 h-4" />
              <span>{lesson.estimatedTime} min</span>
            </div>
          </div>

          {/* Knowledge Points Preview */}
          <div className="space-y-[var(--spacing-xs)]">
            <p className="text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--text-tertiary)] uppercase tracking-[var(--letter-spacing-wide)]">
              Topics Covered
            </p>
            <div className="flex flex-wrap gap-[var(--spacing-xs)]">
              {lesson.knowledgePoints.slice(0, 3).map((kp) => (
                <Badge 
                  key={kp.id} 
                  variant="secondary" 
                  className="text-[var(--font-size-xs)] bg-[var(--bg-emphasis)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
                >
                  {kp.title}
                </Badge>
              ))}
              {lesson.knowledgePoints.length > 3 && (
                <Badge 
                  variant="secondary" 
                  className="text-[var(--font-size-xs)] text-[var(--text-tertiary)] border-[var(--border-subtle)]"
                >
                  +{lesson.knowledgePoints.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleLearnClick}
            disabled={isLocked}
            className={cn(
              "w-full transition-all duration-[var(--duration-normal)]",
              !isLocked && "shadow-brand-sm hover:shadow-brand-md",
              isMastered && "bg-[var(--bg-successLight)] hover:bg-[var(--bg-successLight)] text-[var(--text-success)] border border-[var(--border-success)]",
              isInProgress && !isMastered && "bg-[var(--bg-brand)] hover:opacity-90 text-[var(--text-inverse)]",
              !isInProgress && !isMastered && !isLocked && "bg-[var(--bg-brand)] hover:opacity-90 text-[var(--text-inverse)]"
            )}
            variant={isMastered ? "outline" : "default"}
          >
            <Play className="w-4 h-4 mr-[var(--spacing-sm)]" />
            {isMastered ? 'Review Lesson' : isInProgress ? 'Continue Learning' : 'Start Learning'}
          </Button>

          {/* Progress Display */}
          {overallProficiency > 0 && (
            <div className="flex items-center justify-between text-[var(--font-size-sm)]">
              <span className="text-[var(--text-secondary)]">Progress</span>
              <span className="font-[var(--font-weight-medium)] text-[var(--text-brand)]">
                {Math.round(overallProficiency)}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Modal */}
      <LessonModal
        lesson={lesson}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelectGame={handleSelectGame}
      />
    </>
  )
}