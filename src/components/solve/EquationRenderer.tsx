'use client'

import { useEffect, useRef } from 'react'

interface EquationRendererProps {
  math: string
  display?: boolean
  className?: string
}

export default function EquationRenderer({
  math,
  display = false,
  className = '',
}: EquationRendererProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !math) return

    // Add KaTeX CSS if not already added
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link')
      link.id = 'katex-css'
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
      document.head.appendChild(link)
    }

    const renderMath = async () => {
      try {
        const katex = await import('katex')
        if (ref.current) {
          katex.default.render(math, ref.current, {
            throwOnError: false,
            displayMode: display,
            output: 'html',
          })
        }
      } catch {
        if (ref.current) {
          ref.current.textContent = math
        }
      }
    }

    renderMath()
  }, [math, display])

  if (!math) return null

  return (
    <div
      ref={ref}
      className={`font-mono text-amber-300 ${
        display ? 'my-3 overflow-x-auto' : 'inline'
      } ${className}`}
    />
  )
}