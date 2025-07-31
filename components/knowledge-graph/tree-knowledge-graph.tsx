'use client'

import React, { useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ProgressNode } from './progress-node'
import { NodeDetailsPopover } from './node-details-popover'
import { User, Play, Pause, RotateCcw, FastForward } from 'lucide-react'
import { LearningJourney, useJourney } from './journey-context'
import { Button } from '@/components/button'

interface KnowledgePoint {
  id: string
  title: string
  progress: number
  dependencies?: string[]
  hardDependencies?: string[]
  dependencyDetails?: Record<string, { type: 'hard' | 'soft', requiredElo: number }>
}

interface LessonInfo {
  chapterId: string
  chapterTitle: string
  lessonId: string
  lessonTitle: string
}

interface TreeKnowledgeGraphProps {
  userName: string
  knowledgePoints: KnowledgePoint[]
  className?: string
  selectedNodeId?: string
  onNodeSelect?: (nodeId: string | null) => void
  availableLessons?: Record<string, LessonInfo[]>
  onLessonClick?: (lessonId: string) => void
  showJourney?: boolean
  journey?: LearningJourney | null
}

export function TreeKnowledgeGraph({ 
  userName, 
  knowledgePoints, 
  className,
  selectedNodeId,
  onNodeSelect,
  availableLessons = {},
  onLessonClick,
  showJourney = false,
  journey = null
}: TreeKnowledgeGraphProps) {
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({})
  const [animatedConnections, setAnimatedConnections] = useState<Record<string, number>>({})
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const animationRef = useRef<number | null>(null)
  
  const { 
    isPlaying, 
    playbackSpeed, 
    currentStep,
    startPlayback, 
    pausePlayback, 
    resetPlayback, 
    setPlaybackSpeed,
    setCurrentStep
  } = useJourney()
  
  
  // Reset animation when journey is toggled or reset
  React.useEffect(() => {
    if (!showJourney || currentStep === 0) {
      setAnimatedProgress({})
      setAnimatedConnections({})
    }
  }, [showJourney, currentStep])
  
  // Update container width on resize and when component mounts
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        if (width > 0) {
          setContainerWidth(width)
        }
      }
    }
    
    // Use ResizeObserver for better accuracy
    const resizeObserver = new ResizeObserver(() => {
      updateWidth()
    })
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    // Initial update with delay to ensure DOM is ready
    setTimeout(updateWidth, 100)
    
    return () => {
      resizeObserver.disconnect()
    }
  }, [])
  
  // Layout configuration - optimized for horizontal spread
  const knowledgeNodeSize = 36
  const verticalSpacing = 90  // Increased for better curve visibility
  const minHorizontalSpacing = 120  // Increased for better horizontal spread
  const svgPadding = 30
  
  // Calculate positions for all nodes based on dependencies
  const { positions, connections, svgDimensions } = useMemo(() => {
    const positions: Record<string, { x: number, y: number }> = {}
    const connections: Array<{ 
      from: string
      to: string
      type?: 'hard' | 'soft'
      requiredElo?: number
      isLocked?: boolean
      isAchieved?: boolean
      fromProgress?: number
    }> = []
    
    // Build adjacency lists and find root nodes
    const childrenMap: Record<string, string[]> = {}
    const parentCounts: Record<string, number> = {}
    
    knowledgePoints.forEach(kp => {
      parentCounts[kp.id] = 0
      childrenMap[kp.id] = []
    })
    
    knowledgePoints.forEach(kp => {
      if (kp.dependencies) {
        kp.dependencies.forEach(depId => {
          if (childrenMap[depId]) {
            childrenMap[depId].push(kp.id)
            parentCounts[kp.id]++
          }
        })
      }
    })
    
    // Find root nodes (nodes with no dependencies)
    const rootNodes = knowledgePoints.filter(kp => 
      !kp.dependencies || kp.dependencies.length === 0
    ).map(kp => kp.id)
    
    // Calculate level for each node
    const levels: Record<string, number> = {}
    const calculateLevel = (nodeId: string, currentLevel = 0): number => {
      if (levels[nodeId] !== undefined) return levels[nodeId]
      
      const kp = knowledgePoints.find(k => k.id === nodeId)
      if (!kp || !kp.dependencies || kp.dependencies.length === 0) {
        levels[nodeId] = 0
        return 0
      }
      
      const maxParentLevel = Math.max(...kp.dependencies
        .filter(depId => knowledgePoints.find(k => k.id === depId))
        .map(depId => calculateLevel(depId, currentLevel + 1))
      )
      levels[nodeId] = maxParentLevel + 1
      return maxParentLevel + 1
    }
    
    knowledgePoints.forEach(kp => calculateLevel(kp.id))
    
    // Group nodes by level
    const nodesByLevel: Record<number, string[]> = {}
    const maxLevel = Math.max(...Object.values(levels))
    
    // Initialize levels
    for (let i = 0; i <= maxLevel; i++) {
      nodesByLevel[i] = []
    }
    
    // Sort nodes by level and group them
    Object.entries(levels).forEach(([nodeId, level]) => {
      nodesByLevel[level].push(nodeId)
    })
    
    // Sort nodes within each level to minimize crossings
    // For each level, try to order nodes based on their parent positions
    const sortedNodesByLevel: Record<number, string[]> = {}
    
    for (let level = 0; level <= maxLevel; level++) {
      if (level === 0) {
        // Root level - just sort alphabetically for consistency
        sortedNodesByLevel[level] = nodesByLevel[level].sort()
      } else {
        // For non-root levels, sort based on parent positions
        const nodesAtLevel = nodesByLevel[level]
        const nodeScores: Record<string, number> = {}
        
        nodesAtLevel.forEach(nodeId => {
          const node = knowledgePoints.find(kp => kp.id === nodeId)
          if (node && node.dependencies) {
            // Calculate average position of parents
            let sumPos = 0
            let count = 0
            node.dependencies.forEach((depId, idx) => {
              const parentLevel = levels[depId]
              if (parentLevel !== undefined && sortedNodesByLevel[parentLevel]) {
                const parentIndex = sortedNodesByLevel[parentLevel].indexOf(depId)
                if (parentIndex !== -1) {
                  sumPos += parentIndex
                  count++
                }
              }
            })
            nodeScores[nodeId] = count > 0 ? sumPos / count : 999
          } else {
            nodeScores[nodeId] = 999
          }
        })
        
        // Sort by score
        sortedNodesByLevel[level] = nodesAtLevel.sort((a, b) => nodeScores[a] - nodeScores[b])
      }
    }
    
    // Calculate positions using available container width
    const availableWidth = containerWidth - (svgPadding * 2)
    
    // Use the available width to spread nodes nicely
    const treeWidth = availableWidth
    
    // Position nodes with proper spacing
    Object.entries(sortedNodesByLevel).forEach(([levelStr, nodeIds]) => {
      const level = parseInt(levelStr)
      const nodeCount = nodeIds.length
      
      if (nodeCount === 1) {
        // Center single nodes
        const x = svgPadding + treeWidth / 2
        const y = svgPadding + level * verticalSpacing + knowledgeNodeSize / 2
        positions[nodeIds[0]] = { x, y }
      } else {
        // Calculate optimal spacing to use available width
        const totalNodeWidth = nodeCount * knowledgeNodeSize
        const availableSpaceForGaps = treeWidth - totalNodeWidth
        const baseSpacing = Math.min(
          availableSpaceForGaps / (nodeCount - 1),
          minHorizontalSpacing * 2.5 // Increase horizontal spread further
        )
        
        // Check if any nodes in this level have connections to nodes in the same level
        // If so, increase spacing to avoid overlapping lock icons
        let hasIntraLevelConnections = false
        nodeIds.forEach(nodeId => {
          const node = knowledgePoints.find(kp => kp.id === nodeId)
          if (node && node.dependencies) {
            node.dependencies.forEach(depId => {
              if (nodeIds.includes(depId)) {
                hasIntraLevelConnections = true
              }
            })
          }
        })
        
        const optimalSpacing = hasIntraLevelConnections ? baseSpacing * 1.5 : baseSpacing
        
        // Calculate actual width with optimal spacing
        const levelWidth = totalNodeWidth + (nodeCount - 1) * optimalSpacing
        const startX = svgPadding + (treeWidth - levelWidth) / 2 + knowledgeNodeSize / 2
        
        nodeIds.forEach((nodeId, index) => {
          const x = startX + index * (knowledgeNodeSize + optimalSpacing)
          const y = svgPadding + level * verticalSpacing + knowledgeNodeSize / 2
          positions[nodeId] = { x, y }
        })
      }
    })
    
    // Create connections based on dependencies
    knowledgePoints.forEach(kp => {
      if (kp.dependencies) {
        kp.dependencies.forEach(depId => {
          if (positions[depId] && positions[kp.id]) {
            const depDetails = kp.dependencyDetails?.[depId]
            const fromKp = knowledgePoints.find(k => k.id === depId)
            const isLocked = depDetails?.type === 'hard' && (fromKp?.progress || 0) < (depDetails?.requiredElo || 80)
            const isAchieved = (fromKp?.progress || 0) >= (depDetails?.requiredElo || 80)
            
            connections.push({ 
              from: depId, 
              to: kp.id, 
              type: depDetails?.type || 'soft',
              requiredElo: depDetails?.requiredElo || 80,
              isLocked,
              isAchieved,
              fromProgress: fromKp?.progress || 0
            })
          }
        })
      }
    })
    
    // Calculate SVG dimensions
    const maxY = Math.max(...Object.values(positions).map(p => p.y))
    const svgDimensions = {
      width: containerWidth,
      height: maxY + knowledgeNodeSize / 2 + svgPadding + 100 // Space for legend
    }
    
    return { positions, connections, svgDimensions }
  }, [knowledgePoints, knowledgeNodeSize, verticalSpacing, minHorizontalSpacing, containerWidth])
  
  
  // Create curved path between two points
  const createPath = (from: { x: number, y: number }, to: { x: number, y: number }, stopAtMidpoint?: boolean) => {
    const startX = from.x
    const startY = from.y + knowledgeNodeSize / 2
    const endX = to.x
    const endY = to.y - knowledgeNodeSize / 2
    
    // Create a smooth curve
    const controlOffset = Math.min(30, Math.abs(endY - startY) * 0.3)
    
    // Calculate line length
    const dx = endX - startX
    const dy = endY - startY
    const lineLength = Math.sqrt(dx * dx + dy * dy)
    
    // Minimum line length to show lock icon (lock size + padding + some margin)
    const minLengthForLock = 40
    
    if (stopAtMidpoint && lineLength >= minLengthForLock) {
      // Calculate the exact midpoint of the cubic bezier curve
      // For a cubic bezier curve, the midpoint (t=0.5) is:
      const t = 0.5
      const cp1x = startX
      const cp1y = startY + controlOffset
      const cp2x = endX
      const cp2y = endY - controlOffset
      
      // Cubic bezier formula at t=0.5
      const midX = 0.125 * startX + 0.375 * cp1x + 0.375 * cp2x + 0.125 * endX
      const midY = 0.125 * startY + 0.375 * cp1y + 0.375 * cp2y + 0.125 * endY
      
      // Fixed gap size for the lock icon (total gap = icon size + padding)
      const lockIconSize = 10
      const gapPadding = 3
      const totalGap = lockIconSize + gapPadding * 2
      
      // Calculate the direction vector at the midpoint
      const dx = endX - startX
      const dy = endY - startY
      const length = Math.sqrt(dx * dx + dy * dy)
      
      // Normalize and scale by half the gap
      const halfGap = totalGap / 2
      const gapDx = (dx / length) * halfGap
      const gapDy = (dy / length) * halfGap
      
      // Calculate where the first path should end (before the lock)
      const endFirstX = midX - gapDx
      const endFirstY = midY - gapDy
      
      // Calculate where the second path should start (after the lock)
      const startSecondX = midX + gapDx
      const startSecondY = midY + gapDy
      
      // Now we need to find the t values that correspond to these points on the curve
      // This is an approximation that works well for our use case
      const t1 = 0.5 - (halfGap / length)
      const t2 = 0.5 + (halfGap / length)
      
      // Calculate the curve points at t1 and t2
      const x1 = Math.pow(1-t1, 3) * startX + 3 * Math.pow(1-t1, 2) * t1 * cp1x + 3 * (1-t1) * Math.pow(t1, 2) * cp2x + Math.pow(t1, 3) * endX
      const y1 = Math.pow(1-t1, 3) * startY + 3 * Math.pow(1-t1, 2) * t1 * cp1y + 3 * (1-t1) * Math.pow(t1, 2) * cp2y + Math.pow(t1, 3) * endY
      
      const x2 = Math.pow(1-t2, 3) * startX + 3 * Math.pow(1-t2, 2) * t2 * cp1x + 3 * (1-t2) * Math.pow(t2, 2) * cp2x + Math.pow(t2, 3) * endX
      const y2 = Math.pow(1-t2, 3) * startY + 3 * Math.pow(1-t2, 2) * t2 * cp1y + 3 * (1-t2) * Math.pow(t2, 2) * cp2y + Math.pow(t2, 3) * endY
      
      // Create the two path segments
      return {
        firstHalf: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${midX} ${midY}, ${x1} ${y1}`,
        secondHalf: `M ${x2} ${y2} C ${midX} ${midY}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
        midpoint: { x: midX, y: midY },
        lockIconSize: lockIconSize
      }
    } else if (stopAtMidpoint && lineLength < minLengthForLock) {
      // Line is too short for lock icon, return a special indicator
      return {
        tooShort: true,
        fullPath: `M ${startX} ${startY} C ${startX} ${startY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`
      }
    }
    
    return `M ${startX} ${startY} C ${startX} ${startY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`
  }
  
  // Simple animation effect - just animate all nodes when playing
  React.useEffect(() => {
    if (!isPlaying || !showJourney || !positions) return
    
    // Reset all animations
    setAnimatedProgress({})
    setAnimatedConnections({})
    
    // Animate all nodes in sequence from top to bottom
    const sortedNodes = [...knowledgePoints].sort((a, b) => {
      // Sort by Y position (top to bottom)
      const posA = positions[a.id]
      const posB = positions[b.id]
      if (!posA || !posB) return 0
      return posA.y - posB.y
    })
    
    // Keep track of intervals for cleanup
    const intervals: NodeJS.Timeout[] = []
    const timeouts: NodeJS.Timeout[] = []
    
    // Animate each node
    sortedNodes.forEach((node, index) => {
      const timeout = setTimeout(() => {
        // Animate the node progress
        let nodeProgress = 0
        const nodeInterval = setInterval(() => {
          nodeProgress += 6  // Increased from 5 to 6 (1.2x faster)
          if (nodeProgress > 100) nodeProgress = 100
          
          setAnimatedProgress(prev => ({
            ...prev,
            [node.id]: nodeProgress
          }))
          
          // When node reaches 100%, start animating outgoing connections
          if (nodeProgress >= 100) {
            clearInterval(nodeInterval)
            
            // Find all nodes that depend on this node
            const dependentNodes = knowledgePoints.filter(kp => 
              kp.dependencies?.includes(node.id)
            )
            
            // Animate connections from this node to its dependents
            dependentNodes.forEach(depNode => {
              const connectionKey = `${node.id}-${depNode.id}`
              let connectionProgress = 0
              
              const connectionInterval = setInterval(() => {
                connectionProgress += 2.4 // Increased from 2 to 2.4 (1.2x faster)
                if (connectionProgress > 100) connectionProgress = 100
                
                setAnimatedConnections(prev => ({
                  ...prev,
                  [connectionKey]: connectionProgress
                }))
                
                if (connectionProgress >= 100) {
                  clearInterval(connectionInterval)
                }
              }, 42 / playbackSpeed)  // Reduced from 50 to 42 (1.2x faster)
              
              intervals.push(connectionInterval)
            })
            
            // Check if this is the last node
            if (index === sortedNodes.length - 1) {
              setTimeout(() => {
                pausePlayback()
              }, 1700) // Reduced from 2000 to 1700 (1.2x faster)
            }
          }
        }, 42 / playbackSpeed)  // Reduced from 50 to 42 (1.2x faster)
        
        intervals.push(nodeInterval)
      }, index * 1250 / playbackSpeed) // Reduced from 1500 to 1250 (1.2x faster)
      
      timeouts.push(timeout)
    })
    
    // Cleanup function
    return () => {
      intervals.forEach(clearInterval)
      timeouts.forEach(clearTimeout)
    }
  }, [isPlaying, showJourney, knowledgePoints, positions, playbackSpeed, pausePlayback])
  
  // Don't render until we have a valid container width
  if (containerWidth === 0) {
    return (
      <div ref={containerRef} className={cn("w-full h-full flex items-center justify-center bg-white rounded-lg", className)}>
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div ref={containerRef} className={cn("w-full overflow-hidden bg-white rounded-lg", className)}>
      <svg
        ref={svgRef}
        width={svgDimensions.width}
        height={svgDimensions.height}
        className=""
      >
        {/* Render connections */}
        <g className="connections">
          {connections.map((connection, index) => {
            const fromPos = positions[connection.from]
            const toPos = positions[connection.to]
            
            if (!fromPos || !toPos) return null
            
            const connectionId = `${connection.from}-${connection.to}`
            const isHovered = hoveredConnection === connectionId
            
            // Check if this connection is related to the selected node
            const isRelatedToSelected = selectedNodeId && (
              connection.from === selectedNodeId || connection.to === selectedNodeId
            )
            const isIncoming = selectedNodeId === connection.to
            const isOutgoing = selectedNodeId === connection.from
            
            // Adjust colors based on selection and animation
            let strokeColor = connection.isAchieved ? "#86EFAC" : "#9CA3AF"
            if (selectedNodeId && !isRelatedToSelected) {
              strokeColor = "#E5E7EB" // Dim unrelated connections
            }
            
            // Check if this connection is animated
            const connectionKey = `${connection.from}-${connection.to}`
            const animationProgress = animatedConnections[connectionKey] || 0
            const isAnimated = showJourney && animationProgress > 0
            
            // Check if the source node has reached 100% progress (unlocking the connection)
            const sourceProgress = showJourney && animatedProgress[connection.from] !== undefined 
              ? animatedProgress[connection.from] 
              : connection.fromProgress || 0
            const isUnlocked = sourceProgress >= (connection.requiredElo || 80)
            
            // Get path data - show as locked only if not unlocked by animation
            const pathData = (connection.isLocked && !isUnlocked) ? createPath(fromPos, toPos, true) : null
            const fullPath = createPath(fromPos, toPos)
            
            return (
              <g key={`connection-${index}`}>
                {/* Invisible wider path for better hover detection */}
                <path
                  d={typeof fullPath === 'string' ? fullPath : (fullPath as any).fullPath || ''}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="12"
                  onMouseEnter={() => setHoveredConnection(connectionId)}
                  onMouseLeave={() => setHoveredConnection(null)}
                  style={{ cursor: 'pointer' }}
                />
                
                {(connection.isLocked && !isUnlocked) && pathData && typeof pathData !== 'string' ? (
                  'tooShort' in pathData && pathData.tooShort ? (
                    /* Line too short for lock - show as thick dashed line */
                    <path
                      d={pathData.fullPath}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isRelatedToSelected ? "4" : "3"}
                      strokeDasharray="2 2"
                      className="transition-all duration-300"
                      opacity={selectedNodeId ? (isRelatedToSelected ? 0.8 : 0.2) : 0.5}
                      pointerEvents="none"
                    />
                  ) : (
                    <>
                      {/* First half of the line */}
                      <path
                        d={(pathData as any).firstHalf}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={isRelatedToSelected ? "3" : "2"}
                        className="transition-all duration-300"
                        opacity={selectedNodeId ? (isRelatedToSelected ? 0.8 : 0.2) : 0.5}
                        pointerEvents="none"
                      />
                      
                      {/* Lock icon in the middle */}
                      <g transform={`translate(${(pathData as any).midpoint.x - (pathData as any).lockIconSize / 2}, ${(pathData as any).midpoint.y - (pathData as any).lockIconSize / 2})`} pointerEvents="none">
                        <circle cx={(pathData as any).lockIconSize / 2} cy={(pathData as any).lockIconSize / 2} r={(pathData as any).lockIconSize / 2 + 1} fill="white" stroke="#E5E7EB" strokeWidth="0.5" />
                        <g transform={`translate(${(pathData as any).lockIconSize / 2}, ${(pathData as any).lockIconSize / 2})`}>
                          {/* Minimalistic lock icon */}
                          <path
                            d="M-2.5 -1 L-2.5 -2.5 A2.5 2.5 0 0 1 2.5 -2.5 L2.5 -1 M-3 -1 L3 -1 L3 3 L-3 3 Z"
                            fill="none"
                            stroke="#6B7280"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </g>
                      
                      {/* Second half of the line */}
                      <path
                        d={(pathData as any).secondHalf}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={isRelatedToSelected ? "3" : "2"}
                        className="transition-all duration-300"
                        opacity={selectedNodeId ? (isRelatedToSelected ? 0.8 : 0.2) : 0.5}
                        pointerEvents="none"
                      />
                    </>
                  )
                ) : (
                  <>
                    {/* Normal line without lock */}
                    <path
                      d={typeof fullPath === 'string' ? fullPath : (fullPath as any).fullPath || ''}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isRelatedToSelected ? "3" : "2"}
                      strokeDasharray={connection.type === 'soft' ? "4 4" : "0"}
                      className="transition-all duration-300"
                      opacity={selectedNodeId ? (isRelatedToSelected ? (connection.isAchieved ? 0.9 : 0.7) : 0.2) : (connection.isAchieved ? 0.7 : 0.5)}
                      pointerEvents="none"
                    />
                    
                    {/* Animated gradient overlay for journey */}
                    {isAnimated && (
                      <>
                        {/* Define gradient for this specific connection */}
                        <defs>
                          <linearGradient 
                            id={`gradient-${connectionKey}`} 
                            x1={fromPos.x} 
                            y1={fromPos.y} 
                            x2={toPos.x} 
                            y2={toPos.y}
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0%" stopColor="#7B00FF" />
                            <stop offset={`${animationProgress}%`} stopColor="#7B00FF" />
                            <stop offset={`${animationProgress}%`} stopColor={strokeColor} />
                            <stop offset="100%" stopColor={strokeColor} />
                          </linearGradient>
                        </defs>
                        <path
                          d={typeof fullPath === 'string' ? fullPath : (fullPath as any).fullPath || ''}
                          fill="none"
                          stroke={`url(#gradient-${connectionKey})`}
                          strokeWidth={isRelatedToSelected ? "3" : "2"}
                          strokeDasharray={connection.type === 'soft' ? "4 4" : "0"}
                          className="transition-all duration-300"
                          opacity={0.8}
                          pointerEvents="none"
                        />
                      </>
                    )}
                  </>
                )}
                
                {/* Tooltip on hover */}
                {isHovered && (
                  <g transform={`translate(${pathData && typeof pathData !== 'string' && pathData.midpoint ? pathData.midpoint.x : (fromPos.x + toPos.x) / 2}, ${pathData && typeof pathData !== 'string' && pathData.midpoint ? pathData.midpoint.y - ((pathData as any).lockIconSize ? (pathData as any).lockIconSize / 2 + 20 : 20) : (fromPos.y + toPos.y) / 2 - 20})`}>
                    <rect
                      x="-40"
                      y="-12"
                      width="80"
                      height="24"
                      rx="4"
                      fill="black"
                      fillOpacity="0.8"
                    />
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] fill-white font-medium"
                    >
                      {connection.type === 'hard' ? 'Required' : 'Recommended'}: {connection.requiredElo}%
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </g>
        
        {/* Render knowledge point nodes */}
        {knowledgePoints.map((kp) => {
          const pos = positions[kp.id]
          if (!pos) return null
          
          // Find journey order for this node
          const journeyStep = showJourney && journey ? 
            journey.steps.find(step => step.knowledgePointId === kp.id) : null
          
          // Determine if this node should be animated during playback
          const isAnimating = isPlaying && journeyStep && journeyStep.order === currentStep
          const isCompleted = journeyStep && journeyStep.order < currentStep
          
          // Determine popover side based on incoming and outgoing connections
          let popoverSide: 'top' | 'right' | 'bottom' | 'left' = 'right'
          if (selectedNodeId === kp.id) {
            // Get all connected nodes (both incoming and outgoing)
            const connectedPositions: Array<{x: number, y: number}> = []
            
            // Add positions of dependencies (incoming)
            if (kp.dependencies) {
              kp.dependencies.forEach(depId => {
                const depPos = positions[depId]
                if (depPos) connectedPositions.push(depPos)
              })
            }
            
            // Add positions of nodes that depend on this one (outgoing)
            knowledgePoints.forEach(otherKp => {
              if (otherKp.dependencies?.includes(kp.id)) {
                const otherPos = positions[otherKp.id]
                if (otherPos) connectedPositions.push(otherPos)
              }
            })
            
            if (connectedPositions.length > 0) {
              // Calculate connection density in each quadrant
              const quadrants = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              }
              
              connectedPositions.forEach(connPos => {
                const dx = connPos.x - pos.x
                const dy = connPos.y - pos.y
                
                if (Math.abs(dx) > Math.abs(dy)) {
                  if (dx > 0) quadrants.right++
                  else quadrants.left++
                } else {
                  if (dy > 0) quadrants.bottom++
                  else quadrants.top++
                }
              })
              
              // Choose the side with the least connections
              const minConnections = Math.min(quadrants.top, quadrants.right, quadrants.bottom, quadrants.left)
              if (quadrants.bottom === minConnections) popoverSide = 'bottom'
              else if (quadrants.top === minConnections) popoverSide = 'top'
              else if (quadrants.left === minConnections) popoverSide = 'left'
              else popoverSide = 'right'
            }
          }
          
          return (
            <g 
              key={kp.id}
              transform={`translate(${pos.x - knowledgeNodeSize / 2}, ${pos.y - knowledgeNodeSize / 2})`}
            >
              <foreignObject width={knowledgeNodeSize} height={knowledgeNodeSize}>
                <NodeDetailsPopover
                  node={kp as any}
                  allNodes={knowledgePoints as any}
                  availableIn={availableLessons[kp.id] || []}
                  onLessonClick={onLessonClick}
                  open={selectedNodeId === kp.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      onNodeSelect?.(null)
                    }
                  }}
                  side={popoverSide}
                >
                  <div className="w-full h-full relative">
                    <ProgressNode
                      progress={showJourney && animatedProgress[kp.id] !== undefined ? animatedProgress[kp.id] : kp.progress}
                      size={knowledgeNodeSize}
                      onClick={() => onNodeSelect?.(selectedNodeId === kp.id ? null : kp.id)}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        selectedNodeId === kp.id ? "ring-2 ring-primary scale-110" : "",
                        selectedNodeId && selectedNodeId !== kp.id ? "opacity-50" : "",
                        showJourney && journeyStep ? "ring-2 ring-brand" : "",
                        isAnimating ? "animate-pulse ring-4 ring-brand ring-opacity-50" : ""
                      )}
                      title={kp.title}
                      showLabel={false}
                    />
                  </div>
                </NodeDetailsPopover>
              </foreignObject>
            </g>
          )
        })}
        {/* Legend */}
        <g transform={`translate(${svgDimensions.width - 160}, ${svgDimensions.height - 100})`}>
          <rect x="0" y="0" width="150" height="90" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="1" />
          
          {/* Legend title */}
          <text x="75" y="15" textAnchor="middle" className="text-xs font-medium fill-gray-700">
            Dependencies
          </text>
          
          {/* Soft dependency */}
          <line x1="10" y1="35" x2="40" y2="35" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
          <text x="45" y="39" className="text-[10px] fill-gray-600">
            Recommended
          </text>
          
          {/* Hard dependency (locked) */}
          <line x1="10" y1="55" x2="40" y2="55" stroke="#9CA3AF" strokeWidth="2" opacity="0.5" />
          <g transform="translate(21, 51)">
            <path
              d="M3 4V2.5C3 1.7 3.7 1 4.5 1S6 1.7 6 2.5V4M2 4h5v4H2V4z"
              fill="none"
              stroke="#6B7280"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <text x="45" y="59" className="text-[10px] fill-gray-600">
            Required (locked)
          </text>
          
          {/* Achieved dependency */}
          <line x1="10" y1="75" x2="40" y2="75" stroke="#86EFAC" strokeWidth="2" opacity="0.7" />
          <text x="45" y="79" className="text-[10px] fill-gray-600">
            Achieved
          </text>
        </g>
      </svg>
      
      {/* Journey Playback Controls - Floating */}
      {showJourney && journey && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md border border-border-default p-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={resetPlayback}
              className="h-8 w-8 p-0"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                console.log('[TreeKnowledgeGraph] Play/Pause clicked, isPlaying:', isPlaying)
                if (isPlaying) {
                  pausePlayback()
                } else {
                  startPlayback()
                }
              }}
              className="h-8 px-3"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Play
                </>
              )}
            </Button>
            <div className="flex items-center gap-1 border-l border-border-subtle pl-2">
              <span className="text-xs text-secondary">Speed:</span>
              {[1, 2, 4].map(speed => (
                <Button
                  key={speed}
                  size="sm"
                  variant={playbackSpeed === speed ? "primary" : "ghost"}
                  onClick={() => setPlaybackSpeed(speed)}
                  className="h-6 w-6 p-0 text-xs"
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}