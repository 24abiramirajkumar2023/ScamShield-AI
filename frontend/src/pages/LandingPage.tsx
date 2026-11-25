import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BrainCircuit,
  Briefcase,
  ChevronRight,
  Cpu,
  Globe,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Message Detection',
    tag: 'NLP ENGINE',
    description:
      'Analyze SMS, WhatsApp, email, and social DMs using hybrid linguistic forensics and weighted threat heuristics.',
  },
  {
    icon: ShieldAlert,
    title: 'Phishing Detection',
    tag: 'ANTI-SMISHING',
    description:
      'Flag urgent account-suspension lures, OTP harvesting traps, and authority impersonation attempts in milliseconds.',
  },
  {
    icon: Globe,
    title: 'URL Security Analysis',
    tag: 'ZERO-FETCH',
    description:
      'Inspect URL structure, shorteners, suspicious TLDs, raw IP hosts, and brand spoofing locally without ever visiting the link.',
  },
  {
    icon: Briefcase,
    title: 'Fake Job Detection',
    tag: 'OFFER AUDIT',
    description:
      'Spot unrealistic salary promises, refundable registration deposit traps, and illegitimate recruitment funnels.',
  },
  {
    icon: Cpu,
    title: 'Explainable AI',
    tag: 'GLASS-BOX SOC',
    description:
      'Every risk score includes highlighted trigger phrases, matched threat signals, and transparent analyst reasoning.',
  },
  {
    icon: ShieldCheck,
    title: 'Smart Safety Recommendations',
    tag: 'CONTAINMENT',
    description:
      'Receive immediate, actionable next steps tailored to the detected threat category to protect your accounts.',
  },
]

const TIMELINE_STEPS = [
  {
    step: '01',
    title: 'Submit Payload',
    description:
      'Paste any suspicious message, email, or link—or load one of our built-in judge demo threats.',
  },
  {
    step: '02',
    title: 'Local Sanitization',
    description:
      'Payloads are validated safely. URLs are parsed structurally and never fetched or executed.',
  },
  {
    step: '03',
    title: 'Multi-Signal Scan',
    description:
      'Our engine evaluates urgency tactics, financial lures, OTP requests, and obfuscated link tokens.',
  },
  {
    step: '04',
    title: 'Risk Index Scoring',
    description:
      'Weighted signal severity computes an actionable 0–100 Risk Index and confidence level.',
  },
  {
    step: '05',
    title: 'Forensic Highlighting',
    description:
      'Suspicious trigger phrases are highlighted inline alongside categorized threat signal cards.',
  },
  {
    step: '06',
    title: 'Defend & Archive',
    description:
      'Review containment steps and store the audit entry locally in your browser scan history.',
  },
]

export const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#321010] bg-[#111111] px-3.5 py-1.5 shadow-[0_0_16px_rgba(255,32,32,0.18)]">
              <Radar className="h-3.5 w-3.5 text-[#FF2020] animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF3030]">
                REAL-TIME CYBER THREAT TELEMETRY
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              SCAMSHIELD{' '}
              <span className="text-[#FF2020] text-glow animate-glow">AI</span>
            </h1>

            <p className="mt-4 font-mono text-lg font-semibold tracking-wide text-[#FF3030] sm:text-2xl">
              Detect the Threat. Stop the Scam.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#A0A0A0] sm:text-lg">
              A futuristic Security Operations Center platform engineered to expose phishing lures,
              OTP harvesting traps, fake job deposits, and malicious URLs with explainable AI
              precision before a single click costs you.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/scanner"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-[#FF2020] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#FF3030] glow-red hover:glow-red-intense"
              >
                <span>START THREAT ANALYSIS</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[#FF2020]/70 bg-[#111111]/80 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:border-[#FF3030] hover:bg-[#FF2020]/10 hover:shadow-[0_0_20px_rgba(255,32,32,0.25)]"
              >
                <span>EXPLORE PLATFORM</span>
                <ChevronRight className="h-4 w-4 text-[#FF2020]" />
              </Link>
            </div>

            {/* Quick Telemetry Stats Strip */}
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-[#321010] pt-6">
              <div>
                <p className="font-mono text-xl font-extrabold text-white sm:text-2xl">11+</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#A0A0A0]">
                  Scam Typologies
                </p>
              </div>
              <div>
                <p className="font-mono text-xl font-extrabold text-[#FF2020] sm:text-2xl">0-100</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#A0A0A0]">
                  Weighted Risk Index
                </p>
              </div>
              <div>
                <p className="font-mono text-xl font-extrabold text-white sm:text-2xl">100%</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#A0A0A0]">
                  Zero-Fetch URL Safety
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Animated Cyber Shield SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="flex justify-center lg:col-span-5"
          >
            <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-3xl border border-[#321010] bg-[#0A0A0A]/90 p-6 glow-red sm:h-[380px] sm:w-[380px]">
              <div className="scan-line" />

              {/* Corner brackets */}
              <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-[#FF2020]" />
              <span className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-[#FF2020]" />
              <span className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#FF2020]" />
              <span className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#FF2020]" />

              <svg
                viewBox="0 0 260 260"
                className="h-full w-full"
                aria-label="Animated ScamShield Cyber Defense Core"
              >
                <defs>
                  <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF2020" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#8B0000" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#050505" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="shieldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF3030" />
                    <stop offset="50%" stopColor="#FF2020" />
                    <stop offset="100%" stopColor="#8B0000" />
                  </linearGradient>
                </defs>

                {/* Ambient Backdrop */}
                <circle cx="130" cy="130" r="115" fill="url(#shieldGlow)" />

                {/* Rotating Outer Tactical Ring */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '130px 130px' }}
                >
                  <circle
                    cx="130"
                    cy="130"
                    r="106"
                    fill="none"
                    stroke="#321010"
                    strokeWidth="1.5"
                    strokeDasharray="10 8"
                  />
                  <circle cx="130" cy="24" r="3" fill="#FF3030" />
                  <circle cx="130" cy="236" r="3" fill="#FF2020" />
                </motion.g>

                {/* Counter-Rotating Inner Radar Ring */}
                <motion.g
                  animate={{ rotate: -360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '130px 130px' }}
                >
                  <circle
                    cx="130"
                    cy="130"
                    r="86"
                    fill="none"
                    stroke="#FF2020"
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                    strokeDasharray="24 14 6 14"
                  />
                </motion.g>

                {/* Shield Silhouette */}
                <motion.path
                  d="M130 48 L188 72 V124 C188 164 162 195 130 212 C98 195 72 164 72 124 V72 Z"
                  fill="#111111"
                  stroke="url(#shieldStroke)"
                  strokeWidth="2.8"
                  initial={{ pathLength: 0.4, opacity: 0.7 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                />

                {/* Inner Shield Frame */}
                <path
                  d="M130 62 L175 81 V123 C175 155 154 180 130 195 C106 180 85 155 85 123 V81 Z"
                  fill="#0A0A0A"
                  stroke="#321010"
                  strokeWidth="1.2"
                />

                {/* Pulsing Core Crosshair & Hexagon */}
                <motion.polygon
                  points="130,92 156,107 156,137 130,152 104,137 104,107"
                  fill="#FF2020"
                  fillOpacity="0.14"
                  stroke="#FF3030"
                  strokeWidth="2"
                  animate={{ scale: [1, 1.07, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '130px 122px' }}
                />

                {/* Central Shield Check / Alert Glyph */}
                <path
                  d="M130 106 V126 M130 134 V138"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>

              {/* HUD Tag */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#321010] bg-[#111111] px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-[#FF3030]">
                SHIELD CORE // ACTIVE DEFENSE
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="border-t border-[#321010] bg-[#0A0A0A]/80 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF2020]">
                CAPABILITIES MATRIX
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                MULTI-LAYER THREAT DEFENSE
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#A0A0A0]">
              Engineered as a glass-box cybersecurity workbench combining instant threat triage with
              transparent forensic signal breakdown.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="group rounded-2xl border border-[#321010] bg-[#111111] p-6 transition-all duration-300 hover:border-[#FF2020] hover:bg-[#171717] hover:shadow-[0_0_25px_rgba(255,32,32,0.16)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#321010] bg-[#0A0A0A] text-[#FF2020] transition-transform duration-300 group-hover:scale-110 group-hover:border-[#FF2020]/60">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded border border-[#321010] bg-[#0A0A0A] px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[#FF3030]">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A0A0A0]">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="border-t border-[#321010] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF2020]">
              DETECTION PIPELINE
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              HOW SCAMSHIELD AI OPERATES
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#A0A0A0]">
              Six deterministic and AI-assisted telemetry stages turn raw suspicious text or links
              into an explainable security verdict.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TIMELINE_STEPS.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="relative rounded-2xl border border-[#321010] bg-[#111111] p-6 transition-colors hover:border-[#FF2020]/60"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-[#FF2020] text-glow">
                    {item.step}
                  </span>
                  <div className="h-px flex-1 mx-4 bg-gradient-to-r from-[#FF2020]/60 to-[#321010]" />
                  <Sparkles className="h-4 w-4 text-[#FF3030]/80" />
                </div>

                <h3 className="mt-4 text-base font-bold uppercase tracking-wide text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A0A0A0]">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#FF2020]/50 bg-[#111111] p-6 sm:flex-row sm:p-8 glow-red">
            <div>
              <h3 className="text-xl font-extrabold text-white">
                Ready to inspect a suspicious message or URL?
              </h3>
              <p className="mt-1 text-sm text-[#A0A0A0]">
                Launch the AI Message Threat Analyzer or test 6 built-in hackathon demo scenarios.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/scanner"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF2020] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#FF3030]"
              >
                OPEN MESSAGE SCANNER
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/url-scanner"
                className="inline-flex items-center gap-2 rounded-xl border border-[#321010] bg-[#171717] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:border-[#FF2020]"
              >
                URL INTELLIGENCE
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
