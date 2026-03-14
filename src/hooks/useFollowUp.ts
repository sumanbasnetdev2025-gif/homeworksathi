'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import type { Language } from '@/types'

type FollowUpMessage = {
  role: 'user' | 'assistant'
  content: string
}

export function useFollowUp() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<FollowUpMessage[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const ask = async ({
    followUpText,
    questionId,
    originalQuestion,
    subject,
    language,
  }: {
    followUpText: string
    questionId: string | null
    originalQuestion: string
    subject: string
    language: Language
  }) => {
    if (!followUpText.trim()) return

    const userMessage: FollowUpMessage = { role: 'user', content: followUpText }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followUpText,
          originalQuestion,
          subject,
          language,
          history: messages,
        }),
      })

      const data = await response.json()
      const assistantMessage: FollowUpMessage = {
        role: 'assistant',
        content: data.answer,
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Save to DB
      if (user && questionId) {
        await supabase.from('followups').insert({
          question_id: questionId,
          user_id: user.id,
          followup_text: followUpText,
          response: data.answer,
        })
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const reset = () => setMessages([])

  return { messages, ask, loading, reset }
}