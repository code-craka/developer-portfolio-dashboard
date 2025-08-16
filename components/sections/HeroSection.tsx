'use client'

import { motion } from 'framer-motion'
import { ScrollAnimation } from '../ui/PageTransition'

export default function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="container mx-auto px-4 text-center">
        <ScrollAnimation delay={0.2}>
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-electric-blue to-white bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Developer Portfolio
          </motion.h1>
        </ScrollAnimation>
        
        <ScrollAnimation delay={0.4}>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Crafting digital experiences with modern technologies
          </p>
        </ScrollAnimation>
        
        <ScrollAnimation delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              className="px-8 py-4 bg-electric-blue text-black font-semibold rounded-lg hover:bg-electric-blue/80 transition-all duration-300 shadow-electric"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.button>
            <motion.button
              className="px-8 py-4 border border-electric-blue text-electric-blue font-semibold rounded-lg hover:bg-electric-blue/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.button>
          </div>
        </ScrollAnimation>
        
        <ScrollAnimation delay={0.8}>
          <div className="mt-16">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-electric-blue rounded-full mx-auto flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-electric-blue rounded-full mt-2"
              />
            </motion.div>
          </div>
        </ScrollAnimation>
      </div>
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-electric-blue/10 rounded-full animate-spin" style={{ animationDuration: '60s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-electric-blue/5 rounded-full animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
      </div>
    </section>
  )
}