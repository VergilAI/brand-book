'use client'

import { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, BarChart3, Target, BookOpen, Clock, Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/lib/lms/new-course-types'

interface KnowledgePointAnalyticsProps {
  lesson: Lesson
  allLessons?: any[]
  onNavigateToLesson?: (lesson: any) => void
}

// Mock data for where knowledge points can be learned
const mockLearningPaths = {
  'kp-1': [
    { lessonId: 'lesson-1-1', lessonTitle: 'What is Artificial Intelligence?', chapterTitle: 'Introduction to AI', gameTypes: ['written-material', 'video'] },
    { lessonId: 'lesson-1-2', lessonTitle: 'Search and Problem Solving', chapterTitle: 'Introduction to AI', gameTypes: ['flashcards', 'case-study'] }
  ],
  'kp-2': [
    { lessonId: 'lesson-1-1', lessonTitle: 'What is Artificial Intelligence?', chapterTitle: 'Introduction to AI', gameTypes: ['written-material', 'video'] },
    { lessonId: 'lesson-2-1', lessonTitle: 'Learning from Data', chapterTitle: 'Machine Learning Basics', gameTypes: ['flashcards', 'crossword'] }
  ],
  'kp-4': [
    { lessonId: 'lesson-1-2', lessonTitle: 'Search and Problem Solving', chapterTitle: 'Introduction to AI', gameTypes: ['written-material', 'timed-test'] },
    { lessonId: 'lesson-2-2', lessonTitle: 'Neural Networks Introduction', chapterTitle: 'Machine Learning Basics', gameTypes: ['case-study', 'role-playing'] }
  ]
}

export function KnowledgePointAnalytics({ lesson, allLessons = [], onNavigateToLesson }: KnowledgePointAnalyticsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedKnowledgePoint, setSelectedKnowledgePoint] = useState<string | null>(null)
  const [hoveredKnowledgePoint, setHoveredKnowledgePoint] = useState<string | null>(null)
  const canvasRef = useRef<SVGSVGElement>(null)

  const sidebarWidth = isCollapsed ? 0 : 380

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return '#10B981' // green
    if (proficiency >= 60) return '#F59E0B' // yellow  
    if (proficiency >= 40) return '#F97316' // orange
    if (proficiency > 0) return '#EF4444' // red
    return '#6B7280' // gray
  }

  const getStatusLabel = (proficiency: number) => {
    if (proficiency >= 80) return 'Mastered'
    if (proficiency >= 60) return 'Proficient'
    if (proficiency >= 40) return 'Learning'
    if (proficiency > 0) return 'Beginner'
    return 'Not Started'
  }

  const getNodeSize = (proficiency: number) => {
    const baseSize = 12
    const maxSize = 20
    const sizeMultiplier = proficiency / 100
    return baseSize + (maxSize - baseSize) * sizeMultiplier
  }

  // Get all knowledge points from all lessons with full lesson context
  const getAllKnowledgePoints = () => {
    const allKnowledgePoints = []
    allLessons.forEach(lesson => {
      lesson.knowledgePoints.forEach(kp => {
        allKnowledgePoints.push({
          ...kp,
          lessonTitle: lesson.title,
          chapterTitle: lesson.chapterTitle || 'Unknown Chapter',
          lessonId: lesson.id,
          lesson: lesson // Include full lesson object for navigation
        })
      })
    })
    return allKnowledgePoints
  }

  // Calculate positions for knowledge points in a circular layout
  const calculateKnowledgePointPositions = () => {
    const centerX = 200
    const centerY = 130
    const radius = 130
    const allKPs = getAllKnowledgePoints()
    
    return allKPs.map((kp, index) => {
      const angle = (index / allKPs.length) * 2 * Math.PI - Math.PI / 2
      return {
        ...kp,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      }
    })
  }

  const positions = calculateKnowledgePointPositions()

  // Render knowledge point graph
  const renderKnowledgePointGraph = () => {
    const centerX = 200
    const centerY = 130

    return (
      <div className="relative">
        <svg
          ref={canvasRef}
          className="w-full h-72"
          viewBox="0 0 400 300"
        >
          {/* Subtle background pattern */}
          <defs>
            <pattern id="dotGrid" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="10" cy="10" r="1" fill="#F3F4F6" opacity="0.5"/>
            </pattern>
            <radialGradient id="centerGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#7B00FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#7B00FF" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          
          {/* Background pattern */}
          <rect width="400" height="300" fill="url(#dotGrid)" opacity="0.3"/>
          
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="135"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity="0.3"
          />

          {/* Connection lines */}
          {positions.map((pos, index) => {
            const isConnected = selectedKnowledgePoint === pos.id || hoveredKnowledgePoint === pos.id
            const nodeSize = getNodeSize(pos.proficiency)
            const centerNodeSize = 22
            
            // Calculate direction vector from center to node
            const dx = pos.x - centerX
            const dy = pos.y - centerY
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            // Normalize direction vector
            const dirX = dx / distance
            const dirY = dy / distance
            
            // Calculate start point (edge of center node)
            const startX = centerX + dirX * centerNodeSize
            const startY = centerY + dirY * centerNodeSize
            
            // Calculate end point (edge of target node)
            const endX = pos.x - dirX * nodeSize
            const endY = pos.y - dirY * nodeSize
            
            return (
              <line
                key={`line-${pos.id}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={isConnected ? getProficiencyColor(pos.proficiency) : "#E5E7EB"}
                strokeWidth={isConnected ? "2" : "1"}
                opacity={isConnected ? "0.6" : "0.2"}
                className="transition-all duration-300"
              />
            )
          })}

          {/* Central lesson node */}
          <circle
            cx={centerX + 1}
            cy={centerY + 1}
            r="22"
            fill="rgba(0,0,0,0.08)"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r="22"
            fill="url(#centerGradient)"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r="22"
            fill="none"
            stroke="#7B00FF"
            strokeWidth="2.5"
            opacity="0.8"
          />
          <BookOpen 
            x={centerX - 9} 
            y={centerY - 9} 
            width="18" 
            height="18" 
            className="text-vergil-purple opacity-90"
          />

          {/* Knowledge point nodes */}
          {positions.map((pos) => {
            const nodeSize = getNodeSize(pos.proficiency)
            const isHovered = hoveredKnowledgePoint === pos.id
            const isSelected = selectedKnowledgePoint === pos.id
            const opacity = isSelected || isHovered ? 0.4 : 0.15
            const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 2
            
            return (
              <g key={pos.id}>
                {/* Drop shadow */}
                <circle
                  cx={pos.x + 1}
                  cy={pos.y + 1}
                  r={nodeSize}
                  fill="rgba(0,0,0,0.1)"
                  className="pointer-events-none"
                />
                
                {/* Node background with gradient */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeSize}
                  fill={`url(#gradient-${pos.id})`}
                  className="cursor-pointer transition-all duration-300 ease-out"
                  style={{
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transformOrigin: `${pos.x}px ${pos.y}px`
                  }}
                  onClick={() => setSelectedKnowledgePoint(
                    selectedKnowledgePoint === pos.id ? null : pos.id
                  )}
                  onMouseEnter={() => setHoveredKnowledgePoint(pos.id)}
                  onMouseLeave={() => setHoveredKnowledgePoint(null)}
                />
                
                {/* Node border */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeSize}
                  fill="none"
                  stroke={getProficiencyColor(pos.proficiency)}
                  strokeWidth={strokeWidth}
                  className="cursor-pointer transition-all duration-300 ease-out pointer-events-none"
                  style={{
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transformOrigin: `${pos.x}px ${pos.y}px`
                  }}
                />
                
                {/* Drop shadow for text */}
                <text
                  x={pos.x + 0.5}
                  y={pos.y + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={nodeSize > 16 ? "11" : "9"}
                  fontWeight="bold"
                  fill="rgba(0,0,0,0.3)"
                  className="pointer-events-none transition-all duration-300"
                  style={{
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transformOrigin: `${pos.x}px ${pos.y}px`
                  }}
                >
                  {pos.proficiency}%
                </text>
                
                {/* Proficiency percentage inside node */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={nodeSize > 16 ? "11" : "9"}
                  fontWeight="bold"
                  fill="#000000"
                  className="pointer-events-none transition-all duration-300"
                  style={{
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transformOrigin: `${pos.x}px ${pos.y}px`
                  }}
                >
                  {pos.proficiency}%
                </text>

                {/* Gradient definitions */}
                <defs>
                  <radialGradient id={`gradient-${pos.id}`} cx="30%" cy="30%">
                    <stop offset="0%" stopColor={getProficiencyColor(pos.proficiency)} stopOpacity={opacity + 0.1} />
                    <stop offset="100%" stopColor={getProficiencyColor(pos.proficiency)} stopOpacity={opacity} />
                  </radialGradient>
                </defs>
              </g>
            )
          })}
        </svg>


        {/* Legend */}
        <div className="absolute bottom-1 left-2 text-xs text-vergil-off-black/50">
          Click nodes to see learning paths
        </div>
      </div>
    )
  }

  // Calculate platform statistics
  const allKPs = getAllKnowledgePoints()
  const averageProficiency = allKPs.length > 0
    ? Math.round(allKPs.reduce((acc, kp) => acc + kp.proficiency, 0) / allKPs.length)
    : 0

  const masteredPoints = allKPs.filter(kp => kp.proficiency >= 80).length
  const learningPoints = allKPs.filter(kp => kp.proficiency >= 40 && kp.proficiency < 80).length
  const strugglingPoints = allKPs.filter(kp => kp.proficiency < 40).length


  return (
    <div className="relative">
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 -left-6 z-10 bg-white shadow-sm border border-gray-200"
      >
        {isCollapsed ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>

      <div 
        className={cn(
          "border-l border-gray-200 bg-vergil-off-white/30 transition-all duration-300 overflow-hidden",
          isCollapsed ? "w-0" : "w-96"
        )}
      >

      {!isCollapsed && (
        <div className="p-4 h-full overflow-y-auto space-y-4">
          {/* Header */}
          <div className="pt-8">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-vergil-purple" />
              <h3 className="text-sm font-semibold text-vergil-off-black">Platform Analytics</h3>
            </div>
            <p className="text-xs text-vergil-off-black/60">
              Complete knowledge map across all lessons
            </p>
          </div>

          {/* Knowledge Point Graph */}
          <Card variant="outlined" className="p-3">
            <h4 className="text-sm font-medium text-vergil-off-black mb-3">Knowledge Point Map</h4>
            {renderKnowledgePointGraph()}
          </Card>

          {/* Selected Knowledge Point Details */}
          {selectedKnowledgePoint && (
            <Card variant="outlined" className="p-3 bg-vergil-purple/5 border-vergil-purple/20">
              {(() => {
                const kp = allKPs.find(k => k.id === selectedKnowledgePoint)
                
                return kp ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-vergil-off-black">{kp.title}</h4>
                      <p className="text-xs text-vergil-off-black/70">{kp.description}</p>
                      <Badge className={cn("text-xs mt-2", 
                        kp.proficiency >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        kp.proficiency >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        kp.proficiency >= 40 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      )}>
                        {getStatusLabel(kp.proficiency)} ({kp.proficiency}%)
                      </Badge>
                    </div>

                    <div>
                      <h5 className="text-xs font-medium text-vergil-off-black mb-2">Learn this in:</h5>
                      <div 
                        className="text-xs bg-white rounded p-3 border border-gray-200 hover:border-vergil-purple hover:bg-vergil-purple/5 cursor-pointer transition-all"
                        onClick={() => {
                          if (onNavigateToLesson && kp.lesson) {
                            onNavigateToLesson(kp.lesson)
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-vergil-off-black">{kp.lessonTitle}</div>
                            <div className="text-vergil-off-black/60">{kp.chapterTitle}</div>
                          </div>
                          <Button 
                            size="sm" 
                            className="text-xs py-1 px-2 h-6 bg-vergil-purple hover:bg-vergil-purple-lighter"
                          >
                            Learn
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
              })()}
            </Card>
          )}

          {/* Lesson Statistics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-vergil-purple" />
              <h4 className="text-sm font-medium text-vergil-off-black">Lesson Statistics</h4>
            </div>

            {/* Overall Progress */}
            <Card variant="outlined" className="p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-vergil-off-black">Average Proficiency</span>
                <span className="text-lg font-bold" style={{ color: getProficiencyColor(averageProficiency) }}>
                  {averageProficiency}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${averageProficiency}%`,
                    backgroundColor: getProficiencyColor(averageProficiency)
                  }}
                />
              </div>
            </Card>

            {/* Knowledge Point Breakdown */}
            <div className="grid grid-cols-3 gap-2">
              <Card variant="outlined" className="p-2 text-center">
                <div className="text-lg font-bold text-emerald-600">{masteredPoints}</div>
                <div className="text-xs text-vergil-off-black/60">Mastered</div>
              </Card>
              <Card variant="outlined" className="p-2 text-center">
                <div className="text-lg font-bold text-orange-600">{learningPoints}</div>
                <div className="text-xs text-vergil-off-black/60">Learning</div>
              </Card>
              <Card variant="outlined" className="p-2 text-center">
                <div className="text-lg font-bold text-red-600">{strugglingPoints}</div>
                <div className="text-xs text-vergil-off-black/60">Struggling</div>
              </Card>
            </div>
          </div>


          {/* Platform Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-vergil-purple" />
              <h4 className="text-sm font-medium text-vergil-off-black">Platform Stats</h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded p-2">
                <div className="font-medium text-vergil-off-black">Total Lessons</div>
                <div className="text-vergil-off-black/60">{allLessons.length} lessons</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-medium text-vergil-off-black">Knowledge Points</div>
                <div className="text-vergil-off-black/60">{allKPs.length} concepts</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-medium text-vergil-off-black">Completed</div>
                <div className="text-vergil-off-black/60">{allLessons.filter(l => l.completed).length} lessons</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-medium text-vergil-off-black">Average Score</div>
                <div className="text-vergil-off-black/60">{averageProficiency}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}