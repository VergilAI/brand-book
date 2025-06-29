'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MillionaireQuestion } from './millionaire-question'
import { MillionaireProgress } from './millionaire-progress'
import { MillionaireLifelines } from './millionaire-lifelines'
import { MillionaireAudiencePoll } from './millionaire-audience-poll'
import { 
  Trophy, 
  DollarSign, 
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react'

export interface Question {
  id: string
  question: string
  answers: {
    A: string
    B: string
    C: string
    D: string
  }
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  difficulty: number
}

export interface GameState {
  currentLevel: number
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null
  isLocked: boolean
  gameStatus: 'playing' | 'won' | 'lost' | 'walkaway'
  lifelines: {
    fiftyFifty: { used: boolean; eliminatedAnswers: ('A' | 'B' | 'C' | 'D')[] }
    phoneAFriend: { used: boolean; suggestion: 'A' | 'B' | 'C' | 'D' | null }
    askAudience: { used: boolean; percentages: Record<'A' | 'B' | 'C' | 'D', number> | null }
  }
  totalWinnings: number
  guaranteedAmount: number
}

interface MillionaireGameProps {
  questions: Question[]
  onGameEnd?: (winnings: number, status: GameState['gameStatus']) => void
  className?: string
}

const moneyLadder = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000
]

const guaranteedLevels = [4, 9] // $1,000 and $32,000

export function MillionaireGame({ 
  questions, 
  onGameEnd,
  className 
}: MillionaireGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    selectedAnswer: null,
    isLocked: false,
    gameStatus: 'playing',
    lifelines: {
      fiftyFifty: { used: false, eliminatedAnswers: [] },
      phoneAFriend: { used: false, suggestion: null },
      askAudience: { used: false, percentages: null }
    },
    totalWinnings: 0,
    guaranteedAmount: 0
  })

  const [showAudiencePoll, setShowAudiencePoll] = useState(false)
  const [showPhoneAnimation, setShowPhoneAnimation] = useState(false)

  const currentQuestion = questions[gameState.currentLevel]
  const currentPrize = moneyLadder[gameState.currentLevel]

  useEffect(() => {
    if (guaranteedLevels.includes(gameState.currentLevel)) {
      setGameState(prev => ({
        ...prev,
        guaranteedAmount: moneyLadder[gameState.currentLevel]
      }))
    }
  }, [gameState.currentLevel])

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (gameState.isLocked || gameState.gameStatus !== 'playing') return
    setGameState(prev => ({ ...prev, selectedAnswer: answer }))
  }

  const handleFinalAnswer = () => {
    if (!gameState.selectedAnswer || gameState.gameStatus !== 'playing') return
    
    setGameState(prev => ({ ...prev, isLocked: true }))

    setTimeout(() => {
      const isCorrect = gameState.selectedAnswer === currentQuestion.correctAnswer
      
      if (isCorrect) {
        const newWinnings = moneyLadder[gameState.currentLevel]
        
        if (gameState.currentLevel === questions.length - 1) {
          setGameState(prev => ({
            ...prev,
            gameStatus: 'won',
            totalWinnings: newWinnings
          }))
          onGameEnd?.(newWinnings, 'won')
        } else {
          setGameState(prev => ({
            ...prev,
            currentLevel: prev.currentLevel + 1,
            selectedAnswer: null,
            isLocked: false,
            totalWinnings: newWinnings
          }))
        }
      } else {
        setGameState(prev => ({
          ...prev,
          gameStatus: 'lost',
          totalWinnings: prev.guaranteedAmount
        }))
        onGameEnd?.(gameState.guaranteedAmount, 'lost')
      }
    }, 2000)
  }

  const handleWalkAway = () => {
    const winnings = gameState.currentLevel > 0 
      ? moneyLadder[gameState.currentLevel - 1] 
      : 0
    setGameState(prev => ({
      ...prev,
      gameStatus: 'walkaway',
      totalWinnings: winnings
    }))
    onGameEnd?.(winnings, 'walkaway')
  }

  const handleLifeline = useCallback((type: 'fiftyFifty' | 'phoneAFriend' | 'askAudience') => {
    if (gameState.lifelines[type].used || gameState.isLocked) return

    switch (type) {
      case 'fiftyFifty': {
        const wrongAnswers = (['A', 'B', 'C', 'D'] as const).filter(
          a => a !== currentQuestion.correctAnswer
        )
        const eliminated = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 2)
        
        setGameState(prev => ({
          ...prev,
          lifelines: {
            ...prev.lifelines,
            fiftyFifty: { used: true, eliminatedAnswers: eliminated }
          }
        }))
        break
      }

      case 'phoneAFriend': {
        setShowPhoneAnimation(true)
        setTimeout(() => {
          const confidence = Math.random()
          let suggestion: 'A' | 'B' | 'C' | 'D'
          
          if (confidence > 0.7) {
            suggestion = currentQuestion.correctAnswer
          } else {
            const allAnswers = ['A', 'B', 'C', 'D'] as const
            suggestion = allAnswers[Math.floor(Math.random() * 4)]
          }
          
          setGameState(prev => ({
            ...prev,
            lifelines: {
              ...prev.lifelines,
              phoneAFriend: { used: true, suggestion }
            }
          }))
          setShowPhoneAnimation(false)
        }, 3000)
        break
      }

      case 'askAudience': {
        const correctAnswer = currentQuestion.correctAnswer
        const percentages = { A: 0, B: 0, C: 0, D: 0 }
        
        let correctPercentage = 45 + Math.random() * 40
        percentages[correctAnswer] = Math.round(correctPercentage)
        
        let remaining = 100 - percentages[correctAnswer]
        const otherAnswers = (['A', 'B', 'C', 'D'] as const).filter(a => a !== correctAnswer)
        
        otherAnswers.forEach((answer, index) => {
          if (index === otherAnswers.length - 1) {
            percentages[answer] = remaining
          } else {
            const share = Math.floor(Math.random() * remaining * 0.6)
            percentages[answer] = share
            remaining -= share
          }
        })
        
        setGameState(prev => ({
          ...prev,
          lifelines: {
            ...prev.lifelines,
            askAudience: { used: true, percentages }
          }
        }))
        setShowAudiencePoll(true)
        break
      }
    }
  }, [currentQuestion, gameState.lifelines, gameState.isLocked])

  if (gameState.gameStatus !== 'playing') {
    return (
      <Card className={cn(
        "p-12 text-center max-w-2xl mx-auto border-stone-gray/20",
        className
      )}>
        <div className="space-y-6">
          {gameState.gameStatus === 'won' && (
            <>
              <div className="w-24 h-24 rounded-full bg-cosmic-purple/10 mx-auto flex items-center justify-center">
                <Trophy className="w-12 h-12 text-cosmic-purple" />
              </div>
              <h2 className="text-4xl font-display font-bold text-deep-space">
                Congratulations!
              </h2>
              <p className="text-xl text-stone-gray">
                You've won the million dollar prize!
              </p>
            </>
          )}
          
          {gameState.gameStatus === 'lost' && (
            <>
              <div className="w-24 h-24 rounded-full bg-vivid-red/10 mx-auto flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-vivid-red" />
              </div>
              <h2 className="text-4xl font-display font-bold text-deep-space">
                Game Over
              </h2>
              <p className="text-xl text-stone-gray">
                The correct answer was {currentQuestion.correctAnswer}
              </p>
            </>
          )}
          
          {gameState.gameStatus === 'walkaway' && (
            <>
              <div className="w-24 h-24 rounded-full bg-cosmic-purple/10 mx-auto flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-cosmic-purple" />
              </div>
              <h2 className="text-4xl font-display font-bold text-deep-space">
                Thanks for Playing!
              </h2>
              <p className="text-xl text-stone-gray">
                You made the smart choice to walk away
              </p>
            </>
          )}
          
          <div className="pt-6">
            <p className="text-lg text-stone-gray mb-2">Your Winnings</p>
            <p className="text-5xl font-mono font-bold text-cosmic-purple">
              ${gameState.totalWinnings.toLocaleString()}
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold text-deep-space">
          Who Wants to Be a Millionaire?
        </h1>
        <Card className="px-4 py-2 border-stone-gray/20">
          <div className="text-center">
            <p className="text-sm text-stone-gray">Playing For</p>
            <p className="text-xl font-mono font-bold text-cosmic-purple">
              ${currentPrize.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 border-stone-gray/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cosmic-purple/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-cosmic-purple">
                    {gameState.currentLevel + 1}
                  </span>
                </div>
                <h2 className="text-xl font-display font-semibold text-deep-space">
                  Question {gameState.currentLevel + 1} of {questions.length}
                </h2>
              </div>
            </div>
            
            <MillionaireLifelines
              lifelines={gameState.lifelines}
              onUseLifeline={handleLifeline}
              disabled={gameState.isLocked}
            />
          </Card>

          <MillionaireQuestion
            question={currentQuestion}
            selectedAnswer={gameState.selectedAnswer}
            lockedAnswer={gameState.isLocked ? gameState.selectedAnswer : null}
            correctAnswer={gameState.isLocked ? currentQuestion.correctAnswer : null}
            eliminatedAnswers={gameState.lifelines.fiftyFifty.eliminatedAnswers}
            phoneASuggestion={gameState.lifelines.phoneAFriend.suggestion}
            onSelectAnswer={handleAnswerSelect}
          />

          <div className="flex gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={handleWalkAway}
              disabled={gameState.isLocked}
              className="flex-1"
            >
              Walk Away with ${gameState.currentLevel > 0 
                ? moneyLadder[gameState.currentLevel - 1].toLocaleString() 
                : '0'}
            </Button>
            <Button
              size="lg"
              onClick={handleFinalAnswer}
              disabled={!gameState.selectedAnswer || gameState.isLocked}
              className="flex-1 bg-cosmic-purple text-white hover:bg-electric-violet"
            >
              <Zap className="w-4 h-4 mr-2" />
              Final Answer
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <MillionaireProgress
            currentLevel={gameState.currentLevel}
            moneyLadder={moneyLadder}
            guaranteedLevels={guaranteedLevels}
          />
        </div>
      </div>

      {showAudiencePoll && gameState.lifelines.askAudience.percentages && (
        <MillionaireAudiencePoll
          percentages={gameState.lifelines.askAudience.percentages}
          onClose={() => setShowAudiencePoll(false)}
        />
      )}

      {showPhoneAnimation && (
        <div className="fixed inset-0 bg-deep-space/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-8 max-w-md animate-pulse">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-cosmic-purple rounded-full mx-auto animate-pulse" />
              <h3 className="text-xl font-display font-bold">Calling a Friend...</h3>
              <p className="text-stone-gray">Getting expert advice on this question</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}