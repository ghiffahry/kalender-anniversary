import { useEffect, useMemo, useRef, useState } from 'react'
import CalendarCard from './components/CalendarCard'
import NotesPanel from './components/NotesPanel'
import Countdown from './components/Countdown'
import Celebration from './components/Celebration'
import { ANNIV_TARGET, buildMonths, todayWIB } from './lib/calendar'
import { LOCKED, MEDIA, SITE_TITLE } from './data'

const CELEBRATED_KEY = 'satu-tahun-celebrated'
const NONE = new Set()

export default function App() {
  const months = useMemo(buildMonths, [])
  const labels = useMemo(() => months.map((m) => `Ke ${m.label} ${m.year}`), [months])
  const today = useMemo(todayWIB, [])
  const [index, setIndex] = useState(() => {
    const found = months.findIndex((m) => m.cells.some((c) => c?.key === today))
    return found === -1 ? months.length - 1 : found
  })
  const [selected, setSelected] = useState(null)
  const [panel, setPanel] = useState(null)
  const [now, setNow] = useState(() => Date.now())
  const [celebrate, setCelebrate] = useState(
    () => new URLSearchParams(window.location.search).has('celebrate'),
  )
  const touchX = useRef(null)

  const total = months.length
  const lockedNow = now < ANNIV_TARGET
  const lockedKeys = useMemo(() => (lockedNow ? new Set(LOCKED) : NONE), [lockedNow])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Perayaan muncul sendiri saat jam nol, sekali per perangkat.
  // Untuk uji tampilan kapan saja: buka ?celebrate=1
  useEffect(() => {
    if (celebrate || now < ANNIV_TARGET) return
    if (!localStorage.getItem(CELEBRATED_KEY)) setCelebrate(true)
  }, [now, celebrate])

  const closeCelebration = () => {
    if (now >= ANNIV_TARGET) localStorage.setItem(CELEBRATED_KEY, '1')
    setCelebrate(false)
  }

  const go = (dir) => {
    if (panel) return
    setSelected(null)
    setIndex((i) => Math.min(total - 1, Math.max(0, i + dir)))
  }

  const jump = (i) => {
    setSelected(null)
    setIndex(i)
  }

  // Lompat ke satu tanggal yang punya kenangan, acak.
  const randomMemory = () => {
    const pool = Object.keys(MEDIA).filter((k) => !(lockedNow && LOCKED.includes(k)))
    if (!pool.length) return
    const key = pool[Math.floor(Math.random() * pool.length)]
    const i = months.findIndex((m) => m.cells.some((c) => c?.key === key))
    if (i === -1) return
    setIndex(i)
    setSelected(key)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setPanel(null)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [total, panel])

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-5 sm:py-8">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-rose/25 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-[#B98EDB]/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-[#F2B337]/25 blur-3xl" />
      </div>

      <header className="mb-3 flex w-full max-w-md flex-col items-center gap-2 sm:mb-5">
        <p className="font-display text-lg italic text-ink/80">{SITE_TITLE}</p>
        <Countdown now={now} />
      </header>

      <main
        className="w-full max-w-md touch-pan-y"
        onTouchStart={(e) => {
          if (panel) return
          touchX.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (panel || touchX.current == null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 55) go(dx > 0 ? -1 : 1)
          touchX.current = null
        }}
      >
        {panel ? (
          <NotesPanel tab={panel} onChangeTab={setPanel} onClose={() => setPanel(null)} now={now} />
        ) : (
          <CalendarCard
            month={months[index]}
            total={total}
            labels={labels}
            index={index}
            selected={selected}
            lockedKeys={lockedKeys}
            onSelect={setSelected}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            onJump={jump}
            onRandom={randomMemory}
            onOpenNote={setPanel}
            today={today}
          />
        )}
      </main>

      <footer className="mt-4 text-[9px] uppercase tracking-[0.32em] text-ink/35">
        sejak 26 Oktober 2025
      </footer>

      {celebrate && <Celebration now={now} onClose={closeCelebration} />}
    </div>
  )
}
