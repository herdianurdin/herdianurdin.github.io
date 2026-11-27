# Dokumentasi Teknis Jurnal IT

Dokumentasi ini ditulis berdasarkan struktur dan implementasi repository `herdianurdin/herdianurdin.github.io` pada branch `main`, commit `efddaefc8cec1b6852b3e91e29faaab3bf0f79a3` yang diaudit saat penyusunan.

## Mulai dari sini

- Baru ingin memahami proyek? Baca [Arsitektur Proyek](ARCHITECTURE.md).
- Ingin menulis artikel? Ikuti [Panduan Artikel](ARTICLES.md), lalu salin [template](examples/article-template.id.md).
- Ingin mengubah warna, font, shadow, atau komponen? Baca [Design System](DESIGN_SYSTEM.md).
- Ingin menguji atau menjalankan proyek? Baca [Development](DEVELOPMENT.md).
- Ingin memahami metadata pencarian dan social share? Baca [SEO](SEO.md).
- Ingin memahami proses publish? Baca [Deployment](DEPLOYMENT.md).
- Ingin memahami hak penggunaan dan izin? Baca [Lisensi](LICENSING.md) dan `LICENSE.md` di root repository.

## Dokumen

| File | Pembaca | Isi |
|---|---|---|
| `ARCHITECTURE.md` | Developer | Struktur repo dan alur rendering |
| `DESIGN_SYSTEM.md` | Developer/designer | Fondasi visual, token, komponen |
| `ARTICLES.md` | Penulis/editor | Proses penulisan manual dan publikasi |
| `SEO.md` | Penulis/developer | Metadata, canonical, hreflang, JSON-LD |
| `DEVELOPMENT.md` | Developer | Instalasi, scripts, build, debugging |
| `DEPLOYMENT.md` | Maintainer | GitHub Actions dan GitHub Pages |
| `LICENSING.md` | Pemilik/developer | Penjelasan proprietary notice dan batasan repository publik |
| `examples/` | Penulis | Template dan contoh artikel |

## Sumber kebenaran

Dokumentasi menjelaskan perilaku yang saat ini ditemukan pada source. Jika ada perbedaan, source berikut adalah sumber kebenaran:

- Schema konten: `src/content.config.ts`
- Konfigurasi Astro: `astro.config.mjs`
- Token dan styling global: `src/styles/global.css`
- Konfigurasi situs/i18n: `src/config/site.ts`
- Layout artikel: `src/layouts/BlogLayout.astro`
- Metadata SEO: `src/components/SeoHead.astro`
- Route artikel: `src/pages/blog/[...slug].astro` dan `src/pages/en/blog/[...slug].astro`
- Validator: `scripts/*.mjs`
- TypeScript: `tsconfig.json`
- Lisensi: `LICENSE.md` dan `docs/LICENSING.md`
- CI/CD: `.github/workflows/deploy.yml`

## Batasan dokumentasi

Dokumentasi ini tidak mengklaim semua dependensi eksternal, CDN, atau layanan pihak ketiga selalu tersedia. Perilaku tersebut bergantung pada layanan upstream dan konfigurasi masing-masing.
