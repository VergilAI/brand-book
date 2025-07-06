"use client"

import React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShapeSearchProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export function ShapeSearch({ value, onChange, onClear }: ShapeSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search shapes..."
        className={cn(
          "w-full pl-9 pr-8 py-2",
          "text-sm",
          "border border-gray-200 rounded-lg",
          "focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400",
          "placeholder:text-gray-400"
        )}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>
      )}
    </div>
  )
}