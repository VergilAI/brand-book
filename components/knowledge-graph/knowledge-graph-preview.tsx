'use client'

import React, { useMemo, useState } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Progress } from '@/components/atomic/progress'
import { ProgressNode } from './progress-node'
import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'
import { Maximize2, TrendingUp, Target, Clock, Award, Route, Calendar, Zap, Loader2, Sparkles, BookOpen } from 'lucide-react'
import { useJourney, calculateJourney } from './journey-context'

interface KnowledgePoint {
  id: string
  title: string
  progress: number
  dependencies?: string[]
  dependencyDetails?: Record<string, { type: 'hard' | 'soft', requiredElo: number }>
}

interface KnowledgeGraphPreviewProps {
  knowledgePoints: KnowledgePoint[]
  userName?: string
  courseTitle?: string
  onExpand?: () => void
  className?: string
}

// Mini graph component for preview
function MiniKnowledgeGraph({ knowledgePoints }: { knowledgePoints: KnowledgePoint[] }) {
  const { positions, connections } = useMemo(() => {
    const nodeSize = 6
    const padding = 12
    const width = 250 // Fixed width for preview
    const height = 120 // Reduced height for smaller card
    
    // Calculate positions (simplified layout)
    const positions: Record<string, { x: number, y: number }> = {}
    const connections: Array<{ from: string, to: string, type: 'hard' | 'soft' }> = []
    
    // Build dependency map
    const dependencyMap: Record<string, string[]> = {}
    const levels: Record<string, number> = {}
    
    // Calculate levels
    const calculateLevel = (nodeId: string): number => {
      if (levels[nodeId] !== undefined) return levels[nodeId]
      
      const kp = knowledgePoints.find(k => k.id === nodeId)
      if (!kp || !kp.dependencies || kp.dependencies.length === 0) {
        levels[nodeId] = 0
        return 0
      }
      
      const maxParentLevel = Math.max(...kp.dependencies
        .filter(depId => knowledgePoints.find(k => k.id === depId))
        .map(depId => calculateLevel(depId))
      )
      levels[nodeId] = maxParentLevel + 1
      return maxParentLevel + 1
    }
    
    knowledgePoints.forEach(kp => calculateLevel(kp.id))
    
    // Group by level
    const nodesByLevel: Record<number, string[]> = {}
    Object.entries(levels).forEach(([nodeId, level]) => {
      if (!nodesByLevel[level]) nodesByLevel[level] = []
      nodesByLevel[level].push(nodeId)
    })
    
    // Position nodes
    const maxLevel = Math.max(...Object.values(levels))
    const levelHeight = (height - padding * 2) / (maxLevel + 1)
    
    Object.entries(nodesByLevel).forEach(([levelStr, nodeIds]) => {
      const level = parseInt(levelStr)
      const nodeCount = nodeIds.length
      const levelWidth = width - padding * 2
      const spacing = levelWidth / (nodeCount + 1)
      
      nodeIds.forEach((nodeId, index) => {
        positions[nodeId] = {
          x: padding + spacing * (index + 1),
          y: padding + level * levelHeight + levelHeight / 2
        }
      })
    })
    
    // Create connections
    knowledgePoints.forEach(kp => {
      if (kp.dependencies) {
        kp.dependencies.forEach(depId => {
          if (positions[depId] && positions[kp.id]) {
            const depDetails = kp.dependencyDetails?.[depId]
            connections.push({
              from: depId,
              to: kp.id,
              type: depDetails?.type || 'soft'
            })
          }
        })
      }
    })
    
    return { positions, connections }
  }, [knowledgePoints])
  
  // Create simple curved path
  const createPath = (from: { x: number, y: number }, to: { x: number, y: number }) => {
    const controlOffset = Math.abs(to.y - from.y) * 0.3
    return `M ${from.x} ${from.y} C ${from.x} ${from.y + controlOffset}, ${to.x} ${to.y - controlOffset}, ${to.x} ${to.y}`
  }
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 250 120" className="absolute inset-0" preserveAspectRatio="xMidYMid meet">
      {/* Connections */}
      {connections.map((conn, idx) => {
        const from = positions[conn.from]
        const to = positions[conn.to]
        if (!from || !to) return null
        
        return (
          <path
            key={`${conn.from}-${conn.to}-${idx}`}
            d={createPath(from, to)}
            stroke={conn.type === 'hard' ? '#e5e5e7' : '#e5e5e7'}
            strokeWidth="1"
            strokeDasharray={conn.type === 'soft' ? "2,2" : undefined}
            fill="none"
            opacity="0.5"
          />
        )
      })}
      
      {/* Nodes */}
      {knowledgePoints.map(kp => {
        const pos = positions[kp.id]
        if (!pos) return null
        
        const nodeColor = kp.progress >= 80 ? '#22C55E' :
                         kp.progress >= 40 ? '#FFC700' :
                         kp.progress > 0 ? '#E51C23' :
                         '#e5e5e7'
        
        return (
          <g key={kp.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="3"
              fill={nodeColor}
              stroke={nodeColor}
              strokeWidth="0.5"
              opacity={kp.progress > 0 ? "1" : "0.6"}
            />
            {kp.progress >= 80 && (
              <text
                x={pos.x}
                y={pos.y + 0.5}
                textAnchor="middle"
                fill="white"
                fontSize="5"
                fontWeight="bold"
              >
                ✓
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function KnowledgeGraphPreview({
  knowledgePoints,
  userName = "Learner",
  courseTitle = "Course Progress",
  onExpand,
  className
}: KnowledgeGraphPreviewProps) {
  const [showJourneyPlanning, setShowJourneyPlanning] = useState(false)
  const [planningStep, setPlanningStep] = useState(0)
  const [showJourneyResults, setShowJourneyResults] = useState(false)
  const [stepProgress, setStepProgress] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 })
  const { journey, setJourney } = useJourney()
  
  const handlePlanJourney = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setShowJourneyPlanning(true)
    setPlanningStep(1)
    setStepProgress({ 1: 0, 2: 0, 3: 0 })
    
    // Animate step 1 progress
    let progress1 = 0
    const interval1 = setInterval(() => {
      progress1 += 2.5
      setStepProgress(prev => ({ ...prev, 1: Math.min(progress1, 100) }))
      if (progress1 >= 100) {
        clearInterval(interval1)
        setTimeout(() => {
          setPlanningStep(2)
          
          // Animate step 2 progress
          let progress2 = 0
          const interval2 = setInterval(() => {
            progress2 += 2.5
            setStepProgress(prev => ({ ...prev, 2: Math.min(progress2, 100) }))
            if (progress2 >= 100) {
              clearInterval(interval2)
              setTimeout(() => {
                setPlanningStep(3)
                
                // Animate step 3 progress
                let progress3 = 0
                const interval3 = setInterval(() => {
                  progress3 += 2.5
                  setStepProgress(prev => ({ ...prev, 3: Math.min(progress3, 100) }))
                  if (progress3 >= 100) {
                    clearInterval(interval3)
                    setTimeout(() => {
                      try {
                        // Calculate and set journey
                        const newJourney = calculateJourney(knowledgePoints, 'standard')
                        console.log('[KnowledgeGraphPreview] Calculated journey:', {
                          steps: newJourney.steps.length,
                          totalHours: newJourney.totalHours,
                          knowledgePointsCount: knowledgePoints.length,
                          journey: newJourney
                        })
                        setJourney(newJourney)
                        setPlanningStep(4)
                      } catch (error) {
                        console.error('Error calculating journey:', error)
                        // Still advance to step 4 to show the View button
                        setPlanningStep(4)
                      }
                    }, 300)
                  }
                }, 50)
              }, 300)
            }
          }, 50)
        }, 300)
      }
    }, 50)
  }
  
  const handleViewFullJourney = () => {
    onExpand?.()
  }
  
  return (
    <div className={cn("h-full flex flex-col gap-spacing-sm", className)}>
      {/* Mini Graph Preview Card - Smaller Height */}
      <Card 
        className="h-48 p-spacing-md cursor-pointer hover:shadow-md transition-shadow flex flex-col"
        onClick={onExpand}
      >
        <div className="flex items-start justify-between mb-spacing-xs">
          <div>
            <h3 className="text-sm font-semibold text-primary">Knowledge Map</h3>
            <p className="text-xs text-secondary">Click to view full graph</p>
          </div>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        {/* Mini visualization */}
        <div className="flex-1 bg-secondary rounded-md relative overflow-hidden">
          <MiniKnowledgeGraph knowledgePoints={knowledgePoints} />
        </div>
      </Card>
      
      {/* Plan My Journey Button */}
      {!showJourneyPlanning && (
        <Button 
          variant="primary" 
          size="md" 
          className="w-full"
          onClick={handlePlanJourney}
        >
          <Route className="h-4 w-4 mr-2" />
          {journey && showJourneyResults ? 'Update Journey' : 'Plan My Journey'}
        </Button>
      )}
      
      {/* Journey Planning Steps Card */}
      {showJourneyPlanning && (
        <Card className="p-spacing-md overflow-hidden">
          <div className="flex items-center gap-spacing-xs mb-spacing-sm">
            <Sparkles className="h-4 w-4 text-brand animate-pulse" />
            <h4 className="text-sm font-semibold text-primary">AI Journey Planner</h4>
          </div>
          
          <div className="space-y-spacing-md">
            {/* Step 1 */}
            {planningStep >= 1 && (
              <div className={cn(
                "transition-all duration-500 transform",
                planningStep < 1 ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              )}>
                <div className="flex items-start gap-spacing-sm mb-spacing-xs">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    planningStep === 1 ? "bg-brand text-white animate-pulse" : "bg-success text-white"
                  )}>
                    {planningStep > 1 ? (
                      "✓"
                    ) : planningStep === 1 ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="text-sm font-medium text-primary">Evaluating Your Knowledge</span>
                      {planningStep === 1 && (
                        <span className="text-xs text-brand animate-pulse">Analyzing...</span>
                      )}
                    </div>
                    <div className="text-xs text-secondary">Scanning completed topics and current proficiency</div>
                  </div>
                </div>
                <Progress 
                  value={stepProgress[1]} 
                  className="h-1.5"
                  variant={stepProgress[1] === 100 ? "success" : "default"}
                />
              </div>
            )}
            
            {/* Step 2 */}
            {planningStep >= 2 && (
              <div className={cn(
                "transition-all duration-500 transform",
                planningStep < 2 ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              )}>
                <div className="flex items-start gap-spacing-sm mb-spacing-xs">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    planningStep === 2 ? "bg-brand text-white animate-pulse" : "bg-success text-white"
                  )}>
                    {planningStep > 2 ? (
                      "✓"
                    ) : planningStep === 2 ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="text-sm font-medium text-primary">Analyzing Course Structure</span>
                      {planningStep === 2 && (
                        <span className="text-xs text-brand animate-pulse">Processing...</span>
                      )}
                    </div>
                    <div className="text-xs text-secondary">Mapping dependencies and prerequisites</div>
                  </div>
                </div>
                <Progress 
                  value={stepProgress[2]} 
                  className="h-1.5"
                  variant={stepProgress[2] === 100 ? "success" : "default"}
                />
              </div>
            )}
            
            {/* Step 3 */}
            {planningStep >= 3 && (
              <div className={cn(
                "transition-all duration-500 transform",
                planningStep < 3 ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              )}>
                <div className="flex items-start gap-spacing-sm mb-spacing-xs">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    planningStep === 3 ? "bg-brand text-white animate-pulse" : "bg-success text-white"
                  )}>
                    {planningStep > 3 ? (
                      "✓"
                    ) : planningStep === 3 ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="text-sm font-medium text-primary">Optimizing Your Path</span>
                      {planningStep === 3 && (
                        <span className="text-xs text-brand animate-pulse">Calculating...</span>
                      )}
                    </div>
                    <div className="text-xs text-secondary">Creating personalized learning sequence</div>
                  </div>
                </div>
                <Progress 
                  value={stepProgress[3]} 
                  className="h-1.5"
                  variant={stepProgress[3] === 100 ? "success" : "default"}
                />
              </div>
            )}
          </div>
          
          {/* AI Thinking Indicator */}
          {planningStep < 4 && planningStep > 0 && (
            <div className="mt-spacing-md pt-spacing-sm border-t border-border-subtle">
              <div className="flex items-center justify-center gap-spacing-xs text-xs text-secondary">
                <div className="flex gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-brand rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                  <span className="inline-block w-1.5 h-1.5 bg-brand rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="inline-block w-1.5 h-1.5 bg-brand rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span>AI is thinking</span>
              </div>
            </div>
          )}
          
          {/* View Journey Button - Appears after all steps complete */}
          {planningStep > 3 && (
            <div className="mt-spacing-md pt-spacing-sm border-t border-border-subtle">
              <Button 
                variant="primary" 
                size="md" 
                className="w-full transition-all duration-500 transform scale-100"
                onClick={() => {
                  setShowJourneyPlanning(false)
                  setShowJourneyResults(true)
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                View My Journey
              </Button>
            </div>
          )}
        </Card>
      )}
      
      {/* Journey Results Card */}
      {showJourneyResults && journey && (
        console.log('[KnowledgeGraphPreview] Showing journey results:', {
          hasJourney: !!journey,
          stepsLength: journey?.steps?.length || 0,
          journey
        }),
        <Card className="p-spacing-md">
          <div className="flex items-start justify-between mb-spacing-md">
            <div>
              <h3 className="text-sm font-semibold text-primary">Your Personalized Journey</h3>
              <p className="text-xs text-secondary mt-1">AI-optimized learning path</p>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                setShowJourneyResults(false)
                setPlanningStep(0)
              }}
              className="h-6 w-6 p-0"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          
          {/* Estimated Completion Time */}
          <div className="flex items-center justify-between text-sm mb-3 pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-secondary" />
              <div>
                <span className="font-semibold text-primary">{Math.ceil(journey.totalHours / 8)} days</span>
                <span className="text-secondary text-xs ml-1">({journey.totalHours}h)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-secondary">Target</div>
              <div className="font-medium text-primary">
                {new Date(journey.estimatedCompletion).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          
          {/* Next Knowledge Points */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
              <Target className="h-3.5 w-3.5" />
              Next Knowledge Points
            </h4>
            <div className="space-y-1">
              {journey && journey.steps && journey.steps.length > 0 ? journey.steps.slice(0, 3).map((step, index) => {
                const kp = knowledgePoints.find(k => k.id === step.knowledgePointId)
                if (!kp) return null
                
                return (
                  <div key={step.knowledgePointId} className="flex items-center gap-spacing-xs">
                    <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-brand">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-primary">{kp.title}</span>
                          <span className="text-xs text-secondary ml-1">{step.estimatedDuration}h</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Progress 
                            value={kp.progress} 
                            size="sm"
                            className="h-1 w-12"
                            variant={
                              kp.progress >= 70 ? "success" : 
                              kp.progress >= 40 ? "warning" : 
                              kp.progress > 0 ? "error" : 
                              "default"
                            }
                          />
                          <span className="text-xs text-secondary min-w-[2rem] text-right">{kp.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-sm text-secondary">No knowledge points found in journey</div>
              )}
            </div>
          </div>
          
          {/* Next Lessons */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-primary mb-1 flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              Recommended Lessons
            </h4>
            <div className="text-xs text-secondary mb-2">
              Based on your next knowledge points
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-secondary rounded-md flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-primary truncate">Lesson 1: Introduction to ML</div>
                  <div className="text-xs text-secondary truncate">Covers: ML Definition, Types of ML</div>
                </div>
                <Button size="sm" variant="primary" className="flex-shrink-0">
                  Learn
                </Button>
              </div>
              <div className="p-2 bg-secondary rounded-md flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-primary truncate">Lesson 2: Mathematical Foundations</div>
                  <div className="text-xs text-secondary truncate">Covers: Linear Algebra, Probability</div>
                </div>
                <Button size="sm" variant="primary" className="flex-shrink-0">
                  Learn
                </Button>
              </div>
              <div className="p-2 bg-secondary rounded-md flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-primary truncate">Lesson 3: Linear Models</div>
                  <div className="text-xs text-secondary truncate">Covers: Linear Regression basics</div>
                </div>
                <Button size="sm" variant="primary" className="flex-shrink-0">
                  Learn
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <Button 
            variant="primary" 
            size="md" 
            className="w-full"
            onClick={handleViewFullJourney}
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            View Full Journey Map
          </Button>
        </Card>
      )}
    </div>
  )
}