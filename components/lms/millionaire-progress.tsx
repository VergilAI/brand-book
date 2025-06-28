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
    <Card className={cn("p-6 border-stone-gray/20", className)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-cosmic-purple" />
          <h3 className="text-lg font-display font-bold text-deep-space">Money Ladder</h3>
        </div>

        <div className="space-y-2">
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
                  isCurrent && "bg-cosmic-purple/10 border border-cosmic-purple",
                  isPassed && "bg-phosphor-cyan/5 text-stone-gray",
                  isNext && "bg-electric-violet/5 border border-electric-violet/30",
                  !isCurrent && !isPassed && !isNext && "text-stone-gray/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2",
                    isCurrent && "bg-cosmic-purple text-white border-cosmic-purple",
                    isPassed && "bg-phosphor-cyan/10 text-phosphor-cyan border-phosphor-cyan",
                    isNext && "bg-electric-violet/10 text-electric-violet border-electric-violet",
                    !isCurrent && !isPassed && !isNext && "bg-white border-stone-gray/30 text-stone-gray/60"
                  )}>
                    {index + 1}
                  </div>

                  {isGuaranteed && (
                    <Shield className={cn(
                      "w-4 h-4",
                      isPassed ? "text-phosphor-cyan" : 
                      isCurrent ? "text-cosmic-purple" : "text-stone-gray/60"
                    )} />
                  )}

                  {index === moneyLadder.length - 1 && (
                    <Star className="w-4 h-4 text-cosmic-purple" />
                  )}
                </div>

                <div className={cn(
                  "text-right font-mono font-bold",
                  isCurrent && "text-lg text-cosmic-purple",
                  isPassed && "text-sm",
                  isNext && "text-base",
                  !isCurrent && !isPassed && !isNext && "text-sm"
                )}>
                  ${amount.toLocaleString()}
                </div>

                {isCurrent && (
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

        <div className="mt-6 pt-4 border-t border-stone-gray/20">
          <div className="flex items-center gap-2 text-sm text-stone-gray">
            <Shield className="w-4 h-4 text-cosmic-purple" />
            <span>Guaranteed amounts</span>
          </div>
        </div>
      </div>
    </Card>
  )
}