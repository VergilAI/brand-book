"use client"

import * as React from "react"
import { Modal } from "@/components/modal"
import { Button } from "@/components/button"
import { Checkbox } from "@/components/atomic/checkbox"
import { Label } from "@/components/label"

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  initials?: string
}

export interface AssignSubordinatesModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  currentSubordinates?: string[]
  availableTeamMembers: TeamMember[]
  onAssign?: (subordinateIds: string[]) => void
}

export function AssignSubordinatesModal({
  open,
  onOpenChange,
  currentSubordinates = [],
  availableTeamMembers,
  onAssign,
}: AssignSubordinatesModalProps) {
  const [selectedSubordinates, setSelectedSubordinates] = React.useState<Set<string>>(
    new Set(currentSubordinates)
  )

  React.useEffect(() => {
    if (open) {
      setSelectedSubordinates(new Set(currentSubordinates))
    }
  }, [open, currentSubordinates])

  const handleToggle = (memberId: string) => {
    const newSelection = new Set(selectedSubordinates)
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId)
    } else {
      newSelection.add(memberId)
    }
    setSelectedSubordinates(newSelection)
  }

  const handleAssign = () => {
    onAssign?.(Array.from(selectedSubordinates))
    onOpenChange?.(false)
  }

  const handleCancel = () => {
    setSelectedSubordinates(new Set(currentSubordinates))
    onOpenChange?.(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Subordinate"
      size="default"
      footer={
        <div className="flex gap-spacing-sm justify-end w-full">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssign}
          >
            Assign Subordinate
          </Button>
        </div>
      }
    >
      <div className="space-y-spacing-md"> {/* 16px */}
        <div>
          <h4 className="text-base font-medium text-primary mb-spacing-sm"> {/* 16px, 500, #1D1D1F, 8px */}
            Select Team Members
          </h4>
          <div className="space-y-spacing-xs max-h-64 overflow-y-auto border border-subtle rounded-lg p-spacing-sm"> {/* 4px, rgba(0,0,0,0.05), 12px, 8px */}
            {availableTeamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-spacing-sm p-spacing-sm rounded-md hover:bg-secondary transition-colors" // 8px, 8px, 8px, #F5F5F7
              >
                <Checkbox
                  id={member.id}
                  checked={selectedSubordinates.has(member.id)}
                  onCheckedChange={() => handleToggle(member.id)}
                />
                <Label
                  htmlFor={member.id}
                  className="flex items-center gap-spacing-sm flex-1 cursor-pointer" // 8px
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand text-inverse text-sm font-medium"> {/* #7B00FF, #F5F5F7 */}
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      member.initials || member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary"> {/* 14px, 500, #1D1D1F */}
                      {member.name}
                    </p>
                    <p className="text-xs text-secondary"> {/* 12px, #6C6C6D */}
                      {member.role}
                    </p>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}