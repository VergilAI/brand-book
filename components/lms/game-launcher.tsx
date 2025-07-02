'use client'

import { useState } from 'react'
import { FlashcardGame } from './flashcard-game'
import { MillionaireGame } from './millionaire-game'
import { JeopardyGame } from './jeopardy-game'
import { ConnectCardsGame } from './connect-cards-game'
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
  // Generate 15 flashcards with variations
  const mockFlashcardDeck = {
    id: 'deck-1',
    title: lesson.title,
    description: lesson.description,
    cards: Array.from({ length: 15 }, (_, i) => {
      const kpIndex = i % lesson.knowledgePoints.length
      const kp = lesson.knowledgePoints[kpIndex]
      const variations = [
        { front: kp.title, back: kp.description },
        { front: `Define: ${kp.title}`, back: `${kp.description} This concept is fundamental to understanding the lesson.` },
        { front: `What is the purpose of ${kp.title}?`, back: `${kp.description} It helps in achieving better understanding of the subject matter.` },
        { front: `Explain ${kp.title} in simple terms`, back: `In simple terms: ${kp.description}` },
        { front: `Key aspects of ${kp.title}`, back: `The main aspects are: ${kp.description}` }
      ]
      const variation = variations[Math.floor(i / lesson.knowledgePoints.length) % variations.length]
      
      return {
        id: `card-${i}`,
        front: variation.front,
        back: variation.back,
        hint: `Think about the key aspects of ${kp.title.toLowerCase()}`,
        difficulty: i < 5 ? 'easy' : i < 10 ? 'medium' : 'hard'
      }
    }),
    totalCards: 15,
    estimatedTime: 10,
    category: 'AI Fundamentals'
  }

  // Generate 15 questions for the full money ladder
  const mockMillionaireQuestions = Array.from({ length: 15 }, (_, index) => {
    const kp = lesson.knowledgePoints[index % lesson.knowledgePoints.length]
    const questionTypes = [
      {
        question: `What is ${kp.title}?`,
        answers: {
          A: kp.description,
          B: 'An incorrect definition that sounds plausible',
          C: 'Another wrong answer that might confuse',
          D: 'A completely unrelated concept'
        },
        correctAnswer: 'A' as const
      },
      {
        question: `Which statement best describes ${kp.title}?`,
        answers: {
          A: 'A misleading but technical-sounding description',
          B: kp.description,
          C: 'A partially correct but incomplete answer',
          D: 'An outdated or obsolete definition'
        },
        correctAnswer: 'B' as const
      },
      {
        question: `In the context of ${lesson.title}, what role does ${kp.title} play?`,
        answers: {
          A: 'A secondary or supporting concept',
          B: 'An unrelated principle',
          C: kp.description,
          D: 'A conflicting or opposite approach'
        },
        correctAnswer: 'C' as const
      },
      {
        question: `Which of the following is NOT true about ${kp.title}?`,
        answers: {
          A: kp.description,
          B: 'It is a fundamental concept in this field',
          C: 'It helps in understanding related topics',
          D: 'It contradicts established principles'
        },
        correctAnswer: 'D' as const
      }
    ]
    
    const selectedQuestion = questionTypes[index % questionTypes.length]
    
    return {
      id: `q-${index}`,
      ...selectedQuestion,
      difficulty: index + 1
    }
  })

  // Generate Jeopardy categories with 5 clues each
  const mockJeopardyCategories = [
    {
      name: "Fundamentals",
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[i % lesson.knowledgePoints.length]
        return {
          id: `clue-1-${i}`,
          category: "Fundamentals",
          value: (i + 1) * 200,
          clue: kp.description,
          answer: kp.title,
          isDailyDouble: i === 2 && Math.random() > 0.7
        }
      })
    },
    {
      name: "Applications",
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[(i + 1) % lesson.knowledgePoints.length]
        return {
          id: `clue-2-${i}`,
          category: "Applications",
          value: (i + 1) * 200,
          clue: `How is ${kp.title} applied in practice?`,
          answer: kp.description,
          isDailyDouble: i === 3 && Math.random() > 0.7
        }
      })
    },
    {
      name: "Key Concepts",
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[(i + 2) % lesson.knowledgePoints.length]
        return {
          id: `clue-3-${i}`,
          category: "Key Concepts",
          value: (i + 1) * 200,
          clue: `This concept ${kp.description.toLowerCase()}`,
          answer: `What is ${kp.title}?`,
          isDailyDouble: i === 1 && Math.random() > 0.7
        }
      })
    },
    {
      name: lesson.title,
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[(i + 3) % lesson.knowledgePoints.length]
        return {
          id: `clue-4-${i}`,
          category: lesson.title,
          value: (i + 1) * 200,
          clue: `The main purpose of ${kp.title}`,
          answer: kp.description,
          isDailyDouble: i === 4 && Math.random() > 0.7
        }
      })
    },
    {
      name: "Advanced Topics",
      clues: Array.from({ length: 5 }, (_, i) => {
        const kp = lesson.knowledgePoints[(i + 4) % lesson.knowledgePoints.length]
        return {
          id: `clue-5-${i}`,
          category: "Advanced Topics",
          value: (i + 1) * 200,
          clue: `An advanced application of ${kp.title}`,
          answer: `${kp.description} in complex scenarios`,
          isDailyDouble: false
        }
      })
    }
  ]

  const mockConnectPairs = lesson.knowledgePoints.map((kp, index) => ({
    matchId: `match-${index}`,
    leftCard: { 
      id: `l-${index}`, 
      content: kp.title,
      matchId: `match-${index}`,
      side: 'left' as const,
      type: 'text' as const
    },
    rightCard: { 
      id: `r-${index}`, 
      content: kp.description,
      matchId: `match-${index}`,
      side: 'right' as const,
      type: 'text' as const
    }
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


  // Game components
  switch (gameTypeId) {
    case 'flashcards':
      return <FlashcardGame deck={mockFlashcardDeck} onComplete={onComplete} onQuit={onQuit} />
    
    case 'millionaire':
      return <MillionaireGame questions={mockMillionaireQuestions} onGameEnd={(winnings, status) => onComplete({ winnings, status })} />
    
    case 'jeopardy':
      return <JeopardyGame categories={mockJeopardyCategories} onGameEnd={(finalScore) => onComplete({ score: finalScore })} />
    
    case 'connect-cards':
      return <ConnectCardsGame pairs={mockConnectPairs} onComplete={onComplete} onQuit={onQuit} />
    
    default:
      return (
        <div className="max-w-4xl mx-auto p-6">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-vergil-off-black mb-4">Game Not Available</h2>
            <p className="text-vergil-off-black/60 mb-6">This learning method is not available yet.</p>
            <Button onClick={onQuit} variant="outline">Back to Selection</Button>
          </Card>
        </div>
      )
  }
}