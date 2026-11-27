# Arsitektur Proyek

## 1. Gambaran umum

Jurnal IT adalah situs Astro dengan `output: "static"`. Halaman dibuat saat proses build menjadi file HTML, CSS, JavaScript, XML, dan aset statis. Hosting production menggunakan GitHub Pages.

Konfigurasi penting di `astro.config.mjs`:

- `site`: `https://herdianurdin.my.id`
- `output`: `static`
- `trailingSlash`: `always`
- prefetch: `prefetchAll: false`, strategi default `hover`
- Markdown code highlighting: Shiki `dracula`, `wrap: true`
- rehype plugin: external links dan atribut gambar lokal
- integrasi MDX
- Tailwind CSS v4 melalui `@tailwindcss/vite`
- `build.inlineStylesheets: "auto"`
- `compressHTML: true`

## 2. Peta repository

```text
.
├── .github/workflows/deploy.yml  # CI dan deploy GitHub Pages
├── public/                       # File statis yang disalin apa adanya
│   ├── images/                   # Sampul artikel, ilustrasi, ikon
│   ├── privacy/                  # Dokumen privasi aplikasi statis
│   ├── ads.txt
│   ├── app-ads.txt
│   ├── CNAME
│   ├── manifest.json
│   └── robots.txt
├── scripts/                      # Validator dan build helper
├── src/
│   ├── components/
│   │   ├── archive/               # ArchivePage
│   │   ├── article/               # AuthorBox, Giscus, TableOfContents
│   │   ├── header/                # Logo dan language switcher
│   │   ├── home/                  # HeroProfile dan Portfolio
│   │   ├── playground/            # Editor, terminal, toolbar, modal
│   │   └── ui/                    # ArticleCard dan PaginationNav
│   ├── config/site.ts             # Data situs dan terjemahan UI
│   ├── content/
│   │   ├── id/                    # Artikel bahasa Indonesia
│   │   └── en/                    # Artikel bahasa Inggris
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── BlogLayout.astro
│   │   └── PlaygroundLayout.astro
│   ├── pages/                     # File-based routing Astro
│   ├── scripts/python-playground.js
│   └── styles/global.css
├── astro.config.mjs
├── tsconfig.json                 # Astro strict TypeScript + JSX options
├── LICENSE.md                    # Proprietary / All Rights Reserved
├── package.json
└── package-lock.json
```

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
| `coverImage` | string | Opsional |
| `tags` | string[] | Opsional |
| `isDraft` | boolean | Default `false` |
| `enSlug` | string ID | Opsional; hanya untuk koleksi `id` |
| `idSlug` | string ID | Opsional; hanya untuk koleksi `en` |
| `faq` | `{ q: string, a: string }[]` | Opsional |

Content ID harus berupa lowercase kebab-case; dapat berupa segmen path yang dipisahkan `/`. Nama file relatif terhadap folder bahasa menjadi ID. Contoh `src/content/id/bab/python-dasar.md` akan memiliki ID `bab/python-dasar`.

## 6. Relasi terjemahan

Terjemahan tidak diwajibkan untuk setiap artikel. Bila relasi dibuat, pasangan harus timbal balik:

- Artikel Indonesia memakai `enSlug` yang menunjuk content ID Inggris.
- Artikel Inggris memakai `idSlug` yang menunjuk content ID Indonesia.
- Kedua artikel harus memiliki status `isDraft` yang sama.
- Satu target tidak boleh dipasangkan ke beberapa artikel sumber.

Contoh: `src/content/id/belajar-astro.md` dengan `enSlug: "learning-astro"` harus mempunyai file `src/content/en/learning-astro.md` dengan `idSlug: "belajar-astro"`.

Validasi dilakukan oleh `scripts/check-content-relations.mjs`.

## 7. Layout dan komponen

### BaseLayout

Layout umum untuk halaman utama, arsip, profil, dan halaman legal. Memuat font, global CSS, SEO head, header, slot halaman, dan footer. Props utama: `title`, `description`, `language`, `headerVariant`, `noindex`.

### BlogLayout

Layout artikel. Menerima `frontmatter`, `language`, dan `headings`. Mengatur cover, judul, tanggal publikasi/pembaruan, tags, Table of Contents, Markdown body, FAQ, AuthorBox, Giscus, serta script tambahan untuk tabel dan YouTube facade.

### PlaygroundLayout

Layout khusus Python Playground dengan viewport `h-dvh`, skip link menuju heading playground, dan main container fleksibel.

### ArticleCard dan ArchivePage

`ArticleCard` digunakan di homepage dan arsip. `ArchivePage` mengelola presentasi halaman arsip dengan pagination berbahasa sesuai collection. Jumlah artikel per halaman berasal dari `siteConfig.maxPosts` (saat ini 4).

## 8. SEO, RSS, dan sitemap

`SeoHead.astro` menangani canonical, hreflang, Open Graph, Twitter Card, metadata artikel, JSON-LD Person/ProfilePage/BlogPosting, favicon, manifest, dan AdSense loader.

RSS menggabungkan artikel ID dan EN yang bukan draft. Sitemap disusun dari daftar halaman statis dan seluruh artikel terbit. Halaman arsip sengaja `noindex` dan tidak masuk sitemap.

## 9. Integrasi eksternal

- Giscus: komentar/diskusi artikel. Konfigurasi repository/category berada di `src/config/site.ts`.
- AdSense: loader dibuat di `SeoHead.astro` dan dimuat setelah interaksi (scroll/mouse/touch) atau timeout 5 detik; halaman legal tertentu tidak menampilkan ads.
- YouTube: `.youtube-defer` memakai facade dan memuat iframe setelah interaksi; jangan menyisipkan iframe YouTube langsung untuk konten biasa.
- Python Playground: CodeMirror 5.65.16 dan Skulpt 1.2.0 melalui CDN; implementasi interaksi di `src/scripts/python-playground.js`.

## 10. Sumber perubahan

Saat menambah atau mengubah perilaku, periksa sekaligus route, komponen, metadata, validator, dan contoh artikel. Jangan menyimpulkan route atau field hanya dari nama file—periksa schema dan `getStaticPaths` aktual.

## 11. Konfigurasi TypeScript

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

## 12. Lisensi dan kepemilikan

Repository menggunakan notice proprietary `LICENSE.md`. Notice ini berlaku untuk materi yang dimiliki pemegang hak cipta; dependency, library, font, merek, atau aset pihak ketiga tidak otomatis menjadi milik pemegang hak cipta dan tetap tunduk pada lisensi asalnya. Lihat [LICENSING.md](LICENSING.md) untuk batasan repository publik GitHub.
