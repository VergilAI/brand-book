import React from 'react'
import { Search, Filter, Download, Code, Eye, EyeOff, Palette, Type, Layers, Box } from 'lucide-react'
import { TokenSwatch, TokenGrid } from '../'

export interface TokenBrowserProps {
  title?: string
  description?: string
  tokens?: any[]
  showLiveEditor?: boolean
  showCodeGeneration?: boolean
  showUsageExamples?: boolean
  enableHotReload?: boolean
  className?: string
}

interface TokenData {
  name: string
  value: string
  cssVar?: string
  usage?: string
  category: 'color' | 'typography' | 'spacing' | 'shadow' | 'border'
  tags?: string[]
  examples?: string[]
  rules?: string[]
  deprecated?: boolean
  breaking?: boolean
  accessible?: boolean
}

// Sample comprehensive token data
const allTokens: TokenData[] = [
  // Colors
  {
    name: 'vergil-purple',
    value: '#7B00FF',
    cssVar: '--vergil-purple',
    usage: 'Primary brand color',
    category: 'color',
    tags: ['brand', 'primary', 'purple'],
    examples: ['Buttons', 'Links', 'Active states'],
    rules: ['Use for primary CTAs', 'Ensure proper contrast'],
    accessible: true
  },
  {
    name: 'vergil-purple-light',
    value: '#9933FF',
    cssVar: '--vergil-purple-light',
    usage: 'Hover states',
    category: 'color',
    tags: ['brand', 'hover', 'interactive'],
    examples: ['Button hover', 'Link hover'],
    rules: ['Interactive feedback only'],
    accessible: true
  },
  {
    name: 'vergil-success',
    value: '#0F8A0F',
    cssVar: '--vergil-success',
    usage: 'Success feedback',
    category: 'color',
    tags: ['semantic', 'success', 'green'],
    examples: ['Success messages', 'Valid inputs'],
    rules: ['Positive feedback only'],
    accessible: true
  },
  
  // Typography
  {
    name: 'font-size-xs',
    value: '0.75rem',
    cssVar: '--font-size-xs',
    usage: 'Extra small text',
    category: 'typography',
    tags: ['text', 'size', 'small'],
    examples: ['Captions', 'Legal text', 'Helper text'],
    rules: ['Use sparingly', 'Ensure readability']
  },
  {
    name: 'font-size-sm',
    value: '0.875rem',
    cssVar: '--font-size-sm',
    usage: 'Small text',
    category: 'typography',
    tags: ['text', 'size'],
    examples: ['Secondary text', 'Labels'],
    rules: ['Good for supporting content']
  },
  {
    name: 'font-size-base',
    value: '1rem',
    cssVar: '--font-size-base',
    usage: 'Base text size',
    category: 'typography',
    tags: ['text', 'size', 'default'],
    examples: ['Body text', 'Paragraphs'],
    rules: ['Default for most content']
  },
  
  // Spacing
  {
    name: 'space-1',
    value: '0.25rem',
    cssVar: '--space-1',
    usage: 'Extra small spacing',
    category: 'spacing',
    tags: ['margin', 'padding', 'gap'],
    examples: ['Icon gaps', 'Tight layouts'],
    rules: ['Use for micro-spacing']
  },
  {
    name: 'space-4',
    value: '1rem',
    cssVar: '--space-4',
    usage: 'Standard spacing',
    category: 'spacing',
    tags: ['margin', 'padding', 'gap', 'default'],
    examples: ['Card padding', 'Section gaps'],
    rules: ['Most common spacing unit']
  },
  {
    name: 'space-8',
    value: '2rem',
    cssVar: '--space-8',
    usage: 'Large spacing',
    category: 'spacing',
    tags: ['margin', 'padding', 'gap', 'section'],
    examples: ['Section spacing', 'Layout gaps'],
    rules: ['For major layout separation']
  },
  
  // Shadows
  {
    name: 'shadow-sm',
    value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    cssVar: '--shadow-sm',
    usage: 'Subtle elevation',
    category: 'shadow',
    tags: ['elevation', 'card', 'subtle'],
    examples: ['Cards', 'Input fields'],
    rules: ['Subtle depth indication']
  },
  {
    name: 'shadow-lg',
    value: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    cssVar: '--shadow-lg',
    usage: 'Prominent elevation',
    category: 'shadow',
    tags: ['elevation', 'modal', 'dropdown'],
    examples: ['Modals', 'Dropdowns', 'Tooltips'],
    rules: ['For floating elements']
  }
]

export const TokenBrowser: React.FC<TokenBrowserProps> = ({
  title = 'Token Browser',
  description = 'Interactive design token explorer with live editing capabilities',
  tokens = allTokens,
  showLiveEditor = true,
  showCodeGeneration = true,
  showUsageExamples = true,
  enableHotReload = true,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [viewMode, setViewMode] = React.useState<'grid' | 'list' | 'preview'>('grid')
  const [showAccessibleOnly, setShowAccessibleOnly] = React.useState(false)
  const [liveEditToken, setLiveEditToken] = React.useState<TokenData | null>(null)
  const [generatedCode, setGeneratedCode] = React.useState('')
  const [selectedForExport, setSelectedForExport] = React.useState<string[]>([])

  // Get unique categories and tags
  const categories = React.useMemo(() => {
    const cats = new Set(tokens.map(token => token.category))
    return ['all', ...Array.from(cats)]
  }, [tokens])

  const allTags = React.useMemo(() => {
    const tags = new Set(tokens.flatMap(token => token.tags || []))
    return Array.from(tags)
  }, [tokens])

  // Filter tokens
  const filteredTokens = React.useMemo(() => {
    return tokens.filter(token => {
      const matchesSearch = searchTerm === '' || 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.usage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => token.tags?.includes(tag))

      const matchesAccessible = !showAccessibleOnly || token.accessible

      return matchesSearch && matchesCategory && matchesTags && matchesAccessible
    })
  }, [tokens, searchTerm, selectedCategory, selectedTags, showAccessibleOnly])

  // Generate CSS code for selected tokens
  const generateCode = () => {
    const selected = tokens.filter(token => selectedForExport.includes(token.name))
    const cssCode = selected.map(token => `  ${token.cssVar}: ${token.value};`).join('\n')
    setGeneratedCode(`:root {\n${cssCode}\n}`)
  }

  const exportTokens = () => {
    const selected = tokens.filter(token => selectedForExport.includes(token.name))
    const data = JSON.stringify(selected, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'design-tokens.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'color': return <Palette className="w-4 h-4" />
      case 'typography': return <Type className="w-4 h-4" />
      case 'spacing': return <Box className="w-4 h-4" />
      case 'shadow': return <Layers className="w-4 h-4" />
      default: return <Filter className="w-4 h-4" />
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens, values, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility Filter */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAccessibleOnly}
              onChange={(e) => setShowAccessibleOnly(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Accessible only</span>
          </label>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            {['grid', 'list', 'preview'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-2 text-sm capitalize ${
                  viewMode === mode 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${mode !== 'grid' ? 'border-l border-gray-300' : ''}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Filter by tags:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )
                  }}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 text-xs text-red-600 hover:text-red-800"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{filteredTokens.length}</div>
          <div className="text-sm text-gray-600">Tokens Found</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{categories.length - 1}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{allTags.length}</div>
          <div className="text-sm text-gray-600">Tags</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {tokens.filter(t => t.accessible).length}
          </div>
          <div className="text-sm text-gray-600">Accessible</div>
        </div>
      </div>

      {/* Export Controls */}
      {showCodeGeneration && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-blue-900">Export & Code Generation</h3>
            <div className="flex gap-2">
              <button
                onClick={generateCode}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                Generate CSS
              </button>
              <button
                onClick={exportTokens}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
            </div>
          </div>
          <p className="text-sm text-blue-700">
            Select tokens below and use the buttons to generate CSS variables or export as JSON.
          </p>
          {generatedCode && (
            <div className="mt-3">
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                {generatedCode}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Token Display */}
      {viewMode === 'grid' && (
        <TokenGrid
          tokens={filteredTokens.map(token => ({
            ...token,
            onClick: showCodeGeneration ? () => {
              setSelectedForExport(prev => 
                prev.includes(token.name) 
                  ? prev.filter(n => n !== token.name)
                  : [...prev, token.name]
              )
            } : undefined,
            selected: selectedForExport.includes(token.name)
          }))}
          columns={4}
          size="medium"
          showSearch={false}
          showFilter={false}
        />
      )}

      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTokens.map(token => (
            <div
              key={token.name}
              className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                selectedForExport.includes(token.name)
                  ? 'border-indigo-300 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => showCodeGeneration && setSelectedForExport(prev => 
                prev.includes(token.name) 
                  ? prev.filter(n => n !== token.name)
                  : [...prev, token.name]
              )}
            >
              <div className="flex items-center gap-3">
                {getCategoryIcon(token.category)}
                <TokenSwatch {...token} size="small" showCode={false} />
              </div>
              <div className="flex-1">
                <div className="font-medium">{token.name}</div>
                <div className="text-sm text-gray-600">{token.usage}</div>
                {token.tags && (
                  <div className="flex gap-1 mt-1">
                    {token.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-mono text-sm">{token.value}</div>
                <div className="text-xs text-gray-500">{token.cssVar}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'preview' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          <div className="grid gap-6">
            {/* Color Preview */}
            <div className="p-6 border rounded-lg">
              <h4 className="font-medium mb-4">Color Tokens in Action</h4>
              <div className="space-y-4">
                <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#7B00FF' }}>
                  Primary Button (vergil-purple)
                </button>
                <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#9933FF' }}>
                  Hover State (vergil-purple-light)
                </button>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#0F8A0F', color: 'white' }}>
                  Success Message (vergil-success)
                </div>
              </div>
            </div>

            {/* Typography Preview */}
            <div className="p-6 border rounded-lg">
              <h4 className="font-medium mb-4">Typography Tokens in Action</h4>
              <div className="space-y-2">
                <div style={{ fontSize: '0.75rem' }}>Extra small text (font-size-xs)</div>
                <div style={{ fontSize: '0.875rem' }}>Small text (font-size-sm)</div>
                <div style={{ fontSize: '1rem' }}>Base text (font-size-base)</div>
              </div>
            </div>

            {/* Spacing Preview */}
            <div className="p-6 border rounded-lg">
              <h4 className="font-medium mb-4">Spacing Tokens in Action</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-6 bg-blue-500"></div>
                  <span className="text-sm">space-1 (0.25rem)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-6 bg-blue-500"></div>
                  <span className="text-sm">space-4 (1rem)</span>
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-8 h-6 bg-blue-500"></div>
                  <span className="text-sm">space-8 (2rem)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hot Reload Indicator */}
      {enableHotReload && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
          <span className="text-sm">Hot Reload Active</span>
        </div>
      )}
    </div>
  )
}