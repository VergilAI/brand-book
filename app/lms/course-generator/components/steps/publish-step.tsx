"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { 
  CheckCircle, 
  BookOpen,
  Users,
  Clock,
  Target,
  CreditCard,
  Brain,
  Grid,
  MessageSquare,
  FileQuestion,
  Download,
  Share2,
  Eye,
  ArrowLeft,
  Sparkles,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CourseGeneratorState } from "../../types"
import { useRouter } from "next/navigation"

interface PublishStepProps {
  state: CourseGeneratorState
  onStateChange: React.Dispatch<React.SetStateAction<CourseGeneratorState>>
  onBack: () => void
}

export function PublishStep({ state, onStateChange, onBack }: PublishStepProps) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)
  
  const course = state.generatedCourse!
  const totalActivities = course.modules.reduce((acc, module) => {
    let count = 0
    if (module.activities.flashcards) count++
    if (module.activities.millionaire) count++
    if (module.activities.jeopardy) count++
    if (module.activities.connectCards) count++
    if (module.activities.testId) count++
    return acc + count
  }, 0)

  const handlePublish = async () => {
    setIsPublishing(true)
    
    // Simulate publishing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    onStateChange(prev => ({
      ...prev,
      generatedCourse: {
        ...prev.generatedCourse!,
        status: 'published',
        metadata: {
          ...prev.generatedCourse!.metadata,
          updatedAt: new Date()
        }
      }
    }))
    
    setIsPublishing(false)
    
    // Redirect to course overview
    setTimeout(() => {
      router.push('/lms/new_course_overview')
    }, 1000)
  }

  const activityIcons = {
    flashcards: CreditCard,
    millionaire: Brain,
    jeopardy: Grid,
    connectCards: MessageSquare,
    test: FileQuestion
  }

  return (
    <div className="space-y-spacing-lg">
     
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-spacing-md">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
          Course Generated Successfully!
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Your course is ready to publish. Review the details below and make it available to learners.
        </p>
      </div>

     
      <Card className="p-spacing-xl">
        <div className="space-y-spacing-lg">
         
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-spacing-xs">
              {course.title}
            </h3>
            <p className="text-text-secondary">
              {course.description}
            </p>
          </div>

         
          <div className="grid grid-cols-2 md:grid-cols-4 gap-spacing-md">
            <div className="text-center p-spacing-md rounded-lg bg-bg-secondary">
              <BookOpen className="w-8 h-8 text-text-brand mx-auto mb-spacing-sm" />
              <p className="text-2xl font-bold text-text-primary">{course.modules.length}</p>
              <p className="text-sm text-text-secondary">Modules</p>
            </div>
            
            <div className="text-center p-spacing-md rounded-lg bg-bg-secondary">
              <Sparkles className="w-8 h-8 text-text-brand mx-auto mb-spacing-sm" />
              <p className="text-2xl font-bold text-text-primary">{totalActivities}</p>
              <p className="text-sm text-text-secondary">Activities</p>
            </div>
            
            <div className="text-center p-spacing-md rounded-lg bg-bg-secondary">
              <Clock className="w-8 h-8 text-text-brand mx-auto mb-spacing-sm" />
              <p className="text-2xl font-bold text-text-primary">{course.metadata.totalDuration}</p>
              <p className="text-sm text-text-secondary">Minutes</p>
            </div>
            
            <div className="text-center p-spacing-md rounded-lg bg-bg-secondary">
              <Target className="w-8 h-8 text-text-brand mx-auto mb-spacing-sm" />
              <p className="text-2xl font-bold text-text-primary capitalize">{course.metadata.difficulty}</p>
              <p className="text-sm text-text-secondary">Level</p>
            </div>
          </div>

         
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-spacing-sm">
              Topics Covered
            </h4>
            <div className="flex flex-wrap gap-spacing-sm">
              {course.metadata.topics.map((topic, index) => (
                <Badge key={index} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

     
      <div className="space-y-spacing-sm">
        <h3 className="text-lg font-medium text-text-primary">Module Details</h3>
        
        {course.modules.map((module, index) => (
          <Card key={module.id} className="p-spacing-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-text-primary">
                  Module {index + 1}: {module.title}
                </h4>
                <p className="text-sm text-text-secondary mt-spacing-xs">
                  {module.description}
                </p>
                
               
                <div className="flex items-center gap-spacing-md mt-spacing-sm">
                  <div className="flex items-center gap-spacing-xs">
                    {Object.entries(activityIcons).map(([type, Icon]) => {
                      const hasActivity = 
                        (type === 'flashcards' && module.activities.flashcards) ||
                        (type === 'millionaire' && module.activities.millionaire) ||
                        (type === 'jeopardy' && module.activities.jeopardy) ||
                        (type === 'connectCards' && module.activities.connectCards) ||
                        (type === 'test' && module.activities.testId)
                      
                      if (!hasActivity) return null
                      
                      return (
                        <div
                          key={type}
                          className="w-8 h-8 rounded-lg bg-bg-emphasis flex items-center justify-center" // #F0F0F2
                          title={type}
                        >
                          <Icon className="w-4 h-4 text-text-brand" />
                        </div>
                      )
                    })}
                  </div>
                  
                  <Badge variant="secondary" size="sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {module.estimatedDuration} min
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

     
      <Card className="p-spacing-lg bg-bg-brand/5 border-border-brand/20">
        <h3 className="text-lg font-medium text-text-primary mb-spacing-md">
          Publishing Options
        </h3>
        <div className="space-y-spacing-sm">
          <label className="flex items-center gap-spacing-sm cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-text-brand rounded border-border-default focus:ring-2 focus:ring-border-focus" // #7B00FF, rgba(0,0,0,0.1), #007AFF
            />
            <span className="text-sm text-text-primary">Make course publicly available</span>
          </label>
          <label className="flex items-center gap-spacing-sm cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-text-brand rounded border-border-default focus:ring-2 focus:ring-border-focus" // #7B00FF, rgba(0,0,0,0.1), #007AFF
            />
            <span className="text-sm text-text-primary">Allow learners to track progress</span>
          </label>
          <label className="flex items-center gap-spacing-sm cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-text-brand rounded border-border-default focus:ring-2 focus:ring-border-focus" // #7B00FF, rgba(0,0,0,0.1), #007AFF
            />
            <span className="text-sm text-text-primary">Require enrollment approval</span>
          </label>
        </div>
      </Card>

     
      <div className="flex flex-col sm:flex-row gap-spacing-md justify-between">
        <Button
          variant="ghost"
          size="lg"
          onClick={onBack}
          disabled={isPublishing}
        >
          <ArrowLeft className="w-5 h-5 mr-spacing-sm" />
          Back to Edit
        </Button>
        
        <div className="flex gap-spacing-sm">
          <Button
            variant="secondary"
            size="lg"
            disabled={isPublishing}
          >
            <Eye className="w-5 h-5 mr-spacing-sm" />
            Preview
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            disabled={isPublishing}
          >
            <Download className="w-5 h-5 mr-spacing-sm" />
            Export
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            onClick={handlePublish}
            disabled={isPublishing}
            className="min-w-[140px]"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-5 h-5 mr-spacing-sm animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5 mr-spacing-sm" />
                Publish Course
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}