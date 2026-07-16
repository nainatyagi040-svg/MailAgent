import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "Is it really free?",
      answer: "Yes, our generous free tier gives you enough credits to automate your daily routine. We only charge for high-volume power users and enterprise teams."
    },
    {
      question: "Is my email data safe?",
      answer: "Security is our top priority. We use end-to-end encryption, and our AI models do not train on your personal data. You can read our full privacy policy for more details."
    },
    {
      question: "Can I review before it sends?",
      answer: "Absolutely. By default, MailPilot operates in 'Approval Mode' where it drafts the email and waits for your confirmation. You can enable auto-send for specific tasks once you trust the agent."
    },
    {
      question: "What email providers do you support?",
      answer: "Currently, we fully support Gmail and Google Workspace. Outlook/Office 365 support is currently in beta."
    },
    {
      question: "Can it read my emails too?",
      answer: "MailPilot can optionally search your inbox for context if you ask it to (e.g., 'Reply to John's last email and say yes'). It only accesses what is necessary to complete the task you specify."
    }
  ]

  return (
    <section className="py-32 px-4 relative">
      <div className="container mx-auto max-w-2xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/50"
          >
            Everything you need to know before you start.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/10 last:border-0 px-2 group">
                <AccordionTrigger className="text-left text-lg font-medium text-white/80 hover:text-white hover:no-underline transition-colors py-5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
