import { 
  Plus,
  Trash,
  Edit,
  Copy,
  Download,
  Upload,
  Save,
  Shuffle,
  RefreshCw,
  RotateCw,
  Play,
  Pause,
  Square,
  Settings,
  Filter,
  ArrowUpDown,
  Move,
  Maximize,
  Minimize,
  LogOut,
  LogIn,
  Share,
  Send
} from 'lucide-react'
import { IconDefinition } from '../types'

export const actionIcons: IconDefinition[] = [
  {
    icon: Plus,
    name: 'Plus',
    category: 'action',
    description: 'Add or create new item',
    keywords: ['add', 'new', 'create', 'plus']
  },
  {
    icon: Trash,
    name: 'Trash',
    category: 'action',
    description: 'Delete or remove item',
    keywords: ['delete', 'remove', 'trash', 'bin']
  },
  {
    icon: Edit,
    name: 'Edit',
    category: 'action',
    description: 'Edit or modify content',
    keywords: ['edit', 'modify', 'pencil', 'write']
  },
  {
    icon: Copy,
    name: 'Copy',
    category: 'action',
    description: 'Copy to clipboard',
    keywords: ['copy', 'duplicate', 'clipboard']
  },
  {
    icon: Download,
    name: 'Download',
    category: 'action',
    description: 'Download file or content',
    keywords: ['download', 'save', 'export']
  },
  {
    icon: Upload,
    name: 'Upload',
    category: 'action',
    description: 'Upload file or content',
    keywords: ['upload', 'import', 'add']
  },
  {
    icon: Save,
    name: 'Save',
    category: 'action',
    description: 'Save changes',
    keywords: ['save', 'disk', 'floppy']
  },
  {
    icon: Shuffle,
    name: 'Shuffle',
    category: 'action',
    description: 'Randomize or shuffle',
    keywords: ['shuffle', 'random', 'mix']
  },
  {
    icon: RefreshCw,
    name: 'RefreshCw',
    category: 'action',
    description: 'Refresh or reload',
    keywords: ['refresh', 'reload', 'sync']
  },
  {
    icon: Play,
    name: 'Play',
    category: 'action',
    description: 'Start or play',
    keywords: ['play', 'start', 'begin']
  },
  {
    icon: Pause,
    name: 'Pause',
    category: 'action',
    description: 'Pause action',
    keywords: ['pause', 'stop', 'wait']
  },
  {
    icon: Settings,
    name: 'Settings',
    category: 'action',
    description: 'Open settings',
    keywords: ['settings', 'gear', 'preferences', 'config']
  },
  {
    icon: Filter,
    name: 'Filter',
    category: 'action',
    description: 'Filter content',
    keywords: ['filter', 'funnel', 'sort']
  },
  {
    icon: Move,
    name: 'Move',
    category: 'action',
    description: 'Move or drag item',
    keywords: ['move', 'drag', 'arrows']
  },
  {
    icon: LogOut,
    name: 'LogOut',
    category: 'action',
    description: 'Sign out or logout',
    keywords: ['logout', 'signout', 'exit']
  },
  {
    icon: LogIn,
    name: 'LogIn',
    category: 'action',
    description: 'Sign in or login',
    keywords: ['login', 'signin', 'enter']
  },
  {
    icon: Share,
    name: 'Share',
    category: 'action',
    description: 'Share content',
    keywords: ['share', 'social', 'send']
  },
  {
    icon: Send,
    name: 'Send',
    category: 'action',
    description: 'Send or submit',
    keywords: ['send', 'submit', 'paper plane']
  }
]