import React from 'react'

interface StatusBadgeProps {
  label: string
  score?: number
  className?: string
}

export function getSeverityStyles(label: string, score?: number): {
  bg: string
  border: string
  text: string
  dot: string
} {
  const upper = label.toUpperCase()

  if (
    upper.includes('CRITICAL') ||
    (typeof score === 'number' && score > 80)
  ) {
    return {
      bg: 'bg-[#8B0000]/30',
      border: 'border-[#FF3030]',
      text: 'text-[#FF3030]',
      dot: 'bg-[#FF3030]',
    }
  }

  if (
    upper.includes('HIGH') ||
    (typeof score === 'number' && score > 60)
  ) {
    return {
      bg: 'bg-[#FF2020]/20',
      border: 'border-[#FF2020]/70',
      text: 'text-[#FF2020]',
      dot: 'bg-[#FF2020]',
    }
  }

  if (
    upper.includes('MODERATE') ||
    upper.includes('MEDIUM') ||
    (typeof score === 'number' && score > 40)
  ) {
    return {
      bg: 'bg-orange-500/15',
      border: 'border-orange-500/60',
      text: 'text-orange-400',
      dot: 'bg-orange-400',
    }
  }

  if (
    upper.includes('LOW-MODERATE') ||
    upper.includes('CAUTION') ||
    (typeof score === 'number' && score >= 20)
  ) {
    return {
      bg: 'bg-yellow-500/15',
      border: 'border-yellow-500/50',
      text: 'text-yellow-300',
      dot: 'bg-yellow-300',
    }
  }

  return {
    bg: 'bg-white/10',
    border: 'border-white/30',
    text: 'text-white',
    dot: 'bg-white',
  }
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, score, className = '' }) => {
  const styles = getSeverityStyles(label, score)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider ${styles.bg} ${styles.border} ${styles.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {label}
    </span>
  )
}
