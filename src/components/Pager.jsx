const Chevron = ({ dir }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
)

const navBtn =
  'flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink/70 transition hover:bg-white disabled:opacity-25'

export default function Pager({ index, total, labels, onPrev, onNext, onJump, className = '' }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button type="button" onClick={onPrev} disabled={index === 0} aria-label="Halaman sebelumnya" className={navBtn}>
        <Chevron dir="left" />
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            aria-label={labels[i] ?? `Halaman ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-4 bg-rose' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={index === total - 1}
        aria-label="Halaman berikutnya"
        className={navBtn}
      >
        <Chevron dir="right" />
      </button>
    </div>
  )
}
