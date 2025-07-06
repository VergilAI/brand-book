import type { Meta, StoryObj } from '@storybook/react';
import { StudentDashboard } from './student-dashboard';

const meta = {
  title: 'LMS/StudentDashboard',
  component: StudentDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Student Dashboard

A modern, informative dashboard that gives students a clear overview of their learning progress. Built with semantic tokens and featuring:

### Key Features
- **Level & XP System** - Gamified progress tracking with levels and experience points
- **Course Progress Overview** - Visual representation of active courses with progress bars
- **Recent Activity Feed** - Timeline of completed lessons, tests, and achievements
- **Achievement System** - Badges and rewards for learning milestones
- **Upcoming Deadlines** - Important dates and due assignments
- **Responsive Design** - Optimized for desktop and mobile views

### Semantic Token Usage
- Background colors: \`bg-primary\`, \`bg-secondary\`, \`bg-emphasis\`
- Text colors: \`text-primary\`, \`text-secondary\`, \`text-tertiary\`
- Brand colors: \`text-brand\`, \`bg-brand\`, \`border-brand\`
- Status colors: \`text-success\`, \`text-warning\`, \`text-error\`, \`text-info\`
- Spacing: \`spacing-xs\`, \`spacing-sm\`, \`spacing-md\`, \`spacing-lg\`
- Card variants: \`default\`, \`metric\`, \`neural\`, \`interactive\`, \`outlined\`

### Animations
- Smooth loading states with skeleton screens
- Staggered entry animations for cards
- Hover effects on interactive elements
- Progress bar animations
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StudentDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <StudentDashboard />,
};

export const MobileView: Story = {
  render: () => <StudentDashboard />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive mobile view of the student dashboard with stacked layout.',
      },
    },
  },
};

export const TabletView: Story = {
  render: () => <StudentDashboard />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet view with optimized grid layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark">
      <StudentDashboard />
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Dark mode variant using semantic token system.',
      },
    },
  },
};

export const WithinLMSLayout: Story = {
  render: () => (
    <div className="bg-bg-secondary min-h-screen">
      <header className="bg-bg-primary border-b border-border-default px-spacing-lg py-spacing-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-primary">Vergil Learn</h1>
          <nav className="flex items-center gap-spacing-lg">
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Dashboard</a>
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Courses</a>
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Profile</a>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <StudentDashboard />
      </main>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Student dashboard shown within the context of the full LMS layout.',
      },
    },
  },
};