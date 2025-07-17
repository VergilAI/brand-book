'use client'

import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/atomic/button'

export default function TTSButtonSimpleTest({ text }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePlay = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('[TEST TTS] Starting...')
      
      // Make API request
      const response = await fetch('/api/tts/google-speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text || 'Hello, this is a test.',
          languageCode: 'en-US',
          voiceName: 'Rachel'
        })
      })
      
      console.log('[TEST TTS] Response status:', response.status)
      
      const result = await response.json()
      console.log('[TEST TTS] Result:', result)
      
      if (!result.success || !result.audio) {
        throw new Error(result.error || 'No audio received')
      }
      
      // Create audio
      const audioData = atob(result.audio)
      const arrayBuffer = new Uint8Array(audioData.length)
      for (let i = 0; i < audioData.length; i++) {
        arrayBuffer[i] = audioData.charCodeAt(i)
      }
      
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      
      console.log('[TEST TTS] Blob size:', blob.size)
      console.log('[TEST TTS] Audio URL:', url)
      
      // Create and play audio
      const audio = new Audio(url)
      audio.volume = 1.0
      
      console.log('[TEST TTS] Playing audio...')
      await audio.play()
      console.log('[TEST TTS] Audio playing successfully!')
      
    } catch (err) {
      console.error('[TEST TTS] Error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePlay}
        disabled={isLoading}
        variant="primary"
        size="sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Test Play Audio
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-sm text-red-500">Error: {error}</p>
      )}
    </div>
  )
}