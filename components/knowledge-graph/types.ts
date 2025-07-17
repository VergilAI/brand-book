export interface KnowledgeNode {
  id: string
  title: string
  description: string
  proficiency: number // 0-100
  chapter: number
  lesson: number
  position: { x: number; y: number }
  status: 'mastered' | 'learning' | 'available' | 'locked'
  prerequisites: string[]
  unlocks: string[]
}

export interface GraphConnection {
  id: string
  from: string
  to: string
  type: 'prerequisite' | 'unlock'
  strength: number // 0-1 for visual weight
}

export interface GraphViewport {
  x: number
  y: number
  zoom: number
}

export interface GraphDimensions {
  width: number
  height: number
  nodeSize: number
  minNodeSize: number
  maxNodeSize: number
}