"use client"

import React, { useState, useEffect } from 'react'
import { useMapEditor } from '@/app/map-editor/hooks/useMapEditor'
import { useRelationships } from '@/app/map-editor/contexts/RelationshipContext'
import { ChevronLeft, Table, Link, Database, Plus, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { schemaToVisual, visualToSchema, loadSchemaFromFile } from '@/app/map-editor/lib/schema-converters'
import { DEFAULT_SCHEMA } from '@/app/map-editor/lib/default-schema'

// Define the available diagram files
const DIAGRAM_FILES = [
  { name: 'Blog Schema', file: '/db_dummy_data/postgres-blog-schema.json' },
  { name: 'E-commerce Schema', file: '/db_dummy_data/postgres-ecommerce-schema.json' },
  { name: 'Project Management', file: '/db_dummy_data/postgres-project-schema.json' },
]

export function TemplateLibraryPanel() {
  const store = useMapEditor()
  const { setRelationships } = useRelationships()
  const { isOpen, connectionType } = store.templateLibrary
  const [selectedDiagram, setSelectedDiagram] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleAddTable = () => {
    // Generate SVG path for a table with name, header and rows
    const width = 300
    const nameHeight = 30
    const headerHeight = 30
    const rowHeight = 30
    const numRows = 3 // 3 data rows
    const height = nameHeight + headerHeight + (rowHeight * numRows)
    
    // Create table outline (just the outer rectangle)
    const tablePath = `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`
    
    // Calculate offset for new table position
    // Count existing tables to determine offset
    const existingTables = Object.values(store.map.territories).filter(
      t => t.metadata?.type === 'database-table'
    ).length
    
    // Offset each new table by 30px both horizontally and vertically
    const offset = existingTables * 30
    
    // Add the table to the map
    const newTerritoryId = `table-${Date.now()}`
    const territory = {
      id: newTerritoryId,
      name: 'New Table',
      continent: '',
      fillPath: tablePath,
      borderSegments: [],
      center: { x: store.view.pan.x + 400 + offset, y: store.view.pan.y + 300 + offset },
      zIndex: Object.keys(store.map.territories).length,
      metadata: {
        type: 'database-table',
        tableName: 'New Table',
        columns: ['Key', 'Name', 'Type'],
        rows: [
          { key: '', name: '', type: 'text' },
          { key: '', name: '', type: 'text' },
          { key: '', name: '', type: 'text' }
        ],
        nameHeight,
        headerHeight,
        rowHeight,
        width
      }
    } as any
    
    store.addTerritory(territory)
    
    // Close the panel after adding
    store.toggleTemplateLibrary()
  }
  
  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full z-30",
        "bg-white border-r border-gray-200 shadow-lg",
        "transition-transform duration-300",
        "flex flex-col",
        "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Database Editor</h2>
            <button
              onClick={() => store.toggleTemplateLibrary()}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Diagrams Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Diagrams
            </h3>
            <div className="space-y-2">
              {DIAGRAM_FILES.map((diagram) => (
                <button
                  key={diagram.file}
                  onClick={async () => {
                    setIsLoading(true)
                    try {
                      const schema = await loadSchemaFromFile(diagram.file)
                      const { items, relationships } = schemaToVisual(schema)
                      
                      // Clear existing items and add new ones
                      store.clearAll()
                      Object.values(items).forEach(item => {
                        store.addItem(item)
                      })
                      
                      // Add relationships
                      setRelationships(relationships)
                      
                      setSelectedDiagram(diagram.file)
                      // Mark as clean since we just loaded
                      if (store.setDirty) store.setDirty(false)
                      if (store.setCurrentDiagramPath) store.setCurrentDiagramPath(diagram.file)
                      if (store.setCurrentDiagramMetadata) store.setCurrentDiagramMetadata(schema.metadata)
                    } catch (error) {
                      console.error('Failed to load diagram:', error)
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  className={cn(
                    "w-full p-3 text-left rounded-lg border transition-colors",
                    selectedDiagram === diagram.file
                      ? "border-brand bg-brand/5 text-brand"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                  disabled={isLoading}
                >
                  <div className="font-medium">{diagram.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{diagram.file}</div>
                </button>
              ))}
              
              {/* New Diagram Button */}
              <button
                onClick={() => {
                  const { items, relationships } = schemaToVisual(DEFAULT_SCHEMA)
                  
                  // Clear and load default schema
                  store.clearAll()
                  Object.values(items).forEach(item => {
                    store.addItem(item)
                  })
                  
                  setRelationships(relationships)
                  
                  setSelectedDiagram(null)
                  if (store.setDirty) store.setDirty(false)
                  if (store.setCurrentDiagramPath) store.setCurrentDiagramPath(null)
                  if (store.setCurrentDiagramMetadata) store.setCurrentDiagramMetadata(DEFAULT_SCHEMA.metadata)
                }}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">New Diagram</span>
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            {/* Table Section */}
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tables</h3>
            <button
              onClick={handleAddTable}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
            >
              <Table className="w-8 h-8 text-gray-600" />
              <span className="text-sm font-medium">Add Table</span>
              <span className="text-xs text-gray-500">Key | Name | Data</span>
            </button>
          
          {/* Connection Type Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Connection Type</h3>
            <div className="space-y-2">
              <Select value={connectionType} onValueChange={store.setConnectionType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select connection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-to-one">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      <span>One to One</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="one-to-many">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      <span>One to Many</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="many-to-many">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      <span>Many to Many</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Select the type of relationship for database connections
              </p>
            </div>
          </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          K to toggle panel
        </div>
      </div>
  )
}