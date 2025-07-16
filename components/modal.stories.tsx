import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './modal'
import { Button } from './button'
import { useState } from 'react'

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible modal component built on top of our Dialog component with proper spacing and design tokens. Supports different sizes and customizable header, content, and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls the open state of the modal',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl', 'full'],
      description: 'Size of the modal',
      table: {
        type: { summary: 'sm | default | lg | xl | full' },
        defaultValue: { summary: 'default' },
      },
    },
    title: {
      control: 'text',
      description: 'Modal title',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    description: {
      control: 'text',
      description: 'Modal description',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

// Interactive modal with state management
const InteractiveModal = (args: any) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal {...args} open={open} onOpenChange={setOpen} />
    </>
  )
}

export const Default: Story = {
  render: (args) => <InteractiveModal {...args} />,
  args: {
    title: 'Modal Title',
    description: 'This is a description of what the modal is about.',
    children: (
      <div className="space-y-spacing-md"> {/* 16px */}
        <p className="text-base text-secondary"> {/* 16px, #6C6C6D */}
          This is the modal content. You can put any content here including forms, images, or other components.
        </p>
        <p className="text-base text-secondary">
          The modal automatically handles scrolling for long content while keeping the header and footer visible.
        </p>
      </div>
    ),
    footer: (
      <div className="flex gap-spacing-sm justify-end"> {/* 8px */}
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </div>
    ),
  },
}

export const SmallModal: Story = {
  render: (args) => <InteractiveModal {...args} />,
  args: {
    size: 'sm',
    title: 'Small Modal',
    description: 'Perfect for confirmations and simple forms',
    children: (
      <p className="text-base text-secondary">
        This is a small modal with less content.
      </p>
    ),
    footer: (
      <div className="flex gap-spacing-sm justify-end w-full">
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">Confirm</Button>
      </div>
    ),
  },
}

export const LargeModal: Story = {
  render: (args) => <InteractiveModal {...args} />,
  args: {
    size: 'lg',
    title: 'Large Modal',
    description: 'Great for complex forms and detailed content',
    children: (
      <div className="space-y-spacing-lg"> {/* 24px */}
        <div className="grid grid-cols-2 gap-spacing-md"> {/* 16px */}
          <div className="space-y-spacing-sm"> {/* 8px */}
            <h3 className="text-lg font-medium text-primary">Section 1</h3> {/* 20px, 500, #1D1D1F */}
            <p className="text-base text-secondary">
              Content for the first section of this large modal.
            </p>
          </div>
          <div className="space-y-spacing-sm">
            <h3 className="text-lg font-medium text-primary">Section 2</h3>
            <p className="text-base text-secondary">
              Content for the second section of this large modal.
            </p>
          </div>
        </div>
        <div className="p-spacing-lg bg-secondary rounded-lg"> {/* 24px, #F5F5F7, 12px */}
          <p className="text-base text-secondary">
            Additional content area with background color.
          </p>
        </div>
      </div>
    ),
    footer: (
      <div className="flex gap-spacing-sm justify-between w-full">
        <Button variant="ghost">Back</Button>
        <div className="flex gap-spacing-sm">
          <Button variant="secondary">Save as Draft</Button>
          <Button variant="primary">Publish</Button>
        </div>
      </div>
    ),
  },
}

export const NoFooter: Story = {
  render: (args) => <InteractiveModal {...args} />,
  args: {
    title: 'Modal without Footer',
    description: 'Sometimes you don\'t need action buttons',
    children: (
      <div className="space-y-spacing-md">
        <p className="text-base text-secondary">
          This modal doesn't have a footer section. The content can include its own actions if needed.
        </p>
        <Button variant="primary" className="w-full">
          Action Inside Content
        </Button>
      </div>
    ),
  },
}

export const NoHeader: Story = {
  render: (args) => <InteractiveModal {...args} />,
  args: {
    children: (
      <div className="text-center space-y-spacing-lg py-spacing-lg"> {/* 24px */}
        <div className="mx-auto w-16 h-16 bg-brand-light rounded-full flex items-center justify-center"> {/* #F3E6FF */}
          <span className="text-2xl">✓</span>
        </div>
        <div className="space-y-spacing-sm">
          <h3 className="text-xl font-semibold text-primary">Success!</h3> {/* 24px, 600, #1D1D1F */}
          <p className="text-base text-secondary">
            Your changes have been saved successfully.
          </p>
        </div>
      </div>
    ),
    footer: (
      <Button variant="primary" className="w-full">
        Close
      </Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'A modal without header, useful for success messages or simple confirmations.',
      },
    },
  },
}

export const ScrollableContent: Story = {
  render: (args) => <InteractiveModal {...args} />,
  args: {
    title: 'Terms and Conditions',
    description: 'Please read and accept our terms',
    children: (
      <div className="space-y-spacing-md">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="text-base text-secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
        ))}
      </div>
    ),
    footer: (
      <div className="flex gap-spacing-sm justify-end">
        <Button variant="ghost">Decline</Button>
        <Button variant="primary">Accept</Button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with scrollable content. The header and footer remain visible while the content scrolls.',
      },
    },
  },
}