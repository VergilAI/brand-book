'use client'

import { Button } from '@/components/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Percent, Phone, Users } from 'lucide-react'
import type { GameState } from './millionaire-game'

interface MillionaireLifelinesProps {
  lifelines: GameState['lifelines']
  onUseLifeline: (type: 'fiftyFifty' | 'phoneAFriend' | 'askAudience') => void
  disabled?: boolean
  className?: string
}

export function MillionaireLifelines({
  lifelines,
  onUseLifeline,
  disabled,
  className
}: MillionaireLifelinesProps) {
  const lifelineButtons = [
    {
      id: 'fiftyFifty' as const,
      label: '50:50',
      icon: Percent,
      description: 'Remove two wrong answers',
      used: lifelines.fiftyFifty.used
    },
    {
      id: 'phoneAFriend' as const,
      label: 'Phone a Friend',
      icon: Phone,
      description: 'Get help from an expert',
      used: lifelines.phoneAFriend.used
    },
    {
      id: 'askAudience' as const,
      label: 'Ask the Audience',
      icon: Users,
      description: 'See what the audience thinks',
      used: lifelines.askAudience.used
    }
  ]

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {lifelineButtons.map((lifeline, index) => (
        <motion.div
          key={lifeline.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Button
            variant="outline"
            size="default"
            onClick={() => onUseLifeline(lifeline.id)}
            disabled={disabled || lifeline.used}
            className={cn(
              "relative group transition-all duration-200",
              "border-2",
              !lifeline.used && !disabled && [
                "border-cosmic-purple/30 bg-white text-cosmic-purple",
                "hover:border-cosmic-purple hover:bg-cosmic-purple hover:text-white",
                "hover:shadow-md"
              ],
              lifeline.used && [
                "border-stone-gray/20 bg-stone-gray/5 text-stone-gray/50",
                "cursor-not-allowed"
              ]
            )}
          >
            <div className="flex items-center gap-2">
              <lifeline.icon className="w-4 h-4" />
              <span className="font-medium">{lifeline.label}</span>
            </div>

            {lifeline.used && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-md bg-stone-gray/10"
              >
                <div className="w-6 h-0.5 bg-stone-gray/50 rotate-45" />
                <div className="w-6 h-0.5 bg-stone-gray/50 -rotate-45 absolute" />
              </motion.div>
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}