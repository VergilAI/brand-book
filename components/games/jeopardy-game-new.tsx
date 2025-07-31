'use client'

import { useState, useEffect } from 'react'
import { JeopardyGame } from '@/components/jeopardy-game'
import { gameContentAPI } from '@/app/lms/new_course_overview/api/course-api'
import { Loader2 } from 'lucide-react'
import type { JeopardyCategory } from '@/components/jeopardy-game'
import { useGameResults } from '@/lib/hooks/use-game-results'

interface JeopardyGameNewProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

export function JeopardyGameNew({ lessonId, onClose, onComplete }: JeopardyGameNewProps) {
  const [categories, setCategories] = useState<JeopardyCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startTime] = useState<number>(Date.now())
  const { submitResult } = useGameResults()

  useEffect(() => {
    async function loadGameContent() {
      try {
        setLoading(true)
        const gameContent = await gameContentAPI.getGameContent(lessonId, 'jeopardy')
        
        if (gameContent?.content?.categories) {
          // Transform the API data to match the JeopardyCategory interface
          const transformedCategories: JeopardyCategory[] = gameContent.content.categories.map((category: any) => ({
            name: category.name,
            clues: category.questions.map((q: any) => ({
              id: q.id,
              category: category.name,
              value: q.value,
              clue: q.question,
              answer: q.answer,
              isDailyDouble: false // Will be set based on dailyDouble config
            }))
          }))

          // Set daily double if specified
          if (gameContent.content.dailyDouble) {
            const { categoryIndex, questionIndex } = gameContent.content.dailyDouble
            if (transformedCategories[categoryIndex] && transformedCategories[categoryIndex].clues[questionIndex]) {
              transformedCategories[categoryIndex].clues[questionIndex].isDailyDouble = true
            }
          }

          setCategories(transformedCategories)
        } else {
          // No categories available
          setCategories([])
          setError('No game content available for this lesson')
        }
      } catch (err) {
        console.error('Failed to load Jeopardy content:', err)
        setError('Failed to load game content')
        // No fallback - show error
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadGameContent()
  }, [lessonId])

  const handleGameEnd = (finalScore: number) => {
    // Convert the raw score to a percentage for consistency with other games
    const maxPossibleScore = categories.reduce((sum, cat) => 
      sum + cat.clues.reduce((catSum, clue) => catSum + clue.value, 0), 0
    )
    const percentageScore = Math.round((finalScore / maxPossibleScore) * 100)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    // Submit result to backend
    submitResult({
      gameTypeId: 2, // Jeopardy game
      lessonId,
      score: percentageScore,
      timeSpent,
      completed: true
    })
    
    onComplete(percentageScore)
    onClose()
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal"> {/* rgba(0, 0, 0, 0.5) */}
        <div className="text-center space-y-spacing-md"> {/* 16px */}
          <Loader2 className="h-12 w-12 animate-spin text-text-brand mx-auto" /> {/* #7B00FF */}
          <p className="text-text-secondary text-base"> {/* #6C6C6D, 16px */}
            Loading Jeopardy game...
          </p>
        </div>
      </div>
    )
  }

  if (error && categories.length === 0) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal"> {/* rgba(0, 0, 0, 0.5) */}
        <div className="text-center space-y-spacing-md"> {/* 16px */}
          <h2 className="text-xl font-semibold text-text-error"> {/* #E51C23 */}
            Error Loading Game
          </h2>
          <p className="text-text-secondary"> {/* #6C6C6D */}
            {error}
          </p>
          <button 
            onClick={onClose}
            className="bg-text-brand text-white px-6 py-2 rounded-lg hover:bg-text-brand-light transition-colors" /* #7B00FF, #9933FF */
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <JeopardyGame
      categories={categories}
      onGameEnd={handleGameEnd}
      onClose={onClose}
    />
  )
}

