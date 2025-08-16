import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { generateMetadata as generateSEOMetadata, generatePersonSchema, generateWebsiteSchema } from '@/lib/seo'
import PerformanceMonitor from '@/components/ui/PerformanceMonitor'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import ToastProvider from '@/components/ui/ToastProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = generateSEOMetadata({})

// Check if we have the required Clerk environment variables
const hasClerkKeys = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personSchema = generatePersonSchema()
  const websiteSchema = generateWebsiteSchema()

  // If Clerk keys are missing (e.g., during build without env vars), render without ClerkProvider
  if (!hasClerkKeys) {
    return (
      <html lang="en" className="dark">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(personSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
        </head>
        <body className={`${inter.className} bg-dark-bg text-white`}>
          <ErrorBoundary>
            <ToastProvider>
              <PerformanceMonitor />
              {children}
            </ToastProvider>
          </ErrorBoundary>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#00D4FF',
          colorBackground: '#0A0A0A',
          colorInputBackground: 'rgba(255, 255, 255, 0.05)',
          colorInputText: '#FFFFFF',
          colorText: '#FFFFFF',
          colorTextSecondary: '#A0A0A0',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: 
            'bg-electric-blue hover:bg-electric-blue/80 text-black font-medium transition-all duration-200',
          card: 
            'bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl',
          headerTitle: 
            'text-white',
          headerSubtitle: 
            'text-gray-400',
          socialButtonsBlockButton: 
            'bg-white/5 border-white/10 text-white hover:bg-white/10',
          formFieldInput: 
            'bg-white/5 border-white/10 text-white placeholder:text-gray-400',
          footerActionLink: 
            'text-electric-blue hover:text-electric-blue/80',
        },
      }}
    >
      <html lang="en" className="dark">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(personSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
        </head>
        <body className={`${inter.className} bg-dark-bg text-white`}>
          <ErrorBoundary>
            <ToastProvider>
              <PerformanceMonitor />
              {children}
            </ToastProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  )
}