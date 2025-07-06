import type { Meta, StoryObj } from '@storybook/react'
import { CourseDetail } from './course-detail'

const meta = {
  title: 'Components/CourseDetail',
  component: CourseDetail,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive course detail view that displays course information, sections, lessons, instructor details, and certificate status.'
      }
    }
  },
  argTypes: {
    courseId: {
      control: 'text',
      description: 'The unique identifier for the course'
    }
  }
} satisfies Meta<typeof CourseDetail>

export default meta
type Story = StoryObj<typeof meta>

// Helper function to create course data with specific configurations
const createCourseData = (overrides: any = {}) => ({
  id: overrides.courseId || 'course-1',
  title: overrides.title || 'Cybersecurity Awareness Training',
  description: overrides.description || 'Comprehensive employee cybersecurity education program covering phishing, social engineering, and security best practices.',
  longDescription: overrides.longDescription || 'This comprehensive cybersecurity awareness course provides healthcare professionals and employees with essential knowledge to protect information systems and sensitive data from internal and external threats.',
  instructor: overrides.instructor || {
    name: 'CISO Jennifer Martinez',
    avatar: '/avatars/jennifer-martinez.jpg',
    title: 'Chief Information Security Officer',
    bio: 'Jennifer has over 15 years of experience in cybersecurity and information risk management.'
  },
  thumbnail: overrides.thumbnail || '/course-thumbnails/cybersecurity-awareness.jpg',
  progress: overrides.progress !== undefined ? overrides.progress : 65,
  rating: overrides.rating || 4.8,
  enrolledStudents: overrides.enrolledStudents || 3947,
  estimatedTime: overrides.estimatedTime || '3 hours',
  difficulty: overrides.difficulty || 'beginner',
  category: overrides.category || 'Cybersecurity',
  learningObjectives: overrides.learningObjectives || [
    'Define information systems security and the CIA triad',
    'Identify federal regulations governing IT security in healthcare',
    'Recognize and respond to cybersecurity threats and phishing attacks',
    'Implement security best practices for physical and digital environments'
  ],
  sections: overrides.sections || [],
  certificate: overrides.certificate || {
    available: true,
    earned: false,
    title: 'Cybersecurity Awareness Certificate'
  }
})

// Default course with 65% progress
export const Default: Story = {
  args: {
    courseId: 'cybersecurity-1'
  }
}

// Course with 0% progress (just started)
export const ZeroProgress: Story = {
  args: {
    courseId: 'data-privacy-1'
  },
  render: (args) => {
    // Since the component has hardcoded data, we'll document the expected behavior
    return (
      <div>
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm">Note: This story demonstrates a course with 0% progress.</p>
          <p className="text-sm">In a real implementation, the component would fetch data based on courseId.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with 50% progress
export const HalfProgress: Story = {
  args: {
    courseId: 'hipaa-training-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 rounded">
          <p className="text-sm">Note: This story would show a course with 50% progress.</p>
          <p className="text-sm">Half of the lessons would be completed, with progress bars at 50%.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with 100% progress (completed)
export const CompletedCourse: Story = {
  args: {
    courseId: 'completed-course-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded">
          <p className="text-sm">Note: This story would show a fully completed course.</p>
          <p className="text-sm">All lessons would be marked as completed with 100% progress.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with certificate earned
export const CertificateEarned: Story = {
  args: {
    courseId: 'certified-course-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded">
          <p className="text-sm">Note: This story would show a course with certificate earned.</p>
          <p className="text-sm">The certificate section would show a success message and download button.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with no certificate available
export const NoCertificate: Story = {
  args: {
    courseId: 'no-cert-course-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-gray-100 border border-gray-400 rounded">
          <p className="text-sm">Note: This story would show a course without certificate option.</p>
          <p className="text-sm">The certificate section would not be displayed.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Beginner difficulty course
export const BeginnerCourse: Story = {
  args: {
    courseId: 'beginner-course-1'
  },
  name: 'Difficulty: Beginner',
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded">
          <p className="text-sm">The course shows a green "beginner" badge indicating entry-level difficulty.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Intermediate difficulty course
export const IntermediateCourse: Story = {
  args: {
    courseId: 'intermediate-course-1'
  },
  name: 'Difficulty: Intermediate',
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm">In a real implementation, this would show an "intermediate" difficulty badge.</p>
          <p className="text-sm">The badge would be yellow/warning colored.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Advanced difficulty course
export const AdvancedCourse: Story = {
  args: {
    courseId: 'advanced-course-1'
  },
  name: 'Difficulty: Advanced',
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-sm">In a real implementation, this would show an "advanced" difficulty badge.</p>
          <p className="text-sm">The badge would be red/error colored.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with all sections expanded
export const AllSectionsExpanded: Story = {
  args: {
    courseId: 'expanded-course-1'
  },
  name: 'All Sections Expanded',
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 rounded">
          <p className="text-sm">This story shows the course with all sections expanded by default.</p>
          <p className="text-sm">You can see all lessons within each section.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with mixed lesson types
export const MixedLessonTypes: Story = {
  args: {
    courseId: 'mixed-lessons-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-purple-100 border border-purple-400 rounded">
          <p className="text-sm">This course showcases different lesson types:</p>
          <ul className="text-sm ml-4 list-disc">
            <li>Regular lessons (book icon)</li>
            <li>Tests (clipboard icon)</li>
            <li>Games (gamepad icon)</li>
            <li>Materials (file icon)</li>
          </ul>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with different instructor
export const DifferentInstructor: Story = {
  args: {
    courseId: 'instructor-variant-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-indigo-100 border border-indigo-400 rounded">
          <p className="text-sm">In a real implementation, this would show a different instructor.</p>
          <p className="text-sm">Example: Dr. Michael Chen - Data Privacy Officer</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with locked lessons
export const WithLockedLessons: Story = {
  args: {
    courseId: 'locked-content-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-gray-100 border border-gray-400 rounded">
          <p className="text-sm">This course shows locked lessons that require prerequisite completion.</p>
          <p className="text-sm">Locked lessons display with a lock icon and reduced opacity.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with many students enrolled
export const PopularCourse: Story = {
  args: {
    courseId: 'popular-course-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm">In a real implementation, this would show:</p>
          <ul className="text-sm ml-4 list-disc">
            <li>15,842 enrolled students</li>
            <li>4.9/5 rating</li>
            <li>High engagement metrics</li>
          </ul>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with minimal sections
export const MinimalContent: Story = {
  args: {
    courseId: 'minimal-course-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-gray-100 border border-gray-400 rounded">
          <p className="text-sm">A short course with only 1-2 sections and few lessons.</p>
          <p className="text-sm">Ideal for quick training modules or introductions.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Course with extensive content
export const ExtensiveContent: Story = {
  args: {
    courseId: 'extensive-course-1'
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 rounded">
          <p className="text-sm">In a real implementation, this would show:</p>
          <ul className="text-sm ml-4 list-disc">
            <li>8+ sections</li>
            <li>50+ total lessons</li>
            <li>12+ hours estimated time</li>
            <li>Comprehensive learning objectives</li>
          </ul>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}

// Mobile responsive view
export const MobileView: Story = {
  args: {
    courseId: 'mobile-course-1'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-4 bg-indigo-100 border border-indigo-400 rounded">
          <p className="text-sm">This story demonstrates the mobile-responsive layout.</p>
          <p className="text-sm">The sidebar content stacks below the main content on small screens.</p>
        </div>
        <CourseDetail {...args} />
      </div>
    )
  }
}