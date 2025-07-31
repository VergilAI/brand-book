'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, BarChart3, Target, BookOpen, Clock, Award, Calendar, CalendarDays, Zap, Play } from 'lucide-react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/lib/lms/new-course-types'

interface KnowledgePointAnalyticsProps {
  lesson: Lesson
  allLessons?: any[]
  onNavigateToLesson?: (lesson: any) => void
  selectedLesson?: Lesson | null
  onLearnClick?: (lesson: Lesson) => void
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

export function KnowledgePointAnalytics({ lesson, allLessons = [], onNavigateToLesson, selectedLesson, onLearnClick }: KnowledgePointAnalyticsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedKnowledgePoint, setSelectedKnowledgePoint] = useState<string | null>(null)
  const [hoveredKnowledgePoint, setHoveredKnowledgePoint] = useState<string | null>(null)
  const [testDate, setTestDate] = useState('')
  const [showTestPlan, setShowTestPlan] = useState(false)
  const canvasRef = useRef<SVGSVGElement>(null)

  const sidebarWidth = isCollapsed ? 0 : 380

  // Clear selected knowledge point when lesson selection changes
  useEffect(() => {
    setSelectedKnowledgePoint(null)
  }, [selectedLesson])

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
    const baseSize = 14
    const maxSize = 22
    const sizeMultiplier = proficiency / 100
    return baseSize + (maxSize - baseSize) * sizeMultiplier
  }

  // Get all knowledge points from all lessons with lesson context
  const getAllKnowledgePoints = () => {
    const allKnowledgePoints: any[] = []
    
    allLessons.forEach((lesson: any) => {
      lesson.knowledgePoints.forEach((kp: any) => {
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

  // Get knowledge points for the selected lesson only
  const getSelectedLessonKnowledgePoints = () => {
    if (!selectedLesson) return []
    return selectedLesson.knowledgePoints.map(kp => kp.id)
  }

  // Calculate positions for knowledge points in a circular layout
  const calculateKnowledgePointPositions = () => {
    const centerX = 200
    const centerY = 180 // Moved down to provide more space at top
    const allKPs = getAllKnowledgePoints()
    
    // Calculate minimum radius to prevent overlap
    // Each node needs space for its max diameter (44px) plus some padding
    const maxNodeDiameter = 44 + 10 // max node size + padding
    const minRadius = Math.max(120, (allKPs.length * maxNodeDiameter) / (2 * Math.PI))
    const radius = Math.min(minRadius, 140) // Cap to ensure all nodes fit in viewport with padding
    
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
  const selectedLessonKPIds = getSelectedLessonKnowledgePoints()

  // Render knowledge point graph
  const renderKnowledgePointGraph = () => {
    const centerX = 200
    const centerY = 180 // Match the positioning function

    return (
      <div className="relative">
        <svg
          ref={canvasRef}
          className="w-full h-80"
          viewBox="0 0 400 360"
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
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
          <rect width="400" height="360" fill="url(#dotGrid)" opacity="0.3"/>
          
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
            const isInSelectedLesson = selectedLesson ? selectedLessonKPIds.includes(pos.id) : true
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
                stroke={isConnected ? getProficiencyColor(pos.proficiency) : selectedLesson ? (isInSelectedLesson ? "#7B00FF" : "#9CA3AF") : getProficiencyColor(pos.proficiency)}
                strokeWidth={isConnected ? "2" : selectedLesson && isInSelectedLesson ? "1.5" : "1"}
                opacity={isConnected ? "0.8" : selectedLesson ? (isInSelectedLesson ? "0.6" : "0.2") : "0.4"}
                className="transition-all duration-300"
                style={{ willChange: 'opacity, stroke-width' }}
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
            const isInSelectedLesson = selectedLesson ? selectedLessonKPIds.includes(pos.id) : true
            const opacity = isSelected || isHovered ? 0.8 : selectedLesson ? (isInSelectedLesson ? 0.6 : 0.15) : 0.4
            const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : isInSelectedLesson ? 2 : 1
            
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
                    transformOrigin: `${pos.x}px ${pos.y}px`,
                    willChange: isHovered ? 'transform' : 'auto'
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
                  stroke={selectedLesson ? (isInSelectedLesson ? "#7B00FF" : "#9CA3AF") : getProficiencyColor(pos.proficiency)}
                  strokeWidth={strokeWidth}
                  className="cursor-pointer transition-all duration-300 ease-out pointer-events-none"
                  style={{
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transformOrigin: `${pos.x}px ${pos.y}px`
                  }}
                />
                
                {/* Drop shadow for text */}
                <text
                  x={pos.x + 1}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={nodeSize > 18 ? "12" : "10"}
                  fontWeight="bold"
                  fill="rgba(0,0,0,0.5)"
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
                  fontSize={nodeSize > 18 ? "12" : "10"}
                  fontWeight="bold"
                  fill={selectedLesson ? (isInSelectedLesson ? "#1F2937" : "#4B5563") : "#1F2937"}
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
                    <stop offset="0%" stopColor={selectedLesson ? (isInSelectedLesson ? "#7B00FF" : "#9CA3AF") : getProficiencyColor(pos.proficiency)} stopOpacity={opacity + 0.1} />
                    <stop offset="100%" stopColor={selectedLesson ? (isInSelectedLesson ? "#7B00FF" : "#9CA3AF") : getProficiencyColor(pos.proficiency)} stopOpacity={opacity} />
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

  // Test planning logic
  const generateTestPlan = () => {
    if (!testDate) return []
    
    const targetDate = new Date(testDate)
    const today = new Date()
    const daysUntilTest = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilTest <= 0) return []
    
    // Get lessons that need work (those with knowledge points < 80% proficiency)
    const lessonsNeedingWork = allLessons.filter((lesson: any) => {
      const avgProficiency = lesson.knowledgePoints.length > 0
        ? lesson.knowledgePoints.reduce((acc: number, kp: any) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length
        : 0
      return avgProficiency < 80
    }).sort((a: any, b: any) => {
      // Sort by priority: lowest proficiency first
      const avgA = a.knowledgePoints.reduce((acc: number, kp: any) => acc + kp.proficiency, 0) / a.knowledgePoints.length
      const avgB = b.knowledgePoints.reduce((acc: number, kp: any) => acc + kp.proficiency, 0) / b.knowledgePoints.length
      return avgA - avgB
    })
    
    // Distribute lessons across available days
    const plan = []
    const lessonsPerDay = Math.ceil(lessonsNeedingWork.length / Math.max(daysUntilTest - 1, 1))
    
    for (let day = 0; day < Math.min(daysUntilTest - 1, lessonsNeedingWork.length); day++) {
      const studyDate = new Date(today)
      studyDate.setDate(studyDate.getDate() + day + 1)
      
      const startIndex = day * lessonsPerDay
      const endIndex = Math.min(startIndex + lessonsPerDay, lessonsNeedingWork.length)
      const dayLessons = lessonsNeedingWork.slice(startIndex, endIndex)
      
      if (dayLessons.length > 0) {
        plan.push({
          date: studyDate,
          lessons: dayLessons,
          totalTime: dayLessons.reduce((acc, lesson) => acc + lesson.estimatedTime, 0)
        })
      }
    }
    
    // Add final review day
    if (daysUntilTest > 1) {
      const reviewDate = new Date(targetDate)
      reviewDate.setDate(reviewDate.getDate() - 1)
      plan.push({
        date: reviewDate,
        lessons: [],
        isReviewDay: true,
        totalTime: 60 // 1 hour review
      })
    }
    
    return plan
  }

  const testPlan = generateTestPlan()

  // Mock data for lesson analytics
  const getLessonAnalytics = (lesson: Lesson) => {
    const averageProficiency = lesson.knowledgePoints.length > 0
      ? Math.round(lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length)
      : 0

    // Mock interaction data
    const lastInteracted = new Date()
    lastInteracted.setDate(lastInteracted.getDate() - Math.floor(Math.random() * 30))

    // Recommend learning method based on proficiency
    const getRecommendedMethod = () => {
      if (averageProficiency < 30) return { method: 'Written Material', reason: 'Start with fundamentals' }
      if (averageProficiency < 60) return { method: 'Flashcards', reason: 'Reinforce key concepts' }
      if (averageProficiency < 80) return { method: 'Case Study', reason: 'Apply knowledge practically' }
      return { method: 'Timed Test', reason: 'Validate mastery' }
    }

    const weakestKnowledgePoints = lesson.knowledgePoints
      .filter(kp => kp.proficiency < 60)
      .sort((a, b) => a.proficiency - b.proficiency)
      .slice(0, 3)

    const strongestKnowledgePoints = lesson.knowledgePoints
      .filter(kp => kp.proficiency >= 80)
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 3)

    return {
      averageProficiency,
      lastInteracted,
      recommendedMethod: getRecommendedMethod(),
      weakestKnowledgePoints,
      strongestKnowledgePoints,
      timeToMastery: Math.max(1, Math.ceil((100 - averageProficiency) / 10)), // days
      difficultyLevel: averageProficiency > 70 ? 'Advanced' : averageProficiency > 40 ? 'Intermediate' : 'Beginner'
    }
  }

  const lessonAnalytics = selectedLesson ? getLessonAnalytics(selectedLesson) : null

  const handleGoogleCalendarIntegration = () => {
    testPlan.forEach((day, index) => {
      const startTime = new Date(day.date)
      startTime.setHours(9, 0, 0, 0) // Default to 9 AM
      
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + day.totalTime)
      
      const title = day.isReviewDay 
        ? 'AI Fundamentals - Final Review'
        : `AI Fundamentals Study - ${day.lessons.length} lesson${day.lessons.length > 1 ? 's' : ''}`
      
      const description = day.isReviewDay
        ? 'Final review session before the AI Fundamentals test'
        : `Study sessions: ${day.lessons.map(l => l.title).join(', ')}`
      
      // Create Google Calendar URL
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(description)}&location=Online%20Learning`
      
      window.open(googleCalendarUrl, '_blank')
    })
  }


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
          "border-l border-gray-200 bg-vergil-off-white/30 transition-all duration-300 overflow-hidden h-screen",
          isCollapsed ? "w-0" : "w-96"
        )}
      >

      {!isCollapsed && (
        <div className="p-4 h-full overflow-y-auto space-y-4 flex flex-col will-change-scroll" style={{ transform: 'translateZ(0)', WebkitOverflowScrolling: 'touch' }}>
          {/* Header */}
          <div className="pt-8">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-vergil-purple" />
              <h3 className="text-sm font-semibold text-vergil-off-black">
                {selectedLesson ? 'Lesson Analytics' : 'Platform Analytics'}
              </h3>
            </div>
            <p className="text-xs text-vergil-off-black/60">
              {selectedLesson 
                ? `Detailed insights for "${selectedLesson.title}"`
                : 'Complete knowledge map across all lessons'
              }
            </p>
          </div>

          {/* Knowledge Point Graph - Moved to top */}
          <Card variant="outlined" className="p-3 flex-shrink-0">
            <h4 className="text-sm font-medium text-vergil-off-black mb-3">
              Knowledge Point Map
              {selectedLesson && (
                <span className="text-vergil-purple"> • {selectedLesson.title} highlighted</span>
              )}
            </h4>
            {renderKnowledgePointGraph()}
          </Card>

          {/* Lesson-Specific Analytics */}
          {selectedLesson && lessonAnalytics && (
            <Card variant="outlined" className="p-3 bg-vergil-purple/5 border-vergil-purple/20">
              <div className="space-y-3">
                {/* Lesson Overview */}
                <div>
                  <h4 className="text-sm font-semibold text-vergil-off-black mb-2">{selectedLesson.title}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded p-2">
                      <div className="font-medium text-vergil-off-black">Average Score</div>
                      <div className={cn("font-bold", 
                        lessonAnalytics.averageProficiency >= 80 ? 'text-emerald-600' :
                        lessonAnalytics.averageProficiency >= 60 ? 'text-yellow-600' :
                        lessonAnalytics.averageProficiency >= 40 ? 'text-orange-600' : 'text-red-600'
                      )}>
                        {lessonAnalytics.averageProficiency}%
                      </div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="font-medium text-vergil-off-black">Last Studied</div>
                      <div className="text-vergil-off-black/60">
                        {lessonAnalytics.lastInteracted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="font-medium text-vergil-off-black">Difficulty</div>
                      <div className="text-vergil-off-black/60">{lessonAnalytics.difficultyLevel}</div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="font-medium text-vergil-off-black">Est. Mastery</div>
                      <div className="text-vergil-off-black/60">{lessonAnalytics.timeToMastery} days</div>
                    </div>
                  </div>
                </div>

                {/* Knowledge Points Breakdown */}
                <div>
                  <h5 className="text-xs font-medium text-vergil-off-black mb-2">Knowledge Points ({selectedLesson.knowledgePoints.length})</h5>
                  <div className="space-y-2 max-h-32 overflow-y-auto will-change-scroll" style={{ transform: 'translateZ(0)' }}>
                    {selectedLesson.knowledgePoints.map((kp) => (
                      <div key={kp.id} className="bg-white rounded p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-vergil-off-black">{kp.title}</span>
                          <Badge className={cn("text-xs", 
                            kp.proficiency >= 80 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            kp.proficiency >= 60 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            kp.proficiency >= 40 ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-red-100 text-red-700 border-red-200'
                          )}>
                            {kp.proficiency}%
                          </Badge>
                        </div>
                        <div className="text-vergil-off-black/60 mt-1">{kp.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Learning Method - Moved to bottom */}
                <div className="bg-white rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-3 h-3 text-vergil-purple" />
                    <span className="text-xs font-medium text-vergil-off-black">Recommended Method</span>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-vergil-purple">{lessonAnalytics.recommendedMethod.method}</div>
                    <div className="text-vergil-off-black/60">{lessonAnalytics.recommendedMethod.reason}</div>
                  </div>
                </div>
              </div>
            </Card>
          )}


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

          {/* Only show these sections when no lesson is selected */}
          {!selectedLesson && (
            <>
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

          {/* Test Planner */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-vergil-purple" />
              <h4 className="text-sm font-medium text-vergil-off-black">Test Planner</h4>
            </div>

            <Card variant="outlined" className="p-3">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-vergil-off-black mb-1">
                    Test Date
                  </label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-vergil-purple/20 focus:border-vergil-purple"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {testDate && (
                  <>
                    <div className="text-xs text-vergil-off-black/60">
                      {(() => {
                        const days = Math.ceil((new Date(testDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        return days <= 0 ? 'Please select a future date' : `${days} days to prepare`
                      })()}
                    </div>

                    {testPlan.length > 0 && (
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          onClick={() => setShowTestPlan(!showTestPlan)}
                          className="w-full text-xs bg-vergil-purple hover:bg-vergil-purple-lighter"
                        >
                          <CalendarDays className="w-3 h-3 mr-1" />
                          {showTestPlan ? 'Hide Plan' : 'Generate Study Plan'}
                        </Button>

                        {showTestPlan && (
                          <div className="space-y-2">
                            <div className="max-h-40 overflow-y-auto space-y-2 will-change-scroll" style={{ transform: 'translateZ(0)' }}>
                              {testPlan.map((day, index) => (
                                <div key={index} className="bg-white rounded p-2 text-xs border border-gray-100">
                                  <div className="font-medium text-vergil-off-black">
                                    {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                  </div>
                                  {day.isReviewDay ? (
                                    <div className="text-vergil-off-black/60">Final Review (1h)</div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="text-vergil-off-black/60">
                                        {day.lessons.length} lesson{day.lessons.length > 1 ? 's' : ''} ({Math.round(day.totalTime / 60 * 10) / 10}h)
                                      </div>
                                      <div className="text-vergil-off-black/50 text-xs">
                                        {day.lessons.slice(0, 2).map(l => l.title).join(', ')}
                                        {day.lessons.length > 2 && ` +${day.lessons.length - 2} more`}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            <Button
                              size="sm"
                              onClick={handleGoogleCalendarIntegration}
                              className="w-full text-xs bg-blue-600 hover:bg-blue-700"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Smart Calendar (Google)
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>

            </>
          )}

          {/* Learn Button - Only show when lesson is selected */}
          {selectedLesson && onLearnClick && (
            <div className="mt-auto pt-4">
              <Button
                onClick={() => onLearnClick(selectedLesson)}
                className="w-full bg-vergil-purple hover:bg-vergil-purple-lighter text-white"
                size="md"
              >
                <Play className="w-4 h-4 mr-2" />
                Learn
              </Button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}