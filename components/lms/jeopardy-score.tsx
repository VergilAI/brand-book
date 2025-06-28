'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface JeopardyScoreProps {
  score: number
  className?: string
}

export function JeopardyScore({ score, className }: JeopardyScoreProps) {
  const isNegative = score < 0
  const displayScore = Math.abs(score)

  return (
    <Card className={cn("px-6 py-3 border-stone-gray/20", className)}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-stone-gray">Score</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={score}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className={cn(
              "text-2xl font-bold font-mono",
              isNegative ? "text-vivid-red" : "text-cosmic-purple"
            )}
          >
            {isNegative && "-"}${displayScore.toLocaleString()}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  )
}