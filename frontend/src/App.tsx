import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Layout } from './components/layout/Layout'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { MessageScannerPage } from './pages/MessageScannerPage'
import { URLScannerPage } from './pages/URLScannerPage'
import { ThreatCenterPage } from './pages/ThreatCenterPage'
import { HistoryPage } from './pages/HistoryPage'
import { AssistantPage } from './pages/AssistantPage'
import { AboutPage } from './pages/AboutPage'

const NotFoundPage: React.FC = () => (
  <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF2020]/60 bg-[#111111] glow-red">
      <ShieldAlert className="h-8 w-8 text-[#FF2020]" />
    </div>
    <h1 className="mt-6 font-mono text-3xl font-black text-white">404 // SECTOR NOT FOUND</h1>
    <p className="mt-2 text-sm text-[#A0A0A0]">
      The requested route is outside the ScamShield AI SOC perimeter.
    </p>
    <Link
      to="/"
      className="mt-6 rounded-xl bg-[#FF2020] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#FF3030]"
    >
      Return to Home
    </Link>
  </div>
)

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/scanner" element={<MessageScannerPage />} />
        <Route path="/url-scanner" element={<URLScannerPage />} />
        <Route path="/threat-center" element={<ThreatCenterPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
