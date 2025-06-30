'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Move, Save, X, ChevronDown, ChevronRight, Users, Maximize2, Grid, Mail, MessageSquare, AlertTriangle, TrendingDown, Phone, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface User {
  id: string
  name: string
  email: string
  phone: string
  roleId: string
  position?: { x: number; y: number }
  completionRate?: number
  status?: 'on_track' | 'at_risk' | 'behind'
  avatar?: string
}

interface Role {
  id: string
  name: string
  color: string
  description?: string
  usersCount: number
  parentRole?: string
  position?: { x: number; y: number }
  completionRate?: number
  subordinatesCompletionRate?: number
  status?: 'on_track' | 'at_risk' | 'behind'
}

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

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'CEO',
    color: '#7B00FF',
    description: 'Chief Executive Officer',
    usersCount: 1,
    position: { x: 400, y: 50 },
    completionRate: 100,
    status: 'on_track'
  },
  {
    id: '2',
    name: 'Manager',
    color: '#0087FF',
    description: 'Team management and oversight',
    usersCount: 3,
    parentRole: '1',
    position: { x: 400, y: 180 },
    completionRate: 95,
    status: 'on_track'
  },
  {
    id: '3',
    name: 'Team Lead',
    color: '#10B981',
    description: 'Direct team leadership',
    usersCount: 2,
    parentRole: '2',
    position: { x: 400, y: 310 },
    completionRate: 88,
    status: 'at_risk'
  },
  {
    id: '4',
    name: 'Developer',
    color: '#FFC700',
    description: 'Software development',
    usersCount: 8,
    parentRole: '3',
    position: { x: 400, y: 440 },
    completionRate: 82,
    status: 'behind'
  }
]

const mockUsers: User[] = [
  // CEO
  {
    id: 'u1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    roleId: '1',
    position: { x: 300, y: 200 },
    completionRate: 100,
    status: 'on_track'
  },
  
  // Managers (spread horizontally with spacing)
  {
    id: 'u2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 234-5678',
    roleId: '2',
    position: { x: 100, y: 200 },
    completionRate: 98,
    status: 'on_track'
  },
  {
    id: 'u3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1 (555) 345-6789',
    roleId: '2',
    position: { x: 350, y: 200 },
    completionRate: 92,
    status: 'on_track'
  },
  {
    id: 'u4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    phone: '+1 (555) 456-7890',
    roleId: '2',
    position: { x: 600, y: 200 },
    completionRate: 95,
    status: 'on_track'
  },
  
  // Team Leads (spread horizontally with spacing)
  {
    id: 'u5',
    name: 'Jessica Williams',
    email: 'jessica.williams@company.com',
    phone: '+1 (555) 567-8901',
    roleId: '3',
    position: { x: 200, y: 200 },
    completionRate: 90,
    status: 'at_risk'
  },
  {
    id: 'u6',
    name: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    phone: '+1 (555) 678-9012',
    roleId: '3',
    position: { x: 470, y: 200 },
    completionRate: 86,
    status: 'at_risk'
  },
  
  // Developers (arranged in a grid with proper spacing)
  {
    id: 'u7',
    name: 'Ryan Davis',
    email: 'ryan.davis@company.com',
    phone: '+1 (555) 789-0123',
    roleId: '4',
    position: { x: 50, y: 150 },
    completionRate: 85,
    status: 'behind'
  },
  {
    id: 'u8',
    name: 'Lisa Park',
    email: 'lisa.park@company.com',
    phone: '+1 (555) 890-1234',
    roleId: '4',
    position: { x: 300, y: 150 },
    completionRate: 78,
    status: 'behind'
  },
  {
    id: 'u9',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    phone: '+1 (555) 901-2345',
    roleId: '4',
    position: { x: 550, y: 150 },
    completionRate: 82,
    status: 'behind'
  },
  {
    id: 'u10',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    phone: '+1 (555) 012-3456',
    roleId: '4',
    position: { x: 800, y: 150 },
    completionRate: 80,
    status: 'behind'
  },
  {
    id: 'u11',
    name: 'Kevin Lee',
    email: 'kevin.lee@company.com',
    phone: '+1 (555) 123-4560',
    roleId: '4',
    position: { x: 50, y: 320 },
    completionRate: 88,
    status: 'at_risk'
  },
  {
    id: 'u12',
    name: 'Amanda Brown',
    email: 'amanda.brown@company.com',
    phone: '+1 (555) 234-5601',
    roleId: '4',
    position: { x: 300, y: 320 },
    completionRate: 83,
    status: 'behind'
  },
  {
    id: 'u13',
    name: 'Daniel Martinez',
    email: 'daniel.martinez@company.com',
    phone: '+1 (555) 345-6012',
    roleId: '4',
    position: { x: 550, y: 320 },
    completionRate: 79,
    status: 'behind'
  },
  {
    id: 'u14',
    name: 'Jennifer Taylor',
    email: 'jennifer.taylor@company.com',
    phone: '+1 (555) 456-0123',
    roleId: '4',
    position: { x: 800, y: 320 },
    completionRate: 84,
    status: 'behind'
  }
]

export default function OrganisationOverviewPage() {
  const canvasRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [editMode, setEditMode] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)
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
  const zoomIndicatorTimeout = useRef<NodeJS.Timeout | null>(null)
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null)

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
    const point = getSVGPoint(e.clientX, e.clientY)
    
    // Check if clicking on a role node
    let clickedRole: Role | null = null
    const cardWidth = 160
    const cardHeight = 80
    
    for (const role of roles) {
      if (!role.position) continue
      
      // Check if click is within card bounds
      if (point.x >= role.position.x && 
          point.x <= role.position.x + cardWidth &&
          point.y >= role.position.y && 
          point.y <= role.position.y + cardHeight) {
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
    } else if (clickedRole) {
      // Just select the role
      setSelectedRole(clickedRole.id)
    } else {
      // Start panning on empty space
      setIsPanning(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
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

  // Handle role click - always open the role view
  const handleRoleClick = useCallback((roleId: string) => {
    if (editMode) return
    setHoveredRole(null) // Clear hover state on click
    // Always zoom into users for this role, regardless of current view mode
    zoomToRole(roleId)
  }, [editMode, zoomToRole])

  // Clear hover state when entering edit mode
  useEffect(() => {
    if (editMode) {
      setHoveredRole(null)
    }
  }, [editMode])

  // Render role node
  const renderRoleNode = (role: Role) => {
    if (!role.position) return null
    
    const isSelected = selectedRole === role.id
    const isDragging = dragState.draggedNodeId === role.id
    
    // Compact card dimensions
    const cardWidth = 160
    const cardHeight = 80
    
    return (
      <g
        key={role.id}
        transform={`translate(${role.position.x}, ${role.position.y})`}
        className={`${isDragging ? 'opacity-50' : ''}`}
        style={{ cursor: editMode ? 'move' : 'pointer' }}
        onMouseEnter={() => !editMode && setHoveredRole(role.id)}
        onMouseLeave={() => !editMode && setHoveredRole(null)}
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
          onClick={() => handleRoleClick(role.id)}
          style={{ cursor: editMode ? 'move' : 'pointer' }}
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
        <g transform="translate(10, 12)">
          {/* Role icon */}
          <circle
            cx="12"
            cy="12"
            r="12"
            fill={role.color}
            opacity="0.15"
          />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill={role.color}
          >
            {role.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </text>
          
          {/* Role name */}
          <text
            x="32"
            y="12"
            fontSize="13"
            fontWeight="600"
            fill="#1D1D1F"
          >
            {role.name.length > 16 ? role.name.slice(0, 14) + '...' : role.name}
          </text>
          
          {/* User count */}
          <text
            x="32"
            y="26"
            fontSize="11"
            fill="#6B7280"
          >
            {role.usersCount} {role.usersCount === 1 ? 'user' : 'users'}
          </text>
        </g>
        
        
        {/* Bottom info bar */}
        <g transform={`translate(10, ${cardHeight - 22})`}>
          {/* Role level indicator */}
          <rect
            x="0"
            y="0"
            width="6"
            height="6"
            rx="1"
            fill={role.color}
            opacity="0.3"
          />
          
          {/* Shortened description */}
          <text
            x="10"
            y="5"
            fontSize="9"
            fill="#9CA3AF"
          >
            {role.description && role.description.length > 28 
              ? role.description.slice(0, 26) + '...' 
              : role.description}
          </text>
        </g>
        
        {/* Edit mode indicator */}
        {editMode && (
          <g transform={`translate(${cardWidth - 35}, ${cardHeight - 20})`}>
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
            <Link href="/lms/user-management/analytics" className="py-4 px-1 border-b-2 border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30 font-medium text-sm transition-all">
              Analytics
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
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-vergil-off-black">
                {viewState.viewMode === 'users' ? 'User Details' : 'Role Details'}
              </h3>
              {viewState.viewMode === 'users' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBackToRoles}
                >
                  ← Back to Roles
                </Button>
              )}
            </div>
            
            {/* Show Role Hover Info when hovering over a role */}
            {viewState.viewMode === 'roles' && hoveredRole && !selectedRole ? (
              <div className="space-y-4">
                {(() => {
                  const role = roles.find(r => r.id === hoveredRole)
                  if (!role) return null
                  
                  // Calculate metrics for this role
                  const roleUsers = users.filter(u => u.roleId === role.id)
                  const avgProgress = roleUsers.length > 0 
                    ? Math.round(roleUsers.reduce((sum, u) => sum + (u.completionRate || 0), 0) / roleUsers.length)
                    : 0
                  
                  // Calculate average underling progress (users in roles that report to this role)
                  const childRoles = roles.filter(r => r.parentRole === role.id)
                  const allUnderlings = users.filter(u => childRoles.some(cr => cr.id === u.roleId))
                  const avgUnderlingProgress = allUnderlings.length > 0
                    ? Math.round(allUnderlings.reduce((sum, u) => sum + (u.completionRate || 0), 0) / allUnderlings.length)
                    : 0
                  
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: role.color }}
                        >
                          {role.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-vergil-off-black">{role.name}</h4>
                          <p className="text-sm text-vergil-off-black/60">{role.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-vergil-off-black/60 mb-1">
                            {roleUsers.length === 1 ? 'User in this role' : 'Users in this role'}
                          </p>
                          <p className="text-2xl font-bold text-vergil-off-black">{roleUsers.length}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-vergil-off-black/60 mb-1">
                            {roleUsers.length === 1 ? 'Progress' : 'Average progress'}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-bold text-vergil-off-black">{avgProgress}%</p>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-vergil-purple h-2 rounded-full transition-all"
                                style={{ width: `${avgProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {childRoles.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-vergil-off-black/60 mb-1">
                              {allUnderlings.length === 1 ? 'Subordinate progress' : 'Average subordinate progress'}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xl font-bold text-vergil-off-black">{avgUnderlingProgress}%</p>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${avgUnderlingProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            console.log('Send group email to', role.name, 'team')
                          }}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {roleUsers.length === 1 ? 'Send Email' : 'Send Group Email'}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            console.log('Send group Slack message to', role.name, 'team')
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {roleUsers.length === 1 ? 'Send Slack Message' : 'Send Group Slack'}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => zoomToRole(role.id)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          {roleUsers.length === 1 ? 'View Team Member' : 'View Team Members'}
                        </Button>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : viewState.viewMode === 'users' && selectedUser ? (
              // User Details
              <div className="space-y-4">
                {(() => {
                  const user = users.find(u => u.id === selectedUser)
                  const role = user ? roles.find(r => r.id === user.roleId) : null
                  if (!user) return null
                  
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: role?.color || '#7B00FF' }}
                        >
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-vergil-off-black">{user.name}</h4>
                          <p className="text-sm text-vergil-off-black/60">{role?.name || 'Unknown Role'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-vergil-off-black/60 mb-1">Email</p>
                          <p className="text-vergil-off-black">{user.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-vergil-off-black/60 mb-1">Phone</p>
                          <p className="text-vergil-off-black">{user.phone}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-vergil-off-black/60 mb-1">Training Completion</p>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-vergil-off-black">{user.completionRate}%</p>
                            <Badge variant={
                              user.status === 'on_track' ? 'default' :
                              user.status === 'at_risk' ? 'secondary' : 'destructive'
                            }>
                              {user.status?.replace('_', ' ') || 'Unknown'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 space-y-2">
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Slack Message
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit User
                        </Button>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : viewState.viewMode === 'roles' && selectedRole ? (
              // Role Details
              <div className="space-y-4">
                {(() => {
                  const role = roles.find(r => r.id === selectedRole)
                  if (!role) return null
                  
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: role.color }}
                        >
                          {role.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-vergil-off-black">{role.name}</h4>
                          <p className="text-sm text-vergil-off-black/60">{role.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-vergil-off-black/60 mb-1">Users in this role</p>
                          <p className="text-2xl font-bold text-vergil-off-black">{role.usersCount}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-vergil-off-black/60 mb-1">Reports to</p>
                          <p className="text-vergil-off-black">
                            {role.parentRole 
                              ? roles.find(r => r.id === role.parentRole)?.name || 'Unknown'
                              : 'Top Level'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-vergil-off-black/60 mb-1">Direct reports</p>
                          <p className="text-vergil-off-black">
                            {roles.filter(r => r.parentRole === role.id).length} roles
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4 space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => zoomToRole(role.id)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Users
                        </Button>
                        <Link href="/lms/user-management/roles">
                          <Button variant="outline" className="w-full">
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Role
                          </Button>
                        </Link>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <p className="text-vergil-off-black/60 text-sm">
                {viewState.viewMode === 'users' 
                  ? 'Click on a user to view details'
                  : 'Click on a role to view details'
                }
              </p>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}