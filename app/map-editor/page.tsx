"use client"

import React from 'react'
import { MapCanvas } from '@/components/diagram-tool/canvas/MapCanvas'
import { Toolbar } from '@/components/diagram-tool/tools/Toolbar'
import { FloatingPropertiesPanel } from '@/components/diagram-tool/panels/FloatingPropertiesPanel'
import { TemplateLibraryPanel } from '@/components/diagram-tool/template-library/TemplateLibraryPanel'
import { HelpInfo } from '@/components/diagram-tool/HelpInfo'
import { SaveButton } from '@/components/diagram-tool/SaveButton'
import { SchemaNameInput } from '@/components/diagram-tool/SchemaNameInput'
import { RelationshipProvider } from './contexts/RelationshipContext'

export default function MapEditorPage() {
  return (
    <RelationshipProvider>
      <div className="h-screen relative bg-secondary overflow-hidden">
      {/* Main canvas - full screen */}
      <MapCanvas />
      
      {/* Template Library Panel (slides from left) */}
      <TemplateLibraryPanel />
      
      {/* Top toolbar (centered) */}
      <Toolbar />
      
      {/* Floating properties panel (right side) */}
      <FloatingPropertiesPanel />
      
      {/* Schema name and buttons (top right corner) */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <SchemaNameInput />
        <div className="w-px h-6 bg-gray-300" />
        <SaveButton />
        <button className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md border bg-primary shadow-sm hover:bg-emphasis transition-all">
          Import
        </button>
        <button className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md bg-brand text-inverse shadow-sm hover:bg-brand-hover transition-all">
          Export
        </button>
      </div>
      
      {/* Help info (bottom left corner) */}
      <HelpInfo />
    </div>
    </RelationshipProvider>
  )
}