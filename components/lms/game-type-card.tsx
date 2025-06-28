'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { GameType } from '@/lib/lms/game-types'

interface GameTypeCardProps {
  gameType: GameType
  isAvailable?: boolean
  onClick?: () => void
  className?: string
}

export function GameTypeCard({ 
  gameType, 
  isAvailable = true, 
  onClick,
  className 
}: GameTypeCardProps) {
  const Icon = gameType.icon
  
  const categoryColors = {
    content: 'bg-synaptic-blue/10 text-synaptic-blue border-synaptic-blue/20',
    quiz: 'bg-electric-violet/10 text-electric-violet border-electric-violet/20',
    game: 'bg-phosphor-cyan/10 text-phosphor-cyan border-phosphor-cyan/20',
    chat: 'bg-cosmic-purple/10 text-cosmic-purple border-cosmic-purple/20',
    test: 'bg-luminous-indigo/10 text-luminous-indigo border-luminous-indigo/20'
  }

  const categoryLabels = {
    content: 'Content',
    quiz: 'Quiz',
    game: 'Game',
    chat: 'Interactive',
    test: 'Assessment'
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        isAvailable 
          ? "cursor-pointer hover:shadow-xl hover:scale-105 hover:-translate-y-1" 
          : "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={isAvailable ? onClick : undefined}
    >
      <CardContent className="p-6">
        {/* Category Badge */}
        <Badge 
          variant="outline" 
          className={cn(
            "absolute top-2 right-2 text-xs",
            categoryColors[gameType.category]
          )}
        >
          {categoryLabels[gameType.category]}
        </Badge>

        {/* Icon Container */}
        <div className={cn(
          "w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all",
          categoryColors[gameType.category],
          isAvailable && "group-hover:scale-110"
        )}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Content */}
        <h3 className="font-display font-semibold text-deep-space mb-2">
          {gameType.name}
        </h3>
        <p className="text-sm text-stone-gray">
          {gameType.description}
        </p>

        {/* Special Indicators */}
        <div className="flex gap-2 mt-4">
          {gameType.hasRewards && (
            <Badge variant="secondary" className="text-xs">
              <DollarSign className="w-3 h-3 mr-1" />
              Rewards
            </Badge>
          )}
          {gameType.isTimed && (
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Timed
            </Badge>
          )}
          {gameType.requiresAI && (
            <Badge variant="secondary" className="text-xs">
              <Bot className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          )}
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-stone-gray font-medium">Coming Soon</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Import icons used in badges
import { Clock, DollarSign, Bot } from 'lucide-react'