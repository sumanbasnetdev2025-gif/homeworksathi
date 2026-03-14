'use client'

import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { useUsageLimit } from '@/hooks/useUsageLimit'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SUBJECTS } from '@/constants/subjects'
import { Loader2, RefreshCw, Crown, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

type PracticeQuestion = {
  id: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  revealed: boolean
}

const difficultyColors = {
  easy: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  hard: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
}

export default function PracticePage() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const { plan } = useUsageLimit()
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('mathematics')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [generated, setGenerated] = useState(false)
  const supabase = createClient()

  const generatePractice = async () => {
    if (plan === 'free') {
      toast.error('Practice generator is a Premium feature. Upgrade to unlock!')
      return
    }

    setLoading(true)
    setGenerated(false)

    try {
      const res = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: selectedSubject, difficulty, language, userId: user?.id }),
      })
      const data = await res.json()
      if (data.questions) {
        setQuestions(data.questions.map((q: any) => ({ ...q, revealed: false })))
        setGenerated(true)

        // Save to DB
        if (user) {
          for (const q of data.questions) {
            await supabase.from('practice_questions').insert({
              user_id: user.id,
              subject: selectedSubject,
              question_text: q.question,
              answer: q.answer,
              difficulty,
            })
          }
        }
      }
    } catch {
      toast.error('Failed to generate practice questions')
    } finally {
      setLoading(false)
    }
  }

  const toggleReveal = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => q.id === id ? { ...q, revealed: !q.revealed } : q)
    )
  }

  const subject = SUBJECTS.find((s) => s.id === selectedSubject)

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Premium gate */}
      {plan === 'free' && (
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown size={16} className="text-orange-400" />
              <span className="font-syne font-bold text-white text-sm">Premium Feature</span>
            </div>
            <p className="text-slate-400 text-sm">
              Upgrade to generate unlimited personalized practice questions.
            </p>
          </div>
          <Link
            href="/settings?tab=billing"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-syne font-semibold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap"
          >
            <Crown size={13} />
            Upgrade — रू299/mo
          </Link>
        </div>
      )}

      {/* Controls */}
      <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5 space-y-5">
        <h3 className="font-syne font-bold text-white text-sm">Generate Practice Questions</h3>

        {/* Subject picker */}
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-3">Subject</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {SUBJECTS.slice(0, 10).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all text-xs ${
                  selectedSubject === s.id
                    ? 'border-orange-500/40 bg-orange-500/10 text-white'
                    : 'border-[#1e2d47] text-slate-500 hover:text-white hover:border-slate-600'
                }`}
              >
                <span className="text-lg">{s.emoji}</span>
                <span className="font-syne font-semibold leading-tight line-clamp-1 text-[10px]">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-3">Difficulty</label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((d) => {
              const c = difficultyColors[d]
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-syne font-semibold capitalize transition-all ${
                    difficulty === d
                      ? `${c.bg} ${c.text} ${c.border}`
                      : 'border-[#1e2d47] text-slate-500 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={generatePractice}
          disabled={loading || plan === 'free'}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-syne font-bold py-3 rounded-xl transition-all text-sm"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Generating questions...
            </>
          ) : (
            <>
              <RefreshCw size={15} />
              Generate 5 Practice Questions
            </>
          )}
        </button>
      </div>

      {/* Questions list */}
      {generated && questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-syne font-bold text-white text-sm">
              {subject?.emoji} {subject?.name} — {difficulty} difficulty
            </h3>
            <button
              onClick={generatePractice}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <RefreshCw size={11} />
              Regenerate
            </button>
          </div>

          {questions.map((q, i) => {
            const c = difficultyColors[q.difficulty]
            return (
              <div
                key={q.id}
                className="bg-[#111827] border border-[#1e2d47] rounded-2xl overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-[#1a2235] rounded-lg flex items-center justify-center font-syne font-bold text-xs text-slate-400 flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed">{q.question}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] font-syne font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-[#0d1428] hover:bg-[#1a2235] border border-[#1e2d47] rounded-xl text-xs font-syne font-semibold text-slate-400 hover:text-white transition-all"
                  >
                    {q.revealed ? (
                      <>
                        <XCircle size={12} className="text-red-400" />
                        Hide Answer
                        <ChevronUp size={12} />
                      </>
                    ) : (
                      <>
                        <CheckCircle size={12} className="text-emerald-400" />
                        Reveal Answer
                        <ChevronDown size={12} />
                      </>
                    )}
                  </button>
                </div>

                {q.revealed && (
                  <div className="border-t border-[#1e2d47] bg-emerald-500/5 px-5 py-4">
                    <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                      ✓ Answer
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{q.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}