'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/atomic/progress'
import { Loader2, AlertTriangle, CheckCircle, BarChart3, RefreshCw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UsageRecord {
  characters: number
  requests: number
  month: string
  lastUpdated: string
}

interface UsageStats {
  currentMonth: UsageRecord
  percentUsed: number
  charactersRemaining: number
  isWarning: boolean
  isCritical: boolean
  estimatedRequestsRemaining: number
}

interface UsageData {
  success: boolean
  current: UsageStats
  history: UsageRecord[]
  limits: {
    charactersPerMonth: number
    warningThreshold: number
    criticalThreshold: number
  }
}

export function TTSUsagePanel() {
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  // Fetch usage data
  const fetchUsageData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      setError(null)

      const response = await fetch('/api/tts/usage?months=6')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: UsageData = await response.json()
      setUsageData(data)
      
    } catch (err) {
      console.error('Failed to fetch usage data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch usage data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Reset current month usage
  const resetUsage = async () => {
    if (!confirm('Are you sure you want to reset the current month usage? This action cannot be undone.')) {
      return
    }

    try {
      setResetting(true)
      setError(null)

      const response = await fetch('/api/tts/usage?action=reset', {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Refresh data after reset
      await fetchUsageData(false)
      
    } catch (err) {
      console.error('Failed to reset usage:', err)
      setError(err instanceof Error ? err.message : 'Failed to reset usage')
    } finally {
      setResetting(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchUsageData()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsageData(false)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Format numbers
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Get status color
  const getStatusColor = (stats: UsageStats) => {
    if (stats.isCritical) return 'text-text-error'
    if (stats.isWarning) return 'text-text-warning'
    return 'text-text-success'
  }

  // Get status badge
  const getStatusBadge = (stats: UsageStats) => {
    if (stats.isCritical) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Critical
        </Badge>
      )
    }
    if (stats.isWarning) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Warning
        </Badge>
      )
    }
    return (
      <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Healthy
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-text-secondary" />
          <span className="ml-2 text-text-secondary">Loading usage data...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-text-error">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Error loading usage data</span>
          </div>
          <p className="text-sm text-text-secondary mt-2">{error}</p>
          <Button 
            onClick={() => fetchUsageData()} 
            variant="secondary" 
            size="sm" 
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!usageData) {
    return null
  }

  const { current, history, limits } = usageData

  return (
    <div className="space-y-6">
      {/* Current Month Usage */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              TTS Usage - {current.currentMonth.month}
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(current)}
              <Button
                onClick={() => fetchUsageData(false)}
                variant="ghost"
                size="sm"
                disabled={refreshing}
              >
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-primary">
                Characters Used
              </span>
              <span className={cn("text-sm font-mono", getStatusColor(current))}>
                {formatNumber(current.currentMonth.characters)} / {formatNumber(limits.charactersPerMonth)}
              </span>
            </div>
            <Progress 
              value={current.percentUsed} 
              className="h-2"
              color={current.isCritical ? 'error' : current.isWarning ? 'warning' : 'success'}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-text-secondary">
                {current.percentUsed.toFixed(1)}% used
              </span>
              <span className="text-xs text-text-secondary">
                {formatNumber(current.charactersRemaining)} remaining
              </span>
            </div>
          </div>

          {/* Usage Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">
                {formatNumber(current.currentMonth.requests)}
              </div>
              <div className="text-xs text-text-secondary">
                Requests
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">
                {formatNumber(current.estimatedRequestsRemaining)}
              </div>
              <div className="text-xs text-text-secondary">
                Est. Remaining
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">
                {current.currentMonth.requests > 0 ? Math.round(current.currentMonth.characters / current.currentMonth.requests) : 0}
              </div>
              <div className="text-xs text-text-secondary">
                Avg. Chars/Request
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">
                {formatDate(current.currentMonth.lastUpdated)}
              </div>
              <div className="text-xs text-text-secondary">
                Last Updated
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex gap-2 pt-4 border-t border-border-subtle">
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="secondary"
              size="sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showHistory ? 'Hide' : 'Show'} History
            </Button>
            <Button
              onClick={resetUsage}
              variant="destructive"
              size="sm"
              disabled={resetting}
            >
              {resetting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Reset Month
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage History */}
      {showHistory && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Usage History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((record) => (
                <div 
                  key={record.month}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary"
                >
                  <div>
                    <div className="font-medium text-text-primary">
                      {record.month}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {formatNumber(record.requests)} requests
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-text-primary">
                      {formatNumber(record.characters)}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {((record.characters / limits.charactersPerMonth) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}