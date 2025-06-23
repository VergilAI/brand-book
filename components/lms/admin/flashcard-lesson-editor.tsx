'use client'

import { useState } from 'react'
import {
  CreditCard,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  Shuffle,
  Timer,
  Eye,
  Upload,
  Image as ImageIcon,
  Volume2,
  Play,
  Pause,
  Settings,
  FlipHorizontal,
  ArrowUpDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RichTextEditor } from './rich-text-editor'
import { cn } from '@/lib/utils'

interface FlashCard {
  id: string
  front: string
  back: string
  frontMedia?: {
    type: 'image' | 'audio'
    url: string
  }
  backMedia?: {
    type: 'image' | 'audio'
    url: string
  }
}

interface FlashcardLessonContent {
  cards: FlashCard[]
  deckSettings: {
    randomOrder: boolean
    spacedRepetition: boolean
    autoAdvanceTime?: number
  }
  deckDescription: string
}

interface FlashcardLessonEditorProps {
  content: FlashcardLessonContent
  onChange: (content: FlashcardLessonContent) => void
}

export function FlashcardLessonEditor({ content, onChange }: FlashcardLessonEditorProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  const [previewMode, setPreviewMode] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const updateContent = (updates: Partial<FlashcardLessonContent>) => {
    onChange({ ...content, ...updates })
  }

  const updateDeckSettings = (updates: Partial<FlashcardLessonContent['deckSettings']>) => {
    updateContent({
      deckSettings: { ...content.deckSettings, ...updates }
    })
  }

  const addCard = () => {
    const newCard: FlashCard = {
      id: `card-${Date.now()}`,
      front: '',
      back: ''
    }

    updateContent({
      cards: [...content.cards, newCard]
    })

    setSelectedCard(newCard.id)
  }

  const updateCard = (cardId: string, updates: Partial<FlashCard>) => {
    updateContent({
      cards: content.cards.map(card =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    })
  }

  const deleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      updateContent({
        cards: content.cards.filter(card => card.id !== cardId)
      })
      
      if (selectedCard === cardId) {
        setSelectedCard(null)
      }
    }
  }

  const duplicateCard = (cardId: string) => {
    const card = content.cards.find(c => c.id === cardId)
    if (card) {
      const duplicatedCard: FlashCard = {
        ...card,
        id: `card-${Date.now()}`,
        front: `${card.front} (Copy)`,
        back: `${card.back} (Copy)`
      }
      
      updateContent({
        cards: [...content.cards, duplicatedCard]
      })
    }
  }

  const moveCard = (cardId: string, direction: 'up' | 'down') => {
    const currentIndex = content.cards.findIndex(card => card.id === cardId)
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < content.cards.length - 1)
    ) {
      const newCards = [...content.cards]
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      
      // Swap cards
      ;[newCards[currentIndex], newCards[newIndex]] = 
      [newCards[newIndex], newCards[currentIndex]]
      
      updateContent({ cards: newCards })
    }
  }

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev)
      if (next.has(cardId)) {
        next.delete(cardId)
      } else {
        next.add(cardId)
      }
      return next
    })
  }

  const nextCard = () => {
    if (currentCardIndex < content.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  const handleMediaUpload = (cardId: string, side: 'front' | 'back', file: File) => {
    const mediaType = file.type.startsWith('image/') ? 'image' : 'audio'
    const mediaUrl = URL.createObjectURL(file)
    
    updateCard(cardId, {
      [`${side}Media`]: {
        type: mediaType,
        url: mediaUrl
      }
    })
  }

  const removeMedia = (cardId: string, side: 'front' | 'back') => {
    updateCard(cardId, {
      [`${side}Media`]: undefined
    })
  }

  return (
    <div className="space-y-6">
      {/* Deck Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Flashcard Deck ({content.cards.length} cards)
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStudyMode(!studyMode)}
              >
                <Play className="h-4 w-4 mr-2" />
                {studyMode ? 'Exit Study' : 'Study Mode'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              <Button onClick={addCard}>
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="deck-description">Deck Description</Label>
            <Textarea
              id="deck-description"
              value={content.deckDescription}
              onChange={(e) => updateContent({ deckDescription: e.target.value })}
              placeholder="Describe what this flashcard deck covers..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Study Mode */}
      {studyMode && content.cards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Study Mode</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {currentCardIndex + 1} of {content.cards.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStudyMode(false)}
                >
                  Exit Study
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StudyCard
              card={content.cards[currentCardIndex]}
              onNext={nextCard}
              onPrevious={previousCard}
              canNext={currentCardIndex < content.cards.length - 1}
              canPrevious={currentCardIndex > 0}
            />
          </CardContent>
        </Card>
      )}

      {/* Deck Settings */}
      {!studyMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Study Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Random Order</Label>
                  <p className="text-xs text-gray-500">Shuffle cards during study</p>
                </div>
                <Switch
                  checked={content.deckSettings.randomOrder}
                  onCheckedChange={(checked) =>
                    updateDeckSettings({ randomOrder: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Spaced Repetition</Label>
                  <p className="text-xs text-gray-500">Show difficult cards more often</p>
                </div>
                <Switch
                  checked={content.deckSettings.spacedRepetition}
                  onCheckedChange={(checked) =>
                    updateDeckSettings({ spacedRepetition: checked })
                  }
                />
              </div>

              <div>
                <Label htmlFor="auto-advance">Auto-advance (seconds)</Label>
                <Input
                  id="auto-advance"
                  type="number"
                  min="0"
                  placeholder="Manual"
                  value={content.deckSettings.autoAdvanceTime || ''}
                  onChange={(e) =>
                    updateDeckSettings({ 
                      autoAdvanceTime: e.target.value ? parseInt(e.target.value) : undefined 
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards List/Grid */}
      {!studyMode && (
        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            {content.cards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-8 w-8 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No flashcards yet</p>
                <p className="text-sm mb-4">Create your first flashcard to get started</p>
                <Button onClick={addCard}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.cards.map((card, index) => (
                  <FlashcardPreview
                    key={card.id}
                    card={card}
                    index={index}
                    isSelected={selectedCard === card.id}
                    isFlipped={flippedCards.has(card.id)}
                    previewMode={previewMode}
                    onSelect={() => setSelectedCard(card.id)}
                    onFlip={() => toggleCardFlip(card.id)}
                    onUpdate={(updates) => updateCard(card.id, updates)}
                    onDelete={() => deleteCard(card.id)}
                    onDuplicate={() => duplicateCard(card.id)}
                    onMove={(direction) => moveCard(card.id, direction)}
                    onMediaUpload={(side, file) => handleMediaUpload(card.id, side, file)}
                    onRemoveMedia={(side) => removeMedia(card.id, side)}
                    canMoveUp={index > 0}
                    canMoveDown={index < content.cards.length - 1}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Card Editor Modal */}
      {selectedCard && !previewMode && !studyMode && (
        <CardEditorModal
          card={content.cards.find(c => c.id === selectedCard)!}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={(updates) => updateCard(selectedCard, updates)}
          onMediaUpload={(side, file) => handleMediaUpload(selectedCard, side, file)}
          onRemoveMedia={(side) => removeMedia(selectedCard, side)}
        />
      )}
    </div>
  )
}

// Study Card Component
interface StudyCardProps {
  card: FlashCard
  onNext: () => void
  onPrevious: () => void
  canNext: boolean
  canPrevious: boolean
}

function StudyCard({ card, onNext, onPrevious, canNext, canPrevious }: StudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="space-y-4">
      <div
        className="relative w-full h-64 mx-auto cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-500 transform-gpu",
          "[backface-visibility:hidden]",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}>
          <div className="w-full h-full bg-white border-2 border-cosmic-purple rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-lg">
            {card.frontMedia?.type === 'image' && (
              <img 
                src={card.frontMedia.url} 
                alt="Front" 
                className="max-w-full max-h-32 object-contain mb-4"
              />
            )}
            <div 
              className="prose prose-sm"
              dangerouslySetInnerHTML={{ __html: card.front }}
            />
            <div className="absolute bottom-4 right-4">
              <FlipHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-500 transform-gpu",
          "[backface-visibility:hidden] [transform:rotateY(180deg)]",
          isFlipped ? "[transform:rotateY(0deg)]" : ""
        )}>
          <div className="w-full h-full bg-gradient-to-br from-cosmic-purple to-electric-violet text-white rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-lg">
            {card.backMedia?.type === 'image' && (
              <img 
                src={card.backMedia.url} 
                alt="Back" 
                className="max-w-full max-h-32 object-contain mb-4"
              />
            )}
            <div 
              className="prose prose-sm prose-invert"
              dangerouslySetInnerHTML={{ __html: card.back }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canPrevious}
        >
          Previous
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <FlipHorizontal className="h-4 w-4 mr-2" />
          Flip Card
        </Button>
        
        <Button
          variant="outline"
          onClick={onNext}
          disabled={!canNext}
        >
          Next
        </Button>
      </div>
      
      <p className="text-center text-sm text-gray-500">
        Click the card or use the flip button to reveal the answer
      </p>
    </div>
  )
}

// Flashcard Preview Component
interface FlashcardPreviewProps {
  card: FlashCard
  index: number
  isSelected: boolean
  isFlipped: boolean
  previewMode: boolean
  onSelect: () => void
  onFlip: () => void
  onUpdate: (updates: Partial<FlashCard>) => void
  onDelete: () => void
  onDuplicate: () => void
  onMove: (direction: 'up' | 'down') => void
  onMediaUpload: (side: 'front' | 'back', file: File) => void
  onRemoveMedia: (side: 'front' | 'back') => void
  canMoveUp: boolean
  canMoveDown: boolean
}

function FlashcardPreview({
  card,
  index,
  isSelected,
  isFlipped,
  previewMode,
  onSelect,
  onFlip,
  onDelete,
  onDuplicate,
  onMove,
  canMoveUp,
  canMoveDown
}: FlashcardPreviewProps) {
  return (
    <div className={cn(
      "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
      isSelected ? "ring-2 ring-cosmic-purple" : ""
    )}>
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline">Card {index + 1}</Badge>
        {!previewMode && (
          <div className="flex items-center gap-1">
            {canMoveUp && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onMove('up')
                }}
              >
                ↑
              </Button>
            )}
            {canMoveDown && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onMove('down')
                }}
              >
                ↓
              </Button>
            )}
          </div>
        )}
      </div>

      <div
        className="min-h-[120px] bg-gray-50 rounded p-3 mb-3 flex items-center justify-center text-center"
        onClick={previewMode ? onFlip : onSelect}
      >
        <div className="prose prose-sm">
          {isFlipped ? (
            <div dangerouslySetInnerHTML={{ __html: card.back || 'Back side (empty)' }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: card.front || 'Front side (empty)' }} />
          )}
        </div>
      </div>

      {previewMode ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onFlip}
          className="w-full"
        >
          <FlipHorizontal className="h-4 w-4 mr-2" />
          Flip Card
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelect}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDuplicate}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Card Editor Modal
interface CardEditorModalProps {
  card: FlashCard
  isOpen: boolean
  onClose: () => void
  onUpdate: (updates: Partial<FlashCard>) => void
  onMediaUpload: (side: 'front' | 'back', file: File) => void
  onRemoveMedia: (side: 'front' | 'back') => void
}

function CardEditorModal({
  card,
  isOpen,
  onClose,
  onUpdate,
  onMediaUpload,
  onRemoveMedia
}: CardEditorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <Tabs defaultValue="front" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="front">Front Side</TabsTrigger>
              <TabsTrigger value="back">Back Side</TabsTrigger>
            </TabsList>
            
            <TabsContent value="front" className="space-y-4 mt-0">
              <div>
                <Label className="text-sm font-medium mb-2 block">Front Content</Label>
                <RichTextEditor
                  content={card.front}
                  onChange={(front) => onUpdate({ front })}
                  placeholder="Enter the front side content..."
                />
              </div>
              
              <MediaSection
                side="front"
                media={card.frontMedia}
                onUpload={(file) => onMediaUpload('front', file)}
                onRemove={() => onRemoveMedia('front')}
              />
            </TabsContent>
            
            <TabsContent value="back" className="space-y-4 mt-0">
              <div>
                <Label className="text-sm font-medium mb-2 block">Back Content</Label>
                <RichTextEditor
                  content={card.back}
                  onChange={(back) => onUpdate({ back })}
                  placeholder="Enter the back side content..."
                />
              </div>
              
              <MediaSection
                side="back"
                media={card.backMedia}
                onUpload={(file) => onMediaUpload('back', file)}
                onRemove={() => onRemoveMedia('back')}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Media Section Component
interface MediaSectionProps {
  side: 'front' | 'back'
  media?: { type: 'image' | 'audio'; url: string }
  onUpload: (file: File) => void
  onRemove: () => void
}

function MediaSection({ side, media, onUpload, onRemove }: MediaSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0])
    }
  }

  return (
    <div>
      <Label className="text-sm font-medium">Media (Optional)</Label>
      {media ? (
        <div className="mt-2 p-3 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {media.type === 'image' ? (
                <ImageIcon className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span className="text-sm">{media.type} attached</span>
            </div>
            <Button variant="outline" size="sm" onClick={onRemove}>
              Remove
            </Button>
          </div>
          
          {media.type === 'image' && (
            <img 
              src={media.url} 
              alt={`${side} side`}
              className="max-w-full max-h-32 object-contain"
            />
          )}
          
          {media.type === 'audio' && (
            <audio controls className="w-full">
              <source src={media.url} />
            </audio>
          )}
        </div>
      ) : (
        <div className="mt-2">
          <input
            type="file"
            accept="image/*,audio/*"
            onChange={handleFileChange}
            className="hidden"
            id={`${side}-media-upload`}
          />
          <Button asChild variant="outline" size="sm">
            <label htmlFor={`${side}-media-upload`} className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image or Audio
            </label>
          </Button>
        </div>
      )}
    </div>
  )
}