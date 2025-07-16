'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign, Phone, Users, Zap, TrendingUp, Star, Shield } from 'lucide-react'
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
  },
  {
    id: '6',
    question: 'What is overfitting in machine learning?',
    options: [
      { id: 'a', text: 'When a model performs well on training data but poorly on new data', correct: true },
      { id: 'b', text: 'When a model is too simple to capture patterns', correct: false },
      { id: 'c', text: 'When training takes too long', correct: false },
      { id: 'd', text: 'When the dataset is too large', correct: false }
    ],
    difficulty: 'easy'
  },
  {
    id: '7',
    question: 'Which of the following is a popular deep learning framework?',
    options: [
      { id: 'a', text: 'MySQL', correct: false },
      { id: 'b', text: 'TensorFlow', correct: true },
      { id: 'c', text: 'Apache', correct: false },
      { id: 'd', text: 'WordPress', correct: false }
    ],
    difficulty: 'easy'
  },
  {
    id: '8',
    question: 'What is the purpose of an activation function in neural networks?',
    options: [
      { id: 'a', text: 'To introduce non-linearity', correct: true },
      { id: 'b', text: 'To speed up training', correct: false },
      { id: 'c', text: 'To reduce memory usage', correct: false },
      { id: 'd', text: 'To prevent overfitting', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    id: '9',
    question: 'What does GPU stand for in AI computing?',
    options: [
      { id: 'a', text: 'General Purpose Unit', correct: false },
      { id: 'b', text: 'Graphics Processing Unit', correct: true },
      { id: 'c', text: 'Graphical Programming Unit', correct: false },
      { id: 'd', text: 'Global Processing Unit', correct: false }
    ],
    difficulty: 'easy'
  },
  {
    id: '10',
    question: 'Which technique is used to prevent overfitting?',
    options: [
      { id: 'a', text: 'Dropout', correct: true },
      { id: 'b', text: 'Speedup', correct: false },
      { id: 'c', text: 'Overflow', correct: false },
      { id: 'd', text: 'Underflow', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    id: '11',
    question: 'What is the Turing Test designed to measure?',
    options: [
      { id: 'a', text: 'Computer processing speed', correct: false },
      { id: 'b', text: 'Machine intelligence indistinguishable from human intelligence', correct: true },
      { id: 'c', text: 'Network bandwidth', correct: false },
      { id: 'd', text: 'Memory capacity', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    id: '12',
    question: 'What is gradient descent used for?',
    options: [
      { id: 'a', text: 'Data visualization', correct: false },
      { id: 'b', text: 'Optimizing model parameters', correct: true },
      { id: 'c', text: 'Data preprocessing', correct: false },
      { id: 'd', text: 'Feature selection', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    id: '13',
    question: 'What does NLP stand for in AI?',
    options: [
      { id: 'a', text: 'Neural Learning Process', correct: false },
      { id: 'b', text: 'Natural Language Processing', correct: true },
      { id: 'c', text: 'Network Layer Protocol', correct: false },
      { id: 'd', text: 'Numerical Logic Programming', correct: false }
    ],
    difficulty: 'hard'
  },
  {
    id: '14',
    question: 'Which company developed the GPT (Generative Pre-trained Transformer) models?',
    options: [
      { id: 'a', text: 'Google', correct: false },
      { id: 'b', text: 'OpenAI', correct: true },
      { id: 'c', text: 'Microsoft', correct: false },
      { id: 'd', text: 'Meta', correct: false }
    ],
    difficulty: 'hard'
  },
  {
    id: '15',
    question: 'What is the singularity in AI context?',
    options: [
      { id: 'a', text: 'A point where AI surpasses human intelligence', correct: true },
      { id: 'b', text: 'The first AI computer', correct: false },
      { id: 'c', text: 'A type of neural network', correct: false },
      { id: 'd', text: 'A programming language', correct: false }
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
  const [walkedAway, setWalkedAway] = useState(false)
  const [currentWinnings, setCurrentWinnings] = useState(0)
  const [hiddenAnswers, setHiddenAnswers] = useState<Set<string>>(new Set())
  const [audienceResults, setAudienceResults] = useState<{[key: string]: number} | null>(null)
  const [friendAdvice, setFriendAdvice] = useState<string | null>(null)

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
  
  // Calculate walk away amount based on guaranteed amounts
  const getWalkAwayAmount = () => {
    if (currentQuestionIndex === 0) return '$0'
    
    let amount = '$100' // Base amount for question 1
    if (currentQuestionIndex >= 5) {
      amount = '$1,000' // Guaranteed amount for reaching question 5
    }
    if (currentQuestionIndex >= 10) {
      amount = '$32,000' // Guaranteed amount for reaching question 10
    }
    
    // If current question winnings are higher than guaranteed, use current
    const currentLevelAmount = moneyLadder.find(m => m.level === currentQuestionIndex)?.amount
    if (currentLevelAmount) {
      const currentValue = parseInt(currentLevelAmount.replace(/[$,]/g, ''))
      const guaranteedValue = parseInt(amount.replace(/[$,]/g, ''))
      if (currentValue > guaranteedValue) {
        amount = currentLevelAmount
      }
    }
    
    return amount
  }

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
        setHiddenAnswers(new Set())
        setAudienceResults(null)
        setFriendAdvice(null)
      } else {
        // Game over (either wrong answer or completed all questions)
        setGameOver(true)
        const finalScore = isAnswerCorrect ? Math.round((currentLevel / aiQuestions.length) * 100) : 0
        setTimeout(() => {
          restoreScrolling()
          onComplete(finalScore)
        }, 2000)
      }
    }, 2000)
  }

  const walkAway = () => {
    // Calculate winnings based on walk away amount
    const walkAwayAmount = getWalkAwayAmount()
    const winnings = parseInt(walkAwayAmount.replace(/[$,]/g, ''))
    
    setCurrentWinnings(winnings)
    setWalkedAway(true)
    setGameOver(true)
  }
  
  const restoreScrolling = () => {
    // Ensure scroll is restored
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleWalkAwayComplete = () => {
    restoreScrolling()
    const finalScore = Math.round((currentQuestionIndex / aiQuestions.length) * 100)
    onComplete(finalScore)
  }

  const handleGameClose = () => {
    restoreScrolling()
    onClose()
  }

  const useLifeline = (lifelineId: string) => {
    // Mark lifeline as used
    setLifelines(prev => prev.map(lifeline => 
      lifeline.id === lifelineId ? { ...lifeline, used: true } : lifeline
    ))
    
    const currentQuestion = aiQuestions[currentQuestionIndex]
    const correctAnswer = currentQuestion.options.find(opt => opt.correct)
    const incorrectAnswers = currentQuestion.options.filter(opt => !opt.correct)
    
    switch (lifelineId) {
      case 'fifty-fifty':
        // Remove 2 incorrect answers randomly
        const answersToHide = incorrectAnswers
          .sort(() => Math.random() - 0.5)
          .slice(0, 2)
          .map(opt => opt.id)
        setHiddenAnswers(new Set(answersToHide))
        break
        
      case 'audience':
        // Generate audience poll with correct answer getting higher percentage
        const results: {[key: string]: number} = {}
        let remaining = 100
        
        // Give correct answer 40-70% of votes
        const correctPercentage = Math.floor(Math.random() * 30) + 40
        results[correctAnswer!.id] = correctPercentage
        remaining -= correctPercentage
        
        // Distribute remaining votes among incorrect answers
        const visibleIncorrect = incorrectAnswers.filter(opt => !hiddenAnswers.has(opt.id))
        visibleIncorrect.forEach((opt, index) => {
          if (index === visibleIncorrect.length - 1) {
            results[opt.id] = remaining
          } else {
            const percentage = Math.floor(Math.random() * (remaining / 2))
            results[opt.id] = percentage
            remaining -= percentage
          }
        })
        
        setAudienceResults(results)
        break
        
      case 'phone':
        // Simulate friend advice
        const friendNames = ['Alex', 'Sarah', 'Mike', 'Emma', 'David']
        const friendName = friendNames[Math.floor(Math.random() * friendNames.length)]
        
        // Friend gives correct answer 80% of the time
        const giveCorrectAnswer = Math.random() < 0.8
        const suggestedAnswer = giveCorrectAnswer 
          ? correctAnswer 
          : incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)]
        
        const confidence = giveCorrectAnswer ? 'pretty confident' : 'not entirely sure'
        const advice = `Hi! I'm ${confidence} the answer is ${suggestedAnswer?.text}. That's option ${suggestedAnswer?.id.toUpperCase()}. Good luck!`
        
        setFriendAdvice(advice)
        
        // Auto-hide after 8 seconds
        setTimeout(() => setFriendAdvice(null), 8000)
        break
    }
  }

  if (gameOver) {
    const winningsAmount = walkedAway ? getWalkAwayAmount() : currentAmount
    const questionsAnswered = currentQuestionIndex + (isCorrect ? 1 : 0)
    
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent>
            <DollarSign className="h-16 w-16 text-text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {walkedAway ? 'Congratulations!' : 'Game Over!'}
            </h2>
            <p className="text-text-secondary mb-4">
              {walkedAway ? 'You successfully walked away with:' : 'You won:'}
            </p>
            <p className="text-3xl font-bold text-text-success mb-4">
              {winningsAmount}
            </p>
            <p className="text-text-secondary mb-6">
              {walkedAway 
                ? `You answered ${questionsAnswered} out of ${aiQuestions.length} questions correctly before walking away safely.`
                : `You answered ${questionsAnswered} out of ${aiQuestions.length} questions correctly.`
              }
            </p>
            <div className="flex gap-3 justify-center">
              {walkedAway && (
                <Button onClick={handleWalkAwayComplete} variant="primary" size="lg">
                  Continue Learning
                </Button>
              )}
              {!walkedAway && (
                <Button onClick={handleGameClose} variant="primary" size="lg">
                  Continue Learning
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal">
      <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col">
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
            
            <Button variant="ghost" size="sm" onClick={handleGameClose} className="p-2 h-8 w-8">
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
              {currentQuestion.options.map((option) => {
                const isHidden = hiddenAnswers.has(option.id)
                return (
                  <Card
                    key={option.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      selectedAnswer === option.id && !showResult && "ring-2 ring-text-brand border-text-brand",
                      showResult && option.correct && "ring-2 ring-text-success border-text-success bg-bg-success-light",
                      showResult && selectedAnswer === option.id && !option.correct && "ring-2 ring-text-error border-text-error bg-bg-error-light",
                      !isAnswerLocked && !isHidden && "hover:border-border-default",
                      isHidden && "opacity-30 cursor-not-allowed bg-bg-disabled"
                    )}
                    onClick={() => !isHidden && selectAnswer(option.id)}
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
                )
              })}
            </div>

            {/* Audience Poll Results */}
            {audienceResults && (
              <Card className="mb-6 bg-bg-info-light border-border-info"> {/* #EFF6FF, #93C5FD */}
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-text-info" />
                    Audience Poll Results
                  </h3>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const percentage = audienceResults[option.id] || 0
                      return (
                        <div key={option.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-text-info text-white flex items-center justify-center font-semibold text-sm">
                            {option.id.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-text-primary">{option.text}</span>
                              <span className="text-sm font-semibold text-text-info">{percentage}%</span>
                            </div>
                            <div className="w-full bg-bg-secondary rounded-full h-2">
                              <div 
                                className="bg-text-info h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Friend Advice */}
            {friendAdvice && (
              <Card className="mb-6 bg-bg-success-light border-border-success"> {/* #F0FDF4, #86EFAC */}
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-text-success" />
                    Friend's Advice
                  </h3>
                  <div className="bg-bg-primary p-3 rounded-lg border border-border-success">
                    <p className="text-text-secondary italic">"{friendAdvice}"</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="lg"
                onClick={walkAway}
                disabled={isAnswerLocked || getWalkAwayAmount() === '$0'}
              >
                {getWalkAwayAmount() === '$0' ? 'Cannot Walk Away' : `Walk Away with ${getWalkAwayAmount()}`}
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
                    item.level > currentLevel && "text-text-secondary",
                    (item.level === 5 || item.level === 10) && "ring-2 ring-text-warning bg-bg-warning-light"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.level}</span>
                    {item.level === 15 && <Star className="h-3 w-3" />}
                    {(item.level === 5 || item.level === 10) && <Shield className="h-3 w-3 text-text-warning" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.amount}</span>
                    {(item.level === 5 || item.level === 10) && (
                      <span className="text-xs text-text-warning font-medium">SAFE</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border-subtle">
              <div className="space-y-1 text-xs text-text-secondary">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-text-warning" />
                  <span>Guaranteed safe amounts</span>
                </div>
                <div className="text-xs text-text-tertiary">
                  Questions 5 & 10 lock in minimum winnings
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}