import { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          // Global Clerk component styling for admin area
          rootBox: "font-sans",
          card: "bg-glass-dark backdrop-blur-xl border border-white/10 shadow-glass-lg",
          headerTitle: "text-white font-semibold",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200",
          formButtonPrimary: "bg-electric-gradient text-black hover:shadow-electric transition-all duration-200 font-semibold",
          formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-electric-blue/50 focus:ring-2 focus:ring-electric-blue/20 transition-all duration-200",
          formFieldLabel: "text-gray-300 font-medium",
          footerActionLink: "text-electric-blue hover:text-electric-blue/80 transition-colors duration-200",
          userButtonPopoverCard: "bg-glass-dark backdrop-blur-xl border border-white/10 shadow-glass-lg",
          userButtonPopoverActionButton: "text-white hover:bg-white/10 transition-all duration-200",
          userButtonPopoverActionButtonText: "text-white",
          userButtonPopoverFooter: "border-t border-white/10",
          userButtonPopoverActionButtonIcon: "text-gray-400",
          userPreviewTextContainer: "text-white",
          userPreviewMainIdentifier: "text-white font-medium",
          userPreviewSecondaryIdentifier: "text-gray-400",
        },
        variables: {
          colorPrimary: "#00D4FF",
          colorBackground: "rgba(0, 0, 0, 0.2)",
          colorInputBackground: "rgba(255, 255, 255, 0.1)",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#9CA3AF",
          borderRadius: "0.5rem",
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}