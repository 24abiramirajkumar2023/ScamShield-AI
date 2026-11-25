import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertOctagon,
  History,
  Link2,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useScanHistory } from '../hooks/useScanHistory'
import { getHealth, getStats } from '../services/api'
import type { StatsResponse } from '../types/threat'
import { StatusBadge } from '../components/ui/StatusBadge'

const PIE_COLORS = ['#FF2020', '#FF3030', '#8B0000', '#FB923C', '#FACC15', '#A0A0A0']

export const DashboardPage: React.FC = () => {
  const { history } = useScanHistory()
  const navigate = useNavigate()
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [backendStats, setBackendStats] = useState<StatsResponse | null>(null)

  useEffect(() => {
    let active = true

    const fetchTelemetry = async () => {
      try {
        await getHealth()
        if (!active) return
        setBackendStatus('online')
        try {
          const stats = await getStats()
          if (active) setBackendStats(stats)
        } catch {
          // Optional stats endpoint may be unavailable
        }
      } catch {
        if (active) setBackendStatus('offline')
      }
    }

    void fetchTelemetry()
    return () => {
      active = false
    }
  }, [])

  // Compute localStorage dashboard metrics
  const metrics = useMemo(() => {
    const totalScans = history.length
    const threatsDetected = history.filter((item) => item.result.score >= 40).length
    const safeContent = history.filter((item) => item.result.score < 40).length
    const highRiskAlerts = history.filter((item) => item.result.score > 60).length

    return { totalScans, threatsDetected, safeContent, highRiskAlerts }
  }, [history])

  // Last 7 days bar chart data
  const activityData = useMemo(() => {
    const days: Array<{ dateKey: string; label: string; scans: number; threats: number }> = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const dateKey = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })
      days.push({ dateKey, label, scans: 0, threats: 0 })
    }

    for (const item of history) {
      const key = item.timestamp.slice(0, 10)
      const target = days.find((d) => d.dateKey === key)
      if (target) {
        target.scans += 1
        if (item.result.score >= 40) {
          target.threats += 1
        }
      }
    }

    return days
  }, [history])

  // Category distribution pie chart data
  const categoryData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of history) {
      const cat = item.result.category || 'Uncategorized'
      counts.set(cat, (counts.get(cat) ?? 0) + 1)
    }

    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }))
  }, [history])

  const recentScans = useMemo(() => history.slice(0, 5), [history])

  const statCards = [
    {
      label: 'Total Scans',
      value: metrics.totalScans,
      icon: Activity,
      sub: 'Local SOC Audit Log',
      accentText: 'text-white',
    },
    {
      label: 'Threats Detected',
      value: metrics.threatsDetected,
      icon: ShieldAlert,
      sub: 'Score ≥ 40 Flagged',
      accentText: 'text-[#FF2020]',
    },
    {
      label: 'Safe Content',
      value: metrics.safeContent,
      icon: ShieldCheck,
      sub: 'Score < 40 Verified',
      accentText: 'text-white',
    },
    {
      label: 'High Risk Alerts',
      value: metrics.highRiskAlerts,
      icon: AlertOctagon,
      sub: 'Score > 60 Critical',
      accentText: 'text-[#FF3030]',
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#321010] pb-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF2020]">
            <span>SOC TELEMETRY OVERVIEW</span>
            <span className="text-[#321010]">//</span>
            <span className={backendStatus === 'online' ? 'text-white' : 'text-[#A0A0A0]'}>
              API {backendStatus.toUpperCase()}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-wide text-white sm:text-4xl">
            THREAT INTELLIGENCE CENTER
          </h1>
        </div>

        {backendStats && (
          <div className="rounded-xl border border-[#321010] bg-[#111111] px-4 py-2.5 font-mono text-xs text-[#A0A0A0]">
            Engine Lifetime Processed:{' '}
            <span className="font-bold text-[#FF3030]">{backendStats.total_analyses}</span>
          </div>
        )}
      </div>

      {/* Quick Actions Bar */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          to="/scanner"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FF2020] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#FF3030] glow-red"
        >
          <ScanSearch className="h-4 w-4" />
          <span>Scan Message</span>
        </Link>
        <Link
          to="/url-scanner"
          className="flex items-center justify-center gap-2 rounded-xl border border-[#321010] bg-[#111111] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:border-[#FF2020] hover:bg-[#171717]"
        >
          <Link2 className="h-4 w-4 text-[#FF2020]" />
          <span>Scan URL</span>
        </Link>
        <button
          type="button"
          onClick={() => navigate('/scanner?demo=fake-job-offer')}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#321010] bg-[#111111] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:border-[#FF2020] hover:bg-[#171717]"
        >
          <Sparkles className="h-4 w-4 text-[#FF2020]" />
          <span>Load Demo</span>
        </button>
        <Link
          to="/history"
          className="flex items-center justify-center gap-2 rounded-xl border border-[#321010] bg-[#111111] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:border-[#FF2020] hover:bg-[#171717]"
        >
          <History className="h-4 w-4 text-[#FF2020]" />
          <span>View History</span>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="rounded-2xl border border-[#321010] bg-[#111111] p-5 transition-all hover:border-[#FF2020]/60 hover:bg-[#171717]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-[#A0A0A0]">
                  {card.label}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#321010] bg-[#0A0A0A]">
                  <Icon className="h-4 w-4 text-[#FF2020]" />
                </div>
              </div>
              <p className={`mt-3 font-mono text-3xl font-black ${card.accentText}`}>
                {card.value}
              </p>
              <p className="mt-1 font-mono text-[11px] text-[#A0A0A0]">{card.sub}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Bar Chart: 7-Day Activity */}
        <div className="rounded-2xl border border-[#321010] bg-[#111111] p-5 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                SCAN ACTIVITY (LAST 7 DAYS)
              </h2>
              <p className="text-xs text-[#A0A0A0]">Total scans vs. flagged threats per day</p>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] text-[#A0A0A0]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#FF2020]" />
                Threats
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#525252]" />
                Total Scans
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#220C0C" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#A0A0A0"
                  tick={{ fill: '#A0A0A0', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#A0A0A0"
                  tick={{ fill: '#A0A0A0', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    borderColor: '#FF2020',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="scans" name="Total Scans" fill="#525252" radius={[4, 4, 0, 0]} />
                <Bar dataKey="threats" name="Threats" fill="#FF2020" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Threat Distribution by Category */}
        <div className="rounded-2xl border border-[#321010] bg-[#111111] p-5 lg:col-span-5">
          <div className="mb-4">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              THREAT DISTRIBUTION BY CATEGORY
            </h2>
            <p className="text-xs text-[#A0A0A0]">Classified verdicts from your scan history</p>
          </div>

          {categoryData.length === 0 ? (
            <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-[#321010] bg-[#0A0A0A] p-6 text-center">
              <ShieldAlert className="h-9 w-9 text-[#FF2020]/60" />
              <p className="mt-3 font-mono text-xs font-bold uppercase tracking-wider text-white">
                NO TELEMETRY DATA YET
              </p>
              <p className="mt-1 text-xs text-[#A0A0A0]">
                Run a message or URL scan to visualize threat breakdown.
              </p>
              <button
                type="button"
                onClick={() => navigate('/scanner?demo=fake-job-offer')}
                className="mt-4 rounded-lg border border-[#FF2020]/60 bg-[#FF2020]/15 px-3.5 py-1.5 font-mono text-xs font-semibold text-white hover:bg-[#FF2020]/30"
              >
                Load Demo Sample
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={82}
                      paddingAngle={3}
                      stroke="#050505"
                      strokeWidth={2}
                    >
                      {categoryData.map((entry, idx) => (
                        <Cell
                          key={entry.name}
                          fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0A0A0A',
                        borderColor: '#FF2020',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {categoryData.map((entry, idx) => (
                  <span
                    key={entry.name}
                    className="inline-flex items-center gap-1.5 rounded border border-[#321010] bg-[#0A0A0A] px-2 py-0.5 font-mono text-[11px] text-[#D4D4D4]"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    {entry.name} ({entry.value})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="mt-8 rounded-2xl border border-[#321010] bg-[#111111] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              RECENT SCANS (LAST 5)
            </h2>
            <p className="text-xs text-[#A0A0A0]">Latest analyzed message and URL payloads</p>
          </div>
          <Link
            to="/history"
            className="font-mono text-xs font-semibold text-[#FF3030] hover:underline"
          >
            VIEW FULL LOG &rarr;
          </Link>
        </div>

        {recentScans.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#321010] bg-[#0A0A0A] p-8 text-center">
            <p className="font-mono text-xs text-[#A0A0A0]">
              No scan records found in localStorage. Start analyzing a message or URL to populate
              your Threat Intelligence log.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#321010] font-mono text-[11px] uppercase tracking-wider text-[#A0A0A0]">
                  <th className="py-3 pr-4">Payload Preview</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 pl-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#321010]/60">
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="transition-colors hover:bg-[#171717]">
                    <td className="max-w-xs py-3.5 pr-4 font-mono text-xs text-white truncate">
                      {scan.input}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded border border-[#321010] bg-[#0A0A0A] px-2 py-0.5 font-mono text-[10px] uppercase text-[#A0A0A0]">
                        {scan.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#D4D4D4]">{scan.result.category}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {scan.result.score}/100
                        </span>
                        <StatusBadge label={scan.result.risk_level} score={scan.result.score} />
                      </div>
                    </td>
                    <td className="py-3.5 pl-4 text-right font-mono text-xs text-[#A0A0A0] whitespace-nowrap">
                      {new Date(scan.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
