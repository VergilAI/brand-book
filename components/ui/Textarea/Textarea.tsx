import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  [
    // Base styles with semantic tokens
    "flex w-full min-w-0",
    "transition-all duration-normal ease-out",
    "outline-none resize-none",
    
    // Typography tokens
    "font-sans text-text-primary placeholder:text-text-secondary",
    
    // Background
    "bg-bg-emphasisInput",
    
    // Border
    "border border-border-default",
    
    // Shadow
    "shadow-sm",
    
    // Focus state with semantic tokens
    "focus:border-border-focus focus:shadow-focus",
    
    // Hover state
    "hover:border-border-emphasis",
    
    // Disabled state
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "disabled:bg-bg-disabled disabled:text-text-disabled disabled:border-border-disabled",
    
    // Selection
    "selection:bg-bg-brand selection:text-text-inverse",
    
    // Scrollbar styling
    "[&::-webkit-scrollbar]:w-2",
    "[&::-webkit-scrollbar-track]:bg-transparent",
    "[&::-webkit-scrollbar-thumb]:bg-border-subtle",
    "[&::-webkit-scrollbar-thumb]:rounded-full",
    "[&::-webkit-scrollbar-thumb:hover]:bg-border-default"
  ],
  {
    variants: {
      size: {
        sm: [
          "min-h-[80px]",
          "px-sm py-xs",
          "text-sm",
          "rounded-sm"
        ],
        md: [
          "min-h-[120px]",
          "px-md py-sm",
          "text-base",
          "rounded-md"
        ],
        lg: [
          "min-h-[160px]",
          "px-lg py-md",
          "text-lg",
          "rounded-lg"
        ]
      },
      variant: {
        default: "",
        error: [
          "border-border-error",
          "focus:border-border-error focus:shadow-focus-error",
          "text-text-error placeholder:text-text-error/60"
        ],
        success: [
          "border-border-success",
          "focus:border-border-success focus:shadow-focus-success",
          "text-text-success placeholder:text-text-success/60"
        ]
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean
  success?: boolean
  autoResize?: boolean
  showCount?: boolean
  maxCount?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    size, 
    variant, 
    error, 
    success, 
    autoResize = false,
    showCount = false,
    maxCount,
    onChange,
    value,
    defaultValue,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(() => {
      if (!defaultValue) return ""
      if (typeof defaultValue === 'string') return defaultValue
      if (typeof defaultValue === 'number') return String(defaultValue)
      return Array.isArray(defaultValue) ? defaultValue.join('') : String(defaultValue)
    })
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const combinedRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node)
          } else {
            (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
          }
        }
        textareaRef.current = node
      },
      [ref]
    )
    
    const computedVariant = error ? "error" : success ? "success" : variant
    let valueAsString: string
    if (value !== undefined) {
      if (typeof value === 'string') {
        valueAsString = value
      } else if (typeof value === 'number') {
        valueAsString = String(value)
      } else {
        // Handle readonly string[] or any array
        valueAsString = Array.isArray(value) ? value.join('') : String(value)
      }
    } else {
      valueAsString = internalValue
    }
    const currentLength = valueAsString.length
    
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      
      if (maxCount && newValue.length > maxCount) {
        return
      }
      
      setInternalValue(newValue)
      onChange?.(e)
    }, [onChange, maxCount])
    
    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (textarea && autoResize) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [autoResize])
    
    React.useEffect(() => {
      adjustHeight()
    }, [valueAsString, adjustHeight])
    
    React.useEffect(() => {
      const handleResize = () => adjustHeight()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [adjustHeight])
    
    return (
      <div className="relative w-full">
        <textarea
          ref={combinedRef}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          data-slot="textarea"
          className={cn(
            textareaVariants({ size, variant: computedVariant }),
            autoResize && "overflow-hidden",
            className
          )}
          {...props}
        />
        {showCount && (
          <div className={cn(
            "absolute bottom-xs right-sm",
            "text-xs font-mono",
            "transition-colors duration-normal",
            maxCount && currentLength > maxCount * 0.9 
              ? "text-text-error" 
              : "text-text-secondary"
          )}>
            <span className="tabular-nums">
              {currentLength}
              {maxCount && (
                <>
                  <span className="mx-[2px]">/</span>
                  <span>{maxCount}</span>
                </>
              )}
            </span>
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }