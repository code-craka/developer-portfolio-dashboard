'use client'

import { motion } from 'framer-motion'
import { ScrollAnimation, StaggerAnimation } from '../ui/PageTransition'
import OptimizedImage from '../ui/OptimizedImage'
import { ProfileSkeleton } from '../ui/Skeleton'

const stats = [
    { value: '50+', label: 'Projects Completed', icon: '🚀' },
    { value: '3+', label: 'Years Experience', icon: '⏱️' },
    { value: '20+', label: 'Technologies', icon: '💻' },
    { value: '100%', label: 'Client Satisfaction', icon: '⭐' }
]

const bioText = [
    "I'm a passionate full-stack developer with expertise in modern web technologies. I love creating beautiful, functional, and user-friendly applications that solve real-world problems.",
    "With a strong foundation in both frontend and backend development, I enjoy working with cutting-edge technologies and continuously learning new skills to stay ahead in the ever-evolving tech landscape.",
    "My approach combines technical excellence with creative problem-solving, ensuring that every project not only meets requirements but exceeds expectations. I believe in writing clean, maintainable code and creating seamless user experiences."
]

export default function AboutSection() {
    return (
        <section 
            id="about" 
            className="py-20 relative overflow-hidden"
            aria-labelledby="about-heading"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-transparent to-electric-blue/5" />
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-electric-blue/5 rounded-full blur-2xl opacity-30" />

            <div className="container mx-auto px-4 relative z-10">
                <ScrollAnimation>
                    <div className="text-center mb-16">
                        <h2 
                            id="about-heading"
                            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-electric-blue-300 to-electric-blue bg-clip-text text-transparent"
                        >
                            About Me
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-electric-blue-400 to-electric-blue-600 mx-auto rounded-full shadow-electric" />
                    </div>
                </ScrollAnimation>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center max-w-7xl mx-auto">
                    {/* Bio Text Section */}
                    <ScrollAnimation delay={0.2}>
                        <div className="space-y-8">
                            {/* Bio Text with Fade-in Animation */}
                            <div className="space-y-6">
                                <StaggerAnimation staggerDelay={0.15}>
                                    {bioText.map((paragraph, index) => (
                                        <motion.p
                                            key={index}
                                            className="text-gray-300 text-lg leading-relaxed"
                                            whileHover={{ color: '#E5E5E5' }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {paragraph}
                                        </motion.p>
                                    ))}
                                </StaggerAnimation>
                            </div>

                            {/* Animated Statistics Grid */}
                            <div className="mt-12">
                                <h3 className="text-xl font-semibold text-white mb-6 text-center lg:text-left">
                                    Key Metrics
                                </h3>
                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                    <StaggerAnimation staggerDelay={0.1}>
                                        {stats.map((stat, index) => (
                                            <motion.div
                                                key={index}
                                                className="group relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 text-center hover:border-electric-blue/50 transition-all duration-300"
                                                whileHover={{
                                                    scale: 1.05,
                                                    boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)'
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {/* Glassmorphism overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="relative z-10">
                                                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                                        {stat.icon}
                                                    </div>
                                                    <motion.div
                                                        className="text-2xl sm:text-3xl font-bold text-electric-blue mb-1"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        transition={{
                                                            duration: 0.6,
                                                            delay: index * 0.1,
                                                            type: 'spring',
                                                            stiffness: 100
                                                        }}
                                                        viewport={{ once: true }}
                                                    >
                                                        {stat.value}
                                                    </motion.div>
                                                    <div className="text-gray-400 text-sm font-medium">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </StaggerAnimation>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Profile Photo Section */}
                    <ScrollAnimation delay={0.4} direction="right">
                        <div className="relative flex justify-center lg:justify-end">
                            {/* Main Profile Container */}
                            <div className="relative group">
                                {/* Electric Blue Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/30 via-electric-blue/20 to-electric-blue/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse" />
                                <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />

                                {/* Outer Ring */}
                                <div className="relative w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-br from-electric-blue/20 via-electric-blue/10 to-transparent rounded-full flex items-center justify-center border border-electric-blue/30 group-hover:border-electric-blue/50 transition-all duration-500">

                                    {/* Inner Glassmorphism Container */}
                                    <div className="w-64 h-64 sm:w-80 sm:h-80 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 group-hover:border-white/30 transition-all duration-500 shadow-glass-lg">

                                        {/* Profile Image Container */}
                                        <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-electric-blue/50 group-hover:border-electric-blue/70 transition-all duration-500">
                                            {/* Placeholder for actual profile image */}
                                            <div className="w-full h-full bg-gradient-to-br from-electric-blue/20 to-electric-blue/5 flex items-center justify-center">
                                                <motion.div
                                                    className="text-6xl sm:text-7xl"
                                                    animate={{
                                                        rotate: [0, 5, -5, 0],
                                                        scale: [1, 1.05, 1]
                                                    }}
                                                    transition={{
                                                        duration: 4,
                                                        repeat: Infinity,
                                                        ease: 'easeInOut'
                                                    }}
                                                >
                                                    👨‍💻
                                                </motion.div>
                                            </div>

                                            {/* Profile image - replace with actual photo */}
                                            {/* <OptimizedImage
                        src="/profile-photo.jpg"
                        alt="Profile Photo"
                        preset="profile"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        priority
                      /> */}
                                        </div>

                                        {/* Inner Glow Effect */}
                                        <div className="absolute inset-4 bg-gradient-to-br from-electric-blue/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    className="absolute -top-4 -right-4 w-8 h-8 bg-electric-blue/30 rounded-full blur-sm"
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.3, 0.7, 0.3]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-6 -left-6 w-6 h-6 bg-electric-blue/20 rounded-full blur-sm"
                                    animate={{
                                        y: [0, 10, 0],
                                        opacity: [0.2, 0.6, 0.2]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: 1
                                    }}
                                />
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    )
}