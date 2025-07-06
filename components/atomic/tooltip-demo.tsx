"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { Button } from '../button'

export function TooltipDemo() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-spacing-lg p-spacing-lg">
        <div className="space-y-spacing-sm">
          <h2 className="text-2xl font-semibold text-primary">Tooltip Component Demo</h2>
          <p className="text-base text-secondary">
            Demonstration of the new tooltip component with clear, readable text and smooth animations.
          </p>
        </div>

        <div className="space-y-spacing-md">
          <h3 className="text-lg font-medium text-primary">Basic Usage</h3>
          <div className="flex gap-spacing-md">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="primary">Primary Action</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to perform the primary action</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Learn More</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Additional information about this feature</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-spacing-md">
          <h3 className="text-lg font-medium text-primary">Icon Buttons with Tooltips</h3>
          <div className="flex gap-spacing-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-secondary hover:bg-emphasis transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <path d="M3 12h18m-9-9v18" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new item</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-secondary hover:bg-emphasis transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <path d="M6 12h12" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove item</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-secondary hover:bg-emphasis transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit this item</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-secondary hover:bg-errorLight hover:text-error transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-errorLight text-error border border-error">
                <p>Delete this item permanently</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-spacing-md">
          <h3 className="text-lg font-medium text-primary">Form Field Help</h3>
          <div className="max-w-md space-y-spacing-md">
            <div className="space-y-spacing-xs">
              <div className="flex items-center gap-spacing-xs">
                <label htmlFor="email" className="text-base font-medium text-primary">
                  Email Address
                </label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-secondary transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-tertiary">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>We'll use this email to send you important updates about your courses</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <input
                id="email"
                type="email"
                className="w-full h-12 px-spacing-md text-base border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </div>

        <div className="space-y-spacing-md">
          <h3 className="text-lg font-medium text-primary">Status Indicators</h3>
          <div className="flex gap-spacing-md items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-successLight text-success rounded-md cursor-default">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This course is currently active and available to students</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-warningLight text-warning rounded-md cursor-default">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span className="text-sm font-medium">In Progress</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This course is being updated and may have limited functionality</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-secondary text-tertiary rounded-md cursor-default">
                  <div className="w-2 h-2 bg-tertiary rounded-full" />
                  <span className="text-sm font-medium">Archived</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This course has been archived and is no longer available to new students</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}