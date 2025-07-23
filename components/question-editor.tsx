"use client"

import * as React from "react"
import { Card } from "@/components/card"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Button } from "@/components/button"
import { QuestionAnswerEditor } from "./question-editors/question-answer-editor"
import { MultipleChoiceEditor } from "./question-editors/multiple-choice-editor"
import { Trash2, Hash, FileQuestion, ListChecks } from "lucide-react"
import type { Question } from "./test-creator"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

interface QuestionEditorProps {
  question: Question
  questionNumber: number
  onUpdate: (updatedQuestion: Question) => void
  onDelete: () => void
  onSaveToLibrary?: () => void
}

export function QuestionEditor({ 
  question, 
  questionNumber,
  onUpdate, 
  onDelete,
  onSaveToLibrary
}: QuestionEditorProps) {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "question-answer":
        return "Question & Answer"
      case "multiple-choice":
        return "Multiple Choice"
      default:
        return type
    }
  }

  return (
    <Card className="p-spacing-lg space-y-spacing-lg"> {/* 24px, 24px */}
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-spacing-sm mb-spacing-xs"> {/* 8px, 4px */}
            <div className="flex items-center gap-spacing-xs text-sm font-medium text-secondary"> {/* 4px, 14px, 500, #6C6C6D */}
              <Hash size={16} className="text-tertiary" /> {/* #71717A */}
              Question {questionNumber}
            </div>
            <span className="text-sm text-tertiary"> {/* 14px, #71717A */}
              •
            </span>
            <div className="flex items-center gap-spacing-xs text-sm text-tertiary"> {/* 4px, 14px, #71717A */}
              {question.type === "question-answer" ? (
                <FileQuestion size={16} />
              ) : (
                <ListChecks size={16} />
              )}
              {getQuestionTypeLabel(question.type)}
            </div>
          </div>
          <Input
            value={question.title}
            onChange={(e) => onUpdate({ ...question, title: e.target.value })}
            placeholder="Question title..."
            className="text-lg font-medium" // 20px, 500
          />
        </div>
        <div className="flex items-center gap-spacing-sm ml-spacing-md"> {/* 8px, 16px */}
          <div className="flex items-center gap-spacing-xs"> {/* 4px */}
            <Label htmlFor={`points-${question.id}`} className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
              Points:
            </Label>
            <Input
              id={`points-${question.id}`}
              type="number"
              min="1"
              value={question.points}
              onChange={(e) => onUpdate({ ...question, points: parseInt(e.target.value) || 1 })}
              className="w-20 text-center"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-9 w-9 p-0 hover:bg-error-light" // #FEF2F2
          >
            <Trash2 size={18} className="text-error" /> {/* #E51C23 */}
          </Button>
        </div>
      </div>


      {/* Question Type Editor */}
      <div className="border-t border-subtle pt-spacing-lg"> {/* rgba(0,0,0,0.05), 24px */}
        {question.type === "question-answer" && (
          <QuestionAnswerEditor
            content={question.content}
            onChange={(content) => onUpdate({ ...question, content })}
          />
        )}
        {question.type === "multiple-choice" && (
          <MultipleChoiceEditor
            content={question.content}
            onChange={(content) => onUpdate({ ...question, content })}
          />
        )}
      </div>
    </Card>
  )
}