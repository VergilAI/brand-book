'use client'

import { useState } from 'react'
import { 
  X, 
  Clock, 
  Users, 
  BookOpen,
  Volume2,
  Video,
  Layers,
  DollarSign,
  Trophy,
  Shuffle,
  Check
} from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import { Card, CardContent } from '@/components/card'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/lib/lms/new-course-types'
import { GameRouter } from './games/game-router'

interface LearningActivitiesModalProps {
  lesson: Lesson
  isOpen: boolean
  onClose: () => void
  onSelectGame: (gameTypeId: string) => void
}

interface GameType {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'Content' | 'Interactive' | 'Quiz'
  recommended?: boolean
}

const gameTypes: GameType[] = [
  {
    id: 'written-material',
    title: 'Written Material',
    description: 'Read comprehensive text content',
    icon: <BookOpen className="h-4 w-4" />,
    category: 'Content'
  },
  {
    id: 'audio-material',
    title: 'Audio Material',
    description: 'Have content read out loud',
    icon: <Volume2 className="h-4 w-4" />,
    category: 'Interactive'
  },
  {
    id: 'video',
    title: 'Video',
    description: 'Watch educational videos',
    icon: <Video className="h-4 w-4" />,
    category: 'Content'
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Classic flashcard learning',
    icon: <Layers className="h-4 w-4" />,
    category: 'Quiz'
  },
  {
    id: 'millionaire',
    title: 'Who Wants to Be a Millionaire',
    description: 'Win in-game currency with progressive questions',
    icon: <DollarSign className="h-4 w-4" />,
    category: 'Interactive',
    recommended: true
  },
  {
    id: 'jeopardy',
    title: 'Jeopardy Game',
    description: 'Answer in question format to win rewards',
    icon: <Trophy className="h-4 w-4" />,
    category: 'Interactive'
  },
  {
    id: 'connect-cards',
    title: 'Connect Cards',
    description: 'Duolingo-style card matching game',
    icon: <Shuffle className="h-4 w-4" />,
    category: 'Quiz'
  }
]

export function LearningActivitiesModal({ lesson, isOpen, onClose, onSelectGame }: LearningActivitiesModalProps) {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)

  if (!isOpen) return null

  // Calculate lesson progress
  const averageProficiency = lesson.knowledgePoints.length > 0
    ? Math.round(lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length)
    : 0

  const handleGameSelect = (gameTypeId: string) => {
    setSelectedGameType(gameTypeId)
  }

  const handleStartLearning = () => {
    if (selectedGameType) {
      setGameStarted(true)
    }
  }

  const handleGameComplete = (score: number) => {
    setGameStarted(false)
    setSelectedGameType(null)
    onClose()
    // Here you could update the lesson progress based on the score
    console.log(`Game completed with score: ${score}`)
  }

  const handleGameClose = () => {
    setGameStarted(false)
    // Don't reset selectedGameType so user can continue where they left off
  }

  // If game is started, show the game component
  if (gameStarted && selectedGameType) {
    return (
      <GameRouter
        gameType={selectedGameType}
        lessonId={lesson.id}
        onClose={handleGameClose}
        onComplete={handleGameComplete}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-bg-primary flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-text-primary mb-1">
              {lesson.title}
            </h2>
            <p className="text-sm text-text-secondary mb-3">
              {lesson.description}
            </p>
            
            {/* Lesson Meta */}
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{lesson.estimatedTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{lesson.knowledgePoints.length} knowledge points</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{gameTypes.length} learning methods</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="p-2 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1">
          {/* Left Side - Game Selection */}
          <div className="flex-1 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Choose Your Learning Method
            </h3>
            
            <div className="grid grid-cols-4 gap-3">
              {gameTypes.map((gameType) => (
                <Card 
                  key={gameType.id}
                  className={cn(
                    "relative cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:scale-105 hover:-translate-y-1",
                    selectedGameType === gameType.id 
                      ? "ring-2 ring-text-brand border-text-brand shadow-brand-md bg-bg-brand-light" /* #7B00FF, #F3E6FF */
                      : "border-border-subtle hover:border-border-default"
                  )}
                  onClick={() => handleGameSelect(gameType.id)}
                >
                  <CardContent className="p-2">
                    {/* Selection Indicator */}
                    {selectedGameType === gameType.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-text-brand rounded-full flex items-center justify-center"> {/* #7B00FF */}
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-1">
                      <Badge 
                        variant={gameType.category === 'Content' ? 'info' : gameType.category === 'Interactive' ? 'success' : 'warning'}
                        className="text-xs"
                      >
                        {gameType.category}
                      </Badge>
                      {gameType.recommended && (
                        <Badge variant="primary" className="text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    
                    {/* Icon */}
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mb-1",
                      gameType.category === 'Content' ? "bg-bg-info-light text-text-info" :
                      gameType.category === 'Interactive' ? "bg-bg-success-light text-text-success" :
                      "bg-bg-warning-light text-text-warning"
                    )}>
                      {gameType.icon}
                    </div>
                    
                    {/* Content */}
                    <h4 className="font-medium text-text-primary mb-1 text-xs">
                      {gameType.title}
                    </h4>
                    <p className="text-xs text-text-secondary leading-tight">
                      {gameType.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Side - Lesson Progress */}
          <div className="w-64 border-l border-border-subtle bg-bg-secondary p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Lesson Progress
            </h3>
            
            {/* Average Proficiency */}
            <Card className="mb-4 bg-bg-primary">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-secondary">
                    Average Proficiency
                  </span>
                  <span className="text-lg font-bold text-text-success">
                    {averageProficiency}%
                  </span>
                </div>
                <Progress 
                  value={averageProficiency} 
                  className="h-2"
                />
              </CardContent>
            </Card>
            
            {/* Knowledge Points */}
            <div>
              <h4 className="text-xs font-medium text-text-secondary mb-2">
                Knowledge Points in this Lesson
              </h4>
              
              <div className="space-y-2">
                {lesson.knowledgePoints.map((kp) => (
                  <div key={kp.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-medium text-text-primary">
                        {kp.title}
                      </h5>
                    </div>
                    <div className="text-right ml-2">
                      <span className={cn(
                        "text-xs font-medium",
                        kp.proficiency >= 80 ? "text-text-success" :
                        kp.proficiency >= 60 ? "text-text-warning" :
                        kp.proficiency > 0 ? "text-text-info" :
                        "text-text-secondary"
                      )}>
                        {kp.proficiency}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Select a learning method to continue
          </p>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="md"
              disabled={!selectedGameType}
              onClick={handleStartLearning}
            >
              Start Learning
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}