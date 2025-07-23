"use client"

import * as React from "react"
import { Card } from "@/components/card"
import { Label } from "@/components/label"

interface QuestionAnswerContent {
  question: string
  answer: string
}

interface QuestionAnswerEditorProps {
  content: QuestionAnswerContent
  onChange: (content: QuestionAnswerContent) => void
}

export function QuestionAnswerEditor({ content, onChange }: QuestionAnswerEditorProps) {
  return (
    <div className="space-y-spacing-md"> {/* 16px */}
      <div className="space-y-spacing-sm"> {/* 8px */}
        <Label htmlFor="question" className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
          Question
        </Label>
        <textarea
          id="question"
          value={content.question}
          onChange={(e) => onChange({ ...content, question: e.target.value })}
          placeholder="Enter your question here..."
          className="w-full min-h-[120px] p-spacing-md text-base text-primary bg-primary border border-default rounded-lg resize-y focus:border-focus focus:ring-2 focus:ring-border-focus focus:ring-offset-2 transition-all duration-fast" // 16px, 16px, #1D1D1F, #FFFFFF, rgba(0,0,0,0.1), 12px, #007AFF, 100ms
          rows={4}
        />
      </div>

      <div className="space-y-spacing-sm"> {/* 8px */}
        <Label htmlFor="answer" className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
          Expected Answer
        </Label>
        <textarea
          id="answer"
          value={content.answer}
          onChange={(e) => onChange({ ...content, answer: e.target.value })}
          placeholder="Enter the expected answer or key points..."
          className="w-full min-h-[120px] p-spacing-md text-base text-primary bg-primary border border-default rounded-lg resize-y focus:border-focus focus:ring-2 focus:ring-border-focus focus:ring-offset-2 transition-all duration-fast" // 16px, 16px, #1D1D1F, #FFFFFF, rgba(0,0,0,0.1), 12px, #007AFF, 100ms
          rows={4}
        />
      </div>

      <Card className="p-spacing-md bg-warning-light border-warning"> {/* 16px, #FFFEF0, #FFF490 */}
        <p className="text-sm text-emphasis"> {/* 14px, #303030 */}
          <strong>Note:</strong> This is an open-ended question type. Students will provide text responses 
          that may need manual grading unless you set up keyword-based auto-grading.
        </p>
      </Card>
    </div>
  )
}