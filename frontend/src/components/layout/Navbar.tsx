import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShieldAlert, X } from 'lucide-react'

interface NavItem {
  label: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Scanner', path: '/scanner' },
  { label: 'URL Scanner', path: '/url-scanner' },
  { label: 'Threat Center', path: '/threat-center' },
  { label: 'History', path: '/history' },
  { label: 'Assistant', path: '/assistant' },
  { label: 'About', path: '/about' },
]

export const Navbar: React.FC = () => {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#321010] backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        boxShadow: '0 2px 24px rgba(255, 32, 32, 0.16)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#321010] bg-[#111111] transition-all duration-300 group-hover:border-[#FF2020] group-hover:shadow-[0_0_16px_rgba(255,32,32,0.45)]">
            <ShieldAlert className="h-5 w-5 text-[#FF2020] transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#FF3030] animate-ping opacity-75" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#FF2020]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-[0.18em] text-white sm:text-base">
              SCAMSHIELD <span className="text-[#FF2020] text-glow">AI</span>
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.2em] text-[#A0A0A0] sm:block">
              THREAT DEFENSE SOC
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 xl:px-3 ${
                  active
                    ? 'bg-[#FF2020]/15 text-white border border-[#FF2020]/50 shadow-[0_0_12px_rgba(255,32,32,0.22)]'
                    : 'text-[#A0A0A0] hover:bg-[#111111] hover:text-white border border-transparent'
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#FF2020] shadow-[0_0_8px_#FF2020]"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* System Status + Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[#321010] bg-[#111111] px-3 py-1.5 shadow-[0_0_12px_rgba(255,32,32,0.12)] sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2020] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF3030]" />
            </span>
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-[#FF2020]">
              SYSTEM ONLINE
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#321010] bg-[#111111] text-white transition-colors hover:border-[#FF2020] hover:text-[#FF2020] lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[#321010] bg-[#0A0A0A] lg:hidden"
          >
            <div className="space-y-1.5 px-4 py-4">
              <div className="mb-3 flex items-center justify-between rounded-lg border border-[#321010] bg-[#111111] px-3 py-2 sm:hidden">
                <span className="font-mono text-xs text-[#A0A0A0]">ENGINE TELEMETRY</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF3030] animate-pulse" />
                  <span className="font-mono text-xs font-bold tracking-wider text-[#FF2020]">
                    SYSTEM ONLINE
                  </span>
                </div>
              </div>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all ${
                      active
                        ? 'border border-[#FF2020]/50 bg-[#FF2020]/15 text-white'
                        : 'border border-transparent text-[#A0A0A0] hover:border-[#321010] hover:bg-[#111111] hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-[#FF2020]" />}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
