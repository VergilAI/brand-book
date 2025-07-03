'use client'

import { useState, useCallback } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { cn } from '@/lib/utils'
import { JeopardyBoard } from './jeopardy-board'
import { JeopardyClue } from './jeopardy-clue'
import { JeopardyPlayerSetup, type Player } from './jeopardy-player-setup'
import { JeopardyPlayersDisplay } from './jeopardy-players-display'
import { JeopardyBuzzer } from './jeopardy-buzzer'
import { Trophy, RotateCcw } from 'lucide-react'
import type { JeopardyCategory, JeopardyClue as JeopardyClueType } from './jeopardy-game'

interface MultiplayerGameState {
  players: Player[]
  currentPlayerIndex: number
  selectedClue: JeopardyClueType | null
  usedClues: Set<string>
  gamePhase: 'setup' | 'board' | 'clue-selected' | 'buzzer' | 'answering' | 'final' | 'complete'
  buzzerWinner: string | null
  dailyDoubleWager: number
  answeringPlayer: string | null
  finalJeopardyWagers: Record<string, number>
  finalJeopardyAnswers: Record<string, string>
  currentAnswerPhase: 'wager' | 'answer' | 'result'
}

interface JeopardyMultiplayerGameProps {
  categories: JeopardyCategory[]
  onGameEnd?: (players: Player[]) => void
  className?: string
}

export function JeopardyMultiplayerGame({ 
  categories, 
  onGameEnd,
  className 
}: JeopardyMultiplayerGameProps) {
  const [gameState, setGameState] = useState<MultiplayerGameState>({
    players: [],
    currentPlayerIndex: 0,
    selectedClue: null,
    usedClues: new Set(),
    gamePhase: 'setup',
    buzzerWinner: null,
    dailyDoubleWager: 0,
    answeringPlayer: null,
    finalJeopardyWagers: {},
    finalJeopardyAnswers: {},
    currentAnswerPhase: 'wager'
  })

  const currentPlayer = gameState.players[gameState.currentPlayerIndex]

  const handleStartGame = (players: Player[]) => {
    setGameState(prev => ({
      ...prev,
      players,
      gamePhase: 'board',
      currentPlayerIndex: Math.floor(Math.random() * players.length)
    }))
  }

  const handleClueSelect = (clue: JeopardyClueType) => {
    if (gameState.usedClues.has(clue.id)) return
    
    setGameState(prev => ({
      ...prev,
      selectedClue: clue,
      gamePhase: clue.isDailyDouble ? 'clue-selected' : 'buzzer',
      dailyDoubleWager: clue.value,
      answeringPlayer: clue.isDailyDouble ? currentPlayer.id : null
    }))
  }

  const handleBuzz = useCallback((playerId: string) => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'answering',
      buzzerWinner: playerId,
      answeringPlayer: playerId
    }))
  }, [])

  const handleBuzzerTimeUp = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'board',
      selectedClue: null,
      buzzerWinner: null
    }))
  }, [])

  const handleAnswer = (answer: string, wager?: number) => {
    if (!gameState.selectedClue || !gameState.answeringPlayer) return

    const isCorrect = answer.toLowerCase().trim() === 
      gameState.selectedClue.answer.toLowerCase().trim()
    
    const value = wager || gameState.selectedClue.value
    const scoreChange = isCorrect ? value : -value
    const answeringPlayerId = gameState.answeringPlayer

    setGameState(prev => {
      const newPlayers = prev.players.map(p => 
        p.id === answeringPlayerId 
          ? { ...p, score: Math.max(-50000, p.score + scoreChange) }
          : p
      )

      const newUsedClues = new Set([...prev.usedClues, gameState.selectedClue!.id])
      const totalClues = categories.reduce((acc, cat) => acc + cat.clues.length, 0)
      
      // Determine next state
      let nextPhase: MultiplayerGameState['gamePhase'] = 'board'
      let nextPlayerIndex = prev.currentPlayerIndex

      if (isCorrect) {
        // Correct answer: same player keeps control
        nextPlayerIndex = prev.players.findIndex(p => p.id === answeringPlayerId)
      } else if (prev.gamePhase === 'answering' && !prev.selectedClue?.isDailyDouble) {
        // Wrong answer in buzzer round: open to other players
        const remainingPlayers = prev.players.filter(p => p.id !== answeringPlayerId)
        if (remainingPlayers.length > 0) {
          nextPhase = 'buzzer'
          return {
            ...prev,
            players: newPlayers,
            buzzerWinner: null,
            answeringPlayer: null,
            gamePhase: nextPhase
          }
        }
      }

      // Check if all clues are used
      if (newUsedClues.size === totalClues) {
        nextPhase = 'final'
      }

      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: nextPlayerIndex,
        usedClues: newUsedClues,
        selectedClue: null,
        gamePhase: nextPhase,
        buzzerWinner: null,
        answeringPlayer: null,
        dailyDoubleWager: 0
      }
    })
  }

  const handleClueClose = () => {
    setGameState(prev => ({
      ...prev,
      selectedClue: null,
      gamePhase: 'board',
      buzzerWinner: null,
      answeringPlayer: null
    }))
  }

  const resetGame = () => {
    setGameState({
      players: [],
      currentPlayerIndex: 0,
      selectedClue: null,
      usedClues: new Set(),
      gamePhase: 'setup',
      buzzerWinner: null,
      dailyDoubleWager: 0,
      answeringPlayer: null,
      finalJeopardyWagers: {},
      finalJeopardyAnswers: {},
      currentAnswerPhase: 'wager'
    })
  }

  // Setup phase
  if (gameState.gamePhase === 'setup') {
    return (
      <div className={cn("space-y-6", className)}>
        <JeopardyPlayerSetup onStartGame={handleStartGame} />
      </div>
    )
  }

  // Game complete phase
  if (gameState.gamePhase === 'complete') {
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score)
    const winner = sortedPlayers[0]

    return (
      <Card className={cn(
        "p-12 text-center max-w-4xl mx-auto",
        "border-stone-gray/20",
        className
      )}>
        <div className="space-y-6">
          <div className="w-24 h-24 rounded-full bg-cosmic-purple/10 mx-auto flex items-center justify-center">
            <Trophy className="w-12 h-12 text-cosmic-purple" />
          </div>
          
          <h2 className="text-4xl font-display font-bold text-deep-space">
            Game Complete!
          </h2>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg text-stone-gray mb-2">Winner</p>
              <p className="text-3xl font-display font-bold text-cosmic-purple">
                {winner.name}
              </p>
              <p className="text-2xl font-mono font-bold text-deep-space">
                ${winner.score.toLocaleString()}
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-display font-bold text-deep-space">Final Standings</h3>
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className="flex justify-between items-center p-2 rounded bg-mist-gray/20">
                  <span className="font-medium">
                    {index + 1}. {player.name}
                  </span>
                  <span className="font-mono font-bold">
                    ${player.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            size="lg"
            onClick={resetGame}
            className="bg-cosmic-purple text-white hover:bg-electric-violet"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-deep-space">Jeopardy!</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-stone-gray">
            {currentPlayer?.name}'s turn to choose
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            className="text-stone-gray hover:text-deep-space"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <JeopardyBoard
            categories={categories}
            usedClues={gameState.usedClues}
            onClueSelect={handleClueSelect}
          />
        </div>

        <div className="lg:col-span-1">
          <JeopardyPlayersDisplay
            players={gameState.players}
            currentPlayer={currentPlayer?.id || null}
            buzzerWinner={gameState.buzzerWinner}
          />
        </div>
      </div>

      {gameState.gamePhase === 'buzzer' && (
        <JeopardyBuzzer
          players={gameState.players}
          isActive={true}
          onBuzz={handleBuzz}
          onTimeUp={handleBuzzerTimeUp}
        />
      )}

      {(gameState.gamePhase === 'clue-selected' || gameState.gamePhase === 'answering') && gameState.selectedClue && (
        <JeopardyClue
          clue={gameState.selectedClue}
          currentScore={gameState.players.find(p => p.id === gameState.answeringPlayer)?.score || 0}
          onAnswer={handleAnswer}
          onClose={handleClueClose}
        />
      )}
    </div>
  )
}