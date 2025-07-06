import type { Meta, StoryObj } from '@storybook/react';
import { LMSHeader } from './lms-header';

const meta = {
  title: 'LMS/LMSHeader',
  component: LMSHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Modern LMS header with semantic tokens, breadcrumb navigation, user menu dropdown with smooth animations, and mobile responsive design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentView: {
      control: 'select',
      options: ['dashboard', 'course', 'lesson'],
      description: 'Current view context',
      table: {
        defaultValue: { summary: 'dashboard' },
      },
    },
    onMenuToggle: {
      action: 'menuToggled',
      description: 'Callback when menu toggle is clicked',
    },
    breadcrumbs: {
      control: 'object',
      description: 'Custom breadcrumb navigation items',
      table: {
        type: { summary: '{ label: string; href?: string }[]' },
      },
    },
  },
} satisfies Meta<typeof LMSHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentView: 'dashboard',
  },
};

export const InCourse: Story = {
  args: {
    currentView: 'course',
  },
  parameters: {
    docs: {
      description: {
        story: 'Header when viewing a course.',
      },
    },
  },
};

export const InLesson: Story = {
  args: {
    currentView: 'lesson',
  },
  parameters: {
    docs: {
      description: {
        story: 'Header when viewing a lesson.',
      },
    },
  },
};

export const WithCustomBreadcrumbs: Story = {
  args: {
    currentView: 'lesson',
    breadcrumbs: [
      { label: 'Home', href: '/lms' },
      { label: 'AI Fundamentals', href: '/lms/courses/ai-fundamentals' },
      { label: 'Module 3', href: '/lms/courses/ai-fundamentals/module-3' },
      { label: 'Introduction to Neural Networks' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with custom breadcrumb navigation for deep course navigation.',
      },
    },
  },
};

export const WithContainer: Story = {
  render: (args) => (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <LMSHeader {...args} />
      <main style={{ padding: 'var(--spacing-lg)' }}>
        <div className="max-w-7xl mx-auto">
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: 'var(--spacing-2xl)'
          }}>
            <h2 style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)'
            }}>Page Content</h2>
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: 'var(--line-height-relaxed)'
            }}>
              This demonstrates how the header looks with page content below it.
              The header is sticky and will remain at the top when scrolling.
              Notice how all styling uses semantic tokens for consistency.
            </p>
            <div style={{ height: '100vh', marginTop: 'var(--spacing-xl)' }}>
              <p style={{ color: 'var(--text-tertiary)' }}>Scroll down to see the sticky header in action...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  ),
  args: {
    currentView: 'course',
    breadcrumbs: [
      { label: 'Dashboard', href: '/lms' },
      { label: 'My Courses', href: '/lms/courses' },
      { label: 'Advanced Machine Learning' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Header shown with page content to demonstrate sticky behavior, semantic tokens, and responsive design.',
      },
    },
  },
};