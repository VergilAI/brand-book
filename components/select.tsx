"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const selectTriggerVariants = cva(
  [
    "flex w-full items-center justify-between gap-2 rounded-md outline-none transition-all",
    "border border-[var(--border-default)]",
    "bg-[var(--bg-emphasisInput)]",
    "text-[var(--text-primary)]",
    "font-[var(--font-primary)]",
    "shadow-[var(--shadow-sm)]",
    
    // Hover state
    "hover:bg-[var(--bg-emphasis)]",
    "hover:border-[var(--border-emphasis)]",
    "hover:shadow-[var(--shadow-card)]",
    
    // Focus state
    "focus:border-[var(--border-focus)]",
    "focus:shadow-[var(--shadow-focus)]",
    "focus:bg-[var(--bg-primary)]",
    
    // Disabled state
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "disabled:bg-[var(--bg-disabled)]",
    "disabled:border-[var(--border-disabled)]",
    "disabled:text-[var(--text-disabled)]",
    
    // Error state
    "aria-[invalid=true]:border-[var(--border-error)]",
    "aria-[invalid=true]:shadow-[var(--shadow-focus-error)]",
    
    // Animation
    "duration-[var(--duration-normal)]",
    "[&>svg]:transition-transform [&>svg]:duration-[var(--duration-normal)]",
    "data-[state=open]:[&>svg]:rotate-180",
  ],
  {
    variants: {
      size: {
        sm: [
          "h-8",
          "px-[var(--spacing-sm)]",
          "text-[var(--font-size-sm)]",
          "rounded-[var(--radius-sm)]",
        ],
        md: [
          "h-10",
          "px-[var(--spacing-md)]",
          "text-[var(--font-size-base)]",
          "rounded-[var(--radius-md)]",
        ],
        lg: [
          "h-12",
          "px-[var(--spacing-lg)]",
          "text-[var(--font-size-lg)]",
          "rounded-[var(--radius-lg)]",
        ],
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const selectContentVariants = cva(
  [
    "relative z-50 overflow-hidden rounded-md",
    "bg-[var(--bg-elevated)]",
    "border border-[var(--border-subtle)]",
    "text-[var(--text-primary)]",
    "shadow-[var(--shadow-dropdown)]",
    
    // Animation
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95",
    "data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
  ]
)

const selectItemVariants = cva(
  [
    "relative flex w-full cursor-default select-none items-center rounded-sm outline-none",
    "text-[var(--text-primary)]",
    "transition-colors duration-[var(--duration-fast)]",
    
    // Hover state
    "hover:bg-[var(--bg-emphasis)]",
    "hover:text-[var(--text-emphasis)]",
    
    // Focus state
    "focus:bg-[var(--bg-emphasis)]",
    "focus:text-[var(--text-emphasis)]",
    
    // Disabled state
    "data-[disabled]:pointer-events-none",
    "data-[disabled]:opacity-50",
    "data-[disabled]:text-[var(--text-disabled)]",
    
    // Selected indicator
    "[&>span:first-child]:absolute",
    "[&>span:first-child]:left-2",
    "[&>span:first-child]:flex",
    "[&>span:first-child]:h-3.5",
    "[&>span:first-child]:w-3.5",
    "[&>span:first-child]:items-center",
    "[&>span:first-child]:justify-center",
  ],
  {
    variants: {
      size: {
        sm: [
          "py-1.5 pr-8 pl-8",
          "text-[var(--font-size-sm)]",
        ],
        md: [
          "py-2 pr-8 pl-8",
          "text-[var(--font-size-base)]",
        ],
        lg: [
          "py-2.5 pr-8 pl-8",
          "text-[var(--font-size-lg)]",
        ],
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface SelectProps extends React.ComponentProps<typeof SelectPrimitive.Root> {
  size?: "sm" | "md" | "lg"
  error?: boolean
}

function Select({ size = "md", ...props }: SelectProps) {
  return (
    <SelectPrimitive.Root {...props}>
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { size } as any)
        }
        return child
      })}
    </SelectPrimitive.Root>
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props} />
}

function SelectValue({
  placeholder,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      placeholder={placeholder}
      {...props}
    />
  )
}

interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  error?: boolean
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, size, error, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ size }), className)}
    aria-invalid={error}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

interface SelectContentProps
  extends React.ComponentProps<typeof SelectPrimitive.Content> {
  size?: "sm" | "md" | "lg"
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = "popper", size = "md", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        selectContentVariants(),
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            return React.cloneElement(child, { size } as any)
          }
          return child
        })}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-[var(--font-size-xs)] text-[var(--text-secondary)] font-[var(--font-weight-medium)]",
        className
      )}
      {...props}
    />
  )
}

interface SelectItemProps
  extends React.ComponentProps<typeof SelectPrimitive.Item>,
    VariantProps<typeof selectItemVariants> {}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, size, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(selectItemVariants({ size }), className)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4 text-[var(--text-brand)]" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        "-mx-1 my-1 h-px bg-[var(--border-subtle)]",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}