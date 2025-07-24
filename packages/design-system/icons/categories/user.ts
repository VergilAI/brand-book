import { 
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Contact,
  PersonStanding,
  Baby,
  Accessibility
} from 'lucide-react'
import { IconDefinition } from '../types'

export const userIcons: IconDefinition[] = [
  {
    icon: User,
    name: 'User',
    category: 'user',
    description: 'Single user or profile',
    keywords: ['user', 'person', 'profile', 'account']
  },
  {
    icon: Users,
    name: 'Users',
    category: 'user',
    description: 'Multiple users or group',
    keywords: ['users', 'group', 'team', 'people']
  },
  {
    icon: UserPlus,
    name: 'UserPlus',
    category: 'user',
    description: 'Add user',
    keywords: ['add', 'user', 'invite', 'new']
  },
  {
    icon: UserMinus,
    name: 'UserMinus',
    category: 'user',
    description: 'Remove user',
    keywords: ['remove', 'user', 'delete', 'minus']
  },
  {
    icon: UserCheck,
    name: 'UserCheck',
    category: 'user',
    description: 'User verified or approved',
    keywords: ['verified', 'approved', 'check', 'user']
  },
  {
    icon: UserX,
    name: 'UserX',
    category: 'user',
    description: 'User blocked or removed',
    keywords: ['blocked', 'removed', 'banned', 'user']
  },
  {
    icon: Contact,
    name: 'Contact',
    category: 'user',
    description: 'Contact information',
    keywords: ['contact', 'card', 'profile', 'info']
  },
  {
    icon: PersonStanding,
    name: 'PersonStanding',
    category: 'user',
    description: 'Person or individual',
    keywords: ['person', 'standing', 'individual', 'human']
  }
]