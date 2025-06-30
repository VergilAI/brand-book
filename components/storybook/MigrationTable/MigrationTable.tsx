import React from 'react'
import { TokenSwatch } from '../TokenSwatch'
import { ArrowRight, AlertTriangle, Archive, CheckCircle, Info } from 'lucide-react'

export interface MigrationItem {
  oldToken: {
    name: string
    value: string
    cssVar?: string
  }
  newToken?: {
    name: string
    value: string
    cssVar?: string
  }
  status: 'deprecated' | 'replaced' | 'breaking' | 'new' | 'unchanged'
  notes?: string
  migrationGuide?: string
  category?: string
}

export interface MigrationTableProps {
  title?: string
  description?: string
  migrations: MigrationItem[]
  showCategory?: boolean
  groupByCategory?: boolean
  className?: string
}

export const MigrationTable: React.FC<MigrationTableProps> = ({
  title,
  description,
  migrations,
  showCategory = true,
  groupByCategory = false,
  className = ''
}) => {
  const getStatusIcon = (status: MigrationItem['status']) => {
    switch (status) {
      case 'deprecated':
        return <Archive className="w-4 h-4 text-yellow-500" />
      case 'replaced':
        return <ArrowRight className="w-4 h-4 text-blue-500" />
      case 'breaking':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'new':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'unchanged':
        return <Info className="w-4 h-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: MigrationItem['status']) => {
    switch (status) {
      case 'deprecated':
        return 'Deprecated'
      case 'replaced':
        return 'Replaced'
      case 'breaking':
        return 'Breaking Change'
      case 'new':
        return 'New Token'
      case 'unchanged':
        return 'Unchanged'
      default:
        return status
    }
  }

  const getStatusColor = (status: MigrationItem['status']) => {
    switch (status) {
      case 'deprecated':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'replaced':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'breaking':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'new':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'unchanged':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const groupedMigrations = React.useMemo(() => {
    if (!groupByCategory) {
      return { 'All Tokens': migrations }
    }

    return migrations.reduce((groups, migration) => {
      const category = migration.category || 'Other'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(migration)
      return groups
    }, {} as Record<string, MigrationItem[]>)
  }, [migrations, groupByCategory])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div>
          {title && <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="w-full text-sm font-medium text-gray-900 mb-2">Status Legend:</h3>
        {['deprecated', 'replaced', 'breaking', 'new', 'unchanged'].map(status => (
          <div key={status} className="flex items-center gap-2">
            {getStatusIcon(status as MigrationItem['status'])}
            <span className="text-sm text-gray-700">
              {getStatusLabel(status as MigrationItem['status'])}
            </span>
          </div>
        ))}
      </div>

      {/* Migration Groups */}
      {Object.entries(groupedMigrations).map(([category, items]) => (
        <div key={category} className="space-y-4">
          {groupByCategory && (
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              {category}
            </h3>
          )}

          <div className="space-y-3">
            {items.map((migration, index) => (
              <div 
                key={`${migration.oldToken.name}-${index}`}
                className="border border-gray-200 rounded-lg p-6 space-y-4"
              >
                {/* Status and Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor(migration.status)}`}>
                      {getStatusIcon(migration.status)}
                      {getStatusLabel(migration.status)}
                    </span>
                    {showCategory && migration.category && !groupByCategory && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {migration.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Token Comparison */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Old Token */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      {migration.status === 'new' ? 'Not Applicable' : 'Previous Version'}
                    </h4>
                    {migration.status !== 'new' && (
                      <TokenSwatch
                        name={migration.oldToken.name}
                        value={migration.oldToken.value}
                        cssVar={migration.oldToken.cssVar}
                        size="small"
                        deprecated={migration.status === 'deprecated' || migration.status === 'replaced'}
                        breaking={migration.status === 'breaking'}
                      />
                    )}
                  </div>

                  {/* New Token */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      {migration.status === 'deprecated' ? 'No Replacement' : 'Current Version'}
                    </h4>
                    {migration.newToken && (
                      <TokenSwatch
                        name={migration.newToken.name}
                        value={migration.newToken.value}
                        cssVar={migration.newToken.cssVar}
                        size="small"
                      />
                    )}
                    {migration.status === 'deprecated' && !migration.newToken && (
                      <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                        This token has been removed without replacement
                      </div>
                    )}
                  </div>
                </div>

                {/* Migration Arrow (for replaced tokens) */}
                {migration.status === 'replaced' && migration.newToken && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-blue-600">
                      <ArrowRight className="w-5 h-5" />
                      <span className="text-sm font-medium">Migrated</span>
                    </div>
                  </div>
                )}

                {/* Notes and Migration Guide */}
                {(migration.notes || migration.migrationGuide) && (
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {migration.notes && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Notes:</h5>
                        <p className="text-sm text-gray-600">{migration.notes}</p>
                      </div>
                    )}
                    {migration.migrationGuide && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Migration Guide:</h5>
                        <code className="text-xs bg-gray-100 p-2 rounded block font-mono">
                          {migration.migrationGuide}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}