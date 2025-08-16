'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  name: string
  href: string
  current: boolean
}

export default function AdminBreadcrumb() {
  const pathname = usePathname()

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    const breadcrumbs: BreadcrumbItem[] = []

    // Always start with Dashboard
    breadcrumbs.push({
      name: 'Dashboard',
      href: '/dashboard',
      current: pathname === '/dashboard'
    })

    // Add additional segments
    if (pathSegments.length > 1) {
      const currentSegment = pathSegments[pathSegments.length - 1]
      
      // Map path segments to readable names
      const segmentNames: Record<string, string> = {
        'projects': 'Projects',
        'experience': 'Experience',
        'messages': 'Messages',
        'profile': 'Profile',
        'settings': 'Settings'
      }

      const segmentName = segmentNames[currentSegment] || currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1)
      
      breadcrumbs.push({
        name: segmentName,
        href: `/${currentSegment}`,
        current: true
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null // Don't show breadcrumbs on dashboard
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <div className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <div key={item.href} className="flex items-center space-x-2">
            {index > 0 && (
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            
            {item.current ? (
              <span className="text-electric-blue font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}