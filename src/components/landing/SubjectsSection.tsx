'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { useRouter } from 'next/navigation'
import { SUBJECTS } from '@/constants/subjects'

export default function SubjectsSection() {
  const { language } = useLanguage()
  const router = useRouter()

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/login?redirect=/solve&subject=${subjectId}`)
  }

  return (
    <section id="subjects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
            15 Subjects
          </span>
          <h2 className="font-syne font-extrabold text-4xl lg:text-5xl text-slate-800 mt-3 mb-4 tracking-tight">
            Every subject.<br />Every chapter.
          </h2>
          <p className="text-slate-500 max-w-lg">
            From algebra to biology, covering the full Grade 8–12 curriculum aligned with Nepal's SEE and +2 syllabuses.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              className="group bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100 rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
                style={{ background: `${subject.bgColor}` }}
              />
              <span className="text-3xl block mb-2 relative z-10">{subject.emoji}</span>
              <div className="font-syne font-bold text-slate-700 text-xs relative z-10 group-hover:text-slate-800">
                {language === 'en' ? subject.name : subject.nameNe}
              </div>
              <div className="text-slate-400 text-[10px] mt-0.5 relative z-10 line-clamp-1">
                {subject.description}
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          Click any subject to start solving →
        </p>
      </div>
    </section>
  )
}