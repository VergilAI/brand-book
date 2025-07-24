import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { iconMap, type IconName } from '@vergil/design-system/icons'
import { iconSizes, type IconSize } from '@vergil/design-system/icons/types'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
  size?: IconSize
  color?: string
  strokeWidth?: number
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', color = 'currentColor', strokeWidth = 2, className, ...props }, ref) => {
    const iconDef = iconMap[name]
    
    if (!iconDef) {
      console.warn(`Icon "${name}" not found in registry`)
      return null
    }
    
    const IconComponent = iconDef.icon
    const sizeValue = iconSizes[size]
    
    return (
      <IconComponent
        ref={ref}
        width={sizeValue}
        height={sizeValue}
        color={color}
        strokeWidth={strokeWidth}
        className={cn(
          'transition-colors duration-200', // var(--duration-normal)
          className
        )}
        aria-label={iconDef.description}
        {...props}
      />
    )
  }
)

Icon.displayName = 'Icon'

// Convenience component for rendering any lucide icon with our system sizes
export interface LucideIconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon
  size?: IconSize
  color?: string
  strokeWidth?: number
}

export const LucideIconWrapper = React.forwardRef<SVGSVGElement, LucideIconProps>(
  ({ icon: IconComponent, size = 'md', color = 'currentColor', strokeWidth = 2, className, ...props }, ref) => {
    const sizeValue = iconSizes[size]
    
    return (
      <IconComponent
        ref={ref}
        width={sizeValue}
        height={sizeValue}
        color={color}
        strokeWidth={strokeWidth}
        className={cn(
          'transition-colors duration-200', // var(--duration-normal)
          className
        )}
        {...props}
      />
    )
  }
)

LucideIconWrapper.displayName = 'LucideIconWrapper'