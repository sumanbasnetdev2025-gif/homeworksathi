'use client'

import { usePathname } from 'next/navigation'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Menu, Bell, Crown } from 'lucide-react'
import type { Language } from '@/types'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/solve': 'Solve Homework',
  '/history': 'Question History',
  '/practice': 'Practice Questions',
  '/settings': 'Settings',
}

export default function DashboardNavbar() {
  const pathname = usePathname()
  const { language, switchLanguage } = useLanguage()
  const { user } = useAuth()
  const title = pageTitles[pathname] ?? 'HomeworkSathi'

  return (
    <header className="sticky top-0 z-30 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-[#1e2d47] px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-white text-lg">{title}</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {new Date().toLocaleDateString('en-NP', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div className="flex bg-[#111827] border border-[#1e2d47] rounded-xl overflow-hidden">
            {(['en', 'ne'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => switchLanguage(lang)}
                className={`px-3 py-1.5 text-xs font-syne font-semibold transition-all ${
                  language === lang
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? '🇬🇧' : '🇳🇵'}
              </button>
            ))}
          </div>

          {/* Upgrade button */}
          <Link
            href="/settings?tab=billing"
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-400 text-xs font-syne font-semibold px-3 py-1.5 rounded-xl hover:from-orange-500/20 transition-all"
          >
            <Crown size={12} />
            Upgrade
          </Link>

          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold font-syne">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}