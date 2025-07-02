'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Shield, Star, TrendingUp } from 'lucide-react'

interface MillionaireProgressProps {
  currentLevel: number
  moneyLadder: number[]
  guaranteedLevels: number[]
  className?: string
}

export function MillionaireProgress({
  currentLevel,
  moneyLadder,
  guaranteedLevels,
  className
}: MillionaireProgressProps) {
  return (
    <Card className={cn("p-6 border-stone-gray/20 h-full flex flex-col", className)}>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-vergil-purple" />
          <h3 className="text-lg font-semibold text-vergil-off-black">Money Ladder</h3>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1 pr-2" style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'
        }}>
          {[...moneyLadder].reverse().map((amount, reversedIndex) => {
            const index = moneyLadder.length - 1 - reversedIndex
            const isGuaranteed = guaranteedLevels.includes(index)
            const isCurrent = index === currentLevel
            const isPassed = index < currentLevel
            const isNext = index === currentLevel + 1

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reversedIndex * 0.02 }}
                className={cn(
                  "relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
                  isCurrent && "bg-vergil-purple/10 border border-vergil-purple",
                  isPassed && "bg-vergil-purple/5 text-vergil-off-black/60",
                  isNext && "bg-vergil-off-white border border-vergil-purple/30",
                  !isCurrent && !isPassed && !isNext && "text-vergil-off-black/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2",
                    isCurrent && "bg-vergil-purple text-white border-vergil-purple",
                    isPassed && "bg-vergil-purple/10 text-vergil-purple border-vergil-purple",
                    isNext && "bg-white text-vergil-purple border-vergil-purple",
                    !isCurrent && !isPassed && !isNext && "bg-white border-vergil-off-black/20 text-vergil-off-black/60"
                  )}>
                    {index + 1}
                  </div>

                  {isGuaranteed && (
                    <Shield className={cn(
                      "w-4 h-4",
                      isPassed ? "text-vergil-purple" : 
                      isCurrent ? "text-vergil-purple" : "text-vergil-off-black/60"
                    )} />
                  )}

                  {index === moneyLadder.length - 1 && (
                    <Star className="w-4 h-4 text-vergil-purple" />
                  )}
                </div>

                <div className={cn(
                  "text-right font-mono font-bold",
                  isCurrent && "text-lg text-vergil-purple",
                  isPassed && "text-sm",
                  isNext && "text-base",
                  !isCurrent && !isPassed && !isNext && "text-sm"
                )}>
                  ${amount.toLocaleString()}
                </div>

                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-vergil-purple pointer-events-none"
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

        <div className="mt-6 pt-4 border-t border-vergil-off-black/10 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-vergil-off-black/60">
            <Shield className="w-4 h-4 text-vergil-purple" />
            <span>Guaranteed amounts</span>
          </div>
        </div>
      </div>
    </Card>
  )
}