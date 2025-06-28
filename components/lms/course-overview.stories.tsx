import type { Meta, StoryObj } from '@storybook/react'
import { CourseOverview } from './course-overview'
import type { Course } from '@/lib/lms/game-types'

const meta: Meta<typeof CourseOverview> = {
  title: 'LMS/CourseOverview',
  component: CourseOverview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full course overview with sections, lessons, and progress tracking.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleCourse: Course = {
  id: 'course-ai-fundamentals',
  title: 'AI Fundamentals: From Theory to Practice',
  description: 'Master the essential concepts of artificial intelligence and machine learning through hands-on, interactive lessons designed to build deep understanding.',
  totalLessons: 9,
  totalKnowledgePoints: 27,
  sections: [
    {
      id: 'section-1',
      title: 'Introduction to AI & Machine Learning',
      description: 'Master the fundamentals of artificial intelligence and machine learning.',
      order: 1,
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'What is Artificial Intelligence?',
          description: 'Explore the history, concepts, and applications of AI.',
          estimatedTime: 20,
          availableGameTypes: ['written-material', 'video', 'flashcards', 'millionaire'],
          knowledgePoints: [
            { id: 'kp-1-1', title: 'AI Definition', description: 'Understanding what AI means', proficiency: 100 },
            { id: 'kp-1-2', title: 'History of AI', description: 'Key milestones in AI development', proficiency: 85 },
            { id: 'kp-1-3', title: 'AI Applications', description: 'Real-world uses of AI', proficiency: 90 }
          ]
        },
        {
          id: 'lesson-1-2',
          title: 'Machine Learning Basics',
          description: 'Learn the fundamental concepts of machine learning.',
          estimatedTime: 30,
          availableGameTypes: ['written-material', 'flashcards', 'speed-rounds', 'concept-matching'],
          knowledgePoints: [
            { id: 'kp-2-1', title: 'ML Fundamentals', description: 'Core concepts of machine learning', proficiency: 70 },
            { id: 'kp-2-2', title: 'Supervised Learning', description: 'Learning with labeled data', proficiency: 65 },
            { id: 'kp-2-3', title: 'Unsupervised Learning', description: 'Learning patterns in unlabeled data', proficiency: 40 }
          ]
        },
        {
          id: 'lesson-1-3',
          title: 'Neural Networks Introduction',
          description: 'Discover how neural networks work.',
          estimatedTime: 45,
          availableGameTypes: ['written-material', 'video', 'role-playing', 'escape-room'],
          knowledgePoints: [
            { id: 'kp-3-1', title: 'Neural Network Architecture', description: 'Understanding layers and neurons', proficiency: 0 },
            { id: 'kp-3-2', title: 'Activation Functions', description: 'How neurons process information', proficiency: 0 },
            { id: 'kp-3-3', title: 'Training Process', description: 'Backpropagation and optimization', proficiency: 0 }
          ]
        }
      ]
    },
    {
      id: 'section-2',
      title: 'Deep Learning & Advanced Concepts',
      description: 'Dive deeper into complex neural networks and cutting-edge AI techniques.',
      order: 2,
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Convolutional Neural Networks',
          description: 'Master image recognition with CNNs.',
          estimatedTime: 60,
          availableGameTypes: ['written-material', 'video', 'territory-conquest', 'case-study'],
          knowledgePoints: [
            { id: 'kp-4-1', title: 'CNN Architecture', description: 'Layers and filters in CNNs', proficiency: 0 },
            { id: 'kp-4-2', title: 'Image Processing', description: 'How CNNs process visual data', proficiency: 0 },
            { id: 'kp-4-3', title: 'Applications', description: 'Real-world CNN applications', proficiency: 0 }
          ]
        },
        {
          id: 'lesson-2-2',
          title: 'Recurrent Neural Networks',
          description: 'Process sequential data with RNNs.',
          estimatedTime: 55,
          availableGameTypes: ['written-material', 'flashcards', 'debate', 'shark-tank'],
          knowledgePoints: [
            { id: 'kp-5-1', title: 'RNN Fundamentals', description: 'Sequential data processing', proficiency: 0 },
            { id: 'kp-5-2', title: 'LSTM & GRU', description: 'Advanced RNN architectures', proficiency: 0 },
            { id: 'kp-5-3', title: 'Time Series Analysis', description: 'Predicting sequential patterns', proficiency: 0 }
          ]
        },
        {
          id: 'lesson-2-3',
          title: 'Transformers & Attention',
          description: 'Understanding modern NLP architectures.',
          estimatedTime: 70,
          availableGameTypes: ['written-material', 'video', 'open-chat', 'crossword'],
          knowledgePoints: [
            { id: 'kp-6-1', title: 'Attention Mechanism', description: 'How attention works', proficiency: 0 },
            { id: 'kp-6-2', title: 'Transformer Architecture', description: 'Building blocks of transformers', proficiency: 0 },
            { id: 'kp-6-3', title: 'GPT & BERT', description: 'Popular transformer models', proficiency: 0 }
          ]
        }
      ]
    },
    {
      id: 'section-3',
      title: 'Practical AI Applications',
      description: 'Apply your knowledge to real-world problems and build AI solutions.',
      order: 3,
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'Computer Vision Projects',
          description: 'Build image classification systems.',
          estimatedTime: 90,
          availableGameTypes: ['written-material', 'case-study', 'role-playing', 'odd-one-out'],
          knowledgePoints: [
            { id: 'kp-7-1', title: 'Project Setup', description: 'Environment and tools', proficiency: 0 },
            { id: 'kp-7-2', title: 'Data Preparation', description: 'Preparing image datasets', proficiency: 0 },
            { id: 'kp-7-3', title: 'Model Training', description: 'Training and evaluation', proficiency: 0 }
          ]
        },
        {
          id: 'lesson-3-2',
          title: 'Natural Language Processing',
          description: 'Create text analysis applications.',
          estimatedTime: 85,
          availableGameTypes: ['written-material', 'open-chat', 'debate', 'jeopardy'],
          knowledgePoints: [
            { id: 'kp-8-1', title: 'Text Processing', description: 'Cleaning and preparing text', proficiency: 0 },
            { id: 'kp-8-2', title: 'Sentiment Analysis', description: 'Analyzing text emotions', proficiency: 0 },
            { id: 'kp-8-3', title: 'Text Generation', description: 'Creating AI-written content', proficiency: 0 }
          ]
        },
        {
          id: 'lesson-3-3',
          title: 'AI Ethics & Best Practices',
          description: 'Responsible AI development.',
          estimatedTime: 40,
          availableGameTypes: ['written-material', 'debate', 'case-study', 'untimed-test'],
          knowledgePoints: [
            { id: 'kp-9-1', title: 'Bias in AI', description: 'Understanding and mitigating bias', proficiency: 0 },
            { id: 'kp-9-2', title: 'Privacy & Security', description: 'Protecting user data', proficiency: 0 },
            { id: 'kp-9-3', title: 'Transparency', description: 'Explainable AI principles', proficiency: 0 }
          ]
        }
      ]
    }
  ]
}

export const Default: Story = {
  args: {
    course: sampleCourse,
    onStartCourse: () => console.log('Starting course'),
    onStartLesson: (lessonId, gameTypeId) => console.log(`Starting lesson ${lessonId} with game ${gameTypeId}`),
  },
}

export const NewCourse: Story = {
  args: {
    course: {
      ...sampleCourse,
      sections: sampleCourse.sections.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson => ({
          ...lesson,
          knowledgePoints: lesson.knowledgePoints.map(kp => ({
            ...kp,
            proficiency: 0
          }))
        }))
      }))
    },
    onStartCourse: () => console.log('Starting course'),
    onStartLesson: (lessonId, gameTypeId) => console.log(`Starting lesson ${lessonId} with game ${gameTypeId}`),
  },
}

export const CompletedCourse: Story = {
  args: {
    course: {
      ...sampleCourse,
      sections: sampleCourse.sections.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson => ({
          ...lesson,
          knowledgePoints: lesson.knowledgePoints.map(kp => ({
            ...kp,
            proficiency: 95
          }))
        }))
      }))
    },
    onStartCourse: () => console.log('Reviewing course'),
    onStartLesson: (lessonId, gameTypeId) => console.log(`Reviewing lesson ${lessonId} with game ${gameTypeId}`),
  },
}