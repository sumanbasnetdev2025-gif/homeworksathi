import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl p-16 text-center overflow-hidden shadow-2xl shadow-orange-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="font-syne font-extrabold text-4xl lg:text-5xl text-white mb-4 tracking-tight">
              Ready to ace your<br />homework? 🚀
            </h2>
            <p className="text-orange-100 text-lg mb-10 max-w-md mx-auto">
              Join thousands of Nepali students solving homework faster with AI.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white text-orange-500 hover:bg-orange-50 font-syne font-semibold px-8 py-4 rounded-xl transition-all shadow-lg text-sm"
              >
                Get started — it is free
                <ArrowRight size={16} />
              </Link>
              
              {/* Fixed: Added Link component and proper href */}
              <Link
                href="#how"
                className="inline-flex items-center gap-2 text-white font-medium px-8 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-all text-sm"
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}