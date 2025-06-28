'use client'

import { useState } from 'react'
import { X, Play, ChevronLeft, ChevronRight, Trophy, Target, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { GameTypeCard } from './game-type-card'
import { gameTypes, type Lesson, type KnowledgePoint } from '@/lib/lms/game-types'
import { cn } from '@/lib/utils'

interface LessonModalProps {
  lesson: Lesson
  isOpen: boolean
  onClose: () => void
  onSelectGame?: (gameTypeId: string) => void
}

export function LessonModal({ 
  lesson, 
  isOpen, 
  onClose,
  onSelectGame 
}: LessonModalProps) {
  const [selectedTab, setSelectedTab] = useState<'games' | 'progress'>('games')
  
  if (!isOpen) return null

  const availableGames = gameTypes.filter(game => 
    lesson.availableGameTypes.includes(game.id)
  )

  const overallProficiency = lesson.knowledgePoints.reduce(
    (acc, kp) => acc + kp.proficiency, 0
  ) / lesson.knowledgePoints.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cosmic-purple to-electric-violet p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-display font-bold mb-2">{lesson.title}</h2>
              <p className="text-white/80">{lesson.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>{lesson.knowledgePoints.length} Knowledge Points</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>{Math.round(overallProficiency)}% Proficiency</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>{lesson.estimatedTime} min estimated</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-mist-gray/20">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('games')}
              className={cn(
                "px-6 py-3 font-medium transition-all relative",
                selectedTab === 'games' 
                  ? "text-cosmic-purple" 
                  : "text-stone-gray hover:text-deep-space"
              )}
            >
              Learning Activities
              {selectedTab === 'games' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cosmic-purple" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab('progress')}
              className={cn(
                "px-6 py-3 font-medium transition-all relative",
                selectedTab === 'progress' 
                  ? "text-cosmic-purple" 
                  : "text-stone-gray hover:text-deep-space"
              )}
            >
              Knowledge Progress
              {selectedTab === 'progress' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cosmic-purple" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {selectedTab === 'games' ? (
            <div>
              <p className="text-stone-gray mb-6">
                Choose how you'd like to learn. Different activities help reinforce knowledge in unique ways.
              </p>
              
              {/* Game Categories */}
              {['content', 'quiz', 'game', 'chat', 'test'].map(category => {
                const categoryGames = availableGames.filter(g => g.category === category)
                if (categoryGames.length === 0) return null

                return (
                  <div key={category} className="mb-8">
                    <h3 className="text-lg font-display font-semibold text-deep-space mb-4 capitalize">
                      {category === 'chat' ? 'Interactive' : category} Activities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryGames.map(game => (
                        <GameTypeCard
                          key={game.id}
                          gameType={game}
                          onClick={() => onSelectGame?.(game.id)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              <p className="text-stone-gray mb-6">
                Track your mastery of each knowledge point in this lesson.
              </p>
              
              {/* Overall Progress */}
              <div className="bg-gradient-to-r from-cosmic-purple/5 to-electric-violet/5 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-display font-semibold text-deep-space">
                    Overall Proficiency
                  </h3>
                  <span className="text-2xl font-bold text-cosmic-purple">
                    {Math.round(overallProficiency)}%
                  </span>
                </div>
                <Progress value={overallProficiency} className="h-3" />
                <p className="text-sm text-stone-gray mt-2">
                  Keep practicing to reach 100% mastery
                </p>
              </div>

              {/* Knowledge Points */}
              <div className="space-y-4">
                <h3 className="text-lg font-display font-semibold text-deep-space mb-4">
                  Knowledge Points
                </h3>
                {lesson.knowledgePoints.map((kp, index) => (
                  <div 
                    key={kp.id} 
                    className="bg-white border border-mist-gray/30 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            Point {index + 1}
                          </Badge>
                          {kp.proficiency >= 80 && (
                            <Badge className="text-xs bg-phosphor-cyan text-white">
                              Mastered
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-deep-space">{kp.title}</h4>
                        <p className="text-sm text-stone-gray mt-1">{kp.description}</p>
                      </div>
                      <span className={cn(
                        "text-lg font-bold",
                        kp.proficiency >= 80 ? "text-phosphor-cyan" :
                        kp.proficiency >= 60 ? "text-electric-violet" :
                        kp.proficiency >= 40 ? "text-luminous-indigo" :
                        "text-stone-gray"
                      )}>
                        {kp.proficiency}%
                      </span>
                    </div>
                    <Progress 
                      value={kp.proficiency} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-mist-gray/20 p-6 bg-mist-gray/5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-gray">
              {availableGames.length} learning activities available
            </p>
            <Button
              onClick={onClose}
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}