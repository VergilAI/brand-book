/**
 * Google Cloud TTS Client
 * Handles communication with the /api/tts/google-speak endpoint
 */

export interface GoogleTTSRequest {
  text: string
  languageCode?: string
  voiceName?: string
}

export interface GoogleTTSResponse {
  success: boolean
  audio?: string // base64 encoded MP3
  format?: string
  metadata?: {
    textLength: number
    languageCode: string
    voiceName: string
    audioEncoding: string
    generatedAt: string
  }
  usage?: {
    charactersUsed: number
    charactersRemaining: number
    percentUsed: number
    requestsThisMonth: number
    warning?: string
  }
  error?: string
  details?: any
}

export class GoogleTTSClient {
  private static instance: GoogleTTSClient
  private cache: Map<string, string> = new Map()
  private maxCacheSize = 100

  private constructor() {}

  static getInstance(): GoogleTTSClient {
    if (!GoogleTTSClient.instance) {
      GoogleTTSClient.instance = new GoogleTTSClient()
    }
    return GoogleTTSClient.instance
  }

  /**
   * Convert text to speech using Google Cloud TTS
   */
  async synthesizeSpeech(request: GoogleTTSRequest): Promise<GoogleTTSResponse> {
    // Validate input
    if (!request.text || request.text.trim().length === 0) {
      return {
        success: false,
        error: 'Text cannot be empty'
      }
    }

    if (request.text.length > 5000) {
      return {
        success: false,
        error: 'Text cannot exceed 5000 characters'
      }
    }

    // Create cache key
    const cacheKey = this.createCacheKey(request)
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return {
        success: true,
        audio: this.cache.get(cacheKey)!,
        format: 'MP3'
      }
    }

    try {
      const response = await fetch('/api/tts/google-speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text.trim(),
          languageCode: request.languageCode || 'en-US',
          voiceName: request.voiceName || 'en-US-Neural2-F'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          details: errorData.details
        }
      }

      const result: GoogleTTSResponse = await response.json()

      // Cache successful results
      if (result.success && result.audio) {
        this.addToCache(cacheKey, result.audio)
      }

      return result

    } catch (error) {
      console.error('Google TTS Client Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      }
    }
  }

  /**
   * Create an audio element from base64 audio data
   */
  createAudioElement(base64Audio: string): HTMLAudioElement {
    const audioBlob = new Blob([
      Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))
    ], { type: 'audio/mpeg' })

    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)

    // Clean up URL when audio is done
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl)
    })

    return audio
  }

  /**
   * Play audio directly from base64 data
   */
  async playAudio(base64Audio: string): Promise<void> {
    const audio = this.createAudioElement(base64Audio)
    
    return new Promise((resolve, reject) => {
      audio.addEventListener('ended', () => resolve())
      audio.addEventListener('error', (e) => reject(e))
      
      audio.play().catch(reject)
    })
  }

  /**
   * Get API information
   */
  async getAPIInfo(): Promise<any> {
    try {
      const response = await fetch('/api/tts/google-speak')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch API info:', error)
      return null
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize
    }
  }

  // Private methods

  private createCacheKey(request: GoogleTTSRequest): string {
    return JSON.stringify({
      text: request.text.trim(),
      languageCode: request.languageCode || 'en-US',
      voiceName: request.voiceName || 'en-US-Neural2-F'
    })
  }

  private addToCache(key: string, audioData: string): void {
    // Implement LRU cache behavior
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, audioData)
  }
}

// Export singleton instance
export const googleTTSClient = GoogleTTSClient.getInstance()