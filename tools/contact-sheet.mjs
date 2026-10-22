// Membuat satu lembar kontak berisi semua foto di src/foto, urut nama berkas.
// Dipakai untuk memeriksa apakah pembagian tanggal per foto sudah benar.
// Gagal kalau ada HEIC di folder itu; pindahkan dulu berkasnya.
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const dir = path.resolve('src/foto')
const out = process.argv[2] ?? 'sheet.jpg'
const files = (await readdir(dir)).sort()
const CELL = 260
const GAP = 8
const COLS = 5
const rows = Math.ceil(files.length / COLS)

const tiles = await Promise.all(
  files.map(async (f, i) => {
    const img = await sharp(path.join(dir, f))
      .resize(CELL, CELL, { fit: 'inside', background: { r: 20, g: 20, b: 20 } })
      .flatten({ background: { r: 20, g: 20, b: 20 } })
      .jpeg({ quality: 80 })
      .toBuffer()
    return {
      input: img,
      left: (i % COLS) * (CELL + GAP),
      top: Math.floor(i / COLS) * (CELL + GAP),
    }
  }),
)

await sharp({
  create: {
    width: COLS * (CELL + GAP),
    height: rows * (CELL + GAP),
    channels: 3,
    background: { r: 20, g: 20, b: 20 },
  },
})
  .composite(tiles)
  .jpeg({ quality: 82 })
  .toFile(out)

console.log(`wrote ${out} (${files.length} tiles, row-major)`)
console.log(files.map((f, i) => `${i + 1}. ${f}`).join('\n'))
