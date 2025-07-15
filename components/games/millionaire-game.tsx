'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign, Phone, Users, Zap, TrendingUp, Star } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { cn } from '@/lib/utils'

interface MillionaireGameProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

interface Question {
  id: string
  question: string
  options: {
    id: string
    text: string
    correct: boolean
  }[]
  difficulty: 'easy' | 'medium' | 'hard'
}

interface Lifeline {
  id: string
  name: string
  icon: React.ReactNode
  used: boolean
  description: string
}

const moneyLadder = [
  { level: 15, amount: '$1,000,000' },
  { level: 14, amount: '$500,000' },
  { level: 13, amount: '$250,000' },
  { level: 12, amount: '$125,000' },
  { level: 11, amount: '$64,000' },
  { level: 10, amount: '$32,000' },
  { level: 9, amount: '$16,000' },
  { level: 8, amount: '$8,000' },
  { level: 7, amount: '$4,000' },
  { level: 6, amount: '$2,000' },
  { level: 5, amount: '$1,000' },
  { level: 4, amount: '$500' },
  { level: 3, amount: '$300' },
  { level: 2, amount: '$200' },
  { level: 1, amount: '$100' }
]

const aiQuestions: Question[] = [
  {
    id: '1',
    question: 'What is AI Definition?',
    options: [
      { id: 'a', text: 'Understanding what artificial intelligence is', correct: true },
      { id: 'b', text: 'An incorrect definition that sounds plausible', correct: false },
      { id: 'c', text: 'Another wrong answer that might confuse', correct: false },
      { id: 'd', text: 'A completely unrelated concept', correct: false }
    ],
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'Which of the following is NOT a type of machine learning?',
    options: [
      { id: 'a', text: 'Supervised Learning', correct: false },
      { id: 'b', text: 'Unsupervised Learning', correct: false },
      { id: 'c', text: 'Reinforcement Learning', correct: false },
      { id: 'd', text: 'Quantum Learning', correct: true }
    ],
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'What does CNN stand for in deep learning?',
    options: [
      { id: 'a', text: 'Computer Neural Network', correct: false },
      { id: 'b', text: 'Convolutional Neural Network', correct: true },
      { id: 'c', text: 'Cognitive Neural Network', correct: false },
      { id: 'd', text: 'Computational Neural Network', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    id: '4',
    question: 'Which algorithm is commonly used for training neural networks?',
    options: [
      { id: 'a', text: 'Bubble Sort', correct: false },
      { id: 'b', text: 'Binary Search', correct: false },
      { id: 'c', text: 'Backpropagation', correct: true },
      { id: 'd', text: 'Quick Sort', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    id: '5',
    question: 'What is the main goal of Artificial General Intelligence (AGI)?',
    options: [
      { id: 'a', text: 'To solve specific tasks better than humans', correct: false },
      { id: 'b', text: 'To match or exceed human cognitive abilities across all domains', correct: true },
      { id: 'c', text: 'To replace human workers in factories', correct: false },
      { id: 'd', text: 'To create faster computers', correct: false }
    ],
    difficulty: 'hard'
  }
]

export function MillionaireGame({ lessonId, onClose, onComplete }: MillionaireGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerLocked, setIsAnswerLocked] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentWinnings, setCurrentWinnings] = useState(0)
  const [lifelines, setLifelines] = useState<Lifeline[]>([
    {
      id: 'fifty-fifty',
      name: '50:50',
      icon: <Zap className="h-4 w-4" />,
      used: false,
      description: 'Remove two incorrect answers'
    },
    {
      id: 'phone',
      name: 'Phone a Friend',
      icon: <Phone className="h-4 w-4" />,
      used: false,
      description: 'Get help from a friend'
    },
    {
      id: 'audience',
      name: 'Ask the Audience',
      icon: <Users className="h-4 w-4" />,
      used: false,
      description: 'Poll the audience'
    }
  ])

  const currentQuestion = aiQuestions[currentQuestionIndex]
  const currentLevel = currentQuestionIndex + 1
  const currentAmount = moneyLadder.find(m => m.level === currentLevel)?.amount || '$100'

  const selectAnswer = (optionId: string) => {
    if (isAnswerLocked) return
    setSelectedAnswer(optionId)
  }

  const finalAnswer = () => {
    if (!selectedAnswer) return
    
    setIsAnswerLocked(true)
    const correctOption = currentQuestion.options.find(opt => opt.correct)
    const isAnswerCorrect = selectedAnswer === correctOption?.id
    
    setIsCorrect(isAnswerCorrect)
    setShowResult(true)
    
    if (isAnswerCorrect) {
      setCurrentWinnings(currentLevel * 100) // Simple calculation
    }
    
    setTimeout(() => {
      if (isAnswerCorrect && currentQuestionIndex < aiQuestions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setIsAnswerLocked(false)
        setShowResult(false)
      } else {
        // Game over (either wrong answer or completed all questions)
        setGameOver(true)
        const finalScore = isAnswerCorrect ? Math.round((currentLevel / aiQuestions.length) * 100) : 0
        setTimeout(() => onComplete(finalScore), 2000)
      }
    }, 2000)
  }

  const walkAway = () => {
    setGameOver(true)
    const finalScore = Math.round((currentQuestionIndex / aiQuestions.length) * 100)
    onComplete(finalScore)
  }

  const useLifeline = (lifelineId: string) => {
    // Simple lifeline implementation
    setLifelines(prev => prev.map(lifeline => 
      lifeline.id === lifelineId ? { ...lifeline, used: true } : lifeline
    ))
    // TODO: Implement actual lifeline logic
  }

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent>
            <DollarSign className="h-16 w-16 text-text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">Game Over!</h2>
            <p className="text-text-secondary mb-4">
              You won: <span className="font-bold text-text-success">{currentAmount}</span>
            </p>
            <p className="text-text-secondary mb-6">
              Answered {currentQuestionIndex + (isCorrect ? 1 : 0)} out of {aiQuestions.length} questions correctly
            </p>
            <Button onClick={onClose} variant="primary" size="lg">
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
      <div className="w-full max-w-7xl max-h-[90vh] bg-bg-primary rounded-lg shadow-modal overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-text-success" />
            <h2 className="text-xl font-semibold text-text-primary">Who Wants to Be a Millionaire</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-text-secondary">Playing For</p>
              <p className="text-lg font-bold text-text-success">{currentAmount}</p>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Main Game Area */}
          <div className="flex-1 p-6 flex flex-col">
            {/* Game Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Who Wants to Be a Millionaire?
              </h1>
              <p className="text-text-secondary">Test your knowledge and win big</p>
            </div>

            {/* Question Info */}
            <div className="flex items-center justify-between mb-6">
              <Badge variant="primary" className="text-sm">
                Question {currentQuestionIndex + 1} of {aiQuestions.length}
              </Badge>
              
              {/* Lifelines */}
              <div className="flex items-center gap-2">
                {lifelines.map((lifeline) => (
                  <Button
                    key={lifeline.id}
                    variant={lifeline.used ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => useLifeline(lifeline.id)}
                    disabled={lifeline.used || isAnswerLocked}
                    className="px-3"
                  >
                    {lifeline.icon}
                    <span className="ml-1 text-xs">{lifeline.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Question */}
            <Card className="mb-6 p-8 text-center">
              <CardContent>
                <h2 className="text-2xl font-semibold text-text-primary">
                  {currentQuestion.question}
                </h2>
              </CardContent>
            </Card>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option) => (
                <Card
                  key={option.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    selectedAnswer === option.id && !showResult && "ring-2 ring-text-brand border-text-brand",
                    showResult && option.correct && "ring-2 ring-text-success border-text-success bg-bg-success-light",
                    showResult && selectedAnswer === option.id && !option.correct && "ring-2 ring-text-error border-text-error bg-bg-error-light",
                    !isAnswerLocked && "hover:border-border-default"
                  )}
                  onClick={() => selectAnswer(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-text-brand text-white flex items-center justify-center font-semibold">
                        {option.id.toUpperCase()}
                      </div>
                      <p className="text-text-primary font-medium">{option.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="lg"
                onClick={walkAway}
                disabled={isAnswerLocked}
              >
                Walk Away with {currentQuestionIndex > 0 ? moneyLadder.find(m => m.level === currentQuestionIndex)?.amount : '$0'}
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                onClick={finalAnswer}
                disabled={!selectedAnswer || isAnswerLocked}
              >
                <Zap className="h-4 w-4 mr-2" />
                Final Answer
              </Button>
            </div>
          </div>

          {/* Money Ladder Sidebar */}
          <div className="w-64 border-l border-border-subtle bg-bg-secondary p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-text-success" />
              <h3 className="font-medium text-text-primary">Money Ladder</h3>
            </div>

            <div className="space-y-1">
              {moneyLadder.map((item) => (
                <div
                  key={item.level}
                  className={cn(
                    "flex items-center justify-between p-2 rounded text-sm",
                    item.level === currentLevel && "bg-text-brand text-white",
                    item.level < currentLevel && "bg-bg-success-light text-text-success",
                    item.level > currentLevel && "text-text-secondary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.level}</span>
                    {item.level === 15 && <Star className="h-3 w-3" />}
                  </div>
                  <span className="font-semibold">{item.amount}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border-subtle">
              <div className="flex items-center gap-1 text-xs text-text-secondary">
                <span className="w-3 h-3 rounded-full bg-text-tertiary"></span>
                <span>Guaranteed amounts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}