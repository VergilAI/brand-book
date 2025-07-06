'use client'

import { useState, useMemo } from 'react'
import { BookOpen, GraduationCap } from 'lucide-react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { ChapterCard } from './ChapterCard'
import { LearnModal } from './LearnModal'
import { GameLauncher } from './game-launcher'
import { KnowledgePointAnalytics } from './KnowledgePointAnalytics'
import { DebugPanel } from './ui/debug-panel'
import { cn } from '@/lib/utils'
import type { Course, LessonWithChapter } from '@/lib/lms/new-course-types'



interface NewCourseOverviewProps {
  course?: Course
}

export function NewCourseOverview({ course }: NewCourseOverviewProps) {
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const [showLearnModal, setShowLearnModal] = useState(false)
  const [selectedLessonForAnalytics, setSelectedLessonForAnalytics] = useState<any>(null)
  const [activeGame, setActiveGame] = useState<{ lesson: any; gameTypeId: string } | null>(null)

  // Get all lessons for filtering and search
  const allLessons = useMemo(() => {
    if (!course) return []
    return course.chapters.flatMap(chapter => 
      chapter.lessons.map(lesson => ({
        ...lesson,
        chapterTitle: chapter.title,
        chapterId: chapter.id,
        chapterOrder: chapter.order
      }))
    )
  }, [course])

  // Just use the chapters directly since we're not filtering
  const groupedLessons = course?.chapters || []

  // Modal components now handle their own scroll prevention using React Portal

  const handleLearnClick = (lesson: any) => {
    setSelectedLesson(lesson)
    setSelectedLessonForAnalytics(null) // Close the right sidebar
    setShowLearnModal(true)
  }

  const totalKnowledgePoints = allLessons.reduce((acc, lesson) => acc + lesson.knowledgePoints.length, 0)
  const masteredKnowledgePoints = allLessons.reduce((acc, lesson) => 
    acc + lesson.knowledgePoints.filter(kp => kp.proficiency >= 80).length, 0
  )

  // Calculate test readiness based on knowledge point averages
  const calculateTestReadiness = (knowledgePoints: any[]) => {
    if (knowledgePoints.length === 0) return { score: 0, label: 'Not Ready', textColor: 'text-gray-600', bgColor: 'bg-gray-100 text-gray-700 border-gray-200' }
    
    const average = knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / knowledgePoints.length
    
    if (average >= 80) return { score: Math.round(average), label: 'Ready for Test', textColor: 'text-emerald-600', bgColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    if (average >= 60) return { score: Math.round(average), label: 'Almost Ready', textColor: 'text-yellow-600', bgColor: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    if (average >= 40) return { score: Math.round(average), label: 'Keep Learning', textColor: 'text-orange-600', bgColor: 'bg-orange-100 text-orange-700 border-orange-200' }
    return { score: Math.round(average), label: 'Not Ready', textColor: 'text-red-600', bgColor: 'bg-red-100 text-red-700 border-red-200' }
  }

  // Calculate chapter status based on test readiness
  const getChapterStatus = (chapter: any) => {
    const allKPs = chapter.lessons.flatMap((lesson: any) => lesson.knowledgePoints)
    const hasProgress = allKPs.some((kp: any) => kp.proficiency > 0)
    return hasProgress ? 'In Progress' : 'Not Started'
  }

  // Calculate overall course test readiness
  const courseKnowledgePoints = allLessons.flatMap(lesson => lesson.knowledgePoints)
  const courseTestReadiness = calculateTestReadiness(courseKnowledgePoints)

  if (!course) {
    return (
      <div className="flex h-screen bg-vergil-off-white overflow-hidden items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-vergil-off-black mb-2">No Course Data Available</h2>
          <p className="text-vergil-off-black/60">Please connect to the backend to load course information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-vergil-off-white overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto will-change-scroll" style={{ transform: 'translateZ(0)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb Navigation */}
            <div className="mb-4">
              <nav className="flex items-center text-sm">
                <a href="/lms" className="text-vergil-off-black/60 hover:text-vergil-purple transition-colors">
                  Courses
                </a>
                <span className="mx-2 text-vergil-off-black/40">/</span>
                <span className="text-vergil-off-black font-medium">{course?.title || ''}</span>
              </nav>
            </div>

            {/* Course Header Card */}
            <Card className="mb-4 p-4 bg-gradient-to-br from-vergil-off-white to-white border-vergil-purple/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-vergil-off-black mb-1">{course?.title || 'No Course Selected'}</h1>
                  <p className="text-sm text-vergil-off-black/70 max-w-2xl">
                    {course?.description || 'Select a course to view its details'}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 ml-6">
                  <Button
                    size="sm"
                    className="bg-vergil-purple hover:bg-vergil-purple-lighter text-white min-w-[160px]"
                    onClick={() => {
                      // Navigate to test screen
                      window.location.href = '/lms/test'
                    }}
                  >
                    Take Final Assessment
                  </Button>
                  <Badge className={cn("justify-center text-xs", courseTestReadiness.bgColor)}>
                    {courseTestReadiness.label} ({courseTestReadiness.score}%)
                  </Badge>
                </div>
              </div>

              {/* Progress Section */}
              <div className="border-t border-vergil-off-black/10 pt-3">
                {/* Course Metrics */}
                <div className="flex gap-3 w-full">
                  <div className="flex flex-col items-center text-center bg-white rounded-lg p-3 border border-vergil-purple/20 shadow-sm hover:shadow-md transition-all duration-200 flex-1">
                    <div className="flex flex-col items-center mb-1">
                      <div className="w-6 h-6 bg-vergil-purple/15 rounded-md flex items-center justify-center mb-1">
                        <BookOpen className="w-3 h-3 text-vergil-purple" />
                      </div>
                      <span className="text-xs font-semibold text-vergil-off-black">Lessons</span>
                    </div>
                    <div className="text-xl font-bold text-vergil-off-black mb-1">
                      {allLessons.filter(lesson => lesson.knowledgePoints.some(kp => kp.proficiency > 0 && kp.proficiency < 100)).length}
                    </div>
                    <div className="text-xs text-vergil-off-black/60 text-center">In Progress</div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center bg-white rounded-lg p-3 border border-vergil-purple/20 shadow-sm hover:shadow-md transition-all duration-200 flex-1">
                    <div className="flex flex-col items-center mb-1">
                      <div className="w-6 h-6 bg-vergil-purple/15 rounded-md flex items-center justify-center mb-1">
                        <GraduationCap className="w-3 h-3 text-vergil-purple" />
                      </div>
                      <span className="text-xs font-semibold text-vergil-off-black">Knowledge Points</span>
                    </div>
                    <div className="text-xl font-bold text-vergil-off-black mb-1">{masteredKnowledgePoints}/{totalKnowledgePoints}</div>
                    <div className="text-xs text-vergil-off-black/60 text-center">Mastered</div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center bg-white rounded-lg p-3 border border-vergil-purple/20 shadow-sm hover:shadow-md transition-all duration-200 flex-1">
                    <div className="flex flex-col items-center mb-1">
                      <div className="w-6 h-6 bg-vergil-purple/15 rounded-md flex items-center justify-center mb-1">
                        <span className="w-3 h-3 bg-vergil-purple rounded flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">{course?.chapters.filter(ch => ch.testScore !== null && ch.testScore !== undefined).length || 0}</span>
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-vergil-off-black">Chapter Tests</span>
                    </div>
                    <div className="text-xl font-bold text-vergil-off-black mb-1">
                      {course?.chapters.filter(ch => ch.testScore !== null && ch.testScore !== undefined).length || 0}/{course?.chapters.length || 0}
                    </div>
                    <div className="text-xs text-vergil-off-black/60 text-center">
                      Completed
                      {(() => {
                        const completedTests = course?.chapters.filter(ch => ch.testScore !== null && ch.testScore !== undefined) || []
                        if (completedTests.length > 0) {
                          const avgScore = Math.round(completedTests.reduce((acc, ch) => acc + (ch.testScore || 0), 0) / completedTests.length)
                          return ` (Avg: ${avgScore}%)`
                        }
                        return ''
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Content Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Course Content</h2>
            </div>

            {/* Chapters and Lessons */}
            <div className="space-y-4">
              {groupedLessons.map((chapter: any) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  selectedLessons={[]}
                  onSelectLesson={() => {}}
                  onLearnClick={handleLearnClick}
                  onLessonClick={(lesson) => {
                    // Toggle lesson selection
                    if (selectedLessonForAnalytics?.id === lesson.id) {
                      setSelectedLessonForAnalytics(null)
                    } else {
                      setSelectedLessonForAnalytics(lesson)
                    }
                  }}
                  selectedLessonId={selectedLessonForAnalytics?.id}
                  calculateTestReadiness={calculateTestReadiness}
                  getChapterStatus={getChapterStatus}
                />
              ))}
            </div>

            {/* Learn Modal */}
            {selectedLesson && !activeGame && (
              <LearnModal
                lesson={selectedLesson}
                isOpen={showLearnModal}
                onClose={() => {
                  setShowLearnModal(false)
                  setSelectedLesson(null)
                }}
                onStartLearning={(gameTypeId) => {
                  setActiveGame({ lesson: selectedLesson, gameTypeId })
                  setShowLearnModal(false)
                }}
              />
            )}

            {/* Game Launcher */}
            {activeGame && (
              <GameLauncher
                gameTypeId={activeGame.gameTypeId}
                lesson={activeGame.lesson}
                onComplete={(result) => {
                  console.log('Game completed:', result)
                  setActiveGame(null)
                  setSelectedLesson(null)
                }}
                onQuit={() => {
                  setActiveGame(null)
                  setShowLearnModal(true)
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Analytics Sidebar */}
      <KnowledgePointAnalytics 
        lesson={selectedLessonForAnalytics} 
        allLessons={allLessons}
        selectedLesson={selectedLessonForAnalytics}
        onNavigateToLesson={(lesson) => {
          setSelectedLessonForAnalytics(lesson)
          setSelectedLesson(lesson)
          setShowLearnModal(true)
        }}
        onLearnClick={(lesson) => {
          setSelectedLesson(lesson)
          setSelectedLessonForAnalytics(null) // Close the right sidebar
          setShowLearnModal(true)
        }}
      />
      
      {/* Debug Panel - only show in development */}
      <DebugPanel />
    </div>
  )
}