'use client'

import { ScrollAnimation } from '../ui/PageTransition'

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-electric-blue bg-clip-text text-transparent">
              Work Experience
            </h2>
            <div className="w-20 h-1 bg-electric-blue mx-auto rounded-full" />
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              My professional journey and key achievements
            </p>
          </div>
        </ScrollAnimation>
        
        <ScrollAnimation delay={0.2}>
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-white mb-2">Experience Timeline Coming Soon</h3>
            <p className="text-gray-400">
              Dynamic experience timeline will be implemented in a future task
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}