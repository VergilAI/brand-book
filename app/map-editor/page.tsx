"use client"

import React from 'react'
import { MapCanvas } from './components/canvas/MapCanvas'
import { Toolbar } from './components/tools/Toolbar'
import { FloatingPropertiesPanel } from './components/panels/FloatingPropertiesPanel'
import { TemplateLibraryPanel } from './components/template-library/TemplateLibraryPanel'
import { HelpInfo } from './components/HelpInfo'

export default function MapEditorPage() {
  return (
    <div className="h-screen relative bg-secondary overflow-hidden">
      {/* Main canvas - full screen */}
      <MapCanvas />
      
      {/* Template Library Panel (slides from left) */}
      <TemplateLibraryPanel />
      
      {/* Top toolbar (centered) */}
      <Toolbar />
      
      {/* Floating properties panel (right side) */}
      <FloatingPropertiesPanel />
      
      {/* Import/Export buttons (top right corner) */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
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
  )
}