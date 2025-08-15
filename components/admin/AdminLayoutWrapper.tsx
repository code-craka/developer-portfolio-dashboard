import { ReactNode } from 'react'
import AdminNavigation from './AdminNavigation'

interface AdminLayoutWrapperProps {
  children: ReactNode
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  return (
    <div className="min-h-screen">
      <AdminNavigation />
      <main>
        {children}
      </main>
    </div>
  )
}