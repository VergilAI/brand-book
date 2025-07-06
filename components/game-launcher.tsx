'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FlashcardGame } from './flashcard-game'
import { MillionaireGame } from './millionaire-game'
import { JeopardyGame } from './jeopardy-game'
import { ConnectCardsGame } from './connect-cards-game'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
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
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-tooltip flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-border-brand mx-auto mb-md"></div>
          <p className="text-text-inverse">Loading content...</p>
        </div>
      </div>,
      document.body
    )
  }

  // Show error state
  if (error) {
    return createPortal(
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-tooltip flex items-center justify-center">
        <Card className="card-default p-2xl text-center max-w-md">
          <h2 className="text-xl font-bold text-text-error mb-md">Error Loading Content</h2>
          <p className="text-text-secondary mb-lg">{error}</p>
          <Button onClick={onQuit} variant="secondary">Back to Selection</Button>
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
      <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-tooltip">
        <div className="max-w-4xl mx-auto p-lg">
          <Card className="card-default p-2xl text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-md">Coming Soon</h2>
            <p className="text-text-secondary mb-lg">{gameTypeId.replace('-', ' ')} content is currently under development.</p>
            <Button onClick={onQuit} variant="secondary">Back to Selection</Button>
          </Card>
        </div>
      </div>
    )
  }
  // Handle loading and error states for content types first
  else if (['written-material'].includes(gameTypeId)) {
    if (loading) {
      gameContent = (
        <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-tooltip">
          <div className="max-w-4xl mx-auto p-lg">
            <Card className="card-default p-2xl text-center">
              <h2 className="text-2xl font-bold text-text-primary mb-md">Loading Content...</h2>
              <p className="text-text-secondary mb-lg">Please wait while we load the {gameTypeId.replace('-', ' ')} content.</p>
              <Button onClick={onQuit} variant="secondary">Cancel</Button>
            </Card>
          </div>
        </div>
      )
    } else if (error) {
      gameContent = (
        <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-tooltip">
          <div className="max-w-4xl mx-auto p-lg">
            <Card className="card-default p-2xl text-center">
              <h2 className="text-2xl font-bold text-text-primary mb-md">Content Not Available</h2>
              <p className="text-text-secondary mb-lg">Sorry, we couldn't load the content: {error}</p>
              <Button onClick={onQuit} variant="secondary">Back to Selection</Button>
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
      <div className="fixed inset-0 bg-bg-secondary flex flex-col z-tooltip">
        {/* Simple Header */}
        <div className="bg-bg-elevated shadow-card z-sticky">
          <div className="max-w-7xl mx-auto px-lg py-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
              <Button variant="ghost" size="sm" onClick={onQuit}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* PDF-style Content */}
        <div className="flex-1 overflow-auto bg-bg-tertiary p-md">
          <div className="max-w-4xl mx-auto">
            {/* Render each page from the JSON content */}
            {pages.map((page: any, index: number) => (
              <div key={index} className="bg-bg-elevated shadow-modal mb-md rounded-lg" style={{ minHeight: '1056px', padding: '72px' }}>
                <div 
                  className="prose prose-lg max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-text-primary [&_h1]:mb-lg [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-text-primary [&_h2]:mt-xl [&_h2]:mb-md [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text-primary [&_h3]:mt-lg [&_h3]:mb-sm [&_p]:text-text-secondary [&_p]:mb-md [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-lg [&_ul]:text-text-secondary [&_ul]:space-y-sm [&_ul]:ml-lg [&_li]:text-text-secondary [&_strong]:font-semibold [&_strong]:text-text-primary"
                  dangerouslySetInnerHTML={{ __html: page.content }} 
                />
                <div className="text-center text-text-tertiary text-sm mt-auto pt-xl">
                  Page {page.pageNumber || index + 1}
                </div>
              </div>
            ))}
            
            {/* Fallback if no pages */}
            {pages.length === 0 && (
              <div className="bg-bg-elevated shadow-card mb-md p-xl text-center rounded-lg">
                <p className="text-text-secondary">No content available for this lesson.</p>
              </div>
            )}
          </div>
        </div>

        {/* Simple Footer */}
        <div className="bg-bg-elevated border-t border-border-default shadow-card z-sticky">
          <div className="max-w-7xl mx-auto px-lg py-md">
            <div className="flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                Viewing: {title} ({pages.length} pages)
              </div>
              <Button 
                onClick={() => onComplete({ completed: true })} 
                className="btn-primary"
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
      <div className="fixed inset-0 bg-bg-inverse flex flex-col z-tooltip">
        {/* Video Header */}
        <div className="bg-bg-inverse/90 backdrop-blur-sm z-sticky">
          <div className="max-w-7xl mx-auto px-lg py-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-inverse">{lesson.title}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onQuit} 
                className="text-text-inverse hover:bg-bg-elevated/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative w-full max-w-6xl mx-auto px-lg">
            {/* Mock Video Screen */}
            <div className="aspect-video bg-bg-inverse rounded-lg overflow-hidden relative shadow-modal">
              {/* Video Thumbnail/Content */}
              <div className="absolute inset-0 bg-gradient-to-br from-bg-brand/20 to-bg-info/20 flex items-center justify-center">
                {!videoPlaying ? (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-bg-elevated/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-md cursor-pointer hover:bg-bg-elevated/20 transition-colors duration-normal"
                         onClick={() => setVideoPlaying(true)}>
                      <Play className="w-10 h-10 text-text-inverse ml-2" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-inverse mb-sm">Introduction to {lesson.title}</h3>
                    <p className="text-text-inverse/80">Click to play video • {formatVideoTime(videoDuration)}</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-32 h-32 text-text-inverse/20 mx-auto mb-md" />
                      <p className="text-text-inverse/60 text-lg">Video is playing...</p>
                      <p className="text-text-inverse/40 mt-sm">Mock educational content about {lesson.title}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-inverse/80 to-transparent p-md">
                <div className="flex items-center gap-md mb-sm">
                  <button
                    onClick={() => setVideoPlaying(!videoPlaying)}
                    className="text-text-inverse hover:text-text-brand transition-colors duration-fast"
                  >
                    {videoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="bg-bg-elevated/20 rounded-full h-1 relative">
                      <div 
                        className="bg-bg-brand h-full rounded-full transition-all duration-slow"
                        style={{ width: `${(videoTime / videoDuration) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <span className="text-text-inverse text-sm">
                    {formatVideoTime(videoTime)} / {formatVideoTime(videoDuration)}
                  </span>
                  
                  <Volume2 className="w-5 h-5 text-text-inverse/60" />
                </div>
              </div>
            </div>
            
            {/* Video Info Below */}
            <div className="mt-lg bg-bg-inverse/50 backdrop-blur-sm rounded-lg p-lg">
              <h3 className="text-lg font-semibold text-text-inverse mb-sm">About this video</h3>
              <p className="text-text-inverse/70 mb-md">{lesson.description}</p>
              
              <div className="flex items-center gap-lg text-sm text-text-inverse/60">
                <div className="flex items-center gap-sm">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {formatVideoTime(videoDuration)}</span>
                </div>
                <div className="flex items-center gap-sm">
                  <List className="w-4 h-4" />
                  <span>{lesson.knowledgePoints.length} key concepts covered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-bg-inverse/90 backdrop-blur-sm border-t border-border-subtle z-sticky">
          <div className="max-w-7xl mx-auto px-lg py-md">
            <div className="flex items-center justify-between">
              <div className="text-sm text-text-inverse/60">
                {videoTime > 0 ? `Watched ${Math.round((videoTime / videoDuration) * 100)}%` : 'Video not started'}
              </div>
              <Button 
                onClick={() => onComplete({ completed: true, watchTime: videoTime })} 
                className="btn-primary"
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
      <div className="fixed inset-0 bg-bg-secondary flex flex-col z-tooltip">
        {/* Fixed Header */}
        <div className="bg-bg-inverse shadow-dropdown z-sticky">
          <div className="max-w-7xl mx-auto px-lg py-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-inverse">{lesson.title}</h2>
              <Button variant="ghost" size="sm" onClick={onQuit} className="text-text-inverse hover:bg-bg-elevated/10">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-lg">
            <Card className="card-default overflow-hidden">
              {/* Audio Player - Fixed at top of card */}
              <div className="bg-bg-elevated border-b border-border-default sticky top-0 z-sticky p-2xl">
                <div className="flex items-center gap-sm mb-md">
                  <div className="p-sm bg-bg-brand/20 rounded-lg">
                    <Volume2 className="w-6 h-6 text-text-brand" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Audio Lesson</h3>
                    <p className="text-text-secondary text-sm">{formatTime(totalDuration)} total duration</p>
                  </div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-lg">
                  <div className="flex items-center justify-between mb-md">
                    <div className="flex items-center gap-md">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="rounded-full w-14 h-14 p-0"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </Button>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {audioChapters.find(ch => ch.id === selectedChapter)?.title || 'Select a chapter'}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatTime(currentTime)} / {formatTime(totalDuration)}
                        </p>
                      </div>
                    </div>
                    <Volume2 className="w-5 h-5 text-text-tertiary" />
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-bg-tertiary rounded-full h-2 relative">
                    <div 
                      className="bg-bg-brand h-full rounded-full transition-all duration-slow"
                      style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                    />
                    {/* Chapter markers */}
                    {audioChapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-bg-inverse/30"
                        style={{ left: `${(chapter.start / totalDuration) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Scrollable Chapters List */}
              <div className="p-2xl">
                <div className="flex items-center gap-sm mb-md">
                  <List className="w-5 h-5 text-text-brand" />
                  <h3 className="text-lg font-semibold text-text-primary">Chapters</h3>
                </div>
                
                <div className="space-y-sm">
                  {audioChapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterClick(chapter)}
                      className={`w-full text-left p-md rounded-lg border transition-all duration-fast hover:border-border-brand ${
                        selectedChapter === chapter.id
                          ? 'bg-bg-brand/10 border-border-brand'
                          : 'bg-bg-elevated border-border-default'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-sm mb-sm">
                            <span className={`text-sm font-medium ${
                              selectedChapter === chapter.id ? 'text-text-brand' : 'text-text-secondary'
                            }`}>
                              Chapter {chapter.id}
                            </span>
                            <h4 className={`font-medium ${
                              selectedChapter === chapter.id ? 'text-text-brand' : 'text-text-primary'
                            }`}>
                              {chapter.title}
                            </h4>
                          </div>
                          <p className="text-sm text-text-secondary line-clamp-2">{chapter.summary}</p>
                        </div>
                        <div className="flex items-center gap-sm ml-md">
                          <Clock className="w-4 h-4 text-text-tertiary" />
                          <span className="text-sm text-text-secondary">{formatTime(chapter.duration)}</span>
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
        <div className="bg-bg-elevated border-t border-border-default shadow-card z-sticky">
          <div className="max-w-7xl mx-auto px-lg py-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm text-sm text-text-secondary">
                <CheckCircle className="w-4 h-4" />
                <span>Listen to all chapters to complete</span>
              </div>
              <Button 
                onClick={() => onComplete({ completed: true, timeListened: currentTime })} 
                className="btn-primary"
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
          <div className="fixed inset-0 bg-bg-secondary flex items-center justify-center z-tooltip">
            <div className="max-w-4xl mx-auto p-lg">
              <Card className="card-default p-2xl text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-md">Game Not Available</h2>
                <p className="text-text-secondary mb-lg">This learning method is not available yet.</p>
                <Button onClick={onQuit} variant="secondary">Back to Selection</Button>
              </Card>
            </div>
          </div>
        )
    }
  }

  // Wrap everything in a portal
  if (typeof window === 'undefined') return null
  
  return createPortal(
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-tooltip" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {gameContent}
    </div>,
    document.body
  )
}