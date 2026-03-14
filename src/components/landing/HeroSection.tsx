'use client'

import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Subtle background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-orange-100 blur-3xl opacity-60 -top-20 -right-20" />
        <div className="absolute w-80 h-80 rounded-full bg-amber-100 blur-3xl opacity-50 bottom-10 -left-20" />
        <div className="absolute w-64 h-64 rounded-full bg-blue-50 blur-3xl opacity-40 top-1/2 left-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 rounded-full px-4 py-2 text-orange-600 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              AI-powered • Grade 8–12 • Nepal
            </div>

            <h1 className="font-syne font-extrabold text-5xl lg:text-6xl leading-[1.08] tracking-tight text-slate-800 mb-6">
              {t('hero.title1')}<br />
              <span className="text-orange-500">{t('hero.title2')}</span><br />
              <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                {t('hero.title3')}
              </span>
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg">
              {t('hero.desc')}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-syne font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-200 text-sm"
              >
                🚀 {t('hero.cta')}
                <ArrowRight size={16} />
              </Link>
              
              {/* Fixed: Replaced incomplete <a> tag with proper Link component */}
              <Link
                href="#how"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all text-sm shadow-sm"
              >
                {t('hero.demo')}
              </Link>
            </div>

            <div className="flex gap-8">
              {[
                { num: '15+', label: 'Subjects covered' },
                { num: '50K+', label: 'Questions solved' },
                { num: '98%', label: 'Accuracy rate' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-syne font-extrabold text-2xl text-slate-800">{stat.num}</div>
                  <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Mockup */}
          <div className="relative hidden lg:block">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200">
              <div className="bg-slate-50 px-5 py-4 flex items-center gap-3 border-b border-slate-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-slate-400 text-xs font-syne ml-2">HomeworkSathi — Solving...</span>
              </div>

              <div className="p-6">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5">
                  <div className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                    📷 Uploaded question
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    If{' '}
                    <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-mono text-xs">
                      2x² + 5x − 3 = 0
                    </span>
                    , find the value of x using the quadratic formula.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { num: '1', color: 'blue', title: 'Identify coefficients', detail: 'a = 2, b = 5, c = −3' },
                    { num: '2', color: 'orange', title: 'Apply quadratic formula', detail: 'x = (−b ± √(b²−4ac)) / 2a' },
                    { num: '3', color: 'green', title: 'Calculate discriminant', detail: 'Δ = 25 + 24 = 49, so √Δ = 7' },
                    { num: '✓', color: 'amber', title: 'Final Answer', detail: 'x = ½ or x = −3' },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-3 items-start">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-syne flex-shrink-0 mt-0.5 ${
                        step.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        step.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                        step.color === 'green' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {step.num}
                      </div>
                      <div>
                        <div className="text-slate-700 text-xs font-semibold font-syne">{step.title}</div>
                        <div className="text-slate-400 text-xs mt-0.5 font-mono">{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-xs flex items-center gap-2 cursor-pointer hover:bg-blue-100 transition-all">
                  💡 Not clear on the quadratic formula?
                  <span className="font-semibold ml-auto">Click to go deeper →</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-6 bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-lg">
              <span>🎯</span>
              <div>
                <div className="font-syne font-bold text-slate-700 text-xs">Step-by-step</div>
                <div className="text-slate-400 text-[10px]">Clear explanations</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-6 bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-lg">
              <span>🇳🇵</span>
              <div>
                <div className="font-syne font-bold text-slate-700 text-xs">नेपालीमा पनि</div>
                <div className="text-slate-400 text-[10px]">Available in Nepali</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}