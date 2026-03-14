import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-8">
      <div className="text-center">
        <div className="font-syne font-extrabold text-8xl text-[#1e2d47] mb-4">404</div>
        <h1 className="font-syne font-bold text-2xl text-white mb-3">
          Page not found
        </h1>
        <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-syne font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[#1e2d47] hover:border-slate-500 text-slate-300 hover:text-white font-syne font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}