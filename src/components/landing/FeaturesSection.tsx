const features = [
  { icon: '📸', bg: '#fff7ed', title: 'Photo to Solution', featured: true,
    desc: 'Snap a photo of any handwritten or printed question. Our OCR handles messy handwriting and math notation.' },
  { icon: '🔍', bg: '#eff6ff', title: 'Deep Dive Mode',
    desc: 'Click any step you do not understand to instantly get a deeper explanation tailored to your level.' },
  { icon: '💬', bg: '#ecfdf5', title: 'Follow-up Chat',
    desc: 'Ask follow-up questions like "Why did you divide by 2?" and get clear answers every time.' },
  { icon: '🇳🇵', bg: '#fdf2f8', title: 'Nepali Language',
    desc: 'Switch between English and Nepali at any time. Solutions available in both languages.' },
  { icon: '🎯', bg: '#fffbeb', title: 'Practice Generator',
    desc: 'Based on your history, HomeworkSathi generates personalized practice questions for weak areas.' },
  { icon: '📊', bg: '#f5f3ff', title: 'Progress Dashboard',
    desc: 'Track your question history, subject breakdown, and improvement over time.' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Features</span>
          <h2 className="font-syne font-extrabold text-4xl lg:text-5xl text-slate-800 mt-3 tracking-tight">
            Built for Nepali students.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group bg-white border rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg ${
                f.featured
                  ? 'border-orange-200 shadow-md shadow-orange-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3 className="font-syne font-bold text-slate-800 text-base mb-3">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}