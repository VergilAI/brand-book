'use client'

import { Card } from '@/components/card'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Check, X } from 'lucide-react'
import type { Question } from './millionaire-game'

interface MillionaireQuestionProps {
  question: Question
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null
  lockedAnswer: 'A' | 'B' | 'C' | 'D' | null
  correctAnswer: 'A' | 'B' | 'C' | 'D' | null
  eliminatedAnswers: ('A' | 'B' | 'C' | 'D')[]
  phoneASuggestion: 'A' | 'B' | 'C' | 'D' | null
  onSelectAnswer: (answer: 'A' | 'B' | 'C' | 'D') => void
}

export function MillionaireQuestion({
  question,
  selectedAnswer,
  lockedAnswer,
  correctAnswer,
  eliminatedAnswers,
  phoneASuggestion,
  onSelectAnswer
}: MillionaireQuestionProps) {
  const answerOptions = (['A', 'B', 'C', 'D'] as const)

  const getAnswerStyle = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (eliminatedAnswers.includes(answer)) {
      return 'opacity-30 cursor-not-allowed border-stone-gray/20'
    }

    if (lockedAnswer === answer) {
      if (correctAnswer === answer) {
        return 'bg-green-100 border-green-500 border-2 shadow-lg'
      } else {
        return 'bg-red-100 border-red-500 border-2 shadow-lg'
      }
    }

    if (correctAnswer && correctAnswer === answer && lockedAnswer !== answer) {
      return 'bg-green-100 border-green-500 border-2'
    }

    if (selectedAnswer === answer) {
      return 'bg-cosmic-purple/10 border-cosmic-purple shadow-md'
    }

    return 'border-stone-gray/20 hover:border-cosmic-purple/40 hover:shadow-sm'
  }

  const getAnswerIcon = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (correctAnswer && lockedAnswer === answer) {
      return correctAnswer === answer 
        ? <Check className="w-5 h-5 text-green-600" />
        : <X className="w-5 h-5 text-red-600" />
    }
    return null
  }

  return (
    <Card className="p-8 border-stone-gray/20">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-2xl font-display font-semibold text-deep-space leading-relaxed">
            {question.question}
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="wait">
            {answerOptions.map((answer) => {
              const isEliminated = eliminatedAnswers.includes(answer)
              const isPhoneSuggestion = phoneASuggestion === answer

              return (
                <motion.button
                  key={answer}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: answerOptions.indexOf(answer) * 0.05 }}
                  onClick={() => !isEliminated && !lockedAnswer && onSelectAnswer(answer)}
                  disabled={isEliminated || !!lockedAnswer}
                  className="relative w-full"
                >
                  <Card className={cn(
                    "p-6 text-left flex items-center gap-4 transition-all duration-200",
                    getAnswerStyle(answer)
                  )}>
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      "border-2 font-bold text-lg transition-all",
                      isEliminated ? "opacity-30" : "border-cosmic-purple text-cosmic-purple"
                    )}>
                      {answer}
                    </div>

                    <div className="flex-1">
                      <p className={cn(
                        "text-lg font-medium text-deep-space",
                        isEliminated && "line-through opacity-30"
                      )}>
                        {question.answers[answer]}
                      </p>
                    </div>

                    {getAnswerIcon(answer)}

                    {isPhoneSuggestion && !lockedAnswer && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        <div className="bg-electric-violet text-white p-2 rounded-full shadow-lg">
                          <Phone className="w-3 h-3" />
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>

        {phoneASuggestion && !lockedAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-electric-violet/10 rounded-lg border border-electric-violet/20"
          >
            <p className="text-sm text-stone-gray">
              Your friend thinks the answer is{' '}
              <span className="font-bold text-cosmic-purple">{phoneASuggestion}</span>
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  )
}