'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Shield, Users, MoreVertical, Palette, X, Check, Lock } from 'lucide-react'
import { UserManagementHeader } from '@/components/user-management-header'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'
import { Checkbox } from '@/components/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Role, initialRoles, calculateNewRolePosition } from '@/lib/lms/roles-data'
import { updateRoleUserCounts } from '@/lib/lms/mock-data'

interface Privilege {
  id: string
  name: string
  description: string
  category: string
}

const predefinedColors = [
  '#7B00FF', '#0087FF', '#10B981', '#FFC700', '#E51C23',
  '#6366F1', '#EC4899', '#8B5CF6', '#059669', '#DC2626'
]

const availablePrivileges: Privilege[] = [
  // User Management
  { id: 'user_view', name: 'View Users', description: 'View user profiles and information', category: 'User Management' },
  { id: 'user_create', name: 'Create Users', description: 'Create new user accounts', category: 'User Management' },
  { id: 'user_edit', name: 'Edit Users', description: 'Modify user information and settings', category: 'User Management' },
  { id: 'user_delete', name: 'Delete Users', description: 'Remove user accounts from the system', category: 'User Management' },
  { id: 'user_roles', name: 'Manage User Roles', description: 'Assign and modify user roles', category: 'User Management' },
  
  // Course Management
  { id: 'course_view', name: 'View Courses', description: 'Access and view course content', category: 'Course Management' },
  { id: 'course_create', name: 'Create Courses', description: 'Create new courses and learning materials', category: 'Course Management' },
  { id: 'course_edit', name: 'Edit Courses', description: 'Modify existing course content', category: 'Course Management' },
  { id: 'course_delete', name: 'Delete Courses', description: 'Remove courses from the system', category: 'Course Management' },
  { id: 'course_assign', name: 'Assign Courses', description: 'Assign courses to users', category: 'Course Management' },
  
  // Analytics & Reports
  { id: 'analytics_view', name: 'View Analytics', description: 'Access analytics dashboards', category: 'Analytics & Reports' },
  { id: 'reports_generate', name: 'Generate Reports', description: 'Create custom reports', category: 'Analytics & Reports' },
  { id: 'reports_export', name: 'Export Reports', description: 'Export data and reports', category: 'Analytics & Reports' },
  
  // System Administration
  { id: 'system_settings', name: 'System Settings', description: 'Modify system configuration', category: 'System Administration' },
  { id: 'role_manage', name: 'Manage Roles', description: 'Create and modify roles', category: 'System Administration' },
  { id: 'privilege_manage', name: 'Manage Privileges', description: 'Assign privileges to roles', category: 'System Administration' },
  { id: 'backup_restore', name: 'Backup & Restore', description: 'System backup and restoration', category: 'System Administration' },
  
  // Content Management
  { id: 'content_upload', name: 'Upload Content', description: 'Upload files and media', category: 'Content Management' },
  { id: 'content_moderate', name: 'Moderate Content', description: 'Review and approve content', category: 'Content Management' },
  { id: 'content_delete', name: 'Delete Content', description: 'Remove content from the system', category: 'Content Management' }
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(updateRoleUserCounts(initialRoles))
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [showPrivilegesModal, setShowPrivilegesModal] = useState(false)
  const [selectedRoleForPrivileges, setSelectedRoleForPrivileges] = useState<Role | null>(null)
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([])
  const [privilegesSaved, setPrivilegesSaved] = useState(false)
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    color: '#7B00FF',
    description: '',
    parentRole: ''
  })
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateRole = () => {
    if (newRole.name) {
      const position = calculateNewRolePosition(roles, newRole.parentRole)
      const role: Role = {
        id: Date.now().toString(),
        name: newRole.name,
        color: newRole.color || '#7B00FF',
        description: newRole.description,
        usersCount: 0,
        parentRole: newRole.parentRole,
        privileges: [],
        createdAt: new Date().toISOString(),
        position: position
      }
      setRoles([...roles, role])
      setNewRole({ name: '', color: '#7B00FF', description: '', parentRole: '' })
      setShowCreateModal(false)
    }
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId))
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setShowEditModal(true)
  }

  const handleSaveEditedRole = () => {
    if (editingRole && editingRole.name) {
      setRoles(roles.map(role => 
        role.id === editingRole.id ? editingRole : role
      ))
      setEditingRole(null)
      setShowEditModal(false)
    }
  }

  const handleOpenPrivileges = (role: Role) => {
    setSelectedRoleForPrivileges(role)
    // Filter out any privileges that don't exist in availablePrivileges
    const validPrivilegeIds = availablePrivileges.map(p => p.id)
    const validPrivileges = (role.privileges || []).filter(p => 
      p === 'all' || validPrivilegeIds.includes(p)
    )
    setSelectedPrivileges(validPrivileges)
    setPrivilegesSaved(false)
    setShowPrivilegesModal(true)
  }

  const handleSavePrivileges = () => {
    if (selectedRoleForPrivileges) {
      setRoles(roles.map(role => 
        role.id === selectedRoleForPrivileges.id 
          ? { ...role, privileges: selectedPrivileges }
          : role
      ))
      setPrivilegesSaved(true)
      // Update the selectedRoleForPrivileges with new privileges
      setSelectedRoleForPrivileges({
        ...selectedRoleForPrivileges,
        privileges: selectedPrivileges
      })
    }
  }

  const togglePrivilege = (privilegeId: string) => {
    setSelectedPrivileges(prev =>
      prev.includes(privilegeId)
        ? prev.filter(id => id !== privilegeId)
        : [...prev, privilegeId]
    )
    setPrivilegesSaved(false)
  }

  const groupedPrivileges = availablePrivileges.reduce((acc, privilege) => {
    if (!acc[privilege.category]) {
      acc[privilege.category] = []
    }
    acc[privilege.category].push(privilege)
    return acc
  }, {} as Record<string, Privilege[]>)

  return (
    <div className="min-h-screen bg-vergil-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Tabs */}
        <UserManagementHeader />

        {/* Roles Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-vergil-off-black">Organization Roles</h2>
              <p className="text-vergil-off-black/60 mt-1">Define roles and their privileges</p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-vergil-purple hover:bg-vergil-purple-lighter"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="p-4">
            <Input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </Card>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map(role => (
            <Card key={role.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: role.color + '20' }}
                    >
                      <Shield className="w-6 h-6" style={{ color: role.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-vergil-off-black">{role.name}</h3>
                      <p className="text-sm text-vergil-off-black/60">{role.description}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditRole(role)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenPrivileges(role)}>
                        <Shield className="w-4 h-4 mr-2" />
                        Manage Privileges
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-vergil-error"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-vergil-off-black/40" />
                      <span className="text-vergil-off-black/60">{role.usersCount} users</span>
                    </div>
                    
                    {role.parentRole && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-vergil-off-black/40" />
                        <span className="text-vergil-off-black/60">
                          Reports to: {roles.find(r => r.id === role.parentRole)?.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2"
                        style={{ 
                          backgroundColor: role.color,
                          borderColor: role.color 
                        }}
                      />
                      <span className="text-sm text-vergil-off-black/60">Role Color</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => handleOpenPrivileges(role)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Manage Privileges
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Role Modal */}
        {showCreateModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <Card 
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-vergil-off-black">Create New Role</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-1">
                      Role Name
                    </label>
                    <Input
                      value={newRole.name || ''}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="e.g., Department Head"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-1">
                      Description
                    </label>
                    <Input
                      value={newRole.description || ''}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Brief description of the role"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-1">
                      Reports To
                    </label>
                    <Select
                      value={newRole.parentRole || 'none'}
                      onValueChange={(value) => setNewRole({ ...newRole, parentRole: value === 'none' ? undefined : value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="None (Top Level)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>
                        {roles.filter(r => r.id !== newRole.id).map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-sm text-vergil-off-black/60">
                      Select which role this position reports to
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-3">
                      Role Color
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewRole({ ...newRole, color })}
                          className="w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center"
                          style={{ 
                            backgroundColor: color,
                            borderColor: newRole.color === color ? '#1D1D1F' : 'transparent'
                          }}
                        >
                          {newRole.color === color && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateRole}
                    className="flex-1 bg-vergil-purple hover:bg-vergil-purple-lighter"
                    disabled={!newRole.name}
                  >
                    Create Role
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditModal && editingRole && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowEditModal(false)
              setEditingRole(null)
            }}
          >
            <Card 
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-vergil-off-black">Edit Role</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingRole(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-1">
                      Role Name
                    </label>
                    <Input
                      value={editingRole.name}
                      onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                      placeholder="e.g., Department Head"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-1">
                      Description
                    </label>
                    <Input
                      value={editingRole.description || ''}
                      onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                      placeholder="Brief description of the role"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-1">
                      Reports To
                    </label>
                    <Select
                      value={editingRole.parentRole || 'none'}
                      onValueChange={(value) => setEditingRole({ ...editingRole, parentRole: value === 'none' ? undefined : value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="None (Top Level)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>
                        {roles.filter(r => r.id !== editingRole.id).map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-sm text-vergil-off-black/60">
                      Select which role this position reports to
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-3">
                      Role Color
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setEditingRole({ ...editingRole, color })}
                          className="w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center"
                          style={{ 
                            backgroundColor: color,
                            borderColor: editingRole.color === color ? '#1D1D1F' : 'transparent'
                          }}
                        >
                          {editingRole.color === color && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingRole(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEditedRole}
                    className="flex-1 bg-vergil-purple hover:bg-vergil-purple-lighter"
                    disabled={!editingRole.name}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Manage Privileges Modal */}
        {showPrivilegesModal && selectedRoleForPrivileges && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowPrivilegesModal(false)
              setSelectedRoleForPrivileges(null)
              setSelectedPrivileges([])
              setPrivilegesSaved(false)
            }}
          >
            <Card 
              className="w-full max-w-3xl max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-vergil-off-black">Manage Privileges</h3>
                    <p className="text-sm text-vergil-off-black/60 mt-1">
                      Configure privileges for {selectedRoleForPrivileges.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPrivilegesModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {Object.entries(groupedPrivileges).map(([category, privileges]) => (
                    <div key={category}>
                      <h4 className="font-medium text-vergil-off-black mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-vergil-off-black/40" />
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {privileges.map(privilege => (
                          <label
                            key={privilege.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-vergil-off-white/50 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={selectedPrivileges.includes('all') || selectedPrivileges.includes(privilege.id)}
                              onCheckedChange={() => togglePrivilege(privilege.id)}
                              className="mt-0.5"
                              disabled={selectedRoleForPrivileges.id === '1' || selectedPrivileges.includes('all')}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-vergil-off-black text-sm">
                                {privilege.name}
                              </p>
                              <p className="text-sm text-vergil-off-black/60">
                                {privilege.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special handling for Super Admin */}
                {selectedRoleForPrivileges.id === '1' && (
                  <div className="mt-6 p-4 bg-vergil-purple/5 rounded-lg border border-vergil-purple/20">
                    <p className="text-sm text-vergil-purple flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Super Admin has all privileges by default and cannot be modified
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-vergil-off-black/60">
                    {selectedPrivileges.includes('all') 
                      ? 'All privileges selected' 
                      : `${selectedPrivileges.length} privileges selected`}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPrivilegesModal(false)
                        setSelectedRoleForPrivileges(null)
                        setSelectedPrivileges([])
                        setPrivilegesSaved(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSavePrivileges}
                      className={privilegesSaved ? "bg-gray-400 cursor-not-allowed" : "bg-vergil-purple hover:bg-vergil-purple-lighter"}
                      disabled={selectedRoleForPrivileges.id === '1' || privilegesSaved}
                    >
                      {privilegesSaved ? 'Privileges Saved' : 'Save Privileges'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}