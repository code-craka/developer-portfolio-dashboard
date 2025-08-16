'use client'

import { motion } from 'framer-motion'
import { ScrollAnimation, StaggerAnimation } from '../ui/PageTransition'

// Skill categories with icons and technologies
const skillCategories = [
    {
        category: 'Frontend',
        icon: '🎨',
        color: 'from-electric-blue-400 to-electric-blue-600',
        skills: [
            { name: 'React', icon: '⚛️', level: 95 },
            { name: 'Next.js', icon: '▲', level: 90 },
            { name: 'TypeScript', icon: '📘', level: 88 },
            { name: 'Tailwind CSS', icon: '🎨', level: 92 },
            { name: 'Framer Motion', icon: '🎭', level: 85 },
            { name: 'HTML5', icon: '🌐', level: 95 },
            { name: 'CSS3', icon: '🎨', level: 90 },
            { name: 'JavaScript', icon: '💛', level: 93 }
        ]
    },
    {
        category: 'Backend',
        icon: '⚙️',
        color: 'from-green-400 to-green-600',
        skills: [
            { name: 'Node.js', icon: '🟢', level: 88 },
            { name: 'PostgreSQL', icon: '🐘', level: 85 },
            { name: 'NeonDB', icon: '🌟', level: 82 },
            { name: 'API Design', icon: '🔗', level: 90 },
            { name: 'Express.js', icon: '🚀', level: 85 },
            { name: 'Prisma', icon: '🔺', level: 80 },
            { name: 'MongoDB', icon: '🍃', level: 78 },
            { name: 'GraphQL', icon: '📊', level: 75 }
        ]
    },
    {
        category: 'Tools & DevOps',
        icon: '🛠️',
        color: 'from-purple-400 to-purple-600',
        skills: [
            { name: 'Git', icon: '📝', level: 92 },
            { name: 'Docker', icon: '🐳', level: 80 },
            { name: 'AWS', icon: '☁️', level: 75 },
            { name: 'Vercel', icon: '▲', level: 88 },
            { name: 'GitHub Actions', icon: '🔄', level: 82 },
            { name: 'VS Code', icon: '💙', level: 95 },
            { name: 'Figma', icon: '🎨', level: 85 },
            { name: 'Postman', icon: '📮', level: 90 }
        ]
    },
    {
        category: 'Other',
        icon: '🌟',
        color: 'from-orange-400 to-orange-600',
        skills: [
            { name: 'Clerk Auth', icon: '🔐', level: 85 },
            { name: 'Headless UI', icon: '🎯', level: 88 },
            { name: 'Responsive Design', icon: '📱', level: 92 },
            { name: 'SEO', icon: '🔍', level: 80 },
            { name: 'Performance', icon: '⚡', level: 85 },
            { name: 'Accessibility', icon: '♿', level: 82 },
            { name: 'Testing', icon: '🧪', level: 78 },
            { name: 'Agile', icon: '🔄', level: 85 }
        ]
    }
]

export default function SkillsSection() {
    return (
        <section id="skills" className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-transparent to-purple-500/5" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl opacity-30" />

            <div className="container mx-auto px-4 relative z-10">
                <ScrollAnimation>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-electric-blue-300 to-electric-blue bg-clip-text text-transparent">
                            Skills & Technologies
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-electric-blue-400 to-electric-blue-600 mx-auto rounded-full shadow-electric" />
                        <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
                            A comprehensive overview of my technical expertise and the tools I use to bring ideas to life
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Skills Categories Grid */}
                <div className="max-w-7xl mx-auto">
                    <StaggerAnimation staggerDelay={0.2}>
                        {skillCategories.map((category, categoryIndex) => (
                            <motion.div
                                key={category.category}
                                className="mb-16 last:mb-0"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: categoryIndex * 0.1
                                }}
                                viewport={{ once: true }}
                            >
                                {/* Category Header */}
                                <div className="flex items-center justify-center mb-8">
                                    <div className="flex items-center space-x-4">
                                        <motion.div
                                            className="text-3xl"
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {category.icon}
                                        </motion.div>
                                        <h3 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                                            {category.category}
                                        </h3>
                                    </div>
                                </div>

                                {/* Skills Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                                    <StaggerAnimation staggerDelay={0.05}>
                                        {category.skills.map((skill, skillIndex) => (
                                            <motion.div
                                                key={skill.name}
                                                className="group relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 text-center hover:border-electric-blue/50 transition-all duration-300 cursor-pointer"
                                                whileHover={{
                                                    scale: 1.05,
                                                    boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)',
                                                    y: -5
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: skillIndex * 0.05
                                                }}
                                                viewport={{ once: true }}
                                            >
                                                {/* Glassmorphism overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="relative z-10">
                                                    {/* Skill Icon */}
                                                    <motion.div
                                                        className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300"
                                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        {skill.icon}
                                                    </motion.div>

                                                    {/* Skill Name */}
                                                    <h4 className="text-white font-semibold text-sm md:text-base mb-3 group-hover:text-electric-blue-300 transition-colors duration-300">
                                                        {skill.name}
                                                    </h4>

                                                    {/* Skill Level Progress Bar */}
                                                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                                                        <motion.div
                                                            className={`h-2 rounded-full bg-gradient-to-r ${category.color} shadow-electric`}
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${skill.level}%` }}
                                                            transition={{
                                                                duration: 1,
                                                                delay: skillIndex * 0.1,
                                                                ease: 'easeOut'
                                                            }}
                                                            viewport={{ once: true }}
                                                        />
                                                    </div>

                                                    {/* Skill Level Percentage */}
                                                    <motion.div
                                                        className="text-xs text-gray-400 group-hover:text-electric-blue-400 transition-colors duration-300"
                                                        initial={{ opacity: 0 }}
                                                        whileInView={{ opacity: 1 }}
                                                        transition={{
                                                            duration: 0.5,
                                                            delay: skillIndex * 0.1 + 0.5
                                                        }}
                                                        viewport={{ once: true }}
                                                    >
                                                        {skill.level}%
                                                    </motion.div>
                                                </div>

                                                {/* Floating particles effect on hover */}
                                                <motion.div
                                                    className="absolute -top-1 -right-1 w-2 h-2 bg-electric-blue/50 rounded-full opacity-0 group-hover:opacity-100"
                                                    animate={{
                                                        y: [0, -10, 0],
                                                        opacity: [0, 1, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: 'easeInOut'
                                                    }}
                                                />
                                            </motion.div>
                                        ))}
                                    </StaggerAnimation>
                                </div>
                            </motion.div>
                        ))}
                    </StaggerAnimation>
                </div>

                {/* Bottom Call to Action */}
                <ScrollAnimation delay={0.8}>
                    <div className="text-center mt-16">
                        <motion.div
                            className="inline-flex items-center space-x-2 bg-black/30 backdrop-blur-xl border border-electric-blue/30 rounded-full px-6 py-3 text-electric-blue-300 hover:border-electric-blue/50 transition-all duration-300"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
                            }}
                        >
                            <span className="text-sm font-medium">Always learning and growing</span>
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                🚀
                            </motion.span>
                        </motion.div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    )
}