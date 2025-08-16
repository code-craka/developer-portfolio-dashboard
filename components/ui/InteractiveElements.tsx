'use client'

import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion'
import { ReactNode, useRef, useState, useEffect } from 'react'

// Interactive button with advanced hover and touch effects
interface InteractiveButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'electric'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

export function InteractiveButton({
  children,
  className = '',
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false
}: InteractiveButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const baseClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const variantClasses = {
    primary: 'bg-electric-blue-500 hover:bg-electric-blue-400 text-dark-950',
    secondary: 'bg-dark-800 hover:bg-dark-700 text-white border border-white/20',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
    electric: 'bg-gradient-to-r from-electric-blue-500 to-electric-blue-400 hover:from-electric-blue-400 hover:to-electric-blue-300 text-dark-950'
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    // Create ripple effect
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRipple = { id: Date.now(), x, y }
      setRipples(prev => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }

    onClick?.()
  }

  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-lg font-semibold transition-all duration-300
        ${baseClasses[size]} ${variantClasses[variant]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-electric-blue-500/50
        will-change-transform
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        boxShadow: variant === 'electric' || variant === 'primary' 
          ? '0 0 30px rgba(0, 212, 255, 0.4)' 
          : '0 4px 20px rgba(0, 0, 0, 0.3)'
      } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* Button content */}
      <motion.span
        className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>

      {/* Pressed state overlay */}
      <motion.div
        className="absolute inset-0 bg-black/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPressed ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </motion.button>
  )
}

// Draggable card with physics
interface DraggableCardProps {
  children: ReactNode
  className?: string
  onDragEnd?: (event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => void
  dragConstraints?: { left: number; right: number; top: number; bottom: number }
}

export function DraggableCard({
  children,
  className = '',
  onDragEnd,
  dragConstraints
}: DraggableCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.2}
      onDragEnd={onDragEnd}
      style={{ x, y, rotateX, rotateY }}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// Tilt effect on hover
interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  scale?: number
  speed?: number
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 15,
  scale = 1.05,
  speed = 400
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: speed,
    damping: 30
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: speed,
    damping: 30
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`transform-gpu ${className}`}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// Floating action button with magnetic effect
interface FloatingActionButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function FloatingActionButton({
  children,
  className = '',
  onClick,
  position = 'bottom-right'
}: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    mouseX.set((e.clientX - centerX) * 0.1)
    mouseY.set((e.clientY - centerY) * 0.1)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.button
      className={`
        fixed z-50 w-14 h-14 bg-electric-blue-500 hover:bg-electric-blue-400 
        text-dark-950 rounded-full shadow-electric hover:shadow-electric-lg
        flex items-center justify-center transition-colors duration-300
        ${positionClasses[position]} ${className}
      `}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: isHovered 
          ? '0 0 40px rgba(0, 212, 255, 0.6)' 
          : '0 0 20px rgba(0, 212, 255, 0.3)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.button>
  )
}

// Swipeable card for mobile
interface SwipeableCardProps {
  children: ReactNode
  className?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export function SwipeableCard({
  children,
  className = '',
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 100
}: SwipeableCardProps) {
  const [exitX, setExitX] = useState(0)
  const [exitY, setExitY] = useState(0)

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info

    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0) {
        setExitX(1000)
        onSwipeRight?.()
      } else {
        setExitX(-1000)
        onSwipeLeft?.()
      }
    } else if (Math.abs(offset.y) > threshold || Math.abs(velocity.y) > 500) {
      if (offset.y > 0) {
        setExitY(1000)
        onSwipeDown?.()
      } else {
        setExitY(-1000)
        onSwipeUp?.()
      }
    }
  }

  return (
    <motion.div
      className={`touch-pan-y ${className}`}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX, y: exitY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileDrag={{ scale: 1.05, rotate: exitX * 0.1 }}
    >
      {children}
    </motion.div>
  )
}

// Morphing icon button
interface MorphingIconButtonProps {
  icon1: ReactNode
  icon2: ReactNode
  isToggled: boolean
  onToggle: () => void
  className?: string
  size?: number
}

export function MorphingIconButton({
  icon1,
  icon2,
  isToggled,
  onToggle,
  className = '',
  size = 24
}: MorphingIconButtonProps) {
  return (
    <motion.button
      className={`relative p-2 rounded-lg transition-colors duration-300 ${className}`}
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: isToggled ? 0 : 1,
            rotate: isToggled ? 90 : 0,
            scale: isToggled ? 0.5 : 1
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {icon1}
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: isToggled ? 1 : 0,
            rotate: isToggled ? 0 : -90,
            scale: isToggled ? 1 : 0.5
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {icon2}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}

// Elastic scroll container
interface ElasticScrollProps {
  children: ReactNode
  className?: string
  elasticity?: number
}

export function ElasticScroll({
  children,
  className = '',
  elasticity = 0.2
}: ElasticScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150)
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      animate={{
        scale: isScrolling ? 0.98 : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  )
}