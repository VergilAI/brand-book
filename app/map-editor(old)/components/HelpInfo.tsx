"use client"

import React, { useState } from 'react'
import { Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HelpInfo() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-4 left-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
        title="Keyboard shortcuts"
      >
        <Info size={20} />
      </button>
      
      {/* Help panel */}
      {isOpen && (
        <div className="absolute bottom-16 left-4 z-20 w-64 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Keyboard Shortcuts</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="text-gray-600">V</div>
                <div>Select tool</div>
                
                <div className="text-gray-600">H</div>
                <div>Pan tool</div>
                
                <div className="text-gray-600">D</div>
                <div>Draw territory</div>
                
                <div className="text-gray-600">C</div>
                <div>Connect (sea routes)</div>
                
                <div className="text-gray-600">L</div>
                <div>Toggle library</div>
                
                <div className="text-gray-600">G</div>
                <div>Toggle grid</div>
                
                <div className="text-gray-600">S</div>
                <div>Toggle snapping</div>
                
                <div className="text-gray-600">T</div>
                <div>Territory table</div>
                
                <div className="text-gray-600">Escape</div>
                <div>Cancel operation</div>
                
                <div className="text-gray-600">Delete</div>
                <div>Delete selected</div>
                
                <div className="text-gray-600">Ctrl/Cmd+Z</div>
                <div>Undo</div>
                
                <div className="text-gray-600">Ctrl/Cmd+Y</div>
                <div>Redo</div>
                
                <div className="text-gray-600">Ctrl/Cmd+C</div>
                <div>Copy</div>
                
                <div className="text-gray-600">Ctrl/Cmd+V</div>
                <div>Paste</div>
              </div>
              
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="font-medium mb-1">Navigation</div>
                <div className="space-y-1">
                  <div>• Shift+drag or middle mouse to pan</div>
                  <div>• Mouse wheel to zoom</div>
                  <div>• Click territories to select</div>
                  <div>• Ctrl/Cmd+click for multi-select</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}