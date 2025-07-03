'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy } from 'lucide-react'

interface JeopardyScoreProps {
  score: number
  className?: string
}

export function JeopardyScore({ score, className }: JeopardyScoreProps) {
  const isNegative = score < 0
  const displayScore = Math.abs(score)

  return (
    <Card className={cn("px-4 py-3 bg-white border-vergil-off-black shadow-sm", className)}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-vergil-purple/20 flex items-center justify-center">
          <Trophy className="w-4 h-4 text-vergil-purple" />
        </div>
        <div>
          <div className="text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider">Score</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={score}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className={cn(
                "text-xl font-bold font-mono",
                isNegative ? "text-red-600" : "text-vergil-off-black"
              )}
            >
              {isNegative && "-"}${displayScore.toLocaleString()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}