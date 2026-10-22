# Satu Tahun Kita

Kalender satu tahun, 26 Oktober 2025 sampai 26 Oktober 2026, untuk satu orang.
Tiap tanggal bisa diklik dan menampilkan foto plus catatan di header. Di atas ada
hitung mundur ke 26 Oktober 2026 00.00 WIB; saat jam nol muncul layar perayaan
(amplop, surat, bunga, confetti).

Situs statis, tanpa server dan tanpa router. React 19, Vite 8, Tailwind 4.

- Live: https://ghiffahry.github.io/kalender-anniversary/
- Repo: https://github.com/ghiffahry/kalender-anniversary

## Menjalankan

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # hasil di dist/
npm run preview   # cek hasil build di http://localhost:4173
```

## Isi berkas

| Berkas | Isi |
| --- | --- |
| `src/data.js` | Semua teks: nama, ucapan, `MEDIA` (foto per tanggal), fakta, kuis, stiker |
| `src/lib/calendar.js` | Rentang tanggal, epoch WIB, pembuat grid bulan, hitungan mundur |
| `src/App.jsx` | State halaman, tanggal terpilih, panel, pemicu perayaan |
| `src/components/` | Kalender, pager, panel catatan, hitung mundur, perayaan, ilustrasi SVG |
| `public/foto/` | Foto yang tampil di situs, `YYYY-MM-DD.webp` |
| `public/deco/` | Dua gambar stiker Bubu dudu |
| `tools/import-foto.mjs` | Kompres dan beri nama foto sesuai tanggal |
| `src/foto/` | Foto mentah. Tidak ikut repo, hanya bahan importer |

## Mengubah isi

Semua teks ada di `src/data.js`.

- `NAME`: nama yang muncul di surat perayaan. Sekarang masih `Sayang`.
- `GREETING`: judul, subjudul, isi surat, label tombol.
- `MEDIA`: satu kunci per tanggal.
  - `src`: `'foto/2026-05-17.webp'`. Tanpa garis miring di depan, karena situs
    dilayani dari subfolder repo.
  - `caption`: satu baris di header. Kalau kosong, header menulis
    "Kenangan di tanggal ini."
  - `note`: paragraf pendek di bawah caption, opsional.
  - Tanggal tanpa `src` tetap bisa diklik, muncul ilustrasi dan teks
    "Belum ada kenangan di tanggal ini."
- `LOCKED`: tanggal yang ditutup sampai jam nol. Isinya sekarang `2026-10-26`.
  Setelah lewat 26 Oktober 2026, tanggal itu otomatis terbuka sendiri.
- `FACTS`: kartu di tab Fakta kita. Jumlah foto dihitung otomatis dari `MEDIA`.
- `QUIZ`: pertanyaan, pilihan, indeks jawaban benar (mulai dari 0).
- `BUBU_STICKERS`: dua gambar di tab Bubu dudu, berkasnya di `public/deco/`.

Panel Catatan kecil dibuka lewat tiga chip di bawah kalender. Tutupnya lewat
tombol X, tombol "Kembali ke kalender", atau Escape.

## Foto

Importer membaca `src/foto/`, lalu menulis `public/foto/` dalam ukuran maksimal
1280px sisi panjang, kualitas webp 72, dan mencetak potongan `MEDIA` ke layar
serta ke `tools/media-snippet.txt` (berkas ini tidak ikut repo).

```bash
node tools/import-foto.mjs --dry   # lihat rencana saja
node tools/import-foto.mjs         # tulis hasilnya
```

Sumber tanggal dicoba berurutan:

1. EXIF `DateTimeOriginal` atau `CreateDate`.
2. `tools/foto-dates.csv`, format `file,tanggal,caption`.
3. Nama file: `26 Oktober 2025.jpeg`, `2026-02-14.jpg`, `IMG_20260214_101500.jpg`.

Nama yang mengandung "WhatsApp" selalu ditolak, karena jam di nama itu waktu
simpan, bukan waktu foto diambil. HEIC dari iPhone tidak terbaca `sharp` di mesin
ini; ekspor dulu ke JPEG.

Satu tanggal satu foto. Foto kedua di hari yang sama tersimpan sebagai
`YYYY-MM-DD-2.webp` tetapi tidak dipakai kalender.

Foto mentah di `src/foto/` masuk `.gitignore`. Yang naik ke repo hanya hasil
kompres di `public/foto/`, sekarang 47 berkas, 3,83MB. Artinya semua foto itu
bisa diunduh siapa pun yang punya URL situs.

`tools/contact-sheet.mjs` membuat satu lembar kontak berisi semua foto mentah,
berguna untuk memeriksa apakah tanggalnya sudah pas:

```bash
node tools/contact-sheet.mjs sheet.jpg
```

## Waktu dan perayaan

Target perayaan: 26 Oktober 2026 00.00 WIB, ditulis sebagai epoch UTC di
`src/lib/calendar.js` (`ANNIV_TARGET`). Sebelum jam itu hitung mundur berjalan.
Sesudahnya berubah jadi hitungan "sudah bersama".

Layar perayaan muncul sendiri sekali per perangkat, ditandai
`localStorage['satu-tahun-celebrated']`. Untuk menguji tanpa menunggu:

- Buka `?celebrate=1`, misalnya `http://localhost:5173/?celebrate=1`.
- Untuk mengulang uji setelah ditutup, hapus kunci itu di DevTools:
  `localStorage.removeItem('satu-tahun-celebrated')`.

## Deploy

Hosting di GitHub Pages lewat `.github/workflows/deploy.yml`. Setiap push ke
`main` menjalankan build lalu menerbitkan `dist/`.

Setelan sekali pasang: repo > Settings > Pages > Source: **GitHub Actions**.
Jangan pilih "Deploy from a branch".

`vite.config.js` memakai `base: './'`, jadi aman di subfolder repo mana pun.

## Yang belum selesai

- 46 dari 47 tanggal berfoto belum punya caption, jadi hampir semua hanya menampilkan
  "Kenangan di tanggal ini."
- Belum diuji di iPhone Safari, baru Chrome mobile dan desktop.
- Beberapa sumber foto hanya 720x1280 karena kompresi WhatsApp. Yang paling
  lemah 19 Mei 2026 (591x1280).
- Meta `noindex` mencegah mesin pencari mengindeks, bukan mencegah orang membuka.
  Jangan taruh teks yang tidak nyaman dibaca orang lain.

## Catatan lama

Foto mentah punya nama asli, termasuk dua salah tulis yang tidak memengaruhi
hasil: `29 Agusrus 2026.jpeg` dan `10 Januai 2026.jpeg`.
