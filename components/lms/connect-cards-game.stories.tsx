'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { ConnectCardsGame } from './connect-cards-game'
import type { ConnectCardsPair } from './connect-cards-game'

const meta: Meta<typeof ConnectCardsGame> = {
  title: 'LMS/Games/ConnectCardsGame',
  component: ConnectCardsGame,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A Duolingo-style card matching game where users connect related cards from left and right columns. Cards turn green when matched correctly and red when matched incorrectly before disappearing.'
      }
    }
  },
  argTypes: {
    pairs: {
      description: 'Array of card pairs to match'
    },
    title: {
      description: 'Game title displayed at the top'
    },
    onComplete: {
      action: 'game completed'
    },
    onQuit: {
      action: 'game quit'
    }
  }
}

export default meta
type Story = StoryObj<typeof ConnectCardsGame>

const languagePairs: ConnectCardsPair[] = [
  {
    matchId: 'hello',
    leftCard: {
      id: 'en-hello',
      content: 'Hello',
      matchId: 'hello',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'es-hello',
      content: 'Hola',
      matchId: 'hello',
      side: 'right',
      type: 'text'
    },
    category: 'greetings'
  },
  {
    matchId: 'goodbye',
    leftCard: {
      id: 'en-goodbye',
      content: 'Goodbye',
      matchId: 'goodbye',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'es-goodbye',
      content: 'Adiós',
      matchId: 'goodbye',
      side: 'right',
      type: 'text'
    },
    category: 'greetings'
  },
  {
    matchId: 'thank-you',
    leftCard: {
      id: 'en-thanks',
      content: 'Thank you',
      matchId: 'thank-you',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'es-thanks',
      content: 'Gracias',
      matchId: 'thank-you',
      side: 'right',
      type: 'text'
    },
    category: 'politeness'
  },
  {
    matchId: 'please',
    leftCard: {
      id: 'en-please',
      content: 'Please',
      matchId: 'please',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'es-please',
      content: 'Por favor',
      matchId: 'please',
      side: 'right',
      type: 'text'
    },
    category: 'politeness'
  },
  {
    matchId: 'water',
    leftCard: {
      id: 'en-water',
      content: 'Water',
      matchId: 'water',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'es-water',
      content: 'Agua',
      matchId: 'water',
      side: 'right',
      type: 'text'
    },
    category: 'basic-needs'
  }
]

const mathPairs: ConnectCardsPair[] = [
  {
    matchId: 'equation1',
    leftCard: {
      id: 'eq1-question',
      content: '2 + 3 = ?',
      matchId: 'equation1',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'eq1-answer',
      content: '5',
      matchId: 'equation1',
      side: 'right',
      type: 'text'
    },
    category: 'addition'
  },
  {
    matchId: 'equation2',
    leftCard: {
      id: 'eq2-question',
      content: '7 × 8 = ?',
      matchId: 'equation2',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'eq2-answer',
      content: '56',
      matchId: 'equation2',
      side: 'right',
      type: 'text'
    },
    category: 'multiplication'
  },
  {
    matchId: 'equation3',
    leftCard: {
      id: 'eq3-question',
      content: '√16 = ?',
      matchId: 'equation3',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'eq3-answer',
      content: '4',
      matchId: 'equation3',
      side: 'right',
      type: 'text'
    },
    category: 'square-roots'
  },
  {
    matchId: 'equation4',
    leftCard: {
      id: 'eq4-question',
      content: '15 - 9 = ?',
      matchId: 'equation4',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'eq4-answer',
      content: '6',
      matchId: 'equation4',
      side: 'right',
      type: 'text'
    },
    category: 'subtraction'
  }
]

const sciencePairs: ConnectCardsPair[] = [
  {
    matchId: 'element1',
    leftCard: {
      id: 'h2o-formula',
      content: 'H₂O',
      matchId: 'element1',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'h2o-name',
      content: 'Water',
      matchId: 'element1',
      side: 'right',
      type: 'text'
    },
    category: 'chemistry'
  },
  {
    matchId: 'element2',
    leftCard: {
      id: 'co2-formula',
      content: 'CO₂',
      matchId: 'element2',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'co2-name',
      content: 'Carbon Dioxide',
      matchId: 'element2',
      side: 'right',
      type: 'text'
    },
    category: 'chemistry'
  },
  {
    matchId: 'planet1',
    leftCard: {
      id: 'mars-name',
      content: 'Mars',
      matchId: 'planet1',
      side: 'left',
      type: 'text',
      hint: 'The Red Planet'
    },
    rightCard: {
      id: 'mars-position',
      content: '4th planet from Sun',
      matchId: 'planet1',
      side: 'right',
      type: 'text'
    },
    category: 'astronomy'
  },
  {
    matchId: 'physics1',
    leftCard: {
      id: 'newton-law',
      content: 'F = ma',
      matchId: 'physics1',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'newton-description',
      content: "Newton's Second Law",
      matchId: 'physics1',
      side: 'right',
      type: 'text'
    },
    category: 'physics'
  }
]

const historyPairs: ConnectCardsPair[] = [
  {
    matchId: 'event1',
    leftCard: {
      id: 'ww2-start',
      content: '1939',
      matchId: 'event1',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'ww2-description',
      content: 'World War II begins',
      matchId: 'event1',
      side: 'right',
      type: 'text'
    },
    category: 'world-wars'
  },
  {
    matchId: 'person1',
    leftCard: {
      id: 'napoleon-name',
      content: 'Napoleon Bonaparte',
      matchId: 'person1',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'napoleon-country',
      content: 'French Emperor',
      matchId: 'person1',
      side: 'right',
      type: 'text'
    },
    category: 'leaders'
  },
  {
    matchId: 'revolution',
    leftCard: {
      id: 'american-rev',
      content: '1776',
      matchId: 'revolution',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'declaration',
      content: 'Declaration of Independence',
      matchId: 'revolution',
      side: 'right',
      type: 'text'
    },
    category: 'american-history'
  }
]

export const LanguageLearning: Story = {
  args: {
    pairs: languagePairs,
    title: 'English ↔ Spanish',
    onComplete: (result) => {
      console.log('Language game completed:', result)
    },
    onQuit: () => {
      console.log('Language game quit')
    }
  }
}

export const MathPractice: Story = {
  args: {
    pairs: mathPairs,
    title: 'Math Equations',
    onComplete: (result) => {
      console.log('Math game completed:', result)
    },
    onQuit: () => {
      console.log('Math game quit')
    }
  }
}

export const ScienceFacts: Story = {
  args: {
    pairs: sciencePairs,
    title: 'Science Connections',
    onComplete: (result) => {
      console.log('Science game completed:', result)
    },
    onQuit: () => {
      console.log('Science game quit')
    }
  }
}

export const HistoryTimeline: Story = {
  args: {
    pairs: historyPairs,
    title: 'Historical Events',
    onComplete: (result) => {
      console.log('History game completed:', result)
    },
    onQuit: () => {
      console.log('History game quit')
    }
  }
}

export const MinimalPairs: Story = {
  args: {
    pairs: languagePairs.slice(0, 2),
    title: 'Quick Match',
    onComplete: (result) => {
      console.log('Quick game completed:', result)
    },
    onQuit: () => {
      console.log('Quick game quit')
    }
  }
}