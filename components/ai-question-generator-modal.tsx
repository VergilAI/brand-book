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
}

export function AIQuestionGeneratorModal({
  open,
  onOpenChange,
  onGenerate
}: AIQuestionGeneratorModalProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Parse the prompt to extract number of questions requested
      const numberMatch = prompt.match(/(\d+)\s*question/i)
      const requestedCount = numberMatch ? parseInt(numberMatch[1]) : 3 // Default to 3 if not specified
      
      // Extract topic from prompt for more realistic questions
      const topicMatch = prompt.match(/about\s+([^.]+)/i)
      const topic = topicMatch ? topicMatch[1].trim() : "the requested topic"
      
      // Generate the requested number of questions
      const mockQuestions: Question[] = []
      
      // Sample question templates for variety
      const mcTemplates = [
        `What is the primary purpose of ${topic}?`,
        `Which of the following best describes ${topic}?`,
        `What is a key characteristic of ${topic}?`,
        `How does ${topic} differ from other approaches?`,
        `When should you use ${topic}?`,
        `What is the main benefit of ${topic}?`,
        `Which statement about ${topic} is correct?`,
        `What problem does ${topic} solve?`
      ]
      
      const qaTemplates = [
        `Explain how ${topic} works and why it's important.`,
        `Describe the main concepts of ${topic} in your own words.`,
        `What are the advantages and disadvantages of ${topic}?`,
        `How would you implement ${topic} in a real-world scenario?`,
        `Compare and contrast ${topic} with alternative approaches.`,
        `What are the best practices when working with ${topic}?`,
        `Explain the key principles behind ${topic}.`,
        `How has ${topic} evolved over time?`
      ]
      
      for (let i = 0; i < requestedCount; i++) {
        const timestamp = Date.now() + i // Ensure unique IDs
        
        // Alternate between question types
        if (i % 2 === 0) {
          // Multiple choice question
          const questionTemplate = mcTemplates[i % mcTemplates.length]
          mockQuestions.push({
            id: `ai-${timestamp}`,
            type: "multiple-choice",
            title: `${topic} - Concept ${Math.floor(i/2) + 1}`,
            content: {
              question: questionTemplate,
              options: [
                { id: `${timestamp}-1`, text: `Correct answer about ${topic}`, isCorrect: true },
                { id: `${timestamp}-2`, text: `Plausible but incorrect option`, isCorrect: false },
                { id: `${timestamp}-3`, text: `Common misconception about ${topic}`, isCorrect: false },
                { id: `${timestamp}-4`, text: `Unrelated or clearly wrong option`, isCorrect: false }
              ]
            },
            points: 1,
            order: i
          })
        } else {
          // Question & Answer
          const questionTemplate = qaTemplates[Math.floor(i/2) % qaTemplates.length]
          mockQuestions.push({
            id: `ai-${timestamp}`,
            type: "question-answer",
            title: `${topic} - Analysis ${Math.floor(i/2) + 1}`,
            content: {
              question: questionTemplate,
              answer: `This is a comprehensive answer about ${topic}. In a real implementation, this would contain detailed information based on the learning material provided.`
            },
            points: 2,
            order: i
          })
        }
      }
      
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
      <div className="space-y-spacing-lg max-h-[70vh] overflow-y-auto"> {/* 24px */}
        {generatedQuestions.length === 0 ? (
          <>
            {/* Prompt Input */}
            <div className="space-y-spacing-sm">
              <label className="text-sm font-medium text-primary">
                Learning Material Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create 5 questions about React hooks including useState, useEffect, and useContext. Focus on practical applications and common use cases."
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
                  "Generate 10 questions testing understanding of JavaScript async/await concepts",
                  "Create 8 questions about World War II causes and consequences"
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
              <div className="flex items-center justify-between mb-spacing-md sticky top-0 bg-primary z-10 pb-spacing-sm"> {/* #FFFFFF, 8px */}
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

              <div className="space-y-spacing-sm max-h-[400px] overflow-y-auto pr-spacing-sm"> {/* 8px, 8px */}
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
                              question.type === "question-answer" ? "success" : "info"
                            }
                          >
                            {question.type.replace('-', ' ')}
                          </Badge>
                          <Badge variant="brand">
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
    default:
      return ""
  }
}