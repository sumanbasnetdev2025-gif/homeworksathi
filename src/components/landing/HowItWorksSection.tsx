'use client'

import Link from 'next/link'

const steps = [
  {
    num: '1', color: '#3b82f6', bg: '#eff6ff',
    title: 'Upload your question',
    desc: 'Take a photo, drag & drop, paste text, or type your question. Supports JPG, PNG, and PDF.',
  },
  {
    num: '2', color: '#f97316', bg: '#fff7ed',
    title: 'AI reads & understands',
    desc: 'Our OCR engine extracts text and math equations with high accuracy, even handwritten notes.',
  },
  {
    num: '3', color: '#10b981', bg: '#ecfdf5',
    title: 'Get step-by-step solution',
    desc: 'The AI breaks down the solution into clear steps explaining each one so you actually learn.',
  },
  {
    num: '4', color: '#f59e0b', bg: '#fffbeb',
    title: 'Ask follow-up questions',
    desc: 'Confused about a step? Click it or ask a follow-up to get a deeper explanation instantly.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-5 relative">
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-5 top-11 w-px h-[calc(100%-12px)]"
                    style={{ background: `linear-gradient(to bottom, ${step.color}40, transparent)` }}
                  />
                )}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-extrabold text-sm flex-shrink-0 relative z-10 border"
                  style={{ background: step.bg, color: step.color, borderColor: `${step.color}30` }}
                >
                  {step.num}
                </div>
                <div className="pb-10">
                  <div className="font-syne font-bold text-slate-800 text-base mb-1.5">{step.title}</div>
                  <div className="text-slate-500 text-sm leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
              How it works
            </span>
            <h2 className="font-syne font-extrabold text-4xl lg:text-5xl text-slate-800 mt-3 mb-5 tracking-tight leading-tight">
              From photo<br />to solution<br />
              <span className="text-orange-500">in seconds.</span>
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              No more waiting for a tutor. HomeworkSathi is available 24/7 and never gets tired of explaining.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-syne font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-200 text-sm"
            >
              🚀 Try it now — it is free
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}