"use client"

import * as React from "react"
import { IconButton, type IconButtonProps } from "./IconButton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip/Tooltip"

export interface IconButtonWithTooltipProps extends IconButtonProps {
  tooltip?: string
  tooltipDelay?: number
  tooltipSide?: "top" | "right" | "bottom" | "left"
}

export function IconButtonWithTooltip({ 
  tooltip,
  tooltipDelay = 500, // Slightly faster for better responsiveness
  tooltipSide = "bottom",
  ...props 
}: IconButtonWithTooltipProps) {
  if (!tooltip) {
    return <IconButton {...props} />
  }

  return (
    <TooltipProvider delayDuration={tooltipDelay}>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton {...props} />
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}