import { motion } from 'framer-motion'
import { MessageSquare, PenTool, ShieldCheck } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "1. Describe the task",
      description: "Just tell MailPilot what you want to achieve in plain English. No complex forms or templates."
    },
    {
      icon: <PenTool className="h-6 w-6 text-primary" />,
      title: "2. Agent drafts + sends",
      description: "The AI understands context, fetches relevant info if needed, and crafts the perfect email."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "3. You stay in control",
      description: "Choose to auto-send for routine tasks, or require approval for important communications."
    }
  ]

  return (
    <section id="how-it-works" className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Three simple steps to automate your inbox.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-border -z-10" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="h-24 w-24 rounded-full bg-white dark:bg-zinc-900 border border-border flex items-center justify-center mb-6 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
