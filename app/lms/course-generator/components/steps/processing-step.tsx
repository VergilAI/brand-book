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
  Check,
  Loader2,
  Circle,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CourseGeneratorState } from "../../types"

interface ProcessingStepProps {
  state: CourseGeneratorState
  onStateChange: React.Dispatch<React.SetStateAction<CourseGeneratorState>>
  onNext: () => void
  onBack: () => void
}

interface ProcessingTask {
  id: string
  label: string
  status: 'pending' | 'processing' | 'completed'
  progress: number
}

export function ProcessingStep({ state, onStateChange, onNext, onBack }: ProcessingStepProps) {
  const [tasks, setTasks] = useState<ProcessingTask[]>([
    { id: 'extract', label: 'Extracting text from documents', status: 'pending', progress: 0 },
    { id: 'analyze', label: 'Analyzing content structure', status: 'pending', progress: 0 },
    { id: 'identify', label: 'Identifying key concepts', status: 'pending', progress: 0 },
    { id: 'objectives', label: 'Determining learning objectives', status: 'pending', progress: 0 },
    { id: 'structure', label: 'Creating course structure', status: 'pending', progress: 0 }
  ])

  useEffect(() => {
    if (state.currentStep === 'extract') {
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
                  currentStep: 'enhance',
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
                          content: 'This chapter covers the fundamental concepts of AI, including its definition, history, and applications.',
                          sections: [],
                          keyPoints: [
                            'AI is the simulation of human intelligence by machines',
                            'AI has evolved from simple rule-based systems to complex neural networks',
                            'Applications include healthcare, finance, transportation, and education'
                          ],
                          suggestedQuestions: 5,
                          order: 0
                        },
                        {
                          id: 'ch2',
                          title: 'Machine Learning Fundamentals',
                          content: 'Understanding the core concepts of machine learning, including supervised, unsupervised, and reinforcement learning.',
                          sections: [],
                          keyPoints: [
                            'Machine learning enables systems to learn from data',
                            'Three main types: supervised, unsupervised, and reinforcement learning',
                            'Common algorithms include decision trees, neural networks, and SVM'
                          ],
                          suggestedQuestions: 7,
                          order: 1
                        },
                        {
                          id: 'ch3',
                          title: 'Neural Networks and Deep Learning',
                          content: 'Exploring neural network architectures and deep learning techniques for complex problem solving.',
                          sections: [],
                          keyPoints: [
                            'Neural networks are inspired by biological neural systems',
                            'Deep learning uses multiple layers for feature extraction',
                            'Applications include computer vision, NLP, and speech recognition'
                          ],
                          suggestedQuestions: 6,
                          order: 2
                        }
                      ],
                      glossary: [
                        { term: 'Artificial Intelligence', definition: 'The simulation of human intelligence processes by machines' },
                        { term: 'Machine Learning', definition: 'A subset of AI that enables systems to learn from data' },
                        { term: 'Neural Network', definition: 'A computing system inspired by biological neural networks' },
                        { term: 'Deep Learning', definition: 'Machine learning using artificial neural networks with multiple layers' },
                        { term: 'Algorithm', definition: 'A step-by-step procedure for solving a problem or accomplishing a task' }
                      ],
                      learningObjectives: [
                        'Understand the fundamental principles of artificial intelligence',
                        'Learn the different approaches to machine learning',
                        'Explore neural network architectures and their applications',
                        'Apply AI concepts to real-world business problems',
                        'Understand the ethical implications of AI systems',
                        'Build basic AI models for practical applications'
                      ]
                    },
                    metadata: {
                      totalPages: 56,
                      wordCount: 18500,
                      estimatedReadingTime: 75,
                      difficulty: 'intermediate',
                      topics: ['AI', 'Machine Learning', 'Neural Networks', 'Deep Learning', 'AI Ethics'],
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

  const completedCount = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-spacing-sm overflow-hidden">
        {/* Header with better spacing */}
        <div className="flex items-center justify-between mb-spacing-sm">
          <div className="flex items-center gap-spacing-md">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bg-brand/20 to-bg-brand/10 flex items-center justify-center animate-pulse">
              <Brain className="w-6 h-6 text-text-brand" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Extracting Content</h2>
              <p className="text-sm text-text-secondary">Analyzing your documents to extract key information...</p>
            </div>
          </div>
          {/* Progress Info */}
          <div className="text-right">
            <p className="text-3xl font-bold text-text-primary">{overallProgress}%</p>
            <p className="text-sm text-text-secondary">{completedCount} / {tasks.length} complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={overallProgress} size="lg" variant="default" className="h-3 mb-spacing-sm" />

        {/* Compact Task List */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-spacing-xs">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-spacing-md p-spacing-md rounded-lg border transition-all",
                  task.status === 'completed' && "bg-green-50 border-green-200",
                  task.status === 'processing' && "bg-purple-50 border-purple-200",
                  task.status === 'pending' && "bg-bg-primary border-border-subtle"
                )}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {task.status === 'pending' && (
                    <div className="w-8 h-8 rounded-full bg-bg-emphasis flex items-center justify-center">
                      <Circle className="w-4 h-4 text-text-tertiary" />
                    </div>
                  )}
                  {task.status === 'processing' && (
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                  {task.status === 'completed' && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
                
                {/* Task Label */}
                <p className={cn(
                  "flex-1 text-base font-medium",
                  task.status === 'completed' && "text-green-700",
                  task.status === 'processing' && "text-purple-700",
                  task.status === 'pending' && "text-text-secondary"
                )}>
                  {task.label}
                </p>
                
                {/* Progress or Status */}
                <div className="flex-shrink-0">
                  {task.status === 'processing' && (
                    <div className="flex items-center gap-spacing-xs">
                      <Progress 
                        value={task.progress} 
                        size="sm" 
                        variant="default"
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-semibold text-purple-600 w-10 text-right">
                        {task.progress}%
                      </span>
                    </div>
                  )}
                  {task.status === 'completed' && (
                    <Badge variant="success" size="sm">
                      Done
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Status Bar */}
        <div className="flex items-center gap-spacing-md p-spacing-md bg-gradient-to-r from-bg-brand/5 to-bg-brand/10 rounded-lg border border-border-brand/20">
          <Sparkles className="w-5 h-5 text-text-brand flex-shrink-0" />
          <p className="text-sm text-text-secondary">
            Processing {state.uploadedFiles.length} document{state.uploadedFiles.length > 1 ? 's' : ''} to create your course structure...
          </p>
        </div>
      </div>
    </div>
  )
}