import { AdminLayout } from '@/components/lms/admin/admin-layout'
import { UserManagement } from '@/components/lms/admin/user-management'

export default function UsersPage() {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  )
}