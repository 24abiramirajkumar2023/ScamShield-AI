import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Navbar } from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#050505] text-white cyber-grid">
      {/* Subtle ambient crimson top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] opacity-35"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255, 32, 32, 0.14), transparent 70%)',
        }}
      />

      <Navbar />

      <main className="relative z-10 flex-1">{children}</main>

      <footer className="relative z-10 border-t border-[#321010] bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-[#FF2020]" />
            <div>
              <p className="text-sm font-bold tracking-wider text-white">
                SCAMSHIELD <span className="text-[#FF2020]">AI</span>
              </p>
              <p className="font-mono text-xs text-[#A0A0A0]">
                Detect the Threat. Stop the Scam.
              </p>
            </div>
          </div>

          <p className="max-w-xl text-xs leading-relaxed text-[#A0A0A0]">
            Disclaimer: ScamShield AI provides automated threat heuristics for educational and
            assistive security triage. Always verify critical alerts through official channels
            and never share OTPs, PINs, or credentials.
          </p>

          <div className="flex items-center gap-4 font-mono text-xs text-[#A0A0A0]">
            <Link to="/scanner" className="transition-colors hover:text-[#FF2020]">
              Scanner
            </Link>
            <Link to="/threat-center" className="transition-colors hover:text-[#FF2020]">
              Threats
            </Link>
            <Link to="/assistant" className="transition-colors hover:text-[#FF2020]">
              Assistant
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
