import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Briefcase,
  ChevronDown,
  Eye,
  Heart,
  KeyRound,
  Landmark,
  Link2,
  Monitor,
  Package,
  PhoneCall,
  QrCode,
  Search,
  ShieldCheck,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { THREAT_TOPICS, type ThreatTopic } from '../data/threatEducation'
import { StatusBadge } from '../components/ui/StatusBadge'

function TopicIcon({ iconKey }: { iconKey: ThreatTopic['iconKey'] }) {
  const iconClass = 'h-5 w-5 text-[#FF2020]'
  switch (iconKey) {
    case 'key':
      return <KeyRound className={iconClass} />
    case 'briefcase':
      return <Briefcase className={iconClass} />
    case 'trophy':
      return <Trophy className={iconClass} />
    case 'link':
      return <Link2 className={iconClass} />
    case 'trending':
      return <TrendingUp className={iconClass} />
    case 'package':
      return <Package className={iconClass} />
    case 'monitor':
      return <Monitor className={iconClass} />
    case 'phone':
      return <PhoneCall className={iconClass} />
    case 'heart':
      return <Heart className={iconClass} />
    case 'qr':
      return <QrCode className={iconClass} />
    case 'landmark':
      return <Landmark className={iconClass} />
    default:
      return <AlertTriangle className={iconClass} />
  }
}

export const ThreatCenterPage: React.FC = () => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'otp-phishing': true,
  })
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return THREAT_TOPICS
    return THREAT_TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.categoryTag.toLowerCase().includes(q) ||
        t.whatIsIt.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const toggleTopic = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {}
    THREAT_TOPICS.forEach((t) => {
      allOpen[t.id] = true
    })
    setExpandedIds(allOpen)
  }

  const collapseAll = () => {
    setExpandedIds({})
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-[#321010] pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF2020]">
          CYBERSECURITY KNOWLEDGE BASE // {THREAT_TOPICS.length} THREAT VECTORS
        </span>
        <h1 className="mt-2 text-2xl font-black tracking-wide text-white sm:text-4xl">
          THREAT EDUCATION CENTER
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#A0A0A0]">
          Explore real-world attack playbooks across 11 major scam categories—learn how attackers
          engineer trust, recognize early warning signs, and apply defense checklists.
        </p>
      </div>

      {/* Search & Controls */}
      <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF2020]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threat types (OTP, job, crypto, QR...)"
            className="w-full rounded-xl border border-[#321010] bg-[#111111] py-2.5 pl-10 pr-4 font-mono text-xs text-white placeholder-[#666666] focus:border-[#FF2020] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="rounded-lg border border-[#321010] bg-[#111111] px-3 py-2 font-mono text-xs text-white transition-colors hover:border-[#FF2020]"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-lg border border-[#321010] bg-[#111111] px-3 py-2 font-mono text-xs text-[#A0A0A0] transition-colors hover:border-[#FF2020] hover:text-white"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Topic Cards */}
      <div className="mt-6 space-y-4">
        {filteredTopics.map((topic, idx) => {
          const isOpen = Boolean(expandedIds[topic.id])

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.25) }}
              className={`overflow-hidden rounded-2xl border transition-colors ${
                isOpen
                  ? 'border-[#FF2020]/70 bg-[#111111] glow-red'
                  : 'border-[#321010] bg-[#111111] hover:border-[#FF2020]/50'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleTopic(topic.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#321010] bg-[#0A0A0A]">
                    <TopicIcon iconKey={topic.iconKey} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#FF3030]">
                        {topic.categoryTag}
                      </span>
                      <StatusBadge label={topic.severity} />
                    </div>
                    <h2 className="mt-1 text-base font-bold text-white sm:text-lg">
                      {topic.title}
                    </h2>
                  </div>
                </div>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#A0A0A0] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#FF2020]' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-[#321010]"
                  >
                    <div className="space-y-5 bg-[#0A0A0A]/80 p-5 sm:p-6">
                      {/* What is it */}
                      <div>
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF3030]">
                          WHAT IS IT
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#E5E5E5]">
                          {topic.whatIsIt}
                        </p>
                      </div>

                      {/* Real-World Example */}
                      <div className="rounded-xl border border-[#FF2020]/40 bg-[#111111] p-4">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#FF3030]">
                          COMMON SCAM EXAMPLE
                        </span>
                        <p className="mt-1.5 font-mono text-xs leading-relaxed text-white">
                          {topic.example}
                        </p>
                      </div>

                      {/* 3-Column Tactical Breakdown */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-[#321010] bg-[#111111] p-4">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-[#FF2020]" />
                            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                              WARNING SIGNS
                            </h4>
                          </div>
                          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#A0A0A0]">
                            {topic.warningSigns.map((sign, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF2020]" />
                                <span>{sign}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-xl border border-[#321010] bg-[#111111] p-4">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-[#FF2020]" />
                            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                              HOW SCAMMERS OPERATE
                            </h4>
                          </div>
                          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#A0A0A0]">
                            {topic.howScammersOperate.map((step, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-xl border border-[#321010] bg-[#111111] p-4">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#FF2020]" />
                            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                              HOW TO PROTECT YOURSELF
                            </h4>
                          </div>
                          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#D4D4D4]">
                            {topic.howToProtect.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {filteredTopics.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#321010] bg-[#111111] p-10 text-center">
            <p className="font-mono text-sm text-[#A0A0A0]">
              No threat topics match &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
