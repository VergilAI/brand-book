"use client"

import React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ShapeCategory, TemplateShape } from '@/app/map-editor/types/template-library'
import { ShapeGrid } from './ShapeGrid'
import { cn } from '@/lib/utils'

interface CategorySectionProps {
  category: ShapeCategory
  shapes: TemplateShape[]
  isExpanded: boolean
  onToggle: () => void
  onShapeSelect: (shapeId: string) => void
}

export function CategorySection({
  category,
  shapes,
  isExpanded,
  onToggle,
  onShapeSelect
}: CategorySectionProps) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5",
          "text-sm font-medium text-gray-700",
          "hover:bg-gray-50 rounded",
          "transition-colors"
        )}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <span className="text-base mr-1">{category.icon}</span>
        <span>{category.name}</span>
        <span className="ml-auto text-xs text-gray-400">
          {shapes.length}
        </span>
      </button>
      
      {isExpanded && (
        <div className="mt-2">
          <ShapeGrid
            shapes={shapes}
            onShapeSelect={onShapeSelect}
          />
        </div>
      )}
    </div>
  )
}