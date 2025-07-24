import { LucideIcon } from 'lucide-react'

export interface IconDefinition {
  icon: LucideIcon
  name: string
  category: IconCategory
  description?: string
  keywords?: string[]
}

export type IconCategory = 
  | 'navigation'
  | 'action'
  | 'status'
  | 'social'
  | 'file'
  | 'device'
  | 'user'
  | 'communication'
  | 'education'
  | 'interface'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: IconSize
  color?: string
  strokeWidth?: number
}

export const iconSizes: Record<IconSize, number> = {
  xs: 12,  // 12px
  sm: 16,  // 16px
  md: 20,  // 20px (default)
  lg: 24,  // 24px
  xl: 32,  // 32px
}