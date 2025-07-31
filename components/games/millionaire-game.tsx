'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign, Phone, Users, Zap, TrendingUp, Star, Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import { cn } from '@/lib/utils'
import { gameContentAPI } from '@/app/lms/new_course_overview/api/course-api'
import { useGameResults } from '@/lib/hooks/use-game-results'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionTimes, setQuestionTimes] = useState<{[key: string]: number}>({})
  const [startTime, setStartTime] = useState<number>(Date.now())
  const { submitResult } = useGameResults()

  // Load questions from API
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true)
        setError(null)
        const gameContent = await gameContentAPI.getGameContent(lessonId, 'millionaire')
        
        if (gameContent && gameContent.content && gameContent.content.questions) {
          setQuestions(gameContent.content.questions)
          setStartTime(Date.now())
        } else {
          // No questions available
          setQuestions([])
          setError('No questions available for this lesson')
        }
      } catch (err) {
        console.error('Error loading millionaire questions:', err)
        setError('Failed to load game questions')
        // No fallback - show error
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [lessonId])

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

  const currentQuestion = questions[currentQuestionIndex]
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
      if (isAnswerCorrect && currentQuestionIndex < questions.length - 1) {
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
        const finalScore = isAnswerCorrect ? Math.round((currentLevel / questions.length) * 100) : 0
        const timeSpent = Math.floor((Date.now() - startTime) / 1000)
        
        // Submit result to backend
        submitResult({
          gameTypeId: 1, // Millionaire game
          lessonId,
          score: finalScore,
          timeSpent,
          completed: isAnswerCorrect && currentQuestionIndex === questions.length - 1
        })
        
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
    
    const finalScore = Math.round((currentQuestionIndex / questions.length) * 100)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    // Submit result to backend
    submitResult({
      gameTypeId: 1, // Millionaire game
      lessonId,
      score: finalScore,
      timeSpent,
      completed: false // walked away
    })
    
    // Auto-close after showing results
    setTimeout(() => {
      restoreScrolling()
      onComplete(finalScore)
    }, 3000)
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

  const handleCloseAttempt = () => {
    onClose()
  }

  const useLifeline = (lifelineId: string) => {
    // Mark lifeline as used
    setLifelines(prev => prev.map(lifeline => 
      lifeline.id === lifelineId ? { ...lifeline, used: true } : lifeline
    ))
    
    const currentQuestion = questions[currentQuestionIndex]
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
            <p className="text-text-secondary">
              {walkedAway 
                ? `You answered ${questionsAnswered} out of ${questions.length} questions correctly before walking away safely.`
                : `You answered ${questionsAnswered} out of ${questions.length} questions correctly.`
              }
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-text-brand" />
            <p className="text-text-secondary">Loading game questions...</p>
          </div>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error && questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <X className="h-8 w-8 text-text-error" />
            <h3 className="text-lg font-semibold text-text-primary">Error Loading Game</h3>
            <p className="text-text-secondary">{error}</p>
            <Button variant="primary" onClick={onClose}>Close</Button>
          </div>
        </Card>
      </div>
    )
  }

  // Check if we have questions
  if (!currentQuestion) {
    return null
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
              <Badge variant="secondary" className="text-sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              
              {/* Lifelines */}
              <div className="flex items-center gap-2">
                {lifelines.map((lifeline) => (
                  <Button
                    key={lifeline.id}
                    variant="secondary"
                    size="sm"
                    onClick={() => useLifeline(lifeline.id)}
                    disabled={lifeline.used || isAnswerLocked}
                    className={cn(
                      "px-3 border",
                      !lifeline.used && "border-border-info hover:bg-bg-info-light hover:border-text-info",
                      lifeline.used && "opacity-50"
                    )}
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
                      selectedAnswer === option.id && !showResult && "ring-2 ring-text-info border-text-info bg-bg-info-light",
                      showResult && option.correct && "ring-2 ring-text-success border-text-success bg-bg-success-light answer-flash-success",
                      showResult && selectedAnswer === option.id && !option.correct && "ring-2 ring-text-error border-text-error bg-bg-error-light answer-flash-error",
                      !isAnswerLocked && !isHidden && "hover:border-border-default hover:bg-bg-emphasis",
                      isHidden && "opacity-30 cursor-not-allowed bg-bg-disabled"
                    )}
                    onClick={() => !isHidden && selectAnswer(option.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-emphasis border-2 border-border-default text-text-primary flex items-center justify-center font-semibold">
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
              <Card className="mb-6 bg-bg-brand-light border-border-brand"> {/* #F3E6FF, #7B00FF */}
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-text-brand" />
                    Audience Poll Results
                  </h3>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const percentage = audienceResults[option.id] || 0
                      return (
                        <div key={option.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-text-brand text-white flex items-center justify-center font-semibold text-sm">
                            {option.id.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-text-primary">{option.text}</span>
                              <span className="text-sm font-semibold text-text-brand">{percentage}%</span>
                            </div>
                            <Progress 
                              value={percentage} 
                              className="h-2"
                              indicatorClassName="bg-text-brand"
                            />
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
                    "flex items-center justify-between p-2 rounded text-sm transition-all",
                    item.level < currentLevel && "bg-bg-success-light text-text-success",
                    item.level > currentLevel && "text-text-secondary",
                    (item.level === 5 || item.level === 10) && item.level !== currentLevel && "ring-2 ring-text-success bg-bg-success-light",
                    item.level === currentLevel && "ring-4 ring-brand border-2 border-brand bg-brand-light/10 text-text-primary font-bold shadow-lg relative"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.level}</span>
                    {item.level === 15 && <Star className="h-3 w-3" />}
                    {(item.level === 5 || item.level === 10) && <Shield className={cn("h-3 w-3", item.level === currentLevel ? "text-brand" : "text-text-success")} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.amount}</span>
                    {(item.level === 5 || item.level === 10) && (
                      <span className="text-xs text-text-success font-medium">SAFE</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border-subtle">
              <div className="space-y-1 text-xs text-text-secondary">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-text-success" />
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