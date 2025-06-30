import React from 'react'
import { Calendar, GitBranch, AlertTriangle, Archive, CheckCircle, Info, Users, Code, Zap } from 'lucide-react'

export interface VersionInfo {
  version: string
  name: string
  releaseDate: string
  status: 'current' | 'deprecated' | 'beta' | 'alpha'
  description: string
  breaking: boolean
  tokensAdded: number
  tokensModified: number
  tokensRemoved: number
  contributors: string[]
  migrationGuide?: string
  changelog?: string[]
  compatibility?: {
    browsers?: string[]
    frameworks?: string[]
    dependencies?: Record<string, string>
  }
  performance?: {
    bundleSize?: string
    loadTime?: string
    improvements?: string[]
  }
  accessibility?: {
    wcagLevel: 'A' | 'AA' | 'AAA'
    improvements?: string[]
    issues?: string[]
  }
}

export interface VersionMetadataProps {
  versionInfo: VersionInfo
  showBreakingChanges?: boolean
  showPerformance?: boolean
  showAccessibility?: boolean
  showCompatibility?: boolean
  compact?: boolean
  className?: string
}

export const VersionMetadata: React.FC<VersionMetadataProps> = ({
  versionInfo,
  showBreakingChanges = true,
  showPerformance = true,
  showAccessibility = true,
  showCompatibility = true,
  compact = false,
  className = ''
}) => {
  const getStatusColor = (status: VersionInfo['status']) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'deprecated':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'beta':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'alpha':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: VersionInfo['status']) => {
    switch (status) {
      case 'current':
        return <CheckCircle className="w-4 h-4" />
      case 'deprecated':
        return <Archive className="w-4 h-4" />
      case 'beta':
        return <Zap className="w-4 h-4" />
      case 'alpha':
        return <Code className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getWcagColor = (level: string) => {
    switch (level) {
      case 'AAA':
        return 'text-green-700 bg-green-100'
      case 'AA':
        return 'text-blue-700 bg-blue-100'
      case 'A':
        return 'text-yellow-700 bg-yellow-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${className}`}>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${getStatusColor(versionInfo.status)}`}>
          {getStatusIcon(versionInfo.status)}
          {versionInfo.version}
        </span>
        <div className="flex-1">
          <div className="font-medium text-sm">{versionInfo.name}</div>
          <div className="text-xs text-gray-600">Released {versionInfo.releaseDate}</div>
        </div>
        {versionInfo.breaking && (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <AlertTriangle className="w-3 h-3" />
            Breaking
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {versionInfo.name}
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded border text-sm font-medium ${getStatusColor(versionInfo.status)}`}>
                {getStatusIcon(versionInfo.status)}
                {versionInfo.version}
              </span>
            </h2>
            <p className="text-gray-600 mt-2">{versionInfo.description}</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Released {versionInfo.releaseDate}</span>
            </div>
          </div>
        </div>

        {/* Breaking Changes Alert */}
        {showBreakingChanges && versionInfo.breaking && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900 mb-1">Breaking Changes</h3>
                <p className="text-sm text-red-700">
                  This version introduces breaking changes that may require code updates. 
                  Please review the migration guide carefully before upgrading.
                </p>
                {versionInfo.migrationGuide && (
                  <details className="mt-3">
                    <summary className="text-sm text-red-800 cursor-pointer hover:text-red-900">
                      View Migration Guide
                    </summary>
                    <div className="mt-2 p-3 bg-red-100 rounded border text-sm text-red-800">
                      {versionInfo.migrationGuide}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{versionInfo.tokensAdded}</div>
          <div className="text-sm text-gray-600">Tokens Added</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{versionInfo.tokensModified}</div>
          <div className="text-sm text-gray-600">Tokens Modified</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{versionInfo.tokensRemoved}</div>
          <div className="text-sm text-gray-600">Tokens Removed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{versionInfo.contributors.length}</div>
          <div className="text-sm text-gray-600">Contributors</div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Changelog */}
        {versionInfo.changelog && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Changelog
            </h3>
            <div className="space-y-2">
              {versionInfo.changelog.map((change, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-gray-700">{change}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contributors */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Contributors
          </h3>
          <div className="flex flex-wrap gap-2">
            {versionInfo.contributors.map(contributor => (
              <span 
                key={contributor}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
              >
                {contributor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Information */}
      {showPerformance && versionInfo.performance && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {versionInfo.performance.bundleSize && (
              <div>
                <div className="font-medium text-green-800">Bundle Size</div>
                <div className="text-green-700">{versionInfo.performance.bundleSize}</div>
              </div>
            )}
            {versionInfo.performance.loadTime && (
              <div>
                <div className="font-medium text-green-800">Load Time</div>
                <div className="text-green-700">{versionInfo.performance.loadTime}</div>
              </div>
            )}
            {versionInfo.performance.improvements && (
              <div>
                <div className="font-medium text-green-800">Improvements</div>
                <ul className="text-green-700 space-y-1">
                  {versionInfo.performance.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessibility Information */}
      {showAccessibility && versionInfo.accessibility && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Accessibility
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-800">WCAG Compliance:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getWcagColor(versionInfo.accessibility.wcagLevel)}`}>
                Level {versionInfo.accessibility.wcagLevel}
              </span>
            </div>
            
            {versionInfo.accessibility.improvements && (
              <div>
                <div className="text-sm font-medium text-blue-800 mb-2">Improvements</div>
                <ul className="text-sm text-blue-700 space-y-1">
                  {versionInfo.accessibility.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {versionInfo.accessibility.issues && versionInfo.accessibility.issues.length > 0 && (
              <div>
                <div className="text-sm font-medium text-blue-800 mb-2">Known Issues</div>
                <ul className="text-sm text-blue-700 space-y-1">
                  {versionInfo.accessibility.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <AlertTriangle className="w-3 h-3 text-yellow-500 mt-1" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compatibility Information */}
      {showCompatibility && versionInfo.compatibility && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Compatibility
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {versionInfo.compatibility.browsers && (
              <div>
                <div className="font-medium text-gray-800 mb-2">Browsers</div>
                <ul className="text-gray-700 space-y-1">
                  {versionInfo.compatibility.browsers.map((browser, index) => (
                    <li key={index}>{browser}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {versionInfo.compatibility.frameworks && (
              <div>
                <div className="font-medium text-gray-800 mb-2">Frameworks</div>
                <ul className="text-gray-700 space-y-1">
                  {versionInfo.compatibility.frameworks.map((framework, index) => (
                    <li key={index}>{framework}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {versionInfo.compatibility.dependencies && (
              <div>
                <div className="font-medium text-gray-800 mb-2">Dependencies</div>
                <ul className="text-gray-700 space-y-1">
                  {Object.entries(versionInfo.compatibility.dependencies).map(([dep, version]) => (
                    <li key={dep} className="flex justify-between">
                      <span>{dep}</span>
                      <span className="text-gray-500">{version}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}