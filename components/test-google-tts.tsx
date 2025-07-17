'use client'

import { useState } from 'react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Input } from '@/components/atomic/input'
import { googleTTSClient } from '@/lib/tts/google-tts-client'
import { Volume2, Play, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export function TestGoogleTTS() {
  const [text, setText] = useState('Hello, this is a test of ElevenLabs Text-to-Speech using Rachel voice.')
  const [languageCode, setLanguageCode] = useState('en-US')
  const [voiceName, setVoiceName] = useState('Rachel')
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    if (!text.trim()) {
      setError('Please enter some text to test')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await googleTTSClient.synthesizeSpeech({
        text: text.trim(),
        languageCode,
        voiceName
      })

      setResult(response)

      if (response.success && response.audio) {
        // Auto-play the generated audio
        const audio = googleTTSClient.createAudioElement(response.audio)
        
        audio.addEventListener('play', () => setIsPlaying(true))
        audio.addEventListener('ended', () => setIsPlaying(false))
        audio.addEventListener('pause', () => setIsPlaying(false))
        
        await audio.play()
      } else {
        setError(response.error || 'Failed to generate speech')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayAgain = async () => {
    if (result?.success && result?.audio) {
      setIsPlaying(true)
      try {
        await googleTTSClient.playAudio(result.audio)
      } catch (err) {
        setError('Failed to play audio')
      } finally {
        setIsPlaying(false)
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Test Google Cloud TTS
              </h2>
              <p className="text-text-secondary">
                Test the /api/tts/google-speak endpoint with custom text and voice settings.
              </p>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Text to speak (max 5000 characters)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 p-3 border border-border-default rounded-md resize-none text-text-primary bg-bg-primary"
                placeholder="Enter text to convert to speech..."
                maxLength={5000}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-text-secondary">
                  {text.length}/5000 characters
                </span>
                {text.length > 4500 && (
                  <Badge variant="warning" className="text-xs">
                    Approaching limit
                  </Badge>
                )}
              </div>
            </div>

            {/* Voice Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Language Code
                </label>
                <Input
                  value={languageCode}
                  onChange={(e) => setLanguageCode(e.target.value)}
                  placeholder="en-US"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Voice Name
                </label>
                <Input
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  placeholder="en-US-Neural2-F"
                />
              </div>
            </div>

            {/* Test Button */}
            <Button
              onClick={handleTest}
              disabled={isLoading || !text.trim()}
              variant="primary"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Speech...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Test Text-to-Speech
                </>
              )}
            </Button>

            {/* Results */}
            {error && (
              <div className="p-3 bg-bg-error-light border border-border-error rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-text-error" />
                  <span className="text-sm font-medium text-text-error">Error</span>
                </div>
                <p className="text-sm text-text-error mt-1">{error}</p>
              </div>
            )}

            {result?.success && (
              <div className="p-3 bg-bg-success-light border border-border-success rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-text-success" />
                    <span className="text-sm font-medium text-text-success">
                      Speech Generated Successfully
                    </span>
                  </div>
                  <Button
                    onClick={handlePlayAgain}
                    variant="secondary"
                    size="sm"
                    disabled={isPlaying}
                  >
                    {isPlaying ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Playing...
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Play Again
                      </>
                    )}
                  </Button>
                </div>
                
                {result.metadata && (
                  <div className="mt-3 text-xs text-text-secondary">
                    <div className="grid grid-cols-2 gap-4">
                      <div>Voice: {result.metadata.voiceName}</div>
                      <div>Language: {result.metadata.languageCode}</div>
                      <div>Format: {result.metadata.audioEncoding}</div>
                      <div>Text Length: {result.metadata.textLength} chars</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cache Stats */}
            <div className="pt-4 border-t border-border-subtle">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>Cache: {googleTTSClient.getCacheStats().size} / {googleTTSClient.getCacheStats().maxSize}</span>
                <Button
                  onClick={() => googleTTSClient.clearCache()}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  Clear Cache
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}