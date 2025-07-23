"use client"

import * as React from "react"
import { Card } from "@/components/card"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Button } from "@/components/button"
import { ConnectCardsEditor } from "./question-editors/connect-cards-editor"
import { QuestionAnswerEditor } from "./question-editors/question-answer-editor"
import { MultipleChoiceEditor } from "./question-editors/multiple-choice-editor"
import { Trash2, BookOpen, Save } from "lucide-react"
import type { Question } from "./test-creator"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

interface QuestionEditorProps {
  question: Question
  questionNumber: number
  onUpdate: (updatedQuestion: Question) => void
  onDelete: () => void
  chapters?: Array<{ id: string; title: string }>
  onSaveToLibrary?: () => void
}

export function QuestionEditor({ 
  question, 
  questionNumber,
  onUpdate, 
  onDelete,
  chapters = [],
  onSaveToLibrary
}: QuestionEditorProps) {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "connect-cards":
        return "Connect the Cards"
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
            <span className="text-sm font-medium text-secondary"> {/* 14px, 500, #6C6C6D */}
              Question {questionNumber}
            </span>
            <span className="text-sm text-tertiary"> {/* 14px, #71717A */}
              • {getQuestionTypeLabel(question.type)}
            </span>
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

      {/* Chapter Assignment */}
      {chapters.length > 0 && (
        <div className="space-y-spacing-sm"> {/* 8px */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-spacing-xs"> {/* 4px */}
              <BookOpen size={16} className="text-secondary" /> {/* #6C6C6D */}
              <Label className="text-sm font-medium text-primary"> {/* 14px, 500, #1D1D1F */}
                Chapter Assignment
              </Label>
            </div>
            {question.isInLibrary && (
              <Badge variant="success" size="sm">
                In Library
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-spacing-xs"> {/* 4px */}
            {chapters.map((chapter) => {
              const isSelected = question.chapterIds?.includes(chapter.id)
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    const currentChapters = question.chapterIds || []
                    const newChapters = isSelected
                      ? currentChapters.filter(id => id !== chapter.id)
                      : [...currentChapters, chapter.id]
                    onUpdate({ ...question, chapterIds: newChapters })
                  }}
                  className={cn(
                    "px-spacing-sm py-spacing-xs text-sm rounded-md border transition-all duration-fast", // 8px, 4px, 14px, 8px, 100ms
                    isSelected
                      ? "bg-brand text-inverse border-brand" // #7B00FF, #F5F5F7, #7B00FF
                      : "bg-primary text-secondary border-subtle hover:border-default" // #FFFFFF, #6C6C6D, rgba(0,0,0,0.05), rgba(0,0,0,0.1)
                  )}
                >
                  {chapter.title}
                </button>
              )
            })}
          </div>
          {!question.isInLibrary && question.chapterIds && question.chapterIds.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onUpdate({ ...question, isInLibrary: true })
                onSaveToLibrary?.()
              }}
              className="w-full"
            >
              <Save size={16} className="mr-spacing-xs" /> {/* 4px */}
              Save to Library
            </Button>
          )}
        </div>
      )}

      {/* Question Type Editor */}
      <div className="border-t border-subtle pt-spacing-lg"> {/* rgba(0,0,0,0.05), 24px */}
        {question.type === "connect-cards" && (
          <ConnectCardsEditor
            content={question.content}
            onChange={(content) => onUpdate({ ...question, content })}
          />
        )}
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