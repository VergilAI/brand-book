"use client"

import * as React from "react"
import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Settings, 
  Eye, 
  Save,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Sparkles,
  FileQuestion,
  ListChecks,
  ArrowLeft
} from "lucide-react"
import { QuestionEditor } from "./question-editor"
import { TestSettings } from "./test-settings"
import { SortableQuestionItem } from "./sortable-question-item"
import { TestPreviewModal } from "./test-preview-modal"
import { AIQuestionGeneratorModal } from "./ai-question-generator-modal"

export type QuestionType = "question-answer" | "multiple-choice"

export interface Question {
  id: string
  type: QuestionType
  title: string
  content: any // Type varies based on question type
  points: number
  order: number
  isInLibrary?: boolean // Whether this is saved to the library
}

export interface Test {
  id?: string
  title: string
  description: string
  questions: Question[]
  settings: {
    timeLimit?: number // in minutes
    passingScore: number // percentage
    attemptsAllowed: number
    randomizeQuestions: boolean
    showFeedback: boolean
  }
  status: "draft" | "published"
}


const getQuestionTypeColor = (type: QuestionType) => {
  switch (type) {
    case "question-answer":
      return {
        bg: "bg-success-light", // #F0FDF4
        border: "border-success", // #86EFAC
        text: "text-success" // #0F8A0F
      }
    case "multiple-choice":
      return {
        bg: "bg-info-light", // #EFF6FF
        border: "border-info", // #93C5FD
        text: "text-info" // #0087FF
      }
    default:
      return {
        bg: "bg-secondary",
        border: "border-default",
        text: "text-secondary"
      }
  }
}

interface TestCreatorProps {
  fromCourseGenerator?: boolean
  returnStep?: string
}

export function TestCreator({ fromCourseGenerator, returnStep }: TestCreatorProps = {}) {
  const router = useRouter()
  const [test, setTest] = useState<Test>({
    title: "Untitled Test",
    description: "",
    questions: [],
    settings: {
      passingScore: 70,
      attemptsAllowed: 1,
      randomizeQuestions: false,
      showFeedback: true
    },
    status: "draft"
  })

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setTest((prev) => {
        const oldIndex = prev.questions.findIndex((q) => q.id === active.id)
        const newIndex = prev.questions.findIndex((q) => q.id === over?.id)
        
        return {
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex).map((q, index) => ({
            ...q,
            order: index
          }))
        }
      })
    }
  }

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      title: `Question ${test.questions.length + 1}`,
      content: getDefaultContent(type),
      points: 1,
      order: test.questions.length
    }

    setTest(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setSelectedQuestionId(newQuestion.id)
  }

  const getDefaultContent = (type: QuestionType) => {
    switch (type) {
      case "question-answer":
        return {
          question: "",
          answer: ""
        }
      case "multiple-choice":
        return {
          question: "",
          options: [
            { id: `opt-${Date.now()}-1`, text: "", isCorrect: false },
            { id: `opt-${Date.now()}-2`, text: "", isCorrect: false },
            { id: `opt-${Date.now()}-3`, text: "", isCorrect: false },
            { id: `opt-${Date.now()}-4`, text: "", isCorrect: false }
          ]
        }
    }
  }

  const validateTest = () => {
    const errors: string[] = []
    
    if (!test.title.trim()) {
      errors.push("Test title is required")
    }
    
    if (test.questions.length === 0) {
      errors.push("At least one question is required")
    }
    
    test.questions.forEach((question, index) => {
      if (!question.title.trim()) {
        errors.push(`Question ${index + 1} needs a title`)
      }
      
      if (question.type === "multiple-choice") {
        const hasCorrectAnswer = question.content.options.some((opt: any) => opt.isCorrect)
        if (!hasCorrectAnswer) {
          errors.push(`Question ${index + 1} needs a correct answer selected`)
        }
      }
    })
    
    return errors
  }

  const handleSave = async (publish: boolean = false) => {
    const errors = validateTest()
    
    if (errors.length > 0) {
      alert("Please fix the following errors:\n\n" + errors.join("\n"))
      return
    }
    
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const testData = {
        ...test,
        status: publish ? "published" : "draft",
        updatedAt: new Date().toISOString()
      }
      
      console.log("Saving test:", testData)
      
      // Show success message
      alert(`Test ${publish ? "published" : "saved"} successfully!`)
      
      if (publish) {
        setTest(prev => ({ ...prev, status: "published" }))
      }
    } catch (error) {
      console.error("Error saving test:", error)
      alert("Failed to save test. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-secondary"> {/* #F5F5F7 */}
      {/* Sidebar */}
      <div className={cn(
        "bg-primary border-r border-subtle transition-all duration-normal", // #FFFFFF, rgba(0,0,0,0.05), 200ms
        isSidebarOpen ? "w-64" : "w-16"
      )}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-spacing-md border-b border-subtle"> {/* 16px, rgba(0,0,0,0.05) */}
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "text-lg font-semibold text-primary transition-opacity duration-fast", // 20px, 600, #1D1D1F, 100ms
                !isSidebarOpen && "opacity-0"
              )}>
                Questions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="h-8 w-8 p-0"
              >
                {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </Button>
            </div>
          </div>

          {/* Question List */}
          <div className="flex-1 overflow-y-auto p-spacing-sm"> {/* 8px */}
            {test.questions.length === 0 ? (
              <div className={cn(
                "text-sm text-secondary text-center py-spacing-lg", // 14px, #6C6C6D, 24px
                !isSidebarOpen && "hidden"
              )}>
                No questions yet
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={test.questions.map(q => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-spacing-xs"> {/* 4px */}
                    {test.questions.map((question, index) => (
                      <SortableQuestionItem
                        key={question.id}
                        question={question}
                        index={index}
                        isSelected={selectedQuestionId === question.id}
                        isSidebarOpen={isSidebarOpen}
                        onSelect={() => setSelectedQuestionId(question.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Add Question Button */}
          <div className="p-spacing-md border-t border-subtle space-y-spacing-sm"> {/* 16px, rgba(0,0,0,0.05), 8px */}
            {isSidebarOpen ? (
              <>
                <QuestionTypeSelector onSelect={addQuestion} />
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-brand hover:bg-brand-light text-inverse" // #7B00FF, #9933FF, #F5F5F7
                  onClick={() => setShowAIModal(true)}
                >
                  <Sparkles size={16} className="mr-spacing-xs" /> {/* 4px */}
                  Do with AI
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Plus size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-primary border-b border-subtle px-spacing-lg py-spacing-md"> {/* #FFFFFF, rgba(0,0,0,0.05), 24px, 16px */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-spacing-md flex-1">
              {fromCourseGenerator && (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => router.push(`/lms/course-generator?step=${returnStep}`)}
                  className="mr-spacing-md"
                >
                  <ArrowLeft size={20} className="mr-spacing-xs" />
                  Back to Course Generator
                </Button>
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={test.title}
                  onChange={(e) => setTest(prev => ({ ...prev, title: e.target.value }))}
                  className="text-2xl font-semibold text-primary bg-transparent border-none outline-none w-full" // 30px, 600, #1D1D1F
                  placeholder="Enter test title..."
                />
                <input
                  type="text"
                  value={test.description}
                  onChange={(e) => setTest(prev => ({ ...prev, description: e.target.value }))}
                  className="text-base text-secondary bg-transparent border-none outline-none w-full" // 16px, #6C6C6D
                  placeholder="Add a description..."
                />
              </div>
            </div>
            <div className="flex items-center gap-spacing-sm"> {/* 8px */}
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <Settings size={20} className="mr-spacing-xs" /> {/* 4px */}
                Settings
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowPreview(true)}
                disabled={test.questions.length === 0}
              >
                <Eye size={20} className="mr-spacing-xs" />
                Preview
              </Button>
              {test.status === "draft" ? (
                <>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                  >
                    <Save size={20} className="mr-spacing-xs" />
                    Save Draft
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                  >
                    Publish Test
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                >
                  <Save size={20} className="mr-spacing-xs" />
                  Update Published
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-spacing-lg"> {/* 24px */}
          {selectedQuestionId ? (
            <div className="max-w-4xl mx-auto">
              {(() => {
                const question = test.questions.find(q => q.id === selectedQuestionId)
                const questionIndex = test.questions.findIndex(q => q.id === selectedQuestionId)
                
                if (!question) return null
                
                return (
                  <QuestionEditor
                    question={question}
                    questionNumber={questionIndex + 1}
                    onUpdate={(updatedQuestion) => {
                      setTest(prev => ({
                        ...prev,
                        questions: prev.questions.map(q =>
                          q.id === updatedQuestion.id ? updatedQuestion : q
                        )
                      }))
                    }}
                    onDelete={() => {
                      setTest(prev => {
                        const currentIndex = prev.questions.findIndex(q => q.id === selectedQuestionId)
                        const updatedQuestions = prev.questions.filter(q => q.id !== selectedQuestionId)
                        
                        // Redirect to previous question if available
                        if (updatedQuestions.length > 0) {
                          // If we deleted the first question, go to the new first question
                          // Otherwise, go to the previous question
                          const newIndex = currentIndex === 0 ? 0 : currentIndex - 1
                          setSelectedQuestionId(updatedQuestions[newIndex].id)
                        } else {
                          setSelectedQuestionId(null)
                        }
                        
                        return {
                          ...prev,
                          questions: updatedQuestions
                        }
                      })
                    }}
                    onSaveToLibrary={() => {
                      // Here you would normally make an API call to save to library
                      console.log('Saving question to library:', question)
                    }}
                  />
                )
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-medium text-primary mb-spacing-sm"> {/* 24px, 500, #1D1D1F, 8px */}
                  Create your first question
                </h3>
                <p className="text-base text-secondary mb-spacing-md"> {/* 16px, #6C6C6D, 16px */}
                  Choose a question type from the sidebar to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="w-80 bg-primary border-l border-subtle overflow-hidden"> {/* #FFFFFF, rgba(0,0,0,0.05) */}
          <TestSettings
            settings={test.settings}
            onUpdate={(settings) => setTest(prev => ({ ...prev, settings }))}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      )}


      {/* Test Preview Modal */}
      <TestPreviewModal
        test={test}
        open={showPreview}
        onOpenChange={setShowPreview}
      />

      {/* AI Question Generator Modal */}
      <AIQuestionGeneratorModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
        onGenerate={(generatedQuestions) => {
          setTest(prev => ({
            ...prev,
            questions: [
              ...prev.questions,
              ...generatedQuestions.map((q, index) => ({
                ...q,
                order: prev.questions.length + index
              }))
            ]
          }))
          // Select the first generated question
          if (generatedQuestions.length > 0) {
            setSelectedQuestionId(generatedQuestions[0].id)
          }
        }}
      />
    </div>
  )
}

function QuestionTypeSelector({ onSelect }: { onSelect: (type: QuestionType) => void }) {
  const questionTypes = [
    {
      type: "question-answer" as QuestionType,
      label: "Question & Answer",
      description: "Open-ended text response",
      color: "bg-green-50 hover:bg-green-100 border-green-300",
      dot: "bg-green-500",
      icon: FileQuestion
    },
    {
      type: "multiple-choice" as QuestionType,
      label: "Multiple Choice",
      description: "Select one correct answer",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-300",
      dot: "bg-blue-500",
      icon: ListChecks
    }
  ]

  return (
    <div className="space-y-spacing-xs"> {/* 4px */}
      <p className="text-sm font-medium text-primary mb-spacing-sm"> {/* 14px, 500, #1D1D1F, 8px */}
        Add Question
      </p>
      {questionTypes.map(({ type, label, description, color, dot, icon: Icon }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            "w-full text-left p-spacing-sm rounded-md border transition-all duration-fast", // 8px, 8px, 100ms
            color
          )}
        >
          <div className="flex items-start gap-spacing-sm"> {/* 8px */}
            <Icon size={18} className={cn("mt-0.5", dot.replace('bg-', 'text-'))} />
            <div className="flex-1">
              <div className="text-sm font-medium text-primary"> {/* 14px, 500, #1D1D1F */}
                {label}
              </div>
              <div className="text-xs text-secondary"> {/* 12px, #6C6C6D */}
                {description}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}