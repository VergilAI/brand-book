'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Volume2, Loader2, AlertCircle, Play, Pause, RotateCcw, Volume1, VolumeX } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Slider } from '@/components/slider'
import { cn } from '@/lib/utils'

/**
 * Enhanced TTS Button Component
 * 
 * Improved text-to-speech functionality with better audio controls
 * - Single, clear progress bar with seek functionality
 * - Volume control
 * - Improved visual hierarchy
 * - Cleaner UI without duplicate progress indicators
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

const TTSButtonEnhanced = ({ 
  text, 
  className, 
  onPlayStart, 
  onPlayEnd,
  showTranscript = false 
}) => {
  // Component state
  const [state, setState] = useState('idle') // idle, loading, playing, paused, error
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  
  // Audio management refs
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)
  const audioUrlRef = useRef(null)
  const volumeSliderTimeoutRef = useRef(null)
  const playPromiseRef = useRef(null)
  
  // Cleanup function
  const cleanup = useCallback(async () => {
    try {
      if (audioRef.current) {
        // Wait for any pending play promise
        if (playPromiseRef.current) {
          try {
            await playPromiseRef.current
          } catch (e) {
            // Ignore interruption errors
          }
          playPromiseRef.current = null
        }
        
        audioRef.current.pause()
        
        // Remove all event listeners safely
        if (audioRef.current._eventHandlers) {
          const handlers = audioRef.current._eventHandlers
          Object.entries(handlers).forEach(([event, handler]) => {
            audioRef.current.removeEventListener(event, handler)
          })
        }
        
        audioRef.current.src = ''
        audioRef.current = null
      }
    } catch (error) {
      console.warn('Error during audio cleanup:', error)
    }
    
    try {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
    } catch (error) {
      console.warn('Error revoking object URL:', error)
    }
  }, [])
  
  // Cleanup on unmount and page navigation
  useEffect(() => {
    const handleBeforeUnload = async () => {
      await cleanup()
    }
    
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && state === 'playing') {
        audioRef.current.pause()
        setState('paused')
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      const cleanupAsync = async () => {
        await cleanup()
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        if (volumeSliderTimeoutRef.current) {
          clearTimeout(volumeSliderTimeoutRef.current)
        }
      }
      cleanupAsync()
    }
  }, [cleanup, state])
  
  // Show error toast
  const showErrorToast = (message) => {
    setError(message)
    setShowToast(true)
    
    setTimeout(() => {
      setShowToast(false)
    }, 5000)
  }
  
  // Show usage warning toast
  const showUsageWarning = (warningMessage) => {
    setError(warningMessage)
    setShowToast(true)
    
    setTimeout(() => {
      setShowToast(false)
    }, 8000)
  }
  
  // Generate speech using ElevenLabs TTS
  const generateSpeech = async (textToSpeak) => {
    if (!textToSpeak || textToSpeak.trim().length === 0) {
      throw new Error('No text provided for speech generation')
    }
    
    // Check cache first
    const cacheKey = getCacheKey(textToSpeak)
    if (audioCache.has(cacheKey)) {
      console.log('[TTS] Using cached audio for key:', cacheKey)
      return audioCache.get(cacheKey)
    }
    
    console.log('[TTS] Making API request to generate speech...')
    
    const response = await fetch('/api/tts/google-speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToSpeak.trim(),
        languageCode: 'en-US',
        voiceName: 'Rachel'
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('[TTS] API response:', { 
      success: result.success, 
      hasAudio: !!result.audio, 
      audioLength: result.audio?.length,
      audioSample: result.audio?.substring(0, 50) + '...'
    })
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to generate speech')
    }
    
    if (!result.audio) {
      throw new Error('No audio data received from server')
    }
    
    // Validate base64
    if (typeof result.audio !== 'string' || result.audio.length === 0) {
      throw new Error('Invalid audio data format from server')
    }
    
    // Show usage warning if present
    if (result.usage && result.usage.warning) {
      showUsageWarning(result.usage.warning)
    }
    
    // Cache the result
    addToCache(cacheKey, result.audio)
    
    return result.audio
  }
  
  // Convert base64 to audio blob and create audio element
  const createAudioFromBase64 = (base64Audio) => {
    try {
      if (!base64Audio || typeof base64Audio !== 'string') {
        throw new Error('Invalid base64 audio data')
      }
      
      console.log('[TTS] Creating audio from base64, length:', base64Audio.length)
      
      let binaryString
      try {
        binaryString = atob(base64Audio)
        console.log('[TTS] Decoded binary string length:', binaryString.length)
      } catch (e) {
        console.error('[TTS] Failed to decode base64:', e)
        throw new Error('Invalid base64 audio data')
      }
      
      const bytes = new Uint8Array(binaryString.length)
      console.log('[TTS] Binary data length:', bytes.length)
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' })
      console.log('[TTS] Audio blob created, size:', audioBlob.size)
      
      if (audioBlob.size === 0) {
        throw new Error('Created audio blob is empty')
      }
      
      const audioUrl = URL.createObjectURL(audioBlob)
      console.log('[TTS] Audio URL created:', audioUrl)
      audioUrlRef.current = audioUrl
      
      const audio = new Audio()
      audio.src = audioUrl
      audio.preload = 'auto'
      audio.volume = isMuted ? 0 : volume
      console.log('[TTS] Audio element initialized with volume:', audio.volume)
      
      // Add error handler immediately
      audio.onerror = (e) => {
        console.error('[TTS] Audio element error during creation:', e)
        console.error('[TTS] Audio error details:', audio.error)
      }
      
      // Test if audio can be loaded
      audio.load()
      
      return audio
    } catch (error) {
      console.error('Failed to create audio from base64:', error)
      throw new Error('Failed to create audio from base64 data: ' + error.message)
    }
  }
  
  // Setup audio event listeners
  const setupAudioEvents = (audio) => {
    const handlers = {}
    
    handlers.loadedmetadata = () => {
      console.log('[TTS] Loaded metadata - duration:', audio.duration)
      setDuration(audio.duration)
      setCurrentTime(0)
    }
    
    handlers.timeupdate = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    
    handlers.ended = () => {
      setState('idle')
      setProgress(0)
      setCurrentTime(0)
      onPlayEnd?.()
    }
    
    handlers.error = (e) => {
      console.error('[TTS] Audio error handler triggered:', e)
      const audio = e.target
      let errorMsg = 'Unknown audio error'
      
      if (audio?.error) {
        console.error('[TTS] Media error code:', audio.error.code)
        console.error('[TTS] Media error message:', audio.error.message)
        
        switch(audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'Audio playback aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error - could not load audio';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'Audio decoding error - invalid audio format';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Audio format not supported';
            break;
        }
      }
      
      setState('error')
      setProgress(0)
      setCurrentTime(0)
      showErrorToast('Audio playback failed: ' + errorMsg)
    }
    
    handlers.play = () => {
      console.log('[TTS] Play event fired')
      setState('playing')
      onPlayStart?.()
    }
    
    handlers.pause = () => {
      setState('paused')
    }
    
    // Add event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      audio.addEventListener(event, handler)
    })
    
    // Store references for cleanup
    audio._eventHandlers = handlers
  }
  
  // Handle play/pause functionality
  const handlePlayPause = async () => {
    try {
      if (state === 'playing') {
        if (audioRef.current) {
          // Wait for any pending play promise before pausing
          if (playPromiseRef.current) {
            try {
              await playPromiseRef.current
            } catch (e) {
              // Ignore interruption errors
            }
          }
          audioRef.current.pause()
        }
        return
      }
      
      if (state === 'paused' && audioRef.current) {
        try {
          const playPromise = audioRef.current.play()
          playPromiseRef.current = playPromise
          
          if (playPromise !== undefined) {
            await playPromise
            playPromiseRef.current = null
          }
        } catch (playError) {
          if (playError.name === 'AbortError' || 
              playError.message.includes('interrupted')) {
            console.log('Resume was interrupted')
            return
          }
          throw playError
        }
        return
      }
      
      // If idle or error, start new playback
      setError(null)
      setShowToast(false)
      setState('loading')
      setProgress(0)
      setCurrentTime(0)
      
      await cleanup()
      
      console.log('[TTS] Starting audio generation for text:', text.substring(0, 50) + '...')
      const audioBase64 = await generateSpeech(text)
      console.log('[TTS] Audio base64 received, length:', audioBase64?.length || 0)
      
      const audio = createAudioFromBase64(audioBase64)
      console.log('[TTS] Audio element created:', audio)
      console.log('[TTS] Audio src:', audio.src)
      console.log('[TTS] Audio duration:', audio.duration)
      console.log('[TTS] Audio readyState:', audio.readyState)
      
      setupAudioEvents(audio)
      audioRef.current = audio
      
      // Wait for audio to be ready
      console.log('[TTS] Waiting for audio to be ready...')
      console.log('[TTS] Initial readyState:', audio.readyState)
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error('[TTS] Audio loading timeout')
          reject(new Error('Audio loading timeout'))
        }, 5000)
        
        if (audio.readyState >= 3) {
          console.log('[TTS] Audio already ready')
          clearTimeout(timeout)
          resolve()
        } else {
          const handleCanPlay = () => {
            console.log('[TTS] Audio can play event fired, readyState:', audio.readyState)
            clearTimeout(timeout)
            resolve()
          }
          
          const handleError = (e) => {
            console.error('[TTS] Audio loading error event:', e)
            console.error('[TTS] Audio error:', audio.error)
            console.error('[TTS] Audio network state:', audio.networkState)
            console.error('[TTS] Audio src:', audio.src)
            clearTimeout(timeout)
            
            let errorMessage = 'Audio failed to load'
            if (audio.error) {
              switch(audio.error.code) {
                case 1: errorMessage = 'Audio loading aborted'; break;
                case 2: errorMessage = 'Network error while loading audio'; break;
                case 3: errorMessage = 'Audio decoding error'; break;
                case 4: errorMessage = 'Audio format not supported'; break;
              }
            }
            reject(new Error(errorMessage))
          }
          
          audio.addEventListener('canplaythrough', handleCanPlay, { once: true })
          audio.addEventListener('error', handleError, { once: true })
        }
      })
      
      // Handle play promise properly
      try {
        console.log('[TTS] Attempting to play audio...')
        console.log('[TTS] Audio paused:', audio.paused)
        console.log('[TTS] Audio muted:', audio.muted)
        console.log('[TTS] Audio volume:', audio.volume)
        
        const playPromise = audio.play()
        playPromiseRef.current = playPromise
        
        if (playPromise !== undefined) {
          console.log('[TTS] Play promise created, waiting...')
          await playPromise
          console.log('[TTS] Play promise resolved successfully')
          playPromiseRef.current = null
        } else {
          console.log('[TTS] No play promise returned (old browser?)')
        }
      } catch (playError) {
        // Check if error is due to interruption (not a real error)
        if (playError.name === 'AbortError' || 
            playError.message.includes('interrupted') ||
            playError.message.includes('pause()')) {
          console.log('Play request was interrupted, which is acceptable')
          // Reset state since play was interrupted
          setState('idle')
          setProgress(0)
          setCurrentTime(0)
          return
        }
        
        // Check for autoplay policy issues
        if (playError.name === 'NotAllowedError') {
          console.error('Autoplay blocked by browser:', playError)
          // Try to play with user interaction
          setState('paused')
          throw new Error('Audio playback blocked by browser. Please click play again.')
        }
        
        console.error('Audio play error:', playError)
        throw new Error('Failed to start audio playback: ' + playError.message)
      }
      
    } catch (err) {
      console.error('TTS Error:', err)
      setState('error')
      setProgress(0)
      setCurrentTime(0)
      showErrorToast(err.message || 'Failed to generate speech')
    }
  }
  
  // Stop/Reset playback
  const handleStop = async () => {
    // Wait for any pending play promise
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current
      } catch (e) {
        // Ignore interruption errors
      }
      playPromiseRef.current = null
    }
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setState('idle')
    setProgress(0)
    setCurrentTime(0)
  }
  
  // Handle seeking in the progress bar
  const handleSeek = (e) => {
    if (!audioRef.current || !progressBarRef.current) return
    
    const rect = progressBarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    const newTime = (percentage / 100) * duration
    
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
    setProgress(percentage)
  }
  
  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    const volumeValue = newVolume[0] / 100
    setVolume(volumeValue)
    setIsMuted(volumeValue === 0)
    
    if (audioRef.current) {
      audioRef.current.volume = volumeValue
    }
  }
  
  // Toggle mute
  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume
    }
  }
  
  // Show volume slider with auto-hide
  const handleShowVolumeSlider = () => {
    setShowVolumeSlider(true)
    
    if (volumeSliderTimeoutRef.current) {
      clearTimeout(volumeSliderTimeoutRef.current)
    }
    
    volumeSliderTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false)
    }, 3000)
  }
  
  // Format time display
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const isDisabled = state === 'loading' || !text || text.trim().length === 0
  
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Error Toast */}
      {showToast && error && (
        <div className={cn(
          "fixed top-4 right-4 z-50 p-3 bg-bg-error-light border border-border-error rounded-lg shadow-lg",
          "transform transition-all duration-300",
          showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-text-error flex-shrink-0" />
            <span className="text-sm text-text-error">{error}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-text-error hover:text-text-error/80 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Main Audio Player */}
      <div className="bg-bg-secondary rounded-lg p-4 shadow-sm border border-border-subtle">
        {/* Control Buttons */}
        <div className="flex items-center gap-2 mb-3">
          {/* Play/Pause Button */}
          <Button
            variant={state === 'playing' ? 'primary' : 'secondary'}
            size="sm"
            className={cn(
              "transition-all duration-200",
              state === 'loading' && "opacity-80 cursor-not-allowed"
            )}
            disabled={isDisabled}
            onClick={handlePlayPause}
            title={state === 'playing' ? 'Pause' : 'Play'}
          >
            {state === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : state === 'playing' ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          {/* Stop/Reset Button */}
          {(state === 'playing' || state === 'paused') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStop}
              title="Stop"
              className="px-2"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          
          {/* Volume Control */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              onMouseEnter={handleShowVolumeSlider}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="px-2"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : volume > 0.5 ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <Volume1 className="h-4 w-4" />
              )}
            </Button>
            
            {/* Volume Slider */}
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300",
                showVolumeSlider ? "w-24" : "w-0"
              )}
              onMouseEnter={handleShowVolumeSlider}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        {/* Progress Bar and Time */}
        {(state !== 'idle' && state !== 'loading') && (
          <div className="space-y-2">
            {/* Seekable Progress Bar */}
            <div 
              ref={progressBarRef}
              className="relative h-2 bg-bg-emphasis rounded-full overflow-hidden cursor-pointer group"
              onClick={handleSeek}
            >
              <div 
                className={cn(
                  "h-full transition-all duration-100 rounded-full",
                  state === 'playing' ? "bg-brand" : "bg-brand/60"
                )}
                style={{ width: `${progress}%` }}
              />
              
              {/* Hover indicator */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
            
            {/* Time Display */}
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <span className="font-mono">{formatTime(duration)}</span>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {state === 'loading' && (
          <div className="space-y-2">
            <div className="h-2 bg-bg-emphasis rounded-full overflow-hidden">
              <div className="h-full bg-brand/30 rounded-full animate-pulse" />
            </div>
            <p className="text-xs text-text-secondary text-center">Generating speech...</p>
          </div>
        )}
        
        {/* Idle State */}
        {state === 'idle' && (
          <p className="text-xs text-text-secondary text-center">Click play to listen</p>
        )}
      </div>
      
      {/* Optional Transcript Display */}
      {showTranscript && text && (
        <div className="bg-bg-emphasis rounded-lg p-3 max-h-32 overflow-y-auto">
          <p className="text-sm text-text-secondary leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  )
}

export default TTSButtonEnhanced