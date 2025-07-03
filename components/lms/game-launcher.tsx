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
import { useGameContent } from '@/app/lms/new_course_overview/hooks/useGameContent'

interface GameLauncherProps {
  gameTypeId: string
  lesson: Lesson
  onComplete: (result: any) => void
  onQuit: () => void
}

export function GameLauncher({ gameTypeId, lesson, onComplete, onQuit }: GameLauncherProps) {
  // Load content from API
  const { content, loading, error } = useGameContent(lesson.id, gameTypeId)
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
  // Use content from API or generate fallback data
  const getFlashcardDeck = () => {
    if (content?.content) {
      return content.content
    }
    // Fallback mock data if content not loaded
    return {
      id: 'deck-1',
      title: lesson.title,
      description: lesson.description,
      cards: lesson.knowledgePoints.map((kp, i) => ({
        id: `card-${i}`,
        front: kp.title,
        back: kp.description,
        hint: `Think about the key aspects of ${kp.title.toLowerCase()}`,
        difficulty: 'medium'
      })),
      totalCards: lesson.knowledgePoints.length,
      estimatedTime: 10,
      category: 'General'
    }
  }

  const getMillionaireQuestions = () => {
    if (content?.content?.questions) {
      return content.content.questions
    }
    // Fallback mock data if content not loaded
    return lesson.knowledgePoints.slice(0, 15).map((kp, index) => ({
      id: `q-${index}`,
      question: `What is ${kp.title}?`,
      answers: {
        A: kp.description,
        B: 'An incorrect answer',
        C: 'Another incorrect answer',
        D: 'A third incorrect answer'
      },
      correctAnswer: 'A' as const,
      difficulty: index + 1
    }))
  }

  const getJeopardyCategories = () => {
    if (content?.content?.categories) {
      return content.content.categories
    }
    // Fallback mock data if content not loaded
    return [{
      name: lesson.title,
      clues: lesson.knowledgePoints.slice(0, 5).map((kp, i) => ({
        id: `clue-${i}`,
        category: lesson.title,
        value: (i + 1) * 200,
        clue: kp.description,
        answer: kp.title,
        isDailyDouble: false
      }))
    }]
  }

  const getConnectPairs = () => {
    if (content?.content?.pairs) {
      return content.content.pairs
    }
    // Fallback mock data if content not loaded
    return lesson.knowledgePoints.map((kp, index) => ({
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
  }

  // Show loading state
  if (loading) {
    return createPortal(
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vergil-purple mx-auto mb-4"></div>
          <p className="text-white">Loading content...</p>
        </div>
      </div>,
      document.body
    )
  }

  // Show error state
  if (error) {
    return createPortal(
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center">
        <Card className="p-8 text-center bg-white max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Content</h2>
          <p className="text-vergil-off-black/60 mb-6">{error}</p>
          <Button onClick={onQuit} variant="outline">Back to Selection</Button>
        </Card>
      </div>,
      document.body
    )
  }

  // Render the game content
  let gameContent = null

  // Block disabled content types
  if (['video', 'audio-material'].includes(gameTypeId)) {
    gameContent = (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-[9999]">
        <div className="max-w-4xl mx-auto p-6">
          <Card className="p-8 text-center bg-white">
            <h2 className="text-2xl font-bold text-vergil-off-black mb-4">Coming Soon</h2>
            <p className="text-vergil-off-black/60 mb-6">{gameTypeId.replace('-', ' ')} content is currently under development.</p>
            <Button onClick={onQuit} variant="outline">Back to Selection</Button>
          </Card>
        </div>
      </div>
    )
  }
  // Handle loading and error states for content types first
  else if (['written-material'].includes(gameTypeId)) {
    if (loading) {
      gameContent = (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-[9999]">
          <div className="max-w-4xl mx-auto p-6">
            <Card className="p-8 text-center bg-white">
              <h2 className="text-2xl font-bold text-vergil-off-black mb-4">Loading Content...</h2>
              <p className="text-vergil-off-black/60 mb-6">Please wait while we load the {gameTypeId.replace('-', ' ')} content.</p>
              <Button onClick={onQuit} variant="outline">Cancel</Button>
            </Card>
          </div>
        </div>
      )
    } else if (error) {
      gameContent = (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-[9999]">
          <div className="max-w-4xl mx-auto p-6">
            <Card className="p-8 text-center bg-white">
              <h2 className="text-2xl font-bold text-vergil-off-black mb-4">Content Not Available</h2>
              <p className="text-vergil-off-black/60 mb-6">Sorry, we couldn't load the content: {error}</p>
              <Button onClick={onQuit} variant="outline">Back to Selection</Button>
            </Card>
          </div>
        </div>
      )
    }
  }

  // Content viewers
  if (gameTypeId === 'written-material' && content) {
    const pages = content.content?.pages || []
    const title = content.content?.title || lesson.title
    
    gameContent = (
      <div className="fixed inset-0 bg-gray-100 flex flex-col z-[9999]">
        {/* Simple Header */}
        <div className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              <Button variant="ghost" size="sm" onClick={onQuit}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* PDF-style Content */}
        <div className="flex-1 overflow-auto bg-gray-600 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Render each page from the JSON content */}
            {pages.map((page: any, index: number) => (
              <div key={index} className="bg-white shadow-2xl mb-4" style={{ minHeight: '1056px', padding: '72px' }}>
                <div 
                  className="prose prose-lg max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-black [&_h1]:mb-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-gray-800 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-6 [&_ul]:text-gray-800 [&_ul]:space-y-2 [&_ul]:ml-6 [&_li]:text-gray-800 [&_strong]:font-semibold [&_strong]:text-black"
                  dangerouslySetInnerHTML={{ __html: page.content }} 
                />
                <div className="text-center text-gray-400 text-sm mt-auto pt-16">
                  Page {page.pageNumber || index + 1}
                </div>
              </div>
            ))}
            
            {/* Fallback if no pages */}
            {pages.length === 0 && (
              <div className="bg-white shadow-2xl mb-4 p-16 text-center">
                <p className="text-gray-600">No content available for this lesson.</p>
              </div>
            )}
          </div>
        </div>

        {/* Simple Footer */}
        <div className="bg-white border-t shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Viewing: {title} ({pages.length} pages)
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
        gameContent = <FlashcardGame deck={getFlashcardDeck()} onComplete={onComplete} onQuit={onQuit} lessonId={lesson.id} />
        break
      
      case 'millionaire':
        gameContent = <MillionaireGame questions={getMillionaireQuestions()} onGameEnd={(winnings, status) => onComplete({ winnings, status })} lessonId={lesson.id} />
        break
      
      case 'jeopardy':
        gameContent = <JeopardyGame categories={getJeopardyCategories()} onGameEnd={(finalScore) => onComplete({ score: finalScore })} />
        break
      
      case 'connect-cards':
        gameContent = <ConnectCardsGame pairs={getConnectPairs()} onComplete={onComplete} onQuit={onQuit} lessonId={lesson.id} />
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