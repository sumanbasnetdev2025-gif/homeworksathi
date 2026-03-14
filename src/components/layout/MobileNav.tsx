'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Zap, History, BookOpen, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/solve', icon: Zap, label: 'Solve' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/practice', icon: BookOpen, label: 'Practice' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0d1428]/95 backdrop-blur-xl border-t border-[#1e2d47]">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                active
                  ? 'text-orange-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-syne font-semibold">{item.label}</span>
              {active && (
                <div className="w-1 h-1 bg-orange-400 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}