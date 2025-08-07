"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { 
  BookOpen, 
  Clock, 
  Target,
  Edit2,
  Save,
  X,
  Plus,
  GripVertical,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CourseGeneratorState, Chapter, CourseModule } from "../../types"

interface StructureStepProps {
  state: CourseGeneratorState
  onStateChange: React.Dispatch<React.SetStateAction<CourseGeneratorState>>
  onNext: () => void
  onBack: () => void
}

export function StructureStep({ state, onStateChange, onNext, onBack }: StructureStepProps) {
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [courseTitle, setCourseTitle] = useState(
    state.extractedContent?.structured.title || "Untitled Course"
  )
  const [courseDescription, setCourseDescription] = useState(
    "An AI-generated course based on your uploaded materials"
  )

  // Convert chapters to modules if not already done
  const [modules, setModules] = useState<CourseModule[]>(() => {
    if (state.generatedCourse?.modules.length) {
      return state.generatedCourse.modules
    }
    
    return state.extractedContent?.structured.chapters.map((chapter, index) => ({
      id: `module-${index}`,
      title: chapter.title,
      description: `Learn about ${chapter.title.toLowerCase()}`,
      learningObjectives: [
        `Understand the key concepts of ${chapter.title}`,
        `Apply ${chapter.title} principles in practice`,
        `Evaluate different approaches to ${chapter.title}`
      ],
      content: {
        material: chapter.content,
        summary: `This module covers ${chapter.title} with ${chapter.keyPoints.length} key points.`,
        keyPoints: chapter.keyPoints
      },
      activities: {},
      estimatedDuration: Math.round(chapter.content.split(' ').length / 200), // Rough estimate
      order: index
    })) || []
  })

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const updateModule = (moduleId: string, updates: Partial<CourseModule>) => {
    setModules(prev => prev.map(module =>
      module.id === moduleId ? { ...module, ...updates } : module
    ))
  }

  const handleNext = () => {
    // Save the structured course
    onStateChange(prev => ({
      ...prev,
      generatedCourse: {
        id: `course-${Date.now()}`,
        title: courseTitle,
        description: courseDescription,
        sourceFiles: prev.uploadedFiles,
        modules,
        metadata: {
          totalDuration: modules.reduce((acc, m) => acc + m.estimatedDuration, 0),
          difficulty: prev.personalizationSettings?.difficulty || prev.extractedContent?.metadata.difficulty || 'intermediate',
          topics: prev.extractedContent?.metadata.topics || [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: 'draft'
      },
      currentStep: 'generating'
    }))
    onNext()
  }

  const totalDuration = modules.reduce((acc, m) => acc + m.estimatedDuration, 0)
  const totalObjectives = modules.reduce((acc, m) => acc + m.learningObjectives.length, 0)

  return (
    <div className="space-y-spacing-lg">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
          Course Structure
        </h2>
        <p className="text-text-secondary">
          Review and customize the AI-generated course structure. You can edit module titles,
          descriptions, and learning objectives.
        </p>
        {state.personalizationSettings && (
          <div className="mt-spacing-md p-spacing-md bg-bg-brand/5 border border-border-brand/20 rounded-lg">
            <p className="text-sm text-text-primary">
              <span className="font-medium">Personalized for:</span> {state.personalizationSettings.targetAudience || 'General audience'} • 
              <span className="font-medium"> Tone:</span> {state.personalizationSettings.tone} • 
              <span className="font-medium"> Level:</span> {state.personalizationSettings.difficulty}
            </p>
          </div>
        )}
      </div>

     
      <Card className="p-spacing-lg">
        <div className="space-y-spacing-md">
          <div>
            <label className="text-sm font-medium text-text-primary block mb-spacing-xs">
              Course Title
            </label>
            <Input
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="text-lg font-semibold"
              placeholder="Enter course title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-text-primary block mb-spacing-xs">
              Course Description
            </label>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full min-h-[80px] p-spacing-sm text-base text-text-primary bg-bg-primary border border-border-default rounded-lg resize-y focus:border-border-focus focus:ring-2 focus:ring-border-focus transition-all duration-fast"
              placeholder="Enter course description"
            />
          </div>
          
          <div className="flex items-center gap-spacing-lg pt-spacing-sm">
            <div className="flex items-center gap-spacing-sm">
              <BookOpen className="w-5 h-5 text-text-brand" />
              <span className="text-sm font-medium">{modules.length} Modules</span>
            </div>
            <div className="flex items-center gap-spacing-sm">
              <Target className="w-5 h-5 text-text-brand" />
              <span className="text-sm font-medium">{totalObjectives} Learning Objectives</span>
            </div>
            <div className="flex items-center gap-spacing-sm">
              <Clock className="w-5 h-5 text-text-brand" />
              <span className="text-sm font-medium">{totalDuration} min estimated</span>
            </div>
          </div>
        </div>
      </Card>

     
      <div className="space-y-spacing-sm">
        <h3 className="text-lg font-medium text-text-primary">Course Modules</h3>
        
        {modules.map((module, index) => {
          const isExpanded = expandedModules.includes(module.id)
          const isEditing = editingModule === module.id

          return (
            <Card key={module.id} className="overflow-hidden">
              <div 
                className="p-spacing-md cursor-pointer hover:bg-bg-emphasis transition-all duration-fast"
                onClick={() => !isEditing && toggleModule(module.id)}
              >
                <div className="flex items-start gap-spacing-md">
                  <GripVertical className="w-5 h-5 text-text-tertiary mt-0.5" />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-spacing-sm">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-text-secondary" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-text-secondary" />
                      )}
                      
                      {isEditing ? (
                        <Input
                          value={module.title}
                          onChange={(e) => updateModule(module.id, { title: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1"
                        />
                      ) : (
                        <h4 className="text-base font-medium text-text-primary">
                          Module {index + 1}: {module.title}
                        </h4>
                      )}
                    </div>
                    
                    <p className="text-sm text-text-secondary mt-spacing-xs ml-spacing-lg">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center gap-spacing-md mt-spacing-sm ml-spacing-lg">
                      <Badge variant="secondary" size="sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {module.estimatedDuration} min
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        <Target className="w-3 h-3 mr-1" />
                        {module.learningObjectives.length} objectives
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingModule(isEditing ? null : module.id)
                    }}
                  >
                    {isEditing ? (
                      <Save className="w-4 h-4" />
                    ) : (
                      <Edit2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {isExpanded && (
                <div className="px-spacing-lg pb-spacing-md border-t border-border-subtle">
                  <div className="pt-spacing-md space-y-spacing-md">
                    <div>
                      <h5 className="text-sm font-medium text-text-primary mb-spacing-sm">
                        Learning Objectives
                      </h5>
                      <ul className="space-y-spacing-xs">
                        {module.learningObjectives.map((objective, idx) => (
                          <li key={idx} className="flex items-start gap-spacing-sm text-sm text-text-secondary">
                            <span className="text-text-brand mt-0.5">•</span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-text-primary mb-spacing-sm">
                        Key Points
                      </h5>
                      <div className="flex flex-wrap gap-spacing-sm">
                        {module.content.keyPoints.map((point, idx) => (
                          <Badge key={idx} variant="secondary" size="sm">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

     
      <div className="flex justify-between items-center pt-spacing-lg">
        <Button
          variant="ghost"
          size="lg"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5 mr-spacing-sm" />
          Back
        </Button>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
        >
          Generate Learning Activities
          <ArrowRight className="w-5 h-5 ml-spacing-sm" />
        </Button>
      </div>
    </div>
  )
}