import { apiClient } from './base-client'

// Written Material Types
export interface WrittenMaterialResponse {
  lesson_id: number
  lesson_name: string
  content: string
  chapter_name: string
  course_name: string
}

// Game Content Types
export interface MillionaireQuestion {
  id: number
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  knowledge_point_id: number
}

export interface MillionaireGameContent {
  game_type: 'millionaire'
  lesson_id: number
  questions: MillionaireQuestion[]
}

export interface JeopardyQuestion {
  id: number
  question: string
  answer: string
  points: number
  knowledge_point_id: number
}

export interface JeopardyCategory {
  id: number
  name: string
  questions: JeopardyQuestion[]
}

export interface JeopardyGameContent {
  game_type: 'jeopardy'
  lesson_id: number
  categories: JeopardyCategory[]
}

export interface FlashcardCard {
  id: number
  front: string
  back: string
  knowledge_point_id: number
}

export interface FlashcardsGameContent {
  game_type: 'flashcards'
  lesson_id: number
  cards: FlashcardCard[]
}

export interface ConnectCardPair {
  id: number
  card1: string
  card2: string
  knowledge_point_id: number
}

export interface ConnectCardsGameContent {
  game_type: 'connect_cards'
  lesson_id: number
  pairs: ConnectCardPair[]
}

export type GameContent = 
  | MillionaireGameContent 
  | JeopardyGameContent 
  | FlashcardsGameContent 
  | ConnectCardsGameContent

// Game Results Types
export interface GameResultItem {
  question_id: number
  knowledge_point_id: number
  is_correct: boolean
  time_spent: number
}

export interface GameResultsRequest {
  lesson_id: number
  game_type_id: number
  results: GameResultItem[]
}

export interface GameResultsResponse {
  message: string
  results_count: number
  correct_count: number
}

// Game Type Enum
export enum GameType {
  Millionaire = 1,
  Jeopardy = 2,
  Flashcards = 3,
  ConnectCards = 4
}

class GameAPI {
  // Get written material for a lesson
  async getWrittenMaterial(lessonId: string): Promise<WrittenMaterialResponse> {
    return apiClient.get<WrittenMaterialResponse>(`/api/v1/content/${lessonId}/written-material`)
  }

  // Get game content for a specific game type
  async getGameContent(lessonId: string, gameTypeId: GameType): Promise<GameContent> {
    return apiClient.get<GameContent>(`/api/v1/game-content/${lessonId}/${gameTypeId}`)
  }

  // Submit game results (detailed version with question-level data)
  async submitGameResults(data: GameResultsRequest): Promise<GameResultsResponse> {
    return apiClient.post<GameResultsResponse>('/api/v1/game-results', data)
  }

  // Submit game result (simplified version for overall game completion)
  async submitGameResult(data: {
    lesson_id: number
    game_type_id: number
    score: number
    time_spent: number
    completed: boolean
  }): Promise<any> {
    // Convert to the format expected by the API
    const payload = {
      lessonId: data.lesson_id.toString(),
      gameTypeId: this.getGameTypeName(data.game_type_id),
      gameData: {
        score: data.score,
        timeSpent: data.time_spent,
        completed: data.completed
      },
      knowledgePointScores: []
    }
    return apiClient.post('/api/v1/game-results', payload)
  }

  // Helper to convert game type ID back to string
  getGameTypeName(gameTypeId: number): string {
    switch (gameTypeId) {
      case GameType.Millionaire:
        return 'millionaire'
      case GameType.Jeopardy:
        return 'jeopardy'
      case GameType.Flashcards:
        return 'flashcards'
      case GameType.ConnectCards:
        return 'connect-cards'
      default:
        throw new Error(`Unknown game type ID: ${gameTypeId}`)
    }
  }

  // Helper method to convert backend game type string to GameType enum
  getGameTypeId(gameType: string): GameType {
    switch (gameType) {
      case 'millionaire':
        return GameType.Millionaire
      case 'jeopardy':
        return GameType.Jeopardy
      case 'flashcards':
        return GameType.Flashcards
      case 'connect-cards':
        return GameType.ConnectCards
      default:
        throw new Error(`Unknown game type: ${gameType}`)
    }
  }

  // Transform written material response for frontend component
  transformWrittenMaterial(response: WrittenMaterialResponse) {
    return {
      contentType: 'written-material',
      content: {
        title: response.lesson_name,
        pages: [{
          pageNumber: 1,
          content: response.content
        }],
        chapterName: response.chapter_name,
        courseName: response.course_name,
        totalPages: 1,
        estimatedReadTime: Math.ceil(response.content.split(' ').length / 200) // Rough estimate
      }
    }
  }

  // Transform millionaire questions for frontend component
  transformMillionaireQuestions(questions: MillionaireQuestion[]) {
    return questions.map(q => ({
      id: q.id.toString(),
      question: q.question,
      options: [
        { id: 'A', text: q.options.A, correct: false },
        { id: 'B', text: q.options.B, correct: false },
        { id: 'C', text: q.options.C, correct: false },
        { id: 'D', text: q.options.D, correct: false }
      ],
      difficulty: 'medium' as const,
      knowledgePointId: q.knowledge_point_id
    }))
  }

  // Transform jeopardy categories for frontend component
  transformJeopardyCategories(categories: JeopardyCategory[]) {
    return {
      categories: categories.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        questions: cat.questions.map(q => ({
          id: q.id.toString(),
          question: q.question,
          answer: q.answer,
          points: q.points,
          answered: false,
          knowledgePointId: q.knowledge_point_id
        }))
      }))
    }
  }

  // Transform flashcards for frontend component
  transformFlashcards(cards: FlashcardCard[]) {
    return {
      cards: cards.map(card => ({
        id: card.id.toString(),
        front: card.front,
        back: card.back,
        flipped: false,
        mastered: false,
        knowledgePointId: card.knowledge_point_id
      })),
      totalCards: cards.length,
      category: 'General'
    }
  }

  // Transform connect card pairs for frontend component
  transformConnectCardPairs(pairs: ConnectCardPair[]) {
    // Create separate cards from pairs and shuffle them
    const allCards: Array<{ id: string; content: string; pairId: string; knowledgePointId: number }> = []
    
    pairs.forEach(pair => {
      allCards.push({
        id: `${pair.id}-1`,
        content: pair.card1,
        pairId: pair.id.toString(),
        knowledgePointId: pair.knowledge_point_id
      })
      allCards.push({
        id: `${pair.id}-2`,
        content: pair.card2,
        pairId: pair.id.toString(),
        knowledgePointId: pair.knowledge_point_id
      })
    })

    // Shuffle cards
    const shuffled = [...allCards].sort(() => Math.random() - 0.5)

    return {
      cards: shuffled,
      totalPairs: pairs.length
    }
  }
}

export const gameAPI = new GameAPI()