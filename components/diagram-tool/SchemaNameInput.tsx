"use client"

import React, { useState, useEffect } from 'react'
import { useMapEditor } from '@/app/map-editor/hooks/useMapEditor'
import { Edit3 } from 'lucide-react'

export function SchemaNameInput() {
  const store = useMapEditor()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  
  useEffect(() => {
    setName(store.currentDiagramMetadata?.name || 'New Database Schema')
  }, [store.currentDiagramMetadata])
  
  const handleSave = () => {
    if (name.trim()) {
      const newMetadata = {
        ...store.currentDiagramMetadata,
        name: name.trim(),
        dialect: store.currentDiagramMetadata?.dialect || 'postgresql',
        version: store.currentDiagramMetadata?.version || '1.0'
      }
      store.setCurrentDiagramMetadata(newMetadata)
      store.setDirty(true)
      setIsEditing(false)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setName(store.currentDiagramMetadata?.name || 'New Database Schema')
      setIsEditing(false)
    }
  }
  
  if (isEditing) {
    return (
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        autoFocus
      />
    )
  }
  
  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
      title="Click to edit schema name"
    >
      <span>{store.currentDiagramMetadata?.name || 'New Database Schema'}</span>
      <Edit3 className="w-3 h-3 text-gray-400" />
    </button>
  )
}