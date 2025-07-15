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

export function FlashcardGame({ lessonId, onClose, onComplete }: FlashcardGameProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [incorrectAnswers, setIncorrectAnswers] = useState(0)
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set())
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const currentCard = aiFlashcards[currentCardIndex]
  const totalCards = aiFlashcards.length
  const progressPercentage = Math.round((completedCards.size / totalCards) * 100)

  const checkAnswer = () => {
    if (!userAnswer.trim()) return

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
  }

  const nextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1)
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

  const skipCard = () => {
    setIncorrectAnswers(prev => prev + 1)
    setCompletedCards(prev => new Set([...prev, currentCard.id]))
    nextCard()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnswerChecked) {
      checkAnswer()
    }
  }

  const remainingCards = totalCards - completedCards.size

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
      <div className="w-full max-w-6xl max-h-[90vh] bg-bg-primary rounded-lg shadow-modal overflow-hidden flex flex-col">
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
                  Card {currentCardIndex + 1} of {totalCards}
                </span>
                <span className="text-sm font-medium text-text-brand">
                  {progressPercentage}% Complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Flashcard */}
            <Card className="flex-1 flex flex-col justify-center items-center p-8 mb-6">
              <CardContent className="text-center">
                <div className="mb-8">
                  <Layers className="h-12 w-12 text-text-brand mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-text-primary">
                    {currentCard.question}
                  </h3>
                </div>
              </CardContent>
            </Card>

            {/* Answer Input */}
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Type your answer..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isAnswerChecked}
                className={cn(
                  "text-center text-lg py-3",
                  isAnswerChecked && isCorrect && "border-text-success bg-bg-success-light",
                  isAnswerChecked && !isCorrect && "border-text-error bg-bg-error-light"
                )}
              />

              {isAnswerChecked && (
                <div className="text-center">
                  {isCorrect ? (
                    <p className="text-text-success font-medium">Correct!</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-text-error font-medium">Incorrect</p>
                      <p className="text-text-secondary text-sm">
                        Correct answer: <span className="font-medium">{currentCard.answer}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                {!isAnswerChecked ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                    >
                      Check Answer
                    </Button>
                    <Button variant="secondary" size="lg" onClick={skipCard}>
                      Skip
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" size="lg" onClick={nextCard}>
                    {currentCardIndex < totalCards - 1 ? 'Next Card' : 'Complete'}
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
          <div className="w-64 border-l border-border-subtle bg-bg-secondary p-4">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-4 w-4 text-text-secondary" />
              <h3 className="font-medium text-text-primary">Deck Progress</h3>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {aiFlashcards.map((card, index) => (
                <div
                  key={card.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg text-sm",
                    index === currentCardIndex && "bg-text-brand text-white",
                    index < currentCardIndex && completedCards.has(card.id) && "bg-bg-success-light text-text-success",
                    index > currentCardIndex && "bg-bg-primary text-text-secondary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">Card {index + 1}</span>
                  </div>
                  
                  {completedCards.has(card.id) && (
                    <X className="h-4 w-4" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border-subtle">
              <p className="text-xs text-text-secondary">
                {remainingCards} cards remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}