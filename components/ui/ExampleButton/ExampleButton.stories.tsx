import type { Meta, StoryObj } from '@storybook/react';
import { ExampleButton } from './ExampleButton';

const meta = {
  title: 'Components/ExampleButton',
  component: ExampleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof ExampleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'ExampleButton content',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary variant',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small size',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large size',
  },
};
