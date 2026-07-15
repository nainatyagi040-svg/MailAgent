import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Mail } from 'lucide-react'

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-white/50 backdrop-blur-md supports-[backdrop-filter]:bg-white/40 border-b border-white/20 shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm">
            <Mail className="h-5 w-5" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-zinc-900">MailPilot</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center">
          <Button className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 px-6 font-medium shadow-sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
