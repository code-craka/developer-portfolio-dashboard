'use client'

import { motion, AnimatePresence, useScroll, useTransform, useSpring, Variants } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.6
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Enhanced scroll-triggered animation component
interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'rotate' | 'blur'
  distance?: number
  duration?: number
  ease?: string | number[]
  once?: boolean
  threshold?: number
  rootMargin?: string
}

export function ScrollAnimation({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up',
  distance = 50,
  duration = 0.6,
  ease = [0.25, 0.25, 0.25, 0.75],
  once = true,
  threshold = 0.1,
  rootMargin = '-50px'
}: ScrollAnimationProps) {
  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, x: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }
      case 'down':
        return { opacity: 0, y: -distance, x: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }
      case 'left':
        return { opacity: 0, x: distance, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }
      case 'right':
        return { opacity: 0, x: -distance, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }
      case 'scale':
        return { opacity: 0, x: 0, y: 0, scale: 0.8, rotate: 0, filter: 'blur(0px)' }
      case 'rotate':
        return { opacity: 0, x: 0, y: 0, scale: 1, rotate: -180, filter: 'blur(0px)' }
      case 'blur':
        return { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(10px)' }
      default:
        return { opacity: 0, y: distance, x: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }
    }
  }

  const getFinalState = () => {
    return { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }
  }

  return (
    <motion.div
      initial={getInitialState()}
      whileInView={getFinalState()}
      transition={{ 
        duration, 
        delay,
        ease
      }}
      viewport={{ once, amount: threshold, margin: rootMargin }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger animation for lists with enhanced options
interface StaggerAnimationProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  distance?: number
  duration?: number
}

export function StaggerAnimation({ 
  children, 
  className = '',
  staggerDelay = 0.1,
  direction = 'up',
  distance = 20,
  duration = 0.5
}: StaggerAnimationProps) {
  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance }
      case 'down':
        return { opacity: 0, y: -distance }
      case 'left':
        return { opacity: 0, x: distance }
      case 'right':
        return { opacity: 0, x: -distance }
      case 'scale':
        return { opacity: 0, scale: 0.8 }
      default:
        return { opacity: 0, y: distance }
    }
  }

  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={getInitialState()}
          whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          transition={{ 
            duration, 
            delay: index * staggerDelay,
            ease: 'easeOut'
          }}
          viewport={{ once: true }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

// Parallax scroll animation
interface ParallaxProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down'
}

export function Parallax({ 
  children, 
  className = '', 
  speed = 0.5,
  direction = 'up'
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    direction === 'up' ? [0, -speed * 100] : [0, speed * 100]
  )
  
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smoothY }}>
        {children}
      </motion.div>
    </div>
  )
}

// Magnetic hover effect
interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ 
  children, 
  className = '', 
  strength = 0.3 
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }

  const handleMouseLeave = () => {
    const element = ref.current
    if (!element) return
    element.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

// Text reveal animation
interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  staggerDelay?: number
}

export function TextReveal({ 
  children, 
  className = '', 
  delay = 0,
  duration = 0.6,
  staggerDelay = 0.02
}: TextRevealProps) {
  const words = children.split(' ')

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: delay }
    })
  }

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Morphing shape animation
interface MorphingShapeProps {
  className?: string
  size?: number
  color?: string
}

export function MorphingShape({ 
  className = '', 
  size = 100,
  color = '#00D4FF'
}: MorphingShapeProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        animate={{
          d: [
            "M20,50 C20,20 50,20 50,50 C50,80 80,80 80,50 C80,20 50,20 50,50",
            "M30,50 C30,30 50,30 50,50 C50,70 70,70 70,50 C70,30 50,30 50,50",
            "M25,50 C25,25 50,25 50,50 C50,75 75,75 75,50 C75,25 50,25 50,50",
            "M20,50 C20,20 50,20 50,50 C50,80 80,80 80,50 C80,20 50,20 50,50"
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.path
          fill={color}
          opacity={0.3}
          d="M20,50 C20,20 50,20 50,50 C50,80 80,80 80,50 C80,20 50,20 50,50"
        />
      </motion.svg>
    </motion.div>
  )
}

// Loading animation component
interface LoadingAnimationProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave'
}

export function LoadingAnimation({ 
  className = '', 
  size = 'md',
  variant = 'spinner'
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (variant === 'spinner') {
    return (
      <motion.div
        className={`${sizeClasses[size]} border-2 border-gray-700 border-t-electric-blue-500 rounded-full ${className}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'} bg-electric-blue-500 rounded-full`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${sizeClasses[size]} bg-electric-blue-500 rounded-full ${className}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    )
  }

  if (variant === 'wave') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={`${size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1 h-6' : 'w-1 h-8'} bg-electric-blue-500 rounded-full`}
            animate={{
              scaleY: [1, 2, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    )
  }

  return null
}