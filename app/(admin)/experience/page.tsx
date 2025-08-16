import { requireAdminAuth } from '@/lib/clerk'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'
import ExperienceManager from '@/components/admin/ExperienceManager'

export default async function ExperiencePage() {
  // Require admin authentication
  await requireAdminAuth()

  return (
    <AdminLayoutWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExperienceManager />
      </div>
    </AdminLayoutWrapper>
  )
}