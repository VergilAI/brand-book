import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta = {
  title: 'Atomic/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info', 'brand'],
      description: 'The visual style variant of the badge',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-spacing-md">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="brand">Brand</Badge>
    </div>
  ),
}

export const WithLongText: Story = {
  render: () => (
    <div className="flex flex-col gap-spacing-sm max-w-md">
      <Badge variant="success">This is a badge with longer text content</Badge>
      <Badge variant="info">Another example with more descriptive text</Badge>
      <Badge variant="brand">Premium Feature Available</Badge>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div className="p-spacing-md bg-bg-secondary rounded-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-spacing-sm">
          Course Status
        </h3>
        <div className="flex gap-spacing-sm">
          <Badge variant="success">Active</Badge>
          <Badge variant="info">12 Lessons</Badge>
          <Badge variant="brand">Premium</Badge>
        </div>
      </div>
      
      <div className="p-spacing-md bg-bg-secondary rounded-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-spacing-sm">
          User Progress
        </h3>
        <div className="flex gap-spacing-sm">
          <Badge variant="warning">In Progress</Badge>
          <Badge variant="default">75% Complete</Badge>
        </div>
      </div>
      
      <div className="p-spacing-md bg-bg-secondary rounded-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-spacing-sm">
          System Status
        </h3>
        <div className="flex gap-spacing-sm">
          <Badge variant="error">Offline</Badge>
          <Badge variant="warning">Maintenance</Badge>
        </div>
      </div>
    </div>
  ),
}

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-spacing-md">
      <p className="text-text-secondary text-sm">
        Badges are readable with clear contrast and minimum text-sm font size
      </p>
      <div className="flex gap-spacing-sm">
        <Badge variant="default">Clear Text</Badge>
        <Badge variant="success">Good Contrast</Badge>
        <Badge variant="brand">Readable Size</Badge>
      </div>
    </div>
  ),
}

// Desktop optimized compact badge
export const CompactDesktop: Story = {
  render: () => (
    <div className="space-y-spacing-md">
      <div className="flex gap-spacing-sm items-center">
        <Badge variant="default">Compact</Badge>
        <Badge variant="success">Desktop</Badge>
        <Badge variant="brand">Optimized</Badge>
      </div>
      <p className="text-xs text-text-secondary">
        Desktop-optimized badges with compact padding (px-2.5 py-0.5)
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact badges ideal for desktop interfaces with limited space',
      },
    },
  },
}

// Desktop viewport example
export const DesktopViewport: Story = {
  render: () => (
    <div className="p-spacing-lg bg-bg-surface rounded-lg max-w-md">
      <h3 className="text-sm font-medium text-text-primary mb-spacing-sm">Desktop Badge Sizing</h3>
      <div className="flex gap-spacing-sm flex-wrap">
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">New</Badge>
        <Badge variant="brand">Pro</Badge>
      </div>
      <p className="text-xs text-text-secondary mt-spacing-sm">
        Compact size perfect for desktop data tables and lists
      </p>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Badge appearance on desktop viewports',
      },
    },
  },
}

// Mobile viewport example
export const MobileViewport: Story = {
  render: () => (
    <div className="p-spacing-lg bg-bg-surface rounded-lg">
      <h3 className="text-sm font-medium text-text-primary mb-spacing-sm">Mobile Badge Sizing</h3>
      <div className="flex gap-spacing-sm flex-wrap">
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="brand">Pro</Badge>
      </div>
      <p className="text-xs text-text-secondary mt-spacing-sm">
        Same compact size maintains consistency across devices
      </p>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Badge appearance on mobile viewports',
      },
    },
  },
}

// Responsive comparison
export const ResponsiveComparison: Story = {
  render: () => (
    <div className="space-y-spacing-xl">
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Desktop Usage</h3>
        <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-surface">
          <div className="space-y-spacing-md">
            <div className="flex items-center gap-spacing-md">
              <span className="text-sm text-text-primary">Course Title</span>
              <div className="flex gap-spacing-xs">
                <Badge variant="success">Active</Badge>
                <Badge variant="brand">Premium</Badge>
                <Badge variant="info">New</Badge>
              </div>
            </div>
            <div className="text-xs text-text-secondary">
              • Compact padding (px-2.5 py-0.5) saves space<br/>
              • Small font size (text-xs) for dense layouts<br/>
              • Perfect for tables, lists, and navigation
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Mobile Usage</h3>
        <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-surface">
          <div className="space-y-spacing-md">
            <div className="space-y-spacing-sm">
              <div className="text-sm text-text-primary">Course Progress</div>
              <div className="flex gap-spacing-xs flex-wrap">
                <Badge variant="warning">In Progress</Badge>
                <Badge variant="default">75%</Badge>
              </div>
            </div>
            <div className="text-xs text-text-secondary">
              • Same compact size maintains visual consistency<br/>
              • Clear contrast ensures readability on small screens<br/>
              • Adequate touch targets when clickable
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Usage Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
          <div className="p-spacing-md border border-border-subtle rounded-lg bg-bg-secondary">
            <h4 className="text-sm font-medium text-text-primary mb-spacing-xs">Data Tables</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border-subtle">
                  <th className="pb-spacing-xs">User</th>
                  <th className="pb-spacing-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-subtle">
                  <td className="py-spacing-xs">John Doe</td>
                  <td className="py-spacing-xs"><Badge variant="success">Active</Badge></td>
                </tr>
                <tr>
                  <td className="py-spacing-xs">Jane Smith</td>
                  <td className="py-spacing-xs"><Badge variant="warning">Pending</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-spacing-md border border-border-subtle rounded-lg bg-bg-secondary">
            <h4 className="text-sm font-medium text-text-primary mb-spacing-xs">Card Headers</h4>
            <div className="space-y-spacing-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm">Course A</span>
                <Badge variant="brand">Pro</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Course B</span>
                <Badge variant="info">New</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive comparison showing badge usage across different contexts and viewports',
      },
    },
  },
}