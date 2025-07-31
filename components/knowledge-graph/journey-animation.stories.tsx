import type { Meta, StoryObj } from '@storybook/react'
import { TreeKnowledgeGraph } from './tree-knowledge-graph'
import { JourneyProvider, useJourney, calculateJourney } from './journey-context'
import { Button } from '@/components/button'
import { Play, Pause, RotateCcw } from 'lucide-react'
import React from 'react'

// Wrapper component to demonstrate journey animations
function JourneyAnimationDemo({ knowledgePoints, autoPlay = false }: { knowledgePoints: any; autoPlay?: boolean }) {
  const { 
    journey,
    isPlaying, 
    startPlayback, 
    pausePlayback, 
    resetPlayback,
    setJourney,
    playbackSpeed,
    setPlaybackSpeed
  } = useJourney()
  
  React.useEffect(() => {
    // Calculate journey on mount
    const newJourney = calculateJourney(knowledgePoints, 'standard')
    setJourney(newJourney)
  }, [knowledgePoints, setJourney])
  
  React.useEffect(() => {
    if (autoPlay && journey) {
      setTimeout(() => startPlayback(), 1000)
    }
  }, [autoPlay, journey, startPlayback])
  
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={resetPlayback}
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={isPlaying ? pausePlayback : startPlayback}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Play Journey
              </>
            )}
          </Button>
          <div className="flex items-center gap-1 border-l border-border-subtle pl-2">
            <span className="text-xs text-secondary">Speed:</span>
            {[1, 2, 4].map(speed => (
              <Button
                key={speed}
                size="sm"
                variant={playbackSpeed === speed ? "primary" : "ghost"}
                onClick={() => setPlaybackSpeed(speed)}
                className="h-6 w-6 p-0 text-xs"
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>
        {journey && (
          <div className="text-sm text-secondary">
            {journey.steps.length} steps • {journey.totalHours}h total
          </div>
        )}
      </div>
      
      <div className="flex-1 bg-white rounded-lg">
        <TreeKnowledgeGraph
          userName="Demo User"
          knowledgePoints={knowledgePoints}
          showJourney={true}
          journey={journey}
        />
      </div>
    </div>
  )
}

const meta = {
  title: 'LMS/JourneyAnimation',
  component: JourneyAnimationDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Demonstrates the journey animation feature that shows the optimal learning path through knowledge points.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <JourneyProvider>
        <div className="h-screen p-4 bg-gray-50">
          <Story />
        </div>
      </JourneyProvider>
    ),
  ],
} satisfies Meta<typeof JourneyAnimationDemo>

export default meta
type Story = StoryObj<typeof meta>

// Sample knowledge points for animation
const animationKnowledgePoints = [
  // Level 0 - Foundations
  {
    id: 'kp-1',
    title: 'ML Basics',
    progress: 0,
    dependencies: [],
  },
  {
    id: 'kp-2',
    title: 'Math Foundations',
    progress: 0,
    dependencies: [],
  },
  // Level 1
  {
    id: 'kp-3',
    title: 'Supervised Learning',
    progress: 0,
    dependencies: ['kp-1'],
    dependencyDetails: {
      'kp-1': { type: 'hard' as const, requiredElo: 80 }
    }
  },
  {
    id: 'kp-4',
    title: 'Linear Algebra',
    progress: 0,
    dependencies: ['kp-2'],
    dependencyDetails: {
      'kp-2': { type: 'hard' as const, requiredElo: 80 }
    }
  },
  {
    id: 'kp-5',
    title: 'Statistics',
    progress: 0,
    dependencies: ['kp-2'],
    dependencyDetails: {
      'kp-2': { type: 'hard' as const, requiredElo: 75 }
    }
  },
  // Level 2
  {
    id: 'kp-6',
    title: 'Linear Regression',
    progress: 0,
    dependencies: ['kp-3', 'kp-4', 'kp-5'],
    dependencyDetails: {
      'kp-3': { type: 'soft' as const, requiredElo: 70 },
      'kp-4': { type: 'hard' as const, requiredElo: 85 },
      'kp-5': { type: 'hard' as const, requiredElo: 80 }
    }
  },
  {
    id: 'kp-7',
    title: 'Classification',
    progress: 0,
    dependencies: ['kp-3', 'kp-5'],
    dependencyDetails: {
      'kp-3': { type: 'hard' as const, requiredElo: 80 },
      'kp-5': { type: 'soft' as const, requiredElo: 70 }
    }
  },
  // Level 3
  {
    id: 'kp-8',
    title: 'Neural Networks',
    progress: 0,
    dependencies: ['kp-6', 'kp-7'],
    dependencyDetails: {
      'kp-6': { type: 'hard' as const, requiredElo: 80 },
      'kp-7': { type: 'hard' as const, requiredElo: 80 }
    }
  },
]

export const Default: Story = {
  args: {
    knowledgePoints: animationKnowledgePoints,
  },
}

export const AutoPlay: Story = {
  args: {
    knowledgePoints: animationKnowledgePoints,
    autoPlay: true,
  },
}

export const SimpleLinearPath: Story = {
  args: {
    knowledgePoints: [
      { id: 'kp-1', title: 'Step 1', progress: 0, dependencies: [] },
      { id: 'kp-2', title: 'Step 2', progress: 0, dependencies: ['kp-1'] },
      { id: 'kp-3', title: 'Step 3', progress: 0, dependencies: ['kp-2'] },
      { id: 'kp-4', title: 'Step 4', progress: 0, dependencies: ['kp-3'] },
      { id: 'kp-5', title: 'Step 5', progress: 0, dependencies: ['kp-4'] },
    ],
  },
}

export const ComplexDependencies: Story = {
  args: {
    knowledgePoints: [
      // Multiple roots
      { id: 'kp-1', title: 'Root 1', progress: 0, dependencies: [] },
      { id: 'kp-2', title: 'Root 2', progress: 0, dependencies: [] },
      { id: 'kp-3', title: 'Root 3', progress: 0, dependencies: [] },
      // Converging paths
      { id: 'kp-4', title: 'Converge 1', progress: 0, dependencies: ['kp-1', 'kp-2'] },
      { id: 'kp-5', title: 'Converge 2', progress: 0, dependencies: ['kp-2', 'kp-3'] },
      // Final convergence
      { id: 'kp-6', title: 'Final', progress: 0, dependencies: ['kp-4', 'kp-5'] },
    ],
  },
}

export const WithLockedDependencies: Story = {
  args: {
    knowledgePoints: animationKnowledgePoints.map((kp, index) => ({
      ...kp,
      // Make some dependencies locked by setting low initial progress
      progress: index < 3 ? 75 : 0,
    })),
  },
}

export const PartialProgress: Story = {
  args: {
    knowledgePoints: animationKnowledgePoints.map((kp, index) => ({
      ...kp,
      // Vary the initial progress
      progress: Math.max(0, 100 - index * 15),
    })),
  },
}