import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Terminal, Send, CheckCircle2, Mail, ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-start">
      {/* Soft watercolor-style background gradient */}
      <div className="absolute inset-0 z-[-2] bg-gradient-to-br from-[#fdfbf7] via-[#e5ede9] to-[#d6e3e9] opacity-80" />
      
      {/* SVG Noise Texture for that soft matte/grain feel */}
      <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Small pill-shaped badge */}
          <div className="inline-flex items-center rounded-full bg-white/60 border border-white/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-8 backdrop-blur-sm shadow-sm">
            Built for your inbox
          </div>

          {/* Headline mixing serif regular and italic weights, with SVG ellipse and icon chip */}
          <h1 className="font-serif text-5xl md:text-7xl tracking-tight text-zinc-900 mb-8 leading-[1.15] max-w-4xl mx-auto">
            Tell it once. <br className="hidden md:block" />
            <span className="relative inline-block whitespace-nowrap z-10">
              <span className="italic font-light">Automate</span>
              {/* Hand-drawn SVG ellipse circling the word */}
              <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] text-primary z-[-1]" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M10,20 C15,2 85,2 90,20 C95,38 15,38 10,20 C8,15 12,10 18,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="0" className="opacity-80" />
              </svg>
            </span> the rest
            <span className="inline-flex items-center justify-center bg-primary text-white rounded-2xl w-12 h-12 md:w-16 md:h-16 ml-3 md:ml-4 align-middle shadow-lg -rotate-6">
              <Mail className="h-6 w-6 md:h-8 md:w-8" />
            </span>
            .
          </h1>

          {/* Subheadline: muted gray, centered, max-width constrained */}
          <p className="text-lg md:text-xl text-zinc-500 mb-12 max-w-xl mx-auto font-sans leading-relaxed">
            An AI agent that lives in your inbox. Just describe the task, and MailPilot handles the drafting, reviewing, and sending.
          </p>
          
          {/* Two CTAs side by side */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 w-full">
            {/* Primary CTA */}
            <button className="group relative flex items-center bg-zinc-900 text-white rounded-full p-1.5 pl-6 pr-1.5 hover:bg-zinc-800 transition-all shadow-md">
              <span className="font-medium text-[15px] mr-4">Try it free</span>
              <div className="bg-white/10 group-hover:bg-white/20 transition-colors p-2.5 rounded-full flex items-center justify-center">
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
            
            {/* Secondary CTA */}
            <a href="#how-it-works" className="group flex items-center text-[15px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              See how it works 
              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-border overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="text-xs font-mono text-muted-foreground ml-2 flex items-center gap-2">
              <Terminal className="h-3 w-3" /> mailpilot-agent
            </div>
          </div>
          
          <div className="p-6 text-left font-sans space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                <span className="text-sm font-medium">You</span>
              </div>
              <div className="bg-muted p-4 rounded-2xl rounded-tl-sm text-foreground">
                Email Sarah to confirm Friday's 10 AM design review call.
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-primary/10 p-4 rounded-2xl rounded-tr-sm text-foreground w-full">
                <div className="flex items-center gap-2 mb-2 text-primary font-medium text-sm">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Drafting email to sarah@example.com...
                </div>
                <div className="bg-white dark:bg-black/20 p-3 rounded border border-border/50 text-sm">
                  <span className="text-muted-foreground">Subject: Confirming Friday's design review at 10 AM</span><br/><br/>
                  Hi Sarah,<br/><br/>
                  I'm writing to confirm our design review call this Friday at 10:00 AM. Looking forward to going over the latest mockups with you.<br/><br/>
                  Best,<br/>
                  [Your Name]
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3 }}
                  className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-500 text-sm font-medium"
                >
                  <CheckCircle2 className="h-4 w-4" /> Sent ✓
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
