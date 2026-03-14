'use client'

import { useAuth } from '@/hooks/useAuth'
import { useUsageLimit } from '@/hooks/useUsageLimit'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Zap, History, BookOpen, Crown,
  TrendingUp, Clock, CheckCircle, ArrowRight,
} from 'lucide-react'

type RecentQuestion = {
  id: string
  question_text: string
  subject: string
  created_at: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { dailyUsage, limit, remaining, plan } = useUsageLimit()
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([])
  const supabase = createClient()

  const firstName = user?.user_metadata?.name?.split(' ')[0] ?? 'Student'

  useEffect(() => {
    if (!user) return
    supabase
      .from('questions')
      .select('id, question_text, subject, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentQuestions(data)
      })
  }, [user])

  const usagePercent = plan === 'premium' ? 100 : Math.min(100, (dailyUsage / limit) * 100)

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-syne font-extrabold text-2xl text-white">
            Welcome back, {firstName}! 👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Ready to tackle some homework?
          </p>
        </div>
        <Link
          href="/solve"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-syne font-semibold px-5 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 text-sm"
        >
          <Zap size={16} />
          Solve Now
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily usage */}
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-medium">Daily Usage</span>
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-orange-400" />
            </div>
          </div>
          <div className="font-syne font-extrabold text-3xl text-white mb-1">
            {plan === 'premium' ? '∞' : `${dailyUsage}/${limit}`}
          </div>
          <div className="text-slate-500 text-xs">
            {plan === 'premium' ? 'Unlimited questions' : `${remaining} remaining today`}
          </div>
          {plan === 'free' && (
            <div className="mt-3 bg-[#1a2235] rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Total solved */}
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-medium">Total Solved</span>
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle size={14} className="text-emerald-400" />
            </div>
          </div>
          <div className="font-syne font-extrabold text-3xl text-white mb-1">
            {recentQuestions.length}
          </div>
          <div className="text-slate-500 text-xs">Questions this session</div>
        </div>

        {/* Streak */}
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-medium">Study Streak</span>
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={14} className="text-blue-400" />
            </div>
          </div>
          <div className="font-syne font-extrabold text-3xl text-white mb-1">1</div>
          <div className="text-slate-500 text-xs">Day streak 🔥</div>
        </div>

        {/* Plan */}
        <div className={`rounded-2xl p-5 border ${
          plan === 'premium'
            ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20'
            : 'bg-[#111827] border-[#1e2d47]'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-medium">Your Plan</span>
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Crown size={14} className="text-amber-400" />
            </div>
          </div>
          <div className="font-syne font-extrabold text-3xl text-white mb-1 capitalize">
            {plan}
          </div>
          {plan === 'free' ? (
            <Link
              href="/settings?tab=billing"
              className="text-orange-400 text-xs hover:text-orange-300 transition-colors"
            >
              Upgrade to Premium →
            </Link>
          ) : (
            <div className="text-slate-500 text-xs">Unlimited access</div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-syne font-bold text-white text-base mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              href: '/solve',
              icon: '⚡',
              bg: 'from-orange-500/10 to-amber-500/5',
              border: 'border-orange-500/20',
              title: 'Solve Homework',
              desc: 'Upload image or type question',
            },
            {
              href: '/practice',
              icon: '🎯',
              bg: 'from-blue-500/10 to-blue-500/5',
              border: 'border-blue-500/20',
              title: 'Practice Questions',
              desc: 'AI-generated based on your history',
            },
            {
              href: '/history',
              icon: '📚',
              bg: 'from-emerald-500/10 to-emerald-500/5',
              border: 'border-emerald-500/20',
              title: 'View History',
              desc: 'Revisit past solutions',
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group bg-gradient-to-br ${action.bg} border ${action.border} rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300`}
            >
              <span className="text-3xl block mb-3">{action.icon}</span>
              <div className="font-syne font-bold text-white text-sm mb-1">{action.title}</div>
              <div className="text-slate-400 text-xs">{action.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-syne font-bold text-white text-base">Recent Questions</h3>
          <Link href="/history" className="text-orange-400 hover:text-orange-300 text-xs transition-colors">
            View all →
          </Link>
        </div>

        {recentQuestions.length === 0 ? (
          <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-12 text-center">
            <span className="text-4xl block mb-4">📝</span>
            <div className="font-syne font-bold text-white text-base mb-2">No questions yet</div>
            <p className="text-slate-400 text-sm mb-6">
              Start by solving your first homework question!
            </p>
            <Link
              href="/solve"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-syne font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
            >
              <Zap size={14} />
              Solve first question
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentQuestions.map((q) => (
              <Link
                key={q.id}
                href={`/question/${q.id}`}
                className="group flex items-center gap-4 bg-[#111827] border border-[#1e2d47] hover:border-slate-600 rounded-xl p-4 transition-all"
              >
                <div className="w-10 h-10 bg-[#1a2235] rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{q.question_text}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-orange-400 text-xs capitalize">{q.subject}</span>
                    <span className="text-slate-600 text-xs flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(q.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}