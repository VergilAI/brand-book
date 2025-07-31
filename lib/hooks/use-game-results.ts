'use client'

import { useState } from 'react'
import { gameAPI } from '@/lib/api/game-api'

interface GameResult {
  gameTypeId: number
  lessonId: string
  score: number
  timeSpent: number
  completed: boolean
  knowledgePointScores?: Array<{
    knowledgePointId: number
    score: number
  }>
}

interface UseGameResultsReturn {
  submitResult: (result: GameResult) => Promise<void>
  isSubmitting: boolean
  error: string | null
  success: boolean
}

export function useGameResults(): UseGameResultsReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submitResult = async (result: GameResult) => {
    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(false)

      await gameAPI.submitGameResult({
        lesson_id: parseInt(result.lessonId, 10),
        game_type_id: result.gameTypeId,
        score: result.score,
        time_spent: result.timeSpent,
        completed: result.completed
      })

      setSuccess(true)
    } catch (err) {
      console.error('Error submitting game result:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit game result')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitResult,
    isSubmitting,
    error,
    success
  }
}