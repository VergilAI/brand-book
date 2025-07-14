'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Search, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Circle, 
  Lock, 
  FileText, 
  Gamepad2,
  ClipboardList,
  Clock,
  ChevronDown,
  ChevronRight,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LMSSidebarProps {
  isOpen: boolean
  onClose: () => void
  currentView: 'dashboard' | 'course' | 'lesson'
}

interface Course {
  id: string
  title: string
  progress: number
  sections: Section[]
}

interface Section {
  id: string
  title: string
  progress: number
  expanded: boolean
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  type: 'lesson' | 'test' | 'game' | 'material'
  completed: boolean
  locked: boolean
  duration: string
}

export function LMSSidebar({ isOpen, onClose, currentView }: LMSSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [course, setCourse] = useState<Course>({
    id: 'ai-fundamentals',
    title: 'AI Fundamentals',
    progress: 65,
    sections: [
      {
        id: 'section-1',
        title: 'Introduction to AI',
        progress: 100,
        expanded: true,
        lessons: [
          { id: 'lesson-1-1', title: 'What is Artificial Intelligence?', type: 'lesson', completed: true, locked: false, duration: '15 min' },
          { id: 'lesson-1-2', title: 'History of AI', type: 'lesson', completed: true, locked: false, duration: '12 min' },
          { id: 'lesson-1-3', title: 'Knowledge Check', type: 'test', completed: true, locked: false, duration: '10 min' },
          { id: 'lesson-1-4', title: 'AI Timeline Game', type: 'game', completed: true, locked: false, duration: '20 min' }
        ]
      },
      {
        id: 'section-2',
        title: 'Machine Learning Basics',
        progress: 60,
        expanded: false,
        lessons: [
          { id: 'lesson-2-1', title: 'Understanding ML', type: 'lesson', completed: true, locked: false, duration: '18 min' },
          { id: 'lesson-2-2', title: 'Types of Learning', type: 'lesson', completed: true, locked: false, duration: '22 min' },
          { id: 'lesson-2-3', title: 'ML Algorithms Overview', type: 'lesson', completed: false, locked: false, duration: '25 min' },
          { id: 'lesson-2-4', title: 'Practice Exercise', type: 'test', completed: false, locked: true, duration: '15 min' }
        ]
      },
      {
        id: 'section-3',
        title: 'Neural Networks',
        progress: 0,
        expanded: false,
        lessons: [
          { id: 'lesson-3-1', title: 'Neural Network Basics', type: 'lesson', completed: false, locked: true, duration: '20 min' },
          { id: 'lesson-3-2', title: 'Deep Learning Introduction', type: 'lesson', completed: false, locked: true, duration: '30 min' },
          { id: 'lesson-3-3', title: 'Building Your First Network', type: 'game', completed: false, locked: true, duration: '45 min' }
        ]
      }
    ]
  })

  const toggleSection = (sectionId: string) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    }))
  }

  const getIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'lesson':
        return BookOpen
      case 'test':
        return ClipboardList
      case 'game':
        return Gamepad2
      case 'material':
        return FileText
      default:
        return BookOpen
    }
  }

  const getTypeColor = (type: Lesson['type']) => {
    switch (type) {
      case 'lesson':
        return '#7B00FF'
      case 'test':
        return '#F59E0B'
      case 'game':
        return '#10B981'
      case 'material':
        return '#3B82F6'
      default:
        return '#7B00FF'
    }
  }

  const filteredSections = course.sections.map(section => ({
    ...section,
    lessons: section.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    section.lessons.length > 0
  )

  if (currentView === 'dashboard') {
    return null
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-80",
          "bg-white border-r border-gray-200",
          "transform transition-transform duration-200 ease-out",
          "lg:sticky lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {course.title}
              </h2>
              <div className="text-sm text-gray-600 mt-1">
                {course.progress}% Complete
              </div>
            </div>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Progress */}
          <div className="p-4 border-b border-gray-200">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-300 ease-out"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {course.sections.reduce((acc, section) => 
                acc + section.lessons.filter(lesson => lesson.completed).length, 0
              )} of {course.sections.reduce((acc, section) => acc + section.lessons.length, 0)} lessons completed
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 
                  bg-gray-50 rounded-lg
                  border border-gray-200 focus:border-purple-500
                  text-sm text-gray-900
                  placeholder:text-gray-500
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Course structure */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {filteredSections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center justify-between w-full p-3 
                      rounded-lg bg-gray-50 
                      hover:bg-gray-100 transition-all duration-200
                      group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "transition-transform duration-200",
                        section.expanded ? "rotate-90" : "rotate-0"
                      )}>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          {section.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {section.progress}% complete
                        </div>
                      </div>
                    </div>
                    <div className="relative w-8 h-8">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#7B00FF"
                          strokeWidth="3"
                          strokeDasharray={`${section.progress}, 100`}
                          className="transition-all duration-300"
                        />
                      </svg>
                    </div>
                  </button>

                  {section.expanded && (
                    <div className="space-y-1 ml-6">
                      {section.lessons.map((lesson) => {
                        const Icon = getIcon(lesson.type)
                        return (
                          <button
                            key={lesson.id}
                            className={cn(
                              "flex items-center gap-3 w-full p-3",
                              "rounded-lg text-left",
                              "transition-all duration-200",
                              "group relative overflow-hidden",
                              lesson.locked 
                                ? "opacity-40 cursor-not-allowed" 
                                : "hover:bg-gray-100",
                              lesson.completed && "bg-green-50"
                            )}
                            disabled={lesson.locked}
                            onClick={() => {
                              if (!lesson.locked) {
                                window.location.href = '/lms/new_course_overview'
                              }
                            }}
                          >
                            <div className="flex-shrink-0">
                              {lesson.locked ? (
                                <Lock className="w-4 h-4 text-gray-400" />
                              ) : lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getTypeColor(lesson.type) }}
                            />

                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {lesson.title}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Icon className="w-3 h-3" />
                                <span className="capitalize">{lesson.type}</span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>

                            {!lesson.locked && !lesson.completed && (
                              <Play className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}