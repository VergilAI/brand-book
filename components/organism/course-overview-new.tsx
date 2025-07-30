'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  CheckCircle,
  Circle,
  Lock,
  Target,
  Brain,
  Trophy,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/atomic/button'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import { LearningActivitiesModal } from '@/components/learning-activities-modal'
import { cn } from '@/lib/utils'
import type { Course, Lesson } from '@/lib/lms/new-course-types'

interface CourseOverviewNewProps {
  course?: Course
}

export function CourseOverviewNew({ course }: CourseOverviewNewProps) {
  const router = useRouter()
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['chapter-1']))
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLesson, setModalLesson] = useState<Lesson | null>(null)

  // Calculate course statistics
  const stats = useMemo(() => {
    if (!course) return null

    const allLessons = course.chapters.flatMap(ch => ch.lessons)
    const totalKnowledgePoints = allLessons.reduce((acc, lesson) => acc + lesson.knowledgePoints.length, 0)
    const masteredKnowledgePoints = allLessons.reduce((acc, lesson) => 
      acc + lesson.knowledgePoints.filter(kp => kp.proficiency >= 80).length, 0
    )
    const completedChapterTests = course.chapters.filter(ch => ch.testScore !== null && ch.testScore !== undefined).length
    const averageTestScore = completedChapterTests > 0
      ? Math.round(course.chapters.reduce((acc, ch) => acc + (ch.testScore || 0), 0) / completedChapterTests)
      : 0

    // Calculate time to finish
    const incompleteLessons = allLessons.filter(l => !l.completed)
    const totalMinutesRemaining = incompleteLessons.reduce((acc, lesson) => acc + lesson.estimatedTime, 0)
    const hoursToFinish = Math.ceil(totalMinutesRemaining / 60)

    return {
      totalLessons: allLessons.length,
      completedLessons: allLessons.filter(l => l.knowledgePoints.every(kp => kp.proficiency >= 80)).length,
      inProgressLessons: allLessons.filter(l => 
        l.knowledgePoints.some(kp => kp.proficiency > 0) && 
        !l.knowledgePoints.every(kp => kp.proficiency >= 80)
      ).length,
      totalKnowledgePoints,
      masteredKnowledgePoints,
      completedChapterTests,
      totalChapters: course.chapters.length,
      averageTestScore,
      overallProgress: Math.round((masteredKnowledgePoints / totalKnowledgePoints) * 100),
      hoursToFinish
    }
  }, [course])

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set<string>()
    if (!expandedChapters.has(chapterId)) {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const getTestReadinessColor = (score: number) => {
    if (score >= 80) return 'text-text-success' // #0F8A0F
    if (score >= 60) return 'text-text-success' // #0F8A0F
    return 'text-text-error' // #E51C23
  }

  const getTestReadinessBadge = (knowledgePoints: any[]) => {
    if (knowledgePoints.length === 0) return null
    const avg = knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / knowledgePoints.length
    
    if (avg >= 80) return <Badge variant="success">Ready</Badge>
    if (avg >= 60) return <Badge variant="success">Almost Ready</Badge>
    return <Badge variant="destructive">Not Ready</Badge>
  }

  if (!course || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-bg-primary"> {/* #FFFFFF */}
        <Card className="p-spacing-xl text-center"> {/* 32px */}
          <CardContent>
            <h2 className="text-xl font-semibold text-text-primary mb-spacing-sm"> {/* #1D1D1F, 8px */}
              No Course Data Available
            </h2>
            <p className="text-text-secondary"> {/* #6C6C6D */}
              Please select a course to view its details.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-primary"> {/* #FFFFFF */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Course Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 text-text-secondary"> {/* #6C6C6D */}
            <a href="/lms" className="hover:text-text-primary transition-colors"> {/* #1D1D1F */}
              Courses
            </a>
            <span className="text-text-secondary">/</span> {/* #6C6C6D */}
            <span className="text-text-primary font-medium"> {/* #1D1D1F */}
              {course.title}
            </span>
          </nav>

          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-3"> {/* #1D1D1F */}
                {course.title}
              </h1>
              <p className="text-base text-text-secondary leading-relaxed mb-4 max-w-3xl"> {/* #6C6C6D */}
                {course.description}
              </p>
            </div>
            
            {/* Action Button */}
            <div className="flex flex-col items-end gap-2">
              <Button 
                size="md" 
                variant="primary"
                className="px-6"
                onClick={() => router.push('/lms/test')}
              >
                Take Final Assessment
              </Button>
              
              <div className="text-center">
                {stats.overallProgress >= 80 ? (
                  <span className="text-sm text-text-success font-medium">Ready</span> /* #0F8A0F */
                ) : (
                  <span className="text-sm text-text-error font-medium">Not Ready ({stats.overallProgress}%)</span> /* #E51C23 */
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Lessons Progress */}
          <Card className="p-6 border border-border-subtle hover:border-border-default transition-all duration-200"> {/* rgba(0,0,0,0.05), rgba(0,0,0,0.1) */}
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-text-brand" /> {/* #7B00FF */}
                <p className="text-sm font-medium text-text-secondary"> {/* #6C6C6D */}
                  Lessons
                </p>
              </div>
              <p className="text-2xl font-bold text-text-primary mb-2"> {/* #1D1D1F */}
                {stats.inProgressLessons}
              </p>
              <p className="text-sm text-text-secondary mb-1"> {/* #6C6C6D */}
                In Progress
              </p>
            </CardContent>
          </Card>

          {/* Knowledge Points */}
          <Card className="p-6 border border-border-subtle hover:border-border-default transition-all duration-200">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-text-success" /> {/* #0F8A0F */}
                <p className="text-sm font-medium text-text-secondary">
                  Knowledge Points
                </p>
              </div>
              <p className="text-2xl font-bold text-text-primary mb-2">
                {stats.masteredKnowledgePoints}/{stats.totalKnowledgePoints}
              </p>
              <p className="text-sm text-text-secondary mb-1">
                Mastered
              </p>
            </CardContent>
          </Card>

          {/* Time to Finish */}
          <Card className="p-6 border border-border-subtle hover:border-border-default transition-all duration-200">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-text-warning" /> {/* #FFC700 */}
                <p className="text-sm font-medium text-text-secondary">
                  Finish in
                </p>
              </div>
              <p className="text-2xl font-bold text-text-primary mb-2">
                {stats.hoursToFinish} {stats.hoursToFinish === 1 ? 'hour' : 'hours'}
              </p>
              <p className="text-sm text-text-secondary mb-1">
                Estimated time remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Content */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-6"> {/* #1D1D1F */}
            Course Content
          </h2>

          <div className="space-y-3">
            {course.chapters.map((chapter, chapterIndex) => {
              const isExpanded = expandedChapters.has(chapter.id)
              const chapterKPs = chapter.lessons.flatMap(l => l.knowledgePoints)
              const chapterProgress = chapterKPs.length > 0
                ? Math.round(chapterKPs.reduce((acc, kp) => acc + kp.proficiency, 0) / chapterKPs.length)
                : 0

              return (
                <Card 
                  key={chapter.id} 
                  className="overflow-hidden border border-border-subtle hover:border-border-default transition-all duration-200" /* rgba(0,0,0,0.05), rgba(0,0,0,0.1) */
                >
                  <CardHeader 
                    className="cursor-pointer px-6 py-4 hover:bg-bg-secondary transition-colors" /* #F5F5F7 */
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ChevronDown className={cn(
                          "h-4 w-4 text-text-tertiary transition-transform duration-200", /* #71717A */
                          !isExpanded && "-rotate-90"
                        )} />
                        <div>
                          <h3 className="text-base font-semibold text-text-primary"> {/* #1D1D1F */}
                            Chapter {chapterIndex + 1}: {chapter.title}
                          </h3>
                          <p className="text-sm text-text-secondary mt-0.5"> {/* #6C6C6D */}
                            {chapter.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {chapterProgress >= 80 ? (
                          <Badge variant="success" className="text-xs">Completed</Badge>
                        ) : chapterProgress > 0 ? (
                          <Badge variant="info" className="text-xs">In Progress</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Not Started</Badge>
                        )}
                        
                        {chapter.testScore !== null ? (
                          <Badge variant="success" className="text-xs">Test: {chapter.testScore}%</Badge>
                        ) : chapterProgress >= 60 ? (
                          <Badge variant="success" className="text-xs">Test: Ready</Badge>
                        ) : (
                          <Badge variant="success" className="text-xs">Test: Keep Learning ({chapterProgress}%)</Badge>
                        )}
                        
                        <div className="text-right min-w-[45px]">
                          <div className="text-sm font-medium text-text-primary">
                            {chapterProgress}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-text-secondary">📖 {chapter.lessons.length} lessons</span>
                        <span className="text-xs text-text-secondary">⭕ {chapter.lessons.filter(l => l.completed).length} completed</span>
                        <span className="text-xs text-text-secondary">🕐 {chapter.estimatedTime}</span>
                      </div>
                      <Progress 
                        value={chapterProgress} 
                        variant="default"
                        size="sm"
                      />
                    </div>
                  </CardHeader>

                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <CardContent className="border-t border-border-subtle bg-bg-primary px-6 py-4"> {/* rgba(0,0,0,0.05), #FFFFFF */}
                      {/* Lesson Table Header */}
                      <div className="mb-4">
                        <div className="grid grid-cols-12 gap-4 py-2 px-4 bg-bg-secondary rounded-lg text-sm font-medium text-text-secondary"> {/* #F5F5F7, #6C6C6D */}
                          <div className="col-span-5">LESSON</div>
                          <div className="col-span-3">KNOWLEDGE POINTS</div>
                          <div className="col-span-2">STATUS</div>
                          <div className="col-span-2">ACTIONS</div>
                        </div>
                      </div>
                      
                      {/* Lesson Rows */}
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson, lessonIndex) => {
                          const lessonProgress = lesson.knowledgePoints.length > 0
                            ? Math.round(lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length)
                            : 0
                          const isCompleted = lesson.knowledgePoints.every(kp => kp.proficiency >= 80)
                          const hasProgress = lesson.knowledgePoints.some(kp => kp.proficiency > 0)
                          
                          // Status determination
                          const getStatusBadge = () => {
                            if (lesson.status === 'in-progress') {
                              return <Badge variant="info" className="text-xs">In Progress</Badge>
                            } else if (lesson.status === 'not-started') {
                              return <Badge variant="secondary" className="text-xs">Not Started</Badge>
                            } else {
                              return <Badge variant="success" className="text-xs">Completed</Badge>
                            }
                          }
                          
                          const getKnowledgePointsBadge = () => {
                            const masteredCount = lesson.knowledgePoints.filter(kp => kp.proficiency >= 80).length
                            const totalCount = lesson.knowledgePoints.length
                            
                            if (masteredCount === totalCount && totalCount > 0) {
                              return <Badge variant="success" className="text-xs">Mastered ({masteredCount * 100 / totalCount}%)</Badge>
                            } else if (masteredCount > 0) {
                              return <Badge variant="success" className="text-xs">Learning ({Math.round(masteredCount * 100 / totalCount)}%)</Badge>
                            } else {
                              return <Badge variant="secondary" className="text-xs">Not Started (0%)</Badge>
                            }
                          }

                          return (
                            <div
                              key={lesson.id}
                              className="grid grid-cols-12 gap-4 py-3 px-4 border border-border-subtle rounded-lg hover:bg-bg-secondary transition-all cursor-default" /* rgba(0,0,0,0.05), #F5F5F7 */
                              onClick={() => setSelectedLesson(lesson.id)}
                            >
                              {/* Lesson Info */}
                              <div className="col-span-5">
                                <h4 className="text-sm font-medium text-text-primary mb-1"> {/* #1D1D1F */}
                                  {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
                                </h4>
                                <p className="text-xs text-text-secondary">
                                  {lesson.description}
                                </p>
                              </div>
                              
                              {/* Knowledge Points */}
                              <div className="col-span-3 flex items-center">
                                <div className="flex items-center gap-2">
                                  <Brain className="h-3 w-3 text-text-secondary" />
                                  <span className="text-xs text-text-secondary">{lesson.knowledgePoints.length} points</span>
                                </div>
                                <div className="ml-2">
                                  {getKnowledgePointsBadge()}
                                </div>
                              </div>
                              
                              {/* Status */}
                              <div className="col-span-2 flex items-center">
                                {getStatusBadge()}
                              </div>
                              
                              {/* Actions */}
                              <div className="col-span-2 flex items-center">
                                <Button 
                                  size="sm"
                                  variant="primary"
                                  className="text-xs px-3 py-1.5 h-auto"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setModalLesson(lesson)
                                    setIsModalOpen(true)
                                  }}
                                >
                                  <Play className="mr-1 h-3.5 w-3.5" />
                                  Learn
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Learning Activities Modal */}
        {modalLesson && (
          <LearningActivitiesModal
            lesson={modalLesson}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setModalLesson(null)
            }}
            onSelectGame={(gameTypeId) => {
              // Navigate to the game page with the lesson and game type
              router.push(`/lms/lesson/${modalLesson.id}/game/${gameTypeId}`)
            }}
          />
        )}
      </div>
    </div>
  )
}