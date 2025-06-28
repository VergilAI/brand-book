import type { Meta, StoryObj } from '@storybook/react'
import { GameTypeCard } from './game-type-card'
import { gameTypes } from '@/lib/lms/game-types'

const meta: Meta<typeof GameTypeCard> = {
  title: 'LMS/GameTypeCard',
  component: GameTypeCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card component for displaying different learning game types and activities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isAvailable: {
      control: 'boolean',
      description: 'Whether the game type is available for selection',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const WrittenMaterial: Story = {
  args: {
    gameType: gameTypes.find(g => g.id === 'written-material')!,
    isAvailable: true,
  },
}

export const Flashcards: Story = {
  args: {
    gameType: gameTypes.find(g => g.id === 'flashcards')!,
    isAvailable: true,
  },
}

export const Millionaire: Story = {
  args: {
    gameType: gameTypes.find(g => g.id === 'millionaire')!,
    isAvailable: true,
  },
}

export const TerritoryConquest: Story = {
  args: {
    gameType: gameTypes.find(g => g.id === 'territory-conquest')!,
    isAvailable: true,
  },
}

export const RolePlayingGame: Story = {
  args: {
    gameType: gameTypes.find(g => g.id === 'role-playing')!,
    isAvailable: true,
  },
}

export const EscapeRoom: Story = {
  args: {
    gameType: gameTypes.find(g => g.id === 'escape-room')!,
    isAvailable: true,
  },
}

export const ComingSoon: Story = {
  args: {
    gameType: gameTypes.find(g => g.id === 'debate')!,
    isAvailable: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Game type card in coming soon state',
      },
    },
  },
}

export const GameTypeGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 max-w-6xl">
      {gameTypes.slice(0, 9).map(gameType => (
        <GameTypeCard
          key={gameType.id}
          gameType={gameType}
          isAvailable={Math.random() > 0.3}
          onClick={() => console.log(`Selected: ${gameType.name}`)}
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid display of multiple game type cards',
      },
    },
  },
}