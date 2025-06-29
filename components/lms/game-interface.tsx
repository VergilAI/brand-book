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
  Home,
  CheckCircle,
  XCircle,
  Sparkles
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface GameInterfaceProps {
  courseId: string
  gameId: string
}

// Type definitions for different game types
type GameType = 'drag-drop' | 'matching' | 'quiz' | 'puzzle'

interface DragItem {
  id: string
  content: string
  category: string
}

interface MatchingPair {
  id: string
  left: string
  right: string
  matched?: boolean
}

interface Game {
  id: string
  title: string
  type: GameType
  description: string
  instructions: string
  courseTitle: string
  points: number
  timeLimit?: number
  lives: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export function GameInterface({ courseId, gameId }: GameInterfaceProps) {
  const [game] = useState<Game>({
    id: gameId,
    title: 'AI Concepts Matching Game',
    type: 'matching',
    description: 'Match AI concepts with their definitions',
    instructions: 'Click on cards to reveal them. Match each concept with its correct definition.',
    courseTitle: 'AI Fundamentals',
    points: 100,
    lives: 3,
    difficulty: 'medium'
  })

  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(game.lives)
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'completed'>('ready')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)

  // Matching game specific state
  const [matchingPairs] = useState<MatchingPair[]>([
    { id: '1', left: 'Machine Learning', right: 'Systems that learn from data' },
    { id: '2', left: 'Neural Network', right: 'Computing system inspired by the brain' },
    { id: '3', left: 'Deep Learning', right: 'ML using multi-layered neural networks' },
    { id: '4', left: 'NLP', right: 'Processing and analyzing human language' },
    { id: '5', left: 'Computer Vision', right: 'Interpreting visual information' },
    { id: '6', left: 'Reinforcement Learning', right: 'Learning through rewards and penalties' }
  ])
  
  const [cards, setCards] = useState<Array<{
    id: string
    content: string
    type: 'left' | 'right'
    pairId: string
    revealed: boolean
    matched: boolean
  }>>([])
  
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set())

  // Initialize matching game cards
  useEffect(() => {
    if (game.type === 'matching') {
      const gameCards = matchingPairs.flatMap(pair => [
        { id: `${pair.id}-left`, content: pair.left, type: 'left' as const, pairId: pair.id, revealed: false, matched: false },
        { id: `${pair.id}-right`, content: pair.right, type: 'right' as const, pairId: pair.id, revealed: false, matched: false }
      ])
      // Shuffle cards
      setCards(gameCards.sort(() => Math.random() - 0.5))
    }
  }, [game.type, matchingPairs])

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
    setLives(game.lives)
    setTimeElapsed(0)
    setGameState('ready')
    setShowInstructions(true)
    setSelectedCards([])
    setMatchedPairs(new Set())
    
    // Reset cards
    if (game.type === 'matching') {
      setCards(prev => prev.map(card => ({ ...card, revealed: false, matched: false })))
    }
  }

  const handleCardClick = (cardId: string) => {
    if (gameState !== 'playing') return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.revealed || card.matched) return

    const newSelectedCards = [...selectedCards, cardId]
    setSelectedCards(newSelectedCards)
    
    // Reveal the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, revealed: true } : c
    ))

    // Check for match when 2 cards are selected
    if (newSelectedCards.length === 2) {
      const [firstId, secondId] = newSelectedCards
      const firstCard = cards.find(c => c.id === firstId)!
      const secondCard = cards.find(c => c.id === secondId)!

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.pairId === firstCard.pairId ? { ...c, matched: true } : c
          ))
          setMatchedPairs(prev => new Set([...prev, firstCard.pairId]))
          setScore(prev => prev + 20)
          setSelectedCards([])
          
          // Check if game is complete
          if (matchedPairs.size + 1 === matchingPairs.length) {
            setGameState('completed')
            setScore(prev => prev + 50) // Bonus points for completion
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) ? { ...c, revealed: false } : c
          ))
          setSelectedCards([])
          setLives(prev => Math.max(0, prev - 1))
          
          if (lives <= 1) {
            setGameState('completed')
          }
        }, 1000)
      }
    }
  }

  const handleExitGame = () => {
    if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
      window.location.href = `/lms/course/${courseId}`
    }
  }

  // Game completed screen
  if (gameState === 'completed') {
    const success = matchedPairs.size === matchingPairs.length
    
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {success ? (
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-12 w-12 text-green-600" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
              )}
              
              <h2 className="text-2xl font-bold mb-2">
                {success ? 'Congratulations!' : 'Game Over'}
              </h2>
              <p className="text-muted-foreground">
                {success ? 'You completed the game!' : 'Better luck next time!'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span className="font-medium">Final Score</span>
                <span className="text-2xl font-bold text-cosmic-purple">{score}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span className="font-medium">Time</span>
                <span>{formatTime(timeElapsed)}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span className="font-medium">Accuracy</span>
                <span>{Math.round((matchedPairs.size / matchingPairs.length) * 100)}%</span>
              </div>

              {success && (
                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-8 w-8",
                        star <= (score >= 150 ? 3 : score >= 100 ? 2 : 1)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleExitGame}
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <Button
                className="flex-1 bg-cosmic-purple hover:bg-cosmic-purple/90"
                onClick={handleRestartGame}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Instructions screen
  if (showInstructions) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cosmic-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-cosmic-purple" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
              <Badge className={cn(
                "mb-4",
                game.difficulty === 'easy' && "bg-green-100 text-green-800",
                game.difficulty === 'medium' && "bg-yellow-100 text-yellow-800",
                game.difficulty === 'hard' && "bg-red-100 text-red-800"
              )}>
                {game.difficulty.toUpperCase()}
              </Badge>
              <p className="text-muted-foreground">{game.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">How to Play</h3>
                <p className="text-sm text-muted-foreground">{game.instructions}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cosmic-purple">{game.points}</div>
                  <div className="text-xs text-muted-foreground">Max Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{game.lives}</div>
                  <div className="text-xs text-muted-foreground">Lives</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {game.timeLimit ? `${game.timeLimit}s` : '∞'}
                  </div>
                  <div className="text-xs text-muted-foreground">Time Limit</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleExitGame}
              >
                Back to Course
              </Button>
              <Button
                className="flex-1 bg-cosmic-purple hover:bg-cosmic-purple/90"
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-cosmic-purple/20 to-electric-violet/20">
      {/* Game header */}
      <header className="bg-white/95 backdrop-blur border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">{game.title}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-lg">{score}</span>
              </div>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: game.lives }, (_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < lives ? "fill-red-500 text-red-500" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              
              <Badge variant="outline">
                {formatTime(timeElapsed)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
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
            >
              {gameState === 'paused' ? (
                <Play className="h-5 w-5" />
              ) : (
                <Pause className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExitGame}
            >
              <X className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Game content */}
      <div className="h-[calc(100vh-80px)] overflow-auto p-8">
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
              <Button
                className="w-full bg-cosmic-purple hover:bg-cosmic-purple/90"
                onClick={handlePauseGame}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume Game
              </Button>
            </Card>
          </div>
        )}

        {/* Matching game grid */}
        {game.type === 'matching' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 text-center">
              <Progress 
                value={(matchedPairs.size / matchingPairs.length) * 100} 
                className="h-3 max-w-md mx-auto"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {matchedPairs.size} of {matchingPairs.length} pairs matched
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.matched || gameState !== 'playing'}
                  className={cn(
                    "aspect-square rounded-lg p-4 transition-all duration-300 transform hover:scale-105",
                    card.revealed || card.matched
                      ? card.matched
                        ? "bg-green-100 border-2 border-green-500"
                        : card.type === 'left'
                          ? "bg-cosmic-purple text-white"
                          : "bg-electric-violet text-white"
                      : "bg-white border-2 border-gray-200 hover:border-gray-300",
                    card.matched && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {card.revealed || card.matched ? (
                    <div className="h-full flex items-center justify-center text-center">
                      <p className="text-sm font-medium">{card.content}</p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Zap className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}