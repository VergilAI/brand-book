'use client'

import { useState, useMemo } from 'react'
import { BookOpen, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChapterCard } from './ChapterCard'
import { LearnModal } from './LearnModal'
import { GameLauncher } from './game-launcher'
import { KnowledgePointAnalytics } from './KnowledgePointAnalytics'
import { cn } from '@/lib/utils'
import type { Course, LessonWithChapter } from '@/lib/lms/new-course-types'

// Mock course data with chapters and lessons structure
const mockCourse: Course = {
  id: 'course-1',
  title: 'AI Fundamentals',
  description: 'Comprehensive introduction to artificial intelligence covering core concepts, algorithms, and real-world applications.',
  totalLessons: 28,
  completedLessons: 12,
  progress: 43,
  chapters: [
    {
      id: 'chapter-1',
      title: 'Introduction to Artificial Intelligence',
      description: 'Core AI concepts and foundational principles',
      order: 1,
      progress: 85,
      estimatedTime: '2 hours',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'What is Artificial Intelligence?',
          description: 'Overview of AI concepts, history, and applications',
          knowledgePoints: [
            { id: 'kp-1', title: 'AI Definition', description: 'Understanding what artificial intelligence is', proficiency: 85 },
            { id: 'kp-2', title: 'Types of AI', description: 'Narrow AI, general AI, and superintelligence', proficiency: 72 },
            { id: 'kp-3', title: 'AI Applications', description: 'Real-world AI use cases across industries', proficiency: 90 }
          ],
          availableGameTypes: ['written-material', 'flashcards', 'millionaire', 'case-study'],
          estimatedTime: 30,
          completed: false
        },
        {
          id: 'lesson-1-2',
          title: 'Search and Problem Solving',
          description: 'AI search algorithms and problem-solving techniques',
          knowledgePoints: [
            { id: 'kp-4', title: 'Search Algorithms', description: 'Breadth-first, depth-first, and informed search', proficiency: 65 },
            { id: 'kp-5', title: 'Heuristics', description: 'Using heuristic functions to guide search', proficiency: 58 },
            { id: 'kp-6', title: 'Optimization', description: 'Finding optimal solutions in problem spaces', proficiency: 40 }
          ],
          availableGameTypes: ['written-material', 'video', 'flashcards', 'timed-test'],
          estimatedTime: 45,
          completed: false
        },
        {
          id: 'lesson-1-3',
          title: 'Knowledge Representation',
          description: 'How AI systems represent and reason with knowledge',
          knowledgePoints: [
            { id: 'kp-7', title: 'Logic Systems', description: 'Propositional and predicate logic in AI', proficiency: 0 },
            { id: 'kp-8', title: 'Semantic Networks', description: 'Graph-based knowledge representation', proficiency: 0 },
            { id: 'kp-9', title: 'Inference Rules', description: 'Automated reasoning and rule-based systems', proficiency: 0 }
          ],
          availableGameTypes: ['written-material', 'video', 'crossword', 'concept-matching'],
          estimatedTime: 50,
          completed: false
        }
      ]
    },
    {
      id: 'chapter-2',
      title: 'Machine Learning Basics',
      description: 'Introduction to learning algorithms and data-driven AI',
      order: 2,
      progress: 25,
      estimatedTime: '3.5 hours',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Learning from Data',
          description: 'Supervised, unsupervised, and reinforcement learning',
          knowledgePoints: [
            { id: 'kp-10', title: 'Supervised Learning', description: 'Learning with labeled examples', proficiency: 75 },
            { id: 'kp-11', title: 'Unsupervised Learning', description: 'Finding patterns in unlabeled data', proficiency: 60 },
            { id: 'kp-12', title: 'Reinforcement Learning', description: 'Learning through trial and error', proficiency: 30 }
          ],
          availableGameTypes: ['written-material', 'video', 'flashcards', 'role-playing'],
          estimatedTime: 60,
          completed: false
        },
        {
          id: 'lesson-2-2',
          title: 'Neural Networks Introduction',
          description: 'Basic neural network concepts and architectures',
          knowledgePoints: [
            { id: 'kp-13', title: 'Artificial Neurons', description: 'Mathematical model of biological neurons', proficiency: 0 },
            { id: 'kp-14', title: 'Network Layers', description: 'Input, hidden, and output layers', proficiency: 0 },
            { id: 'kp-15', title: 'Training Process', description: 'How neural networks learn from data', proficiency: 0 }
          ],
          availableGameTypes: ['written-material', 'video', 'territory-conquest', 'case-study'],
          estimatedTime: 90,
          completed: false
        }
      ]
    },
    {
      id: 'chapter-3',
      title: 'AI Ethics and Future',
      description: 'Responsible AI development and future implications',
      order: 3,
      progress: 0,
      estimatedTime: '4 hours',
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'AI Ethics and Bias',
          description: 'Ethical considerations and bias in AI systems',
          knowledgePoints: [
            { id: 'kp-16', title: 'Algorithmic Bias', description: 'Understanding and mitigating bias in AI', proficiency: 0 },
            { id: 'kp-17', title: 'Fairness Metrics', description: 'Measuring and ensuring AI fairness', proficiency: 0 },
            { id: 'kp-18', title: 'AI Governance', description: 'Policies and frameworks for responsible AI', proficiency: 0 }
          ],
          availableGameTypes: ['written-material', 'video', 'debate', 'shark-tank'],
          estimatedTime: 120,
          completed: false
        }
      ]
    }
  ]
}


export function NewCourseOverview() {
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const [showLearnModal, setShowLearnModal] = useState(false)
  const [selectedLessonForAnalytics, setSelectedLessonForAnalytics] = useState<any>(null)
  const [activeGame, setActiveGame] = useState<{ lesson: any; gameTypeId: string } | null>(null)

  // Get all lessons for filtering and search
  const allLessons = useMemo(() => {
    return mockCourse.chapters.flatMap(chapter => 
      chapter.lessons.map(lesson => ({
        ...lesson,
        chapterTitle: chapter.title,
        chapterId: chapter.id,
        chapterOrder: chapter.order
      }))
    )
  }, [])

  // Just use the chapters directly since we're not filtering
  const groupedLessons = mockCourse.chapters


  const handleLearnClick = (lesson: any) => {
    setSelectedLesson(lesson)
    setSelectedLessonForAnalytics(lesson)
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

  return (
    <div className="flex h-screen bg-vergil-off-white">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-vergil-off-black mb-2">{mockCourse.title}</h1>
            <p className="text-sm text-vergil-off-black/70 mb-3">{mockCourse.description}</p>
            
            {/* Course stats */}
            <div className="flex items-center gap-4 text-xs text-vergil-off-black/60">
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{mockCourse.totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                <span>{masteredKnowledgePoints}/{totalKnowledgePoints} knowledge points</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-vergil-purple rounded-full flex items-center justify-center text-white text-[10px]">
                  {mockCourse.progress}%
                </span>
                <span>progress</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge className={courseTestReadiness.bgColor}>
              Final Test: {courseTestReadiness.label} ({courseTestReadiness.score}%)
            </Badge>
            <Button
              size="sm"
              className="bg-vergil-purple hover:bg-vergil-purple-lighter text-white"
              onClick={() => {
                // Navigate to test screen
                window.location.href = '/lms/test'
              }}
            >
              Take Test
            </Button>
          </div>
        </div>

        {/* Course Progress Ring */}
        <div className="mb-6 flex items-center gap-6">
          {/* Radial Progress Ring */}
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#7B00FF"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - mockCourse.progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-vergil-off-black">{mockCourse.progress}%</span>
              <span className="text-xs text-vergil-off-black/60">Complete</span>
            </div>
          </div>
          
          {/* Course Stats */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-vergil-off-black mb-3">Course Progress</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-vergil-off-black/60">Lessons Completed</span>
                <span className="font-medium text-vergil-off-black">{mockCourse.completedLessons}/{mockCourse.totalLessons}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-vergil-off-black/60">Knowledge Points Mastered</span>
                <span className="font-medium text-vergil-off-black">{masteredKnowledgePoints}/{totalKnowledgePoints}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-vergil-off-black/60">Active Chapters</span>
                <span className="font-medium text-vergil-off-black">
                  {mockCourse.chapters.filter(ch => ch.progress > 0 && ch.progress < 100).length} of {mockCourse.chapters.length}
                </span>
              </div>
            </div>
          </div>
        </div>
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
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="w-full h-full bg-white rounded-lg overflow-hidden">
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
              </div>
            </div>
          )}
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
          setShowLearnModal(true)
        }}
      />
    </div>
  )
}