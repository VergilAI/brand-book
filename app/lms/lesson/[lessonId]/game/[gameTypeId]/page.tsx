'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { FlashcardGame } from '@/components/flashcard-game'
import { MillionaireGame } from '@/components/millionaire-game'
import { JeopardyGame } from '@/components/jeopardy-game'
import { ConnectCardsGame } from '@/components/connect-cards-game'
import { gameTypes } from '@/lib/lms/game-types'
import { useCourseData } from '../../../../new_course_overview/hooks/useCourseData'
import type { Lesson } from '@/lib/lms/new-course-types'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.lessonId as string
  const gameTypeId = params.gameTypeId as string
  
  const { course, loading } = useCourseData('course-1')
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [gameType, setGameType] = useState<any>(null)

  useEffect(() => {
    if (course) {
      // Find the lesson in the course data
      const foundLesson = course.chapters
        .flatMap(ch => ch.lessons)
        .find(l => l.id === lessonId)
      
      if (foundLesson) {
        setLesson(foundLesson)
      }

      // Find the game type
      const foundGameType = gameTypes.find(gt => gt.id === gameTypeId)
      if (foundGameType) {
        setGameType(foundGameType)
      }
    }
  }, [course, lessonId, gameTypeId])

  const handleGameComplete = (results: any) => {
    console.log('Game completed:', results)
    // TODO: Update progress via API
    router.push('/lms/new_course_overview')
  }

  const handleGameQuit = () => {
    router.push('/lms/new_course_overview')
  }

  if (loading || !lesson || !gameType) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center"> {/* #FFFFFF */}
        <div className="text-center space-y-spacing-md"> {/* 16px */}
          <Loader2 className="h-12 w-12 animate-spin text-text-brand mx-auto" /> {/* #7B00FF */}
          <p className="text-text-secondary text-base"> {/* #6C6C6D, 16px */}
            Loading game...
          </p>
        </div>
      </div>
    )
  }

  // Render the appropriate game component
  const renderGame = () => {
    switch (gameTypeId) {
      case 'flashcards':
        return (
          <FlashcardGame
            lessonId={lessonId}
            lessonTitle={lesson.title}
            onComplete={handleGameComplete}
            onQuit={handleGameQuit}
          />
        )
      
      case 'millionaire':
        return (
          <MillionaireGame
            lessonId={lessonId}
            lessonTitle={lesson.title}
            onComplete={handleGameComplete}
            onQuit={handleGameQuit}
          />
        )
      
      case 'jeopardy':
        return (
          <JeopardyGame
            lessonId={lessonId}
            lessonTitle={lesson.title}
            onComplete={handleGameComplete}
            onQuit={handleGameQuit}
          />
        )
      
      case 'connect-cards':
        return (
          <ConnectCardsGame
            lessonId={lessonId}
            lessonTitle={lesson.title}
            onComplete={handleGameComplete}
            onQuit={handleGameQuit}
          />
        )
      
      case 'written-material':
        // Simple content viewer for written material
        return (
          <div className="min-h-screen bg-bg-primary"> {/* #FFFFFF */}
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/lms/new_course_overview')}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Course
                </Button>
                
                <h1 className="text-2xl font-bold text-text-primary mb-2"> {/* #1D1D1F */}
                  {lesson.title}
                </h1>
                <p className="text-text-secondary"> {/* #6C6C6D */}
                  {lesson.description}
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="bg-bg-secondary rounded-lg p-spacing-lg"> {/* #F5F5F7, 32px */}
                  <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
                  
                  {/* Mock content - in real app, this would come from the lesson data */}
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      This lesson covers the fundamental concepts of {lesson.title}. 
                      We'll explore the key knowledge points and provide practical examples 
                      to help you understand and apply these concepts.
                    </p>
                    
                    <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">
                      Key Knowledge Points:
                    </h3>
                    
                    <ul className="space-y-3">
                      {lesson.knowledgePoints.map((kp, index) => (
                        <li key={kp.id} className="flex items-start gap-3">
                          <span className="font-medium text-text-brand">
                            {index + 1}.
                          </span>
                          <div>
                            <h4 className="font-medium text-text-primary">
                              {kp.title}
                            </h4>
                            <p className="text-sm mt-1">{kp.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-8 flex justify-end">
                      <Button
                        variant="primary"
                        onClick={() => handleGameComplete({ completed: true })}
                      >
                        Mark as Complete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="min-h-screen bg-bg-primary flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">
                Game Type Not Available
              </h2>
              <p className="text-text-secondary">
                The "{gameType.name}" game is not yet implemented.
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/lms/new_course_overview')}
              >
                Back to Course
              </Button>
            </div>
          </div>
        )
    }
  }

  return renderGame()
}