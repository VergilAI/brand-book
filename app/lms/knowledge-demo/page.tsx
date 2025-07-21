'use client'

import React, { useState } from 'react'
import { LMSHeader } from '@/components/lms-header'
import {
  ContextWindowProvider,
  ContextWindowLayout,
  ContextWindow,
  ContextWindowTrigger,
  useContextWindow,
} from '@/components/context-window'
import { JourneyProvider } from '@/components/knowledge-graph/journey-context'
import { KnowledgeGraph, KnowledgeNode, GraphConnection } from '@/components/knowledge-graph'
import { ProgressNode } from '@/components/knowledge-graph/progress-node'
import { TreeKnowledgeGraph } from '@/components/knowledge-graph/tree-knowledge-graph'
import { KnowledgeTreeCard } from '@/components/knowledge-tree-card'
import { KnowledgeGraphPreview } from '@/components/knowledge-graph/knowledge-graph-preview'

// Dummy course data for demo with dependencies
const dummyCourse = {
  id: 'demo-course',
  title: 'Introduction to Machine Learning',
  chapters: [
    {
      id: 'chapter-1',
      title: 'Fundamentals',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'What is Machine Learning?',
          knowledgePoints: [
            { id: 'kp-1-1-1', title: 'ML Definition', description: 'Understanding what Machine Learning is', dependencies: [] },
            { id: 'kp-1-1-2', title: 'Types of ML', description: 'Supervised, Unsupervised, and Reinforcement Learning', dependencies: [{ id: 'kp-1-1-1', type: 'hard', requiredElo: 80 }] },
            { id: 'kp-1-1-3', title: 'Applications', description: 'Real-world applications of ML', dependencies: [{ id: 'kp-1-1-2', type: 'soft', requiredElo: 60 }] }
          ]
        },
        {
          id: 'lesson-1-2', 
          title: 'Mathematical Foundations',
          knowledgePoints: [
            { id: 'kp-1-2-1', title: 'Linear Algebra', description: 'Vectors, matrices, and operations', dependencies: [] },
            { id: 'kp-1-2-2', title: 'Probability', description: 'Basic probability theory', dependencies: [] },
            { id: 'kp-1-2-3', title: 'Statistics', description: 'Statistical concepts for ML', dependencies: [{ id: 'kp-1-2-2', type: 'hard', requiredElo: 75 }] }
          ]
        }
      ]
    },
    {
      id: 'chapter-2',
      title: 'Algorithms',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Linear Models',
          knowledgePoints: [
            { id: 'kp-2-1-1', title: 'Linear Regression', description: 'Predicting continuous values', dependencies: [{ id: 'kp-1-2-1', type: 'hard', requiredElo: 85 }, { id: 'kp-1-2-3', type: 'hard', requiredElo: 80 }] },
            { id: 'kp-2-1-2', title: 'Logistic Regression', description: 'Binary classification', dependencies: [{ id: 'kp-2-1-1', type: 'hard', requiredElo: 80 }] },
            { id: 'kp-2-1-3', title: 'Regularization', description: 'L1 and L2 regularization techniques', dependencies: [{ id: 'kp-2-1-1', type: 'soft', requiredElo: 70 }, { id: 'kp-2-1-2', type: 'soft', requiredElo: 70 }] }
          ]
        },
        {
          id: 'lesson-2-2',
          title: 'Tree-based Models',
          knowledgePoints: [
            { id: 'kp-2-2-1', title: 'Decision Trees', description: 'Tree-based decision making', dependencies: [{ id: 'kp-1-1-2', type: 'soft', requiredElo: 65 }, { id: 'kp-1-2-3', type: 'hard', requiredElo: 75 }] },
            { id: 'kp-2-2-2', title: 'Random Forests', description: 'Ensemble of decision trees', dependencies: [{ id: 'kp-2-2-1', type: 'hard', requiredElo: 85 }] },
            { id: 'kp-2-2-3', title: 'Gradient Boosting', description: 'Boosting techniques', dependencies: [{ id: 'kp-2-2-1', type: 'hard', requiredElo: 85 }] }
          ]
        }
      ]
    },
    {
      id: 'chapter-3',
      title: 'Neural Networks',
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'Basics of Neural Networks',
          knowledgePoints: [
            { id: 'kp-3-1-1', title: 'Perceptron', description: 'Single layer neural network', dependencies: [{ id: 'kp-1-2-1', type: 'hard' }, { id: 'kp-2-1-1', type: 'soft' }] },
            { id: 'kp-3-1-2', title: 'Activation Functions', description: 'ReLU, Sigmoid, Tanh', dependencies: [{ id: 'kp-3-1-1', type: 'hard' }] },
            { id: 'kp-3-1-3', title: 'Backpropagation', description: 'Training neural networks', dependencies: [{ id: 'kp-3-1-1', type: 'hard' }, { id: 'kp-3-1-2', type: 'hard' }] }
          ]
        },
        {
          id: 'lesson-3-2',
          title: 'Deep Learning',
          knowledgePoints: [
            { id: 'kp-3-2-1', title: 'CNNs', description: 'Convolutional Neural Networks', dependencies: [{ id: 'kp-3-1-3', type: 'hard' }] },
            { id: 'kp-3-2-2', title: 'RNNs', description: 'Recurrent Neural Networks', dependencies: [{ id: 'kp-3-1-3', type: 'hard' }] },
            { id: 'kp-3-2-3', title: 'Transformers', description: 'Attention mechanisms', dependencies: [{ id: 'kp-3-1-2', type: 'soft' }, { id: 'kp-3-2-2', type: 'hard' }] }
          ]
        }
      ]
    }
  ]
}

// Dummy progress data with varied proficiency levels
const dummyProgress = {
  knowledgePoints: {
    'kp-1-1-1': { proficiency: 100 },
    'kp-1-1-2': { proficiency: 85 },
    'kp-1-1-3': { proficiency: 70 },
    'kp-1-2-1': { proficiency: 60 },
    'kp-1-2-2': { proficiency: 45 },
    'kp-1-2-3': { proficiency: 30 },
    'kp-2-1-1': { proficiency: 25 },
    'kp-2-1-2': { proficiency: 15 },
    'kp-2-1-3': { proficiency: 0 },
    'kp-2-2-1': { proficiency: 0 },
    'kp-2-2-2': { proficiency: 0 },
    'kp-2-2-3': { proficiency: 0 },
    'kp-3-1-1': { proficiency: 0 },
    'kp-3-1-2': { proficiency: 0 },
    'kp-3-1-3': { proficiency: 0 },
    'kp-3-2-1': { proficiency: 0 },
    'kp-3-2-2': { proficiency: 0 },
    'kp-3-2-3': { proficiency: 0 }
  }
}

function DemoContextWindowContent() {
  const { state, expand, compact } = useContextWindow()
  
  // Transform course data into graph nodes
  const { nodes, connections } = React.useMemo(() => {
    const nodes: KnowledgeNode[] = []
    const connections: GraphConnection[] = []
    const nodeMap = new Map<string, KnowledgeNode>()

    // Process all chapters and lessons to create nodes
    dummyCourse.chapters.forEach((chapter, chapterIndex) => {
    chapter.lessons.forEach((lesson, lessonIndex) => {
      lesson.knowledgePoints.forEach((kp) => {
        const nodeId = `${chapter.id}-${lesson.id}-${kp.id}`
        const userProgress = dummyProgress.knowledgePoints[kp.id] || { proficiency: 0 }
        
        // Determine status based on proficiency - all nodes are unlocked
        let status: KnowledgeNode['status'] = 'available'
        if (userProgress.proficiency >= 80) {
          status = 'mastered'
        } else if (userProgress.proficiency > 0) {
          status = 'learning'
        }

        const node: KnowledgeNode = {
          id: nodeId,
          title: kp.title,
          description: kp.description,
          proficiency: userProgress.proficiency || 0,
          chapter: chapterIndex + 1,
          lesson: lessonIndex + 1,
          position: { x: 100 + chapterIndex * 200, y: 100 + lessonIndex * 150 }, // Give initial positions
          status,
          prerequisites: [],
          unlocks: []
        }

        nodes.push(node)
        nodeMap.set(nodeId, node)
      })
    })
  })

  // No connections - all nodes are independent

    return { nodes, connections }
  }, [])

  const handleNodeSelect = (node: KnowledgeNode) => {
    console.log('Selected knowledge point:', node.title)
  }

  // Create knowledge points from course data with dependencies
  const knowledgePointsData = React.useMemo(() => {
    const points: Array<{
      id: string
      title: string
      progress: number
      dependencies: string[]
    }> = []
    
    dummyCourse.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        lesson.knowledgePoints.forEach((kp) => {
          const userProgress = dummyProgress.knowledgePoints[kp.id] || { proficiency: 0 }
          points.push({
            id: kp.id,
            title: kp.title,
            progress: userProgress.proficiency || 0,
            dependencies: kp.dependencies ? kp.dependencies.map(dep => 
              typeof dep === 'string' ? dep : dep.id
            ) : [],
            hardDependencies: kp.dependencies ? kp.dependencies
              .filter(dep => typeof dep !== 'string' && dep.type === 'hard')
              .map(dep => dep.id) : [],
            dependencyDetails: kp.dependencies ? kp.dependencies
              .filter(dep => typeof dep !== 'string')
              .reduce((acc, dep) => {
                acc[dep.id] = { type: dep.type, requiredElo: dep.requiredElo }
                return acc
              }, {}) : {}
          })
        })
      })
    })
    
    return points
  }, [])

  // Show different content based on state
  if (state === 'compact') {
    return (
      <div className="h-full overflow-auto bg-secondary p-spacing-md">
        <KnowledgeGraphPreview
          knowledgePoints={knowledgePointsData}
          userName="Alex"
          courseTitle={dummyCourse.title}
          onExpand={expand}
        />
      </div>
    )
  }
  
  // Expanded state
  return (
    <div className="h-full overflow-auto bg-secondary p-spacing-md">
      <KnowledgeTreeCard
        title={`Learning Map - ${dummyCourse.title}`}
        subtitle="Your personalized knowledge journey"
        userName="Alex"
        knowledgePoints={knowledgePointsData}
        showStats={true}
        onCompact={compact}
      />
    </div>
  )
}

export default function KnowledgeDemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <JourneyProvider>
      <ContextWindowProvider>
        <ContextWindowLayout 
          className="min-h-screen bg-bg-primary" 
          compactSize="medium"
          expandedSize="large"
        >
          <div className="flex flex-col h-full">
            <LMSHeader 
              currentView="course" 
              onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
            />
            
            <main className="flex-1 overflow-auto p-spacing-xl">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-primary mb-spacing-md">
                  Knowledge Graph Demo
                </h1>
                <p className="text-lg text-secondary mb-spacing-xl">
                  This demo showcases the knowledge graph visualization in the context window. 
                  Click the toggle button on the right to see the interactive knowledge map.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-lg">
                  <div className="bg-secondary rounded-lg p-spacing-lg">
                    <h2 className="text-xl font-semibold text-primary mb-spacing-sm">
                      Course Structure
                    </h2>
                    <p className="text-secondary mb-spacing-md">
                      The demo course contains 3 chapters with 2 lessons each:
                    </p>
                    <ul className="space-y-spacing-sm text-secondary">
                      <li>• <strong>Fundamentals:</strong> ML basics and math foundations</li>
                      <li>• <strong>Algorithms:</strong> Linear models and tree-based models</li>
                      <li>• <strong>Neural Networks:</strong> Basics and deep learning</li>
                    </ul>
                  </div>
                  
                  <div className="bg-secondary rounded-lg p-spacing-lg">
                    <h2 className="text-xl font-semibold text-primary mb-spacing-sm">
                      Progress Visualization
                    </h2>
                    <p className="text-secondary mb-spacing-md">
                      The knowledge graph shows:
                    </p>
                    <ul className="space-y-spacing-sm text-secondary">
                      <li>• <span className="text-status-success">Green nodes:</span> Mastered (80%+ proficiency)</li>
                      <li>• <span className="text-status-warning">Yellow nodes:</span> Learning in progress</li>
                      <li>• <span className="text-status-info">Blue nodes:</span> Available to learn</li>
                      <li>• <span className="text-status-default">Gray nodes:</span> Locked</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-spacing-xl bg-secondary rounded-lg p-spacing-lg">
                  <h2 className="text-xl font-semibold text-primary mb-spacing-sm">
                    Interactive Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-md mt-spacing-md">
                    <div>
                      <h3 className="font-medium text-primary mb-spacing-xs">Pan & Zoom</h3>
                      <p className="text-sm text-secondary">
                        Click and drag to pan, use mouse wheel or buttons to zoom
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-primary mb-spacing-xs">Node Selection</h3>
                      <p className="text-sm text-secondary">
                        Click on nodes to see details and connections
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-primary mb-spacing-xs">Progress Rings</h3>
                      <p className="text-sm text-secondary">
                        Visual proficiency indicators around each node
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* Context Window Trigger */}
          <ContextWindowTrigger />

          {/* Context Window Content */}
          <ContextWindow>
            <DemoContextWindowContent />
          </ContextWindow>
        </ContextWindowLayout>
      </ContextWindowProvider>
    </JourneyProvider>
  )
}