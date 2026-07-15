import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Send, Terminal, Mail, CheckCircle2, MessageSquare } from 'lucide-react'

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

  const resetDemo = () => {
    setChatState('initial')
    setInputValue('')
  }

  return (
    <section className="py-24 px-4 bg-muted/10 border-y border-border">
      <div className="container mx-auto max-w-4xl text-center mb-12">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Try it yourself</h2>
        <p className="text-lg text-muted-foreground">Experience the magic of MailPilot right here.</p>
      </div>

      <div className="container mx-auto max-w-3xl">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
              <Terminal className="h-3 w-3" /> interactive-demo
            </div>
            <div className="w-10">
              {chatState === 'done' && (
                <button onClick={resetDemo} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Reset
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6 h-[400px] overflow-y-auto flex flex-col gap-6 font-sans">
            {/* User message */}
            <AnimatePresence>
              {chatState !== 'initial' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium">You</span>
                  </div>
                  <div className="bg-muted p-4 rounded-2xl rounded-tl-sm text-foreground">
                    {inputValue}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Agent response */}
            <AnimatePresence>
              {chatState !== 'initial' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-primary/10 p-4 rounded-2xl rounded-tr-sm text-foreground w-full">
                    {chatState === 'generating' ? (
                      <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Processing request & drafting email...
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-primary mb-3">Draft ready.</div>
                        <div className="bg-white dark:bg-black/20 p-3 rounded border border-border/50 text-sm mb-4">
                          <span className="text-muted-foreground">Subject: Following up</span><br/><br/>
                          Hi there,<br/><br/>
                          I am writing based on your recent request: "{inputValue}".<br/><br/>
                          Best regards,<br/>
                          MailPilot Agent
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" className="h-8">Edit</Button>
                          <Button size="sm" className="h-8 gap-1.5" onClick={() => alert('Sent!')}>
                            <Send className="h-3.5 w-3.5" /> Approve & Send
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {chatState === 'initial' && (
              <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-2 opacity-50">
                <MessageSquare className="h-8 w-8 mb-2" />
                Type a command below to see MailPilot in action.
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t border-border bg-white dark:bg-zinc-900">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input 
                placeholder="e.g. Email John about rescheduling the meeting to Tuesday..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={chatState !== 'initial'}
                className="flex-1"
              />
              <Button type="submit" disabled={!inputValue.trim() || chatState !== 'initial'} className="shrink-0 gap-2">
                <Send className="h-4 w-4" /> <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
