"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          // Background and text
          "bg-elevated text-primary",
          // Layout
          "z-dropdown min-w-[8rem] max-h-[var(--radix-dropdown-menu-content-available-height)]",
          "overflow-x-hidden overflow-y-auto p-1",
          // Border and rounding
          "rounded-md border border-default",
          // Shadow
          "shadow-dropdown",
          // Origin for animations
          "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
          // Animations
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          // Transitions
          "transition-all duration-fast timing-out",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // Layout
        "relative flex items-center gap-2",
        "px-2 py-1.5 rounded-sm",
        // Typography
        "text-sm font-normal",
        // Colors - default
        "text-primary",
        // SVG icons
        "[&_svg:not([class*='text-'])]:text-secondary",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        // Interactions
        "cursor-default select-none outline-hidden",
        // Transitions
        "transition-colors duration-fast timing-out",
        // Focus state
        "focus:bg-emphasis focus:text-emphasis",
        // Hover state
        "hover:bg-emphasis hover:text-emphasis",
        // Disabled state
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-disabled",
        "data-[disabled]:text-disabled",
        // Inset variant
        "data-[inset]:pl-8",
        // Destructive variant
        "data-[variant=destructive]:text-error",
        "data-[variant=destructive]:focus:bg-errorLight",
        "data-[variant=destructive]:focus:text-error",
        "data-[variant=destructive]:hover:bg-errorLight",
        "data-[variant=destructive]:hover:text-error",
        "data-[variant=destructive]:*:[svg]:!text-error",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        // Layout
        "relative flex items-center gap-2",
        "py-1.5 pr-2 pl-8 rounded-sm",
        // Typography
        "text-sm font-normal",
        // Colors
        "text-primary",
        // SVG icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        // Interactions
        "cursor-default select-none outline-hidden",
        // Transitions
        "transition-colors duration-fast timing-out",
        // States
        "focus:bg-emphasis focus:text-emphasis",
        "hover:bg-emphasis hover:text-emphasis",
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-disabled",
        "data-[disabled]:text-disabled",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        // Layout
        "relative flex items-center gap-2",
        "py-1.5 pr-2 pl-8 rounded-sm",
        // Typography
        "text-sm font-normal",
        // Colors
        "text-primary",
        // SVG icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        // Interactions
        "cursor-default select-none outline-hidden",
        // Transitions
        "transition-colors duration-fast timing-out",
        // States
        "focus:bg-emphasis focus:text-emphasis",
        "hover:bg-emphasis hover:text-emphasis",
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-disabled",
        "data-[disabled]:text-disabled",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        // Layout
        "px-2 py-1.5",
        // Typography
        "text-sm font-medium",
        // Colors
        "text-secondary",
        // Inset variant
        "data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        // Layout
        "-mx-1 my-1 h-px",
        // Color
        "bg-border-subtle",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        // Layout
        "ml-auto",
        // Typography
        "text-xs tracking-wide",
        // Color
        "text-tertiary",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        // Layout
        "flex items-center",
        "px-2 py-1.5 rounded-sm",
        // Typography
        "text-sm font-normal",
        // Colors
        "text-primary",
        // Interactions
        "cursor-default select-none outline-hidden",
        // Transitions
        "transition-colors duration-fast timing-out",
        // States
        "focus:bg-emphasis focus:text-emphasis",
        "hover:bg-emphasis hover:text-emphasis",
        "data-[state=open]:bg-emphasis",
        "data-[state=open]:text-emphasis",
        // Inset variant
        "data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        // Background and text
        "bg-elevated text-primary",
        // Layout
        "z-dropdown min-w-[8rem] overflow-hidden p-1",
        // Border and rounding
        "rounded-md border border-default",
        // Shadow
        "shadow-dropdown",
        // Origin for animations
        "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        // Transitions
        "transition-all duration-fast timing-out",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
