import { 
  Mail,
  MessageSquare,
  MessageCircle,
  MessagesSquare,
  Phone,
  PhoneCall,
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Inbox,
  Send,
  AtSign,
  Hash
} from 'lucide-react'
import { IconDefinition } from '../types'

export const communicationIcons: IconDefinition[] = [
  {
    icon: Mail,
    name: 'Mail',
    category: 'communication',
    description: 'Email or message',
    keywords: ['mail', 'email', 'message', 'envelope']
  },
  {
    icon: MessageSquare,
    name: 'MessageSquare',
    category: 'communication',
    description: 'Chat or comment',
    keywords: ['message', 'chat', 'comment', 'bubble']
  },
  {
    icon: MessageCircle,
    name: 'MessageCircle',
    category: 'communication',
    description: 'Chat bubble',
    keywords: ['message', 'chat', 'bubble', 'comment']
  },
  {
    icon: MessagesSquare,
    name: 'MessagesSquare',
    category: 'communication',
    description: 'Multiple messages',
    keywords: ['messages', 'chat', 'conversation', 'discussion']
  },
  {
    icon: Phone,
    name: 'Phone',
    category: 'communication',
    description: 'Phone or call',
    keywords: ['phone', 'call', 'contact', 'mobile']
  },
  {
    icon: PhoneCall,
    name: 'PhoneCall',
    category: 'communication',
    description: 'Active call',
    keywords: ['call', 'phone', 'active', 'ringing']
  },
  {
    icon: Video,
    name: 'Video',
    category: 'communication',
    description: 'Video call or camera',
    keywords: ['video', 'camera', 'call', 'meeting']
  },
  {
    icon: Mic,
    name: 'Mic',
    category: 'communication',
    description: 'Microphone on',
    keywords: ['mic', 'microphone', 'audio', 'speak']
  },
  {
    icon: MicOff,
    name: 'MicOff',
    category: 'communication',
    description: 'Microphone muted',
    keywords: ['mute', 'mic', 'off', 'silent']
  },
  {
    icon: Volume2,
    name: 'Volume2',
    category: 'communication',
    description: 'Sound on',
    keywords: ['volume', 'sound', 'audio', 'speaker']
  },
  {
    icon: VolumeX,
    name: 'VolumeX',
    category: 'communication',
    description: 'Sound muted',
    keywords: ['mute', 'volume', 'silent', 'off']
  },
  {
    icon: Bell,
    name: 'Bell',
    category: 'communication',
    description: 'Notifications on',
    keywords: ['bell', 'notification', 'alert', 'ring']
  },
  {
    icon: BellOff,
    name: 'BellOff',
    category: 'communication',
    description: 'Notifications off',
    keywords: ['bell', 'off', 'mute', 'silent']
  },
  {
    icon: Inbox,
    name: 'Inbox',
    category: 'communication',
    description: 'Inbox or messages',
    keywords: ['inbox', 'messages', 'mail', 'tray']
  },
  {
    icon: AtSign,
    name: 'AtSign',
    category: 'communication',
    description: 'Mention or email',
    keywords: ['at', 'mention', 'email', 'tag']
  },
  {
    icon: Hash,
    name: 'Hash',
    category: 'communication',
    description: 'Hashtag or channel',
    keywords: ['hash', 'hashtag', 'channel', 'tag']
  }
]