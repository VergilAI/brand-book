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
import { LessonModal } from '@/components/lesson-modal'
import { cn } from '@/lib/utils'
import type { Course, Lesson } from '@/lib/lms/new-course-types'

interface CourseOverviewNewProps {
  course?: Course
}

export function CourseOverviewNew({ course }: CourseOverviewNewProps) {
  const router = useRouter()
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
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
      overallProgress: Math.round((masteredKnowledgePoints / totalKnowledgePoints) * 100)
    }
  }, [course])

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const getTestReadinessColor = (score: number) => {
    if (score >= 80) return 'text-text-success' // #0F8A0F
    if (score >= 60) return 'text-text-warning' // #FFC700
    return 'text-text-error' // #E51C23
  }

  const getTestReadinessBadge = (knowledgePoints: any[]) => {
    if (knowledgePoints.length === 0) return null
    const avg = knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / knowledgePoints.length
    
    if (avg >= 80) return <Badge variant="success">Ready</Badge>
    if (avg >= 60) return <Badge variant="warning">Almost Ready</Badge>
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
              All Courses
            </a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium"> {/* #1D1D1F */}
              {course.title}
            </span>
          </nav>

          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-3"> {/* #1D1D1F */}
                {course.title}
              </h1>
              <p className="text-base text-text-secondary leading-relaxed mb-4 max-w-3xl"> {/* #6C6C6D */}
                {course.description}
              </p>
              
              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary"> {/* #6C6C6D */}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>~3 hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{stats.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>2,341 enrolled</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>
            
            {/* Action Card */}
            <div className="lg:w-72">
              <Card className="p-6 bg-gray-25 border border-border-subtle"> {/* #FAFAFC, rgba(0,0,0,0.05) */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-text-primary mb-1"> {/* #1D1D1F */}
                    {stats.overallProgress}%
                  </div>
                  <p className="text-sm text-text-secondary">Course Mastery</p> {/* #6C6C6D */}
                </div>
                
                <Button 
                  size="md" 
                  variant="primary"
                  className="w-full"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Take Final Assessment
                </Button>
                
                <div className="mt-3 text-center">
                  {stats.overallProgress >= 80 ? (
                    <span className="text-sm text-text-success font-medium">Ready</span> /* #0F8A0F */
                  ) : (
                    <span className="text-sm text-text-tertiary">Not Ready</span> /* #71717A */
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Progress Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Lessons Progress */}
          <Card className="p-5 border border-border-subtle hover:border-border-default transition-all duration-200"> {/* rgba(0,0,0,0.05), rgba(0,0,0,0.1) */}
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-text-brand" /> {/* #A64DFF */}
                <p className="text-sm font-medium text-text-secondary"> {/* #6C6C6D */}
                  Lessons
                </p>
              </div>
              <p className="text-xl font-bold text-text-primary mb-3"> {/* #1D1D1F */}
                {stats.completedLessons}
                <span className="text-base text-text-tertiary font-normal">/{stats.totalLessons}</span> {/* #71717A */}
              </p>
              <Progress 
                value={(stats.completedLessons / stats.totalLessons) * 100} 
                className="h-1.5 mb-2"
              />
              <p className="text-xs text-text-tertiary"> {/* #71717A */}
                {stats.inProgressLessons} in progress
              </p>
            </CardContent>
          </Card>

          {/* Knowledge Points */}
          <Card className="p-5 border border-border-subtle hover:border-border-default transition-all duration-200">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-text-success" /> {/* #0F8A0F */}
                <p className="text-sm font-medium text-text-secondary">
                  Knowledge Points
                </p>
              </div>
              <p className="text-xl font-bold text-text-primary mb-3">
                {stats.masteredKnowledgePoints}
                <span className="text-base text-text-tertiary font-normal">/{stats.totalKnowledgePoints}</span>
              </p>
              <Progress 
                value={(stats.masteredKnowledgePoints / stats.totalKnowledgePoints) * 100} 
                className="h-1.5 mb-2"
              />
              <p className="text-xs text-text-tertiary">
                Mastered (≥80%)
              </p>
            </CardContent>
          </Card>

          {/* Chapter Tests */}
          <Card className="p-5 border border-border-subtle hover:border-border-default transition-all duration-200">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-text-info" /> {/* #0087FF */}
                <p className="text-sm font-medium text-text-secondary">
                  Chapter Tests
                </p>
              </div>
              <p className="text-xl font-bold text-text-primary mb-3">
                {stats.completedChapterTests}
                <span className="text-base text-text-tertiary font-normal">/{stats.totalChapters}</span>
              </p>
              <Progress 
                value={(stats.completedChapterTests / stats.totalChapters) * 100} 
                className="h-1.5 mb-2"
              />
              <p className="text-xs text-text-tertiary">
                {stats.averageTestScore > 0 ? `Avg: ${stats.averageTestScore}%` : 'No tests taken'}
              </p>
            </CardContent>
          </Card>

          {/* Overall Progress */}
          <Card className="p-5 border border-border-subtle hover:border-border-default transition-all duration-200">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-text-warning" /> {/* #FFC700 */}
                <p className="text-sm font-medium text-text-secondary">
                  Overall Progress
                </p>
              </div>
              <p className="text-xl font-bold text-text-primary mb-3">
                {stats.overallProgress}
                <span className="text-base text-text-tertiary font-normal">%</span>
              </p>
              <Progress 
                value={stats.overallProgress} 
                className="h-1.5 mb-2"
              />
              <p className="text-xs text-text-tertiary">
                Course completion
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
                        <ChevronRight className={cn(
                          "h-4 w-4 text-text-tertiary transition-transform duration-200", /* #71717A */
                          isExpanded && "rotate-90"
                        )} />
                        <div>
                          <h3 className="text-base font-semibold text-text-primary"> {/* #1D1D1F */}
                            Chapter {chapterIndex + 1}: {chapter.title}
                          </h3>
                          <p className="text-sm text-text-secondary mt-0.5"> {/* #6C6C6D */}
                            {chapter.lessons.length} lessons • {chapterKPs.length} knowledge points
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {chapterProgress >= 80 && (
                          <Badge variant="success" className="text-xs">Ready</Badge>
                        )}
                        {chapter.testScore !== null && chapter.testScore !== undefined && (
                          <span className="text-sm text-text-secondary">
                            Test: {chapter.testScore}%
                          </span>
                        )}
                        <div className="text-right min-w-[45px]">
                          <div className="text-sm font-medium text-text-primary">
                            {chapterProgress}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="border-t border-border-subtle bg-bg-primary px-6 py-4"> {/* rgba(0,0,0,0.05), #FFFFFF */}
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson, lessonIndex) => {
                          const lessonProgress = lesson.knowledgePoints.length > 0
                            ? Math.round(lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length)
                            : 0
                          const isCompleted = lesson.knowledgePoints.every(kp => kp.proficiency >= 80)
                          const hasProgress = lesson.knowledgePoints.some(kp => kp.proficiency > 0)

                          return (
                            <div
                              key={lesson.id}
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-lg bg-bg-primary border transition-all cursor-pointer", /* #FFFFFF */
                                selectedLesson === lesson.id 
                                  ? "border-border-brand" /* #A64DFF */
                                  : "border-border-subtle hover:border-border-default hover:bg-bg-primary" /* rgba(0,0,0,0.05), rgba(0,0,0,0.1), #FFFFFF */
                              )}
                              onClick={() => setSelectedLesson(lesson.id)}
                            >
                              {/* Progress Indicator */}
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-text-success" /> /* #0F8A0F */
                                ) : hasProgress ? (
                                  <div className="relative w-5 h-5">
                                    <Circle className="h-5 w-5 text-text-tertiary" /> /* #71717A */
                                    <svg className="absolute inset-0 w-5 h-5 -rotate-90">
                                      <circle
                                        cx="10"
                                        cy="10"
                                        r="8"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        className="text-text-warning" /* #FFC700 */
                                        strokeDasharray={`${lessonProgress * 0.5} 50`}
                                      />
                                    </svg>
                                  </div>
                                ) : (
                                  <Circle className="h-5 w-5 text-text-tertiary" /> /* #71717A */
                                )}
                              </div>

                              {/* Lesson Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-text-primary"> {/* #1D1D1F */}
                                  {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-xs">
                                  <span className="text-text-secondary flex items-center gap-1"> {/* #6C6C6D */}
                                    <Brain className="h-3 w-3" />
                                    {lesson.knowledgePoints.length} knowledge points
                                  </span>
                                  <span className={cn(
                                    isCompleted ? "text-text-success" : 
                                    hasProgress ? "text-text-warning" : 
                                    "text-text-tertiary"
                                  )}>
                                    {isCompleted ? "Completed" : hasProgress ? `${lessonProgress}%` : "Not Started"}
                                  </span>
                                </div>
                              </div>

                              {/* Action Button */}
                              <Button 
                                size="sm"
                                variant={isCompleted ? "secondary" : "primary"}
                                className="text-xs px-3 py-1.5 h-auto"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setModalLesson(lesson)
                                  setIsModalOpen(true)
                                }}
                              >
                                {isCompleted ? (
                                  <>
                                    <FileText className="mr-1 h-3.5 w-3.5" />
                                    Review
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-1 h-3.5 w-3.5" />
                                    {hasProgress ? 'Continue' : 'Start'}
                                  </>
                                )}
                              </Button>
                            </div>
                          )
                        })}
                      </div>

                      {/* Chapter Test Button */}
                      <div className="mt-4 pt-4 border-t border-border-subtle">
                        <div className="flex items-center justify-between px-4">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-text-brand" /> {/* #A64DFF */}
                            <div>
                              <h4 className="text-sm font-medium text-text-primary"> {/* #1D1D1F */}
                                Chapter Assessment
                              </h4>
                              <p className="text-xs text-text-secondary"> {/* #6C6C6D */}
                                {chapterProgress < 60 
                                  ? `Complete at least 60% (currently ${chapterProgress}%)`
                                  : chapter.testScore !== null 
                                    ? `Last score: ${chapter.testScore}%`
                                    : "Ready to test your knowledge"
                                }
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={chapterProgress < 60 ? "secondary" : chapter.testScore !== null ? "secondary" : "primary"}
                            disabled={chapterProgress < 60}
                            className="min-w-[100px]"
                            onClick={() => {
                              // TODO: Start chapter test
                            }}
                          >
                            {chapter.testScore !== null ? (
                              <>
                                <Award className="mr-1 h-3.5 w-3.5" />
                                Retake
                              </>
                            ) : chapterProgress < 60 ? (
                              <>
                                <Lock className="mr-1 h-3.5 w-3.5" />
                                Locked
                              </>
                            ) : (
                              <>
                                <Target className="mr-1 h-3.5 w-3.5" />
                                Take Test
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Lesson Modal */}
        {modalLesson && (
          <LessonModal
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