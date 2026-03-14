'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { BookOpen, Clock, Search, Filter, ArrowRight } from 'lucide-react'
import { SUBJECTS } from '@/constants/subjects'

type Question = {
  id: string
  question_text: string
  subject: string
  image_url: string | null
  created_at: string
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [filtered, setFiltered] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    supabase
      .from('questions')
      .select('id, question_text, subject, image_url, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setQuestions(data)
          setFiltered(data)
        }
        setLoading(false)
      })
  }, [user])

  useEffect(() => {
    let result = questions
    if (search) {
      result = result.filter((q) =>
        q.question_text.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (subjectFilter !== 'all') {
      result = result.filter((q) => q.subject === subjectFilter)
    }
    setFiltered(result)
  }, [search, subjectFilter, questions])

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-[#1e2d47] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-[#111827] border border-[#1e2d47] rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-orange-500 transition-all appearance-none"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-slate-500 text-xs">
        {filtered.length} question{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#111827] border border-[#1e2d47] rounded-xl p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-16 text-center">
          <span className="text-4xl block mb-4">🔍</span>
          <div className="font-syne font-bold text-white text-base mb-2">No questions found</div>
          <p className="text-slate-400 text-sm">
            {questions.length === 0
              ? "You haven't solved any questions yet."
              : 'Try a different search or filter.'}
          </p>
          {questions.length === 0 && (
            <Link
              href="/solve"
              className="inline-flex items-center gap-2 mt-6 bg-orange-500 hover:bg-orange-400 text-white font-syne font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
            >
              Solve first question
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => {
            const subject = SUBJECTS.find((s) => s.id === q.subject)
            return (
              <Link
                key={q.id}
                href={`/question/${q.id}`}
                className="group flex items-center gap-4 bg-[#111827] border border-[#1e2d47] hover:border-slate-600 rounded-xl p-4 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: subject?.bgColor ?? 'rgba(255,255,255,0.05)' }}
                >
                  {subject?.emoji ?? '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium line-clamp-1">
                    {q.question_text}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className="text-xs font-medium"
                      style={{ color: subject?.color ?? '#94a3b8' }}
                    >
                      {subject?.name ?? q.subject}
                    </span>
                    <span className="text-slate-600 text-xs flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(q.created_at).toLocaleDateString('en-NP')}
                    </span>
                    {q.image_url && (
                      <span className="text-slate-600 text-xs">📷 Image</span>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}