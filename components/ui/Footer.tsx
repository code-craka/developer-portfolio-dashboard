'use client'

import { motion } from 'framer-motion'
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope, 
  FaHeart,
  FaArrowUp 
} from 'react-icons/fa'

interface FooterProps {
  className?: string
}

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: FaGithub,
    color: 'hover:text-gray-300'
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: FaLinkedin,
    color: 'hover:text-blue-400'
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: FaTwitter,
    color: 'hover:text-blue-400'
  },
  {
    name: 'Email',
    href: 'mailto:contact@example.com',
    icon: FaEnvelope,
    color: 'hover:text-electric-blue'
  }
]

const quickLinks = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' }
]

export default function Footer({ className = '' }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToSection = (href: string) => {
    const targetId = href.substring(1)
    const element = document.getElementById(targetId)
    
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <footer className={`relative bg-black/40 backdrop-blur-xl border-t border-white/10 ${className}`}>
      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 right-8 w-12 h-12 bg-electric-blue text-black rounded-full flex items-center justify-center shadow-electric hover:shadow-electric-lg transition-all duration-300"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FaArrowUp className="w-4 h-4" />
      </motion.button>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-electric-blue bg-clip-text text-transparent">
              Developer Portfolio
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Crafting digital experiences with modern technologies. 
              Passionate about clean code, innovative solutions, and continuous learning.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors duration-200`}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-electric-blue transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">Get In Touch</h4>
            <div className="space-y-3">
              <motion.a
                href="mailto:contact@example.com"
                className="flex items-center space-x-3 text-gray-400 hover:text-electric-blue transition-colors duration-200 text-sm"
                whileHover={{ x: 5 }}
              >
                <FaEnvelope className="w-4 h-4" />
                <span>contact@example.com</span>
              </motion.a>
              <div className="text-gray-400 text-sm">
                <p>Available for freelance work</p>
                <p>and collaboration opportunities</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>© {new Date().getFullYear()} Developer Portfolio. Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <FaHeart className="w-4 h-4 text-red-500" />
            </motion.div>
            <span>using Next.js & TypeScript</span>
          </div>
          
          <div className="text-gray-400 text-sm">
            <span>Designed & Built by </span>
            <span className="text-electric-blue font-medium">Your Name</span>
          </div>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-electric-blue/50 to-transparent opacity-30" />
    </footer>
  )
}