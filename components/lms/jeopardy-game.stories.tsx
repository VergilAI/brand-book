import type { Meta, StoryObj } from '@storybook/react'
import { JeopardyGame } from './jeopardy-game'

const meta = {
  title: 'LMS/Jeopardy Game',
  component: JeopardyGame,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof JeopardyGame>

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
        answer: 'useContext'
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
  },
  {
    name: 'TypeScript',
    clues: [
      {
        id: 'ts-200',
        category: 'TypeScript',
        value: 200,
        clue: 'This keyword is used to define a custom type',
        answer: 'type'
      },
      {
        id: 'ts-400',
        category: 'TypeScript',
        value: 400,
        clue: 'This operator is used to tell TypeScript that a value is not null or undefined',
        answer: 'non-null assertion operator'
      },
      {
        id: 'ts-600',
        category: 'TypeScript',
        value: 600,
        clue: 'This TypeScript feature allows you to create types that can work with multiple types',
        answer: 'generics'
      },
      {
        id: 'ts-800',
        category: 'TypeScript',
        value: 800,
        clue: 'This utility type constructs a type with all properties of Type set to optional',
        answer: 'Partial',
        isDailyDouble: true
      },
      {
        id: 'ts-1000',
        category: 'TypeScript',
        value: 1000,
        clue: 'This TypeScript feature allows you to extract the type of a variable or property',
        answer: 'typeof'
      }
    ]
  },
  {
    name: 'Web APIs',
    clues: [
      {
        id: 'api-200',
        category: 'Web APIs',
        value: 200,
        clue: 'This method is used to select an element by its ID',
        answer: 'getElementById'
      },
      {
        id: 'api-400',
        category: 'Web APIs',
        value: 400,
        clue: 'This API is used to make HTTP requests from the browser',
        answer: 'fetch'
      },
      {
        id: 'api-600',
        category: 'Web APIs',
        value: 600,
        clue: 'This storage mechanism persists data even after the browser is closed',
        answer: 'localStorage'
      },
      {
        id: 'api-800',
        category: 'Web APIs',
        value: 800,
        clue: 'This API provides a way to asynchronously observe changes in the intersection of a target element',
        answer: 'Intersection Observer'
      },
      {
        id: 'api-1000',
        category: 'Web APIs',
        value: 1000,
        clue: 'This API allows web applications to use the device\'s camera and microphone',
        answer: 'getUserMedia'
      }
    ]
  },
  {
    name: 'Git',
    clues: [
      {
        id: 'git-200',
        category: 'Git',
        value: 200,
        clue: 'This command is used to stage changes for commit',
        answer: 'git add'
      },
      {
        id: 'git-400',
        category: 'Git',
        value: 400,
        clue: 'This command shows the commit history',
        answer: 'git log'
      },
      {
        id: 'git-600',
        category: 'Git',
        value: 600,
        clue: 'This command is used to combine changes from one branch into another',
        answer: 'git merge'
      },
      {
        id: 'git-800',
        category: 'Git',
        value: 800,
        clue: 'This command temporarily stores changes that you don\'t want to commit immediately',
        answer: 'git stash'
      },
      {
        id: 'git-1000',
        category: 'Git',
        value: 1000,
        clue: 'This Git feature allows you to rewrite commit history by combining commits',
        answer: 'interactive rebase'
      }
    ]
  }
]

export const Default: Story = {
  args: {
    categories: sampleCategories,
    onGameEnd: (finalScore) => {
      console.log(`Game ended with final score: $${finalScore}`)
    }
  },
}

export const ThreeCategories: Story = {
  args: {
    categories: sampleCategories.slice(0, 3),
    onGameEnd: (finalScore) => {
      console.log(`Game ended with final score: $${finalScore}`)
    }
  },
}

export const InContainer: Story = {
  args: {
    categories: sampleCategories,
    className: 'max-w-6xl mx-auto',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-mist-gray/5 to-stone-gray/10 p-8">
        <Story />
      </div>
    ),
  ],
}