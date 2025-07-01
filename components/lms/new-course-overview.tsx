'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, ChevronDown, MoreVertical, Plus, Download, BookOpen, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import { ChapterCard } from './ChapterCard'
import { LearnModal } from './LearnModal'
import { KnowledgePointAnalytics } from './KnowledgePointAnalytics'
import type { Course, FilterState, SortState, LessonWithChapter } from '@/lib/lms/new-course-types'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLessons, setSelectedLessons] = useState<string[]>([])
  const [sortState, setSortState] = useState<SortState>({ field: null, direction: null })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const [showLearnModal, setShowLearnModal] = useState(false)
  const [selectedLessonForAnalytics, setSelectedLessonForAnalytics] = useState<any>(null)
  const [filters, setFilters] = useState<FilterState>({
    chapters: [],
    completionStatus: [],
    knowledgePoints: []
  })

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

  const filteredAndSortedLessons = useMemo(() => {
    let filtered = allLessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesChapter = filters.chapters.length === 0 || filters.chapters.includes(lesson.chapterId)
      const matchesCompletion = filters.completionStatus.length === 0 || 
        (filters.completionStatus.includes('completed') && lesson.completed) ||
        (filters.completionStatus.includes('incomplete') && !lesson.completed)
      
      return matchesSearch && matchesChapter && matchesCompletion
    })

    if (sortState.field && sortState.direction) {
      filtered.sort((a, b) => {
        let aValue, bValue
        
        if (sortState.field === 'title') {
          aValue = a.title
          bValue = b.title
        } else if (sortState.field === 'chapter') {
          aValue = a.chapterOrder
          bValue = b.chapterOrder
        } else if (sortState.field === 'estimatedTime') {
          aValue = a.estimatedTime
          bValue = b.estimatedTime
        } else if (sortState.field === 'knowledgePoints') {
          aValue = a.knowledgePoints.length
          bValue = b.knowledgePoints.length
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortState.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        return 0
      })
    }

    return filtered
  }, [allLessons, searchQuery, sortState, filters])

  // Group lessons back by chapter for display
  const groupedLessons = useMemo(() => {
    const groups: { [key: string]: any } = {}
    
    filteredAndSortedLessons.forEach(lesson => {
      if (!groups[lesson.chapterId]) {
        const chapter = mockCourse.chapters.find(c => c.id === lesson.chapterId)!
        groups[lesson.chapterId] = {
          ...chapter,
          lessons: []
        }
      }
      groups[lesson.chapterId].lessons.push(lesson)
    })
    
    return Object.values(groups).sort((a: any, b: any) => a.order - b.order)
  }, [filteredAndSortedLessons])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLessons(filteredAndSortedLessons.map(lesson => lesson.id))
    } else {
      setSelectedLessons([])
    }
  }

  const handleSelectLesson = (lessonId: string, checked: boolean) => {
    if (checked) {
      setSelectedLessons([...selectedLessons, lessonId])
    } else {
      setSelectedLessons(selectedLessons.filter(id => id !== lessonId))
    }
  }

  const handleSort = (field: string) => {
    if (sortState.field === field) {
      if (sortState.direction === 'asc') {
        setSortState({ field, direction: 'desc' })
      } else if (sortState.direction === 'desc') {
        setSortState({ field: null, direction: null })
      }
    } else {
      setSortState({ field, direction: 'asc' })
    }
  }

  const getSortIcon = (field: string) => {
    if (sortState.field !== field) return null
    return sortState.direction === 'asc' ? '' : 'rotate-180'
  }

  const activeFiltersCount = filters.chapters.length + filters.completionStatus.length + filters.knowledgePoints.length

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

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-vergil-off-black/70">Course Progress</span>
            <span className="text-vergil-off-black/70">{mockCourse.completedLessons}/{mockCourse.totalLessons} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-vergil-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${mockCourse.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vergil-off-black/40 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search lessons, chapters, or knowledge points..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-vergil-purple/10 text-vergil-purple border-vergil-purple' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-vergil-purple text-white rounded-full text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Progress
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-vergil-off-white rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Chapter Filter */}
                <div>
                  <label className="block text-sm font-medium text-vergil-off-black mb-2">Chapter</label>
                  <div className="space-y-2">
                    {mockCourse.chapters.map(chapter => (
                      <label key={chapter.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.chapters.includes(chapter.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({ ...filters, chapters: [...filters.chapters, chapter.id] })
                            } else {
                              setFilters({ ...filters, chapters: filters.chapters.filter(c => c !== chapter.id) })
                            }
                          }}
                        />
                        <span className="text-sm">{chapter.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Completion Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-vergil-off-black mb-2">Status</label>
                  <div className="space-y-2">
                    {['completed', 'incomplete'].map(status => (
                      <label key={status} className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.completionStatus.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({ ...filters, completionStatus: [...filters.completionStatus, status] })
                            } else {
                              setFilters({ ...filters, completionStatus: filters.completionStatus.filter(s => s !== status) })
                            }
                          }}
                        />
                        <span className="text-sm capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters({ chapters: [], completionStatus: [], knowledgePoints: [] })}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedLessons.length > 0 && (
            <div className="mt-4 p-3 bg-vergil-emphasis-bg rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm text-vergil-emphasis-text">
                  {selectedLessons.length} lesson{selectedLessons.length > 1 ? 's' : ''} selected
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLessons([])}
                  className="text-vergil-emphasis-text hover:text-vergil-off-black"
                >
                  Clear selection
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-vergil-purple hover:bg-vergil-purple-lighter">
                  Start Selected Lessons
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Chapters and Lessons */}
      <div className="space-y-4">
        {groupedLessons.map((chapter: any) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            selectedLessons={selectedLessons}
            onSelectLesson={handleSelectLesson}
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
          {selectedLesson && (
            <LearnModal
              lesson={selectedLesson}
              isOpen={showLearnModal}
              onClose={() => {
                setShowLearnModal(false)
                setSelectedLesson(null)
              }}
            />
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
      />
    </div>
  )
}