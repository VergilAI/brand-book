"use client"

import React, { useRef } from 'react'
import { useMapEditor } from '@/app/map-editor/hooks/useMapEditor'
import { useRelationships } from '@/app/map-editor/contexts/RelationshipContext'
import { schemaToVisual } from '@/app/map-editor/lib/schema-converters'
import { DatabaseSchema } from '@/app/map-editor/types/json-schema-types'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImportButton() {
  const store = useMapEditor()
  const { setRelationships } = useRelationships()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleImport = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      const text = await file.text()
      const schema = JSON.parse(text) as DatabaseSchema
      
      // Convert schema to visual format
      const { items, relationships } = schemaToVisual(schema)
      
      // Update the store with new data
      store.clearAll()
      
      // Add all items to the map
      Object.values(items).forEach(item => {
        store.addItem(item)
      })
      
      // Update relationships
      setRelationships(relationships)
      
      // Update metadata
      store.setCurrentDiagramMetadata(schema.metadata)
      store.setCurrentDiagramPath(file.name)
      
      // Mark as clean since we just loaded
      store.setDirty(false)
      
      console.log(`Imported schema from ${file.name}`)
    } catch (error) {
      console.error('Error importing schema:', error)
      alert('Error importing schema. Please check the file format.')
    }
    
    // Reset the input
    if (event.target) {
      event.target.value = ''
    }
  }
  
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button 
        onClick={handleImport}
        className={cn(
          "inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md border shadow-sm transition-all gap-2",
          "bg-primary hover:bg-emphasis"
        )}
      >
        <Upload className="w-4 h-4" />
        Import
      </button>
    </>
  )
}