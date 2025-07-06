'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Users, Play, X } from 'lucide-react'

export interface Player {
  id: string
  name: string
  score: number
  color: string
}

interface JeopardyPlayerSetupProps {
  onStartGame: (players: Player[]) => void
  className?: string
}

const playerColors = [
  'cosmic-purple',
  'electric-violet', 
  'phosphor-cyan',
  'luminous-indigo',
  'neural-pink'
]

export function JeopardyPlayerSetup({ onStartGame, className }: JeopardyPlayerSetupProps) {
  const [players, setPlayers] = useState<Omit<Player, 'score'>[]>([
    { id: '1', name: '', color: playerColors[0] },
    { id: '2', name: '', color: playerColors[1] }
  ])

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p))
  }

  const addPlayer = () => {
    if (players.length < 5) {
      setPlayers(prev => [...prev, {
        id: String(prev.length + 1),
        name: '',
        color: playerColors[prev.length]
      }])
    }
  }

  const removePlayer = (id: string) => {
    if (players.length > 2) {
      setPlayers(prev => prev.filter(p => p.id !== id))
    }
  }

  const handleStartGame = () => {
    const validPlayers = players.filter(p => p.name.trim())
    if (validPlayers.length >= 2) {
      const playersWithScores: Player[] = validPlayers.map(p => ({
        ...p,
        score: 0
      }))
      onStartGame(playersWithScores)
    }
  }

  const canStart = players.filter(p => p.name.trim()).length >= 2

  return (
    <Card className={cn("max-w-2xl mx-auto", className)}>
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-cosmic-purple/10 mx-auto mb-4 flex items-center justify-center">
          <Users className="w-8 h-8 text-cosmic-purple" />
        </div>
        <CardTitle className="text-3xl font-display font-bold text-deep-space">
          Player Setup
        </CardTitle>
        <p className="text-stone-gray">Enter player names to start the game</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
                `bg-${player.color}`
              )}>
                {index + 1}
              </div>
              
              <Input
                value={player.name}
                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                placeholder={`Player ${index + 1} name`}
                className="flex-1"
              />

              {players.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePlayer(player.id)}
                  className="text-stone-gray hover:text-vivid-red"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4">
          {players.length < 5 && (
            <Button
              variant="secondary"
              onClick={addPlayer}
              className="flex-1"
            >
              Add Player
            </Button>
          )}
          
          <Button
            onClick={handleStartGame}
            disabled={!canStart}
            className="flex-1 bg-cosmic-purple text-white hover:bg-electric-violet"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        </div>

        <div className="text-center text-sm text-stone-gray">
          Need at least 2 players • Maximum 5 players
        </div>
      </CardContent>
    </Card>
  )
}