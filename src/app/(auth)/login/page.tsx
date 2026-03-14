'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { toast } from 'sonner'
import { Eye, EyeOff, BookOpen, ArrowRight, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
export default function LoginPage() {
  const { signIn } = useAuth()
  const { t, language, switchLanguage } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
const redirect = searchParams.get('redirect') ?? '/dashboard'
const subject = searchParams.get('subject')

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  const { error } = await signIn(email, password)
  if (error) {
    toast.error(error.message)
  } else {
    const finalRedirect = subject ? `${redirect}?subject=${subject}` : redirect
    window.location.href = finalRedirect
  }
  setLoading(false)
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
            Your AI study<br />companion awaits.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            Get step-by-step solutions to any homework question. Available in English and Nepali.
          </p>

          <div className="space-y-4">
            {[
              { icon: '📸', text: 'Upload homework photos' },
              { icon: '🧠', text: 'AI explains each step clearly' },
              { icon: '🇳🇵', text: 'Available in Nepali too' },
              { icon: '🎯', text: 'Practice questions generated for you' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-slate-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-6">
          <p className="text-slate-300 text-sm leading-relaxed italic mb-4">
            "HomeworkSathi helped me understand quadratic equations when I was completely stuck. The step-by-step explanation was so clear!"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              P
            </div>
            <div>
              <div className="text-white text-xs font-semibold font-syne">Priya Sharma</div>
              <div className="text-slate-500 text-xs">Grade 10, Kathmandu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-lg">
            📚
          </div>
          <span className="font-syne font-bold text-lg text-white">
            Homework<span className="text-orange-400">Sathi</span>
          </span>
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
                    language === lang
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? '🇬🇧 EN' : '🇳🇵 NE'}
                </button>
              ))}
            </div>
          </div>

          <h1 className="font-syne font-bold text-3xl text-white mb-2">
            {t('auth.loginCta')}
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            {t('auth.noAccount')}{' '}
            <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-medium">
              {t('auth.signup')}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  {t('auth.password')}
                </label>
                <Link href="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  {t('auth.login')}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1e2d47]">
            <p className="text-center text-xs text-slate-500">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-slate-400 hover:text-white">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-slate-400 hover:text-white">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}