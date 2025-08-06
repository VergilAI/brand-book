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
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CourseGeneratorState } from "../../types"

interface PersonalizeStepProps {
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

export function PersonalizeStep({ state, onStateChange, onNext, onBack }: PersonalizeStepProps) {
  const [targetAudience, setTargetAudience] = useState('')
  const [tone, setTone] = useState('conversational')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [additionalGuidelines, setAdditionalGuidelines] = useState('')
  const [learningObjectives, setLearningObjectives] = useState('')
  
  const extractedContent = state.extractedContent
  const keyPoints = extractedContent?.structured?.chapters?.flatMap(ch => ch.keyPoints) || []
  const topics = extractedContent?.metadata?.topics || []
  
  const handleNext = () => {
    // Save personalization settings to state
    onStateChange(prev => ({
      ...prev,
      personalizationSettings: {
        targetAudience,
        tone,
        difficulty,
        additionalGuidelines,
        learningObjectives
      }
    }))
    onNext()
  }
  
  return (
    <div className="space-y-spacing-lg">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
          Personalize Your Course
        </h2>
        <p className="text-text-secondary">
          Configure how the AI should generate your course content based on your audience and preferences.
        </p>
      </div>

      {/* Key Points Summary */}
      {keyPoints.length > 0 && (
        <Card className="p-spacing-lg bg-bg-brand/5 border-border-brand/20">
          <div className="flex items-start gap-spacing-md">
            <Sparkles className="w-5 h-5 text-text-brand mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-spacing-sm">
                Key Points Extracted
              </h3>
              <div className="space-y-spacing-xs">
                {keyPoints.slice(0, 5).map((point, index) => (
                  <div key={index} className="flex items-start gap-spacing-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-text-secondary">{point}</p>
                  </div>
                ))}
                {keyPoints.length > 5 && (
                  <p className="text-sm text-text-tertiary ml-spacing-lg">
                    ...and {keyPoints.length - 5} more key points
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Topics Detected */}
      {topics.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-text-primary mb-spacing-sm">
            Topics Detected
          </Label>
          <div className="flex flex-wrap gap-spacing-sm">
            {topics.map((topic, index) => (
              <Badge key={index} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Target Audience */}
      <Card className="p-spacing-lg">
        <div className="space-y-spacing-md">
          <div className="flex items-center gap-spacing-sm">
            <Users className="w-5 h-5 text-text-brand" />
            <h3 className="font-medium text-text-primary">Target Audience</h3>
          </div>
          
          <div>
            <Label htmlFor="target-audience" className="text-sm text-text-secondary mb-spacing-sm">
              Who is this course for? Describe your learners.
            </Label>
            <Textarea
              id="target-audience"
              placeholder="e.g., College students new to programming, Business professionals looking to understand AI, etc."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </Card>

      {/* Tone Selection */}
      <Card className="p-spacing-lg">
        <div className="space-y-spacing-md">
          <div className="flex items-center gap-spacing-sm">
            <MessageSquare className="w-5 h-5 text-text-brand" />
            <h3 className="font-medium text-text-primary">Content Tone</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-spacing-sm">
            {TONE_OPTIONS.map(option => (
              <div
                key={option.value}
                className={cn(
                  "p-spacing-md rounded-lg border-2 cursor-pointer transition-all duration-fast",
                  tone === option.value
                    ? "border-border-brand bg-bg-brand/5"
                    : "border-border-default hover:border-border-emphasis"
                )}
                onClick={() => setTone(option.value)}
              >
                <div className="flex items-center justify-between mb-spacing-xs">
                  <span className="font-medium text-text-primary">{option.label}</span>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-fast",
                    tone === option.value
                      ? "bg-bg-brand border-border-brand"
                      : "border-border-default"
                  )}>
                    {tone === option.value && (
                      <CheckCircle className="w-3 h-3 text-text-inverse" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Difficulty Level */}
      <Card className="p-spacing-lg">
        <div className="space-y-spacing-md">
          <div className="flex items-center gap-spacing-sm">
            <Target className="w-5 h-5 text-text-brand" />
            <h3 className="font-medium text-text-primary">Difficulty Level</h3>
          </div>
          
          <div className="flex gap-spacing-md">
            {DIFFICULTY_LEVELS.map(level => (
              <Button
                key={level.value}
                variant={difficulty === level.value ? "primary" : "secondary"}
                size="md"
                onClick={() => setDifficulty(level.value)}
                className={cn(
                  "flex-1",
                  difficulty === level.value && "shadow-brand-sm"
                )}
              >
                <span className={difficulty === level.value ? "text-text-inverse" : level.color}>
                  {level.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Learning Objectives */}
      <Card className="p-spacing-lg">
        <div className="space-y-spacing-md">
          <div className="flex items-center gap-spacing-sm">
            <BookOpen className="w-5 h-5 text-text-brand" />
            <h3 className="font-medium text-text-primary">Learning Objectives</h3>
          </div>
          
          <div>
            <Label htmlFor="learning-objectives" className="text-sm text-text-secondary mb-spacing-sm">
              What should learners achieve by the end of this course?
            </Label>
            <Textarea
              id="learning-objectives"
              placeholder="e.g., Understand fundamental AI concepts, Build a simple neural network, Apply ML to business problems..."
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </Card>

      {/* Additional Guidelines */}
      <Card className="p-spacing-lg">
        <div className="space-y-spacing-md">
          <div className="flex items-center gap-spacing-sm">
            <Info className="w-5 h-5 text-text-brand" />
            <h3 className="font-medium text-text-primary">Additional Guidelines</h3>
          </div>
          
          <div>
            <Label htmlFor="guidelines" className="text-sm text-text-secondary mb-spacing-sm">
              Any specific instructions for the AI? (Optional)
            </Label>
            <Textarea
              id="guidelines"
              placeholder="e.g., Include real-world examples, Focus on practical applications, Avoid technical jargon..."
              value={additionalGuidelines}
              onChange={(e) => setAdditionalGuidelines(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
      </Card>

      {/* Navigation */}
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
          disabled={!targetAudience.trim()}
        >
          Continue to Structure
          <ArrowRight className="w-5 h-5 ml-spacing-sm" />
        </Button>
      </div>
    </div>
  )
}