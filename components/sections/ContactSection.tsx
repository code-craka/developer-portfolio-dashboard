'use client'

import { ScrollAnimation } from '../ui/PageTransition'

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-electric-blue bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="w-20 h-1 bg-electric-blue mx-auto rounded-full" />
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Let&apos;s discuss your next project or collaboration opportunity
            </p>
          </div>
        </ScrollAnimation>
        
        <ScrollAnimation delay={0.2}>
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-xl font-semibold text-white mb-2">Contact Form Coming Soon</h3>
            <p className="text-gray-400">
              Interactive contact form will be implemented in a future task
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}