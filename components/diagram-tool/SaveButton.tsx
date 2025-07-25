"use client"

import React from 'react'
import { useMapEditor } from '@/app/map-editor/hooks/useMapEditor'
import { useRelationships } from '@/app/map-editor/contexts/RelationshipContext'
import { visualToSchema, saveSchemaToStorage } from '@/app/map-editor/lib/schema-converters'
import { Save } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SaveButton() {
  const store = useMapEditor()
  const { relationships } = useRelationships()
  
  const handleSave = () => {
    // Get current metadata or use defaults
    const metadata = store.currentDiagramMetadata || {
      name: 'New Database Schema',
      dialect: 'postgresql' as const,
      version: '1.0'
    }
    
    // Convert visual data to schema format
    const schema = visualToSchema(
      store.map.territories, 
      relationships,
      metadata.dialect,
      metadata.version,
      metadata.name
    )
    
    // Generate filename
    const filename = store.currentDiagramPath 
      ? store.currentDiagramPath.split('/').pop() 
      : `${metadata.name.toLowerCase().replace(/\s+/g, '-')}-schema.json`
    
    // Create a blob with the JSON data
    const jsonString = JSON.stringify(schema, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
    // Also save to localStorage for persistence
    const key = store.currentDiagramPath || filename
    saveSchemaToStorage(key, schema)
    
    // Mark as clean
    store.setDirty(false)
    
    // Show success feedback
    console.log(`Diagram saved as ${filename}`)
  }
  
  return (
    <button 
      onClick={handleSave}
      className={cn(
        "inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md shadow-sm transition-all gap-2",
        store.isDirty 
          ? "bg-green-600 text-white hover:bg-green-700" 
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
      )}
      disabled={!store.isDirty}
    >
      <Save className="w-4 h-4" />
      Save
    </button>
  )
}