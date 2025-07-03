import type { Meta, StoryObj } from '@storybook/react'
import { JeopardyMultiplayerGame } from './jeopardy-multiplayer-game'

const meta = {
  title: 'LMS/Jeopardy Multiplayer Game',
  component: JeopardyMultiplayerGame,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof JeopardyMultiplayerGame>

export default meta
type Story = StoryObj<typeof meta>

const sampleCategories = [
  {
    name: 'JavaScript',
    clues: [
      {
        id: 'js-200',
        category: 'JavaScript',
        value: 200,
        clue: 'This keyword is used to declare a variable that cannot be reassigned',
        answer: 'const'
      },
      {
        id: 'js-400',
        category: 'JavaScript',
        value: 400,
        clue: 'This array method creates a new array with the results of calling a function on every element',
        answer: 'map'
      },
      {
        id: 'js-600',
        category: 'JavaScript',
        value: 600,
        clue: 'This operator is used to spread the elements of an array or object',
        answer: 'spread operator',
        isDailyDouble: true
      },
      {
        id: 'js-800',
        category: 'JavaScript',
        value: 800,
        clue: 'This method returns a promise that resolves after all of the given promises have either resolved or rejected',
        answer: 'Promise.allSettled'
      },
      {
        id: 'js-1000',
        category: 'JavaScript',
        value: 1000,
        clue: 'This is the name of the specification that defines the JavaScript language',
        answer: 'ECMAScript'
      }
    ]
  },
  {
    name: 'React',
    clues: [
      {
        id: 'react-200',
        category: 'React',
        value: 200,
        clue: 'This hook is used to manage state in functional components',
        answer: 'useState'
      },
      {
        id: 'react-400',
        category: 'React',
        value: 400,
        clue: 'This lifecycle method in class components is equivalent to useEffect with an empty dependency array',
        answer: 'componentDidMount'
      },
      {
        id: 'react-600',
        category: 'React',
        value: 600,
        clue: 'This React feature allows you to return multiple elements without adding extra nodes to the DOM',
        answer: 'Fragments'
      },
      {
        id: 'react-800',
        category: 'React',
        value: 800,
        clue: 'This hook allows you to subscribe to React context without introducing nesting',
        answer: 'useContext',
        isDailyDouble: true
      },
      {
        id: 'react-1000',
        category: 'React',
        value: 1000,
        clue: 'This optimization technique prevents unnecessary re-renders by memoizing a component',
        answer: 'React.memo'
      }
    ]
  },
  {
    name: 'CSS',
    clues: [
      {
        id: 'css-200',
        category: 'CSS',
        value: 200,
        clue: 'This property is used to change the color of text',
        answer: 'color'
      },
      {
        id: 'css-400',
        category: 'CSS',
        value: 400,
        clue: 'This layout method arranges items in a one-dimensional row or column',
        answer: 'flexbox'
      },
      {
        id: 'css-600',
        category: 'CSS',
        value: 600,
        clue: 'This unit is relative to the font size of the root element',
        answer: 'rem'
      },
      {
        id: 'css-800',
        category: 'CSS',
        value: 800,
        clue: 'This property allows you to create animations by gradually changing from one set of CSS styles to another',
        answer: 'transition'
      },
      {
        id: 'css-1000',
        category: 'CSS',
        value: 1000,
        clue: 'This at-rule is used to define styles for different media types and screen sizes',
        answer: '@media'
      }
    ]
  }
]

export const Default: Story = {
  args: {
    categories: sampleCategories,
    onGameEnd: (players) => {
      console.log('Game ended with final standings:', players)
    }
  },
}

export const InContainer: Story = {
  args: {
    categories: sampleCategories,
    className: 'max-w-7xl mx-auto',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-mist-gray/5 to-stone-gray/10 p-8">
        <Story />
      </div>
    ),
  ],
}