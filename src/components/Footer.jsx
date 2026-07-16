import { Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-white/5 bg-[#050816]/80 backdrop-blur-3xl mt-auto">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-secondary text-white p-2 rounded-xl shadow-[0_0_15px_rgba(124,92,255,0.2)]">
            <Mail className="h-5 w-5" />
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-white">MailPilot</span>
        </div>
        
        <nav className="flex items-center gap-8 text-sm text-white/40">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </nav>
        
        <div className="text-sm text-white/30 font-light">
          &copy; {new Date().getFullYear()} MailPilot. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
