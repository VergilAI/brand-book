'use client'

import { useState, useEffect } from 'react'
import { Clock, CheckCircle, Circle, AlertCircle, ArrowLeft, ArrowRight, Flag, Eye, EyeOff, BookOpen, X } from 'lucide-react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  question: string
  options?: string[]
  correctAnswer: string | number
  knowledgePoint: string
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
}

// Mock test data
const mockTest = {
  title: 'AI Fundamentals Final Assessment',
  description: 'Comprehensive evaluation of your AI knowledge across all chapters',
  timeLimit: 90, // minutes
  totalQuestions: 5,
  passingScore: 70,
  predictedScore: 75,
  courseCompletionThreshold: 65,
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice' as const,
      question: 'What is the primary goal of artificial intelligence?',
      options: [
        'To replace human workers completely',
        'To create systems that can perform tasks that typically require human intelligence',
        'To make computers faster',
        'To store large amounts of data'
      ],
      correctAnswer: 1,
      knowledgePoint: 'AI Definition',
      difficulty: 'easy' as const,
      explanation: 'AI aims to create systems that can perform tasks requiring human-like intelligence, such as learning, reasoning, and problem-solving.'
    },
    {
      id: 'q2',
      type: 'multiple-choice' as const,
      question: 'Which of the following is NOT a type of machine learning?',
      options: [
        'Supervised Learning',
        'Unsupervised Learning',
        'Reinforcement Learning',
        'Deterministic Learning'
      ],
      correctAnswer: 3,
      knowledgePoint: 'Types of AI',
      difficulty: 'medium' as const,
      explanation: 'Deterministic Learning is not a recognized type of machine learning. The three main types are supervised, unsupervised, and reinforcement learning.'
    },
    {
      id: 'q3',
      type: 'true-false' as const,
      question: 'Neural networks are inspired by the structure of the human brain.',
      options: ['True', 'False'],
      correctAnswer: 0,
      knowledgePoint: 'Neural Networks',
      difficulty: 'easy' as const,
      explanation: 'Neural networks are indeed inspired by biological neural networks in the brain, using interconnected nodes (neurons) to process information.'
    },
    {
      id: 'q4',
      type: 'multiple-choice' as const,
      question: 'What is a key ethical concern in AI development?',
      options: [
        'Processing speed',
        'Energy consumption',
        'Algorithmic bias and fairness',
        'Memory usage'
      ],
      correctAnswer: 2,
      knowledgePoint: 'AI Ethics',
      difficulty: 'medium' as const,
      explanation: 'Algorithmic bias and fairness are major ethical concerns, as AI systems can perpetuate or amplify existing societal biases if not carefully designed and monitored.'
    },
    {
      id: 'q5',
      type: 'short-answer' as const,
      question: 'Explain the difference between narrow AI and general AI in one sentence.',
      correctAnswer: 'Narrow AI is designed for specific tasks while general AI can perform any intellectual task a human can do.',
      knowledgePoint: 'Types of AI',
      difficulty: 'hard' as const,
      explanation: 'Narrow AI (or weak AI) is specialized for specific tasks like image recognition or chess, while general AI (or strong AI) would have human-level cognitive abilities across all domains.'
    }
  ]
}

export function TestInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: any }>({})
  const [timeRemaining, setTimeRemaining] = useState(mockTest.timeLimit * 60) // in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [showExplanations, setShowExplanations] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSubmitted(true)
          setShowResults(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isSubmitted])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (answer: any) => {
    setAnswers({
      ...answers,
      [mockTest.questions[currentQuestion].id]: answer
    })
  }

  const toggleFlag = (questionId: string) => {
    const newFlagged = new Set(flaggedQuestions)
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId)
    } else {
      newFlagged.add(questionId)
    }
    setFlaggedQuestions(newFlagged)
  }

  const calculateScore = () => {
    let correct = 0
    mockTest.questions.forEach((question) => {
      const userAnswer = answers[question.id]
      if (question.type === 'short-answer') {
        // Simple keyword matching for demo - in real app would use more sophisticated scoring
        const userAnswerLower = (userAnswer || '').toLowerCase()
        const correctAnswerLower = question.correctAnswer.toString().toLowerCase()
        if (userAnswerLower.includes('narrow') && userAnswerLower.includes('general')) {
          correct++
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correct++
        }
      }
    })
    return Math.round((correct / mockTest.questions.length) * 100)
  }

  const getQuestionStatus = (questionIndex: number) => {
    const question = mockTest.questions[questionIndex]
    const hasAnswer = answers[question.id] !== undefined
    const isFlagged = flaggedQuestions.has(question.id)
    
    if (isFlagged && hasAnswer) return 'flagged-answered'
    if (isFlagged) return 'flagged'
    if (hasAnswer) return 'answered'
    return 'unanswered'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-emerald-500'
      case 'flagged': return 'bg-yellow-500'
      case 'flagged-answered': return 'bg-orange-500'
      default: return 'bg-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered': return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case 'flagged': return <Flag className="w-4 h-4 text-yellow-600" />
      case 'flagged-answered': return <Flag className="w-4 h-4 text-orange-600" />
      default: return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  if (showResults) {
    const score = calculateScore()
    const passed = score >= mockTest.passingScore

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 text-center">
          <div className="mb-6">
            {passed ? (
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            ) : (
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold text-vergil-off-black mb-2">
              Test {passed ? 'Completed' : 'Failed'}
            </h1>
            <p className="text-vergil-off-black/70">
              {passed 
                ? 'Congratulations! You have successfully passed the AI Fundamentals assessment.'
                : 'You did not meet the passing threshold this time. Review the material and try again.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card variant="outlined" className="p-4">
              <div className="text-2xl font-bold text-vergil-purple">{score}%</div>
              <div className="text-sm text-vergil-off-black/60">Your Score</div>
            </Card>
            <Card variant="outlined" className="p-4">
              <div className="text-2xl font-bold text-vergil-off-black">{mockTest.passingScore}%</div>
              <div className="text-sm text-vergil-off-black/60">Passing Score</div>
            </Card>
            <Card variant="outlined" className="p-4">
              <div className="text-2xl font-bold text-vergil-off-black">
                {Object.keys(answers).length}/{mockTest.totalQuestions}
              </div>
              <div className="text-sm text-vergil-off-black/60">Questions Answered</div>
            </Card>
          </div>

          {/* Course Completion Status */}
          <div className="mb-4">
            {score >= mockTest.courseCompletionThreshold && (
              <Badge className="bg-blue-100 text-blue-800 text-base px-4 py-2">
                ✓ COURSE COMPLETED - You have achieved the required score
              </Badge>
            )}
          </div>

          {/* Performance vs Prediction */}
          {mockTest.predictedScore && (
            <Card variant="outlined" className="p-4 mb-8 bg-vergil-purple/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-vergil-off-black/60">Performance vs Predicted Score</div>
                  <div className="text-sm text-vergil-off-black/80 mt-1">
                    Predicted: {mockTest.predictedScore}% | Actual: {score}%
                  </div>
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  score >= mockTest.predictedScore ? "text-green-600" : "text-orange-600"
                )}>
                  {score >= mockTest.predictedScore ? "+" : ""}{score - mockTest.predictedScore}%
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setShowExplanations(!showExplanations)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {showExplanations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showExplanations ? 'Hide' : 'Show'} Explanations
            </Button>
            <Button
              onClick={() => window.location.href = '/lms/new_course_overview'}
              className="bg-vergil-purple hover:bg-vergil-purple-lighter"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </div>

          {showExplanations && (
            <div className="mt-8 space-y-4 text-left">
              <h3 className="text-lg font-semibold text-vergil-off-black">Question Review</h3>
              {mockTest.questions.map((question, index) => {
                const userAnswer = answers[question.id]
                const isCorrect = question.type === 'short-answer' 
                  ? (userAnswer || '').toLowerCase().includes('narrow') && (userAnswer || '').toLowerCase().includes('general')
                  : userAnswer === question.correctAnswer

                return (
                  <Card key={question.id} variant="outlined" className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-vergil-off-black mb-2">
                          Question {index + 1}: {question.question}
                        </h4>
                        {question.type !== 'short-answer' && (
                          <div className="mb-2">
                            <span className="text-sm text-vergil-off-black/60">Your answer: </span>
                            <span className={isCorrect ? 'text-emerald-600' : 'text-red-600'}>
                              {userAnswer !== undefined ? question.options?.[userAnswer] : 'Not answered'}
                            </span>
                          </div>
                        )}
                        <p className="text-sm text-vergil-off-black/70">{question.explanation}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    )
  }

  // Don't try to render the question view if we're showing results
  if (showResults || isSubmitted) {
    return null // The results view is already rendered above
  }

  const currentQ = mockTest.questions[currentQuestion]
  const isLowTime = timeRemaining < 600 // 10 minutes

  // Additional safety check
  if (!currentQ) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Test Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-vergil-off-black">{mockTest.title}</h1>
            <p className="text-sm text-vergil-off-black/70">{mockTest.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Card variant="outlined" className="p-3">
              <div className="flex items-center gap-2">
                <Clock className={cn("w-4 h-4", isLowTime ? "text-red-500" : "text-vergil-purple")} />
                <span className={cn("font-mono text-sm", isLowTime ? "text-red-600" : "text-vergil-off-black")}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </Card>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExitConfirm(true)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-vergil-off-black/70">
            Question {currentQuestion + 1} of {mockTest.totalQuestions}
          </span>
          <span className="text-vergil-off-black/70">
            {Object.keys(answers).length} answered • {flaggedQuestions.size} flagged
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-vergil-purple h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / mockTest.totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Question Content */}
        <div className="flex-1">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {currentQ.knowledgePoint}
                  </Badge>
                  <Badge 
                    className={cn("text-xs",
                      currentQ.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    )}
                  >
                    {currentQ.difficulty}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold text-vergil-off-black mb-4">
                  {currentQ.question}
                </h2>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFlag(currentQ.id)}
                className={flaggedQuestions.has(currentQ.id) ? 'text-yellow-600' : 'text-gray-400'}
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.type === 'short-answer' ? (
                <textarea
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Enter your answer here..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vergil-purple/20 focus:border-vergil-purple resize-none"
                  rows={4}
                />
              ) : (
                currentQ.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={cn(
                      "w-full p-4 text-left border rounded-lg transition-all hover:border-vergil-purple hover:bg-vergil-purple/5",
                      answers[currentQ.id] === index 
                        ? "border-vergil-purple bg-vergil-purple/10 text-vergil-purple"
                        : "border-gray-200 text-vergil-off-black"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        answers[currentQ.id] === index 
                          ? "border-vergil-purple bg-vergil-purple"
                          : "border-gray-300"
                      )}>
                        {answers[currentQ.id] === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {currentQuestion === mockTest.totalQuestions - 1 ? (
                  <Button
                    onClick={() => {
                      setIsSubmitted(true)
                      setShowResults(true)
                    }}
                    className="bg-vergil-purple hover:bg-vergil-purple-lighter"
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(Math.min(mockTest.totalQuestions - 1, currentQuestion + 1))}
                    className="bg-vergil-purple hover:bg-vergil-purple-lighter flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Question Navigator */}
        <div className="w-64">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-vergil-off-black mb-3">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {mockTest.questions.map((_, index) => {
                const status = getQuestionStatus(index)
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={cn(
                      "w-8 h-8 rounded text-xs font-medium transition-all",
                      currentQuestion === index 
                        ? "bg-vergil-purple text-white ring-2 ring-vergil-purple ring-offset-2"
                        : `${getStatusColor(status)} text-white hover:opacity-80`
                    )}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                <span className="text-vergil-off-black/70">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-vergil-off-black/70">Flagged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-vergil-off-black/70">Flagged & Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span className="text-vergil-off-black/70">Not Answered</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-md bg-white">
            <h3 className="text-xl font-semibold text-vergil-off-black mb-4">
              Exit Test?
            </h3>
            <p className="text-vergil-off-black/60 mb-6">
              Are you sure you want to exit? Your progress will be lost and the test will be marked as incomplete.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1"
              >
                Continue Test
              </Button>
              <Button
                onClick={() => {
                  setShowExitConfirm(false)
                  window.location.href = '/lms/new_course_overview'
                }}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Exit Test
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}