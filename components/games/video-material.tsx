'use client'

import { useState, useEffect } from 'react'
import { X, Video, Play, Pause, RotateCcw, CheckCircle, Clock, Volume2, VolumeX, Maximize } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import { cn } from '@/lib/utils'

interface VideoMaterialProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

interface VideoFile {
  id: string
  title: string
  description: string
  duration: number // in seconds
  thumbnail: string
  question: {
    question: string
    options: string[]
    correctAnswer: number
  }
}

const videoFiles: VideoFile[] = [
  {
    id: 'video-1',
    title: 'Introduction to AI',
    description: 'Visual overview of artificial intelligence concepts and history',
    duration: 195, // 3.25 minutes
    thumbnail: 'https://via.placeholder.com/800x450/7B00FF/FFFFFF?text=AI+Introduction',
    question: {
      question: 'What decade saw the birth of artificial intelligence as a field?',
      options: [
        '1940s',
        '1950s',
        '1960s',
        '1970s'
      ],
      correctAnswer: 1
    }
  },
  {
    id: 'video-2',
    title: 'Machine Learning Explained',
    description: 'Visual demonstration of how machine learning algorithms work',
    duration: 225, // 3.75 minutes
    thumbnail: 'https://via.placeholder.com/800x450/7B00FF/FFFFFF?text=Machine+Learning',
    question: {
      question: 'Which type of machine learning was demonstrated with the spam detection example?',
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
    id: 'video-3',
    title: 'Neural Networks Visualization',
    description: 'Animated explanation of how neural networks process information',
    duration: 240, // 4 minutes
    thumbnail: 'https://via.placeholder.com/800x450/7B00FF/FFFFFF?text=Neural+Networks',
    question: {
      question: 'In the video, how many layers did the example neural network have?',
      options: [
        '2 layers (input and output)',
        '3 layers (input, hidden, output)',
        '4 layers (input, 2 hidden, output)',
        '5 layers (input, 3 hidden, output)'
      ],
      correctAnswer: 2
    }
  },
  {
    id: 'video-4',
    title: 'AI in Real World',
    description: 'Examples of AI applications in healthcare, transportation, and more',
    duration: 210, // 3.5 minutes
    thumbnail: 'https://via.placeholder.com/800x450/7B00FF/FFFFFF?text=AI+Applications',
    question: {
      question: 'Which industry was NOT mentioned as using AI in the video?',
      options: [
        'Healthcare',
        'Transportation',
        'Agriculture',
        'Entertainment'
      ],
      correctAnswer: 2
    }
  },
  {
    id: 'video-5',
    title: 'Future of AI',
    description: 'Exploring the potential and challenges of AI development',
    duration: 255, // 4.25 minutes
    thumbnail: 'https://via.placeholder.com/800x450/7B00FF/FFFFFF?text=Future+of+AI',
    question: {
      question: 'According to the video, what is the main challenge for AI development?',
      options: [
        'Lack of computing power',
        'Insufficient data',
        'Ethical considerations and bias',
        'Programming complexity'
      ],
      correctAnswer: 2
    }
  }
]

export function VideoMaterial({ lessonId, onClose, onComplete }: VideoMaterialProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set())
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

  const currentVideo = videoFiles[currentVideoIndex]
  const totalVideos = videoFiles.length
  const progressPercentage = Math.round((completedVideos.size / totalVideos) * 100)

  // Simulate video playback
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentVideo.duration) {
            setIsPlaying(false)
            setShowQuiz(true)
            return currentVideo.duration
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentVideo.duration])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const restartVideo = () => {
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

  const selectVideo = (index: number) => {
    setCurrentVideoIndex(index)
    setCurrentTime(0)
    setIsPlaying(false)
    setShowQuiz(false)
    setSelectedAnswer(null)
    setShowQuizResult(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const submitQuizAnswer = () => {
    if (selectedAnswer === null) return
    
    const isCorrect = selectedAnswer === currentVideo.question.correctAnswer
    setQuizResults(prev => ({ ...prev, [currentVideo.id]: isCorrect }))
    setShowQuizResult(true)
    
    // Mark video as completed
    setCompletedVideos(prev => new Set([...prev, currentVideo.id]))
  }

  const nextVideo = () => {
    if (currentVideoIndex < totalVideos - 1) {
      selectVideo(currentVideoIndex + 1)
    }
  }

  const handleComplete = () => {
    const correctAnswers = Object.values(quizResults).filter(Boolean).length
    const finalScore = Math.round((correctAnswers / totalVideos) * 100)
    onComplete(finalScore)
  }

  const handleCloseAttempt = () => {
    onClose()
  }

  const videoProgressPercentage = (currentTime / currentVideo.duration) * 100

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal"> {/* rgba(0, 0, 0, 0.5) */}
      <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col"> {/* #FFFFFF */}
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Video className="h-5 w-5 text-text-brand" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Video Learning Materials</h2>
              <div className="flex items-center gap-4 mt-1">
                <Badge variant="info" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.round(videoFiles.reduce((acc, video) => acc + video.duration, 0) / 60)} min total
                </Badge>
                <span className="text-sm text-text-secondary">
                  {completedVideos.size} of {totalVideos} completed
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {completedVideos.size === totalVideos && (
              <Button variant="primary" onClick={handleComplete}>
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
        <div className="px-6 py-3 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Course Progress</span>
            <span className="text-sm font-medium text-text-brand">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar - Video List */}
          <div className="w-64 border-r border-border-subtle bg-bg-secondary p-4 overflow-y-auto">
            <h3 className="font-semibold text-text-primary mb-4">Video Lessons</h3>
            
            <div className="space-y-2">
              {videoFiles.map((video, index) => (
                <div
                  key={video.id}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer transition-all text-sm",
                    index === currentVideoIndex && "bg-text-brand text-white",
                    completedVideos.has(video.id) && index !== currentVideoIndex && "bg-bg-success-light text-text-success",
                    index !== currentVideoIndex && !completedVideos.has(video.id) && "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                  )}
                  onClick={() => selectVideo(index)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{video.title}</span>
                    {completedVideos.has(video.id) && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                  <p className="text-xs opacity-75">{formatTime(video.duration)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {!showQuiz ? (
              <>
                {/* Video Player */}
                <div className="p-6 border-b border-border-subtle">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-4">
                      <Badge variant="brand" className="mb-2">
                        Video {currentVideoIndex + 1} of {totalVideos}
                      </Badge>
                      <h1 className="text-2xl font-bold text-text-primary mb-2">
                        {currentVideo.title}
                      </h1>
                      <p className="text-text-secondary">{currentVideo.description}</p>
                    </div>

                    {/* Video Player */}
                    <Card className="mb-4">
                      <CardContent className="p-0">
                        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                          {/* Video Thumbnail/Placeholder */}
                          <div className="absolute inset-0 bg-gradient-to-br from-text-brand to-text-brand-light flex items-center justify-center">
                            <div className="text-center text-white">
                              <Video className="h-16 w-16 mx-auto mb-4 opacity-80" />
                              <p className="text-lg font-semibold mb-2">{currentVideo.title}</p>
                              <p className="text-sm opacity-75">{formatTime(currentTime)} / {formatTime(currentVideo.duration)}</p>
                            </div>
                          </div>

                          {/* Video Controls Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <Progress value={videoProgressPercentage} className="h-1" />
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={togglePlayPause}
                                  className="text-white hover:bg-white/20"
                                >
                                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={restartVideo}
                                  className="text-white hover:bg-white/20"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleMute}
                                    className="text-white hover:bg-white/20"
                                  >
                                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                  </Button>
                                  
                                  <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-white transition-all"
                                      style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-white text-sm">
                                  {formatTime(currentTime)} / {formatTime(currentVideo.duration)}
                                </span>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={toggleFullscreen}
                                  className="text-white hover:bg-white/20"
                                >
                                  <Maximize className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                      Question for: {currentVideo.title}
                    </h2>
                  </div>

                  <Card className="p-6 mb-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">
                        {currentVideo.question.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {currentVideo.question.options.map((option, index) => (
                          <div
                            key={index}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer transition-all",
                              selectedAnswer === index && !showQuizResult && "border-text-brand bg-bg-brand-light",
                              showQuizResult && index === currentVideo.question.correctAnswer && "border-text-success bg-bg-success-light",
                              showQuizResult && selectedAnswer === index && index !== currentVideo.question.correctAnswer && "border-text-error bg-bg-error-light",
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
                            quizResults[currentVideo.id] ? "text-text-success" : "text-text-error"
                          )}>
                            {quizResults[currentVideo.id] ? "✓ Correct!" : "✗ Incorrect"}
                          </p>
                          {!quizResults[currentVideo.id] && (
                            <p className="text-text-secondary text-sm mt-1">
                              The correct answer was: {currentVideo.question.options[currentVideo.question.correctAnswer]}
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
                        <Button variant="secondary" onClick={restartVideo}>
                          Replay Video
                        </Button>
                        {currentVideoIndex < totalVideos - 1 && (
                          <Button variant="primary" onClick={nextVideo}>
                            Next Video
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
            <span>Progress: {completedVideos.size}/{totalVideos} videos completed</span>
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
              onClick={() => onComplete(Math.round((completedVideos.size / totalVideos) * 100))}
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