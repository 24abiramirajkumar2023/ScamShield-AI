import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  Eraser,
  FileWarning,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  WifiOff,
} from 'lucide-react'
import { analyzeMessage, getApiErrorMessage } from '../services/api'
import { useScanHistory } from '../hooks/useScanHistory'
import { DEMO_EXAMPLES } from '../data/demoExamples'
import type { AnalysisResult, ApiErrorInfo } from '../types/threat'
import { RiskMeter } from '../components/ui/RiskMeter'
import { ThreatSignalCard } from '../components/ui/ThreatSignalCard'
import { HighlightedText } from '../components/ui/HighlightedText'
import { LoadingScanner } from '../components/ui/LoadingScanner'
import { StatusBadge } from '../components/ui/StatusBadge'
import { DemoExamples } from '../components/demo/DemoExamples'

const MAX_CHARS = 5000

export const MessageScannerPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { addScan } = useScanHistory()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [text, setText] = useState('')
  const [analyzedText, setAnalyzedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [errorInfo, setErrorInfo] = useState<ApiErrorInfo | null>(null)
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null)

  useEffect(() => {
    const demoId = searchParams.get('demo')
    if (demoId) {
      const matched = DEMO_EXAMPLES.find((d) => d.id === demoId) ?? DEMO_EXAMPLES[0]
      if (matched) {
        setText(matched.content)
      }
    }
  }, [searchParams])

  const handleAnalyze = async (payloadOverride?: string) => {
    const targetText = (payloadOverride ?? text).trim()
    if (!targetText) {
      setErrorInfo({
        isOffline: false,
        message: 'Please enter or paste a suspicious message before starting threat analysis.',
      })
      return
    }

    setLoading(true)
    setErrorInfo(null)
    setResult(null)
    setClipboardNotice(null)

    try {
      const data = await analyzeMessage(targetText)
      setResult(data)
      setAnalyzedText(targetText)
      addScan({
        type: 'message',
        input: targetText,
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
      const clipText = await navigator.clipboard.readText()
      if (!clipText) {
        setClipboardNotice('Clipboard is empty.')
        return
      }
      setText(clipText.slice(0, MAX_CHARS))
      setErrorInfo(null)
    } catch {
      setClipboardNotice('Clipboard permission denied. Use Ctrl+V inside the text box.')
      textareaRef.current?.focus()
    }
  }

  const handleClear = () => {
    setText('')
    setAnalyzedText('')
    setResult(null)
    setErrorInfo(null)
    setClipboardNotice(null)
  }

  const handleSelectDemo = (content: string) => {
    setText(content.slice(0, MAX_CHARS))
    setErrorInfo(null)
    setClipboardNotice(null)
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    textareaRef.current?.focus()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="border-b border-[#321010] pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF2020]">
          NLP &amp; SOCIAL ENGINEERING FORENSICS
        </span>
        <h1 className="mt-2 text-2xl font-black tracking-wide text-white sm:text-4xl">
          AI MESSAGE THREAT ANALYZER
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#A0A0A0]">
          Inspect SMS, WhatsApp messages, emails, or job offers for phishing cues, urgency tactics,
          advance-fee fraud, and credential harvesting traps.
        </p>
      </div>

      {/* Scanner Input Card */}
      <div className="mt-8 rounded-2xl border border-[#321010] bg-[#111111] p-5 sm:p-6 glow-red">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="message-input"
            className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-white"
          >
            SUSPICIOUS MESSAGE PAYLOAD
          </label>
          <span
            className={`font-mono text-xs ${
              text.length >= MAX_CHARS ? 'text-[#FF3030]' : 'text-[#A0A0A0]'
            }`}
          >
            {text.length} / {MAX_CHARS} chars
          </span>
        </div>

        <textarea
          ref={textareaRef}
          id="message-input"
          value={text}
          maxLength={MAX_CHARS}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a suspicious SMS, WhatsApp forward, email, OTP warning, or job offer here..."
          className="min-h-[200px] w-full resize-y rounded-xl border border-[#321010] bg-[#050505] p-4 font-mono text-sm leading-relaxed text-white placeholder-[#666666] transition-colors focus:border-[#FF2020] focus:outline-none focus:ring-1 focus:ring-[#FF2020]"
        />

        {clipboardNotice && (
          <p className="mt-2 font-mono text-xs text-orange-400">{clipboardNotice}</p>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => void handlePaste()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#321010] bg-[#171717] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#FF2020] disabled:opacity-50"
            >
              <ClipboardPaste className="h-4 w-4 text-[#FF2020]" />
              <span>Paste</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={loading || (!text && !result && !errorInfo)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#321010] bg-[#171717] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#A0A0A0] transition-colors hover:border-[#FF2020] hover:text-white disabled:opacity-50"
            >
              <Eraser className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => void handleAnalyze()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF2020] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#FF3030] glow-red disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ScanSearch className="h-4 w-4" />
            <span>{loading ? 'Analyzing...' : 'Analyze Message'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-8">
          <LoadingScanner />
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
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#FF3030]">
                    {errorInfo.isOffline ? 'BACKEND ENGINE OFFLINE' : 'ANALYSIS ERROR'}
                  </h3>
                  {errorInfo.statusCode && (
                    <span className="rounded border border-[#321010] bg-[#0A0A0A] px-2 py-0.5 font-mono text-[11px] text-[#A0A0A0]">
                      HTTP {errorInfo.statusCode}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-[#D4D4D4]">{errorInfo.message}</p>
                {errorInfo.isOffline && (
                  <p className="mt-2 font-mono text-xs text-[#A0A0A0]">
                    Tip: Start the FastAPI server (`cd backend &amp;&amp; python run.py`) and retry.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleAnalyze()}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#FF2020] bg-[#FF2020]/15 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#FF2020]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-8 space-y-6"
        >
          {/* Top Verdict Overview */}
          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#321010] bg-[#111111] p-6 lg:grid-cols-12 glow-red">
            <div className="flex items-center justify-center border-b border-[#321010] pb-6 lg:col-span-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
              <RiskMeter score={result.score} riskLevel={result.risk_level} />
            </div>

            <div className="flex flex-col justify-between lg:col-span-8">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={result.category} score={result.score} />
                    <span className="rounded-full border border-[#321010] bg-[#0A0A0A] px-3 py-0.5 font-mono text-[11px] text-[#A0A0A0]">
                      CONFIDENCE: {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#A0A0A0]">
                    SIGNALS DETECTED: {result.signals.length}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-extrabold text-white">THREAT ASSESSMENT SUMMARY</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#D4D4D4]">{result.summary}</p>
              </div>

              {result.explanations.length > 0 && (
                <div className="mt-5 rounded-xl border border-[#321010] bg-[#0A0A0A] p-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF3030]">
                    EXPLAINABLE AI REASONING
                  </h3>
                  <ul className="mt-2.5 space-y-1.5 text-sm text-[#D4D4D4]">
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

          {/* Highlighted Original Text */}
          <HighlightedText text={analyzedText} phrases={result.highlighted_phrases} />

          {/* Signals & Recommendations Split */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Detected Threat Signals */}
            <div className="lg:col-span-7">
              <div className="mb-3 flex items-center gap-2">
                <FileWarning className="h-4 w-4 text-[#FF2020]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white">
                  EXTRACTED THREAT SIGNALS ({result.signals.length})
                </h3>
              </div>

              {result.signals.length === 0 ? (
                <div className="rounded-xl border border-[#321010] bg-[#111111] p-6 text-center">
                  <ShieldCheck className="mx-auto h-8 w-8 text-white/70" />
                  <p className="mt-2 text-sm font-semibold text-white">
                    No Malicious Threat Signals Triggered
                  </p>
                  <p className="mt-1 text-xs text-[#A0A0A0]">
                    This payload did not match known scam, phishing, or urgency patterns.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.signals.map((signal, idx) => (
                    <ThreatSignalCard key={`${signal.name}-${idx}`} signal={signal} index={idx} />
                  ))}
                </div>
              )}
            </div>

            {/* Smart Safety Recommendations */}
            <div className="lg:col-span-5">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#FF2020]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white">
                  RECOMMENDED SECURITY ACTIONS
                </h3>
              </div>

              <div className="rounded-xl border border-[#321010] bg-[#111111] p-5">
                {result.recommendations.length === 0 ? (
                  <p className="text-sm text-[#A0A0A0]">
                    No special containment steps required. Continue standard security awareness.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 rounded-lg border border-[#321010]/70 bg-[#0A0A0A] p-3 text-sm text-[#E5E5E5]"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2020]" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Demo Examples Below Input */}
      <div className="mt-10">
        <DemoExamples onSelect={handleSelectDemo} />
      </div>
    </div>
  )
}
