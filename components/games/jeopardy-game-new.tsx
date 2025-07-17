'use client'

import { useState, useEffect } from 'react'
import { X, Trophy, Star, CheckCircle, Grid, DollarSign, Zap, Brain, ChevronRight } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Input } from '@/components/atomic/input'
import { Progress } from '@/components/progress'
import { cn } from '@/lib/utils'

interface JeopardyGameProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

interface JeopardyQuestion {
  id: string
  category: string
  value: number
  clue: string
  response: string
  completed: boolean
  dailyDouble?: boolean
  wasCorrect?: boolean
}

const jeopardyCategories = [
  { id: 'ai-basics', name: 'AI Basics', icon: Brain },
  { id: 'machine-learning', name: 'Machine Learning', icon: Zap },
  { id: 'deep-learning', name: 'Deep Learning', icon: Grid },
  { id: 'ai-applications', name: 'AI Applications', icon: Star },
  { id: 'ai-ethics', name: 'AI Ethics', icon: Trophy }
]

const jeopardyQuestions: JeopardyQuestion[] = [
  // AI Basics
  { id: '1', category: 'AI Basics', value: 200, clue: 'This test determines if a machine can exhibit intelligent behavior equivalent to humans', response: 'What is the Turing Test?', completed: false },
  { id: '2', category: 'AI Basics', value: 400, clue: 'This type of AI is designed to perform specific tasks', response: 'What is Narrow AI?', completed: false },
  { id: '3', category: 'AI Basics', value: 600, clue: 'This AI goal matches human cognitive abilities across all domains', response: 'What is Artificial General Intelligence?', completed: false, dailyDouble: true },
  { id: '4', category: 'AI Basics', value: 800, clue: 'This field combines computer science and robust datasets to enable problem-solving', response: 'What is Machine Learning?', completed: false },
  { id: '5', category: 'AI Basics', value: 1000, clue: 'This is the simulation of human intelligence in machines', response: 'What is Artificial Intelligence?', completed: false },

  // Machine Learning
  { id: '6', category: 'Machine Learning', value: 200, clue: 'This ML type uses labeled training data', response: 'What is Supervised Learning?', completed: false },
  { id: '7', category: 'Machine Learning', value: 400, clue: 'This ML type finds patterns in unlabeled data', response: 'What is Unsupervised Learning?', completed: false },
  { id: '8', category: 'Machine Learning', value: 600, clue: 'This ML type learns through rewards and penalties', response: 'What is Reinforcement Learning?', completed: false },
  { id: '9', category: 'Machine Learning', value: 800, clue: 'This is the process of teaching a model with data', response: 'What is Training?', completed: false },
  { id: '10', category: 'Machine Learning', value: 1000, clue: 'This measures how well a model performs on new data', response: 'What is Generalization?', completed: false },

  // Deep Learning
  { id: '11', category: 'Deep Learning', value: 200, clue: 'This network type is inspired by the human brain', response: 'What is a Neural Network?', completed: false },
  { id: '12', category: 'Deep Learning', value: 400, clue: 'This algorithm trains neural networks by adjusting weights', response: 'What is Backpropagation?', completed: false },
  { id: '13', category: 'Deep Learning', value: 600, clue: 'This network type excels at image recognition', response: 'What is a Convolutional Neural Network?', completed: false },
  { id: '14', category: 'Deep Learning', value: 800, clue: 'This network type processes sequential data', response: 'What is a Recurrent Neural Network?', completed: false, dailyDouble: true },
  { id: '15', category: 'Deep Learning', value: 1000, clue: 'This technique uses pre-trained models for new tasks', response: 'What is Transfer Learning?', completed: false },

  // AI Applications
  { id: '16', category: 'AI Applications', value: 200, clue: 'This AI field helps computers understand human language', response: 'What is Natural Language Processing?', completed: false },
  { id: '17', category: 'AI Applications', value: 400, clue: 'This AI field enables machines to interpret visual information', response: 'What is Computer Vision?', completed: false },
  { id: '18', category: 'AI Applications', value: 600, clue: 'This AI application can drive cars without human intervention', response: 'What are Autonomous Vehicles?', completed: false },
  { id: '19', category: 'AI Applications', value: 800, clue: 'This AI system can play games and beat human champions', response: 'What is Game AI?', completed: false },
  { id: '20', category: 'AI Applications', value: 1000, clue: 'This AI application provides personalized content recommendations', response: 'What are Recommendation Systems?', completed: false },

  // AI Ethics
  { id: '21', category: 'AI Ethics', value: 200, clue: 'This refers to unfair treatment by AI systems', response: 'What is AI Bias?', completed: false },
  { id: '22', category: 'AI Ethics', value: 400, clue: 'This principle ensures AI systems can be understood and explained', response: 'What is AI Explainability?', completed: false },
  { id: '23', category: 'AI Ethics', value: 600, clue: 'This concept protects individual information in AI systems', response: 'What is Data Privacy?', completed: false },
  { id: '24', category: 'AI Ethics', value: 800, clue: 'This ensures AI systems are reliable and trustworthy', response: 'What is AI Safety?', completed: false },
  { id: '25', category: 'AI Ethics', value: 1000, clue: 'This addresses who is responsible for AI decisions', response: 'What is AI Accountability?', completed: false }
]

export function JeopardyGameNew({ lessonId, onClose, onComplete }: JeopardyGameProps) {
  const [questions, setQuestions] = useState<JeopardyQuestion[]>(jeopardyQuestions)
  const [selectedQuestion, setSelectedQuestion] = useState<JeopardyQuestion | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [wager, setWager] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const totalPossibleScore = questions.reduce((sum, q) => sum + q.value, 0)
  const progressPercentage = (questionsAnswered / questions.length) * 100

  const selectQuestion = (question: JeopardyQuestion) => {
    if (question.completed) return
    setSelectedQuestion(question)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
    
    // If Daily Double, set initial wager
    if (question.dailyDouble) {
      setWager(Math.min(score || 1000, question.value))
    }
  }

  const submitAnswer = () => {
    if (!selectedQuestion || !userAnswer.trim()) return

    const normalizedUserAnswer = userAnswer.toLowerCase().trim()
    const normalizedCorrectAnswer = selectedQuestion.response.toLowerCase()
      .replace('what is ', '')
      .replace('what are ', '')
      .replace('who is ', '')
      .replace('who are ', '')
      .replace('?', '')
      .trim()
    
    // Check if answer is correct (flexible matching)
    const correct = normalizedUserAnswer.includes(normalizedCorrectAnswer) || 
                   normalizedCorrectAnswer.includes(normalizedUserAnswer) ||
                   // Check for key words
                   normalizedCorrectAnswer.split(' ').some(word => 
                     word.length > 3 && normalizedUserAnswer.includes(word)
                   )

    setIsCorrect(correct)
    setShowResult(true)

    // Update score
    const pointValue = selectedQuestion.dailyDouble ? wager : selectedQuestion.value
    if (correct) {
      setScore(prev => prev + pointValue)
    } else if (selectedQuestion.dailyDouble) {
      setScore(prev => Math.max(0, prev - pointValue))
    }

    // Mark question as completed
    setQuestions(prev => prev.map(q => 
      q.id === selectedQuestion.id ? { ...q, completed: true, wasCorrect: correct } : q
    ))
    setQuestionsAnswered(prev => prev + 1)

    // Check if game is over
    if (questionsAnswered + 1 === questions.length) {
      setTimeout(() => {
        setGameOver(true)
        const finalScore = Math.round((score / totalPossibleScore) * 100)
        setTimeout(() => {
          onComplete(finalScore)
        }, 3000)
      }, 2000)
    }
  }

  const backToBoard = () => {
    setSelectedQuestion(null)
    setUserAnswer('')
    setShowResult(false)
    setWager(0)
  }

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent>
            <Trophy className="h-16 w-16 text-text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Final Jeopardy Complete!
            </h2>
            <p className="text-text-secondary mb-4">
              You've finished the Jeopardy round
            </p>
            <p className="text-3xl font-bold text-text-success mb-4">
              ${score.toLocaleString()}
            </p>
            <p className="text-text-secondary">
              You answered {questions.filter(q => q.completed).length} out of {questions.length} clues
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedQuestion) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal">
        <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid className="h-5 w-5 text-text-brand" />
              <h2 className="text-xl font-semibold text-text-primary">
                {selectedQuestion.category} - ${selectedQuestion.value}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-text-secondary">Current Score</p>
                <p className="text-lg font-bold text-text-success">${score.toLocaleString()}</p>
              </div>
              
              <Button variant="ghost" size="sm" onClick={backToBoard} className="p-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
            {/* Daily Double */}
            {selectedQuestion.dailyDouble && !showResult && (
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full shadow-lg animate-pulse">
                  <Star className="h-6 w-6" />
                  <span className="text-2xl font-bold">DAILY DOUBLE!</span>
                  <Star className="h-6 w-6" />
                </div>
                
                <div className="mt-6">
                  <p className="text-text-secondary mb-2">How much would you like to wager?</p>
                  <div className="flex items-center gap-4 justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setWager(Math.max(5, Math.floor(score * 0.25)))}
                    >
                      25%
                    </Button>
                    <Input
                      type="number"
                      value={wager}
                      onChange={(e) => setWager(Math.min(Math.max(5, parseInt(e.target.value) || 0), score || 1000))}
                      className="w-32 text-center"
                      min="5"
                      max={score || 1000}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setWager(Math.max(5, Math.floor(score * 0.5)))}
                    >
                      50%
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setWager(score || 1000)}
                    >
                      All In
                    </Button>
                  </div>
                  <p className="text-xs text-text-tertiary mt-2">
                    Max wager: ${(score || 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Clue */}
            <Card className="mb-8 p-8 text-center w-full max-w-2xl">
              <CardContent>
                <h2 className="text-3xl font-semibold text-text-primary leading-relaxed">
                  {selectedQuestion.clue}
                </h2>
              </CardContent>
            </Card>

            {/* Answer Input */}
            {!showResult ? (
              <div className="w-full max-w-xl space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary">Your Response (What is/are...?)</label>
                  <Input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                    placeholder="Enter your response..."
                    className="text-lg text-center"
                    autoFocus
                  />
                </div>
                
                <Button
                  variant="primary"
                  size="lg"
                  onClick={submitAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full"
                >
                  Submit Response
                </Button>
              </div>
            ) : (
              <div className="w-full max-w-xl space-y-4">
                {/* Result */}
                <Card className={cn(
                  "p-6 text-center",
                  isCorrect ? "bg-bg-success-light border-border-success" : "bg-bg-error-light border-border-error"
                )}>
                  <CardContent>
                    <div className="mb-4">
                      {isCorrect ? (
                        <CheckCircle className="h-12 w-12 text-text-success mx-auto" />
                      ) : (
                        <X className="h-12 w-12 text-text-error mx-auto" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {isCorrect ? 'Correct!' : 'Sorry, that\'s incorrect'}
                    </h3>
                    <p className="text-lg mb-2">
                      The correct response was:
                    </p>
                    <p className="text-xl font-semibold text-text-primary">
                      {selectedQuestion.response}
                    </p>
                    {selectedQuestion.dailyDouble && (
                      <p className="text-lg mt-4">
                        {isCorrect ? `You won $${wager.toLocaleString()}!` : `You lost $${wager.toLocaleString()}`}
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Button
                  variant="primary"
                  size="lg"
                  onClick={backToBoard}
                  className="w-full"
                >
                  Back to Board
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal">
      <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid className="h-5 w-5 text-text-brand" />
            <h2 className="text-xl font-semibold text-text-primary">Jeopardy!</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-text-secondary">Score</p>
              <p className="text-lg font-bold text-text-success">${score.toLocaleString()}</p>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-border-subtle bg-bg-secondary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Game Progress</span>
            <span className="text-sm font-medium text-text-brand">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full flex flex-col max-w-7xl mx-auto">
            {/* Game Title */}
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-text-primary mb-1">
                Jeopardy!
              </h1>
              <p className="text-sm text-text-secondary">Select a category and value to reveal the clue</p>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-5 gap-3 flex-1">
              {jeopardyCategories.map((category) => (
                <div key={category.id} className="flex flex-col gap-2 h-full">
                  {/* Category Header */}
                  <Card className="bg-gradient-to-br from-bg-brand-light to-bg-brand text-center p-3">
                    <CardContent className="p-0">
                      <category.icon className="h-6 w-6 text-text-brand mx-auto mb-1" />
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide leading-tight">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>

                  {/* Questions */}
                  <div className="flex-1 flex flex-col gap-2">
                  {[200, 400, 600, 800, 1000].map((value) => {
                    const question = questions.find(q => q.category === category.name && q.value === value)
                    if (!question) return null

                    return (
                      <Card
                        key={question.id}
                        className={cn(
                          "flex-1 cursor-pointer transition-all duration-200 group",
                          question.completed 
                            ? "bg-bg-disabled opacity-50 cursor-not-allowed" 
                            : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 hover:scale-105"
                        )}
                        onClick={() => selectQuestion(question)}
                      >
                        <CardContent className="p-4 text-center h-full flex items-center justify-center">
                          {question.completed ? (
                            question.wasCorrect ? (
                              <CheckCircle className="h-6 w-6 text-text-success" />
                            ) : (
                              <X className="h-6 w-6 text-text-error" />
                            )
                          ) : (
                            <div>
                              {question.dailyDouble && (
                                <Star className="h-3 w-3 text-yellow-400 mx-auto mb-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                              <p className="text-xl font-bold text-yellow-400">
                                ${value}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-3 gap-3 max-w-xl mx-auto">
              <Card className="bg-bg-secondary">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-text-secondary">Answered</p>
                  <p className="text-lg font-bold text-text-primary">
                    {questionsAnswered}/{questions.length}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-bg-secondary">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-text-secondary">Score</p>
                  <p className="text-lg font-bold text-text-success">
                    ${score.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-bg-secondary">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-text-secondary">Daily Doubles</p>
                  <p className="text-lg font-bold text-text-warning">
                    {questions.filter(q => q.dailyDouble && !q.completed).length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}