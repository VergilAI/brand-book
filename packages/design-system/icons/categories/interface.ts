import { 
  Grid,
  List,
  LayoutGrid,
  LayoutList,
  Sidebar,
  PanelLeft,
  PanelRight,
  Maximize2,
  Minimize2,
  Expand,
  Shrink,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Palette,
  Layers,
  Package,
  Box,
  Calendar,
  CalendarDays,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  DollarSign,
  Percent,
  Hash,
  Link,
  ExternalLink,
  Anchor,
  Command,
  Terminal,
  Code,
  Github,
  Keyboard,
  Mouse,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Bluetooth,
  Cast,
  Airplay,
  Cloud,
  CloudDownload,
  CloudUpload,
  Database,
  Server,
  Globe,
  Map,
  MapPin,
  Navigation,
  Compass
} from 'lucide-react'
import { IconDefinition } from '../types'

export const interfaceIcons: IconDefinition[] = [
  // Layout
  {
    icon: Grid,
    name: 'Grid',
    category: 'interface',
    description: 'Grid view',
    keywords: ['grid', 'layout', 'view']
  },
  {
    icon: List,
    name: 'List',
    category: 'interface',
    description: 'List view',
    keywords: ['list', 'layout', 'view']
  },
  {
    icon: LayoutGrid,
    name: 'LayoutGrid',
    category: 'interface',
    description: 'Grid layout',
    keywords: ['layout', 'grid', 'dashboard']
  },
  {
    icon: Sidebar,
    name: 'Sidebar',
    category: 'interface',
    description: 'Sidebar toggle',
    keywords: ['sidebar', 'panel', 'navigation']
  },
  
  // Window controls
  {
    icon: Maximize2,
    name: 'Maximize2',
    category: 'interface',
    description: 'Maximize window',
    keywords: ['maximize', 'fullscreen', 'expand']
  },
  {
    icon: Minimize2,
    name: 'Minimize2',
    category: 'interface',
    description: 'Minimize window',
    keywords: ['minimize', 'reduce', 'small']
  },
  
  // UI Controls
  {
    icon: Sliders,
    name: 'Sliders',
    category: 'interface',
    description: 'Settings or filters',
    keywords: ['sliders', 'settings', 'adjust', 'filter']
  },
  {
    icon: ToggleLeft,
    name: 'ToggleLeft',
    category: 'interface',
    description: 'Toggle off state',
    keywords: ['toggle', 'switch', 'off']
  },
  {
    icon: ToggleRight,
    name: 'ToggleRight',
    category: 'interface',
    description: 'Toggle on state',
    keywords: ['toggle', 'switch', 'on']
  },
  
  // Data & Charts
  {
    icon: BarChart3,
    name: 'BarChart3',
    category: 'interface',
    description: 'Bar chart or analytics',
    keywords: ['chart', 'graph', 'analytics', 'stats']
  },
  {
    icon: PieChart,
    name: 'PieChart',
    category: 'interface',
    description: 'Pie chart',
    keywords: ['chart', 'pie', 'analytics', 'stats']
  },
  {
    icon: Activity,
    name: 'Activity',
    category: 'interface',
    description: 'Activity or pulse',
    keywords: ['activity', 'pulse', 'monitor', 'stats']
  },
  
  // Calendar & Time
  {
    icon: Calendar,
    name: 'Calendar',
    category: 'interface',
    description: 'Calendar view',
    keywords: ['calendar', 'date', 'schedule']
  },
  {
    icon: CalendarDays,
    name: 'CalendarDays',
    category: 'interface',
    description: 'Calendar with dates',
    keywords: ['calendar', 'dates', 'schedule', 'month']
  },
  
  // Finance
  {
    icon: CreditCard,
    name: 'CreditCard',
    category: 'interface',
    description: 'Payment or billing',
    keywords: ['payment', 'credit', 'card', 'billing']
  },
  {
    icon: DollarSign,
    name: 'DollarSign',
    category: 'interface',
    description: 'Money or price',
    keywords: ['dollar', 'money', 'price', 'currency']
  },
  
  // Links & Navigation
  {
    icon: Link,
    name: 'Link',
    category: 'interface',
    description: 'Link or connection',
    keywords: ['link', 'chain', 'connect', 'url']
  },
  {
    icon: ExternalLink,
    name: 'ExternalLink',
    category: 'interface',
    description: 'External link',
    keywords: ['external', 'link', 'open', 'new']
  },
  
  // Development
  {
    icon: Terminal,
    name: 'Terminal',
    category: 'interface',
    description: 'Terminal or console',
    keywords: ['terminal', 'console', 'command', 'cli']
  },
  {
    icon: Code,
    name: 'Code',
    category: 'interface',
    description: 'Code or development',
    keywords: ['code', 'development', 'programming']
  },
  {
    icon: Github,
    name: 'Github',
    category: 'interface',
    description: 'GitHub',
    keywords: ['github', 'git', 'version', 'control']
  },
  
  // Devices
  {
    icon: Monitor,
    name: 'Monitor',
    category: 'interface',
    description: 'Desktop or monitor',
    keywords: ['monitor', 'desktop', 'screen', 'computer']
  },
  {
    icon: Smartphone,
    name: 'Smartphone',
    category: 'interface',
    description: 'Mobile device',
    keywords: ['phone', 'mobile', 'smartphone', 'device']
  },
  {
    icon: Tablet,
    name: 'Tablet',
    category: 'interface',
    description: 'Tablet device',
    keywords: ['tablet', 'ipad', 'device']
  },
  
  // Connectivity
  {
    icon: Wifi,
    name: 'Wifi',
    category: 'interface',
    description: 'WiFi connected',
    keywords: ['wifi', 'wireless', 'internet', 'connection']
  },
  {
    icon: WifiOff,
    name: 'WifiOff',
    category: 'interface',
    description: 'WiFi disconnected',
    keywords: ['wifi', 'off', 'disconnected', 'offline']
  },
  
  // Cloud & Storage
  {
    icon: Cloud,
    name: 'Cloud',
    category: 'interface',
    description: 'Cloud storage',
    keywords: ['cloud', 'storage', 'sync']
  },
  {
    icon: Database,
    name: 'Database',
    category: 'interface',
    description: 'Database or storage',
    keywords: ['database', 'storage', 'data']
  },
  {
    icon: Server,
    name: 'Server',
    category: 'interface',
    description: 'Server or backend',
    keywords: ['server', 'backend', 'hosting']
  },
  
  // Location
  {
    icon: Globe,
    name: 'Globe',
    category: 'interface',
    description: 'World or global',
    keywords: ['globe', 'world', 'global', 'earth']
  },
  {
    icon: Map,
    name: 'Map',
    category: 'interface',
    description: 'Map view',
    keywords: ['map', 'location', 'geography']
  },
  {
    icon: MapPin,
    name: 'MapPin',
    category: 'interface',
    description: 'Location marker',
    keywords: ['pin', 'location', 'marker', 'place']
  },
  {
    icon: Navigation,
    name: 'Navigation',
    category: 'interface',
    description: 'Navigation or direction',
    keywords: ['navigation', 'direction', 'compass', 'gps']
  },
  {
    icon: Compass,
    name: 'Compass',
    category: 'interface',
    description: 'Compass or orientation',
    keywords: ['compass', 'direction', 'orientation', 'navigate']
  }
]