import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

const meta: Meta<typeof DialogContent> = {
  title: "UI/Dialog",
  component: DialogContent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A modern modal dialog component built with semantic tokens, supporting multiple sizes, positions, and smooth animations.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg", "xl", "full"],
      description: "The size of the dialog",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    position: {
      control: "select",
      options: ["center", "top", "bottom", "left", "right"],
      description: "The position of the dialog on screen",
      table: {
        defaultValue: { summary: "center" },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof DialogContent>

export const Default: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
}

export const WithFooter: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-[var(--spacing-md)] py-[var(--spacing-md)]">
          <div className="grid grid-cols-4 items-center gap-[var(--spacing-md)]">
            <label htmlFor="name" className="text-right text-[var(--font-size-sm)]">
              Name
            </label>
            <input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3 h-10 rounded-[var(--radius-md)] border border-default bg-emphasisInput px-[var(--spacing-sm)] text-[var(--font-size-sm)]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-[var(--spacing-md)]">
            <label htmlFor="username" className="text-right text-[var(--font-size-sm)]">
              Username
            </label>
            <input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3 h-10 rounded-[var(--radius-md)] border border-default bg-emphasisInput px-[var(--spacing-sm)] text-[var(--font-size-sm)]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-[var(--spacing-md)]">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Small</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>
              This is a small dialog with a maximum width of 384px.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Default</Button>
        </DialogTrigger>
        <DialogContent size="default">
          <DialogHeader>
            <DialogTitle>Default Dialog</DialogTitle>
            <DialogDescription>
              This is a default dialog with a maximum width of 512px.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Large</Button>
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>
              This is a large dialog with a maximum width of 672px.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Extra Large</Button>
        </DialogTrigger>
        <DialogContent size="xl">
          <DialogHeader>
            <DialogTitle>Extra Large Dialog</DialogTitle>
            <DialogDescription>
              This is an extra large dialog with a maximum width of 896px.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Full</Button>
        </DialogTrigger>
        <DialogContent size="full">
          <DialogHeader>
            <DialogTitle>Full Width Dialog</DialogTitle>
            <DialogDescription>
              This is a full width dialog with a maximum width of 1280px.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="flex gap-[var(--spacing-md)]">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Center</Button>
        </DialogTrigger>
        <DialogContent position="center">
          <DialogHeader>
            <DialogTitle>Center Position</DialogTitle>
            <DialogDescription>
              This dialog appears in the center of the screen with zoom animation.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Top</Button>
        </DialogTrigger>
        <DialogContent position="top">
          <DialogHeader>
            <DialogTitle>Top Position</DialogTitle>
            <DialogDescription>
              This dialog slides in from the top of the screen.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Bottom</Button>
        </DialogTrigger>
        <DialogContent position="bottom">
          <DialogHeader>
            <DialogTitle>Bottom Position</DialogTitle>
            <DialogDescription>
              This dialog slides in from the bottom of the screen.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Left</Button>
        </DialogTrigger>
        <DialogContent position="left">
          <DialogHeader>
            <DialogTitle>Left Position</DialogTitle>
            <DialogDescription>
              This dialog slides in from the left side of the screen.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Right</Button>
        </DialogTrigger>
        <DialogContent position="right">
          <DialogHeader>
            <DialogTitle>Right Position</DialogTitle>
            <DialogDescription>
              This dialog slides in from the right side of the screen.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

export const LongContent: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Terms of Service</Button>
      </DialogTrigger>
      <DialogContent {...args} className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read our terms of service carefully before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="text-[var(--font-size-sm)] text-secondary space-y-[var(--spacing-md)]">
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
          ))}
        </div>
        <DialogFooter>
          <Button variant="secondary">Cancel</Button>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const CustomStyling: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Custom Dialog</Button>
      </DialogTrigger>
      <DialogContent
        {...args}
        className="bg-brand text-inverse border-brand shadow-brand-lg"
      >
        <DialogHeader>
          <DialogTitle>Custom Styled Dialog</DialogTitle>
          <DialogDescription className="text-inverse/80">
            This dialog uses custom styling with brand colors and inverse text.
          </DialogDescription>
        </DialogHeader>
        <div className="py-[var(--spacing-lg)]">
          <p className="text-[var(--font-size-sm)]">
            You can customize the dialog appearance by adding custom classes
            that use semantic tokens from the design system.
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" className="text-inverse hover:bg-inverse/10">
            Cancel
          </Button>
          <Button className="bg-inverse text-brand hover:bg-inverse/90">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithAnimation: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Animated Dialog</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Smooth Animations</DialogTitle>
          <DialogDescription>
            This dialog demonstrates the smooth open and close animations using
            semantic motion tokens. The backdrop blur and fade effects create
            a polished user experience.
          </DialogDescription>
        </DialogHeader>
        <div className="py-[var(--spacing-lg)] space-y-[var(--spacing-sm)]">
          <div className="p-[var(--spacing-md)] bg-emphasis rounded-[var(--radius-md)] transition-all duration-normal hover:shadow-card-hover">
            <p className="text-[var(--font-size-sm)] text-secondary">
              Hover over this card to see the shadow transition.
            </p>
          </div>
          <div className="p-[var(--spacing-md)] bg-brandLight rounded-[var(--radius-md)] transition-all duration-slow hover:bg-brand hover:text-inverse">
            <p className="text-[var(--font-size-sm)]">
              This card transitions colors on hover.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
}