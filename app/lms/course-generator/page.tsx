"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { Progress } from "@/components/atomic/progress"
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Brain, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ProcessingStep, CourseGeneratorState } from "./types"
import { FileUploadStep } from "./components/steps/upload-step"
import { ProcessingStep as ProcessingStepComponent } from "./components/steps/processing-step"
import { PersonalizeStep } from "./components/steps/personalize-step"
import { StructureStep } from "./components/steps/structure-step"
import { ContentStep } from "./components/steps/content-step"
import { PublishStep } from "./components/steps/publish-step"

const STEPS: Array<{
  id: ProcessingStep
  label: string
  description: string
  icon: React.ReactNode
}> = [
  {
    id: 'upload',
    label: 'Upload Materials',
    description: 'Upload PDF or document files',
    icon: <Upload className="w-5 h-5" />
  },
  {
    id: 'extracting',
    label: 'Extract Content',
    description: 'Processing your documents',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 'analyzing',
    label: 'Personalize Content',
    description: 'Configure AI settings',
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: 'structuring',
    label: 'Structure Course',
    description: 'Organizing into modules',
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: 'generating',
    label: 'Generate Activities',
    description: 'Creating learning games',
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: 'complete',
    label: 'Review & Publish',
    description: 'Finalize your course',
    icon: <CheckCircle className="w-5 h-5" />
  }
]

export default function CourseGeneratorPage() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<CourseGeneratorState>({
    currentStep: 'upload',
    uploadedFiles: [],
    extractedContent: null,
    generatedCourse: null,
    isProcessing: false,
    error: null
  })

  // Restore to the step specified in query params
  useEffect(() => {
    const step = searchParams.get('step') as ProcessingStep
    if (step && STEPS.some(s => s.id === step)) {
      setState(prev => ({ ...prev, currentStep: step }))
    }
  }, [searchParams])

  const currentStepIndex = STEPS.findIndex(s => s.id === state.currentStep)
  const canGoBack = currentStepIndex > 0 && !state.isProcessing
  const canGoNext = currentStepIndex < STEPS.length - 1 && !state.isProcessing

  const handleNext = () => {
    if (canGoNext) {
      const nextStep = STEPS[currentStepIndex + 1].id
      setState(prev => ({ ...prev, currentStep: nextStep }))
    }
  }

  const handleBack = () => {
    if (canGoBack) {
      const prevStep = STEPS[currentStepIndex - 1].id
      setState(prev => ({ ...prev, currentStep: prevStep }))
    }
  }

  const handleStepClick = (stepId: ProcessingStep, stepIndex: number) => {
    // Don't allow navigation if currently processing
    if (state.isProcessing) return
    
    // Don't allow skipping ahead past completed steps
    if (stepIndex > currentStepIndex + 1) return
    
    // Allow navigation to any previous step or the next immediate step
    if (stepIndex <= currentStepIndex + 1) {
      setState(prev => ({ ...prev, currentStep: stepId }))
    }
  }

  const renderStepContent = () => {
    switch (state.currentStep) {
      case 'upload':
        return (
          <FileUploadStep
            state={state}
            onStateChange={setState}
            onNext={handleNext}
          />
        )
      case 'extracting':
        return (
          <ProcessingStepComponent
            state={state}
            onStateChange={setState}
            onNext={handleNext}
          />
        )
      case 'analyzing':
        return (
          <PersonalizeStep
            state={state}
            onStateChange={setState}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'structuring':
        return (
          <StructureStep
            state={state}
            onStateChange={setState}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'generating':
        return (
          <ContentStep
            state={state}
            onStateChange={setState}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'complete':
        return (
          <PublishStep
            state={state}
            onStateChange={setState}
            onBack={handleBack}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
     
      <header className="bg-bg-primary border-b border-border-default">
        <div className="max-w-7xl mx-auto px-spacing-lg py-spacing-lg">
          <div className="flex items-center gap-spacing-md">
            <BookOpen className="w-8 h-8 text-text-brand" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                AI Course Generator
              </h1>
              <p className="text-text-secondary">
                Transform your learning materials into interactive courses
              </p>
            </div>
          </div>
        </div>
      </header>

     
      <div className="bg-bg-primary border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-spacing-lg py-spacing-md">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = step.id === state.currentStep
              const isCompleted = index < currentStepIndex
              const isProcessing = state.isProcessing && isActive

              const isClickable = !state.isProcessing && (index <= currentStepIndex + 1)
              
              return (
                <React.Fragment key={step.id}>
                  <div
                    className={cn(
                      "flex items-center gap-spacing-sm", // 8px
                      isActive && "text-text-brand", // #7B00FF
                      isCompleted && "text-green-600", // darker green for better visibility
                      !isActive && !isCompleted && "text-text-tertiary", // #71717A
                      isClickable && "cursor-pointer hover:opacity-80 transition-opacity"
                    )}
                    onClick={() => isClickable && handleStepClick(step.id, index)}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-normal", // 200ms
                        isActive && "bg-bg-brand text-text-inverse shadow-brand-md", // #7B00FF, #F5F5F7
                        isCompleted && "bg-green-600 text-white", // darker green background, white for better contrast
                        !isActive && !isCompleted && "bg-bg-emphasis text-text-tertiary" // #F0F0F2, #71717A
                      )}
                    >
                      {step.icon}
                    </div>
                    <div className="hidden md:block">
                      <p className="font-medium">{step.label}</p>
                      <p className="text-sm text-text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-spacing-sm transition-all duration-normal", // 8px, 200ms
                        isCompleted ? "bg-green-600" : "bg-border-subtle" // darker green for visibility
                      )}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

     
      <main className="max-w-7xl mx-auto px-spacing-lg py-spacing-xl">
        <Card className="p-spacing-xl">
          {renderStepContent()}
        </Card>
      </main>
    </div>
  )
}