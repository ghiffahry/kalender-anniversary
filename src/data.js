// Semua teks diatur di file ini. Foto asli ada di public/foto.
// Ganti caption, tambah src foto asli, ubah nama, selesai.

export const SITE_TITLE = 'Satu Tahun Kita'

// Nama penerima
export const NAME = 'Sayang'

export const GREETING = {
  title: 'Happy Anniversary',
  subtitle: '26 Oktober 2025 - 26 Oktober 2026',
  body: 'Satu tahun penuh warna. Terima kasih sudah berjalan sejauh ini. Ini baru halaman pertama, ya.',
  button: 'Buka kenangan kita',
}

// Tanggal yang dibungkus sampai jam nol. Boleh ditambah.
export const LOCKED = ['2026-10-26']
export const LOCKED_LABEL = 'Terbungkus rapi, dibuka 26 Oktober 2026.'

// Satu tanggal satu kenangan.
// caption  : satu baris singkat, tampil di header. Kalau kosong, header menulis
//            "Kenangan di tanggal ini." sampai kamu isi.
// note     : paragraf pendek, muncul saat tanggal dipilih (opsional).
// src      : foto di public/foto, tulis 'foto/nama-file.webp' tanpa garis miring
//            di depan, supaya tetap benar di GitHub Pages.
export const MEDIA = {
  '2025-10-26': {
    caption: 'Hari pertama cerita kita.',
    note: 'Hari itu biasa saja di luar, tapi tidak di dalam. Sampai sekarang masih saya simpan rapi.',
    src: 'foto/2025-10-26.webp',
  },
  '2025-11-08': { src: 'foto/2025-11-08.webp' },
  '2025-11-22': { src: 'foto/2025-11-22.webp' },
  '2025-11-30': { src: 'foto/2025-11-30.webp' },
  '2025-12-14': { src: 'foto/2025-12-14.webp' },
  '2025-12-21': { src: 'foto/2025-12-21.webp' },
  '2025-12-28': { src: 'foto/2025-12-28.webp' },
  '2025-12-31': { src: 'foto/2025-12-31.webp' },
  '2026-01-01': { src: 'foto/2026-01-01.webp' },
  '2026-01-10': { src: 'foto/2026-01-10.webp' },
  '2026-01-17': { src: 'foto/2026-01-17.webp' },
  '2026-01-24': { src: 'foto/2026-01-24.webp' },
  '2026-02-01': { src: 'foto/2026-02-01.webp' },
  '2026-02-07': { src: 'foto/2026-02-07.webp' },
  '2026-02-15': { src: 'foto/2026-02-15.webp' },
  '2026-03-01': { src: 'foto/2026-03-01.webp' },
  '2026-03-13': { src: 'foto/2026-03-13.webp' },
  '2026-03-21': { src: 'foto/2026-03-21.webp' },
  '2026-03-22': { src: 'foto/2026-03-22.webp' },
  '2026-03-29': { src: 'foto/2026-03-29.webp' },
  '2026-04-04': { src: 'foto/2026-04-04.webp' },
  '2026-04-06': { src: 'foto/2026-04-06.webp' },
  '2026-04-10': { src: 'foto/2026-04-10.webp' },
  '2026-04-15': { src: 'foto/2026-04-15.webp' },
  '2026-04-19': { src: 'foto/2026-04-19.webp' },
  '2026-04-25': { src: 'foto/2026-04-25.webp' },
  '2026-05-09': { src: 'foto/2026-05-09.webp' },
  '2026-05-15': { src: 'foto/2026-05-15.webp' },
  '2026-05-17': { src: 'foto/2026-05-17.webp' },
  '2026-05-19': { src: 'foto/2026-05-19.webp' },
  '2026-05-30': { src: 'foto/2026-05-30.webp' },
  '2026-06-06': { src: 'foto/2026-06-06.webp' },
  '2026-06-14': { src: 'foto/2026-06-14.webp' },
  '2026-06-20': { src: 'foto/2026-06-20.webp' },
  '2026-07-04': { src: 'foto/2026-07-04.webp' },
  '2026-07-11': { src: 'foto/2026-07-11.webp' },
  '2026-08-09': { src: 'foto/2026-08-09.webp' },
  '2026-08-15': { src: 'foto/2026-08-15.webp' },
  '2026-08-25': { src: 'foto/2026-08-25.webp' },
  '2026-08-29': { src: 'foto/2026-08-29.webp' },
  '2026-09-10': { src: 'foto/2026-09-10.webp' },
  '2026-09-19': { src: 'foto/2026-09-19.webp' },
  '2026-09-27': { src: 'foto/2026-09-27.webp' },
  '2026-10-03': { src: 'foto/2026-10-03.webp' },
  '2026-10-10': { src: 'foto/2026-10-10.webp' },
  '2026-10-17': { src: 'foto/2026-10-17.webp' },
  '2026-10-18': { src: 'foto/2026-10-18.webp' },
  '2026-10-26': {
    caption: 'Setahun. Happy anniversary, cinta.',
    note: 'Setahun, dan saya masih memilih kamu, tiap hari, tanpa ragu.',
  },
}

export const NOTE_TABS = [
  { id: 'fakta', label: 'Fakta kita' },
  { id: 'kuis', label: 'Masih ingat?' },
  { id: 'bubu', label: 'Bubu dudu' },
]

export const mediaOf = (key) => MEDIA[key] ?? null

const photoCount = Object.keys(MEDIA).filter((k) => MEDIA[k].src).length

// Fakta kecil. Angka dan label bebas. Satu kartu = satu fakta.
export const FACTS = [
  { label: 'Video call paling panjang', value: '3 jam' },
  { label: 'Film ditonton bareng', value: '10' },
  { label: 'Kangen paling lama', value: 'Rahasia :)' },
  { label: 'Makanan paling sering dimakan', value: 'Bebek' },
  { label: 'Tempat paling sering dikunjungi', value: 'Masjid As-Sophia' },
  { label: 'Karakter kesukaan', value: 'Bubu dudu' },
  { label: 'Foto di kalender ini', value: photoCount },
  { label: 'Foto di galeri', value: '600+' },
]

// Kuis kecil. answer = indeks jawaban benar (hitung dari 0).
export const QUIZ = [
  {
    q: 'Ada berapa gundam yang dirakit selama setahun ini?',
    options: ['1', '2', '3'],
    answer: 2,
  },
  {
    q: 'Karakter kesukaan kita berdua apa?',
    options: ['Bubu dudu', 'Pusheen', 'Doraemon'],
    answer: 0,
  },
  {
    q: 'Siapa yang paling gembul?',
    options: ['Ghiffary', 'Nadyya', 'Bubu'],
    answer: 1,
  },
]

// Dua stiker dari file gambarmu di public/deco. Untuk menambah, taruh berkasnya
// di sana lalu tambah satu entri dengan src yang sesuai.
export const BUBU_STICKERS = [
  { id: 'jalan', label: 'Versi jalan-jalan', note: 'Kalau sedang keliling, dia yang bawa.', src: 'deco/bubu-jalan.png' },
  { id: 'bisik', label: 'Versi bisik-bisik', note: 'Ada yang dibisikkan, tidak untuk orang lain.', src: 'deco/bubu-bisik.png' },
]
