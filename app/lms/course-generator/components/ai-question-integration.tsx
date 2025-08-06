"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/button"
import { AIQuestionGeneratorModal } from "@/components/ai-question-generator-modal"
import { Sparkles } from "lucide-react"
import type { Question } from "@/components/test-creator"
import { useRouter } from "next/navigation"

interface AIQuestionIntegrationProps {
  moduleId: string
  moduleTitle: string
  moduleContent: string
  onQuestionsGenerated: (moduleId: string, questions: Question[]) => void
}

export function AIQuestionIntegration({
  moduleId,
  moduleTitle,
  moduleContent,
  onQuestionsGenerated
}: AIQuestionIntegrationProps) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleGenerateQuestions = (questions: Question[]) => {
    onQuestionsGenerated(moduleId, questions)
    setShowModal(false)
  }

  const handleBack = () => {
    setShowModal(false)
    // The modal is already within the course generator, so just close it
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowModal(true)}
        className="w-full"
      >
        <Sparkles className="w-4 h-4 mr-spacing-sm" />
        Generate Test Questions with AI
      </Button>

      <AIQuestionGeneratorModal
        open={showModal}
        onOpenChange={setShowModal}
        onGenerate={handleGenerateQuestions}
        onBack={handleBack}
        backLabel="Back to Course Generator"
      />
    </>
  )
}