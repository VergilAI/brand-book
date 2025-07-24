import { IconDefinition } from './types'
import { navigationIcons } from './categories/navigation'
import { actionIcons } from './categories/action'
import { statusIcons } from './categories/status'
import { userIcons } from './categories/user'
import { educationIcons } from './categories/education'
import { communicationIcons } from './categories/communication'
import { fileIcons } from './categories/file'
import { interfaceIcons } from './categories/interface'
import { socialIcons } from './categories/social'

// Combine all icons into a single registry
export const iconRegistry: IconDefinition[] = [
  ...navigationIcons,
  ...actionIcons,
  ...statusIcons,
  ...userIcons,
  ...educationIcons,
  ...communicationIcons,
  ...fileIcons,
  ...interfaceIcons,
  ...socialIcons
]

// Create a map for quick icon lookup by name
export const iconMap = iconRegistry.reduce((acc, iconDef) => {
  acc[iconDef.name] = iconDef
  return acc
}, {} as Record<string, IconDefinition>)

// Group icons by category
export const iconsByCategory = iconRegistry.reduce((acc, iconDef) => {
  if (!acc[iconDef.category]) {
    acc[iconDef.category] = []
  }
  acc[iconDef.category].push(iconDef)
  return acc
}, {} as Record<string, IconDefinition[]>)

// Export category collections for easy importing
export {
  navigationIcons,
  actionIcons,
  statusIcons,
  userIcons,
  educationIcons,
  communicationIcons,
  fileIcons,
  interfaceIcons,
  socialIcons
}

// Get all unique icon names for TypeScript autocomplete
export type IconName = keyof typeof iconMap

// Search function for finding icons
export function searchIcons(query: string): IconDefinition[] {
  const lowercaseQuery = query.toLowerCase()
  return iconRegistry.filter(iconDef => 
    iconDef.name.toLowerCase().includes(lowercaseQuery) ||
    iconDef.description?.toLowerCase().includes(lowercaseQuery) ||
    iconDef.keywords?.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  )
}