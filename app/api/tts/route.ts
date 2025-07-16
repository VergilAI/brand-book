import { NextRequest, NextResponse } from 'next/server'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
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

// Initialize Google Cloud TTS client
const getTtsClient = () => {
  const credentialsPath = process.env.GOOGLE_CLOUD_TTS_CREDENTIALS_PATH
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
  
  if (!credentialsPath || !projectId) {
    throw new Error('Missing Google Cloud credentials configuration')
  }
  
  return new TextToSpeechClient({
    projectId,
    keyFilename: credentialsPath,
  })
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = ttsRequestSchema.parse(body)
    
    // Initialize TTS client
    const client = getTtsClient()
    
    // Configure TTS request with defaults from environment
    const ttsRequest = {
      input: { text: validatedData.text },
      voice: {
        languageCode: validatedData.voice?.languageCode || process.env.TTS_VOICE_LANGUAGE_CODE || 'en-US',
        name: validatedData.voice?.name || process.env.TTS_VOICE_NAME || 'en-US-Standard-D',
        ssmlGender: validatedData.voice?.ssmlGender || (process.env.TTS_VOICE_SSML_GENDER as any) || 'NEUTRAL',
      },
      audioConfig: {
        audioEncoding: validatedData.audioConfig?.audioEncoding || (process.env.TTS_AUDIO_ENCODING as any) || 'MP3',
        speakingRate: validatedData.audioConfig?.speakingRate || 1.0,
        pitch: validatedData.audioConfig?.pitch || 0.0,
      },
    }
    
    // Generate speech
    const [response] = await client.synthesizeSpeech(ttsRequest)
    
    if (!response.audioContent) {
      return NextResponse.json(
        { error: 'Failed to generate audio content' },
        { status: 500 }
      )
    }
    
    // Convert audio content to base64 for transmission
    const audioBase64 = Buffer.from(response.audioContent).toString('base64')
    
    return NextResponse.json({
      success: true,
      audioData: audioBase64,
      audioFormat: ttsRequest.audioConfig.audioEncoding,
      metadata: {
        voice: ttsRequest.voice,
        audioConfig: ttsRequest.audioConfig,
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
    message: 'TTS API is running',
    availableVoices: {
      'en-US': ['en-US-Standard-A', 'en-US-Standard-B', 'en-US-Standard-C', 'en-US-Standard-D'],
      'en-GB': ['en-GB-Standard-A', 'en-GB-Standard-B', 'en-GB-Standard-C', 'en-GB-Standard-D'],
    },
    supportedFormats: ['MP3', 'LINEAR16', 'OGG_OPUS'],
  })
}