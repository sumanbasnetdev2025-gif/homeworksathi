'use client'

import Link from 'next/link'
import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Free', price: 'रू0', period: 'Forever free',
    desc: 'No credit card needed', cta: 'Get started free',
    href: '/signup', featured: false,
    features: [
      { text: '5 questions per day', included: true },
      { text: 'All 15 subjects', included: true },
      { text: 'Step-by-step solutions', included: true },
      { text: 'English & Nepali', included: true },
      { text: 'Follow-up questions', included: false },
      { text: 'Practice generator', included: false },
      { text: 'Question history', included: false },
    ],
  },
  {
    name: 'Premium', price: 'रू299', period: 'per month',
    desc: 'Cancel anytime', cta: 'Start Premium',
    href: '/signup?plan=premium', featured: true, badge: '⭐ Most Popular',
    features: [
      { text: 'Unlimited questions', included: true },
      { text: 'All 15 subjects', included: true },
      { text: 'Step-by-step solutions', included: true },
      { text: 'English & Nepali', included: true },
      { text: 'Unlimited follow-ups', included: true },
      { text: 'Practice generator', included: true },
      { text: 'Full question history', included: true },
    ],
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Pricing</span>
          <h2 className="font-syne font-extrabold text-4xl lg:text-5xl text-slate-800 mt-3 tracking-tight">
            Start free.<br />Upgrade when ready.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.featured
                  ? 'bg-orange-500 border-orange-500 text-white shadow-2xl shadow-orange-200'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="inline-block bg-white/20 text-white text-xs font-syne font-bold px-3 py-1 rounded-full mb-4">
                  {plan.badge}
                </div>
              )}

              <div className={`font-syne font-bold text-xl mb-2 ${plan.featured ? 'text-white' : 'text-slate-800'}`}>
                {plan.name}
              </div>
              <div className={`font-syne font-extrabold text-5xl mb-1 ${plan.featured ? 'text-white' : 'text-slate-800'}`}>
                {plan.price}
                <span className={`text-base font-normal ml-2 ${plan.featured ? 'text-orange-100' : 'text-slate-400'}`}>
                  / {plan.period}
                </span>
              </div>
              <div className={`text-sm mb-8 ${plan.featured ? 'text-orange-100' : 'text-slate-400'}`}>
                {plan.desc}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <Check size={15} className={plan.featured ? 'text-white' : 'text-emerald-500'} />
                    ) : (
                      <X size={15} className={plan.featured ? 'text-orange-200' : 'text-slate-300'} />
                    )}
                    <span className={
                      feature.included
                        ? plan.featured ? 'text-white' : 'text-slate-700'
                        : plan.featured ? 'text-orange-200' : 'text-slate-400'
                    }>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full flex items-center justify-center py-3 rounded-xl font-syne font-semibold text-sm transition-all ${
                  plan.featured
                    ? 'bg-white text-orange-500 hover:bg-orange-50 shadow-md'
                    : 'bg-orange-500 hover:bg-orange-400 text-white shadow-md shadow-orange-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}