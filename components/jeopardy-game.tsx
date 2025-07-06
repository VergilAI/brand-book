'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { cn } from '@/lib/utils'
import { JeopardyBoard } from './jeopardy-board'
import { JeopardyClue } from './jeopardy-clue'
import { JeopardyScore } from './jeopardy-score'
import { Trophy, X, Shuffle, Brain, Sparkles } from 'lucide-react'

export interface JeopardyClue {
  id: string
  category: string
  value: number
  clue: string
  answer: string
  isDailyDouble?: boolean
  used?: boolean
}

export interface JeopardyCategory {
  name: string
  clues: JeopardyClue[]
}

export interface JeopardyGameState {
  score: number
  selectedClue: JeopardyClue | null
  usedClues: Set<string>
  dailyDoubleWager: number
  gamePhase: 'board' | 'clue' | 'final' | 'complete'
}

interface JeopardyGameProps {
  categories: JeopardyCategory[]
  onGameEnd?: (finalScore: number) => void
  className?: string
}

export function JeopardyGame({ 
  categories, 
  onGameEnd,
  className 
}: JeopardyGameProps) {
  const [gameState, setGameState] = useState<JeopardyGameState>({
    score: 0,
    selectedClue: null,
    usedClues: new Set(),
    dailyDoubleWager: 0,
    gamePhase: 'board'
  })
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const handleClueSelect = (clue: JeopardyClue) => {
    if (gameState.usedClues.has(clue.id)) return
    
    setGameState(prev => ({
      ...prev,
      selectedClue: clue,
      gamePhase: 'clue'
    }))
  }

  const handleAnswer = (answer: string, wager?: number) => {
    if (!gameState.selectedClue) return

    const isCorrect = answer.toLowerCase().trim() === 
      gameState.selectedClue.answer.toLowerCase().trim()
    
    const value = wager || gameState.selectedClue.value
    const scoreChange = isCorrect ? value : -value

    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score + scoreChange),
      usedClues: new Set([...prev.usedClues, gameState.selectedClue!.id]),
      selectedClue: null,
      gamePhase: 'board',
      dailyDoubleWager: 0
    }))

    // Check if all clues have been used
    const totalClues = categories.reduce((acc, cat) => acc + cat.clues.length, 0)
    if (gameState.usedClues.size + 1 === totalClues) {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, gamePhase: 'complete' }))
        onGameEnd?.(gameState.score + scoreChange)
      }, 1500)
    }
  }

  const handleClueClose = () => {
    setGameState(prev => ({
      ...prev,
      selectedClue: null,
      gamePhase: 'board'
    }))
  }

  if (gameState.gamePhase === 'complete') {
    const totalClues = categories.reduce((acc, cat) => acc + cat.clues.length, 0)
    const answeredCorrectly = Math.round((gameState.score > 0 ? gameState.score / (totalClues * 200) : 0) * 100)
    const knowledgeImprovement = Math.round(answeredCorrectly * 0.8)
    
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-elevation-modal overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-space-md">
          <Card className={cn(
            "p-space-lg max-w-3xl w-full border-border-subtle bg-gradient-to-br from-bg-secondary to-bg-primary my-auto max-h-[90vh] overflow-y-auto",
            className
          )}>
            <div className="space-y-space-lg">
              {/* Header Section */}
              <div className="text-center space-y-space-md">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-color-brand-primary to-color-brand-secondary mx-auto flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-text-inverse" />
                </div>
                <h2 className="text-3xl font-display font-bold text-text-primary">
                  Jeopardy Complete!
                </h2>
                <p className="text-base text-text-secondary max-w-md mx-auto">
                  Great job navigating through all those challenging questions!
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-space-md">
                <Card variant="outlined" className="p-space-md text-center border-border-subtle">
                  <div className="text-2xl font-bold text-text-brand mb-space-xs">
                    ${gameState.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-text-tertiary">Final Score</div>
                </Card>
                
                <Card variant="outlined" className="p-space-md text-center border-border-subtle">
                  <div className="text-2xl font-bold text-text-brand mb-space-xs">
                    {gameState.usedClues.size}
                  </div>
                  <div className="text-sm text-text-tertiary">Questions Answered</div>
                </Card>
                
                <Card variant="outlined" className="p-space-md text-center border-border-subtle">
                  <div className="text-2xl font-bold text-text-brand mb-space-xs">
                    {totalClues - gameState.usedClues.size}
                  </div>
                  <div className="text-sm text-text-tertiary">Questions Left</div>
                </Card>
              </div>
              
              {/* Knowledge Impact */}
              <Card variant="outlined" className="p-space-md border-border-brand/20 bg-bg-brand/5">
                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-text-brand" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-text-primary mb-space-xs">
                      Knowledge Point Impact
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-tertiary">Estimated improvement</span>
                      <span className="text-lg font-bold text-text-brand">
                        +{knowledgeImprovement}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex gap-space-md">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => onGameEnd?.(gameState.score)}
                >
                  Exit Game
                </Button>
                <Button
                  size="lg"
                  onClick={() => window.location.reload()}
                  className="bg-bg-brand text-text-inverse hover:bg-bg-brand-hover"
                >
                  Play Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Function to choose a random available clue
  const chooseRandomClue = () => {
    const availableClues: JeopardyClue[] = []
    categories.forEach(category => {
      category.clues.forEach(clue => {
        if (!gameState.usedClues.has(clue.id)) {
          availableClues.push(clue)
        }
      })
    })
    
    if (availableClues.length > 0) {
      const randomClue = availableClues[Math.floor(Math.random() * availableClues.length)]
      handleClueSelect(randomClue)
    }
  }

  useEffect(() => {
    // Prevent background scrolling when game is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className={cn("fixed inset-0 bg-bg-secondary flex flex-col", className)}>
      {/* Fixed Header */}
      <div className="bg-bg-primary shadow-base z-elevation-high">
        <div className="max-w-7xl mx-auto px-space-lg py-space-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">Jeopardy!</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExitConfirm(true)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-space-lg space-y-space-md">
          <div className="flex justify-between items-center mb-space-md">
            <p className="text-sm text-text-secondary">Test your knowledge across categories</p>
            <JeopardyScore score={gameState.score} />
          </div>

          <div className="space-y-space-sm">
            <JeopardyBoard
              categories={categories}
              usedClues={gameState.usedClues}
              onClueSelect={handleClueSelect}
            />
            
            {/* Choose Random Button */}
            <div className="flex justify-center">
              <Button
                onClick={chooseRandomClue}
                variant="secondary"
                size="sm"
                className="border-border-brand/40 text-text-brand hover:bg-bg-brand/10 hover:border-border-brand"
                disabled={gameState.usedClues.size === categories.reduce((acc, cat) => acc + cat.clues.length, 0)}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Choose Random Question
              </Button>
            </div>
          </div>

          {gameState.selectedClue && (
            <JeopardyClue
              clue={gameState.selectedClue}
              onAnswer={handleAnswer}
              onClose={handleClueClose}
              currentScore={gameState.score}
            />
          )}
        </div>
      </div>
      
      {showExitConfirm && (
        <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-elevation-modal flex items-center justify-center p-space-md">
          <Card className="p-space-lg max-w-md bg-bg-primary border-border-subtle">
            <h3 className="text-xl font-semibold text-text-primary mb-space-md">
              Exit Game?
            </h3>
            <p className="text-text-secondary mb-space-lg">
              Are you sure you want to exit? You'll lose your current score and progress.
            </p>
            <div className="flex gap-space-sm">
              <Button
                variant="secondary"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1"
              >
                Continue Playing
              </Button>
              <Button
                onClick={() => {
                  setShowExitConfirm(false)
                  onGameEnd?.(gameState.score)
                }}
                className="flex-1 bg-bg-error text-text-inverse hover:bg-bg-error-hover"
              >
                Exit Game
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}