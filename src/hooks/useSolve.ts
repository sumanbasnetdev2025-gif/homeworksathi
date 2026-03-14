'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUsageLimit } from '@/hooks/useUsageLimit'
import { createClient } from '@/lib/supabase/client'
import type { Solution, Language } from '@/types'

export function useSolve() {
  const { user } = useAuth()
  const { canAsk, incrementUsage } = useUsageLimit()
  const [solving, setSolving] = useState(false)
  const [solution, setSolution] = useState<Solution | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [questionId, setQuestionId] = useState<string | null>(null)
  const supabase = createClient()

  const solve = async ({
    questionText,
    subject,
    imageUrl,
    language,
  }: {
    questionText: string
    subject: string
    imageUrl?: string
    language: Language
  }) => {
    if (!canAsk) {
      setError('Daily limit reached. Upgrade to Premium for unlimited questions.')
      return
    }

    if (!questionText.trim()) {
      setError('Please enter a question or upload an image.')
      return
    }

    setError(null)
    setSolving(true)
    setSolution(null)

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText, subject, imageUrl, language }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to solve question')
      }

      const data = await response.json()
      setSolution(data.solution)

      // Save to database
      if (user) {
        const { data: qData } = await supabase
          .from('questions')
          .insert({
            user_id: user.id,
            question_text: questionText,
            subject,
            image_url: imageUrl ?? null,
            language,
          })
          .select('id')
          .single()

        if (qData) {
          setQuestionId(qData.id)
          await supabase.from('solutions').insert({
            question_id: qData.id,
            steps: data.solution.steps,
            final_answer: data.solution.finalAnswer,
          })
        }

        await incrementUsage()
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setSolving(false)
    }
  }

  const reset = () => {
    setSolution(null)
    setError(null)
    setQuestionId(null)
  }

  return { solve, solving, solution, error, questionId, reset }
}