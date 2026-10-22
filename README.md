# Web Kalender: Satu Tahun Kita

Website hadiah ulang tahun ke-1, rentang 26 Oktober 2025 sampai 26 Oktober 2026.
Kalender penuh layar, tiap tanggal bisa diklik dan menampilkan kenangan di header.
Ada hitung mundur ke 26 Oktober 2026 00.00 WIB, dan saat jam nol muncul layar
perayaan (bunga, confetti, ucapan).

Stack: React 19 + Vite + Tailwind 4. Tanpa server, tanpa router, hasil build statis
siap untuk GitHub Pages.

## Jalankan

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Uji tampilan perayaan kapan saja

Buka dengan query `?celebrate=1`, misalnya `http://localhost:5173/?celebrate=1`.
Saat asli, layar perayaan muncul sendiri begitu melewati 26 Okt 2026 00.00 WIB,
sekali per perangkat (disimpan di localStorage).

## Yang perlu diganti sebelum dikirim

Semua di `src/data.js`:

- `NAME`: nama penerima.
- `GREETING`: judul, subjudul, isi pesan, label tombol.
- `MEDIA`: caption dan kenangan per tanggal.
  - `caption`: satu baris, tampil di header.
  - `note`: paragraf surat pendek, muncul saat tanggal dipilih. Contoh sudah ada di 3 tanggal.
  - `src`: foto asli, contoh `'2025-10-26': { caption: '...', src: 'foto/2025-10-26.jpg' }`.
    Foto ditaruh di folder `public/`, tulis `foto/nama-file.jpg` tanpa garis miring di depan
    supaya path tetap benar di GitHub Pages.
    Selama `src` kosong, tampil ilustrasi dummy otomatis.
- `LOCKED` dan `LOCKED_LABEL`: tanggal yang dibungkus sampai jam nol. Default 26 Oktober 2026.
- `FACTS`: kartu fakta kecil di halaman Catatan kecil.
- `QUIZ`: pertanyaan, pilihan, indeks jawaban benar.
- `BUBU_STICKERS`: stiker dan keterangannya.

Halaman "Catatan kecil" bukan bagian deretan bulan. Pintu masuknya tiga chip di bawah
kalender: Fakta kita, Masih ingat?, dan Bubu dudu. Chip langsung membuka panel
di tab itu, tombol X atau "Kembali ke kalender" untuk menutup. Tombol Escape juga menutup.

Tab Bubu dudu berisi dua stiker dari berkas gambarmu sendiri (versi jalan-jalan dan
bisik-bisik). Berkas taruh di `public/deco/`, lalu daftarkan di `BUBU_STICKERS`.

Tanggal yang belum ada di `MEDIA` tetap bisa diklik, hanya muncul teks
"Belum ada kenangan di tanggal ini."

## Foto asli

Alur cepat:

1. Taruh file foto di `src/foto/`. Nama file sebaiknya mengandung tanggal, mis.
   `26 Oktober 2025.jpeg`, `IMG_20260214_101500.jpg`, atau `2026-02-14.jpg`.
2. `node tools/import-foto.mjs` (tambah `--dry` untuk lihat rencana saja).
   Hasil: `public/foto/YYYY-MM-DD.webp`, maks 1280px pada sisi panjang, kualitas 72,
   plus `tools/media-snippet.txt`.
3. Tempel isi snippet ke `MEDIA` di `src/data.js`.

Urutan sumber tanggal: EXIF `DateTimeOriginal`, lalu `tools/foto-dates.csv`, lalu nama file.
Nama yang mengandung "WhatsApp" selalu ditolak, karena itu waktu simpan, bukan waktu foto.
Kalau semua nama file sudah mengandung tanggal, CSV tidak perlu diisi.

Satu tanggal satu foto. Foto kedua di hari yang sama ikut tersimpan sebagai `YYYY-MM-DD-2.webp`
tapi belum dipakai kalender, karena `MEDIA` satu entri per tanggal.

HEIC dari iPhone tidak bisa dibaca sharp di mesin ini. Ekspor dulu ke JPEG.

`src/foto/` sudah masuk `.gitignore`, jadi yang ikut ke repo hanya hasil kompres di `public/foto/`.
Kalau mau foto mentahnya ikut tersimpan di GitHub, hapus baris itu dari `.gitignore`.

## Deploy ke GitHub Pages

Repo sudah menyertakan `.github/workflows/deploy.yml`.

1. Buat repo publik (tunggu sampai hari kirim supaya tidak jadi spoiler).
2. Push ke branch `main`.
3. Di GitHub: Settings > Pages > Source: GitHub Actions.
4. Selesai. URL berbentuk `https://username.github.io/nama-repo/`.

`vite.config.js` memakai `base: './'` sehingga aman di subfolder repo mana pun.

## Catatan privasi

Repo publik berarti kode dan isinya publik ke siapa pun yang punya link.
Sudah dipasang meta `noindex` agar tidak diindeks mesin pencari, tapi itu bukan
kunci. Jangan taruh teks atau file yang tidak nyaman dibaca orang lain.
