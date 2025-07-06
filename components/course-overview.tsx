'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { CourseSection } from './course-section'
import { 
  BookOpen, 
  Target, 
  Clock, 
  Trophy, 
  TrendingUp,
  Award,
  ChevronRight,
  Play
} from 'lucide-react'
import type { Course } from '@/lib/lms/game-types'
import { cn } from '@/lib/utils'

interface CourseOverviewProps {
  course: Course
  onStartCourse?: () => void
  onStartLesson?: (lessonId: string, gameTypeId: string) => void
  className?: string
}

export function CourseOverview({ 
  course, 
  onStartCourse,
  onStartLesson,
  className 
}: CourseOverviewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Calculate overall course progress
  const totalKnowledgePoints = course.sections.reduce(
    (acc, section) => acc + section.lessons.reduce(
      (lessonAcc, lesson) => lessonAcc + lesson.knowledgePoints.length, 0
    ), 0
  )

  const masteredKnowledgePoints = course.sections.reduce(
    (acc, section) => acc + section.lessons.reduce(
      (lessonAcc, lesson) => lessonAcc + lesson.knowledgePoints.filter(
        kp => kp.proficiency >= 80
      ).length, 0
    ), 0
  )

  const courseProgress = totalKnowledgePoints > 0 
    ? (masteredKnowledgePoints / totalKnowledgePoints) * 100 
    : 0

  const totalTime = course.sections.reduce(
    (acc, section) => acc + section.lessons.reduce(
      (lessonAcc, lesson) => lessonAcc + lesson.estimatedTime, 0
    ), 0
  )

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className={cn("space-y-[var(--spacing-lg)]", className)}>
      {/* Course Header Card */}
      <Card variant="gradient" className="overflow-hidden">
        <div className="p-[var(--spacing-2xl)]">
          <div className="max-w-4xl">
            <h1 className="text-[var(--font-size-4xl)] font-[var(--font-weight-bold)] mb-[var(--spacing-sm)] tracking-[var(--letter-spacing-tight)]">
              {course.title}
            </h1>
            <p className="text-[var(--font-size-xl)] opacity-90 mb-[var(--spacing-lg)]">
              {course.description}
            </p>

            {/* Course Stats */}
            <div className="flex flex-wrap gap-[var(--spacing-lg)] mb-[var(--spacing-lg)]">
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <BookOpen className="w-5 h-5" />
                <span className="text-[var(--font-size-base)]">{course.totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Target className="w-5 h-5" />
                <span className="text-[var(--font-size-base)]">{course.totalKnowledgePoints} Knowledge Points</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Clock className="w-5 h-5" />
                <span className="text-[var(--font-size-base)]">{Math.round(totalTime / 60)} Hours</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              size="lg"
              onClick={onStartCourse}
              className="bg-[var(--bg-primary)] text-[var(--text-brand)] hover:bg-[var(--bg-secondary)] transition-all duration-[var(--duration-normal)]"
            >
              <Play className="w-5 h-5 mr-[var(--spacing-sm)]" />
              {courseProgress > 0 ? 'Continue Course' : 'Start Course'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Progress & Stats Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress Section */}
          <div className="mb-[var(--spacing-xl)]">
            <div className="flex items-center justify-between mb-[var(--spacing-sm)]">
              <h3 className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] text-[var(--text-primary)]">
                Overall Progress
              </h3>
              <span className="text-[var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--text-brand)]">
                {Math.round(courseProgress)}%
              </span>
            </div>
            <Progress value={courseProgress} className="h-3 mb-[var(--spacing-sm)]" />
            <p className="text-[var(--font-size-sm)] text-[var(--text-secondary)]">
              {masteredKnowledgePoints} of {totalKnowledgePoints} knowledge points mastered
            </p>
          </div>

          {/* Achievement Badges */}
          {courseProgress > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-md)]">
              <Card variant="metric" size="sm" className="text-center">
                <Trophy className="w-8 h-8 text-[var(--text-brand)] mx-auto mb-[var(--spacing-sm)]" />
                <p className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--text-primary)]">
                  {masteredKnowledgePoints} Mastered
                </p>
              </Card>
              <Card variant="metric" size="sm" className="text-center">
                <TrendingUp className="w-8 h-8 text-[var(--text-info)] mx-auto mb-[var(--spacing-sm)]" />
                <p className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--text-primary)]">
                  {course.sections.filter(s => 
                    s.lessons.some(l => l.knowledgePoints.some(kp => kp.proficiency > 0))
                  ).length} Active
                </p>
              </Card>
              <Card variant="metric" size="sm" className="text-center">
                <Award className="w-8 h-8 text-[var(--text-success)] mx-auto mb-[var(--spacing-sm)]" />
                <p className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--text-primary)]">
                  {course.sections.filter(s => 
                    s.lessons.every(l => l.knowledgePoints.every(kp => kp.proficiency >= 80))
                  ).length} Completed
                </p>
              </Card>
              <Card variant="metric" size="sm" className="text-center">
                <Clock className="w-8 h-8 text-[var(--text-brandLight)] mx-auto mb-[var(--spacing-sm)]" />
                <p className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--text-primary)]">
                  {Math.round(totalTime * (courseProgress / 100) / 60)}h Invested
                </p>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Sections */}
      <div className="space-y-[var(--spacing-md)]">
        <h2 className="text-[var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--text-primary)] tracking-[var(--letter-spacing-tight)]">
          Course Content
        </h2>
        {course.sections.map((section, index) => (
          <CourseSection
            key={section.id}
            section={section}
            sectionNumber={index + 1}
            isExpanded={expandedSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            onStartLesson={onStartLesson}
          />
        ))}
      </div>
    </div>
  )
}