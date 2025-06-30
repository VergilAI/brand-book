import React from 'react'
import { Copy, Check, AlertTriangle, Archive } from 'lucide-react'

export interface TokenSwatchProps {
  name: string
  value: string
  cssVar?: string
  usage?: string
  deprecated?: boolean
  breaking?: boolean
  category?: 'color' | 'gradient' | 'shadow' | 'spacing' | 'typography'
  examples?: string[]
  rules?: string[]
  size?: 'small' | 'medium' | 'large'
  showCode?: boolean
  className?: string
}

export const TokenSwatch: React.FC<TokenSwatchProps> = ({
  name,
  value,
  cssVar,
  usage,
  deprecated = false,
  breaking = false,
  category = 'color',
  examples = [],
  rules = [],
  size = 'medium',
  showCode = true,
  className = ''
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const sizeClasses = {
    small: 'h-12',
    medium: 'h-16',
    large: 'h-24'
  }

  const renderSwatch = () => {
    if (category === 'gradient') {
      return (
        <div 
          className={`w-full ${sizeClasses[size]} rounded-md border border-gray-200 shadow-sm`}
          style={{ background: value }}
        />
      )
    }

    if (category === 'color') {
      return (
        <div 
          className={`w-full ${sizeClasses[size]} rounded-md border border-gray-200 shadow-sm`}
          style={{ backgroundColor: value }}
        />
      )
    }

    // For other categories, show a generic representation
    return (
      <div className={`w-full ${sizeClasses[size]} rounded-md border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center text-xs text-gray-500`}>
        {category}
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Swatch */}
      <div className="relative">
        {renderSwatch()}
        
        {/* Status indicators */}
        <div className="absolute top-2 right-2 flex gap-1">
          {deprecated && (
            <div 
              className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center"
              title="Deprecated"
            >
              <Archive className="w-3 h-3 text-white" />
            </div>
          )}
          {breaking && (
            <div 
              className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
              title="Breaking Change"
            >
              <AlertTriangle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Token Info */}
      <div className="space-y-2">
        <div>
          <h3 className={`font-semibold ${deprecated ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {name}
          </h3>
          {usage && (
            <p className="text-sm text-gray-600 mt-1">{usage}</p>
          )}
        </div>

        {/* Value and CSS Variable */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              {value}
            </code>
            <button
              onClick={() => handleCopy(value)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copy value"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400" />
              )}
            </button>
          </div>

          {cssVar && showCode && (
            <div className="flex items-center gap-2">
              <code className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-mono">
                {cssVar}
              </code>
              <button
                onClick={() => handleCopy(cssVar)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Copy CSS variable"
              >
                <Copy className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          )}
        </div>

        {/* Rules */}
        {rules.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Usage Rules</h4>
            <ul className="space-y-1">
              {rules.map((rule, idx) => (
                <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5 text-[8px]">●</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {examples.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Use Cases</h4>
            <div className="flex flex-wrap gap-1">
              {examples.map((example, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}