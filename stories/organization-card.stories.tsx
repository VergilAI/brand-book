import type { Meta, StoryObj } from '@storybook/react'
import { OrganizationCard } from '@/components/organization-card'

const meta: Meta<typeof OrganizationCard> = {
  title: 'Components/OrganizationCard',
  component: OrganizationCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof OrganizationCard>

export const EmployeeCard: Story = {
  args: {
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
}

export const EmployeeCardSelected: Story = {
  args: {
    id: 'e2',
    type: 'employee',
    title: 'Michael Chen',
    subtitle: 'Admin',
    color: '#0087FF',
    progress: 92,
    initials: 'MC',
    status: 'on_track',
    isSelected: true,
  },
}

export const EmployeeCardAtRisk: Story = {
  args: {
    id: 'e3',
    type: 'employee',
    title: 'Emily Rodriguez',
    subtitle: 'Manager',
    color: '#FFC700',
    progress: 45,
    initials: 'ER',
    status: 'at_risk',
    isSelected: false,
  },
}

export const EmployeeCardBehind: Story = {
  args: {
    id: 'e4',
    type: 'employee',
    title: 'David Kim',
    subtitle: 'Instructor',
    color: '#E51C23',
    progress: 25,
    initials: 'DK',
    status: 'behind',
    isSelected: false,
  },
}

export const RoleCard: Story = {
  args: {
    id: 'r1',
    type: 'role',
    title: 'Super Admin',
    subtitle: 'Administrative Role',
    color: '#7B00FF',
    teamProgress: 88,
    usersCount: 5,
    isSelected: false,
  },
}

export const RoleCardSelected: Story = {
  args: {
    id: 'r2',
    type: 'role',
    title: 'Manager',
    subtitle: 'Management Role',
    color: '#0087FF',
    teamProgress: 75,
    usersCount: 12,
    isSelected: true,
  },
}