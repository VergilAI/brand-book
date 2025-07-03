import { AdminLayout } from '@/components/admin/admin-layout'
import { UserManagement } from '@/components/admin/user-management'

export default function UsersPage() {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  )
}