'use client'

import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useUsageLimit } from '@/hooks/useUsageLimit'
import { useSolve } from '@/hooks/useSolve'
import SubjectSelector from '@/components/solve/SubjectSelector'
import UploadTabs from '@/components/upload/UploadTabs'
import SolutionDisplay from '@/components/solve/SolutionDisplay'
import LoadingSkeleton from '@/components/solve/LoadingSkeleton'
import Link from 'next/link'
import { Zap, Crown, AlertCircle, RotateCcw } from 'lucide-react'

export default function SolvePage() {
  const { language } = useLanguage()
  const { canAsk, remaining, plan, dailyUsage, limit } = useUsageLimit()
  const { solve, solving, solution, error, questionId, reset } = useSolve()

  const [subject, setSubject] = useState('mathematics')
  const [questionText, setQuestionText] = useState('')
  const [imageUrl, setImageUrl] = useState<string | undefined>()

  const handleQuestionReady = (text: string, url?: string) => {
    setQuestionText(text)
    if (url) setImageUrl(url)
  }

  const handleSolve = () => {
    solve({ questionText, subject, imageUrl, language })
  }

  const handleReset = () => {
    reset()
    setQuestionText('')
    setImageUrl(undefined)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Usage warning */}
      {plan === 'free' && (
        <div className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 border text-sm ${
          remaining === 0
            ? 'bg-red-500/10 border-red-500/20'
            : remaining <= 2
            ? 'bg-amber-500/10 border-amber-500/20'
            : 'bg-[#111827] border-[#1e2d47]'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className={
              remaining === 0 ? 'text-red-400' :
              remaining <= 2 ? 'text-amber-400' : 'text-slate-400'
            } />
            <span className={
              remaining === 0 ? 'text-red-300' :
              remaining <= 2 ? 'text-amber-300' : 'text-slate-400'
            }>
              {remaining === 0
                ? 'Daily limit reached. Upgrade for unlimited questions.'
                : `${remaining} of ${limit} free questions remaining today`}
            </span>
          </div>
          <Link
            href="/settings?tab=billing"
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-syne font-semibold text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            <Crown size={11} />
            Upgrade
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — Input panel */}
        <div className="space-y-5">

          {/* Subject selector */}
          <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5">
            <h3 className="font-syne font-bold text-white text-sm mb-4">
              1. Select Subject
            </h3>
            <SubjectSelector
              value={subject}
              onChange={setSubject}
              disabled={solving || !canAsk}
            />
          </div>

          {/* Upload / type question */}
          <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5">
            <h3 className="font-syne font-bold text-white text-sm mb-4">
              2. Upload or Type Your Question
            </h3>
            <UploadTabs
              onQuestionReady={handleQuestionReady}
              disabled={solving || !canAsk}
            />

            {/* Show extracted text preview */}
            {questionText && (
              <div className="mt-4 bg-[#0d1428] border border-[#1e2d47] rounded-xl p-4">
                <div className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  Question Ready
                </div>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {questionText}
                </p>
              </div>
            )}
          </div>

          {/* Solve button */}
          <button
            onClick={handleSolve}
            disabled={solving || !canAsk || (!questionText.trim() && !imageUrl)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-syne font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 text-base"
          >
            {solving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Solving...
              </>
            ) : (
              <>
                <Zap size={18} />
                Solve Now
              </>
            )}
          </button>
        </div>

        {/* Right — Solution panel */}
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5 min-h-[400px]">
          {!solving && !solution && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-16 h-16 bg-[#1a2235] rounded-2xl flex items-center justify-center mb-4 text-3xl">
                🧠
              </div>
              <h3 className="font-syne font-bold text-white text-base mb-2">
                Solution appears here
              </h3>
              <p className="text-slate-500 text-sm max-w-xs">
                Select a subject, upload or type your question, then hit Solve Now.
              </p>
            </div>
          )}

          {solving && <LoadingSkeleton />}

          {error && !solving && (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={22} className="text-red-400" />
              </div>
              <h3 className="font-syne font-bold text-white text-sm mb-2">
                Something went wrong
              </h3>
              <p className="text-slate-400 text-sm mb-4 max-w-xs">{error}</p>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
              >
                <RotateCcw size={13} />
                Try again
              </button>
            </div>
          )}

          {solution && !solving && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-syne font-bold text-white text-sm">Solution</span>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <RotateCcw size={11} />
                  New question
                </button>
              </div>
              <SolutionDisplay
                solution={solution}
                questionId={questionId}
                originalQuestion={questionText}
                subject={subject}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}