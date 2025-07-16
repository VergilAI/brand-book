export interface Role {
  id: string
  name: string
  color: string
  description?: string
  usersCount: number
  parentRole?: string
  privileges: string[]
  createdAt: string
  position?: { x: number; y: number }
  completionRate?: number
  subordinatesCompletionRate?: number
  status?: 'on_track' | 'at_risk' | 'behind'
}

export const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    color: '#7B00FF',
    description: 'Full system access and control',
    usersCount: 0, // Will be calculated from mock data
    privileges: ['all'],
    createdAt: '2025-01-01',
    position: { x: 400, y: 50 },
    completionRate: 100,
    status: 'on_track'
  },
  {
    id: '2',
    name: 'Admin',
    color: '#0087FF',
    description: 'Administrative access with some restrictions',
    usersCount: 0, // Will be calculated from mock data
    parentRole: '1',
    privileges: ['user_view', 'user_create', 'user_edit', 'course_view', 'course_create', 'course_edit', 'analytics_view'],
    createdAt: '2025-01-15',
    position: { x: 400, y: 220 },
    completionRate: 95,
    status: 'on_track'
  },
  {
    id: '3',
    name: 'Manager',
    color: '#10B981',
    description: 'Team management and reporting',
    usersCount: 0, // Will be calculated from mock data
    parentRole: '2',
    privileges: ['user_view', 'course_view', 'course_assign', 'analytics_view', 'reports_generate'],
    createdAt: '2025-02-01',
    position: { x: 275, y: 390 },
    completionRate: 88,
    status: 'at_risk'
  },
  {
    id: '4',
    name: 'Instructor',
    color: '#FFB300',
    description: 'Course creation and student management',
    usersCount: 0, // Will be calculated from mock data
    parentRole: '2',
    privileges: ['course_view', 'course_create', 'course_edit', 'user_view', 'content_upload'],
    createdAt: '2025-02-15',
    position: { x: 525, y: 390 },
    completionRate: 82,
    status: 'behind'
  }
]

// Helper to auto-position new roles based on their parent
export function calculateNewRolePosition(roles: Role[], parentRoleId?: string): { x: number; y: number } {
  if (!parentRoleId) {
    // Top-level role - find rightmost position
    const topLevelRoles = roles.filter(r => !r.parentRole)
    const maxX = Math.max(...topLevelRoles.map(r => r.position?.x || 0))
    return { x: maxX + 250, y: 50 }
  }
  
  const parentRole = roles.find(r => r.id === parentRoleId)
  if (!parentRole?.position) {
    return { x: 400, y: 50 } // Default position
  }
  
  // Find siblings (roles with same parent)
  const siblings = roles.filter(r => r.parentRole === parentRoleId)
  
  if (siblings.length === 0) {
    // First child - position directly below parent
    return { x: parentRole.position.x, y: parentRole.position.y + 170 }
  }
  
  // Position to the right of last sibling
  const maxX = Math.max(...siblings.map(r => r.position?.x || 0))
  const lastSibling = siblings.find(r => r.position?.x === maxX)
  
  return { 
    x: maxX + 250, 
    y: lastSibling?.position?.y || parentRole.position.y + 170 
  }
}