'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

interface ScrollProgressProps {
  className?: string
}

export default function ScrollProgress({ className = '' }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-electric-blue origin-left z-50 ${className}`}
      style={{ scaleX }}
    />
  )
}