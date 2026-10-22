import { useState } from 'react'
import PhotoArt from './PhotoArt'
import { NOTE_TABS } from './NotesPanel'
import Pager from './Pager'
import { WEEKDAYS_ID, formatDateID } from '../lib/calendar'
import { LOCKED_LABEL, mediaOf } from '../data'

const ShuffleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
)

export default function CalendarCard({
  month,
  months,
  total,
  labels,
  index,
  selected,
  lockedKeys,
  onSelect,
  onPrev,
  onNext,
  onJump,
  onRandom,
  onOpenNote,
  today,
}) {
  const [preview, setPreview] = useState(null)
  const active = preview ?? selected
  const media = active ? mediaOf(active) : null
  const isLocked = active ? lockedKeys.has(active) : false
  const artKey = active ?? `${month.year}-${month.month}`

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_30px_60px_-25px_rgba(120,60,90,0.35)] backdrop-blur">
      <div className="relative h-[30vh] max-h-[260px] min-h-[170px] overflow-hidden">
        <div key={artKey} className="animate-in h-full w-full">
          {media?.src && !isLocked ? (
            <img src={media.src} alt={media.caption ?? formatDateID(active)} className="h-full w-full object-cover" />
          ) : (
            <PhotoArt seed={isLocked ? `locked-${artKey}` : artKey} className="h-full w-full" />
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/75 px-3 py-2 backdrop-blur">
          {active ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose">{formatDateID(active)}</p>
              <p className="text-[13px] text-ink/80">
                {isLocked
                  ? LOCKED_LABEL
                  : media
                    ? (media.caption ?? 'Kenangan di tanggal ini.')
                    : 'Belum ada kenangan di tanggal ini.'}
              </p>
              {!isLocked && media?.note && (
                <p className="mt-1 border-t border-ink/10 pt-1 text-[12px] leading-relaxed text-ink/60">{media.note}</p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/60">
                Ketuk tanggal, buka kenangan
              </p>
              <p className="text-[10px] text-ink/40">
                {index + 1}/{total}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 sm:px-6">
        <div className="flex items-end justify-between">
          <h1 className="font-display text-3xl text-ink sm:text-4xl">{month.label}</h1>
          <p className="pb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">{month.year}</p>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS_ID.map((d, i) => (
            <span
              key={d}
              className={`text-[10px] font-semibold uppercase tracking-wider ${i === 6 ? 'text-rose' : 'text-ink/40'}`}
            >
              {d}
            </span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {month.cells.map((cell, i) => {
            if (!cell) return <span key={`e${i}`} />
            if (!cell.inRange) {
              return (
                <span key={cell.key} className="flex h-9 items-center justify-center text-[12px] text-ink/15 sm:h-10">
                  {cell.day}
                </span>
              )
            }
            const isSelected = selected === cell.key
            const has = Boolean(mediaOf(cell.key))
            const locked = lockedKeys.has(cell.key)
            const sunday = i % 7 === 6
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => onSelect(isSelected ? null : cell.key)}
                onMouseEnter={() => {
                  if ((has || locked) && !isSelected) setPreview(cell.key)
                }}
                onMouseLeave={() => setPreview(null)}
                aria-pressed={isSelected}
                aria-label={`${formatDateID(cell.key)}${has ? ', ada kenangan' : ''}${locked ? ', masih terbungkus' : ''}`}
                className={[
                  'relative flex h-9 items-center justify-center rounded-full text-[13px] transition duration-200 sm:h-10',
                  isSelected
                    ? 'animate-pop bg-rose font-semibold text-white shadow-lg shadow-rose/30'
                    : has || locked
                      ? 'font-semibold text-ink hover:bg-blush/70'
                      : 'text-ink/70 hover:bg-blush/50',
                  !isSelected && sunday ? 'text-rose' : '',
                  today === cell.key && !isSelected ? 'ring-1 ring-rose/60' : '',
                ].join(' ')}
              >
                {cell.day}
                {locked && <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full border border-rose" />}
                {has && !locked && (
                  <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-rose'}`} />
                )}
              </button>
            )
          })}
        </div>

        <Pager index={index} total={total} labels={labels} onPrev={onPrev} onNext={onNext} onJump={onJump} className="mt-4" />

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={onRandom}
            className="flex items-center gap-2 rounded-full border border-rose/30 bg-white/70 px-4 py-1.5 text-[11px] font-semibold text-rose transition hover:bg-rose/10"
          >
            <ShuffleIcon />
            Kenangan acak
          </button>
        </div>

        <div className="mt-3 flex flex-col items-center gap-2">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-ink/40">Catatan kecil</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {NOTE_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onOpenNote(t.id)}
                className="rounded-full bg-blush/60 px-3.5 py-1.5 text-[11px] font-semibold text-ink/75 transition hover:bg-blush hover:text-ink"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
