'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  X, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Clock,
  Target,
  Zap,
  Brain,
  Sparkles
} from 'lucide-react'

export interface ConnectCard {
  id: string
  content: string
  matchId: string
  side: 'left' | 'right'
  type: 'text' | 'image'
  hint?: string
}

export interface ConnectCardsPair {
  matchId: string
  leftCard: ConnectCard
  rightCard: ConnectCard
  category?: string
}

export interface ConnectCardsGameResult {
  correctAnswers: number
  incorrectAnswers: number
  totalPairs: number
  completionTime: number
  accuracy: number
}

export interface ConnectCardsGameState {
  selectedLeftCard: ConnectCard | null
  selectedRightCard: ConnectCard | null
  matchedPairs: Set<string>
  currentAttempt: { left: ConnectCard; right: ConnectCard } | null
  correctAnswers: number
  incorrectAnswers: number
  isCheckingMatch: boolean
  gameCompleted: boolean
  startTime: number
  endTime?: number
}

interface ConnectCardsGameProps {
  pairs: ConnectCardsPair[]
  title?: string
  onComplete: (result: ConnectCardsGameResult) => void
  onQuit: () => void
  className?: string
}

export function ConnectCardsGame({
  pairs,
  title = "Connect the Cards",
  onComplete,
  onQuit,
  className
}: ConnectCardsGameProps) {
  const [gameState, setGameState] = useState<ConnectCardsGameState>({
    selectedLeftCard: null,
    selectedRightCard: null,
    matchedPairs: new Set(),
    currentAttempt: null,
    correctAnswers: 0,
    incorrectAnswers: 0,
    isCheckingMatch: false,
    gameCompleted: false,
    startTime: Date.now()
  })

  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [shuffledCards] = useState(() => ({
    left: pairs.map(pair => pair.leftCard).sort(() => Math.random() - 0.5),
    right: pairs.map(pair => pair.rightCard).sort(() => Math.random() - 0.5)
  }))

  // Only filter out actually matched pairs, not cards in current attempt
  const availableLeftCards = shuffledCards.left.filter(card => !gameState.matchedPairs.has(card.matchId))
  const availableRightCards = shuffledCards.right.filter(card => !gameState.matchedPairs.has(card.matchId))

  const handleCardSelect = useCallback((card: ConnectCard) => {
    if (gameState.isCheckingMatch || gameState.matchedPairs.has(card.matchId)) return

    setGameState(prev => {
      if (card.side === 'left') {
        const newState = { ...prev, selectedLeftCard: card }
        
        if (prev.selectedRightCard) {
          newState.currentAttempt = { left: card, right: prev.selectedRightCard }
          newState.isCheckingMatch = true
        }
        
        return newState
      } else {
        const newState = { ...prev, selectedRightCard: card }
        
        if (prev.selectedLeftCard) {
          newState.currentAttempt = { left: prev.selectedLeftCard, right: card }
          newState.isCheckingMatch = true
        }
        
        return newState
      }
    })
  }, [gameState.isCheckingMatch, gameState.matchedPairs])

  useEffect(() => {
    if (gameState.currentAttempt && gameState.isCheckingMatch) {
      const { left, right } = gameState.currentAttempt
      const isMatch = left.matchId === right.matchId

      // Show feedback - shorter for correct matches, longer for incorrect
      const feedbackDuration = isMatch ? 500 : 1000
      
      setTimeout(() => {
        setGameState(prev => {
          const newMatchedPairs = new Set(prev.matchedPairs)
          let newCorrectAnswers = prev.correctAnswers
          let newIncorrectAnswers = prev.incorrectAnswers

          if (isMatch) {
            newMatchedPairs.add(left.matchId)
            newCorrectAnswers++
          } else {
            newIncorrectAnswers++
          }

          const gameCompleted = newMatchedPairs.size === pairs.length

          return {
            ...prev,
            matchedPairs: newMatchedPairs,
            correctAnswers: newCorrectAnswers,
            incorrectAnswers: newIncorrectAnswers,
            selectedLeftCard: null,
            selectedRightCard: null,
            currentAttempt: null,
            isCheckingMatch: false,
            gameCompleted,
            endTime: gameCompleted ? Date.now() : prev.endTime
          }
        })
      }, feedbackDuration)
    }
  }, [gameState.currentAttempt, gameState.isCheckingMatch, pairs.length])

  useEffect(() => {
    if (gameState.gameCompleted) {
      setShowCompletionModal(true)
    }
  }, [gameState.gameCompleted])

  const getCardStyle = (card: ConnectCard) => {
    const isSelected = (card.side === 'left' && gameState.selectedLeftCard?.id === card.id) ||
                     (card.side === 'right' && gameState.selectedRightCard?.id === card.id)
    const isMatched = gameState.matchedPairs.has(card.matchId)
    const isInCurrentAttempt = gameState.currentAttempt && 
                              (gameState.currentAttempt.left.id === card.id || gameState.currentAttempt.right.id === card.id)
    
    if (isMatched) {
      return 'bg-green-50 border-green-500 text-green-700 opacity-60'
    }
    
    if (isInCurrentAttempt && gameState.isCheckingMatch) {
      const isCorrect = gameState.currentAttempt!.left.matchId === gameState.currentAttempt!.right.matchId
      return isCorrect 
        ? 'bg-green-50 border-green-500 text-green-700'
        : 'bg-red-50 border-red-500 text-red-600 border-2'
    }
    
    if (isSelected) {
      return 'bg-vergil-purple/5 border-vergil-purple text-vergil-off-black shadow-lg'
    }
    
    return 'bg-white border-vergil-off-black/10 hover:border-vergil-purple/40 hover:shadow-sm'
  }

  const getCardAnimation = (card: ConnectCard) => {
    const isInCurrentAttempt = gameState.currentAttempt && 
                              (gameState.currentAttempt.left.id === card.id || gameState.currentAttempt.right.id === card.id)
    
    if (isInCurrentAttempt && gameState.isCheckingMatch) {
      const isCorrect = gameState.currentAttempt!.left.matchId === gameState.currentAttempt!.right.matchId
      
      if (!isCorrect) {
        // Gentle wriggle animation with rotation for wrong matches
        return {
          x: [0, -6, 6, -4, 4, -2, 2, 0],
          rotate: [0, -1.5, 1.5, -1, 1, -0.5, 0.5, 0],
          transition: {
            duration: 0.8,
            ease: "easeInOut"
          }
        }
      }
    }
    
    // Default animation - always visible
    return { opacity: 1, x: 0 }
  }

  const progress = (gameState.matchedPairs.size / pairs.length) * 100

  if (showCompletionModal) {
    const completionTime = (gameState.endTime! - gameState.startTime) / 1000
    const accuracy = gameState.correctAnswers > 0 ? (gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100 : 0

    useEffect(() => {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [])

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-8 bg-white border-vergil-off-black/10 bg-gradient-to-br from-vergil-off-white to-white overflow-hidden">
            <div className="space-y-6">
              {/* Header Section */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vergil-purple to-vergil-purple-lighter mx-auto flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-vergil-off-black">
                  Excellent Matching!
                </h2>
                <p className="text-base text-vergil-off-black/70 max-w-md mx-auto">
                  You've completed all card pairs
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
                  <div className="text-2xl font-bold text-vergil-purple mb-1">
                    {gameState.correctAnswers}
                  </div>
                  <div className="text-sm text-vergil-off-black/60">Correct</div>
                </Card>
                
                <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
                  <div className="text-2xl font-bold text-vergil-purple mb-1">
                    {Math.round(accuracy)}%
                  </div>
                  <div className="text-sm text-vergil-off-black/60">Accuracy</div>
                </Card>
                
                <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
                  <div className="text-2xl font-bold text-vergil-purple mb-1">
                    {completionTime.toFixed(0)}s
                  </div>
                  <div className="text-sm text-vergil-off-black/60">Time</div>
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
                        +{Math.round(accuracy * 0.8)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const completionTime = (gameState.endTime! - gameState.startTime) / 1000
                    const accuracy = (gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100
                    
                    onComplete({
                      correctAnswers: gameState.correctAnswers,
                      incorrectAnswers: gameState.incorrectAnswers,
                      totalPairs: pairs.length,
                      completionTime,
                      accuracy
                    })
                  }}
                >
                  Exit Game
                </Button>
                <Button
                  size="lg"
                  onClick={() => window.location.reload()}
                  className="bg-vergil-purple text-white hover:bg-vergil-purple-lighter"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // Prevent background scrolling when game is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className={cn("fixed inset-0 bg-gray-100 flex flex-col", className)}>
      {/* Fixed Header */}
      <div className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
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
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Match the cards from left to right</p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-vergil-off-black/60">Matched</p>
                <p className="text-2xl font-bold text-vergil-purple">
                  {gameState.matchedPairs.size}/{pairs.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-vergil-off-black/60">Mistakes</p>
                <p className="text-2xl font-bold text-red-600">
                  {gameState.incorrectAnswers}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Progress */}
            <Card className="p-4 bg-white border-vergil-off-black/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-vergil-purple/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-vergil-purple">
                      {gameState.matchedPairs.size}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-vergil-off-black">
                    Matching Progress
                  </h2>
                </div>
                <span className="text-sm font-medium text-vergil-purple">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-vergil-off-black/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-vergil-purple transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-lg font-display font-semibold text-vergil-off-black text-center">
                  Left Side
                </h3>
          <AnimatePresence mode="popLayout">
            {availableLeftCards.map((card, index) => {
              const cardAnimation = getCardAnimation(card)
              return (
                <motion.button
                  key={card.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: cardAnimation.x || 0,
                    rotate: cardAnimation.rotate || 0,
                    transition: cardAnimation.transition || { delay: index * 0.05 }
                  }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  onClick={() => handleCardSelect(card)}
                  disabled={gameState.isCheckingMatch}
                  className="w-full"
                >
                <Card className={cn(
                  "p-6 text-center transition-all duration-200",
                  getCardStyle(card)
                )}>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      {card.content}
                    </p>
                    {card.hint && (
                      <p className="text-sm opacity-60">
                        {card.hint}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.button>
              )
            })}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-display font-semibold text-vergil-off-black text-center">
            Right Side
          </h3>
          <AnimatePresence mode="popLayout">
            {availableRightCards.map((card, index) => {
              const cardAnimation = getCardAnimation(card)
              return (
                <motion.button
                  key={card.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: cardAnimation.x || 0,
                    rotate: cardAnimation.rotate || 0,
                    transition: cardAnimation.transition || { delay: index * 0.05 }
                  }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  onClick={() => handleCardSelect(card)}
                  disabled={gameState.isCheckingMatch}
                  className="w-full"
                >
                <Card className={cn(
                  "p-6 text-center transition-all duration-200",
                  getCardStyle(card)
                )}>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      {card.content}
                    </p>
                    {card.hint && (
                      <p className="text-sm opacity-60">
                        {card.hint}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.button>
              )
            })}
              </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-md bg-white border-vergil-off-black/10">
            <h3 className="text-xl font-semibold text-vergil-off-black mb-4">
              Exit Game?
            </h3>
            <p className="text-vergil-off-black/60 mb-6">
              Are you sure you want to exit? You'll lose your current progress.
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
                  onQuit()
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