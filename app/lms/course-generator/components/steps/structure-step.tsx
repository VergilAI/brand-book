"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { Label } from "@/components/atomic/label"
import { Textarea } from "@/components/textarea"
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/modal"
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
  ChevronRight,
  Brain,
  Sparkles,
  FileText,
  Video,
  Users,
  CheckCircle,
  Copy,
  Trash2,
  GitBranch,
  Tag,
  Link,
  Download,
  Info,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  CourseGeneratorState, 
  CourseModule, 
  LearningObjective, 
  ModuleSection,
  ModuleType,
  ObjectivePriority,
  BloomLevel 
} from "../../types"

interface StructureStepProps {
  state: CourseGeneratorState
  onStateChange: React.Dispatch<React.SetStateAction<CourseGeneratorState>>
  onNext: () => void
  onBack: () => void
}

const CHAPTER_TYPES: { value: ModuleType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'theory', label: 'Theory', icon: <Brain className="w-4 h-4" />, color: 'text-text-info' },
  { value: 'practice', label: 'Practice', icon: <Target className="w-4 h-4" />, color: 'text-text-success' },
  { value: 'assessment', label: 'Assessment', icon: <CheckCircle className="w-4 h-4" />, color: 'text-text-error' },
  { value: 'mixed', label: 'Mixed', icon: <Sparkles className="w-4 h-4" />, color: 'text-text-brand' }
]

const BLOOM_LEVELS: { value: BloomLevel; label: string; description: string }[] = [
  { value: 'remember', label: 'Remember', description: 'Recall facts and basic concepts' },
  { value: 'understand', label: 'Understand', description: 'Explain ideas or concepts' },
  { value: 'apply', label: 'Apply', description: 'Use information in new situations' },
  { value: 'analyze', label: 'Analyze', description: 'Draw connections among ideas' },
  { value: 'evaluate', label: 'Evaluate', description: 'Justify a stand or decision' },
  { value: 'create', label: 'Create', description: 'Produce new or original work' }
]

const SECTION_TYPES = [
  { value: 'reading', label: 'Reading', icon: <FileText className="w-4 h-4" /> },
  { value: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
  { value: 'interactive', label: 'Interactive', icon: <Users className="w-4 h-4" /> },
  { value: 'assessment', label: 'Assessment', icon: <CheckCircle className="w-4 h-4" /> }
]

// Sortable Chapter Component
function SortableChapter({ 
  module, 
  index, 
  onEdit, 
  modules,
  onDuplicate,
  onDelete 
}: { 
  module: CourseModule
  index: number
  onEdit: () => void
  modules: CourseModule[]
  onDuplicate: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const chapterType = CHAPTER_TYPES.find(t => t.value === module.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-all duration-normal",
        isDragging && "opacity-50"
      )}
    >
      <Card className="p-spacing-md">
        <div className="flex items-start gap-spacing-md">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing mt-spacing-xs"
          >
            <GripVertical className="w-5 h-5 text-text-tertiary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-spacing-sm">
              <div className="flex items-center gap-spacing-sm">
                <h4 className="font-medium text-text-primary">
                  Chapter {index + 1}: {module.title}
                </h4>
                {chapterType && (
                  <Badge variant="secondary" className="flex items-center gap-spacing-xs">
                    <span className={chapterType.color}>{chapterType.icon}</span>
                    {chapterType.label}
                  </Badge>
                )}
                <Badge variant="secondary" size="sm">
                  {module.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-spacing-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDuplicate}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-text-error hover:bg-bg-error-light"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="h-8 w-8 p-0"
                  title="Edit Chapter"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-text-secondary">{module.description}</p>
            
            {module.prerequisites.length > 0 && (
              <div className="flex items-center gap-spacing-xs mt-spacing-sm">
                <GitBranch className="w-4 h-4 text-text-brand" />
                <span className="text-sm text-text-secondary">Prerequisites: </span>
                {module.prerequisites.map(prereqId => {
                  const prereq = modules.find(m => m.id === prereqId)
                  return prereq ? (
                    <Badge key={prereqId} variant="secondary" size="sm">
                      {prereq.title}
                    </Badge>
                  ) : null
                })}
              </div>
            )}
            
            <div className="flex items-center gap-spacing-md mt-spacing-sm text-sm text-text-secondary">
              <div className="flex items-center gap-spacing-xs">
                <Target className="w-4 h-4" />
                {module.learningObjectives.length} objectives
              </div>
              <div className="flex items-center gap-spacing-xs">
                <FileText className="w-4 h-4" />
                {module.sections.length} sections
              </div>
              <div className="flex items-center gap-spacing-xs">
                <Clock className="w-4 h-4" />
                {module.estimatedDuration} min
              </div>
              {module.tags.length > 0 && (
                <div className="flex items-center gap-spacing-xs">
                  <Tag className="w-4 h-4" />
                  {module.tags.length} tags
                </div>
              )}
            </div>
            
          </div>
        </div>
      </Card>
    </div>
  )
}

// Chapter Editor Modal
function ChapterEditor({ 
  module, 
  modules,
  onSave, 
  onCancel,
  open
}: { 
  module: CourseModule
  modules: CourseModule[]
  onSave: (module: CourseModule) => void
  onCancel: () => void
  open: boolean
}) {
  const [editedModule, setEditedModule] = useState<CourseModule>(module)
  const [activeTab, setActiveTab] = useState<'general' | 'objectives' | 'sections' | 'resources'>('general')

  const handleAddObjective = () => {
    const newObjective: LearningObjective = {
      id: `obj-${Date.now()}`,
      text: '',
      bloomLevel: 'understand',
      priority: 'required'
    }
    setEditedModule(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, newObjective]
    }))
  }

  const handleAddSection = () => {
    const newLesson: ModuleSection = {
      id: `sec-${Date.now()}`,
      title: 'New Lesson',
      content: '',
      duration: 10,
      type: 'reading'
    }
    setEditedModule(prev => ({
      ...prev,
      sections: [...prev.sections, newLesson]
    }))
  }

  return (
    <Modal
      open={open}
      onOpenChange={onCancel}
      size="xl"
      title="Edit Module"
      footer={
        <div className="flex justify-end gap-spacing-sm">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(editedModule)}>
            <Save className="w-4 h-4 mr-spacing-sm" />
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="space-y-spacing-md">
        <div className="flex gap-spacing-sm">
          {(['general', 'objectives', 'sections', 'resources'] as const).map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
          {activeTab === 'general' && (
            <div className="space-y-spacing-md">
              <div>
                <Label>Chapter Title</Label>
                <Input
                  value={editedModule.title}
                  onChange={e => setEditedModule(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter module title"
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editedModule.description}
                  onChange={e => setEditedModule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this module covers"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-spacing-md">
                <div>
                  <Label>Chapter Type</Label>
                  <div className="grid grid-cols-2 gap-spacing-sm mt-spacing-sm">
                    {CHAPTER_TYPES.map(type => (
                      <Button
                        key={type.value}
                        variant={editedModule.type === type.value ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setEditedModule(prev => ({ ...prev, type: type.value }))}
                        className="justify-start"
                      >
                        <span className={cn("mr-spacing-xs", type.color)}>{type.icon}</span>
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Difficulty</Label>
                  <div className="grid grid-cols-3 gap-spacing-sm mt-spacing-sm">
                    {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                      <Button
                        key={level}
                        variant={editedModule.difficulty === level ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setEditedModule(prev => ({ ...prev, difficulty: level }))}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Prerequisites</Label>
                <p className="text-sm text-text-secondary mb-spacing-sm">
                  Select modules that must be completed before this one
                </p>
                <div className="space-y-spacing-xs">
                  {modules.filter(m => m.id !== module.id).map(m => (
                    <label key={m.id} className="flex items-center gap-spacing-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedModule.prerequisites.includes(m.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setEditedModule(prev => ({
                              ...prev,
                              prerequisites: [...prev.prerequisites, m.id]
                            }))
                          } else {
                            setEditedModule(prev => ({
                              ...prev,
                              prerequisites: prev.prerequisites.filter(id => id !== m.id)
                            }))
                          }
                        }}
                        className="w-4 h-4 text-text-brand rounded border-border-default"
                      />
                      <span className="text-sm text-text-primary">{m.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Tags</Label>
                <Input
                  value={editedModule.tags.join(', ')}
                  onChange={e => setEditedModule(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  }))}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'objectives' && (
            <div className="space-y-spacing-md">
              <div className="flex items-center justify-between mb-spacing-md">
                <div>
                  <h3 className="font-medium text-text-primary">Learning Objectives</h3>
                  <p className="text-sm text-text-secondary">
                    Define what learners will achieve by completing this module
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={handleAddObjective}>
                  <Plus className="w-4 h-4 mr-spacing-xs" />
                  Add Objective
                </Button>
              </div>
              
              {editedModule.learningObjectives.map((objective, index) => (
                <Card key={objective.id} className="p-spacing-md">
                  <div className="space-y-spacing-sm">
                    <div className="flex items-start gap-spacing-sm">
                      <div className="flex-1">
                        <Input
                          value={objective.text}
                          onChange={e => {
                            const updated = [...editedModule.learningObjectives]
                            updated[index] = { ...objective, text: e.target.value }
                            setEditedModule(prev => ({ ...prev, learningObjectives: updated }))
                          }}
                          placeholder="Enter learning objective"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditedModule(prev => ({
                            ...prev,
                            learningObjectives: prev.learningObjectives.filter(o => o.id !== objective.id)
                          }))
                        }}
                        className="h-8 w-8 p-0 text-text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-spacing-sm">
                      <div>
                        <Label className="text-xs mb-spacing-xs">Bloom's Level</Label>
                        <select
                          value={objective.bloomLevel}
                          onChange={e => {
                            const updated = [...editedModule.learningObjectives]
                            updated[index] = { ...objective, bloomLevel: e.target.value as BloomLevel }
                            setEditedModule(prev => ({ ...prev, learningObjectives: updated }))
                          }}
                          className="w-full text-sm px-spacing-sm py-spacing-xs rounded-md border border-border-default"
                        >
                          {BLOOM_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label} - {level.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <Label className="text-xs mb-spacing-xs">Priority</Label>
                        <select
                          value={objective.priority}
                          onChange={e => {
                            const updated = [...editedModule.learningObjectives]
                            updated[index] = { ...objective, priority: e.target.value as ObjectivePriority }
                            setEditedModule(prev => ({ ...prev, learningObjectives: updated }))
                          }}
                          className="w-full text-sm px-spacing-sm py-spacing-xs rounded-md border border-border-default"
                        >
                          <option value="required">Required</option>
                          <option value="recommended">Recommended</option>
                          <option value="optional">Optional</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {activeTab === 'sections' && (
            <div className="space-y-spacing-md">
              <div className="flex items-center justify-between mb-spacing-md">
                <div>
                  <h3 className="font-medium text-text-primary">Chapter Lessons</h3>
                  <p className="text-sm text-text-secondary">
                    Break down the module into smaller learning sections
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={handleAddSection}>
                  <Plus className="w-4 h-4 mr-spacing-xs" />
                  Add Lesson
                </Button>
              </div>
              
              {editedModule.sections.map((section, index) => (
                <Card key={section.id} className="p-spacing-md">
                  <div className="space-y-spacing-sm">
                    <div className="flex items-center gap-spacing-sm">
                      <Input
                        value={section.title}
                        onChange={e => {
                          const updated = [...editedModule.sections]
                          updated[index] = { ...section, title: e.target.value }
                          setEditedModule(prev => ({ ...prev, sections: updated }))
                        }}
                        placeholder="Lesson title"
                        className="flex-1"
                      />
                      {SECTION_TYPES.map(type => (
                        <Button
                          key={type.value}
                          variant={section.type === type.value ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => {
                            const updated = [...editedModule.sections]
                            updated[index] = { ...section, type: type.value as any }
                            setEditedModule(prev => ({ ...prev, sections: updated }))
                          }}
                          className="h-9 w-9 p-0"
                          title={type.label}
                        >
                          {type.icon}
                        </Button>
                      ))}
                      <div className="flex items-center gap-spacing-xs">
                        <Clock className="w-4 h-4 text-text-secondary" />
                        <Input
                          type="number"
                          value={section.duration}
                          onChange={e => {
                            const updated = [...editedModule.sections]
                            updated[index] = { ...section, duration: parseInt(e.target.value) || 0 }
                            setEditedModule(prev => ({ ...prev, sections: updated }))
                          }}
                          className="w-16 text-sm"
                          min="1"
                        />
                        <span className="text-sm text-text-secondary">min</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditedModule(prev => ({
                            ...prev,
                            sections: prev.sections.filter(s => s.id !== section.id)
                          }))
                        }}
                        className="h-8 w-8 p-0 text-text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {activeTab === 'resources' && (
            <div className="space-y-spacing-md">
              <div>
                <Label>External Links</Label>
                <p className="text-sm text-text-secondary mb-spacing-sm">
                  Add helpful external resources
                </p>
                <Textarea
                  value={editedModule.resources.externalLinks.join('\n')}
                  onChange={e => setEditedModule(prev => ({
                    ...prev,
                    resources: {
                      ...prev.resources,
                      externalLinks: e.target.value.split('\n').filter(Boolean)
                    }
                  }))}
                  placeholder="Enter one URL per line"
                  rows={4}
                />
              </div>
              
              <div>
                <Label>Supplementary Materials</Label>
                <p className="text-sm text-text-secondary mb-spacing-sm">
                  List additional reading or reference materials
                </p>
                <Textarea
                  value={editedModule.resources.supplementary.join('\n')}
                  onChange={e => setEditedModule(prev => ({
                    ...prev,
                    resources: {
                      ...prev.resources,
                      supplementary: e.target.value.split('\n').filter(Boolean)
                    }
                  }))}
                  placeholder="Enter one resource per line"
                  rows={4}
                />
              </div>
            </div>
          )}
      </div>
    </Modal>
  )
}

export function StructureStep({ state, onStateChange, onNext, onBack }: StructureStepProps) {
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null)
  const [courseTitle, setCourseTitle] = useState(
    state.extractedContent?.structured.title || "Untitled Course"
  )
  const [courseDescription, setCourseDescription] = useState(
    "A comprehensive introduction to artificial intelligence fundamentals, covering core concepts, machine learning basics, and neural networks for beginners and intermediate learners."
  )
  const [showChapterTemplates, setShowChapterTemplates] = useState(false)

  // Convert chapters to modules if not already done
  const [modules, setModules] = useState<CourseModule[]>(() => {
    if (state.generatedCourse?.modules.length) {
      return state.generatedCourse.modules
    }
    
    // Return AI Fundamentals course structure with 3 chapters
    return [
      {
        id: 'module-0',
        title: 'Introduction to Artificial Intelligence',
        description: 'Explore the foundations of AI, its history, and current applications across industries.',
        type: 'theory' as ModuleType,
        learningObjectives: [
          {
            id: 'obj-0-0',
            text: 'Define artificial intelligence and understand its core principles',
            bloomLevel: 'understand' as BloomLevel,
            priority: 'required' as ObjectivePriority
          },
          {
            id: 'obj-0-1', 
            text: 'Trace the historical development of AI technology',
            bloomLevel: 'remember' as BloomLevel,
            priority: 'required' as ObjectivePriority
          },
          {
            id: 'obj-0-2',
            text: 'Identify real-world AI applications across different industries',
            bloomLevel: 'apply' as BloomLevel,
            priority: 'required' as ObjectivePriority
          }
        ],
        prerequisites: [],
        sections: [
          {
            id: 'sec-0-0',
            title: 'What is Artificial Intelligence?',
            content: 'Introduction to AI concepts and definitions',
            duration: 20,
            type: 'reading'
          },
          {
            id: 'sec-0-1',
            title: 'History and Evolution of AI',
            content: 'Timeline of AI development from early concepts to modern breakthroughs',
            duration: 25,
            type: 'video'
          },
          {
            id: 'sec-0-2',
            title: 'AI Applications in Practice',
            content: 'Real-world examples of AI implementation across industries',
            duration: 30,
            type: 'interactive'
          }
        ],
        content: {
          material: 'Comprehensive introduction to AI concepts, history, and applications in modern technology.',
          summary: 'This chapter provides a foundational understanding of artificial intelligence.',
          keyPoints: [
            'Define artificial intelligence and its core components',
            'Understand the history and evolution of AI technology',
            'Identify real-world AI applications across industries'
          ],
          glossaryTerms: []
        },
        activities: {},
        estimatedDuration: 75,
        difficulty: state.personalizationSettings?.difficulty || 'intermediate',
        order: 0,
        tags: ['AI', 'Introduction', 'History', 'Applications'],
        resources: {
          supplementary: [],
          externalLinks: [],
          downloadables: []
        }
      },
      {
        id: 'module-1',
        title: 'Machine Learning Fundamentals',
        description: 'Understand the core concepts of machine learning including supervised, unsupervised, and reinforcement learning.',
        type: 'mixed' as ModuleType,
        learningObjectives: [
          {
            id: 'obj-1-0',
            text: 'Distinguish between different types of machine learning approaches',
            bloomLevel: 'analyze' as BloomLevel,
            priority: 'required' as ObjectivePriority
          },
          {
            id: 'obj-1-1',
            text: 'Understand common ML algorithms and their applications',
            bloomLevel: 'understand' as BloomLevel,
            priority: 'required' as ObjectivePriority
          },
          {
            id: 'obj-1-2',
            text: 'Recognize when to apply specific ML techniques to problems',
            bloomLevel: 'evaluate' as BloomLevel,
            priority: 'recommended' as ObjectivePriority
          }
        ],
        prerequisites: ['module-0'],
        sections: [
          {
            id: 'sec-1-0',
            title: 'Types of Machine Learning',
            content: 'Overview of supervised, unsupervised, and reinforcement learning',
            duration: 25,
            type: 'reading'
          },
          {
            id: 'sec-1-1',
            title: 'Common ML Algorithms',
            content: 'Introduction to popular machine learning algorithms and their use cases',
            duration: 35,
            type: 'video'
          },
          {
            id: 'sec-1-2',
            title: 'Hands-on ML Practice',
            content: 'Interactive exercises to apply ML concepts',
            duration: 40,
            type: 'interactive'
          }
        ],
        content: {
          material: 'Core concepts of machine learning, including supervised, unsupervised, and reinforcement learning approaches.',
          summary: 'This chapter covers the fundamental concepts and techniques in machine learning.',
          keyPoints: [
            'Distinguish between different types of machine learning',
            'Understand algorithms and their applications',
            'Recognize when to apply specific ML techniques'
          ],
          glossaryTerms: []
        },
        activities: {},
        estimatedDuration: 100,
        difficulty: state.personalizationSettings?.difficulty || 'intermediate',
        order: 1,
        tags: ['Machine Learning', 'Algorithms', 'Supervised Learning', 'Unsupervised Learning'],
        resources: {
          supplementary: [],
          externalLinks: [],
          downloadables: []
        }
      },
      {
        id: 'module-2',
        title: 'Neural Networks and Deep Learning',
        description: 'Deep dive into neural network architectures, deep learning principles, and practical implementations.',
        type: 'practice' as ModuleType,
        learningObjectives: [
          {
            id: 'obj-2-0',
            text: 'Understand neural network structure and components',
            bloomLevel: 'understand' as BloomLevel,
            priority: 'required' as ObjectivePriority
          },
          {
            id: 'obj-2-1',
            text: 'Learn about different deep learning architectures',
            bloomLevel: 'understand' as BloomLevel,
            priority: 'required' as ObjectivePriority
          },
          {
            id: 'obj-2-2',
            text: 'Apply neural networks to solve complex problems',
            bloomLevel: 'apply' as BloomLevel,
            priority: 'recommended' as ObjectivePriority
          }
        ],
        prerequisites: ['module-1'],
        sections: [
          {
            id: 'sec-2-0',
            title: 'Neural Network Basics',
            content: 'Understanding neurons, layers, and network architecture',
            duration: 30,
            type: 'reading'
          },
          {
            id: 'sec-2-1',
            title: 'Deep Learning Architectures',
            content: 'Exploring CNNs, RNNs, and transformer models',
            duration: 40,
            type: 'video'
          },
          {
            id: 'sec-2-2',
            title: 'Building Neural Networks',
            content: 'Practical implementation of neural network models',
            duration: 50,
            type: 'interactive'
          }
        ],
        content: {
          material: 'Deep dive into neural network architectures, deep learning principles, and practical implementations.',
          summary: 'This chapter provides comprehensive coverage of neural networks and deep learning techniques.',
          keyPoints: [
            'Understand neural network structure and components',
            'Learn about deep learning architectures', 
            'Apply neural networks to solve complex problems'
          ],
          glossaryTerms: []
        },
        activities: {},
        estimatedDuration: 120,
        difficulty: state.personalizationSettings?.difficulty || 'intermediate',
        order: 2,
        tags: ['Neural Networks', 'Deep Learning', 'CNN', 'RNN', 'AI Implementation'],
        resources: {
          supplementary: [],
          externalLinks: [],
          downloadables: []
        }
      }
    ]
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setModules(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Update order property
        return newItems.map((item, index) => ({ ...item, order: index }))
      })
    }
  }


  const handleDuplicateChapter = (module: CourseModule) => {
    const newModule: CourseModule = {
      ...module,
      id: `module-${Date.now()}`,
      title: `${module.title} (Copy)`,
      order: modules.length
    }
    setModules(prev => [...prev, newModule])
  }

  const handleDeleteChapter = (chapterId: string) => {
    setModules(prev => prev.filter(m => m.id !== chapterId).map((m, i) => ({ ...m, order: i })))
  }

  const handleSaveChapter = (updatedChapter: CourseModule) => {
    setModules(prev => prev.map(m => m.id === updatedChapter.id ? updatedChapter : m))
    setEditingChapterId(null)
  }


  const handleAddChapter = (template?: Partial<CourseModule>) => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: template?.title || 'New Chapter',
      description: template?.description || 'Chapter description',
      type: template?.type || 'mixed',
      learningObjectives: template?.learningObjectives || [],
      prerequisites: [],
      sections: template?.sections || [],
      content: {
        material: '',
        summary: '',
        keyPoints: [],
        glossaryTerms: []
      },
      activities: {},
      estimatedDuration: 30,
      difficulty: state.personalizationSettings?.difficulty || 'intermediate',
      order: modules.length,
      tags: template?.tags || [],
      resources: {
        supplementary: [],
        externalLinks: [],
        downloadables: []
      }
    }
    setModules(prev => [...prev, newModule])
    setShowChapterTemplates(false)
  }

  const handleNext = () => {
    // Update estimated duration based on sections
    const updatedModules = modules.map(module => ({
      ...module,
      estimatedDuration: module.sections.reduce((sum, sec) => sum + sec.duration, 0)
    }))

    onStateChange(prev => ({
      ...prev,
      generatedCourse: {
        id: `course-${Date.now()}`,
        title: courseTitle,
        description: courseDescription,
        sourceFiles: prev.uploadedFiles,
        modules: updatedModules,
        metadata: {
          totalDuration: updatedModules.reduce((acc, m) => acc + m.estimatedDuration, 0),
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
  const totalSections = modules.reduce((acc, m) => acc + m.sections.length, 0)

  return (
    <div className="space-y-spacing-lg">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
          Course Structure
        </h2>
        <p className="text-text-secondary">
          Organize your course chapters, define learning paths, and set up assessments.
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

      {/* Course Overview */}
      <Card className="p-spacing-lg">
        <div className="space-y-spacing-md">
          <div>
            <Label>Course Title</Label>
            <Input
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="text-lg font-semibold"
              placeholder="Enter course title"
            />
          </div>
          
          <div>
            <Label>Course Description</Label>
            <Textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              placeholder="Enter course description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-spacing-md pt-spacing-sm">
            <div className="text-center p-spacing-md rounded-lg bg-bg-secondary">
              <BookOpen className="w-8 h-8 text-text-brand mx-auto mb-spacing-sm" />
              <p className="text-2xl font-bold text-text-primary">{modules.length}</p>
              <p className="text-sm text-text-secondary">Chapters</p>
            </div>
            
            <div className="text-center p-spacing-md rounded-lg bg-bg-secondary">
              <Target className="w-8 h-8 text-text-brand mx-auto mb-spacing-sm" />
              <p className="text-2xl font-bold text-text-primary">{totalObjectives}</p>
              <p className="text-sm text-text-secondary">Objectives</p>
            </div>
            
            <div className="text-center p-spacing-md rounded-lg bg-bg-secondary">
              <FileText className="w-8 h-8 text-text-brand mx-auto mb-spacing-sm" />
              <p className="text-2xl font-bold text-text-primary">{totalSections}</p>
              <p className="text-sm text-text-secondary">Lessons</p>
            </div>
            
            <div className="text-center p-spacing-md rounded-lg bg-bg-secondary">
              <Clock className="w-8 h-8 text-text-brand mx-auto mb-spacing-sm" />
              <p className="text-2xl font-bold text-text-primary">{totalDuration}</p>
              <p className="text-sm text-text-secondary">Minutes</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Chapters Section */}
      <div className="space-y-spacing-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-text-primary">Course Chapters</h3>
          <div className="flex gap-spacing-sm">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowChapterTemplates(true)}
            >
              <Sparkles className="w-4 h-4 mr-spacing-xs" />
              Use Template
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAddChapter()}
            >
              <Plus className="w-4 h-4 mr-spacing-xs" />
              Add Chapter
            </Button>
          </div>
        </div>
        
        {modules.length === 0 ? (
          <Card className="p-spacing-xl text-center">
            <BookOpen className="w-12 h-12 text-text-tertiary mx-auto mb-spacing-md" />
            <p className="text-text-secondary mb-spacing-md">
              No chapters yet. Add your first chapter to get started.
            </p>
            <Button variant="primary" onClick={() => handleAddChapter()}>
              <Plus className="w-4 h-4 mr-spacing-sm" />
              Add First Chapter
            </Button>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={modules.map(m => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-spacing-sm">
                {modules.map((module, index) => (
                  <SortableChapter
                    key={module.id}
                    module={module}
                    index={index}
                    onEdit={() => setEditingChapterId(module.id)}
                    modules={modules}
                    onDuplicate={() => handleDuplicateChapter(module)}
                    onDelete={() => handleDeleteChapter(module.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* AI Suggestions */}
      <Card className="p-spacing-lg bg-bg-brand/5 border-border-brand/20">
        <div className="flex items-start gap-spacing-md">
          <Sparkles className="w-5 h-5 text-text-brand mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-text-primary mb-spacing-xs">
              AI Suggestions
            </h4>
            <div className="space-y-spacing-sm text-sm">
              {modules.length === 0 && (
                <p className="text-text-secondary">
                  <AlertCircle className="w-4 h-4 inline mr-spacing-xs text-text-warning" />
                  Start by adding modules based on your extracted content
                </p>
              )}
              {modules.some(m => m.learningObjectives.length === 0) && (
                <p className="text-text-secondary">
                  <AlertCircle className="w-4 h-4 inline mr-spacing-xs text-text-warning" />
                  Some modules are missing learning objectives
                </p>
              )}
              {modules.some(m => m.estimatedDuration > 60) && (
                <p className="text-text-secondary">
                  <Info className="w-4 h-4 inline mr-spacing-xs text-text-info" />
                  Consider breaking modules longer than 60 minutes into smaller sections
                </p>
              )}
              {totalDuration > 300 && (
                <p className="text-text-secondary">
                  <Info className="w-4 h-4 inline mr-spacing-xs text-text-info" />
                  Your course is over 5 hours. Consider creating a multi-part series
                </p>
              )}
            </div>
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
          disabled={modules.length === 0}
        >
          Generate Activities
          <ArrowRight className="w-5 h-5 ml-spacing-sm" />
        </Button>
      </div>

      {/* Chapter Editor Modal */}
      {editingChapterId && (
        <ChapterEditor
          module={modules.find(m => m.id === editingChapterId)!}
          modules={modules}
          onSave={handleSaveChapter}
          onCancel={() => setEditingChapterId(null)}
          open={!!editingChapterId}
        />
      )}

      {/* Chapter Templates Modal */}
      <Modal
        open={showChapterTemplates}
        onOpenChange={setShowChapterTemplates}
        size="lg"
        title="Chapter Templates"
      >
        <div className="space-y-spacing-md">
          {[
            {
              title: 'AI Introduction Chapter',
                  description: 'Foundation concepts and history of artificial intelligence',
                  type: 'theory' as ModuleType,
                  sections: [
                    { id: 'ai-intro-1', title: 'What is AI?', content: '', duration: 20, type: 'reading' as const },
                    { id: 'ai-intro-2', title: 'AI History Timeline', content: '', duration: 25, type: 'video' as const },
                    { id: 'ai-intro-3', title: 'AI Applications Today', content: '', duration: 30, type: 'interactive' as const }
                  ],
                  tags: ['AI', 'Introduction', 'History']
                },
                {
                  title: 'Machine Learning Chapter',
                  description: 'Core ML concepts including supervised and unsupervised learning',
                  type: 'mixed' as ModuleType,
                  sections: [
                    { id: 'ml-1', title: 'Types of Machine Learning', content: '', duration: 25, type: 'reading' as const },
                    { id: 'ml-2', title: 'ML Algorithms Overview', content: '', duration: 35, type: 'video' as const },
                    { id: 'ml-3', title: 'ML Practice Lab', content: '', duration: 40, type: 'interactive' as const }
                  ],
                  tags: ['Machine Learning', 'Algorithms', 'Supervised Learning']
                },
                {
                  title: 'Neural Networks Chapter',
                  description: 'Deep learning, neural networks, and practical implementations',
                  type: 'practice' as ModuleType,
                  sections: [
                    { id: 'nn-1', title: 'Neural Network Basics', content: '', duration: 30, type: 'reading' as const },
                    { id: 'nn-2', title: 'Deep Learning Architectures', content: '', duration: 40, type: 'video' as const },
                    { id: 'nn-3', title: 'Build Your First Network', content: '', duration: 50, type: 'interactive' as const }
                  ],
                  tags: ['Neural Networks', 'Deep Learning', 'Implementation']
                },
                {
                  title: 'AI Ethics & Future',
                  description: 'Ethical considerations and future directions of AI',
                  type: 'theory' as ModuleType,
                  sections: [
                    { id: 'ethics-1', title: 'AI Ethics Principles', content: '', duration: 20, type: 'reading' as const },
                    { id: 'ethics-2', title: 'Bias and Fairness', content: '', duration: 25, type: 'video' as const },
                    { id: 'ethics-3', title: 'Future of AI', content: '', duration: 20, type: 'interactive' as const }
                  ],
                  tags: ['AI Ethics', 'Future', 'Responsibility']
                }
          ].map(template => (
                <Card 
                  key={template.title}
                  className="p-spacing-md cursor-pointer hover:shadow-card-hover transition-all"
                  onClick={() => handleAddChapter(template)}
                >
                  <div className="flex items-start gap-spacing-md">
                    <div className="w-10 h-10 rounded-lg bg-bg-emphasis flex items-center justify-center">
                      {CHAPTER_TYPES.find(t => t.value === template.type)?.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary">{template.title}</h4>
                      <p className="text-sm text-text-secondary">{template.description}</p>
                      <div className="flex items-center gap-spacing-sm mt-spacing-sm">
                        <Badge variant="secondary" size="sm">
                          {template.sections.length} sections
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          {template.sections.reduce((sum, s) => sum + s.duration, 0)} min
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
          ))}
        </div>
      </Modal>
    </div>
  )
}