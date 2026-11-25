import axios, { AxiosError } from 'axios'
import type {
  AnalysisResult,
  ApiErrorInfo,
  HealthResponse,
  StatsResponse,
  ThreatSignal,
} from '../types/threat'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function normalizeSignals(rawSignals: unknown): ThreatSignal[] {
  if (!Array.isArray(rawSignals)) return []
  return rawSignals.map((item) => {
    const sig = (item ?? {}) as Record<string, unknown>
    return {
      name: String(sig.name ?? 'Threat Indicator'),
      severity: String(sig.severity ?? 'MEDIUM').toUpperCase(),
      explanation: String(sig.explanation ?? ''),
      matched_phrase:
        typeof sig.matched_phrase === 'string'
          ? sig.matched_phrase
          : typeof sig.matched_pattern === 'string'
            ? sig.matched_pattern
            : undefined,
    }
  })
}

function normalizeStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => String(item)).filter((item) => item.trim().length > 0)
}

function normalizeAnalysisResult(data: unknown): AnalysisResult {
  const raw = (data ?? {}) as Record<string, unknown>
  const rawScore = Number(raw.score ?? 0)
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : 0

  const rawConfidence = Number(raw.confidence ?? 0.85)
  const confidence = Number.isFinite(rawConfidence)
    ? rawConfidence > 1
      ? Math.min(1, rawConfidence / 100)
      : Math.max(0, rawConfidence)
    : 0.85

  return {
    score,
    risk_level: String(raw.risk_level ?? deriveRiskLevel(score)),
    category: String(raw.category ?? (score >= 40 ? 'Suspicious Activity' : 'Safe Content')),
    summary: String(
      raw.summary ??
        'Automated threat telemetry completed. Review extracted signals and recommendations below.'
    ),
    signals: normalizeSignals(raw.signals),
    highlighted_phrases: normalizeStringArray(raw.highlighted_phrases),
    explanations: normalizeStringArray(raw.explanations),
    recommendations: normalizeStringArray(raw.recommendations),
    confidence,
    url: typeof raw.url === 'string' ? raw.url : undefined,
    domain: typeof raw.domain === 'string' ? raw.domain : undefined,
    scheme: typeof raw.scheme === 'string' ? raw.scheme : undefined,
    is_shortened: typeof raw.is_shortened === 'boolean' ? raw.is_shortened : undefined,
    has_ip_address: typeof raw.has_ip_address === 'boolean' ? raw.has_ip_address : undefined,
    uses_https: typeof raw.uses_https === 'boolean' ? raw.uses_https : undefined,
    suspicious_tld: typeof raw.suspicious_tld === 'boolean' ? raw.suspicious_tld : undefined,
    indicators: Array.isArray(raw.indicators) ? normalizeStringArray(raw.indicators) : undefined,
    analyzed_at: typeof raw.analyzed_at === 'string' ? raw.analyzed_at : new Date().toISOString(),
  }
}

export function deriveRiskLevel(score: number): string {
  if (score < 20) return 'SAFE / LOW RISK'
  if (score <= 40) return 'LOW-MODERATE RISK'
  if (score <= 60) return 'MODERATE THREAT'
  if (score <= 80) return 'HIGH RISK'
  return 'CRITICAL THREAT'
}

export const analyzeMessage = async (text: string): Promise<AnalysisResult> => {
  const response = await apiClient.post('/api/analyze/message', { text })
  return normalizeAnalysisResult(response.data)
}

export const analyzeURL = async (url: string): Promise<AnalysisResult> => {
  const response = await apiClient.post('/api/analyze/url', { url })
  return normalizeAnalysisResult(response.data)
}

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/api/health')
  return response.data
}

export const getStats = async (): Promise<StatsResponse> => {
  const response = await apiClient.get<StatsResponse>('/api/stats')
  return response.data
}

export function getApiErrorMessage(err: unknown): ApiErrorInfo {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{ detail?: string | Array<{ msg?: string }>; message?: string }>
    if (!axiosErr.response) {
      return {
        isOffline: true,
        message: `Threat Engine API unreachable at ${API_BASE}. Ensure the FastAPI backend is running (uvicorn / python run.py).`,
      }
    }

    const statusCode = axiosErr.response.status
    const detail = axiosErr.response.data?.detail
    let serverMsg = axiosErr.response.data?.message

    if (typeof detail === 'string') {
      serverMsg = detail
    } else if (Array.isArray(detail) && detail.length > 0) {
      serverMsg = detail.map((d) => d.msg || 'Validation error').join(', ')
    }

    return {
      isOffline: false,
      statusCode,
      message: serverMsg || `API returned HTTP ${statusCode}. Please check your input and try again.`,
    }
  }

  if (err instanceof Error) {
    return {
      isOffline: false,
      message: err.message,
    }
  }

  return {
    isOffline: false,
    message: 'An unexpected error occurred during threat analysis.',
  }
}
