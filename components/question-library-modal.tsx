"use client"

import * as React from "react"
import { useState } from "react"
import { Modal } from "@/components/modal"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Badge } from "@/components/badge"
import { Card } from "@/components/card"
import { Search, Filter, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Question, QuestionType } from "./test-creator"

interface QuestionLibraryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (questions: Question[]) => void
  chapters: Array<{ id: string; title: string }>
}

// Mock library data - replace with API call
const mockLibraryQuestions: Question[] = [
  {
    id: "lib-1",
    type: "multiple-choice",
    title: "What is React?",
    content: {
      question: "What is React?",
      options: [
        { id: "1", text: "A JavaScript library for building user interfaces", isCorrect: true },
        { id: "2", text: "A database management system", isCorrect: false },
        { id: "3", text: "A CSS framework", isCorrect: false },
        { id: "4", text: "A server-side language", isCorrect: false }
      ]
    },
    points: 1,
    order: 0,
    isInLibrary: true
  },
  {
    id: "lib-2",
    type: "question-answer",
    title: "Explain the concept of state",
    content: {
      question: "Explain the concept of state in React components.",
      answer: "State is a JavaScript object that stores a component's dynamic data and determines the component's behavior. It enables components to create and manage their own data."
    },
    points: 2,
    order: 1,
    isInLibrary: true
  },
  {
    id: "lib-3",
    type: "multiple-choice",
    title: "Which hook is used for managing state?",
    content: {
      question: "Which React hook is used for managing component state?",
      options: [
        { id: "1", text: "useState", isCorrect: true },
        { id: "2", text: "useEffect", isCorrect: false },
        { id: "3", text: "useContext", isCorrect: false },
        { id: "4", text: "useReducer", isCorrect: false }
      ]
    },
    points: 1,
    order: 2,
    isInLibrary: true
  }
]

export function QuestionLibraryModal({
  open,
  onOpenChange,
  onImport,
  chapters
}: QuestionLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

  const filteredQuestions = mockLibraryQuestions.filter(question => {
    const matchesSearch = searchQuery === "" || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(question.content).toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesChapter = true // Chapter filtering removed as Question type doesn't have chapterIds
    
    const matchesType = !selectedType || question.type === selectedType

    return matchesSearch && matchesChapter && matchesType
  })

  const handleImport = () => {
    const questionsToImport = mockLibraryQuestions
      .filter(q => selectedQuestions.includes(q.id))
      .map(q => ({ ...q, id: `imported-${Date.now()}-${q.id}` })) // Generate new IDs
    
    onImport(questionsToImport)
    onOpenChange(false)
    setSelectedQuestions([])
  }

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Question Library"
      description="Import questions from the library into your test"
      size="xl"
      footer={
        <div className="flex justify-between w-full">
          <span className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
            {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-spacing-sm"> {/* 8px */}
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleImport}
              disabled={selectedQuestions.length === 0}
            >
              Import Selected
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-spacing-md"> {/* 16px */}
        {/* Search and Filters */}
        <div className="space-y-spacing-sm"> {/* 8px */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary pointer-events-none" size={18} /> {/* #71717A */}
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          
          <div className="flex gap-spacing-sm"> {/* 8px */}
            <select
              value={selectedChapter || ""}
              onChange={(e) => setSelectedChapter(e.target.value || null)}
              className="flex-1 h-10 px-spacing-sm text-base text-primary bg-primary border border-default rounded-md focus:border-focus focus:ring-2 focus:ring-border-focus" // 10, 8px, 16px, #1D1D1F, #FFFFFF, rgba(0,0,0,0.1), 8px, #007AFF
            >
              <option value="">All Chapters</option>
              {chapters.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
            
            <select
              value={selectedType || ""}
              onChange={(e) => setSelectedType(e.target.value as QuestionType || null)}
              className="flex-1 h-10 px-spacing-sm text-base text-primary bg-primary border border-default rounded-md focus:border-focus focus:ring-2 focus:ring-border-focus" // 10, 8px, 16px, #1D1D1F, #FFFFFF, rgba(0,0,0,0.1), 8px, #007AFF
            >
              <option value="">All Types</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="question-answer">Question & Answer</option>
              <option value="connect-cards">Connect Cards</option>
            </select>
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-spacing-sm max-h-[400px] overflow-y-auto"> {/* 8px */}
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-spacing-lg text-secondary"> {/* 24px, #6C6C6D */}
              No questions found matching your criteria
            </div>
          ) : (
            filteredQuestions.map((question) => {
              const isSelected = selectedQuestions.includes(question.id)
              return (
                <Card
                  key={question.id}
                  className={cn(
                    "p-spacing-md cursor-pointer transition-all duration-fast", // 16px, 100ms
                    isSelected && "border-brand bg-brand-light" // #7B00FF, #F3E6FF
                  )}
                  onClick={() => toggleQuestion(question.id)}
                >
                  <div className="flex items-start justify-between gap-spacing-md"> {/* 16px */}
                    <div className="flex-1">
                      <div className="flex items-center gap-spacing-sm mb-spacing-xs"> {/* 8px, 4px */}
                        <h4 className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
                          {question.title}
                        </h4>
                        <Badge 
                          variant={
                            question.type === "question-answer" ? "success" : "info"
                          }
                        >
                          {question.type.replace('-', ' ')}
                        </Badge>
                        <Badge variant="default">
                          {question.points} pts
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-secondary mb-spacing-sm"> {/* 14px, #6C6C6D, 8px */}
                        {getQuestionPreview(question)}
                      </p>
                      
                      <div className="flex gap-spacing-xs"> {/* 4px */}
                        {/* Chapter badges removed as Question type doesn't have chapterIds */}
                      </div>
                    </div>
                    
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-fast", // 100ms
                      isSelected
                        ? "bg-brand border-brand" // #7B00FF, #7B00FF
                        : "border-default" // rgba(0,0,0,0.1)
                    )}>
                      {isSelected && <Check size={14} className="text-inverse" />} {/* #F5F5F7 */}
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}

function getQuestionPreview(question: Question): string {
  switch (question.type) {
    case "multiple-choice":
      return question.content.question
    case "question-answer":
      return question.content.question
    default:
      return ""
  }
}