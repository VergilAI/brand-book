import { KnowledgeNode, GraphConnection } from './types'

// Simple force-directed layout algorithm
export function calculateNodePositions(
  nodes: KnowledgeNode[],
  connections: GraphConnection[],
  width: number,
  height: number
): KnowledgeNode[] {
  // Group nodes by chapter and lesson
  const chapters = new Map<number, KnowledgeNode[]>()
  
  nodes.forEach(node => {
    if (!chapters.has(node.chapter)) {
      chapters.set(node.chapter, [])
    }
    chapters.get(node.chapter)!.push(node)
  })

  // Calculate positions based on chapter/lesson hierarchy
  const updatedNodes: KnowledgeNode[] = []
  const chapterWidth = width / (chapters.size + 1)
  let chapterIndex = 0

  chapters.forEach((chapterNodes, chapterNum) => {
    // Sort by lesson number
    chapterNodes.sort((a, b) => a.lesson - b.lesson)
    
    // Group by lesson
    const lessons = new Map<number, KnowledgeNode[]>()
    chapterNodes.forEach(node => {
      if (!lessons.has(node.lesson)) {
        lessons.set(node.lesson, [])
      }
      lessons.get(node.lesson)!.push(node)
    })

    let lessonY = height * 0.1 // Start from top with padding
    const lessonHeight = (height * 0.8) / lessons.size

    lessons.forEach((lessonNodes, lessonNum) => {
      const nodesInRow = lessonNodes.length
      const nodeSpacing = chapterWidth / (nodesInRow + 1)

      lessonNodes.forEach((node, index) => {
        updatedNodes.push({
          ...node,
          position: {
            x: (chapterIndex + 1) * chapterWidth + (index - nodesInRow / 2 + 0.5) * nodeSpacing,
            y: lessonY + lessonHeight / 2
          }
        })
      })

      lessonY += lessonHeight
    })

    chapterIndex++
  })

  // Apply force-directed adjustments for connected nodes
  const iterations = 50
  const k = Math.sqrt((width * height) / nodes.length) // Optimal distance
  
  for (let i = 0; i < iterations; i++) {
    // Repulsive forces between all nodes
    updatedNodes.forEach((node1, i) => {
      updatedNodes.forEach((node2, j) => {
        if (i !== j) {
          const dx = node1.position.x - node2.position.x
          const dy = node1.position.y - node2.position.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance > 0 && distance < k * 2) {
            const force = (k * k) / distance / 50
            node1.position.x += (dx / distance) * force
            node1.position.y += (dy / distance) * force
          }
        }
      })
    })

    // Attractive forces for connected nodes
    connections.forEach(conn => {
      const node1 = updatedNodes.find(n => n.id === conn.from)
      const node2 = updatedNodes.find(n => n.id === conn.to)
      
      if (node1 && node2) {
        const dx = node2.position.x - node1.position.x
        const dy = node2.position.y - node1.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 0) {
          const force = (distance * distance) / k / 100
          node1.position.x += (dx / distance) * force
          node1.position.y += (dy / distance) * force
          node2.position.x -= (dx / distance) * force
          node2.position.y -= (dy / distance) * force
        }
      }
    })

    // Keep nodes within bounds
    updatedNodes.forEach(node => {
      node.position.x = Math.max(50, Math.min(width - 50, node.position.x))
      node.position.y = Math.max(50, Math.min(height - 50, node.position.y))
    })
  }

  return updatedNodes
}