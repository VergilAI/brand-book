'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, BarChart3 } from 'lucide-react'

interface MillionaireAudiencePollProps {
  percentages: Record<'A' | 'B' | 'C' | 'D', number>
  onClose: () => void
  className?: string
}

export function MillionaireAudiencePoll({
  percentages,
  onClose,
  className
}: MillionaireAudiencePollProps) {
  const answers = (['A', 'B', 'C', 'D'] as const)
  const maxPercentage = Math.max(...Object.values(percentages))

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-deep-space/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <Card className={cn("p-8 bg-white border-stone-gray/20 shadow-xl", className)}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cosmic-purple/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-cosmic-purple" />
                </div>
                <h3 className="text-2xl font-display font-bold text-deep-space">Audience Poll Results</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-stone-gray hover:text-deep-space"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              {answers.map((answer, index) => {
                const percentage = percentages[answer]
                const isHighest = percentage === maxPercentage

                return (
                  <motion.div
                    key={answer}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold border-2",
                          isHighest 
                            ? "bg-phosphor-cyan/10 text-phosphor-cyan border-phosphor-cyan" 
                            : "bg-cosmic-purple/10 text-cosmic-purple border-cosmic-purple"
                        )}>
                          {answer}
                        </div>
                        <span className="font-medium text-deep-space">Answer {answer}</span>
                      </div>
                      <span className={cn(
                        "font-mono font-bold text-lg",
                        isHighest ? "text-phosphor-cyan" : "text-cosmic-purple"
                      )}>
                        {percentage}%
                      </span>
                    </div>

                    <div className="relative h-3 bg-mist-gray rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ 
                          duration: 0.8, 
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-full",
                          isHighest ? "bg-phosphor-cyan" : "bg-cosmic-purple"
                        )}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-sm text-stone-gray pt-4 border-t border-stone-gray/20"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Based on audience response from {Math.floor(Math.random() * 500 + 500)} participants</span>
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}