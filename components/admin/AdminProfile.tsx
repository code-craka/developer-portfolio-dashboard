'use client'

import { UserProfile } from '@clerk/nextjs'

export default function AdminProfile() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-glass-dark backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass-lg">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 text-electric-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Admin Profile Settings
        </h1>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent border-none shadow-none",
                navbar: "bg-white/5 border-white/10",
                navbarButton: "text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200",
                navbarButtonIcon: "text-gray-400",
                pageScrollBox: "bg-transparent",
                page: "bg-transparent",
                headerTitle: "text-white font-semibold",
                headerSubtitle: "text-gray-400",
                formButtonPrimary: "bg-electric-gradient text-black hover:shadow-electric transition-all duration-200 font-semibold",
                formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-electric-blue/50 focus:ring-2 focus:ring-electric-blue/20 transition-all duration-200",
                formFieldLabel: "text-gray-300 font-medium",
                formFieldSuccessText: "text-green-400",
                formFieldErrorText: "text-red-400",
                formFieldWarningText: "text-yellow-400",
                identityPreviewText: "text-gray-300",
                identityPreviewEditButton: "text-electric-blue hover:text-electric-blue/80",
                profileSectionTitle: "text-white font-semibold",
                profileSectionContent: "text-gray-300",
                badge: "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
                avatarImageActionsUpload: "bg-electric-gradient text-black hover:shadow-electric",
                avatarImageActionsRemove: "text-red-400 hover:text-red-300",
                fileDropAreaBox: "border-white/20 bg-white/5",
                fileDropAreaText: "text-gray-300",
                fileDropAreaHint: "text-gray-400",
                accordionTriggerButton: "text-white hover:bg-white/10 border-white/10",
                accordionContent: "bg-white/5 border-white/10",
                menuButton: "text-gray-300 hover:text-white hover:bg-white/10",
                menuList: "bg-glass-dark backdrop-blur-xl border-white/10 shadow-glass-lg",
                menuItem: "text-white hover:bg-white/10",
              },
              variables: {
                colorPrimary: "#00D4FF",
                colorBackground: "transparent",
                colorInputBackground: "rgba(255, 255, 255, 0.1)",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#9CA3AF",
                borderRadius: "0.5rem",
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}