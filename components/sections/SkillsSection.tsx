'use client'

import { ScrollAnimation, StaggerAnimation } from '../ui/PageTransition'
import { motion } from 'framer-motion'

const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'TypeScript', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Framer Motion', level: 80 }
    ]
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'API Design', level: 88 },
      { name: 'Authentication', level: 82 },
      { name: 'Database Design', level: 78 }
    ]
  },
  {
    title: 'Tools & Others',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'Testing', level: 80 },
      { name: 'CI/CD', level: 72 }
    ]
  }
]

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-electric-blue bg-clip-text text-transparent">
              Skills & Technologies
            </h2>
            <div className="w-20 h-1 bg-electric-blue mx-auto rounded-full" />
          </div>
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <ScrollAnimation key={category.title} delay={categoryIndex * 0.2}>
              <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-electric-blue/30 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-6 text-center">
                  {category.title}
                </h3>
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm font-medium">
                          {skill.name}
                        </span>
                        <span className="text-electric-blue text-sm font-medium">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-electric-blue to-blue-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ 
                            duration: 1, 
                            delay: categoryIndex * 0.2 + skillIndex * 0.1,
                            ease: "easeOut"
                          }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
        
        <ScrollAnimation delay={0.8}>
          <div className="mt-16 text-center">
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Always learning and exploring new technologies to stay current with industry trends 
              and deliver the best solutions for every project.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}