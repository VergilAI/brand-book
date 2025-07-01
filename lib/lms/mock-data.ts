import { Role } from './roles-data'

// User interface used across the platform
export interface User {
  id: string
  name: string
  email: string
  phone: string
  roleId: string
  role?: string // Role name for compatibility
  position?: { x: number; y: number }
  completionRate: number
  overallProgress?: number // Alias for completionRate
  status: 'ahead' | 'on_track' | 'at_risk' | 'behind'
  avatar?: string
  lastLogin: string
  joinDate: string
  coursesEnrolled: number
  coursesCompleted: number
  certificatesEarned: number
  totalHours: number
  severity?: 'low' | 'medium' | 'high' // Training severity
}

// Generate consistent phone numbers
const generatePhone = (index: number): string => {
  const area = 555
  const prefix = 100 + Math.floor(index / 100)
  const line = 1000 + (index % 1000)
  return `+1 (${area}) ${prefix}-${line}`
}

// Generate consistent dates
const generateDates = (index: number) => {
  const joinDate = new Date(2023, index % 12, (index % 28) + 1)
  const lastLogin = new Date(2024, 0, 15, 8 + (index % 16), index % 60)
  return {
    joinDate: joinDate.toISOString().split('T')[0],
    lastLogin: lastLogin.toISOString()
  }
}

// Calculate severity based on status and progress
const calculateSeverity = (status: string, completionRate: number): 'low' | 'medium' | 'high' => {
  if (status === 'on_track' && completionRate >= 80) return 'low'
  if (status === 'behind' || completionRate < 50) return 'high'
  return 'medium'
}

// Mock users with consistent data across the platform
export const mockUsers: User[] = [
  // Super Admins (2 users)
  {
    id: 'u1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: generatePhone(1),
    roleId: '1',
    role: 'Super Admin',
    position: { x: 300, y: 200 },
    completionRate: 100,
    overallProgress: 100,
    status: 'on_track',
    ...generateDates(1),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 0,
    totalHours: 0,
    severity: 'low'
  },
  {
    id: 'u2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: generatePhone(2),
    roleId: '1',
    role: 'Super Admin',
    position: { x: 500, y: 200 },
    completionRate: 100,
    overallProgress: 100,
    status: 'on_track',
    ...generateDates(2),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 0,
    totalHours: 0,
    severity: 'low'
  },
  
  // Admins (5 users)
  {
    id: 'u3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: generatePhone(3),
    roleId: '2',
    role: 'Admin',
    position: { x: 100, y: 350 },
    completionRate: 92,
    overallProgress: 92,
    status: 'on_track',
    ...generateDates(3),
    coursesEnrolled: 3,
    coursesCompleted: 2,
    certificatesEarned: 2,
    totalHours: 24.5,
    severity: 'low'
  },
  {
    id: 'u4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    phone: generatePhone(4),
    roleId: '2',
    role: 'Admin',
    position: { x: 300, y: 350 },
    completionRate: 95,
    overallProgress: 95,
    status: 'ahead',
    ...generateDates(4),
    coursesEnrolled: 4,
    coursesCompleted: 4,
    certificatesEarned: 4,
    totalHours: 36.0,
    severity: 'low'
  },
  {
    id: 'u5',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    phone: generatePhone(5),
    roleId: '2',
    role: 'Admin',
    position: { x: 500, y: 350 },
    completionRate: 88,
    overallProgress: 88,
    status: 'on_track',
    ...generateDates(5),
    coursesEnrolled: 5,
    coursesCompleted: 4,
    certificatesEarned: 3,
    totalHours: 42.3,
    severity: 'low'
  },
  {
    id: 'u6',
    name: 'Rachel Green',
    email: 'rachel.green@company.com',
    phone: generatePhone(6),
    roleId: '2',
    role: 'Admin',
    position: { x: 700, y: 350 },
    completionRate: 78,
    overallProgress: 78,
    status: 'at_risk',
    ...generateDates(6),
    coursesEnrolled: 4,
    coursesCompleted: 2,
    certificatesEarned: 2,
    totalHours: 28.7,
    severity: 'medium'
  },
  {
    id: 'u7',
    name: 'Thomas Anderson',
    email: 'thomas.anderson@company.com',
    phone: generatePhone(7),
    roleId: '2',
    role: 'Admin',
    position: { x: 900, y: 350 },
    completionRate: 91,
    overallProgress: 91,
    status: 'on_track',
    ...generateDates(7),
    coursesEnrolled: 6,
    coursesCompleted: 5,
    certificatesEarned: 4,
    totalHours: 58.2,
    severity: 'low'
  },
  
  // Managers (12 users)
  {
    id: 'u8',
    name: 'Jessica Williams',
    email: 'jessica.williams@company.com',
    phone: generatePhone(8),
    roleId: '3',
    role: 'Manager',
    position: { x: 50, y: 500 },
    completionRate: 90,
    overallProgress: 90,
    status: 'on_track',
    ...generateDates(8),
    coursesEnrolled: 8,
    coursesCompleted: 6,
    certificatesEarned: 4,
    totalHours: 72.5,
    severity: 'low'
  },
  {
    id: 'u9',
    name: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    phone: generatePhone(9),
    roleId: '3',
    role: 'Manager',
    position: { x: 200, y: 500 },
    completionRate: 86,
    overallProgress: 86,
    status: 'on_track',
    ...generateDates(9),
    coursesEnrolled: 7,
    coursesCompleted: 5,
    certificatesEarned: 3,
    totalHours: 63.0,
    severity: 'low'
  },
  {
    id: 'u10',
    name: 'Patricia Martinez',
    email: 'patricia.martinez@company.com',
    phone: generatePhone(10),
    roleId: '3',
    role: 'Manager',
    position: { x: 350, y: 500 },
    completionRate: 75,
    overallProgress: 75,
    status: 'at_risk',
    ...generateDates(10),
    coursesEnrolled: 6,
    coursesCompleted: 3,
    certificatesEarned: 2,
    totalHours: 45.8,
    severity: 'medium'
  },
  {
    id: 'u11',
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    phone: generatePhone(11),
    roleId: '3',
    role: 'Manager',
    position: { x: 500, y: 500 },
    completionRate: 93,
    overallProgress: 93,
    status: 'ahead',
    ...generateDates(11),
    coursesEnrolled: 9,
    coursesCompleted: 9,
    certificatesEarned: 7,
    totalHours: 95.2,
    severity: 'low'
  },
  {
    id: 'u12',
    name: 'Linda Davis',
    email: 'linda.davis@company.com',
    phone: generatePhone(12),
    roleId: '3',
    role: 'Manager',
    position: { x: 650, y: 500 },
    completionRate: 82,
    overallProgress: 82,
    status: 'on_track',
    ...generateDates(12),
    coursesEnrolled: 7,
    coursesCompleted: 5,
    certificatesEarned: 4,
    totalHours: 68.3,
    severity: 'low'
  },
  {
    id: 'u13',
    name: 'Christopher Lee',
    email: 'christopher.lee@company.com',
    phone: generatePhone(13),
    roleId: '3',
    role: 'Manager',
    position: { x: 800, y: 500 },
    completionRate: 65,
    overallProgress: 65,
    status: 'at_risk',
    ...generateDates(13),
    coursesEnrolled: 5,
    coursesCompleted: 2,
    certificatesEarned: 1,
    totalHours: 32.1,
    severity: 'medium'
  },
  {
    id: 'u14',
    name: 'Michelle Taylor',
    email: 'michelle.taylor@company.com',
    phone: generatePhone(14),
    roleId: '3',
    role: 'Manager',
    position: { x: 950, y: 500 },
    completionRate: 88,
    overallProgress: 88,
    status: 'on_track',
    ...generateDates(14),
    coursesEnrolled: 8,
    coursesCompleted: 6,
    certificatesEarned: 5,
    totalHours: 76.9,
    severity: 'low'
  },
  {
    id: 'u15',
    name: 'Daniel White',
    email: 'daniel.white@company.com',
    phone: generatePhone(15),
    roleId: '3',
    role: 'Manager',
    position: { x: 150, y: 600 },
    completionRate: 72,
    overallProgress: 72,
    status: 'at_risk',
    ...generateDates(15),
    coursesEnrolled: 6,
    coursesCompleted: 3,
    certificatesEarned: 2,
    totalHours: 41.5,
    severity: 'medium'
  },
  {
    id: 'u16',
    name: 'Nancy Garcia',
    email: 'nancy.garcia@company.com',
    phone: generatePhone(16),
    roleId: '3',
    role: 'Manager',
    position: { x: 350, y: 600 },
    completionRate: 94,
    overallProgress: 94,
    status: 'on_track',
    ...generateDates(16),
    coursesEnrolled: 10,
    coursesCompleted: 9,
    certificatesEarned: 7,
    totalHours: 105.7,
    severity: 'low'
  },
  {
    id: 'u17',
    name: 'Steven Harris',
    email: 'steven.harris@company.com',
    phone: generatePhone(17),
    roleId: '3',
    role: 'Manager',
    position: { x: 550, y: 600 },
    completionRate: 80,
    overallProgress: 80,
    status: 'on_track',
    ...generateDates(17),
    coursesEnrolled: 7,
    coursesCompleted: 5,
    certificatesEarned: 4,
    totalHours: 62.0,
    severity: 'low'
  },
  {
    id: 'u18',
    name: 'Karen Clark',
    email: 'karen.clark@company.com',
    phone: generatePhone(18),
    roleId: '3',
    role: 'Manager',
    position: { x: 750, y: 600 },
    completionRate: 55,
    overallProgress: 55,
    status: 'behind',
    ...generateDates(18),
    coursesEnrolled: 4,
    coursesCompleted: 1,
    certificatesEarned: 0,
    totalHours: 18.3,
    severity: 'high'
  },
  {
    id: 'u19',
    name: 'Brian Lewis',
    email: 'brian.lewis@company.com',
    phone: generatePhone(19),
    roleId: '3',
    role: 'Manager',
    position: { x: 950, y: 600 },
    completionRate: 91,
    overallProgress: 91,
    status: 'on_track',
    ...generateDates(19),
    coursesEnrolled: 9,
    coursesCompleted: 7,
    certificatesEarned: 6,
    totalHours: 88.4,
    severity: 'low'
  },
  
  // Instructors (8 users)
  {
    id: 'u20',
    name: 'Ryan Davis',
    email: 'ryan.davis@company.com',
    phone: generatePhone(20),
    roleId: '4',
    role: 'Instructor',
    position: { x: 100, y: 750 },
    completionRate: 85,
    overallProgress: 85,
    status: 'on_track',
    ...generateDates(20),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 5,
    totalHours: 120.0,
    severity: 'low'
  },
  {
    id: 'u21',
    name: 'Lisa Park',
    email: 'lisa.park@company.com',
    phone: generatePhone(21),
    roleId: '4',
    role: 'Instructor',
    position: { x: 300, y: 750 },
    completionRate: 78,
    overallProgress: 78,
    status: 'at_risk',
    ...generateDates(21),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 4,
    totalHours: 98.5,
    severity: 'medium'
  },
  {
    id: 'u22',
    name: 'Kevin Moore',
    email: 'kevin.moore@company.com',
    phone: generatePhone(22),
    roleId: '4',
    role: 'Instructor',
    position: { x: 500, y: 750 },
    completionRate: 82,
    overallProgress: 82,
    status: 'on_track',
    ...generateDates(22),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 4,
    totalHours: 112.3,
    severity: 'low'
  },
  {
    id: 'u23',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@company.com',
    phone: generatePhone(23),
    roleId: '4',
    role: 'Instructor',
    position: { x: 700, y: 750 },
    completionRate: 45,
    overallProgress: 45,
    status: 'behind',
    ...generateDates(23),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 2,
    totalHours: 65.7,
    severity: 'high'
  },
  {
    id: 'u24',
    name: 'Joseph Walker',
    email: 'joseph.walker@company.com',
    phone: generatePhone(24),
    roleId: '4',
    role: 'Instructor',
    position: { x: 900, y: 750 },
    completionRate: 88,
    overallProgress: 88,
    status: 'on_track',
    ...generateDates(24),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 6,
    totalHours: 145.2,
    severity: 'low'
  },
  {
    id: 'u25',
    name: 'Amanda Brown',
    email: 'amanda.brown@company.com',
    phone: generatePhone(25),
    roleId: '4',
    role: 'Instructor',
    position: { x: 200, y: 850 },
    completionRate: 70,
    overallProgress: 70,
    status: 'at_risk',
    ...generateDates(25),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 3,
    totalHours: 87.9,
    severity: 'medium'
  },
  {
    id: 'u26',
    name: 'Charles Martinez',
    email: 'charles.martinez@company.com',
    phone: generatePhone(26),
    roleId: '4',
    role: 'Instructor',
    position: { x: 400, y: 850 },
    completionRate: 92,
    overallProgress: 92,
    status: 'ahead',
    ...generateDates(26),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 8,
    totalHours: 168.4,
    severity: 'low'
  },
  {
    id: 'u27',
    name: 'Jennifer Taylor',
    email: 'jennifer.taylor@company.com',
    phone: generatePhone(27),
    roleId: '4',
    role: 'Instructor',
    position: { x: 600, y: 850 },
    completionRate: 60,
    overallProgress: 60,
    status: 'at_risk',
    ...generateDates(27),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 2,
    totalHours: 73.1,
    severity: 'medium'
  }
]

// Update role user counts based on actual data
export const updateRoleUserCounts = (roles: Role[]): Role[] => {
  return roles.map(role => ({
    ...role,
    usersCount: mockUsers.filter(user => user.roleId === role.id).length
  }))
}

// Helper function to get users by role
export const getUsersByRole = (roleId: string): User[] => {
  return mockUsers.filter(user => user.roleId === roleId)
}

// Helper function to get role name by ID
export const getRoleName = (roleId: string, roles: Role[]): string => {
  const role = roles.find(r => r.id === roleId)
  return role?.name || 'Unknown'
}