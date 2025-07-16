"use client"

import * as React from "react"
import { Modal } from "@/components/modal"
import { Button } from "@/components/button"
import { AlertTriangle, Trash2, UserX, RefreshCw, Info } from "lucide-react"

export type ConfirmationModalVariant = 'danger' | 'warning' | 'info'

export interface ConfirmationModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: ConfirmationModalVariant
  icon?: React.ReactNode
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconColor: 'text-error', // #E51C23
    confirmVariant: 'destructive' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-warning', // #FFC700
    confirmVariant: 'primary' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-info', // #0087FF
    confirmVariant: 'primary' as const,
  },
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
  icon,
}: ConfirmationModalProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange?.(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange?.(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      footer={
        <div className="flex gap-spacing-sm justify-end w-full">
          <Button variant="ghost" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button variant={config.confirmVariant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center space-y-spacing-md py-spacing-sm"> {/* 16px, 8px */}
        {icon || (
          <div className={`rounded-full p-spacing-md bg-secondary ${config.iconColor}`}> {/* 16px, #F5F5F7 */}
            <Icon className="h-6 w-6" />
          </div>
        )}
        
        <div className="space-y-spacing-sm"> {/* 8px */}
          <h3 className="text-lg font-semibold text-primary"> {/* 20px, 600, #1D1D1F */}
            {title}
          </h3>
          {description && (
            <p className="text-base text-secondary max-w-sm"> {/* 16px, #6C6C6D */}
              {description}
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}