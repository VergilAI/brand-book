'use client'

import { useState, useEffect } from 'react'
import { X, BookOpen, CheckCircle, Clock, Brain, Loader2 } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import { cn } from '@/lib/utils'
import { contentAPI } from '@/app/lms/new_course_overview/api/course-api'

interface WrittenMaterialProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}


export function WrittenMaterial({ lessonId, onClose, onComplete }: WrittenMaterialProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set())
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<any>(null)

  // Fetch written material content
  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true)
        setError(null)
        const materialContent = await contentAPI.getLessonContent(lessonId, 'written-material')
        
        if (materialContent && materialContent.content) {
          // Transform the content into sections
          const sections = materialContent.content.pages?.map((page: any, index: number) => ({
            id: `section-${index}`,
            title: page.title || `Section ${index + 1}`,
            content: page.content || ''
          })) || [{
            id: 'main',
            title: materialContent.content.title || 'Lesson Content',
            content: materialContent.content.pages?.[0]?.content || ''
          }]

          setContent({
            title: materialContent.content.title || 'Lesson Content',
            estimatedTime: `${materialContent.content.estimatedReadTime || 10} min read`,
            sections,
            chapterName: materialContent.content.chapterName,
            courseName: materialContent.content.courseName
          })
        } else {
          // No content available
          setContent(null)
          setError('No content available for this lesson')
        }
      } catch (err) {
        console.error('Error loading written material:', err)
        setError('Failed to load lesson content')
        // No fallback - show error
        setContent(null)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [lessonId])

  // Handle body scroll lock
  useEffect(() => {
    // Store original body styles
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width
    
    // Get current scroll position
    const scrollY = window.scrollY
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    
    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = originalWidth
      
      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }, [])

  const totalSections = content?.sections?.length || 0
  const progressPercentage = Math.round((completedSections.size / totalSections) * 100)

  const markSectionComplete = () => {
    const newCompleted = new Set(completedSections)
    newCompleted.add(currentSection)
    setCompletedSections(newCompleted)
    
    if (newCompleted.size === totalSections) {
      setIsCompleted(true)
    }
  }

  const goToSection = (sectionIndex: number) => {
    setCurrentSection(sectionIndex)
  }

  const nextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleComplete = () => {
    onComplete(100) // Full score for completing all sections
  }

  const handleCloseAttempt = () => {
    onClose()
  }

  const currentSectionData = content?.sections?.[currentSection]

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-text-brand" />
            <p className="text-text-secondary">Loading lesson content...</p>
          </div>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error && !content) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <X className="h-8 w-8 text-text-error" />
            <h3 className="text-lg font-semibold text-text-primary">Error Loading Content</h3>
            <p className="text-text-secondary">{error}</p>
            <Button variant="primary" onClick={onClose}>Close</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal"> {/* rgba(0, 0, 0, 0.5) */}
      <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col"> {/* #FFFFFF */}
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BookOpen className="h-5 w-5 text-text-brand" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{content?.title}</h2>
              <div className="flex items-center gap-4 mt-1">
                <Badge variant="info" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {content?.estimatedTime}
                </Badge>
                <span className="text-sm text-text-secondary">
                  {completedSections.size} of {totalSections} sections completed
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isCompleted && (
              <Button variant="primary" onClick={handleComplete}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={handleCloseAttempt} className="p-2 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Progress</span>
            <span className="text-sm font-medium text-text-brand">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar - Table of Contents */}
          <div className="w-64 border-r border-border-subtle bg-bg-secondary p-4 overflow-y-auto">
            <h3 className="font-semibold text-text-primary mb-4">Table of Contents</h3>
            
            <div className="space-y-2">
              {content?.sections?.map((section: any, index: number) => (
                <div
                  key={section.id}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer transition-all text-sm",
                    index === currentSection && "bg-text-brand text-white",
                    completedSections.has(index) && index !== currentSection && "bg-bg-success-light text-text-success",
                    index !== currentSection && !completedSections.has(index) && "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                  )}
                  onClick={() => goToSection(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{section.title}</span>
                    {completedSections.has(index) && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <Badge variant="brand" className="mb-2">
                    Section {currentSection + 1} of {totalSections}
                  </Badge>
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    {currentSectionData.title}
                  </h1>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentSectionData.content }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={prevSection}
                disabled={currentSection === 0}
              >
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {!completedSections.has(currentSection) && (
                  <Button
                    variant="primary"
                    onClick={markSectionComplete}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </Button>
                )}
                
                <Button
                  variant="primary"
                  onClick={nextSection}
                  disabled={currentSection === totalSections - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}