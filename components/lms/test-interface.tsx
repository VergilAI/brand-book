'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  Circle,
  BookOpen,
  X,
  Trophy,
  RotateCcw,
  Flag
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface TestInterfaceProps {
  courseId: string
  testId: string
}

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'multiple-select'
  question: string
  explanation?: string
  options: {
    id: string
    text: string
    correct?: boolean
  }[]
  userAnswer?: string | string[]
  points: number
}

interface Test {
  id: string
  title: string
  description: string
  courseTitle: string
  duration: number // in minutes
  totalQuestions: number
  passingScore: number // percentage
  questions: Question[]
  allowReview: boolean
  showResults: boolean
  attempts: number
  maxAttempts: number
  predictedScore?: number // percentage
  courseCompletionThreshold: number // percentage needed to complete course
}

export function TestInterface({ courseId, testId }: TestInterfaceProps) {
  const [test] = useState<Test>({
    id: testId,
    title: 'Information Security Fundamentals Assessment',
    description: 'Test your understanding of basic cybersecurity concepts and the CIA triad',
    courseTitle: 'Cybersecurity Awareness Training',
    duration: 15,
    totalQuestions: 10,
    passingScore: 80,
    allowReview: true,
    showResults: true,
    attempts: 0,
    maxAttempts: 3,
    predictedScore: 75,
    courseCompletionThreshold: 70,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What does the "C" in the CIA triad stand for?',
        options: [
          { id: 'a', text: 'Compliance', correct: false },
          { id: 'b', text: 'Confidentiality', correct: true },
          { id: 'c', text: 'Control', correct: false },
          { id: 'd', text: 'Classification', correct: false }
        ],
        points: 10
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Information security is only about protecting data stored on computers.',
        options: [
          { id: 'true', text: 'True', correct: false },
          { id: 'false', text: 'False', correct: true }
        ],
        points: 10,
        explanation: 'Information security protects all forms of information including physical documents, verbal communications, and digital data.'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Which of the following is NOT one of the three main types of security controls?',
        options: [
          { id: 'a', text: 'Management Controls', correct: false },
          { id: 'b', text: 'Operational Controls', correct: false },
          { id: 'c', text: 'Technical Controls', correct: false },
          { id: 'd', text: 'Financial Controls', correct: true }
        ],
        points: 10,
        explanation: 'The three main types of security controls are Management, Operational, and Technical controls. Financial controls are not part of this security framework.'
      },
      {
        id: 'q4',
        type: 'multiple-select',
        question: 'Which of the following are examples of PHI (Protected Health Information)? (Select all that apply)',
        options: [
          { id: 'a', text: 'Patient medical records', correct: true },
          { id: 'b', text: 'Social Security Numbers', correct: true },
          { id: 'c', text: 'Public hospital phone numbers', correct: false },
          { id: 'd', text: 'Insurance claim information', correct: true }
        ],
        points: 10
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'What is the relationship between threats, vulnerabilities, and risk?',
        options: [
          { id: 'a', text: 'Risk = Threat + Vulnerability', correct: false },
          { id: 'b', text: 'Risk = Threat × Vulnerability', correct: true },
          { id: 'c', text: 'Risk = Threat - Vulnerability', correct: false },
          { id: 'd', text: 'Risk = Threat ÷ Vulnerability', correct: false }
        ],
        points: 10
      },
      {
        id: 'q6',
        type: 'true-false',
        question: 'HIPAA only applies to healthcare providers and not to business associates.',
        options: [
          { id: 'true', text: 'True', correct: false },
          { id: 'false', text: 'False', correct: true }
        ],
        points: 10,
        explanation: 'HIPAA applies to both covered entities (healthcare providers) and their business associates who handle PHI.'
      },
      {
        id: 'q7',
        type: 'multiple-choice',
        question: 'Which principle of the CIA triad ensures that data has not been altered or corrupted?',
        options: [
          { id: 'a', text: 'Confidentiality', correct: false },
          { id: 'b', text: 'Integrity', correct: true },
          { id: 'c', text: 'Availability', correct: false },
          { id: 'd', text: 'Authentication', correct: false }
        ],
        points: 10
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'What is the primary purpose of a security awareness training program?',
        options: [
          { id: 'a', text: 'To punish employees for security mistakes', correct: false },
          { id: 'b', text: 'To meet compliance requirements only', correct: false },
          { id: 'c', text: 'To educate employees about security threats and best practices', correct: true },
          { id: 'd', text: 'To replace technical security controls', correct: false }
        ],
        points: 10
      },
      {
        id: 'q9',
        type: 'true-false',
        question: 'Physical security measures are not important in information security.',
        options: [
          { id: 'true', text: 'True', correct: false },
          { id: 'false', text: 'False', correct: true }
        ],
        points: 10,
        explanation: 'Physical security is crucial as it prevents unauthorized physical access to systems, devices, and facilities that contain sensitive information.'
      },
      {
        id: 'q10',
        type: 'multiple-choice',
        question: 'Which federal act established requirements for cybersecurity in government agencies?',
        options: [
          { id: 'a', text: 'HIPAA', correct: false },
          { id: 'b', text: 'FISMA', correct: true },
          { id: 'c', text: 'SOX', correct: false },
          { id: 'd', text: 'GDPR', correct: false }
        ],
        points: 10,
        explanation: 'FISMA (Federal Information Security Management Act) established cybersecurity requirements for federal agencies and their contractors.'
      }
    ]
  })

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [timeRemaining, setTimeRemaining] = useState(test.duration * 60) // in seconds
  const [testState, setTestState] = useState<'in-progress' | 'review' | 'submitted'>('in-progress')
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Timer effect
  useEffect(() => {
    if (testState === 'in-progress' && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [testState, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId: string, answerId: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleReview = () => {
    setTestState('review')
  }

  const handleSubmit = () => {
    // Calculate score
    let totalScore = 0
    test.questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (question.type === 'multiple-select') {
        const correctIds = question.options.filter(opt => opt.correct).map(opt => opt.id)
        const userIds = (userAnswer as string[]) || []
        if (correctIds.length === userIds.length && correctIds.every(id => userIds.includes(id))) {
          totalScore += question.points
        }
      } else {
        const correctOption = question.options.find(opt => opt.correct)
        if (correctOption && userAnswer === correctOption.id) {
          totalScore += question.points
        }
      }
    })

    setScore(totalScore)
    setTestState('submitted')
    setShowResults(true)
  }

  const getQuestionStatus = (index: number) => {
    const question = test.questions[index]
    const answer = answers[question.id]
    
    if (testState === 'submitted') {
      const isCorrect = checkAnswer(question, answer)
      return isCorrect ? 'correct' : 'incorrect'
    }
    
    return answer ? 'answered' : 'unanswered'
  }

  const checkAnswer = (question: Question, userAnswer: string | string[] | undefined) => {
    if (!userAnswer) return false
    
    if (question.type === 'multiple-select') {
      const correctIds = question.options.filter(opt => opt.correct).map(opt => opt.id)
      const userIds = (userAnswer as string[]) || []
      return correctIds.length === userIds.length && correctIds.every(id => userIds.includes(id))
    } else {
      const correctOption = question.options.find(opt => opt.correct)
      return correctOption && userAnswer === correctOption.id
    }
  }

  const currentQ = test.questions[currentQuestion]
  const answeredCount = Object.keys(answers).length
  const progressPercentage = (answeredCount / test.questions.length) * 100
  const scorePercentage = (score / (test.questions.length * 10)) * 100
  const passed = scorePercentage >= test.passingScore

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="shadow-xl">
            <CardHeader className="text-center border-b">
              <div className="mb-4">
                {passed ? (
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Trophy className="h-10 w-10 text-green-600" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <X className="h-10 w-10 text-red-600" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                {test.title} - Results
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold mb-2">
                  {scorePercentage.toFixed(0)}%
                </div>
                <p className="text-muted-foreground">
                  You scored {score} out of {test.questions.length * 10} points
                </p>
                <div className="mt-4 space-y-2">
                  <Badge 
                    className={cn(
                      passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}
                  >
                    {passed ? 'PASSED' : 'NOT PASSED'} (Passing: {test.passingScore}%)
                  </Badge>
                  {scorePercentage >= test.courseCompletionThreshold && (
                    <div>
                      <Badge className="bg-blue-100 text-blue-800">
                        COURSE COMPLETED ✓
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <span className="font-medium">Questions Answered</span>
                  <span>{answeredCount} / {test.questions.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <span className="font-medium">Correct Answers</span>
                  <span className="text-green-600 font-medium">
                    {test.questions.filter(q => checkAnswer(q, answers[q.id])).length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <span className="font-medium">Time Taken</span>
                  <span>{Math.floor((test.duration * 60 - timeRemaining) / 60)} minutes</span>
                </div>
                {test.predictedScore && (
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="font-medium">Performance vs Prediction</span>
                    <span className={cn(
                      "font-medium",
                      scorePercentage >= test.predictedScore ? "text-green-600" : "text-orange-600"
                    )}>
                      {scorePercentage >= test.predictedScore ? "+" : ""}{(scorePercentage - test.predictedScore).toFixed(0)}%
                      {scorePercentage >= test.predictedScore ? " above" : " below"} predicted
                    </span>
                  </div>
                )}
              </div>

              {test.attempts < test.maxAttempts - 1 && !passed && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have {test.maxAttempts - test.attempts - 1} attempt{test.maxAttempts - test.attempts - 1 > 1 ? 's' : ''} remaining.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.location.href = `/lms/course/${courseId}`}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
                {test.allowReview && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowResults(false)
                      setCurrentQuestion(0)
                    }}
                  >
                    Review Answers
                  </Button>
                )}
                {!passed && test.attempts < test.maxAttempts - 1 && (
                  <Button 
                    className="flex-1 bg-cosmic-purple hover:bg-cosmic-purple/90"
                    onClick={() => window.location.reload()}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry Test
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{test.title}</h1>
              <p className="text-sm text-muted-foreground">{test.courseTitle}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={cn(
                  "font-medium",
                  timeRemaining < 300 && "text-red-600"
                )}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
                    window.location.href = `/lms/course/${courseId}`
                  }
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">
              {answeredCount} of {test.questions.length} answered
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          {/* Question indicators */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {test.questions.map((_, index) => {
              const status = getQuestionStatus(index)
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors",
                    index === currentQuestion && "ring-2 ring-cosmic-purple ring-offset-2",
                    status === 'answered' && "bg-cosmic-purple/10 border-cosmic-purple text-cosmic-purple",
                    status === 'unanswered' && "bg-white border-gray-300",
                    status === 'correct' && "bg-green-100 border-green-500 text-green-700",
                    status === 'incorrect' && "bg-red-100 border-red-500 text-red-700"
                  )}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Question card */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {test.questions.length}
                </Badge>
                <Badge className="bg-cosmic-purple/10 text-cosmic-purple">
                  {currentQ.points} points
                </Badge>
              </div>
              {currentQ.type === 'multiple-select' && (
                <Badge variant="outline" className="bg-blue-50">
                  Select all that apply
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <h2 className="text-xl font-medium mb-6">{currentQ.question}</h2>
            
            {/* Answer options */}
            <div className="space-y-3">
              {currentQ.type === 'multiple-select' ? (
                currentQ.options.map((option) => {
                  const isSelected = (answers[currentQ.id] as string[] || []).includes(option.id)
                  const showCorrect = testState === 'submitted'
                  
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        !showCorrect && isSelected && "bg-cosmic-purple/5 border-cosmic-purple",
                        !showCorrect && !isSelected && "bg-white border-gray-200 hover:border-gray-300",
                        showCorrect && option.correct && "bg-green-50 border-green-500",
                        showCorrect && !option.correct && isSelected && "bg-red-50 border-red-500",
                        showCorrect && !option.correct && !isSelected && "bg-gray-50 border-gray-200"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const currentAnswers = (answers[currentQ.id] as string[]) || []
                          if (e.target.checked) {
                            handleAnswer(currentQ.id, [...currentAnswers, option.id])
                          } else {
                            handleAnswer(currentQ.id, currentAnswers.filter(id => id !== option.id))
                          }
                        }}
                        disabled={testState === 'submitted'}
                        className="w-4 h-4"
                      />
                      <span className="flex-1">{option.text}</span>
                      {showCorrect && option.correct && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </label>
                  )
                })
              ) : (
                currentQ.options.map((option) => {
                  const isSelected = answers[currentQ.id] === option.id
                  const showCorrect = testState === 'submitted'
                  
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        !showCorrect && isSelected && "bg-cosmic-purple/5 border-cosmic-purple",
                        !showCorrect && !isSelected && "bg-white border-gray-200 hover:border-gray-300",
                        showCorrect && option.correct && "bg-green-50 border-green-500",
                        showCorrect && !option.correct && isSelected && "bg-red-50 border-red-500",
                        showCorrect && !option.correct && !isSelected && "bg-gray-50 border-gray-200"
                      )}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        checked={isSelected}
                        onChange={() => handleAnswer(currentQ.id, option.id)}
                        disabled={testState === 'submitted'}
                        className="w-4 h-4"
                      />
                      <span className="flex-1">{option.text}</span>
                      {showCorrect && option.correct && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </label>
                  )
                })
              )}
            </div>

            {/* Explanation (if in review mode) */}
            {testState === 'submitted' && currentQ.explanation && (
              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Explanation:</strong> {currentQ.explanation}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <div className="border-t p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-3">
                {currentQuestion === test.questions.length - 1 && testState === 'in-progress' && (
                  <>
                    {test.allowReview && (
                      <Button
                        variant="outline"
                        onClick={handleReview}
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Review Before Submit
                      </Button>
                    )}
                    <Button
                      onClick={handleSubmit}
                      className="bg-cosmic-purple hover:bg-cosmic-purple/90"
                      disabled={answeredCount < test.questions.length}
                    >
                      Submit Test
                    </Button>
                  </>
                )}
              </div>

              {currentQuestion < test.questions.length - 1 && (
                <Button
                  onClick={handleNext}
                  className="bg-cosmic-purple hover:bg-cosmic-purple/90"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}