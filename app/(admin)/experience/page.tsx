import { Metadata } from 'next'
import { requireAdminAuth } from '@/lib/clerk'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'
import ExperienceManager from '@/components/admin/ExperienceManager'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Manage Experience',
  description: 'Admin interface for managing work experience and career timeline.',
  url: '/experience',
  noIndex: true,
})

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