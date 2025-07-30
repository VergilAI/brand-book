'use client'

import { useState, useEffect } from 'react'
import { JeopardyGame } from '@/components/jeopardy-game'
import { gameAPI } from '@/app/lms/new_course_overview/api/course-api'
import { Loader2 } from 'lucide-react'
import type { JeopardyCategory } from '@/components/jeopardy-game'

interface JeopardyGameNewProps {
  lessonId: string
  onClose: () => void
  onComplete: (score: number) => void
}

export function JeopardyGameNew({ lessonId, onClose, onComplete }: JeopardyGameNewProps) {
  const [categories, setCategories] = useState<JeopardyCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadGameContent() {
      try {
        setLoading(true)
        const gameContent = await gameAPI.getGameContent(lessonId, 'jeopardy')
        
        if (gameContent?.content?.categories) {
          // Transform the API data to match the JeopardyCategory interface
          const transformedCategories: JeopardyCategory[] = gameContent.content.categories.map((category: any) => ({
            name: category.name,
            clues: category.questions.map((q: any) => ({
              id: q.id,
              category: category.name,
              value: q.value,
              clue: q.question,
              answer: q.answer,
              isDailyDouble: false // Will be set based on dailyDouble config
            }))
          }))

          // Set daily double if specified
          if (gameContent.content.dailyDouble) {
            const { categoryIndex, questionIndex } = gameContent.content.dailyDouble
            if (transformedCategories[categoryIndex] && transformedCategories[categoryIndex].clues[questionIndex]) {
              transformedCategories[categoryIndex].clues[questionIndex].isDailyDouble = true
            }
          }

          setCategories(transformedCategories)
        } else {
          // Fallback to default categories if no content is loaded
          setCategories(getDefaultCategories())
        }
      } catch (err) {
        console.error('Failed to load Jeopardy content:', err)
        setError('Failed to load game content')
        // Use default categories as fallback
        setCategories(getDefaultCategories())
      } finally {
        setLoading(false)
      }
    }

    loadGameContent()
  }, [lessonId])

  const handleGameEnd = (finalScore: number) => {
    // Convert the raw score to a percentage for consistency with other games
    const maxPossibleScore = categories.reduce((sum, cat) => 
      sum + cat.clues.reduce((catSum, clue) => catSum + clue.value, 0), 0
    )
    const percentageScore = Math.round((finalScore / maxPossibleScore) * 100)
    onComplete(percentageScore)
    onClose()
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal"> {/* rgba(0, 0, 0, 0.5) */}
        <div className="text-center space-y-spacing-md"> {/* 16px */}
          <Loader2 className="h-12 w-12 animate-spin text-text-brand mx-auto" /> {/* #7B00FF */}
          <p className="text-text-secondary text-base"> {/* #6C6C6D, 16px */}
            Loading Jeopardy game...
          </p>
        </div>
      </div>
    )
  }

  if (error && categories.length === 0) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal"> {/* rgba(0, 0, 0, 0.5) */}
        <div className="text-center space-y-spacing-md"> {/* 16px */}
          <h2 className="text-xl font-semibold text-text-error"> {/* #E51C23 */}
            Error Loading Game
          </h2>
          <p className="text-text-secondary"> {/* #6C6C6D */}
            {error}
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

  return (
    <JeopardyGame
      categories={categories}
      onGameEnd={handleGameEnd}
      onClose={onClose}
    />
  )
}

function getDefaultCategories(): JeopardyCategory[] {
  return [
    {
      name: 'AI Basics',
      clues: [
        {
          id: 'ai-200',
          category: 'AI Basics',
          value: 200,
          clue: 'This test determines if a machine can exhibit intelligent behavior equivalent to humans',
          answer: 'Turing Test'
        },
        {
          id: 'ai-400',
          category: 'AI Basics',
          value: 400,
          clue: 'This type of AI is designed to perform specific tasks',
          answer: 'Narrow AI'
        },
        {
          id: 'ai-600',
          category: 'AI Basics',
          value: 600,
          clue: 'This AI goal matches human cognitive abilities across all domains',
          answer: 'Artificial General Intelligence',
          isDailyDouble: true
        },
        {
          id: 'ai-800',
          category: 'AI Basics',
          value: 800,
          clue: 'This field combines computer science and robust datasets to enable problem-solving',
          answer: 'Machine Learning'
        },
        {
          id: 'ai-1000',
          category: 'AI Basics',
          value: 1000,
          clue: 'This is the simulation of human intelligence in machines',
          answer: 'Artificial Intelligence'
        }
      ]
    },
    {
      name: 'Machine Learning',
      clues: [
        {
          id: 'ml-200',
          category: 'Machine Learning',
          value: 200,
          clue: 'This ML type uses labeled training data',
          answer: 'Supervised Learning'
        },
        {
          id: 'ml-400',
          category: 'Machine Learning',
          value: 400,
          clue: 'This ML type finds patterns in unlabeled data',
          answer: 'Unsupervised Learning'
        },
        {
          id: 'ml-600',
          category: 'Machine Learning',
          value: 600,
          clue: 'This ML type learns through rewards and penalties',
          answer: 'Reinforcement Learning'
        },
        {
          id: 'ml-800',
          category: 'Machine Learning',
          value: 800,
          clue: 'This is the process of teaching a model with data',
          answer: 'Training'
        },
        {
          id: 'ml-1000',
          category: 'Machine Learning',
          value: 1000,
          clue: 'This measures how well a model performs on new data',
          answer: 'Generalization'
        }
      ]
    },
    {
      name: 'Deep Learning',
      clues: [
        {
          id: 'dl-200',
          category: 'Deep Learning',
          value: 200,
          clue: 'This network type is inspired by the human brain',
          answer: 'Neural Network'
        },
        {
          id: 'dl-400',
          category: 'Deep Learning',
          value: 400,
          clue: 'This algorithm trains neural networks by adjusting weights',
          answer: 'Backpropagation'
        },
        {
          id: 'dl-600',
          category: 'Deep Learning',
          value: 600,
          clue: 'This network type excels at image recognition',
          answer: 'Convolutional Neural Network'
        },
        {
          id: 'dl-800',
          category: 'Deep Learning',
          value: 800,
          clue: 'This network type processes sequential data',
          answer: 'Recurrent Neural Network'
        },
        {
          id: 'dl-1000',
          category: 'Deep Learning',
          value: 1000,
          clue: 'This technique uses pre-trained models for new tasks',
          answer: 'Transfer Learning'
        }
      ]
    },
    {
      name: 'Data Science',
      clues: [
        {
          id: 'ds-200',
          category: 'Data Science',
          value: 200,
          clue: 'This Python library is widely used for data manipulation and analysis',
          answer: 'Pandas'
        },
        {
          id: 'ds-400',
          category: 'Data Science',
          value: 400,
          clue: 'This process involves cleaning and transforming raw data',
          answer: 'Data Preprocessing'
        },
        {
          id: 'ds-600',
          category: 'Data Science',
          value: 600,
          clue: 'This statistical measure represents the middle value in a dataset',
          answer: 'Median',
          isDailyDouble: true
        },
        {
          id: 'ds-800',
          category: 'Data Science',
          value: 800,
          clue: 'This technique reduces the number of input variables in a dataset',
          answer: 'Dimensionality Reduction'
        },
        {
          id: 'ds-1000',
          category: 'Data Science',
          value: 1000,
          clue: 'This visualization library is built on matplotlib and provides a high-level interface',
          answer: 'Seaborn'
        }
      ]
    },
    {
      name: 'AI Ethics',
      clues: [
        {
          id: 'eth-200',
          category: 'AI Ethics',
          value: 200,
          clue: 'This term describes when AI systems reflect human prejudices',
          answer: 'Bias'
        },
        {
          id: 'eth-400',
          category: 'AI Ethics',
          value: 400,
          clue: 'This principle ensures AI decisions can be understood by humans',
          answer: 'Explainability'
        },
        {
          id: 'eth-600',
          category: 'AI Ethics',
          value: 600,
          clue: 'This field studies the moral implications of artificial intelligence',
          answer: 'AI Ethics'
        },
        {
          id: 'eth-800',
          category: 'AI Ethics',
          value: 800,
          clue: 'This term describes the protection of personal information in AI systems',
          answer: 'Privacy'
        },
        {
          id: 'eth-1000',
          category: 'AI Ethics',
          value: 1000,
          clue: 'This concept ensures AI benefits are distributed fairly across society',
          answer: 'Fairness'
        }
      ]
    },
    {
      name: 'AI Applications',
      clues: [
        {
          id: 'app-200',
          category: 'AI Applications',
          value: 200,
          clue: 'This AI application converts spoken words to text',
          answer: 'Speech Recognition'
        },
        {
          id: 'app-400',
          category: 'AI Applications',
          value: 400,
          clue: 'This technology enables computers to interpret and analyze visual information',
          answer: 'Computer Vision'
        },
        {
          id: 'app-600',
          category: 'AI Applications',
          value: 600,
          clue: 'This AI field focuses on enabling machines to understand human language',
          answer: 'Natural Language Processing'
        },
        {
          id: 'app-800',
          category: 'AI Applications',
          value: 800,
          clue: 'This type of vehicle uses AI to navigate without human intervention',
          answer: 'Autonomous Vehicle'
        },
        {
          id: 'app-1000',
          category: 'AI Applications',
          value: 1000,
          clue: 'This AI system beat the world champion at the game of Go',
          answer: 'AlphaGo'
        }
      ]
    }
  ]
}