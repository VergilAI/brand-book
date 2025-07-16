'use client'

import { useState, useEffect } from 'react'
import { X, BookOpen, CheckCircle, Clock, Brain } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import { cn } from '@/lib/utils'

interface WrittenMaterialProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

const writtenContent = {
  title: "AI Fundamentals: Core Concepts",
  estimatedTime: "15 min read",
  sections: [
    {
      id: 'introduction',
      title: 'What is Artificial Intelligence?',
      content: `
        <p class="mb-4">Artificial Intelligence (AI) is a branch of computer science that aims to create machines capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.</p>
        
        <p class="mb-4">AI systems are designed to process information, recognize patterns, make decisions, and adapt to new situations. The goal is to create machines that can think, learn, and act in ways that would be considered intelligent if performed by humans.</p>
        
        <p class="mb-4">Modern AI applications are everywhere around us - from voice assistants like Siri and Alexa to recommendation systems on Netflix and Amazon, from autonomous vehicles to medical diagnosis systems.</p>
      `
    },
    {
      id: 'types',
      title: 'Types of AI',
      content: `
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Narrow AI (Weak AI)</h3>
        <p class="mb-4">This is AI designed to perform specific tasks. Examples include image recognition, chess playing, or language translation. Most current AI systems are narrow AI.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">General AI (Strong AI)</h3>
        <p class="mb-4">This refers to AI that can understand, learn, and apply knowledge across a wide range of tasks at a level equal to or beyond human capability. This doesn't exist yet.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Superintelligence</h3>
        <p class="mb-4">This is a hypothetical AI that surpasses human intelligence in all aspects. It remains a theoretical concept and subject of much debate among researchers.</p>
      `
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning Basics',
      content: `
        <p class="mb-4">Machine Learning (ML) is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. Instead of following pre-programmed instructions, ML systems learn patterns from data.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Types of Machine Learning:</h3>
        
        <h4 class="font-semibold mb-2 text-text-primary">Supervised Learning</h4>
        <p class="mb-3">Uses labeled training data to learn a mapping from inputs to outputs. Examples: email spam detection, image classification.</p>
        
        <h4 class="font-semibold mb-2 text-text-primary">Unsupervised Learning</h4>
        <p class="mb-3">Finds patterns in data without labeled examples. Examples: clustering customers, anomaly detection.</p>
        
        <h4 class="font-semibold mb-2 text-text-primary">Reinforcement Learning</h4>
        <p class="mb-4">Learns through interaction with an environment, receiving rewards or penalties. Examples: game playing, robotics.</p>
      `
    },
    {
      id: 'neural-networks',
      title: 'Neural Networks and Deep Learning',
      content: `
        <p class="mb-4">Neural networks are computing systems inspired by biological neural networks in animal brains. They consist of interconnected nodes (neurons) that process information.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">How Neural Networks Work:</h3>
        <p class="mb-4">1. <strong>Input Layer:</strong> Receives data (images, text, numbers)</p>
        <p class="mb-4">2. <strong>Hidden Layers:</strong> Process the data through weighted connections</p>
        <p class="mb-4">3. <strong>Output Layer:</strong> Produces the final result or prediction</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Deep Learning</h3>
        <p class="mb-4">Deep learning uses neural networks with multiple hidden layers (hence "deep") to model complex patterns. It's behind many AI breakthroughs in image recognition, natural language processing, and game playing.</p>
      `
    },
    {
      id: 'applications',
      title: 'AI Applications Today',
      content: `
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Computer Vision</h3>
        <p class="mb-4">Enables machines to interpret and understand visual information. Applications include facial recognition, medical imaging, and autonomous vehicles.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Natural Language Processing (NLP)</h3>
        <p class="mb-4">Helps computers understand and generate human language. Powers chatbots, translation services, and text analysis tools.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Recommendation Systems</h3>
        <p class="mb-4">Analyze user behavior to suggest products, movies, or content. Used by Netflix, Amazon, and social media platforms.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Healthcare AI</h3>
        <p class="mb-4">Assists in diagnosis, drug discovery, and treatment planning. AI can analyze medical images and predict patient outcomes.</p>
      `
    },
    {
      id: 'ethics',
      title: 'AI Ethics and Considerations',
      content: `
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Bias and Fairness</h3>
        <p class="mb-4">AI systems can perpetuate or amplify human biases present in training data. Ensuring fairness across different groups is crucial.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Privacy and Security</h3>
        <p class="mb-4">AI systems often require large amounts of personal data. Protecting privacy while enabling AI capabilities is an ongoing challenge.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Transparency and Explainability</h3>
        <p class="mb-4">Many AI systems are "black boxes" - it's unclear how they make decisions. Developing explainable AI is important for trust and accountability.</p>
        
        <h3 class="text-lg font-semibold mb-3 text-text-primary">Job Impact</h3>
        <p class="mb-4">AI automation may eliminate some jobs while creating others. Society needs to adapt through education and policy changes.</p>
      `
    }
  ]
}

export function WrittenMaterial({ lessonId, onClose, onComplete }: WrittenMaterialProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set())
  const [isCompleted, setIsCompleted] = useState(false)

  // Handle body scroll lock
  useEffect(() => {
    // Store original body styles
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width
    
    // Get current scroll position
    const scrollY = window.scrollY
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    
    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = originalWidth
      
      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }, [])

  const totalSections = writtenContent.sections.length
  const progressPercentage = Math.round((completedSections.size / totalSections) * 100)

  const markSectionComplete = () => {
    const newCompleted = new Set(completedSections)
    newCompleted.add(currentSection)
    setCompletedSections(newCompleted)
    
    if (newCompleted.size === totalSections) {
      setIsCompleted(true)
    }
  }

  const goToSection = (sectionIndex: number) => {
    setCurrentSection(sectionIndex)
  }

  const nextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleComplete = () => {
    onComplete(100) // Full score for completing all sections
  }

  const currentSectionData = writtenContent.sections[currentSection]

  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal"> {/* rgba(0, 0, 0, 0.5) */}
      <div className="w-full h-full bg-bg-primary overflow-hidden flex flex-col"> {/* #FFFFFF */}
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BookOpen className="h-5 w-5 text-text-brand" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{writtenContent.title}</h2>
              <div className="flex items-center gap-4 mt-1">
                <Badge variant="info" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {writtenContent.estimatedTime}
                </Badge>
                <span className="text-sm text-text-secondary">
                  {completedSections.size} of {totalSections} sections completed
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isCompleted && (
              <Button variant="success" onClick={handleComplete}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Progress</span>
            <span className="text-sm font-medium text-text-brand">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar - Table of Contents */}
          <div className="w-64 border-r border-border-subtle bg-bg-secondary p-4 overflow-y-auto">
            <h3 className="font-semibold text-text-primary mb-4">Table of Contents</h3>
            
            <div className="space-y-2">
              {writtenContent.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer transition-all text-sm",
                    index === currentSection && "bg-text-brand text-white",
                    completedSections.has(index) && index !== currentSection && "bg-bg-success-light text-text-success",
                    index !== currentSection && !completedSections.has(index) && "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                  )}
                  onClick={() => goToSection(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{section.title}</span>
                    {completedSections.has(index) && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <Badge variant="primary" className="mb-2">
                    Section {currentSection + 1} of {totalSections}
                  </Badge>
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    {currentSectionData.title}
                  </h1>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentSectionData.content }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={prevSection}
                disabled={currentSection === 0}
              >
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {!completedSections.has(currentSection) && (
                  <Button
                    variant="success"
                    onClick={markSectionComplete}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </Button>
                )}
                
                <Button
                  variant="primary"
                  onClick={nextSection}
                  disabled={currentSection === totalSections - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}