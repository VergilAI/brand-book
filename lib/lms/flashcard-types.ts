export interface Flashcard {
  id: string
  front: string
  back: string
  hint?: string
  knowledgePointId: string
}

export interface FlashcardDeck {
  id: string
  title: string
  description: string
  cards: Flashcard[]
  lessonId: string
  knowledgePoints: string[] // IDs of knowledge points covered
}

export interface FlashcardGameState {
  currentIndex: number
  correctAnswers: number
  incorrectAnswers: number
  answeredCards: Set<string>
  userAnswers: Map<string, string>
  startTime: number
  endTime?: number
}

export interface FlashcardGameResult {
  totalCards: number
  correctAnswers: number
  incorrectAnswers: number
  accuracy: number
  timeSpent: number // in seconds
  knowledgePointProgress: Map<string, number> // knowledge point ID to progress increase
}

// Sample flashcard deck for demonstration
export const sampleFlashcardDeck: FlashcardDeck = {
  id: 'deck-ml-basics',
  title: 'Machine Learning Fundamentals',
  description: 'Core concepts of machine learning',
  lessonId: 'lesson-1',
  knowledgePoints: ['kp-1', 'kp-2', 'kp-3'],
  cards: [
    {
      id: 'card-1',
      front: 'What is the main difference between supervised and unsupervised learning?',
      back: 'Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data.',
      hint: 'Think about whether the training data has known outputs.',
      knowledgePointId: 'kp-2'
    },
    {
      id: 'card-2',
      front: 'Define "overfitting" in machine learning.',
      back: 'Overfitting occurs when a model learns the training data too well, including noise and outliers, resulting in poor performance on new, unseen data.',
      hint: 'It\'s when the model is too complex for the data.',
      knowledgePointId: 'kp-3'
    },
    {
      id: 'card-3',
      front: 'What is a neural network?',
      back: 'A neural network is a machine learning model inspired by the human brain, consisting of interconnected nodes (neurons) organized in layers that process information.',
      hint: 'Think of interconnected processing units.',
      knowledgePointId: 'kp-1'
    },
    {
      id: 'card-4',
      front: 'What is the purpose of a validation set?',
      back: 'A validation set is used to tune hyperparameters and evaluate model performance during training, helping prevent overfitting without using the test set.',
      hint: 'It\'s a dataset used during training but not for learning weights.',
      knowledgePointId: 'kp-3'
    },
    {
      id: 'card-5',
      front: 'Name three common machine learning algorithms.',
      back: 'Linear Regression, Decision Trees, and Support Vector Machines (SVM) are three common machine learning algorithms.',
      hint: 'Think of algorithms for classification and regression.',
      knowledgePointId: 'kp-1'
    }
  ]
}