'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const { signUp } = useAuth()
  const { t, language, switchLanguage } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, name)
    if (error) {
      toast.error(error.message)
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h2 className="font-syne font-bold text-2xl text-white mb-3">Check your email!</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-syne font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Back to Login <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-[#0d1428] border-r border-[#1e2d47] p-12">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-xl">
              📚
            </div>
            <span className="font-syne font-bold text-xl text-white">
              Homework<span className="text-orange-400">Sathi</span>
            </span>
          </Link>

          <h2 className="font-syne font-bold text-3xl text-white mb-4 leading-tight">
            Join thousands of<br />Nepali students.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            Create your free account and start solving homework in seconds.
          </p>

          <div className="space-y-5">
            {[
              { icon: '🆓', label: 'Free to start', desc: '5 questions per day, no credit card' },
              { icon: '📱', label: 'Works on mobile', desc: 'Take a photo and upload instantly' },
              { icon: '🧠', label: 'Understand, not just copy', desc: 'Every step explained clearly' },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 items-start">
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold font-syne">{item.label}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#111827] border border-[#1e2d47] rounded-2xl p-5">
          <div className="text-3xl">🇳🇵</div>
          <div>
            <div className="text-white text-sm font-syne font-bold">Made for Nepal</div>
            <div className="text-slate-400 text-xs mt-0.5">SEE & NEB curriculum aligned. English & Nepali.</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-lg">📚</div>
          <span className="font-syne font-bold text-lg text-white">Homework<span className="text-orange-400">Sathi</span></span>
        </Link>

        <div className="w-full max-w-md">
          {/* Language toggle */}
          <div className="flex justify-end mb-8">
            <div className="flex bg-[#111827] border border-[#1e2d47] rounded-xl overflow-hidden">
              {(['en', 'ne'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => switchLanguage(lang)}
                  className={`px-4 py-2 text-xs font-syne font-semibold transition-all ${
                    language === lang ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? '🇬🇧 EN' : '🇳🇵 NE'}
                </button>
              ))}
            </div>
          </div>

          <h1 className="font-syne font-bold text-3xl text-white mb-2">
            {t('auth.signupCta')}
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            {t('auth.haveAccount')}{' '}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
              {t('auth.login')}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                required
                className="w-full bg-[#111827] border border-[#1e2d47] rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#111827] border border-[#1e2d47] rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full bg-[#111827] border border-[#1e2d47] rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        password.length >= i * 3
                          ? i <= 1 ? 'bg-red-500'
                            : i <= 2 ? 'bg-yellow-500'
                            : i <= 3 ? 'bg-blue-500'
                            : 'bg-green-500'
                          : 'bg-[#1e2d47]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-syne font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Create free account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-slate-400 hover:text-white">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-slate-400 hover:text-white">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}