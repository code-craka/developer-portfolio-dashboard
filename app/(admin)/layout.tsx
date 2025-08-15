import { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ClerkProvider>
      <div className="min-h-screen bg-dark-bg">
        {children}
      </div>
    </ClerkProvider>
  )
}