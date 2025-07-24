"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover"

const dataTypes = [
  { value: "text", label: "text", color: "#3B82F6" }, // Blue
  { value: "varchar", label: "varchar", color: "#3B82F6" }, // Blue
  { value: "uuid", label: "uuid", color: "#8B5CF6" }, // Purple
  { value: "integer", label: "integer", color: "#10B981" }, // Green
  { value: "bigint", label: "bigint", color: "#10B981" }, // Green
  { value: "decimal", label: "decimal", color: "#10B981" }, // Green
  { value: "boolean", label: "boolean", color: "#F59E0B" }, // Amber
  { value: "date", label: "date", color: "#EC4899" }, // Pink
  { value: "time", label: "time", color: "#EC4899" }, // Pink
  { value: "timestamp", label: "timestamp", color: "#EC4899" }, // Pink
  { value: "json", label: "json", color: "#6366F1" }, // Indigo
  { value: "jsonb", label: "jsonb", color: "#6366F1" }, // Indigo
  { value: "array", label: "array", color: "#14B8A6" }, // Teal
  { value: "enum", label: "enum", color: "#F97316" }, // Orange
]

interface TypeComboboxProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onOpenChange?: (open: boolean) => void
}

export function TypeCombobox({ value, onChange, onBlur, onOpenChange }: TypeComboboxProps) {
  const [open, setOpen] = React.useState(true) // Open by default when rendered
  const [search, setSearch] = React.useState("")
  
  React.useEffect(() => {
    // Auto-open when component mounts
    setOpen(true)
    onOpenChange?.(true)
  }, [])

  // Prevent body scroll when popover is open
  React.useEffect(() => {
    if (open) {
      // Save current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      
      // Restore on cleanup
      return () => {
        document.body.style.overflow = originalStyle;
      };
    } else {
      // Ensure body overflow is restored when closed
      document.body.style.overflow = '';
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Ensure body overflow is restored when component unmounts
      document.body.style.overflow = '';
      onOpenChange?.(false);
    };
  }, []);

  const filteredTypes = dataTypes.filter(type =>
    type.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (typeValue: string) => {
    onChange(typeValue)
    handleOpenChange(false)
    onBlur?.()
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-8 justify-between text-sm bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20"
        >
          <span className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full flex-shrink-0" 
              style={{ 
                backgroundColor: dataTypes.find(t => t.value === (value || 'text'))?.color 
              }}
            />
            {value || "text"}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[200px] p-0" 
        align="start"
        onWheel={(e) => {
          // Stop wheel event from propagating to prevent canvas scrolling
          e.stopPropagation()
        }}
        onPointerDown={(e) => {
          // Prevent pointer events from propagating to canvas
          e.stopPropagation()
        }}
        onMouseDown={(e) => {
          // Prevent mouse events from propagating to canvas
          e.stopPropagation()
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation()
              }}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {filteredTypes.length === 0 ? (
              <div className="py-6 text-center text-sm">No type found.</div>
            ) : (
              <div className="p-1">
                {filteredTypes.map((type) => (
                  <button
                    key={type.value}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                      "hover:bg-gray-100 hover:text-gray-900",
                      "focus:bg-gray-100 focus:text-gray-900",
                      value === type.value && "bg-gray-100 text-gray-900"
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelect(type.value)
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === type.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex items-center gap-2">
                      <span 
                        className="w-2 h-2 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: type.color }}
                      />
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}