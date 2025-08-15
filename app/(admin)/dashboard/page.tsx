import { requireAdminAuth, getCurrentAdmin } from '@/lib/clerk'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'

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
    <AdminLayoutWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-glass-dark backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {clerkUser.firstName || 'Admin'}! 👋
                </h2>
                <p className="text-gray-400">
                  Manage your portfolio content and track your progress
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-electric-gradient rounded-full flex items-center justify-center shadow-electric animate-pulse-electric">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Projects Card */}
          <div className="bg-glass-dark backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass hover:shadow-glass-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">0</div>
                <div className="text-xs text-gray-500">Projects</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Projects</h3>
            <p className="text-gray-400 mb-4 text-sm">Manage your portfolio projects and showcase your work</p>
            <button className="w-full bg-electric-gradient text-black px-4 py-2 rounded-lg font-semibold hover:shadow-electric transition-all duration-200 group-hover:scale-105">
              Manage Projects
            </button>
          </div>

          {/* Experiences Card */}
          <div className="bg-glass-dark backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass hover:shadow-glass-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">0</div>
                <div className="text-xs text-gray-500">Experiences</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Experience</h3>
            <p className="text-gray-400 mb-4 text-sm">Update your work experience and career timeline</p>
            <button className="w-full bg-electric-gradient text-black px-4 py-2 rounded-lg font-semibold hover:shadow-electric transition-all duration-200 group-hover:scale-105">
              Manage Experience
            </button>
          </div>

          {/* Messages Card */}
          <div className="bg-glass-dark backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass hover:shadow-glass-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">0</div>
                <div className="text-xs text-gray-500">Messages</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Messages</h3>
            <p className="text-gray-400 mb-4 text-sm">View and respond to contact form submissions</p>
            <button className="w-full bg-electric-gradient text-black px-4 py-2 rounded-lg font-semibold hover:shadow-electric transition-all duration-200 group-hover:scale-105">
              View Messages
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-glass-dark backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass-lg">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg className="w-5 h-5 text-electric-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-electric-blue">0</div>
                  <div className="text-gray-400 text-sm">Total Projects</div>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-electric-blue">0</div>
                  <div className="text-gray-400 text-sm">Work Experiences</div>
                </div>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-electric-blue">0</div>
                  <div className="text-gray-400 text-sm">Unread Messages</div>
                </div>
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-electric-blue">0</div>
                  <div className="text-gray-400 text-sm">Total Views</div>
                </div>
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  )
}