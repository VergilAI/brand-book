import React from 'react'
import { TokenSwatch, TokenSwatchProps } from '../TokenSwatch'
import { Filter, Search, Grid, List } from 'lucide-react'

export interface TokenGridProps {
  title?: string
  description?: string
  tokens: Omit<TokenSwatchProps, 'size'>[]
  columns?: 2 | 3 | 4 | 5 | 6
  size?: 'small' | 'medium' | 'large'
  showSearch?: boolean
  showFilter?: boolean
  categories?: string[]
  layout?: 'grid' | 'list'
  className?: string
}

export const TokenGrid: React.FC<TokenGridProps> = ({
  title,
  description,
  tokens,
  columns = 4,
  size = 'medium',
  showSearch = true,
  showFilter = true,
  categories = [],
  layout = 'grid',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [viewLayout, setViewLayout] = React.useState<'grid' | 'list'>(layout)

  // Filter tokens based on search and category
  const filteredTokens = React.useMemo(() => {
    return tokens.filter(token => {
      const matchesSearch = searchTerm === '' || 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.usage?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || 
        token.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [tokens, searchTerm, selectedCategory])

  // Get unique categories from tokens
  const availableCategories = React.useMemo(() => {
    const cats = new Set(tokens.map(token => token.category || 'other'))
    return ['all', ...Array.from(cats)]
  }, [tokens])

  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-6'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div>
          {title && <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}

      {/* Controls */}
      {(showSearch || showFilter) && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1">
            {/* Search */}
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {/* Category Filter */}
            {showFilter && availableCategories.length > 2 && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {availableCategories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Layout Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-2 flex items-center gap-2 text-sm ${
                viewLayout === 'grid' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-2 flex items-center gap-2 text-sm border-l border-gray-300 ${
                viewLayout === 'list' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredTokens.length} of {tokens.length} tokens
        {searchTerm && ` for "${searchTerm}"`}
        {selectedCategory !== 'all' && ` in ${selectedCategory}`}
      </div>

      {/* Token Grid/List */}
      {filteredTokens.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tokens found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className={
          viewLayout === 'grid' 
            ? `grid ${gridClasses[columns]} gap-6`
            : 'space-y-4'
        }>
          {filteredTokens.map((token, index) => (
            <TokenSwatch
              key={`${token.name}-${index}`}
              {...token}
              size={viewLayout === 'list' ? 'small' : size}
              className={viewLayout === 'list' ? 'flex gap-4 p-4 border border-gray-200 rounded-lg' : ''}
            />
          ))}
        </div>
      )}
    </div>
  )
}