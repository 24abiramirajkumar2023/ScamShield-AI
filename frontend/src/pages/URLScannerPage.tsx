import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  Eraser,
  Globe,
  Link2,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  WifiOff,
} from 'lucide-react'
import { analyzeURL, getApiErrorMessage } from '../services/api'
import { useScanHistory } from '../hooks/useScanHistory'
import type { AnalysisResult, ApiErrorInfo } from '../types/threat'
import { RiskMeter } from '../components/ui/RiskMeter'
import { ThreatSignalCard } from '../components/ui/ThreatSignalCard'
import { HighlightedText } from '../components/ui/HighlightedText'
import { LoadingScanner } from '../components/ui/LoadingScanner'
import { StatusBadge } from '../components/ui/StatusBadge'

const SAMPLE_URLS = [
  { label: 'Shortened Login Phish', url: 'http://bit.ly/secure-login-verify' },
  { label: 'IP-Host Banking Trap', url: 'http://192.168.1.45/bank-kyc-otp-verify.php' },
  { label: 'Spoofed Subdomain', url: 'https://verify-account.paypa1-security-alert.xyz/login' },
  { label: 'Safe Official Domain', url: 'https://github.com/login' },
]

interface ParsedUrlIndicators {
  protocol: string
  hostname: string
  usesHttps: boolean
  isShortener: boolean
  hasIpHost: boolean
  hasAtSymbol: boolean
}

const SHORTENER_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'rb.gy',
  'shorturl.at',
]

function inspectUrlLocally(rawUrl: string): ParsedUrlIndicators | null {
  try {
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `http://${rawUrl}`
    const parsed = new URL(normalized)
    const host = parsed.hostname.toLowerCase()
    const isIp = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)
    const isShortener = SHORTENER_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`))

    return {
      protocol: parsed.protocol.replace(':', '').toUpperCase(),
      hostname: host,
      usesHttps: parsed.protocol === 'https:',
      isShortener,
      hasIpHost: isIp,
      hasAtSymbol: rawUrl.includes('@'),
    }
  } catch {
    return null
  }
}

export const URLScannerPage: React.FC = () => {
  const { addScan } = useScanHistory()
  const [urlInput, setUrlInput] = useState('')
  const [analyzedUrl, setAnalyzedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [errorInfo, setErrorInfo] = useState<ApiErrorInfo | null>(null)
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null)

  const localIndicators = useMemo(
    () => (analyzedUrl ? inspectUrlLocally(analyzedUrl) : null),
    [analyzedUrl]
  )

  const handleAnalyze = async (overrideUrl?: string) => {
    const candidate = (overrideUrl ?? urlInput).trim()
    if (!candidate) {
      setErrorInfo({
        isOffline: false,
        message: 'Please enter a URL to inspect (e.g., http://bit.ly/secure-login-verify).',
      })
      return
    }

    setLoading(true)
    setErrorInfo(null)
    setResult(null)
    setClipboardNotice(null)

    try {
      const data = await analyzeURL(candidate)
      setResult(data)
      setAnalyzedUrl(candidate)
      addScan({
        type: 'url',
        input: candidate,
        result: data,
      })
    } catch (err) {
      setErrorInfo(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handlePaste = async () => {
    setClipboardNotice(null)
    try {
      const clip = await navigator.clipboard.readText()
      if (!clip) {
        setClipboardNotice('Clipboard is empty.')
        return
      }
      setUrlInput(clip.trim())
      setErrorInfo(null)
    } catch {
      setClipboardNotice('Clipboard access blocked. Paste directly using Ctrl+V.')
    }
  }

  const handleClear = () => {
    setUrlInput('')
    setAnalyzedUrl('')
    setResult(null)
    setErrorInfo(null)
    setClipboardNotice(null)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="border-b border-[#321010] pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF2020]">
          STATIC LINK SANDBOX // ZERO-EXECUTION
        </span>
        <h1 className="mt-2 text-2xl font-black tracking-wide text-white sm:text-4xl">
          URL THREAT INTELLIGENCE
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#A0A0A0]">
          Evaluate suspicious links for shortener masking, unencrypted HTTP login lures, raw IP
          hosting, deceptive subdomains, and phishing keywords.
        </p>
      </div>

      {/* Mandatory Local Safety Warning */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#FF2020]/50 bg-[#111111] p-4 shadow-[0_0_16px_rgba(255,32,32,0.12)]">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#FF2020]" />
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF3030]">
            SANDBOX PRIVACY GUARANTEE
          </p>
          <p className="mt-0.5 text-sm text-white">
            URL analysis is performed locally. We never open or visit submitted URLs.
          </p>
        </div>
      </div>

      {/* URL Input Card */}
      <div className="mt-6 rounded-2xl border border-[#321010] bg-[#111111] p-5 sm:p-6 glow-red">
        <label
          htmlFor="url-input"
          className="block font-mono text-xs font-bold uppercase tracking-[0.15em] text-white"
        >
          TARGET URL PAYLOAD
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF2020]" />
            <input
              id="url-input"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleAnalyze()
                }
              }}
              placeholder="https://example.com/verify or http://bit.ly/secure-login-verify"
              className="w-full rounded-xl border border-[#321010] bg-[#050505] py-3.5 pl-10 pr-4 font-mono text-sm text-white placeholder-[#666666] transition-colors focus:border-[#FF2020] focus:outline-none focus:ring-1 focus:ring-[#FF2020]"
            />
          </div>

          <button
            type="button"
            onClick={() => void handleAnalyze()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2020] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#FF3030] glow-red disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Link2 className="h-4 w-4" />
            <span>{loading ? 'Scanning...' : 'Analyze URL'}</span>
          </button>
        </div>

        {clipboardNotice && (
          <p className="mt-2 font-mono text-xs text-orange-400">{clipboardNotice}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#321010]/70 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handlePaste()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#321010] bg-[#171717] px-3 py-1.5 font-mono text-xs text-white hover:border-[#FF2020]"
            >
              <ClipboardPaste className="h-3.5 w-3.5 text-[#FF2020]" />
              Paste
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={loading || (!urlInput && !result && !errorInfo)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#321010] bg-[#171717] px-3 py-1.5 font-mono text-xs text-[#A0A0A0] hover:border-[#FF2020] hover:text-white disabled:opacity-50"
            >
              <Eraser className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase text-[#A0A0A0]">Samples:</span>
            {SAMPLE_URLS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setUrlInput(sample.url)
                  setErrorInfo(null)
                }}
                className="rounded-lg border border-[#321010] bg-[#0A0A0A] px-2.5 py-1 font-mono text-[11px] text-[#D4D4D4] transition-colors hover:border-[#FF2020] hover:text-white"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-8">
          <LoadingScanner
            title="INSPECTING URL STRUCTURE..."
            subtitle="Checking domain heuristics, shortener patterns, TLD risk, and phishing tokens locally"
          />
        </div>
      )}

      {/* Error State */}
      {errorInfo && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-[#FF2020] bg-[#111111] p-5 sm:p-6"
          style={{ boxShadow: '0 0 24px rgba(255, 32, 32, 0.2)' }}
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF2020]/50 bg-[#FF2020]/15 text-[#FF3030]">
                {errorInfo.isOffline ? (
                  <WifiOff className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#FF3030]">
                  {errorInfo.isOffline ? 'BACKEND ENGINE OFFLINE' : 'URL ANALYSIS ERROR'}
                </h3>
                <p className="mt-1.5 text-sm text-[#D4D4D4]">{errorInfo.message}</p>
                {errorInfo.isOffline && (
                  <p className="mt-2 font-mono text-xs text-[#A0A0A0]">
                    Start the FastAPI backend (`cd backend &amp;&amp; python run.py`) and click Retry.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleAnalyze()}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#FF2020] bg-[#FF2020]/15 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#FF2020]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Results View */}
      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Risk Verdict + Structural Indicators */}
          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#321010] bg-[#111111] p-6 lg:grid-cols-12 glow-red">
            <div className="flex items-center justify-center border-b border-[#321010] pb-6 lg:col-span-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
              <RiskMeter score={result.score} riskLevel={result.risk_level} />
            </div>

            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={result.category} score={result.score} />
                <span className="rounded-full border border-[#321010] bg-[#0A0A0A] px-3 py-0.5 font-mono text-[11px] text-[#A0A0A0]">
                  CONFIDENCE: {Math.round(result.confidence * 100)}%
                </span>
              </div>

              <h2 className="mt-4 text-xl font-extrabold text-white">URL THREAT VERDICT</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#D4D4D4]">{result.summary}</p>

              {/* Structural Telemetry Matrix */}
              {localIndicators && (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-3">
                    <span className="font-mono text-[10px] uppercase text-[#A0A0A0]">PROTOCOL</span>
                    <p
                      className={`mt-1 font-mono text-xs font-bold ${
                        result.uses_https ?? localIndicators.usesHttps
                          ? 'text-white'
                          : 'text-[#FF3030]'
                      }`}
                    >
                      {result.scheme?.toUpperCase() || localIndicators.protocol}{' '}
                      {(result.uses_https ?? localIndicators.usesHttps) ? '(TLS)' : '(UNENCRYPTED)'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-3">
                    <span className="font-mono text-[10px] uppercase text-[#A0A0A0]">HOST / DOMAIN</span>
                    <p className="mt-1 truncate font-mono text-xs font-bold text-white">
                      {result.domain || localIndicators.hostname}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-3">
                    <span className="font-mono text-[10px] uppercase text-[#A0A0A0]">SHORTENER</span>
                    <p
                      className={`mt-1 font-mono text-xs font-bold ${
                        result.is_shortened ?? localIndicators.isShortener
                          ? 'text-[#FF3030]'
                          : 'text-white'
                      }`}
                    >
                      {(result.is_shortened ?? localIndicators.isShortener) ? 'DETECTED' : 'NO'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#321010] bg-[#0A0A0A] p-3">
                    <span className="font-mono text-[10px] uppercase text-[#A0A0A0]">RAW IP HOST</span>
                    <p
                      className={`mt-1 font-mono text-xs font-bold ${
                        result.has_ip_address ?? localIndicators.hasIpHost
                          ? 'text-[#FF3030]'
                          : 'text-white'
                      }`}
                    >
                      {(result.has_ip_address ?? localIndicators.hasIpHost) ? 'DETECTED' : 'NO'}
                    </p>
                  </div>
                </div>
              )}

              {result.explanations.length > 0 && (
                <div className="mt-5 rounded-xl border border-[#321010] bg-[#0A0A0A] p-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF3030]">
                    EXPLAINABLE URL FINDINGS
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-[#D4D4D4]">
                    {result.explanations.map((exp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF2020]" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Highlighted URL Segments */}
          <HighlightedText text={analyzedUrl} phrases={result.highlighted_phrases} />

          {/* Signals + Recommendations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#FF2020]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white">
                  URL RISK INDICATORS ({result.signals.length})
                </h3>
              </div>

              {result.signals.length === 0 ? (
                <div className="rounded-xl border border-[#321010] bg-[#111111] p-6 text-center">
                  <ShieldCheck className="mx-auto h-8 w-8 text-white/75" />
                  <p className="mt-2 text-sm font-semibold text-white">
                    No Malicious URL Indicators Found
                  </p>
                  <p className="mt-1 text-xs text-[#A0A0A0]">
                    Static lexical checks found no phishing or domain obfuscation markers.
                  </p>
                </div>
              ) : (
                result.signals.map((signal, idx) => (
                  <ThreatSignalCard key={`${signal.name}-${idx}`} signal={signal} index={idx} />
                ))
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#FF2020]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white">
                  SAFETY RECOMMENDATIONS
                </h3>
              </div>

              <div className="rounded-xl border border-[#321010] bg-[#111111] p-5 space-y-3">
                {result.recommendations.length > 0 ? (
                  result.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-lg border border-[#321010]/70 bg-[#0A0A0A] p-3 text-sm text-[#E5E5E5]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2020]" />
                      <span>{rec}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#A0A0A0]">
                    Always verify the root domain carefully before entering credentials.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
