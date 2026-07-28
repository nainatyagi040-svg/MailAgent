import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Mail } from 'lucide-react'
import { scrollToDemo } from '../lib/scroll'

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How it works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' }
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 w-full z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <motion.div 
        layout
        className={`pointer-events-auto flex items-center justify-between px-6 h-16 rounded-full transition-all duration-500 ${
          scrolled 
            ? 'w-full max-w-5xl bg-[#050816]/60 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]' 
            : 'w-full max-w-7xl bg-transparent border-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-secondary text-white p-2 rounded-xl shadow-[0_0_15px_rgba(124,92,255,0.4)]">
            <Mail className="h-5 w-5" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-white">MailPilot</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 relative">
          {navLinks.map((link, index) => (
            <a 
              key={link.name}
              href={link.href} 
              className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors rounded-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-white/[0.08] rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center">
          <Button onClick={scrollToDemo} className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white px-6 font-medium shadow-[0_0_20px_rgba(124,92,255,0.3)] hover:shadow-[0_0_30px_rgba(124,92,255,0.5)] transition-all hover:scale-105 border border-white/10">
            Get Started
          </Button>
        </div>
      </motion.div>
    </header>
  )
}

