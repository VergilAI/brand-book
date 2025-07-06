import type { Meta, StoryObj } from '@storybook/react'
import { CourseOverview } from './course-overview'
import type { Course, Section, Lesson, KnowledgePoint } from '@/lib/lms/game-types'

const meta = {
  title: 'LMS/CourseOverview',
  component: CourseOverview,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Full course overview with sections, lessons, and progress tracking. Displays course details, progress metrics, and expandable sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onStartCourse: { action: 'start-course' },
    onStartLesson: { action: 'start-lesson' },
  },
} satisfies Meta<typeof CourseOverview>

export default meta
type Story = StoryObj<typeof meta>

// Helper function to create knowledge points
const createKnowledgePoints = (
  count: number,
  proficiencyRange: [number, number] = [0, 100]
): KnowledgePoint[] => {
  const knowledgePointTopics = [
    'Core Concepts', 'Advanced Techniques', 'Best Practices', 'Common Patterns',
    'Performance Optimization', 'Security Considerations', 'Testing Strategies',
    'Debugging Methods', 'Architecture Design', 'Implementation Details'
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `kp-${Date.now()}-${i}`,
    title: knowledgePointTopics[i % knowledgePointTopics.length] + ` ${Math.floor(i / knowledgePointTopics.length) + 1}`,
    description: `Mastering ${knowledgePointTopics[i % knowledgePointTopics.length].toLowerCase()} for effective development`,
    proficiency: Math.floor(
      Math.random() * (proficiencyRange[1] - proficiencyRange[0]) + proficiencyRange[0]
    ),
  }))
}

// Helper function to create lessons
const createLessons = (
  count: number,
  kpPerLesson: number = 3,
  proficiencyRange: [number, number] = [0, 100]
): Lesson[] => {
  const lessonTemplates = [
    { title: 'Getting Started', desc: 'Introduction to fundamental concepts' },
    { title: 'Core Principles', desc: 'Understanding the essential building blocks' },
    { title: 'Hands-on Practice', desc: 'Apply your knowledge with practical exercises' },
    { title: 'Advanced Techniques', desc: 'Master sophisticated approaches' },
    { title: 'Real-world Applications', desc: 'See how concepts apply in practice' },
    { title: 'Common Pitfalls', desc: 'Learn from common mistakes and how to avoid them' },
    { title: 'Best Practices', desc: 'Industry-standard approaches and patterns' },
    { title: 'Performance & Optimization', desc: 'Making your code faster and more efficient' },
  ]
  
  return Array.from({ length: count }, (_, i) => {
    const template = lessonTemplates[i % lessonTemplates.length]
    return {
      id: `lesson-${Date.now()}-${i}`,
      title: `${template.title}${count > lessonTemplates.length ? ` Part ${Math.floor(i / lessonTemplates.length) + 1}` : ''}`,
      description: template.desc,
      knowledgePoints: createKnowledgePoints(kpPerLesson, proficiencyRange),
      availableGameTypes: [
        'written-material',
        'video',
        'flashcards',
        'millionaire',
        'jeopardy',
        'connect-cards'
      ].slice(0, 3 + Math.floor(Math.random() * 3)),
      estimatedTime: 30 + Math.floor(Math.random() * 60), // 30-90 minutes
    }
  })
}

// Helper function to create sections
const createSections = (
  count: number,
  lessonsPerSection: number = 4,
  proficiencyRange: [number, number] = [0, 100]
): Section[] => {
  const sectionNames = [
    'Introduction & Fundamentals',
    'Core Concepts & Theory',
    'Practical Implementation',
    'Advanced Topics',
    'Best Practices & Patterns',
    'Real-world Projects',
    'Performance & Optimization',
    'Testing & Quality Assurance',
    'Deployment & DevOps',
    'Final Assessment & Review'
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `section-${Date.now()}-${i}`,
    title: sectionNames[i % sectionNames.length],
    description: `Comprehensive coverage of ${sectionNames[i % sectionNames.length].toLowerCase()}`,
    lessons: createLessons(lessonsPerSection, 3, proficiencyRange),
    order: i + 1,
  }))
}

// Default course - not started
export const Default: Story = {
  args: {
    course: {
      id: 'course-web-dev',
      title: 'Modern Web Development Fundamentals',
      description: 'Master the essential skills for building modern web applications with HTML, CSS, JavaScript, and popular frameworks',
      sections: createSections(4, 4, [0, 0]),
      totalLessons: 16,
      totalKnowledgePoints: 48,
    },
  },
}

// Course with mixed progress
export const InProgress: Story = {
  args: {
    course: {
      id: 'course-js-mastery',
      title: 'JavaScript Mastery: From Zero to Hero',
      description: 'Complete JavaScript course covering ES6+, async programming, design patterns, and modern frameworks',
      sections: [
        {
          id: 'section-1',
          title: 'JavaScript Basics',
          description: 'Variables, data types, and control flow',
          lessons: createLessons(4, 3, [85, 100]),
          order: 1,
        },
        {
          id: 'section-2',
          title: 'Functions & Objects',
          description: 'Deep dive into functions, objects, and prototypes',
          lessons: createLessons(5, 3, [60, 90]),
          order: 2,
        },
        {
          id: 'section-3',
          title: 'Async JavaScript',
          description: 'Promises, async/await, and event loop',
          lessons: createLessons(4, 4, [20, 70]),
          order: 3,
        },
        {
          id: 'section-4',
          title: 'Modern JavaScript',
          description: 'ES6+ features and best practices',
          lessons: createLessons(5, 3, [0, 30]),
          order: 4,
        },
        {
          id: 'section-5',
          title: 'Framework Fundamentals',
          description: 'Introduction to React, Vue, and Angular',
          lessons: createLessons(4, 3, [0, 0]),
          order: 5,
        },
      ],
      totalLessons: 22,
      totalKnowledgePoints: 69,
    },
  },
}

// Nearly completed course
export const NearlyCompleted: Story = {
  args: {
    course: {
      id: 'course-react',
      title: 'React Development Professional',
      description: 'Build production-ready React applications with hooks, context, Redux, and testing',
      sections: createSections(6, 4, [75, 100]),
      totalLessons: 24,
      totalKnowledgePoints: 72,
    },
  },
}

// Fully completed course
export const Completed: Story = {
  args: {
    course: {
      id: 'course-python',
      title: 'Python for Data Science',
      description: 'Master Python programming for data analysis, visualization, and machine learning',
      sections: createSections(4, 5, [80, 100]),
      totalLessons: 20,
      totalKnowledgePoints: 60,
    },
  },
}

// Large comprehensive course
export const LargeCourse: Story = {
  args: {
    course: {
      id: 'course-fullstack',
      title: 'Full Stack Web Development Professional Certificate',
      description: 'Comprehensive 6-month program covering frontend, backend, databases, DevOps, and professional practices',
      sections: createSections(10, 6, [0, 70]),
      totalLessons: 60,
      totalKnowledgePoints: 180,
    },
  },
}

// Small focused course
export const SmallCourse: Story = {
  args: {
    course: {
      id: 'course-git',
      title: 'Git & GitHub Essentials',
      description: 'Learn version control with Git and collaborate using GitHub in just 2 hours',
      sections: [
        {
          id: 'section-git-1',
          title: 'Git Fundamentals',
          description: 'Basic commands and workflow',
          lessons: createLessons(3, 2, [0, 0]),
          order: 1,
        },
        {
          id: 'section-git-2',
          title: 'GitHub Collaboration',
          description: 'Pull requests, issues, and team workflows',
          lessons: createLessons(2, 3, [0, 0]),
          order: 2,
        },
      ],
      totalLessons: 5,
      totalKnowledgePoints: 12,
    },
  },
}

// Course with varying section progress
export const MixedSectionProgress: Story = {
  args: {
    course: {
      id: 'course-ml',
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to ML concepts, algorithms, and practical applications with Python',
      sections: [
        {
          id: 'section-ml-1',
          title: 'ML Foundations',
          description: 'Basic concepts and terminology',
          lessons: createLessons(4, 3, [90, 100]), // Completed
          order: 1,
        },
        {
          id: 'section-ml-2',
          title: 'Supervised Learning',
          description: 'Classification and regression algorithms',
          lessons: createLessons(5, 4, [70, 95]), // Almost done
          order: 2,
        },
        {
          id: 'section-ml-3',
          title: 'Unsupervised Learning',
          description: 'Clustering and dimensionality reduction',
          lessons: createLessons(4, 3, [30, 60]), // In progress
          order: 3,
        },
        {
          id: 'section-ml-4',
          title: 'Deep Learning Intro',
          description: 'Neural networks basics',
          lessons: createLessons(4, 3, [0, 20]), // Just started
          order: 4,
        },
        {
          id: 'section-ml-5',
          title: 'ML in Production',
          description: 'Deploying and monitoring ML models',
          lessons: createLessons(3, 4, [0, 0]), // Not started
          order: 5,
        },
      ],
      totalLessons: 20,
      totalKnowledgePoints: 64,
    },
  },
}

// Specialized technical course
export const SpecializedCourse: Story = {
  args: {
    course: {
      id: 'course-typescript',
      title: 'Advanced TypeScript Patterns',
      description: 'Master TypeScript type system, generics, decorators, and advanced patterns for enterprise applications',
      sections: [
        {
          id: 'section-ts-1',
          title: 'Type System Deep Dive',
          description: 'Advanced type theory and practical applications',
          lessons: [
            {
              id: 'lesson-ts-1',
              title: 'Advanced Types & Type Guards',
              description: 'Conditional types, mapped types, and type predicates',
              knowledgePoints: createKnowledgePoints(4, [75, 95]),
              availableGameTypes: ['written-material', 'flashcards', 'connect-cards'],
              estimatedTime: 60,
            },
            {
              id: 'lesson-ts-2',
              title: 'Generic Programming Mastery',
              description: 'Advanced generic constraints and inference',
              knowledgePoints: createKnowledgePoints(5, [60, 85]),
              availableGameTypes: ['video', 'millionaire', 'jeopardy'],
              estimatedTime: 75,
            },
            {
              id: 'lesson-ts-3',
              title: 'Utility Types & Helpers',
              description: 'Built-in utility types and creating custom ones',
              knowledgePoints: createKnowledgePoints(3, [50, 70]),
              availableGameTypes: ['written-material', 'flashcards'],
              estimatedTime: 45,
            },
          ],
          order: 1,
        },
        {
          id: 'section-ts-2',
          title: 'Design Patterns in TypeScript',
          description: 'Implementing GoF patterns with strong typing',
          lessons: createLessons(4, 3, [30, 60]),
          order: 2,
        },
        {
          id: 'section-ts-3',
          title: 'Enterprise Architecture',
          description: 'Building scalable TypeScript applications',
          lessons: createLessons(3, 4, [0, 30]),
          order: 3,
        },
      ],
      totalLessons: 10,
      totalKnowledgePoints: 36,
    },
  },
}

// Empty course (loading state simulation)
export const EmptyState: Story = {
  args: {
    course: {
      id: 'course-empty',
      title: 'Loading Course...',
      description: 'Course details are being loaded',
      sections: [],
      totalLessons: 0,
      totalKnowledgePoints: 0,
    },
  },
}

// Game-focused learning course
export const GameBasedLearning: Story = {
  args: {
    course: {
      id: 'course-game-js',
      title: 'JavaScript Through Games',
      description: 'Learn JavaScript by building games and completing game-based challenges',
      sections: [
        {
          id: 'section-game-1',
          title: 'Variable Quest',
          description: 'Master variables through RPG-style quests',
          lessons: Array.from({ length: 3 }, (_, i) => ({
            id: `lesson-game-${i}`,
            title: ['The Variable Dungeon', 'Data Type Arena', 'Scope Mountain'][i],
            description: 'Complete challenges to unlock new abilities',
            knowledgePoints: createKnowledgePoints(4, [70, 95]),
            availableGameTypes: ['millionaire', 'jeopardy', 'connect-cards'],
            estimatedTime: 40,
          })),
          order: 1,
        },
        {
          id: 'section-game-2',
          title: 'Function Kingdom',
          description: 'Build your kingdom with function powers',
          lessons: createLessons(4, 3, [40, 80]),
          order: 2,
        },
        {
          id: 'section-game-3',
          title: 'Object-Oriented Empire',
          description: 'Conquer territories with OOP concepts',
          lessons: createLessons(5, 3, [0, 40]),
          order: 3,
        },
      ],
      totalLessons: 12,
      totalKnowledgePoints: 36,
    },
  },
}

// Course with custom categories/tags
export const CategorizedCourse: Story = {
  args: {
    course: {
      id: 'course-design',
      title: 'UI/UX Design Principles',
      description: 'Learn design thinking, user research, prototyping, and visual design for digital products',
      sections: [
        {
          id: 'section-design-1',
          title: 'Design Thinking & Research',
          description: 'User-centered design methodology',
          lessons: createLessons(3, 2, [60, 85]),
          order: 1,
        },
        {
          id: 'section-design-2',
          title: 'Visual Design Fundamentals',
          description: 'Color, typography, and layout principles',
          lessons: Array.from({ length: 4 }, (_, i) => ({
            id: `lesson-design-${i}`,
            title: ['Color Theory & Psychology', 'Typography Mastery', 'Grid Systems & Layout', 'Visual Hierarchy'][i],
            description: 'Master visual design principles',
            knowledgePoints: createKnowledgePoints(2, [40, 70]),
            availableGameTypes: ['video', 'written-material'],
            estimatedTime: 50,
          })),
          order: 2,
        },
        {
          id: 'section-design-3',
          title: 'Prototyping & Testing',
          description: 'From wireframes to high-fidelity prototypes',
          lessons: createLessons(3, 3, [20, 50]),
          order: 3,
        },
      ],
      totalLessons: 10,
      totalKnowledgePoints: 25,
    },
  },
}

// Course with all lessons having different game types
export const DiverseGameTypes: Story = {
  args: {
    course: {
      id: 'course-diverse',
      title: 'Web Security Fundamentals',
      description: 'Learn to identify and prevent common web vulnerabilities',
      sections: [
        {
          id: 'section-sec-1',
          title: 'Security Basics',
          description: 'Understanding web security principles',
          lessons: [
            {
              id: 'lesson-sec-1',
              title: 'Introduction to Web Security',
              description: 'Overview of common threats',
              knowledgePoints: createKnowledgePoints(3, [0, 0]),
              availableGameTypes: ['written-material', 'video'],
              estimatedTime: 30,
            },
            {
              id: 'lesson-sec-2',
              title: 'Authentication & Authorization',
              description: 'Secure user management',
              knowledgePoints: createKnowledgePoints(4, [0, 0]),
              availableGameTypes: ['flashcards', 'connect-cards'],
              estimatedTime: 45,
            },
            {
              id: 'lesson-sec-3',
              title: 'OWASP Top 10',
              description: 'Most critical security risks',
              knowledgePoints: createKnowledgePoints(5, [0, 0]),
              availableGameTypes: ['millionaire', 'jeopardy'],
              estimatedTime: 60,
            },
          ],
          order: 1,
        },
      ],
      totalLessons: 3,
      totalKnowledgePoints: 12,
    },
  },
}