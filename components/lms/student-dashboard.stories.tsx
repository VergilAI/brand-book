import type { Meta, StoryObj } from '@storybook/react';
import { StudentDashboard } from './student-dashboard';

const meta = {
  title: 'LMS/StudentDashboard',
  component: StudentDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive student dashboard for the Vergil LMS. Shows course progress, stats, and course catalog with filtering.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StudentDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-6 max-w-7xl mx-auto">
      <StudentDashboard />
    </div>
  ),
};

export const ComplianceTraining: Story = {
  render: () => (
    <div className="p-6 max-w-7xl mx-auto">
      <StudentDashboard />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Student dashboard focused on compliance and cybersecurity training courses, demonstrating the LMS for enterprise security education.',
      },
    },
  },
};