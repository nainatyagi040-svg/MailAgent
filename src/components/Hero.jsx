import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Terminal, Send, CheckCircle2, Mail, ArrowRight } from 'lucide-react'

export function Hero() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-start">
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariant} className="inline-flex items-center rounded-full bg-white/[0.04] border border-white/[0.08] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 mb-10 backdrop-blur-md shadow-2xl">
            Built for your inbox
          </motion.div>

          <motion.h1 variants={itemVariant} className="font-serif text-5xl md:text-7xl lg:text-[80px] tracking-tight text-white mb-8 leading-[1.1] max-w-4xl mx-auto">
            Tell it once. <br className="hidden md:block" />
            <span className="relative inline-block whitespace-nowrap z-10">
              <span className="italic font-light">Automate</span>
              <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] text-primary z-[-1]" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M10,20 C15,2 85,2 90,20 C95,38 15,38 10,20 C8,15 12,10 18,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="0" className="opacity-80" />
              </svg>
            </span> the rest
            <span className="inline-flex items-center justify-center bg-gradient-to-tr from-primary to-secondary text-white rounded-2xl w-12 h-12 md:w-16 md:h-16 ml-3 md:ml-4 align-middle shadow-[0_0_30px_rgba(124,92,255,0.4)] -rotate-6">
              <Mail className="h-6 w-6 md:h-8 md:w-8" />
            </span>
            .
          </motion.h1>

          <motion.p variants={itemVariant} className="text-lg md:text-xl text-white/50 mb-14 max-w-2xl mx-auto font-sans leading-relaxed">
            An AI agent that lives in your inbox. Just describe the task, and MailPilot handles the drafting, reviewing, and sending.
          </motion.p>
          
          <motion.div variants={itemVariant} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 w-full">
            <button className="group relative flex items-center bg-gradient-to-r from-primary to-primary/80 text-white rounded-full p-1.5 pl-6 pr-1.5 shadow-[0_0_20px_rgba(124,92,255,0.2)] hover:shadow-[0_0_40px_rgba(124,92,255,0.5)] transition-all duration-300 hover:scale-105 border border-white/10">
              <span className="font-medium text-[15px] mr-4">Try it free</span>
              <div className="bg-white/20 transition-colors p-2.5 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
            
            <a href="#how-it-works" className="group flex items-center text-[15px] font-medium text-white/60 hover:text-white transition-colors">
              See how it works 
              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto bg-card/60 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-border overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs font-mono text-white/40 ml-2 flex items-center gap-2">
              <Terminal className="h-3 w-3" /> mailpilot-agent
            </div>
          </div>
          
          <div className="p-6 text-left font-sans space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                <span className="text-sm font-medium text-white/80">You</span>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] p-4 rounded-2xl rounded-tl-sm text-white/90 shadow-sm">
                Email Sarah to confirm Friday's 10 AM design review call.
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_15px_rgba(124,92,255,0.2)]">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl rounded-tr-sm text-white/90 w-full backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Drafting email to sarah@example.com...
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/10 text-sm shadow-inner">
                  <span className="text-white/50">Subject: Confirming Friday's design review at 10 AM</span><br/><br/>
                  <span className="text-white/80">Hi Sarah,</span><br/><br/>
                  <span className="text-white/80">I'm writing to confirm our design review call this Friday at 10:00 AM. Looking forward to going over the latest mockups with you.</span><br/><br/>
                  <span className="text-white/80">Best,<br/>[Your Name]</span>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.5 }}
                  className="mt-4 flex items-center gap-2 text-green-400 text-sm font-medium"
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
