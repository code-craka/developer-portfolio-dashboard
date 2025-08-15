'use client'

import { UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationItem {
  name: string
  href: string
  icon: React.ReactNode
  current?: boolean
}

export default function AdminNavigation() {
  const { user } = useUser()
  const pathname = usePathname()

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
    },
    {
      name: 'Projects',
      href: '/admin/projects',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      name: 'Experience',
      href: '/admin/experience',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ),
    },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
    },
    {
      name: 'Profile',
      href: '/admin/profile',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
  ]

  // Mark current navigation item
  const navigationWithCurrent = navigation.map(item => ({
    ...item,
    current: pathname === item.href
  }))

  return (
    <header className="bg-glass-dark backdrop-blur-xl border-b border-white/10 shadow-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-electric-gradient rounded-lg flex items-center justify-center shadow-electric group-hover:shadow-electric-lg transition-all duration-200">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-white group-hover:text-electric-blue transition-colors duration-200">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-400">Portfolio Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-1">
            {navigationWithCurrent.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${item.current
                    ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <div className="text-gray-300 font-medium text-sm">
                Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
              </div>
              <div className="text-xs text-gray-400 flex items-center justify-end space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Admin Access</span>
              </div>
            </div>
            
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-electric-blue/30 hover:ring-electric-blue/50 transition-all duration-200",
                  userButtonPopoverCard: "bg-glass-dark backdrop-blur-xl border border-white/10 shadow-glass-lg",
                  userButtonPopoverActionButton: "text-white hover:bg-white/10 transition-all duration-200",
                  userButtonPopoverActionButtonText: "text-white",
                  userButtonPopoverActionButtonIcon: "text-gray-400",
                  userButtonPopoverFooter: "border-t border-white/10",
                  userPreviewTextContainer: "text-white",
                  userPreviewMainIdentifier: "text-white font-medium",
                  userPreviewSecondaryIdentifier: "text-gray-400",
                }
              }}
              showName={false}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <nav className="flex space-x-1 overflow-x-auto">
            {navigationWithCurrent.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${item.current
                    ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}