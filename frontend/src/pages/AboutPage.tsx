import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Cpu,
  Layers,
  Lock,
  ScanSearch,
  ShieldAlert,
  Terminal,
  Trophy,
} from 'lucide-react'

const FRONTEND_STACK = [
  'React 18 + TypeScript',
  'Vite Build Toolchain',
  'Tailwind CSS (Red & Black SOC Theme)',
  'Framer Motion Animations',
  'Recharts Threat Telemetry',
  'React Router DOM',
  'Axios API Client',
  'Lucide React Iconography',
]

const BACKEND_STACK = [
  'Python 3.9+ & FastAPI',
  'Pydantic v2 Schema Validation',
  'Uvicorn ASGI Server',
  'Hybrid NLP + Heuristic Rule Engine',
  'Weighted Signal Risk Scoring',
  'Static Zero-Fetch URL Analyzer',
]

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-[#321010] pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF2020]">
          PLATFORM ARCHITECTURE &amp; MISSION
        </span>
        <h1 className="mt-2 text-2xl font-black tracking-wide text-white sm:text-4xl">
          ABOUT SCAMSHIELD AI
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#A0A0A0]">
          Detect the Threat. Stop the Scam. — Explainable cybersecurity protection designed for
          everyday users, students, and rapid threat triage.
        </p>
      </div>

      {/* Mission & Hackathon Context */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#321010] bg-[#111111] p-6 lg:col-span-7 glow-red"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-5 w-5 text-[#FF2020]" />
            <h2 className="text-lg font-extrabold uppercase tracking-wide text-white">
              PROJECT MISSION
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#D4D4D4]">
            Modern online fraud relies on psychological manipulation—manufactured urgency, fake
            employment offers, bank KYC panic, and disguised short URLs. Black-box warnings rarely
            teach users <em className="text-white">why</em> a message is dangerous.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">
            ScamShield AI transforms raw suspicious messages and links into transparent SOC-grade
            telemetry: a weighted 0–100 Risk Index, forensic trigger-phrase highlights, individual
            threat signal cards, and clear containment recommendations.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF2020] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#FF3030]"
            >
              <ScanSearch className="h-4 w-4" />
              <span>Launch Scanner</span>
            </Link>
            <Link
              to="/threat-center"
              className="inline-flex items-center gap-2 rounded-xl border border-[#321010] bg-[#171717] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-[#FF2020]"
            >
              <span>Explore Threat Center</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-[#321010] bg-[#111111] p-6 lg:col-span-5"
        >
          <div className="flex items-center gap-2.5">
            <Trophy className="h-5 w-5 text-[#FF2020]" />
            <h2 className="text-lg font-extrabold uppercase tracking-wide text-white">
              HACKATHON CONTEXT
            </h2>
          </div>
          <div className="mt-4 space-y-3 font-mono text-xs">
            <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-3.5">
              <span className="text-[#A0A0A0]">EVENT</span>
              <p className="mt-1 font-bold text-white">
                36-Hour International Hackathon — Build Without Limit
              </p>
            </div>
            <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-3.5">
              <span className="text-[#A0A0A0]">CATEGORY</span>
              <p className="mt-1 font-bold text-[#FF3030]">AI / Cybersecurity Defense</p>
            </div>
            <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-3.5">
              <span className="text-[#A0A0A0]">CORE PRINCIPLE</span>
              <p className="mt-1 font-bold text-white">Explainable Glass-Box Threat Detection</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tech Stack */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#321010] bg-[#111111] p-6">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-[#FF2020]" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              FRONTEND ARCHITECTURE
            </h2>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {FRONTEND_STACK.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg border border-[#321010]/70 bg-[#0A0A0A] px-3 py-2 font-mono text-xs text-[#D4D4D4]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF2020]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#321010] bg-[#111111] p-6">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-5 w-5 text-[#FF2020]" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              BACKEND DETECTION ENGINE
            </h2>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BACKEND_STACK.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg border border-[#321010]/70 bg-[#0A0A0A] px-3 py-2 font-mono text-xs text-[#D4D4D4]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF2020]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="mt-8 rounded-2xl border border-[#321010] bg-[#111111] p-6">
        <div className="flex items-center gap-2.5">
          <Lock className="h-5 w-5 text-[#FF2020]" />
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
            SECURITY &amp; PRIVACY GUARANTEES
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-4">
            <Terminal className="h-4 w-4 text-[#FF2020]" />
            <h3 className="mt-2 text-sm font-bold text-white">Zero-Fetch URL Analysis</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#A0A0A0]">
              Submitted links are inspected structurally and never opened, visited, or executed.
            </p>
          </div>
          <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-4">
            <Lock className="h-4 w-4 text-[#FF2020]" />
            <h3 className="mt-2 text-sm font-bold text-white">Client-Only History</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#A0A0A0]">
              Your scan log lives strictly in browser localStorage and can be wiped with one click.
            </p>
          </div>
          <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-4">
            <ShieldAlert className="h-4 w-4 text-[#FF2020]" />
            <h3 className="mt-2 text-sm font-bold text-white">Zero Credential Harvesting</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#A0A0A0]">
              No login required, no personal PII stored, and optional API keys stay in env vars.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#FF2020]/50 bg-[#111111] p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF2020]" />
        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF3030]">
            SECURITY DISCLAIMER
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[#D4D4D4]">
            ScamShield AI is an assistive cybersecurity decision-support tool. Automated threat
            scores and heuristics may occasionally produce false positives or false negatives. Always
            verify critical financial, legal, or account messages directly through official channels,
            and never share OTPs, passwords, or banking PINs with anyone.
          </p>
        </div>
      </div>
    </div>
  )
}
