"use client"

import React from 'react'
import { TemplateShape } from '@/app/map-editor/types/template-library'
import { ShapeThumbnail } from './ShapeThumbnail'

interface ShapeGridProps {
  shapes: TemplateShape[]
  onShapeSelect: (shapeId: string) => void
}

export function ShapeGrid({ shapes, onShapeSelect }: ShapeGridProps) {
  if (shapes.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No shapes found
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {shapes.map(shape => (
        <ShapeThumbnail
          key={shape.id}
          shape={shape}
          onClick={() => onShapeSelect(shape.id)}
        />
      ))}
    </div>
  )
}