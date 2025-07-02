'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <Card className={cn(
            "p-8 max-w-3xl w-full border-vergil-off-black/10 bg-gradient-to-br from-vergil-off-white to-white my-auto max-h-[90vh] overflow-y-auto",
            className
          )}>
            <div className="space-y-6">
              {/* Header Section */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vergil-purple to-vergil-purple-lighter mx-auto flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-vergil-off-black">
                  Jeopardy Complete!
                </h2>
                <p className="text-base text-vergil-off-black/70 max-w-md mx-auto">
                  Great job navigating through all those challenging questions!
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
                  <div className="text-2xl font-bold text-vergil-purple mb-1">
                    ${gameState.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-vergil-off-black/60">Final Score</div>
                </Card>
                
                <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
                  <div className="text-2xl font-bold text-vergil-purple mb-1">
                    {gameState.usedClues.size}
                  </div>
                  <div className="text-sm text-vergil-off-black/60">Questions Answered</div>
                </Card>
                
                <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
                  <div className="text-2xl font-bold text-vergil-purple mb-1">
                    {totalClues - gameState.usedClues.size}
                  </div>
                  <div className="text-sm text-vergil-off-black/60">Questions Left</div>
                </Card>
              </div>
              
              {/* Knowledge Impact */}
              <Card variant="outlined" className="p-4 border-vergil-purple/20 bg-vergil-purple/5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-vergil-purple/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-vergil-purple" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-vergil-off-black mb-1">
                      Knowledge Point Impact
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-vergil-off-black/60">Estimated improvement</span>
                      <span className="text-lg font-bold text-vergil-purple">
                        +{knowledgeImprovement}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onGameEnd?.(gameState.score)}
                >
                  Exit Game
                </Button>
                <Button
                  size="lg"
                  onClick={() => window.location.reload()}
                  className="bg-vergil-purple text-white hover:bg-vergil-purple-lighter"
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
    <div className={cn("min-h-screen bg-gradient-to-br from-vergil-off-white to-vergil-purple/5 p-4", className)}>
      <div className="max-w-7xl mx-auto space-y-4">
        <Card className="p-4 bg-white border-vergil-off-black/10 relative shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExitConfirm(true)}
            className="absolute top-3 left-3 text-vergil-off-black/60 hover:text-vergil-off-black z-10"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center px-12">
              <h1 className="text-2xl font-bold text-vergil-off-black font-display">Jeopardy!</h1>
              <p className="text-xs text-vergil-off-black/60 mt-0.5">Test your knowledge across categories</p>
            </div>
            <JeopardyScore score={gameState.score} />
          </div>
        </Card>

        <div className="space-y-3">
          <JeopardyBoard
            categories={categories}
            usedClues={gameState.usedClues}
            onClueSelect={handleClueSelect}
          />
          
          {/* Choose Random Button */}
          <div className="flex justify-center">
            <Button
              onClick={chooseRandomClue}
              variant="outline"
              size="sm"
              className="border-vergil-purple/20 text-vergil-purple/70 hover:bg-vergil-purple/5 hover:text-vergil-purple"
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
      
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-md bg-white border-vergil-off-black/10">
            <h3 className="text-xl font-semibold text-vergil-off-black mb-4">
              Exit Game?
            </h3>
            <p className="text-vergil-off-black/60 mb-6">
              Are you sure you want to exit? You'll lose your current score and progress.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
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
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
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