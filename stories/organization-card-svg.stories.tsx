import type { Meta, StoryObj } from '@storybook/react'
import { OrganizationCardSVGSimple } from '@/components/organization-card-svg-simple'

const meta: Meta<typeof OrganizationCardSVGSimple> = {
  title: 'Components/OrganizationCardSVGSimple',
  component: OrganizationCardSVGSimple,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '600px' }}>
        <svg width="800" height="600" style={{ border: '1px solid #ccc' }}>
          <Story />
        </svg>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof OrganizationCardSVGSimple>

export const EmployeeCardInSVG: Story = {
  args: {
    x: 50,
    y: 50,
    width: 220,
    height: 120,
    cardProps: {
      id: 'e1',
      type: 'employee',
      title: 'Sarah Johnson',
      subtitle: 'Super Admin',
      color: '#7B00FF',
      progress: 85,
      initials: 'SJ',
      status: 'on_track',
      isSelected: false,
    },
  },
}

export const MultipleEmployeeCards: Story = {
  render: () => (
    <svg width="1200" height="800">
      {/* Top level managers with improved spacing */}
      <OrganizationCardSVGSimple
        x={100}
        y={80}
        width={220}
        height={120}
        cardProps={{
          id: 'e1',
          type: 'employee',
          title: 'Sarah Johnson',
          subtitle: 'Super Admin',
          color: '#7B00FF',
          progress: 85,
          initials: 'SJ',
          status: 'on_track',
          isSelected: false,
        }}
      />
      <OrganizationCardSVGSimple
        x={500}
        y={80}
        width={220}
        height={120}
        cardProps={{
          id: 'e2',
          type: 'employee',
          title: 'Michael Chen',
          subtitle: 'Super Admin',
          color: '#7B00FF',
          progress: 92,
          initials: 'MC',
          status: 'ahead',
          isSelected: false,
        }}
      />
      
      {/* Second level with better spacing */}
      <OrganizationCardSVGSimple
        x={50}
        y={260}
        width={220}
        height={120}
        cardProps={{
          id: 'e3',
          type: 'employee',
          title: 'Emily Rodriguez',
          subtitle: 'Admin',
          color: '#0087FF',
          progress: 45,
          initials: 'ER',
          status: 'at_risk',
          isSelected: false,
        }}
      />
      <OrganizationCardSVGSimple
        x={320}
        y={260}
        width={220}
        height={120}
        cardProps={{
          id: 'e4',
          type: 'employee',
          title: 'David Kim',
          subtitle: 'Admin',
          color: '#0087FF',
          progress: 75,
          initials: 'DK',
          status: 'on_track',
          isSelected: false,
        }}
      />
      <OrganizationCardSVGSimple
        x={590}
        y={260}
        width={220}
        height={120}
        cardProps={{
          id: 'e5',
          type: 'employee',
          title: 'James Wilson',
          subtitle: 'Admin',
          color: '#0087FF',
          progress: 88,
          initials: 'JW',
          status: 'on_track',
          isSelected: false,
        }}
      />
      
      {/* Improved connection lines with different colors for better traceability */}
      <path
        d="M 210 200 C 210 230, 160 230, 160 260"
        stroke="#6366F1"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="5,3"
        opacity="0.7"
      />
      <path
        d="M 210 200 C 210 230, 430 230, 430 260"
        stroke="#10B981"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="5,3"
        opacity="0.7"
      />
      <path
        d="M 610 200 C 610 230, 700 230, 700 260"
        stroke="#F59E0B"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="5,3"
        opacity="0.7"
      />
    </svg>
  ),
}