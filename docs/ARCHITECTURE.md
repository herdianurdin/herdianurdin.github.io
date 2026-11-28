# Arsitektur Proyek

## 1. Gambaran umum

Jurnal IT adalah situs Astro dengan `output: "static"`. Halaman dibuat saat proses build menjadi file HTML, CSS, JavaScript, XML, dan aset statis. Hosting production menggunakan GitHub Pages.

Konfigurasi penting di `astro.config.mjs`:

- `site`: `https://herdianurdin.my.id`
- `output`: `static`
- `trailingSlash`: `always`
- prefetch: `prefetchAll: false`, strategi default `hover`
- Markdown code highlighting: Shiki `dracula`, `wrap: true`
- rehype plugin: external-link attributes, local-image defaults, dan content wrappers
- integrasi MDX
- Tailwind CSS v4 melalui `@tailwindcss/vite`
- `build.inlineStylesheets: "auto"`
- `compressHTML: true`

## 2. Peta repository

```text
.
├── .github/workflows/deploy.yml   # CI dan deploy GitHub Pages
├── public/                        # Aset statis: disalin apa adanya ke dist/
│   ├── assets/
│   │   ├── graphics/              # SVG dekoratif
│   │   └── icons/                 # Ikon favicon/manifest/PWA
│   ├── certificates/              # Dokumen/gambar sertifikat yang ditautkan langsung
│   ├── privacy/                  # Dokumen privasi aplikasi statis
│   ├── favicon.svg
│   ├── manifest.json
│   ├── ads.txt, app-ads.txt, CNAME, robots.txt
│   └── ...
├── scripts/                       # Validator dan build helper
├── src/
│   ├── assets/images/             # Sumber gambar artikel, cover, profil, dan OG
│   ├── components/
│   │   ├── archive/               # ArchivePage dan ArchiveSearch
│   │   ├── article/               # AuthorBox, RelatedArticles, Giscus, TOC
│   │   ├── author/                # AuthorIdentityCard dan SocialLinks
│   │   ├── header/                # Logo dan language switcher
│   │   ├── home/                  # HeroProfile, EditorialHero, Portfolio
│   │   ├── playground/            # Editor, terminal, toolbar, modal
│   │   ├── playgrounds/           # Direktori Playground
│   │   └── ui/                    # ArticleCard dan PaginationNav
│   ├── config/                    # Data situs/i18n dan katalog Playground
│   ├── content/                   # Koleksi artikel id/ dan en/
│   ├── layouts/                   # BaseLayout, BlogLayout, PlaygroundLayout
│   ├── pages/                     # File-based routing Astro
│   ├── styles/global.css
│   └── utils/                     # Helper terkait konten
├── astro.config.mjs
├── tsconfig.json
├── LICENSE.md
├── package.json
└── package-lock.json
```

**Aturan pemilihan lokasi aset:** simpan gambar yang perlu diproses/responsive oleh Astro di `src/assets/images/`. Gunakan `public/` untuk berkas statis yang memerlukan URL tetap, seperti favicon, ikon manifest, SVG dekoratif, atau sertifikat. `public/images/` bukan lagi lokasi aset aktif.

## 3. Routing halaman

Astro menggunakan file-based routing. Route artikel bersifat catch-all agar content ID bersarang juga dapat dirender.

| Sumber | URL publik |
|---|---|
| `src/pages/index.astro` | `/` |
| `src/pages/en/index.astro` | `/en/` |
| `src/pages/blog/[...page].astro` | `/blog/`, `/blog/2/`, ... |
| `src/pages/en/blog/[...page].astro` | `/en/blog/`, `/en/blog/2/`, ... |
| `src/pages/blog/[...slug].astro` | `/blog/<content-id>/` |
| `src/pages/en/blog/[...slug].astro` | `/en/blog/<content-id>/` |
| `src/pages/python-playground.astro` | `/python-playground/` |
| `src/pages/rss.xml.js` | `/rss.xml` |
| `src/pages/sitemap.xml.ts` | `/sitemap.xml` |
| `src/pages/404.astro` | `/404.html` |

`trailingSlash: "always"` membuat route halaman menggunakan slash di akhir. File XML dan file aset tetap memiliki ekstensi.

## 4. Alur konten artikel

1. File Markdown/MDX ditemukan oleh loader `glob` di `src/content.config.ts`.
2. Schema Zod memvalidasi frontmatter.
3. Route `[...slug].astro` mengambil collection yang sesuai dan mengabaikan `isDraft: true`.
4. `render(post)` menghasilkan komponen `Content` dan metadata headings.
5. `BlogLayout.astro` merender metadata SEO, header, judul, daftar isi, konten, FAQ opsional, author box, Giscus, dan footer.
6. Astro menghasilkan static HTML.

## 5. Content collections

Ada dua collection bernama `id` dan `en`, dengan schema sama.

| Field | Type | Syarat |
|---|---|---|
| `title` | string | Wajib |
| `description` | string | Wajib, minimal 10 karakter |
| `pubDate` | Date | Wajib |
| `updatedDate` | Date | Opsional; tidak boleh lebih awal dari `pubDate` |
| `coverImage` | Astro image metadata atau URL string | Opsional; gambar lokal memakai path relatif menuju `src/assets/`, URL remote harus valid |
| `coverImageAlt` | string | Opsional; teks alternatif cover untuk pembaca dan social preview |
| `tags` | string[] | Opsional |
| `isDraft` | boolean | Default `false` |
| `enSlug` | string ID | Opsional; hanya untuk koleksi `id` |
| `idSlug` | string ID | Opsional; hanya untuk koleksi `en` |
| `faq` | `{ q: string, a: string }[]` | Opsional |

Content ID harus berupa lowercase kebab-case; dapat berupa segmen path yang dipisahkan `/`. Nama file relatif terhadap folder bahasa menjadi ID. Contoh `src/content/id/bab/python-dasar.md` akan memiliki ID `bab/python-dasar`.

## 6. Pipeline aset gambar

- Sumber gambar editorial berada di `src/assets/images/`, bukan `public/images/`.
- `coverImage` pada frontmatter diselesaikan relatif terhadap file Markdown oleh Astro Content Collections melalui helper `image()` pada `src/content.config.ts`. URL remote tetap didukung melalui `z.url()`.
- Markdown images menggunakan path relatif ke `src/assets/`; validator `check-responsive-images.mjs` memastikan referensi lokal berada di dalam direktori aset dan file-nya tersedia.
- `astro.config.mjs` memakai constrained image layout, responsive styles, dan breakpoint Markdown `[480, 800, 1440]`.
- Cover pada `BlogLayout.astro` dan `ArticleCard.astro` memakai Astro `Image`, WebP, widths `[480, 800, 1200]`, dan quality 80. Komponen profil memakai kelompok width yang disesuaikan dengan ukuran tampil.
- Default social preview berasal dari `src/assets/images/og-default.webp` dan diproses oleh `getImage()` di `SeoHead.astro` menjadi WebP 1200×630.
- `public/assets/icons/`, `public/assets/graphics/`, dan `public/certificates/` berisi file statis yang tidak melalui pipeline transform Astro.

Path gambar di artikel harus relatif terhadap file `.md`/`.mdx`. Untuk artikel root di `src/content/id/` atau `src/content/en/`, contoh path-nya adalah `../../assets/images/nama-gambar.webp`. Untuk file artikel bersarang, sesuaikan jumlah `../`.

## 7. Relasi terjemahan

Terjemahan tidak diwajibkan untuk setiap artikel. Bila relasi dibuat, pasangan harus timbal balik:

- Artikel Indonesia memakai `enSlug` yang menunjuk content ID Inggris.
- Artikel Inggris memakai `idSlug` yang menunjuk content ID Indonesia.
- Kedua artikel harus memiliki status `isDraft` yang sama.
- Satu target tidak boleh dipasangkan ke beberapa artikel sumber.

Contoh: `src/content/id/belajar-astro.md` dengan `enSlug: "learning-astro"` harus mempunyai file `src/content/en/learning-astro.md` dengan `idSlug: "belajar-astro"`.

Validasi dilakukan oleh `scripts/check-content-relations.mjs`.

## 8. Layout dan komponen

### BaseLayout

Layout umum untuk halaman utama, arsip, profil, dan halaman legal. Memuat font, global CSS, SEO head, header, slot halaman, dan footer. Props utama: `title`, `description`, `language`, `headerVariant`, `noindex`.

### BlogLayout

Layout artikel. Menerima `frontmatter`, `language`, dan `headings`. Mengatur cover, judul, tanggal publikasi/pembaruan, tags, Table of Contents, Markdown body, FAQ, AuthorBox, Giscus, serta script tambahan untuk tabel dan YouTube facade.

### PlaygroundLayout

Layout khusus Python Playground dengan viewport `h-dvh`, skip link menuju heading playground, dan main container fleksibel.

### ArticleCard dan ArchivePage

`ArticleCard` digunakan di homepage dan arsip. `ArchivePage` mengelola presentasi halaman arsip dengan pagination berbahasa sesuai collection. Jumlah artikel per halaman berasal dari `siteConfig.maxPosts` (saat ini 4).

## 9. SEO, RSS, dan sitemap

`SeoHead.astro` menangani canonical, hreflang, Open Graph, Twitter Card, metadata artikel, JSON-LD Person/ProfilePage/BlogPosting, favicon, manifest, dan AdSense loader.

RSS menggabungkan artikel ID dan EN yang bukan draft. Sitemap disusun dari daftar halaman statis dan seluruh artikel terbit. Halaman arsip sengaja `noindex` dan tidak masuk sitemap.

## 10. Integrasi eksternal

- Giscus: komentar/diskusi artikel. Konfigurasi repository/category berada di `src/config/site.ts`.
- AdSense: loader dibuat di `SeoHead.astro` dan dimuat setelah interaksi (scroll/mouse/touch) atau timeout 5 detik; halaman legal tertentu tidak menampilkan ads.
- YouTube: `.youtube-defer` memakai facade dan memuat iframe setelah interaksi; jangan menyisipkan iframe YouTube langsung untuk konten biasa.
- Python Playground: CodeMirror 5.65.16 dan Skulpt 1.2.0 melalui CDN; implementasi interaksi di `src/scripts/python-playground.js`.

## 11. Sumber perubahan

Saat menambah atau mengubah perilaku, periksa sekaligus route, komponen, metadata, validator, dan contoh artikel. Jangan menyimpulkan route atau field hanya dari nama file—periksa schema dan `getStaticPaths` aktual.

## 12. Konfigurasi TypeScript

`tsconfig.json` mewarisi `astro/tsconfigs/strict` dan saat ini menambahkan dua opsi JSX:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "astro"
  }
}
```

Konfigurasi strict adalah baseline pemeriksaan tipe. `jsx: "preserve"` membiarkan JSX diproses oleh toolchain Astro, sedangkan `jsxImportSource: "astro"` mengarahkan tipe JSX ke integrasi Astro. Perubahan konfigurasi harus diuji dengan `npx astro check` dan `npm run build`. Rincian praktik pengembangan ada di [DEVELOPMENT.md](DEVELOPMENT.md#konfigurasi-typescript).

## 13. Lisensi dan kepemilikan

Repository menggunakan notice proprietary `LICENSE.md`. Notice ini berlaku untuk materi yang dimiliki pemegang hak cipta; dependency, library, font, merek, atau aset pihak ketiga tidak otomatis menjadi milik pemegang hak cipta dan tetap tunduk pada lisensi asalnya. Lihat [LICENSING.md](LICENSING.md) untuk batasan repository publik GitHub.
