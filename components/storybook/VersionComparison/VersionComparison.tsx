import React from 'react'
import { ArrowLeftRight, Eye, EyeOff } from 'lucide-react'

export interface VersionComparisonProps {
  title?: string
  leftTitle?: string
  rightTitle?: string
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  showToggle?: boolean
  initialMode?: 'side-by-side' | 'overlay'
  className?: string
}

export const VersionComparison: React.FC<VersionComparisonProps> = ({
  title,
  leftTitle = 'Version 1',
  rightTitle = 'Version 2',
  leftContent,
  rightContent,
  showToggle = true,
  initialMode = 'side-by-side',
  className = ''
}) => {
  const [mode, setMode] = React.useState<'side-by-side' | 'overlay'>(initialMode)
  const [overlayActive, setOverlayActive] = React.useState<'left' | 'right'>('right')

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        
        {showToggle && (
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setMode('side-by-side')}
              className={`px-4 py-2 flex items-center gap-2 text-sm ${
                mode === 'side-by-side' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              Side by Side
            </button>
            <button
              onClick={() => setMode('overlay')}
              className={`px-4 py-2 flex items-center gap-2 text-sm border-l border-gray-300 ${
                mode === 'overlay' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              Overlay
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {mode === 'side-by-side' ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Version */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700">{leftTitle}</h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">v1</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {leftContent}
            </div>
          </div>

          {/* Right Version */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700">{rightTitle}</h4>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">v2</span>
            </div>
            <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
              {rightContent}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Overlay Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setOverlayActive('left')}
                className={`px-3 py-1 text-sm ${
                  overlayActive === 'left'
                    ? 'bg-gray-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {leftTitle}
              </button>
              <button
                onClick={() => setOverlayActive('right')}
                className={`px-3 py-1 text-sm border-l border-gray-300 ${
                  overlayActive === 'right'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {rightTitle}
              </button>
            </div>
          </div>

          {/* Overlay Content */}
          <div className="relative">
            <div className="border border-gray-200 rounded-lg p-4 min-h-[200px]">
              <div 
                className={`transition-opacity duration-300 ${
                  overlayActive === 'left' ? 'opacity-100' : 'opacity-0 absolute inset-4'
                }`}
              >
                {leftContent}
              </div>
              <div 
                className={`transition-opacity duration-300 ${
                  overlayActive === 'right' ? 'opacity-100' : 'opacity-0 absolute inset-4'
                }`}
              >
                {rightContent}
              </div>
            </div>
            
            {/* Version indicator */}
            <div className="absolute top-2 right-2">
              <span className={`text-xs px-2 py-1 rounded ${
                overlayActive === 'left' 
                  ? 'bg-gray-100 text-gray-600' 
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {overlayActive === 'left' ? 'v1' : 'v2'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Summary */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
            <Eye className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <h5 className="text-sm font-medium text-blue-900 mb-1">Comparison Tip</h5>
            <p className="text-sm text-blue-700">
              Use the side-by-side view to see both versions at once, or overlay mode to quickly switch between them.
              Look for visual differences in colors, spacing, and typography between versions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}