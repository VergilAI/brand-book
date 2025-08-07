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
                      title: "AI Fundamentals Training Course",
                      chapters: [
                        {
                          id: 'ch1',
                          title: 'Introduction to Artificial Intelligence',
                          content: 'Comprehensive introduction to AI concepts, history, and applications in modern technology.',
                          sections: [],
                          keyPoints: [
                            'Define artificial intelligence and its core components',
                            'Understand the history and evolution of AI technology',
                            'Identify real-world AI applications across industries'
                          ],
                          suggestedQuestions: 5,
                          order: 0
                        },
                        {
                          id: 'ch2',
                          title: 'Machine Learning Fundamentals',
                          content: 'Core concepts of machine learning, including supervised, unsupervised, and reinforcement learning approaches.',
                          sections: [],
                          keyPoints: [
                            'Distinguish between different types of machine learning',
                            'Understand algorithms and their applications',
                            'Recognize when to apply specific ML techniques'
                          ],
                          suggestedQuestions: 6,
                          order: 1
                        },
                        {
                          id: 'ch3',
                          title: 'Neural Networks and Deep Learning',
                          content: 'Deep dive into neural network architectures, deep learning principles, and practical implementations.',
                          sections: [],
                          keyPoints: [
                            'Understand neural network structure and components',
                            'Learn about deep learning architectures',
                            'Apply neural networks to solve complex problems'
                          ],
                          suggestedQuestions: 7,
                          order: 2
                        }
                      ],
                      glossary: [
                        { term: 'Artificial Intelligence', definition: 'Computer systems that can perform tasks typically requiring human intelligence' },
                        { term: 'Machine Learning', definition: 'A subset of AI that enables systems to learn from data without explicit programming' },
                        { term: 'Neural Network', definition: 'A computing system modeled after the structure of biological neural networks' },
                        { term: 'Deep Learning', definition: 'A subset of ML using neural networks with multiple layers for complex pattern recognition' },
                        { term: 'Algorithm', definition: 'A set of rules or instructions for solving a problem or completing a task' }
                      ],
                      learningObjectives: [
                        'Define artificial intelligence and understand its core principles',
                        'Differentiate between various types of machine learning approaches',
                        'Analyze neural network architectures and deep learning concepts',
                        'Identify appropriate AI solutions for business problems',
                        'Evaluate the ethical implications of AI implementation',
                        'Apply fundamental AI concepts to practical scenarios'
                      ]
                    },
                    metadata: {
                      totalPages: 56,
                      wordCount: 18500,
                      estimatedReadingTime: 75,
                      difficulty: 'intermediate',
                      topics: ['Artificial Intelligence', 'Machine Learning', 'Neural Networks', 'Deep Learning', 'AI Ethics'],
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
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white fill-white" />
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
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 fill-green-600" />
                  <span className="text-sm font-medium text-green-600">Complete</span>
                </div>
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