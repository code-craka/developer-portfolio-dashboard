import { Metadata } from 'next'
import PortfolioLayout from '@/components/ui/PortfolioLayout'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ContactSection from '@/components/sections/ContactSection'
import FloatingActions from '@/components/ui/FloatingActions'
import { AnimationPerformanceMonitor } from '@/components/ui/AnimationOptimizer'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Home',
  description: 'Professional developer portfolio showcasing modern web applications, full-stack projects, and technical expertise. Explore my work, experience, and skills in React, Next.js, TypeScript, and more.',
  url: '/',
})

export default function Home() {
  return (
    <PortfolioLayout>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <FloatingActions />
      <AnimationPerformanceMonitor />
    </PortfolioLayout>
  )
}