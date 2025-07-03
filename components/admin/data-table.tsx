'use client'

import { useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Checkbox } from '@/components/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  actions?: {
    label: string
    onClick: (item: T) => void
    icon?: React.ReactNode
  }[]
  bulkActions?: {
    label: string
    onClick: (selectedItems: T[]) => void
    icon?: React.ReactNode
  }[]
  onRowClick?: (item: T) => void
  keyExtractor: (item: T) => string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  actions,
  bulkActions,
  onRowClick,
  keyExtractor
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredData.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredData.map(keyExtractor)))
    }
  }

  const toggleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const filteredData = data.filter(item => {
    if (!searchQuery) return true
    
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aVal = String(a[sortColumn])
    const bVal = String(b[sortColumn])
    
    const comparison = aVal.localeCompare(bVal, undefined, { numeric: true })
    return sortDirection === 'asc' ? comparison : -comparison
  })

  return (
    <div className="space-y-4">
      {/* Search and bulk actions */}
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        
        {bulkActions && selectedItems.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedItems.size} selected
            </span>
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  const selected = data.filter(item => 
                    selectedItems.has(keyExtractor(item))
                  )
                  action.onClick(selected)
                }}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {bulkActions && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selectedItems.size === filteredData.length && filteredData.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium text-gray-900",
                    column.sortable && "cursor-pointer hover:bg-gray-100",
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="w-12"></th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedData.map((item) => {
              const itemId = keyExtractor(item)
              const isSelected = selectedItems.has(itemId)
              
              return (
                <tr
                  key={itemId}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    isSelected && "bg-cosmic-purple/5",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {bulkActions && (
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectItem(itemId)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn("px-4 py-3 text-sm", column.className)}
                    >
                      {column.render ? 
                        column.render(item) : 
                        String(item[column.key as keyof T])
                      }
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation()
                                action.onClick(item)
                              }}
                            >
                              {action.icon}
                              <span className="ml-2">{action.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found</p>
          </div>
        )}
      </div>
    </div>
  )
}