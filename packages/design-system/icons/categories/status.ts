import { 
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  XCircle,
  Clock,
  Loader,
  Star,
  Heart,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { IconDefinition } from '../types'

export const statusIcons: IconDefinition[] = [
  {
    icon: Check,
    name: 'Check',
    category: 'status',
    description: 'Success or completed',
    keywords: ['check', 'done', 'complete', 'success']
  },
  {
    icon: CheckCircle,
    name: 'CheckCircle',
    category: 'status',
    description: 'Success state with emphasis',
    keywords: ['success', 'complete', 'done', 'circle']
  },
  {
    icon: AlertCircle,
    name: 'AlertCircle',
    category: 'status',
    description: 'Warning or alert state',
    keywords: ['warning', 'alert', 'attention', 'exclamation']
  },
  {
    icon: AlertTriangle,
    name: 'AlertTriangle',
    category: 'status',
    description: 'Warning with high priority',
    keywords: ['warning', 'danger', 'alert', 'triangle']
  },
  {
    icon: Info,
    name: 'Info',
    category: 'status',
    description: 'Information indicator',
    keywords: ['info', 'information', 'help']
  },
  {
    icon: HelpCircle,
    name: 'HelpCircle',
    category: 'status',
    description: 'Help or question indicator',
    keywords: ['help', 'question', 'support', 'faq']
  },
  {
    icon: XCircle,
    name: 'XCircle',
    category: 'status',
    description: 'Error or failure state',
    keywords: ['error', 'fail', 'close', 'remove']
  },
  {
    icon: Clock,
    name: 'Clock',
    category: 'status',
    description: 'Time or pending state',
    keywords: ['time', 'clock', 'pending', 'wait']
  },
  {
    icon: Loader,
    name: 'Loader',
    category: 'status',
    description: 'Loading state',
    keywords: ['loading', 'spinner', 'progress', 'wait']
  },
  {
    icon: Star,
    name: 'Star',
    category: 'status',
    description: 'Favorite or rating',
    keywords: ['star', 'favorite', 'rating', 'bookmark']
  },
  {
    icon: Heart,
    name: 'Heart',
    category: 'status',
    description: 'Like or favorite',
    keywords: ['heart', 'like', 'love', 'favorite']
  },
  {
    icon: Eye,
    name: 'Eye',
    category: 'status',
    description: 'Visible or view',
    keywords: ['eye', 'view', 'visible', 'show']
  },
  {
    icon: EyeOff,
    name: 'EyeOff',
    category: 'status',
    description: 'Hidden or private',
    keywords: ['hide', 'hidden', 'private', 'invisible']
  },
  {
    icon: Lock,
    name: 'Lock',
    category: 'status',
    description: 'Locked or secure',
    keywords: ['lock', 'secure', 'private', 'closed']
  },
  {
    icon: Unlock,
    name: 'Unlock',
    category: 'status',
    description: 'Unlocked or open',
    keywords: ['unlock', 'open', 'public', 'available']
  },
  {
    icon: Shield,
    name: 'Shield',
    category: 'status',
    description: 'Security or protection',
    keywords: ['shield', 'security', 'protection', 'safe']
  },
  {
    icon: ShieldCheck,
    name: 'ShieldCheck',
    category: 'status',
    description: 'Verified or secure',
    keywords: ['verified', 'secure', 'protected', 'safe']
  },
  {
    icon: Zap,
    name: 'Zap',
    category: 'status',
    description: 'Energy or quick action',
    keywords: ['zap', 'energy', 'fast', 'lightning']
  },
  {
    icon: TrendingUp,
    name: 'TrendingUp',
    category: 'status',
    description: 'Increase or growth',
    keywords: ['growth', 'increase', 'up', 'trend']
  },
  {
    icon: TrendingDown,
    name: 'TrendingDown',
    category: 'status',
    description: 'Decrease or decline',
    keywords: ['decrease', 'decline', 'down', 'trend']
  }
]