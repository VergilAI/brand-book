'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Clock, Users } from 'lucide-react'
import type { Player } from './jeopardy-player-setup'

interface JeopardyBuzzerProps {
  players: Player[]
  isActive: boolean
  timeLimit?: number
  onBuzz: (playerId: string) => void
  onTimeUp: () => void
  className?: string
}

export function JeopardyBuzzer({ 
  players, 
  isActive, 
  timeLimit = 5000,
  onBuzz, 
  onTimeUp,
  className 
}: JeopardyBuzzerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (isActive && !hasStarted) {
      setHasStarted(true)
      setTimeLeft(timeLimit)
    }
    
    if (!isActive) {
      setHasStarted(false)
      setTimeLeft(timeLimit)
    }
  }, [isActive, timeLimit, hasStarted])

  useEffect(() => {
    if (!isActive || !hasStarted) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          onTimeUp()
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(timer)
  }, [isActive, hasStarted, onTimeUp])

  const timePercentage = (timeLeft / timeLimit) * 100

  if (!isActive) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn("fixed inset-0 bg-deep-space/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", className)}
      >
        <Card className="w-full max-w-4xl p-8 bg-white">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-electric-violet/10 mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-electric-violet animate-pulse" />
              </div>
              <h3 className="text-2xl font-display font-bold text-deep-space mb-2">
                Buzz In to Answer!
              </h3>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-stone-gray" />
                <span className="text-stone-gray">
                  {Math.ceil(timeLeft / 1000)} seconds remaining
                </span>
              </div>

              <div className="w-full bg-mist-gray rounded-full h-2 mb-6">
                <motion.div
                  className={cn(
                    "h-2 rounded-full transition-colors",
                    timePercentage > 50 ? "bg-phosphor-cyan" :
                    timePercentage > 25 ? "bg-luminous-gold" : "bg-vivid-red"
                  )}
                  initial={{ width: "100%" }}
                  animate={{ width: `${timePercentage}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => onBuzz(player.id)}
                    className={cn(
                      "w-full h-20 text-lg font-bold transition-all duration-200",
                      "border-2 bg-white hover:scale-105",
                      `border-${player.color} text-${player.color}`,
                      `hover:bg-${player.color} hover:text-white`
                    )}
                    variant="secondary"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
                        `bg-${player.color}`
                      )}>
                        {index + 1}
                      </div>
                      <span>{player.name}</span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-stone-gray">
                <Users className="w-4 h-4" />
                <span>First to buzz in gets to answer</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}