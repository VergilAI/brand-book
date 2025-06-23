import { AdminLayout } from '@/components/lms/admin/admin-layout'
import { CourseManagement } from '@/components/lms/admin/course-management'

export default function CoursesPage() {
  return (
    <AdminLayout>
      <CourseManagement />
    </AdminLayout>
  )
}