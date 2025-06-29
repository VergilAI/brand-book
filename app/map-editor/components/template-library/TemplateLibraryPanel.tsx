"use client"

import React, { useState, useMemo } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { ShapeGrid } from './ShapeGrid'
import { ShapeSearch } from './ShapeSearch'
import { CategorySection } from './CategorySection'
import { shapeLibrary } from '../shapes/ShapeLibrary'
import { SHAPE_CATEGORIES } from '../../types/template-library'
import { ChevronLeft, Library } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TemplateLibraryPanel() {
  const store = useMapEditor()
  const { isOpen, selectedCategory, searchQuery, recentShapes } = store.templateLibrary
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['basic', 'recent']))
  
  // Get shapes based on search or category
  const displayedShapes = useMemo(() => {
    if (searchQuery) {
      return shapeLibrary.searchShapes(searchQuery)
    }
    
    if (selectedCategory === 'all') {
      return shapeLibrary.getShapesByCategory('all')
    }
    
    return shapeLibrary.getShapesByCategory(selectedCategory)
  }, [searchQuery, selectedCategory])
  
  // Get recent shapes
  const recentShapeObjects = useMemo(() => {
    return recentShapes
      .map(id => shapeLibrary.getShape(id))
      .filter(Boolean)
      .slice(0, 10)
  }, [recentShapes])
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }
  
  const handleShapeSelect = (shapeId: string) => {
    store.startShapePlacement(shapeId)
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
            <h2 className="text-lg font-semibold">Shape Library</h2>
            <button
              onClick={() => store.toggleTemplateLibrary()}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <ShapeSearch
            value={searchQuery}
            onChange={(query) => store.setTemplateSearch(query)}
            onClear={() => store.setTemplateSearch('')}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchQuery ? (
            // Search Results
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Search Results ({displayedShapes.length})
              </h3>
              <ShapeGrid
                shapes={displayedShapes}
                onShapeSelect={handleShapeSelect}
              />
            </div>
          ) : selectedCategory === 'all' ? (
            // All Categories
            <div className="space-y-4">
              {/* Recent Shapes */}
              {recentShapeObjects.length > 0 && (
                <CategorySection
                  category={{ id: 'recent', name: 'Recent', icon: '🕐', order: 0 }}
                  shapes={recentShapeObjects}
                  isExpanded={expandedCategories.has('recent')}
                  onToggle={() => toggleCategory('recent')}
                  onShapeSelect={handleShapeSelect}
                />
              )}
              
              {/* All Categories */}
              {SHAPE_CATEGORIES.map(category => {
                const shapes = shapeLibrary.getShapesByCategory(category.id)
                if (shapes.length === 0) return null
                
                return (
                  <CategorySection
                    key={category.id}
                    category={category}
                    shapes={shapes}
                    isExpanded={expandedCategories.has(category.id)}
                    onToggle={() => toggleCategory(category.id)}
                    onShapeSelect={handleShapeSelect}
                  />
                )
              })}
            </div>
          ) : (
            // Single Category
            <div>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => store.setTemplateCategory('all')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← All Categories
                </button>
              </div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {SHAPE_CATEGORIES.find(c => c.id === selectedCategory)?.name} ({displayedShapes.length})
              </h3>
              <ShapeGrid
                shapes={displayedShapes}
                onShapeSelect={handleShapeSelect}
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          Click a shape to place • L to toggle panel
        </div>
      </div>
  )
}