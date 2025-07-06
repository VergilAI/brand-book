import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the textarea',
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant of the textarea',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
    success: {
      control: 'boolean',
      description: 'Show success state',
    },
    autoResize: {
      control: 'boolean',
      description: 'Enable auto-resize functionality',
    },
    showCount: {
      control: 'boolean',
      description: 'Show character count',
    },
    maxCount: {
      control: 'number',
      description: 'Maximum character count',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
  args: {
    placeholder: 'Enter your message here...',
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Type something...',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-lg w-[500px]">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-xs">Small</label>
        <Textarea size="sm" placeholder="Small textarea..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-xs">Medium</label>
        <Textarea size="md" placeholder="Medium textarea..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-xs">Large</label>
        <Textarea size="lg" placeholder="Large textarea..." />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-lg w-[500px]">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-xs">Default</label>
        <Textarea placeholder="Default state..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-error mb-xs">Error</label>
        <Textarea error placeholder="Error state..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-success mb-xs">Success</label>
        <Textarea success placeholder="Success state..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-disabled mb-xs">Disabled</label>
        <Textarea disabled placeholder="Disabled state..." />
      </div>
    </div>
  ),
}

export const AutoResize: Story = {
  args: {
    autoResize: true,
    placeholder: 'Start typing and watch me grow...',
    defaultValue: 'This textarea will automatically resize as you type more content. Try adding multiple lines to see it in action!',
  },
}

export const CharacterCount: Story = {
  render: () => (
    <div className="flex flex-col gap-lg w-[500px]">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-xs">
          Without limit
        </label>
        <Textarea 
          showCount 
          placeholder="Type to see character count..." 
          defaultValue="Hello world!"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-xs">
          With limit (100 characters)
        </label>
        <Textarea 
          showCount 
          maxCount={100}
          placeholder="Limited to 100 characters..." 
          defaultValue="This textarea has a maximum character limit. As you approach the limit, the counter will turn red."
        />
      </div>
    </div>
  ),
}

export const CompleteExample: Story = {
  render: () => (
    <div className="w-[600px] p-xl bg-bg-secondary rounded-lg">
      <form className="space-y-md">
        <div>
          <label htmlFor="bio" className="block text-base font-medium text-text-primary mb-sm">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            autoResize
            showCount
            maxCount={500}
            placeholder="Tell us about yourself..."
            defaultValue="I'm a developer passionate about creating beautiful and functional user interfaces."
            className="mb-xs"
          />
          <p className="text-sm text-text-secondary">
            Write a brief description about yourself.
          </p>
        </div>
        
        <div>
          <label htmlFor="feedback" className="block text-base font-medium text-text-primary mb-sm">
            Feedback
          </label>
          <Textarea
            id="feedback"
            name="feedback"
            size="lg"
            placeholder="Share your thoughts..."
            rows={5}
          />
        </div>
        
        <div className="flex gap-sm pt-md">
          <button
            type="submit"
            className="px-lg py-sm bg-bg-brand text-text-inverse rounded-md hover:opacity-90 transition-opacity"
          >
            Submit
          </button>
          <button
            type="button"
            className="px-lg py-sm bg-bg-emphasis text-text-primary rounded-md hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  ),
}

export const WithLongContent: Story = {
  args: {
    defaultValue: `This is a textarea with a lot of content to demonstrate the scrollbar styling.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
    rows: 8,
  },
}