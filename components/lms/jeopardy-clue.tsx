'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

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
  }
  
  const handleContinue = () => {
    onAnswer(answer, clue.isDailyDouble ? wager : undefined)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-full flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto"
          >
          <Card className="p-8 bg-white border-vergil-off-black/20 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Card className="px-4 py-2 bg-vergil-off-black text-white border-0">
                  <span className="text-2xl font-bold font-mono">
                    ${clue.isDailyDouble ? wager : clue.value}
                  </span>
                </Card>
                {clue.isDailyDouble && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-vergil-purple/10 rounded-lg">
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
                className="text-vergil-off-black/60 hover:text-vergil-off-black"
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
                  <h3 className="text-2xl font-display font-bold mb-2 text-vergil-off-black">Make Your Wager</h3>
                  <p className="text-vergil-off-black/60">
                    Current Score: ${currentScore} | Max Wager: ${maxWager}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Input
                    type="number"
                    value={wager}
                    onChange={(e) => setWager(Math.min(maxWager, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="text-center text-2xl font-bold border-vergil-off-black/30"
                    min={0}
                    max={maxWager}
                  />
                  <Button
                    onClick={handleWagerSubmit}
                    className="w-full bg-vergil-purple text-white hover:bg-vergil-purple-lighter"
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
                  <p className="text-2xl font-medium leading-relaxed text-vergil-off-black">
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
                      className="text-lg border-vergil-off-black/30 placeholder:text-vergil-off-black/60"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      disabled={!answer.trim()}
                      className="w-full bg-vergil-purple text-white hover:bg-vergil-purple-lighter"
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
                      isCorrect ? "bg-vergil-purple/10" : "bg-vivid-red/10"
                    )}>
                      {isCorrect ? (
                        <Check className="w-10 h-10 text-phosphor-cyan" />
                      ) : (
                        <AlertCircle className="w-10 h-10 text-vivid-red" />
                      )}
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold mb-2 text-vergil-off-black">
                        {isCorrect ? "Correct!" : "Sorry, that's incorrect"}
                      </p>
                      <p className="text-lg text-vergil-off-black/60">
                        The answer was: <span className="font-bold text-vergil-off-black">{clue.answer}</span>
                      </p>
                    </div>
                    <Button
                      onClick={handleContinue}
                      className="w-full bg-vergil-purple text-white hover:bg-vergil-purple-lighter"
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}