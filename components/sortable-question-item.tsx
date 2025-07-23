"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Question } from "./test-creator"

interface SortableQuestionItemProps {
  question: Question
  index: number
  isSelected: boolean
  isSidebarOpen: boolean
  onSelect: () => void
}

const getQuestionTypeColor = (type: string) => {
  switch (type) {
    case "connect-cards":
      return {
        bg: "bg-yellow-50", // Light yellow background
        border: "border-yellow-300", // Yellow border
        text: "text-yellow-700", // Yellow text
        dot: "bg-yellow-500" // Yellow dot
      }
    case "question-answer":
      return {
        bg: "bg-green-50", // Light green background
        border: "border-green-300", // Green border
        text: "text-green-700", // Green text
        dot: "bg-green-500" // Green dot
      }
    case "multiple-choice":
      return {
        bg: "bg-blue-50", // Light blue background
        border: "border-blue-300", // Blue border
        text: "text-blue-700", // Blue text
        dot: "bg-blue-500" // Blue dot
      }
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-300",
        text: "text-gray-700",
        dot: "bg-gray-500"
      }
  }
}

export function SortableQuestionItem({
  question,
  index,
  isSelected,
  isSidebarOpen,
  onSelect,
}: SortableQuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const typeColors = getQuestionTypeColor(question.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        "p-spacing-sm rounded-md cursor-pointer transition-all duration-fast border", // 8px, 8px, 100ms
        isSelected 
          ? "bg-brand-light border-brand shadow-sm" // #F3E6FF, #7B00FF
          : `${typeColors.bg} ${typeColors.border}`, // Type-specific colors
        isDragging && "opacity-50 shadow-lg",
        !isSelected && "hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-spacing-xs"> {/* 4px */}
        <div
          className="cursor-move p-spacing-xs touch-none" // 4px
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} className="text-tertiary" /> {/* #71717A */}
        </div>
        {isSidebarOpen ? (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-primary truncate"> {/* 14px, 500, #1D1D1F */}
              {index + 1}. {question.title}
            </div>
            <div className="flex items-center gap-spacing-xs text-xs text-secondary"> {/* 4px, 12px, #6C6C6D */}
              <span className={cn("w-2 h-2 rounded-full", typeColors.dot)} />
              {question.type.replace('-', ' ')} • {question.points} pts
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className={cn("w-3 h-3 rounded-full", typeColors.dot)} />
          </div>
        )}
      </div>
    </div>
  )
}