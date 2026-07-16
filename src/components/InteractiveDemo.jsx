import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Send, Terminal, Mail, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react'

export function InteractiveDemo() {
  const [inputValue, setInputValue] = useState('')
  const [chatState, setChatState] = useState('initial') // initial, generating, done

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim() || chatState !== 'initial') return
    
    setChatState('generating')
    
    setTimeout(() => {
      setChatState('done')
    }, 2500)
  }

  const handleChipClick = (text) => {
    setInputValue(text)
  }

  const resetDemo = () => {
    setChatState('initial')
    setInputValue('')
  }

  return (
    <section className="py-32 px-4 relative">
      <div className="container mx-auto max-w-4xl text-center mb-16 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight"
        >
          Try it yourself
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/50 max-w-2xl mx-auto font-light"
        >
          Experience the magic of MailPilot right here.
        </motion.p>
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card/40 backdrop-blur-3xl rounded-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="text-xs font-mono text-white/40 flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5" /> interactive-demo
            </div>
            <div className="w-10 text-right">
              {chatState === 'done' && (
                <button onClick={resetDemo} className="text-xs text-white/40 hover:text-white transition-colors">
                  Reset
                </button>
              )}
            </div>
          </div>
          
          <div className="p-8 h-[450px] overflow-y-auto flex flex-col gap-8 font-sans scrollbar-hide">
            <AnimatePresence>
              {chatState !== 'initial' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex gap-4"
                >
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                    <span className="text-sm font-medium text-white/80">You</span>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.08] p-5 rounded-2xl rounded-tl-sm text-white/90 shadow-sm leading-relaxed">
                    {inputValue}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {chatState !== 'initial' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_15px_rgba(124,92,255,0.2)]">
                    <Sparkles className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl rounded-tr-sm text-white/90 w-full backdrop-blur-md">
                    {chatState === 'generating' ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-primary font-medium text-sm">
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_10px_rgba(124,92,255,0.8)]"></span>
                          </span>
                          Analyzing request & drafting...
                        </div>
                        <div className="space-y-3">
                          <motion.div 
                            className="h-3 bg-white/5 rounded-full overflow-hidden relative"
                            initial={{ width: "30%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                          >
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            />
                          </motion.div>
                          <motion.div 
                            className="h-3 bg-white/5 rounded-full overflow-hidden relative w-4/5"
                            initial={{ width: "20%" }}
                            animate={{ width: "80%" }}
                            transition={{ duration: 2.2, ease: "easeOut" }}
                          >
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <div className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> Draft generated successfully
                        </div>
                        <div className="bg-black/40 p-5 rounded-xl border border-white/10 text-sm mb-5 shadow-inner leading-relaxed">
                          <span className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-2 block">Subject: Following up</span>
                          <span className="text-white/80">Hi there,</span><br/><br/>
                          <span className="text-white/80">I am writing based on your recent request: "{inputValue}".</span><br/><br/>
                          <span className="text-white/80">Best regards,<br/>MailPilot Agent</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" className="h-9 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white transition-colors rounded-full px-5">
                            Edit
                          </Button>
                          <Button size="sm" className="h-9 gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-5 shadow-[0_0_15px_rgba(124,92,255,0.3)] transition-all hover:scale-105" onClick={() => alert('Sent!')}>
                            <Send className="h-3.5 w-3.5" /> Approve & Send
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {chatState === 'initial' && (
              <div className="flex-1 flex items-center justify-center text-white/30 flex-col gap-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                  <MessageSquare className="h-6 w-6 text-white/50" />
                </div>
                <p className="text-lg font-light tracking-wide">Type a command to see MailPilot in action.</p>
              </div>
            )}
          </div>
          
          <div className="p-5 border-t border-white/10 bg-black/20 backdrop-blur-xl">
            {chatState === 'initial' && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                <button 
                  type="button"
                  onClick={() => handleChipClick("Email Sarah about the design review")}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Email Sarah about the design review
                </button>
                <button 
                  type="button"
                  onClick={() => handleChipClick("Follow up with a client")}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Follow up with a client
                </button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input 
                placeholder="e.g. Email John about rescheduling the meeting to Tuesday..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={chatState !== 'initial'}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-12 px-4 transition-all"
              />
              <Button 
                type="submit" 
                disabled={!inputValue.trim() || chatState !== 'initial'} 
                className="shrink-0 gap-2 h-12 px-6 rounded-xl bg-white text-black hover:bg-white/90 transition-all font-medium disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
