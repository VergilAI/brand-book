"use client"

import React from 'react'
import { MapCanvas } from '@/components/diagram-tool/canvas/MapCanvas'
import { Toolbar } from '@/components/diagram-tool/tools/Toolbar'
import { FloatingPropertiesPanel } from '@/components/diagram-tool/panels/FloatingPropertiesPanel'
import { TemplateLibraryPanel } from '@/components/diagram-tool/template-library/TemplateLibraryPanel'
import { HelpInfo } from '@/components/diagram-tool/HelpInfo'
import { SaveButton } from '@/components/diagram-tool/SaveButton'
import { ImportButton } from '@/components/diagram-tool/ImportButton'
import { SchemaNameInput } from '@/components/diagram-tool/SchemaNameInput'
import { RelationshipProvider } from './contexts/RelationshipContext'
import { LineSettingsProvider } from './contexts/LineSettingsContext'

export default function MapEditorPage() {
  return (
    <RelationshipProvider>
      <LineSettingsProvider>
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
        <ImportButton />
        <SaveButton />
      </div>
      
      {/* Help info (bottom left corner) */}
      <HelpInfo />
    </div>
      </LineSettingsProvider>
    </RelationshipProvider>
  )
}