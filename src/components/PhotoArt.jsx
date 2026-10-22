const PALETTES = [
  ['#FFE3EC', '#FF9EB5', '#C4527A', '#FFF7F0'],
  ['#FFE8C9', '#F6A66B', '#B95B3F', '#FFFAF0'],
  ['#EADCFA', '#B98EDB', '#6C4A8F', '#FBF5FF'],
  ['#D7F0E4', '#7FC8A9', '#2F6D5A', '#F4FBF7'],
  ['#FFDCD1', '#F58A7B', '#A63D57', '#FFF5EF'],
  ['#FFF1B8', '#EFC13F', '#9C6B1E', '#FFFCEF'],
]

export const HEART =
  'M12 21s-8-5.3-10.5-9.6C-.2 8.9 1.6 5 5.4 5c2.2 0 3.7 1.2 4.6 2.5L12 9.6l2-2.1C14.9 6.2 16.4 5 18.6 5c3.8 0 5.6 3.9 3.9 6.4C20 15.7 12 21 12 21z'

const hash = (s) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Ilustrasi dummy deterministik dari seed. Tidak butuh file gambar.
export default function PhotoArt({ seed = 'x', className = '' }) {
  const h = hash(seed)
  const [paper, mid, deep, cream] = PALETTES[h % PALETTES.length]
  const uid = `art${h}`
  const motif = h % 3
  const flecks = Array.from({ length: 7 }, (_, i) => ({
    x: 40 + ((h >>> (i * 3)) % 700),
    y: 40 + ((h >>> (i * 2 + 2)) % 360),
    s: 0.45 + (((h >>> i) % 10) / 10) * 1.05,
    o: 0.3 + (((h >>> (i + 1)) % 10) / 10) * 0.4,
  }))
  const stars = Array.from({ length: 20 }, (_, i) => ({
    x: ((h * (i + 3)) % 780) + 10,
    y: ((h * (i + 7)) % 420) + 10,
    r: 1 + ((h >>> (i % 31)) % 3),
  }))

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}bg`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={paper} />
          <stop offset="100%" stopColor={mid} />
        </linearGradient>
        <radialGradient id={`${uid}glow`} cx="0.5" cy="0.32" r="0.75">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.55 0.55 0.55 0 0"
          />
        </filter>
      </defs>

      <rect width="800" height="600" fill={`url(#${uid}bg)`} />
      {motif === 0 && <Sunset deep={deep} mid={mid} cream={cream} />}
      {motif === 1 && <Bloom deep={deep} mid={mid} cream={cream} />}
      {motif === 2 && <Night deep={deep} mid={mid} cream={cream} stars={stars} />}
      <rect width="800" height="600" fill={`url(#${uid}glow)`} />

      {flecks.map((f, i) => (
        <path
          key={i}
          d={HEART}
          fill={motif === 2 ? cream : deep}
          opacity={f.o}
          transform={`translate(${f.x} ${f.y}) scale(${f.s})`}
        />
      ))}
      <rect width="800" height="600" filter={`url(#${uid}grain)`} opacity="0.1" />
    </svg>
  )
}

function Sunset({ deep, mid, cream }) {
  return (
    <g>
      <circle cx="400" cy="255" r="115" fill={cream} opacity="0.95" />
      <circle cx="400" cy="255" r="155" fill={cream} opacity="0.22" />
      <path d="M0 420 Q 200 350 400 420 T 800 400 L800 600 L0 600 Z" fill={mid} opacity="0.9" />
      <path d="M0 500 Q 230 440 470 500 T 800 470 L800 600 L0 600 Z" fill={deep} opacity="0.8" />
    </g>
  )
}

function Bloom({ deep, mid, cream }) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    return {
      cx: 400 + Math.cos(a) * 78,
      cy: 300 + Math.sin(a) * 78,
      rot: (i / 8) * 360,
    }
  })
  return (
    <g>
      <circle cx="400" cy="300" r="210" fill={cream} opacity="0.35" />
      {petals.map((p, i) => (
        <ellipse
          key={i}
          cx={p.cx}
          cy={p.cy}
          rx="86"
          ry="40"
          fill={mid}
          opacity="0.9"
          transform={`rotate(${p.rot} ${p.cx} ${p.cy})`}
        />
      ))}
      <circle cx="400" cy="300" r="52" fill={cream} />
      <circle cx="400" cy="300" r="26" fill={deep} opacity="0.9" />
    </g>
  )
}

function Night({ deep, mid, cream, stars }) {
  return (
    <g>
      <rect width="800" height="600" fill={deep} opacity="0.92" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={cream} opacity="0.85" />
      ))}
      <circle cx="560" cy="170" r="72" fill={cream} />
      <circle cx="592" cy="148" r="62" fill={deep} />
      <path d="M0 470 Q 250 400 500 470 T 800 450 L800 600 L0 600 Z" fill={mid} opacity="0.55" />
    </g>
  )
}
