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

    // Use KaTeX if available
    const renderMath = async () => {
      try {
        const katex = await import('katex')
        await import('katex/dist/katex.min.css')
        if (ref.current) {
          katex.default.render(math, ref.current, {
            throwOnError: false,
            displayMode: display,
            output: 'html',
          })
        }
      } catch {
        // Fallback to plain text
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