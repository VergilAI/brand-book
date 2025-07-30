'use client'

import { Card } from '@/components/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'
import type { JeopardyCategory, JeopardyClue as JeopardyClueType } from './jeopardy-game'

interface JeopardyBoardProps {
  categories: JeopardyCategory[]
  usedClues: Set<string>
  onClueSelect: (clue: JeopardyClueType) => void
  className?: string
}

export function JeopardyBoard({
  categories,
  usedClues,
  onClueSelect,
  className
}: JeopardyBoardProps) {
  const values = [200, 400, 600, 800, 1000]

  const numCategories = categories.length
  const gridCols = numCategories === 6 ? 'grid-cols-6' : 'grid-cols-5'

  return (
    <div className={cn("flex flex-col flex-1 gap-3", className)}>
      {/* Category Headers */}
      <div className={cn("grid gap-2", gridCols)}>
        {categories.map((category, catIndex) => (
          <motion.div
            key={`header-${category.name}`}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: catIndex * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <Card className="relative h-14 flex items-center justify-center p-2 bg-bg-primary border-2 border-border-primary overflow-hidden">
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-center text-text-primary leading-tight">
                {category.name}
              </h3>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Game Board */}
      <div className={cn("grid gap-2 flex-1", gridCols)}>
        {categories.map((category, catIndex) => (
          <div key={category.name} className="grid grid-rows-5 gap-2 h-full">
            {values.map((value, valueIndex) => {
            const clue = category.clues[valueIndex]
            const isUsed = usedClues.has(clue.id)

            return (
              <motion.button
                key={clue.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: (catIndex * 5 + valueIndex) * 0.02,
                  type: "spring",
                  stiffness: 400,
                  damping: 20
                }}
                onClick={() => !isUsed && onClueSelect(clue)}
                disabled={isUsed}
                className="w-full h-full"
              >
                <Card 
                  variant={isUsed ? "default" : "interactive"}
                  className={cn(
                    "h-full flex items-center justify-center transition-all duration-200 relative overflow-hidden",
                    isUsed ? [
                      "bg-bg-muted border-border-subtle cursor-default"
                    ] : [
                      "bg-bg-primary border-border-primary",
                      "hover:border-border-brand hover:shadow-elevated hover:scale-105",
                      "group shadow-base"
                    ]
                  )}
                >
                  {isUsed ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-bg-muted" />
                    </div>
                  ) : (
                    <>
                      <span className={cn(
                        "font-mono font-bold text-2xl transition-all duration-200 relative z-10",
                        "text-text-primary group-hover:text-text-brand group-hover:scale-110"
                      )}>
                        ${value}
                      </span>
                      
                      {/* Hover effect background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-color-brand-primary/0 to-color-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {clue.isDailyDouble && (
                        <>
                          {/* Daily Double indicator */}
                          <motion.div
                            className="absolute top-1 right-1"
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <Star className="w-4 h-4 text-color-warning fill-color-warning" />
                          </motion.div>
                          
                          <motion.div
                            className="absolute inset-0 rounded-lg pointer-events-none"
                            animate={{
                              boxShadow: [
                                "inset 0 0 0 0 rgba(255, 204, 0, 0)",
                                "inset 0 0 0 2px rgba(255, 204, 0, 0.4)",
                                "inset 0 0 0 0 rgba(255, 204, 0, 0)",
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
                </Card>
              </motion.button>
            )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}