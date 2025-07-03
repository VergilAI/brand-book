import type { Meta, StoryObj } from '@storybook/react'
import { FlashcardGame } from './flashcard-game'
import { sampleFlashcardDeck } from '@/lib/lms/flashcard-types'

const meta: Meta<typeof FlashcardGame> = {
  title: 'LMS/FlashcardGame',
  component: FlashcardGame,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive flashcard game with card flipping animations and progress tracking.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    deck: sampleFlashcardDeck,
    onComplete: (result) => {
      console.log('Game completed:', result)
    },
    onQuit: () => {
      console.log('Game quit')
    },
  },
}

export const ShortDeck: Story = {
  args: {
    deck: {
      ...sampleFlashcardDeck,
      cards: sampleFlashcardDeck.cards.slice(0, 3)
    },
    onComplete: (result) => {
      console.log('Game completed:', result)
    },
    onQuit: () => {
      console.log('Game quit')
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A shorter deck with only 3 cards for quick testing',
      },
    },
  },
}

export const ProgrammingDeck: Story = {
  args: {
    deck: {
      id: 'deck-programming',
      title: 'Python Programming Basics',
      description: 'Essential Python concepts',
      lessonId: 'lesson-python',
      knowledgePoints: ['kp-python-1', 'kp-python-2'],
      cards: [
        {
          id: 'py-1',
          front: 'What is a Python list comprehension?',
          back: 'A concise way to create lists using a single line of code, with syntax: [expression for item in iterable if condition]',
          hint: 'It\'s a shorthand for creating lists with loops.',
          knowledgePointId: 'kp-python-1'
        },
        {
          id: 'py-2',
          front: 'What does the "self" parameter represent in Python classes?',
          back: 'The "self" parameter represents the instance of the class and is used to access instance attributes and methods.',
          hint: 'It refers to the current object.',
          knowledgePointId: 'kp-python-2'
        },
        {
          id: 'py-3',
          front: 'Explain Python decorators.',
          back: 'Decorators are functions that modify the behavior of other functions or classes without changing their source code, using the @decorator syntax.',
          hint: 'They wrap another function.',
          knowledgePointId: 'kp-python-2'
        },
        {
          id: 'py-4',
          front: 'What is the difference between a tuple and a list?',
          back: 'Tuples are immutable (cannot be changed after creation) and use parentheses (), while lists are mutable and use square brackets [].',
          hint: 'One can be changed, the other cannot.',
          knowledgePointId: 'kp-python-1'
        }
      ]
    },
    onComplete: (result) => {
      console.log('Game completed:', result)
    },
    onQuit: () => {
      console.log('Game quit')
    },
  },
}

export const LanguageLearningDeck: Story = {
  args: {
    deck: {
      id: 'deck-spanish',
      title: 'Spanish Vocabulary',
      description: 'Common Spanish words and phrases',
      lessonId: 'lesson-spanish',
      knowledgePoints: ['kp-spanish-1'],
      cards: [
        {
          id: 'es-1',
          front: 'How do you say "Good morning" in Spanish?',
          back: 'Buenos días',
          hint: 'It literally means "good days".',
          knowledgePointId: 'kp-spanish-1'
        },
        {
          id: 'es-2',
          front: 'What does "¿Cómo estás?" mean?',
          back: 'How are you?',
          hint: 'A common greeting asking about someone\'s state.',
          knowledgePointId: 'kp-spanish-1'
        },
        {
          id: 'es-3',
          front: 'Translate: "Thank you very much"',
          back: 'Muchas gracias',
          hint: '"Muchas" means "many" or "much".',
          knowledgePointId: 'kp-spanish-1'
        }
      ]
    },
    onComplete: (result) => {
      console.log('Game completed:', result)
    },
    onQuit: () => {
      console.log('Game quit')
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of using flashcards for language learning',
      },
    },
  },
}