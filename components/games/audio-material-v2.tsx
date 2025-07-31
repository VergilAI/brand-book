'use client'

import { useState, useEffect } from 'react'
import { X, Volume2, CheckCircle, Clock, Headphones, BookOpen, Award } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import TTSButtonEnhanced from '@/components/Voice/TTSButtonEnhanced'
import { cn } from '@/lib/utils'

interface AudioMaterialV2Props {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

interface AudioLesson {
  id: string
  title: string
  description: string
  duration: number
  transcript: string
  learningPoints: string[]
  quiz: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }
}

const audioLessons: AudioLesson[] = [
  {
    id: 'intro-ai',
    title: 'Introduction to AI',
    description: 'Understanding the basics of artificial intelligence',
    duration: 180,
    transcript: `Welcome to our exploration of Artificial Intelligence. AI is the simulation of human intelligence in machines that are programmed to think and learn like humans. 

The concept of AI has been around for decades, but recent advances in computing power and data availability have made it more practical and widespread than ever before.

AI systems can perform tasks such as visual perception, speech recognition, decision-making, and language translation. These capabilities make AI incredibly valuable across many industries.`,
    learningPoints: [
      'AI simulates human intelligence in machines',
      'Recent advances have made AI more practical',
      'AI includes perception, recognition, and decision-making'
    ],
    quiz: {
      question: 'What is the main definition of Artificial Intelligence?',
      options: [
        'A type of computer hardware',
        'The simulation of human intelligence in machines',
        'A programming language',
        'A type of database'
      ],
      correctAnswer: 1,
      explanation: 'AI is defined as the simulation of human intelligence in machines that are programmed to think and learn like humans.'
    }
  }
]

export function AudioMaterialV2({ lessonId, onClose, onComplete }: AudioMaterialV2Props) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizScores, setQuizScores] = useState<{ [key: string]: boolean }>({})
  const [startTime] = useState(Date.now())

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const currentLesson = audioLessons[currentLessonIndex]
  const totalLessons = audioLessons.length
  const progressPercentage = Math.round((completedLessons.size / totalLessons) * 100)

  const handleAudioComplete = () => {
    setTimeout(() => {
      setShowQuiz(true)
    }, 1500)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return
    
    const isCorrect = selectedAnswer === currentLesson.quiz.correctAnswer
    setQuizScores(prev => ({ ...prev, [currentLesson.id]: isCorrect }))
    setShowResult(true)
    
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]))
    
    setTimeout(() => {
      if (currentLessonIndex < totalLessons - 1) {
        nextLesson()
      } else {
        completeAllLessons()
      }
    }, 3000)
  }

  const nextLesson = () => {
    setCurrentLessonIndex(prev => prev + 1)
    setShowQuiz(false)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const completeAllLessons = () => {
    const correctAnswers = Object.values(quizScores).filter(Boolean).length
    const finalScore = Math.round((correctAnswers / totalLessons) * 100)
    onComplete(finalScore)
  }

  const selectLesson = (index: number) => {
    setCurrentLessonIndex(index)
    setShowQuiz(false)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal">
      <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-bg-brand-light rounded-lg">
                <Headphones className="h-6 w-6 text-text-brand" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Audio Learning Experience
                </h2>
                <p className="text-sm text-text-secondary">
                  Listen, learn, and test your understanding
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="px-6 py-4 bg-gradient-to-r from-bg-brand-light to-bg-secondary">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="text-text-primary">
                <span className="text-2xl font-bold">{completedLessons.size}</span>
                <span className="text-lg text-text-secondary"> / {totalLessons}</span>
              </div>
              <div className="text-sm text-text-secondary">
                Lessons Completed
              </div>
            </div>
            
            {completedLessons.size === totalLessons && (
              <Button 
                variant="primary" 
                onClick={completeAllLessons}
                className="flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                Complete Course
              </Button>
            )}
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-80 border-r border-border-subtle bg-bg-secondary overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Content
              </h3>
              
              <div className="space-y-2">
                {audioLessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    onClick={() => selectLesson(index)}
                    className={cn(
                      "p-4 rounded-lg cursor-pointer transition-all",
                      index === currentLessonIndex && "bg-bg-brand text-white shadow-md",
                      completedLessons.has(lesson.id) && index !== currentLessonIndex && "bg-bg-success-light",
                      index !== currentLessonIndex && !completedLessons.has(lesson.id) && "hover:bg-bg-emphasis"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-medium mb-1",
                          index === currentLessonIndex ? "text-white" : "text-text-primary"
                        )}>
                          {lesson.title}
                        </h4>
                        <p className={cn(
                          "text-sm",
                          index === currentLessonIndex ? "text-white/80" : "text-text-secondary"
                        )}>
                          {lesson.description}
                        </p>
                        <div className={cn(
                          "flex items-center gap-2 mt-2 text-xs",
                          index === currentLessonIndex ? "text-white/70" : "text-text-tertiary"
                        )}>
                          <Clock className="h-3 w-3" />
                          {formatTime(lesson.duration)}
                        </div>
                      </div>
                      {completedLessons.has(lesson.id) && (
                        <CheckCircle className={cn(
                          "h-5 w-5 flex-shrink-0",
                          index === currentLessonIndex ? "text-white" : "text-text-success"
                        )} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {!showQuiz ? (
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  {/* Lesson Header */}
                  <div className="mb-8">
                    <Badge variant="brand" className="mb-3">
                      Lesson {currentLessonIndex + 1} of {totalLessons}
                    </Badge>
                    <h1 className="text-3xl font-bold text-text-primary mb-3">
                      {currentLesson.title}
                    </h1>
                    <p className="text-lg text-text-secondary">
                      {currentLesson.description}
                    </p>
                  </div>

                  {/* Learning Points */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Key Learning Points
                      </h3>
                      <ul className="space-y-2">
                        {currentLesson.learningPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-bg-brand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-text-brand">
                                {index + 1}
                              </span>
                            </div>
                            <span className="text-text-secondary">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Audio Player */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Listen to the Audio Lesson
                    </h3>
                    <TTSButtonEnhanced
                      text={currentLesson.transcript}
                      showTranscript={true}
                      onPlayStart={() => {}}
                      onPlayEnd={handleAudioComplete}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="max-w-3xl mx-auto">
                  {/* Quiz Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-bg-warning-light rounded-full mb-4">
                      <Award className="h-8 w-8 text-text-warning" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                      Comprehension Check
                    </h2>
                    <p className="text-text-secondary">
                      Test your understanding of the lesson
                    </p>
                  </div>

                  {/* Question */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-6">
                        {currentLesson.quiz.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {currentLesson.quiz.options.map((option, index) => (
                          <label
                            key={index}
                            className={cn(
                              "block p-4 rounded-lg border-2 cursor-pointer transition-all",
                              selectedAnswer === index && !showResult && "border-text-brand bg-bg-brand-light",
                              showResult && index === currentLesson.quiz.correctAnswer && "border-text-success bg-bg-success-light",
                              showResult && selectedAnswer === index && index !== currentLesson.quiz.correctAnswer && "border-text-error bg-bg-error-light",
                              !showResult && selectedAnswer !== index && "border-border-subtle hover:border-border-default hover:bg-bg-emphasis"
                            )}
                          >
                            <input
                              type="radio"
                              name="quiz-answer"
                              value={index}
                              checked={selectedAnswer === index}
                              onChange={() => setSelectedAnswer(index)}
                              disabled={showResult}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors",
                                selectedAnswer === index 
                                  ? "bg-text-brand text-white" 
                                  : "bg-bg-secondary text-text-secondary"
                              )}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="text-text-primary font-medium">{option}</span>
                            </div>
                          </label>
                        ))}
                      </div>

                      {showResult && (
                        <div className={cn(
                          "mt-6 p-4 rounded-lg",
                          quizScores[currentLesson.id] 
                            ? "bg-bg-success-light border border-border-success" 
                            : "bg-bg-error-light border border-border-error"
                        )}>
                          <p className={cn(
                            "font-semibold mb-2",
                            quizScores[currentLesson.id] ? "text-text-success" : "text-text-error"
                          )}>
                            {quizScores[currentLesson.id] ? "✓ Excellent! You got it right!" : "✗ Not quite right"}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {currentLesson.quiz.explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {!showResult && (
                    <div className="flex justify-center">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={submitAnswer}
                        disabled={selectedAnswer === null}
                      >
                        Submit Answer
                      </Button>
                    </div>
                  )}

                  {showResult && (
                    <div className="text-center text-sm text-text-secondary">
                      {currentLessonIndex < totalLessons - 1 
                        ? "Moving to next lesson in a moment..." 
                        : "Completing course..."}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}