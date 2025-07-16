import { NextRequest, NextResponse } from 'next/server'
import { ttsUsageTracker } from '@/lib/tts/usage-tracker'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '1')
    
    // Get current usage stats
    const currentStats = ttsUsageTracker.getUsageStats()
    
    // Get usage history if requested
    const history = months > 1 ? ttsUsageTracker.getUsageHistory(months) : []
    
    return NextResponse.json({
      success: true,
      current: currentStats,
      history,
      limits: {
        charactersPerMonth: 1_000_000,
        warningThreshold: 80,
        criticalThreshold: 95
      }
    })
    
  } catch (error) {
    console.error('Usage API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve usage statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'reset') {
      ttsUsageTracker.resetCurrentMonth()
      return NextResponse.json({
        success: true,
        message: 'Current month usage has been reset'
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use ?action=reset to reset current month usage' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Usage Reset Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to reset usage statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}