# Jurnal IT — Herdi Herdianurdin

[![Deploy to GitHub Pages](https://github.com/herdianurdin/herdianurdin.github.io/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/herdianurdin/herdianurdin.github.io/actions/workflows/deploy.yml)

**Jurnal IT** adalah situs jurnal teknis dan portofolio pribadi yang membahas rekayasa perangkat lunak, pengembangan Android, arsitektur kode, pembelajaran pemrograman, serta pengalaman pengembangan produk digital.

- **Produksi:** <https://herdianurdin.my.id>
- **Repository:** <https://github.com/herdianurdin/herdianurdin.github.io>
- **Stack utama:** Astro (static output), TypeScript, Tailwind CSS v4, Markdown/MDX
- **Lisensi:** Proprietary — All Rights Reserved; penggunaan ulang memerlukan izin tertulis pemilik (lihat [`LICENSE.md`](LICENSE.md)).
- **Deployment:** GitHub Pages melalui GitHub Actions
- **Bahasa konten:** Indonesia (`id`) dan Inggris (`en`)

Dokumentasi teknis terperinci tersedia di folder [`docs/`](docs/README.md).

## Fitur

- Static Site Generation (SSG) untuk halaman utama, arsip, artikel, halaman profil/legal, RSS, dan sitemap.
- Dua koleksi konten terpisah: `src/content/id/` dan `src/content/en/`.
- Relasi artikel terjemahan opsional dengan validasi dua arah (`enSlug` / `idSlug`).
- Draft artikel yang tidak dirender ke halaman publik.
- UI neo-brutalist dengan design tokens Tailwind CSS v4.
- Syntax highlighting Shiki tema Dracula.
- SEO metadata: canonical, hreflang, Open Graph, Twitter Card, dan JSON-LD.
- Giscus untuk diskusi yang dimuat sesuai interaksi.
- Python Playground menggunakan CodeMirror dan Skulpt dari CDN.
- Validator otomatis untuk relasi konten, tautan internal, design tokens, UI baseline, layout, katalog Playground, Markdown wrappers, related articles, social profiles, author cards, responsive images, Sharp image service, SEO, metadata, structured data, aset gambar, dan on-page.

## Konfigurasi TypeScript

Konfigurasi `tsconfig.json` mewarisi preset strict milik Astro dan menetapkan opsi JSX yang dibutuhkan integrasi Astro:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "astro"
  }
}
```

Jangan mengganti preset strict atau melonggarkan pemeriksaan tipe hanya untuk menghilangkan error. Lihat [Development & scripts](docs/DEVELOPMENT.md#konfigurasi-typescript) untuk penjelasan.

## Prasyarat

Gunakan Node.js **24.x** dan npm. Versi Node yang dipakai workflow CI adalah 24. Dependency dipasang dari lockfile.

```bash
node --version
npm --version
npm ci
```

Jangan menghapus atau mengabaikan `package-lock.json`. CI memakai `npm ci`, sehingga lockfile harus ikut dilacak oleh Git dan konsisten dengan `package.json`.

## Menjalankan secara lokal

```bash
npm run dev
```

Astro dev server berjalan pada `http://localhost:4321/`.

Build dan seluruh validasi:

```bash
npm run build
```

Preview hasil static build:

```bash
npm run preview
```

Perintah validator dapat dijalankan secara terpisah. Daftar perintah dan fungsi masing-masing ada di [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Aset gambar

Gambar artikel, cover, dan gambar profil yang perlu diproses Astro disimpan di `src/assets/images/`. Untuk artikel di root koleksi (`src/content/id/` atau `src/content/en/`), gunakan path relatif dari file Markdown, misalnya `../../assets/images/nama-gambar.webp`. Artikel di subfolder harus menyesuaikan jumlah segmen `../`.

Aset yang harus disalin sebagai file statis dan diakses melalui URL tetap—misalnya favicon, ikon manifest/PWA, ilustrasi dekoratif SVG, dan sertifikat unduhan—disimpan di `public/` pada folder sesuai fungsinya (`public/assets/icons/`, `public/assets/graphics/`, atau `public/certificates/`). Jangan menyimpan cover atau ilustrasi artikel baru di `public/images/`; direktori tersebut sudah dihapus dari struktur aktif.

## Membuat artikel

Artikel ditulis manual sebagai Markdown (`.md`) atau MDX (`.mdx`) di koleksi bahasa yang sesuai:

```text
src/content/id/nama-artikel-kebab-case.md
src/content/en/article-name-kebab-case.md
```

Nama file menjadi content ID dan bagian slug URL. Contoh:

```text
src/content/id/cara-kerja-komputer.md
→ https://herdianurdin.my.id/blog/cara-kerja-komputer/

src/content/en/how-computers-work.md
→ https://herdianurdin.my.id/en/blog/how-computers-work/
```

Sebelum menerbitkan, ikuti [Panduan Penulisan Artikel](docs/ARTICLES.md) dan gunakan [template frontmatter](docs/examples/article-template.id.md). Skema metadata resmi didefinisikan di `src/content.config.ts`.

## Dokumentasi

| Dokumen | Isi |
|---|---|
| [Peta dokumentasi](docs/README.md) | Indeks semua dokumentasi |
| [Lisensi & batas penggunaan](docs/LICENSING.md) | Ketentuan proprietary, izin penggunaan, dan batasan repository publik |
| [Arsitektur proyek](docs/ARCHITECTURE.md) | Struktur folder, routing, content collections, rendering, integrasi |
| [Design system](docs/DESIGN_SYSTEM.md) | Warna, tipografi, shadow, komponen, Markdown styling, aksesibilitas |
| [Panduan artikel](docs/ARTICLES.md) | Cara membuat artikel dari awal sampai publikasi |
| [SEO & metadata](docs/SEO.md) | Canonical, hreflang, social metadata, JSON-LD, sitemap, RSS |
| [Development & scripts](docs/DEVELOPMENT.md) | Setup, scripts, validasi, build, troubleshooting |
| [Deployment](docs/DEPLOYMENT.md) | GitHub Actions, permissions, branch, release |
| [Contoh artikel ID](docs/examples/sample-article.id.md) | Contoh artikel lengkap dengan isi |
| [Contoh artikel EN](docs/examples/sample-article.en.md) | Contoh artikel Inggris dan relasi terjemahan |
| [Contoh frontmatter minimal](docs/examples/article-template.id.md) | Template siap salin |

## Alur kontribusi ringkas

1. Buat branch kerja dari `main`.
2. Buat atau edit artikel di `src/content/id/` atau `src/content/en/`.
3. Simpan gambar artikel di `src/assets/images/`; referensikan secara relatif dari file Markdown/frontmatter. Simpan hanya aset statis ber-URL tetap di subfolder `public/` yang sesuai.
4. Jalankan `npm run build`.
5. Periksa hasil menggunakan `npm run preview`.
6. Periksa perubahan Git, lalu commit dan push ke branch kerja atau `main` sesuai strategi rilis.
7. Merge/push ke `main` akan memicu workflow GitHub Pages.

## Lisensi dan penggunaan konten

Repository ini menggunakan ketentuan **Proprietary — All Rights Reserved**, bukan lisensi open source. Penggunaan ulang, penyalinan independen, modifikasi, distribusi, penerbitan, hosting, atau deployment materi milik proyek memerlukan izin tertulis terlebih dahulu dari pemegang hak cipta. Baca [`LICENSE.md`](LICENSE.md) dan [penjelasan lisensi](docs/LICENSING.md).

**Catatan repository publik:** GitHub tetap memberikan hak kepada pengguna untuk melihat dan melakukan fork repository publik di dalam layanan GitHub sesuai Terms of Service. Lisensi ini tidak mengklaim dapat menonaktifkan fitur tersebut. Apabila pemilik ingin membatasi akses dan fork publik, repository perlu diubah menjadi private.

Materi pihak ketiga (termasuk dependency npm, font, library, gambar, merek, dan cuplikan yang bukan milik pemilik repository) tetap tunduk pada lisensi atau ketentuan pemilik aslinya.
