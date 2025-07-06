'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Trophy, 
  Star, 
  Heart, 
  Zap, 
  RefreshCw, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  Sparkles,
  Brain,
  Timer,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/progress'
import { cn } from '@/lib/utils'

interface GameInterfaceProps {
  courseId: string
  gameId: string
  gameType?: 'matching' | 'quiz' | 'puzzle' | 'drag-drop'
  title?: string
  description?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  onExit?: () => void
}

export function GameInterface({ 
  courseId, 
  gameId, 
  gameType = 'matching',
  title = 'AI Concepts Matching Game',
  description = 'Match AI concepts with their definitions',
  difficulty = 'medium',
  onExit
}: GameInterfaceProps) {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'playing' | 'paused' | 'completed'>('loading')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [accuracy, setAccuracy] = useState(100)
  const [streak, setStreak] = useState(0)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState('ready')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartGame = () => {
    setGameState('playing')
    setShowInstructions(false)
  }

  const handlePauseGame = () => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused')
  }

  const handleRestartGame = () => {
    setScore(0)
    setLives(3)
    setTimeElapsed(0)
    setGameState('ready')
    setShowInstructions(true)
    setAccuracy(100)
    setStreak(0)
  }

  const handleExitGame = () => {
    if (onExit) {
      onExit()
    } else {
      window.location.href = `/lms/course/${courseId}`
    }
  }

  // Difficulty settings
  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy':
        return { points: 50, timeBonus: 100, lives: 5 }
      case 'hard':
        return { points: 200, timeBonus: 300, lives: 1 }
      default:
        return { points: 100, timeBonus: 200, lives: 3 }
    }
  }

  const settings = getDifficultySettings()

  // Loading state
  if (gameState === 'loading') {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal flex items-center justify-center">
        <Card className="card-neural p-2xl text-center">
          <div className="animate-pulse">
            <Sparkles className="w-16 h-16 text-text-brand mx-auto mb-lg" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-sm">
            Loading Game
          </h2>
          <p className="text-text-secondary">Preparing your learning experience...</p>
        </Card>
      </div>
    )
  }

  // Completed state
  if (gameState === 'completed') {
    const finalScore = score + Math.max(0, settings.timeBonus - timeElapsed)
    const stars = finalScore >= 400 ? 3 : finalScore >= 250 ? 2 : 1
    
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-lg">
          <Card className="card-neural max-w-3xl w-full my-auto max-h-[90vh] overflow-y-auto">
            <CardContent className="p-2xl space-y-xl">
              {/* Header */}
              <div className="text-center space-y-lg">
                <div className="w-20 h-20 rounded-full bg-bg-brand flex items-center justify-center mx-auto animate-pulse shadow-brand-md">
                  <Trophy className="w-10 h-10 text-text-inverse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-sm">
                    Game Complete!
                  </h2>
                  <p className="text-text-secondary">
                    You've finished {title}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-sm">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-12 h-12 transition-all duration-slow",
                      star <= stars 
                        ? "fill-yellow-400 text-yellow-400 animate-pulse" 
                        : "text-text-disabled"
                    )}
                  />
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                <Card className="card-outlined text-center">
                  <CardContent className="p-lg">
                    <TrendingUp className="w-8 h-8 text-text-brand mx-auto mb-sm" />
                    <div className="text-xl font-bold text-text-primary">
                      {finalScore}
                    </div>
                    <div className="text-sm text-text-secondary">Total Score</div>
                  </CardContent>
                </Card>

                <Card className="card-outlined text-center">
                  <CardContent className="p-lg">
                    <Timer className="w-8 h-8 text-text-info mx-auto mb-sm" />
                    <div className="text-xl font-bold text-text-primary">
                      {formatTime(timeElapsed)}
                    </div>
                    <div className="text-sm text-text-secondary">Time</div>
                  </CardContent>
                </Card>

                <Card className="card-outlined text-center">
                  <CardContent className="p-lg">
                    <Zap className="w-8 h-8 text-text-warning mx-auto mb-sm" />
                    <div className="text-xl font-bold text-text-primary">
                      {accuracy}%
                    </div>
                    <div className="text-sm text-text-secondary">Accuracy</div>
                  </CardContent>
                </Card>

                <Card className="card-outlined text-center">
                  <CardContent className="p-lg">
                    <Brain className="w-8 h-8 text-text-success mx-auto mb-sm" />
                    <div className="text-xl font-bold text-text-primary">
                      +{Math.round(accuracy)}%
                    </div>
                    <div className="text-sm text-text-secondary">Knowledge</div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex gap-md">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleExitGame}
                  className="flex-1"
                >
                  Exit Game
                </Button>
                <Button
                  size="lg"
                  onClick={handleRestartGame}
                  className="flex-1 btn-primary"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Instructions screen
  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal flex items-center justify-center p-lg">
        <Card className="card-default max-w-lg w-full">
          <CardContent className="p-2xl">
            <div className="text-center mb-xl">
              <div className="w-16 h-16 bg-bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-lg animate-pulse">
                <Sparkles className="h-8 w-8 text-text-brand" />
              </div>
              <h2 className="text-xl font-bold mb-sm">{title}</h2>
              <Badge className={cn(
                "mb-md",
                difficulty === 'easy' && "bg-bg-success/10 text-text-success border-border-success",
                difficulty === 'medium' && "bg-bg-warning/10 text-text-warning border-border-warning",
                difficulty === 'hard' && "bg-bg-error/10 text-text-error border-border-error"
              )}>
                {difficulty.toUpperCase()}
              </Badge>
              <p className="text-text-secondary">{description}</p>
            </div>

            <Card className="card-outlined mb-xl">
              <CardContent className="p-lg">
                <h3 className="font-semibold mb-sm">How to Play</h3>
                <p className="text-sm text-text-secondary mb-lg">
                  Match concepts with their correct definitions. Click cards to reveal them and find matching pairs.
                </p>

                <div className="grid grid-cols-3 gap-md text-center">
                  <div>
                    <div className="text-xl font-bold text-text-brand">{settings.points}</div>
                    <div className="text-xs text-text-tertiary">Points per Match</div>
                  </div>
                  <div>
                    <div className="flex justify-center gap-1 mb-1">
                      {Array.from({ length: settings.lives }).map((_, i) => (
                        <Heart key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                      ))}
                    </div>
                    <div className="text-xs text-text-tertiary">Lives</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-text-info">∞</div>
                    <div className="text-xs text-text-tertiary">Time Limit</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-md">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleExitGame}
              >
                Back to Course
              </Button>
              <Button
                className="flex-1 btn-primary"
                onClick={handleStartGame}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main game interface
  return (
    <div className="fixed inset-0 z-modal bg-bg-secondary">
      {/* Game header */}
      <header className="bg-bg-primary border-b border-border-default">
        <div className="max-w-7xl mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-xl">
              <h1 className="text-lg font-bold">{title}</h1>
              
              <div className="flex items-center gap-lg">
                <div className="flex items-center gap-sm animate-pulse">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-lg">{score}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: settings.lives }, (_, i) => (
                    <Heart
                      key={i}
                      className={cn(
                        "h-5 w-5 transition-all duration-normal",
                        i < lives 
                          ? "fill-red-500 text-red-500" 
                          : "text-text-disabled"
                      )}
                    />
                  ))}
                </div>
                
                <Badge variant="default" className="bg-bg-elevated">
                  <Timer className="w-3 h-3 mr-1" />
                  {formatTime(timeElapsed)}
                </Badge>

                {streak > 0 && (
                  <Badge variant="default" className="bg-bg-brand/10 text-text-brand animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    {streak}x Streak
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="hover:bg-bg-elevated"
              >
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePauseGame}
                className="hover:bg-bg-elevated"
              >
                {gameState === 'paused' ? (
                  <Play className="h-5 w-5" />
                ) : (
                  <Pause className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExitGame}
                className="hover:bg-bg-error/10 hover:text-text-error hover:border-border-error"
              >
                <X className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Game content */}
      <div className="h-[calc(100vh-64px)] overflow-auto p-2xl">
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center z-dropdown">
            <Card className="card-default p-2xl">
              <h2 className="text-xl font-bold mb-lg">
                Game Paused
              </h2>
              <Button
                className="w-full btn-primary"
                onClick={handlePauseGame}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume Game
              </Button>
            </Card>
          </div>
        )}

        {/* Game content placeholder */}
        <div className="max-w-5xl mx-auto">
          <div className="mb-xl text-center">
            <Progress 
              value={30} 
              className="h-3 max-w-md mx-auto mb-sm"
            />
            <p className="text-sm text-text-secondary">
              3 of 10 matches completed
            </p>
          </div>

          {/* Demo complete button */}
          <div className="text-center mt-3xl">
            <Button
              size="lg"
              onClick={() => setGameState('completed')}
              className="btn-primary shadow-brand-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Game (Demo)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}