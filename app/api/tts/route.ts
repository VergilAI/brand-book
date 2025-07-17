import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for TTS request
const ttsRequestSchema = z.object({
  text: z.string().min(1).max(5000), // Limit text length for safety
  voice: z.object({
    languageCode: z.string().optional(),
    name: z.string().optional(),
    ssmlGender: z.enum(['NEUTRAL', 'FEMALE', 'MALE']).optional(),
  }).optional(),
  audioConfig: z.object({
    audioEncoding: z.enum(['MP3', 'LINEAR16', 'OGG_OPUS']).optional(),
    speakingRate: z.number().min(0.25).max(4.0).optional(),
    pitch: z.number().min(-20.0).max(20.0).optional(),
  }).optional(),
})

// Voice mapping for legacy compatibility
const LEGACY_VOICE_MAP: Record<string, string> = {
  'en-US-Standard-A': 'Rachel',
  'en-US-Standard-B': 'Domi',
  'en-US-Standard-C': 'Bella',
  'en-US-Standard-D': 'Josh',
  'en-GB-Standard-A': 'Domi',
  'en-GB-Standard-B': 'Antoni',
  'en-GB-Standard-C': 'Rachel',
  'en-GB-Standard-D': 'Adam'
}

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

// Helper function to get voice ID from legacy name
const getVoiceIdFromLegacy = (legacyVoiceName?: string): string => {
  if (!legacyVoiceName) {
    return VOICE_ID_MAP['Rachel'] // Default voice
  }
  
  const mappedName = LEGACY_VOICE_MAP[legacyVoiceName]
  if (mappedName) {
    return VOICE_ID_MAP[mappedName]
  }
  
  // Check if it's already a new voice name
  const directVoiceId = VOICE_ID_MAP[legacyVoiceName]
  if (directVoiceId) {
    return directVoiceId
  }
  
  // Default to Rachel if not found
  return VOICE_ID_MAP['Rachel']
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = ttsRequestSchema.parse(body)
    
    // Get ElevenLabs API key
    const apiKey = getElevenLabsApiKey()
    
    // Get voice ID from legacy name
    const voiceId = getVoiceIdFromLegacy(validatedData.voice?.name)
    
    // Configure ElevenLabs request
    const elevenLabsRequest = {
      text: validatedData.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        // Map speaking rate and pitch if provided
        ...(validatedData.audioConfig?.speakingRate && {
          stability: Math.max(0, Math.min(1, 0.5 / validatedData.audioConfig.speakingRate))
        }),
        ...(validatedData.audioConfig?.pitch && {
          similarity_boost: Math.max(0, Math.min(1, 0.75 + (validatedData.audioConfig.pitch / 40)))
        })
      }
    }
    
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
      
      return NextResponse.json(
        { error: 'Failed to generate audio content' },
        { status: response.status }
      )
    }
    
    // Get audio data as array buffer
    const audioBuffer = await response.arrayBuffer()
    
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Failed to generate audio content' },
        { status: 500 }
      )
    }
    
    // Convert audio content to base64 for transmission
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')
    
    return NextResponse.json({
      success: true,
      audioData: audioBase64,
      audioFormat: 'MP3',
      metadata: {
        voice: {
          languageCode: validatedData.voice?.languageCode || 'en-US',
          name: validatedData.voice?.name || 'Rachel',
          ssmlGender: validatedData.voice?.ssmlGender || 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: validatedData.audioConfig?.speakingRate || 1.0,
          pitch: validatedData.audioConfig?.pitch || 0.0,
        },
        textLength: validatedData.text.length,
      },
    })
    
  } catch (error) {
    console.error('TTS API Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'TTS API is running (powered by ElevenLabs)',
    availableVoices: {
      'en-US': ['Rachel', 'Bella', 'Josh', 'Sam', 'Elli'],
      'en-GB': ['Domi', 'Antoni', 'Adam'],
    },
    legacyVoiceMapping: LEGACY_VOICE_MAP,
    supportedFormats: ['MP3'],
    note: 'This API now uses ElevenLabs instead of Google Cloud TTS'
  })
}