'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
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
        className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-elevation-modal overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-full flex items-center justify-center p-space-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto"
          >
          <Card className="bg-bg-primary border-border-subtle shadow-elevated overflow-hidden flex flex-col">
            <div className="p-space-lg pb-space-md">
              <div className="flex items-center justify-between mb-space-lg">
                <div className="flex items-center gap-space-md">
                  <Card className="px-space-md py-space-xs bg-bg-inverse text-text-inverse border-0">
                    <span className="text-2xl font-bold font-mono">
                      ${clue.isDailyDouble ? wager : clue.value}
                    </span>
                  </Card>
                  {clue.isDailyDouble && (
                    <div className="flex items-center gap-space-xs px-space-md py-space-xs bg-bg-secondary rounded-lg">
                      <Star className="w-4 h-4 text-text-brand" />
                      <span className="text-sm font-display font-bold text-text-brand">
                        DAILY DOUBLE
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-text-tertiary hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-space-lg">
              {clue.isDailyDouble && phase === 'wager' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-space-lg"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-display font-bold mb-space-xs text-text-primary">Make Your Wager</h3>
                    <p className="text-text-secondary">
                      Current Score: ${currentScore} | Max Wager: ${maxWager}
                    </p>
                  </div>
                  
                  <div className="space-y-space-md">
                    <Input
                      type="number"
                      value={wager}
                      onChange={(e) => setWager(Math.min(maxWager, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="text-center text-2xl font-bold border-border-subtle"
                      min={0}
                      max={maxWager}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-space-lg"
                >
                  <div className="text-center">
                    <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary mb-space-md">
                      {clue.category}
                    </h3>
                    <p className="text-2xl font-medium leading-relaxed text-text-primary">
                      {clue.clue}
                    </p>
                  </div>

                  {!showResult ? (
                    <div className="space-y-space-md">
                      <Input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="What is..."
                        className="text-lg border-border-subtle placeholder:text-text-tertiary"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-space-md"
                    >
                      <div className={cn(
                        "w-20 h-20 rounded-full mx-auto flex items-center justify-center",
                        isCorrect ? "bg-bg-success/10" : "bg-bg-error/10"
                      )}>
                        {isCorrect ? (
                          <Check className="w-10 h-10 text-text-brand" />
                        ) : (
                          <AlertCircle className="w-10 h-10 text-text-error" />
                        )}
                      </div>
                      <div>
                        <p className="text-2xl font-display font-bold mb-space-xs text-text-primary">
                          {isCorrect ? "Correct!" : "Sorry, that's incorrect"}
                        </p>
                        <p className="text-lg text-text-secondary">
                          The answer was: <span className="font-bold text-text-primary">{clue.answer}</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
            
            {/* Sticky Buttons */}
            <div className="sticky bottom-0 bg-bg-primary border-t border-border-subtle p-space-lg pt-space-md">
              {clue.isDailyDouble && phase === 'wager' ? (
                <Button
                  onClick={handleWagerSubmit}
                  className="w-full bg-bg-brand text-text-inverse hover:bg-bg-brand-hover"
                >
                  Lock In Wager
                </Button>
              ) : !showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className="w-full bg-bg-brand text-text-inverse hover:bg-bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleContinue}
                  className="w-full bg-bg-brand text-text-inverse hover:bg-bg-brand-hover"
                >
                  Continue
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}