export const RANGE_START = '2025-10-26'
export const RANGE_END = '2026-10-26'

// Epoch tetap. WIB = UTC+7, jadi 26 Okt 00.00 WIB = 25 Okt 17.00 UTC.
export const STORY_START = Date.UTC(2025, 9, 25, 17, 0, 0)
export const ANNIV_TARGET = Date.UTC(2026, 9, 25, 17, 0, 0)

export const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export const WEEKDAYS_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

const pad = (n) => String(n).padStart(2, '0')

export const keyOf = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

export const formatDateID = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return `${d} ${MONTHS_ID[m - 1]} ${y}`
}

// Tanggal hari ini menurut WIB, format YYYY-MM-DD.
export const todayWIB = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })

// 13 halaman bulanan: Oktober 2025 sampai Oktober 2026.
export function buildMonths() {
  const out = []
  let y = 2025
  let m = 9
  while (!(y === 2026 && m === 10)) {
    out.push(makeMonth(y, m))
    m += 1
    if (m === 12) {
      m = 0
      y += 1
    }
  }
  return out
}

function makeMonth(year, month) {
  const lead = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7 // Senin dulu
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const cells = Array.from({ length: lead }, () => null)
  for (let d = 1; d <= daysInMonth; d += 1) {
    const key = keyOf(year, month, d)
    cells.push({ day: d, key, inRange: key >= RANGE_START && key <= RANGE_END })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return { year, month, label: MONTHS_ID[month], cells }
}

export function breakdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}
