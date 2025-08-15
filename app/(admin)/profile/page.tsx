import { requireAdminAuth } from '@/lib/clerk'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'
import AdminProfile from '@/components/admin/AdminProfile'

export default async function AdminProfilePage() {
  // Require admin authentication and role verification
  await requireAdminAuth()

  return (
    <AdminLayoutWrapper>
      <AdminProfile />
    </AdminLayoutWrapper>
  )
}