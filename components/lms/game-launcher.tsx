'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FlashcardGame } from './flashcard-game'
import { MillionaireGame } from './millionaire-game'
import { JeopardyGame } from './jeopardy-game'
import { ConnectCardsGame } from './connect-cards-game'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileText, Video, Volume2, MessageSquare, X, CheckCircle, Upload, Play, Pause, Clock, List } from 'lucide-react'
import type { Lesson } from '@/lib/lms/new-course-types'

interface GameLauncherProps {
  gameTypeId: string
  lesson: Lesson
  onComplete: (result: any) => void
  onQuit: () => void
}

export function GameLauncher({ gameTypeId, lesson, onComplete, onQuit }: GameLauncherProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)

  // Prevent body scroll when game is active
  useEffect(() => {
    // Store original body styles
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width
    
    // Get current scroll position
    const scrollY = window.scrollY
    
    // Prevent background scrolling and interaction
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
  // Mock data for games - in production, this would come from the lesson data
  // Generate 15 flashcards with variations
  const mockFlashcardDeck = {
    id: 'deck-1',
    title: lesson.title,
    description: lesson.description,
    cards: Array.from({ length: 15 }, (_, i) => {
      const kpIndex = i % lesson.knowledgePoints.length
      const kp = lesson.knowledgePoints[kpIndex]
      const variations = [
        { front: kp.title, back: kp.description },
        { front: `Define: ${kp.title}`, back: `${kp.description} This concept is fundamental to understanding the lesson.` },
        { front: `What is the purpose of ${kp.title}?`, back: `${kp.description} It helps in achieving better understanding of the subject matter.` },
        { front: `Explain ${kp.title} in simple terms`, back: `In simple terms: ${kp.description}` },
        { front: `Key aspects of ${kp.title}`, back: `The main aspects are: ${kp.description}` }
      ]
      const variation = variations[Math.floor(i / lesson.knowledgePoints.length) % variations.length]
      
      return {
        id: `card-${i}`,
        front: variation.front,
        back: variation.back,
        hint: `Think about the key aspects of ${kp.title.toLowerCase()}`,
        difficulty: i < 5 ? 'easy' : i < 10 ? 'medium' : 'hard'
      }
    }),
    totalCards: 15,
    estimatedTime: 10,
    category: 'AI Fundamentals'
  }

  // Generate 15 questions for the full money ladder
  const mockMillionaireQuestions = Array.from({ length: 15 }, (_, index) => {
    const kp = lesson.knowledgePoints[index % lesson.knowledgePoints.length]
    const questionTypes = [
      {
        question: `What is ${kp.title}?`,
        answers: {
          A: kp.description,
          B: 'An incorrect definition that sounds plausible',
          C: 'Another wrong answer that might confuse',
          D: 'A completely unrelated concept'
        },
        correctAnswer: 'A' as const
      },
      {
        question: `Which statement best describes ${kp.title}?`,
        answers: {
          A: 'A misleading but technical-sounding description',
          B: kp.description,
          C: 'A partially correct but incomplete answer',
          D: 'An outdated or obsolete definition'
        },
        correctAnswer: 'B' as const
      },
      {
        question: `In the context of ${lesson.title}, what role does ${kp.title} play?`,
        answers: {
          A: 'A secondary or supporting concept',
          B: 'An unrelated principle',
          C: kp.description,
          D: 'A conflicting or opposite approach'
        },
        correctAnswer: 'C' as const
      },
      {
        question: `Which of the following is NOT true about ${kp.title}?`,
        answers: {
          A: kp.description,
          B: 'It is a fundamental concept in this field',
          C: 'It helps in understanding related topics',
          D: 'It contradicts established principles'
        },
        correctAnswer: 'D' as const
      }
    ]
    
    const selectedQuestion = questionTypes[index % questionTypes.length]
    
    return {
      id: `q-${index}`,
      ...selectedQuestion,
      difficulty: index + 1
    }
  })

  // Generate Jeopardy categories with 5 clues each
  const mockJeopardyCategories = [
    {
      name: "Fundamentals",
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[i % lesson.knowledgePoints.length]
        return {
          id: `clue-1-${i}`,
          category: "Fundamentals",
          value: (i + 1) * 200,
          clue: kp.description,
          answer: kp.title,
          isDailyDouble: i === 2 && Math.random() > 0.7
        }
      })
    },
    {
      name: "Applications",
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[(i + 1) % lesson.knowledgePoints.length]
        return {
          id: `clue-2-${i}`,
          category: "Applications",
          value: (i + 1) * 200,
          clue: `How is ${kp.title} applied in practice?`,
          answer: kp.description,
          isDailyDouble: i === 3 && Math.random() > 0.7
        }
      })
    },
    {
      name: "Key Concepts",
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[(i + 2) % lesson.knowledgePoints.length]
        return {
          id: `clue-3-${i}`,
          category: "Key Concepts",
          value: (i + 1) * 200,
          clue: `This concept ${kp.description.toLowerCase()}`,
          answer: `What is ${kp.title}?`,
          isDailyDouble: i === 1 && Math.random() > 0.7
        }
      })
    },
    {
      name: lesson.title,
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[(i + 3) % lesson.knowledgePoints.length]
        return {
          id: `clue-4-${i}`,
          category: lesson.title,
          value: (i + 1) * 200,
          clue: `The main purpose of ${kp.title}`,
          answer: kp.description,
          isDailyDouble: i === 4 && Math.random() > 0.7
        }
      })
    },
    {
      name: "Advanced Topics",
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[(i + 4) % lesson.knowledgePoints.length]
        return {
          id: `clue-5-${i}`,
          category: "Advanced Topics",
          value: (i + 1) * 200,
          clue: `An advanced application of ${kp.title}`,
          answer: `${kp.description} in complex scenarios`,
          isDailyDouble: false
        }
      })
    }
  ]

  const mockConnectPairs = lesson.knowledgePoints.map((kp, index) => ({
    matchId: `match-${index}`,
    leftCard: { 
      id: `l-${index}`, 
      content: kp.title,
      matchId: `match-${index}`,
      side: 'left' as const,
      type: 'text' as const
    },
    rightCard: { 
      id: `r-${index}`, 
      content: kp.description,
      matchId: `match-${index}`,
      side: 'right' as const,
      type: 'text' as const
    }
  }))

  // Render the game content
  let gameContent = null

  // Content viewers
  if (gameTypeId === 'written-material') {
    gameContent = (
      <div className="fixed inset-0 bg-gray-100 flex flex-col z-[9999]">
        {/* Simple Header */}
        <div className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{lesson.title}</h2>
              <Button variant="ghost" size="sm" onClick={onQuit}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* PDF-style Content */}
        <div className="flex-1 overflow-auto bg-gray-600 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Mock PDF Pages */}
            <div className="bg-white shadow-2xl mb-4" style={{ minHeight: '1056px', padding: '72px' }}>
              <h1 className="text-3xl font-bold text-black mb-8">Introduction to Artificial Intelligence</h1>
              
              <p className="text-gray-800 mb-6 leading-relaxed">
                Artificial Intelligence (AI) represents one of the most transformative technologies of our time. This document provides a comprehensive overview of AI concepts, applications, and implications for the future.
              </p>

              <h2 className="text-2xl font-semibold text-black mt-12 mb-4">Chapter 1: What is Artificial Intelligence?</h2>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                Artificial Intelligence refers to the simulation of human intelligence in machines that are programmed to think and learn. These systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.
              </p>

              <p className="text-gray-800 mb-4 leading-relaxed">
                The field of AI research was founded on the assumption that human intelligence can be so precisely described that a machine can be made to simulate it. This notion, proposed in the 1950s, has evolved significantly over the decades.
              </p>

              <h3 className="text-xl font-semibold text-black mt-8 mb-3">1.1 Types of Artificial Intelligence</h3>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                AI can be categorized into three main types:
              </p>

              <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2 ml-6">
                <li><strong>Narrow AI (ANI):</strong> Designed to perform a specific task, such as facial recognition or internet searches.</li>
                <li><strong>General AI (AGI):</strong> Possesses the ability to understand, learn, and apply knowledge across different domains, similar to human intelligence.</li>
                <li><strong>Superintelligent AI (ASI):</strong> Surpasses human intelligence and ability in all aspects, from creativity to general wisdom.</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mt-8 mb-3">1.2 Core Components of AI</h3>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                Modern AI systems rely on several key components:
              </p>

              <ul className="list-disc list-inside mb-6 text-gray-800 space-y-2 ml-6">
                <li><strong>Machine Learning:</strong> Algorithms that improve through experience without being explicitly programmed.</li>
                <li><strong>Neural Networks:</strong> Computing systems inspired by biological neural networks in animal brains.</li>
                <li><strong>Natural Language Processing:</strong> Enabling machines to understand and respond to human language.</li>
                <li><strong>Computer Vision:</strong> Allowing machines to interpret and understand visual information from the world.</li>
              </ul>

              <div className="text-center text-gray-400 text-sm mt-auto pt-16">
                Page 1
              </div>
            </div>

            {/* Page 2 */}
            <div className="bg-white shadow-2xl mb-4" style={{ minHeight: '1056px', padding: '72px' }}>
              <h2 className="text-2xl font-semibold text-black mb-4">Chapter 2: Applications of AI</h2>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                AI has found applications across virtually every industry, revolutionizing how we work, communicate, and solve complex problems.
              </p>

              <h3 className="text-xl font-semibold text-black mt-8 mb-3">2.1 Healthcare</h3>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                In healthcare, AI assists in diagnosis, drug discovery, personalized treatment plans, and patient monitoring. Machine learning algorithms can analyze medical images to detect diseases like cancer at early stages, often with greater accuracy than human specialists.
              </p>

              <h3 className="text-xl font-semibold text-black mt-8 mb-3">2.2 Transportation</h3>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                Self-driving cars represent one of the most visible applications of AI in transportation. These vehicles use a combination of sensors, cameras, and AI algorithms to navigate roads, avoid obstacles, and make split-second decisions.
              </p>

              <h3 className="text-xl font-semibold text-black mt-8 mb-3">2.3 Finance</h3>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                Financial institutions use AI for fraud detection, algorithmic trading, credit scoring, and customer service. AI-powered chatbots handle customer inquiries, while sophisticated algorithms analyze market patterns to make investment decisions.
              </p>

              <h3 className="text-xl font-semibold text-black mt-8 mb-3">2.4 Education</h3>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                AI personalizes learning experiences by adapting to individual student needs, providing instant feedback, and identifying areas where students need additional support. Virtual tutors and automated grading systems are becoming increasingly common.
              </p>

              <h2 className="text-2xl font-semibold text-black mt-12 mb-4">Chapter 3: The Future of AI</h2>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                As we look to the future, AI promises both tremendous opportunities and significant challenges. The technology continues to advance at a rapid pace, with breakthroughs in quantum computing, neuromorphic chips, and advanced algorithms pushing the boundaries of what's possible.
              </p>

              <p className="text-gray-800 mb-4 leading-relaxed">
                However, with these advances come important considerations about ethics, privacy, job displacement, and the need for responsible AI development. Ensuring that AI benefits all of humanity while minimizing potential harms remains one of our greatest challenges.
              </p>

              <div className="text-center text-gray-400 text-sm mt-auto pt-16">
                Page 2
              </div>
            </div>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="bg-white border-t shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Viewing: Introduction to AI (2 pages)
              </div>
              <Button 
                onClick={() => onComplete({ completed: true })} 
                className="bg-vergil-purple hover:bg-vergil-purple-lighter text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Reading
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (gameTypeId === 'video') {
    const [videoPlaying, setVideoPlaying] = useState(false)
    const [videoTime, setVideoTime] = useState(0)
    const videoDuration = 420 // 7 minutes mock video
    
    // Simulate video progress
    useEffect(() => {
      if (videoPlaying && videoTime < videoDuration) {
        const timer = setInterval(() => {
          setVideoTime(prev => Math.min(prev + 1, videoDuration))
        }, 1000)
        return () => clearInterval(timer)
      }
    }, [videoPlaying, videoTime])
    
    const formatVideoTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    
    gameContent = (
      <div className="fixed inset-0 bg-black flex flex-col z-[9999]">
        {/* Video Header */}
        <div className="bg-black/90 backdrop-blur z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{lesson.title}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onQuit} 
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative w-full max-w-6xl mx-auto px-6">
            {/* Mock Video Screen */}
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              {/* Video Thumbnail/Content */}
              <div className="absolute inset-0 bg-gradient-to-br from-vergil-purple/20 to-blue-600/20 flex items-center justify-center">
                {!videoPlaying ? (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/20 transition-colors"
                         onClick={() => setVideoPlaying(true)}>
                      <Play className="w-10 h-10 text-white ml-2" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Introduction to {lesson.title}</h3>
                    <p className="text-white/80">Click to play video • {formatVideoTime(videoDuration)}</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-32 h-32 text-white/20 mx-auto mb-4" />
                      <p className="text-white/60 text-lg">Video is playing...</p>
                      <p className="text-white/40 mt-2">Mock educational content about {lesson.title}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={() => setVideoPlaying(!videoPlaying)}
                    className="text-white hover:text-vergil-purple transition-colors"
                  >
                    {videoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="bg-white/20 rounded-full h-1 relative">
                      <div 
                        className="bg-vergil-purple h-full rounded-full transition-all duration-300"
                        style={{ width: `${(videoTime / videoDuration) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatVideoTime(videoTime)} / {formatVideoTime(videoDuration)}
                  </span>
                  
                  <Volume2 className="w-5 h-5 text-white/60" />
                </div>
              </div>
            </div>
            
            {/* Video Info Below */}
            <div className="mt-6 bg-gray-900/50 backdrop-blur rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">About this video</h3>
              <p className="text-white/70 mb-4">{lesson.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {formatVideoTime(videoDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span>{lesson.knowledgePoints.length} key concepts covered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-black/90 backdrop-blur border-t border-white/10 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/60">
                {videoTime > 0 ? `Watched ${Math.round((videoTime / videoDuration) * 100)}%` : 'Video not started'}
              </div>
              <Button 
                onClick={() => onComplete({ completed: true, watchTime: videoTime })} 
                className="bg-vergil-purple hover:bg-vergil-purple-lighter text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (gameTypeId === 'audio-material') {
    // Mock audio chapters based on lesson content
    const audioChapters = [
      { 
        id: 1, 
        title: "Introduction", 
        start: 0, 
        duration: 120, 
        summary: `Overview of ${lesson.title} and what you'll learn in this audio lesson.`
      },
      ...lesson.knowledgePoints.map((kp, index) => ({
        id: index + 2,
        title: kp.title,
        start: 120 + (index * 180),
        duration: 180,
        summary: kp.description
      })),
      {
        id: lesson.knowledgePoints.length + 2,
        title: "Summary & Conclusion",
        start: 120 + (lesson.knowledgePoints.length * 180),
        duration: 90,
        summary: "Key takeaways and next steps for applying what you've learned."
      }
    ]
    
    const totalDuration = audioChapters.reduce((acc, ch) => acc + ch.duration, 0)
    
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    
    const handleChapterClick = (chapter: typeof audioChapters[0]) => {
      setCurrentTime(chapter.start)
      setSelectedChapter(chapter.id)
      setIsPlaying(true)
    }
    
    // Simulate audio progress
    useEffect(() => {
      if (isPlaying && currentTime < totalDuration) {
        const timer = setInterval(() => {
          setCurrentTime(prev => Math.min(prev + 1, totalDuration))
        }, 1000)
        return () => clearInterval(timer)
      }
    }, [isPlaying, currentTime, totalDuration])
    
    // Update selected chapter based on current time
    useEffect(() => {
      const currentChapter = audioChapters.find((ch, index) => {
        const nextChapter = audioChapters[index + 1]
        const chapterEnd = nextChapter ? nextChapter.start : totalDuration
        return currentTime >= ch.start && currentTime < chapterEnd
      })
      if (currentChapter) {
        setSelectedChapter(currentChapter.id)
      }
    }, [currentTime])
    
    gameContent = (
      <div className="fixed inset-0 bg-gray-100 flex flex-col z-[9999]">
        {/* Fixed Header */}
        <div className="bg-vergil-off-black shadow-lg z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-vergil-off-white">{lesson.title}</h2>
              <Button variant="ghost" size="sm" onClick={onQuit} className="text-vergil-off-white hover:bg-vergil-off-white/10">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            <Card className="overflow-hidden">
              {/* Audio Player - Fixed at top of card */}
              <div className="bg-white border-b sticky top-0 z-10 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-vergil-purple/20 rounded-lg">
                    <Volume2 className="w-6 h-6 text-vergil-purple" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-vergil-off-black">Audio Lesson</h3>
                    <p className="text-vergil-off-black/60 text-sm">{formatTime(totalDuration)} total duration</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full w-14 h-14 p-0"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </Button>
                      <div>
                        <p className="text-sm font-medium text-vergil-off-black">
                          {audioChapters.find(ch => ch.id === selectedChapter)?.title || 'Select a chapter'}
                        </p>
                        <p className="text-xs text-vergil-off-black/60">
                          {formatTime(currentTime)} / {formatTime(totalDuration)}
                        </p>
                      </div>
                    </div>
                    <Volume2 className="w-5 h-5 text-vergil-off-black/40" />
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-300 rounded-full h-2 relative">
                    <div 
                      className="bg-vergil-purple h-full rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                    />
                    {/* Chapter markers */}
                    {audioChapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-vergil-off-black/30"
                        style={{ left: `${(chapter.start / totalDuration) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Scrollable Chapters List */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <List className="w-5 h-5 text-vergil-purple" />
                  <h3 className="text-lg font-semibold text-vergil-off-black">Chapters</h3>
                </div>
                
                <div className="space-y-3">
                  {audioChapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterClick(chapter)}
                      className={`w-full text-left p-4 rounded-lg border transition-all hover:border-vergil-purple/40 ${
                        selectedChapter === chapter.id
                          ? 'bg-vergil-purple/10 border-vergil-purple'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-sm font-medium ${
                              selectedChapter === chapter.id ? 'text-vergil-purple' : 'text-vergil-off-black/60'
                            }`}>
                              Chapter {chapter.id}
                            </span>
                            <h4 className={`font-medium ${
                              selectedChapter === chapter.id ? 'text-vergil-purple' : 'text-vergil-off-black'
                            }`}>
                              {chapter.title}
                            </h4>
                          </div>
                          <p className="text-sm text-vergil-off-black/60 line-clamp-2">{chapter.summary}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Clock className="w-4 h-4 text-vergil-off-black/40" />
                          <span className="text-sm text-vergil-off-black/60">{formatTime(chapter.duration)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-white border-t shadow-lg z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-vergil-off-black/60">
                <CheckCircle className="w-4 h-4" />
                <span>Listen to all chapters to complete</span>
              </div>
              <Button 
                onClick={() => onComplete({ completed: true, timeListened: currentTime })} 
                className="bg-vergil-purple hover:bg-vergil-purple-lighter text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Audio
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    // Game components
    switch (gameTypeId) {
      case 'flashcards':
        gameContent = <FlashcardGame deck={mockFlashcardDeck} onComplete={onComplete} onQuit={onQuit} />
        break
      
      case 'millionaire':
        gameContent = <MillionaireGame questions={mockMillionaireQuestions} onGameEnd={(winnings, status) => onComplete({ winnings, status })} />
        break
      
      case 'jeopardy':
        gameContent = <JeopardyGame categories={mockJeopardyCategories} onGameEnd={(finalScore) => onComplete({ score: finalScore })} />
        break
      
      case 'connect-cards':
        gameContent = <ConnectCardsGame pairs={mockConnectPairs} onComplete={onComplete} onQuit={onQuit} />
        break
      
      default:
        gameContent = (
          <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-[9999]">
            <div className="max-w-4xl mx-auto p-6">
              <Card className="p-8 text-center bg-white">
                <h2 className="text-2xl font-bold text-vergil-off-black mb-4">Game Not Available</h2>
                <p className="text-vergil-off-black/60 mb-6">This learning method is not available yet.</p>
                <Button onClick={onQuit} variant="outline">Back to Selection</Button>
              </Card>
            </div>
          </div>
        )
    }
  }

  // Wrap everything in a portal
  if (typeof window === 'undefined') return null
  
  return createPortal(
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {gameContent}
    </div>,
    document.body
  )
}