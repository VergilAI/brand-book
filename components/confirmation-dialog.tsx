'use client'

import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { cn } from '@/lib/utils'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning'
  icon?: React.ReactNode
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          iconColor: 'text-text-error', // #E51C23
          titleColor: 'text-text-error',
          confirmVariant: 'destructive' as const
        }
      case 'warning':
        return {
          iconColor: 'text-text-brand', // #7B00FF
          titleColor: 'text-text-brand',
          confirmVariant: 'destructive' as const
        }
      default:
        return {
          iconColor: 'text-text-info', // #0087FF
          titleColor: 'text-text-primary', // #1D1D1F
          confirmVariant: 'primary' as const
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <div 
      className="fixed inset-0 bg-bg-overlay backdrop-blur-sm flex items-center justify-center p-4 z-modal min-h-screen" // rgba(0, 0, 0, 0.5)
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md bg-bg-primary shadow-modal overflow-visible max-h-[90vh] flex flex-col" // #FFFFFF
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon || (
                <AlertTriangle className={cn("h-5 w-5", variantStyles.iconColor)} />
              )}
              <CardTitle className={cn("text-lg font-semibold", variantStyles.titleColor)}>
                {title}
              </CardTitle>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-6 pb-6">
          <p className="text-text-secondary leading-relaxed"> {/* #6C6C6D */}
            {description}
          </p>

          <div className="flex items-center gap-3 justify-end pt-4">
            <Button 
              variant="secondary" 
              size="md"
              onClick={onClose}
              className="min-w-[80px]"
            >
              {cancelText}
            </Button>
            <Button 
              variant={variantStyles.confirmVariant}
              size="md"
              onClick={handleConfirm}
              className="min-w-[120px]"
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}