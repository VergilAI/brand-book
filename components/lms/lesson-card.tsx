'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Play, Clock, Target, Trophy, Lock } from 'lucide-react'
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

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        !isLocked && "hover:shadow-lg hover:-translate-y-1",
        isLocked && "opacity-60",
        className
      )}>
        {/* Progress Bar at Top */}
        <div className="h-2 bg-mist-gray/20">
          <div 
            className="h-full bg-gradient-to-r from-cosmic-purple to-electric-violet transition-all duration-500"
            style={{ width: `${overallProficiency}%` }}
          />
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {sectionNumber}.{lessonNumber}
                </Badge>
                {overallProficiency >= 80 && (
                  <Badge className="text-xs bg-phosphor-cyan text-white">
                    <Trophy className="w-3 h-3 mr-1" />
                    Mastered
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-display">
                {lesson.title}
              </CardTitle>
            </div>
            {isLocked && (
              <div className="w-10 h-10 rounded-full bg-stone-gray/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-stone-gray" />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-stone-gray">
            {lesson.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-stone-gray">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{lesson.knowledgePoints.length} points</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{lesson.estimatedTime} min</span>
            </div>
          </div>

          {/* Knowledge Points Preview */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-stone-gray uppercase tracking-wide">
              Knowledge Points
            </p>
            <div className="flex flex-wrap gap-1">
              {lesson.knowledgePoints.slice(0, 3).map((kp, index) => (
                <Badge 
                  key={kp.id} 
                  variant="secondary" 
                  className="text-xs"
                >
                  {kp.title}
                </Badge>
              ))}
              {lesson.knowledgePoints.length > 3 && (
                <Badge variant="outline" className="text-xs">
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
              "w-full",
              overallProficiency > 0 
                ? "bg-electric-violet hover:bg-cosmic-purple" 
                : "bg-cosmic-purple hover:bg-electric-violet"
            )}
          >
            <Play className="w-4 h-4 mr-2" />
            {overallProficiency > 0 ? 'Continue Learning' : 'Start Learning'}
          </Button>

          {/* Proficiency Display */}
          {overallProficiency > 0 && (
            <div className="text-center">
              <span className="text-sm font-medium text-cosmic-purple">
                {Math.round(overallProficiency)}% Complete
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