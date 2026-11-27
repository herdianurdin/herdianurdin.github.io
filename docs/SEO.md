# SEO, Metadata, dan Distribusi Konten

## 1. Komponen pemilik metadata

Sumber utama: `src/components/SeoHead.astro`.

Props yang relevan:

- `title`, `description`
- `image`, `imageAlt`
- `isArticle`
- `language: "id" | "en"`
- `enSlug`, `idSlug`
- `languageAlternate`
- `pubDate`, `updatedDate`
- `noindex`

Artikel menggunakan `BlogLayout`, yang meneruskan metadata dari frontmatter dan menandai `isArticle=true`.

## 2. Canonical

Canonical dibentuk dari `Astro.url.pathname`, dinormalisasi dengan trailing slash (root tetap `/`), dan origin dari `Astro.site`.

Pedoman penulis:

- Jangan mengisi URL lengkap untuk canonical di frontmatter.
- Jangan menambahkan canonical manual dalam Markdown.
- Jangan mengubah nama file artikel setelah publikasi tanpa rencana redirect/migrasi; nama file menentukan URL.
- Tautan internal harus memakai route canonical dengan trailing slash.

## 3. Hreflang

Pada artikel, `hreflang` alternatif hanya dibuat jika `enSlug` atau `idSlug` disediakan. Relasi terjemahan harus timbal balik menurut `check-content-relations.mjs`.

Halaman statis memakai `languageAlternate` default untuk jalur yang punya versi bahasa sepadan. Halaman Playground menonaktifkan alternate karena tidak punya route bahasa kedua.

Jangan membuat relasi terjemahan yang targetnya belum ada. Artikel tanpa versi terjemahan adalah kondisi yang sah.

## 4. Open Graph dan Twitter Card

`SeoHead.astro` membuat:

- `og:type` (`article` untuk artikel, `website` untuk halaman biasa),
- `og:url`, `og:title`, `og:description`, `og:image`, `og:image:alt`, `og:site_name`, `og:locale`,
- `og:locale:alternate` jika relevan,
- Twitter Card `summary_large_image` dan URL/title/description/image.

Artikel memakai `coverImage`; jika tidak ada, default `/images/og-default.webp`.

Rekomendasi editorial:

- Buat cover yang sesuai dengan isi, bukan hanya dekorasi.
- Gunakan komposisi yang masih terbaca saat dipotong pada preview kecil.
- Jangan menaruh teks penting terlalu dekat tepi gambar.
- Gunakan alt yang menjelaskan gambar untuk konteks pembaca.

## 5. JSON-LD

SeoHead menghasilkan:

- `Person` untuk penulis.
- `ProfilePage` untuk halaman profil.
- `BlogPosting` untuk artikel.

BlogPosting menggunakan title, description, image, author, canonical page, `datePublished`, `dateModified` bila tersedia, dan `inLanguage`.

Nilai JSON-LD diserialisasi dengan pengamanan karakter `<`, `>`, `&` agar teks konten tidak dapat menutup script JSON-LD secara prematur.

Penulis tidak perlu menulis JSON-LD manual. Pastikan frontmatter akurat.

## 6. Robots dan sitemap

- `robots.txt` menunjuk sitemap.
- `/sitemap.xml` dihasilkan oleh `src/pages/sitemap.xml.ts`.
- Sitemap mencakup daftar halaman statis dan artikel terbit dari dua collection.
- Archive pages sengaja `noindex` dan tidak dimasukkan ke sitemap.
- `lastmod` hanya dimasukkan jika `updatedDate` disediakan.

Jangan menambahkan URL arsip yang noindex ke sitemap.

## 7. RSS

`src/pages/rss.xml.js` menggabungkan artikel Indonesia dan Inggris yang bukan draft, mengurutkan berdasarkan `pubDate` menurun, lalu membuat item dengan title, pubDate, description, dan link route bahasa.

## 8. Validator SEO

| Script | Yang diperiksa |
|---|---|
| `check-seo.mjs` | robots sitemap, sitemap URLs, canonical, noindex, trailing slash, hreflang dan reciprocal links |
| `check-route-links.mjs` | Link internal ke route yang canonical |
| `check-page-metadata.mjs` | Title dan description non-empty serta unik |
| `check-social-meta.mjs` | Metadata social pada halaman sitemap |
| `check-structured-data.mjs` | JSON-LD dan BlogPosting |
| `check-onpage.mjs` | Heading kosong, accessible link names, generic anchors, heading jumps |
| `check-production-seo.mjs` | Smoke test live site: HTTP, sitemap, metadata, BlogPosting, preview images, 404 |

## 9. Menjalankan pemeriksaan live secara terpisah

```bash
npm run check:production-seo
```

Environment variable yang didukung script:

```bash
SEO_BASE_URL=https://herdianurdin.my.id
SEO_TIMEOUT_MS=15000
SEO_CONCURRENCY=5
```

Script production SEO memeriksa halaman yang tercantum di sitemap dan memeriksa status 404 untuk URL yang tidak dikenal. Jangan jalankan pemeriksaan ini terhadap production ketika sedang melakukan eksperimen yang sengaja mengubah situs live tanpa memahami dampaknya.
