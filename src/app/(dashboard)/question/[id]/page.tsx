'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import SolutionDisplay from '@/components/solve/SolutionDisplay'
import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen } from 'lucide-react'
import { SUBJECTS } from '@/constants/subjects'
import type { Solution } from '@/types'

type QuestionDetail = {
  id: string
  question_text: string
  subject: string
  image_url: string | null
  language: string
  created_at: string
  solutions: {
    id: string
    steps: any[]
    final_answer: string
  }[]
}

export default function QuestionDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [question, setQuestion] = useState<QuestionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user || !id) return
    supabase
      .from('questions')
      .select(`
        id, question_text, subject, image_url, language, created_at,
        solutions (id, steps, final_answer)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setQuestion(data as any)
        setLoading(false)
      })
  }, [user, id])

  const subject = SUBJECTS.find((s) => s.id === question?.subject)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-[#111827] rounded-xl w-48" />
        <div className="h-32 bg-[#111827] rounded-2xl" />
        <div className="h-64 bg-[#111827] rounded-2xl" />
      </div>
    )
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <span className="text-4xl block mb-4">🔍</span>
        <h2 className="font-syne font-bold text-white text-xl mb-2">Question not found</h2>
        <p className="text-slate-400 text-sm mb-6">
          This question may have been deleted or you don't have access.
        </p>
        <Link href="/history" className="text-orange-400 hover:text-orange-300 text-sm">
          ← Back to history
        </Link>
      </div>
    )
  }

  // Build solution object from DB data
  const solutionFromDB: Solution | null = question.solutions?.[0]
    ? {
        id: question.solutions[0].id,
        question: question.question_text,
        subject: question.subject,
        steps: question.solutions[0].steps,
        finalAnswer: question.solutions[0].final_answer,
        language: question.language as 'en' | 'ne',
        createdAt: question.created_at,
      }
    : null

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Back button */}
      <Link
        href="/history"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={14} />
        Back to History
      </Link>

      {/* Question card */}
      <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: subject?.bgColor ?? 'rgba(255,255,255,0.05)' }}
          >
            {subject?.emoji ?? '📝'}
          </div>
          <div>
            <div
              className="text-xs font-syne font-bold mb-1"
              style={{ color: subject?.color ?? '#94a3b8' }}
            >
              {subject?.name ?? question.subject}
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-xs">
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {new Date(question.created_at).toLocaleDateString('en-NP', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
              <span className="uppercase tracking-wider">
                {question.language === 'ne' ? '🇳🇵 NE' : '🇬🇧 EN'}
              </span>
            </div>
          </div>
        </div>

        {/* Question text */}
        <div className="bg-[#0d1428] border border-[#1e2d47] rounded-xl p-4">
          <div className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            Question
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {question.question_text}
          </p>
        </div>

        {/* Uploaded image */}
        {question.image_url && (
          <div className="mt-3">
            <div className="text-slate-500 text-xs mb-2 flex items-center gap-1">
              <BookOpen size={10} />
              Uploaded image
            </div>
            <img
              src={question.image_url}
              alt="Homework"
              className="rounded-xl max-h-48 object-contain bg-[#0d1428] p-2 border border-[#1e2d47]"
            />
          </div>
        )}
      </div>

      {/* Solution */}
      {solutionFromDB ? (
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5">
          <h3 className="font-syne font-bold text-white text-sm mb-4">Solution</h3>
          <SolutionDisplay
            solution={solutionFromDB}
            questionId={question.id}
            originalQuestion={question.question_text}
            subject={question.subject}
          />
        </div>
      ) : (
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-8 text-center">
          <p className="text-slate-400 text-sm">No solution saved for this question.</p>
          <Link
            href="/solve"
            className="inline-flex items-center gap-2 mt-4 text-orange-400 hover:text-orange-300 text-sm"
          >
            Solve it again →
          </Link>
        </div>
      )}
    </div>
  )
}