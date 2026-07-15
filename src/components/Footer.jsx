import { Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 px-4 bg-background border-t border-border">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
            <Mail className="h-5 w-5" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">MailPilot</span>
        </div>
        
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </nav>
        
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MailPilot. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
