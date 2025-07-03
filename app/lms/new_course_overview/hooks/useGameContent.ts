import { useState, useEffect } from 'react'
import { contentAPI, gameAPI } from '../api/course-api'

export function useGameContent(lessonId: string, gameTypeId: string) {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadContent() {
      if (!lessonId || !gameTypeId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        let contentData
        
        // For content types (written, video, audio), use contentAPI
        if (['written-material', 'video', 'audio-material'].includes(gameTypeId)) {
          console.log(`🔍 Loading content for ${lessonId} - ${gameTypeId}`)
          console.log('📁 Expected file path:', `/lms-data/content/${lessonId}-${gameTypeId}.json`)
          contentData = await contentAPI.getLessonContent(lessonId, gameTypeId)
          console.log('✅ Loaded content:', contentData)
          console.log('📊 Content structure:', {
            hasContent: !!contentData?.content,
            hasPages: !!contentData?.content?.pages,
            pagesCount: contentData?.content?.pages?.length || 0,
            title: contentData?.content?.title
          })
        } else {
          // For game types (flashcards, millionaire, etc.), use gameAPI
          console.log(`Loading game content for ${lessonId} - ${gameTypeId}`)
          contentData = await gameAPI.getGameContent(lessonId, gameTypeId)
          console.log('Loaded game content:', contentData)
        }

        setContent(contentData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content')
        setContent(null)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [lessonId, gameTypeId])

  return { content, loading, error }
}