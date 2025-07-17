'use client'

import { useState, useRef, useEffect } from 'react'
import { Volume2, Loader2, Play, Pause, AlertCircle } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { cn } from '@/lib/utils'

export default function TTSButtonStream({ 
  text, 
  className,
  onPlayStart,
  onPlayEnd 
}) {
  const [state, setState] = useState('idle') // idle, loading, playing, paused, error
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const audioUrlRef = useRef(null)
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
    }
  }, [])
  
  const handlePlayPause = async () => {
    try {
      if (state === 'playing') {
        audioRef.current?.pause()
        setState('paused')
        return
      }
      
      if (state === 'paused' && audioRef.current) {
        await audioRef.current.play()
        setState('playing')
        return
      }
      
      // Start new playback
      setState('loading')
      setError(null)
      
      // Clean up old audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
      
      console.log('[TTS Stream] Fetching audio for:', text.substring(0, 50) + '...')
      
      // Fetch audio stream
      const response = await fetch('/api/tts/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: 'Rachel' })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to generate audio: ${response.status}`)
      }
      
      // Create blob from response
      const blob = await response.blob()
      console.log('[TTS Stream] Received blob:', blob.size, blob.type)
      
      if (blob.size === 0) {
        throw new Error('Received empty audio data')
      }
      
      // Verify blob type
      if (!blob.type.includes('audio')) {
        console.warn('[TTS Stream] Unexpected blob type:', blob.type)
      }
      
      const audioUrl = URL.createObjectURL(blob)
      audioUrlRef.current = audioUrl
      const audio = new Audio()
      audio.src = audioUrl
      audio.preload = 'auto'
      
      // Set up event listeners
      audio.onloadstart = () => {
        console.log('[TTS Stream] Load started')
      }
      
      audio.onloadeddata = () => {
        console.log('[TTS Stream] Data loaded')
      }
      
      audio.oncanplay = () => {
        console.log('[TTS Stream] Can play')
      }
      
      audio.onplay = () => {
        console.log('[TTS Stream] Playing')
        setState('playing')
        onPlayStart?.()
      }
      
      audio.onended = () => {
        console.log('[TTS Stream] Ended')
        setState('idle')
        onPlayEnd?.()
        // Clean up after playback
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current)
          audioUrlRef.current = null
        }
      }
      
      audio.onerror = (e) => {
        console.error('[TTS Stream] Audio error event:', e)
        console.error('[TTS Stream] Audio element error:', audio.error)
        
        let errorMessage = 'Failed to play audio'
        if (audio.error) {
          switch(audio.error.code) {
            case 1:
              errorMessage = 'Audio loading was aborted';
              break;
            case 2:
              errorMessage = 'Network error while loading audio';
              break;
            case 3:
              errorMessage = 'Audio decoding failed';
              break;
            case 4:
              errorMessage = 'Audio format not supported';
              break;
          }
        }
        
        setState('error')
        setError(errorMessage)
      }
      
      audioRef.current = audio
      
      // Wait for audio to be ready before playing
      try {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.warn('[TTS Stream] Audio loading timeout, attempting to play anyway')
            resolve() // Resolve instead of reject to try playing
          }, 5000) // 5 second timeout
          
          audio.oncanplaythrough = () => {
            clearTimeout(timeout)
            console.log('[TTS Stream] Audio ready to play')
            resolve()
          }
          
          // Don't reject on error during loading, let play() handle it
          audio.onerror = null // Remove the error handler temporarily
        })
      } catch (err) {
        console.warn('[TTS Stream] Audio pre-load failed:', err)
        // Continue anyway
      }
      
      // Try to play
      console.log('[TTS Stream] Attempting to play...')
      await audio.play()
      
    } catch (err) {
      console.error('[TTS Stream] Error:', err)
      setState('error')
      setError(err.message || 'Failed to play audio')
    }
  }
  
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    setState('idle')
    setError(null)
  }
  
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Button
        variant="primary"
        size="sm"
        onClick={handlePlayPause}
        disabled={state === 'loading'}
        className="min-w-[100px]"
      >
        {state === 'loading' && (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        )}
        {state === 'idle' && (
          <>
            <Play className="w-4 h-4 mr-2" />
            Play Audio
          </>
        )}
        {state === 'playing' && (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </>
        )}
        {state === 'paused' && (
          <>
            <Play className="w-4 h-4 mr-2" />
            Resume
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="w-4 h-4 mr-2" />
            Retry
          </>
        )}
      </Button>
      
      {state !== 'idle' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStop}
          className="p-2"
        >
          Stop
        </Button>
      )}
      
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  )
}