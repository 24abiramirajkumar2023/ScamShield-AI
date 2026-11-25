import { useCallback, useEffect, useState } from 'react'
import type { AnalysisResult, ScanHistoryItem, ScanType } from '../types/threat'

const HISTORY_KEY = 'scamshield_history'
const HISTORY_SYNC_EVENT = 'scamshield-history-updated'
const MAX_HISTORY_ITEMS = 200

function readStoredHistory(): ScanHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as ScanHistoryItem[]) : []
  } catch {
    return []
  }
}

function writeStoredHistory(items: ScanHistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event(HISTORY_SYNC_EVENT))
  } catch {
    // Ignore storage quota errors gracefully
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `scan_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export interface NewScanInput {
  type: ScanType
  input: string
  result: AnalysisResult
}

export const useScanHistory = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => readStoredHistory())

  useEffect(() => {
    const syncHistory = () => {
      setHistory(readStoredHistory())
    }

    window.addEventListener(HISTORY_SYNC_EVENT, syncHistory)
    window.addEventListener('storage', syncHistory)

    return () => {
      window.removeEventListener(HISTORY_SYNC_EVENT, syncHistory)
      window.removeEventListener('storage', syncHistory)
    }
  }, [])

  const addScan = useCallback((scan: NewScanInput): ScanHistoryItem => {
    const newItem: ScanHistoryItem = {
      id: generateId(),
      type: scan.type,
      input: scan.input,
      result: scan.result,
      timestamp: new Date().toISOString(),
    }

    const current = readStoredHistory()
    const updated = [newItem, ...current].slice(0, MAX_HISTORY_ITEMS)
    setHistory(updated)
    writeStoredHistory(updated)
    return newItem
  }, [])

  const deleteScan = useCallback((id: string) => {
    const current = readStoredHistory()
    const updated = current.filter((item) => item.id !== id)
    setHistory(updated)
    writeStoredHistory(updated)
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(HISTORY_KEY)
      window.dispatchEvent(new Event(HISTORY_SYNC_EVENT))
    } catch {
      // Ignore storage errors gracefully
    }
  }, [])

  return { history, addScan, deleteScan, clearHistory }
}
