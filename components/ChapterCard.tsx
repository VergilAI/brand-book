'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Clock, BookOpen, CheckCircle, Circle, Award } from 'lucide-react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { LessonRow } from './LessonRow'
import { cn } from '@/lib/utils'
import type { Chapter, Lesson } from '@/lib/lms/new-course-types'

interface ChapterCardProps {
  chapter: Chapter
  selectedLessons: string[]
  onSelectLesson: (lessonId: string, checked: boolean) => void
  onLearnClick: (lesson: Lesson) => void
  onLessonClick?: (lesson: Lesson) => void
  selectedLessonId?: string
  calculateTestReadiness?: (knowledgePoints: any[]) => { score: number, label: string, textColor: string, bgColor: string }
  getChapterStatus?: (chapter: any) => string
}

export function ChapterCard({ 
  chapter, 
  selectedLessons, 
  onSelectLesson, 
  onLearnClick,
  onLessonClick,
  selectedLessonId,
  calculateTestReadiness,
  getChapterStatus
}: ChapterCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const completedLessons = chapter.lessons.filter(lesson => lesson.completed).length
  const totalLessons = chapter.lessons.length
  const allLessonsSelected = chapter.lessons.every(lesson => selectedLessons.includes(lesson.id))
  const someLessonsSelected = chapter.lessons.some(lesson => selectedLessons.includes(lesson.id))

  const handleSelectAll = (checked: boolean) => {
    chapter.lessons.forEach(lesson => {
      onSelectLesson(lesson.id, checked)
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-gray-300'
  }

  const getProgressBadgeColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (progress >= 50) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (progress >= 25) return 'bg-orange-50 text-orange-700 border-orange-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <Card className="overflow-hidden">
      {/* Chapter Header */}
      <div className="p-4 border-b border-gray-200 bg-vergil-off-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-3 text-left flex-1 hover:opacity-80 transition-opacity"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-vergil-off-black/60" />
              ) : (
                <ChevronRight className="h-4 w-4 text-vergil-off-black/60" />
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-vergil-off-black">
                    Chapter {chapter.order}: {chapter.title}
                  </h3>
                  {(() => {
                    const allKPs = chapter.lessons.flatMap((lesson: any) => lesson.knowledgePoints)
                    const status = getChapterStatus ? getChapterStatus(chapter) : 'Not Started'
                    const testReadiness = calculateTestReadiness ? calculateTestReadiness(allKPs) : { score: 0, label: 'Not Ready', textColor: 'text-gray-600', bgColor: 'bg-gray-100 text-gray-700 border-gray-200' }
                    
                    return (
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", 
                          status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                        )}>
                          {status}
                        </Badge>
                        <Badge className={cn("text-xs", testReadiness.bgColor)}>
                          Test: {testReadiness.label} ({testReadiness.score}%)
                        </Badge>
                      </div>
                    )
                  })()}
                </div>
                
                <p className="text-sm text-vergil-off-black/70 mb-2">{chapter.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-vergil-off-black/60">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{completedLessons} completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{chapter.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3 ml-4">
            {/* Progress Circle */}
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-200"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${chapter.progress}, 100`}
                  className="text-vergil-purple"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-vergil-off-black">
                  {chapter.progress}%
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={cn("h-1.5 rounded-full transition-all duration-300", getProgressColor(chapter.progress))}
              style={{ width: `${chapter.progress}%`, willChange: 'width' }}
            />
          </div>
        </div>
      </div>

      {/* Lessons Table */}
      {isExpanded && (
        <div className="overflow-x-auto" style={{ willChange: 'scroll-position', transform: 'translateZ(0)' }}>
          <table className="w-full">
            <thead className="bg-vergil-off-white border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">
                  <span className="text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider">
                    Lesson
                  </span>
                </th>
                <th className="px-4 py-2 text-left">
                  <span className="text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider">
                    Knowledge Points
                  </span>
                </th>
                <th className="px-4 py-2 text-left">
                  <span className="text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider">
                    Status
                  </span>
                </th>
                <th className="px-4 py-2 text-right">
                  <span className="text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-vergil-full-white divide-y divide-gray-200">
              {chapter.lessons.map((lesson, index) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  lessonNumber={index + 1}
                  chapterNumber={chapter.order}
                  isSelected={selectedLessons.includes(lesson.id)}
                  isLessonSelected={selectedLessonId === lesson.id}
                  onSelect={(checked) => onSelectLesson(lesson.id, checked)}
                  onLearnClick={() => onLearnClick(lesson)}
                  onRowClick={() => onLessonClick?.(lesson)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}