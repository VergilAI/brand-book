import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './navigation';

const meta = {
  title: 'Vergil Learn/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main navigation component used in Vergil Learn. Features desktop pill design, mobile menu, and scroll-aware behavior.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    basePath: {
      control: 'text',
      description: 'Base path for navigation links',
      defaultValue: '',
    },
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    basePath: '',
  },
};

export const WithBasePath: Story = {
  args: {
    basePath: '/vergil-learn',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation with a base path prefix for nested routing.',
      },
    },
  },
};

export const ScrolledState: Story = {
  args: {
    basePath: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'The navigation automatically adds a backdrop blur and shadow when the page is scrolled.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200vh] bg-gradient-to-b from-deep-space to-cosmic-purple/20">
        <Story />
        <div className="p-8">
          <p className="text-white">Scroll down to see the navigation background change</p>
        </div>
      </div>
    ),
  ],
};

export const MobileView: Story = {
  args: {
    basePath: '',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Mobile navigation with hamburger menu.',
      },
    },
  },
};