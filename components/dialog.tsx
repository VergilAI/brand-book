"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-overlay backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "transition-all duration-normal",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const dialogContentVariants = cva(
  [
    "fixed z-50 grid w-full gap-[var(--spacing-md)]",
    "bg-elevated border border-default rounded-[var(--radius-xl)]",
    "p-[var(--spacing-lg)] shadow-modal",
    "transition-all duration-normal",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-7xl",
      },
      position: {
        center: [
          "left-[50%] top-[50%]",
          "translate-x-[-50%] translate-y-[-50%]",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        ],
        top: [
          "left-[50%] top-[10%]",
          "translate-x-[-50%]",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ],
        bottom: [
          "left-[50%] bottom-[10%]",
          "translate-x-[-50%]",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ],
        left: [
          "left-[var(--spacing-lg)] top-[50%]",
          "translate-y-[-50%]",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ],
        right: [
          "right-[var(--spacing-lg)] top-[50%]",
          "translate-y-[-50%]",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
      },
    },
    defaultVariants: {
      size: "default",
      position: "center",
    },
  }
)

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size, position, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ size, position }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className={cn(
        "absolute right-[var(--spacing-md)] top-[var(--spacing-md)]",
        "rounded-[var(--radius-sm)] p-[var(--spacing-xs)]",
        "text-secondary hover:text-primary",
        "transition-all duration-fast",
        "hover:bg-emphasis",
        "focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
      )}>
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-[var(--spacing-sm)]",
      "text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end",
      "gap-[var(--spacing-sm)]",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-[var(--font-size-xl)] font-[var(--font-weight-semibold)]",
      "leading-[var(--line-height-tight)] tracking-[var(--letter-spacing-tight)]",
      "text-primary",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-[var(--font-size-sm)] text-secondary",
      "leading-[var(--line-height-normal)]",
      className
    )}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}