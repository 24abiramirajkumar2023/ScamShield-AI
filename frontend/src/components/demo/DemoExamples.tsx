import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import { DEMO_EXAMPLES, type DemoExample } from '../../data/demoExamples'
import { StatusBadge } from '../ui/StatusBadge'

interface DemoExamplesProps {
  onSelect: (content: string, example: DemoExample) => void
  title?: string
}

export const DemoExamples: React.FC<DemoExamplesProps> = ({
  onSelect,
  title = 'QUICK DEMO EXAMPLES — CLICK TO LOAD INTO SCANNER',
}) => {
  return (
    <section className="rounded-2xl border border-[#321010] bg-[#0A0A0A] p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#FF2020]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
            {title}
          </h3>
        </div>
        <span className="font-mono text-[11px] text-[#A0A0A0]">
          {DEMO_EXAMPLES.length} JUDGE PRESETS READY
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {DEMO_EXAMPLES.map((demo, idx) => (
          <motion.button
            key={demo.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            onClick={() => onSelect(demo.content, demo)}
            className="group flex flex-col justify-between rounded-xl border border-[#321010] bg-[#111111] p-4 text-left transition-all duration-200 hover:border-[#FF2020] hover:bg-[#171717] hover:shadow-[0_0_20px_rgba(255,32,32,0.18)] focus:outline-none focus:ring-1 focus:ring-[#FF2020]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold tracking-wider text-[#FF3030]">
                  {demo.label}
                </span>
                <StatusBadge label={demo.expectedRisk} />
              </div>

              <p className="mt-2.5 line-clamp-3 font-mono text-xs leading-relaxed text-[#D4D4D4]">
                &quot;{demo.content}&quot;
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#321010]/70 pt-2.5">
              <span className="text-[11px] text-[#A0A0A0]">{demo.category}</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-white transition-colors group-hover:text-[#FF2020]">
                LOAD SAMPLE
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
