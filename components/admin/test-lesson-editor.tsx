'use client'

import { useState } from 'react'
import {
  HelpCircle,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle,
  Circle,
  Clock,
  Shuffle,
  Eye,
  RotateCcw,
  Settings,
  Save,
  Play
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Textarea } from '@/components/textarea'
import { Switch } from '@/components/ui/Switch'
import { Badge } from '@/components/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/collapsible'
import { Alert, AlertDescription } from '@/components/alert'
import { RichTextEditor } from './rich-text-editor'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  text: string
  type: 'multiple-choice' | 'text-box'
  options?: string[] // For multiple-choice
  correctAnswer: string | string[] // Single answer or multiple for multi-select
  explanation?: string
}

interface TestLessonContent {
  questions: Question[]
  quizSettings: {
    passingScore: number
    timeLimit?: number
    randomizeQuestions: boolean
    immediateResults: boolean
    retakePolicy: 'unlimited' | 'limited' | 'once'
    maxAttempts?: number
  }
}

interface TestLessonEditorProps {
  content: TestLessonContent
  onChange: (content: TestLessonContent) => void
}

export function TestLessonEditor({ content, onChange }: TestLessonEditorProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  const [previewMode, setPreviewMode] = useState(false)

  const updateContent = (updates: Partial<TestLessonContent>) => {
    onChange({ ...content, ...updates })
  }

  const updateQuizSettings = (updates: Partial<TestLessonContent['quizSettings']>) => {
    updateContent({
      quizSettings: { ...content.quizSettings, ...updates }
    })
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: '',
      type: 'multiple-choice',
      options: ['Option 1', 'Option 2'],
      correctAnswer: 'Option 1',
      explanation: ''
    }

    updateContent({
      questions: [...content.questions, newQuestion]
    })

    // Expand the new question
    setExpandedQuestions(prev => new Set([...prev, newQuestion.id]))
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    updateContent({
      questions: content.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    })
  }

  const deleteQuestion = (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      updateContent({
        questions: content.questions.filter(q => q.id !== questionId)
      })
      setExpandedQuestions(prev => {
        const next = new Set(prev)
        next.delete(questionId)
        return next
      })
    }
  }

  const duplicateQuestion = (questionId: string) => {
    const question = content.questions.find(q => q.id === questionId)
    if (question) {
      const duplicatedQuestion: Question = {
        ...question,
        id: `question-${Date.now()}`,
        text: `${question.text} (Copy)`
      }
      
      updateContent({
        questions: [...content.questions, duplicatedQuestion]
      })
    }
  }

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = content.questions.findIndex(q => q.id === questionId)
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < content.questions.length - 1)
    ) {
      const newQuestions = [...content.questions]
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      
      // Swap questions
      ;[newQuestions[currentIndex], newQuestions[newIndex]] = 
      [newQuestions[newIndex], newQuestions[currentIndex]]
      
      updateContent({ questions: newQuestions })
    }
  }

  const toggleQuestionExpansion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev)
      if (next.has(questionId)) {
        next.delete(questionId)
      } else {
        next.add(questionId)
      }
      return next
    })
  }

  const addOption = (questionId: string) => {
    const question = content.questions.find(q => q.id === questionId)
    if (question && question.options && question.options.length < 8) {
      updateQuestion(questionId, {
        options: [...question.options, `Option ${question.options.length + 1}`]
      })
    }
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = content.questions.find(q => q.id === questionId)
    if (question && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, i) => i !== optionIndex)
      updateQuestion(questionId, {
        options: newOptions,
        correctAnswer: question.correctAnswer === question.options[optionIndex] 
          ? newOptions[0] 
          : question.correctAnswer
      })
    }
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = content.questions.find(q => q.id === questionId)
    if (question && question.options) {
      const newOptions = [...question.options]
      const oldValue = newOptions[optionIndex]
      newOptions[optionIndex] = value
      
      updateQuestion(questionId, {
        options: newOptions,
        correctAnswer: question.correctAnswer === oldValue ? value : question.correctAnswer
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quiz Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="passing-score">Passing Score (%)</Label>
              <Input
                id="passing-score"
                type="number"
                min="0"
                max="100"
                value={content.quizSettings.passingScore}
                onChange={(e) =>
                  updateQuizSettings({ passingScore: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div>
              <Label htmlFor="time-limit">Time Limit (minutes)</Label>
              <Input
                id="time-limit"
                type="number"
                min="0"
                placeholder="No limit"
                value={content.quizSettings.timeLimit || ''}
                onChange={(e) =>
                  updateQuizSettings({ 
                    timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Randomize Questions</Label>
                <p className="text-xs text-gray-500">Show questions in random order</p>
              </div>
              <Switch
                checked={content.quizSettings.randomizeQuestions}
                onCheckedChange={(checked) =>
                  updateQuizSettings({ randomizeQuestions: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Immediate Results</Label>
                <p className="text-xs text-gray-500">Show answers after each question</p>
              </div>
              <Switch
                checked={content.quizSettings.immediateResults}
                onCheckedChange={(checked) =>
                  updateQuizSettings({ immediateResults: checked })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Retake Policy</Label>
              <Select
                value={content.quizSettings.retakePolicy}
                onValueChange={(value: 'unlimited' | 'limited' | 'once') =>
                  updateQuizSettings({ retakePolicy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unlimited">Unlimited Attempts</SelectItem>
                  <SelectItem value="limited">Limited Attempts</SelectItem>
                  <SelectItem value="once">One Attempt Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {content.quizSettings.retakePolicy === 'limited' && (
              <div>
                <Label htmlFor="max-attempts">Maximum Attempts</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  min="1"
                  max="10"
                  value={content.quizSettings.maxAttempts || 3}
                  onChange={(e) =>
                    updateQuizSettings({ maxAttempts: parseInt(e.target.value) || 3 })
                  }
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Questions ({content.questions.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              <Button onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {content.questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <HelpCircle className="h-8 w-8 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No questions yet</p>
              <p className="text-sm mb-4">Create your first question to get started</p>
              <Button onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {content.questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  index={index}
                  expanded={expandedQuestions.has(question.id)}
                  previewMode={previewMode}
                  onToggleExpansion={() => toggleQuestionExpansion(question.id)}
                  onUpdate={(updates) => updateQuestion(question.id, updates)}
                  onDelete={() => deleteQuestion(question.id)}
                  onDuplicate={() => duplicateQuestion(question.id)}
                  onMove={(direction) => moveQuestion(question.id, direction)}
                  onAddOption={() => addOption(question.id)}
                  onRemoveOption={(index) => removeOption(question.id, index)}
                  onUpdateOption={(index, value) => updateOption(question.id, index, value)}
                  canMoveUp={index > 0}
                  canMoveDown={index < content.questions.length - 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Preview */}
      {previewMode && content.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Quiz Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {content.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <div 
                      className="mt-2"
                      dangerouslySetInnerHTML={{ __html: question.text }}
                    />
                  </div>
                  
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Circle className="h-4 w-4" />
                          <span>{option}</span>
                          {option === question.correctAnswer && (
                            <Badge variant="success">
                              Correct
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'text-box' && (
                    <div className="space-y-2">
                      <Textarea placeholder="Student would type their answer here..." disabled />
                      <div className="text-sm text-gray-600">
                        <strong>Expected answer:</strong> {question.correctAnswer}
                      </div>
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <strong className="text-sm text-blue-800">Explanation:</strong>
                      <div 
                        className="text-sm text-blue-700 mt-1"
                        dangerouslySetInnerHTML={{ __html: question.explanation }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Individual Question Editor Component
interface QuestionEditorProps {
  question: Question
  index: number
  expanded: boolean
  previewMode: boolean
  onToggleExpansion: () => void
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  onDuplicate: () => void
  onMove: (direction: 'up' | 'down') => void
  onAddOption: () => void
  onRemoveOption: (index: number) => void
  onUpdateOption: (index: number, value: string) => void
  canMoveUp: boolean
  canMoveDown: boolean
}

function QuestionEditor({
  question,
  index,
  expanded,
  previewMode,
  onToggleExpansion,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  canMoveUp,
  canMoveDown
}: QuestionEditorProps) {
  if (previewMode) return null

  return (
    <Collapsible open={expanded} onOpenChange={onToggleExpansion}>
      <div className="border rounded-lg">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <div>
                <h4 className="font-medium">Question {index + 1}</h4>
                <p className="text-sm text-gray-500 truncate">
                  {question.text || 'Untitled question'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                {question.type === 'multiple-choice' ? 'Multiple Choice' : 'Text Box'}
              </Badge>
              <div className="flex items-center gap-1">
                {canMoveUp && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMove('up')
                    }}
                  >
                    ↑
                  </Button>
                )}
                {canMoveDown && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMove('down')
                    }}
                  >
                    ↓
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="border-t p-4 space-y-4">
            {/* Question Text */}
            <div>
              <Label className="text-sm font-medium">Question Text</Label>
              <RichTextEditor
                content={question.text}
                onChange={(text) => onUpdate({ text })}
                placeholder="Enter your question..."
                className="mt-1"
              />
            </div>

            {/* Question Type */}
            <div>
              <Label className="text-sm font-medium">Question Type</Label>
              <Select
                value={question.type}
                onValueChange={(type: 'multiple-choice' | 'text-box') => {
                  if (type === 'text-box') {
                    onUpdate({ 
                      type, 
                      options: undefined,
                      correctAnswer: '' 
                    })
                  } else {
                    onUpdate({ 
                      type,
                      options: ['Option 1', 'Option 2'],
                      correctAnswer: 'Option 1'
                    })
                  }
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="text-box">Text Box</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Multiple Choice Options */}
            {question.type === 'multiple-choice' && question.options && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Answer Options</Label>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onAddOption}
                    disabled={question.options.length >= 8}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border-2 cursor-pointer transition-colors",
                          question.correctAnswer === option
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        )}
                        onClick={() => onUpdate({ correctAnswer: option })}
                      >
                        {question.correctAnswer === option && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <Input
                        value={option}
                        onChange={(e) => onUpdateOption(optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveOption(optionIndex)}
                        disabled={question.options!.length <= 2}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text Box Answer */}
            {question.type === 'text-box' && (
              <div>
                <Label className="text-sm font-medium">Expected Answer</Label>
                <Textarea
                  value={question.correctAnswer as string}
                  onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                  placeholder="Enter the expected answer or keywords..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be used for grading. You can enter exact text or keywords.
                </p>
              </div>
            )}

            {/* Explanation */}
            <div>
              <Label className="text-sm font-medium">Explanation (Optional)</Label>
              <RichTextEditor
                content={question.explanation || ''}
                onChange={(explanation) => onUpdate({ explanation })}
                placeholder="Explain why this is the correct answer..."
                className="mt-1"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="secondary" size="sm" onClick={onDuplicate}>
                Duplicate
              </Button>
              <Button variant="secondary" size="sm" onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}