'use client'

import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { useUsageLimit } from '@/hooks/useUsageLimit'
import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import {
  User, Globe, Crown, LogOut,
  Save, Shield, Bell,
} from 'lucide-react'
import type { Language } from '@/types'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { language, switchLanguage } = useLanguage()
  const { plan } = useUsageLimit()
  const [name, setName] = useState(user?.user_metadata?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const supabase = createClient()

  const handleSaveName = async () => {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ data: { name } })
    if (error) {
      toast.error('Failed to update name')
    } else {
      await supabase.from('profiles').update({ name }).eq('id', user!.id)
      toast.success('Profile updated!')
    }
    setSaving(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'billing', label: 'Billing', icon: Crown },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Tabs */}
      <div className="flex gap-1 bg-[#111827] border border-[#1e2d47] rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-syne font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#1a2235] text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={13} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-6 space-y-6">
          <h3 className="font-syne font-bold text-white">Profile Information</h3>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-syne">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <div className="text-white font-semibold font-syne">{name || 'Student'}</div>
              <div className="text-slate-400 text-sm">{user?.email}</div>
              <div className="text-xs text-orange-400 mt-1 capitalize">{plan} plan</div>
            </div>
          </div>

          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0d1428] border border-[#1e2d47] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-all"
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              value={user?.email ?? ''}
              readOnly
              className="w-full bg-[#0d1428] border border-[#1e2d47] rounded-xl px-4 py-3 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSaveName}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-syne font-semibold px-5 py-2.5 rounded-xl transition-all text-sm disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Language tab */}
      {activeTab === 'language' && (
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-6 space-y-4">
          <h3 className="font-syne font-bold text-white">Language Preference</h3>
          <p className="text-slate-400 text-sm">
            Choose the language for solutions and the interface.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { code: 'en', flag: '🇬🇧', name: 'English', desc: 'Solutions in English' },
              { code: 'ne', flag: '🇳🇵', name: 'नेपाली', desc: 'नेपाली भाषामा' },
            ] as { code: Language; flag: string; name: string; desc: string }[]).map((lang) => (
              <button
                key={lang.code}
                onClick={() => { switchLanguage(lang.code); toast.success(`Language set to ${lang.name}`) }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  language === lang.code
                    ? 'bg-orange-500/10 border-orange-500/30 text-white'
                    : 'bg-[#0d1428] border-[#1e2d47] text-slate-400 hover:border-slate-600'
                }`}
              >
                <span className="text-2xl block mb-2">{lang.flag}</span>
                <div className="font-syne font-bold text-sm">{lang.name}</div>
                <div className="text-xs mt-1 text-slate-500">{lang.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Billing tab */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 border ${
            plan === 'premium'
              ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20'
              : 'bg-[#111827] border-[#1e2d47]'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-bold text-white">Current Plan</h3>
              <span className={`text-xs font-syne font-bold px-3 py-1 rounded-full capitalize ${
                plan === 'premium'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-[#1a2235] text-slate-400'
              }`}>
                {plan}
              </span>
            </div>
            {plan === 'free' ? (
              <>
                <p className="text-slate-400 text-sm mb-6">
                  You are on the free plan. Upgrade to get unlimited questions, follow-ups, and practice generation.
                </p>
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-xl p-5 text-white">
                  <div className="font-syne font-extrabold text-2xl mb-1">रू299 / month</div>
                  <p className="text-orange-100 text-sm mb-4">Unlimited everything. Cancel anytime.</p>
                  <button className="bg-white text-orange-500 font-syne font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-orange-50 transition-all">
                    Upgrade to Premium
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p className="text-slate-400 text-sm">You have unlimited access to all features.</p>
                <div className="mt-4 space-y-2">
                  {['Unlimited questions', 'Follow-up questions', 'Practice generator', 'Full history'].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="text-emerald-400">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security tab */}
      {activeTab === 'security' && (
        <div className="bg-[#111827] border border-[#1e2d47] rounded-2xl p-6 space-y-4">
          <h3 className="font-syne font-bold text-white">Security</h3>
          <div className="pt-2">
            <div className="text-slate-300 text-sm font-medium mb-1">Email</div>
            <div className="text-slate-500 text-sm">{user?.email}</div>
          </div>
          <div className="border-t border-[#1e2d47] pt-4">
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              <LogOut size={14} />
              Sign out of all devices
            </button>
          </div>
        </div>
      )}

    </div>
  )
}