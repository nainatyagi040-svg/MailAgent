import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Sparkles, Users, Search, ShieldCheck, Activity, Gift } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      title: "Natural language commands",
      description: "Talk to it like a human. It understands context, tone, and implicit instructions."
    },
    {
      icon: <Search className="h-5 w-5 text-primary" />,
      title: "Smart drafting",
      description: "Creates professional, well-structured emails tailored to the recipient in seconds."
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "Multi-recipient support",
      description: "Easily handles complex tasks like sending individual updates to an entire team."
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      title: "Approval mode",
      description: "Review every draft before it goes out, or trust the agent to send automatically."
    },
    {
      icon: <Activity className="h-5 w-5 text-primary" />,
      title: "Activity log",
      description: "Keep track of every action the agent has taken with a detailed, searchable history."
    },
    {
      icon: <Gift className="h-5 w-5 text-primary" />,
      title: "Free forever tier",
      description: "Start automating your inbox immediately without ever pulling out a credit card."
    }
  ]

  return (
    <section id="features" className="py-32 px-4 relative">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight"
          >
            Everything you need
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/50 max-w-2xl mx-auto font-light"
          >
            Powerful features wrapped in a beautifully simple interface.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="h-full"
            >
              <Card className="h-full border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(124,92,255,0.15)] transition-all duration-300 rounded-3xl overflow-hidden relative group">
                {/* Hover gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <CardHeader className="pb-4 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors shadow-inner">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl text-white font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-white/60 leading-relaxed text-[15px] font-light">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
