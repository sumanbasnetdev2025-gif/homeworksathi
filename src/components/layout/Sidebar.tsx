'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Zap,
  History,
  BookOpen,
  Settings,
  LogOut,
  Crown,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/solve', icon: Zap, label: 'Solve Now' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/practice', icon: BookOpen, label: 'Practice' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-[#0d1428] border-r border-[#1e2d47] z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[#1e2d47]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-lg">
              📚
            </div>
            <span className="font-syne font-bold text-white">
              Homework<span className="text-orange-400">Sathi</span>
            </span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-[#1a2235]'
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {item.label === 'Solve Now' && (
                  <span className="ml-auto w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[#1e2d47] space-y-3">
          {/* Upgrade banner */}
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={14} className="text-orange-400" />
              <span className="font-syne font-bold text-white text-xs">Go Premium</span>
            </div>
            <p className="text-slate-400 text-xs mb-3">Unlimited questions & more</p>
            <Link
              href="/settings?tab=billing"
              className="block text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-syne font-semibold py-2 rounded-lg transition-all hover:from-orange-400 hover:to-orange-500"
            >
              Upgrade — रू299/mo
            </Link>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold font-syne flex-shrink-0">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold font-syne truncate">
                {user?.user_metadata?.name ?? 'Student'}
              </div>
              <div className="text-slate-500 text-xs truncate">{user?.email}</div>
            </div>
            <button
              onClick={signOut}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}