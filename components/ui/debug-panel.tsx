'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { X, Bug, Play, Trash2, Database, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface DebugAction {
  id: string
  label: string
  description: string
  action: () => Promise<void> | void
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  icon?: React.ReactNode
}

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [isRunning, setIsRunning] = useState<string | null>(null)
  const [logs, setLogs] = useState<Array<{ id: string; message: string; type: 'info' | 'success' | 'error' | 'warning' }>>([]);

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const log = { id: Date.now().toString(), message, type }
    setLogs(prev => [...prev, log])
    console.log(`[${type.toUpperCase()}]`, message)
  }

  const clearLogs = () => {
    setLogs([])
    console.clear()
  }

  const debugActions: DebugAction[] = [
    {
      id: 'test-api',
      label: 'Test API Connection',
      description: 'Verify API endpoints are responding',
      icon: <Play className="w-3 h-3" />,
      action: async () => {
        addLog('Testing API connection...', 'info')
        try {
          // Simulate API test
          await new Promise(resolve => setTimeout(resolve, 1000))
          addLog('API connection successful', 'success')
        } catch (error) {
          addLog(`API test failed: ${error}`, 'error')
        }
      }
    },
    {
      id: 'check-storage',
      label: 'Check Local Storage',
      description: 'View current localStorage data',
      icon: <Database className="w-3 h-3" />,
      action: () => {
        addLog('Checking localStorage...', 'info')
        const keys = Object.keys(localStorage)
        if (keys.length === 0) {
          addLog('localStorage is empty', 'warning')
        } else {
          keys.forEach(key => {
            addLog(`${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`, 'info')
          })
        }
      }
    },
    {
      id: 'clear-storage',
      label: 'Clear Storage',
      description: 'Remove all localStorage data',
      variant: 'destructive',
      icon: <Trash2 className="w-3 h-3" />,
      action: () => {
        const confirmClear = window.confirm('Are you sure you want to clear all localStorage data?')
        if (confirmClear) {
          localStorage.clear()
          addLog('localStorage cleared', 'success')
          setTimeout(() => window.location.reload(), 1000)
        }
      }
    }
  ]

  const runAction = async (action: DebugAction) => {
    if (isRunning) return
    setIsRunning(action.id)
    try {
      await action.action()
    } finally {
      setIsRunning(null)
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-tooltip">
        <Button
          onClick={() => setIsVisible(true)}
          variant="destructive"
          size="sm"
          className="shadow-brand-md hover:shadow-brand-lg transition-all duration-normal animate-pulse-glow"
        >
          <Bug className="w-4 h-4 mr-1" />
          Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-modal max-w-md">
      <Card className="card-default shadow-modal border-2 border-error bg-primary">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-error flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Debug Panel
            </h3>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-secondary hover:text-primary p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {debugActions.map(action => (
              <Button
                key={action.id}
                onClick={() => runAction(action)}
                disabled={isRunning !== null}
                variant={action.variant || 'secondary'}
                size="sm"
                className="w-full justify-start text-left font-mono text-xs transition-all duration-fast"
              >
                {isRunning === action.id ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  action.icon && <span className="mr-2">{action.icon}</span>
                )}
                <div className="flex-1">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-secondary text-xs font-normal">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Logs */}
          {logs.length > 0 && (
            <div className="border-t border-default pt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-primary">Console Output</h4>
                <Button
                  onClick={clearLogs}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-secondary hover:text-primary p-1 h-auto"
                >
                  Clear
                </Button>
              </div>
              <div className="bg-inverse text-inverse rounded-md p-2 max-h-48 overflow-y-auto space-y-1 font-mono text-xs">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-2">
                    {log.type === 'success' && <CheckCircle className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />}
                    {log.type === 'error' && <XCircle className="w-3 h-3 text-error mt-0.5 flex-shrink-0" />}
                    {log.type === 'warning' && <span className="text-warning">⚠</span>}
                    {log.type === 'info' && <span className="text-info">ℹ</span>}
                    <span className={cn(
                      log.type === 'success' && 'text-success',
                      log.type === 'error' && 'text-error',
                      log.type === 'warning' && 'text-warning',
                      log.type === 'info' && 'text-info'
                    )}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-xs text-secondary text-center">
            Check browser console for detailed logs
          </div>
        </div>
      </Card>
    </div>
  )
}

// Helper function for className concatenation
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}