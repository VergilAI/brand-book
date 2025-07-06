import type { Meta, StoryObj } from '@storybook/react';
import { CloseButton } from './close-button';

const meta = {
  title: 'Atomic/CloseButton',
  component: CloseButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A clean close/dismiss button with a rotating X animation on hover. No background hover effect, just color transition and rotation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof CloseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8"> {/* 32px */}
      <div className="text-center">
        <CloseButton size="sm" onClick={() => console.log('Small clicked')} />
        <p className="mt-2 text-xs text-text-secondary">Small</p> {/* 8px, 12px, #6C6C6D */}
      </div>
      <div className="text-center">
        <CloseButton size="md" onClick={() => console.log('Medium clicked')} />
        <p className="mt-2 text-xs text-text-secondary">Medium</p>
      </div>
      <div className="text-center">
        <CloseButton size="lg" onClick={() => console.log('Large clicked')} />
        <p className="mt-2 text-xs text-text-secondary">Large</p>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-4 w-96"> {/* 16px */}
      <div className="relative bg-bg-secondary p-4 rounded-lg"> {/* #F5F5F7, 16px, 12px */}
        <CloseButton 
          className="absolute right-2 top-2" /* 8px */
          onClick={() => console.log('Card dismissed')}
        />
        <h3 className="text-base font-semibold text-text-primary mb-2">Card Title</h3> {/* 16px, #1D1D1F, 8px */}
        <p className="text-sm text-text-secondary">This is a card with a close button positioned absolutely.</p> {/* 14px, #6C6C6D */}
      </div>

      <div className="relative bg-bg-infoLight border border-border-info p-4 rounded-lg"> {/* rgba(0, 135, 255, 0.05), rgba(0, 135, 255, 0.1) */}
        <CloseButton 
          className="absolute right-2 top-2"
          onClick={() => console.log('Info dismissed')}
        />
        <h3 className="text-base font-semibold text-text-info mb-2">Info Message</h3> {/* #0087FF */}
        <p className="text-sm text-text-info opacity-90">This info box can be dismissed with the close button.</p>
      </div>

      <div className="flex items-center justify-between bg-bg-primary border border-border-subtle p-3 rounded-md"> {/* #FFFFFF, rgba(0,0,0,0.05), 12px, 8px */}
        <span className="text-sm text-text-primary">Notification</span> {/* 14px, #1D1D1F */}
        <CloseButton size="sm" onClick={() => console.log('Notification dismissed')} />
      </div>
    </div>
  ),
};

export const FocusStates: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">Tab through to see focus states:</p> {/* 14px, #6C6C6D */}
      <div className="flex gap-4">
        <CloseButton size="sm" />
        <CloseButton size="md" />
        <CloseButton size="lg" />
      </div>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CloseButton className="text-text-error hover:text-text-error" /> {/* #E51C23 */}
      <CloseButton className="text-text-success hover:text-text-success" /> {/* #0F8A0F */}
      <CloseButton className="text-text-brand hover:text-text-brand" /> {/* #A64DFF */}
    </div>
  ),
};