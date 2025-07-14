'use client'

import { useState, useEffect } from 'react'
import { X, Play, Trophy, Target, Brain, Sparkles, BookOpen, FileQuestion, Video, Timer, Users, BarChart } from 'lucide-react'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { Card } from '@/components/card'
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
  
  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])
  
  if (!isOpen) return null

  const availableGames = gameTypes.filter(game => 
    lesson.availableGameTypes.includes(game.id)
  )

  const overallProficiency = lesson.knowledgePoints.reduce(
    (acc, kp) => acc + kp.proficiency, 0
  ) / lesson.knowledgePoints.length

  const getProficiencyLevel = (proficiency: number) => {
    if (proficiency >= 80) return { label: 'Mastered', color: 'text-[var(--text-success)]', bgColor: 'bg-[var(--bg-successLight)]' }
    if (proficiency >= 60) return { label: 'Proficient', color: 'text-[var(--text-info)]', bgColor: 'bg-[var(--bg-infoLight)]' }
    if (proficiency >= 40) return { label: 'Learning', color: 'text-[var(--text-warning)]', bgColor: 'bg-[var(--bg-warningLight)]' }
    return { label: 'New', color: 'text-[var(--text-tertiary)]', bgColor: 'bg-[var(--bg-secondary)]' }
  }

  const proficiencyLevel = getProficiencyLevel(overallProficiency)

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-overlay)] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-[var(--spacing-md)]">
        <div 
          className="bg-[var(--bg-primary)] rounded-[var(--radius-xl)] shadow-modal max-w-6xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[var(--gradient-consciousness)] p-[var(--spacing-lg)] text-[var(--text-inverse)]">
            <div className="flex items-start justify-between mb-[var(--spacing-md)]">
              <div className="flex-1">
                <h2 className="text-[var(--font-size-2xl)] font-[var(--font-weight-bold)] mb-[var(--spacing-sm)]">
                  {lesson.title}
                </h2>
                <p className="text-white/80 text-[var(--font-size-base)]">{lesson.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-[var(--radius-md)]"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-[var(--spacing-lg)] text-[var(--font-size-sm)]">
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Target className="w-4 h-4" />
                <span>{lesson.knowledgePoints.length} Knowledge Points</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <div className={cn("flex items-center gap-[var(--spacing-sm)]", proficiencyLevel.color)}>
                  <Trophy className="w-4 h-4" />
                  <span>{Math.round(overallProficiency)}% {proficiencyLevel.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Timer className="w-4 h-4" />
                <span>{lesson.estimatedTime} min estimated</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--border-subtle)]">
            <div className="flex">
              <button
                onClick={() => setSelectedTab('games')}
                className={cn(
                  "px-[var(--spacing-lg)] py-[var(--spacing-md)] font-[var(--font-weight-medium)] transition-all relative",
                  selectedTab === 'games' 
                    ? "text-[var(--text-brand)]" 
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                <Sparkles className="w-4 h-4 inline mr-[var(--spacing-sm)]" />
                Learning Activities
                {selectedTab === 'games' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--bg-brand)]" />
                )}
              </button>
              <button
                onClick={() => setSelectedTab('progress')}
                className={cn(
                  "px-[var(--spacing-lg)] py-[var(--spacing-md)] font-[var(--font-weight-medium)] transition-all relative",
                  selectedTab === 'progress' 
                    ? "text-[var(--text-brand)]" 
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                <BarChart className="w-4 h-4 inline mr-[var(--spacing-sm)]" />
                Knowledge Progress
                {selectedTab === 'progress' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--bg-brand)]" />
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-[var(--spacing-lg)] overflow-y-auto max-h-[calc(90vh-280px)]">
            {selectedTab === 'games' ? (
              <div>
                <p className="text-[var(--text-secondary)] mb-[var(--spacing-lg)]">
                  Choose how you'd like to learn. Different activities help reinforce knowledge in unique ways.
                </p>
                
                {/* Game Categories */}
                {['content', 'quiz', 'game', 'chat', 'test'].map(category => {
                  const categoryGames = availableGames.filter(g => g.category === category)
                  if (categoryGames.length === 0) return null

                  const getCategoryInfo = (cat: string) => {
                    switch (cat) {
                      case 'content':
                        return { title: 'Learning Materials', icon: BookOpen, description: 'Read, watch, and explore' }
                      case 'quiz':
                        return { title: 'Quick Assessments', icon: FileQuestion, description: 'Test your understanding' }
                      case 'game':
                        return { title: 'Interactive Games', icon: Sparkles, description: 'Learn through play' }
                      case 'chat':
                        return { title: 'AI Interactions', icon: Brain, description: 'Personalized learning' }
                      case 'test':
                        return { title: 'Formal Assessments', icon: Trophy, description: 'Measure mastery' }
                      default:
                        return { title: category, icon: BookOpen, description: '' }
                    }
                  }

                  const categoryInfo = getCategoryInfo(category)
                  const CategoryIcon = categoryInfo.icon

                  return (
                    <div key={category} className="mb-[var(--spacing-xl)]">
                      <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
                        <CategoryIcon className="w-5 h-5 text-[var(--text-brand)]" />
                        <h3 className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] text-[var(--text-primary)]">
                          {categoryInfo.title}
                        </h3>
                        <span className="text-[var(--font-size-sm)] text-[var(--text-tertiary)]">
                          {categoryInfo.description}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
                        {categoryGames.map(game => {
                          // Disable audio and video materials for now
                          const isAvailable = !['video', 'audio-material'].includes(game.id)
                          
                          return (
                            <GameTypeCard
                              key={game.id}
                              gameType={game}
                              isAvailable={isAvailable}
                              onClick={isAvailable ? () => onSelectGame?.(game.id) : undefined}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div>
                <p className="text-[var(--text-secondary)] mb-[var(--spacing-lg)]">
                  Track your mastery of each knowledge point in this lesson.
                </p>
                
                {/* Overall Progress */}
                <Card variant="gradient" className="mb-[var(--spacing-lg)]">
                  <div className="p-[var(--spacing-lg)]">
                    <div className="flex items-center justify-between mb-[var(--spacing-md)]">
                      <div>
                        <h3 className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] text-[var(--text-primary)]">
                          Overall Proficiency
                        </h3>
                        <p className="text-[var(--font-size-sm)] text-[var(--text-secondary)]">
                          Your current mastery level for this lesson
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[var(--font-size-3xl)] font-[var(--font-weight-bold)] text-[var(--text-brand)]">
                          {Math.round(overallProficiency)}%
                        </span>
                        <Badge className={cn("block mt-[var(--spacing-xs)]", proficiencyLevel.bgColor, proficiencyLevel.color)}>
                          {proficiencyLevel.label}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={overallProficiency} className="h-3 mb-[var(--spacing-sm)]" />
                    <p className="text-[var(--font-size-sm)] text-[var(--text-tertiary)]">
                      {overallProficiency < 100 
                        ? `Keep practicing to reach 100% mastery` 
                        : `Excellent work! You've mastered this lesson`}
                    </p>
                  </div>
                </Card>

                {/* Knowledge Points */}
                <div className="space-y-[var(--spacing-md)]">
                  <h3 className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] text-[var(--text-primary)] mb-[var(--spacing-md)]">
                    Knowledge Points Breakdown
                  </h3>
                  {lesson.knowledgePoints.map((kp, index) => {
                    const kpLevel = getProficiencyLevel(kp.proficiency)
                    
                    return (
                      <Card 
                        key={kp.id} 
                        variant={kp.proficiency >= 80 ? "gradient" : "feature"}
                        className="transition-all duration-[var(--duration-normal)]"
                      >
                        <div className="p-[var(--spacing-md)]">
                          <div className="flex items-start justify-between mb-[var(--spacing-sm)]">
                            <div className="flex-1">
                              <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-xs)]">
                                <Badge variant="secondary" className="text-[var(--font-size-xs)]">
                                  Point {index + 1}
                                </Badge>
                                {kp.proficiency >= 80 && (
                                  <Badge className={cn("text-[var(--font-size-xs)]", kpLevel.bgColor, kpLevel.color)}>
                                    <Trophy className="w-3 h-3 mr-[var(--spacing-xs)]" />
                                    {kpLevel.label}
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-[var(--font-weight-medium)] text-[var(--text-primary)] mb-[var(--spacing-xs)]">
                                {kp.title}
                              </h4>
                              <p className="text-[var(--font-size-sm)] text-[var(--text-secondary)]">
                                {kp.description}
                              </p>
                            </div>
                            <div className="text-right ml-[var(--spacing-md)]">
                              <span className={cn(
                                "text-[var(--font-size-xl)] font-[var(--font-weight-bold)]",
                                kpLevel.color
                              )}>
                                {kp.proficiency}%
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={kp.proficiency} 
                            className="h-2"
                          />
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--border-subtle)] p-[var(--spacing-lg)] bg-[var(--bg-secondary)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[var(--spacing-sm)] text-[var(--font-size-sm)] text-[var(--text-tertiary)]">
                <Users className="w-4 h-4" />
                <span>{availableGames.length} learning activities available</span>
              </div>
              <Button
                onClick={onClose}
                variant="secondary"
                className="border-[var(--border-default)] hover:border-[var(--border-brand)] hover:text-[var(--text-brand)]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}