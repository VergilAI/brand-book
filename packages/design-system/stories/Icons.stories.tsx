import type { Meta, StoryObj } from '@storybook/react'
import { useState, useMemo } from 'react'
import { Icon, LucideIconWrapper } from '@/components/icon'
import { iconsByCategory, searchIcons, type IconName } from '../icons'
import { iconSizes } from '../icons/types'

const meta: Meta = {
  title: 'Icons',
  parameters: {
    docs: {
      description: {
        component: 'Comprehensive icon system with categorized Lucide React icons',
      },
    },
  },
}

export default meta

// Icon Grid Component
const IconGrid = ({ 
  icons, 
  selectedSize = 'md' 
}: { 
  icons: { name: string; description?: string }[], 
  selectedSize?: keyof typeof iconSizes 
}) => (
  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
    {icons.map(({ name, description }) => (
      <div
        key={name}
        className="flex flex-col items-center p-4 rounded-lg hover:bg-bg-emphasis transition-colors duration-200 cursor-pointer group"
      >
        <div className="mb-2 text-text-primary group-hover:text-text-brand transition-colors">
          <Icon name={name as IconName} size={selectedSize} />
        </div>
        <span className="text-xs text-text-secondary text-center break-all">{name}</span>
        {description && (
          <span className="text-xs text-text-tertiary text-center mt-1 hidden group-hover:block">
            {description}
          </span>
        )}
      </div>
    ))}
  </div>
)

// Category Section Component
const CategorySection = ({ 
  category, 
  icons, 
  selectedSize 
}: { 
  category: string, 
  icons: any[], 
  selectedSize: keyof typeof iconSizes 
}) => (
  <div className="mb-12">
    <h3 className="text-xl font-semibold mb-6 capitalize text-text-primary">
      {category.replace(/([A-Z])/g, ' $1').trim()} Icons
    </h3>
    <IconGrid icons={icons} selectedSize={selectedSize} />
  </div>
)

export const AllIcons: StoryObj = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSize, setSelectedSize] = useState<keyof typeof iconSizes>('md')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    
    const filteredIcons = useMemo(() => {
      let icons = selectedCategory === 'all' 
        ? Object.values(iconsByCategory).flat()
        : iconsByCategory[selectedCategory] || []
      
      if (searchQuery) {
        icons = searchIcons(searchQuery)
        if (selectedCategory !== 'all') {
          icons = icons.filter(icon => icon.category === selectedCategory)
        }
      }
      
      return icons
    }, [searchQuery, selectedCategory])
    
    const categories = Object.keys(iconsByCategory)
    
    return (
      <div className="p-6 max-w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">Icon Library</h2>
          <p className="text-text-secondary mb-6">
            Centralized icon system using Lucide React icons. All icons are categorized and can be imported from <code className="text-sm bg-bg-emphasis px-2 py-1 rounded">@vergil/design-system/icons</code>
          </p>
          
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-border-default bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-md border border-border-default bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            
            {/* Size Selector */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as keyof typeof iconSizes)}
              className="px-4 py-2 rounded-md border border-border-default bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
            >
              {Object.entries(iconSizes).map(([size, pixels]) => (
                <option key={size} value={size}>
                  {size.toUpperCase()} ({pixels}px)
                </option>
              ))}
            </select>
          </div>
          
          {/* Results count */}
          <p className="text-sm text-text-secondary mb-4">
            Showing {filteredIcons.length} icons
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>
        
        {/* Icon Display */}
        {selectedCategory === 'all' && !searchQuery ? (
          // Show by category when viewing all
          Object.entries(iconsByCategory).map(([category, icons]) => (
            <CategorySection 
              key={category} 
              category={category} 
              icons={icons} 
              selectedSize={selectedSize} 
            />
          ))
        ) : (
          // Show filtered results
          <IconGrid icons={filteredIcons} selectedSize={selectedSize} />
        )}
        
        {filteredIcons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No icons found matching your criteria.</p>
          </div>
        )}
      </div>
    )
  },
}

export const IconSizes: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">Icon Sizes</h2>
      <p className="text-text-secondary mb-8">
        Icons support five standard sizes that align with our design system.
      </p>
      
      <div className="space-y-6">
        {Object.entries(iconSizes).map(([size, pixels]) => (
          <div key={size} className="flex items-center gap-4 p-4 rounded-lg bg-bg-emphasis">
            <div className="text-text-primary">
              <Icon name="Star" size={size as keyof typeof iconSizes} />
            </div>
            <div>
              <span className="font-mono text-sm font-medium text-text-primary">{size}</span>
              <span className="text-sm text-text-secondary ml-2">({pixels}px)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const IconColors: StoryObj = {
  render: () => {
    const colors = [
      { name: 'primary', value: 'text-text-primary', hex: '#1D1D1F' },
      { name: 'secondary', value: 'text-text-secondary', hex: '#6C6C6D' },
      { name: 'brand', value: 'text-text-brand', hex: '#7B00FF' },
      { name: 'success', value: 'text-text-success', hex: '#0F8A0F' },
      { name: 'warning', value: 'text-text-warning', hex: '#FFC700' },
      { name: 'error', value: 'text-text-error', hex: '#E51C23' },
      { name: 'info', value: 'text-text-info', hex: '#0087FF' },
    ]
    
    return (
      <div className="p-6 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Icon Colors</h2>
        <p className="text-text-secondary mb-8">
          Icons inherit their color from the parent text color by default, but can be styled with any text color token.
        </p>
        
        <div className="space-y-4">
          {colors.map(({ name, value, hex }) => (
            <div key={name} className="flex items-center gap-4 p-4 rounded-lg bg-bg-emphasis">
              <div className={value}>
                <Icon name="Circle" size="lg" />
              </div>
              <div className="flex-1">
                <span className="font-mono text-sm font-medium text-text-primary">{value}</span>
                <span className="text-sm text-text-secondary ml-2">({hex})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const UsageExamples: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl prose prose-gray">
      <h2>Icon Usage Guide</h2>
      
      <h3>Import Methods</h3>
      <pre>{`// Method 1: Import from centralized system (recommended)
import { Icon } from '@/components/icon'
import { ChevronRight, User, Settings } from '@vergil/design-system/icons'

// Method 2: Import icon categories
import { navigationIcons, actionIcons } from '@vergil/design-system/icons'

// Method 3: Use the Icon component with name prop
<Icon name="ChevronRight" size="md" />`}</pre>
      
      <h3>Component Usage</h3>
      <pre>{`// Basic usage
<Icon name="User" />

// With size
<Icon name="Settings" size="lg" />

// With custom color
<Icon name="Heart" className="text-text-error" />

// With all props
<Icon 
  name="Download" 
  size="xl" 
  strokeWidth={1.5}
  className="text-text-brand hover:text-text-brand-light"
/>`}</pre>
      
      <h3>Using with Buttons</h3>
      <pre>{`<Button>
  <Icon name="Plus" size="sm" className="mr-2" />
  Add Item
</Button>`}</pre>
      
      <h3>Search Function</h3>
      <pre>{`import { searchIcons } from '@vergil/design-system/icons'

// Find all icons related to 'user'
const userIcons = searchIcons('user')

// Icons can be searched by name, description, or keywords
const arrowIcons = searchIcons('arrow')`}</pre>
      
      <h3>Migration from Direct Imports</h3>
      <pre>{`// Old way (still supported)
import { User } from 'lucide-react'
<User size={20} />

// New way (recommended)
import { User } from '@vergil/design-system/icons'
<Icon name="User" size="md" />

// Or use the wrapper for gradual migration
import { LucideIconWrapper } from '@/components/icon'
<LucideIconWrapper icon={User} size="md" />`}</pre>
    </div>
  ),
}