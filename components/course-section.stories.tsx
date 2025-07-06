import type { Meta, StoryObj } from '@storybook/react'
import { CourseSection } from './course-section'
import type { Section, Lesson, KnowledgePoint } from '@/lib/lms/game-types'
import { useState } from 'react'

const meta = {
  title: 'LMS/CourseSection',
  component: CourseSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isExpanded: {
      control: 'boolean',
      description: 'Whether the section is expanded',
    },
    sectionNumber: {
      control: 'number',
      description: 'The section number in the course',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl mx-auto p-[var(--spacing-lg)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CourseSection>

export default meta
type Story = StoryObj<typeof meta>

// Mock data generators
const createKnowledgePoint = (
  id: string,
  title: string,
  proficiency: number = 0
): KnowledgePoint => ({
  id,
  title,
  description: `Learn about ${title}`,
  proficiency,
})

const createLesson = (
  id: string,
  title: string,
  knowledgePoints: KnowledgePoint[],
  estimatedTime: number = 15
): Lesson => ({
  id,
  title,
  description: `This lesson covers ${title.toLowerCase()} concepts and best practices.`,
  knowledgePoints,
  availableGameTypes: ['written-material', 'video', 'flashcards', 'millionaire', 'jeopardy'],
  estimatedTime,
})

const createSection = (
  id: string,
  title: string,
  description: string,
  lessons: Lesson[],
  order: number = 1
): Section => ({
  id,
  title,
  description,
  lessons,
  order,
})

// Sample sections with different states
const completedSection: Section = createSection(
  'section-completed',
  'Introduction to TypeScript',
  'Learn the fundamentals of TypeScript and its type system',
  [
    createLesson(
      'lesson-1',
      'TypeScript Basics',
      [
        createKnowledgePoint('kp-1', 'Type Annotations', 100),
        createKnowledgePoint('kp-2', 'Interfaces', 100),
        createKnowledgePoint('kp-3', 'Type Inference', 100),
      ],
      20
    ),
    createLesson(
      'lesson-2',
      'Advanced Types',
      [
        createKnowledgePoint('kp-4', 'Union Types', 100),
        createKnowledgePoint('kp-5', 'Generics', 100),
        createKnowledgePoint('kp-6', 'Type Guards', 100),
      ],
      25
    ),
  ]
)

const inProgressSection: Section = createSection(
  'section-progress',
  'React Fundamentals',
  'Master the core concepts of React development',
  [
    createLesson(
      'lesson-3',
      'Components and Props',
      [
        createKnowledgePoint('kp-7', 'Function Components', 100),
        createKnowledgePoint('kp-8', 'Props and State', 85),
        createKnowledgePoint('kp-9', 'Component Lifecycle', 60),
      ],
      30
    ),
    createLesson(
      'lesson-4',
      'Hooks and Context',
      [
        createKnowledgePoint('kp-10', 'useState Hook', 40),
        createKnowledgePoint('kp-11', 'useEffect Hook', 20),
        createKnowledgePoint('kp-12', 'Context API', 0),
      ],
      25
    ),
    createLesson(
      'lesson-5',
      'Advanced Patterns',
      [
        createKnowledgePoint('kp-13', 'Custom Hooks', 0),
        createKnowledgePoint('kp-14', 'Performance Optimization', 0),
        createKnowledgePoint('kp-15', 'Error Boundaries', 0),
      ],
      35
    ),
  ]
)

const notStartedSection: Section = createSection(
  'section-not-started',
  'Node.js Backend Development',
  'Build scalable backend applications with Node.js',
  [
    createLesson(
      'lesson-6',
      'Express.js Fundamentals',
      [
        createKnowledgePoint('kp-16', 'Routing', 0),
        createKnowledgePoint('kp-17', 'Middleware', 0),
        createKnowledgePoint('kp-18', 'Error Handling', 0),
      ],
      40
    ),
    createLesson(
      'lesson-7',
      'Database Integration',
      [
        createKnowledgePoint('kp-19', 'MongoDB Basics', 0),
        createKnowledgePoint('kp-20', 'Mongoose ODM', 0),
        createKnowledgePoint('kp-21', 'Data Validation', 0),
      ],
      45
    ),
  ]
)

const largeSectionWithVariedProgress: Section = createSection(
  'section-large',
  'Full-Stack Application Development',
  'Build complete web applications from frontend to backend',
  [
    createLesson(
      'lesson-8',
      'Project Setup',
      [
        createKnowledgePoint('kp-22', 'Environment Configuration', 100),
        createKnowledgePoint('kp-23', 'Project Structure', 100),
        createKnowledgePoint('kp-24', 'Development Tools', 90),
      ],
      15
    ),
    createLesson(
      'lesson-9',
      'Frontend Architecture',
      [
        createKnowledgePoint('kp-25', 'Component Design', 85),
        createKnowledgePoint('kp-26', 'State Management', 75),
        createKnowledgePoint('kp-27', 'Routing', 60),
        createKnowledgePoint('kp-28', 'API Integration', 40),
      ],
      50
    ),
    createLesson(
      'lesson-10',
      'Backend Services',
      [
        createKnowledgePoint('kp-29', 'RESTful APIs', 30),
        createKnowledgePoint('kp-30', 'Authentication', 20),
        createKnowledgePoint('kp-31', 'Authorization', 10),
      ],
      45
    ),
    createLesson(
      'lesson-11',
      'Database Design',
      [
        createKnowledgePoint('kp-32', 'Schema Design', 0),
        createKnowledgePoint('kp-33', 'Relationships', 0),
        createKnowledgePoint('kp-34', 'Indexing', 0),
        createKnowledgePoint('kp-35', 'Query Optimization', 0),
      ],
      40
    ),
    createLesson(
      'lesson-12',
      'Testing & Deployment',
      [
        createKnowledgePoint('kp-36', 'Unit Testing', 0),
        createKnowledgePoint('kp-37', 'Integration Testing', 0),
        createKnowledgePoint('kp-38', 'CI/CD Pipeline', 0),
        createKnowledgePoint('kp-39', 'Production Deployment', 0),
      ],
      60
    ),
    createLesson(
      'lesson-13',
      'Performance & Security',
      [
        createKnowledgePoint('kp-40', 'Performance Monitoring', 0),
        createKnowledgePoint('kp-41', 'Security Best Practices', 0),
        createKnowledgePoint('kp-42', 'OWASP Guidelines', 0),
      ],
      35
    ),
  ]
)

// Stories
export const DefaultExpanded: Story = {
  args: {
    section: inProgressSection,
    sectionNumber: 2,
    isExpanded: true,
  },
}

export const Collapsed: Story = {
  args: {
    section: inProgressSection,
    sectionNumber: 2,
    isExpanded: false,
  },
}

export const CompletedSection: Story = {
  args: {
    section: completedSection,
    sectionNumber: 1,
    isExpanded: true,
  },
}

export const InProgressSection: Story = {
  args: {
    section: inProgressSection,
    sectionNumber: 2,
    isExpanded: true,
  },
}

export const NotStartedSection: Story = {
  args: {
    section: notStartedSection,
    sectionNumber: 3,
    isExpanded: true,
  },
}

export const SectionWithMultipleLessons: Story = {
  args: {
    section: largeSectionWithVariedProgress,
    sectionNumber: 4,
    isExpanded: true,
  },
}

export const CollapsedCompleted: Story = {
  args: {
    section: completedSection,
    sectionNumber: 1,
    isExpanded: false,
  },
}

export const CollapsedInProgress: Story = {
  args: {
    section: inProgressSection,
    sectionNumber: 2,
    isExpanded: false,
  },
}

export const CollapsedNotStarted: Story = {
  args: {
    section: notStartedSection,
    sectionNumber: 3,
    isExpanded: false,
  },
}

// Interactive story with toggle functionality
export const InteractiveToggle: Story = {
  render: (args) => {
    const [expanded, setExpanded] = useState(true)
    
    return (
      <div className="space-y-[var(--spacing-md)]">
        <div className="text-center mb-[var(--spacing-lg)]">
          <p className="text-[var(--text-secondary)] mb-[var(--spacing-sm)]">
            Click the section header to toggle expansion
          </p>
          <p className="text-[var(--font-size-sm)] text-[var(--text-tertiary)]">
            Current state: {expanded ? 'Expanded' : 'Collapsed'}
          </p>
        </div>
        <CourseSection
          {...args}
          isExpanded={expanded}
          onToggle={() => setExpanded(!expanded)}
        />
      </div>
    )
  },
  args: {
    section: inProgressSection,
    sectionNumber: 2,
  },
}

// Story showing different lesson types
const sectionWithDifferentLessonTypes: Section = createSection(
  'section-types',
  'Mixed Content Learning Path',
  'Experience different types of learning materials',
  [
    createLesson(
      'lesson-video',
      'Video Tutorial: Getting Started',
      [
        createKnowledgePoint('kp-v1', 'Introduction', 100),
        createKnowledgePoint('kp-v2', 'Setup Guide', 80),
      ],
      30
    ),
    createLesson(
      'lesson-interactive',
      'Interactive Workshop: Hands-on Practice',
      [
        createKnowledgePoint('kp-i1', 'Live Coding', 60),
        createKnowledgePoint('kp-i2', 'Pair Programming', 40),
        createKnowledgePoint('kp-i3', 'Code Review', 20),
      ],
      45
    ),
    createLesson(
      'lesson-quiz',
      'Assessment: Test Your Knowledge',
      [
        createKnowledgePoint('kp-q1', 'Multiple Choice', 0),
        createKnowledgePoint('kp-q2', 'Code Challenges', 0),
      ],
      20
    ),
  ]
)

export const DifferentLessonTypes: Story = {
  args: {
    section: sectionWithDifferentLessonTypes,
    sectionNumber: 5,
    isExpanded: true,
  },
}

// Story with callback handlers
export const WithCallbackHandlers: Story = {
  args: {
    section: inProgressSection,
    sectionNumber: 2,
    isExpanded: true,
    onToggle: () => console.log('Section toggled'),
    onStartLesson: (lessonId, gameTypeId) => {
      console.log(`Starting lesson: ${lessonId} with game type: ${gameTypeId}`)
    },
  },
}

// Story showing empty section
const emptySection: Section = createSection(
  'section-empty',
  'Coming Soon: Advanced Topics',
  'This section will be available soon',
  []
)

export const EmptySection: Story = {
  args: {
    section: emptySection,
    sectionNumber: 6,
    isExpanded: true,
  },
}

// Story with single lesson
const singleLessonSection: Section = createSection(
  'section-single',
  'Quick Start Guide',
  'Get up and running in just one lesson',
  [
    createLesson(
      'lesson-single',
      'Everything You Need to Know',
      [
        createKnowledgePoint('kp-s1', 'Core Concepts', 0),
        createKnowledgePoint('kp-s2', 'Best Practices', 0),
        createKnowledgePoint('kp-s3', 'Common Pitfalls', 0),
      ],
      30
    ),
  ]
)

export const SingleLessonSection: Story = {
  args: {
    section: singleLessonSection,
    sectionNumber: 1,
    isExpanded: true,
  },
}

// Multiple sections example
export const MultipleSections: Story = {
  render: () => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
      new Set(['section-completed', 'section-progress'])
    )

    const toggleSection = (sectionId: string) => {
      setExpandedSections((prev) => {
        const next = new Set(prev)
        if (next.has(sectionId)) {
          next.delete(sectionId)
        } else {
          next.add(sectionId)
        }
        return next
      })
    }

    const sections = [
      completedSection,
      inProgressSection,
      notStartedSection,
      singleLessonSection,
    ]

    return (
      <div className="space-y-[var(--spacing-lg)]">
        <div className="text-center mb-[var(--spacing-xl)]">
          <h2 className="text-[var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--text-primary)] mb-[var(--spacing-sm)]">
            Full Course Overview
          </h2>
          <p className="text-[var(--text-secondary)]">
            Multiple sections with different progress states
          </p>
        </div>
        {sections.map((section, index) => (
          <CourseSection
            key={section.id}
            section={section}
            sectionNumber={index + 1}
            isExpanded={expandedSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            onStartLesson={(lessonId, gameTypeId) => {
              console.log(`Starting lesson: ${lessonId} with game type: ${gameTypeId}`)
            }}
          />
        ))}
      </div>
    )
  },
}