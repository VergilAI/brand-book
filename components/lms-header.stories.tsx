import type { Meta, StoryObj } from '@storybook/react';
import { LMSHeader } from './lms-header';

const meta = {
  title: 'LMS/LMSHeader',
  component: LMSHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Learning Management System header with user profile, progress indicator, notifications, and navigation.',
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

export const WithContainer: Story = {
  render: (args) => (
    <div className="min-h-screen bg-gray-50">
      <LMSHeader {...args} />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-4">Page Content</h2>
            <p className="text-muted-foreground">
              This demonstrates how the header looks with page content below it.
              The header is sticky and will remain at the top when scrolling.
            </p>
          </div>
        </div>
      </main>
    </div>
  ),
  args: {
    currentView: 'dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: 'Header shown with page content to demonstrate sticky behavior and integration.',
      },
    },
  },
};