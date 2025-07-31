import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { InfoIcon, Settings, HelpCircle, UserCircle, ChevronDown } from 'lucide-react';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A popover component for displaying floating content. Built on Radix UI Popover primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Information</h4>
          <p className="text-sm text-muted-foreground">
            Click outside or press Escape to close this popover.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 min-h-[400px] place-items-center">
      <div className="space-y-2 text-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">Top</Button>
          </PopoverTrigger>
          <PopoverContent side="top">
            <p className="text-sm">This popover appears on top</p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2 text-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">Bottom</Button>
          </PopoverTrigger>
          <PopoverContent side="bottom">
            <p className="text-sm">This popover appears on bottom</p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2 text-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">Left</Button>
          </PopoverTrigger>
          <PopoverContent side="left">
            <p className="text-sm">This popover appears on the left</p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2 text-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">Right</Button>
          </PopoverTrigger>
          <PopoverContent side="right">
            <p className="text-sm">This popover appears on the right</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Account Settings</h4>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="grid gap-2">
            <Button variant="secondary" className="justify-start">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="secondary" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Button>
            <Button variant="secondary" className="justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="sm">Small</Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <p className="text-sm">Small popover content</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Default</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">Default popover content with standard width</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="lg">Large</Button>
        </PopoverTrigger>
        <PopoverContent className="w-96">
          <div className="space-y-4">
            <h4 className="font-medium">Large Popover</h4>
            <p className="text-sm text-muted-foreground">
              This is a large popover with more content. It can contain forms, lists, or any other content you need to display.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Action</Button>
              <Button size="sm" variant="secondary">Cancel</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const WithAlignment: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">
            Align Start
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <p className="text-sm">Aligned to the start of the trigger</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">
            Align Center
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center">
          <p className="text-sm">Aligned to the center of the trigger</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">
            Align End
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <p className="text-sm">Aligned to the end of the trigger</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const InteractiveForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Create New Item</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create Item</h4>
            <p className="text-sm text-muted-foreground">
              Fill in the details for your new item.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter item name" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Enter description" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">Create</Button>
            <Button type="button" variant="secondary" size="sm">Cancel</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  ),
};