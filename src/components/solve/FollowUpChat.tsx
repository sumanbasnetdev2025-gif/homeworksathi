'use client'

import { useState, useRef, useEffect } from 'react'
import { useFollowUp } from '@/hooks/useFollowUp'
import { useLanguage } from '@/hooks/useLanguage'
import { Send, Loader2, Bot, User } from 'lucide-react'

interface FollowUpChatProps {
  questionId: string | null
  originalQuestion: string
  subject: string
}

export default function FollowUpChat({
  questionId,
  originalQuestion,
  subject,
}: FollowUpChatProps) {
  const { messages, ask, loading } = useFollowUp()
  const { language } = useLanguage()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const text = input
    setInput('')
    await ask({ followUpText: text, questionId, originalQuestion, subject, language })
  }

  return (
    <div className="bg-[#0d1428] border border-[#1e2d47] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2d47] flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500/15 rounded-lg flex items-center justify-center">
          <Bot size={12} className="text-blue-400" />
        </div>
        <span className="font-syne font-bold text-white text-xs">Follow-up Questions</span>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center py-4">
            <p className="text-slate-500 text-xs">
              Ask anything about the solution above!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {[
                'Why did you divide by 2?',
                'Can you show another method?',
                'What is the formula used?',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="text-xs bg-[#111827] border border-[#1e2d47] hover:border-slate-600 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === 'user'
                ? 'bg-orange-500/20'
                : 'bg-blue-500/20'
            }`}>
              {msg.role === 'user'
                ? <User size={11} className="text-orange-400" />
                : <Bot size={11} className="text-blue-400" />
              }
            </div>
            <div className={`max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-orange-500/10 border border-orange-500/20 text-orange-100'
                : 'bg-[#111827] border border-[#1e2d47] text-slate-300'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bot size={11} className="text-blue-400" />
            </div>
            <div className="bg-[#111827] border border-[#1e2d47] rounded-xl px-3 py-2.5">
              <Loader2 size={12} className="text-blue-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#1e2d47] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Why did you divide by 2?"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-[#111827] border border-[#1e2d47] rounded-xl px-3 py-2 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-orange-500 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-8 h-8 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
        >
          <Send size={13} className="text-white" />
        </button>
      </div>
    </div>
  )
}