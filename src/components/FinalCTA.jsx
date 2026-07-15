import { motion } from 'framer-motion'
import { Button } from './ui/button'

export function FinalCTA() {
  return (
    <section className="py-32 px-4 bg-muted/50 border-t border-border text-center">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
            Ready to take back your inbox?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto font-light">
            Join thousands of professionals who have automated their email workflow with MailPilot.
          </p>
          <Button size="lg" className="text-lg px-10 h-14 w-full sm:w-auto">
            Get Started for Free
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
