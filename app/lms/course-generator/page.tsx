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
import { EnhanceStep } from "./components/steps/enhance-step"
import { StructureStep } from "./components/steps/structure-step"
import { ActivitiesStep } from "./components/steps/activities-step"
import { ReviewStep } from "./components/steps/review-step"

const STEPS: Array<{
  id: ProcessingStep
  label: string
  description: string
  icon: React.ReactNode
  section: 'content' | 'course'
}> = [
  {
    id: 'upload',
    label: 'Upload Knowledge Base',
    description: 'Upload source documents',
    icon: <Upload className="w-5 h-5" />,
    section: 'content'
  },
  {
    id: 'extract',
    label: 'Extract & Review',
    description: 'Review extracted content',
    icon: <FileText className="w-5 h-5" />,
    section: 'content'
  },
  {
    id: 'enhance',
    label: 'Personalize Content',
    description: 'Customize tone & audience',
    icon: <Brain className="w-5 h-5" />,
    section: 'content'
  },
  {
    id: 'structure',
    label: 'Structure Course',
    description: 'Organize chapters & lessons',
    icon: <BookOpen className="w-5 h-5" />,
    section: 'course'
  },
  {
    id: 'activities',
    label: 'Create Activities',
    description: 'Add games & assessments',
    icon: <Sparkles className="w-5 h-5" />,
    section: 'course'
  },
  {
    id: 'review',
    label: 'Review & Publish',
    description: 'Finalize your course',
    icon: <CheckCircle className="w-5 h-5" />,
    section: 'course'
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

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [state.currentStep])

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
      case 'extract':
        return (
          <ProcessingStepComponent
            state={state}
            onStateChange={setState}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'enhance':
        return (
          <EnhanceStep
            state={state}
            onStateChange={setState}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'structure':
        return (
          <StructureStep
            state={state}
            onStateChange={setState}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'activities':
        return (
          <ActivitiesStep
            state={state}
            onStateChange={setState}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'review':
        return (
          <ReviewStep
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
    <div className="h-screen flex flex-col bg-bg-secondary overflow-hidden">
     
      <header className="bg-bg-primary border-b border-border-default flex-shrink-0">
        <div className="max-w-7xl mx-auto px-spacing-lg py-spacing-md">
          <div className="flex items-center gap-spacing-md">
            <BookOpen className="w-8 h-8 text-text-brand" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                AI Course Generator
              </h1>
              <p className="text-text-secondary text-sm">
                Transform your learning materials into interactive courses
              </p>
            </div>
          </div>
        </div>
      </header>

     
      <div className="bg-bg-primary border-b border-border-subtle flex-shrink-0">
        <div className="max-w-7xl mx-auto px-spacing-lg py-spacing-sm">
          {/* Section Labels - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-between mb-spacing-sm">
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wide">Section 1: Content Management</h3>
              <p className="text-xs text-text-secondary">Prepare and refine your source material</p>
            </div>
            <div className="w-px h-6 bg-border-default mx-spacing-md"></div>
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wide">Section 2: Course Development</h3>
              <p className="text-xs text-text-secondary">Create the learning experience</p>
            </div>
          </div>
          
          {/* Steps */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = step.id === state.currentStep
              const isCompleted = index < currentStepIndex
              const isProcessing = state.isProcessing && isActive
              const isClickable = !state.isProcessing && (index <= currentStepIndex + 1)
              
              // Add section divider
              const showSectionDivider = index === 3 // Before "structure" step (first step of section 2)
              
              return (
                <React.Fragment key={step.id}>
                  {showSectionDivider && (
                    <div className="flex items-center mx-spacing-md">
                      <div className="w-px h-12 bg-border-emphasis"></div>
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex items-center gap-spacing-xs md:gap-spacing-sm",
                      isActive && "text-text-brand",
                      isCompleted && "text-green-600",
                      !isActive && !isCompleted && "text-text-tertiary",
                      isClickable && "cursor-pointer hover:opacity-80 transition-opacity"
                    )}
                    onClick={() => isClickable && handleStepClick(step.id, index)}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-normal",
                        "text-xs md:text-sm",
                        isActive && "bg-bg-brand text-text-inverse shadow-brand-md",
                        isCompleted && "bg-green-600 text-white",
                        !isActive && !isCompleted && "bg-bg-emphasis text-text-tertiary"
                      )}
                    >
                      <div className="w-4 h-4 md:w-5 md:h-5">
                        {React.cloneElement(step.icon as React.ReactElement, { 
                          className: "w-full h-full" 
                        })}
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium">{step.label}</p>
                      <p className="text-xs text-text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && index !== 2 && index !== 5 && (
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

     
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-spacing-lg py-spacing-lg">
          <Card className="h-full flex flex-col p-spacing-lg overflow-hidden">
            <div className="h-full transition-all duration-300 ease-in-out">
              {renderStepContent()}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}