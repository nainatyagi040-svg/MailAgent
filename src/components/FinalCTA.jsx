import { motion } from 'framer-motion'
import { Button } from './ui/button'

export function FinalCTA() {
  return (
    <section className="py-40 px-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-[100%] z-0 pointer-events-none" />

      <div className="container mx-auto max-w-2xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-16 shadow-[0_20px_80px_-20px_rgba(124,92,255,0.2)]"
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-[1.1]">
            Ready to take back your inbox?
          </h2>
          <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Stop writing the same email twice. Let MailPilot handle it.
          </p>
          <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white text-lg px-10 h-14 w-full sm:w-auto shadow-[0_0_30px_rgba(124,92,255,0.4)] hover:shadow-[0_0_50px_rgba(124,92,255,0.6)] transition-all duration-300 hover:scale-105 border border-white/10">
            Get Started for Free
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
