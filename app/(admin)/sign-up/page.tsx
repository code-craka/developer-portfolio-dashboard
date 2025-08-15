import { SignUp } from '@clerk/nextjs'
import { Suspense } from 'react'
import Link from 'next/link'

function ErrorMessage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <Suspense fallback={null}>
      <ErrorMessageContent searchParams={searchParams} />
    </Suspense>
  )
}

async function ErrorMessageContent({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  if (!params.error) return null

  let errorMessage = ''
  switch (params.error) {
    case 'unauthorized':
      errorMessage = 'Registration is restricted to authorized administrators only.'
      break
    case 'invalid_invitation':
      errorMessage = 'Invalid or expired invitation code.'
      break
    default:
      errorMessage = 'An error occurred during registration. Please try again.'
  }

  return (
    <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-lg shadow-glass animate-fade-in-up">
      <p className="text-red-400 text-sm text-center">
        {errorMessage}
      </p>
    </div>
  )
}

interface AdminSignUpPageProps {
  searchParams: Promise<{
    error?: string
    redirect?: string
  }>
}

export default async function AdminSignUpPage({ searchParams }: AdminSignUpPageProps) {
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
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 animate-glow">
            Create Admin Account
          </h1>
          <p className="text-gray-400">
            Register for admin dashboard access
          </p>
        </div>

        <ErrorMessage searchParams={searchParams} />

        {/* Enhanced Clerk SignUp with better glassmorphism */}
        <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SignUp
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
                verificationLinkStatusBox: "bg-glass-dark border-white/10",
                verificationLinkStatusText: "text-white",
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

        {/* Footer with navigation and info */}
        <div className="mt-6 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {/* Sign In Link */}
          <div className="text-center">
            <div className="p-4 bg-glass-dark backdrop-blur-md border border-white/10 rounded-lg shadow-glass">
              <p className="text-gray-400 text-sm mb-2">
                Already have an admin account?
              </p>
              <Link 
                href="/admin/login"
                className="text-electric-blue hover:text-electric-blue/80 transition-colors duration-200 font-medium"
              >
                Sign in to your dashboard
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <div className="p-4 bg-glass-dark backdrop-blur-md border border-white/10 rounded-lg shadow-glass">
              <p className="text-xs text-gray-500 mb-2">
                Admin registration requires authorization. Contact the system administrator if you need access.
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
    </div>
  )
}