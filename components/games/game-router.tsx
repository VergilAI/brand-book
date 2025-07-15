'use client'

import { FlashcardGame } from './flashcard-game'
import { MillionaireGame } from './millionaire-game'
import { JeopardyGame } from './jeopardy-game'
import { WrittenMaterial } from './written-material'
import { AudioMaterial } from './audio-material'
import { VideoMaterial } from './video-material'

interface GameRouterProps {
  gameType: string
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

export function GameRouter({ gameType, lessonId, onClose, onComplete }: GameRouterProps) {
  switch (gameType) {
    case 'flashcards':
      return (
        <FlashcardGame
          lessonId={lessonId}
          onClose={onClose}
          onComplete={onComplete}
        />
      )
    
    case 'millionaire':
      return (
        <MillionaireGame
          lessonId={lessonId}
          onClose={onClose}
          onComplete={onComplete}
        />
      )
    
    case 'jeopardy':
      return (
        <JeopardyGame
          lessonId={lessonId}
          onClose={onClose}
          onComplete={onComplete}
        />
      )
    
    case 'written-material':
      return (
        <WrittenMaterial
          lessonId={lessonId}
          onClose={onClose}
          onComplete={onComplete}
        />
      )
    
    case 'audio-material':
      return (
        <AudioMaterial
          lessonId={lessonId}
          onClose={onClose}
          onComplete={onComplete}
        />
      )
    
    case 'video':
      return (
        <VideoMaterial
          lessonId={lessonId}
          onClose={onClose}
          onComplete={onComplete}
        />
      )
    
    case 'connect-cards':
      return (
        <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
          <div className="bg-bg-primary p-8 rounded-lg max-w-2xl">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Connect Cards</h2>
            <p className="text-text-secondary mb-6">
              This would be a Duolingo-style card matching game where you connect AI concepts with their definitions.
            </p>
            <button 
              onClick={onClose}
              className="bg-text-brand text-white px-6 py-2 rounded-lg hover:bg-text-brand-light transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )
    
    default:
      return (
        <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal">
          <div className="bg-bg-primary p-8 rounded-lg max-w-2xl">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Game Not Found</h2>
            <p className="text-text-secondary mb-6">
              The selected learning activity is not yet implemented.
            </p>
            <button 
              onClick={onClose}
              className="bg-text-brand text-white px-6 py-2 rounded-lg hover:bg-text-brand-light transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )
  }
}