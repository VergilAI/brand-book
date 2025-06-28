'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { JeopardyBoard } from './jeopardy-board'
import { JeopardyClue } from './jeopardy-clue'
import { JeopardyScore } from './jeopardy-score'
import { Trophy } from 'lucide-react'

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
    return (
      <Card className={cn(
        "p-12 text-center max-w-2xl mx-auto",
        "border-stone-gray/20",
        className
      )}>
        <div className="space-y-6">
          <div className="w-24 h-24 rounded-full bg-cosmic-purple/10 mx-auto flex items-center justify-center">
            <Trophy className="w-12 h-12 text-cosmic-purple" />
          </div>
          <h2 className="text-4xl font-display font-bold text-deep-space">
            Game Complete!
          </h2>
          <div className="pt-6">
            <p className="text-lg text-stone-gray mb-2">Final Score</p>
            <p className="text-5xl font-mono font-bold text-cosmic-purple">
              ${gameState.score.toLocaleString()}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            className="bg-cosmic-purple text-white hover:bg-electric-violet"
          >
            Play Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-deep-space">Jeopardy!</h1>
        <JeopardyScore score={gameState.score} />
      </div>

      <JeopardyBoard
        categories={categories}
        usedClues={gameState.usedClues}
        onClueSelect={handleClueSelect}
      />

      {gameState.selectedClue && (
        <JeopardyClue
          clue={gameState.selectedClue}
          onAnswer={handleAnswer}
          onClose={handleClueClose}
          currentScore={gameState.score}
        />
      )}
    </div>
  )
}