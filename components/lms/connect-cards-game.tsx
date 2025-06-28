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
  Zap
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
      const completionTime = (gameState.endTime! - gameState.startTime) / 1000
      const accuracy = (gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100
      
      onComplete({
        correctAnswers: gameState.correctAnswers,
        incorrectAnswers: gameState.incorrectAnswers,
        totalPairs: pairs.length,
        completionTime,
        accuracy
      })
    }
  }, [gameState.gameCompleted, gameState.endTime, gameState.startTime, gameState.correctAnswers, gameState.incorrectAnswers, pairs.length, onComplete])

  const getCardStyle = (card: ConnectCard) => {
    const isSelected = (card.side === 'left' && gameState.selectedLeftCard?.id === card.id) ||
                     (card.side === 'right' && gameState.selectedRightCard?.id === card.id)
    const isMatched = gameState.matchedPairs.has(card.matchId)
    const isInCurrentAttempt = gameState.currentAttempt && 
                              (gameState.currentAttempt.left.id === card.id || gameState.currentAttempt.right.id === card.id)
    
    if (isMatched) {
      return 'bg-phosphor-cyan/10 border-phosphor-cyan text-phosphor-cyan opacity-60'
    }
    
    if (isInCurrentAttempt && gameState.isCheckingMatch) {
      const isCorrect = gameState.currentAttempt!.left.matchId === gameState.currentAttempt!.right.matchId
      return isCorrect 
        ? 'bg-phosphor-cyan/10 border-phosphor-cyan text-phosphor-cyan'
        : 'bg-red-50 border-red-500 text-red-600 border-2'
    }
    
    if (isSelected) {
      return 'bg-cosmic-purple/10 border-cosmic-purple text-cosmic-purple shadow-lg'
    }
    
    return 'border-stone-gray/20 hover:border-cosmic-purple/40 hover:shadow-sm'
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

    return (
      <div className="fixed inset-0 bg-deep-space/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center border-stone-gray/20">
            <div className="space-y-6">
              <div className="w-24 h-24 rounded-full bg-cosmic-purple/10 mx-auto flex items-center justify-center">
                <Trophy className="w-12 h-12 text-cosmic-purple" />
              </div>
              
              <div>
                <h2 className="text-3xl font-display font-bold text-deep-space mb-2">
                  Well Done!
                </h2>
                <p className="text-stone-gray">
                  You've completed the card matching challenge
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-phosphor-cyan/5 rounded-lg">
                    <p className="text-2xl font-bold text-phosphor-cyan">{gameState.correctAnswers}</p>
                    <p className="text-sm text-stone-gray">Correct</p>
                  </div>
                  <div className="p-3 bg-vivid-red/5 rounded-lg">
                    <p className="text-2xl font-bold text-vivid-red">{gameState.incorrectAnswers}</p>
                    <p className="text-sm text-stone-gray">Incorrect</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-stone-gray">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{completionTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{accuracy.toFixed(0)}% accuracy</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onQuit}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-cosmic-purple text-white hover:bg-electric-violet"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-deep-space">
          {title}
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={onQuit}
          className="text-stone-gray hover:text-deep-space"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-4 border-stone-gray/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-stone-gray">
            <Target className="w-4 h-4" />
            <span>Progress: {gameState.matchedPairs.size}/{pairs.length} pairs</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-stone-gray">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-phosphor-cyan" />
              <span>{gameState.correctAnswers}</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="w-4 h-4 text-vivid-red" />
              <span>{gameState.incorrectAnswers}</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-mist-gray rounded-full h-2">
          <motion.div
            className="bg-cosmic-purple h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Card>

      <div className="text-center mb-4">
        <p className="text-stone-gray">
          Select one card from each side to make a match
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="text-lg font-display font-semibold text-deep-space text-center">
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
          <h3 className="text-lg font-display font-semibold text-deep-space text-center">
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
  )
}