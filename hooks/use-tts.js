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

  // Cleanup function
  const cleanup = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
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
    
    // Cache the result
    addToCache(cacheKey, result.audio)
    
    return result.audio // base64 encoded MP3
  }

  // Convert base64 to audio blob and create audio element
  const createAudioFromBase64 = (base64Audio) => {
    try {
      // Validate base64 input
      if (!base64Audio || typeof base64Audio !== 'string') {
        throw new Error('Invalid base64 audio data')
      }
      
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
      
      // Create audio element
      const audio = createAudioFromBase64(audioBase64)
      
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
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        setIsPaused(false)
        if (onEnd) onEnd()
        cleanup()
      })
      
      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e)
        setError('Audio playback failed')
        setIsPlaying(false)
        setIsPaused(false)
        if (onEnd) onEnd()
        cleanup()
      })

      audio.addEventListener('timeupdate', () => {
        if (onProgress && audio.duration) {
          const progress = (audio.currentTime / audio.duration) * 100
          const currentWordIndex = Math.floor((audio.currentTime / audio.duration) * text.split(' ').length)
          onProgress({ progress, currentWordIndex })
        }
      })
      
      // Store audio reference
      audioRef.current = audio
      
      // Start playback
      await audio.play()
      
    } catch (err) {
      console.error('TTS Error:', err)
      setError(err.message || 'Failed to generate speech')
      setIsPlaying(false)
      setIsPaused(false)
      if (onEnd) onEnd()
    }
  }, [cleanup])

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPaused(true)
      setIsPlaying(false)
    }
  }, [isPlaying])

  const resume = useCallback(() => {
    if (audioRef.current && isPaused) {
      audioRef.current.play()
      setIsPaused(false)
      setIsPlaying(true)
    }
  }, [isPaused])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
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