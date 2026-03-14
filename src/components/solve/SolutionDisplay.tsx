'use client'

import { useState } from 'react'
import type { Solution } from '@/types'
import StepCard from './StepCard'
import DeepDiveModal from './DeepDiveModal'
import FollowUpChat from './FollowUpChat'
import { CheckCircle, MessageCircle } from 'lucide-react'

interface SolutionDisplayProps {
  solution: Solution
  questionId: string | null
  originalQuestion: string
  subject: string
}

export default function SolutionDisplay({
  solution,
  questionId,
  originalQuestion,
  subject,
}: SolutionDisplayProps) {
  const [deepDiveStep, setDeepDiveStep] = useState<string | null>(null)
  const [showFollowUp, setShowFollowUp] = useState(false)

  // Safety check
  const steps = Array.isArray(solution?.steps) ? solution.steps : []
  const finalAnswer = solution?.finalAnswer ?? solution?.final_answer ?? 'See steps above'

  if (!solution) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400 text-sm">No solution available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle size={13} className="text-emerald-400" />
          </div>
          <span className="font-syne font-bold text-white text-sm">Solution Found</span>
        </div>
        <button
          onClick={() => setShowFollowUp(!showFollowUp)}
          className="flex items-center gap-1.5 text-xs font-syne font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <MessageCircle size={13} />
          Ask follow-up
        </button>
      </div>

      {/* Steps */}
      {steps.length > 0 ? (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <StepCard
              key={step?.stepNumber ?? index}
              step={{
                stepNumber: step?.stepNumber ?? index + 1,
                title: step?.title ?? `Step ${index + 1}`,
                explanation: step?.explanation ?? step?.content ?? '',
                math: step?.math ?? '',
              }}
              onDeepDive={() =>
                setDeepDiveStep(`${step?.title}: ${step?.explanation ?? ''}`)
              }
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#0d1428] border border-[#1e2d47] rounded-xl p-4">
          <p className="text-slate-400 text-sm">No steps available.</p>
        </div>
      )}

      {/* Final Answer */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
        <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
          ✓ Final Answer
        </div>
        <div className="text-white font-syne font-bold text-base">
          {finalAnswer}
        </div>
      </div>

      {/* Follow-up chat */}
      {showFollowUp && (
        <FollowUpChat
          questionId={questionId}
          originalQuestion={originalQuestion}
          subject={subject}
        />
      )}

      {/* Deep dive modal */}
      {deepDiveStep && (
        <DeepDiveModal
          stepContent={deepDiveStep}
          subject={subject}
          onClose={() => setDeepDiveStep(null)}
        />
      )}
    </div>
  )
}