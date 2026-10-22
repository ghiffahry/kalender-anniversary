// Import foto: kompres, kecilkan, dan beri nama sesuai tanggal ambil.
//
// Tanggal diambil dari EXIF DateTimeOriginal. Kalau tidak ada, dari tools/foto-dates.csv,
// lalu dari tanggal di nama file (mis. "26 Oktober 2025.jpeg" atau IMG_20260214_101500.jpg).
// Nama yang mengandung "WhatsApp" ditolak, karena itu waktu simpan, bukan waktu foto.
//
// Pakai:
//   node tools/import-foto.mjs --dry   lihat rencananya saja
//   node tools/import-foto.mjs         tulis ke public/foto + tools/media-snippet.txt
//
// Hasil: public/foto/YYYY-MM-DD.webp (foto kedua di hari yang sama jadi -2, -3, ...).
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import exifr from 'exifr'
import sharp from 'sharp'

const IN = 'src/foto'
const OUT = 'public/foto'
const CSV = 'tools/foto-dates.csv'
const SNIPPET = 'tools/media-snippet.txt'
const RANGE = ['2025-10-26', '2026-10-26']
const MAX = 1280
const QUALITY = 72

const dry = process.argv.includes('--dry')
const pad = (n) => String(n).padStart(2, '0')
const dstr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const kb = (n) => `${Math.round(n / 1024)}KB`
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.heif'])
const HEIC = new Set(['.heic', '.heif'])

// exifr tanpa reviveValues memberi string '2026:03:15 10:20:30', dengan reviveValues
// memberi Date. Terima dua-duanya.
const fromTag = (t) => {
  if (t instanceof Date && !Number.isNaN(+t)) return dstr(t)
  if (typeof t === 'string') {
    const m = t.match(/^(\d{4})[:\-](\d{2})[:\-](\d{2})/)
    if (m) return `${m[1]}-${m[2]}-${m[3]}`
  }
  return null
}

// Sebagian kamera menaruh tanggal di nama file, mis. IMG_20260214_101500.jpg.
// Ketat: harus di awal nama (boleh setelah prefiks kamera) dan tidak boleh
// mengandung "WhatsApp", karena WhatsApp memberi nama file dengan waktu simpan,
// bukan waktu foto diambil.
const PREFIX = /^(?:IMG|VID|PXL|MVIMG|Screenshot|Signal|SIGNAL|Photo|photo|DSC)[-_ ]+/
const MONTHS = {
  jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7,
  agu: 8, ags: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12,
}
const monthNum = (word) => MONTHS[word.slice(0, 3).toLowerCase()] ?? null
const validDate = (y, mo, d) => {
  if (!mo || mo < 1 || mo > 12 || d < 1 || d > 31) return null
  const probe = new Date(Date.UTC(y, mo - 1, d))
  if (probe.getUTCMonth() + 1 !== mo || probe.getUTCDate() !== d) return null
  return `${y}-${pad(mo)}-${pad(d)}`
}
const fromName = (name) => {
  let base = name.replace(/\.[^.]+$/, '')
  if (/whatsapp/i.test(base)) return null
  base = base.replace(/[\s_-]*\(\d+\)$/, '').replace(/[-_ ]*copy$/i, '')
  const s = base.replace(PREFIX, '')

  // 20260214, 2026-02-14, 2026_02_14
  let m = s.match(/^(\d{4})[-_]?(\d{2})[-_]?(\d{2})(?!\d)/)
  if (m) return validDate(+m[1], +m[2], +m[3])

  // 26 Oktober 2025, 8 Nov 2025, 26-oktober-2025, 15Mei 2026
  m = s.match(/^(\d{1,2})[\s\-_.]*([A-Za-z]{3,})[\s\-_.]*(\d{4})\b/)
  if (m) return validDate(+m[3], monthNum(m[2]), +m[1])

  return null
}

// CSV: file,tanggal,caption (pemisah koma atau titik koma, caption boleh kosong)
const mapping = {}
try {
  const raw = await readFile(CSV, 'utf8')
  for (const line of raw.split(/\r?\n/).slice(1)) {
    if (!line.trim()) continue
    const [file, date, ...rest] = line.split(/[;,]/).map((c) => c.trim())
    if (file && /^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
      mapping[file] = { date, caption: rest.join(',').trim() }
    }
  }
} catch {
  // CSV belum ada, jalan mode EXIF saja
}

const files = (await readdir(IN))
  .filter((f) => EXT.has(path.extname(f).toLowerCase()) && !f.startsWith('_'))
  .sort()
const seen = new Map()
const plan = []
const noDate = []
const badFormat = []

for (const f of files) {
  if (HEIC.has(path.extname(f).toLowerCase())) {
    badFormat.push(f)
    continue
  }
  let date = null
  let source = ''
  try {
    const ex = await exifr.parse(path.join(IN, f), { exif: true, tiff: true, reviveValues: false })
    date = fromTag(ex?.DateTimeOriginal ?? ex?.CreateDate ?? ex?.DateTime)
    if (date) source = 'exif'
  } catch {
    // EXIF rusak atau tidak ada, lanjut ke sumber berikutnya
  }
  const m = mapping[f]
  if (!date && m) {
    date = m.date
    source = 'csv'
  }
  if (!date) {
    const n = fromName(f)
    if (n) {
      date = n
      source = 'nama file'
    }
  }
  if (!date) {
    noDate.push(f)
    continue
  }
  const n = (seen.get(date) ?? 0) + 1
  seen.set(date, n)
  plan.push({ f, date, source, n, caption: m?.caption ?? '', out: `${date}${n > 1 ? `-${n}` : ''}.webp` })
}

console.table(
  plan.map((p) => ({ file: p.f, tanggal: p.date, dari: p.source, nama: p.out, caption: p.caption })),
)

const outside = plan.filter((p) => p.date < RANGE[0] || p.date > RANGE[1])
if (outside.length) {
  console.log(`\nDi luar rentang ${RANGE[0]}..${RANGE[1]}, tidak punya kotak di kalender:`)
  for (const p of outside) console.log(`  ${p.out} (${p.date})`)
}
if (noDate.length) {
  console.log(`\nBelum punya tanggal, tidak diproses (${noDate.length}):`)
  for (const f of noDate) console.log(`  ${f}`)
}
if (badFormat.length) {
  console.log(`\nHEIC tidak bisa dibaca di mesin ini (${badFormat.length}), ekspor dulu ke JPEG:`)
  for (const f of badFormat) console.log(`  ${f}`)
}

if (dry) {
  console.log('\n--dry: tidak ada file yang ditulis.')
  process.exit(0)
}

await mkdir(OUT, { recursive: true })
const failed = []
for (const p of plan) {
  try {
    const before = (await readFile(path.join(IN, p.f))).length
    const buf = await sharp(path.join(IN, p.f))
      .rotate() // hormati orientasi kamera
      .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer()
    await writeFile(path.join(OUT, p.out), buf)
    p.before = before
    p.after = buf.length
  } catch (e) {
    failed.push(`${p.f}: ${e.message}`)
    p.dead = true
  }
}
const done = plan.filter((p) => !p.dead)
if (failed.length) {
  console.log(`\nGagal diproses (${failed.length}):`)
  for (const f of failed) console.log(`  ${f}`)
}

const first = new Map()
for (const p of done) if (p.n === 1) first.set(p.date, p)

const inRange = (d) => d >= RANGE[0] && d <= RANGE[1]
const lines = [...first.values()]
  .filter((p) => inRange(p.date))
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((p) => `  '${p.date}': { ${p.caption ? `caption: '${p.caption.replace(/'/g, "\\'")}', ` : ''}src: 'foto/${p.out}' },`)

await writeFile(SNIPPET, `${lines.join('\n')}\n`)

const extra = done.filter((p) => p.n > 1 || !inRange(p.date))
if (extra.length) {
  console.log('\nDisimpan tapi tidak dipakai kalender (1 foto per tanggal, di luar rentang dibuang):')
  for (const p of extra) console.log(`  ${p.out}${p.n > 1 ? ' (foto ke-' + p.n + ' di hari itu)' : ' (di luar rentang)'}`)
}

const sumIn = done.reduce((a, p) => a + p.before, 0)
const sumOut = done.reduce((a, p) => a + p.after, 0)
console.log(`\n${done.length} foto diproses, ${kb(sumIn)} -> ${kb(sumOut)}.`)
console.log(`Snippet MEDIA ditulis ke ${SNIPPET}:`)
console.log(lines.join('\n'))
