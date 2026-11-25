/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#050505',
        'bg-secondary': '#0A0A0A',
        'card': '#111111',
        'card-elevated': '#171717',
        'accent': '#FF2020',
        'accent-neon': '#FF3030',
        'accent-deep': '#8B0000',
        'border-red': '#321010',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'scan': 'scan 2s linear infinite',
        'pulse-red': 'pulse-red 2s ease-in-out infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 5px #FF2020' },
          '50%': { boxShadow: '0 0 20px #FF2020, 0 0 40px #FF2020' },
        },
        glow: {
          from: { textShadow: '0 0 5px #FF2020' },
          to: { textShadow: '0 0 20px #FF2020, 0 0 30px #FF3030' },
        },
      },
    },
  },
  plugins: [],
}
