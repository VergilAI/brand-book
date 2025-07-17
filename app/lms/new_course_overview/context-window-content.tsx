'use client'

import { useMemo } from 'react'
import { KnowledgeGraph, KnowledgeNode, GraphConnection } from '@/components/knowledge-graph'

interface ContextWindowContentProps {
  course: any // Course data from API
  progress: any // User progress data
}

export function CourseContextWindowContent({ course, progress }: ContextWindowContentProps) {
  // Transform course data into graph nodes
  const { nodes, connections } = useMemo(() => {
    const nodes: KnowledgeNode[] = []
    const connections: GraphConnection[] = []
    const nodeMap = new Map<string, KnowledgeNode>()

    // Process all chapters and lessons to create nodes
    course.chapters.forEach((chapter, chapterIndex) => {
      chapter.lessons.forEach((lesson, lessonIndex) => {
        lesson.knowledgePoints.forEach((kp) => {
          const nodeId = `${chapter.id}-${lesson.id}-${kp.id}`
          const userProgress = progress?.knowledgePoints?.[kp.id] || { proficiency: 0 }
          
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
            position: { x: 0, y: 0 }, // Will be calculated by layout algorithm
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
  }, [course, progress])

  const handleNodeSelect = (node: KnowledgeNode) => {
    // Find the lesson containing this knowledge point
    const [chapterId, lessonId] = node.id.split('-').slice(0, 2)
    console.log('Selected knowledge point:', node.title, 'in lesson:', lessonId)
    
    // You could add logic here to:
    // - Scroll to the lesson in the main view
    // - Open learning activities for this specific knowledge point
    // - Show more detailed information
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-spacing-lg py-spacing-md border-b border-border-default">
        <h3 className="font-semibold text-primary">Learning Map</h3>
        <p className="text-sm text-secondary mt-1">
          Visualize your knowledge journey through {course.title}
        </p>
      </div>
      
      <div className="flex-1 p-spacing-md">
        <KnowledgeGraph
          nodes={nodes}
          connections={connections}
          onNodeSelect={handleNodeSelect}
          className="h-full"
        />
      </div>
    </div>
  )
}