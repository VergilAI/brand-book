'use client'

import { useState, useEffect } from 'react'
import { X, Trophy, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Input } from '@/components/atomic/input'
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
  question: string
  answer: string
  completed: boolean
}

const jeopardyCategories = [
  'AI Basics',
  'Machine Learning',
  'Deep Learning',
  'AI Applications',
  'AI Ethics'
]

const jeopardyQuestions: JeopardyQuestion[] = [
  // AI Basics
  { id: '1', category: 'AI Basics', value: 200, question: 'This test determines if a machine can exhibit intelligent behavior equivalent to humans', answer: 'What is the Turing Test?', completed: false },
  { id: '2', category: 'AI Basics', value: 400, question: 'This type of AI is designed to perform specific tasks', answer: 'What is Narrow AI?', completed: false },
  { id: '3', category: 'AI Basics', value: 600, question: 'This AI goal matches human cognitive abilities across all domains', answer: 'What is Artificial General Intelligence?', completed: false },
  { id: '4', category: 'AI Basics', value: 800, question: 'This field combines computer science and robust datasets to enable problem-solving', answer: 'What is Machine Learning?', completed: false },
  { id: '5', category: 'AI Basics', value: 1000, question: 'This is the simulation of human intelligence in machines', answer: 'What is Artificial Intelligence?', completed: false },

  // Machine Learning
  { id: '6', category: 'Machine Learning', value: 200, question: 'This ML type uses labeled training data', answer: 'What is Supervised Learning?', completed: false },
  { id: '7', category: 'Machine Learning', value: 400, question: 'This ML type finds patterns in unlabeled data', answer: 'What is Unsupervised Learning?', completed: false },
  { id: '8', category: 'Machine Learning', value: 600, question: 'This ML type learns through rewards and penalties', answer: 'What is Reinforcement Learning?', completed: false },
  { id: '9', category: 'Machine Learning', value: 800, question: 'This is the process of teaching a model with data', answer: 'What is Training?', completed: false },
  { id: '10', category: 'Machine Learning', value: 1000, question: 'This measures how well a model performs on new data', answer: 'What is Generalization?', completed: false },

  // Deep Learning
  { id: '11', category: 'Deep Learning', value: 200, question: 'This network type is inspired by the human brain', answer: 'What is a Neural Network?', completed: false },
  { id: '12', category: 'Deep Learning', value: 400, question: 'This algorithm trains neural networks by adjusting weights', answer: 'What is Backpropagation?', completed: false },
  { id: '13', category: 'Deep Learning', value: 600, question: 'This network type excels at image recognition', answer: 'What is a Convolutional Neural Network?', completed: false },
  { id: '14', category: 'Deep Learning', value: 800, question: 'This network type processes sequential data', answer: 'What is a Recurrent Neural Network?', completed: false },
  { id: '15', category: 'Deep Learning', value: 1000, question: 'This technique uses pre-trained models for new tasks', answer: 'What is Transfer Learning?', completed: false },

  // AI Applications
  { id: '16', category: 'AI Applications', value: 200, question: 'This AI field helps computers understand human language', answer: 'What is Natural Language Processing?', completed: false },
  { id: '17', category: 'AI Applications', value: 400, question: 'This AI field enables machines to interpret visual information', answer: 'What is Computer Vision?', completed: false },
  { id: '18', category: 'AI Applications', value: 600, question: 'This AI application can drive cars without human intervention', answer: 'What are Autonomous Vehicles?', completed: false },
  { id: '19', category: 'AI Applications', value: 800, question: 'This AI system can play games and beat human champions', answer: 'What is Game AI?', completed: false },
  { id: '20', category: 'AI Applications', value: 1000, question: 'This AI application provides personalized content recommendations', answer: 'What are Recommendation Systems?', completed: false },

  // AI Ethics
  { id: '21', category: 'AI Ethics', value: 200, question: 'This refers to unfair treatment by AI systems', answer: 'What is AI Bias?', completed: false },
  { id: '22', category: 'AI Ethics', value: 400, question: 'This principle ensures AI systems can be understood and explained', answer: 'What is AI Explainability?', completed: false },
  { id: '23', category: 'AI Ethics', value: 600, question: 'This concept protects individual information in AI systems', answer: 'What is Data Privacy?', completed: false },
  { id: '24', category: 'AI Ethics', value: 800, question: 'This ensures AI systems are reliable and trustworthy', answer: 'What is AI Safety?', completed: false },
  { id: '25', category: 'AI Ethics', value: 1000, question: 'This addresses who is responsible for AI decisions', answer: 'What is AI Accountability?', completed: false }
]

export function JeopardyGame({ lessonId, onClose, onComplete }: JeopardyGameProps) {
  const [questions, setQuestions] = useState<JeopardyQuestion[]>(jeopardyQuestions)
  const [selectedQuestion, setSelectedQuestion] = useState<JeopardyQuestion | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)

  const selectQuestion = (question: JeopardyQuestion) => {
    if (question.completed) return
    setSelectedQuestion(question)
    setUserAnswer('')
    setShowAnswer(false)
  }

  const submitAnswer = () => {
    if (!selectedQuestion || !userAnswer.trim()) return

    const normalizedUserAnswer = userAnswer.toLowerCase().trim()
    const normalizedCorrectAnswer = selectedQuestion.answer.toLowerCase().trim()
    
    // Check if answer is correct (flexible matching)
    const correct = normalizedCorrectAnswer.includes(normalizedUserAnswer) || 
                   normalizedUserAnswer.includes(normalizedCorrectAnswer.replace('what is ', '').replace('what are ', ''))

    setIsCorrect(correct)
    setShowAnswer(true)

    if (correct) {
      setScore(prev => prev + selectedQuestion.value)
    }

    // Mark question as completed
    setQuestions(prev => prev.map(q => 
      q.id === selectedQuestion.id ? { ...q, completed: true } : q
    ))

    setQuestionsAnswered(prev => prev + 1)
  }

  const closeQuestion = () => {
    setSelectedQuestion(null)
    setUserAnswer('')
    setShowAnswer(false)
    
    // Check if all questions are completed
    const allCompleted = questions.every(q => q.completed)
    if (allCompleted) {
      const finalScore = Math.round((score / 15000) * 100) // Total possible score is 15000
      setTimeout(() => onComplete(finalScore), 1000)
    }
  }

  const getQuestionsByCategory = (category: string) => {
    return questions.filter(q => q.category === category).sort((a, b) => a.value - b.value)
  }

  if (selectedQuestion) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
        <Card className="w-full max-w-4xl p-8">
          <CardContent>
            <div className="text-center mb-6">
              <Badge variant="primary" className="mb-2">
                {selectedQuestion.category} - ${selectedQuestion.value}
              </Badge>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                {selectedQuestion.question}
              </h2>
            </div>

            {!showAnswer ? (
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="What is...? / Who is...?"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-center text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                />
                
                <div className="flex justify-center gap-4">
                  <Button onClick={submitAnswer} disabled={!userAnswer.trim()}>
                    Submit Answer
                  </Button>
                  <Button variant="secondary" onClick={closeQuestion}>
                    Pass
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className={cn(
                  "p-4 rounded-lg",
                  isCorrect ? "bg-bg-success-light text-text-success" : "bg-bg-error-light text-text-error"
                )}>
                  <p className="font-semibold mb-2">
                    {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </p>
                  <p className="text-text-primary">
                    <strong>Answer:</strong> {selectedQuestion.answer}
                  </p>
                  {isCorrect && (
                    <p className="text-text-success">
                      +${selectedQuestion.value} points!
                    </p>
                  )}
                </div>
                
                <Button onClick={closeQuestion}>
                  Continue
                </Button>
              </div>
            )}
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
            <Trophy className="h-5 w-5 text-text-warning" />
            <h2 className="text-xl font-semibold text-text-primary">AI Fundamentals Jeopardy</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-text-secondary">Current Score</p>
              <p className="text-lg font-bold text-text-success">${score}</p>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-5 gap-2 h-full">
            {jeopardyCategories.map((category, categoryIndex) => (
              <div key={category} className="flex flex-col gap-2">
                {/* Category Header */}
                <Card className="bg-text-brand text-white p-3 text-center">
                  <CardContent className="p-0">
                    <h3 className="font-bold text-sm">{category}</h3>
                  </CardContent>
                </Card>

                {/* Questions */}
                {getQuestionsByCategory(category).map((question) => (
                  <Card
                    key={question.id}
                    className={cn(
                      "flex-1 cursor-pointer transition-all duration-200",
                      question.completed 
                        ? "bg-bg-secondary text-text-disabled cursor-not-allowed" 
                        : "bg-text-brand text-white hover:bg-text-brand-light hover:scale-105"
                    )}
                    onClick={() => selectQuestion(question)}
                  >
                    <CardContent className="p-0 h-full flex items-center justify-center">
                      {question.completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <p className="font-bold text-lg">${question.value}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Questions answered: {questionsAnswered} / {questions.length}
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="success" className="text-sm">
              <Star className="h-3 w-3 mr-1" />
              Total Score: ${score}
            </Badge>
            
            {questionsAnswered === questions.length && (
              <Button 
                variant="primary" 
                onClick={() => onComplete(Math.round((score / 15000) * 100))}
              >
                Finish Game
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}