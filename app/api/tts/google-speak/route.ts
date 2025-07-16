import { NextRequest, NextResponse } from 'next/server'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { z } from 'zod'
import { ttsUsageTracker } from '@/lib/tts/usage-tracker'

// Validation schema for Google TTS request
const googleTTSRequestSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text cannot exceed 5000 characters')
    .refine(text => text.trim().length > 0, 'Text cannot be only whitespace'),
  languageCode: z.string()
    .optional()
    .default('en-US'),
  voiceName: z.string()
    .optional()
    .default('en-US-Neural2-F')
})

// Initialize Google Cloud TTS client
const initializeGoogleTTSClient = (): TextToSpeechClient => {
  const credentialsPath = process.env.GOOGLE_CLOUD_TTS_CREDENTIALS_PATH
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
  
  if (!credentialsPath) {
    throw new Error('GOOGLE_CLOUD_TTS_CREDENTIALS_PATH environment variable is not set')
  }
  
  if (!projectId) {
    throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is not set')
  }
  
  try {
    return new TextToSpeechClient({
      projectId,
      keyFilename: credentialsPath,
    })
  } catch (error) {
    throw new Error(`Failed to initialize Google TTS client: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Helper function to validate voice name format
const validateVoiceName = (voiceName: string, languageCode: string): boolean => {
  // Voice name should start with language code
  return voiceName.startsWith(languageCode)
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = googleTTSRequestSchema.parse(body)
    
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
    
    // Additional validation for voice name compatibility
    if (!validateVoiceName(voiceName, languageCode)) {
      return NextResponse.json(
        { 
          error: 'Invalid voice name for the specified language code',
          details: `Voice name '${voiceName}' does not match language code '${languageCode}'`
        },
        { status: 400 }
      )
    }
    
    // Initialize Google Cloud TTS client
    const client = initializeGoogleTTSClient()
    
    // Configure TTS request exactly as specified
    const ttsRequest = {
      input: { 
        text: text.trim() 
      },
      voice: {
        languageCode: languageCode,
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3' as const
      }
    }
    
    console.log('Google TTS Request:', {
      textLength: text.length,
      languageCode,
      voiceName,
      audioEncoding: 'MP3'
    })
    
    // Generate speech using Google Cloud TTS
    const [response] = await client.synthesizeSpeech(ttsRequest)
    
    if (!response.audioContent) {
      return NextResponse.json(
        { 
          error: 'Failed to generate audio content',
          details: 'Google TTS API returned empty audio content'
        },
        { status: 500 }
      )
    }
    
    // Track usage after successful generation
    await ttsUsageTracker.trackRequest(text.length)
    
    // Convert audio content to base64
    const audioBase64 = Buffer.from(response.audioContent).toString('base64')
    
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
    console.error('Google TTS API Error:', error)
    
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
    
    // Handle Google Cloud TTS errors
    if (error instanceof Error) {
      // Check for specific Google Cloud errors
      if (error.message.includes('INVALID_ARGUMENT')) {
        return NextResponse.json(
          { 
            error: 'Invalid voice or language configuration',
            details: error.message
          },
          { status: 400 }
        )
      }
      
      if (error.message.includes('PERMISSION_DENIED')) {
        return NextResponse.json(
          { 
            error: 'Authentication failed',
            details: 'Google Cloud TTS API authentication failed. Please check your credentials.'
          },
          { status: 401 }
        )
      }
      
      if (error.message.includes('QUOTA_EXCEEDED')) {
        return NextResponse.json(
          { 
            error: 'Quota exceeded',
            details: 'Google Cloud TTS API quota exceeded. Please try again later.'
          },
          { status: 429 }
        )
      }
      
      // Generic error handling
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
    name: 'Google Cloud Text-to-Speech API',
    version: '1.0',
    description: 'Convert text to speech using Google Cloud TTS',
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
        description: 'Language code for the speech'
      },
      voiceName: {
        type: 'string',
        required: false,
        default: 'en-US-Neural2-F',
        description: 'Specific voice name to use'
      }
    },
    response: {
      success: 'boolean',
      audio: 'string (base64 encoded MP3)',
      format: 'string',
      metadata: 'object'
    },
    exampleRequest: {
      text: 'Hello, this is a test of Google Cloud Text-to-Speech.',
      languageCode: 'en-US',
      voiceName: 'en-US-Neural2-F'
    },
    supportedVoices: {
      'en-US': [
        'en-US-Neural2-A', 'en-US-Neural2-C', 'en-US-Neural2-D',
        'en-US-Neural2-E', 'en-US-Neural2-F', 'en-US-Neural2-G',
        'en-US-Neural2-H', 'en-US-Neural2-I', 'en-US-Neural2-J'
      ],
      'en-GB': [
        'en-GB-Neural2-A', 'en-GB-Neural2-B', 'en-GB-Neural2-C', 'en-GB-Neural2-D'
      ]
    }
  })
}