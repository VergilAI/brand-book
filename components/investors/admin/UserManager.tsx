'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Trash2, Shield, User } from 'lucide-react';
import { AdminFormField, AdminFormGrid } from './AdminLayout';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'investor';
  createdAt: string;
  lastLogin: string | null;
}

export function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'investor' as 'admin' | 'investor'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/investors/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/investors/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ email: '', password: '', name: '', role: 'investor' });
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/investors/users?id=${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <Card variant="default" className="p-4 lg:p-6 bg-white border-gray-200 shadow-sm">
        <h3 className="text-lg lg:text-xl font-display font-medium text-gray-900 mb-4">Create New User</h3>
        <form onSubmit={createUser} className="space-y-4">
          <AdminFormGrid columns={2}>
            <AdminFormField label="Name">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="bg-white border-gray-300 text-gray-900 focus:border-cosmic-purple"
                required
              />
            </AdminFormField>
            <AdminFormField label="Email">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                className="bg-white border-gray-300 text-gray-900 focus:border-cosmic-purple"
                required
              />
            </AdminFormField>
            <AdminFormField label="Password">
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Secure password"
                className="bg-white border-gray-300 text-gray-900 focus:border-cosmic-purple"
                required
                minLength={8}
              />
            </AdminFormField>
            <AdminFormField label="Role">
              <Select value={formData.role} onValueChange={(value: 'admin' | 'investor') => setFormData({ ...formData, role: value })}>
                <SelectTrigger id="role" className="bg-white border-gray-300 text-gray-900 focus:border-cosmic-purple">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investor">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Investor
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </AdminFormField>
          </AdminFormGrid>
          <Button type="submit" disabled={creating} className="w-full sm:w-auto bg-cosmic-purple hover:bg-cosmic-purple/80">
            <UserPlus className="w-4 h-4 mr-2" />
            {creating ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </Card>

      <Card variant="default" className="p-4 lg:p-6 bg-white border-gray-200 shadow-sm">
        <h3 className="text-lg lg:text-xl font-display font-medium text-gray-900 mb-4">User List</h3>
        <div className="space-y-2">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found</p>
          ) : (
            users.map((user) => (
              <div 
                key={user.id} 
                className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        {user.role === 'admin' ? (
                          <Shield className="w-5 h-5 text-gray-700" />
                        ) : (
                          <User className="w-5 h-5 text-gray-700" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium ${
                          user.role === 'admin' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}>
                          {user.role === 'admin' ? 'Administrator' : 'Investor'}
                        </span>
                      </div>
                    </div>
                    {user.email !== 'admin@vergil.ai' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 -mt-1 sm:mt-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-between items-center pl-13 sm:pl-0">
                    <div className="text-sm">
                      <span className="text-gray-600">Last login: </span>
                      <span className="text-gray-900">{formatDate(user.lastLogin)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}