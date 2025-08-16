import { requireAdminAuth } from '@/lib/clerk'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'
import ProjectsManager from '@/components/admin/ProjectsManager'

export default async function ProjectsPage() {
  // Require admin authentication
  await requireAdminAuth()

  return (
    <AdminLayoutWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Project Management</h1>
          <p className="text-gray-400">
            Manage your portfolio projects, add new work, and showcase your skills
          </p>
        </div>
        
        <ProjectsManager />
      </div>
    </AdminLayoutWrapper>
  )
}