"use client"

import * as React from "react"
import { ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts"
import { cn } from "@/lib/utils"

// Chart components following shadcn patterns with Vergil design tokens

export interface ChartConfig {
  [key: string]: {
    label?: string
    color?: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

interface ChartContextProps {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const COLORS = {
  primary: "hsl(var(--chart-1))", // Will use Vergil purple
  secondary: "hsl(var(--chart-2))", // Will use Vergil blue
  tertiary: "hsl(var(--chart-3))", // Will use Vergil green
  quaternary: "hsl(var(--chart-4))", // Will use Vergil yellow
  quinary: "hsl(var(--chart-5))", // Will use Vergil pink
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, children, className, ...props }, ref) => {
    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          className={cn(
            "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line-line]:stroke-border",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean
    payload?: Array<{
      value: number
      name: string
      color?: string
      dataKey?: string
    }>
    label?: string
    labelFormatter?: (value: any) => string
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  }
>(
  (
    {
      active,
      payload,
      label,
      labelFormatter,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      nameKey = "name",
      labelKey,
      className,
      ...props
    },
    ref
  ) => {
    const chartContext = React.useContext(ChartContext)
    
    if (!active || !payload?.length) {
      return null
    }

    const config = chartContext?.config || {}

    // Filter out chart-specific props that shouldn't be passed to DOM elements
    const { 
      chartWidth, 
      chartHeight, 
      offset, 
      animationBegin, 
      animationDuration, 
      animationEasing,
      itemSorter,
      filterNull,
      itemStyle,
      wrapperStyle,
      contentStyle,
      cursor,
      isAnimationActive,
      animationId,
      coordinate,
      position,
      viewBox,
      ...domProps 
    } = props as any

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border-default bg-bg-primary p-2 shadow-md",
          className
        )}
        {...domProps}
      >
        {!hideLabel && label && (
          <div className="mb-1 font-medium">
            {labelFormatter ? labelFormatter(label) : label}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.dataKey || "value"}`
            const itemConfig = config[key as keyof typeof config]
            const indicatorColor = item.color || itemConfig?.color

            return (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      "h-2.5 w-2.5 shrink-0",
                      indicator === "line" && "w-4 border-b-2",
                      indicator === "dashed" && "w-4 border-b-2 border-dashed"
                    )}
                    style={{
                      backgroundColor: indicator === "dot" ? indicatorColor : undefined,
                      borderColor: indicator !== "dot" ? indicatorColor : undefined,
                    }}
                  />
                )}
                <span className="text-text-secondary">
                  {itemConfig?.label || item.name}:
                </span>
                <span className="font-medium">
                  {item.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: Array<{
      value: string
      color?: string
      type?: string
      id?: string
      dataKey?: string
    }>
    verticalAlign?: "top" | "bottom"
    nameKey?: string
  }
>(({ payload, verticalAlign = "bottom", nameKey, className, ...props }, ref) => {
  const chartContext = React.useContext(ChartContext)

  if (!payload?.length) {
    return null
  }

  const config = chartContext?.config || {}

  // Filter out chart-specific props that shouldn't be passed to DOM elements
  const { 
    chartWidth, 
    chartHeight, 
    offset, 
    margin,
    viewBox,
    iconSize,
    iconType,
    layout,
    align,
    wrapperStyle,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onClick,
    itemStyle,
    labelStyle,
    contentStyle,
    cursor,
    itemSorter,
    allowEscapeViewBox,
    reverseDirection,
    useTranslate3d,
    isAnimationActive,
    animationId,
    axisId,
    accessibilityLayer,
    ...domProps 
  } = props as any

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
      {...domProps}
    >
      {payload.map((item, index) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = config[key as keyof typeof config]

        return (
          <div
            key={index}
            className="flex items-center gap-1.5"
          >
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-text-secondary">
              {itemConfig?.label || item.value}
            </span>
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

// Wrapper for ResponsiveContainer that filters out problematic props
const ChartResponsiveContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ResponsiveContainer>
>(({ children, ...props }, ref) => {
  // ResponsiveContainer doesn't actually render a DOM element, it renders a div
  // But we'll wrap it to ensure no console warnings
  return <ResponsiveContainer {...props}>{children}</ResponsiveContainer>
})
ChartResponsiveContainer.displayName = "ChartResponsiveContainer"

// Custom chart axis tick component that filters props
const ChartAxisTick = ({ x, y, payload, ...props }: any) => {
  // Filter out chart-specific props
  const { 
    index,
    textAnchor,
    verticalAnchor,
    visibleTicksCount,
    tickFormatter,
    angle,
    className,
    stroke,
    fontSize,
    ...textProps 
  } = props
  
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      className={className}
      stroke={stroke}
      fontSize={fontSize}
      {...textProps}
    >
      {payload.value}
    </text>
  )
}

// Wrapper for Recharts Tooltip to use our custom content
const ChartTooltip = ({ content, ...props }: React.ComponentProps<typeof RechartsTooltip>) => {
  // Use our custom tooltip content if no content prop is provided
  const tooltipContent = content || <ChartTooltipContent />
  
  return <RechartsTooltip content={tooltipContent} {...props} />
}
ChartTooltip.displayName = "ChartTooltip"

// Wrapper for Recharts Legend to use our custom content
const ChartLegend = ({ content, ...props }: React.ComponentProps<typeof RechartsLegend>) => {
  // Use our custom legend content if no content prop is provided
  const legendContent = content || <ChartLegendContent />
  
  return <RechartsLegend content={legendContent} {...props} />
}
ChartLegend.displayName = "ChartLegend"

export {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartContext,
  useChart,
  COLORS,
  ChartResponsiveContainer,
  ChartAxisTick,
  ChartTooltip,
  ChartLegend,
}