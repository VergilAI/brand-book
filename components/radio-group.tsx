"use client"

import * as React from "react"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({})

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name, children, ...props }, ref) => {
    const contextValue = React.useMemo(
      () => ({ value, onValueChange, name }),
      [value, onValueChange, name]
    )

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn("grid gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, value, disabled, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext)
    const isChecked = context.value === value

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isChecked}
        disabled={disabled}
        data-state={isChecked ? "checked" : "unchecked"}
        className={cn(
          "aspect-square h-4 w-4",
          "rounded-full",
          "border border-primary", // #1D1D1F
          "bg-primary", // #FFFFFF
          "text-primary", // #1D1D1F
          "focus:outline-none focus-visible:ring-2",
          "focus-visible:ring-border-focus focus-visible:ring-offset-2", // #007AFF
          "disabled:cursor-not-allowed disabled:opacity-disabled", // 0.4
          "transition-all duration-fast", // 100ms
          isChecked && "bg-primary border-primary", // #1D1D1F
          className
        )}
        onClick={() => {
          if (!disabled && context.onValueChange) {
            context.onValueChange(value)
          }
        }}
        {...props}
      >
        {isChecked && (
          <span className="flex items-center justify-center w-full h-full">
            <Circle className="h-2 w-2 fill-inverse text-inverse" /> {/* #F5F5F7 */}
          </span>
        )}
      </button>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }