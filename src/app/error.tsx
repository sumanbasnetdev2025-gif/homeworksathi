'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="font-syne font-bold text-2xl text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-syne font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[#1e2d47] hover:border-slate-500 text-slate-300 font-syne font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}