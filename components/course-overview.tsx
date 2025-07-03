'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/card'
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
    <div className={cn("space-y-6", className)}>
      {/* Course Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-cosmic-purple to-electric-violet p-8 text-white">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-display font-bold mb-3">
              {course.title}
            </h1>
            <p className="text-xl text-white/90 mb-6">
              {course.description}
            </p>

            {/* Course Stats */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{course.totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>{course.totalKnowledgePoints} Knowledge Points</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{Math.round(totalTime / 60)} Hours</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              size="lg"
              onClick={onStartCourse}
              className="bg-white text-cosmic-purple hover:bg-pure-light"
            >
              <Play className="w-5 h-5 mr-2" />
              {courseProgress > 0 ? 'Continue Course' : 'Start Course'}
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-display font-semibold text-deep-space">
                Overall Progress
              </h3>
              <span className="text-2xl font-bold text-cosmic-purple">
                {Math.round(courseProgress)}%
              </span>
            </div>
            <Progress value={courseProgress} className="h-3 mb-3" />
            <p className="text-sm text-stone-gray">
              {masteredKnowledgePoints} of {totalKnowledgePoints} knowledge points mastered
            </p>
          </div>

          {/* Achievement Badges */}
          {courseProgress > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-mist-gray/10 rounded-lg">
                <Trophy className="w-8 h-8 text-cosmic-purple mx-auto mb-2" />
                <p className="text-sm font-medium text-deep-space">
                  {masteredKnowledgePoints} Mastered
                </p>
              </div>
              <div className="text-center p-4 bg-mist-gray/10 rounded-lg">
                <TrendingUp className="w-8 h-8 text-electric-violet mx-auto mb-2" />
                <p className="text-sm font-medium text-deep-space">
                  {course.sections.filter(s => 
                    s.lessons.some(l => l.knowledgePoints.some(kp => kp.proficiency > 0))
                  ).length} Active Sections
                </p>
              </div>
              <div className="text-center p-4 bg-mist-gray/10 rounded-lg">
                <Award className="w-8 h-8 text-phosphor-cyan mx-auto mb-2" />
                <p className="text-sm font-medium text-deep-space">
                  {course.sections.filter(s => 
                    s.lessons.every(l => l.knowledgePoints.every(kp => kp.proficiency >= 80))
                  ).length} Completed
                </p>
              </div>
              <div className="text-center p-4 bg-mist-gray/10 rounded-lg">
                <Clock className="w-8 h-8 text-luminous-indigo mx-auto mb-2" />
                <p className="text-sm font-medium text-deep-space">
                  {Math.round(totalTime * (courseProgress / 100) / 60)}h Invested
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Sections */}
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold text-deep-space">
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