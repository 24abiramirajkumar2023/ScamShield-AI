import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

interface LoadingScannerProps {
  title?: string
  subtitle?: string
}

const MATRIX_CHARS = '01ABCDEF#%*XZ94<>/{}[]'

function generateMatrixLines(): string[] {
  const lines: string[] = []
  for (let row = 0; row < 4; row++) {
    let line = ''
    for (let col = 0; col < 44; col++) {
      line += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
    }
    lines.push(line)
  }
  return lines
}

export const LoadingScanner: React.FC<LoadingScannerProps> = ({
  title = 'ANALYZING THREAT...',
  subtitle = 'Running NLP semantic forensics, phishing heuristics, and risk vector scoring',
}) => {
  const [matrixLines, setMatrixLines] = useState<string[]>(() => generateMatrixLines())
  const [progress, setProgress] = useState(14)

  useEffect(() => {
    const matrixTimer = window.setInterval(() => {
      setMatrixLines(generateMatrixLines())
    }, 110)

    const progressTimer = window.setInterval(() => {
      setProgress((prev) => (prev >= 94 ? 22 : prev + Math.floor(Math.random() * 14 + 4)))
    }, 240)

    return () => {
      window.clearInterval(matrixTimer)
      window.clearInterval(progressTimer)
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#FF2020]/50 bg-[#0A0A0A] p-6 sm:p-8 glow-red">
      {/* Animated vertical scan line */}
      <div className="scan-line" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Pulsing Red Shield Icon */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF2020] bg-[#171717] shadow-[0_0_30px_rgba(255,32,32,0.5)]"
        >
          <ShieldAlert className="h-8 w-8 text-[#FF2020]" />
        </motion.div>

        <h3 className="mt-5 font-mono text-lg font-bold tracking-[0.22em] text-[#FF3030] text-glow">
          {title}
        </h3>
        <p className="mt-1.5 max-w-md text-xs text-[#A0A0A0] sm:text-sm">{subtitle}</p>

        {/* Progress Bar */}
        <div className="mt-6 w-full max-w-md">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-[#A0A0A0]">
            <span>DEEP PACKET INSPECTION</span>
            <span className="text-[#FF3030]">{Math.min(progress, 99)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full border border-[#321010] bg-[#111111]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#8B0000] via-[#FF2020] to-[#FF3030]"
              animate={{ width: `${Math.min(progress, 99)}%` }}
              transition={{ duration: 0.2 }}
              style={{ boxShadow: '0 0 12px #FF2020' }}
            />
          </div>
        </div>

        {/* Matrix-style character stream */}
        <div className="mt-6 w-full max-w-lg overflow-hidden rounded-lg border border-[#321010] bg-[#050505] p-3 text-left font-mono text-[11px] leading-5 text-[#FF2020]/70">
          {matrixLines.map((line, index) => (
            <div key={index} className="truncate tracking-widest">
              <span className="mr-2 text-[#8B0000]">0x0{index + 1}&gt;</span>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
