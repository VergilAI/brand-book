'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Check, AlertCircle } from 'lucide-react'
import type { JeopardyClue as JeopardyClueType } from './jeopardy-game'

interface JeopardyClueProps {
  clue: JeopardyClueType
  currentScore: number
  onAnswer: (answer: string, wager?: number) => void
  onClose: () => void
}

export function JeopardyClue({
  clue,
  currentScore,
  onAnswer,
  onClose
}: JeopardyClueProps) {
  const [answer, setAnswer] = useState('')
  const [wager, setWager] = useState(clue.value)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [phase, setPhase] = useState<'wager' | 'answer'>('wager')

  const maxWager = Math.max(currentScore, 1000)

  const handleWagerSubmit = () => {
    if (clue.isDailyDouble) {
      setPhase('answer')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return

    const correct = answer.toLowerCase().trim() === 
      clue.answer.toLowerCase().trim()
    
    setIsCorrect(correct)
    setShowResult(true)

    setTimeout(() => {
      onAnswer(answer, clue.isDailyDouble ? wager : undefined)
    }, 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-deep-space/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <Card className="p-8 bg-white border-stone-gray/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Card className="px-4 py-2 bg-deep-space text-white border-0">
                  <span className="text-2xl font-bold font-mono">
                    ${clue.isDailyDouble ? wager : clue.value}
                  </span>
                </Card>
                {clue.isDailyDouble && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-cosmic-purple/10 rounded-lg">
                    <Star className="w-4 h-4 text-cosmic-purple" />
                    <span className="text-sm font-display font-bold text-cosmic-purple">
                      DAILY DOUBLE
                    </span>
                  </div>
                )}
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

            {clue.isDailyDouble && phase === 'wager' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-display font-bold mb-2 text-deep-space">Make Your Wager</h3>
                  <p className="text-stone-gray">
                    Current Score: ${currentScore} | Max Wager: ${maxWager}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Input
                    type="number"
                    value={wager}
                    onChange={(e) => setWager(Math.min(maxWager, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="text-center text-2xl font-bold border-stone-gray/30"
                    min={0}
                    max={maxWager}
                  />
                  <Button
                    onClick={handleWagerSubmit}
                    className="w-full bg-cosmic-purple text-white hover:bg-electric-violet"
                  >
                    Lock In Wager
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-sm font-display font-bold uppercase tracking-wider text-cosmic-purple mb-4">
                    {clue.category}
                  </h3>
                  <p className="text-2xl font-medium leading-relaxed text-deep-space">
                    {clue.clue}
                  </p>
                </div>

                {!showResult ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="What is..."
                      className="text-lg border-stone-gray/30 placeholder:text-stone-gray"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      disabled={!answer.trim()}
                      className="w-full bg-cosmic-purple text-white hover:bg-electric-violet"
                    >
                      Submit Answer
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className={cn(
                      "w-20 h-20 rounded-full mx-auto flex items-center justify-center",
                      isCorrect ? "bg-phosphor-cyan/10" : "bg-vivid-red/10"
                    )}>
                      {isCorrect ? (
                        <Check className="w-10 h-10 text-phosphor-cyan" />
                      ) : (
                        <AlertCircle className="w-10 h-10 text-vivid-red" />
                      )}
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold mb-2 text-deep-space">
                        {isCorrect ? "Correct!" : "Sorry, that's incorrect"}
                      </p>
                      <p className="text-lg text-stone-gray">
                        The answer was: <span className="font-bold text-deep-space">{clue.answer}</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}