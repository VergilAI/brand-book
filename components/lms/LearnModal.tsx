'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Clock, Brain, Award, CheckCircle, Play } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GameTypeCard } from './game-type-card'
import { gameTypes } from '@/lib/lms/game-types'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/lib/lms/new-course-types'

interface LearnModalProps {
  lesson: Lesson
  isOpen: boolean
  onClose: () => void
  onStartLearning?: (gameTypeId: string) => void
}

export function LearnModal({ lesson, isOpen, onClose, onStartLearning }: LearnModalProps) {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Store original body styles
      const originalOverflow = document.body.style.overflow
      const originalPosition = document.body.style.position
      const originalTop = document.body.style.top
      const originalWidth = document.body.style.width
      
      // Get current scroll position
      const scrollY = window.scrollY
      
      // Prevent background scrolling and interaction
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
    }
  }, [isOpen])

  if (!isOpen) return null

  // Filter game types to only show available ones for this lesson
  const availableGameTypes = gameTypes.filter(gameType => 
    lesson.availableGameTypes.includes(gameType.id)
  )

  // Determine recommended game type based on average proficiency
  const avgProficiency = lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length
  const recommendedGameTypeId = avgProficiency < 40 ? 'written-material' : 
                                avgProficiency < 70 ? 'flashcards' : 
                                'millionaire'

  const selectedGameTypeData = gameTypes.find(gt => gt.id === selectedGameType)

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'text-emerald-600'
    if (proficiency >= 60) return 'text-yellow-600'
    if (proficiency >= 40) return 'text-orange-600'
    if (proficiency > 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const handleStartLearning = () => {
    if (selectedGameType) {
      if (onStartLearning) {
        onStartLearning(selectedGameType)
      } else {
        alert(`Starting lesson "${lesson.title}" with ${selectedGameTypeData?.name}`)
        onClose()
      }
    }
  }

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] overflow-hidden"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Card 
          className="w-full max-w-6xl max-h-[90vh] flex flex-col my-4 overflow-hidden bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-vergil-off-black">{lesson.title}</h2>
                {lesson.completed && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-vergil-off-black/70 mb-3">{lesson.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-vergil-off-black/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(lesson.estimatedTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  <span>{lesson.knowledgePoints.length} knowledge points</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>{availableGameTypes.length} learning methods</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-vergil-off-black/60 hover:text-vergil-off-black"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <h3 className="text-base font-semibold text-vergil-off-black mb-4">
                Choose Your Learning Method
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 pt-6">
            {availableGameTypes.map((gameType) => {
              // Disable audio and video materials for now
              const isAvailable = !['video', 'audio-material'].includes(gameType.id)
              
              return (
                <GameTypeCard
                  key={gameType.id}
                  gameType={gameType}
                  isAvailable={isAvailable}
                  isRecommended={isAvailable && gameType.id === recommendedGameTypeId && lesson.availableGameTypes.includes(recommendedGameTypeId)}
                  onClick={isAvailable ? () => setSelectedGameType(gameType.id) : undefined}
                  className={cn(
                    "transition-all",
                    isAvailable && "cursor-pointer",
                    selectedGameType === gameType.id && "ring-2 ring-vergil-purple ring-offset-2"
                  )}
                />
              )
            })}
            </div>

            </div>

            {/* Knowledge Points Summary Panel */}
            <div className="w-64 border-l border-gray-200 pl-4">
              <h4 className="text-sm font-semibold text-vergil-off-black mb-4">Lesson Progress</h4>
              
              {/* Overall Stats */}
              <Card variant="outlined" className="p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-vergil-off-black">Average Proficiency</span>
                  <span className={cn("text-lg font-bold", getProficiencyColor(
                    lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length
                  ))}>
                    {Math.round(lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round(lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length)}%`,
                      backgroundColor: lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length >= 80 ? '#10B981' :
                        lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length >= 60 ? '#F59E0B' :
                        lesson.knowledgePoints.reduce((acc, kp) => acc + kp.proficiency, 0) / lesson.knowledgePoints.length >= 40 ? '#F97316' : '#EF4444'
                    }}
                  />
                </div>
              </Card>

              {/* Knowledge Points List */}
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-vergil-off-black mb-2">Knowledge Points in this Lesson</h5>
                <div className="space-y-1.5 max-h-96 overflow-y-auto">
                  {lesson.knowledgePoints.map((kp) => (
                    <div key={kp.id} className="p-2 rounded border border-gray-200 hover:border-vergil-purple/30 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-vergil-off-black truncate">{kp.title}</span>
                        <span className={cn("text-xs font-medium flex-shrink-0", 
                          kp.proficiency >= 80 ? 'text-emerald-600' :
                          kp.proficiency >= 60 ? 'text-yellow-600' :
                          kp.proficiency >= 40 ? 'text-orange-600' :
                          'text-red-600'
                        )}>
                          {kp.proficiency}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-vergil-off-white/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-vergil-off-black/60">
              {selectedGameType 
                ? `Ready to start learning with ${selectedGameTypeData?.name}`
                : 'Select a learning method to continue'
              }
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleStartLearning}
                disabled={!selectedGameType}
                className="bg-vergil-purple hover:bg-vergil-purple-lighter"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  )

  if (typeof window === 'undefined') return null
  
  return createPortal(modalContent, document.body)
}