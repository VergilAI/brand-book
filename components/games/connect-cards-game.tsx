'use client'

import { useState, useEffect } from 'react'
import { X, Shuffle, CheckCircle, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import { cn } from '@/lib/utils'

interface ConnectCardsGameProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

interface CardPair {
  id: string
  term: string
  definition: string
  category: 'concept' | 'technique' | 'application' | 'theory'
}

interface GameCard {
  id: string
  content: string
  type: 'term' | 'definition'
  pairId: string
  category: string
  isMatched: boolean
  isSelected: boolean
}

const cardPairs: CardPair[] = [
  {
    id: 'ai-definition',
    term: 'Artificial Intelligence',
    definition: 'The simulation of human intelligence in machines',
    category: 'concept'
  },
  {
    id: 'machine-learning',
    term: 'Machine Learning',
    definition: 'A subset of AI that learns from data without explicit programming',
    category: 'technique'
  },
  {
    id: 'neural-networks',
    term: 'Neural Networks',
    definition: 'Computing systems inspired by biological neural networks',
    category: 'technique'
  },
  {
    id: 'deep-learning',
    term: 'Deep Learning',
    definition: 'ML technique using neural networks with multiple layers',
    category: 'technique'
  },
  {
    id: 'supervised-learning',
    term: 'Supervised Learning',
    definition: 'Learning approach using labeled training data',
    category: 'technique'
  },
  {
    id: 'unsupervised-learning',
    term: 'Unsupervised Learning',
    definition: 'Learning approach that finds patterns in unlabeled data',
    category: 'technique'
  },
  {
    id: 'reinforcement-learning',
    term: 'Reinforcement Learning',
    definition: 'Learning through interaction with environment and feedback',
    category: 'technique'
  },
  {
    id: 'natural-language-processing',
    term: 'Natural Language Processing',
    definition: 'AI field focused on understanding and generating human language',
    category: 'application'
  }
]

export function ConnectCardsGame({ lessonId, onClose, onComplete }: ConnectCardsGameProps) {
  const [gameCards, setGameCards] = useState<GameCard[]>([])
  const [selectedCards, setSelectedCards] = useState<GameCard[]>([])
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set())
  const [currentRound, setCurrentRound] = useState(1)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isCorrectMatch, setIsCorrectMatch] = useState(false)

  // Handle body scroll lock
  useEffect(() => {
    // Store original body styles
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width
    
    // Get current scroll position
    const scrollY = window.scrollY
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    
    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = originalWidth
      
      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }, [])

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [currentRound])

  const initializeGame = () => {
    // Take first 3 pairs for the game
    const roundPairs = cardPairs.slice(0, 3)
    
    // Create game cards
    const terms: GameCard[] = []
    const definitions: GameCard[] = []
    
    roundPairs.forEach(pair => {
      terms.push({
        id: `term-${pair.id}`,
        content: pair.term,
        type: 'term',
        pairId: pair.id,
        category: pair.category,
        isMatched: false,
        isSelected: false
      })
      definitions.push({
        id: `def-${pair.id}`,
        content: pair.definition,
        type: 'definition',
        pairId: pair.id,
        category: pair.category,
        isMatched: false,
        isSelected: false
      })
    })
    
    // Shuffle terms and definitions separately
    const shuffledTerms = [...terms].sort(() => Math.random() - 0.5)
    const shuffledDefinitions = [...definitions].sort(() => Math.random() - 0.5)
    
    // Combine them with terms first, then definitions
    const shuffledCards = [...shuffledTerms, ...shuffledDefinitions]
    setGameCards(shuffledCards)
    setSelectedCards([])
    setShowFeedback(false)
  }

  const handleCardClick = (card: GameCard) => {
    if (card.isMatched || card.isSelected || selectedCards.length >= 2) return

    const newSelectedCards = [...selectedCards, card]
    setSelectedCards(newSelectedCards)
    
    // Update card selection state
    setGameCards(prev => prev.map(c => 
      c.id === card.id ? { ...c, isSelected: true } : c
    ))

    // Check for match when 2 cards are selected
    if (newSelectedCards.length === 2) {
      checkMatch(newSelectedCards)
    }
  }

  const checkMatch = (cards: GameCard[]) => {
    const [card1, card2] = cards
    const isMatch = card1.pairId === card2.pairId && card1.type !== card2.type
    
    setAttempts(prev => prev + 1)
    
    setTimeout(() => {
      if (isMatch) {
        // Correct match
        setScore(prev => prev + 10)
        setMatchedPairs(prev => new Set([...prev, card1.pairId]))
        setGameCards(prev => prev.map(c => 
          c.pairId === card1.pairId ? { ...c, isMatched: true, isSelected: false } : 
          { ...c, isSelected: false }
        ))
        setIsCorrectMatch(true)
        setFeedbackMessage('Perfect match!')
        
        // Check if game is complete
        if (matchedPairs.size + 1 >= 3) {
          setGameComplete(true)
        }
      } else {
        // Incorrect match
        setGameCards(prev => prev.map(c => ({ ...c, isSelected: false })))
        setIsCorrectMatch(false)
        setFeedbackMessage('Not quite right. Try again!')
      }
      
      setSelectedCards([])
      setShowFeedback(true)
      
      // Hide feedback after 2 seconds
      setTimeout(() => setShowFeedback(false), 2000)
    }, 500)
  }

  const resetGame = () => {
    setMatchedPairs(new Set())
    setScore(0)
    setAttempts(0)
    setGameComplete(false)
    setCurrentRound(1)
    initializeGame()
  }

  const handleComplete = () => {
    const finalScore = Math.round((score / attempts) * 100) || 0
    onComplete(finalScore)
  }

  const totalPairs = 3
  const progressPercentage = Math.round((matchedPairs.size / totalPairs) * 100)

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal"> {/* rgba(0, 0, 0, 0.5) */}
      <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col"> {/* #FFFFFF */}
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between"> {/* rgba(0,0,0,0.05) */}
          <div className="flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-text-brand" /> {/* #7B00FF */}
            <h2 className="text-xl font-semibold text-text-primary"> {/* #1D1D1F */}
              Connect Cards - Match AI Concepts
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-text-secondary">Score</span> {/* #6C6C6D */}
                <span className="text-text-success font-semibold">{score}</span> {/* #0F8A0F */}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-text-secondary">Attempts</span>
                <span className="text-text-info font-semibold">{attempts}</span> {/* #0087FF */}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-text-secondary">Matched</span>
                <span className="text-text-primary font-semibold">{matchedPairs.size}/{totalPairs}</span>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-border-subtle bg-bg-secondary"> {/* rgba(0,0,0,0.05), #F5F5F7 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Progress</span>
            <span className="text-sm font-medium text-text-primary">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Game Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {gameComplete ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <Trophy className="h-16 w-16 text-text-success mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  Congratulations!
                </h3>
                <p className="text-text-secondary mb-4">
                  You've successfully matched all the AI concepts!
                </p>
                <div className="flex justify-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-success">{score}</div>
                    <div className="text-text-secondary">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-info">{attempts}</div>
                    <div className="text-text-secondary">Attempts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-text-warning">
                      {Math.round((score / attempts) * 100) || 0}%
                    </div>
                    <div className="text-text-secondary">Accuracy</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="secondary" 
                  onClick={resetGame}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Play Again
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleComplete}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Match AI terms with their definitions
                </h3>
                <p className="text-text-secondary">
                  Click on a term on the left and then click on its matching definition on the right
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Terms Column */}
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h4 className="text-md font-semibold text-text-primary mb-1">Terms</h4>
                    <div className="h-1 bg-text-brand rounded-full mx-auto w-16"></div>
                  </div>
                  {gameCards
                    .filter(card => card.type === 'term')
                    .map((card) => (
                    <Card
                      key={card.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                        card.isMatched && "opacity-50 cursor-not-allowed bg-bg-success-light border-2 border-border-success",
                        card.isSelected && "border-4 border-text-brand shadow-brand-lg ring-4 ring-text-brand ring-opacity-20",
                        !card.isMatched && !card.isSelected && "hover:shadow-card-hover hover:border-border-emphasis border-2 border-border-subtle"
                      )}
                      onClick={() => handleCardClick(card)}
                    >
                      <CardContent className="p-4 min-h-[100px] flex flex-col justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <Badge 
                              variant="primary"
                              className="text-xs"
                            >
                              Term
                            </Badge>
                            {card.isMatched && (
                              <CheckCircle className="h-4 w-4 text-text-success" />
                            )}
                          </div>
                          <p className="text-base font-semibold text-text-primary leading-relaxed">
                            {card.content}
                          </p>
                        </div>
                        
                        <div className="mt-3">
                          <Badge 
                            variant="secondary" 
                            className="text-xs capitalize"
                          >
                            {card.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Definitions Column */}
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h4 className="text-md font-semibold text-text-primary mb-1">Definitions</h4>
                    <div className="h-1 bg-text-info rounded-full mx-auto w-16"></div>
                  </div>
                  {gameCards
                    .filter(card => card.type === 'definition')
                    .map((card) => (
                    <Card
                      key={card.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                        card.isMatched && "opacity-50 cursor-not-allowed bg-bg-success-light border-2 border-border-success",
                        card.isSelected && "border-4 border-text-info shadow-brand-lg ring-4 ring-text-info ring-opacity-20",
                        !card.isMatched && !card.isSelected && "hover:shadow-card-hover hover:border-border-emphasis border-2 border-border-subtle"
                      )}
                      onClick={() => handleCardClick(card)}
                    >
                      <CardContent className="p-4 min-h-[100px] flex flex-col justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <Badge 
                              variant="info"
                              className="text-xs"
                            >
                              Definition
                            </Badge>
                            {card.isMatched && (
                              <CheckCircle className="h-4 w-4 text-text-success" />
                            )}
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {card.content}
                          </p>
                        </div>
                        
                        <div className="mt-3">
                          <Badge 
                            variant="secondary" 
                            className="text-xs capitalize"
                          >
                            {card.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                  <div className={cn(
                    "px-4 py-2 rounded-lg shadow-lg text-white font-medium",
                    isCorrectMatch ? "bg-text-success" : "bg-text-error"
                  )}>
                    {feedbackMessage}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}