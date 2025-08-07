"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { Progress } from "@/components/atomic/progress"
import { 
  Sparkles, 
  Brain,
  CreditCard,
  Grid,
  MessageSquare,
  FileQuestion,
  CheckCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Eye,
  Edit2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CourseGeneratorState, CourseModule, GameType } from "../../types"
import { useRouter } from "next/navigation"

interface ActivitiesStepProps {
  state: CourseGeneratorState
  onStateChange: React.Dispatch<React.SetStateAction<CourseGeneratorState>>
  onNext: () => void
  onBack: () => void
}

interface GenerationTask {
  moduleId: string
  gameType: GameType
  status: 'pending' | 'generating' | 'completed' | 'error'
  progress: number
}

const GAME_CONFIGS = [
  {
    type: 'flashcards' as GameType,
    label: 'Flashcards',
    icon: CreditCard,
    description: 'Term and definition pairs for memorization',
    color: 'text-text-info' // #0087FF
  },
  {
    type: 'millionaire' as GameType,
    label: 'Who Wants to Be a Millionaire',
    icon: Brain,
    description: 'Progressive difficulty quiz questions',
    color: 'text-text-warning' // #FFC700
  },
  {
    type: 'jeopardy' as GameType,
    label: 'Jeopardy',
    icon: Grid,
    description: 'Category-based questions with point values',
    color: 'text-text-brand' // #7B00FF
  },
  {
    type: 'connectCards' as GameType,
    label: 'Connect Cards',
    icon: MessageSquare,
    description: 'Match related concepts together',
    color: 'text-text-success' // #0F8A0F
  },
  {
    type: 'test' as GameType,
    label: 'Formal Test',
    icon: FileQuestion,
    description: 'Comprehensive assessment questions',
    color: 'text-text-error' // #E51C23
  }
]

export function ActivitiesStep({ state, onStateChange, onNext, onBack }: ActivitiesStepProps) {
  const router = useRouter()
  const [selectedGames, setSelectedGames] = useState<GameType[]>(['flashcards', 'millionaire', 'test'])
  const [generationTasks, setGenerationTasks] = useState<GenerationTask[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  
  const modules = state.generatedCourse?.modules || []

  const startGeneration = () => {
    setIsGenerating(true)
    
    // Create tasks for each module and selected game type
    const tasks: GenerationTask[] = []
    modules.forEach(module => {
      selectedGames.forEach(gameType => {
        tasks.push({
          moduleId: module.id,
          gameType,
          status: 'pending',
          progress: 0
        })
      })
    })
    
    setGenerationTasks(tasks)
  }

  useEffect(() => {
    if (isGenerating && generationTasks.length > 0) {
      const interval = setInterval(() => {
        setGenerationTasks(currentTasks => {
          const updatedTasks = [...currentTasks]
          const pendingTask = updatedTasks.find(t => t.status === 'pending')
          const generatingTask = updatedTasks.find(t => t.status === 'generating')
          
          if (generatingTask) {
            // Update progress
            generatingTask.progress = Math.min(generatingTask.progress + 25, 100)
            if (generatingTask.progress === 100) {
              generatingTask.status = 'completed'
            }
          } else if (pendingTask) {
            // Start next task
            pendingTask.status = 'generating'
            pendingTask.progress = 25
          } else {
            // All tasks completed
            clearInterval(interval)
            setIsGenerating(false)
            
            // Update state with generated content
            setTimeout(() => {
              onStateChange(prev => ({
                ...prev,
                generatedCourse: {
                  ...prev.generatedCourse!,
                  modules: prev.generatedCourse!.modules.map(module => ({
                    ...module,
                    activities: {
                      ...module.activities,
                      // Mock generated content
                      flashcards: selectedGames.includes('flashcards') ? {
                        id: `flashcard-set-${module.id}`,
                        cards: Array(10).fill(null).map((_, i) => ({
                          id: `card-${i}`,
                          front: `Question ${i + 1} from ${module.title}`,
                          back: `Answer ${i + 1}`,
                          hint: 'Think about the key concepts'
                        }))
                      } : undefined,
                      millionaire: selectedGames.includes('millionaire') ? 
                        Array(15).fill(null).map((_, i) => ({
                          id: `mill-${i}`,
                          question: `Question about ${module.title}`,
                          options: ['Option A', 'Option B', 'Option C', 'Option D'],
                          correctIndex: 0,
                          difficulty: i + 1,
                          explanation: 'This is why option A is correct.'
                        })) : undefined
                    }
                  }))
                }
              }))
            }, 500)
          }
          
          return updatedTasks
        })
      }, 500)
      
      return () => clearInterval(interval)
    }
  }, [isGenerating, generationTasks, onStateChange, modules, selectedGames])

  const toggleGame = (gameType: GameType) => {
    setSelectedGames(prev =>
      prev.includes(gameType)
        ? prev.filter(g => g !== gameType)
        : [...prev, gameType]
    )
  }


  const completedTasks = generationTasks.filter(t => t.status === 'completed').length
  const totalTasks = generationTasks.length
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto space-y-spacing-lg pb-spacing-lg">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
            Generate Learning Activities
          </h2>
          <p className="text-text-secondary">
            Select which types of interactive learning activities you want to generate for each module.
          </p>
        </div>

        {!isGenerating && generationTasks.length === 0 && (
          <>
            {/* Game Type Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
              {GAME_CONFIGS.map(game => {
                const isSelected = selectedGames.includes(game.type)
                const Icon = game.icon
                
                return (
                  <Card
                    key={game.type}
                    className={cn(
                      "p-spacing-md cursor-pointer transition-all duration-fast", // 16px, 100ms
                      "hover:shadow-card-hover hover:border-border-brand", // #7B00FF
                      isSelected && "border-border-brand bg-bg-brand/5" // #7B00FF
                    )}
                    onClick={() => toggleGame(game.type)}
                  >
                    <div className="flex items-start gap-spacing-md">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isSelected ? "bg-bg-brand" : "bg-bg-emphasis" // #7B00FF, #F0F0F2
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          isSelected ? "text-white" : game.color
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">
                          {game.label}
                        </h4>
                        <p className="text-sm text-text-secondary mt-spacing-xs">
                          {game.description}
                        </p>
                      </div>
                      
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-fast", // 100ms
                        isSelected
                          ? "bg-bg-brand border-border-brand" // #7B00FF
                          : "border-border-default" // rgba(0,0,0,0.1)
                      )}>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Summary Card */}
            <Card className="p-spacing-lg bg-bg-secondary">
              <h3 className="text-base font-medium text-text-primary mb-spacing-md">
                Content Generation Summary
              </h3>
              <div className="space-y-spacing-sm">
                <p className="text-sm text-text-secondary">
                  • {modules.length} modules to process
                </p>
                <p className="text-sm text-text-secondary">
                  • {selectedGames.length} activity types selected
                </p>
                <p className="text-sm text-text-secondary">
                  • {modules.length * selectedGames.length} total activities to generate
                </p>
              </div>
            </Card>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={startGeneration}
                disabled={selectedGames.length === 0}
                className="shadow-brand-md hover:shadow-brand-lg" // Custom shadow
              >
                <Sparkles className="w-5 h-5 mr-spacing-sm" />
                Generate Activities with AI
              </Button>
            </div>
          </>
        )}

        {/* Generation Progress */}
        {(isGenerating || generationTasks.length > 0) && (
          <div className="space-y-spacing-md">
            {/* Overall Progress Card */}
            <Card className="p-spacing-lg">
              <div className="flex items-center justify-between mb-spacing-sm">
                <span className="text-sm font-medium text-text-primary">Overall Progress</span>
                <span className="text-sm font-semibold text-text-brand">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} size="lg" variant="default" />
              <p className="text-sm text-text-secondary mt-spacing-sm">
                Completed {completedTasks} of {totalTasks} activities
              </p>
            </Card>

            {/* Module Progress Cards */}
            {modules.map(module => {
              const moduleTasks = generationTasks.filter(t => t.moduleId === module.id)
              const moduleCompleted = moduleTasks.filter(t => t.status === 'completed').length
              
              return (
                <Card key={module.id} className="p-spacing-md">
                  <div className="flex items-center justify-between mb-spacing-md">
                    <h4 className="font-medium text-text-primary">
                      {module.title}
                    </h4>
                    <Badge 
                      variant={moduleCompleted === moduleTasks.length ? "success" : "secondary"}
                      size="sm"
                    >
                      {moduleCompleted}/{moduleTasks.length} completed
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-sm">
                    {moduleTasks.map(task => {
                      const gameConfig = GAME_CONFIGS.find(g => g.type === task.gameType)!
                      const Icon = gameConfig.icon
                      
                      return (
                        <div
                          key={`${task.moduleId}-${task.gameType}`}
                          className="flex items-center gap-spacing-sm p-spacing-sm rounded-lg bg-bg-emphasis" // 8px, #F0F0F2
                        >
                          <Icon className={cn("w-4 h-4", gameConfig.color)} />
                          <span className="text-sm font-medium flex-1">{gameConfig.label}</span>
                          {task.status === 'generating' && (
                            <Loader2 className="w-4 h-4 text-text-brand animate-spin" />
                          )}
                          {task.status === 'completed' && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Generate Test Questions Button - Always visible when test is selected */}
                  {selectedGames.includes('test') && (
                    <div className="mt-spacing-md pt-spacing-md border-t border-border-subtle">
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={() => router.push('/lms/tests/create?from=course-generator&return_step=activities')}
                        className="w-full justify-center"
                      >
                        <Sparkles className="w-4 h-4 mr-spacing-sm" />
                        Generate Test Questions Manually or with AI
                      </Button>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Sticky Footer with Navigation */}
      <div className="sticky bottom-0 bg-bg-primary border-t border-border-subtle pt-spacing-md">
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={onBack}
            disabled={isGenerating}
          >
            <ArrowLeft className="w-5 h-5 mr-spacing-sm" />
            Back
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            onClick={onNext}
            disabled={isGenerating || generationTasks.length === 0 || completedTasks < totalTasks}
          >
            Review Course
            <ArrowRight className="w-5 h-5 ml-spacing-sm" />
          </Button>
        </div>
      </div>
    </div>
  )
}