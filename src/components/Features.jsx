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
    <section id="features" className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Everything you need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Powerful features wrapped in a beautifully simple interface.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-border bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
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
