'use client'

import { useState, useEffect } from 'react'
import { X, Layers, Lightbulb } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Input } from '@/components/atomic/input'
import { Card, CardContent } from '@/components/card'
import { Progress } from '@/components/progress'
import { cn } from '@/lib/utils'

interface FlashcardGameProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

interface Flashcard {
  id: string
  question: string
  answer: string
  hint?: string
}

interface FlashcardResult {
  id: string
  isCorrect: boolean
  skipped: boolean
}

const aiFlashcards: Flashcard[] = [
  {
    id: '1',
    question: 'Define: AI Definition',
    answer: 'artificial intelligence',
    hint: 'The simulation of human intelligence in machines'
  },
  {
    id: '2',
    question: 'Define: Types of AI',
    answer: 'narrow ai, general ai, superintelligence',
    hint: 'Three main categories based on capability levels'
  },
  {
    id: '3',
    question: 'Define: Machine Learning',
    answer: 'machine learning',
    hint: 'A subset of AI that learns from data without explicit programming'
  },
  {
    id: '4',
    question: 'Define: Neural Networks',
    answer: 'neural networks',
    hint: 'Computing systems inspired by biological neural networks'
  },
  {
    id: '5',
    question: 'Define: Deep Learning',
    answer: 'deep learning',
    hint: 'ML technique using multiple layers of neural networks'
  },
  {
    id: '6',
    question: 'Define: Computer Vision',
    answer: 'computer vision',
    hint: 'AI field that trains computers to interpret visual information'
  },
  {
    id: '7',
    question: 'Define: Natural Language Processing',
    answer: 'natural language processing',
    hint: 'AI that helps computers understand human language'
  },
  {
    id: '8',
    question: 'Define: Algorithm',
    answer: 'algorithm',
    hint: 'A set of rules or instructions for solving problems'
  },
  {
    id: '9',
    question: 'Define: Training Data',
    answer: 'training data',
    hint: 'Information used to teach machine learning models'
  },
  {
    id: '10',
    question: 'Define: Artificial General Intelligence',
    answer: 'artificial general intelligence',
    hint: 'AI that matches or exceeds human cognitive abilities'
  },
  {
    id: '11',
    question: 'Define: Supervised Learning',
    answer: 'supervised learning',
    hint: 'ML approach using labeled training data'
  },
  {
    id: '12',
    question: 'Define: Unsupervised Learning',
    answer: 'unsupervised learning',
    hint: 'ML approach that finds patterns in unlabeled data'
  },
  {
    id: '13',
    question: 'Define: Reinforcement Learning',
    answer: 'reinforcement learning',
    hint: 'ML approach where agents learn through rewards and penalties'
  },
  {
    id: '14',
    question: 'Define: Bias in AI',
    answer: 'bias in ai',
    hint: 'Unfair preferences or prejudices in AI systems'
  },
  {
    id: '15',
    question: 'Define: Turing Test',
    answer: 'turing test',
    hint: 'Test of AI ability to exhibit intelligent behavior equivalent to humans'
  }
]

// Add custom styles for 3D effects
const customStyles = {
  perspective: {
    perspective: '1000px'
  },
  preserve3d: {
    transformStyle: 'preserve-3d' as const
  },
  rotateY: {
    transform: 'rotateY(6deg)'
  }
}

export function FlashcardGame({ lessonId, onClose, onComplete }: FlashcardGameProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [incorrectAnswers, setIncorrectAnswers] = useState(0)
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set())
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [cardResults, setCardResults] = useState<FlashcardResult[]>([])
  const [skippedCards, setSkippedCards] = useState<string[]>([])
  const [gameCards, setGameCards] = useState<Flashcard[]>(aiFlashcards)

  // Handle body scroll lock
  useEffect(() => {
    // Store original body styles
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width
    
    // Get current scroll position
    const scrollY = window.scrollY
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    
    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = originalWidth
      
      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }, [])

  const currentCard = gameCards[currentCardIndex]
  const totalCards = aiFlashcards.length
  const progressPercentage = Math.round((completedCards.size / totalCards) * 100)

  const checkAnswer = () => {
    if (!userAnswer.trim()) return

    setIsFlipping(true)
    
    setTimeout(() => {
      const normalizedAnswer = userAnswer.toLowerCase().trim()
      const normalizedCorrectAnswer = currentCard.answer.toLowerCase().trim()
      
      const isAnswerCorrect = normalizedAnswer === normalizedCorrectAnswer ||
                             normalizedCorrectAnswer.includes(normalizedAnswer) ||
                             normalizedAnswer.includes(normalizedCorrectAnswer)

      setIsCorrect(isAnswerCorrect)
      setIsAnswerChecked(true)
      
      if (isAnswerCorrect) {
        setCorrectAnswers(prev => prev + 1)
      } else {
        setIncorrectAnswers(prev => prev + 1)
      }
      
      setCompletedCards(prev => new Set([...prev, currentCard.id]))
      
      const result: FlashcardResult = {
        id: currentCard.id,
        isCorrect: isAnswerCorrect,
        skipped: false
      }
      setCardResults(prev => [...prev, result])
      
      setTimeout(() => {
        setIsFlipping(false)
      }, 200)
    }, 400)
  }

  const nextCard = () => {
    if (currentCardIndex < gameCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setUserAnswer('')
      setShowHint(false)
      setIsAnswerChecked(false)
      setIsCorrect(false)
    } else {
      // Check if there are skipped cards to repeat
      if (skippedCards.length > 0) {
        const skippedFlashcards = aiFlashcards.filter(card => skippedCards.includes(card.id))
        setGameCards(skippedFlashcards)
        setCurrentCardIndex(0)
        setSkippedCards([])
        setUserAnswer('')
        setShowHint(false)
        setIsAnswerChecked(false)
        setIsCorrect(false)
      } else {
        // Game completed
        const finalScore = Math.round((correctAnswers / totalCards) * 100)
        onComplete(finalScore)
      }
    }
  }

  const skipCard = () => {
    setSkippedCards(prev => [...prev, currentCard.id])
    setCompletedCards(prev => new Set([...prev, currentCard.id]))
    
    const result: FlashcardResult = {
      id: currentCard.id,
      isCorrect: false,
      skipped: true
    }
    setCardResults(prev => [...prev, result])
    
    nextCard()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnswerChecked) {
      checkAnswer()
    }
  }

  const handleCloseAttempt = () => {
    onClose()
  }

  const remainingCards = totalCards - completedCards.size

  return (
    <div className="fixed inset-0 bg-bg-primary z-modal flex flex-col"> {/* #FFFFFF - Full screen */}
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-text-brand" />
          <h2 className="text-xl font-semibold text-text-primary">Flashcard Practice</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-text-secondary">Correct</span>
              <span className="text-text-success font-semibold">{correctAnswers}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-text-secondary">Incorrect</span>
              <span className="text-text-error font-semibold">{incorrectAnswers}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2 h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Main Game Area */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Progress Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-brand">
                Card {currentCardIndex + 1} of {gameCards.length}
              </span>
              <span className="text-sm font-medium text-text-brand">
                {progressPercentage}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Flashcard */}
          <div className="flex-1 flex items-center justify-center mb-6" style={customStyles.perspective}>
            <Card 
              className={cn(
                "relative w-full max-w-2xl transition-all duration-700",
                isFlipping && "scale-105",
                isAnswerChecked && isCorrect && "shadow-brandGlow",
                isAnswerChecked && !isCorrect && "shadow-lg"
              )}
              style={{
                ...customStyles.preserve3d,
                ...(isFlipping ? customStyles.rotateY : {})
              }}>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className={cn(
                    "transition-all duration-500",
                    isAnswerChecked && "transform -translate-y-4"
                  )}>
                    <Layers className={cn(
                      "h-12 w-12 mx-auto mb-4 transition-all duration-500",
                      isAnswerChecked && isCorrect && "text-text-success",
                      isAnswerChecked && !isCorrect && "text-text-error",
                      !isAnswerChecked && "text-text-brand"
                    )} />
                    <h3 className={cn(
                      "text-2xl font-semibold text-text-primary transition-all duration-500",
                      isAnswerChecked && "text-xl opacity-70"
                    )}>
                      {currentCard.question}
                    </h3>
                  </div>
                  
                  {/* Answer Reveal */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-700",
                    isAnswerChecked ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
                  )}>
                    <div className={cn(
                      "p-6 rounded-xl transition-all duration-500 transform",
                      isAnswerChecked && "translate-y-0 scale-100",
                      !isAnswerChecked && "translate-y-8 scale-95",
                      isCorrect ? "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200" : "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
                    )}>
                      <div className={cn(
                        "flex items-center justify-center gap-3 mb-3",
                        "animate-in fade-in slide-in-from-bottom-4 duration-500"
                      )}>
                        {isCorrect ? (
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in-50 duration-300">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-xl font-bold text-green-700">Excellent!</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-in zoom-in-50 duration-300">
                              <X className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-red-700">Not quite!</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                        <p className="text-sm text-gray-600">The correct answer is:</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {currentCard.answer}
                        </p>
                        {!isCorrect && userAnswer.trim() && (
                          <p className="text-sm text-gray-500 mt-2">
                            You answered: <span className="font-medium text-gray-700">{userAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Type your answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isAnswerChecked || isFlipping}
              className={cn(
                "text-center text-lg py-3 transition-all duration-300",
                isAnswerChecked && isCorrect && "border-border-success bg-bg-success-light",
                isAnswerChecked && !isCorrect && "border-border-error bg-bg-error-light"
              )}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              {!isAnswerChecked ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim() || isFlipping}
                  >
                    {isFlipping ? 'Checking...' : 'Check Answer'}
                  </Button>
                  <Button variant="secondary" size="lg" onClick={skipCard} disabled={isFlipping}>
                    Skip
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="lg" onClick={nextCard}>
                  {currentCardIndex < gameCards.length - 1 ? 'Next Card' : (skippedCards.length > 0 ? 'Review Skipped' : 'Complete')}
                </Button>
              )}
            </div>

            {/* Hint */}
            {!showHint && !isAnswerChecked && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="text-text-secondary hover:text-text-primary"
                  disabled={isFlipping}
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Need a hint?
                </Button>
              </div>
            )}

            {showHint && (
              <div className="text-center p-3 bg-bg-warning-light rounded-lg">
                <p className="text-text-secondary text-sm">
                  💡 {currentCard.hint}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Deck Progress */}
        <div className="w-80 border-l border-border-subtle bg-bg-secondary p-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-4 w-4 text-text-secondary" />
            <h3 className="font-medium text-text-primary">Deck Progress</h3>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {aiFlashcards.map((card, index) => {
              const cardResult = cardResults.find(result => result.id === card.id)
              const isCurrentCard = gameCards[currentCardIndex]?.id === card.id
              
              return (
                <div
                  key={card.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg text-sm transition-all duration-200",
                    isCurrentCard && "bg-text-brand text-white shadow-md",
                    !isCurrentCard && cardResult?.isCorrect && !cardResult.skipped && "bg-bg-success-light text-text-success border border-border-success",
                    !isCurrentCard && cardResult && !cardResult.isCorrect && !cardResult.skipped && "bg-bg-error-light text-text-error border border-border-error",
                    !isCurrentCard && cardResult?.skipped && "bg-bg-warning-light text-text-warning border border-border-warning",
                    !isCurrentCard && !cardResult && "bg-bg-primary text-text-secondary hover:bg-bg-emphasis"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium">Card {index + 1}</span>
                      {cardResult && (
                        <div className="text-xs mt-1 opacity-75">
                          {cardResult.skipped ? 'Skipped' : cardResult.isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {cardResult?.isCorrect && !cardResult.skipped && (
                      <span className="text-xs">✓</span>
                    )}
                    {cardResult && !cardResult.isCorrect && !cardResult.skipped && (
                      <span className="text-xs">✗</span>
                    )}
                    {cardResult?.skipped && (
                      <span className="text-xs">⏭</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle space-y-2">
            <div className="text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className="font-medium">{remainingCards} cards</span>
              </div>
              {skippedCards.length > 0 && (
                <div className="flex justify-between mt-1">
                  <span>Skipped:</span>
                  <span className="font-medium text-text-warning">{skippedCards.length} cards</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}