import React from 'react'
import { motion } from 'framer-motion'

interface RiskMeterProps {
  score: number
  riskLevel: string
  size?: number
}

function getRiskColor(score: number): {
  stroke: string
  glow: string
  textClass: string
  label: string
} {
  if (score < 20) {
    return {
      stroke: '#FFFFFF',
      glow: 'rgba(255, 255, 255, 0.35)',
      textClass: 'text-white',
      label: 'LOW / SAFE',
    }
  }
  if (score <= 40) {
    return {
      stroke: '#FACC15',
      glow: 'rgba(250, 204, 21, 0.45)',
      textClass: 'text-yellow-400',
      label: 'GUARDED',
    }
  }
  if (score <= 60) {
    return {
      stroke: '#FB923C',
      glow: 'rgba(251, 146, 60, 0.5)',
      textClass: 'text-orange-400',
      label: 'MODERATE RISK',
    }
  }
  if (score <= 80) {
    return {
      stroke: '#FF2020',
      glow: 'rgba(255, 32, 32, 0.6)',
      textClass: 'text-[#FF2020]',
      label: 'HIGH THREAT',
    }
  }
  return {
    stroke: '#8B0000',
    glow: 'rgba(255, 48, 48, 0.75)',
    textClass: 'text-[#FF3030]',
    label: 'CRITICAL THREAT',
  }
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, riskLevel, size = 180 }) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)))
  const strokeWidth = 12
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (clampedScore / 100) * circumference
  const palette = getRiskColor(clampedScore)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Outer ambient ring */}
        <div
          className="absolute inset-2 rounded-full border border-[#321010] opacity-70"
          style={{
            boxShadow: `0 0 28px ${palette.glow}`,
          }}
        />

        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1F1F1F"
            strokeWidth={strokeWidth}
          />

          {/* Deep red outer highlight when critical */}
          {clampedScore > 80 && (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#FF3030"
              strokeWidth={strokeWidth + 2}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              opacity={0.35}
            />
          )}

          {/* Animated Score Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={palette.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${palette.glow})`,
            }}
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0]">
            RISK INDEX
          </span>
          <motion.span
            key={clampedScore}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`font-mono text-4xl font-extrabold leading-none ${palette.textClass}`}
          >
            {clampedScore}
          </motion.span>
          <span className="mt-1 font-mono text-xs text-[#A0A0A0]">/ 100</span>
        </div>
      </div>

      {/* Risk Level Label */}
      <div className="mt-4 text-center">
        <span
          className={`inline-block rounded-md border border-[#321010] bg-[#171717] px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.16em] ${palette.textClass}`}
        >
          {riskLevel || palette.label}
        </span>
      </div>
    </div>
  )
}
