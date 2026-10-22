// Contact sheet of every photo in src/foto, row-major, same order as file listing.
// Temporary tool, safe to delete.
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
