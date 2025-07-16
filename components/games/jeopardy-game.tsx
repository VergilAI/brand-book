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
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 z-modal">
        <div className="w-full max-w-5xl bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 rounded-2xl border-4 border-yellow-400 p-12">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-lg font-black text-lg mb-4 inline-block">
              {selectedQuestion.category} - ${selectedQuestion.value}
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              {selectedQuestion.question}
            </h2>
          </div>

          {!showAnswer ? (
            <div className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <Input
                  type="text"
                  placeholder="What is...? / Who is...?"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-center text-xl h-16 bg-white/10 border-white/30 text-white placeholder-white/50 focus:bg-white/20"
                  onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                />
              </div>
              
              <div className="flex justify-center gap-6">
                <Button 
                  size="lg"
                  onClick={submitAnswer} 
                  disabled={!userAnswer.trim()}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold px-8 py-4 text-lg"
                >
                  Submit Answer
                </Button>
                <Button 
                  size="lg"
                  variant="secondary" 
                  onClick={closeQuestion}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold px-8 py-4 text-lg"
                >
                  Pass
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className={cn(
                "p-8 rounded-xl border-4",
                isCorrect ? "bg-green-900/50 border-green-400 text-green-300" : "bg-red-900/50 border-red-400 text-red-300"
              )}>
                <p className="font-black text-3xl mb-4">
                  {isCorrect ? '✓ CORRECT!' : '✗ INCORRECT'}
                </p>
                <p className="text-white text-xl mb-4">
                  <strong>Answer:</strong> {selectedQuestion.answer}
                </p>
                {isCorrect && (
                  <p className="text-yellow-400 font-bold text-2xl">
                    +${selectedQuestion.value} points!
                  </p>
                )}
              </div>
              
              <Button 
                size="lg"
                onClick={closeQuestion}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold px-8 py-4 text-lg"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-modal overflow-hidden">
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/20 flex items-center justify-between bg-gradient-to-r from-purple-800 to-blue-800">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white tracking-wide">AI FUNDAMENTALS JEOPARDY!</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center bg-white/10 rounded-lg px-4 py-2">
              <p className="text-sm text-white/70">Current Score</p>
              <p className="text-2xl font-bold text-yellow-400">${score}</p>
            </div>
            
            <Button variant="ghost" size="lg" onClick={onClose} className="p-3 h-12 w-12 text-white hover:bg-white/20">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex-1 p-8">
          <div className="grid grid-cols-5 gap-4 h-full max-h-[calc(100vh-200px)]">
            {jeopardyCategories.map((category, categoryIndex) => (
              <div key={category} className="flex flex-col gap-3">
                {/* Category Header - Redesigned */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-4 rounded-t-lg border-4 border-yellow-400 shadow-lg">
                  <h3 className="font-black text-white text-center text-sm uppercase tracking-widest leading-tight">
                    {category}
                  </h3>
                </div>

                {/* Questions - Redesigned */}
                {getQuestionsByCategory(category).map((question) => (
                  <div
                    key={question.id}
                    className={cn(
                      "flex-1 min-h-[80px] cursor-pointer transition-all duration-300 rounded-lg border-2 flex items-center justify-center",
                      question.completed 
                        ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed" 
                        : "bg-gradient-to-br from-blue-500 to-blue-700 border-blue-300 text-white hover:from-blue-400 hover:to-blue-600 hover:scale-105 hover:shadow-xl transform"
                    )}
                    onClick={() => selectQuestion(question)}
                  >
                    {question.completed ? (
                      <CheckCircle className="h-8 w-8" />
                    ) : (
                      <p className="font-black text-2xl text-yellow-300 drop-shadow-lg">${question.value}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-white/20 flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="text-white/80">
            Questions answered: <span className="font-bold text-white">{questionsAnswered}</span> / <span className="font-bold text-white">{questions.length}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Total Score: ${score}
            </div>
            
            {questionsAnswered === questions.length && (
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold px-8 py-3 text-lg"
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