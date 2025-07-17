import { NextResponse } from 'next/server'

export async function GET() {
  const hasApiKey = !!process.env.ELEVENLABS_API_KEY
  const apiKeyLength = process.env.ELEVENLABS_API_KEY?.length || 0
  
  return NextResponse.json({
    hasApiKey,
    apiKeyLength,
    apiKeyPrefix: process.env.ELEVENLABS_API_KEY?.substring(0, 10) + '...',
    timestamp: new Date().toISOString()
  })
}