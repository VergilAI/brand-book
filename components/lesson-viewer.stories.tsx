import type { Meta, StoryObj } from '@storybook/react'
import { LessonViewer } from './lesson-viewer'

const meta = {
  title: 'Components/LessonViewer',
  component: LessonViewer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive lesson viewer component that supports various content types including video, reading materials, quizzes, and interactive games.',
      },
    },
  },
  argTypes: {
    courseId: {
      control: 'text',
      description: 'The ID of the course',
    },
    lessonId: {
      control: 'text',
      description: 'The ID of the lesson',
    },
    onClose: {
      action: 'closed',
      description: 'Callback function when the viewer is closed',
    },
  },
} satisfies Meta<typeof LessonViewer>

export default meta
type Story = StoryObj<typeof meta>

// Default story - Reading lesson with video
export const Default: Story = {
  args: {
    courseId: 'cybersecurity-101',
    lessonId: 'lesson-1-1',
  },
}

// Video lesson
export const VideoLesson: Story = {
  args: {
    courseId: 'web-development',
    lessonId: 'video-lesson-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson primarily focused on video content with accompanying materials.',
      },
    },
  },
}

// Reading material only
export const ReadingMaterial: Story = {
  args: {
    courseId: 'data-science',
    lessonId: 'reading-lesson-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A text-based lesson without video content, focused on reading materials.',
      },
    },
  },
}

// Quiz lesson
export const QuizLesson: Story = {
  args: {
    courseId: 'python-basics',
    lessonId: 'quiz-lesson-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A quiz-type lesson for testing knowledge.',
      },
    },
  },
}

// Game lesson
export const GameLesson: Story = {
  args: {
    courseId: 'math-fundamentals',
    lessonId: 'game-lesson-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'An interactive game-based lesson for engaging learning.',
      },
    },
  },
}

// Interactive lesson
export const InteractiveLesson: Story = {
  args: {
    courseId: 'ui-design',
    lessonId: 'interactive-lesson-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'An interactive lesson with hands-on exercises.',
      },
    },
  },
}

// Completed lesson
export const CompletedLesson: Story = {
  args: {
    courseId: 'completed-course',
    lessonId: 'completed-lesson-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson that has been completed by the user.',
      },
    },
  },
}

// Lesson without previous navigation
export const FirstLesson: Story = {
  args: {
    courseId: 'beginner-course',
    lessonId: 'first-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'The first lesson in a course with no previous lesson navigation.',
      },
    },
  },
}

// Lesson without next navigation
export const LastLesson: Story = {
  args: {
    courseId: 'advanced-course',
    lessonId: 'last-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'The last lesson in a course with no next lesson navigation.',
      },
    },
  },
}

// Lesson with no materials
export const NoMaterials: Story = {
  args: {
    courseId: 'minimal-course',
    lessonId: 'no-materials-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson without any additional materials.',
      },
    },
  },
}

// Long content lesson
export const LongContent: Story = {
  args: {
    courseId: 'comprehensive-course',
    lessonId: 'long-content-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson with extensive content requiring scrolling.',
      },
    },
  },
}

// Loading state simulation
export const LoadingState: Story = {
  args: {
    courseId: 'loading-course',
    lessonId: 'loading-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the lesson viewer in a loading state with progress animation.',
      },
    },
  },
}

// Mobile responsive view
export const MobileView: Story = {
  args: {
    courseId: 'mobile-course',
    lessonId: 'mobile-lesson',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'The lesson viewer optimized for mobile devices.',
      },
    },
  },
}

// Tablet responsive view
export const TabletView: Story = {
  args: {
    courseId: 'tablet-course',
    lessonId: 'tablet-lesson',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'The lesson viewer optimized for tablet devices.',
      },
    },
  },
}

// Dark mode view
export const DarkMode: Story = {
  args: {
    courseId: 'dark-mode-course',
    lessonId: 'dark-mode-lesson',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'The lesson viewer in dark mode theme.',
      },
    },
  },
}

// With all material types
export const AllMaterialTypes: Story = {
  args: {
    courseId: 'resources-course',
    lessonId: 'all-materials-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson showcasing all types of materials: PDF, video, and links.',
      },
    },
  },
}

// Fullscreen video mode
export const FullscreenVideo: Story = {
  args: {
    courseId: 'video-course',
    lessonId: 'fullscreen-video-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson with video player in fullscreen mode.',
      },
    },
  },
}

// Progress states showcase
export const ProgressStates: Story = {
  args: {
    courseId: 'progress-course',
    lessonId: 'progress-lesson',
  },
  render: (args) => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">0% Progress</h3>
        <div className="border rounded-lg overflow-hidden">
          <LessonViewer {...args} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">50% Progress</h3>
        <div className="border rounded-lg overflow-hidden">
          <LessonViewer {...args} lessonId="progress-lesson-50" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">100% Progress</h3>
        <div className="border rounded-lg overflow-hidden">
          <LessonViewer {...args} lessonId="progress-lesson-100" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcases different progress states of a lesson.',
      },
    },
  },
}

// Multiple lessons navigation
export const NavigationFlow: Story = {
  args: {
    courseId: 'navigation-course',
    lessonId: 'middle-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson with both previous and next navigation options.',
      },
    },
  },
}

// Lesson with rich media content
export const RichMediaContent: Story = {
  args: {
    courseId: 'media-course',
    lessonId: 'rich-media-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson featuring rich media content including videos, images, and interactive elements.',
      },
    },
  },
}

// Test/Assessment lesson
export const TestLesson: Story = {
  args: {
    courseId: 'assessment-course',
    lessonId: 'test-lesson-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A test or assessment type lesson.',
      },
    },
  },
}

// Lesson with code examples
export const CodeExamplesLesson: Story = {
  args: {
    courseId: 'programming-course',
    lessonId: 'code-examples-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson containing code examples and syntax highlighting.',
      },
    },
  },
}

// Lesson with tables and data
export const DataTablesLesson: Story = {
  args: {
    courseId: 'analytics-course',
    lessonId: 'data-tables-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'A lesson featuring tables, charts, and data visualization.',
      },
    },
  },
}

// Short duration lesson
export const ShortLesson: Story = {
  args: {
    courseId: 'quick-course',
    lessonId: 'short-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'A brief 5-minute lesson for quick learning.',
      },
    },
  },
}

// Long duration lesson
export const LongLesson: Story = {
  args: {
    courseId: 'detailed-course',
    lessonId: 'long-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'An extensive 45-minute lesson for in-depth learning.',
      },
    },
  },
}

// Error state
export const ErrorState: Story = {
  args: {
    courseId: 'error-course',
    lessonId: 'error-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the lesson viewer when content fails to load.',
      },
    },
  },
}

// Offline mode
export const OfflineMode: Story = {
  args: {
    courseId: 'offline-course',
    lessonId: 'offline-lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'The lesson viewer in offline mode with cached content.',
      },
    },
  },
}