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
    // Convert visual data to schema format
    const schema = visualToSchema(store.map.territories, relationships)
    
    // For now, save to local storage
    // In production, this would send to backend API
    const key = store.currentDiagramPath || 'new-diagram'
    saveSchemaToStorage(key, schema)
    
    // Mark as clean
    store.setDirty(false)
    
    // Show success feedback (could be a toast in production)
    console.log('Diagram saved successfully!')
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