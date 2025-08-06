"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/card"
import { Progress } from "@/components/atomic/progress"
import { Badge } from "@/components/badge"
import { 
  FileText, 
  Brain, 
  Sparkles,
  CheckCircle,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CourseGeneratorState } from "../../types"

interface ProcessingStepProps {
  state: CourseGeneratorState
  onStateChange: React.Dispatch<React.SetStateAction<CourseGeneratorState>>
  onNext: () => void
}

interface ProcessingTask {
  id: string
  label: string
  status: 'pending' | 'processing' | 'completed'
  progress: number
}

export function ProcessingStep({ state, onStateChange, onNext }: ProcessingStepProps) {
  const [tasks, setTasks] = useState<ProcessingTask[]>([
    { id: 'extract', label: 'Extracting text from documents', status: 'pending', progress: 0 },
    { id: 'analyze', label: 'Analyzing content structure', status: 'pending', progress: 0 },
    { id: 'identify', label: 'Identifying key concepts', status: 'pending', progress: 0 },
    { id: 'objectives', label: 'Determining learning objectives', status: 'pending', progress: 0 },
    { id: 'structure', label: 'Creating course structure', status: 'pending', progress: 0 }
  ])

  useEffect(() => {
    if (state.currentStep === 'extracting') {
      // Simulate processing tasks
      const processNextTask = () => {
        setTasks(currentTasks => {
          const pendingTask = currentTasks.find(t => t.status === 'pending')
          const processingTask = currentTasks.find(t => t.status === 'processing')
          
          if (processingTask) {
            // Update progress
            const newProgress = Math.min(processingTask.progress + 20, 100)
            const updatedTasks = currentTasks.map(t => 
              t.id === processingTask.id 
                ? { 
                    ...t, 
                    progress: newProgress,
                    status: newProgress === 100 ? 'completed' : 'processing'
                  }
                : t
            )
            
            // Check if all tasks are completed
            const allCompleted = updatedTasks.every(t => t.status === 'completed')
            if (allCompleted) {
              setTimeout(() => {
                onStateChange(prev => ({ 
                  ...prev, 
                  currentStep: 'analyzing',
                  isProcessing: false,
                  extractedContent: {
                    raw: {
                      text: "Sample extracted content from uploaded documents...",
                      images: [],
                      tables: []
                    },
                    structured: {
                      title: "Introduction to Machine Learning",
                      chapters: [
                        {
                          id: 'ch1',
                          title: 'Understanding AI Fundamentals',
                          content: 'Chapter content...',
                          sections: [],
                          keyPoints: ['Key point 1', 'Key point 2'],
                          suggestedQuestions: 5,
                          order: 0
                        },
                        {
                          id: 'ch2',
                          title: 'Neural Networks Basics',
                          content: 'Chapter content...',
                          sections: [],
                          keyPoints: ['Key point 1', 'Key point 2'],
                          suggestedQuestions: 7,
                          order: 1
                        }
                      ],
                      glossary: [
                        { term: 'Machine Learning', definition: 'A subset of AI that enables systems to learn from data' },
                        { term: 'Neural Network', definition: 'A computing system inspired by biological neural networks' }
                      ],
                      learningObjectives: [
                        'Understand the basics of machine learning',
                        'Learn about different types of neural networks',
                        'Apply ML concepts to real-world problems'
                      ]
                    },
                    metadata: {
                      totalPages: 42,
                      wordCount: 15000,
                      estimatedReadingTime: 60,
                      difficulty: 'intermediate',
                      topics: ['AI', 'Machine Learning', 'Neural Networks'],
                      language: 'en'
                    }
                  }
                }))
                onNext()
              }, 500)
            }
            
            return updatedTasks
          } else if (pendingTask) {
            // Start next task
            return currentTasks.map(t => 
              t.id === pendingTask.id 
                ? { ...t, status: 'processing', progress: 20 }
                : t
            )
          }
          
          return currentTasks
        })
      }

      const interval = setInterval(processNextTask, 500)
      return () => clearInterval(interval)
    }
  }, [state.currentStep, onStateChange, onNext])

  const overallProgress = Math.round(
    tasks.reduce((acc, task) => acc + task.progress, 0) / tasks.length
  )

  return (
    <div className="space-y-spacing-lg">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-brand/10 mb-spacing-md">
          <Brain className="w-8 h-8 text-text-brand animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
          Processing Your Materials
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Our AI is analyzing your content to create the best possible learning experience.
          This may take a few moments.
        </p>
      </div>

     
      <Card className="p-spacing-lg">
        <div className="flex items-center justify-between mb-spacing-sm">
          <span className="text-sm font-medium text-text-primary">Overall Progress</span>
          <span className="text-sm font-semibold text-text-brand">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} size="lg" variant="default" />
      </Card>

     
      <div className="space-y-spacing-sm">
        {tasks.map(task => (
          <Card
            key={task.id}
            className={cn(
              "p-spacing-md transition-all duration-normal", // 16px, 200ms
              task.status === 'completed' && "bg-bg-success/5 border-border-success" // #F0FDF4, #86EFAC
            )}
          >
            <div className="flex items-center gap-spacing-md">
              {task.status === 'pending' && (
                <div className="w-8 h-8 rounded-full bg-bg-emphasis flex items-center justify-center">
                  <FileText className="w-4 h-4 text-text-tertiary" />
                </div>
              )}
              {task.status === 'processing' && (
                <div className="w-8 h-8 rounded-full bg-bg-brand/10 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-text-brand animate-spin" />
                </div>
              )}
              {task.status === 'completed' && (
                <div className="w-8 h-8 rounded-full bg-bg-success flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="flex-1">
                <p className={cn(
                  "font-medium",
                  task.status === 'completed' ? "text-text-success" : "text-text-primary" // #0F8A0F, #1D1D1F
                )}>
                  {task.label}
                </p>
                {task.status === 'processing' && (
                  <Progress 
                    value={task.progress} 
                    size="sm" 
                    className="mt-spacing-xs" // 4px
                  />
                )}
              </div>
              
              {task.status === 'completed' && (
                <Badge variant="success" size="sm" className="bg-green-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

     
      <Card className="p-spacing-lg bg-bg-brand/5 border-border-brand/20">
        <div className="flex items-start gap-spacing-md">
          <Sparkles className="w-5 h-5 text-text-brand mt-0.5" />
          <div>
            <h3 className="font-medium text-text-primary mb-spacing-xs">
              AI Insights Preview
            </h3>
            <p className="text-sm text-text-secondary">
              Detected {state.uploadedFiles.length} document(s) with educational content.
              Identifying key concepts and structuring course modules...
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}