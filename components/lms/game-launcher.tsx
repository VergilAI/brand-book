'use client'

import { useState } from 'react'
import { FlashcardGame } from './flashcard-game'
import { MillionaireGame } from './millionaire-game'
import { JeopardyGame } from './jeopardy-game'
import { ConnectCardsGame } from './connect-cards-game'
import { TerritoryConquest } from './territory-conquest'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileText, Video, Volume2, MessageSquare, X } from 'lucide-react'
import type { Lesson } from '@/lib/lms/new-course-types'

interface GameLauncherProps {
  gameTypeId: string
  lesson: Lesson
  onComplete: (result: any) => void
  onQuit: () => void
}

export function GameLauncher({ gameTypeId, lesson, onComplete, onQuit }: GameLauncherProps) {
  // Mock data for games - in production, this would come from the lesson data
  const mockFlashcardDeck = {
    id: 'deck-1',
    title: lesson.title,
    description: lesson.description,
    cards: lesson.knowledgePoints.map((kp, index) => ({
      id: `card-${index}`,
      front: kp.title,
      back: kp.description,
      hints: [`Think about ${kp.title.toLowerCase()}`],
      difficulty: kp.proficiency < 40 ? 'easy' : kp.proficiency < 70 ? 'medium' : 'hard'
    })),
    totalCards: lesson.knowledgePoints.length,
    estimatedTime: 10,
    category: 'AI Fundamentals'
  }

  const mockMillionaireQuestions = lesson.knowledgePoints.map((kp, index) => ({
    id: `q-${index}`,
    question: `What is ${kp.title}?`,
    answers: {
      A: kp.description,
      B: 'An incorrect answer about something else',
      C: 'Another wrong answer',
      D: 'Yet another incorrect option'
    },
    correctAnswer: 'A' as const,
    difficulty: index + 1
  }))

  const mockJeopardyQuestions = {
    categories: [
      {
        id: 'cat-1',
        name: lesson.title,
        questions: lesson.knowledgePoints.slice(0, 5).map((kp, index) => ({
          id: `jq-${index}`,
          value: (index + 1) * 100,
          question: kp.description,
          answer: kp.title,
          dailyDouble: index === 2
        }))
      }
    ]
  }

  const mockConnectPairs = lesson.knowledgePoints.map((kp, index) => ({
    id: `pair-${index}`,
    left: { id: `l-${index}`, text: kp.title },
    right: { id: `r-${index}`, text: kp.description }
  }))

  // Content viewers
  if (gameTypeId === 'written-material') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-vergil-purple" />
              <h2 className="text-2xl font-bold text-vergil-off-black">{lesson.title}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onQuit}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-vergil-off-black/80 mb-6">{lesson.description}</p>
            
            <h3 className="text-xl font-semibold mb-4">Key Concepts</h3>
            {lesson.knowledgePoints.map((kp) => (
              <div key={kp.id} className="mb-6">
                <h4 className="text-lg font-medium text-vergil-purple mb-2">{kp.title}</h4>
                <p className="text-vergil-off-black/70">{kp.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button onClick={() => onComplete({ completed: true })} className="bg-vergil-purple hover:bg-vergil-purple-lighter">
              Complete Reading
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (gameTypeId === 'video') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-vergil-purple" />
              <h2 className="text-2xl font-bold text-vergil-off-black">{lesson.title}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onQuit}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="aspect-video bg-vergil-off-black/10 rounded-lg flex items-center justify-center mb-6">
            <Video className="w-16 h-16 text-vergil-off-black/40" />
            <p className="ml-4 text-vergil-off-black/60">Video content would appear here</p>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button onClick={() => onComplete({ completed: true })} className="bg-vergil-purple hover:bg-vergil-purple-lighter">
              Complete Video
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (gameTypeId === 'audio-material') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-vergil-purple" />
              <h2 className="text-2xl font-bold text-vergil-off-black">{lesson.title}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onQuit}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="bg-vergil-off-black/5 rounded-lg p-8 flex flex-col items-center justify-center mb-6">
            <Volume2 className="w-16 h-16 text-vergil-purple mb-4" />
            <p className="text-vergil-off-black/60">Audio narration would play here</p>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button onClick={() => onComplete({ completed: true })} className="bg-vergil-purple hover:bg-vergil-purple-lighter">
              Complete Audio
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Chat-based games
  if (['case-study', 'open-chat', 'role-playing', 'shark-tank', 'escape-room', 'debate'].includes(gameTypeId)) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-vergil-purple" />
              <h2 className="text-2xl font-bold text-vergil-off-black">{lesson.title} - Interactive Chat</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onQuit}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="bg-vergil-off-black/5 rounded-lg p-8 flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
            <MessageSquare className="w-16 h-16 text-vergil-purple mb-4" />
            <p className="text-vergil-off-black/60 text-center">
              Interactive AI chat experience would appear here<br />
              Game Type: {gameTypeId}
            </p>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button onClick={() => onComplete({ completed: true })} className="bg-vergil-purple hover:bg-vergil-purple-lighter">
              Complete Session
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Game components
  switch (gameTypeId) {
    case 'flashcards':
      return <FlashcardGame deck={mockFlashcardDeck} onComplete={onComplete} onQuit={onQuit} />
    
    case 'millionaire':
      return <MillionaireGame questions={mockMillionaireQuestions} onGameEnd={(winnings, status) => onComplete({ winnings, status })} />
    
    case 'jeopardy':
      return <JeopardyGame categories={mockJeopardyQuestions.categories} onGameEnd={onComplete} />
    
    case 'connect-cards':
      return <ConnectCardsGame pairs={mockConnectPairs} onComplete={onComplete} onQuit={onQuit} />
    
    case 'territory-conquest':
    case 'optimized-territory-map':
      return <TerritoryConquest onComplete={onComplete} onQuit={onQuit} />
    
    default:
      return (
        <div className="max-w-4xl mx-auto p-6">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-vergil-off-black mb-4">Game Not Yet Implemented</h2>
            <p className="text-vergil-off-black/60 mb-6">The {gameTypeId} game is coming soon!</p>
            <Button onClick={onQuit} variant="outline">Back to Selection</Button>
          </Card>
        </div>
      )
  }
}