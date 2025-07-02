'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { GameType } from '@/lib/lms/game-types'

interface GameTypeCardProps {
  gameType: GameType
  isAvailable?: boolean
  isRecommended?: boolean
  onClick?: () => void
  className?: string
}

export function GameTypeCard({ 
  gameType, 
  isAvailable = true, 
  isRecommended = false,
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

  // Determine the category label based on game type
  const getCategoryLabel = (gameType: GameType) => {
    // Content types
    if (['written-material', 'video'].includes(gameType.id)) return 'Content'
    // Quiz types
    if (['flashcards', 'connect-cards'].includes(gameType.id)) return 'Quiz'
    // Everything else is Interactive
    return 'Interactive'
  }

  return (
    <div className="relative">
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 h-full group",
          isAvailable 
            ? "cursor-pointer hover:shadow-xl hover:scale-105 hover:-translate-y-1" 
            : "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={isAvailable ? onClick : undefined}
      >
        {/* Recommended Badge on Border */}
        {isRecommended && (
          <div className="absolute -top-3 left-4 z-10">
            <div className="bg-vergil-purple text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
              Recommended
            </div>
          </div>
        )}
        <CardContent className="p-6 h-full flex flex-col">
        {/* Category Badge */}
        <Badge 
          variant="outline" 
          className={cn(
            "absolute top-2 right-2 text-xs",
            categoryColors[gameType.category]
          )}
        >
          {getCategoryLabel(gameType)}
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
        <div className="flex-1">
          <h3 className="font-display font-semibold text-deep-space mb-2">
            {gameType.name}
          </h3>
          <p className="text-sm text-stone-gray">
            {gameType.description}
          </p>
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-stone-gray font-medium">Coming Soon</span>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  )
}

