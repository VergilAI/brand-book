"use client"

import * as React from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Input } from "@/components/input"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConnectCardsPair {
  id: string
  left: string
  right: string
}

interface ConnectCardsContent {
  pairs: ConnectCardsPair[]
}

interface ConnectCardsEditorProps {
  content: ConnectCardsContent
  onChange: (content: ConnectCardsContent) => void
}

export function ConnectCardsEditor({ content, onChange }: ConnectCardsEditorProps) {
  const updatePair = (id: string, field: "left" | "right", value: string) => {
    onChange({
      pairs: content.pairs.map(pair =>
        pair.id === id ? { ...pair, [field]: value } : pair
      )
    })
  }

  return (
    <div className="space-y-spacing-md"> {/* 16px */}
      <div className="flex items-center justify-between">
        <h4 className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
          Card Pairs
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-spacing-md"> {/* 16px */}
        <div className="text-sm font-medium text-secondary"> {/* 14px, 500, #6C6C6D */}
          Left Column
        </div>
        <div className="text-sm font-medium text-secondary">
          Right Column
        </div>
      </div>

      <div className="space-y-spacing-sm"> {/* 8px */}
        {content.pairs.map((pair, index) => (
          <div key={pair.id} className="group">
            <div className="flex items-center gap-spacing-sm"> {/* 8px */}
              <div className="cursor-move p-spacing-xs"> {/* 4px */}
                <GripVertical size={16} className="text-tertiary" /> {/* #71717A */}
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-spacing-sm"> {/* 8px */}
                <Input
                  value={pair.left}
                  onChange={(e) => updatePair(pair.id, "left", e.target.value)}
                  placeholder={`Left item ${index + 1}`}
                  className="h-10"
                />
                <Input
                  value={pair.right}
                  onChange={(e) => updatePair(pair.id, "right", e.target.value)}
                  placeholder={`Right item ${index + 1}`}
                  className="h-10"
                />
              </div>

            </div>
          </div>
        ))}
      </div>

      <Card className="p-spacing-md bg-info-light border-info"> {/* 16px, #EFF6FF, #93C5FD */}
        <p className="text-sm text-info"> {/* 14px, #0087FF */}
          <strong>Tip:</strong> Students will need to match items from the left column to the right column. 
          Make sure each pair has a clear relationship.
        </p>
      </Card>
    </div>
  )
}