import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Terminal } from 'lucide-react'
import type { ThreatSignal } from '../../types/threat'
import { StatusBadge } from './StatusBadge'

interface ThreatSignalCardProps {
  signal: ThreatSignal
  index?: number
}

export const ThreatSignalCard: React.FC<ThreatSignalCardProps> = ({ signal, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.06, 0.35) }}
      className="group rounded-xl border border-[#321010] bg-[#111111] p-4 transition-all duration-200 hover:border-[#FF2020]/60 hover:bg-[#171717] hover:shadow-[0_0_18px_rgba(255,32,32,0.12)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#321010] bg-[#0A0A0A] text-[#FF2020]">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-bold tracking-wide text-white">{signal.name}</h4>
        </div>
        <StatusBadge label={signal.severity} />
      </div>

      {signal.explanation && (
        <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">{signal.explanation}</p>
      )}

      {signal.matched_phrase && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-[#321010] bg-[#0A0A0A] px-3 py-2">
          <Terminal className="h-3.5 w-3.5 shrink-0 text-[#FF2020]" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#A0A0A0]">
            TRIGGER:
          </span>
          <code className="rounded bg-[#FF2020]/20 px-2 py-0.5 font-mono text-xs font-semibold text-[#FF3030] border border-[#FF2020]/40">
            &quot;{signal.matched_phrase}&quot;
          </code>
        </div>
      )}
    </motion.div>
  )
}
