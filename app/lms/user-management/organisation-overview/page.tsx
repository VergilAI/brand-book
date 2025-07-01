'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Move, Save, X, ChevronDown, ChevronRight, Users, Maximize2, Grid, Mail, MessageSquare, AlertTriangle, TrendingDown, Phone, User as UserIcon, Info } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Role, initialRoles } from '@/lib/lms/roles-data'
import { User, mockUsers, updateRoleUserCounts } from '@/lib/lms/mock-data'

interface DragState {
  isDragging: boolean
  draggedNodeId: string | null
  offset: { x: number; y: number }
  startPos: { x: number; y: number }
}

interface ViewState {
  zoom: number
  pan: { x: number; y: number }
  showGrid: boolean
  viewMode: 'roles' | 'users'
  focusedRoleId?: string
}


export default function OrganisationOverviewPage() {
  const canvasRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [roles, setRoles] = useState<Role[]>(updateRoleUserCounts(initialRoles))
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [editMode, setEditMode] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedNodeId: null,
    offset: { x: 0, y: 0 },
    startPos: { x: 0, y: 0 }
  })
  const [viewState, setViewState] = useState<ViewState>({
    zoom: 1.2,
    pan: { x: -100, y: -20 },
    showGrid: true,
    viewMode: 'roles'
  })
  const [isPanning, setIsPanning] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [showZoomIndicator, setShowZoomIndicator] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null)
  const zoomIndicatorTimeout = useRef<NodeJS.Timeout | null>(null)
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openStatusDropdown) {
        const target = event.target as HTMLElement
        if (!target.closest('.relative')) {
          setOpenStatusDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openStatusDropdown])

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

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't handle if the target is the rect element (already handled by onClick)
    if ((e.target as SVGElement).tagName === 'rect') {
      return
    }
    
    const point = getSVGPoint(e.clientX, e.clientY)
    
    // Check if clicking on a role node
    let clickedRole: Role | null = null
    const cardWidth = 180
    const cardHeight = 95
    
    for (const role of roles) {
      if (!role.position) continue
      
      // Calculate if this role has subordinates for accurate height
      const getAllSubs = (roleId: string): User[] => {
        const directUsers = users.filter(u => u.roleId === roleId)
        const childRoles = roles.filter(r => r.parentRole === roleId)
        const indirectUsers = childRoles.flatMap(childRole => getAllSubs(childRole.id))
        return [...directUsers, ...indirectUsers]
      }
      const hasSubordinates = getAllSubs(role.id).length > 0
      const actualHeight = hasSubordinates ? 95 : 75
      
      // Check if click is within card bounds
      if (point.x >= role.position.x && 
          point.x <= role.position.x + cardWidth &&
          point.y >= role.position.y && 
          point.y <= role.position.y + actualHeight) {
        clickedRole = role
        break
      }
    }
    
    if (clickedRole && editMode) {
      // Start dragging role
      setDragState({
        isDragging: true,
        draggedNodeId: clickedRole.id,
        offset: {
          x: point.x - clickedRole.position!.x,
          y: point.y - clickedRole.position!.y
        },
        startPos: clickedRole.position!
      })
      setSelectedRole(clickedRole.id)
    } else if (!clickedRole) {
      // Only start panning if we didn't click on a role
      setIsPanning(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
      // Clear selections when clicking on empty space
      setSelectedRole(null)
      setSelectedUser(null)
    }
  }

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.isDragging && dragState.draggedNodeId && editMode) {
      const point = getSVGPoint(e.clientX, e.clientY)
      
      // Calculate new position
      let newX = point.x - dragState.offset.x
      let newY = point.y - dragState.offset.y
      
      // Snap to grid if enabled
      if (viewState.showGrid) {
        const gridSize = 50
        newX = Math.round(newX / gridSize) * gridSize
        newY = Math.round(newY / gridSize) * gridSize
      }
      
      setRoles(prev => prev.map(role => 
        role.id === dragState.draggedNodeId
          ? { ...role, position: { x: newX, y: newY } }
          : role
      ))
    } else if (isPanning) {
      const dx = e.clientX - lastMousePos.x
      const dy = e.clientY - lastMousePos.y
      
      setViewState(prev => ({
        ...prev,
        pan: {
          x: prev.pan.x - dx / prev.zoom,
          y: prev.pan.y - dy / prev.zoom
        }
      }))
      
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }, [dragState, editMode, isPanning, lastMousePos, viewState.showGrid, viewState.zoom, getSVGPoint])

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedNodeId: null,
      offset: { x: 0, y: 0 },
      startPos: { x: 0, y: 0 }
    })
    setIsPanning(false)
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
      pan: { x: -100, y: -20 },
      showGrid: viewState.showGrid
    })
  }

  // Render connection lines
  const renderConnections = () => {
    const cardWidth = 160
    const cardHeight = 80
    
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
          stroke="#E5E7EB"
          strokeWidth="2"
          strokeDasharray={editMode ? "5,5" : undefined}
          className={editMode ? "animate-pulse" : ""}
        />
      )
    })
  }

  // Render grid
  const renderGrid = () => {
    if (!viewState.showGrid) return null
    
    const gridSize = 50
    const viewBox = calculateViewBox().split(' ').map(Number)
    const startX = Math.floor(viewBox[0] / gridSize) * gridSize - gridSize
    const startY = Math.floor(viewBox[1] / gridSize) * gridSize - gridSize
    const endX = Math.ceil((viewBox[0] + viewBox[2]) / gridSize) * gridSize + gridSize
    const endY = Math.ceil((viewBox[1] + viewBox[3]) / gridSize) * gridSize + gridSize
    
    const lines = []
    
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push(
        <line
          key={`grid-v-${x}`}
          x1={x}
          y1={startY}
          x2={x}
          y2={endY}
          stroke="#F3F4F6"
          strokeWidth="1"
        />
      )
    }
    
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push(
        <line
          key={`grid-h-${y}`}
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke="#F3F4F6"
          strokeWidth="1"
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
    setIsTransitioning(true)
    
    // Clear any existing transition timeout
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current)
    }
    
    // Switch to users list view
    setViewState(prev => ({
      ...prev,
      viewMode: 'users',
      focusedRoleId: roleId
    }))
    
    // End transition after animation completes
    transitionTimeout.current = setTimeout(() => {
      setIsTransitioning(false)
    }, 300) // Shorter since we're just switching views
    
    setSelectedRole(null)
    setSelectedUser(null)
  }, [roles, users])

  // Go back to roles view with smooth transition
  const goBackToRoles = useCallback(() => {
    setIsTransitioning(true)
    
    // Clear any existing transition timeout
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current)
    }
    
    setViewState(prev => ({
      ...prev,
      zoom: 1.2,
      pan: { x: -100, y: -20 },
      viewMode: 'roles',
      focusedRoleId: undefined
    }))
    
    // End transition after animation completes
    transitionTimeout.current = setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
    
    setSelectedUser(null)
    setSelectedRole(null)
  }, [])

  // Handle role click
  const handleRoleClick = useCallback((roleId: string) => {
    if (editMode) return
    // Set the selected role
    setSelectedRole(roleId)
    setSelectedUser(null) // Clear any selected user
  }, [editMode])


  // Render role node
  const renderRoleNode = (role: Role) => {
    if (!role.position) return null
    
    const isSelected = selectedRole === role.id
    const isDragging = dragState.draggedNodeId === role.id
    
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
    
    // Card dimensions
    const cardWidth = 180
    const cardHeight = allSubordinates.length > 0 ? 95 : 75
    
    return (
      <g
        key={role.id}
        transform={`translate(${role.position.x}, ${role.position.y})`}
        className={`${isDragging ? 'opacity-50' : ''}`}
        style={{ cursor: editMode ? 'move' : 'pointer' }}
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
          fill="white"
          stroke={isSelected ? role.color : '#E5E7EB'}
          strokeWidth={isSelected ? "2" : "1"}
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
        
        
        {/* Subordinate Progress Bar */}
        {allSubordinates.length > 0 && (
          <g transform={`translate(12, ${cardHeight - 30})`}>
            {/* Progress label with info icon */}
            <g>
              <text
                x="0"
                y="0"
                fontSize="11"
                fill="#6B7280"
                fontWeight="500"
              >
                Team Progress: {avgSubordinateProgress}%
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
            </g>
            
            {/* Progress bar background */}
            <rect
              x="0"
              y="8"
              width={cardWidth - 24}
              height="4"
              rx="2"
              fill="#E5E7EB"
            />
            
            {/* Progress bar fill */}
            <rect
              x="0"
              y="8"
              width={(cardWidth - 24) * (avgSubordinateProgress / 100)}
              height="4"
              rx="2"
              fill={
                avgSubordinateProgress >= 80 ? '#10B981' :
                avgSubordinateProgress >= 60 ? '#F59E0B' :
                '#EF4444'
              }
            />
          </g>
        )}
        
        
        
        {/* Edit mode indicator */}
        {editMode && (
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
          style={{ cursor: editMode ? 'move' : 'pointer' }}
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
                console.log('Send Slack message to', user.name)
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
                console.log('Edit user', user.name)
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
          <g transform={`translate(${cardWidth - 20}, 12)`}>
            <circle
              cx="8"
              cy="8"
              r="8"
              fill={
                user.status === 'on_track' ? '#10B981' :
                user.status === 'at_risk' ? '#F59E0B' :
                '#EF4444'
              }
            />
            <text
              x="8"
              y="12"
              textAnchor="middle"
              fontSize="10"
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

  return (
    <div className="min-h-screen bg-vergil-off-white">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-vergil-off-black">
                {viewState.viewMode === 'users' 
                  ? `${roles.find(r => r.id === viewState.focusedRoleId)?.name || 'Unknown'} Team` 
                  : 'Organization Hierarchy'
                }
              </h1>
              <p className="text-vergil-off-black/60">
                {viewState.viewMode === 'users'
                  ? 'Individual team members and their details'
                  : 'Visual representation of your organization structure'
                }
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetView}
                title="Reset View"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
                className={viewState.showGrid ? 'bg-vergil-purple/10 text-vergil-purple' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              
              <div className="w-px h-8 bg-gray-200" />
              
              <Link href="/lms/user-management/roles">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Roles
                </Button>
              </Link>
              
              <Button
                onClick={() => setEditMode(!editMode)}
                className={editMode ? 'bg-vergil-purple hover:bg-vergil-purple-lighter' : ''}
              >
                {editMode ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Hierarchy
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Hierarchy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
          <nav className="flex space-x-8">
            <Link href="/lms/user-management" className="py-4 px-1 border-b-2 border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30 font-medium text-sm transition-all">
              Users
            </Link>
            <Link href="/lms/user-management/organisation-overview" className="py-4 px-1 border-b-2 border-vergil-purple text-vergil-purple font-medium text-sm">
              Organisation Overview
            </Link>
            <Link href="/lms/user-management/roles" className="py-4 px-1 border-b-2 border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30 font-medium text-sm transition-all">
              Roles
            </Link>
          </nav>
        </div>

        {/* Main Canvas and Details */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Canvas */}
            <div 
              ref={containerRef} 
              className="flex-1 relative bg-gray-50"
              onWheel={handleWheel}
            >
            <svg
              ref={canvasRef}
              className="w-full h-full"
              viewBox={calculateViewBox()}
              onMouseDown={handleMouseDown}
              style={{ 
                cursor: isPanning ? 'grabbing' : 'grab',
                transition: isTransitioning ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
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
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg w-full">
                          <p className="font-semibold text-white">Team Progress</p>
                          <p className="text-[11px] text-gray-200 mt-1">
                            Average completion of all subordinates
                          </p>
                        </div>
                      </foreignObject>
                    )
                  })}
                </g>
              )}
            </svg>
            
            {/* Users List View */}
            {viewState.viewMode === 'users' && (
              <div className="absolute inset-0 bg-white p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-vergil-off-black mb-2">
                      {roles.find(r => r.id === viewState.focusedRoleId)?.name || 'Unknown'} Team Members
                    </h2>
                    <p className="text-vergil-off-black/60">
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
                                ? 'border-vergil-purple shadow-md ring-2 ring-vergil-purple/20' 
                                : 'border-gray-200 hover:border-gray-300'
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
                                    <h3 className="font-semibold text-vergil-off-black">{user.name}</h3>
                                    <div
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.status === 'on_track' 
                                          ? 'bg-green-100 text-green-800'
                                          : user.status === 'at_risk'
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {user.completionRate}% Complete
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-6 text-sm text-vergil-off-black/70">
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
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('Send Slack message to', user.name)
                                  }}
                                  className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Slack
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('Edit user', user.name)
                                  }}
                                >
                                  <Edit2 className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                            
                            {/* Expanded Details */}
                            {isSelected && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-vergil-off-black/60">Role:</span>
                                    <span className="ml-2">{role?.name || 'Unknown'}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-vergil-off-black/60">Status:</span>
                                    <span className="ml-2 capitalize">{user.status?.replace('_', ' ') || 'Unknown'}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-vergil-off-black/60">Training Progress:</span>
                                    <div className="mt-1">
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className={`h-2 rounded-full ${
                                            user.status === 'on_track' 
                                              ? 'bg-green-500'
                                              : user.status === 'at_risk'
                                              ? 'bg-amber-500'
                                              : 'bg-red-500'
                                          }`}
                                          style={{ width: `${user.completionRate}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-vergil-off-black/60 mt-1">
                                        {user.completionRate}% of required training completed
                                      </span>
                                    </div>
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
            {editMode && (
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
            {!editMode && (
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm px-3 py-2 text-sm text-vergil-off-black/60">
                Click and drag to pan • Pinch to zoom
              </div>
            )}
            
            {/* Zoom indicator */}
            {showZoomIndicator && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white rounded-lg px-3 py-1 text-sm font-medium">
                {Math.round(viewState.zoom * 100)}%
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="w-[480px] bg-white border-l border-gray-200 p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-vergil-off-black">
                {selectedUser ? 'User Details' : 
                 selectedRole ? 'Role Details' : 
                 viewState.viewMode === 'users' ? 'User Details' : 'Role Details'}
              </h3>
              {viewState.viewMode === 'users' && !selectedUser && !selectedRole && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBackToRoles}
                >
                  ← Back to Roles
                </Button>
              )}
            </div>
            
            {(viewState.viewMode === 'users' && selectedUser) || (viewState.viewMode === 'roles' && selectedUser) ? (
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
                      <div className="border-b border-gray-200 pb-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(null)
                            // If we're in roles view and came from a role, show that role again
                            if (viewState.viewMode === 'roles' && user.roleId) {
                              setSelectedRole(user.roleId)
                            }
                          }}
                          className="mb-4"
                        >
                          ← Back
                        </Button>
                        <div className="flex items-center gap-4">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                            style={{ backgroundColor: role?.color || '#7B00FF' }}
                          >
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-vergil-off-black">{user.name}</h4>
                            <p className="text-sm text-vergil-off-black/60">{role?.name || 'Unknown Role'}</p>
                            <p className="text-xs text-vergil-off-black/50 mt-1">Last active: {lastActive}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-3">Contact Information</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-vergil-off-black/40" />
                            <span className="text-vergil-off-black">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-vergil-off-black/40" />
                            <span className="text-vergil-off-black">{user.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Learning Statistics */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-4">Learning Statistics</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Overall Progress</p>
                            <p className="text-xl font-bold" style={{ 
                              color: user.completionRate >= 80 ? '#10B981' : 
                                     user.completionRate >= 60 ? '#F59E0B' : '#EF4444' 
                            }}>
                              {user.completionRate}%
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Average Score</p>
                            <p className="text-xl font-bold text-vergil-off-black">{averageScore}%</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Courses</p>
                            <p className="text-xl font-bold text-vergil-off-black">
                              {coursesCompleted}/{totalCourses}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Time Spent</p>
                            <p className="text-xl font-bold text-vergil-off-black">{hoursSpent}h</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-vergil-off-black/60 mb-1">
                            <span>Course Progress</span>
                            <span>{coursesCompleted} completed, {coursesInProgress} in progress</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="flex h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-green-500"
                                style={{ width: `${(coursesCompleted / totalCourses) * 100}%` }}
                              />
                              <div 
                                className="bg-blue-500"
                                style={{ width: `${(coursesInProgress / totalCourses) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Streak */}
                        <div className="flex items-center justify-between mt-3 p-3 bg-vergil-purple/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="text-2xl">🔥</div>
                            <div>
                              <p className="text-sm font-medium text-vergil-off-black">{streak} day streak</p>
                              <p className="text-xs text-vergil-off-black/60">Keep it up!</p>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-vergil-purple">
                            {user.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-2">Actions</h5>
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log('Send Slack message to', user.name)
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Slack Message
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log('Send email to', user.name)
                            }}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </Button>
                          <Link href={`/lms/user-management/users/${user.id}`}>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <UserIcon className="w-4 h-4 mr-2" />
                              View Full Profile
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
                  
                  // Get all subordinates (direct and indirect)
                  const getAllSubordinates = (roleId: string): User[] => {
                    const directUsers = users.filter(u => u.roleId === roleId)
                    const childRoles = roles.filter(r => r.parentRole === roleId)
                    const indirectUsers = childRoles.flatMap(childRole => getAllSubordinates(childRole.id))
                    return [...directUsers, ...indirectUsers]
                  }
                  
                  const allSubordinates = getAllSubordinates(role.id)
                  const totalSubordinates = allSubordinates.length
                  const avgSubordinateProgress = totalSubordinates > 0
                    ? Math.round(allSubordinates.reduce((sum, u) => sum + (u.completionRate || 0), 0) / totalSubordinates)
                    : 0
                  
                  // Count at-risk members
                  const atRiskCount = roleUsers.filter(u => u.status === 'at_risk' || u.status === 'behind').length
                  
                  return (
                    <>
                      {/* Role Header */}
                      <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-4">
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
                      
                      {/* Key Statistics */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-4">Key Statistics</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Direct Members</p>
                            <p className="text-xl font-bold text-vergil-off-black">{roleUsers.length}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Total Team Size</p>
                            <p className="text-xl font-bold text-vergil-off-black">{totalSubordinates}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">Avg Progress</p>
                            <p className="text-xl font-bold" style={{ color: avgProgress >= 80 ? '#10B981' : avgProgress >= 60 ? '#F59E0B' : '#EF4444' }}>
                              {avgProgress}%
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-vergil-off-black/60">At Risk</p>
                            <p className="text-xl font-bold" style={{ color: atRiskCount > 0 ? '#EF4444' : '#10B981' }}>
                              {atRiskCount}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Team Members */}
                      {roleUsers.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-vergil-off-black mb-2">Team Members</h5>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {roleUsers.map(user => (
                              <div 
                                key={user.id} 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedUser(user.id)
                                  // Don't clear the role immediately to maintain context
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                    style={{ backgroundColor: role.color }}
                                  >
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-vergil-off-black">{user.name}</p>
                                    <p className="text-xs text-vergil-off-black/60">{user.completionRate}% complete</p>
                                  </div>
                                </div>
                                <Badge 
                                  variant={
                                    user.status === 'on_track' ? 'default' : 
                                    user.status === 'at_risk' ? 'secondary' : 'destructive'
                                  }
                                  className="text-xs"
                                >
                                  {user.status?.replace('_', ' ')}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div>
                        <h5 className="text-sm font-semibold text-vergil-off-black mb-2">Actions</h5>
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log('Send group email to', role.name, 'team')
                            }}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Team Email
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log('Send group Slack message to', role.name, 'team')
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Team Slack
                          </Button>
                          <Link href="/lms/user-management/roles">
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit Role
                            </Button>
                          </Link>
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
                          <div className="relative">
                            <div 
                              className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-cyan-300 transition-all"
                              onClick={() => setOpenStatusDropdown(openStatusDropdown === 'ahead' ? null : 'ahead')}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-vergil-off-black">Ahead of Time</span>
                                <span className="text-sm font-bold text-cyan-800">{aheadUsers} ({Math.round(aheadUsers / totalUsers * 100)}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-cyan-600 h-2 rounded-full transition-all"
                                  style={{ width: `${(aheadUsers / totalUsers) * 100}%` }}
                                />
                              </div>
                            </div>
                            {openStatusDropdown === 'ahead' && (
                              <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="p-2">
                                  <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-gray-100">
                                    <p className="text-xs font-medium text-vergil-off-black/60">Ahead of Time Users</p>
                                    <p className="text-xs text-vergil-off-black/50">Progress</p>
                                  </div>
                                  {users.filter(u => u.status === 'ahead').map(user => {
                                    const role = roles.find(r => r.id === user.roleId)
                                    return (
                                      <div
                                        key={user.id}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedUser(user.id)
                                          setSelectedRole(null)
                                          setOpenStatusDropdown(null)
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                            style={{ backgroundColor: role?.color || '#7B00FF' }}
                                          >
                                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-vergil-off-black">{user.name}</p>
                                            <p className="text-xs text-vergil-off-black/60">{role?.name}</p>
                                          </div>
                                        </div>
                                        <span className="text-xs font-bold text-cyan-800">{user.completionRate}%</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <div 
                              className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all"
                              onClick={() => setOpenStatusDropdown(openStatusDropdown === 'on_track' ? null : 'on_track')}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-vergil-off-black">On Track</span>
                                <span className="text-sm font-bold text-emerald-700">{onTrackUsers} ({Math.round(onTrackUsers / totalUsers * 100)}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-emerald-600 h-2 rounded-full transition-all"
                                  style={{ width: `${(onTrackUsers / totalUsers) * 100}%` }}
                                />
                              </div>
                            </div>
                            {openStatusDropdown === 'on_track' && (
                              <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="p-2">
                                  <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-gray-100">
                                    <p className="text-xs font-medium text-vergil-off-black/60">On Track Users</p>
                                    <p className="text-xs text-vergil-off-black/50">Progress</p>
                                  </div>
                                  {users.filter(u => u.status === 'on_track').map(user => {
                                    const role = roles.find(r => r.id === user.roleId)
                                    return (
                                      <div
                                        key={user.id}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedUser(user.id)
                                          setSelectedRole(null)
                                          setOpenStatusDropdown(null)
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                            style={{ backgroundColor: role?.color || '#7B00FF' }}
                                          >
                                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-vergil-off-black">{user.name}</p>
                                            <p className="text-xs text-vergil-off-black/60">{role?.name}</p>
                                          </div>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-700">{user.completionRate}%</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <div 
                              className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all"
                              onClick={() => setOpenStatusDropdown(openStatusDropdown === 'falling_behind' ? null : 'falling_behind')}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-vergil-off-black">Falling Behind</span>
                                <span className="text-sm font-bold text-orange-800">{fallingBehindUsers} ({Math.round(fallingBehindUsers / totalUsers * 100)}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-orange-600 h-2 rounded-full transition-all"
                                  style={{ width: `${(fallingBehindUsers / totalUsers) * 100}%` }}
                                />
                              </div>
                            </div>
                            {openStatusDropdown === 'falling_behind' && (
                              <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="p-2">
                                  <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-gray-100">
                                    <p className="text-xs font-medium text-vergil-off-black/60">Falling Behind Users</p>
                                    <p className="text-xs text-vergil-off-black/50">Progress</p>
                                  </div>
                                  {users.filter(u => u.status === 'at_risk').map(user => {
                                    const role = roles.find(r => r.id === user.roleId)
                                    return (
                                      <div
                                        key={user.id}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedUser(user.id)
                                          setSelectedRole(null)
                                          setOpenStatusDropdown(null)
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                            style={{ backgroundColor: role?.color || '#7B00FF' }}
                                          >
                                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-vergil-off-black">{user.name}</p>
                                            <p className="text-xs text-vergil-off-black/60">{role?.name}</p>
                                          </div>
                                        </div>
                                        <span className="text-xs font-bold text-orange-800">{user.completionRate}%</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <div 
                              className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-red-300 transition-all"
                              onClick={() => setOpenStatusDropdown(openStatusDropdown === 'drastically_behind' ? null : 'drastically_behind')}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-vergil-off-black">Drastically Behind</span>
                                <span className="text-sm font-bold text-red-700">{drasticallyBehindUsers} ({Math.round(drasticallyBehindUsers / totalUsers * 100)}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-600 h-2 rounded-full transition-all"
                                  style={{ width: `${(drasticallyBehindUsers / totalUsers) * 100}%` }}
                                />
                              </div>
                            </div>
                            {openStatusDropdown === 'drastically_behind' && (
                              <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="p-2">
                                  <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-gray-100">
                                    <p className="text-xs font-medium text-vergil-off-black/60">Drastically Behind Users</p>
                                    <p className="text-xs text-vergil-off-black/50">Progress</p>
                                  </div>
                                  {users.filter(u => u.status === 'behind').map(user => {
                                    const role = roles.find(r => r.id === user.roleId)
                                    return (
                                      <div
                                        key={user.id}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedUser(user.id)
                                          setSelectedRole(null)
                                          setOpenStatusDropdown(null)
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                            style={{ backgroundColor: role?.color || '#7B00FF' }}
                                          >
                                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-vergil-off-black">{user.name}</p>
                                            <p className="text-xs text-vergil-off-black/60">{role?.name}</p>
                                          </div>
                                        </div>
                                        <span className="text-xs font-bold text-red-700">{user.completionRate}%</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
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
                            variant="outline" 
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log('Send organization-wide announcement')
                            }}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Organization Announcement
                          </Button>
                          <Link href="/lms/user-management">
                            <Button variant="outline" size="sm" className="w-full justify-start">
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