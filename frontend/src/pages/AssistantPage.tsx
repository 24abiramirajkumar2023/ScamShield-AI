import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, ShieldAlert, Sparkles, User } from 'lucide-react'
import { askSecurityAssistant, QUICK_QUESTIONS } from '../data/assistantKnowledge'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: 'openai' | 'local'
  timestamp: string
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  source: 'local',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  content:
    '**[ScamShield SOC Assistant Online]**\n\nAsk me anything about phishing, OTP fraud, fake job deposits, suspicious URLs, crypto scams, or emergency steps if you clicked a malicious link.',
}

function renderFormattedLine(line: string): React.ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={idx}>{part}</span>
  })
}

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const sendMessage = async (textOverride?: string) => {
    const query = (textOverride ?? input).trim()
    if (!query || isThinking) return

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: timeNow,
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    if (!textOverride) setInput('')
    setIsThinking(true)

    try {
      const historyPayload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }))
      const { reply, source } = await askSecurityAssistant(query, historyPayload)

      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: reply,
        source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-[#321010] pb-6">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF2020]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>INTERACTIVE SOC GUIDANCE</span>
        </div>
        <h1 className="mt-2 text-2xl font-black tracking-wide text-white sm:text-4xl">
          SCAMSHIELD SECURITY ASSISTANT
        </h1>
        <p className="mt-2 text-sm text-[#A0A0A0]">
          Get instant cybersecurity triage advice, scam verification rules, and incident response
          steps.
        </p>
      </div>

      {/* Quick Question Chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q.id}
            type="button"
            disabled={isThinking}
            onClick={() => void sendMessage(q.prompt)}
            className="rounded-full border border-[#321010] bg-[#111111] px-3.5 py-1.5 font-mono text-xs text-[#D4D4D4] transition-all hover:border-[#FF2020] hover:bg-[#FF2020]/15 hover:text-white disabled:opacity-50"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Chat Panel */}
      <div className="mt-6 flex h-[540px] flex-col overflow-hidden rounded-2xl border border-[#321010] bg-[#111111] glow-red">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-[#321010] bg-[#0A0A0A] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#321010] bg-[#171717]">
              <ShieldAlert className="h-4 w-4 text-[#FF2020]" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-white">SOC ANALYST AI</p>
              <p className="font-mono text-[10px] text-[#A0A0A0]">
                {import.meta.env.VITE_OPENAI_KEY
                  ? 'HYBRID LLM + LOCAL PLAYBOOK'
                  : 'LOCAL CYBER KNOWLEDGE ENGINE'}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-[#321010] bg-[#111111] px-2.5 py-0.5 font-mono text-[10px] text-[#FF3030]">
            ACTIVE
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user'
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                    isUser
                      ? 'border-[#FF2020] bg-[#FF2020]/20 text-white'
                      : 'border-[#321010] bg-[#0A0A0A] text-[#FF2020]'
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'border-[#FF2020]/60 bg-[#FF2020]/15 text-white'
                      : 'border-[#321010] bg-[#0A0A0A] text-[#D4D4D4]'
                  }`}
                >
                  <div className="space-y-1.5">
                    {msg.content.split('\n').map((line, i) =>
                      line.trim() === '' ? (
                        <div key={i} className="h-1" />
                      ) : (
                        <p key={i}>{renderFormattedLine(line)}</p>
                      )
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-2 font-mono text-[10px] text-[#A0A0A0]">
                    {!isUser && msg.source && (
                      <span className="uppercase">{msg.source === 'openai' ? 'LLM' : 'SOC KB'}</span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#321010] bg-[#0A0A0A] text-[#FF2020]">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] px-4 py-2.5 font-mono text-xs text-[#FF3030]">
                Analyzing security query...
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void sendMessage()
          }}
          className="flex items-center gap-3 border-t border-[#321010] bg-[#0A0A0A] p-3 sm:p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about phishing, OTP safety, suspicious links, or reporting fraud..."
            className="flex-1 rounded-xl border border-[#321010] bg-[#050505] px-4 py-3 text-sm text-white placeholder-[#666666] focus:border-[#FF2020] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF2020] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#FF3030] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  )
}
