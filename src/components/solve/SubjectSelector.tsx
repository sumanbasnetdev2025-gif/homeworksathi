'use client'

import { SUBJECTS } from '@/constants/subjects'
import { useLanguage } from '@/hooks/useLanguage'

interface SubjectSelectorProps {
  value: string
  onChange: (id: string) => void
  disabled?: boolean
}

export default function SubjectSelector({ value, onChange, disabled }: SubjectSelectorProps) {
  const { language } = useLanguage()

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {SUBJECTS.map((subject) => (
        <button
          key={subject.id}
          onClick={() => onChange(subject.id)}
          disabled={disabled}
          className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
            value === subject.id
              ? 'border-orange-500/50 bg-orange-500/10 text-white'
              : 'border-[#1e2d47] hover:border-slate-600 text-slate-400 hover:text-white bg-[#0d1428]'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="text-xl">{subject.emoji}</span>
          <span className="font-syne font-semibold text-[10px] leading-tight line-clamp-2">
            {language === 'en' ? subject.name : subject.nameNe}
          </span>
          {value === subject.id && (
            <div
              className="absolute inset-0 rounded-xl opacity-10"
              style={{ background: subject.color }}
            />
          )}
        </button>
      ))}
    </div>
  )
}