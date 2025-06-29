import React from 'react'
import { cn } from '@/lib/utils'

interface IconProps {
  size?: number
  className?: string
}

interface SnappingIconProps extends IconProps {
  enabled?: boolean
}

interface GridIconProps extends IconProps {
  enabled?: boolean
}

export function BringToFrontIcon({ size = 16, className }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
      <rect x="6" y="2" width="8" height="8" fill="#3B82F6" stroke="#1E40AF"/>
    </svg>
  )
}

export function BringForwardIcon({ size = 16, className }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
      <rect x="4" y="4" width="8" height="8" fill="#60A5FA" stroke="#2563EB"/>
    </svg>
  )
}

export function SendBackwardIcon({ size = 16, className }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <rect x="4" y="4" width="8" height="8" fill="#60A5FA" stroke="#2563EB"/>
      <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
    </svg>
  )
}

export function SendToBackIcon({ size = 16, className }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <rect x="6" y="2" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
      <rect x="2" y="6" width="8" height="8" fill="#3B82F6" stroke="#1E40AF"/>
    </svg>
  )
}

export function CopyIcon({ size = 16, className }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <rect x="2" y="2" width="10" height="10" fill="none" stroke="#6B7280" strokeWidth="1.5"/>
      <rect x="4" y="4" width="10" height="10" fill="white" stroke="#3B82F6" strokeWidth="1.5"/>
    </svg>
  )
}

export function DuplicateIcon({ size = 16, className }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <rect x="2" y="2" width="8" height="8" fill="none" stroke="#6B7280" strokeWidth="1.5"/>
      <rect x="6" y="6" width="8" height="8" fill="white" stroke="#3B82F6" strokeWidth="1.5"/>
    </svg>
  )
}

export function PasteIcon({ size = 16, className }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <rect x="2" y="2" width="10" height="10" fill="none" stroke="#6B7280" strokeWidth="1.5"/>
      <rect x="4" y="4" width="10" height="10" fill="white" stroke="#3B82F6" strokeWidth="1.5"/>
      <path d="M6 8H12M6 10H12M6 12H10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function SelectAllIcon({ size = 16, className }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="2 2"/>
      <rect x="4" y="4" width="3" height="3" fill="#3B82F6"/>
      <rect x="9" y="4" width="3" height="3" fill="#3B82F6"/>
      <rect x="4" y="9" width="3" height="3" fill="#3B82F6"/>
      <rect x="9" y="9" width="3" height="3" fill="#3B82F6"/>
    </svg>
  )
}

export function GridIcon({ size = 16, className, enabled = true }: GridIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <line x1="2" y1="2" x2="14" y2="2" stroke={enabled ? '#3B82F6' : '#6B7280'} strokeWidth="1"/>
      <line x1="2" y1="6" x2="14" y2="6" stroke={enabled ? '#3B82F6' : '#6B7280'} strokeWidth="1"/>
      <line x1="2" y1="10" x2="14" y2="10" stroke={enabled ? '#3B82F6' : '#6B7280'} strokeWidth="1"/>
      <line x1="2" y1="14" x2="14" y2="14" stroke={enabled ? '#3B82F6' : '#6B7280'} strokeWidth="1"/>
      <line x1="2" y1="2" x2="2" y2="14" stroke={enabled ? '#3B82F6' : '#6B7280'} strokeWidth="1"/>
      <line x1="6" y1="2" x2="6" y2="14" stroke={enabled ? '#3B82F6' : '#6B7280'} strokeWidth="1"/>
      <line x1="10" y1="2" x2="10" y2="14" stroke={enabled ? '#3B82F6' : '#6B7280'} strokeWidth="1"/>
      <line x1="14" y1="2" x2="14" y2="14" stroke={enabled ? '#3B82F6' : '#6B7280'} strokeWidth="1"/>
    </svg>
  )
}

export function SnappingIcon({ size = 16, className, enabled = true }: SnappingIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      className={cn(className)}
    >
      <rect x="2" y="2" width="5" height="5" fill={enabled ? '#3B82F6' : '#D1D5DB'}/>
      <rect x="9" y="2" width="5" height="5" fill={enabled ? '#3B82F6' : '#D1D5DB'}/>
      <rect x="2" y="9" width="5" height="5" fill={enabled ? '#3B82F6' : '#D1D5DB'}/>
      <rect x="9" y="9" width="5" height="5" fill={enabled ? '#3B82F6' : '#D1D5DB'}/>
    </svg>
  )
}