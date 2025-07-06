"use client"

import React from 'react'

export function GridIcon({ enabled = false }: { enabled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path 
        d="M1 5H15M1 8H15M1 11H15M5 1V15M8 1V15M11 1V15" 
        stroke="currentColor" 
        strokeWidth="1.5"
        opacity={enabled ? "1" : "0.4"}
      />
    </svg>
  )
}

export function SnappingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <path 
        d="M8 1V5M8 11V15M1 8H5M11 8H15" 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}