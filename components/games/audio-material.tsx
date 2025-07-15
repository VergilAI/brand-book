'use client'

import { useState, useEffect } from 'react'
import { X, Volume2, Play, Pause, RotateCcw, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import { cn } from '@/lib/utils'

interface AudioMaterialProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

interface AudioFile {
  id: string
  title: string
  description: string
  duration: number // in seconds
  transcript: string
  question: {
    question: string
    options: string[]
    correctAnswer: number
  }
}

const audioFiles: AudioFile[] = [
  {
    id: 'audio-1',
    title: 'Introduction to AI',
    description: 'Understanding the basics of artificial intelligence',
    duration: 180, // 3 minutes
    transcript: `
      Welcome to our exploration of Artificial Intelligence. AI is the simulation of human intelligence in machines that are programmed to think and learn like humans. 
      
      The concept of AI has been around for decades, but recent advances in computing power and data availability have made it more practical and widespread than ever before.
      
      AI systems can perform tasks such as visual perception, speech recognition, decision-making, and language translation. These capabilities make AI incredibly valuable across many industries.
    `,
    question: {
      question: 'What is the main definition of Artificial Intelligence?',
      options: [
        'A type of computer hardware',
        'The simulation of human intelligence in machines',
        'A programming language',
        'A type of database'
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'audio-2',
    title: 'Machine Learning Fundamentals',
    description: 'Core concepts of machine learning and its applications',
    duration: 240, // 4 minutes
    transcript: `
      Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed for every task.
      
      There are three main types of machine learning: Supervised learning uses labeled data to train models, unsupervised learning finds patterns in unlabeled data, and reinforcement learning learns through trial and error with rewards and penalties.
      
      Machine learning algorithms can recognize patterns in data, make predictions, and adapt to new information. This makes them incredibly powerful for tasks like image recognition, natural language processing, and recommendation systems.
    `,
    question: {
      question: 'Which type of machine learning uses labeled data to train models?',
      options: [
        'Unsupervised learning',
        'Reinforcement learning',
        'Supervised learning',
        'Deep learning'
      ],
      correctAnswer: 2
    }
  },
  {
    id: 'audio-3',
    title: 'Neural Networks Explained',
    description: 'How neural networks work and their importance in AI',
    duration: 210, // 3.5 minutes
    transcript: `
      Neural networks are computing systems inspired by biological neural networks in animal brains. They consist of interconnected nodes called neurons that process information.
      
      A neural network has three main components: an input layer that receives data, hidden layers that process the information, and an output layer that produces results.
      
      Deep learning uses neural networks with multiple hidden layers to model complex patterns. This approach has led to breakthroughs in image recognition, natural language processing, and game playing.
    `,
    question: {
      question: 'What are the three main components of a neural network?',
      options: [
        'Input, hidden, and output layers',
        'Data, processing, and storage',
        'Hardware, software, and algorithms',
        'Training, testing, and validation'
      ],
      correctAnswer: 0
    }
  },
  {
    id: 'audio-4',
    title: 'AI Applications Today',
    description: 'Real-world applications of artificial intelligence',
    duration: 195, // 3.25 minutes
    transcript: `
      AI is already transforming many aspects of our daily lives. In healthcare, AI helps diagnose diseases, analyze medical images, and discover new drugs.
      
      In transportation, autonomous vehicles use AI for navigation and safety. In finance, AI detects fraud and makes investment decisions.
      
      Voice assistants like Siri and Alexa use natural language processing to understand and respond to human speech. Recommendation systems on platforms like Netflix and Amazon use AI to suggest content based on user preferences.
    `,
    question: {
      question: 'Which of the following is NOT mentioned as an AI application?',
      options: [
        'Medical diagnosis',
        'Autonomous vehicles',
        'Weather prediction',
        'Voice assistants'
      ],
      correctAnswer: 2
    }
  },
  {
    id: 'audio-5',
    title: 'AI Ethics and Future',
    description: 'Ethical considerations and the future of AI',
    duration: 225, // 3.75 minutes
    transcript: `
      As AI becomes more powerful and widespread, we must consider its ethical implications. Issues include bias in AI systems, privacy concerns, and the impact on employment.
      
      AI systems can perpetuate or amplify human biases present in training data. Ensuring fairness and transparency in AI decision-making is crucial for building trust.
      
      The future of AI holds great promise, from solving climate change to advancing scientific research. However, we must develop AI responsibly, with appropriate safeguards and regulations.
    `,
    question: {
      question: 'What is one of the main ethical concerns about AI mentioned in the audio?',
      options: [
        'AI is too expensive',
        'AI systems can perpetuate human biases',
        'AI is too slow',
        'AI requires too much storage'
      ],
      correctAnswer: 1
    }
  }
]

export function AudioMaterial({ lessonId, onClose, onComplete }: AudioMaterialProps) {
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const [completedAudios, setCompletedAudios] = useState<Set<string>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean }>({})
  const [showQuizResult, setShowQuizResult] = useState(false)

  const currentAudio = audioFiles[currentAudioIndex]
  const totalAudios = audioFiles.length
  const progressPercentage = Math.round((completedAudios.size / totalAudios) * 100)

  // Simulate audio playback
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentAudio.duration) {
            setIsPlaying(false)
            setShowQuiz(true)
            return currentAudio.duration
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentAudio.duration])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const restartAudio = () => {
    setCurrentTime(0)
    setIsPlaying(false)
    setShowQuiz(false)
    setSelectedAnswer(null)
    setShowQuizResult(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const selectAudio = (index: number) => {
    setCurrentAudioIndex(index)
    setCurrentTime(0)
    setIsPlaying(false)
    setShowQuiz(false)
    setSelectedAnswer(null)
    setShowQuizResult(false)
  }

  const submitQuizAnswer = () => {
    if (selectedAnswer === null) return
    
    const isCorrect = selectedAnswer === currentAudio.question.correctAnswer
    setQuizResults(prev => ({ ...prev, [currentAudio.id]: isCorrect }))
    setShowQuizResult(true)
    
    // Mark audio as completed
    setCompletedAudios(prev => new Set([...prev, currentAudio.id]))
  }

  const nextAudio = () => {
    if (currentAudioIndex < totalAudios - 1) {
      selectAudio(currentAudioIndex + 1)
    }
  }

  const handleComplete = () => {
    const correctAnswers = Object.values(quizResults).filter(Boolean).length
    const finalScore = Math.round((correctAnswers / totalAudios) * 100)
    onComplete(finalScore)
  }

  const audioProgressPercentage = (currentTime / currentAudio.duration) * 100

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
      <div className="w-full max-w-6xl max-h-[90vh] bg-bg-primary rounded-lg shadow-modal overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Volume2 className="h-5 w-5 text-text-brand" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Audio Learning Materials</h2>
              <div className="flex items-center gap-4 mt-1">
                <Badge variant="info" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.round(audioFiles.reduce((acc, audio) => acc + audio.duration, 0) / 60)} min total
                </Badge>
                <span className="text-sm text-text-secondary">
                  {completedAudios.size} of {totalAudios} completed
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {completedAudios.size === totalAudios && (
              <Button variant="success" onClick={handleComplete}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Course
              </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Course Progress</span>
            <span className="text-sm font-medium text-text-brand">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar - Audio List */}
          <div className="w-64 border-r border-border-subtle bg-bg-secondary p-4 overflow-y-auto">
            <h3 className="font-semibold text-text-primary mb-4">Audio Lessons</h3>
            
            <div className="space-y-2">
              {audioFiles.map((audio, index) => (
                <div
                  key={audio.id}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer transition-all text-sm",
                    index === currentAudioIndex && "bg-text-brand text-white",
                    completedAudios.has(audio.id) && index !== currentAudioIndex && "bg-bg-success-light text-text-success",
                    index !== currentAudioIndex && !completedAudios.has(audio.id) && "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                  )}
                  onClick={() => selectAudio(index)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{audio.title}</span>
                    {completedAudios.has(audio.id) && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                  <p className="text-xs opacity-75">{formatTime(audio.duration)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {!showQuiz ? (
              <>
                {/* Audio Player */}
                <div className="p-6 border-b border-border-subtle">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-4">
                      <Badge variant="primary" className="mb-2">
                        Audio {currentAudioIndex + 1} of {totalAudios}
                      </Badge>
                      <h1 className="text-2xl font-bold text-text-primary mb-2">
                        {currentAudio.title}
                      </h1>
                      <p className="text-text-secondary">{currentAudio.description}</p>
                    </div>

                    {/* Audio Controls */}
                    <Card className="p-6 mb-4">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4 mb-4">
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={togglePlayPause}
                            className="w-16 h-16 rounded-full"
                          >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </Button>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-text-secondary">
                                {formatTime(currentTime)}
                              </span>
                              <span className="text-sm text-text-secondary">
                                {formatTime(currentAudio.duration)}
                              </span>
                            </div>
                            <Progress value={audioProgressPercentage} className="h-2" />
                          </div>
                          
                          <Button
                            variant="secondary"
                            size="md"
                            onClick={restartAudio}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowTranscript(!showTranscript)}
                          >
                            {showTranscript ? 'Hide' : 'Show'} Transcript
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Transcript */}
                    {showTranscript && (
                      <Card className="p-4 bg-bg-secondary">
                        <CardContent className="p-0">
                          <h3 className="font-semibold text-text-primary mb-2">Transcript</h3>
                          <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                            {currentAudio.transcript}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Quiz Section */
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <Badge variant="warning" className="mb-2">Quiz Time</Badge>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                      Question for: {currentAudio.title}
                    </h2>
                  </div>

                  <Card className="p-6 mb-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">
                        {currentAudio.question.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {currentAudio.question.options.map((option, index) => (
                          <div
                            key={index}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer transition-all",
                              selectedAnswer === index && !showQuizResult && "border-text-brand bg-bg-brand-light",
                              showQuizResult && index === currentAudio.question.correctAnswer && "border-text-success bg-bg-success-light",
                              showQuizResult && selectedAnswer === index && index !== currentAudio.question.correctAnswer && "border-text-error bg-bg-error-light",
                              "border-border-subtle hover:border-border-default"
                            )}
                            onClick={() => !showQuizResult && setSelectedAnswer(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-text-brand text-white flex items-center justify-center text-sm font-semibold">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="text-text-primary">{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {showQuizResult && (
                        <div className="mt-4 p-3 rounded-lg bg-bg-secondary">
                          <p className={cn(
                            "font-semibold",
                            quizResults[currentAudio.id] ? "text-text-success" : "text-text-error"
                          )}>
                            {quizResults[currentAudio.id] ? "✓ Correct!" : "✗ Incorrect"}
                          </p>
                          {!quizResults[currentAudio.id] && (
                            <p className="text-text-secondary text-sm mt-1">
                              The correct answer was: {currentAudio.question.options[currentAudio.question.correctAnswer]}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex justify-center gap-4">
                    {!showQuizResult ? (
                      <Button
                        variant="primary"
                        onClick={submitQuizAnswer}
                        disabled={selectedAnswer === null}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <div className="flex gap-4">
                        <Button variant="secondary" onClick={restartAudio}>
                          Replay Audio
                        </Button>
                        {currentAudioIndex < totalAudios - 1 && (
                          <Button variant="primary" onClick={nextAudio}>
                            Next Audio
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}