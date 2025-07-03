import { AdminLayout } from '@/components/admin/admin-layout'
import { CourseManagement } from '@/components/admin/course-management'

export default function CoursesPage() {
  return (
    <AdminLayout>
      <CourseManagement />
    </AdminLayout>
  )
}