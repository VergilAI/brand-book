'use client'

import { useState, useEffect } from 'react'
import { X, Volume2, CheckCircle, Clock, Mic, Headphones } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import TTSButtonEnhanced from '@/components/Voice/TTSButtonEnhanced'
import { cn } from '@/lib/utils'

interface AudioMaterialEnhancedProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

interface AudioFile {
  id: string
  title: string
  description: string
  duration: number
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
    duration: 180,
    transcript: `Welcome to our exploration of Artificial Intelligence. AI is the simulation of human intelligence in machines that are programmed to think and learn like humans. 

The concept of AI has been around for decades, but recent advances in computing power and data availability have made it more practical and widespread than ever before.

AI systems can perform tasks such as visual perception, speech recognition, decision-making, and language translation. These capabilities make AI incredibly valuable across many industries.`,
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
  }
]

export function AudioMaterialEnhanced({ lessonId, onClose, onComplete }: AudioMaterialEnhancedProps) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [hasListened, setHasListened] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [startTime] = useState(Date.now())

  const currentFile = audioFiles[currentFileIndex]

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handlePlayEnd = () => {
    setHasListened(true)
    // Auto-show question after audio ends
    setTimeout(() => {
      setShowQuestion(true)
    }, 1000)
  }

  const handleAnswer = () => {
    if (selectedAnswer === null) return
    
    const correct = selectedAnswer === currentFile.question.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    
    setTimeout(() => {
      if (currentFileIndex < audioFiles.length - 1) {
        // Move to next audio
        setCurrentFileIndex(prev => prev + 1)
        setHasListened(false)
        setShowQuestion(false)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        // Complete the lesson
        const timeSpent = Math.round((Date.now() - startTime) / 1000)
        const score = correct ? 100 : 50
        onComplete(score)
      }
    }, 2000)
  }

  const progressPercentage = ((currentFileIndex + (hasListened ? 1 : 0)) / (audioFiles.length * 2)) * 100

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal">
      <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-text-brand" />
            <h2 className="text-xl font-semibold text-text-primary">
              Audio Learning Materials
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Audio {currentFileIndex + 1} of {audioFiles.length}
            </Badge>
            
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

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-border-subtle bg-bg-secondary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Overall Progress</span>
            <span className="text-sm font-medium text-text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Audio Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-bg-brand-light rounded-lg">
                    <Volume2 className="h-6 w-6 text-text-brand" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      {currentFile.title}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {currentFile.description}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {Math.floor(currentFile.duration / 60)}:{(currentFile.duration % 60).toString().padStart(2, '0')} min
                  </Badge>
                </div>
                
                {/* Enhanced TTS Player */}
                <div className="space-y-4">
                  <TTSButtonEnhanced 
                    text={currentFile.transcript}
                    showTranscript={true}
                    onPlayStart={() => {}}
                    onPlayEnd={handlePlayEnd}
                    className="w-full"
                  />
                  
                  {hasListened && !showQuestion && (
                    <div className="flex items-center gap-2 text-sm text-text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span>Audio completed! Question will appear shortly...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Question Section */}
            {showQuestion && (
              <Card className={cn(
                "transition-all duration-500",
                showQuestion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-text-primary mb-4">
                    Comprehension Check
                  </h4>
                  <p className="text-text-secondary mb-4">
                    {currentFile.question.question}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {currentFile.question.options.map((option, index) => (
                      <label
                        key={index}
                        className={cn(
                          "block p-4 border rounded-lg cursor-pointer transition-all",
                          selectedAnswer === index && !showResult && "border-text-brand bg-bg-brand-light",
                          showResult && index === currentFile.question.correctAnswer && "border-text-success bg-bg-success-light",
                          showResult && selectedAnswer === index && index !== currentFile.question.correctAnswer && "border-text-error bg-bg-error-light",
                          !showResult && "hover:bg-bg-emphasis"
                        )}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={index}
                          checked={selectedAnswer === index}
                          onChange={() => setSelectedAnswer(index)}
                          disabled={showResult}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            selectedAnswer === index ? "border-text-brand" : "border-border-default"
                          )}>
                            {selectedAnswer === index && (
                              <div className="w-2 h-2 rounded-full bg-text-brand" />
                            )}
                          </div>
                          <span className="text-text-primary">{option}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {!showResult && (
                    <Button
                      variant="primary"
                      onClick={handleAnswer}
                      disabled={selectedAnswer === null}
                      className="w-full"
                    >
                      Submit Answer
                    </Button>
                  )}
                  
                  {showResult && (
                    <div className={cn(
                      "p-4 rounded-lg text-center",
                      isCorrect ? "bg-bg-success-light text-text-success" : "bg-bg-error-light text-text-error"
                    )}>
                      <p className="font-semibold">
                        {isCorrect ? "Correct! Well done!" : "Not quite right. Let's continue learning!"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {!hasListened && (
              <div className="mt-6 p-4 bg-bg-info-light border border-border-info rounded-lg">
                <p className="text-sm text-text-info flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Listen to the audio carefully. A comprehension question will appear after the audio ends.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}