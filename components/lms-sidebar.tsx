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
        return 'var(--color-interactive-primary-default)'
      case 'test':
        return 'var(--color-text-warning)'
      case 'game':
        return 'var(--color-text-success)'
      case 'material':
        return 'var(--color-text-info)'
      default:
        return 'var(--color-interactive-primary-default)'
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
          className="fixed inset-0 z-40 bg-overlay lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-80",
          "bg-background-primary border-r border-default",
          "transform transition-transform duration-[var(--duration-normal)] ease-[var(--easing-out)]",
          "lg:sticky lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-[var(--spacing-component-md)] border-b border-subtle">
            <div>
              <h2 className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] leading-[var(--line-height-tight)] text-primary">
                {course.title}
              </h2>
              <div className="text-[var(--font-size-sm)] text-secondary mt-[var(--spacing-component-xs)]">
                {course.progress}% Complete
              </div>
            </div>
            <button
              className="lg:hidden p-[var(--spacing-component-sm)] rounded-[var(--border-radius-md)] hover:bg-background-emphasis transition-colors duration-[var(--duration-fast)]"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-icon-secondary" />
            </button>
          </div>

          {/* Progress */}
          <div className="p-[var(--spacing-component-md)] border-b border-subtle">
            <div className="w-full h-2 bg-background-emphasis rounded-full overflow-hidden">
              <div 
                className="h-full bg-interactive-primary-default transition-all duration-[var(--duration-slow)] ease-[var(--easing-out)]"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="mt-[var(--spacing-component-sm)] text-[var(--font-size-xs)] text-secondary">
              {course.sections.reduce((acc, section) => 
                acc + section.lessons.filter(lesson => lesson.completed).length, 0
              )} of {course.sections.reduce((acc, section) => acc + section.lessons.length, 0)} lessons completed
            </div>
          </div>

          {/* Search */}
          <div className="p-[var(--spacing-component-md)] border-b border-subtle">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-secondary" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-[var(--spacing-component-sm)] 
                  bg-background-emphasisInput rounded-[var(--border-radius-md)]
                  border border-subtle focus:border-focus
                  text-[var(--font-size-base)] text-primary
                  placeholder:text-tertiary
                  transition-all duration-[var(--duration-fast)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--shadow-focus)]"
              />
            </div>
          </div>

          {/* Course structure */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-[var(--spacing-component-md)] space-y-[var(--spacing-component-sm)]">
              {filteredSections.map((section) => (
                <div key={section.id} className="space-y-[var(--spacing-component-xs)]">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center justify-between w-full p-[var(--spacing-component-sm)] 
                      rounded-[var(--border-radius-lg)] bg-background-emphasis 
                      hover:bg-background-emphasisInput transition-all duration-[var(--duration-fast)]
                      group"
                  >
                    <div className="flex items-center gap-[var(--spacing-component-sm)]">
                      <div className={cn(
                        "transition-transform duration-[var(--duration-fast)]",
                        section.expanded ? "rotate-90" : "rotate-0"
                      )}>
                        <ChevronRight className="w-4 h-4 text-icon-secondary" />
                      </div>
                      <div className="text-left">
                        <div className="font-[var(--font-weight-medium)] text-primary">
                          {section.title}
                        </div>
                        <div className="text-[var(--font-size-xs)] text-secondary">
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
                          stroke="var(--color-border-subtle)"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="var(--color-interactive-primary-default)"
                          strokeWidth="3"
                          strokeDasharray={`${section.progress}, 100`}
                          className="transition-all duration-[var(--duration-slow)]"
                        />
                      </svg>
                    </div>
                  </button>

                  {section.expanded && (
                    <div className={cn(
                      "space-y-[2px] ml-[var(--spacing-component-md)]",
                      "animate-in slide-in-from-top-2 fade-in duration-[var(--duration-normal)]"
                    )}>
                      {section.lessons.map((lesson) => {
                        const Icon = getIcon(lesson.type)
                        return (
                          <button
                            key={lesson.id}
                            className={cn(
                              "flex items-center gap-[var(--spacing-component-sm)] w-full p-[var(--spacing-component-sm)]",
                              "rounded-[var(--border-radius-md)] text-left",
                              "transition-all duration-[var(--duration-fast)]",
                              "group relative overflow-hidden",
                              lesson.locked 
                                ? "opacity-[var(--opacity-disabled)] cursor-not-allowed" 
                                : "hover:bg-background-emphasis",
                              lesson.completed && "bg-background-successLight"
                            )}
                            disabled={lesson.locked}
                            onClick={() => {
                              if (!lesson.locked) {
                                if (lesson.type === 'lesson') {
                                  window.location.href = `/lms/course/${course.id}/lesson/${lesson.id}`
                                } else if (lesson.type === 'test') {
                                  window.location.href = `/lms/course/${course.id}/test/${lesson.id}`
                                } else if (lesson.type === 'game') {
                                  window.location.href = `/lms/course/${course.id}/game/${lesson.id}`
                                }
                              }
                            }}
                          >
                            <div className="flex-shrink-0">
                              {lesson.locked ? (
                                <Lock className="w-4 h-4 text-icon-disabled" />
                              ) : lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-icon-success" />
                              ) : (
                                <Circle className="w-4 h-4 text-icon-secondary" />
                              )}
                            </div>
                            
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getTypeColor(lesson.type) }}
                            />

                            <div className="flex-1 min-w-0">
                              <div className="font-[var(--font-weight-medium)] text-primary truncate">
                                {lesson.title}
                              </div>
                              <div className="flex items-center gap-[var(--spacing-component-sm)] text-[var(--font-size-xs)] text-secondary">
                                <Icon className="w-3 h-3" />
                                <span className="capitalize">{lesson.type}</span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>

                            {!lesson.locked && !lesson.completed && (
                              <Play className="w-4 h-4 text-icon-brand opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)]" />
                            )}

                            {/* Breathing animation for active lesson */}
                            {!lesson.locked && !lesson.completed && (
                              <div className="absolute inset-0 bg-interactive-primary-default opacity-0 group-hover:opacity-[0.05] transition-opacity duration-[var(--duration-normal)]" />
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