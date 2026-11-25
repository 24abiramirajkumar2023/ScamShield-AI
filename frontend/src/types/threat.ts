export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface ThreatSignal {
  name: string
  severity: SeverityLevel | string
  explanation: string
  matched_phrase?: string
  matched_pattern?: string
}

export interface AnalysisResult {
  score: number
  risk_level: string
  category: string
  summary: string
  signals: ThreatSignal[]
  highlighted_phrases: string[]
  explanations: string[]
  recommendations: string[]
  confidence: number
  url?: string
  domain?: string
  scheme?: string
  is_shortened?: boolean
  has_ip_address?: boolean
  uses_https?: boolean
  suspicious_tld?: boolean
  indicators?: string[]
  analyzed_at?: string
}

export type ScanType = 'message' | 'url'

export interface ScanHistoryItem {
  id: string
  type: ScanType
  input: string
  result: AnalysisResult
  timestamp: string
}

export interface HealthResponse {
  status: string
  version?: string
  service?: string
  uptime?: number | string
  timestamp?: string
}

export interface StatsResponse {
  total_analyses: number
  message_analyses: number
  url_analyses: number
  threats_detected: number
  high_risk_detected: number
  safe_count: number
  average_score: number
  category_breakdown?: Record<string, number>
  risk_level_breakdown?: Record<string, number>
  uptime_seconds?: number
}

export interface ApiErrorInfo {
  message: string
  isOffline: boolean
  statusCode?: number
}
