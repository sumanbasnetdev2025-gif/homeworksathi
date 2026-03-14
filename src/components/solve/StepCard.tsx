'use client'

import { useState } from 'react'
import type { SolveStep } from '@/types'
import { ChevronDown, ChevronUp, ZoomIn } from 'lucide-react'

interface StepCardProps {
  step: SolveStep
  onDeepDive: () => void
}

const stepColors = [
  { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/20' },
  { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/20' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/20' },
  { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-500/20' },
  { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20' },
]

export default function StepCard({ step, onDeepDive }: StepCardProps) {
  const [expanded, setExpanded] = useState(true)
  const color = stepColors[(step.stepNumber - 1) % stepColors.length]
  const explanationText = step.explanation ?? step.content ?? ''

  return (
    <div className={`bg-[#111827] border ${color.border} rounded-xl overflow-hidden transition-all`}>
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#1a2235]/50 transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-syne font-bold text-xs flex-shrink-0 ${color.bg} ${color.text}`}>
          {step.stepNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-syne font-bold text-white text-sm">{step.title}</div>
          {!expanded && (
            <div className="text-slate-500 text-xs mt-0.5 truncate">{explanationText}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDeepDive() }}
            className={`p-1.5 rounded-lg ${color.bg} ${color.text} hover:opacity-80 transition-opacity`}
            title="Deep dive into this step"
          >
            <ZoomIn size={12} />
          </button>
          {expanded ? (
            <ChevronUp size={14} className="text-slate-500" />
          ) : (
            <ChevronDown size={14} className="text-slate-500" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="pl-10">
            <p className="text-slate-300 text-sm leading-relaxed">{explanationText}</p>
            {step.math && (
              <div className="mt-2 bg-[#0d1428] border border-[#1e2d47] rounded-lg px-4 py-2.5 font-mono text-amber-300 text-sm">
                {step.math}
              </div>
            )}
            <button
              onClick={onDeepDive}
              className="mt-3 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <ZoomIn size={11} />
              Not clear? Click for deeper explanation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}