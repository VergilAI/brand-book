"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Modal } from "@/components/modal"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { Progress } from "@/components/progress"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Test, Question } from "./test-creator"

interface TestPreviewModalProps {
  test: Test
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TestPreviewModal({ test, open, onOpenChange }: TestPreviewModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [elapsedTime, setElapsedTime] = useState(0) // in seconds
  const [isTimeUp, setIsTimeUp] = useState(false)

  const currentQuestion = test.questions[currentQuestionIndex]
  const totalQuestions = test.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const timeLimitInSeconds = test.settings.timeLimit ? test.settings.timeLimit * 60 : null

  const handleFinish = () => {
    // Calculate score
    let correctAnswers = 0
    let totalPoints = 0

    test.questions.forEach(question => {
      totalPoints += question.points
      const answer = answers[question.id]
      
      if (question.type === "multiple-choice" && answer) {
        const selectedOption = question.content.options.find((opt: any) => opt.id === answer)
        if (selectedOption?.isCorrect) {
          correctAnswers += question.points
        }
      }
      // For other question types, you'd implement scoring logic
    })

    const percentage = totalPoints > 0 ? (correctAnswers / totalPoints) * 100 : 0
    
    alert(`Test completed! Score: ${correctAnswers}/${totalPoints} (${percentage.toFixed(1)}%)`)
    onOpenChange(false)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setElapsedTime(0)
    setIsTimeUp(false)
  }

  // Timer effect
  useEffect(() => {
    if (!open) {
      // Reset timer when modal closes
      setElapsedTime(0)
      setIsTimeUp(false)
      return
    }

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1
        if (timeLimitInSeconds && newTime >= timeLimitInSeconds) {
          setIsTimeUp(true)
          handleFinish() // Auto-submit when time is up
          return prev
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [open, timeLimitInSeconds])

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getRemainingTime = () => {
    if (!timeLimitInSeconds) return null
    const remaining = Math.max(0, timeLimitInSeconds - elapsedTime)
    return remaining
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`${test.title} - Preview Mode`}
      size="lg"
      showCloseButton={false}
      footer={
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft size={16} className="mr-spacing-xs" /> {/* 4px */}
            Previous
          </Button>
          
          <div className="flex items-center gap-spacing-sm"> {/* 8px */}
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Exit Preview
            </Button>
            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button variant="primary" onClick={handleFinish}>
                Finish Test
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Next
                <ChevronRight size={16} className="ml-spacing-xs" /> {/* 4px */}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-spacing-lg"> {/* 24px */}
        {/* Timer Display */}
        {test.settings.timeLimit && (
          <div className="flex items-center gap-spacing-sm"> {/* 8px */}
            <Clock size={18} className="text-secondary" /> {/* #6C6C6D */}
            <Badge 
              variant={(getRemainingTime() ?? 0) < 60 ? "error" : "secondary"}
              className="flex items-center gap-spacing-xs" /* 4px */
            >
              <span className="font-medium">Time Remaining: {formatTime(getRemainingTime() || 0)}</span>
            </Badge>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-spacing-sm"> {/* 8px */}
          <div className="flex justify-between text-sm text-secondary"> {/* 14px, #6C6C6D */}
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Content */}
        <Card className="p-spacing-lg"> {/* 24px */}
          <div className="space-y-spacing-md"> {/* 16px */}
            <h3 className="text-lg font-medium text-primary"> {/* 20px, 500, #1D1D1F */}
              {currentQuestion.title}
            </h3>

            {/* Render question based on type */}
            {currentQuestion.type === "multiple-choice" && (
              <div className="space-y-spacing-md"> {/* 16px */}
                <p className="text-base text-primary"> {/* 16px, #1D1D1F */}
                  {currentQuestion.content.question}
                </p>
                <div className="space-y-spacing-sm"> {/* 8px */}
                  {currentQuestion.content.options.map((option: any, index: number) => (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-center p-spacing-md rounded-lg border cursor-pointer transition-all duration-fast", // 16px, 12px, 100ms
                        answers[currentQuestion.id] === option.id
                          ? "border-brand bg-brand-light" // #7B00FF, #F3E6FF
                          : "border-subtle hover:border-default" // rgba(0,0,0,0.05), rgba(0,0,0,0.1)
                      )}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option.id}
                        checked={answers[currentQuestion.id] === option.id}
                        onChange={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: option.id }))}
                        className="mr-spacing-sm" // 8px
                      />
                      <span className="text-base text-primary"> {/* 16px, #1D1D1F */}
                        {String.fromCharCode(65 + index)}. {option.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion.type === "question-answer" && (
              <div className="space-y-spacing-sm"> {/* 8px */}
                <p className="text-base text-primary"> {/* 16px, #1D1D1F */}
                  {currentQuestion.content.question}
                </p>
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                  placeholder="Type your answer here..."
                  className="w-full min-h-[150px] p-spacing-md text-base text-primary bg-primary border border-default rounded-lg resize-y focus:border-focus focus:ring-2 focus:ring-border-focus" // 16px, 16px, #1D1D1F, #FFFFFF, rgba(0,0,0,0.1), 12px, #007AFF
                  rows={6}
                />
              </div>
            )}

          </div>
        </Card>

        {/* Test Settings Info */}
        {currentQuestionIndex === 0 && (
          <Card className="p-spacing-md bg-info-light border-info"> {/* 16px, #EFF6FF, #93C5FD */}
            <div className="space-y-spacing-xs text-sm text-info"> {/* 4px, 14px, #0087FF */}
              <p><strong>Test Settings:</strong></p>
              <ul className="list-disc list-inside">
                <li>Passing Score: {test.settings.passingScore}%</li>
                <li>Attempts Allowed: {test.settings.attemptsAllowed}</li>
                {test.settings.randomizeQuestions && <li>Questions are randomized</li>}
                {test.settings.showFeedback && <li>Feedback will be shown after submission</li>}
              </ul>
            </div>
          </Card>
        )}
      </div>
    </Modal>
  )
}