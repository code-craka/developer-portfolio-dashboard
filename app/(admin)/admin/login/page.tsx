import { SignIn } from '@clerk/nextjs'
import { Suspense } from 'react'

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
      errorMessage = 'You do not have admin access to this dashboard.'
      break
    case 'session_expired':
      errorMessage = 'Your session has expired. Please sign in again.'
      break
    default:
      errorMessage = 'An error occurred. Please try signing in again.'
  }

  return (
    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-bg/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Sign in to manage your portfolio
          </p>
        </div>

        <ErrorMessage searchParams={searchParams} />

        <div className="flex justify-center">
          <SignIn
            redirectUrl={params.redirect || '/admin/dashboard'}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
                formButtonPrimary: "bg-electric-blue text-black hover:bg-electric-blue/80",
                formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-gray-400",
                formFieldLabel: "text-gray-300",
                identityPreviewText: "text-gray-300",
                formFieldAction: "text-electric-blue hover:text-electric-blue/80",
              }
            }}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Only authorized administrators can access this dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}