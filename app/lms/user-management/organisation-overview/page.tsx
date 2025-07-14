'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, Phone, User as UserIcon, ArrowLeft, Users, Plus, Minus, Edit2 } from 'lucide-react'
import { UserManagementHeader } from '@/components/user-management-header'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/progress'
import { Role, initialRoles } from '@/lib/lms/roles-data'
import { User, mockUsers, updateRoleUserCounts } from '@/lib/lms/mock-data'


interface ViewState {
  zoom: number
  pan: { x: number; y: number }
  showGrid: boolean
  viewMode: 'roles' | 'users' | 'employees'
  focusedRoleId?: string
}


export default function OrganisationOverviewPage() {
  const canvasRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const [roles, setRoles] = useState<Role[]>(updateRoleUserCounts(initialRoles))
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [includeSubordinates, setIncludeSubordinates] = useState(true)
  const [viewState, setViewState] = useState<ViewState>({
    zoom: 1.0,
    pan: { x: -250, y: -20 },
    showGrid: true,
    viewMode: 'roles'
  })
  const [isPanning, setIsPanning] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [showZoomIndicator, setShowZoomIndicator] = useState(false)
  const zoomIndicatorTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  const isPanningRef = useRef(false)


  // Calculate SVG viewBox to show all content
  const calculateViewBox = () => {
    const baseWidth = 1000
    const baseHeight = 1000
    
    // Apply zoom by scaling the viewBox
    const width = baseWidth / viewState.zoom
    const height = baseHeight / viewState.zoom
    
    return `${viewState.pan.x} ${viewState.pan.y} ${width} ${height}`
  }

  // Get SVG coordinates from screen coordinates
  const getSVGPoint = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    
    const pt = canvasRef.current.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    
    const svgP = pt.matrixTransform(canvasRef.current.getScreenCTM()?.inverse())
    
    return { x: svgP.x, y: svgP.y }
  }, [])

  // Handle mouse down - only start panning on empty areas
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('Mouse down - target:', (e.target as SVGElement).tagName)
    
    // Only start panning if clicking on the SVG background (not on role cards)
    if ((e.target as SVGElement).tagName === 'svg' || 
        (e.target as SVGElement).tagName === 'rect' && 
        (e.target as SVGElement).getAttribute('fill') === '#FAFAFA') {
      
      e.preventDefault()
      isPanningRef.current = true
      setIsPanning(true)
      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
      setLastMousePos({ x: e.clientX, y: e.clientY })
      
      console.log('Starting panning at:', { x: e.clientX, y: e.clientY })
    }
  }


  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanningRef.current) {
      console.log('Mouse move during panning')
      const dx = e.clientX - lastMousePosRef.current.x
      const dy = e.clientY - lastMousePosRef.current.y
      
      setViewState(prev => ({
        ...prev,
        pan: {
          x: prev.pan.x - dx / prev.zoom,
          y: prev.pan.y - dy / prev.zoom
        }
      }))
      
      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false
    setIsPanning(false)
    console.log('Mouse up - stopping panning')
  }, [])

  // Add event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // Scroll to top when role or user is selected
  useEffect(() => {
    if (rightPanelRef.current) {
      // Force scroll to top with a slight delay to ensure DOM updates
      setTimeout(() => {
        if (rightPanelRef.current) {
          rightPanelRef.current.scrollTop = 0
        }
      }, 50)
    }
  }, [selectedRole, selectedUser])

  // Handle wheel for zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!containerRef.current) return
    
    // Always prevent default to stop browser zoom
    e.preventDefault()
    e.stopPropagation()
    
    // Only zoom if Ctrl/Cmd is pressed (pinch gesture)
    if (!e.ctrlKey && !e.metaKey) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Get mouse position in SVG space before zoom
    const viewBox = calculateViewBox().split(' ').map(Number)
    const mouseXRatio = mouseX / rect.width
    const mouseYRatio = mouseY / rect.height
    const svgX = viewBox[0] + mouseXRatio * viewBox[2]
    const svgY = viewBox[1] + mouseYRatio * viewBox[3]
    
    // Calculate new zoom
    const zoomSpeed = 0.01
    const scaleFactor = 1 - e.deltaY * zoomSpeed
    const newZoom = Math.max(0.1, Math.min(3, viewState.zoom * scaleFactor))
    
    // Calculate new viewBox dimensions
    const newWidth = 1000 / newZoom
    const newHeight = 1000 / newZoom
    
    // Calculate new pan to keep mouse position fixed
    const newPanX = svgX - mouseXRatio * newWidth
    const newPanY = svgY - mouseYRatio * newHeight
    
    setViewState(prev => ({
      ...prev,
      zoom: newZoom,
      pan: { x: newPanX, y: newPanY }
    }))
    
    // Show zoom indicator
    setShowZoomIndicator(true)
    if (zoomIndicatorTimeout.current) {
      clearTimeout(zoomIndicatorTimeout.current)
    }
    zoomIndicatorTimeout.current = setTimeout(() => {
      setShowZoomIndicator(false)
    }, 1000)
  }, [viewState.zoom, calculateViewBox])

  // Prevent browser zoom on the canvas
  useEffect(() => {
    const canvas = containerRef.current
    if (!canvas) return
    
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
      }
    }
    
    canvas.addEventListener('wheel', preventZoom, { passive: false })
    
    return () => {
      canvas.removeEventListener('wheel', preventZoom)
    }
  }, [])

  // Reset view
  const handleResetView = () => {
    setViewState({
      zoom: 1.2,
      pan: { x: -250, y: -20 },
      showGrid: viewState.showGrid,
      viewMode: viewState.viewMode
    })
  }

  // Zoom in
  const handleZoomIn = () => {
    const newZoom = Math.min(3, viewState.zoom * 1.2)
    setViewState(prev => ({
      ...prev,
      zoom: newZoom
    }))
    setShowZoomIndicator(true)
    if (zoomIndicatorTimeout.current) {
      clearTimeout(zoomIndicatorTimeout.current)
    }
    zoomIndicatorTimeout.current = setTimeout(() => {
      setShowZoomIndicator(false)
    }, 1000)
  }

  // Zoom out
  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, viewState.zoom * 0.8)
    setViewState(prev => ({
      ...prev,
      zoom: newZoom
    }))
    setShowZoomIndicator(true)
    if (zoomIndicatorTimeout.current) {
      clearTimeout(zoomIndicatorTimeout.current)
    }
    zoomIndicatorTimeout.current = setTimeout(() => {
      setShowZoomIndicator(false)
    }, 1000)
  }

  // Render connection lines
  const renderConnections = () => {
    const cardWidth = 200
    const cardHeight = 90
    
    return roles.map(role => {
      if (!role.parentRole || !role.position) return null
      const parent = roles.find(r => r.id === role.parentRole)
      if (!parent || !parent.position) return null
      
      // Calculate connection points (center bottom of parent to center top of child)
      const x1 = parent.position.x + cardWidth / 2
      const y1 = parent.position.y + cardHeight
      const x2 = role.position.x + cardWidth / 2
      const y2 = role.position.y
      
      // Create a curved path for better visual flow
      const midY = (y1 + y2) / 2
      const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`
      
      return (
        <path
          key={`connection-${role.id}`}
          d={path}
          fill="none"
          stroke="#6366F1"
          strokeWidth="2.5"
          strokeDasharray="8,4"
          opacity="0.8"
          className=""
        />
      )
    })
  }

  // Render detailed grid background with comprehensive coverage
  const renderGrid = () => {
    if (!viewState.showGrid) return null
    
    const gridSize = 10 // Very detailed squares for 50x50 mapping
    const viewBox = calculateViewBox().split(' ').map(Number)
    
    // Extend grid coverage well beyond the visible area
    const padding = 1000 // Extra padding to ensure full coverage
    const startX = Math.floor((viewBox[0] - padding) / gridSize) * gridSize
    const startY = Math.floor((viewBox[1] - padding) / gridSize) * gridSize
    const endX = Math.ceil((viewBox[0] + viewBox[2] + padding) / gridSize) * gridSize
    const endY = Math.ceil((viewBox[1] + viewBox[3] + padding) / gridSize) * gridSize
    
    const lines = []
    
    // Add comprehensive background rectangle
    lines.push(
      <rect
        key="grid-background"
        x={startX}
        y={startY}
        width={endX - startX}
        height={endY - startY}
        fill="#FAFAFA"
        stroke="none"
      />
    )
    
    // Major grid lines (every 50px) - main sections for 50x50 mapping
    const majorGridSize = 50
    for (let x = Math.floor(startX / majorGridSize) * majorGridSize; x <= endX; x += majorGridSize) {
      lines.push(
        <line
          key={`grid-major-v-${x}`}
          x1={x}
          y1={startY}
          x2={x}
          y2={endY}
          stroke="#D1D5DB"
          strokeWidth="1"
          opacity="0.7"
        />
      )
    }
    
    for (let y = Math.floor(startY / majorGridSize) * majorGridSize; y <= endY; y += majorGridSize) {
      lines.push(
        <line
          key={`grid-major-h-${y}`}
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke="#D1D5DB"
          strokeWidth="1"
          opacity="0.7"
        />
      )
    }
    
    // Minor grid lines (every 10px) - detailed squares
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push(
        <line
          key={`grid-minor-v-${x}`}
          x1={x}
          y1={startY}
          x2={x}
          y2={endY}
          stroke="#F3F4F6"
          strokeWidth="0.5"
          opacity="0.4"
        />
      )
    }
    
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push(
        <line
          key={`grid-minor-h-${y}`}
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke="#F3F4F6"
          strokeWidth="0.5"
          opacity="0.4"
        />
      )
    }
    
    return <g>{lines}</g>
  }

  // Switch to users list view
  const zoomToRole = useCallback((roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (!role?.position) return
    
    const roleUsers = users.filter(u => u.roleId === roleId)
    if (roleUsers.length === 0) return
    
    // Start transition
    // setIsTransitioning(true)
    
    // Clear any existing transition timeout
    // if (transitionTimeout.current) {
    //   clearTimeout(transitionTimeout.current)
    // }
    
    // Switch to users list view
    setViewState(prev => ({
      ...prev,
      viewMode: 'users',
      focusedRoleId: roleId
    }))
    
    // End transition after animation completes
    // transitionTimeout.current = setTimeout(() => {
    //   // setIsTransitioning(false)
    // }, 300) // Shorter since we're just switching views
    
    setSelectedRole(null)
    setSelectedUser(null)
  }, [roles, users])

  // Go back to roles view with smooth transition
  const goBackToRoles = useCallback(() => {
    // setIsTransitioning(true)
    
    // Clear any existing transition timeout
    // if (transitionTimeout.current) {
    //   clearTimeout(transitionTimeout.current)
    // }
    
    setViewState(prev => ({
      ...prev,
      zoom: 1.2,
      pan: { x: -250, y: -20 },
      viewMode: 'roles',
      focusedRoleId: undefined
    }))
    
    // End transition after animation completes
    // transitionTimeout.current = setTimeout(() => {
    //   // setIsTransitioning(false)
    // }, 600)
    
    setSelectedUser(null)
    setSelectedRole(null)
  }, [])

  // Handle role click
  const handleRoleClick = useCallback((roleId: string) => {
    console.log('Role clicked:', roleId)
    // Set the selected role
    setSelectedRole(roleId)
    setSelectedUser(null) // Clear any selected user
    setIncludeSubordinates(false) // Default to "Users with this role"
  }, [])


  // Render role node
  const renderRoleNode = (role: Role) => {
    if (!role.position) return null
    
    // Helper function to get all subordinate role IDs
    const getSubordinateRoleIds = (roleId: string): string[] => {
      const childRoles = roles.filter(r => r.parentRole === roleId)
      const result = childRoles.map(r => r.id)
      // Recursively get subordinates of subordinates
      childRoles.forEach(childRole => {
        result.push(...getSubordinateRoleIds(childRole.id))
      })
      return result
    }
    
    // Check if this role should be highlighted
    const isDirectlySelected = selectedRole === role.id && !includeSubordinates
    const isSubordinateSelected = selectedRole && includeSubordinates && 
      getSubordinateRoleIds(selectedRole).includes(role.id)
    const isSelected = isDirectlySelected || isSubordinateSelected
    const isDragging = false
    
    // Calculate subordinate progress
    const getAllSubordinates = (roleId: string): User[] => {
      const directUsers = users.filter(u => u.roleId === roleId)
      const childRoles = roles.filter(r => r.parentRole === roleId)
      const indirectUsers = childRoles.flatMap(childRole => getAllSubordinates(childRole.id))
      return [...directUsers, ...indirectUsers]
    }
    
    const allSubordinates = getAllSubordinates(role.id)
    const avgSubordinateProgress = allSubordinates.length > 0
      ? Math.round(allSubordinates.reduce((sum, u) => sum + (u.completionRate || 0), 0) / allSubordinates.length)
      : 0
    
    // Card dimensions - made larger for better layout
    const cardWidth = 200
    const cardHeight = allSubordinates.length > 0 ? 110 : 85
    
    return (
      <g
        key={role.id}
        transform={`translate(${role.position.x}, ${role.position.y})`}
        className={`${isDragging ? 'opacity-50' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        {/* Shadow */}
        <rect
          x="1"
          y="1"
          width={cardWidth}
          height={cardHeight}
          rx="6"
          fill="rgba(0,0,0,0.08)"
        />
        
        {/* Card background */}
        <rect
          x="0"
          y="0"
          width={cardWidth}
          height={cardHeight}
          rx="6"
          fill={isSubordinateSelected ? `${role.color}08` : "white"}
          stroke={isDirectlySelected ? role.color : isSubordinateSelected ? role.color : '#E5E7EB'}
          strokeWidth={isDirectlySelected ? "2" : isSubordinateSelected ? "1.5" : "1"}
          strokeDasharray={isSubordinateSelected ? "4,2" : "none"}
        />
        
        {/* Color accent bar */}
        <rect
          x="0"
          y="0"
          width={cardWidth}
          height="4"
          rx="6"
          fill={role.color}
        />
        <rect
          x="0"
          y="2"
          width={cardWidth}
          height="2"
          fill={role.color}
        />
        
        {/* Content area */}
        <g transform="translate(12, 16)">
          {/* Role icon */}
          <circle
            cx="14"
            cy="14"
            r="14"
            fill={role.color}
            opacity="0.15"
          />
          <text
            x="14"
            y="18"
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill={role.color}
          >
            {role.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </text>
          
          {/* Role name */}
          <text
            x="36"
            y="14"
            fontSize="14"
            fontWeight="600"
            fill="#1D1D1F"
          >
            {role.name.length > 16 ? role.name.slice(0, 14) + '...' : role.name}
          </text>
          
          {/* User count */}
          <text
            x="36"
            y="30"
            fontSize="12"
            fill="#6B7280"
          >
            {role.usersCount} {role.usersCount === 1 ? 'user' : 'users'}
          </text>
        </g>
        
        
        {/* Subordinate Progress Section */}
        {allSubordinates.length > 0 && (
          <g transform={`translate(12, ${cardHeight - 45})`}>
            {/* Progress label */}
            <text
              x="0"
              y="0"
              fontSize="10"
              fill="#6B7280"
              fontWeight="500"
            >
              Team Progress
            </text>
            
            {/* Info icon */}
            <g 
              transform={`translate(${cardWidth - 40}, -6)`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.stopPropagation()
                // Show tooltip
                const tooltip = document.getElementById(`tooltip-${role.id}`)
                if (tooltip) tooltip.style.display = 'block'
              }}
              onMouseLeave={(e) => {
                e.stopPropagation()
                // Hide tooltip
                const tooltip = document.getElementById(`tooltip-${role.id}`)
                if (tooltip) tooltip.style.display = 'none'
              }}
            >
              <circle cx="5" cy="5" r="7" fill="#E5E7EB" />
              <text
                x="5"
                y="8"
                textAnchor="middle"
                fontSize="9"
                fill="#6B7280"
                fontWeight="bold"
              >
                i
              </text>
            </g>
            
            {/* Progress bar and percentage row */}
            <g transform="translate(0, 35)">
              {/* Percentage text positioned well above progress bar */}
              <text
                x="0"
                y="-20"
                fontSize="12"
                fill="#374151"
                fontWeight="600"
                textAnchor="start"
              >
                {avgSubordinateProgress}%
              </text>
              
              {/* Progress bar background */}
              <rect
                x="0"
                y="0"
                width={cardWidth - 48}
                height="12"
                rx="6"
                fill="#E5E7EB"
              />
              
              {/* Progress bar fill */}
              <rect
                x="0"
                y="0"
                width={(cardWidth - 48) * (avgSubordinateProgress / 100)}
                height="12"
                rx="6"
                fill={
                  avgSubordinateProgress >= 80 ? '#10B981' :
                  avgSubordinateProgress >= 60 ? '#F59E0B' :
                  '#EF4444'
                }
              />
            </g>
          </g>
        )}
        
        
        
        {/* Edit mode indicator */}
        {false && (
          <g transform={`translate(${cardWidth - 40}, ${cardHeight - 22})`}>
            <rect
              x="0"
              y="0"
              width="30"
              height="16"
              rx="8"
              fill={role.color}
              opacity="0.15"
            />
            <text
              x="15"
              y="11"
              textAnchor="middle"
              fontSize="9"
              fill={role.color}
              fontWeight="500"
            >
              DRAG
            </text>
          </g>
        )}
        
        {/* Invisible overlay to capture all clicks */}
        <rect
          x="0"
          y="0"
          width={cardWidth}
          height={cardHeight}
          fill="transparent"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            handleRoleClick(role.id)
          }}
        />
      </g>
    )
  }

  // Render user node (detailed view)
  const renderUserNode = (user: User) => {
    if (!user.position) return null
    
    const isSelected = selectedUser === user.id
    const role = roles.find(r => r.id === user.roleId)
    
    // Larger card dimensions for user details
    const cardWidth = 220
    const cardHeight = 140
    
    return (
      <g
        key={user.id}
        transform={`translate(${user.position.x}, ${user.position.y})`}
        style={{ cursor: 'pointer' }}
        onClick={() => setSelectedUser(isSelected ? null : user.id)}
      >
        {/* Shadow */}
        <rect
          x="2"
          y="2"
          width={cardWidth}
          height={cardHeight}
          rx="8"
          fill="rgba(0,0,0,0.1)"
        />
        
        {/* Card background */}
        <rect
          x="0"
          y="0"
          width={cardWidth}
          height={cardHeight}
          rx="8"
          fill="white"
          stroke={isSelected ? role?.color || '#7B00FF' : '#E5E7EB'}
          strokeWidth={isSelected ? "2" : "1"}
        />
        
        {/* Header with role color */}
        <rect
          x="0"
          y="0"
          width={cardWidth}
          height="6"
          rx="8"
          fill={role?.color || '#7B00FF'}
        />
        <rect
          x="0"
          y="3"
          width={cardWidth}
          height="3"
          fill={role?.color || '#7B00FF'}
        />
        
        {/* User info */}
        <g transform="translate(12, 20)">
          {/* Avatar */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill={role?.color || '#7B00FF'}
            opacity="0.15"
          />
          <text
            x="20"
            y="26"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill={role?.color || '#7B00FF'}
          >
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </text>
          
          {/* Name */}
          <text
            x="45"
            y="18"
            fontSize="14"
            fontWeight="600"
            fill="#1D1D1F"
          >
            {user.name.length > 20 ? user.name.slice(0, 18) + '...' : user.name}
          </text>
          
          {/* Role */}
          <text
            x="45"
            y="32"
            fontSize="11"
            fill="#6B7280"
          >
            {role?.name || 'Unknown Role'}
          </text>
        </g>
        
        {/* Contact info */}
        <g transform="translate(12, 65)">
          {/* Email */}
          <g>
            <circle cx="6" cy="6" r="3" fill="#10B981" opacity="0.2" />
            <text x="6" y="9" textAnchor="middle" fontSize="8" fill="#10B981">@</text>
            <text
              x="15"
              y="9"
              fontSize="10"
              fill="#4B5563"
            >
              {user.email.length > 25 ? user.email.slice(0, 23) + '...' : user.email}
            </text>
          </g>
          
          {/* Phone */}
          <g transform="translate(0, 16)">
            <circle cx="6" cy="6" r="3" fill="#3B82F6" opacity="0.2" />
            <text x="6" y="9" textAnchor="middle" fontSize="8" fill="#3B82F6">📞</text>
            <text
              x="15"
              y="9"
              fontSize="10"
              fill="#4B5563"
            >
              {user.phone}
            </text>
          </g>
        </g>
        
        {/* Action buttons */}
        <g transform={`translate(${cardWidth - 100}, ${cardHeight - 35})`}>
          {/* Slack button */}
          <g>
            <rect
              x="0"
              y="0"
              width="22"
              height="22"
              rx="4"
              fill="#4A154B"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                // Send Slack message
              }}
            />
            <text
              x="11"
              y="15"
              textAnchor="middle"
              fontSize="10"
              fill="white"
              fontWeight="bold"
            >
              S
            </text>
          </g>
          
          {/* Edit button */}
          <g transform="translate(30, 0)">
            <rect
              x="0"
              y="0"
              width="22"
              height="22"
              rx="4"
              fill="#7B00FF"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                // Edit user action
              }}
            />
            <text
              x="11"
              y="15"
              textAnchor="middle"
              fontSize="10"
              fill="white"
              fontWeight="bold"
            >
              ✏
            </text>
          </g>
        </g>
        
        {/* Status indicator */}
        {user.status && (
          <g transform={`translate(${cardWidth - 24}, 8)`}>
            <circle
              cx="10"
              cy="10"
              r="10"
              fill={
                user.status === 'on_track' ? '#10B981' :
                user.status === 'at_risk' ? '#F59E0B' :
                '#EF4444'
              }
            />
            <text
              x="10"
              y="14"
              textAnchor="middle"
              fontSize="9"
              fill="white"
              fontWeight="bold"
            >
              {user.completionRate}%
            </text>
          </g>
        )}
      </g>
    )
  }

  // Build employee hierarchy
  const buildEmployeeHierarchy = () => {
    // Create a simple hierarchy for demo
    // Super Admins at top
    const superAdmins = users.filter(u => u.roleId === '1')
    
    // For demo, create a mapping of who reports to whom
    const reportingStructure: Record<string, string[]> = {
      'u1': ['u3', 'u4'], // Sarah Johnson (Super Admin) manages Emily and David (Admins)
      'u2': ['u5', 'u6'], // Michael Chen (Super Admin) manages Lisa and Robert (Admins)
      'u3': ['u8', 'u9'], // Emily (Admin) manages Jennifer and William (Managers)
      'u4': ['u10', 'u11'], // David (Admin) manages Jessica and Christopher (Managers)
      'u5': ['u12'], // Lisa (Admin) manages Amanda (Manager)
      'u8': ['u13', 'u14'], // Jennifer (Manager) manages Daniel and Michelle (Instructors)
      'u9': ['u15', 'u16'], // William (Manager) manages Brian and Stephanie (Instructors)
      'u13': ['u19', 'u20', 'u21'], // Daniel (Instructor) manages some Employees
      'u14': ['u22', 'u23'], // Michelle (Instructor) manages some Employees
    }
    
    const getDirectReports = (managerId: string): User[] => {
      const reportIds = reportingStructure[managerId] || []
      return users.filter(u => reportIds.includes(u.id))
    }
    
    return { topLevelEmployees: superAdmins, getDirectReports }
  }
  
  // Calculate positions for employee tree
  const calculateEmployeePositions = () => {
    const positions: Record<string, { x: number; y: number }> = {}
    const { topLevelEmployees, getDirectReports } = buildEmployeeHierarchy()
    
    const levelHeight = 120
    const nodeWidth = 200
    const nodeHeight = 100
    const minHorizontalSpacing = 20
    
    // Track occupied spaces to prevent overlap
    const levelOccupancy: Record<number, Array<{start: number, end: number}>> = {}
    
    // Helper to check if space is available
    const isSpaceAvailable = (x: number, y: number, width: number): boolean => {
      const level = Math.round(y / levelHeight)
      if (!levelOccupancy[level]) return true
      
      return !levelOccupancy[level].some(space => 
        (x < space.end && x + width > space.start)
      )
    }
    
    // Helper to mark space as occupied
    const markSpaceOccupied = (x: number, y: number, width: number) => {
      const level = Math.round(y / levelHeight)
      if (!levelOccupancy[level]) levelOccupancy[level] = []
      levelOccupancy[level].push({ start: x, end: x + width })
    }
    
    // Calculate the width needed for a subtree
    const calculateSubtreeWidth = (employee: User): number => {
      const directReports = getDirectReports(employee.id)
      if (directReports.length === 0) return nodeWidth
      
      let totalWidth = 0
      directReports.forEach((report, index) => {
        if (index > 0) totalWidth += minHorizontalSpacing
        totalWidth += calculateSubtreeWidth(report)
      })
      
      return Math.max(totalWidth, nodeWidth)
    }
    
    // Recursive function to position employees
    const positionEmployee = (employee: User, x: number, y: number): void => {
      // Find available position if current is occupied
      let finalX = x
      while (!isSpaceAvailable(finalX, y, nodeWidth)) {
        finalX += nodeWidth + minHorizontalSpacing
      }
      
      positions[employee.id] = { x: finalX, y }
      markSpaceOccupied(finalX, y, nodeWidth)
      
      const directReports = getDirectReports(employee.id)
      if (directReports.length === 0) return
      
      // Calculate total width needed for children
      const childrenWidth = directReports.reduce((sum, report, index) => {
        return sum + calculateSubtreeWidth(report) + (index > 0 ? minHorizontalSpacing : 0)
      }, 0)
      
      // Start position for first child (center children under parent)
      let childX = finalX + (nodeWidth - childrenWidth) / 2
      
      // Position each child
      directReports.forEach((report, index) => {
        const reportWidth = calculateSubtreeWidth(report)
        const reportX = childX + reportWidth / 2 - nodeWidth / 2
        positionEmployee(report, reportX, y + levelHeight)
        childX += reportWidth + minHorizontalSpacing
      })
    }
    
    // Position all top-level employees
    const totalTopLevelWidth = topLevelEmployees.reduce((sum, emp, index) => {
      return sum + calculateSubtreeWidth(emp) + (index > 0 ? minHorizontalSpacing * 2 : 0)
    }, 0)
    
    let startX = 400 - totalTopLevelWidth / 2 // Center the tree
    
    topLevelEmployees.forEach((employee, index) => {
      const treeWidth = calculateSubtreeWidth(employee)
      positionEmployee(employee, startX + treeWidth / 2 - nodeWidth / 2, 50)
      startX += treeWidth + minHorizontalSpacing * 2
    })
    
    return positions
  }
  
  // Render employee connections
  const renderEmployeeConnections = () => {
    const { getDirectReports } = buildEmployeeHierarchy()
    const positions = calculateEmployeePositions()
    const cardWidth = 200
    const cardHeight = 90
    
    return users.flatMap(manager => {
      const directReports = getDirectReports(manager.id)
      if (directReports.length === 0) return []
      
      const managerPos = positions[manager.id]
      if (!managerPos) return []
      
      return directReports.map(report => {
        const reportPos = positions[report.id]
        if (!reportPos) return null
        
        // Calculate connection points
        const startX = managerPos.x + cardWidth / 2
        const startY = managerPos.y + cardHeight
        const endX = reportPos.x + cardWidth / 2
        const endY = reportPos.y
        
        // Create curved path with shorter curves for compact design
        const midY = startY + (endY - startY) * 0.4
        const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`
        
        return (
          <path
            key={`${manager.id}-${report.id}`}
            d={path}
            stroke="#6366F1"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="8,4"
            opacity="0.8"
          />
        )
      }).filter(Boolean)
    })
  }
  
  // Render employee node
  const renderEmployeeNode = (employee: User) => {
    const positions = calculateEmployeePositions()
    const position = positions[employee.id]
    if (!position) return null
    
    const role = roles.find(r => r.id === employee.roleId)
    const cardWidth = 200
    const cardHeight = 90
    
    return (
      <g
        key={employee.id}
        transform={`translate(${position.x}, ${position.y})`}
      >
        {/* Card shadow */}
        <rect
          x="2"
          y="2"
          width={cardWidth}
          height={cardHeight}
          rx="6"
          fill="#00000010"
        />
        
        {/* Card background */}
        <rect
          x="0"
          y="0"
          width={cardWidth}
          height={cardHeight}
          rx="6"
          fill="white"
          stroke={selectedUser === employee.id ? '#7B00FF' : '#E5E7EB'}
          strokeWidth={selectedUser === employee.id ? '2' : '1'}
        />
        
        {/* Employee info */}
        <g transform="translate(10, 10)">
          {/* Avatar */}
          <circle
            cx="15"
            cy="20"
            r="15"
            fill={role?.color || '#7B00FF'}
            opacity="0.15"
          />
          <text
            x="15"
            y="25"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill={role?.color || '#7B00FF'}
          >
            {employee.name.split(' ').map(n => n[0]).join('')}
          </text>
          
          {/* Name and role */}
          <text
            x="38"
            y="16"
            fontSize="13"
            fontWeight="600"
            fill="#1D1D1F"
          >
            {employee.name.length > 18 ? employee.name.slice(0, 16) + '...' : employee.name}
          </text>
          <text
            x="38"
            y="30"
            fontSize="11"
            fill="#6B7280"
          >
            {role?.name || 'Unknown Role'}
          </text>
        </g>
        
        {/* Compact progress indicator */}
        <g transform={`translate(10, ${cardHeight - 22})`}>
          <rect
            x="0"
            y="0"
            width={cardWidth - 20}
            height="3"
            rx="1.5"
            fill="#E5E7EB"
          />
          <rect
            x="0"
            y="0"
            width={(cardWidth - 20) * ((employee.completionRate || 0) / 100)}
            height="3"
            rx="1.5"
            fill={
              (employee.completionRate || 0) >= 80 ? '#10B981' :
              (employee.completionRate || 0) >= 60 ? '#F59E0B' :
              '#EF4444'
            }
          />
          <text
            x={cardWidth - 20}
            y="2"
            fontSize="10"
            fill="#6B7280"
            textAnchor="end"
            alignmentBaseline="middle"
          >
            {employee.completionRate || 0}%
          </text>
        </g>
        
        {/* Status indicator dot */}
        <circle
          cx={cardWidth - 10}
          cy="10"
          r="4"
          fill={
            employee.status === 'ahead' || employee.status === 'on_track' ? '#10B981' :
            employee.status === 'at_risk' ? '#F59E0B' :
            '#EF4444'
          }
        />
        
        {/* Click overlay */}
        <rect
          x="0"
          y="0"
          width={cardWidth}
          height={cardHeight}
          fill="transparent"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedUser(employee.id)
            setSelectedRole(null)
          }}
        />
      </g>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="h-screen flex flex-col">
        {/* Header with Tabs */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 bg-white">
          <UserManagementHeader noMargin />
        </div>

        {/* Main Canvas and Details */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Canvas */}
            <div 
              ref={containerRef} 
              className="flex-1 relative bg-secondary"
              onWheel={handleWheel}
            >
              {/* View Toggle */}
              <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewState(prev => ({ ...prev, viewMode: 'roles' }))}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    viewState.viewMode === 'roles'
                      ? 'bg-brand text-white'
                      : 'text-secondary hover:text-primary hover:bg-emphasis'
                  }`}
                >
                  <Users className="w-4 h-4 inline-block mr-2" />
                  Roles
                </button>
                <button
                  onClick={() => setViewState(prev => ({ ...prev, viewMode: 'employees' }))}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    viewState.viewMode === 'employees'
                      ? 'bg-brand text-white'
                      : 'text-secondary hover:text-primary hover:bg-emphasis'
                  }`}
                >
                  <UserIcon className="w-4 h-4 inline-block mr-2" />
                  Employees
                </button>
              </div>
            </div>
            
            <svg
              ref={canvasRef}
              className="w-full h-full"
              viewBox={calculateViewBox()}
              onMouseDown={handleMouseDown}
              style={{ 
                cursor: isPanning ? 'grabbing' : 'grab',
                transition: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              {/* Grid */}
              {renderGrid()}
              
              {/* Connections (only show in roles view) */}
              {viewState.viewMode === 'roles' && (
                <g>
                  {renderConnections()}
                </g>
              )}
              
              {/* Roles (only show in roles view) */}
              {viewState.viewMode === 'roles' && (
                <g>
                  {roles.map(renderRoleNode)}
                  
                  {/* Tooltips for all roles */}
                  {roles.map(role => {
                    // Calculate if this role has subordinates
                    const getAllSubordinatesForTooltip = (roleId: string): User[] => {
                      const directUsers = users.filter(u => u.roleId === roleId)
                      const childRoles = roles.filter(r => r.parentRole === roleId)
                      const indirectUsers = childRoles.flatMap(childRole => getAllSubordinatesForTooltip(childRole.id))
                      return [...directUsers, ...indirectUsers]
                    }
                    const hasSubordinates = getAllSubordinatesForTooltip(role.id).length > 0
                    
                    if (!hasSubordinates) return null
                    
                    return (
                      <foreignObject
                        key={`tooltip-${role.id}`}
                        id={`tooltip-${role.id}`}
                        x={(role.position?.x || 0) + 185}
                        y={(role.position?.y || 0) + 45}
                        width="180"
                        height="65"
                        style={{ display: 'none', pointerEvents: 'none', overflow: 'visible' }}
                      >
                        <div className="bg-text-primary text-white text-xs rounded-lg px-3 py-2 shadow-lg w-full">
                          <p className="font-semibold text-white">Team Progress</p>
                          <p className="text-[11px] text-inverse opacity-80 mt-1">
                            Average completion of all subordinates
                          </p>
                        </div>
                      </foreignObject>
                    )
                  })}
                </g>
              )}
              
              {/* Employee connections (only show in employees view) */}
              {viewState.viewMode === 'employees' && (
                <g>
                  {renderEmployeeConnections()}
                </g>
              )}
              
              {/* Employees (only show in employees view) */}
              {viewState.viewMode === 'employees' && (
                <g>
                  {users.length > 0 ? users.map(renderEmployeeNode) : (
                    <text x="400" y="200" textAnchor="middle" fontSize="16" fill="#6B7280">
                      No employees found
                    </text>
                  )}
                </g>
              )}
            </svg>
            
            {/* Users List View */}
            {viewState.viewMode === 'users' && (
              <div className="absolute inset-0 bg-white p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-primary mb-spacing-xs">
                      {roles.find(r => r.id === viewState.focusedRoleId)?.name || 'Unknown'} Team Members
                    </h2>
                    <p className="text-secondary">
                      {users.filter(u => u.roleId === viewState.focusedRoleId).length} team members
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {users
                      .filter(user => user.roleId === viewState.focusedRoleId)
                      .map(user => {
                        const role = roles.find(r => r.id === user.roleId)
                        const isSelected = selectedUser === user.id
                        
                        return (
                          <div
                            key={user.id}
                            className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                              isSelected 
                                ? 'border-brand shadow-md ring-2 ring-brand'
                                : 'border-subtle hover:border-default'
                            }`}
                            onClick={() => setSelectedUser(isSelected ? null : user.id)}
                          >
                            <div className="flex items-center justify-between">
                              {/* User Info */}
                              <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div
                                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium"
                                  style={{ backgroundColor: role?.color || '#7B00FF' }}
                                >
                                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                
                                {/* Name and Details */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-primary">{user.name}</h3>
                                    <div
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.status === 'on_track' 
                                          ? 'bg-green-100 text-green-800'
                                          : user.status === 'at_risk'
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-errorLight text-error'
                                      }`}
                                    >
                                      {user.completionRate}% Complete
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-6 text-sm text-secondary">
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-4 h-4" />
                                      <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-4 h-4" />
                                      <span>{user.phone}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Send Slack message
                                  }}
                                  className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Slack
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Edit user action
                                  }}
                                >
                                  <Edit2 className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                            
                            {/* Expanded Details */}
                            {isSelected && (
                              <div className="mt-4 pt-4 border-t border-subtle">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-secondary">Role:</span>
                                    <span className="ml-2">{role?.name || 'Unknown'}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-secondary">Status:</span>
                                    <span className="ml-2 capitalize">{user.status?.replace('_', ' ') || 'Unknown'}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-secondary">Training Progress:</span>
                                    <div className="mt-1">
                                      <Progress value={user.overallProgress || 0} className="h-2" />
                                    </div>
                                    <span className="text-xs text-secondary mt-1">
                                        {user.completionRate}% of required training completed
                                      </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            )}
            
            {/* Instructions */}
            {false && (
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
                <h4 className="font-medium text-vergil-off-black mb-2">Editing Mode</h4>
                <ul className="space-y-1 text-sm text-vergil-off-black/70">
                  <li>• Drag roles to reposition them</li>
                  <li>• Click and drag on empty space to pan</li>
                  <li>• Pinch to zoom in/out</li>
                  <li>• Grid snapping is {viewState.showGrid ? 'enabled' : 'disabled'}</li>
                </ul>
              </div>
            )}
            
            {/* Pan hint */}
            {true && (
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm px-3 py-2 text-sm text-vergil-off-black/60">
                Click and drag to pan • Pinch to zoom
              </div>
            )}
            
            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleZoomIn}
                className="bg-white shadow-sm hover:bg-vergil-off-white w-10 h-10 p-0"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleZoomOut}
                className="bg-white shadow-sm hover:bg-vergil-off-white w-10 h-10 p-0"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Zoom indicator */}
            {showZoomIndicator && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white rounded-lg px-3 py-1 text-sm font-medium">
                {Math.round(viewState.zoom * 100)}%
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div 
            ref={rightPanelRef}
            className="w-[480px] bg-vergil-off-white/30 border-l border-vergil-off-black/10 p-8 overflow-y-auto"
          >
            {/* Back button at the top */}
            {(selectedUser || selectedRole) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedUser(null)
                  setSelectedRole(null)
                }}
                className="mb-4 text-vergil-off-black/60 hover:text-vergil-off-black -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            {(selectedUser || selectedRole || viewState.viewMode === 'users' || viewState.viewMode === 'employees') && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-vergil-off-black mb-4">
                  {selectedUser ? 'User Profile' : 
                   selectedRole ? 'Team Details' : 
                   'User Profile'}
                </h3>
                {viewState.viewMode === 'users' && !selectedUser && !selectedRole && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goBackToRoles}
                    className="text-vergil-off-black/60 hover:text-vergil-off-black"
                  >
                    ← Back to Roles
                  </Button>
                )}
              </div>
            )}
            
            {(viewState.viewMode === 'users' && selectedUser) || (viewState.viewMode === 'roles' && selectedUser) || (viewState.viewMode === 'employees' && selectedUser) ? (
              // User Details with Personal Statistics
              <div className="space-y-6">
                {(() => {
                  const user = users.find(u => u.id === selectedUser)
                  const role = user ? roles.find(r => r.id === user.roleId) : null
                  if (!user) return null
                  
                  // Mock additional user statistics
                  const coursesInProgress = 3
                  const coursesCompleted = 7
                  const totalCourses = 10
                  const averageScore = 87
                  const hoursSpent = 45.5
                  const lastActive = "2 hours ago"
                  const streak = 12
                  
                  return (
                    <>
                      {/* User Header */}
                      <div className="border-b border-vergil-off-black/10 pb-6">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-vergil-off-white font-semibold text-xl shadow-lg"
                            style={{ backgroundColor: role?.color || '#7B00FF' }}
                          >
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-vergil-off-black">{user.name}</h4>
                            <p className="text-sm font-medium text-vergil-off-black/70">{role?.name || 'Unknown Role'}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge 
                                variant="default" 
                                className={`text-xs ${
                                  user.status === 'ahead' ? 'bg-cyan-100 text-cyan-800 border-cyan-300' :
                                  user.status === 'on_track' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  user.status === 'at_risk' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                                  'bg-red-100 text-red-700 border-red-200'
                                }`}
                              >
                                {user.status === 'ahead' ? 'Ahead of Schedule' :
                                 user.status === 'on_track' ? 'On Track' :
                                 user.status === 'at_risk' ? 'At Risk' : 'Behind Schedule'}
                              </Badge>
                              <span className="text-xs text-vergil-off-black/50">Last logged in: {lastActive}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="bg-vergil-off-white/50 rounded-lg p-4">
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-3">Contact Information</h5>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-vergil-purple/10 flex items-center justify-center">
                              <Mail className="w-4 h-4 text-vergil-purple" />
                            </div>
                            <span className="text-sm text-vergil-off-black">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-vergil-purple/10 flex items-center justify-center">
                              <Phone className="w-4 h-4 text-vergil-purple" />
                            </div>
                            <span className="text-sm text-vergil-off-black">{user.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Overview */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-4">Progress Overview</h5>
                        
                        {/* Overall Progress */}
                        <div className="bg-vergil-off-white/50 rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-vergil-off-black">Overall Progress</span>
                            <span className="text-2xl font-bold" style={{ 
                              color: user.completionRate >= 80 ? '#10B981' : 
                                     user.completionRate >= 60 ? '#F59E0B' : '#EF4444' 
                            }}>
                              {user.completionRate}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                            <div 
                              className="h-2.5 rounded-full transition-all duration-500 shadow-sm"
                              style={{ 
                                width: `${user.completionRate}%`,
                                backgroundColor: user.completionRate >= 80 ? '#10B981' : 
                                                user.completionRate >= 60 ? '#F59E0B' : '#EF4444'
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-vergil-off-black/60 mt-1">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        {/* Course Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-vergil-off-white/50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-vergil-purple">{coursesCompleted}</p>
                            <p className="text-xs text-vergil-off-black/60">Completed</p>
                          </div>
                          <div className="bg-vergil-off-white/50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-blue-600">{coursesInProgress}</p>
                            <p className="text-xs text-vergil-off-black/60">In Progress</p>
                          </div>
                          <div className="bg-vergil-off-white/50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-vergil-off-black/40">{totalCourses - coursesCompleted - coursesInProgress}</p>
                            <p className="text-xs text-vergil-off-black/60">Not Started</p>
                          </div>
                        </div>
                        
                        {/* Additional Stats */}
                        <div className="bg-vergil-off-white/50 rounded-lg p-3">
                          <p className="text-xs text-vergil-off-black/60 mb-1">Average Score</p>
                          <p className="text-lg font-semibold text-vergil-off-black">{averageScore}%</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="border-t border-vergil-off-black/10 pt-6">
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-4">Quick Actions</h5>
                        <div className="flex flex-col">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="w-full justify-start border-vergil-off-black/10 hover:bg-vergil-purple/5 hover:border-vergil-purple/20 transition-colors mb-3"
                            onClick={() => {
                              window.location.href = `slack://user?team=T12345&id=${user.id}`
                            }}
                          >
                            <div className="w-5 h-5 rounded bg-vergil-purple/10 flex items-center justify-center mr-3">
                              <MessageSquare className="w-3 h-3 text-vergil-purple" />
                            </div>
                            <span className="text-vergil-off-black">Send Slack Message</span>
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="w-full justify-start border-vergil-off-black/10 hover:bg-vergil-purple/5 hover:border-vergil-purple/20 transition-colors mb-3"
                            onClick={() => {
                              window.location.href = `mailto:${user.email}?subject=Training%20Progress%20Update`
                            }}
                          >
                            <div className="w-5 h-5 rounded bg-vergil-purple/10 flex items-center justify-center mr-3">
                              <Mail className="w-3 h-3 text-vergil-purple" />
                            </div>
                            <span className="text-vergil-off-black">Send Email</span>
                          </Button>
                          <Link href={`/lms/user-management/${user.id}`} className="block">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="w-full justify-start border-vergil-off-black/10 hover:bg-vergil-purple/5 hover:border-vergil-purple/20 transition-colors"
                            >
                              <div className="w-5 h-5 rounded bg-vergil-purple/10 flex items-center justify-center mr-3">
                                <UserIcon className="w-3 h-3 text-vergil-purple" />
                              </div>
                              <span className="text-vergil-off-black">View Full Profile</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : viewState.viewMode === 'roles' && selectedRole ? (
              // Role Details - Complete redesign
              <div className="space-y-6">
                {(() => {
                  const role = roles.find(r => r.id === selectedRole)
                  if (!role) return null
                  
                  // Get users in this role
                  const roleUsers = users.filter(u => u.roleId === role.id)
                  
                  // Calculate metrics
                  const avgProgress = roleUsers.length > 0 
                    ? Math.round(roleUsers.reduce((sum, u) => sum + (u.completionRate || 0), 0) / roleUsers.length)
                    : 0
                  
                  // Get all subordinates (direct and indirect) with manager info
                  const getSubordinatesWithManager = (roleId: string): Array<User & { managerId?: string; managerName?: string }> => {
                    const directUsers = users.filter(u => u.roleId === roleId)
                    const childRoles = roles.filter(r => r.parentRole === roleId)
                    
                    const result: Array<User & { managerId?: string; managerName?: string }> = []
                    
                    // Add users from child roles with their manager info
                    childRoles.forEach(childRole => {
                      const childUsers = users.filter(u => u.roleId === childRole.id)
                      const managersInParentRole = users.filter(u => u.roleId === roleId)
                      
                      childUsers.forEach(user => {
                        // For simplicity, assign first manager in parent role as their manager
                        const manager = managersInParentRole[0]
                        result.push({
                          ...user,
                          managerId: manager?.id,
                          managerName: manager?.name
                        })
                      })
                      
                      // Recursively get subordinates from deeper levels
                      const deeperSubordinates = getSubordinatesWithManager(childRole.id)
                      result.push(...deeperSubordinates)
                    })
                    
                    return result
                  }
                  
                  const getAllSubordinates = (roleId: string): User[] => {
                    const directUsers = users.filter(u => u.roleId === roleId)
                    const childRoles = roles.filter(r => r.parentRole === roleId)
                    const indirectUsers = childRoles.flatMap(childRole => getAllSubordinates(childRole.id))
                    return [...directUsers, ...indirectUsers]
                  }
                  
                  const allSubordinates = getAllSubordinates(role.id)
                  const subordinatesWithManager = getSubordinatesWithManager(role.id)
                  const totalSubordinates = allSubordinates.length
                  const avgSubordinateProgress = totalSubordinates > 0
                    ? Math.round(allSubordinates.reduce((sum, u) => sum + (u.completionRate || 0), 0) / totalSubordinates)
                    : 0
                  
                  // Calculate subordinates only (excluding current role users)
                  const subordinatesOnly = allSubordinates.filter(u => u.roleId !== role.id)
                  const avgSubordinatesOnlyProgress = subordinatesOnly.length > 0
                    ? Math.round(subordinatesOnly.reduce((sum, u) => sum + (u.completionRate || 0), 0) / subordinatesOnly.length)
                    : 0
                  
                  // Use team view metrics based on toggle state
                  const currentViewUsers = includeSubordinates ? subordinatesOnly : roleUsers
                  const currentAvgProgress = includeSubordinates ? avgSubordinatesOnlyProgress : avgProgress
                  const currentAtRiskCount = currentViewUsers.filter(u => u.status === 'at_risk' || u.status === 'behind').length
                  
                  return (
                    <>
                      {/* Role Header */}
                      <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
                            style={{ backgroundColor: role.color }}
                          >
                            {role.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-vergil-off-black">{role.name}</h4>
                            <p className="text-sm text-vergil-off-black/60">
                              {role.parentRole 
                                ? `Reports to ${roles.find(r => r.id === role.parentRole)?.name || 'Unknown'}`
                                : 'Top Level Role'
                              }
                            </p>
                          </div>
                        </div>
                        
                      </div>
                      
                      {/* View Toggle */}
                      <div className="mb-6">
                        <div className="bg-vergil-off-white/50 rounded-lg p-1 flex">
                          <button
                            onClick={() => setIncludeSubordinates(false)}
                            className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all ${
                              !includeSubordinates
                                ? 'bg-white text-vergil-off-black shadow-sm border border-gray-200'
                                : 'text-vergil-off-black/60 hover:text-vergil-off-black'
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-semibold">Users with this role</div>
                              <div className="text-xs mt-1 opacity-75">
                                {roleUsers.length} {roleUsers.length === 1 ? 'user' : 'users'} • {avgProgress}% avg progress
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => setIncludeSubordinates(true)}
                            className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all ${
                              includeSubordinates
                                ? 'bg-white text-vergil-off-black shadow-sm border border-gray-200'
                                : 'text-vergil-off-black/60 hover:text-vergil-off-black'
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-semibold">All subordinates</div>
                              <div className="text-xs mt-1 opacity-75">
                                {subordinatesOnly.length} {subordinatesOnly.length === 1 ? 'user' : 'users'} • {avgSubordinatesOnlyProgress}% avg progress
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-4">Key Metrics</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Overall Progress</p>
                            <p className="text-2xl font-bold" style={{ 
                              color: currentAvgProgress >= 80 ? '#10B981' : 
                                     currentAvgProgress >= 60 ? '#F59E0B' : '#EF4444' 
                            }}>
                              {currentAvgProgress}%
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Total Members</p>
                            <p className="text-2xl font-bold text-vergil-off-black">{currentViewUsers.length}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Ahead of Time</p>
                            <p className="text-2xl font-bold text-cyan-800">{currentViewUsers.filter(u => u.status === 'ahead').length}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">On Track</p>
                            <p className="text-2xl font-bold text-emerald-700">{currentViewUsers.filter(u => u.status === 'on_track').length}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Falling Behind</p>
                            <p className="text-2xl font-bold text-orange-800">{currentViewUsers.filter(u => u.status === 'at_risk').length}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Drastically Behind</p>
                            <p className="text-2xl font-bold text-red-700">{currentViewUsers.filter(u => u.status === 'behind').length}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Distribution */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-4">Status Distribution</h5>
                        <div className="space-y-3">
                          {/* Calculate status counts for current view */}
                          {(() => {
                            const aheadCount = currentViewUsers.filter(u => u.status === 'ahead').length
                            const onTrackCount = currentViewUsers.filter(u => u.status === 'on_track').length
                            const atRiskCount = currentViewUsers.filter(u => u.status === 'at_risk').length
                            const behindCount = currentViewUsers.filter(u => u.status === 'behind').length
                            const totalCount = currentViewUsers.length
                            
                            return (
                              <>
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-vergil-off-black">Ahead of Time</span>
                                    <span className="text-sm font-bold text-cyan-800">{aheadCount} ({totalCount > 0 ? Math.round(aheadCount / totalCount * 100) : 0}%)</span>
                                  </div>
                                  <Progress
                                    value={totalCount > 0 ? (aheadCount / totalCount) * 100 : 0}
                                    size="sm"
                                    className="bg-gray-200"
                                    indicatorClassName="bg-cyan-600"
                                  />
                                </div>
                                
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-vergil-off-black">On Track</span>
                                    <span className="text-sm font-bold text-emerald-700">{onTrackCount} ({totalCount > 0 ? Math.round(onTrackCount / totalCount * 100) : 0}%)</span>
                                  </div>
                                  <Progress
                                    value={totalCount > 0 ? (onTrackCount / totalCount) * 100 : 0}
                                    size="sm"
                                    className="bg-gray-200"
                                    indicatorClassName="bg-emerald-600"
                                  />
                                </div>
                                
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-vergil-off-black">Falling Behind</span>
                                    <span className="text-sm font-bold text-orange-800">{atRiskCount} ({totalCount > 0 ? Math.round(atRiskCount / totalCount * 100) : 0}%)</span>
                                  </div>
                                  <Progress
                                    value={totalCount > 0 ? (atRiskCount / totalCount) * 100 : 0}
                                    size="sm"
                                    className="bg-gray-200"
                                    indicatorClassName="bg-orange-600"
                                  />
                                </div>
                                
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-vergil-off-black">Drastically Behind</span>
                                    <span className="text-sm font-bold text-red-700">{behindCount} ({totalCount > 0 ? Math.round(behindCount / totalCount * 100) : 0}%)</span>
                                  </div>
                                  <Progress
                                    value={totalCount > 0 ? (behindCount / totalCount) * 100 : 0}
                                    size="sm"
                                    className="bg-gray-200"
                                    indicatorClassName="bg-red-600"
                                  />
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </div>
                      
                      {/* Members List */}
                      {currentViewUsers.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-vergil-off-black mb-2">
                            {includeSubordinates ? `Subordinate team members` : `Users with this role`}
                          </h5>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {currentViewUsers.map(user => {
                              const userRole = roles.find(r => r.id === user.roleId)
                              const isSubordinate = includeSubordinates && user.roleId !== role.id
                              
                              return (
                                <div 
                                  key={user.id} 
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedUser(user.id)
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                      style={{ backgroundColor: userRole?.color || role.color }}
                                    >
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-vergil-off-black">{user.name}</p>
                                      <div className="flex items-center gap-2 text-xs">
                                        <span className="text-vergil-off-black/60">{user.completionRate}% complete</span>
                                        {isSubordinate && (
                                          <span className="text-vergil-purple/70">• {userRole?.name}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <Badge 
                                      variant={
                                        user.status === 'ahead' ? 'success' :
                                        user.status === 'on_track' ? 'default' : 
                                        user.status === 'at_risk' ? 'warning' : 'error'
                                      }
                                      className={`text-xs ${
                                        user.status === 'ahead' ? 'bg-cyan-100 text-cyan-800 border-cyan-300' :
                                        user.status === 'on_track' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        user.status === 'at_risk' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                                        'bg-red-100 text-red-700 border-red-200'
                                      }`}
                                    >
                                      {user.status === 'ahead' ? 'Ahead' :
                                       user.status === 'on_track' ? 'On Track' :
                                       user.status === 'at_risk' ? 'At Risk' : 'Behind'}
                                    </Badge>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="border-t border-gray-200 pt-6">
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-3">Quick Actions</h5>
                        <div className="space-y-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              // Send group email
                            }}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Team Email
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              // Send group Slack message
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Team Slack
                          </Button>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              // Organization-wide Statistics
              <div className="space-y-6">
                {(() => {
                  // Calculate organization-wide metrics
                  const totalUsers = users.length
                  const totalRoles = roles.length
                  
                  // Overall completion rate
                  const overallCompletion = Math.round(
                    users.reduce((sum, u) => sum + (u.completionRate || 0), 0) / totalUsers
                  )
                  
                  // Users by status (using mapped status names to match user page)
                  const aheadUsers = users.filter(u => u.status === 'ahead').length
                  const onTrackUsers = users.filter(u => u.status === 'on_track').length
                  const fallingBehindUsers = users.filter(u => u.status === 'at_risk').length
                  const drasticallyBehindUsers = users.filter(u => u.status === 'behind').length
                  
                  // Completion by role
                  const roleStats = roles.map(role => {
                    const roleUsers = users.filter(u => u.roleId === role.id)
                    const avgCompletion = roleUsers.length > 0
                      ? Math.round(roleUsers.reduce((sum, u) => sum + (u.completionRate || 0), 0) / roleUsers.length)
                      : 0
                    return { role, avgCompletion, userCount: roleUsers.length }
                  }).sort((a, b) => b.avgCompletion - a.avgCompletion)
                  
                  // Top performers
                  const topPerformers = users
                    .sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0))
                    .slice(0, 5)
                  
                  return (
                    <>
                      {/* Organization Header */}
                      <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg bg-vergil-purple/10 flex items-center justify-center">
                            <Users className="w-8 h-8 text-vergil-purple" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-vergil-off-black">Organization Overview</h4>
                            <p className="text-sm text-vergil-off-black/60">
                              {totalUsers} members across {totalRoles} roles
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-4">Key Metrics</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Overall Progress</p>
                            <p className="text-2xl font-bold" style={{ 
                              color: overallCompletion >= 80 ? '#10B981' : 
                                     overallCompletion >= 60 ? '#F59E0B' : '#EF4444' 
                            }}>
                              {overallCompletion}%
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Total Members</p>
                            <p className="text-2xl font-bold text-vergil-off-black">{totalUsers}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Ahead of Time</p>
                            <p className="text-2xl font-bold text-cyan-800">{aheadUsers}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">On Track</p>
                            <p className="text-2xl font-bold text-emerald-700">{onTrackUsers}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Falling Behind</p>
                            <p className="text-2xl font-bold text-orange-800">{fallingBehindUsers}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Drastically Behind</p>
                            <p className="text-2xl font-bold text-red-700">{drasticallyBehindUsers}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Distribution */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-4">Status Distribution</h5>
                        <div className="space-y-3">
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-vergil-off-black">Ahead of Time</span>
                              <span className="text-sm font-bold text-cyan-800">{aheadUsers} ({Math.round(aheadUsers / totalUsers * 100)}%)</span>
                            </div>
                            <Progress
                              value={(aheadUsers / totalUsers) * 100}
                              size="sm"
                              className="bg-gray-200"
                              indicatorClassName="bg-cyan-600"
                            />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-vergil-off-black">On Track</span>
                              <span className="text-sm font-bold text-emerald-700">{onTrackUsers} ({Math.round(onTrackUsers / totalUsers * 100)}%)</span>
                            </div>
                            <Progress
                              value={(onTrackUsers / totalUsers) * 100}
                              size="sm"
                              className="bg-gray-200"
                              indicatorClassName="bg-emerald-600"
                            />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-vergil-off-black">Falling Behind</span>
                              <span className="text-sm font-bold text-orange-800">{fallingBehindUsers} ({Math.round(fallingBehindUsers / totalUsers * 100)}%)</span>
                            </div>
                            <Progress
                              value={(fallingBehindUsers / totalUsers) * 100}
                              size="sm"
                              className="bg-gray-200"
                              indicatorClassName="bg-orange-600"
                            />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-vergil-off-black">Drastically Behind</span>
                              <span className="text-sm font-bold text-red-700">{drasticallyBehindUsers} ({Math.round(drasticallyBehindUsers / totalUsers * 100)}%)</span>
                            </div>
                            <Progress
                              value={(drasticallyBehindUsers / totalUsers) * 100}
                              size="sm"
                              className="bg-gray-200"
                              indicatorClassName="bg-red-600"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Performance by Role */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-4">Performance by Role</h5>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {roleStats.map(({ role, avgCompletion, userCount }) => (
                            <div 
                              key={role.id} 
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                              onClick={() => {
                                setSelectedRole(role.id)
                                setSelectedUser(null)
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                                  style={{ backgroundColor: role.color }}
                                >
                                  {role.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-vergil-off-black">{role.name}</p>
                                  <p className="text-xs text-vergil-off-black/60">{userCount} members</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold" style={{ 
                                  color: avgCompletion >= 80 ? '#10B981' : 
                                         avgCompletion >= 60 ? '#F59E0B' : '#EF4444' 
                                }}>
                                  {avgCompletion}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-2">Actions</h5>
                        <div className="space-y-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              // Send organization-wide announcement
                            }}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Organization Announcement
                          </Button>
                          <Link href="/lms/user-management">
                            <Button variant="secondary" size="sm" className="w-full justify-start">
                              <Users className="w-4 h-4 mr-2" />
                              Manage All Users
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}