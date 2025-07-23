"use client"

import * as React from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { cn } from "@/lib/utils"
import { HelpCircle, ListChecks, Info, CheckCircle, Circle } from "lucide-react"

interface MultipleChoiceOption {
  id: string
  text: string
  isCorrect: boolean
}

interface MultipleChoiceContent {
  question: string
  options: MultipleChoiceOption[]
}

interface MultipleChoiceEditorProps {
  content: MultipleChoiceContent
  onChange: (content: MultipleChoiceContent) => void
}

export function MultipleChoiceEditor({ content, onChange }: MultipleChoiceEditorProps) {
  const updateOption = (id: string, text: string) => {
    onChange({
      ...content,
      options: content.options.map(option =>
        option.id === id ? { ...option, text } : option
      )
    })
  }

  const setCorrectOption = (id: string) => {
    onChange({
      ...content,
      options: content.options.map(option => ({
        ...option,
        isCorrect: option.id === id
      }))
    })
  }

  const hasCorrectAnswer = content.options.some(opt => opt.isCorrect)

  return (
    <div className="space-y-spacing-md"> {/* 16px */}
      <div className="space-y-spacing-sm"> {/* 8px */}
        <div className="flex items-center gap-spacing-xs mb-spacing-xs"> {/* 4px, 4px */}
          <HelpCircle size={18} className="text-info" /> {/* #0087FF */}
          <Label htmlFor="mc-question" className="text-base font-medium text-primary mb-0"> {/* 16px, 500, #1D1D1F */}
            Question
          </Label>
        </div>
        <textarea
          id="mc-question"
          value={content.question}
          onChange={(e) => onChange({ ...content, question: e.target.value })}
          placeholder="Enter your multiple choice question..."
          className="w-full min-h-[100px] p-spacing-md text-base text-primary bg-primary border border-default rounded-lg resize-y focus:border-focus focus:ring-2 focus:ring-border-focus focus:ring-offset-2 transition-all duration-fast" // 16px, 16px, #1D1D1F, #FFFFFF, rgba(0,0,0,0.1), 12px, #007AFF, 100ms
          rows={3}
        />
      </div>

      <div className="space-y-spacing-sm"> {/* 8px */}
        <div className="flex items-center gap-spacing-xs mb-spacing-xs"> {/* 4px, 4px */}
          <ListChecks size={18} className="text-info" /> {/* #0087FF */}
          <Label className="text-base font-medium text-primary mb-0"> {/* 16px, 500, #1D1D1F */}
            Answer Options
          </Label>
        </div>

        <div className="space-y-spacing-sm"> {/* 8px */}
          {content.options.map((option, index) => (
            <div key={option.id} className="group">
              <div className="flex items-center gap-spacing-sm"> {/* 8px */}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={option.id}
                    name="correct-answer"
                    checked={option.isCorrect}
                    onChange={() => setCorrectOption(option.id)}
                    className="h-5 w-5 text-brand border-default focus:ring-2 focus:ring-border-focus cursor-pointer" // #7B00FF, rgba(0,0,0,0.1), #007AFF
                  />
                </div>

                <div className="flex-1 flex items-center gap-spacing-sm"> {/* 8px */}
                  {option.isCorrect ? (
                    <CheckCircle size={20} className="text-success flex-shrink-0" /> // #0F8A0F
                  ) : (
                    <Circle size={20} className="text-tertiary flex-shrink-0" /> // #71717A
                  )}
                  <span className="text-sm font-medium text-secondary w-6"> {/* 14px, 500, #6C6C6D */}
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={cn(
                      "flex-1",
                      option.isCorrect && "border-success bg-success-light" // #86EFAC, #F0FDF4
                    )}
                  />
                </div>

              </div>
            </div>
          ))}
        </div>

        {!hasCorrectAnswer && (
          <Card className="p-spacing-sm bg-error-light border-error"> {/* 8px, #FEF2F2, #FCA5A5 */}
            <p className="text-sm text-error font-medium"> {/* 14px, #E51C23, 500 */}
              Please select the correct answer
            </p>
          </Card>
        )}
      </div>

      <Card className="p-spacing-md bg-info-light border-info"> {/* 16px, #EFF6FF, #93C5FD */}
        <div className="flex items-start gap-spacing-sm"> {/* 8px */}
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" /> {/* #0087FF */}
          <p className="text-sm text-info"> {/* 14px, #0087FF */}
            <strong>Tip:</strong> Click the radio button next to an option to mark it as the correct answer. 
            The correct answer will be highlighted in green.
          </p>
        </div>
      </Card>
    </div>
  )
}