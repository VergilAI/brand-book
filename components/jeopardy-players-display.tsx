'use client'

import { Card } from '@/components/card'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Zap } from 'lucide-react'
import type { Player } from './jeopardy-player-setup'

interface JeopardyPlayersDisplayProps {
  players: Player[]
  currentPlayer: string | null
  buzzerWinner: string | null
  className?: string
}

export function JeopardyPlayersDisplay({ 
  players, 
  currentPlayer, 
  buzzerWinner,
  className 
}: JeopardyPlayersDisplayProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const leader = sortedPlayers[0]

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-3">
        <h3 className="text-lg font-display font-bold text-deep-space text-center">
          Players
        </h3>
        
        <div className="space-y-2">
          {players.map((player, index) => {
            const isCurrentPlayer = currentPlayer === player.id
            const isBuzzerWinner = buzzerWinner === player.id
            const isLeader = leader.id === player.id && leader.score > 0
            const isNegative = player.score < 0

            return (
              <motion.div
                key={player.id}
                layout
                className={cn(
                  "relative p-3 rounded-lg border transition-all duration-200",
                  isCurrentPlayer && "border-cosmic-purple bg-cosmic-purple/5",
                  isBuzzerWinner && "border-electric-violet bg-electric-violet/10 scale-105",
                  !isCurrentPlayer && !isBuzzerWinner && "border-stone-gray/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all",
                      `bg-${player.color}`,
                      isBuzzerWinner && "animate-pulse"
                    )}>
                      {index + 1}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium transition-colors",
                          isCurrentPlayer ? "text-cosmic-purple" : "text-deep-space"
                        )}>
                          {player.name}
                        </span>
                        
                        {isLeader && (
                          <Crown className="w-4 h-4 text-cosmic-purple" />
                        )}
                        
                        {isCurrentPlayer && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xs bg-cosmic-purple text-white px-2 py-1 rounded-full"
                          >
                            Turn
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={player.score}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "text-lg font-mono font-bold",
                          isNegative ? "text-vivid-red" : "text-deep-space"
                        )}
                      >
                        {isNegative && "-"}${Math.abs(player.score).toLocaleString()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {isBuzzerWinner && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <div className="bg-electric-violet text-white p-1 rounded-full">
                      <Zap className="w-3 h-3" />
                    </div>
                  </motion.div>
                )}

                {isCurrentPlayer && !isBuzzerWinner && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-cosmic-purple pointer-events-none"
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}