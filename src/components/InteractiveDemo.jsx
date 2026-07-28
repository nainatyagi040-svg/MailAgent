import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Send, Terminal, Mail, CheckCircle2, MessageSquare, Sparkles, AlertCircle, Undo, Edit2, Save, XCircle } from 'lucide-react'
import { fetchWithAuth } from '../lib/api'

export function InteractiveDemo() {
  const [inputValue, setInputValue] = useState('')
  const [chatState, setChatState] = useState('initial') // initial, generating, done, sending, sent, undoing
  const [draft, setDraft] = useState(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editSubject, setEditSubject] = useState('')
  const [editBody, setEditBody] = useState('')

  const [needsEmailPrompt, setNeedsEmailPrompt] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [recipientName, setRecipientName] = useState('')
  
  const [errorMsg, setErrorMsg] = useState(null)
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    let timer;
    if (chatState === 'sent' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (chatState === 'sent' && countdown === 0) {
      clearInterval(timer)
      
      const checkStatus = async () => {
        try {
          const res = await fetchWithAuth(`/agent/draft-status/${draft.id}`)
          const data = await res.json()
          if (data.status === 'failed') {
            setErrorMsg('Failed to send email. Please check your Mailtrap configuration.')
            setChatState('done')
          } else {
            setChatState('success')
          }
        } catch (err) {
          setErrorMsg('Failed to verify email status.')
          setChatState('done')
        }
      }
      checkStatus()
    }
    return () => clearInterval(timer)
  }, [chatState, countdown, draft])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || chatState !== 'initial') return
    
    setChatState('generating')
    setErrorMsg(null)
    setNeedsEmailPrompt(false)
    setDraft(null)

    try {
      const res = await fetchWithAuth('/agent/task', {
        method: 'POST',
        body: JSON.stringify({ taskText: inputValue })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate task')
      }

      if (data.needsEmailPrompt) {
        setNeedsEmailPrompt(true)
        setRecipientName(data.draftData?.recipientName || 'the recipient')
        // We still have the partial draft data, wait for email to submit again
        setChatState('done')
      } else {
        setDraft(data.draft)
        setEditSubject(data.draft.subject)
        setEditBody(data.draft.body)
        setChatState('done')
      }
    } catch (err) {
      setErrorMsg(err.message)
      setChatState('initial')
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    
    setChatState('generating')
    setErrorMsg(null)
    setNeedsEmailPrompt(false)

    try {
      // In a real flow we might create the contact first, but for now just pass it as taskText or create contact.
      // Wait, the backend generateTask doesn't take 'emailInput'. It looks up by name. 
      // If we need to provide an email, we should probably just use the contacts API to create the contact, then retry generateTask.
      const contactRes = await fetchWithAuth('/contacts', {
        method: 'POST',
        body: JSON.stringify({ name: recipientName, email: emailInput, relationship_context: 'Created from prompt' })
      })
      if (!contactRes.ok) {
        const errData = await contactRes.json()
        throw new Error(errData.error || 'Failed to create contact')
      }

      // Retry task generation
      const res = await fetchWithAuth('/agent/task', {
        method: 'POST',
        body: JSON.stringify({ taskText: inputValue })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate task')

      setDraft(data.draft)
      setEditSubject(data.draft.subject)
      setEditBody(data.draft.body)
      setChatState('done')
    } catch (err) {
      setErrorMsg(err.message)
      setChatState('initial')
    }
  }

  const handleApprove = async () => {
    if (!draft) return
    setChatState('sending')
    setErrorMsg(null)

    try {
      const res = await fetchWithAuth('/agent/send', {
        method: 'POST',
        body: JSON.stringify({ draftId: draft.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to approve draft')
      
      setChatState('sent')
      setCountdown(30)
    } catch (err) {
      setErrorMsg(err.message)
      setChatState('done')
    }
  }

  const handleUndo = async () => {
    if (!draft) return
    setChatState('undoing')
    setErrorMsg(null)

    try {
      const res = await fetchWithAuth('/agent/undo', {
        method: 'POST',
        body: JSON.stringify({ draftId: draft.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to undo send')
      
      setChatState('done') // back to done state
    } catch (err) {
      setErrorMsg(err.message)
      setChatState('sent')
    }
  }

  const handleReject = async () => {
    if (!draft) return
    setChatState('generating') // Use this to show a loading state if needed, or something else
    setErrorMsg(null)

    try {
      const res = await fetchWithAuth('/agent/reject', {
        method: 'POST',
        body: JSON.stringify({ draftId: draft.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reject draft')
      
      resetDemo()
    } catch (err) {
      setErrorMsg(err.message)
      setChatState('done')
    }
  }

  const saveEdit = async () => {
    // In a real app we'd update the draft on backend too, but for UI we can just update local state.
    // Or we can just leave it local until sent.
    setDraft({ ...draft, subject: editSubject, body: editBody })
    setIsEditing(false)
  }

  const handleChipClick = (text) => {
    setInputValue(text)
  }

  const resetDemo = () => {
    setChatState('initial')
    setInputValue('')
    setDraft(null)
    setErrorMsg(null)
    setNeedsEmailPrompt(false)
    setEmailInput('')
  }

  return (
    <section id="demo" className="py-32 px-4 relative">
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
              {chatState !== 'initial' && chatState !== 'generating' && (
                <button onClick={resetDemo} className="text-xs text-white/40 hover:text-white transition-colors">
                  Reset
                </button>
              )}
            </div>
          </div>
          
          <div className="p-8 h-[500px] overflow-y-auto flex flex-col gap-8 font-sans scrollbar-hide">
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

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
                  transition={{ delay: 0.2 }}
                  className="flex gap-4"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_15px_rgba(124,92,255,0.2)]">
                    <Sparkles className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl rounded-tr-sm text-white/90 w-full backdrop-blur-md">
                    {chatState === 'generating' || chatState === 'sending' || chatState === 'undoing' ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-primary font-medium text-sm">
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_10px_rgba(124,92,255,0.8)]"></span>
                          </span>
                          {chatState === 'generating' ? 'Analyzing request & drafting...' : chatState === 'sending' ? 'Approving draft...' : 'Undoing send...'}
                        </div>
                      </div>
                    ) : needsEmailPrompt ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" /> I don't know {recipientName}'s email address.
                        </div>
                        <form onSubmit={handleEmailSubmit} className="flex gap-2">
                          <Input 
                            type="email"
                            placeholder="Enter their email address..."
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="bg-black/40 border-white/10 text-white"
                            required
                          />
                          <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-white">Save</Button>
                        </form>
                      </motion.div>
                    ) : chatState === 'sent' || chatState === 'success' ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> 
                          {chatState === 'success' ? 'Email sent successfully!' : `Draft approved! It will be sent in ${countdown} seconds.`}
                        </div>
                        {countdown > 0 && chatState === 'sent' ? (
                          <div className="flex items-center gap-3 mt-4">
                            <Button size="sm" variant="outline" className="h-9 gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10" onClick={handleUndo}>
                              <Undo className="h-3.5 w-3.5" /> Undo Send
                            </Button>
                          </div>
                        ) : chatState === 'success' ? (
                          <div className="text-sm text-white/50 mt-2">The email has been successfully sent.</div>
                        ) : (
                          <div className="text-sm text-white/50 mt-2">Checking final status...</div>
                        )}
                      </motion.div>
                    ) : draft ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <div className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> Draft generated successfully
                        </div>
                        
                        {isEditing ? (
                          <div className="bg-black/40 p-4 rounded-xl border border-white/10 mb-5 flex flex-col gap-3">
                            <Input 
                              value={editSubject} 
                              onChange={(e) => setEditSubject(e.target.value)} 
                              className="bg-white/5 border-white/10 text-white"
                              placeholder="Subject"
                            />
                            <textarea 
                              value={editBody}
                              onChange={(e) => setEditBody(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white text-sm min-h-[150px] focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                              <Button size="sm" onClick={saveEdit} className="bg-primary/20 text-primary hover:bg-primary/30 gap-2"><Save className="w-3.5 h-3.5" /> Save</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-black/40 p-5 rounded-xl border border-white/10 text-sm mb-5 shadow-inner leading-relaxed whitespace-pre-wrap">
                            <span className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-2 block">Subject: {draft.subject}</span>
                            <span className="text-white/80">{draft.body}</span>
                          </div>
                        )}

                        {!isEditing && (
                          <div className="flex items-center gap-3">
                            <Button size="sm" variant="ghost" className="h-9 text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-full px-4 gap-2" onClick={handleReject}>
                              <XCircle className="h-3.5 w-3.5" /> Reject
                            </Button>
                            <Button size="sm" variant="outline" className="h-9 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white transition-colors rounded-full px-5 gap-2" onClick={() => setIsEditing(true)}>
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button size="sm" className="h-9 gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-5 shadow-[0_0_15px_rgba(124,92,255,0.3)] transition-all hover:scale-105" onClick={handleApprove}>
                              <Send className="h-3.5 w-3.5" /> Approve & Send
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ) : null}
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
