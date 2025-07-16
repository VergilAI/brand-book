'use client'

import { Card } from '@/components/card'
import { Progress } from '@/components/progress'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Info, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface OrganizationCardProps {
  // Common props
  id: string
  title: string
  subtitle: string
  color?: string
  progress?: number
  progressLabel?: string
  isSelected?: boolean
  onClick?: () => void
  className?: string
  
  // Role-specific props
  type: 'role' | 'employee'
  usersCount?: number
  teamProgress?: number
  
  // Employee-specific props
  initials?: string
  status?: 'on_track' | 'at_risk' | 'behind'
  
  // Optional tooltip
  tooltip?: string
}

export function OrganizationCard({
  id,
  title,
  subtitle,
  color = '#7B00FF',
  progress,
  progressLabel,
  isSelected = false,
  onClick,
  className,
  type,
  usersCount,
  teamProgress,
  initials,
  status,
  tooltip
}: OrganizationCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  // Determine progress color based on value or status
  const getProgressVariant = () => {
    if (type === 'employee' && progress !== undefined) {
      if (progress >= 80) return 'success'
      if (progress >= 60) return 'warning'
      return 'error'
    }
    return 'default'
  }
  
  const getStatusColor = () => {
    switch (status) {
      case 'on_track': return 'text-text-success'
      case 'at_risk': return 'text-text-warning'
      case 'behind': return 'text-text-error'
      default: return 'text-text-secondary'
    }
  }

  return (
    <Card 
      className={cn(
        "relative p-spacing-md cursor-pointer transition-all duration-200", // 16px
        "hover:shadow-md hover:border-border-default", // rgba(0,0,0,0.1)
        isSelected && "border-2 border-brand shadow-md ring-2 ring-brand", // #7B00FF
        !isSelected && "border border-border-subtle", // rgba(0,0,0,0.05)
        className
      )}
      onClick={onClick}
    >
      {/* Color accent bar for roles */}
      {type === 'role' && (
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-md"
          style={{ backgroundColor: color }}
        />
      )}
      
      <div className="flex items-start gap-spacing-sm"> {/* 8px */}
        {/* Avatar/Icon */}
        <div 
          className={cn(
            "flex items-center justify-center rounded-lg",
            type === 'role' ? "w-10 h-10" : "w-12 h-12"
          )}
          style={{ 
            backgroundColor: `${color}20`,
            color: color 
          }}
        >
          {type === 'role' ? (
            <span className="text-xs font-bold">
              {title.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          ) : (
            <span className="text-sm font-bold">
              {initials || title.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-spacing-xs"> {/* 4px */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-text-primary truncate"> {/* #1D1D1F */}
                {title}
              </h3>
              <p className="text-sm text-text-secondary"> {/* #6C6C6D */}
                {subtitle}
              </p>
            </div>
            
            {/* Info icon for tooltip */}
            {tooltip && (
              <div className="relative">
                <button
                  className="p-1 rounded hover:bg-bg-secondary transition-colors" // #F5F5F7
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="w-4 h-4 text-text-secondary" /> {/* #6C6C6D */}
                </button>
                
                {showTooltip && (
                  <div className="absolute right-0 top-8 z-10 w-48 p-spacing-sm bg-bg-inverse text-text-inverse text-xs rounded-md shadow-lg"> {/* #000000, #F5F5F7, 8px */}
                    {tooltip}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Team progress for roles */}
          {type === 'role' && teamProgress !== undefined && (
            <div className="mt-spacing-sm"> {/* 8px */}
              <div className="flex items-center justify-between mb-spacing-xs"> {/* 4px */}
                <span className="text-xs font-medium text-text-secondary">Team Progress</span> {/* #6C6C6D */}
                <span className="text-xs font-semibold text-text-primary">{teamProgress}%</span> {/* #1D1D1F */}
              </div>
              <Progress 
                value={teamProgress} 
                size="sm"
                variant={teamProgress >= 80 ? 'success' : teamProgress >= 60 ? 'warning' : 'default'}
              />
            </div>
          )}
          
          {/* Individual progress for employees */}
          {type === 'employee' && progress !== undefined && (
            <div className="mt-spacing-sm"> {/* 8px */}
              <div className="flex items-center justify-between mb-spacing-xs"> {/* 4px */}
                <span className={cn("text-xs font-medium", getStatusColor())}>
                  {progressLabel || `${progress}% Complete`}
                </span>
              </div>
              <Progress 
                value={progress} 
                size="sm"
                variant={getProgressVariant()}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* User count badge for roles */}
      {type === 'role' && usersCount !== undefined && (
        <div className="absolute top-spacing-sm right-spacing-sm"> {/* 8px */}
          <Badge variant="secondary" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {usersCount}
          </Badge>
        </div>
      )}
      
      {/* Status indicator for employees */}
      {type === 'employee' && status && (
        <div className="absolute top-spacing-sm right-spacing-sm"> {/* 8px */}
          <div 
            className={cn(
              "w-2 h-2 rounded-full",
              status === 'on_track' && "bg-text-success", // #0F8A0F
              status === 'at_risk' && "bg-text-warning", // #FFC700
              status === 'behind' && "bg-text-error" // #E51C23
            )}
          />
        </div>
      )}
    </Card>
  )
}