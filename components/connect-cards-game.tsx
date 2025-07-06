'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { cn } from '@/lib/utils'
import { ProgressAPI } from '@/app/lms/new_course_overview/api/progress-api'
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
  lessonId?: string // Add lesson ID for progress tracking
}

export function ConnectCardsGame({
  pairs,
  title = "Connect the Cards",
  onComplete,
  onQuit,
  className,
  lessonId
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
      return 'bg-bg-success/10 border-border-success text-text-success opacity-60'
    }
    
    if (isInCurrentAttempt && gameState.isCheckingMatch) {
      const isCorrect = gameState.currentAttempt!.left.matchId === gameState.currentAttempt!.right.matchId
      return isCorrect 
        ? 'bg-bg-success/10 border-border-success text-text-success'
        : 'bg-bg-error/10 border-border-error text-text-error border-2'
    }
    
    if (isSelected) {
      return 'bg-bg-brand/5 border-border-brand text-text-primary shadow-elevated'
    }
    
    return 'bg-bg-primary border-border-subtle hover:border-border-brand/40 hover:shadow-base'
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
          rotate: [0, -1.5, 1.5, -1, 1, -0.5, 0.5, 0]
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
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-elevation-modal overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-space-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-space-lg bg-bg-primary border-border-subtle bg-gradient-to-br from-bg-secondary to-bg-primary overflow-hidden">
            <div className="space-y-space-lg">
              {/* Header Section */}
              <div className="text-center space-y-space-md">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-color-brand-primary to-color-brand-secondary mx-auto flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-text-inverse" />
                </div>
                <h2 className="text-3xl font-display font-bold text-text-primary">
                  Excellent Matching!
                </h2>
                <p className="text-base text-text-secondary max-w-md mx-auto">
                  You've completed all card pairs
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-space-md">
                <Card variant="outlined" className="p-space-md text-center border-border-subtle">
                  <div className="text-2xl font-bold text-text-brand mb-space-xs">
                    {gameState.correctAnswers}
                  </div>
                  <div className="text-sm text-text-tertiary">Correct</div>
                </Card>
                
                <Card variant="outlined" className="p-space-md text-center border-border-subtle">
                  <div className="text-2xl font-bold text-text-brand mb-space-xs">
                    {Math.round(accuracy)}%
                  </div>
                  <div className="text-sm text-text-tertiary">Accuracy</div>
                </Card>
                
                <Card variant="outlined" className="p-space-md text-center border-border-subtle">
                  <div className="text-2xl font-bold text-text-brand mb-space-xs">
                    {completionTime.toFixed(0)}s
                  </div>
                  <div className="text-sm text-text-tertiary">Time</div>
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
                        +{Math.round(accuracy * 0.8)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-space-sm">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={async () => {
                    const completionTime = (gameState.endTime! - gameState.startTime) / 1000
                    const accuracy = (gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100
                    
                    // Process progress if lessonId is provided
                    if (lessonId) {
                      try {
                        // Create results for progress tracking
                        const results = pairs.map((pair, index) => ({
                          pairId: pair.matchId,
                          isCorrect: gameState.matchedPairs.has(pair.matchId),
                          attempts: gameState.matchedPairs.has(pair.matchId) ? 1 : 2 // Mock attempts
                        }))
                        
                        console.log('🃏 CONNECT CARDS: About to process completion:', {
                          lessonId,
                          results,
                          totalPairs: pairs.length,
                          matchedPairs: gameState.matchedPairs.size
                        })
                        
                        await ProgressAPI.processConnectCardsCompletion(lessonId, results)
                        console.log('✅ CONNECT CARDS: Progress updated for lesson:', lessonId)
                        
                        // Check localStorage immediately after
                        console.log('📂 CONNECT CARDS: Checking localStorage after update:')
                        console.log('Lesson data:', localStorage.getItem(`lesson_progress_${lessonId}`))
                        console.log('Course data:', localStorage.getItem(`user-progress-course-1`))
                        
                      } catch (error) {
                        console.error('❌ CONNECT CARDS: Failed to update progress:', error)
                      }
                    } else {
                      console.warn('⚠️ CONNECT CARDS: No lessonId provided, skipping progress update')
                    }
                    
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
                  className="bg-bg-brand text-text-inverse hover:bg-bg-brand-hover"
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
    <div className={cn("fixed inset-0 bg-bg-secondary flex flex-col", className)}>
      {/* Fixed Header */}
      <div className="bg-bg-primary shadow-base z-elevation-high">
        <div className="max-w-7xl mx-auto px-space-lg py-space-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
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
        <div className="max-w-7xl mx-auto p-space-lg">
          <div className="flex items-center justify-between mb-space-md">
            <p className="text-sm text-text-secondary">Match the cards from left to right</p>
            <div className="flex items-center gap-space-lg">
              <div className="text-center">
                <p className="text-xs text-text-tertiary">Matched</p>
                <p className="text-2xl font-bold text-text-brand">
                  {gameState.matchedPairs.size}/{pairs.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-tertiary">Mistakes</p>
                <p className="text-2xl font-bold text-text-error">
                  {gameState.incorrectAnswers}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-space-md">
            {/* Progress */}
            <Card className="p-space-md bg-bg-primary border-border-subtle">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-bg-brand/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-text-brand">
                      {gameState.matchedPairs.size}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">
                    Matching Progress
                  </h2>
                </div>
                <span className="text-sm font-medium text-text-brand">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-bg-brand transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-space-lg">
              <div className="space-y-space-sm">
                <h3 className="text-lg font-display font-semibold text-text-primary text-center">
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
                    rotate: cardAnimation.rotate || 0
                  }}
                  transition={
                    (cardAnimation.x && Array.isArray(cardAnimation.x)) 
                      ? { duration: 0.8, ease: "easeInOut" }
                      : { delay: index * 0.05 }
                  }
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  onClick={() => handleCardSelect(card)}
                  disabled={gameState.isCheckingMatch}
                  className="w-full"
                >
                <Card className={cn(
                  "p-space-lg text-center transition-all duration-200",
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

        <div className="space-y-space-sm">
          <h3 className="text-lg font-display font-semibold text-text-primary text-center">
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
                    rotate: cardAnimation.rotate || 0
                  }}
                  transition={
                    (cardAnimation.x && Array.isArray(cardAnimation.x)) 
                      ? { duration: 0.8, ease: "easeInOut" }
                      : { delay: index * 0.05 }
                  }
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  onClick={() => handleCardSelect(card)}
                  disabled={gameState.isCheckingMatch}
                  className="w-full"
                >
                <Card className={cn(
                  "p-space-lg text-center transition-all duration-200",
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
        <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-elevation-modal flex items-center justify-center p-space-md">
          <Card className="p-space-lg max-w-md bg-bg-primary border-border-subtle">
            <h3 className="text-xl font-semibold text-text-primary mb-space-md">
              Exit Game?
            </h3>
            <p className="text-text-secondary mb-space-lg">
              Are you sure you want to exit? You'll lose your current progress.
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
                  onQuit()
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