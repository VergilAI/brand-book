/**
 * TTS Usage Tracker
 * Tracks characters sent to TTS and number of requests
 * Simple file-based storage for ElevenLabs free tier monitoring
 */

import fs from 'fs'
import path from 'path'

// ElevenLabs Free Tier Limits
export const TTS_LIMITS = {
  CHARACTERS_PER_MONTH: 10_000, // 10K characters per month (conservative estimate)
  WARNING_THRESHOLD: 0.8, // Warn at 80% usage
  CRITICAL_THRESHOLD: 0.95, // Critical at 95% usage
}

export interface UsageRecord {
  characters: number
  requests: number
  month: string // YYYY-MM format
  lastUpdated: string
}

export interface UsageStats {
  currentMonth: UsageRecord
  percentUsed: number
  charactersRemaining: number
  isWarning: boolean
  isCritical: boolean
  estimatedRequestsRemaining: number
}

class TTSUsageTracker {
  private usageFile: string
  private usageData: Map<string, UsageRecord> = new Map()

  constructor() {
    // Store usage data in a simple JSON file
    this.usageFile = path.join(process.cwd(), 'data', 'tts-usage.json')
    this.ensureDataDirectory()
    this.loadUsageData()
  }

  private ensureDataDirectory(): void {
    const dataDir = path.dirname(this.usageFile)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
  }

  private loadUsageData(): void {
    try {
      if (fs.existsSync(this.usageFile)) {
        const data = JSON.parse(fs.readFileSync(this.usageFile, 'utf8'))
        this.usageData = new Map(Object.entries(data))
      }
    } catch (error) {
      console.error('Failed to load usage data:', error)
      this.usageData = new Map()
    }
  }

  private saveUsageData(): void {
    try {
      const data = Object.fromEntries(this.usageData)
      fs.writeFileSync(this.usageFile, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Failed to save usage data:', error)
    }
  }

  private getCurrentMonth(): string {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  private getOrCreateMonthRecord(month: string): UsageRecord {
    if (!this.usageData.has(month)) {
      this.usageData.set(month, {
        characters: 0,
        requests: 0,
        month,
        lastUpdated: new Date().toISOString()
      })
    }
    return this.usageData.get(month)!
  }

  /**
   * Track a TTS request
   */
  async trackRequest(characterCount: number): Promise<void> {
    const month = this.getCurrentMonth()
    const record = this.getOrCreateMonthRecord(month)

    record.characters += characterCount
    record.requests += 1
    record.lastUpdated = new Date().toISOString()

    this.saveUsageData()
  }

  /**
   * Get current usage statistics
   */
  getUsageStats(): UsageStats {
    const month = this.getCurrentMonth()
    const record = this.getOrCreateMonthRecord(month)

    const percentUsed = (record.characters / TTS_LIMITS.CHARACTERS_PER_MONTH) * 100
    const charactersRemaining = TTS_LIMITS.CHARACTERS_PER_MONTH - record.characters
    const isWarning = percentUsed >= TTS_LIMITS.WARNING_THRESHOLD * 100
    const isCritical = percentUsed >= TTS_LIMITS.CRITICAL_THRESHOLD * 100

    // Estimate remaining requests (assume average of 100 characters per request)
    const avgCharactersPerRequest = record.requests > 0 ? record.characters / record.requests : 100
    const estimatedRequestsRemaining = Math.floor(charactersRemaining / avgCharactersPerRequest)

    return {
      currentMonth: record,
      percentUsed,
      charactersRemaining,
      isWarning,
      isCritical,
      estimatedRequestsRemaining
    }
  }

  /**
   * Check if request would exceed limits
   */
  canProcessRequest(characterCount: number): { allowed: boolean; reason?: string } {
    const stats = this.getUsageStats()
    
    if (stats.charactersRemaining < characterCount) {
      return {
        allowed: false,
        reason: `Request would exceed monthly limit. Characters remaining: ${stats.charactersRemaining}`
      }
    }

    return { allowed: true }
  }

  /**
   * Get usage history for multiple months
   */
  getUsageHistory(months: number = 12): UsageRecord[] {
    const history: UsageRecord[] = []
    const currentDate = new Date()

    for (let i = 0; i < months; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      const record = this.usageData.get(monthKey) || {
        characters: 0,
        requests: 0,
        month: monthKey,
        lastUpdated: new Date().toISOString()
      }
      
      history.push(record)
    }

    return history.reverse()
  }

  /**
   * Reset usage for current month (admin function)
   */
  resetCurrentMonth(): void {
    const month = this.getCurrentMonth()
    this.usageData.delete(month)
    this.saveUsageData()
  }

  /**
   * Get warning message based on usage
   */
  getUsageWarning(): string | null {
    const stats = this.getUsageStats()

    if (stats.isCritical) {
      return `CRITICAL: ${stats.percentUsed.toFixed(1)}% of monthly TTS quota used (${stats.charactersRemaining.toLocaleString()} characters remaining)`
    }

    if (stats.isWarning) {
      return `WARNING: ${stats.percentUsed.toFixed(1)}% of monthly TTS quota used (${stats.charactersRemaining.toLocaleString()} characters remaining)`
    }

    return null
  }
}

// Export singleton instance
export const ttsUsageTracker = new TTSUsageTracker()