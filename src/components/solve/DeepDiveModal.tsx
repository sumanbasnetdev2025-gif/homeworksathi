'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, ZoomIn } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface DeepDiveModalProps {
  stepContent: string
  subject: string
  onClose: () => void
}

export default function DeepDiveModal({ stepContent, subject, onClose }: DeepDiveModalProps) {
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    fetch('/api/followup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        followUpText: `Please explain this step in more detail, as if teaching a Grade 10 student: "${stepContent}"`,
        originalQuestion: stepContent,
        subject,
        language,
        history: [],
        isDeepDive: true,
      }),
    })
      .then((r) => r.json())
      .then((data) => setExplanation(data.answer ?? 'Could not load explanation.'))
      .catch(() => setExplanation('Could not load explanation. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1e]/80 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e2d47]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500/15 rounded-lg flex items-center justify-center">
              <ZoomIn size={13} className="text-blue-400" />
            </div>
            <span className="font-syne font-bold text-white text-sm">Deep Dive</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#1a2235] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Step context */}
        <div className="px-5 py-3 bg-[#0d1428] border-b border-[#1e2d47]">
          <p className="text-slate-400 text-xs line-clamp-2">{stepContent}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <Loader2 size={20} className="text-orange-400 animate-spin" />
              <span className="text-slate-400 text-sm">Loading deeper explanation...</span>
            </div>
          ) : (
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {explanation}
            </p>
          )}
        </div>

        <div className="p-4 border-t border-[#1e2d47]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1a2235] hover:bg-[#1e2d47] text-slate-300 font-syne font-semibold text-sm rounded-xl transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}