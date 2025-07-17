'use client'

import { FlashcardGame } from './flashcard-game'
import { MillionaireGame } from './millionaire-game'
import { JeopardyGameNew } from './jeopardy-game-new'
import { WrittenMaterial } from './written-material'
import { AudioMaterial } from './audio-material'
import { VideoMaterial } from './video-material'
import { ConnectCardsGame } from './connect-cards-game'

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
        <JeopardyGameNew
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
        <ConnectCardsGame
          lessonId={lessonId}
          onClose={onClose}
          onComplete={onComplete}
        />
      )
    
    default:
      return (
        <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal"> {/* rgba(0, 0, 0, 0.5) */}
          <div className="bg-bg-primary p-8 rounded-lg max-w-2xl"> {/* #FFFFFF */}
            <h2 className="text-2xl font-bold text-text-primary mb-4"> {/* #1D1D1F */}
              Game Not Found
            </h2>
            <p className="text-text-secondary mb-6"> {/* #6C6C6D */}
              The selected learning activity is not yet implemented.
            </p>
            <button 
              onClick={onClose}
              className="bg-text-brand text-white px-6 py-2 rounded-lg hover:bg-text-brand-light transition-colors" /* #7B00FF, #9933FF */
            >
              Close
            </button>
          </div>
        </div>
      )
  }
}