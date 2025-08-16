import React from 'react'
import { Metadata } from 'next'
import { SignIn } from '@clerk/nextjs'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Admin Login',
  description: 'Admin login page for portfolio dashboard access.',
  url: '/login',
  noIndex: true,
})

async function ErrorMessage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  if (!params.error) return null

  let errorMessage = ''
  switch (params.error) {
    case 'unauthorized':
      errorMessage = 'You do not have admin access to this dashboard.'
      break
    case 'session_expired':
      errorMessage = 'Your session has expired. Please sign in again.'
      break
    default:
      errorMessage = 'An error occurred. Please try signing in again.'
  }

  return (
    <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-lg shadow-glass animate-fade-in-up">
      <p className="text-red-400 text-sm text-center">
        {errorMessage}
      </p>
    </div>
  )
}



interface AdminLoginPageProps {
  searchParams: Promise<{
    error?: string
    redirect?: string
  }>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-electric-blue/10 rounded-full blur-3xl animate-pulse-electric"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-electric-blue/5 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with glassmorphism */}
        <div className="text-center mb-8 p-6 bg-glass-dark backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass-lg animate-fade-in-up">
          <div className="w-16 h-16 bg-electric-gradient rounded-full mx-auto mb-4 flex items-center justify-center shadow-electric">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 animate-glow">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Sign in to manage your portfolio
          </p>
        </div>

        <ErrorMessage searchParams={searchParams} />

        {/* Enhanced Clerk SignIn with better glassmorphism */}
        <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SignIn
            forceRedirectUrl={params.redirect || '/admin/dashboard'}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full bg-glass-dark backdrop-blur-xl border border-white/10 shadow-glass-lg rounded-2xl overflow-hidden",
                headerTitle: "text-white text-xl font-semibold",
                headerSubtitle: "text-gray-400 text-sm",
                socialButtonsBlockButton: "bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200 rounded-lg",
                socialButtonsBlockButtonText: "text-white font-medium",
                dividerLine: "bg-white/20",
                dividerText: "text-gray-400",
                formButtonPrimary: "bg-electric-gradient text-black hover:shadow-electric transition-all duration-200 font-semibold rounded-lg",
                formFieldInput: "bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 rounded-lg focus:border-electric-blue/50 focus:ring-2 focus:ring-electric-blue/20 transition-all duration-200",
                formFieldLabel: "text-gray-300 font-medium",
                identityPreviewText: "text-gray-300",
                identityPreviewEditButton: "text-electric-blue hover:text-electric-blue/80",
                formFieldAction: "text-electric-blue hover:text-electric-blue/80 transition-colors duration-200",
                footerActionLink: "text-electric-blue hover:text-electric-blue/80 transition-colors duration-200",
                alternativeMethodsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all duration-200 rounded-lg",
                alternativeMethodsBlockButtonText: "text-white",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-white transition-colors duration-200",
                formFieldSuccessText: "text-green-400",
                formFieldErrorText: "text-red-400",
                formFieldWarningText: "text-yellow-400",
                otpCodeFieldInput: "bg-white/10 border-white/20 text-white rounded-lg focus:border-electric-blue/50",
                formResendCodeLink: "text-electric-blue hover:text-electric-blue/80",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
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

        {/* Footer with additional info */}
        <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="p-4 bg-glass-dark backdrop-blur-md border border-white/10 rounded-lg shadow-glass">
            <p className="text-xs text-gray-500 mb-2">
              Only authorized administrators can access this dashboard.
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secured by Clerk Authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}