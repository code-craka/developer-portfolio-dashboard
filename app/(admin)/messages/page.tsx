import { requireAdminAuth } from '@/lib/clerk'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'
import ContactMessagesManager from '@/components/admin/ContactMessagesManager'

export default async function MessagesPage() {
  // Require admin authentication
  await requireAdminAuth()

  return (
    <AdminLayoutWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContactMessagesManager />
      </div>
    </AdminLayoutWrapper>
  )
}