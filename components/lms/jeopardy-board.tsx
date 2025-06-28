'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
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

  return (
    <div className={cn("grid grid-cols-6 gap-3", className)}>
      {categories.map((category, catIndex) => (
        <div key={category.name} className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <Card className="h-20 flex items-center justify-center p-3 bg-deep-space text-white border-0">
              <h3 className="text-sm font-display font-bold uppercase tracking-wider text-center">
                {category.name}
              </h3>
            </Card>
          </motion.div>

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
                className="w-full"
              >
                <Card 
                  variant={isUsed ? "default" : "interactive"}
                  className={cn(
                    "h-20 flex items-center justify-center transition-all duration-200",
                    isUsed ? [
                      "bg-mist-gray/10 border-mist-gray/20 cursor-default"
                    ] : [
                      "bg-white border-stone-gray/20",
                      "hover:border-cosmic-purple/40 hover:shadow-md",
                      "group"
                    ]
                  )}
                >
                  {!isUsed && (
                    <>
                      <span className={cn(
                        "font-mono font-bold text-2xl transition-colors",
                        "text-deep-space group-hover:text-cosmic-purple"
                      )}>
                        ${value}
                      </span>
                      {clue.isDailyDouble && (
                        <motion.div
                          className="absolute inset-0 rounded-lg pointer-events-none"
                          animate={{
                            boxShadow: [
                              "inset 0 0 0 0 rgba(99, 102, 241, 0)",
                              "inset 0 0 0 2px rgba(99, 102, 241, 0.3)",
                              "inset 0 0 0 0 rgba(99, 102, 241, 0)",
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
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
  )
}