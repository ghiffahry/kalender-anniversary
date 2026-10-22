import PhotoArt from './PhotoArt'
import { useState } from 'react'
import { STORY_START, breakdown } from '../lib/calendar'
import { BUBU_STICKERS, FACTS, QUIZ } from '../data'

export const NOTE_TABS = [
  { id: 'fakta', label: 'Fakta kita' },
  { id: 'kuis', label: 'Masih ingat?' },
  { id: 'bubu', label: 'Bubu dudu' },
]

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export default function NotesPanel({ tab, onChangeTab, onClose, now }) {
  const days = breakdown(now - STORY_START).days

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_30px_60px_-25px_rgba(120,60,90,0.35)] backdrop-blur">
      <div className="relative h-[24vh] max-h-[200px] min-h-[140px] overflow-hidden">
        <div className="animate-in h-full w-full">
          <PhotoArt seed="catatan-kecil" className="h-full w-full" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup catatan kecil"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ink/70 shadow-md backdrop-blur transition hover:bg-white"
        >
          <XIcon />
        </button>
        <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/75 px-3 py-2 backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose">Catatan kecil</p>
          <p className="text-[13px] text-ink/80">Sedikit hal tentang kita, di luar kalender.</p>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 sm:px-6">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Catatan kecil</h2>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {NOTE_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChangeTab(t.id)}
              aria-pressed={tab === t.id}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                tab === t.id ? 'bg-rose text-white shadow' : 'bg-blush/50 text-ink/70 hover:bg-blush'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'fakta' && <Facts days={days} />}
          {tab === 'kuis' && <QuizPanel />}
          {tab === 'bubu' && <BubuPanel />}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-full border border-ink/10 bg-white/70 py-2 text-[12px] font-semibold text-ink/70 transition hover:bg-white"
        >
          Kembali ke kalender
        </button>
      </div>
    </section>
  )
}

// Nilai panjang dikecilkan supaya tetap muat rapi di kartu selebar setengah layar.
const valueSize = (v) => {
  const n = String(v).length
  if (n <= 6) return 'text-2xl'
  if (n <= 12) return 'text-xl'
  if (n <= 15) return 'text-base'
  return 'text-sm'
}

function Facts({ days }) {
  const items = [{ label: 'Hari bersama', value: days }, ...FACTS]
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((f, i) => (
        <div
          key={i}
          className="flex min-h-[84px] flex-col justify-between rounded-2xl border border-ink/5 bg-white/70 p-3"
        >
          <p className={`font-display leading-tight break-words text-rose ${valueSize(f.value)}`}>
            {f.value}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-ink/60">{f.label}</p>
        </div>
      ))}
    </div>
  )
}

function QuizPanel() {
  const [picked, setPicked] = useState({})

  return (
    <div className="space-y-3">
      {QUIZ.map((item, qi) => {
        const chosen = picked[qi]
        return (
          <div key={qi} className="rounded-2xl border border-ink/5 bg-white/70 p-3">
            <p className="text-[13px] font-semibold text-ink">
              {qi + 1}. {item.q}
            </p>
            <div className="mt-2 space-y-1.5">
              {item.options.map((opt, oi) => {
                const isAnswer = oi === item.answer
                const state =
                  chosen == null
                    ? 'border-ink/10 hover:border-rose/40 hover:bg-rose/5'
                    : isAnswer
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : chosen === oi
                        ? 'border-rose/40 bg-rose/10 text-ink/80'
                        : 'border-ink/10 opacity-50'
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={chosen != null}
                    onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                    className={`w-full rounded-xl border px-3 py-1.5 text-left text-[12px] transition ${state}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {chosen != null && (
              <p className="mt-2 text-[11px] text-ink/50">
                {chosen === item.answer ? 'Betul, masih ingat.' : 'Bukan itu, tapi tidak apa-apa.'}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function BubuPanel() {
  return (
    <div className="space-y-4">
      {BUBU_STICKERS.map((s) => (
        <div key={s.id} className="rounded-2xl border border-ink/5 bg-white/70 p-4 text-center">
          <div className="flex min-h-[130px] items-center justify-center">
            <img src={s.src} alt={s.label} className="max-h-[150px]" />
          </div>
          <p className="mt-2 font-display text-[15px] italic text-ink/80">{s.label}</p>
          <p className="mt-1 text-[11px] text-ink/55">{s.note}</p>
        </div>
      ))}
    </div>
  )
}
