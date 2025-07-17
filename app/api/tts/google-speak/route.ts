import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ttsUsageTracker } from '@/lib/tts/usage-tracker'

// Validation schema for ElevenLabs TTS request
const elevenLabsTTSRequestSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text cannot exceed 5000 characters')
    .refine(text => text.trim().length > 0, 'Text cannot be only whitespace'),
  languageCode: z.string()
    .optional()
    .default('en-US'),
  voiceName: z.string()
    .optional()
    .default('Rachel')
})

// ElevenLabs voice ID mapping
const VOICE_ID_MAP: Record<string, string> = {
  'Rachel': '21m00Tcm4TlvDq8ikWAM',
  'Domi': 'AZnzlk1XvdvUeBnXmlld',
  'Bella': 'EXAVITQu4vr4xnSDxMaL',
  'Antoni': 'ErXwobaYiN019PkySvjV',
  'Elli': 'MF3mGyEYCl7XYWbV9V6O',
  'Josh': 'TxGEqnHWrfWFTfGW9XjX',
  'Adam': 'pNInz6obpgDQGcFmaJgB',
  'Sam': 'yoZ06aMxZJJ28mfd3POQ'
}

// Helper function to get ElevenLabs API key
const getElevenLabsApiKey = (): string => {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY environment variable is not set')
  }
  return apiKey
}

// Helper function to get voice ID from name
const getVoiceId = (voiceName: string): string => {
  const voiceId = VOICE_ID_MAP[voiceName]
  if (!voiceId) {
    // Default to Rachel if voice not found
    return VOICE_ID_MAP['Rachel']
  }
  return voiceId
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = elevenLabsTTSRequestSchema.parse(body)
    
    const { text, languageCode, voiceName } = validatedData
    
    // Check usage limits before processing
    const usageCheck = ttsUsageTracker.canProcessRequest(text.length)
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Usage limit exceeded',
          details: usageCheck.reason
        },
        { status: 429 }
      )
    }
    
    // Get ElevenLabs API key and voice ID
    const apiKey = getElevenLabsApiKey()
    const voiceId = getVoiceId(voiceName)
    
    // Configure ElevenLabs request
    const elevenLabsRequest = {
      text: text.trim(),
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    }
    
    console.log('ElevenLabs TTS Request:', {
      textLength: text.length,
      voiceId,
      voiceName,
      model: 'eleven_multilingual_v2'
    })
    
    // Make request to ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(elevenLabsRequest)
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('ElevenLabs API Error:', response.status, errorData)
      
      if (response.status === 401) {
        return NextResponse.json(
          { 
            error: 'Authentication failed',
            details: 'ElevenLabs API authentication failed. Please check your API key.'
          },
          { status: 401 }
        )
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            details: 'ElevenLabs API rate limit exceeded. Please try again later.'
          },
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Text-to-speech generation failed',
          details: `ElevenLabs API error: ${errorData}`
        },
        { status: response.status }
      )
    }
    
    // Get audio data as array buffer
    const audioBuffer = await response.arrayBuffer()
    
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to generate audio content',
          details: 'ElevenLabs API returned empty audio content'
        },
        { status: 500 }
      )
    }
    
    // Track usage after successful generation
    await ttsUsageTracker.trackRequest(text.length)
    
    // Convert audio content to base64
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')
    
    // Get current usage stats for response
    const usageStats = ttsUsageTracker.getUsageStats()
    const usageWarning = ttsUsageTracker.getUsageWarning()
    
    // Return successful response with usage info
    return NextResponse.json({
      success: true,
      audio: audioBase64,
      format: 'MP3',
      metadata: {
        textLength: text.length,
        languageCode,
        voiceName,
        voiceId,
        model: 'eleven_multilingual_v2',
        audioEncoding: 'MP3',
        generatedAt: new Date().toISOString()
      },
      usage: {
        charactersUsed: usageStats.currentMonth.characters,
        charactersRemaining: usageStats.charactersRemaining,
        percentUsed: usageStats.percentUsed,
        requestsThisMonth: usageStats.currentMonth.requests,
        warning: usageWarning
      }
    })
    
  } catch (error) {
    console.error('ElevenLabs TTS API Error:', error)
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    // Handle other errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Text-to-speech generation failed',
          details: error.message
        },
        { status: 500 }
      )
    }
    
    // Fallback for unknown errors
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: 'An unexpected error occurred while processing your request'
      },
      { status: 500 }
    )
  }
}

// Handle GET requests to provide API information
export async function GET() {
  return NextResponse.json({
    name: 'ElevenLabs Text-to-Speech API',
    version: '1.0',
    description: 'Convert text to speech using ElevenLabs AI',
    endpoint: '/api/tts/google-speak',
    method: 'POST',
    parameters: {
      text: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 5000,
        description: 'The text to convert to speech'
      },
      languageCode: {
        type: 'string',
        required: false,
        default: 'en-US',
        description: 'Language code for the speech (for compatibility)'
      },
      voiceName: {
        type: 'string',
        required: false,
        default: 'Rachel',
        description: 'Voice name to use'
      }
    },
    response: {
      success: 'boolean',
      audio: 'string (base64 encoded MP3)',
      format: 'string',
      metadata: 'object',
      usage: 'object'
    },
    exampleRequest: {
      text: 'Hello, this is a test of ElevenLabs Text-to-Speech.',
      languageCode: 'en-US',
      voiceName: 'Rachel'
    },
    supportedVoices: Object.keys(VOICE_ID_MAP),
    voiceDescriptions: {
      'Rachel': 'American, Female, Young Adult',
      'Domi': 'British, Female, Young Adult',
      'Bella': 'American, Female, Young Adult',
      'Antoni': 'American, Male, Young Adult',
      'Elli': 'American, Female, Young Adult',
      'Josh': 'American, Male, Young Adult',
      'Adam': 'American, Male, Middle-aged',
      'Sam': 'American, Male, Young Adult'
    }
  })
}