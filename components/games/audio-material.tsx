'use client'

import { useState, useEffect } from 'react'
import { X, Volume2, CheckCircle, Clock, Mic, Headphones } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import TTSButtonEnhanced from '@/components/Voice/TTSButtonEnhanced'
import TTSButtonStream from '@/components/Voice/TTSButtonStream'
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
  const [hasListened, setHasListened] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)
  const [completedAudios, setCompletedAudios] = useState<Set<string>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean }>({})
  const [showQuizResult, setShowQuizResult] = useState(false)

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

  const currentAudio = audioFiles[currentAudioIndex]
  const totalAudios = audioFiles.length
  const progressPercentage = Math.round((completedAudios.size / totalAudios) * 100)

  const handleAudioEnd = () => {
    setHasListened(true)
    setTimeout(() => {
      setShowQuiz(true)
    }, 1000)
  }

  const restartAudio = () => {
    setHasListened(false)
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
    setHasListened(false)
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

  const handleCloseAttempt = () => {
    onClose()
  }

  // Calculate overall progress including current audio listening status
  const currentProgress = completedAudios.size + (hasListened ? 0.5 : 0)
  const overallProgressPercentage = Math.round((currentProgress / totalAudios) * 100)

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal"> {/* rgba(0, 0, 0, 0.5) */}
      <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col"> {/* #FFFFFF */}
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Headphones className="h-5 w-5 text-text-brand" />
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
            
            <Button variant="ghost" size="sm" onClick={handleCloseAttempt} className="p-2 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-border-subtle bg-bg-secondary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Overall Progress</span>
            <span className="text-sm font-medium text-text-brand">{overallProgressPercentage}%</span>
          </div>
          <Progress value={overallProgressPercentage} className="h-2" />
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
                <div className="p-6">
                  <div className="max-w-4xl mx-auto">
                    {/* Audio Header */}
                    <Card className="mb-6">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-bg-brand-light rounded-lg">
                            <Volume2 className="h-6 w-6 text-text-brand" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h1 className="text-2xl font-bold text-text-primary">
                                {currentAudio.title}
                              </h1>
                              <Badge variant="primary">
                                Lesson {currentAudioIndex + 1} of {totalAudios}
                              </Badge>
                            </div>
                            <p className="text-text-secondary">{currentAudio.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Enhanced TTS Audio Player */}
                    <div className="space-y-4">
                      {/* Temporarily using streaming version for testing */}
                      <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{currentAudio.title}</h3>
                            <p className="text-sm text-text-secondary">Audio {currentAudioIndex + 1} of {totalAudios}</p>
                          </div>
                          <TTSButtonStream
                            key={`audio-${currentAudio.id}`}
                            text={currentAudio.transcript.trim()}
                            onPlayEnd={handleAudioEnd}
                          />
                        </div>
                        {showTranscript && (
                          <div className="mt-4 p-4 bg-bg-secondary rounded-lg">
                            <h4 className="text-sm font-medium text-text-secondary mb-2">Transcript</h4>
                            <p className="text-sm text-text-secondary whitespace-pre-line">
                              {currentAudio.transcript}
                            </p>
                          </div>
                        )}
                      </Card>
                      
                      {/* Toggle Transcript Button */}
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowTranscript(!showTranscript)}
                          className="text-text-secondary hover:text-text-primary"
                        >
                          {showTranscript ? 'Hide' : 'Show'} Transcript
                        </Button>
                        
                        {hasListened && !showQuiz && (
                          <div className="flex items-center gap-2 text-sm text-text-success animate-pulse">
                            <CheckCircle className="h-4 w-4" />
                            <span>Audio completed! Quiz will appear shortly...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Quiz Section */
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  {/* Quiz Header */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-bg-warning-light rounded-lg">
                          <Badge variant="warning" className="m-0">
                            Quiz Time
                          </Badge>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-text-primary">
                            Comprehension Check
                          </h2>
                          <p className="text-text-secondary">
                            Test your understanding of: {currentAudio.title}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 mb-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">
                        {currentAudio.question.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {currentAudio.question.options.map((option, index) => (
                          <label
                            key={index}
                            className={cn(
                              "block p-4 rounded-lg border cursor-pointer transition-all",
                              selectedAnswer === index && !showQuizResult && "border-text-brand bg-bg-brand-light",
                              showQuizResult && index === currentAudio.question.correctAnswer && "border-text-success bg-bg-success-light",
                              showQuizResult && selectedAnswer === index && index !== currentAudio.question.correctAnswer && "border-text-error bg-bg-error-light",
                              !showQuizResult && "hover:bg-bg-emphasis",
                              "border-border-subtle"
                            )}
                          >
                            <input
                              type="radio"
                              name="answer"
                              value={index}
                              checked={selectedAnswer === index}
                              onChange={() => setSelectedAnswer(index)}
                              disabled={showQuizResult}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                                selectedAnswer === index 
                                  ? "bg-text-brand text-white" 
                                  : "bg-bg-secondary text-text-secondary"
                              )}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="text-text-primary">{option}</span>
                            </div>
                          </label>
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-subtle bg-bg-secondary flex items-center justify-between"> {/* rgba(0,0,0,0.05), #F5F5F7 */}
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>Progress: {completedAudios.size}/{totalAudios} audios completed</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="md"
              onClick={handleCloseAttempt}
            >
              Close
            </Button>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => onComplete(Math.round((completedAudios.size / totalAudios) * 100))}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Mark as Completed
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}