import { useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { STORY_START, breakdown } from '../lib/calendar'
import { GREETING, NAME } from '../data'
import { HEART } from './PhotoArt'

const COLORS = ['#E85D75', '#F2B337', '#B98EDB', '#7FC8A9', '#FF8FA3', '#FFD166']

export default function Celebration({ now, onClose }) {
  const [opened, setOpened] = useState(false)
  const days = breakdown(now - STORY_START).days

  useEffect(() => {
    if (!opened) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const fire = (x, angle) =>
      confetti({
        particleCount: 70,
        spread: 75,
        angle,
        origin: { x, y: 0.72 },
        colors: COLORS,
        scalar: 0.9,
      })
    const timers = [
      setTimeout(() => fire(0.18, 60), 200),
      setTimeout(() => fire(0.82, 120), 500),
      setTimeout(() => fire(0.5, 90), 900),
    ]
    return () => {
      timers.forEach(clearTimeout)
      confetti.reset()
    }
  }, [opened])

  const petals = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: (i * 6.3 + 3) % 100,
        delay: (i * 0.7) % 6,
        dur: 7 + (i % 5),
        size: 8 + (i % 4) * 4,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2A1520]/95 backdrop-blur-md">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {petals.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        {!opened ? (
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="group flex flex-col items-center gap-7 focus:outline-none"
            aria-label="Buka surat"
          >
            <Envelope className="h-36 w-52 drop-shadow-2xl transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-44 sm:w-64" />
            <span className="animate-pulse rounded-full border border-cream/25 px-4 py-1.5 text-xs text-cream/80">
              Ketuk untuk membuka
            </span>
          </button>
        ) : (
          <div className="animate-letter flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] border border-white/15 bg-[#3A2030]/70 px-6 py-8 backdrop-blur">
            <Bouquet className="h-28 w-28 sm:h-32 sm:w-32" />
            <div>
              <p className="font-display text-4xl italic text-cream sm:text-5xl">{GREETING.title}</p>
              <p className="mt-3 text-[9px] uppercase tracking-[0.22em] text-[#FFB3C2]">{GREETING.subtitle}</p>
            </div>
            <p className="text-sm leading-relaxed text-cream/80">{GREETING.body}</p>
            <p className="rounded-full border border-cream/20 px-4 py-1.5 text-xs text-cream/90">
              {NAME}, sudah {days} hari sejak hari pertama.
            </p>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="rounded-full bg-rose px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose/30 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              {GREETING.button}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Envelope({ className }) {
  return (
    <svg viewBox="0 0 240 170" className={className} aria-hidden="true">
      <rect x="12" y="34" width="216" height="126" rx="14" fill="#FFF3E4" stroke="#E8B4C4" strokeWidth="3" />
      <path d="M12 48 L120 122 L228 48" fill="none" stroke="#E8B4C4" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 40 Q 120 6 226 40" fill="none" stroke="#E8B4C4" strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="118" r="21" fill="#E85D75" />
      <path d={HEART} fill="#FFF3E4" transform="translate(108 106)" />
    </svg>
  )
}

function Bouquet({ className }) {
  const blooms = [
    { x: 100, y: 66, r: 34, c: '#F2B337' },
    { x: 58, y: 118, r: 27, c: '#E85D75' },
    { x: 142, y: 118, r: 27, c: '#B98EDB' },
    { x: 100, y: 148, r: 25, c: '#FF8FA3' },
    { x: 26, y: 88, r: 19, c: '#7FC8A9' },
    { x: 174, y: 88, r: 19, c: '#FF8FA3' },
  ]
  return (
    <svg viewBox="0 0 200 230" className={className} aria-hidden="true">
      <g stroke="#7FC8A9" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M100 212 C 100 150, 100 120, 100 92" />
        <path d="M100 212 C 92 170, 74 150, 62 122" />
        <path d="M100 212 C 108 170, 128 150, 140 122" />
        <path d="M100 212 C 96 180, 62 158, 32 92" />
        <path d="M100 212 C 104 180, 140 158, 170 92" />
      </g>
      <ellipse cx="52" cy="156" rx="20" ry="9" fill="#7FC8A9" transform="rotate(-32 52 156)" />
      <ellipse cx="148" cy="156" rx="20" ry="9" fill="#7FC8A9" transform="rotate(32 148 156)" />
      {blooms.map((b, i) => (
        <g key={i}>
          {Array.from({ length: 6 }, (_, j) => {
            const a = (j / 6) * Math.PI * 2
            const px = b.x + Math.cos(a) * (b.r * 0.52)
            const py = b.y + Math.sin(a) * (b.r * 0.52)
            return (
              <ellipse
                key={j}
                cx={px}
                cy={py}
                rx={b.r * 0.44}
                ry={b.r * 0.3}
                fill={b.c}
                opacity="0.92"
                transform={`rotate(${(j / 6) * 360} ${px} ${py})`}
              />
            )
          })}
          <circle cx={b.x} cy={b.y} r={b.r * 0.3} fill="#FFF3D6" />
        </g>
      ))}
      <path d="M72 204 Q 100 224 128 204 L 122 220 Q 100 234 78 220 Z" fill="#E85D75" />
    </svg>
  )
}
