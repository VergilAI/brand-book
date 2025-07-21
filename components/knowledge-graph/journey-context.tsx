'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface JourneyStep {
  order: number
  knowledgePointId: string
  estimatedDuration: number // hours
  suggestedStartDate: Date
  suggestedEndDate: Date
  rationale: string
  prerequisites: string[]
  unlocks: string[]
}

export interface Milestone {
  name: string
  date: Date
  knowledgePointIds: string[]
  description: string
}

export interface LearningJourney {
  id: string
  userId: string
  courseId: string
  createdAt: Date
  pace: 'relaxed' | 'standard' | 'intensive'
  steps: JourneyStep[]
  milestones: Milestone[]
  estimatedCompletion: Date
  totalHours: number
}

interface JourneyContextValue {
  journey: LearningJourney | null
  isJourneyVisible: boolean
  isPlaying: boolean
  playbackSpeed: number
  currentStep: number
  
  setJourney: (journey: LearningJourney | null) => void
  toggleJourneyVisibility: () => void
  startPlayback: () => void
  pausePlayback: () => void
  resetPlayback: () => void
  setPlaybackSpeed: (speed: number) => void
  setCurrentStep: (step: number) => void
}

const JourneyContext = createContext<JourneyContextValue | null>(null)

export function useJourney() {
  const context = useContext(JourneyContext)
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider')
  }
  return context
}

interface JourneyProviderProps {
  children: React.ReactNode
}

export function JourneyProvider({ children }: JourneyProviderProps) {
  const [journey, setJourney] = useState<LearningJourney | null>(null)
  const [isJourneyVisible, setIsJourneyVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentStep, setCurrentStep] = useState(0)
  
  const toggleJourneyVisibility = useCallback(() => {
    setIsJourneyVisible(prev => !prev)
  }, [])
  
  const startPlayback = useCallback(() => {
    console.log('[JourneyContext] startPlayback called, currentStep:', currentStep, 'journey steps:', journey?.steps?.length)
    // If we're at the end, reset to beginning
    if (journey && currentStep >= journey.steps.length) {
      console.log('[JourneyContext] Resetting to beginning')
      setCurrentStep(0)
    }
    console.log('[JourneyContext] Setting isPlaying to true')
    setIsPlaying(true)
  }, [journey, currentStep])
  
  const pausePlayback = useCallback(() => {
    setIsPlaying(false)
  }, [])
  
  const resetPlayback = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(0)
  }, [])
  
  return (
    <JourneyContext.Provider value={{
      journey,
      isJourneyVisible,
      isPlaying,
      playbackSpeed,
      currentStep,
      setJourney,
      toggleJourneyVisibility,
      startPlayback,
      pausePlayback,
      resetPlayback,
      setPlaybackSpeed,
      setCurrentStep
    }}>
      {children}
    </JourneyContext.Provider>
  )
}

// Journey calculation algorithm
export function calculateJourney(
  knowledgePoints: Array<{
    id: string
    title: string
    progress: number
    dependencies?: string[]
    dependencyDetails?: Record<string, { type: 'hard' | 'soft', requiredElo: number }>
  }>,
  pace: 'relaxed' | 'standard' | 'intensive' = 'standard'
): LearningJourney {
  console.log('[calculateJourney] Starting with', knowledgePoints.length, 'knowledge points')
  console.log('[calculateJourney] Nodes with progress < 100:', knowledgePoints.filter(kp => kp.progress < 100).length)
  // Hours per knowledge point based on pace
  const hoursPerKP = {
    relaxed: 6,
    standard: 4,
    intensive: 2
  }
  
  // Find all nodes that are not dependencies of any other node (root nodes)
  const rootNodes = knowledgePoints.filter(kp => {
    return !knowledgePoints.some(otherKp => 
      otherKp.dependencies?.includes(kp.id)
    )
  })
  
  // Build a map of node to its dependents (reverse dependencies)
  const dependentsMap: Record<string, string[]> = {}
  knowledgePoints.forEach(kp => {
    if (kp.dependencies) {
      kp.dependencies.forEach(depId => {
        if (!dependentsMap[depId]) dependentsMap[depId] = []
        dependentsMap[depId].push(kp.id)
      })
    }
  })
  
  // Calculate topological order starting from root nodes (top to bottom)
  const visited = new Set<string>()
  const order: string[] = []
  const queue: string[] = [...rootNodes.map(kp => kp.id)]
  
  // Process nodes level by level (BFS approach for top-to-bottom)
  const maxIterations = knowledgePoints.length * 2 // Safety limit
  let iterations = 0
  
  while (queue.length > 0 && iterations < maxIterations) {
    iterations++
    const nodeId = queue.shift()!
    
    if (visited.has(nodeId)) continue
    
    const node = knowledgePoints.find(kp => kp.id === nodeId)
    if (!node) continue
    
    // Check if all dependencies are satisfied
    const allDependenciesSatisfied = !node.dependencies || 
      node.dependencies.every(depId => {
        const depNode = knowledgePoints.find(kp => kp.id === depId)
        return !depNode || visited.has(depId) || depNode.progress >= 100
      })
    
    if (!allDependenciesSatisfied) {
      // Put it back in the queue to process later
      queue.push(nodeId)
      continue
    }
    
    visited.add(nodeId)
    
    // Add all nodes for now (including completed ones for testing)
    // TODO: Change back to only incomplete nodes
    order.push(nodeId)
    
    // Add dependents to queue
    const dependents = dependentsMap[nodeId] || []
    dependents.forEach(depId => {
      if (!visited.has(depId) && !queue.includes(depId)) {
        queue.push(depId)
      }
    })
  }
  
  if (iterations >= maxIterations) {
    console.warn('Journey calculation hit iteration limit - possible circular dependencies')
  }
  
  // Create journey steps
  const startDate = new Date()
  let currentDate = new Date(startDate)
  const steps: JourneyStep[] = []
  
  order.forEach((kpId, index) => {
    const kp = knowledgePoints.find(k => k.id === kpId)
    if (!kp) return
    
    const duration = hoursPerKP[pace]
    const endDate = new Date(currentDate)
    endDate.setHours(endDate.getHours() + duration)
    
    // Find what this unlocks
    const unlocks = knowledgePoints
      .filter(k => k.dependencies?.includes(kpId))
      .map(k => k.id)
    
    steps.push({
      order: index + 1,
      knowledgePointId: kpId,
      estimatedDuration: duration,
      suggestedStartDate: new Date(currentDate),
      suggestedEndDate: endDate,
      rationale: kp.dependencies?.length 
        ? `Prerequisites completed: ${kp.dependencies.join(', ')}`
        : 'Foundation knowledge point',
      prerequisites: kp.dependencies || [],
      unlocks
    })
    
    currentDate = endDate
  })
  
  // Create milestones (every 25% of journey)
  const milestones: Milestone[] = []
  const quarterSize = Math.floor(steps.length / 4)
  
  if (quarterSize > 0) {
    milestones.push({
      name: 'Foundation Complete',
      date: steps[quarterSize - 1]?.suggestedEndDate || startDate,
      knowledgePointIds: steps.slice(0, quarterSize).map(s => s.knowledgePointId),
      description: 'Core concepts mastered'
    })
    
    milestones.push({
      name: 'Halfway There',
      date: steps[quarterSize * 2 - 1]?.suggestedEndDate || startDate,
      knowledgePointIds: steps.slice(quarterSize, quarterSize * 2).map(s => s.knowledgePointId),
      description: 'Intermediate skills achieved'
    })
    
    milestones.push({
      name: 'Advanced Learner',
      date: steps[quarterSize * 3 - 1]?.suggestedEndDate || startDate,
      knowledgePointIds: steps.slice(quarterSize * 2, quarterSize * 3).map(s => s.knowledgePointId),
      description: 'Complex topics understood'
    })
  }
  
  const totalHours = steps.reduce((sum, step) => sum + step.estimatedDuration, 0)
  const estimatedCompletion = steps[steps.length - 1]?.suggestedEndDate || startDate
  
  return {
    id: `journey-${Date.now()}`,
    userId: 'current-user',
    courseId: 'current-course',
    createdAt: startDate,
    pace,
    steps,
    milestones,
    estimatedCompletion,
    totalHours
  }
}