import { ANNIV_TARGET, STORY_START, breakdown } from '../lib/calendar'

const Cell = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="font-display text-base leading-none text-ink tabular-nums sm:text-lg">
      {String(value).padStart(2, '0')}
    </span>
    <span className="mt-0.5 text-[8px] uppercase tracking-[0.18em] text-ink/45">{label}</span>
  </div>
)

export default function Countdown({ now }) {
  const before = now < ANNIV_TARGET
  const t = breakdown(before ? ANNIV_TARGET - now : now - STORY_START)

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/70 px-3.5 py-1.5 shadow-sm backdrop-blur">
      <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-rose">
        {before ? 'Menuju 26 Okt 2026 WIB' : 'Sudah bersama'}
      </span>
      <div className="flex items-center gap-2">
        <Cell value={t.days} label="hari" />
        <Cell value={t.hours} label="jam" />
        <Cell value={t.minutes} label="menit" />
        <Cell value={t.seconds} label="detik" />
      </div>
    </div>
  )
}
