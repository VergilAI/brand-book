'use client'

import { Card } from '@/components/card'
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
    <Card className={cn(
      "px-4 py-2 bg-bg-primary border-2 border-border-default shadow-md", /* #FFFFFF, rgba(0,0,0,0.1) */
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-bg-brand-light flex items-center justify-center"> {/* #F3E6FF */}
          <Trophy className="w-5 h-5 text-text-brand" /> {/* #7B00FF */}
        </div>
        <div>
          <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">Score</div> {/* #6C6C6D */}
          <AnimatePresence mode="wait">
            <motion.div
              key={score}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-2xl font-bold font-mono",
                isNegative ? "text-text-error" : "text-text-primary" /* #E51C23, #1D1D1F */
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