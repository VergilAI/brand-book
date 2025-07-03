'use client'

import { useState, useCallback } from 'react'
import { 
  Save, 
  Eye, 
  Settings, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  GripVertical,
  Edit,
  Trash2,
  Copy,
  FileText,
  Video,
  Image,
  Paperclip,
  BookOpen,
  GamepadIcon,
  ClipboardList,
  MoreVertical,
  Upload,
  X,
  Check,
  CreditCard,
  Users,
  PlayCircle,
  Type,
  HelpCircle,
  Layers
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'
import { Textarea } from '@/components/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Alert, AlertDescription } from '@/components/alert'
import { cn } from '@/lib/utils'
import { MaterialLessonEditor } from './material-lesson-editor'
import { TestLessonEditor } from './test-lesson-editor'
import { FlashcardLessonEditor } from './flashcard-lesson-editor'
import { RPGLessonEditor } from './rpg-lesson-editor'

interface CourseBuilderProps {
  courseId?: string
}

interface CourseSection {
  id: string
  title: string
  description: string
  expanded: boolean
  lessons: CourseLesson[]
}

interface CourseLesson {
  id: string
  title: string
  type: 'material' | 'test' | 'flashcard' | 'rpg'
  content: string | LessonContent
  duration: number
  materials: CourseMaterial[]
}

interface LessonContent {
  // Material lesson content
  materialType?: 'video' | 'text'
  videoUrl?: string
  videoFile?: File | null
  videoSettings?: {
    autoPlay: boolean
    showControls: boolean
    loop: boolean
  }
  videoMetadata?: {
    duration?: number
    thumbnail?: string
    captions?: File | null
  }
  richTextContent?: string
  
  // Test/Quiz lesson content
  questions?: Question[]
  quizSettings?: {
    passingScore: number
    timeLimit?: number
    randomizeQuestions: boolean
    immediateResults: boolean
    retakePolicy: 'unlimited' | 'limited' | 'once'
    maxAttempts?: number
  }
  
  // Flashcard lesson content
  cards?: FlashCard[]
  deckSettings?: {
    randomOrder: boolean
    spacedRepetition: boolean
    autoAdvanceTime?: number
  }
  deckDescription?: string
  
  // RPG lesson content
  gameTitle?: string
  gameDescription?: string
  learningGoal?: string
  characters?: GameCharacter[]
  scenarios?: GameScenario[]
  knowledgePoints?: KnowledgePoint[]
}

interface Question {
  id: string
  text: string
  type: 'multiple-choice' | 'text-box'
  options?: string[] // For multiple-choice
  correctAnswer: string | string[] // Single answer or multiple for multi-select
  explanation?: string
}

interface FlashCard {
  id: string
  front: string
  back: string
  frontMedia?: {
    type: 'image' | 'audio'
    url: string
  }
  backMedia?: {
    type: 'image' | 'audio'
    url: string
  }
}

interface GameCharacter {
  id: string
  name: string
  role: string
  description: string
  avatar?: string
  personality: string[]
  dialogueOptions: string[]
}

interface GameScenario {
  id: string
  title: string
  description: string
  triggerConditions: string[]
  outcomes: {
    success: string
    failure: string
  }
}

interface KnowledgePoint {
  id: string
  title: string
  description: string
  associatedScenarios: string[]
  assessmentCriteria: string[]
}

interface CourseMaterial {
  id: string
  name: string
  type: 'video' | 'document' | 'image' | 'link'
  url: string
  size?: string
}

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: string
  learningObjectives: string[]
  sections: CourseSection[]
}

export function CourseBuilder({ courseId }: CourseBuilderProps) {
  const [course, setCourse] = useState<Course>({
    id: courseId || 'new',
    title: courseId ? 'AI Fundamentals' : 'New Course',
    description: courseId ? 'Learn the basics of artificial intelligence and machine learning' : '',
    instructor: 'Dr. Sarah Kim',
    category: 'Technology',
    difficulty: 'beginner',
    estimatedDuration: '8 hours',
    learningObjectives: courseId ? [
      'Understand core AI concepts',
      'Learn machine learning basics',
      'Apply AI to real-world problems'
    ] : [''],
    sections: courseId ? [
      {
        id: 'section-1',
        title: 'Introduction to AI',
        description: 'Basic concepts and overview',
        expanded: true,
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'What is AI?',
            type: 'material',
            content: {
              materialType: 'text',
              richTextContent: '<h2>Understanding Artificial Intelligence</h2><p>Artificial Intelligence represents...</p>'
            },
            duration: 15,
            materials: [
              { id: 'mat-1', name: 'AI Overview.pdf', type: 'document', url: '/materials/ai-overview.pdf', size: '2.4 MB' },
              { id: 'mat-2', name: 'Introduction Video', type: 'video', url: '/videos/ai-intro.mp4', size: '45 MB' }
            ]
          },
          {
            id: 'lesson-1-2',
            title: 'AI Knowledge Check',
            type: 'test',
            content: {
              questions: [
                {
                  id: 'q1',
                  text: 'What does AI stand for?',
                  type: 'multiple-choice',
                  options: ['Artificial Intelligence', 'Automated Intelligence', 'Advanced Intelligence', 'Augmented Intelligence'],
                  correctAnswer: 'Artificial Intelligence',
                  explanation: 'AI stands for Artificial Intelligence, which refers to machines that can perform tasks that typically require human intelligence.'
                }
              ],
              quizSettings: {
                passingScore: 70,
                randomizeQuestions: false,
                immediateResults: true,
                retakePolicy: 'unlimited'
              }
            },
            duration: 10,
            materials: []
          }
        ]
      }
    ] : []
  })
  
  const [selectedItem, setSelectedItem] = useState<{ type: 'course' | 'section' | 'lesson', id: string } | null>(
    { type: 'course', id: course.id }
  )
  const [showPreview, setShowPreview] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleSave = () => {
    // Save course data
    setIsDirty(false)
    console.log('Saving course:', course)
  }

  const handlePublish = () => {
    if (confirm('Are you sure you want to publish this course?')) {
      // Publish course
      console.log('Publishing course:', course)
    }
  }

  const addSection = () => {
    const newSection: CourseSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      expanded: true,
      lessons: []
    }
    setCourse(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
    setSelectedItem({ type: 'section', id: newSection.id })
    setIsDirty(true)
  }

  const addLesson = (sectionId: string) => {
    const newLesson: CourseLesson = {
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      type: 'material',
      content: {
        materialType: 'text',
        richTextContent: ''
      },
      duration: 0,
      materials: []
    }
    
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, lessons: [...section.lessons, newLesson] }
          : section
      )
    }))
    setSelectedItem({ type: 'lesson', id: newLesson.id })
    setIsDirty(true)
  }

  const deleteItem = (type: 'section' | 'lesson', id: string, sectionId?: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'section') {
        setCourse(prev => ({
          ...prev,
          sections: prev.sections.filter(section => section.id !== id)
        }))
      } else if (type === 'lesson' && sectionId) {
        setCourse(prev => ({
          ...prev,
          sections: prev.sections.map(section =>
            section.id === sectionId
              ? { ...section, lessons: section.lessons.filter(lesson => lesson.id !== id) }
              : section
          )
        }))
      }
      setSelectedItem({ type: 'course', id: course.id })
      setIsDirty(true)
    }
  }

  const toggleSection = (sectionId: string) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    }))
  }

  const getSelectedSection = () => {
    if (selectedItem?.type === 'section') {
      return course.sections.find(s => s.id === selectedItem.id)
    }
    return null
  }

  const getSelectedLesson = () => {
    if (selectedItem?.type === 'lesson') {
      for (const section of course.sections) {
        const lesson = section.lessons.find(l => l.id === selectedItem.id)
        if (lesson) return lesson
      }
    }
    return null
  }

  const updateCourse = (updates: Partial<Course>) => {
    setCourse(prev => ({ ...prev, ...updates }))
    setIsDirty(true)
  }

  const updateSection = (sectionId: string, updates: Partial<CourseSection>) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }))
    setIsDirty(true)
  }

  const updateLesson = (lessonId: string, updates: Partial<CourseLesson>) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, ...updates } : lesson
        )
      }))
    }))
    setIsDirty(true)
  }

  const getContentIcon = (type: CourseLesson['type']) => {
    switch (type) {
      case 'material':
        return <FileText className="h-4 w-4" />
      case 'test':
        return <ClipboardList className="h-4 w-4" />
      case 'flashcard':
        return <CreditCard className="h-4 w-4" />
      case 'rpg':
        return <Users className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getMaterialIcon = (type: CourseMaterial['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'image':
        return <Image className="h-4 w-4" />
      case 'link':
        return <Paperclip className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">{course.title}</h1>
              {isDirty && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  Unsaved Changes
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={!isDirty}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              <Button 
                className="bg-cosmic-purple hover:bg-cosmic-purple/90"
                onClick={handlePublish}
              >
                <Check className="h-4 w-4 mr-2" />
                Publish Course
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Course Structure */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Course Structure</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSection}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {/* Course Root */}
                  <button
                    onClick={() => setSelectedItem({ type: 'course', id: course.id })}
                    className={cn(
                      "flex items-center gap-2 w-full p-3 text-left hover:bg-gray-50 transition-colors",
                      selectedItem?.type === 'course' && "bg-cosmic-purple/10 text-cosmic-purple"
                    )}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Course Settings</span>
                  </button>

                  {/* Sections */}
                  {course.sections.map((section) => (
                    <div key={section.id}>
                      <div className="flex items-center group">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {section.expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => setSelectedItem({ type: 'section', id: section.id })}
                          className={cn(
                            "flex-1 flex items-center gap-2 p-2 text-left hover:bg-gray-50 transition-colors rounded",
                            selectedItem?.type === 'section' && selectedItem.id === section.id && "bg-cosmic-purple/10 text-cosmic-purple"
                          )}
                        >
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <BookOpen className="h-4 w-4" />
                          <span className="font-medium truncate">{section.title}</span>
                        </button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => addLesson(section.id)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Lesson
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteItem('section', section.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Lessons */}
                      {section.expanded && (
                        <div className="ml-8 space-y-1">
                          {section.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center group">
                              <button
                                onClick={() => setSelectedItem({ type: 'lesson', id: lesson.id })}
                                className={cn(
                                  "flex-1 flex items-center gap-2 p-2 text-left hover:bg-gray-50 transition-colors rounded text-sm",
                                  selectedItem?.type === 'lesson' && selectedItem.id === lesson.id && "bg-cosmic-purple/10 text-cosmic-purple"
                                )}
                              >
                                <GripVertical className="h-3 w-3 text-gray-400" />
                                {getContentIcon(lesson.type)}
                                <span className="truncate">{lesson.title}</span>
                                <Badge variant="outline" className="text-xs">
                                  {lesson.duration}m
                                </Badge>
                              </button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => deleteItem('lesson', lesson.id, section.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addLesson(section.id)}
                            className="w-full justify-start text-sm h-8"
                          >
                            <Plus className="h-3 w-3 mr-2" />
                            Add Lesson
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3">
            {selectedItem?.type === 'course' && (
              <CourseSettingsEditor course={course} onUpdate={updateCourse} />
            )}
            
            {selectedItem?.type === 'section' && getSelectedSection() && (
              <SectionEditor 
                section={getSelectedSection()!} 
                onUpdate={(updates) => updateSection(selectedItem.id, updates)} 
              />
            )}
            
            {selectedItem?.type === 'lesson' && getSelectedLesson() && (
              <LessonEditor 
                lesson={getSelectedLesson()!} 
                onUpdate={(updates) => updateLesson(selectedItem.id, updates)} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Course Settings Editor Component
function CourseSettingsEditor({ course, onUpdate }: { 
  course: Course
  onUpdate: (updates: Partial<Course>) => void 
}) {
  const addObjective = () => {
    onUpdate({
      learningObjectives: [...course.learningObjectives, '']
    })
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...course.learningObjectives]
    newObjectives[index] = value
    onUpdate({ learningObjectives: newObjectives })
  }

  const removeObjective = (index: number) => {
    onUpdate({
      learningObjectives: course.learningObjectives.filter((_, i) => i !== index)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Course Title</label>
            <Input
              value={course.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter course title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Instructor</label>
            <Input
              value={course.instructor}
              onChange={(e) => onUpdate({ instructor: e.target.value })}
              placeholder="Instructor name"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select value={course.category} onValueChange={(value) => onUpdate({ category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Difficulty</label>
            <Select value={course.difficulty} onValueChange={(value: any) => onUpdate({ difficulty: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={course.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Course description"
            rows={4}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Learning Objectives</label>
            <Button variant="outline" size="sm" onClick={addObjective}>
              <Plus className="h-4 w-4 mr-2" />
              Add Objective
            </Button>
          </div>
          <div className="space-y-2">
            {course.learningObjectives.map((objective, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  placeholder="Learning objective"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeObjective(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Section Editor Component
function SectionEditor({ section, onUpdate }: { 
  section: CourseSection
  onUpdate: (updates: Partial<CourseSection>) => void 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Section Title</label>
          <Input
            value={section.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Section title"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={section.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Section description"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Lesson Editor Component
function LessonEditor({ lesson, onUpdate }: { 
  lesson: CourseLesson
  onUpdate: (updates: Partial<CourseLesson>) => void 
}) {
  const getMaterialIcon = (type: CourseMaterial['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'image':
        return <Image className="h-4 w-4" />
      case 'link':
        return <Paperclip className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleTypeChange = (newType: CourseLesson['type']) => {
    // Initialize content based on lesson type
    let newContent: LessonContent
    
    switch (newType) {
      case 'material':
        newContent = {
          materialType: 'text',
          richTextContent: ''
        }
        break
      case 'test':
        newContent = {
          questions: [],
          quizSettings: {
            passingScore: 70,
            randomizeQuestions: false,
            immediateResults: true,
            retakePolicy: 'unlimited'
          }
        }
        break
      case 'flashcard':
        newContent = {
          cards: [],
          deckSettings: {
            randomOrder: false,
            spacedRepetition: false
          },
          deckDescription: ''
        }
        break
      case 'rpg':
        newContent = {
          gameTitle: '',
          gameDescription: '',
          learningGoal: '',
          characters: [],
          scenarios: [],
          knowledgePoints: []
        }
        break
      default:
        newContent = {}
    }

    onUpdate({ 
      type: newType, 
      content: newContent 
    })
  }

  const handleContentUpdate = (newContent: LessonContent) => {
    onUpdate({ content: newContent })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lesson Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Lesson Title</label>
              <Input
                value={lesson.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Lesson title"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={lesson.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">Material Lesson</SelectItem>
                  <SelectItem value="test">Test/Quiz</SelectItem>
                  <SelectItem value="flashcard">Flashcards</SelectItem>
                  <SelectItem value="rpg">Role Playing Game</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                type="number"
                value={lesson.duration}
                onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type-specific editors */}
      {lesson.type === 'material' && (
        <MaterialLessonEditor
          content={typeof lesson.content === 'object' ? lesson.content as any : { materialType: 'text', richTextContent: '' }}
          onChange={handleContentUpdate}
        />
      )}

      {lesson.type === 'test' && (
        <TestLessonEditor
          content={typeof lesson.content === 'object' ? lesson.content as any : { questions: [], quizSettings: { passingScore: 70, randomizeQuestions: false, immediateResults: true, retakePolicy: 'unlimited' } }}
          onChange={handleContentUpdate}
        />
      )}

      {lesson.type === 'flashcard' && (
        <FlashcardLessonEditor
          content={typeof lesson.content === 'object' ? lesson.content as any : { cards: [], deckSettings: { randomOrder: false, spacedRepetition: false }, deckDescription: '' }}
          onChange={handleContentUpdate}
        />
      )}

      {lesson.type === 'rpg' && (
        <RPGLessonEditor
          content={typeof lesson.content === 'object' ? lesson.content as any : { gameTitle: '', gameDescription: '', learningGoal: '', characters: [], scenarios: [], knowledgePoints: [] }}
          onChange={handleContentUpdate}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Associated Materials</CardTitle>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lesson.materials.length > 0 ? (
            <div className="space-y-2">
              {lesson.materials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getMaterialIcon(material.type)}
                    <div>
                      <div className="font-medium">{material.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {material.type} • {material.size}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p>No materials uploaded yet</p>
              <p className="text-sm">Drag and drop files here or click upload</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}