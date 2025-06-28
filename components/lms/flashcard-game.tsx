'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  const [isFlipped, setIsFlipped] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const currentCard = deck.cards[gameState.currentIndex]
  const progress = ((gameState.currentIndex) / deck.cards.length) * 100
  const remainingCards = deck.cards.length - gameState.currentIndex

  useEffect(() => {
    if (!isFlipped && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFlipped, gameState.currentIndex])

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
  }

  const skipCard = () => {
    setIsAnswered(true)
    setIsCorrect(false)
    setIsFlipped(true)
    
    setGameState(prev => ({
      ...prev,
      incorrectAnswers: prev.incorrectAnswers + 1,
      answeredCards: new Set([...prev.answeredCards, currentCard.id])
    }))
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
    setTimeout(() => onComplete(result), 500)
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-mist-gray/20 to-pure-light p-8", className)}>
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onQuit}
            className="text-stone-gray hover:text-deep-space"
          >
            <X className="w-5 h-5 mr-2" />
            Exit Game
          </Button>
          
          <div className="flex items-center gap-6">
            <Badge variant="secondary" className="px-3 py-1">
              <Check className="w-4 h-4 mr-1 text-phosphor-cyan" />
              {gameState.correctAnswers} Correct
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <X className="w-4 h-4 mr-1 text-red-500" />
              {gameState.incorrectAnswers} Incorrect
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-gray">
              Card {gameState.currentIndex + 1} of {deck.cards.length}
            </span>
            <span className="font-medium text-cosmic-purple">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Card Area */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!showCompletion ? (
            <div className="space-y-8">
              {/* Card Stack */}
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
                className="relative h-[450px]"
              >
                {/* Dynamic Card Stack - shows remaining cards */}
                {Array.from({ length: Math.min(deck.cards.length - gameState.currentIndex - 1, 5) }).map((_, i) => {
                  const offset = (i + 1) * 4
                  const rotation = (i % 2 === 0 ? 1 : -1) * (i + 1) * 0.5
                  const opacity = 1 - (i * 0.15)
                  
                  return (
                    <div
                      key={`stack-${i}`}
                      className="absolute inset-0 bg-white rounded-2xl shadow-lg"
                      style={{
                        transform: `translateY(${offset}px) rotate(${rotation}deg)`,
                        opacity: opacity,
                        zIndex: -i - 1
                      }}
                    />
                  )
                })}
                
                {/* Main Card */}
                <div className="relative h-full">
                  <motion.div
                    className="h-full bg-white rounded-2xl shadow-2xl"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Front of Card */}
                    <div
                      className="absolute inset-0 p-12 flex flex-col items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-purple to-electric-violet flex items-center justify-center mb-8">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-display font-semibold text-deep-space text-center">
                        {currentCard.front}
                      </h3>
                    </div>

                    {/* Back of Card */}
                    <div
                      className="absolute inset-0 p-12 flex flex-col items-center justify-center bg-white rounded-2xl"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      {isCorrect !== null && (
                        <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                          isCorrect 
                            ? "bg-phosphor-cyan/20 text-phosphor-cyan"
                            : "bg-red-500/20 text-red-500"
                        )}>
                          {isCorrect ? (
                            <Check className="w-8 h-8" />
                          ) : (
                            <X className="w-8 h-8" />
                          )}
                        </div>
                      )}

                      <h4 className="text-lg font-medium text-stone-gray mb-4">
                        {isCorrect ? "Correct!" : "The answer is:"}
                      </h4>
                      
                      <p className="text-xl text-deep-space text-center font-medium mb-6">
                        {currentCard.back}
                      </p>

                      {userAnswer && !isCorrect && (
                        <div className="mb-6 p-4 bg-mist-gray/20 rounded-lg max-w-md">
                          <p className="text-sm text-stone-gray">
                            Your answer: "{userAnswer}"
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Interactive Controls - Separate from Card */}
              {!isFlipped ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your answer..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    className="text-center text-lg"
                    disabled={isAnswered}
                  />
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim() || isAnswered}
                      className="flex-1 bg-cosmic-purple hover:bg-electric-violet"
                    >
                      Check Answer
                    </Button>
                    <Button
                      variant="outline"
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
                      className="w-full text-stone-gray"
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      Need a hint?
                    </Button>
                  )}

                  {showHint && currentCard.hint && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-luminous-indigo/10 rounded-lg"
                    >
                      <p className="text-sm text-stone-gray">
                        <Lightbulb className="w-4 h-4 inline mr-1" />
                        {currentCard.hint}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={nextCard}
                    size="lg"
                    className="bg-cosmic-purple hover:bg-electric-violet"
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
                </motion.div>
              )}
            </div>
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

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md mx-auto"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cosmic-purple to-electric-violet flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-10 h-10 text-white" />
      </div>

      <h2 className="text-3xl font-display font-bold text-deep-space mb-2">
        Great Job!
      </h2>
      
      <p className="text-stone-gray mb-8">
        You've completed all flashcards in this deck
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-mist-gray/10 rounded-lg p-4">
          <p className="text-2xl font-bold text-phosphor-cyan">{result.correctAnswers}</p>
          <p className="text-sm text-stone-gray">Correct</p>
        </div>
        <div className="bg-mist-gray/10 rounded-lg p-4">
          <p className="text-2xl font-bold text-cosmic-purple">{Math.round(result.accuracy)}%</p>
          <p className="text-sm text-stone-gray">Accuracy</p>
        </div>
      </div>

      <p className="text-sm text-stone-gray mb-8">
        Time spent: {formatTime(result.timeSpent)}
      </p>

      <div className="space-y-3">
        <Button
          onClick={onBackToLesson}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lesson
        </Button>
        
        <Button
          onClick={onPlayAgain}
          className="w-full bg-electric-violet hover:bg-cosmic-purple"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
        
        <Button
          onClick={onReviewWithAI}
          className="w-full bg-cosmic-purple hover:bg-electric-violet"
        >
          <Brain className="w-4 h-4 mr-2" />
          Review with AI
        </Button>
      </div>
    </motion.div>
  )
}