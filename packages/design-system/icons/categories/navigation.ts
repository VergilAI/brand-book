import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Menu,
  X,
  Home,
  Search,
  MoreHorizontal,
  MoreVertical
} from 'lucide-react'
import { IconDefinition } from '../types'

export const navigationIcons: IconDefinition[] = [
  {
    icon: ChevronLeft,
    name: 'ChevronLeft',
    category: 'navigation',
    description: 'Navigate to previous item',
    keywords: ['back', 'previous', 'arrow']
  },
  {
    icon: ChevronRight,
    name: 'ChevronRight',
    category: 'navigation',
    description: 'Navigate to next item',
    keywords: ['next', 'forward', 'arrow']
  },
  {
    icon: ChevronDown,
    name: 'ChevronDown',
    category: 'navigation',
    description: 'Expand or show more content',
    keywords: ['expand', 'down', 'arrow', 'dropdown']
  },
  {
    icon: ChevronUp,
    name: 'ChevronUp',
    category: 'navigation',
    description: 'Collapse or show less content',
    keywords: ['collapse', 'up', 'arrow']
  },
  {
    icon: ArrowLeft,
    name: 'ArrowLeft',
    category: 'navigation',
    description: 'Go back or move left',
    keywords: ['back', 'left', 'return']
  },
  {
    icon: ArrowRight,
    name: 'ArrowRight',
    category: 'navigation',
    description: 'Go forward or move right',
    keywords: ['forward', 'right', 'next']
  },
  {
    icon: Menu,
    name: 'Menu',
    category: 'navigation',
    description: 'Open navigation menu',
    keywords: ['hamburger', 'navigation', 'menu']
  },
  {
    icon: X,
    name: 'X',
    category: 'navigation',
    description: 'Close or dismiss',
    keywords: ['close', 'dismiss', 'cancel', 'exit']
  },
  {
    icon: Home,
    name: 'Home',
    category: 'navigation',
    description: 'Navigate to home',
    keywords: ['home', 'house', 'main']
  },
  {
    icon: Search,
    name: 'Search',
    category: 'navigation',
    description: 'Search functionality',
    keywords: ['search', 'find', 'magnifier']
  },
  {
    icon: MoreHorizontal,
    name: 'MoreHorizontal',
    category: 'navigation',
    description: 'More options menu',
    keywords: ['more', 'options', 'dots', 'menu']
  },
  {
    icon: MoreVertical,
    name: 'MoreVertical',
    category: 'navigation',
    description: 'More options menu (vertical)',
    keywords: ['more', 'options', 'dots', 'menu']
  }
]