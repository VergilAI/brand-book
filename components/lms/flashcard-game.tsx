'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
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
import { cn } from '@/lib/utils'

interface FlashcardGameProps {
  deck: FlashcardDeck
  onComplete: (result: FlashcardGameResult) => void
  onQuit: () => void
  className?: string
}

export function FlashcardGame({ 
  deck, 
  onComplete, 
  onQuit,
  className 
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

  const completeGame = () => {
    const endTime = Date.now()
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
    <div className={cn("fixed inset-0 bg-gray-100 flex flex-col", className)}>
      {/* Fixed Header */}
      <div className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Flashcard Practice</h2>
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
            <p className="text-sm text-gray-600">{deck.title}</p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-vergil-off-black/60">Correct</p>
                <p className="text-2xl font-bold text-vergil-purple">
                  {gameState.correctAnswers}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-vergil-off-black/60">Incorrect</p>
                <p className="text-2xl font-bold text-red-600">
                  {gameState.incorrectAnswers}
                </p>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            {/* Progress card */}
            <Card className="p-4 bg-white border-vergil-off-black/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-vergil-purple/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-vergil-purple">
                      {gameState.currentIndex + 1}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-vergil-off-black">
                    Card {gameState.currentIndex + 1} of {deck.cards.length}
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
                          className="absolute inset-0 bg-white rounded-xl shadow-md border border-vergil-off-black/5"
                          style={{
                            transform: `translateY(${offset}px) rotate(${rotation}deg)`,
                            opacity: opacity,
                            zIndex: -i - 1
                          }}
                        />
                      )
                    })}
                    
                    {/* Main Card */}
                    <Card className="relative h-full border-vergil-off-black/10 overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        {/* Front of Card */}
                        <div
                          className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-white rounded-xl"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <div className="w-12 h-12 rounded-full bg-vergil-purple/10 flex items-center justify-center mb-4">
                            <Brain className="w-6 h-6 text-vergil-purple" />
                          </div>
                          
                          <h3 className="text-xl font-semibold text-vergil-off-black text-center px-4">
                            {currentCard.front}
                          </h3>
                        </div>

                        {/* Back of Card */}
                        <div
                          className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-white rounded-xl"
                          style={{ 
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          {isCorrect !== null && (
                            <div className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                              isCorrect 
                                ? "bg-vergil-purple/10"
                                : "bg-red-600/10"
                            )}>
                              {isCorrect ? (
                                <Check className="w-6 h-6 text-vergil-purple" />
                              ) : (
                                <X className="w-6 h-6 text-red-600" />
                              )}
                            </div>
                          )}

                          <h4 className="text-base font-medium text-vergil-off-black/70 mb-2">
                            {isCorrect ? "Correct!" : "The answer is:"}
                          </h4>
                          
                          <p className="text-lg text-vergil-off-black text-center font-medium mb-3 px-4">
                            {currentCard.back}
                          </p>

                          {userAnswer && !isCorrect && (
                            <div className="p-3 bg-vergil-off-black/10 rounded-lg max-w-md">
                              <p className="text-sm text-vergil-off-black/60">
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
                    <Card className="p-4 bg-white border-vergil-off-black/10">
                      <div className="space-y-4">
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
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={checkAnswer}
                            disabled={!userAnswer.trim() || isAnswered}
                            className="flex-1 bg-vergil-purple hover:bg-vergil-purple-lighter text-white"
                          >
                            Check Answer
                          </Button>
                          <Button
                            variant="outline"
                            onClick={skipCard}
                            disabled={isAnswered}
                            className="border-vergil-off-black/20"
                          >
                            Skip
                          </Button>
                        </div>

                        {currentCard.hint && !showHint && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHint(true)}
                            className="w-full text-vergil-off-black/60"
                          >
                            <Lightbulb className="w-4 h-4 mr-1" />
                            Need a hint?
                          </Button>
                        )}

                        {showHint && currentCard.hint && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-vergil-purple/10 rounded-lg"
                          >
                            <p className="text-sm text-vergil-off-black/60">
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
                        className="bg-vergil-purple hover:bg-vergil-purple-lighter"
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
                  onBackToLesson={onQuit}
                  onPlayAgain={() => window.location.reload()}
                  onReviewWithAI={() => console.log('Review with AI')}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Card deck overview */}
          <div className="lg:col-span-1 lg:h-[450px]">
            <Card className="p-4 h-full flex flex-col border-vergil-off-black/10">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-vergil-purple" />
                <h3 className="text-lg font-semibold text-vergil-off-black">Deck Progress</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2" style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'
              }}>
                <div className="space-y-2">
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
                          "relative flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
                          isCurrent && "bg-vergil-purple/10 border border-vergil-purple",
                          isAnswered && wasCorrect && "bg-green-50 border border-green-200",
                          isAnswered && !wasCorrect && "bg-red-50 border border-red-200",
                          !isCurrent && !isAnswered && "text-vergil-off-black/40"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2",
                            isCurrent && "bg-vergil-purple text-white border-vergil-purple",
                            isAnswered && wasCorrect && "bg-green-500 text-white border-green-500",
                            isAnswered && !wasCorrect && "bg-red-500 text-white border-red-500",
                            !isCurrent && !isAnswered && "bg-white border-vergil-off-black/20 text-vergil-off-black/60"
                          )}>
                            {index + 1}
                          </div>
                          <span className={cn(
                            "text-sm font-medium truncate max-w-[150px]",
                            isAnswered && wasCorrect && "text-green-700",
                            isAnswered && !wasCorrect && "text-red-700"
                          )}>
                            Card {index + 1}
                          </span>
                        </div>
                        
                        {isAnswered && (
                          <div className="w-5 h-5">
                            {wasCorrect ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <X className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        )}

                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-vergil-purple pointer-events-none"
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

              <div className="mt-4 pt-4 border-t border-vergil-off-black/10 flex-shrink-0">
                <div className="text-sm text-vergil-off-black/60">
                  {deck.cards.length - gameState.answeredCards.size} cards remaining
                </div>
              </div>
            </Card>
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <Card className="p-8 max-w-3xl w-full border-vergil-off-black/10 bg-gradient-to-br from-vergil-off-white to-white my-auto max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vergil-purple to-vergil-purple-lighter mx-auto flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-vergil-off-black">
                Great Job!
              </h2>
              <p className="text-base text-vergil-off-black/70 max-w-md mx-auto">
                You've completed all {result.totalCards} flashcards in this deck
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
                <div className="text-2xl font-bold text-vergil-purple mb-1">
                  {result.correctAnswers}
                </div>
                <div className="text-sm text-vergil-off-black/60">Correct</div>
              </Card>
              
              <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
                <div className="text-2xl font-bold text-vergil-purple mb-1">
                  {Math.round(result.accuracy)}%
                </div>
                <div className="text-sm text-vergil-off-black/60">Accuracy</div>
              </Card>
              
              <Card variant="outlined" className="p-4 text-center border-vergil-off-black/10">
                <div className="text-2xl font-bold text-vergil-purple mb-1">
                  {formatTime(result.timeSpent)}
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
                      +{Math.round((result.correctAnswers / result.totalCards) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                size="lg"
                variant="outline"
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