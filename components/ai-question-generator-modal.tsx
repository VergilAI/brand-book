"use client"

import * as React from "react"
import { useState } from "react"
import { Modal } from "@/components/modal"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { Sparkles, FileText, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Question, QuestionType } from "./test-creator"

interface AIQuestionGeneratorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (questions: Question[]) => void
  chapters: Array<{ id: string; title: string }>
}

export function AIQuestionGeneratorModal({
  open,
  onOpenChange,
  onGenerate,
  chapters
}: AIQuestionGeneratorModalProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock generated questions based on prompt
      const mockQuestions: Question[] = [
        {
          id: `ai-${Date.now()}-1`,
          type: "multiple-choice",
          title: "Understanding React Components",
          content: {
            question: "What is the primary purpose of React components?",
            options: [
              { id: "1", text: "To create reusable UI elements", isCorrect: true },
              { id: "2", text: "To manage database connections", isCorrect: false },
              { id: "3", text: "To handle server-side routing", isCorrect: false },
              { id: "4", text: "To compile JavaScript code", isCorrect: false }
            ]
          },
          points: 1,
          order: 0,
          chapterIds: selectedChapters.length > 0 ? selectedChapters : undefined
        },
        {
          id: `ai-${Date.now()}-2`,
          type: "question-answer",
          title: "Explain State Management",
          content: {
            question: "Explain how state management works in React and why it's important.",
            answer: "State management in React refers to how components store and manage their data. It's important because it allows components to be dynamic and interactive, updating the UI based on user actions or data changes."
          },
          points: 2,
          order: 1,
          chapterIds: selectedChapters.length > 0 ? selectedChapters : undefined
        },
        {
          id: `ai-${Date.now()}-3`,
          type: "connect-cards",
          title: "Match React Hooks",
          content: {
            pairs: [
              { id: "p1", left: "useState", right: "Manages component state" },
              { id: "p2", left: "useEffect", right: "Handles side effects" },
              { id: "p3", left: "useContext", right: "Consumes context values" },
              { id: "p4", left: "useReducer", right: "Complex state management" }
            ]
          },
          points: 3,
          order: 2,
          chapterIds: selectedChapters.length > 0 ? selectedChapters : undefined
        }
      ]
      
      setGeneratedQuestions(mockQuestions)
      setSelectedQuestions(mockQuestions.map(q => q.id))
    } catch (error) {
      console.error("Error generating questions:", error)
      alert("Failed to generate questions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddSelected = () => {
    const questionsToAdd = generatedQuestions
      .filter(q => selectedQuestions.includes(q.id))
      .map(q => ({ ...q, id: `imported-${Date.now()}-${q.id}` }))
    
    onGenerate(questionsToAdd)
    handleClose()
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after a delay to avoid UI flash
    setTimeout(() => {
      setPrompt("")
      setGeneratedQuestions([])
      setSelectedQuestions([])
      setSelectedChapters([])
    }, 300)
  }

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const titleElement = (
    <div className="flex items-center gap-spacing-sm">
      <Sparkles className="text-brand" size={24} />
      <span>Generate Questions with AI</span>
    </div>
  )

  const footerElement = generatedQuestions.length > 0 ? (
    <div className="flex justify-between w-full">
      <span className="text-sm text-secondary">
        {selectedQuestions.length} of {generatedQuestions.length} questions selected
      </span>
      <div className="flex gap-spacing-sm">
        <Button variant="ghost" onClick={() => setGeneratedQuestions([])}>
          Generate New
        </Button>
        <Button 
          variant="primary" 
          onClick={handleAddSelected}
          disabled={selectedQuestions.length === 0}
        >
          Add Selected Questions
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex justify-end gap-spacing-sm w-full">
      <Button variant="ghost" onClick={handleClose}>
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="mr-spacing-xs animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={16} className="mr-spacing-xs" />
            Generate Questions
          </>
        )}
      </Button>
    </div>
  )

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={titleElement}
      description="Describe the learning material or topic you want to create questions for"
      size="xl"
      footer={footerElement}
    >
      <div className="space-y-spacing-lg">
        {generatedQuestions.length === 0 ? (
          <>
            {/* Chapter Selection */}
            {chapters.length > 0 && (
              <div className="space-y-spacing-sm">
                <label className="text-sm font-medium text-primary">
                  Assign to Chapters (Optional)
                </label>
                <div className="flex flex-wrap gap-spacing-xs">
                  {chapters.map(chapter => {
                    const isSelected = selectedChapters.includes(chapter.id)
                    return (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          setSelectedChapters(prev =>
                            isSelected
                              ? prev.filter(id => id !== chapter.id)
                              : [...prev, chapter.id]
                          )
                        }}
                        className={cn(
                          "px-spacing-sm py-spacing-xs text-sm rounded-md border transition-all duration-fast",
                          isSelected
                            ? "bg-brand text-inverse border-brand"
                            : "bg-primary text-secondary border-subtle hover:border-default"
                        )}
                      >
                        {chapter.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Prompt Input */}
            <div className="space-y-spacing-sm">
              <label className="text-sm font-medium text-primary">
                Learning Material Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create questions about React hooks including useState, useEffect, and useContext. Focus on practical applications and common use cases. Include a mix of multiple choice and open-ended questions."
                className="w-full min-h-[200px] p-spacing-md text-base text-primary bg-primary border border-default rounded-lg resize-y focus:border-focus focus:ring-2 focus:ring-border-focus transition-all duration-fast"
                rows={8}
              />
              <p className="text-sm text-secondary">
                Tip: Be specific about the topics, difficulty level, and types of questions you want.
              </p>
            </div>

            {/* Example Prompts */}
            <div className="space-y-spacing-sm">
              <p className="text-sm font-medium text-primary">
                Example Prompts:
              </p>
              <div className="space-y-spacing-xs">
                {[
                  "Create 5 questions about photosynthesis for high school biology students",
                  "Generate questions testing understanding of JavaScript async/await concepts",
                  "Create a mix of questions about World War II causes and consequences"
                ].map((example, index) => (
                  <Card
                    key={index}
                    className="p-spacing-sm cursor-pointer hover:bg-emphasis transition-all duration-fast"
                    onClick={() => setPrompt(example)}
                  >
                    <div className="flex items-start gap-spacing-sm">
                      <FileText size={16} className="text-tertiary mt-0.5" />
                      <p className="text-sm text-secondary">
                        {example}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Generated Questions */}
            <div className="space-y-spacing-sm">
              <div className="flex items-center justify-between mb-spacing-md">
                <h3 className="text-base font-medium text-primary">
                  Generated Questions
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedQuestions(
                    selectedQuestions.length === generatedQuestions.length 
                      ? [] 
                      : generatedQuestions.map(q => q.id)
                  )}
                >
                  {selectedQuestions.length === generatedQuestions.length ? "Deselect All" : "Select All"}
                </Button>
              </div>

              {generatedQuestions.map((question, index) => {
                const isSelected = selectedQuestions.includes(question.id)
                return (
                  <Card
                    key={question.id}
                    className={cn(
                      "p-spacing-md cursor-pointer transition-all duration-fast",
                      isSelected && "border-brand bg-brand-light"
                    )}
                    onClick={() => toggleQuestion(question.id)}
                  >
                    <div className="flex items-start justify-between gap-spacing-md">
                      <div className="flex-1">
                        <div className="flex items-center gap-spacing-sm mb-spacing-xs">
                          <h4 className="text-base font-medium text-primary">
                            {index + 1}. {question.title}
                          </h4>
                          <Badge 
                            variant={
                              question.type === "connect-cards" ? "warning" :
                              question.type === "question-answer" ? "success" :
                              "info"
                            } 
                            size="sm"
                          >
                            {question.type.replace('-', ' ')}
                          </Badge>
                          <Badge variant="primary" size="sm">
                            {question.points} pts
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-secondary">
                          {getQuestionPreview(question)}
                        </p>
                      </div>
                      
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-fast",
                        isSelected
                          ? "bg-brand border-brand"
                          : "border-default"
                      )}>
                        {isSelected && (
                          <Plus size={14} className="text-inverse rotate-45" />
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Original Prompt */}
            <Card className="p-spacing-md bg-secondary">
              <p className="text-sm text-secondary">
                <strong>Your prompt:</strong> {prompt}
              </p>
            </Card>
          </>
        )}
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
    case "connect-cards":
      return `Match ${question.content.pairs.length} pairs`
    default:
      return ""
  }
}