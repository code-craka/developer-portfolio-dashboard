import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Developer Portfolio',
  description: 'Modern developer portfolio with admin dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
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
        <body className={`${inter.className} bg-dark-bg text-white`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}