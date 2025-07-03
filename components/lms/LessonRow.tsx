'use client'

import { Circle, Play, Award, Brain, MoreVertical, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/lib/lms/new-course-types'

interface LessonRowProps {
  lesson: Lesson
  lessonNumber: number
  chapterNumber: number
  isSelected: boolean
  isLessonSelected?: boolean
  onSelect: (checked: boolean) => void
  onLearnClick: () => void
  onRowClick?: () => void
}

export function LessonRow({ 
  lesson, 
  lessonNumber, 
  chapterNumber, 
  isSelected, 
  isLessonSelected = false,
  onSelect, 
  onLearnClick,
  onRowClick
}: LessonRowProps) {
  const averageProficiency = lesson.knowledgePoints.length > 0
    ? Math.round(lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length)
    : 0

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-300'
    if (proficiency >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    if (proficiency >= 40) return 'bg-orange-100 text-orange-800 border-orange-300'
    if (proficiency > 0) return 'bg-red-100 text-red-800 border-red-300'
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 80) return 'Mastered'
    if (proficiency >= 60) return 'Proficient'
    if (proficiency >= 40) return 'Learning'
    if (proficiency > 0) return 'Beginner'
    return 'Not Started'
  }


  return (
    <tr 
      className={cn(
        "hover:bg-vergil-off-white/50 transition-colors cursor-pointer",
        isSelected && "bg-vergil-emphasis-bg/20",
        isLessonSelected && "bg-vergil-purple/10 border-l-4 border-vergil-purple"
      )}
      onClick={() => {
        onSelect(!isSelected)
        onRowClick?.()
      }}
    >
      <td className="px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-medium text-vergil-off-black">
              {chapterNumber}.{lessonNumber} {lesson.title}
            </h4>
            {lesson.completed && (
              <Award className="h-3 w-3 text-vergil-purple" />
            )}
          </div>
          <p className="text-xs text-vergil-off-black/60 line-clamp-1">
            {lesson.description}
          </p>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Brain className="h-3 w-3 text-vergil-off-black/40" />
            <span className="text-xs text-vergil-off-black/60">
              {lesson.knowledgePoints.length} points
            </span>
          </div>
          
          {lesson.knowledgePoints.length > 0 && (
            <Badge className={cn("text-xs", getProficiencyColor(averageProficiency))}>
              {getProficiencyLabel(averageProficiency)} ({averageProficiency}%)
            </Badge>
          )}
        </div>
      </td>

      <td className="px-4 py-3">
        {(() => {
          const hasProgress = lesson.knowledgePoints.some((kp: any) => kp.proficiency > 0)
          return hasProgress ? (
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              <Circle className="w-2 h-2 mr-1" />
              In Progress
            </Badge>
          ) : (
            <Badge className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
              <Circle className="w-2 h-2 mr-1" />
              Not Started
            </Badge>
          )
        })()}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant={lesson.completed ? "outline" : "default"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onLearnClick()
            }}
            className={cn(
              "text-xs h-7",
              !lesson.completed ? "bg-vergil-purple hover:bg-vergil-purple-lighter" : ""
            )}
          >
            <Play className="w-3 h-3 mr-1" />
            {lesson.completed ? 'Review' : 'Learn'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-vergil-off-black/60 hover:text-vergil-off-black h-7 w-7 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>
      </td>
    </tr>
  )
}