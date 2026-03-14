'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import type { Language } from '@/types'

interface NavbarProps {
  language: Language
  onLanguageSwitch: (lang: Language) => void
}

export default function Navbar({ language, onLanguageSwitch }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#subjects', label: language === 'en' ? 'Subjects' : 'विषयहरू' },
    { href: '#how', label: language === 'en' ? 'How it works' : 'कसरी काम गर्छ' },
    { href: '#features', label: language === 'en' ? 'Features' : 'सुविधाहरू' },
    { href: '#pricing', label: language === 'en' ? 'Pricing' : 'मूल्य' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-lg shadow-md shadow-orange-200">
            📚
          </div>
          <span className="font-syne font-bold text-lg text-slate-800">
            Homework<span className="text-orange-500">Sathi</span>
          </span>
        </Link>

        {/* Desktop links - Fixed incomplete <a> tags */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
            {(['en', 'ne'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageSwitch(lang)}
                className={`px-3 py-1.5 text-xs font-syne font-semibold transition-all ${
                  language === lang
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {lang === 'en' ? '🇬🇧 EN' : '🇳🇵 NE'}
              </button>
            ))}
          </div>
          <Link
            href="/login"
            className="text-slate-600 hover:text-slate-800 text-sm font-medium px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-syne font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-orange-200"
          >
            Get started free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-500 hover:text-slate-800"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu - Fixed incomplete <a> tags */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-slate-600 hover:text-slate-800 text-sm font-medium py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <Link
              href="/login"
              className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl border border-slate-200 text-slate-600"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center text-sm font-syne font-semibold py-2.5 rounded-xl bg-orange-500 text-white"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}