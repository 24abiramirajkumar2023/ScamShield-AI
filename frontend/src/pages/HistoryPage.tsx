import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Filter,
  History,
  Link2,
  MessageSquareWarning,
  ScanSearch,
  Search,
  Trash2,
} from 'lucide-react'
import { useScanHistory } from '../hooks/useScanHistory'
import { StatusBadge } from '../components/ui/StatusBadge'

type RiskFilter = 'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'GUARDED' | 'SAFE'

function matchesRiskFilter(score: number, filter: RiskFilter): boolean {
  switch (filter) {
    case 'CRITICAL':
      return score > 80
    case 'HIGH':
      return score >= 61 && score <= 80
    case 'MODERATE':
      return score >= 41 && score <= 60
    case 'GUARDED':
      return score >= 20 && score <= 40
    case 'SAFE':
      return score < 20
    default:
      return true
  }
}

export const HistoryPage: React.FC = () => {
  const { history, deleteScan, clearHistory } = useScanHistory()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const categories = useMemo(() => {
    const unique = new Set<string>()
    history.forEach((item) => {
      if (item.result.category) unique.add(item.result.category)
    })
    return Array.from(unique).sort()
  }, [history])

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return history.filter((item) => {
      const matchesSearch =
        !q ||
        item.input.toLowerCase().includes(q) ||
        item.result.category.toLowerCase().includes(q) ||
        item.result.summary.toLowerCase().includes(q)

      const matchesCategory =
        categoryFilter === 'ALL' || item.result.category === categoryFilter

      const matchesRisk = matchesRiskFilter(item.result.score, riskFilter)

      return matchesSearch && matchesCategory && matchesRisk
    })
  }, [history, searchQuery, categoryFilter, riskFilter])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#321010] pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF2020]">
            LOCAL BROWSER VAULT // AUDIT LOG
          </span>
          <h1 className="mt-2 text-2xl font-black tracking-wide text-white sm:text-4xl">
            SCAN HISTORY
          </h1>
          <p className="mt-2 text-sm text-[#A0A0A0]">
            Review, search, and manage your locally stored threat intelligence scan history.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            {confirmClear ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#FF2020] bg-[#111111] px-3 py-2">
                <span className="font-mono text-xs text-[#FF3030]">Clear all {history.length}?</span>
                <button
                  type="button"
                  onClick={() => {
                    clearHistory()
                    setConfirmClear(false)
                  }}
                  className="rounded bg-[#FF2020] px-2.5 py-1 font-mono text-xs font-bold text-white hover:bg-[#FF3030]"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded border border-[#321010] px-2.5 py-1 font-mono text-xs text-[#A0A0A0] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#321010] bg-[#111111] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#FF3030] transition-colors hover:border-[#FF2020] hover:bg-[#FF2020]/10"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      {history.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-[#321010] bg-[#111111] p-4 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF2020]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scanned text, URL, category, or summary..."
              className="w-full rounded-xl border border-[#321010] bg-[#050505] py-2.5 pl-10 pr-4 font-mono text-xs text-white placeholder-[#666666] focus:border-[#FF2020] focus:outline-none"
            />
          </div>

          <div className="relative md:col-span-3">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A0A0]" />
            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-[#321010] bg-[#050505] py-2.5 pl-9 pr-3 font-mono text-xs text-white focus:border-[#FF2020] focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter by risk level"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskFilter)}
              className="w-full rounded-xl border border-[#321010] bg-[#050505] px-3 py-2.5 font-mono text-xs text-white focus:border-[#FF2020] focus:outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical (81–100)</option>
              <option value="HIGH">High (61–80)</option>
              <option value="MODERATE">Moderate (41–60)</option>
              <option value="GUARDED">Guarded (20–40)</option>
              <option value="SAFE">Safe (&lt; 20)</option>
            </select>
          </div>
        </div>
      )}

      {/* History Empty State */}
      {history.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#321010] bg-[#111111] p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#321010] bg-[#0A0A0A]">
            <History className="h-7 w-7 text-[#FF2020]" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-white">No Scan History Recorded</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-[#A0A0A0]">
            Every message or URL you analyze is archived locally in your browser. Run a scan to
            begin building your threat log.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF2020] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#FF3030]"
            >
              <ScanSearch className="h-4 w-4" />
              <span>Scan Message</span>
            </Link>
            <Link
              to="/url-scanner"
              className="inline-flex items-center gap-2 rounded-xl border border-[#321010] bg-[#171717] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-[#FF2020]"
            >
              <Link2 className="h-4 w-4 text-[#FF2020]" />
              <span>Scan URL</span>
            </Link>
          </div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[#321010] bg-[#111111] p-8 text-center">
          <p className="font-mono text-sm text-[#A0A0A0]">
            No scan entries match your current search or filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setCategoryFilter('ALL')
              setRiskFilter('ALL')
            }}
            className="mt-4 rounded-lg border border-[#FF2020]/60 bg-[#FF2020]/10 px-4 py-1.5 font-mono text-xs text-white hover:bg-[#FF2020]/20"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filteredHistory.map((item) => {
            const isExpanded = expandedId === item.id
            return (
              <motion.div
                key={item.id}
                layout
                className="overflow-hidden rounded-2xl border border-[#321010] bg-[#111111] transition-colors hover:border-[#FF2020]/50"
              >
                <div className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex flex-1 items-start gap-3 text-left"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#321010] bg-[#0A0A0A] text-[#FF2020]">
                      {item.type === 'url' ? (
                        <Link2 className="h-4 w-4" />
                      ) : (
                        <MessageSquareWarning className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded border border-[#321010] bg-[#0A0A0A] px-2 py-0.5 font-mono text-[10px] uppercase text-[#A0A0A0]">
                          {item.type}
                        </span>
                        <StatusBadge label={item.result.risk_level} score={item.result.score} />
                        <span className="font-mono text-xs font-bold text-white">
                          Score: {item.result.score}/100
                        </span>
                        <span className="text-xs text-[#A0A0A0]">{item.result.category}</span>
                      </div>

                      <p className="mt-2 truncate font-mono text-xs text-[#E5E5E5]">
                        {item.input}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-[#A0A0A0]">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      aria-label="Toggle scan details"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#321010] bg-[#0A0A0A] text-[#A0A0A0] hover:border-[#FF2020] hover:text-white"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? 'rotate-180 text-[#FF2020]' : ''
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteScan(item.id)}
                      aria-label="Delete scan entry"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#321010] bg-[#0A0A0A] text-[#A0A0A0] transition-colors hover:border-[#FF2020] hover:text-[#FF3030]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#321010] bg-[#0A0A0A] p-4"
                    >
                      <p className="font-mono text-[11px] font-bold uppercase text-[#FF3030]">
                        FULL INPUT PAYLOAD
                      </p>
                      <p className="mt-1.5 rounded-lg border border-[#321010] bg-[#050505] p-3 font-mono text-xs leading-relaxed text-[#E5E5E5] whitespace-pre-wrap break-words">
                        {item.input}
                      </p>

                      <p className="mt-3 text-xs leading-relaxed text-[#D4D4D4]">
                        {item.result.summary}
                      </p>

                      {item.result.signals.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.result.signals.map((sig, sIdx) => (
                            <span
                              key={sIdx}
                              className="rounded border border-[#FF2020]/40 bg-[#FF2020]/10 px-2 py-0.5 font-mono text-[11px] text-[#FF3030]"
                            >
                              {sig.name} ({sig.severity})
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
