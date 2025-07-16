"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog"
import { cn } from "@/lib/utils"

export interface ModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "default" | "lg" | "xl" | "full"
  className?: string
  showCloseButton?: boolean
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "default",
  className,
  showCloseButton = true,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        size={size} 
        className={cn(
          "space-y-spacing-lg", // 24px
          className
        )}
      >
        {(title || description) && (
          <DialogHeader className="space-y-spacing-sm"> {/* 8px */}
            {title && (
              <DialogTitle className="text-xl font-semibold text-primary"> {/* 24px, 600, #1D1D1F */}
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-base text-secondary"> {/* 16px, #6C6C6D */}
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {children && (
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        )}

        {footer && (
          <DialogFooter className="pt-spacing-lg border-t border-subtle"> {/* 24px, rgba(0,0,0,0.05) */}
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Export subcomponents for flexibility
export const ModalTrigger = Dialog.Trigger
export const ModalContent = DialogContent
export const ModalHeader = DialogHeader
export const ModalFooter = DialogFooter
export const ModalTitle = DialogTitle
export const ModalDescription = DialogDescription