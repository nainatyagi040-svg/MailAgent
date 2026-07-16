import { motion } from 'framer-motion'
import { MessageSquare, PenTool, ShieldCheck } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: <MessageSquare className="h-7 w-7 text-primary" />,
      title: "1. Describe the task",
      description: "Just tell MailPilot what you want to achieve in plain English. No complex forms or templates."
    },
    {
      icon: <PenTool className="h-7 w-7 text-primary" />,
      title: "2. Agent drafts + sends",
      description: "The AI understands context, fetches relevant info if needed, and crafts the perfect email."
    },
    {
      icon: <ShieldCheck className="h-7 w-7 text-primary" />,
      title: "3. You stay in control",
      description: "Choose to auto-send for routine tasks, or require approval for important communications."
    }
  ]

  return (
    <section id="how-it-works" className="py-32 px-4 relative">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight"
          >
            How it works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/50 max-w-2xl mx-auto font-light"
          >
            Three simple steps to automate your inbox.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center relative group cursor-default"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="h-28 w-28 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex items-center justify-center mb-8 shadow-lg group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:shadow-[0_0_40px_rgba(124,92,255,0.25)] transition-all duration-300"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
              <p className="text-white/60 leading-relaxed font-light px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
