'use client'

import { ScrollAnimation } from '../ui/PageTransition'

export default function AboutSection() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-electric-blue bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="w-20 h-1 bg-electric-blue mx-auto rounded-full" />
          </div>
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollAnimation delay={0.2}>
            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                I&apos;m a passionate full-stack developer with expertise in modern web technologies. 
                I love creating beautiful, functional, and user-friendly applications that solve real-world problems.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                With a strong foundation in both frontend and backend development, I enjoy working 
                with cutting-edge technologies and continuously learning new skills to stay ahead in 
                the ever-evolving tech landscape.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-electric-blue">50+</div>
                  <div className="text-gray-400 text-sm">Projects</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-electric-blue">3+</div>
                  <div className="text-gray-400 text-sm">Years Experience</div>
                </div>
                <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-electric-blue">20+</div>
                  <div className="text-gray-400 text-sm">Technologies</div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.4} direction="right">
            <div className="relative">
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-electric-blue/20 to-transparent rounded-full flex items-center justify-center border border-electric-blue/30">
                <div className="w-64 h-64 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10">
                  <div className="text-6xl text-electric-blue">👨‍💻</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-transparent rounded-full blur-xl" />
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}