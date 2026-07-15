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
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
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
