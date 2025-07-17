import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('[TTS Stream API] Received request')
  
  try {
    const body = await request.json()
    const { text, voiceName = 'Rachel' } = body
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }
    
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }
    
    // Voice ID mapping
    const voiceIds: Record<string, string> = {
      'Rachel': '21m00Tcm4TlvDq8ikWAM',
      'Domi': 'AZnzlk1XvdvUeBnXmlld',
      'Bella': 'EXAVITQu4vr4xnSDxMaL',
    }
    
    const voiceId = voiceIds[voiceName] || voiceIds['Rachel']
    
    // Make request to ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('[TTS Stream API] ElevenLabs error:', error)
      return NextResponse.json({ error: 'TTS generation failed' }, { status: response.status })
    }
    
    // Get the audio stream
    const audioStream = response.body
    if (!audioStream) {
      return NextResponse.json({ error: 'No audio stream received' }, { status: 500 })
    }
    
    // Return the audio stream directly
    return new NextResponse(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('[TTS Stream API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}