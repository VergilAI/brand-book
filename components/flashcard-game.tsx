'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { 
  X, 
  Check, 
  ChevronRight, 
  RotateCcw, 
  Brain, 
  Lightbulb,
  Sparkles,
  ArrowLeft,
  Layers
} from 'lucide-react'
import type { FlashcardDeck, FlashcardGameState, FlashcardGameResult } from '@/lib/lms/flashcard-types'
import { ProgressAPI } from '@/app/lms/new_course_overview/api/progress-api'
import { cn } from '@/lib/utils'

interface FlashcardGameProps {
  deck: FlashcardDeck
  onComplete: (result: FlashcardGameResult) => void
  onQuit: () => void
  className?: string
  lessonId?: string // Add lesson ID for progress tracking
}

export function FlashcardGame({ 
  deck, 
  onComplete, 
  onQuit,
  className,
  lessonId
}: FlashcardGameProps) {
  const [gameState, setGameState] = useState<FlashcardGameState>({
    currentIndex: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    answeredCards: new Set(),
    userAnswers: new Map(),
    startTime: Date.now()
  })
  
  // Track correct/incorrect status separately
  const [cardResults, setCardResults] = useState<Map<string, boolean>>(new Map())

  const [isFlipped, setIsFlipped] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const currentCard = deck.cards[gameState.currentIndex]
  const progress = ((gameState.currentIndex) / deck.cards.length) * 100

  useEffect(() => {
    if (!isFlipped && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFlipped, gameState.currentIndex])

  useEffect(() => {
    // Prevent background scrolling when game is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const checkAnswer = () => {
    if (!userAnswer.trim()) return

    const normalizedUserAnswer = userAnswer.toLowerCase().trim()
    const normalizedCorrectAnswer = currentCard.back.toLowerCase()
    
    // Simple check - in a real app, this would be more sophisticated
    const correct = normalizedCorrectAnswer.includes(normalizedUserAnswer) || 
                   normalizedUserAnswer.length > 10

    setIsAnswered(true)
    setIsCorrect(correct)
    setIsFlipped(true)

    setGameState(prev => ({
      ...prev,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: correct ? prev.incorrectAnswers : prev.incorrectAnswers + 1,
      answeredCards: new Set([...prev.answeredCards, currentCard.id]),
      userAnswers: new Map(prev.userAnswers).set(currentCard.id, userAnswer)
    }))
    
    // Track the result
    setCardResults(prev => new Map(prev).set(currentCard.id, correct))
  }

  const skipCard = () => {
    setIsAnswered(true)
    setIsCorrect(false)
    setIsFlipped(true)
    
    setGameState(prev => ({
      ...prev,
      incorrectAnswers: prev.incorrectAnswers + 1,
      answeredCards: new Set([...prev.answeredCards, currentCard.id]),
      userAnswers: new Map(prev.userAnswers).set(currentCard.id, '') // Mark as skipped with empty answer
    }))
    
    // Track as incorrect
    setCardResults(prev => new Map(prev).set(currentCard.id, false))
  }

  const nextCard = () => {
    if (gameState.currentIndex < deck.cards.length - 1) {
      setGameState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }))
      resetCardState()
    } else {
      completeGame()
    }
  }

  const resetCardState = () => {
    setIsFlipped(false)
    setUserAnswer('')
    setShowHint(false)
    setIsAnswered(false)
    setIsCorrect(null)
  }

  const completeGame = async () => {
    const endTime = Date.now()
    
    // Process progress if lessonId is provided
    if (lessonId) {
      try {
        // Create results for progress tracking - only for cards that were actually answered
        const results = Array.from(cardResults.entries()).map(([cardId, isCorrect]) => ({
          cardId,
          isCorrect,
          responseTime: 5000 // Mock response time, could be tracked per card
        }))
        
        console.log('🃏 Flashcard results for progress tracking:', results)
        
        // Update knowledge point progress
        await ProgressAPI.processFlashcardCompletion(lessonId, results)
        console.log('Progress updated for lesson:', lessonId)
      } catch (error) {
        console.error('Failed to update progress:', error)
      }
    }
    
    const result: FlashcardGameResult = {
      totalCards: deck.cards.length,
      correctAnswers: gameState.correctAnswers,
      incorrectAnswers: gameState.incorrectAnswers,
      accuracy: (gameState.correctAnswers / deck.cards.length) * 100,
      timeSpent: Math.floor((endTime - gameState.startTime) / 1000),
      knowledgePointProgress: new Map() // In a real app, calculate progress per knowledge point
    }
    
    setShowCompletion(true)
    // Don't automatically call onComplete - wait for user interaction
  }

  return (
    <div className={cn("fixed inset-0 bg-bg-secondary flex flex-col", className)}>
      {/* Fixed Header */}
      <div className="bg-bg-elevated shadow-card z-sticky">
        <div className="max-w-7xl mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">Flashcard Practice</h2>
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
        <div className="max-w-7xl mx-auto p-lg">
          <div className="flex items-center justify-between mb-md">
            <p className="text-sm text-text-secondary">{deck.title}</p>
            <div className="flex items-center gap-lg">
              <div className="text-center">
                <p className="text-xs text-text-tertiary">Correct</p>
                <p className="text-2xl font-bold text-text-brand">
                  {gameState.correctAnswers}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-tertiary">Incorrect</p>
                <p className="text-2xl font-bold text-text-error">
                  {gameState.incorrectAnswers}
                </p>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-md">
          <div className="lg:col-span-3 space-y-md">
            {/* Progress card */}
            <Card className="card-default p-md">
              <div className="flex items-center justify-between mb-md">
                <div className="flex items-center gap-sm">
                  <div className="w-8 h-8 rounded-full bg-bg-brand/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-text-brand">
                      {gameState.currentIndex + 1}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">
                    Card {gameState.currentIndex + 1} of {deck.cards.length}
                  </h2>
                </div>
                <span className="text-sm font-medium text-text-brand">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-bg-brand transition-all duration-slow"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Card>

            {/* Card display area */}
            <AnimatePresence mode="wait">
              {!showCompletion ? (
                <>
                  {/* Flashcard */}
                  <motion.div
                    key={currentCard.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ 
                      opacity: 0, 
                      x: isCorrect ? 300 : -300,
                      rotate: isCorrect ? 20 : -20
                    }}
                    transition={{ duration: 0.4 }}
                    className="relative h-[320px]"
                  >
                    {/* Card stack effect */}
                    {Array.from({ length: Math.min(deck.cards.length - gameState.currentIndex - 1, 3) }).map((_, i) => {
                      const offset = (i + 1) * 3
                      const rotation = (i % 2 === 0 ? 1 : -1) * (i + 1) * 0.3
                      const opacity = 1 - (i * 0.2)
                      
                      return (
                        <div
                          key={`stack-${i}`}
                          className="absolute inset-0 bg-bg-elevated rounded-xl shadow-card border border-border-subtle"
                          style={{
                            transform: `translateY(${offset}px) rotate(${rotation}deg)`,
                            opacity: opacity,
                            zIndex: -i - 1
                          }}
                        />
                      )
                    })}
                    
                    {/* Main Card */}
                    <Card className="card-default h-full overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        {/* Front of Card */}
                        <div
                          className="absolute inset-0 p-lg flex flex-col items-center justify-center bg-bg-elevated rounded-xl"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <div className="w-12 h-12 rounded-full bg-bg-brand/10 flex items-center justify-center mb-md">
                            <Brain className="w-6 h-6 text-text-brand" />
                          </div>
                          
                          <h3 className="text-xl font-semibold text-text-primary text-center px-md">
                            {currentCard.front}
                          </h3>
                        </div>

                        {/* Back of Card */}
                        <div
                          className="absolute inset-0 p-lg flex flex-col items-center justify-center bg-bg-elevated rounded-xl"
                          style={{ 
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          {isCorrect !== null && (
                            <div className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center mb-sm",
                              isCorrect 
                                ? "bg-bg-success/10"
                                : "bg-bg-error/10"
                            )}>
                              {isCorrect ? (
                                <Check className="w-6 h-6 text-text-success" />
                              ) : (
                                <X className="w-6 h-6 text-text-error" />
                              )}
                            </div>
                          )}

                          <h4 className="text-base font-medium text-text-secondary mb-sm">
                            {isCorrect ? "Correct!" : "The answer is:"}
                          </h4>
                          
                          <p className="text-lg text-text-primary text-center font-medium mb-sm px-md">
                            {currentCard.back}
                          </p>

                          {userAnswer && !isCorrect && (
                            <div className="p-sm bg-bg-tertiary rounded-lg max-w-md">
                              <p className="text-sm text-text-secondary">
                                Your answer: "{userAnswer}"
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </Card>
                  </motion.div>

                  {/* Controls */}
                  {!isFlipped ? (
                    <Card className="card-default p-md">
                      <div className="space-y-md">
                        <Input
                          ref={inputRef}
                          type="text"
                          placeholder="Type your answer..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                          className="text-center text-base"
                          disabled={isAnswered}
                        />
                        
                        <div className="flex gap-sm">
                          <Button
                            onClick={checkAnswer}
                            disabled={!userAnswer.trim() || isAnswered}
                            className="flex-1 btn-primary"
                          >
                            Check Answer
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={skipCard}
                            disabled={isAnswered}
                          >
                            Skip
                          </Button>
                        </div>

                        {currentCard.hint && !showHint && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHint(true)}
                            className="w-full text-text-tertiary"
                          >
                            <Lightbulb className="w-4 h-4 mr-1" />
                            Need a hint?
                          </Button>
                        )}

                        {showHint && currentCard.hint && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-sm bg-bg-brand/10 rounded-lg"
                          >
                            <p className="text-sm text-text-secondary">
                              <Lightbulb className="w-4 h-4 inline mr-1" />
                              {currentCard.hint}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </Card>
                  ) : (
                    <div className="flex justify-center">
                      <Button
                        onClick={nextCard}
                        size="lg"
                        className="btn-primary"
                      >
                        {gameState.currentIndex < deck.cards.length - 1 ? (
                          <>
                            Next Card
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </>
                        ) : (
                          <>
                            Complete
                            <Sparkles className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <FlashcardCompletionModal
                  result={{
                    totalCards: deck.cards.length,
                    correctAnswers: gameState.correctAnswers,
                    incorrectAnswers: gameState.incorrectAnswers,
                    accuracy: (gameState.correctAnswers / deck.cards.length) * 100,
                    timeSpent: Math.floor((Date.now() - gameState.startTime) / 1000),
                    knowledgePointProgress: new Map()
                  }}
                  onBackToLesson={() => {
                    // Call onComplete with final result before quitting
                    onComplete({
                      totalCards: deck.cards.length,
                      correctAnswers: gameState.correctAnswers,
                      incorrectAnswers: gameState.incorrectAnswers,
                      accuracy: (gameState.correctAnswers / deck.cards.length) * 100,
                      timeSpent: Math.floor((Date.now() - gameState.startTime) / 1000),
                      knowledgePointProgress: new Map()
                    })
                    onQuit()
                  }}
                  onPlayAgain={() => window.location.reload()}
                  onReviewWithAI={() => console.log('Review with AI')}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Card deck overview */}
          <div className="lg:col-span-1 lg:h-[450px]">
            <Card className="card-default p-md h-full flex flex-col">
              <div className="flex items-center gap-sm mb-md">
                <Layers className="w-5 h-5 text-text-brand" />
                <h3 className="text-lg font-semibold text-text-primary">Deck Progress</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-sm" style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'
              }}>
                <div className="space-y-sm">
                  {deck.cards.map((card, index) => {
                    const isAnswered = gameState.answeredCards.has(card.id)
                    const isCurrent = index === gameState.currentIndex
                    const userAnswer = gameState.userAnswers.get(card.id)
                    
                    // Check if the card was answered correctly from our results map
                    const wasCorrect = cardResults.get(card.id) || false
                    
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          "relative flex items-center justify-between px-sm py-sm rounded-lg transition-all duration-fast",
                          isCurrent && "bg-bg-brand/10 border border-border-brand",
                          isAnswered && wasCorrect && "bg-bg-success/10 border border-border-success",
                          isAnswered && !wasCorrect && "bg-bg-error/10 border border-border-error",
                          !isCurrent && !isAnswered && "text-text-tertiary"
                        )}
                      >
                        <div className="flex items-center gap-sm">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2",
                            isCurrent && "bg-bg-brand text-text-inverse border-border-brand",
                            isAnswered && wasCorrect && "bg-bg-success text-text-inverse border-border-success",
                            isAnswered && !wasCorrect && "bg-bg-error text-text-inverse border-border-error",
                            !isCurrent && !isAnswered && "bg-bg-elevated border-border-subtle text-text-tertiary"
                          )}>
                            {index + 1}
                          </div>
                          <span className={cn(
                            "text-sm font-medium truncate max-w-[150px]",
                            isAnswered && wasCorrect && "text-text-success",
                            isAnswered && !wasCorrect && "text-text-error"
                          )}>
                            Card {index + 1}
                          </span>
                        </div>
                        
                        {isAnswered && (
                          <div className="w-5 h-5">
                            {wasCorrect ? (
                              <Check className="w-5 h-5 text-text-success" />
                            ) : (
                              <X className="w-5 h-5 text-text-error" />
                            )}
                          </div>
                        )}

                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-border-brand pointer-events-none"
                            animate={{
                              opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-md pt-md border-t border-border-default flex-shrink-0">
                <div className="text-sm text-text-secondary">
                  {deck.cards.length - gameState.answeredCards.size} cards remaining
                </div>
              </div>
            </Card>
          </div>
          </div>
        </div>
      </div>
      
      {showExitConfirm && (
        <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal flex items-center justify-center p-md">
          <Card className="card-default p-lg max-w-md">
            <h3 className="text-xl font-semibold text-text-primary mb-md">
              Exit Game?
            </h3>
            <p className="text-text-secondary mb-lg">
              Are you sure you want to exit? You'll lose your current progress.
            </p>
            <div className="flex gap-sm">
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
                className="flex-1 btn-destructive"
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

interface FlashcardCompletionModalProps {
  result: FlashcardGameResult
  onBackToLesson: () => void
  onPlayAgain: () => void
  onReviewWithAI: () => void
}

function FlashcardCompletionModal({
  result,
  onBackToLesson,
  onPlayAgain,
  onReviewWithAI
}: FlashcardCompletionModalProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-md">
        <Card className="card-neural p-2xl max-w-3xl w-full my-auto max-h-[90vh] overflow-y-auto">
          <div className="space-y-lg">
            {/* Header Section */}
            <div className="text-center space-y-md">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-bg-brand to-bg-brand/80 mx-auto flex items-center justify-center animate-pulse shadow-brand-md">
                <Sparkles className="w-10 h-10 text-text-inverse" />
              </div>
              <h2 className="text-3xl font-bold text-text-primary">
                Great Job!
              </h2>
              <p className="text-base text-text-secondary max-w-md mx-auto">
                You've completed all {result.totalCards} flashcards in this deck
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-md">
              <Card className="card-outlined p-md text-center">
                <div className="text-2xl font-bold text-text-brand mb-1">
                  {result.correctAnswers}
                </div>
                <div className="text-sm text-text-secondary">Correct</div>
              </Card>
              
              <Card className="card-outlined p-md text-center">
                <div className="text-2xl font-bold text-text-brand mb-1">
                  {Math.round(result.accuracy)}%
                </div>
                <div className="text-sm text-text-secondary">Accuracy</div>
              </Card>
              
              <Card className="card-outlined p-md text-center">
                <div className="text-2xl font-bold text-text-brand mb-1">
                  {formatTime(result.timeSpent)}
                </div>
                <div className="text-sm text-text-secondary">Time</div>
              </Card>
            </div>

            {/* Knowledge Impact */}
            <Card className="card-outlined p-md bg-bg-brand/5 border-border-brand">
              <div className="flex items-start gap-sm">
                <div className="w-10 h-10 rounded-lg bg-bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-text-brand" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    Knowledge Point Impact
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Estimated improvement</span>
                    <span className="text-lg font-bold text-text-brand">
                      +{Math.round((result.correctAnswers / result.totalCards) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-md">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  // Pass the result to parent when exiting
                  onBackToLesson()
                }}
              >
                Exit Game
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  // Reset game state
                  window.location.reload()
                }}
                className="btn-primary"
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