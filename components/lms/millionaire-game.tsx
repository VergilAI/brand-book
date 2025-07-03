'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProgressAPI } from '@/app/lms/new_course_overview/api/progress-api'
import { MillionaireQuestion } from './millionaire-question'
import { MillionaireProgress } from './millionaire-progress'
import { MillionaireLifelines } from './millionaire-lifelines'
import { MillionaireAudiencePoll } from './millionaire-audience-poll'
import { 
  Trophy, 
  DollarSign, 
  AlertCircle,
  Sparkles,
  Zap,
  Brain,
  TrendingUp,
  CheckCircle,
  XCircle,
  X
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
  lessonId?: string // Add lesson ID for progress tracking
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
  className,
  lessonId
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
  
  // Track question results for progress calculation
  const [questionResults, setQuestionResults] = useState<Array<{
    questionId: string
    isCorrect: boolean
    usedLifelines: string[]
    responseTime: number
  }>>([])

  const [showAudiencePoll, setShowAudiencePoll] = useState(false)
  const [showPhoneAnimation, setShowPhoneAnimation] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  
  // Function to process progress and call game end
  const handleGameEndWithProgress = async (winnings: number, status: GameState['gameStatus']) => {
    if (lessonId && questionResults.length > 0) {
      try {
        await ProgressAPI.processMillionaireCompletion(lessonId, questionResults)
        console.log('Progress updated for lesson:', lessonId)
      } catch (error) {
        console.error('Failed to update progress:', error)
      }
    }
    onGameEnd?.(winnings, status)
  }
  const [lastQuestion, setLastQuestion] = useState<typeof questions[0] | null>(null)

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
    setLastQuestion(currentQuestion) // Store the current question

    setTimeout(() => {
      const isCorrect = gameState.selectedAnswer === currentQuestion.correctAnswer
      
      // Track this question result
      const usedLifelines = Object.entries(gameState.lifelines)
        .filter(([_, lifeline]) => lifeline.used)
        .map(([key, _]) => key)
      
      setQuestionResults(prev => [...prev, {
        questionId: currentQuestion.id,
        isCorrect,
        usedLifelines,
        responseTime: 15000 // Mock response time
      }])
      
      if (isCorrect) {
        const newWinnings = moneyLadder[gameState.currentLevel]
        
        if (gameState.currentLevel === 14) { // Reached the 15th question (million dollar question)
          setGameState(prev => ({
            ...prev,
            gameStatus: 'won',
            totalWinnings: newWinnings
          }))
          // Don't call onGameEnd here - wait for user to click Exit Game
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
        // Don't call onGameEnd here - wait for user to click Exit Game
      }
    }, 2000)
  }

  const handleWalkAway = () => {
    const winnings = gameState.currentLevel > 0 
      ? moneyLadder[gameState.currentLevel - 1] 
      : 0
    setLastQuestion(currentQuestion) // Store current question when walking away
    setGameState(prev => ({
      ...prev,
      gameStatus: 'walkaway',
      totalWinnings: winnings
    }))
    // Don't call onGameEnd here - wait for user to click Exit Game
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

  // Prevent background scrolling when game ends
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [gameState.gameStatus])

  if (gameState.gameStatus !== 'playing') {
    // Calculate correct answers based on status
    let correctAnswersCount = 0
    if (gameState.gameStatus === 'lost') {
      correctAnswersCount = gameState.currentLevel // Lost on this question, so answered all previous ones correctly
    } else if (gameState.gameStatus === 'won') {
      correctAnswersCount = 15 // Won the game, answered all 15 correctly
    } else if (gameState.gameStatus === 'walkaway') {
      correctAnswersCount = gameState.currentLevel // Walked away before answering current question
    }
    
    const knowledgePointsImproved = Math.round((correctAnswersCount / 15) * 100)
    
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
            {gameState.gameStatus === 'won' && (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vergil-purple to-vergil-purple-lighter mx-auto flex items-center justify-center animate-pulse">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-vergil-off-black">
                  Millionaire Champion!
                </h2>
                <p className="text-base text-vergil-off-black/70 max-w-md mx-auto">
                  Incredible achievement! You've conquered all 15 questions and claimed the ultimate prize.
                </p>
              </>
            )}
            
            {gameState.gameStatus === 'lost' && (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 mx-auto flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-3xl font-display font-bold text-vergil-off-black">
                  Game Over
                </h2>
                <p className="text-base text-vergil-off-black/70 max-w-md mx-auto">
                  Good effort! The correct answer was <span className="font-semibold text-vergil-purple">{lastQuestion?.correctAnswer || 'A'}</span>. 
                  Every question is a learning opportunity.
                </p>
              </>
            )}
            
            {gameState.gameStatus === 'walkaway' && (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vergil-purple/20 to-electric-violet/20 mx-auto flex items-center justify-center">
                  <DollarSign className="w-10 h-10 text-vergil-purple" />
                </div>
                <h2 className="text-3xl font-display font-bold text-vergil-off-black">
                  Smart Decision!
                </h2>
                <p className="text-base text-vergil-off-black/70 max-w-md mx-auto">
                  You made a strategic choice to secure your winnings. Well played!
                </p>
              </>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
              <div className="text-2xl font-bold text-vergil-purple mb-1">
                ${gameState.totalWinnings.toLocaleString()}
              </div>
              <div className="text-sm text-vergil-off-black/60">Prize Money</div>
            </Card>
            
            <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
              <div className="text-2xl font-bold text-phosphor-cyan mb-1">
                {correctAnswersCount}/15
              </div>
              <div className="text-sm text-vergil-off-black/60">Correct Answers</div>
            </Card>
            
            <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
              <div className="text-2xl font-bold text-electric-violet mb-1">
                Level {gameState.currentLevel + (gameState.gameStatus === 'walkaway' ? 0 : 1)}
              </div>
              <div className="text-sm text-vergil-off-black/60">Reached</div>
            </Card>
          </div>

          {/* Knowledge Impact Section */}
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
                  <span className="text-lg font-bold text-vergil-purple">+{knowledgePointsImproved}%</span>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleGameEndWithProgress(gameState.totalWinnings, gameState.gameStatus)}
            >
              Exit Game
            </Button>
            <Button
              size="lg"
              onClick={() => {
                // Reset game state instead of reloading
                setGameState({
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
                setLastQuestion(null)
              }}
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

  return (
    <div className={cn("fixed inset-0 bg-gray-100 flex flex-col", className)}>
      {/* Fixed Header */}
      <div className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Who Wants to Be a Millionaire</h2>
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
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 px-12">
              <h1 className="text-2xl font-bold text-vergil-off-black text-center">
                Who Wants to Be a Millionaire?
              </h1>
              <p className="text-sm text-vergil-off-black/60 mt-1 text-center">Test your knowledge and win big</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-vergil-off-black/60">Playing For</p>
              <p className="text-2xl font-bold text-vergil-purple">
                ${currentPrize.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4 bg-white border-vergil-off-black/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-vergil-purple/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-vergil-purple">
                      {gameState.currentLevel + 1}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-vergil-off-black">
                    Question {gameState.currentLevel + 1} of 15
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
              className="flex-1 bg-vergil-purple text-white hover:bg-vergil-purple-lighter"
            >
              <Zap className="w-4 h-4 mr-2" />
              Final Answer
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1 lg:h-[500px]">
          <MillionaireProgress
            currentLevel={gameState.currentLevel}
            moneyLadder={moneyLadder}
            guaranteedLevels={guaranteedLevels}
            className="h-full"
          />
        </div>
      </div>
      </div>
      </div>

      {showAudiencePoll && gameState.lifelines.askAudience.percentages && (
        <MillionaireAudiencePoll
          percentages={gameState.lifelines.askAudience.percentages}
          onClose={() => setShowAudiencePoll(false)}
        />
      )}

      {showPhoneAnimation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center">
            <Card className="p-8 max-w-md bg-white border-vergil-off-black/10 my-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-vergil-purple/10 rounded-full mx-auto animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 bg-vergil-purple rounded-full animate-ping" />
                </div>
                <h3 className="text-xl font-semibold text-vergil-off-black">Calling a Friend...</h3>
                <p className="text-vergil-off-black/60">Getting expert advice on this question</p>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-md bg-white border-vergil-off-black/10">
            <h3 className="text-xl font-semibold text-vergil-off-black mb-4">
              Exit Game?
            </h3>
            <p className="text-vergil-off-black/60 mb-6">
              Are you sure you want to exit? You'll lose your current progress and winnings.
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
                  handleGameEndWithProgress(gameState.guaranteedAmount, 'walkaway')
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