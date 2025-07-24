"use client"

import React, { useState } from 'react'
import { useMapEditor } from '@/app/map-editor/hooks/useMapEditor'
import { ChevronLeft, Table, Link } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'

export function TemplateLibraryPanel() {
  const store = useMapEditor()
  const { isOpen } = store.templateLibrary
  const [connectionType, setConnectionType] = useState<string>('one-to-one')
  
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
    
    // Add the table to the map
    const newTerritoryId = `table-${Date.now()}`
    const territory = {
      id: newTerritoryId,
      name: 'New Table',
      continent: '',
      fillPath: tablePath,
      borderSegments: [],
      center: { x: store.view.pan.x + 400, y: store.view.pan.y + 300 },
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
            <h2 className="text-lg font-semibold">Database Elements</h2>
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
          {/* Table Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tables</h3>
            <button
              onClick={handleAddTable}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
            >
              <Table className="w-8 h-8 text-gray-600" />
              <span className="text-sm font-medium">Add Table</span>
              <span className="text-xs text-gray-500">Key | Name | Data</span>
            </button>
          </div>
          
          {/* Connection Type Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Connection Type</h3>
            <div className="space-y-2">
              <Select value={connectionType} onValueChange={setConnectionType}>
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
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          K to toggle panel
        </div>
      </div>
  )
}