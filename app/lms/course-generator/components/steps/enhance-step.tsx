"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { Textarea } from "@/components/textarea"
import { Label } from "@/components/atomic/label"
import { 
  Brain, 
  Users,
  BookOpen,
  Sparkles,
  Target,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Info,
  Edit2,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CourseGeneratorState } from "../../types"

interface EnhanceStepProps {
  state: CourseGeneratorState
  onStateChange: React.Dispatch<React.SetStateAction<CourseGeneratorState>>
  onNext: () => void
  onBack: () => void
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
  { value: 'academic', label: 'Academic', description: 'Scholarly and detailed' },
  { value: 'playful', label: 'Playful', description: 'Fun and engaging' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' }
]

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'text-green-600' },
  { value: 'intermediate', label: 'Intermediate', color: 'text-text-warning' },
  { value: 'advanced', label: 'Advanced', color: 'text-text-error' }
]

export function EnhanceStep({ state, onStateChange, onNext, onBack }: EnhanceStepProps) {
  const [targetAudience, setTargetAudience] = useState('')
  const [tone, setTone] = useState('conversational')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [additionalGuidelines, setAdditionalGuidelines] = useState('')
  const [learningObjectives, setLearningObjectives] = useState('')
  const [editingKeyPoint, setEditingKeyPoint] = useState<string | null>(null)
  const [keyPointText, setKeyPointText] = useState('')
  // Get chapters from extracted content
  const keyPoints = state.extractedContent?.structured?.learningObjectives || []

  const handleSavePersonalization = () => {
    onStateChange(prev => ({
      ...prev,
      personalizationSettings: {
        targetAudience,
        tone,
        difficulty,
        additionalGuidelines,
        learningObjectives
      },
      currentStep: 'structure'
    }))
    onNext()
  }

  const handleEditKeyPoint = (index: number) => {
    setEditingKeyPoint(index.toString())
    setKeyPointText(keyPoints[index])
  }

  const handleSaveKeyPoint = (index: number) => {
    if (state.extractedContent) {
      const updatedKeyPoints = [...keyPoints]
      updatedKeyPoints[index] = keyPointText
      
      onStateChange(prev => ({
        ...prev,
        extractedContent: {
          ...prev.extractedContent!,
          structured: {
            ...prev.extractedContent!.structured,
            learningObjectives: updatedKeyPoints
          }
        }
      }))
    }
    setEditingKeyPoint(null)
    setKeyPointText('')
  }


  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto space-y-spacing-lg pb-spacing-lg">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
            Personalize Content
          </h2>
          <p className="text-text-secondary">
            Customize the tone, difficulty, and target audience to create a tailored learning experience.
          </p>
        </div>

      {/* Extracted Key Points - Editable */}
      {keyPoints.length > 0 && (
        <Card className="p-spacing-lg">
          <div className="flex items-start gap-spacing-md mb-spacing-md">
            <Sparkles className="w-5 h-5 text-text-brand mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-spacing-sm">
                Key Learning Objectives
              </h3>
              <p className="text-sm text-text-secondary mb-spacing-md">
                Review and edit the automatically extracted learning objectives from your content.
              </p>
              
              <div className="space-y-spacing-sm">
                {keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-spacing-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {editingKeyPoint === index.toString() ? (
                      <div className="flex-1 flex gap-spacing-sm">
                        <Input
                          value={keyPointText}
                          onChange={(e) => setKeyPointText(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => handleSaveKeyPoint(index)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingKeyPoint(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-start justify-between group">
                        <p className="text-sm text-text-primary">{point}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleEditKeyPoint(index)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}


      {/* Target Audience Settings */}
      <Card className="p-spacing-lg">
        <div className="space-y-spacing-md">
          <div>
            <Label htmlFor="audience" className="flex items-center gap-spacing-sm mb-spacing-sm">
              <Users className="w-4 h-4" />
              Target Audience
            </Label>
            <Input
              id="audience"
              placeholder="e.g., College students, professionals, beginners in AI..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
            <p className="text-sm text-text-secondary mt-spacing-xs">
              Describe who will be taking this course
            </p>
          </div>

          <div>
            <Label className="flex items-center gap-spacing-sm mb-spacing-sm">
              <MessageSquare className="w-4 h-4" />
              Content Tone
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-spacing-sm">
              {TONE_OPTIONS.map(option => (
                <Card
                  key={option.value}
                  className={cn(
                    "p-spacing-md cursor-pointer transition-all min-h-[80px]",
                    "hover:border-border-brand",
                    tone === option.value && "border-border-brand bg-bg-brand/10"
                  )}
                  onClick={() => setTone(option.value)}
                >
                  <div className="space-y-spacing-xs">
                    <p className={cn(
                      "font-semibold text-sm",
                      tone === option.value ? "text-text-brand" : "text-text-primary"
                    )}>
                      {option.label}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {option.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-spacing-sm mb-spacing-sm">
              <Target className="w-4 h-4" />
              Difficulty Level
            </Label>
            <div className="flex gap-spacing-sm">
              {DIFFICULTY_LEVELS.map(level => (
                <Button
                  key={level.value}
                  variant={difficulty === level.value ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setDifficulty(level.value)}
                >
                  <span className={level.color}>{level.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="guidelines" className="flex items-center gap-spacing-sm mb-spacing-sm">
              <Info className="w-4 h-4" />
              Additional Guidelines
            </Label>
            <Textarea
              id="guidelines"
              placeholder="Any specific requirements or preferences for the course content..."
              value={additionalGuidelines}
              onChange={(e) => setAdditionalGuidelines(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Card>
      </div>

      {/* Sticky Footer with Navigation */}
      <div className="sticky bottom-0 bg-bg-primary border-t border-border-subtle pt-spacing-md">
        <div className="flex justify-between items-center">
          <Button variant="secondary" size="lg" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-spacing-sm" />
            Back
          </Button>
          <Button variant="primary" size="lg" onClick={handleSavePersonalization}>
            Continue to Course Structure
            <ArrowRight className="w-5 h-5 ml-spacing-sm" />
          </Button>
        </div>
      </div>
    </div>
  )
}

