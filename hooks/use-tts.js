'use client'

import { useState, useRef, useCallback } from 'react'

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

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const audioUrlRef = useRef(null)
  const playPromiseRef = useRef(null)

  // Cleanup function
  const cleanup = useCallback(() => {
    try {
      if (audioRef.current) {
        // Stop playback if possible
        try {
          audioRef.current.pause()
        } catch (e) {
          // Ignore pause errors
        }
        
        // Clear the source
        try {
          if (audioRef.current.src) {
            audioRef.current.src = ''
          }
        } catch (e) {
          // Ignore src clearing errors
        }
        
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


  // Generate speech using Google Cloud TTS
  const generateSpeech = async (textToSpeak, voiceName = 'Rachel') => {
    if (!textToSpeak || textToSpeak.trim().length === 0) {
      throw new Error('No text provided for speech generation')
    }
    
    // Check cache first (include voice in cache key)
    const cacheKey = getCacheKey(textToSpeak + voiceName)
    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey)
    }
    
    try {
      const response = await fetch('/api/tts/google-speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSpeak.trim(),
          languageCode: 'en-US',
          voiceName: voiceName
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
      
      // Validate base64 audio data
      if (typeof result.audio !== 'string' || result.audio.length === 0) {
        throw new Error('Invalid audio data received from server')
      }
      
      // Basic base64 validation
      try {
        // Test if it's valid base64 by attempting to decode a small portion
        atob(result.audio.substring(0, 100))
      } catch (e) {
        throw new Error('Invalid base64 audio data received from server')
      }
      
      console.log('TTS API response:', {
        success: result.success,
        audioLength: result.audio ? result.audio.length : 0,
        audioSample: result.audio ? result.audio.substring(0, 50) + '...' : 'No audio',
        format: result.format,
        metadata: result.metadata
      })
      
      // Cache the result
      addToCache(cacheKey, result.audio)
      
      return result.audio // base64 encoded MP3
    } catch (error) {
      console.error('TTS API error:', error)
      throw error
    }
  }

  // Convert base64 to audio blob and create audio element
  const createAudioFromBase64 = (base64Audio) => {
    try {
      // Validate base64 input
      if (!base64Audio || typeof base64Audio !== 'string') {
        throw new Error('Invalid base64 audio data')
      }
      
      console.log('Creating audio from base64, length:', base64Audio.length)
      
      // Convert base64 to binary
      const binaryString = atob(base64Audio)
      const bytes = new Uint8Array(binaryString.length)
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      console.log('Binary data size:', bytes.length, 'bytes')
      
      // Create blob
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' })
      console.log('Audio blob created, size:', audioBlob.size)
      
      // Create object URL
      const audioUrl = URL.createObjectURL(audioBlob)
      audioUrlRef.current = audioUrl
      console.log('Audio URL created:', audioUrl)
      
      // Create audio element
      const audio = new Audio()
      audio.preload = 'auto'
      
      // Set the source
      audio.src = audioUrl
      
      console.log('Audio element created with src:', audio.src)
      
      return audio
    } catch (error) {
      console.error('Failed to create audio from base64:', error)
      throw new Error('Failed to create audio from base64 data: ' + error.message)
    }
  }

  const speak = useCallback(async (text, options = {}) => {
    const { 
      onStart, 
      onEnd, 
      onProgress,
      voiceName = 'Rachel',
      playbackRate = 1.0,
      volume = 1.0,
      startFrom = 0 // word index to start from
    } = options

    try {
      // Clean up any existing audio
      cleanup()
      
      setError(null)
      setIsPlaying(true)
      setIsPaused(false)
      
      // Call onStart callback
      if (onStart) onStart()
      
      // Generate speech
      const audioBase64 = await generateSpeech(text, voiceName)
      
      // Handle usage limit gracefully
      if (!audioBase64) {
        console.warn('TTS skipped - no audio available')
        setError('TTS temporarily unavailable.')
        setIsPlaying(false)
        setIsPaused(false)
        if (onEnd) onEnd()
        return
      }
      
      
      // Create audio element for normal TTS
      const audio = createAudioFromBase64(audioBase64)
      
      // Add additional error handling for audio loading
      let loadTimeout = null
      
      audio.addEventListener('loadstart', () => {
        console.log('Audio load started')
        // Set a timeout for loading
        loadTimeout = setTimeout(() => {
          if (!cleanupCalled) {
            cleanupCalled = true
            console.warn('Audio loading timeout - no progress after 10 seconds')
            setError('Audio loading timeout')
            setIsPlaying(false)
            if (onEnd) onEnd()
            cleanup()
          }
        }, 10000)
      })
      
      audio.addEventListener('loadedmetadata', () => {
        if (loadTimeout) clearTimeout(loadTimeout)
        console.log('Audio metadata loaded:', {
          duration: audio.duration,
          readyState: audio.readyState,
          currentTime: audio.currentTime
        })
        
        // Force initial progress update
        if (onProgress && audio.duration > 0) {
          const words = text.split(' ')
          onProgress({ 
            progress: 0, 
            currentWordIndex: 0,
            highlightRange: { start: 0, end: Math.min(4, words.length - 1) }
          })
        }
      })
      
      audio.addEventListener('canplay', () => {
        if (loadTimeout) clearTimeout(loadTimeout)
        console.log('Audio can play, ready state:', audio.readyState)
      })
      
      audio.addEventListener('canplaythrough', () => {
        if (loadTimeout) clearTimeout(loadTimeout)
        console.log('Audio can play through without buffering')
      })
      
      // Set playback rate and volume
      audio.playbackRate = playbackRate
      audio.volume = volume
      
      // If startFrom is specified, calculate approximate time offset
      if (startFrom > 0) {
        const words = text.split(' ')
        const startText = words.slice(0, startFrom).join(' ')
        const startRatio = startText.length / text.length
        audio.currentTime = audio.duration * startRatio
      }
      
      // Setup event listeners
      // Track if cleanup has been called
      let cleanupCalled = false
      
      // Define handleError first before using it
      const handleError = (e) => {
        if (cleanupCalled) return // Ignore errors during cleanup
        
        // Simple error handling without complex state access
        console.warn('Audio playback error occurred')
        
        // Only set error if we're not already cleaning up
        if (!cleanupCalled) {
          cleanupCalled = true
          setError('Audio playback failed')
          setIsPlaying(false)
          setIsPaused(false)
          if (onEnd) onEnd()
          cleanup()
        }
      }
      
      const handleEnded = () => {
        if (cleanupCalled) return
        cleanupCalled = true
        
        setIsPlaying(false)
        setIsPaused(false)
        
        // Remove error listener before cleanup to prevent error events during cleanup
        audio.removeEventListener('error', handleError)
        
        if (onEnd) onEnd()
        cleanup()
      }
      
      // Add event listeners
      audio.addEventListener('error', handleError)
      audio.addEventListener('ended', handleEnded)

      let lastUpdateTime = 0
      let updateCount = 0
      audio.addEventListener('timeupdate', () => {
        if (onProgress && audio.duration && audio.duration > 0) {
          // Throttle updates to every 100ms
          const now = Date.now()
          if (now - lastUpdateTime < 100) return
          lastUpdateTime = now
          updateCount++
          
          
          const progress = (audio.currentTime / audio.duration) * 100
          const words = text.split(' ')
          const totalWords = words.length
          
          // Calculate the current position without buffer for more accurate sync
          const progressRatio = audio.currentTime / audio.duration
          
          // Calculate word range to highlight (multiple words)
          const centerWordIndex = Math.floor(progressRatio * totalWords)
          const wordsToHighlight = 3 // Highlight 3 words at a time for better accuracy
          const startIndex = Math.max(0, centerWordIndex - 1) // One word before
          const endIndex = Math.min(totalWords - 1, centerWordIndex + 1) // One word after
          
          onProgress({ 
            progress, 
            currentWordIndex: centerWordIndex,
            highlightRange: { start: startIndex, end: endIndex }
          })
        }
      })
      
      // Store audio reference
      audioRef.current = audio
      
      // Start playback with error handling
      try {
        playPromiseRef.current = audio.play()
        await playPromiseRef.current
        console.log('Audio playback started successfully')
        playPromiseRef.current = null
      } catch (playError) {
        console.error('Error starting audio playback:', playError)
        playPromiseRef.current = null
        
        // Determine specific play error
        let playErrorMessage = 'Failed to start audio playback'
        if (playError.name === 'NotAllowedError') {
          playErrorMessage = 'Audio playback requires user interaction. Please click to enable audio.'
        } else if (playError.name === 'NotSupportedError') {
          playErrorMessage = 'Audio format not supported by your browser'
        } else if (playError.name === 'AbortError') {
          playErrorMessage = 'Audio playback was interrupted'
        }
        
        throw new Error(playErrorMessage)
      }
      
    } catch (err) {
      console.error('TTS Error:', err)
      setError(err.message || 'Failed to generate speech')
      setIsPlaying(false)
      setIsPaused(false)
      if (onEnd) onEnd()
    }
  }, [cleanup])

  const pause = useCallback(async () => {
    if (audioRef.current && isPlaying) {
      // Wait for play promise to resolve if it exists
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current
        } catch (e) {
          // Play was rejected, no need to pause
          console.log('Play promise was rejected, skipping pause')
          return
        }
      }
      
      // Now safe to pause
      try {
        audioRef.current.pause()
        setIsPaused(true)
        setIsPlaying(false)
      } catch (e) {
        console.warn('Error pausing audio:', e)
      }
    }
  }, [isPlaying])

  const resume = useCallback(async () => {
    if (audioRef.current && isPaused) {
      try {
        await audioRef.current.play()
        setIsPaused(false)
        setIsPlaying(true)
      } catch (error) {
        console.error('Error resuming audio:', error)
        setError('Failed to resume audio playback')
      }
    }
  }, [isPaused])

  const stop = useCallback(async () => {
    // Wait for play promise to resolve if it exists
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current
      } catch (e) {
        // Play was rejected, continue with cleanup
        console.log('Play promise was rejected during stop')
      }
    }
    
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      } catch (e) {
        console.warn('Error stopping audio:', e)
      }
    }
    
    playPromiseRef.current = null
    setIsPlaying(false)
    setIsPaused(false)
    cleanup()
  }, [cleanup])

  const setPlaybackRate = useCallback((rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }, [])

  const setVolume = useCallback((volume) => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [])

  return {
    speak,
    pause,
    resume,
    stop,
    setPlaybackRate,
    setVolume,
    isPlaying,
    isPaused,
    error
  }
}