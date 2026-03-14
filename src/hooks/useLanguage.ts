'use client'

import { useState, useEffect } from 'react'
import type { Language } from '@/types'
import en from '@/i18n/en.json'
import ne from '@/i18n/ne.json'

const translations = { en, ne }

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('hs_language') as Language
    if (saved) setLanguage(saved)
  }, [])

  const switchLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('hs_language', lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return { language, switchLanguage, t }
}