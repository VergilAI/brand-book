"use client"

import * as React from "react"
import { Modal } from "@/components/modal"
import { Button } from "@/components/button"
import { RadioGroup, RadioGroupItem } from "@/components/radio-group"
import { Label } from "@/components/label"
import { User } from "lucide-react"

export interface Manager {
  id: string
  name: string
  role: string
  avatar?: string
}

export interface AssignManagerModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  currentManagerId?: string
  availableManagers: Manager[]
  onAssign?: (managerId: string) => void
}

export function AssignManagerModal({
  open,
  onOpenChange,
  currentManagerId,
  availableManagers,
  onAssign,
}: AssignManagerModalProps) {
  const [selectedManager, setSelectedManager] = React.useState<string>(currentManagerId || '')

  React.useEffect(() => {
    if (open) {
      setSelectedManager(currentManagerId || '')
    }
  }, [open, currentManagerId])

  const handleAssign = () => {
    if (selectedManager && selectedManager !== currentManagerId) {
      onAssign?.(selectedManager)
    }
    onOpenChange?.(false)
  }

  const handleCancel = () => {
    setSelectedManager(currentManagerId || '')
    onOpenChange?.(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Manager"
      description="Select a manager for this team member"
      size="default"
      footer={
        <div className="flex gap-spacing-sm justify-end w-full">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssign}
            disabled={!selectedManager || selectedManager === currentManagerId}
          >
            Assign Manager
          </Button>
        </div>
      }
    >
      <div className="space-y-spacing-sm"> {/* 8px */}
        <RadioGroup value={selectedManager} onValueChange={setSelectedManager}>
          <div className="space-y-spacing-xs max-h-64 overflow-y-auto"> {/* 4px */}
            {availableManagers.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center space-x-spacing-sm p-spacing-sm rounded-lg hover:bg-secondary transition-colors" // 8px, #F5F5F7
              >
                <RadioGroupItem value={manager.id} id={manager.id} />
                <Label
                  htmlFor={manager.id}
                  className="flex items-center gap-spacing-sm flex-1 cursor-pointer" // 8px
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-light text-brand text-sm font-medium"> {/* #F3E6FF, #7B00FF */}
                    {manager.avatar ? (
                      <img src={manager.avatar} alt={manager.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      manager.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary"> {/* 14px, 500, #1D1D1F */}
                      {manager.name}
                    </p>
                    <p className="text-xs text-secondary"> {/* 12px, #6C6C6D */}
                      {manager.role}
                    </p>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </Modal>
  )
}