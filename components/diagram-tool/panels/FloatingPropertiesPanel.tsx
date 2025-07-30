"use client"

import React from 'react'
import { useMapEditor } from '@/app/map-editor/hooks/useMapEditor'
import { cn } from '@/lib/utils'
import { Card } from '@/components/card'
import { Trash2, X } from 'lucide-react'
import { Switch } from '@/components/ui/Switch'
import { useRelationships } from '@/app/map-editor/contexts/RelationshipContext'
import { TableMetadata, TableRow, TableRelationship } from '@/app/map-editor/types/database-types'

export function FloatingPropertiesPanel() {
  const store = useMapEditor()
  const { relationships, setRelationships, selectedRelationshipId, setSelectedRelationshipId } = useRelationships()
  const selectedTerritoryIds = Array.from(store.selection.territories)
  
  // Show relationship panel if a relationship is selected
  if (selectedRelationshipId) {
    const relationship = relationships.find(r => r.id === selectedRelationshipId)
    if (!relationship) return null
    
    const fromTable = store.map.territories[relationship.fromTable]
    const toTable = store.map.territories[relationship.toTable]
    if (!fromTable || !toTable) return null
    
    const fromMeta = fromTable.metadata as TableMetadata
    const toMeta = toTable.metadata as TableMetadata
    const fromRow = fromMeta.rows[relationship.fromRow]
    const toRow = toMeta.rows[relationship.toRow]
    
    return (
      <div className="absolute right-4 top-20 z-20 w-80">
        <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Relationship Properties</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setRelationships(relationships.filter(r => r.id !== selectedRelationshipId))
                    setSelectedRelationshipId(null)
                    store.setDirty(true)
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  title="Delete Relationship"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setSelectedRelationshipId(null)}
                  className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <div className="bg-gray-50 p-3 rounded-md space-y-1">
                  <div className="font-medium text-sm">{fromMeta.tableName || 'Untitled Table'}</div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Key:</span> {fromRow.key || '-'} | 
                    <span className="font-medium"> Name:</span> {fromRow.name || '-'} | 
                    <span className="font-medium"> Type:</span> {fromRow.type || '-'}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From End</label>
                    <select
                      value={relationship.relationshipType.split('-')[0]}
                      onChange={(e) => {
                        const fromType = e.target.value;
                        const toType = relationship.relationshipType.split('-').pop() || 'one';
                        const newType = `${fromType}-to-${toType}` as any;
                        const updatedRel = { ...relationship, relationshipType: newType };
                        setRelationships(relationships.map(r => r.id === relationship.id ? updatedRel : r));
                        store.setDirty(true);
                      }}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="one">One</option>
                      <option value="many">Many</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To End</label>
                    <select
                      value={relationship.relationshipType.split('-').pop() || 'one'}
                      onChange={(e) => {
                        const toType = e.target.value;
                        const fromType = relationship.relationshipType.split('-')[0];
                        const newType = `${fromType}-to-${toType}` as any;
                        const updatedRel = { ...relationship, relationshipType: newType };
                        setRelationships(relationships.map(r => r.id === relationship.id ? updatedRel : r));
                        store.setDirty(true);
                      }}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="one">One</option>
                      <option value="many">Many</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center bg-purple-50 text-purple-700 px-2 py-1 rounded">
                  {relationship.relationshipType}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <div className="bg-gray-50 p-3 rounded-md space-y-1">
                  <div className="font-medium text-sm">{toMeta.tableName || 'Untitled Table'}</div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Key:</span> {toRow.key || '-'} | 
                    <span className="font-medium"> Name:</span> {toRow.name || '-'} | 
                    <span className="font-medium"> Type:</span> {toRow.type || '-'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">On Delete</label>
                  <select
                    value={relationship.onDelete || 'RESTRICT'}
                    onChange={(e) => {
                      const updatedRel = { ...relationship, onDelete: e.target.value as any };
                      setRelationships(relationships.map(r => r.id === relationship.id ? updatedRel : r));
                      store.setDirty(true);
                    }}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="CASCADE">CASCADE</option>
                    <option value="SET NULL">SET NULL</option>
                    <option value="RESTRICT">RESTRICT</option>
                    <option value="NO ACTION">NO ACTION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">On Update</label>
                  <select
                    value={relationship.onUpdate || 'CASCADE'}
                    onChange={(e) => {
                      const updatedRel = { ...relationship, onUpdate: e.target.value as any };
                      setRelationships(relationships.map(r => r.id === relationship.id ? updatedRel : r));
                      store.setDirty(true);
                    }}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="CASCADE">CASCADE</option>
                    <option value="SET NULL">SET NULL</option>
                    <option value="RESTRICT">RESTRICT</option>
                    <option value="NO ACTION">NO ACTION</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  
  if (selectedTerritoryIds.length === 0) {
    return null
  }
  
  if (selectedTerritoryIds.length === 1) {
    const territoryId = selectedTerritoryIds[0]
    const territory = store.map.territories[territoryId]
    
    if (!territory) return null
    
    // For database tables
    if (territory.metadata && 'tableName' in territory.metadata) {
      const meta = territory.metadata as TableMetadata
      
      // Find all relationships for this table
      const tableRelationships = relationships.filter(
        rel => rel.fromTable === territoryId || rel.toTable === territoryId
      )
      
      // Group relationships by connected table
      const relationshipsByTable = new Map<string, {
        incoming: Array<{rel: any, row: any}>,
        outgoing: Array<{rel: any, row: any}>
      }>()
      
      tableRelationships.forEach(rel => {
        if (rel.fromTable === territoryId) {
          // Outgoing relationship
          const targetTable = store.map.territories[rel.toTable]
          if (!targetTable) return
          
          if (!relationshipsByTable.has(rel.toTable)) {
            relationshipsByTable.set(rel.toTable, { incoming: [], outgoing: [] })
          }
          relationshipsByTable.get(rel.toTable)!.outgoing.push({
            rel,
            row: meta.rows[rel.fromRow]
          })
        } else {
          // Incoming relationship
          const sourceTable = store.map.territories[rel.fromTable]
          if (!sourceTable) return
          
          if (!relationshipsByTable.has(rel.fromTable)) {
            relationshipsByTable.set(rel.fromTable, { incoming: [], outgoing: [] })
          }
          relationshipsByTable.get(rel.fromTable)!.incoming.push({
            rel,
            row: meta.rows[rel.toRow]
          })
        }
      })
      
      return (
        <div className="absolute right-4 top-20 z-20 w-80">
          <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Table Properties</h3>
                <button
                  onClick={() => store.clearSelection()}
                  className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Table Name - Inline Editable */}
                <div>
                  <div className="font-semibold text-lg text-gray-900">
                    {meta.tableName || 'Untitled Table'}
                  </div>
                  {/* Quick Stats */}
                  <div className="text-xs text-gray-500 mt-1">
                    {meta.rows.length} columns • {tableRelationships.length} relationships
                  </div>
                </div>
                
                {/* Column Nullability - Most Important */}
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Column Nullability</h4>
                  <div className="border border-gray-200 rounded-md divide-y divide-gray-100 max-h-36 overflow-y-auto">
                    {meta.rows.map((row, index) => (
                      <div key={index} className="flex items-center px-3 py-2 hover:bg-gray-50">
                        <div className="flex items-center gap-2 flex-1">
                          {row.key && (
                            <span className={cn(
                              "text-xs font-medium",
                              row.key.includes('PK') ? "text-yellow-600" : "text-purple-600"
                            )}>
                              {row.key}
                            </span>
                          )}
                          <span className="text-sm text-gray-900">{row.name || `column_${index + 1}`}</span>
                          <span className="text-xs text-gray-500">({row.type})</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          {row.primaryKey ? (
                            <span className="text-xs text-gray-500 italic">Primary Key</span>
                          ) : (
                            <>
                              <span className={cn(
                                "text-xs font-medium min-w-[60px] text-right",
                                row.nullable !== false 
                                  ? "text-green-700"
                                  : "text-red-700"
                              )}>
                                {row.nullable !== false ? 'NULL' : 'NOT NULL'}
                              </span>
                              <button
                                onClick={() => {
                                  const updatedRows = [...meta.rows];
                                  updatedRows[index] = {
                                    ...updatedRows[index],
                                    nullable: !row.nullable
                                  };
                                  store.updateTerritory(territoryId, {
                                    metadata: { ...meta, rows: updatedRows }
                                  });
                                  store.setDirty(true);
                                }}
                                className={cn(
                                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-lg transition-all",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
                                  row.nullable !== false
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                )}
                              >
                                <span className={cn(
                                  "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                                  row.nullable !== false 
                                    ? "translate-x-[18px]"  // Right position for ON (nullable)
                                    : "translate-x-[1px]"    // Left position for OFF (not nullable)
                                )} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                
                {/* Relationships Section */}
                {tableRelationships.length > 0 ? (
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">
                      Relationships ({tableRelationships.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {tableRelationships.map((rel) => {
                        const isOutgoing = rel.fromTable === territoryId;
                        const connectedTableId = isOutgoing ? rel.toTable : rel.fromTable;
                        const connectedTable = store.map.territories[connectedTableId];
                        const connectedMeta = connectedTable?.metadata as TableMetadata;
                        const connectedTableName = connectedMeta?.tableName || 'Untitled Table';
                        const localRow = isOutgoing ? meta.rows[rel.fromRow] : meta.rows[rel.toRow];
                        const connectedRow = isOutgoing ? connectedMeta?.rows[rel.toRow] : connectedMeta?.rows[rel.fromRow];
                        
                        return (
                          <div key={rel.id} className="border border-gray-200 rounded p-2">
                            <div className="flex items-start justify-between mb-1">
                              <div className="text-xs">
                                <span className="font-medium text-gray-900">
                                  {isOutgoing ? '→' : '←'} {connectedTableName}
                                </span>
                                <div className="text-gray-600 mt-0.5">
                                  {isOutgoing ? (
                                    <span>{localRow?.name} → {connectedRow?.name}</span>
                                  ) : (
                                    <span>{connectedRow?.name} → {localRow?.name}</span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setRelationships(relationships.filter(r => r.id !== rel.id));
                                  store.setDirty(true);
                                }}
                                className="text-red-600 hover:text-red-700 p-0.5"
                                title="Delete Relationship"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            {isOutgoing && (
                              <div className="grid grid-cols-2 gap-1 mt-1">
                                <div>
                                  <label className="block text-xs text-gray-500">ON DELETE</label>
                                  <select
                                    value={rel.onDelete || 'RESTRICT'}
                                    onChange={(e) => {
                                      const updatedRel = { ...rel, onDelete: e.target.value as any };
                                      setRelationships(relationships.map(r => r.id === rel.id ? updatedRel : r));
                                      store.setDirty(true);
                                    }}
                                    className="w-full px-1 py-0.5 text-xs border border-gray-200 rounded"
                                  >
                                    <option value="CASCADE">CASCADE</option>
                                    <option value="SET NULL">SET NULL</option>
                                    <option value="RESTRICT">RESTRICT</option>
                                    <option value="NO ACTION">NO ACTION</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500">ON UPDATE</label>
                                  <select
                                    value={rel.onUpdate || 'CASCADE'}
                                    onChange={(e) => {
                                      const updatedRel = { ...rel, onUpdate: e.target.value as any };
                                      setRelationships(relationships.map(r => r.id === rel.id ? updatedRel : r));
                                      store.setDirty(true);
                                    }}
                                    className="w-full px-1 py-0.5 text-xs border border-gray-200 rounded"
                                  >
                                    <option value="CASCADE">CASCADE</option>
                                    <option value="SET NULL">SET NULL</option>
                                    <option value="RESTRICT">RESTRICT</option>
                                    <option value="NO ACTION">NO ACTION</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">
                    No relationships defined
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      // Deep copy table to ensure independence
                      const newTableId = `table-${Date.now()}`;
                      const newTable = {
                        id: newTableId,
                        name: `${territory.name}_copy`,
                        continent: territory.continent,
                        fillPath: territory.fillPath,
                        borderSegments: territory.borderSegments ? [...territory.borderSegments] : [],
                        center: {
                          x: territory.center.x + 50,
                          y: territory.center.y + 50
                        },
                        zIndex: territory.zIndex,
                        metadata: {
                          type: 'database-table',
                          tableName: `${meta.tableName}_copy`,
                          columns: [...meta.columns],
                          rows: meta.rows.map(row => ({
                            ...row,
                            // Deep copy each row to avoid shared references
                            key: row.key,
                            name: row.name,
                            type: row.type,
                            nullable: row.nullable,
                            primaryKey: row.primaryKey,
                            autoIncrement: row.autoIncrement,
                            default: row.default
                          })),
                          nameHeight: meta.nameHeight,
                          headerHeight: meta.headerHeight,
                          rowHeight: meta.rowHeight,
                          width: meta.width,
                          columnWidths: meta.columnWidths ? [...meta.columnWidths] : undefined
                        }
                      };
                      store.addTerritory(newTable as any);
                      store.setDirty(true);
                      
                      // Select the new table
                      store.clearSelection();
                      store.selectTerritory(newTableId);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Copy Table
                  </button>
                  <button
                    onClick={() => {
                      store.deleteTerritory(territoryId);
                      store.setDirty(true);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Table
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )
    }
    
    // Original territory properties for non-table territories
    return (
      <div className="absolute right-4 top-20 z-20 w-80">
        <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Territory Properties</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => store.deleteTerritory(territoryId)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  title="Delete Territory"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => store.clearSelection()}
                  className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={territory.name}
                  onChange={(e) => store.updateTerritory(territoryId, { name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Territory name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Continent
                </label>
                <select
                  value={territory.continent}
                  onChange={(e) => store.updateTerritory(territoryId, { continent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="unassigned">Unassigned</option>
                  <option value="north-america">North America</option>
                  <option value="south-america">South America</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="africa">Africa</option>
                  <option value="australia">Australia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Center Point
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">X</label>
                    <input
                      type="number"
                      value={Math.round(territory.center.x)}
                      onChange={(e) => store.updateTerritory(territoryId, { 
                        center: { ...territory.center, x: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Y</label>
                    <input
                      type="number"
                      value={Math.round(territory.center.y)}
                      onChange={(e) => store.updateTerritory(territoryId, { 
                        center: { ...territory.center, y: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Z-Index (Layer Order)
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={territory.zIndex || 0}
                    onChange={(e) => store.updateTerritory(territoryId, { 
                      zIndex: Number(e.target.value)
                    })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => store.sendToBack(territoryId)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                      title="Send to Back"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="6" y="2" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
                        <rect x="2" y="6" width="8" height="8" fill="#3B82F6" stroke="#1E40AF"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => store.sendBackward(territoryId)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                      title="Send Backward"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="4" y="4" width="8" height="8" fill="#60A5FA" stroke="#2563EB"/>
                        <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => store.bringForward(territoryId)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                      title="Bring Forward"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
                        <rect x="4" y="4" width="8" height="8" fill="#60A5FA" stroke="#2563EB"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => store.bringToFront(territoryId)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                      title="Bring to Front"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
                        <rect x="6" y="2" width="8" height="8" fill="#3B82F6" stroke="#1E40AF"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  
  // Multiple selection
  return (
    <div className="absolute right-4 top-20 z-20 w-80">
      <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Multiple Selection ({selectedTerritoryIds.length})
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  selectedTerritoryIds.forEach(id => store.deleteTerritory(id))
                }}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                title="Delete All Selected"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => store.clearSelection()}
                className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Continent
              </label>
              <select
                onChange={(e) => {
                  selectedTerritoryIds.forEach(id => 
                    store.updateTerritory(id, { continent: e.target.value })
                  )
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="">Select continent...</option>
                <option value="north-america">North America</option>
                <option value="south-america">South America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="africa">Africa</option>
                <option value="australia">Australia</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Selected territories:</p>
              <div className="max-h-32 overflow-y-auto">
                <ul className="space-y-1">
                  {selectedTerritoryIds.map(id => {
                    const territory = store.map.territories[id]
                    return territory ? (
                      <li key={id} className="truncate">
                        • {territory.name || 'Unnamed'}
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => store.clearSelection()}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}