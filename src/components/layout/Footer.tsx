import Link from 'next/link'

export default function Footer() {
  const links = {
    Product: ['How it works', 'Subjects', 'Pricing', 'Practice'],
    Company: ['About', 'Blog', 'Contact', 'Careers'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  }

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-base shadow-md shadow-orange-200">
                📚
              </div>
              <span className="font-syne font-bold text-slate-800">
                Homework<span className="text-orange-500">Sathi</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered homework helper for Grade 8–12 students in Nepal. Available in English and Nepali.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-syne font-bold text-slate-700 text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 gap-4">
          <p className="text-slate-400 text-xs">© 2025 HomeworkSathi. All rights reserved.</p>
          <p className="text-slate-400 text-xs">Made with <span className="text-orange-500">♥</span> in Nepal 🇳🇵</p>
        </div>
      </div>
    </footer>
  )
}