import React, { useMemo } from 'react'
import { ScanSearch } from 'lucide-react'

interface HighlightedTextProps {
  text: string
  phrases: string[]
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, phrases }) => {
  const uniquePhrases = useMemo(() => {
    const cleaned = phrases
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
    return Array.from(new Set(cleaned)).sort((a, b) => b.length - a.length)
  }, [phrases])

  const segments = useMemo(() => {
    if (!text || uniquePhrases.length === 0) {
      return [{ text, highlighted: false }]
    }

    const pattern = new RegExp(`(${uniquePhrases.map(escapeRegExp).join('|')})`, 'gi')
    const parts = text.split(pattern)

    return parts
      .filter((part) => part.length > 0)
      .map((part) => {
        const isMatch = uniquePhrases.some(
          (phrase) => phrase.toLowerCase() === part.toLowerCase()
        )
        return { text: part, highlighted: isMatch }
      })
  }, [text, uniquePhrases])

  return (
    <div className="rounded-xl border border-[#321010] bg-[#111111] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#321010]/70 pb-2.5">
        <div className="flex items-center gap-2">
          <ScanSearch className="h-4 w-4 text-[#FF2020]" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-white">
            FORENSIC PAYLOAD HIGHLIGHT
          </span>
        </div>
        <span className="font-mono text-xs text-[#A0A0A0]">
          {uniquePhrases.length > 0
            ? `${uniquePhrases.length} flagged pattern${uniquePhrases.length > 1 ? 's' : ''}`
            : '0 suspicious triggers'}
        </span>
      </div>

      <div className="rounded-lg border border-[#321010]/60 bg-[#050505] p-4 font-mono text-sm leading-relaxed text-[#E5E5E5] whitespace-pre-wrap break-words">
        {segments.map((seg, idx) =>
          seg.highlighted ? (
            <mark
              key={idx}
              className="mx-0.5 rounded bg-[#FF2020]/30 px-1.5 py-0.5 font-semibold text-white border-b-2 border-[#FF3030] shadow-[0_0_10px_rgba(255,32,32,0.28)]"
            >
              {seg.text}
            </mark>
          ) : (
            <span key={idx}>{seg.text}</span>
          )
        )}
      </div>

      {uniquePhrases.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {uniquePhrases.map((phrase) => (
            <span
              key={phrase}
              className="rounded border border-[#FF2020]/40 bg-[#FF2020]/10 px-2 py-0.5 font-mono text-[11px] text-[#FF3030]"
            >
              {phrase}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
