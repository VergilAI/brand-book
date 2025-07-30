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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-full flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl my-auto"
          >
          <Card className="bg-bg-primary border-2 border-border-default shadow-2xl">
            <div className="p-4 bg-bg-secondary border-b-2 border-border-default">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-gray-900 text-white rounded-md">
                    <span className="text-xl font-bold font-mono">
                      ${clue.isDailyDouble ? wager : clue.value}
                    </span>
                  </div>
                  {clue.isDailyDouble && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 rounded-md">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-bold text-yellow-800">
                        DAILY DOUBLE
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-bg-emphasis"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 bg-bg-primary">
              {clue.isDailyDouble && phase === 'wager' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2 text-text-primary">Make Your Wager</h3>
                    <p className="text-text-secondary">
                      Current Score: ${currentScore} | Max Wager: ${maxWager}
                    </p>
                  </div>
                  
                  <div>
                    <Input
                      type="number"
                      value={wager}
                      onChange={(e) => setWager(Math.min(maxWager, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="text-center text-xl font-bold"
                      min={0}
                      max={maxWager}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-brand mb-3">
                      {clue.category}
                    </h3>
                    <p className="text-xl font-medium leading-relaxed text-text-primary px-4">
                      {clue.clue}
                    </p>
                  </div>

                  {!showResult ? (
                    <div>
                      <Input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="What is..."
                        className="text-lg text-center"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4"
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
                        isCorrect ? "bg-green-100" : "bg-red-100"
                      )}>
                        {isCorrect ? (
                          <Check className="w-8 h-8 text-green-600" />
                        ) : (
                          <AlertCircle className="w-8 h-8 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-xl font-bold mb-2 text-text-primary">
                          {isCorrect ? "Correct!" : "Sorry, that's incorrect"}
                        </p>
                        <p className="text-base text-text-secondary">
                          The answer was: <span className="font-bold text-text-primary">{clue.answer}</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
            
            {/* Footer Buttons */}
            <div className="bg-bg-secondary border-t-2 border-border-default p-4">
              {clue.isDailyDouble && phase === 'wager' ? (
                <Button
                  onClick={handleWagerSubmit}
                  className="w-full"
                  variant="primary"
                  size="lg"
                >
                  Lock In Wager
                </Button>
              ) : !showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className="w-full"
                  variant="primary"
                  size="lg"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleContinue}
                  className="w-full"
                  variant="primary"
                  size="lg"
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