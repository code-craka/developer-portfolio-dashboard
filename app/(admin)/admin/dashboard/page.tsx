import { UserButton } from '@clerk/nextjs'
import { requireAdminAuth, getCurrentAdmin } from '@/app/lib/clerk'

export default async function AdminDashboard() {
  // Require admin authentication and role verification
  await requireAdminAuth()
  
  // Get current admin data
  const adminContext = await getCurrentAdmin()
  
  if (!adminContext?.clerkUser) {
    // This shouldn't happen due to requireAdminAuth, but just in case
    throw new Error('Authentication failed')
  }
  
  const { clerkUser, adminData } = adminContext

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-white">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-gray-300">
                  Welcome, {clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress}
                </div>
                {adminData && (
                  <div className="text-xs text-gray-400">
                    Role: {adminData.role}
                  </div>
                )}
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-black/90 backdrop-blur-xl border border-white/10",
                    userButtonPopoverActionButton: "text-white hover:bg-white/10",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Card */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-2">Projects</h3>
            <p className="text-gray-400 mb-4">Manage your portfolio projects</p>
            <button className="bg-electric-blue text-black px-4 py-2 rounded-md font-medium hover:bg-electric-blue/80 transition-colors">
              Manage Projects
            </button>
          </div>

          {/* Experiences Card */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-2">Experience</h3>
            <p className="text-gray-400 mb-4">Update your work experience</p>
            <button className="bg-electric-blue text-black px-4 py-2 rounded-md font-medium hover:bg-electric-blue/80 transition-colors">
              Manage Experience
            </button>
          </div>

          {/* Messages Card */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-2">Messages</h3>
            <p className="text-gray-400 mb-4">View contact form submissions</p>
            <button className="bg-electric-blue text-black px-4 py-2 rounded-md font-medium hover:bg-electric-blue/80 transition-colors">
              View Messages
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-electric-blue">0</div>
              <div className="text-gray-400">Total Projects</div>
            </div>
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-electric-blue">0</div>
              <div className="text-gray-400">Work Experiences</div>
            </div>
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-electric-blue">0</div>
              <div className="text-gray-400">Unread Messages</div>
            </div>
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-electric-blue">0</div>
              <div className="text-gray-400">Total Views</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}