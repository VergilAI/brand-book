'use client'

import { useState } from 'react'
import { X, Clock, Brain, Award, CheckCircle, Play } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { GameTypeCard } from './game-type-card'
import { gameTypes } from '@/lib/lms/game-types'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/lib/lms/new-course-types'

interface LearnModalProps {
  lesson: Lesson
  isOpen: boolean
  onClose: () => void
}

export function LearnModal({ lesson, isOpen, onClose }: LearnModalProps) {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null)

  if (!isOpen) return null

  // Filter game types to only show available ones for this lesson
  const availableGameTypes = gameTypes.filter(gameType => 
    lesson.availableGameTypes.includes(gameType.id)
  )

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
      alert(`Starting lesson "${lesson.title}" with ${selectedGameTypeData?.name}`)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
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
          <h3 className="text-base font-semibold text-vergil-off-black mb-4">
            Choose Your Learning Method
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {availableGameTypes.map((gameType) => (
              <GameTypeCard
                key={gameType.id}
                gameType={gameType}
                isAvailable={true}
                onClick={() => setSelectedGameType(gameType.id)}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedGameType === gameType.id && "ring-2 ring-vergil-purple ring-offset-2"
                )}
              />
            ))}
          </div>

          {/* Selected method details */}
          {selectedGameTypeData && (
            <Card variant="outlined" className="p-4 bg-vergil-purple/5 border-vergil-purple/20">
              <div className="flex items-start gap-3">
                <selectedGameTypeData.icon className="w-6 h-6 text-vergil-purple mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-vergil-off-black mb-1">
                    {selectedGameTypeData.name}
                  </h4>
                  <p className="text-sm text-vergil-off-black/70 mb-3">
                    {selectedGameTypeData.description}
                  </p>
                  
                  <div className="flex gap-2">
                    {selectedGameTypeData.hasRewards && (
                      <Badge variant="secondary" className="text-xs">
                        Rewards
                      </Badge>
                    )}
                    {selectedGameTypeData.isTimed && (
                      <Badge variant="secondary" className="text-xs">
                        Timed
                      </Badge>
                    )}
                    {selectedGameTypeData.requiresAI && (
                      <Badge variant="secondary" className="text-xs">
                        AI Enhanced
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
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
  )
}