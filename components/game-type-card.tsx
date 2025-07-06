'use client'

import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/badge'
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
    content: 'bg-bg-info/10 text-text-info border-border-info',
    quiz: 'bg-bg-brand/10 text-text-brand border-border-brand',
    game: 'bg-bg-success/10 text-text-success border-border-success',
    chat: 'bg-bg-warning/10 text-text-warning border-border-warning',
    test: 'bg-bg-error/10 text-text-error border-border-error'
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
          "card-interactive h-full",
          !isAvailable && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={isAvailable ? onClick : undefined}
      >
        {/* Recommended Badge on Border */}
        {isRecommended && (
          <div className="absolute top-1 left-1 z-dropdown">
            <div className="bg-bg-brand text-text-inverse text-[10px] font-medium px-sm py-0.5 rounded-full shadow-sm">
              Recommended
            </div>
          </div>
        )}
        <CardContent className="p-lg h-full flex flex-col">
        {/* Category Badge */}
        <Badge 
          variant="secondary" 
          className={cn(
            "absolute top-sm right-sm text-xs",
            categoryColors[gameType.category]
          )}
        >
          {getCategoryLabel(gameType)}
        </Badge>

        {/* Icon Container */}
        <div className={cn(
          "w-16 h-16 rounded-xl flex items-center justify-center mb-md transition-all duration-normal",
          categoryColors[gameType.category],
          isAvailable && "group-hover:scale-110"
        )}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary mb-sm">
            {gameType.name}
          </h3>
          <p className="text-sm text-text-secondary">
            {gameType.description}
          </p>
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-bg-elevated/80 flex items-center justify-center rounded-lg">
            <span className="text-text-tertiary font-medium">Coming Soon</span>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  )
}