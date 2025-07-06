"use client"

import React from 'react'
import { TemplateShape } from '@/app/map-editor/types/template-library'
import { cn } from '@/lib/utils'

interface ShapeThumbnailProps {
  shape: TemplateShape
  onClick: () => void
}

export function ShapeThumbnail({ shape, onClick }: ShapeThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "aspect-square bg-white border border-gray-200 rounded-lg",
        "hover:border-blue-400 hover:bg-blue-50",
        "transition-all duration-150",
        "flex items-center justify-center p-2",
        "cursor-pointer group"
      )}
      title={shape.name}
    >
      <svg
        viewBox="0 0 50 50"
        className="w-full h-full"
      >
        <path
          d={shape.icon}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-600 group-hover:text-blue-600"
        />
      </svg>
      <span className="sr-only">{shape.name}</span>
    </button>
  )
}