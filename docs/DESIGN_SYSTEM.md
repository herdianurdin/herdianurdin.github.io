# Design System Jurnal IT

## 1. Prinsip visual

Jurnal IT menggunakan pendekatan **neo-brutalism**: bidang hitam/gelap yang kontras, garis tepi tebal, aksen lime/cyan/fuchsia, font sans yang tegas, font monospace untuk metadata/label teknis, serta hard shadow tanpa blur. Sistem harus tetap mudah dibaca; estetika tidak boleh mengalahkan keterbacaan, akses keyboard, atau responsivitas.

Dokumen ini mendeskripsikan token yang saat ini didefinisikan di `src/styles/global.css`. Bila menambah token, ubah sumber token dan validator terkait—jangan menyebar nilai warna brand langsung ke komponen.

## 2. Warna

Token warna utama berada di blok `@theme` Tailwind CSS v4.

| Token | Nilai | Penggunaan umum |
|---|---|---|
| `brand-lime` | `#c6ff00` | Aksen utama, tombol penting, highlight, selection |
| `brand-cyan` | `#00e5ff` | Aksen sekunder, hover, garis progres |
| `brand-fuchsia` | `#d946ef` | Aksen dekoratif dan label |
| `brand-danger` | `#ff0055` | Error/peringatan visual |
| `editor` | `#282a36` | Permukaan editor |
| `editor-panel` | `#1e1e1e` | Panel editor |
| `editor-gutter` | `#444` | Gutter CodeMirror |

Warna netral yang sering digunakan melalui utility Tailwind:

- `bg-black`, `text-black`, `border-black`
- `bg-neutral-900` untuk latar halaman
- `bg-neutral-800` untuk kartu/permukaan konten
- `text-neutral-400` untuk metadata sekunder
- `text-white`, `border-white` untuk teks dan garis utama

Jangan hardcode nilai warna brand di arbitrary utility (`bg-[#...]`, `shadow-[...]`). `npm run check:design-tokens` memeriksa pemakaian warna brand dan token shadow.

## 3. Tipografi

Font yang diimpor oleh layout:

- **Inter**: 400, 700, 900; dipakai untuk body dan judul.
- **Fira Code**: 400, 700; dipakai untuk metadata, label teknis, dan kode.

Token:

```css
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
--font-mono: "Fira Code", ui-monospace, SFMono-Regular, monospace;
```

Praktik:

- Judul utama artikel memakai H1 otomatis dari `BlogLayout`; jangan menambahkan H1 kedua di Markdown.
- Gunakan H2 untuk bagian besar dan H3 untuk subbagian. Daftar Isi saat ini hanya mengambil depth 2 dan 3.
- Metadata tanggal/tag/label umumnya memakai `font-mono`.
- Gunakan `leading-relaxed` untuk paragraf panjang dan hindari baris teks terlalu lebar.

## 4. Neo-brutalist shadow tokens

Semua shadow memakai offset keras dan tanpa blur. Nama token mengikuti pola `shadow-neo-{accent}-{offset}`.

| Keluarga | Offset tersedia |
|---|---|
| `neo-cyan` | 4, 6, 8, 10, 12, 16 |
| `neo-lime` | 2, 4, 6, 8, 12 |
| `neo-fuchsia` | 2, 4, 8, 12 |
| `neo-danger` | 8 |
| `neo-paper` | 1, 2, 4, 6 |
| `neo-ink` | 2, 4 |

Contoh:

```html
<div class="border-4 border-white shadow-neo-cyan-8">...</div>
<button class="shadow-neo-lime-6 hover:shadow-neo-cyan-6">...</button>
```

Gunakan token terdekat yang sesuai skala komponen. Jangan menambah nilai baru hanya karena satu komponen membutuhkan offset unik; evaluasi apakah pola tersebut akan dipakai ulang.

## 5. Pola komponen

### Kartu artikel

Komponen sumber: `src/components/ui/ArticleCard.astro`.

- Kartu dibungkus `<article>`.
- Border putih 4 px dan latar hitam.
- Hover mengangkat kartu dan menampilkan shadow lime.
- Cover berupa tautan dekoratif yang dihilangkan dari accessibility tree; ada tautan judul dan tindakan baca yang memiliki nama aksesibel.
- Cover memakai rasio 1200:630, `loading="lazy"`, `decoding="async"`, dan alt kosong karena bersifat dekoratif pada kartu.

### Artikel

Komponen sumber: `src/layouts/BlogLayout.astro`.

- Main content maksimal `max-w-4xl`.
- Permukaan artikel `bg-neutral-800`, border putih 4 px, shadow lime.
- Cover artikel memakai alt deskriptif `Ilustrasi: <judul>`, eager loading, fetch priority high, dan dimensi 1200x630.
- H1 dibuat dari `frontmatter.title`.
- TOC hanya menampilkan H2/H3.
- `.prose` mengatur konten Markdown.

### Tabel

Styling global `.prose table`, `thead`, `th`, `tbody tr`, dan `td` membuat tabel menjadi tabel kontras dengan header lime, border 4 px, dan baris gelap. `BlogLayout` membungkus tabel ke `.overflow-x-auto` untuk layar sempit.

### Kode

Shiki memakai tema Dracula dan `wrap: true`. Blok `pre.astro-code` diberi padding, border putih 4 px, shadow cyan, dan margin vertikal. Gunakan fenced code block dengan info string bahasa.

### Navigasi dan aksesibilitas

- Layout umum memiliki skip link lokal ke `#main-content`.
- Playground mempunyai skip link tersendiri ke `#playground-heading`.
- Focus-visible memakai outline lime 3 px dengan offset 3 px.
- `prefers-reduced-motion: reduce` menonaktifkan smooth scrolling dan meminimalkan animasi/transition.
- Indikator baca artikel menggunakan role progressbar dan `aria-valuenow`.

## 6. Markdown rendering

Gaya khusus berlaku pada elemen di `.prose`. Penulis cukup memakai Markdown standar untuk heading, paragraf, daftar, blockquote, tabel, gambar, dan fenced code block. Hindari HTML/CSS inline kecuali fitur memang memerlukannya (misalnya YouTube facade).

## 7. Gambar

- Simpan gambar lokal artikel di `public/images/`.
- Referensikan dengan path absolut dari root situs: `/images/nama-file.webp`.
- Gunakan rasio cover 1200×630 (1.905:1) agar konsisten dengan layout dan Open Graph.
- Pilih WebP untuk gambar raster bila sesuai dan kompres aset secara wajar.
- Plugin `scripts/rehype-local-image-attributes.mjs` memberikan default `loading="lazy"`, `decoding="async"` dan membaca dimensi intrinsik gambar lokal yang dapat diparse.
- Atribut otomatis hanya berlaku untuk gambar lokal yang path-nya dapat diselesaikan ke folder `public`. Gambar eksternal tidak memperoleh dimensi dari plugin ini.
- Berikan alt yang menjelaskan gambar bermakna. Alt kosong hanya untuk gambar dekoratif yang konteksnya sudah tersedia lewat teks lain.

## 8. Perubahan design system

1. Edit token di `src/styles/global.css`.
2. Gunakan nama utility hasil token Tailwind v4 pada komponen.
3. Jalankan `npm run check:design-tokens`.
4. Jalankan `npm run build`.
5. Periksa halaman utama, artikel, arsip, halaman legal, dan Playground di desktop/mobile.
6. Periksa focus state, reduced motion, kontras, dan tabel yang dapat digulir.

Jangan melakukan redesign besar melalui perubahan token tanpa menguji komponen yang menggunakan token itu.
