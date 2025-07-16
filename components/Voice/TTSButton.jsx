'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Volume2, VolumeX, Loader2, AlertCircle, Play, Pause } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { cn } from '@/lib/utils'

/**
 * TTS Button Component for Voice Activity
 * 
 * Provides text-to-speech functionality with Google Cloud TTS integration
 * Includes comprehensive audio playback controls, caching, and error handling
 */

// Audio cache for avoiding repeated API calls
const audioCache = new Map()
const MAX_CACHE_SIZE = 50

// Cache management
const addToCache = (key, audioData) => {
  if (audioCache.size >= MAX_CACHE_SIZE) {
    const firstKey = audioCache.keys().next().value
    audioCache.delete(firstKey)
  }
  audioCache.set(key, audioData)
}

const getCacheKey = (text) => {
  return btoa(text.trim().toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
}

const TTSButton = ({ 
  text, 
  className, 
  onPlayStart, 
  onPlayEnd 
}) => {
  // Component state
  const [state, setState] = useState('idle') // idle, loading, playing, paused, error
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showToast, setShowToast] = useState(false)
  
  // Audio management refs
  const audioRef = useRef(null)
  const progressIntervalRef = useRef(null)
  const audioUrlRef = useRef(null)
  
  // Cleanup function
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeEventListener('loadedmetadata', () => {})
      audioRef.current.removeEventListener('timeupdate', () => {})
      audioRef.current.removeEventListener('ended', () => {})
      audioRef.current.removeEventListener('error', () => {})
      audioRef.current.src = ''
      audioRef.current = null
    }
    
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])
  
  // Cleanup on unmount and page navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanup()
    }
    
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause()
        setState('paused')
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      cleanup()
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [cleanup])
  
  // Show error toast
  const showErrorToast = (message) => {
    setError(message)
    setShowToast(true)
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(false)
    }, 5000)
  }
  
  // Show usage warning toast
  const showUsageWarning = (warningMessage) => {
    setError(warningMessage)
    setShowToast(true)
    
    // Auto-hide toast after 8 seconds (longer for usage warnings)
    setTimeout(() => {
      setShowToast(false)
    }, 8000)
  }
  
  // Generate speech using Google Cloud TTS
  const generateSpeech = async (textToSpeak) => {
    if (!textToSpeak || textToSpeak.trim().length === 0) {
      throw new Error('No text provided for speech generation')
    }
    
    // Check cache first
    const cacheKey = getCacheKey(textToSpeak)
    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey)
    }
    
    const response = await fetch('/api/tts/google-speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToSpeak.trim(),
        languageCode: 'en-US',
        voiceName: 'en-US-Neural2-F'
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to generate speech')
    }
    
    if (!result.audio) {
      throw new Error('No audio data received from server')
    }
    
    // Show usage warning if present
    if (result.usage && result.usage.warning) {
      showUsageWarning(result.usage.warning)
    }
    
    // Cache the result
    addToCache(cacheKey, result.audio)
    
    return result.audio // base64 encoded MP3
  }
  
  // Convert base64 to audio blob and create audio element
  const createAudioFromBase64 = (base64Audio) => {
    try {
      // Convert base64 to binary
      const binaryString = atob(base64Audio)
      const bytes = new Uint8Array(binaryString.length)
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      // Create blob
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' })
      
      // Create object URL
      const audioUrl = URL.createObjectURL(audioBlob)
      audioUrlRef.current = audioUrl
      
      // Create audio element
      const audio = new Audio(audioUrl)
      audio.preload = 'auto'
      
      return audio
    } catch (error) {
      throw new Error('Failed to create audio from base64 data')
    }
  }
  
  // Setup audio event listeners
  const setupAudioEvents = (audio) => {
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setCurrentTime(0)
    })
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    })
    
    audio.addEventListener('ended', () => {
      setState('idle')
      setProgress(0)
      setCurrentTime(0)
      onPlayEnd?.()
    })
    
    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e)
      setState('error')
      setProgress(0)
      setCurrentTime(0)
      showErrorToast('Audio playback failed')
    })
    
    audio.addEventListener('play', () => {
      setState('playing')
      onPlayStart?.()
    })
    
    audio.addEventListener('pause', () => {
      setState('paused')
    })
  }
  
  // Handle play/pause functionality
  const handlePlayPause = async () => {
    try {
      // If currently playing, pause it
      if (state === 'playing') {
        if (audioRef.current) {
          audioRef.current.pause()
        }
        return
      }
      
      // If paused, resume playback
      if (state === 'paused' && audioRef.current) {
        await audioRef.current.play()
        return
      }
      
      // If idle or error, start new playback
      setError(null)
      setShowToast(false)
      setState('loading')
      setProgress(0)
      setCurrentTime(0)
      
      // Clean up any existing audio
      cleanup()
      
      // Generate speech
      const audioBase64 = await generateSpeech(text)
      
      // Create audio element
      const audio = createAudioFromBase64(audioBase64)
      setupAudioEvents(audio)
      
      // Store audio reference
      audioRef.current = audio
      
      // Start playback
      await audio.play()
      
    } catch (err) {
      console.error('TTS Error:', err)
      setState('error')
      setProgress(0)
      setCurrentTime(0)
      showErrorToast(err.message || 'Failed to generate speech')
    }
  }
  
  // Stop playback completely
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setState('idle')
    setProgress(0)
    setCurrentTime(0)
  }
  
  // Format time display
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Get button content based on state
  const getButtonContent = () => {
    const iconClass = "h-4 w-4"
    
    switch (state) {
      case 'loading':
        return (
          <>
            <Loader2 className={cn(iconClass, "animate-spin")} />
            <span className="ml-2">Generating...</span>
          </>
        )
      
      case 'playing':
        return (
          <>
            <Pause className={cn(iconClass, "animate-pulse")} />
            <span className="ml-2">Pause</span>
          </>
        )
      
      case 'paused':
        return (
          <>
            <Play className={iconClass} />
            <span className="ml-2">Resume</span>
          </>
        )
      
      case 'error':
        return (
          <>
            <AlertCircle className={iconClass} />
            <span className="ml-2">Try Again</span>
          </>
        )
      
      default: // idle
        return (
          <>
            <Volume2 className={iconClass} />
            <span className="ml-2">Listen to Text</span>
          </>
        )
    }
  }
  
  // Get button variant based on state
  const getButtonVariant = () => {
    switch (state) {
      case 'playing':
        return 'primary'
      case 'paused':
        return 'secondary'
      case 'error':
        return 'destructive'
      default:
        return 'secondary'
    }
  }
  
  // Get button title for accessibility
  const getButtonTitle = () => {
    switch (state) {
      case 'loading':
        return 'Generating speech...'
      case 'playing':
        return 'Pause audio playback'
      case 'paused':
        return 'Resume audio playback'
      case 'error':
        return error || 'Error occurred, click to retry'
      default:
        return 'Play text as speech'
    }
  }
  
  const isDisabled = state === 'loading' || !text || text.trim().length === 0
  
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Error Toast */}
      {showToast && error && (
        <div className={cn(
          "fixed top-4 right-4 z-50 p-3 bg-bg-error border border-border-error rounded-lg shadow-lg",
          "transform transition-all duration-300",
          showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-text-error flex-shrink-0" />
            <span className="text-sm text-text-error">{error}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-text-error hover:text-text-error/80"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Main TTS Button */}
      <div className="flex items-center gap-2">
        <Button
          variant={getButtonVariant()}
          size="md"
          className={cn(
            "relative overflow-hidden transition-all duration-200 flex-1",
            state === 'loading' && "opacity-80 cursor-not-allowed",
            state === 'playing' && "shadow-brand-md",
            state === 'error' && "border-border-error"
          )}
          disabled={isDisabled}
          onClick={handlePlayPause}
          title={getButtonTitle()}
        >
          {getButtonContent()}
          
          {/* Progress indicator overlay */}
          {(state === 'playing' || state === 'paused') && progress > 0 && (
            <div 
              className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          )}
        </Button>
        
        {/* Stop button when playing or paused */}
        {(state === 'playing' || state === 'paused') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStop}
            title="Stop playback"
            className="px-2"
          >
            <VolumeX className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Progress bar and time display */}
      {(state === 'playing' || state === 'paused') && duration > 0 && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-text-secondary font-mono">
            {formatTime(currentTime)}
          </span>
          
          <div className="flex-1 h-1 bg-bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-100 rounded-full",
                state === 'playing' ? "bg-text-brand" : "bg-text-secondary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <span className="text-xs text-text-secondary font-mono">
            {formatTime(duration)}
          </span>
        </div>
      )}
      
      {/* Loading indicator */}
      {state === 'loading' && (
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1 h-1 bg-bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-text-brand rounded-full animate-pulse" />
          </div>
          <span className="text-xs text-text-secondary">
            Generating speech...
          </span>
        </div>
      )}
      
      {/* Cache info (debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-text-secondary opacity-50">
          Cache: {audioCache.size}/{MAX_CACHE_SIZE}
        </div>
      )}
    </div>
  )
}

export default TTSButton